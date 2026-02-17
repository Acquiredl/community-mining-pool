<!--
  APP.VUE — Root component
  
  CSS custom properties are set here as DEFAULTS for the server-side render.
  When the app hydrates in the browser, the theme.client.ts plugin calls
  usePoolConfig(), which overrides these with values from pool.config.yml.

  This two-step approach means:
  1. SSR always renders with sensible defaults (no blank page)
  2. Client hydration applies the community's custom theme instantly
-->

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* ============================================================
   POOL THEME — CSS Custom Properties (SSR Defaults)
   
   These are overridden at runtime by usePoolConfig() when the
   browser loads pool.config.yml values. They exist here so the
   server-rendered HTML has valid colors on first paint.

   Tailwind classes like bg-pool-bg and text-pool-primary
   reference these variables via tailwind.config.ts.
   ============================================================ */

:root {
  /* --- Core Colors (overridden from theme section of pool.config.yml) --- */
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

  /* --- Shape --- */
  --pool-radius: 12px;

  /* --- Glow Effect --- */
  --pool-glow: #8B5CF680;

  /* --- Typography --- */
  --pool-font-heading: 'Space Grotesk', sans-serif;
  --pool-font-body: 'Inter', sans-serif;

  /* --- Coin Colors (defaults, overridden per-coin from config) --- */
  --pool-coin-monero1: #FF6600;
  --pool-coin-ergo1: #00B2FF;
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
  font-family: var(--pool-font-body);
  color: var(--pool-text);
  background-color: var(--pool-bg);
}

body {
  min-height: 100vh;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* --- Heading Font --- */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--pool-font-heading);
}

/* --- Glow Utility Class --- */
.pool-glow {
  box-shadow: 0 0 20px var(--pool-glow), 0 0 60px var(--pool-glow);
}

.pool-glow-sm {
  box-shadow: 0 0 10px var(--pool-glow);
}

/* --- Border Radius Utility --- */
.pool-rounded {
  border-radius: var(--pool-radius);
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

/* --- Light Mode Override --- */
/* When pool.config.yml sets mode: "light", the composable adds this class */
html.light-mode {
  --pool-bg: #F8FAFC;
  --pool-card: #FFFFFF;
  --pool-text: #1E293B;
  --pool-text-dim: #64748B;
  --pool-border: #E2E8F0;
  --pool-glow: transparent;
}
</style>