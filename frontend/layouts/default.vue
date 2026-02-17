<!--
  DEFAULT LAYOUT
  Wraps every page with the NavBar and a footer.
  Footer text comes from pool.config.yml → pool.footer_text
-->

<template>
  <div class="min-h-screen bg-pool-bg flex flex-col">
    <NavBar />

    <!-- Main content area -->
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-pool-border py-6 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-pool-text-dim text-sm">
          {{ config?.pool?.footer_text || 'Powered by MiningCore' }}
        </p>
        <div class="flex items-center space-x-4 text-pool-text-dim text-sm">
          <NuxtLink
            v-if="isPageEnabled('getting_started')"
            to="/getting-started"
            class="hover:text-pool-primary transition-colors"
          >
            Get Started
          </NuxtLink>
          <a
            href="https://github.com/oliverw/miningcore"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-pool-primary transition-colors"
          >
            MiningCore
          </a>
          <a
            v-if="config?.discord?.enabled && config?.discord?.invite_url"
            :href="config.discord.invite_url"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-pool-secondary transition-colors"
          >
            Join Discord
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { config, isPageEnabled } = usePoolConfig()

// Set page title from config
useHead({
  title: config.value?.pool?.name || 'Community Mining Pool',
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: config.value?.pool?.favicon || '/assets/favicon.ico',
    },
  ],
})
</script>