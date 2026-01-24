---
title: "Understanding STP and PVSTP: Loop Prevention in Ethernet Networks"
description: "A beginner-friendly deep dive into Spanning Tree Protocol (STP) and Per-VLAN Spanning Tree Plus (PVST+) and how they prevent loops in Layer 2 networks."
author: "Siddharth Jain"
pubDate: "2026-01-25"
pubTime: "11:00:00"
featured: true
draft: false
tags:
 - networking
 - switching
 - stp
 - pvstp
---

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Introduction](#introduction)
- [Why Do We Need STP?](#why-do-we-need-stp)
- [What Is Spanning Tree Protocol (STP)?](#what-is-spanning-tree-protocol-stp)
- [How STP Works](#how-stp-works)
  - [Root Bridge Election](#root-bridge-election)
  - [Port Roles](#port-roles)
  - [Port States](#port-states)
- [What Is PVST+ (Per-VLAN Spanning Tree Plus)?](#what-is-pvst-per-vlan-spanning-tree-plus)
- [STP vs PVST+](#stp-vs-pvst)
- [Practical Example](#practical-example)
- [Best Practices](#best-practices)
- [Conclusion](#conclusion)

---

## Introduction

In Ethernet networks, redundancy is essential for **high availability**. However, redundancy at Layer 2 can introduce a serious problem: **switching loops**. These loops can cause broadcast storms, MAC table instability, and ultimately bring the network down.

This is where **Spanning Tree Protocol (STP)** and its Cisco enhancement **PVST+ (Per-VLAN Spanning Tree Plus)** come into play. In this blog, we will understand what they are, why we need them, and how they work.

---

## Why Do We Need STP?

Imagine three switches connected in a triangle. If one switch sends a broadcast frame:

* The frame will be flooded to all ports
* Other switches will forward it again
* The frame will loop **forever**

This causes:

* 🔥 **Broadcast storms**
* 🧠 **MAC address table instability**
* ❌ **Multiple frame copies**

STP solves this by **logically blocking some links** while keeping them as backup.

---

## What Is Spanning Tree Protocol (STP)?

**Spanning Tree Protocol (IEEE 802.1D)** is a Layer 2 protocol that:

* Detects loops in a switched network
* Builds a **loop-free logical topology**
* Blocks redundant paths
* Keeps backup paths ready in case of failure

The result is a **tree-like structure** with no loops, hence the name *Spanning Tree*.

---

## How STP Works

STP works by exchanging special frames called **BPDUs (Bridge Protocol Data Units)** between switches.

### Root Bridge Election

* All switches participate in an election
* The switch with the **lowest Bridge ID** becomes the **Root Bridge**
* Bridge ID = **Priority + MAC Address**

> 💡 Tip: You can control the root bridge by setting a lower priority.

---

### Port Roles

Each switch port gets a role:

* **Root Port (RP)** → Best path towards the root bridge
* **Designated Port (DP)** → Best port on a segment
* **Blocked Port** → Temporarily disabled to prevent loops

---

### Port States

Classic STP ports move through these states:

1. **Blocking** → Does not forward frames
2. **Listening** → Listens to BPDUs
3. **Learning** → Learns MAC addresses
4. **Forwarding** → Forwards traffic
5. **Disabled** → Administratively down

> ⏳ This process can take **30–50 seconds**, which is why STP is considered slow.

---

## What Is PVST+ (Per-VLAN Spanning Tree Plus)?

**PVST+** is a **Cisco proprietary** enhancement of STP.

Instead of running **one STP instance for the whole network**, PVST+ runs:

> ✅ **One STP instance per VLAN**

This means:

* Each VLAN can have a **different root bridge**
* Traffic can be **load-balanced** across links
* Better utilization of redundant links

---

## STP vs PVST+

| Feature        | STP                   | PVST+             |
| -------------- | --------------------- | ----------------- |
| Standard       | IEEE 802.1D           | Cisco Proprietary |
| Instances      | One for whole network | One per VLAN      |
| Load Balancing | ❌ Not possible        | ✅ Possible        |
| Resource Usage | Low                   | Higher (per VLAN) |
| Flexibility    | Low                   | High              |

---

## Practical Example

Suppose you have:

* VLAN 10 → Root Bridge = Switch A
* VLAN 20 → Root Bridge = Switch B

With PVST+:

* VLAN 10 traffic uses Path 1
* VLAN 20 traffic uses Path 2

So instead of one link being always blocked, **both links are actively used** depending on VLAN. 🚀

---

## Best Practices

* ✅ Manually set **root bridge priority**
* ✅ Use **Rapid PVST+ or RSTP** in modern networks
* ✅ Enable **BPDU Guard** on access ports
* ❌ Do not rely on default STP behavior in production

---

## Conclusion

* **STP** prevents Layer 2 loops by blocking redundant paths
* **PVST+** improves STP by running one instance per VLAN
* PVST+ allows **better redundancy usage and load balancing**

If you are working with Cisco switches, understanding PVST+ is **mandatory** for designing scalable and reliable networks.

---

> ✍️ Author: Siddharth Jain
> 🎯 Topic: Computer Networks / Switching