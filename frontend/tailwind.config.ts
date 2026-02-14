/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.ts',
    './app.vue',
  ],
  theme: {
    extend: {
      // -----------------------------------------------
      // POOL THEME COLORS
      // These map to CSS custom properties set in app.vue.
      // In Phase 4B, these will be driven by pool.config.yml.
      // For now, they're hardcoded to a clean dark theme.
      // -----------------------------------------------
      colors: {
        pool: {
          bg: 'var(--pool-bg)',
          card: 'var(--pool-card)',
          text: 'var(--pool-text)',
          'text-dim': 'var(--pool-text-dim)',
          primary: 'var(--pool-primary)',
          secondary: 'var(--pool-secondary)',
          border: 'var(--pool-border)',
          success: 'var(--pool-success)',
          warning: 'var(--pool-warning)',
          danger: 'var(--pool-danger)',
        },
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}