# ⛏️ Community Mining Pool — Open Source Template

![Status](https://img.shields.io/badge/Status-Alpha-orange) ![Docker](https://img.shields.io/badge/Docker-Compose-blue) ![Monero](https://img.shields.io/badge/Monero-Live-brightgreen) ![License](https://img.shields.io/badge/License-MIT-purple)

A turn-key, containerized mining pool template designed for communities. Fork it, edit one config file, and run `docker compose up` — no deep technical expertise required. Built on the **MiningCore** pool engine with a **Nuxt 3** dashboard and optional Discord bot integration.

> **Current Status:** 🚧 Alpha — Monero pool is operational. Frontend dashboard (Phase 4) is actively in development.

---

## 🌟 Why This Exists

Most open-source pool software is either abandoned, requires significant technical skill to customize, or has no community features at all. This project is different:

- **Config-driven branding** — Communities customize via a single YAML file, not code surgery
- **Community goals** — Turn mining into a shared activity by funding server costs or events together
- **Block celebrations** — Real-time animations when the pool finds a block
- **Discord-native** — Bot integration meets communities where they already live
- **Fair-launch coins only** — XMR (CPU mining) and ERG (GPU mining) are ASIC-resistant and philosophically aligned with decentralized mining
- **Dockerized everything** — `docker compose up` and you're live. No dependency hell

This isn't just a pool dashboard. It's a community funding platform that happens to use crypto mining.

---

## 🏗️ Architecture

The entire stack runs on **Docker Compose**, orchestrating the following services:

```
┌─────────────────────────────────────────────────────────┐
│                    DOCKER COMPOSE STACK                  │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  monero-node │  │   ergo-node  │  │   postgres   │  │
│  │  (CPU coin)  │  │  (GPU coin)  │  │  (database)  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                  │          │
│  ┌──────┴─────────────────┴──────────────────┴──────┐   │
│  │               MININGCORE (Pool Engine)           │   │
│  │          REST API on :4000                       │   │
│  └──────────────────────┬───────────────────────────┘   │
│                         │                               │
│  ┌──────────────────────┴───────────────────────────┐   │
│  │              NGINX (Reverse Proxy)               │   │
│  │   /api/* → MiningCore :4000                      │   │
│  │   /*     → Nuxt Frontend :3000                   │   │
│  └──────────────────────┬───────────────────────────┘   │
│                         │                               │
│  ┌──────────────────────┴───────────────────────────┐   │
│  │           NUXT 3 FRONTEND (:3000)                │   │
│  │  Dashboard │ Miners │ Blocks │ Goals             │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │           DISCORD BOT (optional)                 │   │
│  │  Block alerts │ Role rewards │ Stats commands    │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Service Status

| Service | Technology | Status |
| :--- | :--- | :--- |
| **Pool Engine** | MiningCore (C#) | ✅ Live |
| **Database** | PostgreSQL 13 | ✅ Live |
| **Monero Node** | monerod v0.18.4.5 (pruned) | ✅ Synced |
| **Monero Wallet** | monero-wallet-rpc | ✅ Connected |
| **Ergo Node** | ergo-node (official image) | 🔄 Syncing |
| **Frontend** | Nuxt 3 | 🔨 In Development |
| **Reverse Proxy** | Nginx | ⏳ Phase 4 |
| **Discord Bot** | discord.js v14 | ⏳ Phase 4 |

---

## 🚀 Quick Start

### Prerequisites

- Docker Desktop (Windows/Mac/Linux)
- 80GB+ free disk space (SSD recommended — Monero runs in pruned mode)
- 8GB+ RAM

### 1. Clone the Repository

```bash
git clone https://github.com/Acquiredl/community-mining-pool
cd community-mining-pool
```

### 2. Configure Your Environment

```bash
cp config/.env.example config/.env
```

Edit `config/.env` with your values:

```env
DB_PASSWORD=your_secure_password_here
POOL_NAME=My Community Pool
```

### 3. Customize Your Pool

Edit `config/pool-theme/pool.config.yml` to set your pool's name, colors, logo, and community goals. This is the only file most communities will ever need to touch:

```yaml
pool:
  name: "Pixel Pickaxe Pool"
  tagline: "Mining for the community"

theme:
  primary_color: "#8B5CF6"
  mode: "dark"

goals:
  enabled: true
  items:
    - title: "Monthly Server Costs"
      target_xmr: 0.5
```

See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for the full guide.

### 4. Start the Stack

```bash
cd docker
docker compose up -d
```

Blockchain nodes will begin syncing. Monero runs in pruned mode and syncs faster; Ergo uses the official image with bootstrap enabled.

### 5. Verify Everything is Running

```bash
docker compose logs -f miningcore
```

Look for `[xmr1] Pool Online` to confirm Monero is accepting connections.

---

## ⚙️ Configuration

### The Theming System

Everything communities need to customize lives in one file:

```
config/
└── pool-theme/
    └── pool.config.yml    ← Edit this file
```

This file controls:

- Pool name, tagline, logo, and favicon
- Theme colors, fonts, dark/light mode, border radius, glow effects
- Which dashboard pages are enabled
- Community goal targets and wallet addresses
- Block celebration style (confetti, fireworks, flash)
- Discord integration settings
- Stratum connection details shown in the Getting Started guide

The Nuxt frontend reads this YAML at startup and injects all values as CSS custom properties and a global `usePoolConfig()` composable. **No code changes needed for basic customization.**

### Supported Coins

| Coin | Algorithm | Mining Type | Node |
| :--- | :--- | :--- | :--- |
| **Monero (XMR)** | RandomX | CPU | monerod (pruned) |
| **Ergo (ERG)** | Autolykos v2 | GPU | ergo-node (official) |

Both coins are ASIC-resistant and fair-launch, aligned with the project's decentralized mining philosophy.

---

## 📁 Project Structure

```
community-mining-pool/
├── docker/
│   ├── docker-compose.yml          # Full stack definition
│   └── Dockerfile.pool             # MiningCore build
│
├── config/
│   ├── miningcore/
│   │   └── config.json             # Pool engine config (coins, payouts, ports)
│   ├── pool-theme/
│   │   └── pool.config.yml         # ← Community customization lives here
│   ├── nginx/
│   │   └── nginx.conf              # Reverse proxy config
│   └── .env.example                # Template for secrets
│
├── frontend/                       # Nuxt 3 dashboard (Phase 4)
│   ├── pages/
│   │   ├── index.vue               # Home / pool overview
│   │   ├── miners/[address].vue    # Miner lookup (dynamic route)
│   │   ├── blocks.vue              # Block history
│   │   ├── getting-started.vue     # Connection guides
│   │   └── goals.vue               # Community goal tracker
│   ├── components/
│   │   ├── HashrateChart.vue
│   │   ├── GoalTracker.vue
│   │   ├── BlockCelebration.vue
│   │   └── ...
│   └── composables/
│       ├── usePoolConfig.ts        # Reads pool.config.yml
│       └── usePoolApi.ts           # MiningCore API wrapper
│
├── discord-bot/                    # Optional Discord integration (Phase 4)
│   └── src/
│       ├── commands/               # !pool stats, !pool mystats, etc.
│       └── events/                 # Block alerts, daily summaries
│
└── .github/
    └── workflows/
        └── syntax-check.yml        # CI: validates JSON/YAML on every push
```

---

## 🔌 Connecting Miners

### Monero (CPU Mining)

Recommended software: [XMRig](https://xmrig.com/)

```bash
xmrig -o pool.example.com:3333 -u YOUR_WALLET_ADDRESS -p YourWorkerName
```

### Ergo (GPU Mining)

Recommended software: [lolMiner](https://github.com/Lolliedieb/lolMiner-releases) or [NBMiner](https://github.com/NebuTech/NBMiner)

```bash
lolMiner --algo AUTOLYKOS2 --pool pool.example.com:3052 --user YOUR_WALLET_ADDRESS.WorkerName
```

Replace `pool.example.com` with your pool's domain and update ports to match your `pool.config.yml`.

---

## 🛣️ Roadmap

### ✅ Phase 1 — Foundation
- MiningCore + PostgreSQL stack
- Docker Compose orchestration
- Gitflow workflow + CI syntax checks

### ✅ Phase 2 — Monero Integration
- monerod with ZMQ block notification
- monero-wallet-rpc connected
- PPLNS payout scheme, VarDiff configured
- Pool confirmed online, accepting shares

### 🔄 Phase 3 — Ergo Integration
- Ergo node deployed (official Docker image)
- Wallet address generated
- Node syncing — integration in progress

### 🔨 Phase 4 — Frontend & Community Features *(Active)*
- **4A** — Core dashboard (pool stats, miner lookup, block history) ✅
- **4B** — Config-driven theming system 🔨
- **4C** — Community goals + block celebrations ⏳
- **4D** — Discord bot ⏳

### ⏳ Phase 5 — Production Hardening
- SSL/TLS on stratum ports and API
- Nginx rate limiting and DDoS protection
- Payout system end-to-end testing
- CUSTOMIZATION.md guide for community forks

---

## 🔒 Security Model

**Least privilege:** Blockchain nodes run as non-root users inside containers. The database has no externally exposed ports.

**Network isolation:** Only stratum ports (for miners) and the Nginx proxy (for the web UI) are exposed to the internet. All inter-service communication stays on a private Docker network.

**Secret management:** Passwords and tokens live in `.env` (gitignored). Never hardcoded in config files or committed to the repository.

**Infrastructure as code:** The entire stack is defined in `docker-compose.yml`. Disaster recovery means running `docker compose up` on a new server.

---

## 🧑‍💻 Development

This project follows **Gitflow**:

```
main   ← production-ready only, tagged releases
dev    ← integration branch, all features merge here first
feature/[name] ← individual feature development
```

Never push directly to `main`. Feature branches merge to `dev`; `dev` merges to `main` at release.

```bash
# Start a new feature
git checkout dev
git checkout -b feature/my-feature

# Merge when done
git checkout dev
git merge feature/my-feature
```

A GitHub Actions workflow automatically validates JSON and YAML syntax on every push to catch config errors before they reach the pool.

---

## 🤝 Contributing

Contributions are welcome! This project is intended as a community template — the more it gets tested across different setups, the better it becomes for everyone.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-improvement`)
3. Commit your changes
4. Open a pull request against `dev`

Please don't open PRs directly against `main`.

---

## 📄 License

MIT — fork it, customize it, run it for your community.

---

## 🙏 Built With

- [MiningCore](https://github.com/oliverw/miningcore) — Pool engine
- [Nuxt 3](https://nuxt.com/) — Frontend framework
- [PostgreSQL](https://www.postgresql.org/) — Database
- [discord.js](https://discord.js.org/) — Discord bot framework
- [Docker](https://www.docker.com/) — Containerization