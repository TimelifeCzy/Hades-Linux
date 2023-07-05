// SPDX-License-Identifier: (LGPL-2.1 OR BSD-2-Clause)

use crossbeam::channel::bounded;
use log::*;
use log::set_boxed_logger;
use sdk::{logger::*, Client};
use std::path::PathBuf;
use std::thread;
use std::time::Duration;
use event::egress::TcEvent;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;

mod config;
mod event;
mod manager;

use crate::manager::manager::Bpfmanager;

fn main() {
    let mut client = Client::new(false);
    let logger = Logger::new(Config {
        max_size: 1024 * 1024 * 5,
        path: PathBuf::from("./eguard.log"),
        #[cfg(not(feature = "debug"))]
        file_level: LevelFilter::Info,
        #[cfg(feature = "debug")]
        file_level: LevelFilter::Debug,
        remote_level: LevelFilter::Error,
        max_backups: 10,
        compress: true,
        client: Some(client.clone()),
    });
    set_boxed_logger(Box::new(logger)).unwrap();
    // Install Ctrl-C handler
    let control_s = Arc::new(AtomicBool::new(false));
    let control_l = control_s.clone();
    let control_c = control_s.clone();
    ctrlc::set_handler(move || {
        control_c.store(true, Ordering::Relaxed);
    }).unwrap();
    // set channel and replace
    let (tx, rx) = bounded(512);
    // *event::event::TX.lock().unwrap() = Some(tx);
    {
        let mut lock = event::event::TX
          .lock()
          .map_err(|e| error!("failed to define shared notification sender: {}", e)).unwrap();
        *lock = Some(tx);
    }

    // tc egress restriction
    Bpfmanager::bump_memlock_rlimit().unwrap();
    let mut mgr = Bpfmanager::new();
    let mut event = TcEvent::new();
    // debug
    event.set_if("eth0").unwrap();
    mgr.load_program("tc", Box::new(event));
    if let Err(e) = mgr.start_program("tc") {
        error!("start tc failed: {}", e);
        return;
    }
    info!("init bpf program successfully");
    // task_receive thread
    let mut client_c = client.clone();
    let _ = thread::Builder::new()
        .name("task_receive".to_owned())
        .spawn(move || loop {
            match client_c.receive() {
                Ok(_) => {
                    // handle task
                }
                Err(e) => {
                    error!("when receiving task, an error occurred:{}", e);
                    control_s.store(true, Ordering::Relaxed);
                    return;
                }
            }
        });
    info!("task receive handler is running");
    let timeout = Duration::from_millis(500);
    // record_send thread
    let record_send = thread::Builder::new()
        .name("record_send".to_string())
        .spawn(move || loop {
            if control_l.load(Ordering::Relaxed) {
                break;
            }

            let rec = rx.recv_timeout(timeout);
            match rec {
                Ok(rec) => {
                    if let Err(err) = client.send_record(&rec) {
                        error!("when sending record, an error occurred:{}", err);
                        return;
                    }
                }
                Err(_) => continue
            }
        }).unwrap();
    let _ = record_send.join();
    info!("record_send is exiting");
    mgr.stop_program("tc").unwrap();
    info!("plugin will exit");
}
