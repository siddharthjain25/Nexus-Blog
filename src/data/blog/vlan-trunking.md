---
title: "VLAN Trunking Explained: How Multiple VLANs Travel Over a Single Link"
description: "A beginner-friendly but practical guide to VLAN Trunking, 802.1Q tagging, access vs trunk ports, native VLAN, and real-world use cases."
author: Siddharth Jain
pubDate: "2026-01-24"
pubTime: "02:00:00"
featured: true
draft: false
tags:
 - Networking
 - VLAN
 - Switching
 - CCNA
 - Network Basics
---

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Introduction](#introduction)
- [What is a VLAN? (Quick Recap)](#what-is-a-vlan-quick-recap)
- [What is VLAN Trunking?](#what-is-vlan-trunking)
- [Why Do We Need Trunking?](#why-do-we-need-trunking)
- [Access Port vs Trunk Port](#access-port-vs-trunk-port)
- [How Trunking Works (802.1Q Tagging)](#how-trunking-works-8021q-tagging)
  - [What does it do?](#what-does-it-do)
  - [What’s inside the tag?](#whats-inside-the-tag)
  - [On the receiving switch:](#on-the-receiving-switch)
- [What is the Native VLAN?](#what-is-the-native-vlan)
  - [⚠️ Security Tip:](#️-security-tip)
- [Trunking Between Switches and Routers](#trunking-between-switches-and-routers)
  - [1. Switch to Switch](#1-switch-to-switch)
  - [2. Router-on-a-Stick](#2-router-on-a-stick)
- [Basic Configuration Example (Cisco)](#basic-configuration-example-cisco)
  - [Configure a trunk port on a switch:](#configure-a-trunk-port-on-a-switch)
  - [Verify trunk:](#verify-trunk)
- [Common Issues and Best Practices](#common-issues-and-best-practices)
  - [❌ Common Issues:](#-common-issues)
  - [✅ Best Practices:](#-best-practices)
- [Conclusion](#conclusion)

---

## Introduction

In modern networks, **VLANs (Virtual Local Area Networks)** are everywhere. They help us segment networks, improve security, and reduce broadcast traffic. But what happens when you have **multiple switches** and you want the **same VLANs to exist across all of them**?

This is where **VLAN Trunking** comes in.

In this post, we’ll understand:

* What VLAN trunking is
* Why it is needed
* How it works using **802.1Q tagging**
* And how it is used in real networks

---

## What is a VLAN? (Quick Recap)

A **VLAN** is a logical segmentation of a switch network. Devices in different VLANs:

* Are in **different broadcast domains**
* Cannot communicate directly without a **router or Layer 3 device**

Example:

* VLAN 10 → HR Department
* VLAN 20 → Engineering Department
* VLAN 30 → Guest Network

Even if they are connected to the **same physical switch**, they behave like they are on **different networks**.

---

## What is VLAN Trunking?

A **trunk link** is a special type of switch port that can **carry traffic from multiple VLANs at the same time** over a **single physical cable**.

> In short: **VLAN Trunking = Multiple VLANs over one link**

Without trunking, you would need:

* One physical cable per VLAN ❌ (not scalable)

With trunking:

* One cable can carry VLAN 10, 20, 30, 100… ✅

---

## Why Do We Need Trunking?

Imagine this setup:

* You have **2 switches**
* Both switches have devices in VLAN 10 and VLAN 20

If you connect them using a **normal access port**:

* Only **one VLAN** can pass ❌

If you use a **trunk port**:

* **Both VLAN 10 and VLAN 20** can pass simultaneously ✅

So trunking is used to:

* Connect **switch to switch**
* Connect **switch to router (Router-on-a-Stick)**
* Connect **switch to firewall or L3 switch**

---

## Access Port vs Trunk Port

| Feature       | Access Port               | Trunk Port                         |
| ------------- | ------------------------- | ---------------------------------- |
| Carries VLANs | Only ONE VLAN             | Multiple VLANs                     |
| Used for      | End devices (PC, printer) | Switch-to-switch, switch-to-router |
| Tagging       | Untagged                  | Tagged (802.1Q)                    |

Example:

* Your PC port → **Access Port**
* Switch uplink port → **Trunk Port**

---

## How Trunking Works (802.1Q Tagging)

The most common trunking protocol is:

> **IEEE 802.1Q (dot1q)**

### What does it do?

* When a frame travels over a trunk link:

  * The switch **adds a VLAN tag** inside the Ethernet frame
  * This tag tells the receiving switch: **"This frame belongs to VLAN X"**

### What’s inside the tag?

* VLAN ID (e.g., 10, 20, 30)

### On the receiving switch:

* The tag is read
* The frame is placed into the correct VLAN

This is how **multiple VLANs safely share the same cable**.

---

## What is the Native VLAN?

In 802.1Q trunking:

* One VLAN is called the **Native VLAN**
* Frames belonging to the native VLAN are **sent without a tag**

By default (on Cisco):

> Native VLAN = VLAN 1

### ⚠️ Security Tip:

Never use VLAN 1 as native VLAN in production. Always:

* Change native VLAN to something unused (e.g., VLAN 999)

---

## Trunking Between Switches and Routers

### 1. Switch to Switch

* Used to **extend VLANs** across multiple switches

### 2. Router-on-a-Stick

* One physical link
* Multiple sub-interfaces
* Each sub-interface = one VLAN
* Uses trunking to route between VLANs

This saves:

* Ports
* Cables
* Cost

---

## Basic Configuration Example (Cisco)

### Configure a trunk port on a switch:

```
Switch(config)# interface g0/1
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20,30
Switch(config-if)# switchport trunk native vlan 999
```

### Verify trunk:

```
Switch# show interfaces trunk
```

---

## Common Issues and Best Practices

### ❌ Common Issues:

* Native VLAN mismatch
* Allowed VLAN list mismatch
* One side trunk, other side access
* VLAN not created on both switches

### ✅ Best Practices:

* Manually set trunk mode (don’t rely on DTP)
* Restrict allowed VLANs
* Change native VLAN from VLAN 1
* Document VLAN IDs

---

## Conclusion

**VLAN Trunking** is a core concept in networking that makes modern scalable networks possible.

To summarize:

* Trunk ports carry **multiple VLANs**
* They use **802.1Q tagging**
* They are essential for:

  * Multi-switch networks
  * Inter-VLAN routing
  * Enterprise network design

If you’re preparing for **CCNA, networking interviews, or real-world network design**, mastering VLAN trunking is a must.

---

If you want, I can also write posts on:

* Inter-VLAN Routing
* VLAN vs Subnet
* DTP Protocol
* Native VLAN attacks
* Real enterprise VLAN design examples
