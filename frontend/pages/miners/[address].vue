<!--
  MINER DASHBOARD (pages/miners/[address].vue)
  
  Dynamic route — the wallet address comes from the URL.
  Example: /miners/4ABCD1234... → route.params.address = "4ABCD1234..."

  Displays:
  - Current hashrate & worker count
  - Hashrate chart (last 24h)
  - Pending balance & total paid
  - Share stats (valid/invalid/stale)
  - Worker list with individual hashrates
  - Payment history table
-->

<template>
  <div>
    <!-- Back link + address header -->
    <div class="mb-6">
      <NuxtLink
        to="/"
        class="text-pool-text-dim text-sm hover:text-pool-primary transition-colors"
      >
        ← Back to Dashboard
      </NuxtLink>

      <h1 class="text-2xl font-heading font-bold text-pool-text mt-3">
        Miner Stats
      </h1>
      <p class="text-pool-text-dim text-sm mt-1 font-mono break-all">
        {{ address }}
      </p>
    </div>

    <!-- Pool selector (if multiple pools) -->
    <div v-if="pools && pools.length > 1" class="flex gap-2 mb-6">
      <button
        v-for="pool in pools"
        :key="pool.id"
        @click="selectedPoolId = pool.id"
        class="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
        :class="selectedPoolId === pool.id
          ? 'bg-pool-primary/10 border-pool-primary text-pool-primary'
          : 'bg-pool-card border-pool-border text-pool-text-dim hover:text-pool-text'"
      >
        {{ pool.coin.symbol }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-pool-text-dim">Loading miner stats...</div>
    </div>

    <!-- Miner Not Found -->
    <div v-else-if="notFound" class="bg-pool-card rounded-xl border border-pool-border p-8 text-center">
      <p class="text-pool-text text-lg font-semibold mb-2">Miner Not Found</p>
      <p class="text-pool-text-dim text-sm">
        No stats found for this address on the
        <strong class="text-pool-text">{{ selectedPoolId }}</strong> pool.
        <br />
        Make sure your miner is connected and has submitted shares.
      </p>
    </div>

    <!-- Miner Data Loaded -->
    <div v-else-if="minerStats">

      <!-- ============================
           ROW 1: Key Stats
           ============================ -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Current Hashrate"
          :value="currentHashrate"
        />
        <StatCard
          label="Active Workers"
          :value="workerCount"
        />
        <StatCard
          label="Pending Balance"
          :value="formatCoin(minerStats.pendingBalance, coinSymbol)"
        />
        <StatCard
          label="Total Paid"
          :value="formatCoin(minerStats.totalPaid, coinSymbol)"
        />
      </div>

      <!-- ============================
           ROW 2: Hashrate Chart
           ============================ -->
      <div class="mb-8">
        <HashrateChart
          title="Your Hashrate (24h)"
          :labels="chartLabels"
          :data="chartData"
          :format-value="formatHashrate"
          :color="getCoinColor(coinSymbol)"
        />
      </div>

      <!-- ============================
           ROW 3: Workers Table
           ============================ -->
      <div v-if="workers.length > 0" class="bg-pool-card rounded-xl border border-pool-border p-5 mb-8">
        <h3 class="text-pool-text font-heading font-semibold mb-4">Workers</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-pool-text-dim text-xs uppercase tracking-wider border-b border-pool-border">
                <th class="text-left pb-3 font-medium">Worker</th>
                <th class="text-right pb-3 font-medium">Hashrate</th>
                <th class="text-right pb-3 font-medium">Shares/s</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="worker in workers"
                :key="worker.name"
                class="border-b border-pool-border/50 last:border-0"
              >
                <td class="py-3 text-pool-text font-mono text-xs">{{ worker.name }}</td>
                <td class="py-3 text-pool-text text-right">{{ formatHashrate(worker.hashrate) }}</td>
                <td class="py-3 text-pool-text-dim text-right">{{ worker.sharesPerSecond.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ============================
           ROW 4: Payment History
           ============================ -->
      <div class="bg-pool-card rounded-xl border border-pool-border p-5">
        <h3 class="text-pool-text font-heading font-semibold mb-4">Payment History</h3>

        <div v-if="payments && payments.length > 0" class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-pool-text-dim text-xs uppercase tracking-wider border-b border-pool-border">
                <th class="text-left pb-3 font-medium">Date</th>
                <th class="text-right pb-3 font-medium">Amount</th>
                <th class="text-right pb-3 font-medium">Tx Hash</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="payment in payments"
                :key="payment.transactionConfirmationData"
                class="border-b border-pool-border/50 last:border-0"
              >
                <td class="py-3 text-pool-text-dim">{{ formatDate(payment.created) }}</td>
                <td class="py-3 text-pool-text text-right font-mono">
                  {{ formatCoin(payment.amount, coinSymbol) }}
                </td>
                <td class="py-3 text-pool-text-dim text-right font-mono text-xs">
                  {{ truncateAddress(payment.transactionConfirmationData, 10) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-else class="text-pool-text-dim text-sm">
          No payments yet. Keep mining!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PoolInfo, MinerStats, MinerPerformanceSample, Payment } from '~/composables/usePoolApi'

// --- Route Params ---
const route = useRoute()
const address = route.params.address as string

// --- Formatters ---
const {
  formatHashrate, formatCoin, formatDate,
  truncateAddress, timeAgo,
} = useFormatters()

// --- API ---
const {
  fetchPools, fetchMinerStats, fetchMinerPerformance, fetchMinerPayments,
} = usePoolApi()

// --- State ---
const pools = ref<PoolInfo[] | null>(null)
const selectedPoolId = ref('')
const minerStats = ref<MinerStats | null>(null)
const performanceData = ref<MinerPerformanceSample[]>([])
const payments = ref<Payment[] | null>(null)
const loading = ref(true)
const notFound = ref(false)

// --- Computed ---
const coinSymbol = computed(() => {
  const pool = pools.value?.find(p => p.id === selectedPoolId.value)
  return pool?.coin.symbol || 'XMR'
})

const currentHashrate = computed(() => {
  if (!minerStats.value?.performance?.workers) return '0 H/s'
  const total = Object.values(minerStats.value.performance.workers)
    .reduce((sum, w) => sum + w.hashrate, 0)
  return formatHashrate(total)
})

const workerCount = computed(() => {
  if (!minerStats.value?.performance?.workers) return 0
  return Object.keys(minerStats.value.performance.workers).length
})

const workers = computed(() => {
  if (!minerStats.value?.performance?.workers) return []
  return Object.entries(minerStats.value.performance.workers).map(([name, stats]) => ({
    name,
    hashrate: stats.hashrate,
    sharesPerSecond: stats.sharesPerSecond,
  }))
})

// --- Chart Data ---
const chartLabels = computed(() =>
  performanceData.value.map(s => {
    const d = new Date(s.created)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  })
)

const chartData = computed(() =>
  performanceData.value.map(s => {
    const workers = s.workers || {}
    return Object.values(workers).reduce((sum, w) => sum + w.hashrate, 0)
  })
)

function getCoinColor(symbol: string): string {
  const colors: Record<string, string> = { XMR: '#FF6600', ERG: '#00B2FF' }
  return colors[symbol.toUpperCase()] || '#8B5CF6'
}

// --- Load miner data for the selected pool ---
async function loadMinerData() {
  if (!selectedPoolId.value) return

  loading.value = true
  notFound.value = false

  try {
    const stats = await fetchMinerStats(selectedPoolId.value, address)

    if (!stats) {
      notFound.value = true
      minerStats.value = null
      return
    }

    minerStats.value = stats

    // Fetch performance (for chart)
    const perf = await fetchMinerPerformance(selectedPoolId.value, address)
    if (perf?.stats) {
      performanceData.value = perf.stats
    }

    // Fetch payments
    const pay = await fetchMinerPayments(selectedPoolId.value, address)
    if (pay) {
      payments.value = pay
    }
  } catch (err) {
    console.error('[MinerDashboard] Error:', err)
    notFound.value = true
  } finally {
    loading.value = false
  }
}

// --- Watch for pool selection change ---
watch(selectedPoolId, () => {
  loadMinerData()
})

// --- Initial Load ---
onMounted(async () => {
  const poolsData = await fetchPools()
  if (poolsData && poolsData.length > 0) {
    pools.value = poolsData
    selectedPoolId.value = poolsData[0].id
    // loadMinerData() fires via the watcher above
  } else {
    loading.value = false
  }
})

// --- Page Meta ---
useHead({
  title: `Miner ${address.slice(0, 8)}... — Stats`,
})
</script>