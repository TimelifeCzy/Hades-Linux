mod eguard_skel {
    include!("../bpf/eguard.skel.rs");
}
use crate::config::config::*;
use libbpf_rs::skel::{SkelBuilder, OpenSkel};
use log::*;
use sdk::{Record, Payload};
use coarsetime::Clock;
use lazy_static::lazy_static;

use super::event::TX;
use super::BpfProgram;
use anyhow::{bail, Context, Result};
use core::time::Duration;
use std::cell::RefCell;
use std::collections::HashMap;
use std::os::fd::AsFd;
use eguard_skel::*;
use libbpf_rs::{MapFlags, PerfBufferBuilder, TcHook, TcHookBuilder, TC_EGRESS};
use plain::Plain;
use std::net::Ipv6Addr;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::thread::{self, spawn};

#[cfg(feature = "debug")]
use std::fs;

lazy_static! {
    static ref TC_EVENT_HASH_MAP: Mutex<HashMap<&'static [u8], &'static [u8]>> = {
        let m = HashMap::new();
        Mutex::new(m)
    };
}

pub const EVENT_EGRESS: &str = "egress";

#[derive(Default)]
pub struct TcEvent<'a> {
    if_name: String,
    if_idx: i32,
    skel: RefCell<Option<EguardSkel<'a>>>, // skel and hook
    tchook: Option<TcHook>,
    thread_handle: Option<thread::JoinHandle<()>>,
    running: Arc<Mutex<bool>>,
    status: AtomicBool,
}

unsafe impl Plain for eguard_bss_types::net_packet {}

impl<'a> TcEvent<'a> {
    pub fn new() -> Self {
        TcEvent::default()
    }

    // set the net interface
    pub fn set_if(&mut self, name: &str) -> Result<()> {
        self.if_name = name.to_owned();
        self.if_idx = nix::net::if_::if_nametoindex(name)? as i32;
        Ok(())
    }

    fn exit_thread(&mut self) {
        if let Some(thread) = self.thread_handle.take() {
            *self.running.lock().unwrap() = false;
            thread.join().ok();
        }
    }

    // event handlers
    fn handle_event(_cpu: i32, data: &[u8]) {
        let mut event = eguard_bss_types::net_packet::default();
        if let Err(e) = plain::copy_from_bytes(&mut event, data) {
            error!("copy bytes from kernel failed: {:?}", e);
            return;
        };
    
        let sip: Ipv6Addr;
        let dip: Ipv6Addr;
    
        unsafe {
            sip = Ipv6Addr::from(event.src_addr.in6_u.u6_addr8);
            dip = Ipv6Addr::from(event.dst_addr.in6_u.u6_addr8);
        }
    
        let mut rec = Record::new();
        let mut payload = Payload::new();
    
        rec.set_data_type(3200);
        rec.set_timestamp(Clock::now_since_epoch().as_secs() as i64);
    
        let mut map = HashMap::with_capacity(7);
        map.insert("ifindex".to_string(), event.ifindex.to_string());
        map.insert("protocol".to_string(), event.protocol.to_string());
        map.insert("sip".to_string(), match sip.to_ipv4() {
            Some(s) => s.to_string(),
            None => sip.to_string(),
        });
        map.insert("sport".to_string(), event.src_port.to_be().to_string());
        map.insert("dip".to_string(), match dip.to_ipv4() {
            Some(s) => s.to_string(),
            None => dip.to_string(),
        });
        map.insert("dport".to_string(), event.dst_port.to_be().to_string());
    
        let action = if event.action == 0 { "deny" } else { "log" };
        map.insert("action".to_string(), action.to_string());
    
        payload.set_fields(map);
        rec.set_data(payload);

        let mut lock = TX
            .lock()
            .map_err(|e| error!("unable to acquire notification send channel: {}", e)).unwrap();
        match &mut *lock {
            Some(sender) => {
                if let Err(err) = sender.send(rec) {
                    error!("send failed: {}", err);
                    return;
                }
            }
            None => return,
        }
    }

    fn handle_lost_events(cpu: i32, count: u64) {
        error!("lost {} events on CPU {}", count, cpu);
    }
}


