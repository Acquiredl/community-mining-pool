<!--
  COIN CARD COMPONENT
  Displays stats for a single coin (Monero, Ergo, etc.)
  with the coin's brand color as an accent.

  USAGE:
    <CoinCard :pool="poolData" coin-color="#FF6600" coin-label="CPU Mining" />
-->

<template>
  <div
    class="bg-pool-card rounded-xl border border-pool-border p-5 relative overflow-hidden"
  >
    <!-- Colored accent bar at top -->
    <div
      class="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
      :style="{ backgroundColor: coinColor }"
    />

    <!-- Coin header -->
    <div class="flex items-center justify-between mb-4 pt-1">
      <div>
        <h3 class="text-pool-text font-heading font-semibold text-lg">
          {{ pool.coin.name }}
        </h3>
        <span class="text-pool-text-dim text-xs uppercase tracking-wider">
          {{ pool.coin.symbol }} · {{ coinLabel }}
        </span>
      </div>

      <!-- Online/offline indicator -->
      <div class="flex items-center gap-1.5">
        <span
          class="w-2 h-2 rounded-full"
          :class="pool.poolStats.connectedMiners > 0
            ? 'bg-pool-success animate-pulse'
            : 'bg-pool-text-dim'"
        />
        <span class="text-xs text-pool-text-dim">
          {{ pool.poolStats.connectedMiners > 0 ? 'Online' : 'Idle' }}
        </span>
      </div>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-2 gap-3">
      <div>
        <p class="text-pool-text-dim text-xs">Hashrate</p>
        <p class="text-pool-text font-semibold">
          {{ formatHashrate(pool.poolStats.poolHashrate) }}
        </p>
      </div>
      <div>
        <p class="text-pool-text-dim text-xs">Miners</p>
        <p class="text-pool-text font-semibold">
          {{ pool.poolStats.connectedMiners }}
        </p>
      </div>
      <div>
        <p class="text-pool-text-dim text-xs">Blocks Found</p>
        <p class="text-pool-text font-semibold">
          {{ pool.totalBlocks }}
        </p>
      </div>
      <div>
        <p class="text-pool-text-dim text-xs">Last Block</p>
        <p class="text-pool-text font-semibold">
          {{ timeAgo(pool.lastPoolBlockTime) }}
        </p>
      </div>
      <div>
        <p class="text-pool-text-dim text-xs">Network Hashrate</p>
        <p class="text-pool-text font-semibold">
          {{ formatHashrate(pool.networkStats.networkHashrate) }}
        </p>
      </div>
      <div>
        <p class="text-pool-text-dim text-xs">Pool Fee</p>
        <p class="text-pool-text font-semibold">
          {{ pool.poolFeePercent }}%
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PoolInfo } from '~/composables/usePoolApi'

defineProps<{
  pool: PoolInfo
  coinColor: string
  coinLabel: string
}>()

const { formatHashrate, timeAgo } = useFormatters()
</script>