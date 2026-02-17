<!--
  NAVBAR COMPONENT
  
  Reads pool name and page toggles from pool.config.yml via usePoolConfig().
  Only shows navigation links for pages that are enabled in the config.
  
  Communities change their pool name in pool.config.yml → it updates here
  automatically. They can also hide pages they don't want (e.g., leaderboard).
-->

<template>
  <nav class="bg-pool-card border-b border-pool-border sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <!-- Logo + Pool Name -->
        <NuxtLink to="/" class="flex items-center space-x-3 group">
          <!-- Show logo if configured, otherwise show a pickaxe icon -->
          <img
            v-if="config?.pool?.logo"
            :src="config.pool.logo"
            :alt="poolName"
            class="h-8 w-8 rounded"
            @error="logoError = true"
          />
          <div
            v-if="!config?.pool?.logo || logoError"
            class="h-8 w-8 rounded bg-pool-primary/20 flex items-center justify-center"
          >
            <span class="text-pool-primary text-lg">⛏</span>
          </div>
          <span class="text-lg font-bold font-heading text-pool-text group-hover:text-pool-primary transition-colors">
            {{ poolName }}
          </span>
        </NuxtLink>

        <!-- Desktop Navigation Links -->
        <div class="hidden md:flex items-center space-x-1">
          <NuxtLink
            v-for="link in visibleLinks"
            :key="link.to"
            :to="link.to"
            class="px-3 py-2 rounded-pool text-sm font-medium text-pool-text-dim hover:text-pool-text hover:bg-pool-bg transition-colors"
            active-class="!text-pool-primary !bg-pool-primary/10"
          >
            {{ link.label }}
          </NuxtLink>

          <!-- Discord invite link (if configured) -->
          <a
            v-if="config?.discord?.enabled && config?.discord?.invite_url"
            :href="config.discord.invite_url"
            target="_blank"
            rel="noopener noreferrer"
            class="px-3 py-2 rounded-pool text-sm font-medium text-pool-secondary hover:text-pool-text hover:bg-pool-bg transition-colors"
          >
            Discord
          </a>
        </div>

        <!-- Mobile menu button -->
        <button
          class="md:hidden p-2 rounded-pool text-pool-text-dim hover:text-pool-text hover:bg-pool-bg transition-colors"
          @click="mobileMenuOpen = !mobileMenuOpen"
          aria-label="Toggle navigation menu"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              v-if="!mobileMenuOpen"
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="mobileMenuOpen" class="md:hidden pb-4 space-y-1">
        <NuxtLink
          v-for="link in visibleLinks"
          :key="link.to"
          :to="link.to"
          class="block px-3 py-2 rounded-pool text-sm font-medium text-pool-text-dim hover:text-pool-text hover:bg-pool-bg transition-colors"
          active-class="!text-pool-primary !bg-pool-primary/10"
          @click="mobileMenuOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { config, poolName, isPageEnabled } = usePoolConfig()

const mobileMenuOpen = ref(false)
const logoError = ref(false)

// All possible nav links — filtered by page toggles from config
const allLinks = [
  { to: '/', label: 'Dashboard', page: 'home' as const },
  { to: '/blocks', label: 'Blocks', page: 'blocks' as const },
  { to: '/getting-started', label: 'Get Started', page: 'getting_started' as const },
  { to: '/goals', label: 'Goals', page: 'goals' as const },
]

// Only show links for pages that are enabled in pool.config.yml
const visibleLinks = computed(() => {
  return allLinks.filter((link) => {
    // Dashboard (home) is always shown
    if (link.page === 'home') return true
    return isPageEnabled(link.page)
  })
})
</script>