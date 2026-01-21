---
title: "TCP Three-Way Handshake"
description: "The TCP three-way handshake is a three-step process (SYN, SYN-ACK, ACK) that establishes a reliable, synchronized connection between a client and server before data transfer begins."
author: "Siddharth Jain"
pubDate: "2026-01-21"
pubTime: "11:20:00"
featured: true
draft: false
tags:
  - Networking
  - TCP
  - Handshake
---

# 🛠️ What Is the TCP Three-Way Handshake?

Every time you load a webpage, send an email, or stream a video over the internet, a critical networking process happens first: the **TCP three-way handshake**. This handshake is what allows two computers — usually called a **client** and a **server** — to establish a reliable connection before any actual data is exchanged. :contentReference[oaicite:0]{index=0}

TCP (Transmission Control Protocol) is a **connection-oriented** transport protocol — unlike UDP — which ensures reliable, ordered delivery of data across the internet. Before transmitting application data, TCP first negotiates a connection with the remote endpoint using a three-step exchange. :contentReference[oaicite:1]{index=1}

---

## 🧩 Why Is the Three-Way Handshake Important?

The handshake ensures both sides are synchronized and ready for communication. Without it, data could be lost, arrive out of order, or never be acknowledged. It’s a fundamental mechanism that makes the internet **reliable**, **stateful**, and **error-aware**. :contentReference[oaicite:2]{index=2}

Here’s how it benefits networking:

- 🧠 **Synchronization:** Both sides agree on initial sequence numbers.
- 🔐 **Reliability:** It prevents data loss and ensures both sides are ready.
- 📊 **Ordered Flow:** Ensures packets can be reordered and tracked correctly.
- 🔄 **Resilience:** Helps manage retransmissions if packets are lost.

---

## 📡 The Three Steps Explained

The “three-way” handshake involves **three TCP segments** exchanged between client and server:

### 1️⃣ SYN — Client Initiates

The **client** starts by sending a **SYN** (synchronize) packet to the server to signal it wants to open a connection. This packet carries an initial sequence number so both sides can track data. :contentReference[oaicite:3]{index=3}

Client → Server: SYN


### 2️⃣ SYN-ACK — Server Acknowledges and Syncs

The **server** receives the SYN and replies with a combined **SYN-ACK** (synchronize-acknowledge) packet. This both acknowledges the client’s SYN and includes the server’s own SYN to initiate its part of the connection. :contentReference[oaicite:4]{index=4}


Server → Client: SYN-ACK


### 3️⃣ ACK — Client Confirms

Finally, the **client** acknowledges receipt of the server’s SYN with an **ACK** packet. Once this ACK is received, the connection state moves to **ESTABLISHED** on both sides and actual data transmission can begin. :contentReference[oaicite:5]{index=5}



Client → Server: ACK


This symmetrical exchange confirms both sides are ready and in sync.

---

## 🔍 Behind the Scenes: Sequence Numbers

Each packet includes **sequence numbers** that allow TCP to order packets correctly and detect missing ones. During the handshake, these sequence numbers are exchanged and agreed upon so both ends know what to expect for the upcoming data flow. :contentReference[oaicite:6]{index=6}

---

## ⚡ Real-World Considerations

While the handshake is essential to TCP, it can be exploited in certain attacks, like a **SYN flood**, where many SYN packets are sent without completing the handshake. This can overwhelm a server’s resources and prevent legitimate connections. :contentReference[oaicite:7]{index=7}

To mitigate latency and overhead, modern protocols like **QUIC** — built on UDP — try to reduce or eliminate handshake delays while still ensuring reliability. :contentReference[oaicite:8]{index=8}

---

## 🧠 Summary

The **TCP three-way handshake** is the foundation of reliable connections on the internet. By using SYN, SYN-ACK, and ACK packets in sequence:

1. The client proposes a connection.
2. The server acknowledges and proposes its own synchronization.
3. The client confirms and finalizes the link.

Once complete, both devices are synchronized, stateful, and ready to exchange data reliably — a cornerstone of protocols like HTTP, FTP, and SMTP. :contentReference[oaicite:9]{index=9}

---

*Want to see this handshake in action? Try using a packet analyzer like Wireshark next time you load a website and watch the SYN, SYN-ACK, and ACK real-time packets fly!*
::contentReference[oaicite:10]{index=10}
