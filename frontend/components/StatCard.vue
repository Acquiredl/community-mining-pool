<!--
  STAT CARD COMPONENT
  A simple card displaying a single statistic.

  USAGE:
    <StatCard label="Active Miners" value="12" />
    <StatCard label="Pool Hashrate" value="4.5 MH/s" sub="Last 24h average" />
-->

<template>
  <div class="bg-pool-card rounded-xl border border-pool-border p-5
              hover:border-pool-primary/30 transition-colors">
    <p class="text-pool-text-dim text-xs font-medium uppercase tracking-wider mb-1">
      {{ label }}
    </p>
    <p class="text-pool-text text-2xl font-heading font-semibold">
      {{ value }}
    </p>
    <p v-if="sub" class="text-pool-text-dim text-xs mt-1">
      {{ sub }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  sub?: string
}>()
</script>