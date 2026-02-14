<!--
  NAVBAR COMPONENT
  Top navigation bar shown on every page.
-->

<template>
  <nav class="border-b border-pool-border bg-pool-card/50 backdrop-blur-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <!-- Logo + Pool Name -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-8 h-8 rounded-lg bg-pool-primary/20 flex items-center justify-center
                      group-hover:bg-pool-primary/30 transition-colors">
            <span class="text-pool-primary text-lg">⛏</span>
          </div>
          <span class="font-heading font-semibold text-lg text-pool-text">
            {{ poolName }}
          </span>
        </NuxtLink>

        <!-- Desktop Navigation Links -->
        <div class="hidden md:flex items-center gap-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="[
              isActive(link.to)
                ? 'text-pool-primary bg-pool-primary/10'
                : 'text-pool-text-dim hover:text-pool-text hover:bg-pool-card'
            ]"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden p-2 rounded-lg text-pool-text-dim hover:text-pool-text
                 hover:bg-pool-card transition-colors"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <span class="text-xl">{{ mobileMenuOpen ? '✕' : '☰' }}</span>
        </button>
      </div>

      <!-- Mobile Navigation (dropdown) -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden pb-4 space-y-1"
      >
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="[
            isActive(link.to)
              ? 'text-pool-primary bg-pool-primary/10'
              : 'text-pool-text-dim hover:text-pool-text hover:bg-pool-card'
          ]"
          @click="mobileMenuOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const poolName = config.public.poolName as string
const route = useRoute()
const mobileMenuOpen = ref(false)

const navLinks = [
  { to: '/', label: 'Dashboard' },
  { to: '/blocks', label: 'Blocks' },
  { to: '/getting-started', label: 'Get Started' },
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>