impl Drop for TcEvent<'_> {
    fn drop(&mut self) {
        // drop and exit
        if let Err(e) = self.detech() {
            error!("{}", e);
        }
        debug!("tc event dropped")
    }
}

impl<'a> BpfProgram for TcEvent<'a> {
    fn init(&mut self) -> Result<()> {
        // check the if_name
        if self.if_name.is_empty() {
            bail!("if_name is empty")
        }
        // initialization
        let builder = EguardSkelBuilder::default();
        let skel = RefCell::new(Some(builder.open()?.load()?));
        // generate the tc hook
        self.tchook = Some(
            TcHookBuilder::new(skel.borrow_mut().as_ref().unwrap().progs().hades_egress().as_fd())
                .ifindex(self.if_idx.clone())
                .replace(true)
                .handle(1)
                .priority(1)
                .hook(TC_EGRESS),
        );

        // consume the perf continusiouly
        let perf = PerfBufferBuilder::new(skel.borrow_mut().as_mut().unwrap().maps_mut().events())
            .sample_cb(TcEvent::handle_event)
            .lost_cb(TcEvent::handle_lost_events)
            .build()?;
        let running = Arc::new(Mutex::new(true));
        let running_clone = running.clone();
        self.running = running_clone;
        // spawn the consumer
        let thread_job = spawn(move || {
            while *running.lock().unwrap() {
                if let Err(_) = perf.poll(Duration::from_millis(100)) {
                    break;
                }
            }
        });
        self.thread_handle = Some(thread_job);
        self.skel.replace(skel.borrow_mut().take());
        // load configuration if config.yaml exists
        #[cfg(feature = "debug")]
        if let Ok(yaml_string) = fs::read_to_string("config.yaml") {
            let config: Config = serde_yaml::from_str(&yaml_string)?;
            self.flush_config(config)?;
        }
        Ok(())
    }

    // libbpf: Kernel error message: Exclusivity flag on, cannot modify
    // This message is harmless, reference: https://www.spinics.net/lists/bpf/msg44842.html
    fn attach(&mut self) -> Result<()> {
        if let Some(mut hook) = self.tchook {
            hook.create().context("failed to create egress TC qdisc")?;
            hook.attach().context("failed to attach egress TC prog")?;
            // check if the hook isready
            if let Err(e) = hook.query() {
                self.exit_thread();
                bail!(e)
            }
            if self.skel.borrow().is_none() {
                self.exit_thread();
                bail!("skel is invalid")
            }
        } else {
            self.exit_thread();
            bail!("tchook not exists")
        }
        self.status.store(true, Ordering::Relaxed);
        Ok(())
    }

    fn detech(&mut self) -> Result<()> {
        if let Some(mut hook) = self.tchook {
            hook.detach()?;
            hook.destroy()?;
            self.exit_thread();
            self.status.store(false, Ordering::Relaxed);
        } else {
            bail!("tchook not exists")
        }
        Ok(())
    }

    fn flush_config(self: &TcEvent<'a>, cfgs: Config) -> Result<()> {
        // cache up the vec
        let mut temp = HashMap::new();
        for v in cfgs.egress.into_iter() {
            let (key, value) = v.to_bytes()?;
            temp.insert(key, value);
        }
        // remove firstly
        let mut map = TC_EVENT_HASH_MAP.lock().unwrap();
        let mut skel = self.skel.borrow_mut();
        for (key, _) in map.clone().into_iter() {
            if !temp.contains_key(key) {
                skel.as_mut()
                    .unwrap()
                    .maps_mut()
                    .EGRESS_POLICY_MAP()
                    .delete(&key)?;
                map.remove(key);
            }
        }
        // add this to configurations
        for (key, value) in temp.into_iter() {
            if !map.contains_key(&key[..]) {
                skel.as_mut()
                    .unwrap()
                    .maps_mut()
                    .EGRESS_POLICY_MAP()
                    .update(&key, &value, MapFlags::ANY)?;
            }
        }

        Ok(())
    }

    fn status(&self) -> bool {
        return self.status.load(Ordering::Relaxed);
    }
}
