<!--
  GETTING STARTED PAGE (pages/getting-started.vue)
  
  Step-by-step guide for new miners to connect to the pool.
  Connection details (domain, ports) will come from pool.config.yml
  in Phase 4B. For now, they use Nuxt runtime config.

  Key feature: Copy-to-clipboard buttons on all commands so
  miners can paste directly into their terminal.
-->

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-heading font-bold text-pool-text">Getting Started</h1>
      <p class="text-pool-text-dim mt-1">
        Join the pool in a few simple steps.
      </p>
    </div>

    <!-- ============================
         STEP 1: GET A WALLET
         ============================ -->
    <section class="bg-pool-card rounded-xl border border-pool-border p-6 mb-6">
      <div class="flex items-center gap-3 mb-4">
        <span class="w-8 h-8 rounded-full bg-pool-primary/20 text-pool-primary flex items-center
                     justify-center text-sm font-bold font-heading">1</span>
        <h2 class="text-pool-text font-heading font-semibold text-lg">Get a Wallet</h2>
      </div>

      <p class="text-pool-text-dim text-sm mb-4">
        You need a wallet address to receive your mining payouts. Here are the recommended options:
      </p>

      <div class="grid md:grid-cols-2 gap-4">
        <!-- Monero Wallet -->
        <div class="bg-pool-bg rounded-lg p-4 border border-pool-border">
          <h3 class="text-pool-text font-semibold mb-2" style="color: var(--pool-xmr)">
            Monero (XMR) — CPU Mining
          </h3>
          <p class="text-pool-text-dim text-sm mb-2">Recommended wallets:</p>
          <ul class="text-pool-text-dim text-sm space-y-1">
            <li>
              <a href="https://www.getmonero.org/downloads/" target="_blank" rel="noopener"
                 class="text-pool-primary hover:underline">Monero GUI Wallet</a>
              (Desktop — full featured)
            </li>
            <li>
              <a href="https://featherwallet.org/" target="_blank" rel="noopener"
                 class="text-pool-primary hover:underline">Feather Wallet</a>
              (Desktop — lightweight)
            </li>
            <li>
              <a href="https://cakewallet.com/" target="_blank" rel="noopener"
                 class="text-pool-primary hover:underline">Cake Wallet</a>
              (Mobile)
            </li>
          </ul>
        </div>

        <!-- Ergo Wallet -->
        <div class="bg-pool-bg rounded-lg p-4 border border-pool-border">
          <h3 class="text-pool-text font-semibold mb-2" style="color: var(--pool-ergo)">
            Ergo (ERG) — GPU Mining
          </h3>
          <p class="text-pool-text-dim text-sm mb-2">Recommended wallets:</p>
          <ul class="text-pool-text-dim text-sm space-y-1">
            <li>
              <a href="https://ergoplatform.org/en/get-erg/#Wallets" target="_blank" rel="noopener"
                 class="text-pool-primary hover:underline">Nautilus Wallet</a>
              (Browser extension)
            </li>
            <li>
              <a href="https://ergoplatform.org/en/get-erg/#Wallets" target="_blank" rel="noopener"
                 class="text-pool-primary hover:underline">Ergo Wallet</a>
              (Mobile — Android/iOS)
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ============================
         STEP 2: DOWNLOAD MINING SOFTWARE
         ============================ -->
    <section class="bg-pool-card rounded-xl border border-pool-border p-6 mb-6">
      <div class="flex items-center gap-3 mb-4">
        <span class="w-8 h-8 rounded-full bg-pool-primary/20 text-pool-primary flex items-center
                     justify-center text-sm font-bold font-heading">2</span>
        <h2 class="text-pool-text font-heading font-semibold text-lg">Download Mining Software</h2>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <!-- CPU Mining -->
        <div class="bg-pool-bg rounded-lg p-4 border border-pool-border">
          <h3 class="text-pool-text font-semibold mb-2" style="color: var(--pool-xmr)">
            CPU Mining (Monero)
          </h3>
          <p class="text-pool-text-dim text-sm mb-2">
            <a href="https://xmrig.com/download" target="_blank" rel="noopener"
               class="text-pool-primary hover:underline font-semibold">XMRig</a>
            — The most popular and well-maintained CPU miner.
          </p>
          <p class="text-pool-text-dim text-xs">Works on Windows, Linux, and macOS.</p>
        </div>

        <!-- GPU Mining -->
        <div class="bg-pool-bg rounded-lg p-4 border border-pool-border">
          <h3 class="text-pool-text font-semibold mb-2" style="color: var(--pool-ergo)">
            GPU Mining (Ergo)
          </h3>
          <p class="text-pool-text-dim text-sm mb-3">Choose based on your GPU brand:</p>
          <ul class="text-pool-text-dim text-sm space-y-1">
            <li>
              <a href="https://github.com/Lolliedieb/lolMiner/releases" target="_blank" rel="noopener"
                 class="text-pool-primary hover:underline">lolMiner</a>
              — NVIDIA + AMD
            </li>
            <li>
              <a href="https://github.com/trexminer/T-Rex/releases" target="_blank" rel="noopener"
                 class="text-pool-primary hover:underline">T-Rex</a>
              — NVIDIA only
            </li>
            <li>
              <a href="https://github.com/doktor83/SRBMiner-Multi/releases" target="_blank" rel="noopener"
                 class="text-pool-primary hover:underline">SRBMiner-Multi</a>
              — AMD + CPU
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ============================
         STEP 3: CONFIGURE & CONNECT
         ============================ -->
    <section class="bg-pool-card rounded-xl border border-pool-border p-6 mb-6">
      <div class="flex items-center gap-3 mb-4">
        <span class="w-8 h-8 rounded-full bg-pool-primary/20 text-pool-primary flex items-center
                     justify-center text-sm font-bold font-heading">3</span>
        <h2 class="text-pool-text font-heading font-semibold text-lg">Configure & Connect</h2>
      </div>

      <p class="text-pool-text-dim text-sm mb-4">
        Copy one of the commands below, replace <code class="text-pool-primary">YOUR_WALLET_ADDRESS</code>
        with your actual wallet, and run it.
      </p>

      <!-- XMRig (CPU - Monero) -->
      <div class="mb-5">
        <h3 class="text-pool-text font-semibold text-sm mb-2" style="color: var(--pool-xmr)">
          XMRig (CPU → Monero)
        </h3>
        <div class="bg-pool-bg rounded-lg p-4 border border-pool-border font-mono text-xs
                    text-pool-text overflow-x-auto relative group">
          <code>./xmrig -o {{ poolDomain }}:{{ stratumPortCpu }} -u YOUR_WALLET_ADDRESS -p x</code>
          <button
            @click="copyCommand(`./xmrig -o ${poolDomain}:${stratumPortCpu} -u YOUR_WALLET_ADDRESS -p x`)"
            class="absolute top-2 right-2 px-2 py-1 rounded bg-pool-card text-pool-text-dim
                   text-xs opacity-0 group-hover:opacity-100 hover:text-pool-primary
                   transition-all border border-pool-border"
          >
            {{ copied ? '✓ Copied' : 'Copy' }}
          </button>
        </div>
      </div>

      <!-- lolMiner (GPU - Ergo) -->
      <div class="mb-5">
        <h3 class="text-pool-text font-semibold text-sm mb-2" style="color: var(--pool-ergo)">
          lolMiner (GPU → Ergo)
        </h3>
        <div class="bg-pool-bg rounded-lg p-4 border border-pool-border font-mono text-xs
                    text-pool-text overflow-x-auto relative group">
          <code>./lolMiner --algo AUTOLYKOS2 --pool {{ poolDomain }}:{{ stratumPortGpu }} --user YOUR_WALLET_ADDRESS</code>
          <button
            @click="copyCommand(`./lolMiner --algo AUTOLYKOS2 --pool ${poolDomain}:${stratumPortGpu} --user YOUR_WALLET_ADDRESS`)"
            class="absolute top-2 right-2 px-2 py-1 rounded bg-pool-card text-pool-text-dim
                   text-xs opacity-0 group-hover:opacity-100 hover:text-pool-primary
                   transition-all border border-pool-border"
          >
            {{ copied ? '✓ Copied' : 'Copy' }}
          </button>
        </div>
      </div>

      <!-- T-Rex (GPU - Ergo) -->
      <div>
        <h3 class="text-pool-text font-semibold text-sm mb-2" style="color: var(--pool-ergo)">
          T-Rex (NVIDIA GPU → Ergo)
        </h3>
        <div class="bg-pool-bg rounded-lg p-4 border border-pool-border font-mono text-xs
                    text-pool-text overflow-x-auto relative group">
          <code>./t-rex -a autolykos2 -o stratum+tcp://{{ poolDomain }}:{{ stratumPortGpu }} -u YOUR_WALLET_ADDRESS -w worker1</code>
          <button
            @click="copyCommand(`./t-rex -a autolykos2 -o stratum+tcp://${poolDomain}:${stratumPortGpu} -u YOUR_WALLET_ADDRESS -w worker1`)"
            class="absolute top-2 right-2 px-2 py-1 rounded bg-pool-card text-pool-text-dim
                   text-xs opacity-0 group-hover:opacity-100 hover:text-pool-primary
                   transition-all border border-pool-border"
          >
            {{ copied ? '✓ Copied' : 'Copy' }}
          </button>
        </div>
      </div>
    </section>

    <!-- ============================
         STEP 4: CHECK YOUR STATS
         ============================ -->
    <section class="bg-pool-card rounded-xl border border-pool-border p-6">
      <div class="flex items-center gap-3 mb-4">
        <span class="w-8 h-8 rounded-full bg-pool-primary/20 text-pool-primary flex items-center
                     justify-center text-sm font-bold font-heading">4</span>
        <h2 class="text-pool-text font-heading font-semibold text-lg">Check Your Stats</h2>
      </div>

      <p class="text-pool-text-dim text-sm mb-4">
        Once your miner is running, it should show "accepted shares" in the output.
        After a few minutes, you can look up your stats on this site.
      </p>

      <MinerSearch />
    </section>
  </div>
</template>

<script setup lang="ts">
// --- Pool Connection Details ---
// In Phase 4B, these come from pool.config.yml.
// For now, they're sensible defaults matching your docker-compose.
const poolDomain = 'pool.example.com'
const stratumPortCpu = 3333
const stratumPortGpu = 3052

// --- Copy to Clipboard ---
const copied = ref(false)

async function copyCommand(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Fallback for older browsers
    const el = document.createElement('textarea')
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}

useHead({ title: 'Getting Started — Community Mining Pool' })
</script>