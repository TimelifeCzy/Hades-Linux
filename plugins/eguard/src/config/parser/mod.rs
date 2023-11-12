pub mod dns;
pub mod tc;

use anyhow::{Error, Result};
use serde::{Deserialize, Serialize};
use std::net::{IpAddr, Ipv4Addr, Ipv6Addr};
use byteorder::{BigEndian, ByteOrder};
use zerocopy::FromBytes;


pub trait CfgTrait {
    fn to_bytes(&self) -> Result<(Vec<u8>, Vec<u8>)>;
}

/// Represents the action for egress policy.
#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
pub enum Action {
    DENY,
    LOG,
}

pub struct IpConfig {
    pub subnet: IpAddr,
    pub prefixlen: u32,
}

impl IpConfig {
    pub fn new(address: &str) -> Result<Self> {
        let address_p;
        let mut mask = 128;
        if address.contains('/') {
            let parts: Vec<&str> = address.split('/').collect();
            address_p = parts[0].to_string();
            mask = parts[1].replace('/', "").parse()?;
        } else {
            address_p = address.to_string();
        }

        let subnet: IpAddr = if address_p.contains(':') {
            let ipv6 = address_p.parse::<Ipv6Addr>()?;
            IpAddr::V6(ipv6)
        } else {
            if mask != 128 {
                mask += 96;
            }
            let ipv4 = address_p.parse::<Ipv4Addr>()?;
            IpAddr::V4(ipv4)
        };

        if mask > 128 {
            return Err(Error::msg("Invalid mask"));
        }

        Ok(Self {
            subnet,
            prefixlen: mask,
        })
    }
}


#[repr(C)]
#[derive(Debug, Copy, Clone, PartialEq, Eq, Hash, FromBytes)]
pub struct IpAddress(pub [u8; 16]);

impl Default for IpAddress {
    fn default() -> Self {
        Self([0x00; 16])
    }
}

impl IpAddress {
    /// Converts a Rust `IpAddr` type into an `IpAddress`.
    ///
    /// # Arguments
    ///
    /// * `ip` - the IP Address to convert.
    pub fn from_ip(ip: IpAddr) -> Self {
        let mut result = Self::default();
        match ip {
            IpAddr::V4(ip) => {
                result.0[10] = 0xFF;
                result.0[11] = 0xFF;
                result.0[12] = ip.octets()[0];
                result.0[13] = ip.octets()[1];
                result.0[14] = ip.octets()[2];
                result.0[15] = ip.octets()[3];
            }
            IpAddr::V6(ip) => {
                for i in 0..8 {
                    let base = i * 2;
                    result.0[base] = ip.octets()[base];
                    result.0[base + 1] = ip.octets()[base + 1];
                }
            }
        }

        result
    }

    fn is_v4(&self) -> bool {
        self.0[0] == 0xFF
            && self.0[1] == 0x00
            && self.0[2] == 0x00
            && self.0[3] == 0x00
            && self.0[4] == 0x00
            && self.0[5] == 0x00
            && self.0[6] == 0x00
            && self.0[7] == 0x00
            && self.0[8] == 0x00
            && self.0[9] == 0x00
            && self.0[10] == 0xFF
            && self.0[11] == 0xFF
    }

    /// Convers an `IpAddress` type to a Rust `IpAddr` type, using
    /// the in-build mapped function for squishing IPv4 into IPv6
    pub fn as_ipv6(&self) -> Ipv6Addr {
        if self.is_v4() {
            Ipv4Addr::new(self.0[12], self.0[13], self.0[14], self.0[15]).to_ipv6_mapped()
        } else {
            Ipv6Addr::new(
                BigEndian::read_u16(&self.0[0..2]),
                BigEndian::read_u16(&self.0[2..4]),
                BigEndian::read_u16(&self.0[4..6]),
                BigEndian::read_u16(&self.0[6..8]),
                BigEndian::read_u16(&self.0[8..10]),
                BigEndian::read_u16(&self.0[10..12]),
                BigEndian::read_u16(&self.0[12..14]),
                BigEndian::read_u16(&self.0[14..]),
            )
        }
    }

    /// Converts an `IpAddress` type to a Rust `IpAddr` type
    pub fn as_ip(&self) -> IpAddr {
        if self.is_v4() {
            // It's an IPv4 Address
            IpAddr::V4(Ipv4Addr::new(
                self.0[12], self.0[13], self.0[14], self.0[15],
            ))
        } else {
            // It's an IPv6 address
            IpAddr::V6(Ipv6Addr::new(
                BigEndian::read_u16(&self.0[0..2]),
                BigEndian::read_u16(&self.0[2..4]),
                BigEndian::read_u16(&self.0[4..6]),
                BigEndian::read_u16(&self.0[6..8]),
                BigEndian::read_u16(&self.0[8..10]),
                BigEndian::read_u16(&self.0[10..12]),
                BigEndian::read_u16(&self.0[12..14]),
                BigEndian::read_u16(&self.0[14..]),
            ))
        }
    }
}

impl From<IpAddress> for IpAddr {
    fn from(val: IpAddress) -> Self {
        val.as_ip()
    }
}

impl From<IpAddr> for IpAddress {
    fn from(ip: IpAddr) -> Self {
        Self::from_ip(ip)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_xdp_ip() {
        let default = IpAddress::default();
        assert_eq!(default.0, [0x00; 16]);
    }

    #[test]
    fn test_from_ipv4() {
        let ip = IpAddress::from_ip("1.2.3.4".parse().unwrap());
        for n in 0..9 {
            assert_eq!(ip.0[n], 0x00);
        }
        assert_eq!(ip.0[10], 0xFF);
        assert_eq!(ip.0[11], 0xFF);
        assert_eq!(ip.0[12], 1);
        assert_eq!(ip.0[13], 2);
        assert_eq!(ip.0[14], 3);
        assert_eq!(ip.0[15], 4);
    }

    #[test]
    fn test_to_ipv4() {
        let raw_ip = IpAddress([
            0x00, 000, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 1, 2, 3, 4,
        ]);
        let ip = raw_ip.as_ip();
        let intended_ip: IpAddr = "::ffff:1.2.3.4".parse().unwrap();
        assert_eq!(ip, intended_ip);
    }

    #[test]
    fn test_ipv6_round_trip() {
        let ipv6 = IpAddr::V6("2001:db8:85a3::8a2e:370:7334".parse().unwrap());
        let xip = IpAddress::from_ip(ipv6);
        let test = xip.as_ip();
        assert_eq!(ipv6, test);
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_ip_config() {
        let ip_config = IpConfig::new("192.168.1.1/24").unwrap();
        let ip = "192.168.1.1".parse::<Ipv4Addr>().unwrap();
        assert_eq!(ip_config.subnet, ip);
        assert_eq!(ip_config.prefixlen, 24 + 96);

        let ip_config = IpConfig::new("192.168.1.1/36");
        assert_eq!(ip_config.is_err(), true);

        let ip_config = IpConfig::new("::ffff:c0a8:101/120").unwrap();
        let ip = "::ffff:c0a8:101".parse::<Ipv6Addr>().unwrap();
        assert_eq!(ip_config.subnet, ip);
        assert_eq!(ip_config.prefixlen, 120);
    }
}
