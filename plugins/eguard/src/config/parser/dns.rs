mod eguard_skel {
    include!("../../bpf/eguard.skel.rs");
}
use self::eguard_skel::eguard_bss_types;
use super::{Action, CfgTrait};
use anyhow::{bail, Result};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
pub struct DnsPolicy {
    pub name: String,
    pub domain: String,
    pub action: Action,
}

impl CfgTrait for DnsPolicy {
    fn to_bytes(&self) -> Result<(Vec<u8>, Vec<u8>)> {
        let mut key = eguard_bss_types::dns_policy_key::default();
        let mut value = eguard_bss_types::dns_policy_value::default();
        let mut domain = self.domain.clone();
        if domain.len() == 0 || domain.len() > 255 {
            bail!("domain length error: {}", domain.len());
        }

        if domain.contains('*') {
            domain.remove(0);
            key.prefixlen = domain.len() as u32;
        } else {
            key.prefixlen = 255;
        }

        let domain_bytes = domain.as_bytes();
        let key_domain: [i8; 255] = {
            let mut arr = [0; 255];
            for (i, &byte) in domain_bytes.iter().enumerate() {
                arr[domain.len() - i - 1] = byte as i8;
            }
            arr
        };
        key.domain = key_domain;
        value.action = match self.action {
            Action::DENY => 0,
            Action::LOG => 1,
        };

        // flush to the map
        let key = unsafe { plain::as_bytes(&key) }.to_vec();
        let value = unsafe { plain::as_bytes(&value) }.to_vec();
        Ok((key, value))
    }
}
