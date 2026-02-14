<!--
  MINER SEARCH COMPONENT
  Input field where miners paste their wallet address to look up stats.
  On submit, navigates to /miners/{address}.
-->

<template>
  <div class="bg-pool-card rounded-xl border border-pool-border p-5">
    <h3 class="text-pool-text font-heading font-semibold mb-3">
      Check Your Stats
    </h3>
    <p class="text-pool-text-dim text-sm mb-4">
      Enter your wallet address to view your hashrate, balance, and payment history.
    </p>

    <div class="flex gap-2">
      <input
        v-model="address"
        type="text"
        placeholder="Your wallet address (e.g., 4ABCD...)"
        class="flex-1 bg-pool-bg border border-pool-border rounded-lg px-4 py-2.5
               text-pool-text text-sm placeholder-pool-text-dim
               focus:outline-none focus:border-pool-primary focus:ring-1 focus:ring-pool-primary/50
               transition-colors"
        @keyup.enter="lookupMiner"
      />
      <button
        @click="lookupMiner"
        :disabled="!address.trim()"
        class="px-5 py-2.5 bg-pool-primary text-white text-sm font-medium rounded-lg
               hover:bg-pool-primary/80 disabled:opacity-40 disabled:cursor-not-allowed
               transition-colors"
      >
        Look Up
      </button>
    </div>

    <p v-if="errorMsg" class="text-pool-danger text-xs mt-2">
      {{ errorMsg }}
    </p>
  </div>
</template>

<script setup lang="ts">
const address = ref('')
const errorMsg = ref('')
const router = useRouter()

function lookupMiner() {
  const trimmed = address.value.trim()

  if (!trimmed) {
    errorMsg.value = 'Please enter a wallet address'
    return
  }

  if (trimmed.length < 20) {
    errorMsg.value = 'That doesn\'t look like a valid wallet address'
    return
  }

  errorMsg.value = ''
  router.push(`/miners/${trimmed}`)
}
</script>