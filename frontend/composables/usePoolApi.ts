// ============================================================
// usePoolApi — MiningCore API Wrapper
//
// This composable is the single source of truth for ALL data
// fetching from the MiningCore REST API. Every page and
// component calls these functions instead of making raw
// HTTP requests.
//
// WHY A COMPOSABLE?
// In Vue/Nuxt, a "composable" is a reusable function that
// can hold reactive state. Think of it like a shared utility
// that any component can import and use.
//
// USAGE IN A COMPONENT:
//   const { pools, fetchPools, loading, error } = usePoolApi()
//   await fetchPools()
//   // Now `pools.value` has the data
// ============================================================

// --- Type Definitions ---
// These describe the shape of data coming from MiningCore's API.
// TypeScript will warn you if you try to access a field that
// doesn't exist, which prevents bugs.

export interface PoolInfo {
  id: string
  coin: {
    type: string
    name: string
    symbol: string
    algorithm: string
  }
  ports: Record<string, {
    listenAddress: string
    difficulty: number
    varDiff: {
      minDiff: number
      maxDiff: number
      targetTime: number
    } | null
  }>
  paymentProcessing: {
    enabled: boolean
    minimumPayment: number
  }
  poolStats: {
    connectedMiners: number
    poolHashrate: number
    sharesPerSecond: number
  }
  networkStats: {
    networkHashrate: number
    networkDifficulty: number
    blockHeight: number
    connectedPeers: number
  }
  poolFeePercent: number
  totalPaid: number
  totalBlocks: number
  lastPoolBlockTime: string | null
}

export interface PoolPerformanceSample {
  created: string
  poolHashrate: number
  connectedMiners: number
}

export interface MinerStats {
  pendingShares: number
  pendingBalance: number
  totalPaid: number
  todayPaid: number
  lastPayment: string | null
  lastPaymentLink: string | null
  performance: {
    created: string
    workers: Record<string, {
      hashrate: number
      sharesPerSecond: number
    }>
  }
}

export interface MinerPerformanceSample {
  created: string
  workers: Record<string, {
    hashrate: number
    sharesPerSecond: number
  }>
}

export interface Block {
  blockHeight: number
  status: string          // "confirmed", "pending", "orphaned"
  confirmationProgress: number
  effort: number          // Luck percentage (1.0 = expected, 0.5 = lucky, 2.0 = unlucky)
  transactionConfirmationData: string
  reward: number
  infoLink: string | null
  hash: string | null
  miner: string
  source: string
  created: string
}

export interface Payment {
  coin: string
  address: string
  amount: number
  transactionConfirmationData: string
  created: string
}

// --- The Composable ---

export const usePoolApi = () => {
  // Get the API URL from Nuxt runtime config (set in nuxt.config.ts)
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl as string

  // Reactive state — shared across all components using this composable
  const loading = ref(false)
  const error = ref<string | null>(null)

  // --- Helper: Make an API request ---
  // Wraps $fetch (Nuxt's built-in HTTP client) with loading/error state
  async function apiFetch<T>(endpoint: string): Promise<T | null> {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch<T>(`${apiUrl}${endpoint}`)
      return data
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch data from pool API'
      console.error(`[usePoolApi] Error fetching ${endpoint}:`, err)
      return null
    } finally {
      loading.value = false
    }
  }

  // ===========================================
  // PUBLIC API METHODS
  // Each method maps to one MiningCore endpoint
  // ===========================================

  /**
   * GET /api/pools
   * Returns all pools with current stats (hashrate, miners, blocks, fee).
   * This is the main endpoint for the homepage.
   */
 async function fetchPools(): Promise<PoolInfo[] | null> {
    const data = await apiFetch<{ pools: PoolInfo[] }>('/pools')
    return data?.pools ?? null
  }

  /**
   * GET /api/pools/{poolId}/performance
   * Returns hashrate samples over time for charts.
   * @param poolId - e.g., "xmr1" or "ergo1"
   */
  async function fetchPoolPerformance(poolId: string): Promise<{ stats: PoolPerformanceSample[] } | null> {
    const data = await apiFetch<{ stats: PoolPerformanceSample[] }>(`/pools/${poolId}/performance`)
    return data ?? null
  }

  /**
   * GET /api/pools/{poolId}/miners/{address}
   * Returns stats for a single miner (hashrate, balance, shares).
   * @param poolId - e.g., "xmr1"
   * @param address - Miner's wallet address
   */
  async function fetchMinerStats(poolId: string, address: string): Promise<MinerStats | null> {
    return apiFetch(`/pools/${poolId}/miners/${address}`)
  }

  /**
   * GET /api/pools/{poolId}/miners/{address}/performance
   * Returns miner hashrate over time for charts.
   */
  async function fetchMinerPerformance(poolId: string, address: string): Promise<{ stats: MinerPerformanceSample[] } | null> {
    return apiFetch(`/pools/${poolId}/miners/${address}/performance`)
  }

  /**
   * GET /api/pools/{poolId}/miners/{address}/payments
   * Returns payment history for a miner.
   */
  async function fetchMinerPayments(poolId: string, address: string): Promise<Payment[] | null> {
    return apiFetch(`/pools/${poolId}/miners/${address}/payments`)
  }

  /**
   * GET /api/pools/{poolId}/blocks
   * Returns block history with pagination.
   * @param page - Page number (0-indexed)
   * @param pageSize - Blocks per page (default 20)
   */
  async function fetchBlocks(poolId: string, page = 0, pageSize = 20): Promise<Block[] | null> {
    return apiFetch(`/pools/${poolId}/blocks?page=${page}&pageSize=${pageSize}`)
  }

  /**
   * GET /api/pools/{poolId}/payments
   * Returns all pool payments with pagination.
   */
  async function fetchPayments(poolId: string, page = 0, pageSize = 20): Promise<Payment[] | null> {
    return apiFetch(`/pools/${poolId}/payments?page=${page}&pageSize=${pageSize}`)
  }

  // Return everything components need
  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchPools,
    fetchPoolPerformance,
    fetchMinerStats,
    fetchMinerPerformance,
    fetchMinerPayments,
    fetchBlocks,
    fetchPayments,
  }
}