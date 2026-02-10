# 🛠️ Mining Pool Command Reference

## 🚀 Lifecycle (Start / Stop)

**Start (or Resume) the Stack**
Runs everything in the background. Safe to run even if already running.
`docker compose -f infra/docker-compose.yml up -d`

**Pause the Stack (Safe Shutdown)**
Saves data to disk and stops containers. Use this before turning off the PC.
`docker compose -f infra/docker-compose.yml stop`

**Restart a Specific Service**
Useful if you changed config.json or if a service is stuck.
`docker compose -f infra/docker-compose.yml restart miningcore`
`docker compose -f infra/docker-compose.yml restart monero-wallet`

**Tear Down (WARNING)**
Stops containers and removes the network. Does NOT delete the blockchain data.
`docker compose -f infra/docker-compose.yml down`

---

## 🔍 Monitoring & Logs

**Follow ALL Logs**
See the matrix. Good for spotting errors across the whole stack.
`docker compose -f infra/docker-compose.yml logs -f`

**Check Pool Logs (The Brain)**
Check if miners are connecting or if jobs are generating.
`docker compose -f infra/docker-compose.yml logs -f miningcore`

**Check Monero Node Logs (The Sync)**
Check sync percentage or "Height".
`docker compose -f infra/docker-compose.yml logs -f monero-node`

**Check Wallet Logs**
Check if the wallet RPC is bound and happy.
`docker compose -f infra/docker-compose.yml logs -f monero-wallet`

**Check Ravencoin Logs (Coming Soon)**
`docker compose -f infra/docker-compose.yml logs -f ravencoin-node`

---

## 🧪 Testing & Diagnostics

**Run the Health Check Script**
The custom script we wrote to ping every service.
`sh test_stack.sh`

**Check Mining Port (Manual/Netcat)**
Verify if the pool is listening for miners.
`nc -zv 127.0.0.1 3333`

---

## 🛠️ Maintenance

**Force Recreate a Container**
If you changed the docker-compose.yml file (like adding ports or volumes), run this to force the update.
`docker compose -f infra/docker-compose.yml up -d --force-recreate <service_name>`