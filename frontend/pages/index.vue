<!--
  HOME PAGE (pages/index.vue)
  
  The landing page miners see first. Displays:
  - Overall pool stats (miners, hashrate, blocks)
  - Per-coin cards (XMR, ERG)
  - Hashrate chart (last 24h)
  - Miner wallet lookup

  All data comes from the MiningCore API via usePoolApi().
-->

<template>
  <div>
    <!-- Page Title -->
    <div class="mb-8">
      <h1 class="text-3xl font-heading font-bold text-pool-text">
        {{ poolName }}
      </h1>
      <p class="text-pool-text-dim mt-1">
        Mining for the community — pool stats at a glance.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center py-20">
      <div class="text-pool-text-dim">Loading pool stats...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="fetchError" class="bg-pool-danger/10 border border-pool-danger/30 rounded-xl p-6 text-center">
      <p class="text-pool-danger font-semibold mb-2">Unable to reach pool API</p>
      <p class="text-pool-text-dim text-sm">
        Make sure MiningCore is running on port 4000.
        <br />
        <code class="text-pool-text text-xs">{{ apiUrl }}/pools</code>
      </p>
    </div>

    <!-- Pool Data Loaded -->
    <div v-else-if="pools && pools.length > 0">

      <!-- ============================
           ROW 1: Overview Stat Cards
           ============================ -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Miners"
          :value="totalMiners"
        />
        <StatCard
          label="Combined Hashrate"
          :value="formatHashrate(totalHashrate)"
        />
        <StatCard
          label="Blocks Found"
          :value="totalBlocks"
        />
        <StatCard
          label="Last Block"
          :value="lastBlockTime"
        />
      </div>

      <!-- ============================
           ROW 2: Per-Coin Cards
           ============================ -->
      <div class="grid md:grid-cols-2 gap-4 mb-8">
        <CoinCard
          v-for="pool in pools"
          :key="pool.id"
          :pool="pool"
          :coin-color="getCoinColor(pool.coin.symbol)"
          :coin-label="getCoinLabel(pool.coin.algorithm)"
        />
      </div>

      <!-- ============================
           ROW 3: Hashrate Chart
           ============================ -->
      <div class="mb-8">
        <HashrateChart
          title="Pool Hashrate (24h)"
          :labels="chartLabels"
          :data="chartData"
          :format-value="formatHashrate"
        />
      </div>

      <!-- ============================
           ROW 4: Miner Lookup
           ============================ -->
      <MinerSearch />
    </div>

    <!-- No pools configured -->
    <div v-else class="text-center py-20 text-pool-text-dim">
      <p class="text-xl mb-2">No pools configured</p>
      <p class="text-sm">Check your MiningCore config.json</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PoolInfo, PoolPerformanceSample } from '~/composables/usePoolApi'

// --- Config ---
const runtimeConfig = useRuntimeConfig()
const poolName = runtimeConfig.public.poolName as string
const apiUrl = runtimeConfig.public.apiUrl as string

// --- Formatters ---
const { formatHashrate, timeAgo } = useFormatters()

// --- API ---
const { fetchPools, fetchPoolPerformance } = usePoolApi()

// --- State ---
const pools = ref<PoolInfo[] | null>(null)
const performanceData = ref<PoolPerformanceSample[]>([])
const pending = ref(true)
const fetchError = ref(false)

// --- Computed Stats ---
// Add up stats from all pools (XMR + ERG)
const totalMiners = computed(() =>
  pools.value?.reduce((sum, p) => sum + p.poolStats.connectedMiners, 0) ?? 0
)

const totalHashrate = computed(() =>
  pools.value?.reduce((sum, p) => sum + p.poolStats.poolHashrate, 0) ?? 0
)

const totalBlocks = computed(() =>
  pools.value?.reduce((sum, p) => sum + p.totalBlocks, 0) ?? 0
)

const lastBlockTime = computed(() => {
  if (!pools.value) return 'Never'
  // Find the most recent block across all pools
  const times = pools.value
    .map(p => p.lastPoolBlockTime)
    .filter(Boolean)
    .sort()
    .reverse()
  return times.length > 0 ? timeAgo(times[0]!) : 'Never'
})

// --- Chart Data ---
// Format performance samples into labels + data arrays for Chart.js
const chartLabels = computed(() =>
  performanceData.value.map(s => {
    const d = new Date(s.created)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  })
)

const chartData = computed(() =>
  performanceData.value.map(s => s.poolHashrate)
)

// --- Coin Display Helpers ---
// Map coin symbols to their brand colors
function getCoinColor(symbol: string): string {
  const colors: Record<string, string> = {
    XMR: '#FF6600',
    ERG: '#00B2FF',
  }
  return colors[symbol.toUpperCase()] || '#8B5CF6'
}

// Map mining algorithms to hardware type
function getCoinLabel(algorithm: string): string {
  const labels: Record<string, string> = {
    randomx: 'CPU Mining',
    autolykos: 'GPU Mining',
    'autolykos-v2': 'GPU Mining',
    ethash: 'GPU Mining',
    etchash: 'GPU Mining',
    kawpow: 'GPU Mining',
    scrypt: 'ASIC Mining',
  }
  return labels[algorithm.toLowerCase()] || 'Mining'
}

// --- Fetch Data on Page Load ---
onMounted(async () => {
  try {
    const poolsData = await fetchPools()

    if (!poolsData || poolsData.length === 0) {
      pools.value = []
      return
    }

    pools.value = poolsData

    // Fetch performance data for the first pool (for the chart)
    // In a fuller implementation, you'd combine data from all pools
    const perf = await fetchPoolPerformance(poolsData[0].id)
    if (perf?.stats) {
      performanceData.value = perf.stats
    }
  } catch (err) {
    console.error('[Home] Failed to load pool data:', err)
    fetchError.value = true
  } finally {
    pending.value = false
  }
})

// --- Page Meta ---
useHead({
  title: `${poolName} — Dashboard`,
})
</script>