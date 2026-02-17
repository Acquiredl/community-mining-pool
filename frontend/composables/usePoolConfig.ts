// ============================================================
// COMPOSABLE: usePoolConfig
// ============================================================
//
// This is the bridge between pool.config.yml and every Vue component.
//
// Usage in any component:
//   const { config, poolName, theme, coins, isPageEnabled } = usePoolConfig()
//
// What it does:
//   1. Fetches the parsed pool.config.yml from /api/pool-config (once, cached)
//   2. Injects CSS custom properties from the theme section into :root
//   3. Provides typed helper functions for common lookups
//
// Components NEVER hardcode colors or pool names. They always use this.
// ============================================================

import type { Ref } from 'vue'

// --- Type Definitions ---

interface PoolIdentity {
  name: string
  tagline: string
  logo: string
  favicon: string
  footer_text: string
}

interface CoinConfig {
  display_name: string
  ticker: string
  icon: string
  color: string
  explorer_url: string
  algo: string
}

interface ThemeConfig {
  mode: 'dark' | 'light'
  primary_color: string
  secondary_color: string
  background: string
  card_background: string
  text_color: string
  text_dim_color: string
  border_color: string
  success_color: string
  warning_color: string
  danger_color: string
  font_heading: string
  font_body: string
  border_radius: string
  glow_effects: boolean
  glow_color: string
}

interface PageToggles {
  home: boolean
  miners: boolean
  blocks: boolean
  payments: boolean
  getting_started: boolean
  goals: boolean
  leaderboard: boolean
}

interface ConnectionConfig {
  domain: string
  stratum_port_cpu: number
  stratum_port_gpu: number
  stratum_port_gpu_high: number
  region: string
  ssl_enabled: boolean
}

interface GoalItem {
  id: string
  title: string
  description: string
  target_xmr: number
  wallet_address: string
  reset_period: 'monthly' | 'weekly' | 'once'
  icon: string
}

interface GoalsConfig {
  enabled: boolean
  items: GoalItem[]
}

interface CelebrationConfig {
  enabled: boolean
  style: 'confetti' | 'fireworks' | 'flash' | 'none'
  sound: boolean
  show_finder: boolean
}

interface DiscordConfig {
  enabled: boolean
  invite_url?: string
  [key: string]: any
}

export interface PoolConfig {
  pool: PoolIdentity
  coins: Record<string, CoinConfig>
  theme: ThemeConfig
  pages: PageToggles
  connection: ConnectionConfig
  goals: GoalsConfig
  celebrations: CelebrationConfig
  discord: DiscordConfig
}

// --- Google Fonts Dynamic Loader ---
// Injects a <link> tag to load custom Google Fonts at runtime.
// This way communities change fonts in pool.config.yml without
// touching any JavaScript files.
const _loadedFonts = new Set<string>()

function loadGoogleFonts(fontNames: string[]) {
  if (!import.meta.client) return

  const newFonts = fontNames.filter((f) => !_loadedFonts.has(f))
  if (newFonts.length === 0) return

  const families = newFonts
    .map((f) => `family=${f.replace(/ /g, '+')}:wght@300;400;500;600;700`)
    .join('&')

  const linkId = 'pool-google-fonts'
  let link = document.getElementById(linkId) as HTMLLinkElement | null

  if (!link) {
    link = document.createElement('link')
    link.id = linkId
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }

  link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`
  newFonts.forEach((f) => _loadedFonts.add(f))
}

// --- Composable ---

export const usePoolConfig = () => {
  // Fetch config from server — cached across the entire app lifecycle.
  // useAsyncData ensures this only runs once, even if 10 components call it.
  const { data: config, error } = useAsyncData<PoolConfig>(
    'pool-config',
    () => $fetch('/api/pool-config'),
    {
      // Cache on the client — don't re-fetch on every navigation
      getCachedData: (key, nuxtApp) => {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      },
    }
  )

  // --- Inject CSS Variables ---
  // When the config loads, update :root CSS custom properties.
  // This is what makes `bg-pool-bg` and `text-pool-primary` work
  // with the community's chosen colors.
  const injectThemeVariables = () => {
    if (!config.value?.theme || !import.meta.client) return

    const t = config.value.theme
    const root = document.documentElement.style

    // Core colors
    root.setProperty('--pool-bg', t.background)
    root.setProperty('--pool-card', t.card_background)
    root.setProperty('--pool-text', t.text_color)
    root.setProperty('--pool-text-dim', t.text_dim_color)
    root.setProperty('--pool-primary', t.primary_color)
    root.setProperty('--pool-secondary', t.secondary_color)
    root.setProperty('--pool-border', t.border_color)

    // Status colors
    root.setProperty('--pool-success', t.success_color)
    root.setProperty('--pool-warning', t.warning_color)
    root.setProperty('--pool-danger', t.danger_color)

    // Shape
    root.setProperty('--pool-radius', t.border_radius)

    // Glow
    if (t.glow_effects) {
      root.setProperty('--pool-glow', t.glow_color)
    } else {
      root.setProperty('--pool-glow', 'transparent')
    }

    // Typography — update the font-family on <html>
    root.setProperty('--pool-font-heading', `'${t.font_heading}', sans-serif`)
    root.setProperty('--pool-font-body', `'${t.font_body}', sans-serif`)
    document.documentElement.style.fontFamily = `'${t.font_body}', sans-serif`

    // Dynamically load Google Fonts if they differ from the defaults.
    // This means communities only change pool.config.yml — no need to
    // touch nuxt.config.ts for font changes.
    loadGoogleFonts([t.font_heading, t.font_body])

    // Coin colors (dynamic per pool config)
    if (config.value.coins) {
      for (const [poolId, coin] of Object.entries(config.value.coins)) {
        root.setProperty(`--pool-coin-${poolId}`, coin.color)
      }
    }

    // Light/dark mode — add class to <html> for CSS overrides
    if (t.mode === 'light') {
      document.documentElement.classList.add('light-mode')
      document.documentElement.classList.remove('dark-mode')
    } else {
      document.documentElement.classList.add('dark-mode')
      document.documentElement.classList.remove('light-mode')
    }
  }

  // Watch for config to load, then inject
  watch(config, (newConfig) => {
    if (newConfig) injectThemeVariables()
  }, { immediate: true })

  // --- Helper Functions ---

  /** Get the pool display name */
  const poolName = computed(() => config.value?.pool?.name || 'Mining Pool')

  /** Get the theme config */
  const theme = computed(() => config.value?.theme)

  /** Get all configured coins as an array of [poolId, coinConfig] */
  const coins = computed(() => {
    if (!config.value?.coins) return []
    return Object.entries(config.value.coins)
  })

  /** Get a specific coin config by its pool ID (e.g., 'monero1') */
  const getCoin = (poolId: string): CoinConfig | undefined => {
    return config.value?.coins?.[poolId]
  }

  /** Check if a page is enabled in the config */
  const isPageEnabled = (page: keyof PageToggles): boolean => {
    return config.value?.pages?.[page] ?? true
  }

  /** Get connection info for the Getting Started page */
  const connection = computed(() => config.value?.connection)

  /** Get community goals config */
  const goals = computed(() => config.value?.goals)

  /** Get celebration config */
  const celebrations = computed(() => config.value?.celebrations)

  /** Get discord config */
  const discord = computed(() => config.value?.discord)

  return {
    config,
    error,
    poolName,
    theme,
    coins,
    getCoin,
    isPageEnabled,
    connection,
    goals,
    celebrations,
    discord,
  }
}