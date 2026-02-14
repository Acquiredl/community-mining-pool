<!--
  DEFAULT LAYOUT
  Every page is rendered inside this layout automatically.
  It adds the navigation bar at the top and a footer at the bottom.
-->

<template>
  <div class="min-h-screen flex flex-col bg-pool-bg">
    <!-- Navigation -->
    <NavBar />

    <!-- Page Content -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-pool-border py-6 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-pool-text-dim text-sm">
          Powered by
          <a
            href="https://github.com/Acquiredl/community-mining-pool"
            target="_blank"
            rel="noopener"
            class="text-pool-primary hover:text-pool-secondary transition-colors"
          >
            Community Mining Pool
          </a>
          — Open Source Template
        </p>
        <p class="text-pool-text-dim text-xs mt-1">
          Built with MiningCore · Nuxt 3 · ❤️
        </p>
      </div>
    </footer>
  </div>
</template>