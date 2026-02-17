<!--
  COIN CARD COMPONENT
  
  Displays stats for a single coin (XMR or ERG).
  Reads display name, ticker, algorithm, and brand color from
  pool.config.yml via usePoolConfig().
  
  Props:
    poolId   — The MiningCore pool ID (e.g., "monero1", "ergo1")
    hashrate — Current pool hashrate for this coin
    miners   — Number of active miners
    blocks   — Blocks found (24h or all time)
    
  Usage:
    <CoinCard pool-id="monero1" :hashrate="123456" :miners="5" :blocks="12" />
-->

<template>
  <div
    class="bg-pool-card border border-pool-border rounded-pool p-6 transition-all duration-300 hover:border-opacity-50"
    :class="{ 'shadow-pool-glow-sm': theme?.glow_effects }"
    :style="{ borderColor: coinColor + '30' }"
  >
    <!-- Header: Icon + Name -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <!-- Coin icon badge -->
        <div
          class="h-10 w-10 rounded-pool flex items-center justify-center text-lg"
          :style="{ backgroundColor: coinColor + '20', color: coinColor }"
        >
          {{ coinConfig?.icon === 'cpu' ? '🖥️' : coinConfig?.icon === 'gpu' ? '🎮' : '⛏️' }}
        </div>
        <div>
          <h3 class="font-heading font-semibold text-pool-text">
            {{ coinConfig?.display_name || poolId }}
          </h3>
          <p class="text-xs text-pool-text-dim">
            {{ coinConfig?.ticker || '' }}
            <span v-if="coinConfig?.algo"> · {{ coinConfig.algo }}</span>
          </p>
        </div>
      </div>

      <!-- Explorer link -->
      <a
        v-if="coinConfig?.explorer_url"
        :href="coinConfig.explorer_url"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs text-pool-text-dim hover:text-pool-primary transition-colors"
        title="Block Explorer"
      >
        Explorer ↗
      </a>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-3 gap-4">
      <div>
        <p class="text-xs text-pool-text-dim uppercase tracking-wide">Hashrate</p>
        <p class="text-lg font-semibold text-pool-text font-heading">
          {{ formattedHashrate }}
        </p>
      </div>
      <div>
        <p class="text-xs text-pool-text-dim uppercase tracking-wide">Miners</p>
        <p class="text-lg font-semibold text-pool-text font-heading">
          {{ miners }}
        </p>
      </div>
      <div>
        <p class="text-xs text-pool-text-dim uppercase tracking-wide">Blocks</p>
        <p class="text-lg font-semibold text-pool-text font-heading">
          {{ blocks }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  poolId: string
  hashrate: number
  miners: number
  blocks: number
}>()

const { getCoin, theme } = usePoolConfig()
const { formatHashrate } = useFormatters()

// Pull coin config from pool.config.yml
const coinConfig = computed(() => getCoin(props.poolId))
const coinColor = computed(() => coinConfig.value?.color || '#8B5CF6')

const formattedHashrate = computed(() => formatHashrate(props.hashrate))
</script>