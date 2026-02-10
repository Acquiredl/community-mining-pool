# ⛏️ Open Source Mining Pool Stack (Alpha)

![Status](https://img.shields.io/badge/Status-Alpha-orange) ![Docker](https://img.shields.io/badge/Docker-Compose-blue) ![Monero](https://img.shields.io/badge/Monero-Live-green)

A turn-key, containerized mining pool infrastructure designed for ease of deployment and high availability. Built on top of the robust **Miningcore** engine, this project aims to provide a transparent, low-fee alternative for the crypto mining community.

**Current Status:** 🚧 **Alpha (Internal Testing)**
*We are currently synchronizing the blockchain and testing Stratum connections. Do not use for production mining yet.*

---

## 🌟 Project Goals
* **Decentralization:** Make it easy for anyone to host a pool, reducing the hashrate dominance of major pools (like MineXMR/Nanopool).
* **Transparency:** Fully open-source infrastructure. No hidden fees or "closed source" payout code.
* **Multi-Coin Support:** Starting with **Monero (XMR)** and **Ravencoin (RVN)**, with plans to expand to other community-driven coins.

---

## 🏗️ Architecture
The stack runs entirely on **Docker Compose**, orchestrating the following microservices:

| Service | Technology | Status |
| :--- | :--- | :--- |
| **Pool Engine** | Miningcore (C#) | ✅ **Live** |
| **Database** | PostgreSQL 13 | ✅ **Live** |
| **Monero Node** | Monerod (v0.18.4.5) | ✅ **Synced** |
| **Monero Wallet** | Monero-Wallet-RPC | ✅ **Connected** |
| **Ravencoin Node** | Ravend (KawPow) | 🔄 *In Progress* |
| **Web Frontend** | Vue.js / React | ⏳ *Planned* |

---

## 🚀 Quick Start (Development)

**Prerequisites:**
* Docker Desktop (Windows/Mac/Linux)
* 150GB+ Free Disk Space (NVMe Recommended)
* 4GB+ RAM

**1. Clone the Repository**
```bash
git clone [https://github.com/YourUsername/mining-pool-stack.git](https://github.com/YourUsername/mining-pool-stack.git)
cd mining-pool-stack