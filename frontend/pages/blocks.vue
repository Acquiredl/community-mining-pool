<!--
  BLOCKS PAGE (pages/blocks.vue)
  
  Shows the pool's block history — proof that mining is working.
  Each row shows block height, status, effort (luck), reward,
  and which miner found it.
-->

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-heading font-bold text-pool-text">Blocks Found</h1>
      <p class="text-pool-text-dim text-sm mt-1">
        Block history across all coins mined by this pool.
      </p>
    </div>

    <!-- Pool Tabs -->
    <div v-if="pools && pools.length > 1" class="flex gap-2 mb-6">
      <button
        v-for="pool in pools"
        :key="pool.id"
        @click="selectPool(pool.id)"
        class="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
        :class="selectedPoolId === pool.id
          ? 'bg-pool-primary/10 border-pool-primary text-pool-primary'
          : 'bg-pool-card border-pool-border text-pool-text-dim hover:text-pool-text'"
      >
        {{ pool.coin.symbol }} ({{ pool.totalBlocks }} blocks)
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20 text-pool-text-dim">
      Loading blocks...
    </div>

    <!-- Blocks Table -->
    <div v-else-if="blocks && blocks.length > 0"
      class="bg-pool-card rounded-xl border border-pool-border overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-pool-text-dim text-xs uppercase tracking-wider bg-pool-bg/50">
              <th class="text-left px-5 py-3 font-medium">Height</th>
              <th class="text-left px-5 py-3 font-medium">Status</th>
              <th class="text-right px-5 py-3 font-medium">Effort</th>
              <th class="text-right px-5 py-3 font-medium">Reward</th>
              <th class="text-left px-5 py-3 font-medium">Miner</th>
              <th class="text-right px-5 py-3 font-medium">Found</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="block in blocks"
              :key="`${block.blockHeight}-${block.created}`"
              class="border-t border-pool-border/50 hover:bg-pool-bg/30 transition-colors"
            >
              <!-- Block Height -->
              <td class="px-5 py-3.5 font-mono text-pool-text">
                {{ formatNumber(block.blockHeight) }}
              </td>

              <!-- Status Badge -->
              <td class="px-5 py-3.5">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="statusClass(block.status)"
                >
                  {{ block.status }}
                </span>
              </td>

              <!-- Effort (Luck) -->
              <td class="px-5 py-3.5 text-right">
                <span :class="`text-${formatEffort(block.effort).color}`">
                  {{ formatEffort(block.effort).text }}
                </span>
              </td>

              <!-- Reward -->
              <td class="px-5 py-3.5 text-right font-mono text-pool-text">
                {{ block.reward > 0 ? block.reward.toFixed(4) : '—' }}
              </td>

              <!-- Miner (truncated address) -->
              <td class="px-5 py-3.5 font-mono text-xs text-pool-text-dim">
                <NuxtLink
                  :to="`/miners/${block.miner}`"
                  class="hover:text-pool-primary transition-colors"
                >
                  {{ truncateAddress(block.miner, 6) }}
                </NuxtLink>
              </td>

              <!-- Time Found -->
              <td class="px-5 py-3.5 text-right text-pool-text-dim">
                {{ timeAgo(block.created) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between px-5 py-4 border-t border-pool-border">
        <p class="text-pool-text-dim text-sm">
          Page {{ currentPage + 1 }}
        </p>
        <div class="flex gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 0"
            class="px-3 py-1.5 text-sm rounded-lg border border-pool-border text-pool-text-dim
                   hover:text-pool-text hover:bg-pool-bg transition-colors
                   disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="blocks.length < pageSize"
            class="px-3 py-1.5 text-sm rounded-lg border border-pool-border text-pool-text-dim
                   hover:text-pool-text hover:bg-pool-bg transition-colors
                   disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- No blocks -->
    <div v-else class="bg-pool-card rounded-xl border border-pool-border p-8 text-center">
      <p class="text-pool-text-dim">No blocks found yet. Keep mining!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PoolInfo, Block } from '~/composables/usePoolApi'

const { formatNumber, formatEffort, truncateAddress, timeAgo } = useFormatters()
const { fetchPools, fetchBlocks } = usePoolApi()

// --- State ---
const pools = ref<PoolInfo[] | null>(null)
const blocks = ref<Block[] | null>(null)
const selectedPoolId = ref('')
const currentPage = ref(0)
const pageSize = 20
const loading = ref(true)

// --- Status badge colors ---
function statusClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'bg-pool-success/10 text-pool-success'
    case 'pending':
      return 'bg-pool-warning/10 text-pool-warning'
    case 'orphaned':
      return 'bg-pool-danger/10 text-pool-danger'
    default:
      return 'bg-pool-card text-pool-text-dim'
  }
}

// --- Load blocks ---
async function loadBlocks() {
  if (!selectedPoolId.value) return
  loading.value = true
  const data = await fetchBlocks(selectedPoolId.value, currentPage.value, pageSize)
  blocks.value = data
  loading.value = false
}

function selectPool(poolId: string) {
  selectedPoolId.value = poolId
  currentPage.value = 0
  loadBlocks()
}

function nextPage() {
  currentPage.value++
  loadBlocks()
}

function prevPage() {
  if (currentPage.value > 0) {
    currentPage.value--
    loadBlocks()
  }
}

// --- Initial Load ---
onMounted(async () => {
  const poolsData = await fetchPools()
  if (poolsData && poolsData.length > 0) {
    pools.value = poolsData
    selectedPoolId.value = poolsData[0].id
    await loadBlocks()
  } else {
    loading.value = false
  }
})

useHead({ title: 'Blocks — Community Mining Pool' })
</script>