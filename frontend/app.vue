<!--
  APP.VUE — The root component of the entire frontend.
  
  This file does two things:
  1. Sets CSS custom properties (variables) for the pool theme colors
  2. Renders the current page inside <NuxtLayout>

  In Phase 4B, these CSS variables will be injected dynamically
  from pool.config.yml. For now, they're hardcoded to a dark theme.
-->

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* ============================================================
   POOL THEME — CSS Custom Properties
   
   Every component uses these variables via Tailwind classes like:
     bg-pool-bg, text-pool-primary, border-pool-border, etc.
   
   To change the entire look of the pool, you only need to
   change these values. Phase 4B automates this from YAML.
   ============================================================ */

:root {
  /* --- Core Colors --- */
  --pool-bg: #0B0B14;
  --pool-card: #12121F;
  --pool-text: #E2E8F0;
  --pool-text-dim: #64748B;
  --pool-primary: #8B5CF6;
  --pool-secondary: #06B6D4;
  --pool-border: #1E293B;

  /* --- Status Colors --- */
  --pool-success: #22C55E;
  --pool-warning: #F59E0B;
  --pool-danger: #EF4444;

  /* --- Coin Brand Colors --- */
  --pool-xmr: #FF6600;
  --pool-ergo: #00B2FF;
}

/* --- Global Resets --- */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: 'Inter', sans-serif;
  color: var(--pool-text);
  background-color: var(--pool-bg);
}

body {
  min-height: 100vh;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* --- Scrollbar Styling (Webkit) --- */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--pool-bg);
}
::-webkit-scrollbar-thumb {
  background: var(--pool-border);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--pool-text-dim);
}
</style>