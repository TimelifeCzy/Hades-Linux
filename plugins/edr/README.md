# eBPF EDR

> eBPF EDR is a demo for eBPF edr, for networking, file operation and other resource limitation

THIS IS INSPIRED BY cilium/tetragon, but we won't handle this in a complex way, just as easy as we could. And I do not intend to make **ebpfdriver** as an all-in-one plugin, as it would be way too complex to maintain.

## QUESTIONS

1. Why Rust?

    Nothing special. This would be easier if we use golang since ebpfdriver is already finished. Just want to try things differently.

2. What the features?

    Several basic features which, I think, would be useful in real world. Detection is NOT the purpose of this plugin.

    1. Network restriction both in Host-based and process-based.
    2. File access restriction like /etc/passwd.
    3. (Future) BPF/LKM load pre checker
    4. 
