// ============================================================
// SERVER PLUGIN: Pool Config Loader
// ============================================================
//
// This runs ONCE when the Nuxt server starts.
// It reads pool.config.yml, parses it, and injects the values
// into Nuxt's runtime config so every component can access them
// via the usePoolConfig() composable.
//
// How the flow works:
//   1. Nuxt starts → this plugin runs
//   2. Reads /app/config/pool.config.yml (Docker mount) or
//      falls back to a bundled default
//   3. Parses YAML → JavaScript object
//   4. Stores in nitroApp context for the usePoolConfig composable
//
// Communities never touch this file. They edit pool.config.yml.
// ============================================================

import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import yaml from 'js-yaml'

// Default config — used if pool.config.yml is missing or malformed.
// This ensures the app always boots, even with a broken config.
const DEFAULT_CONFIG = {
  pool: {
    name: 'Community Mining Pool',
    tagline: 'Mining for the community',
    logo: '/assets/logo.png',
    favicon: '/assets/favicon.ico',
    footer_text: 'Powered by MiningCore',
  },
  coins: {},
  theme: {
    mode: 'dark',
    primary_color: '#8B5CF6',
    secondary_color: '#06B6D4',
    background: '#0B0B14',
    card_background: '#12121F',
    text_color: '#E2E8F0',
    text_dim_color: '#64748B',
    border_color: '#1E293B',
    success_color: '#22C55E',
    warning_color: '#F59E0B',
    danger_color: '#EF4444',
    font_heading: 'Space Grotesk',
    font_body: 'Inter',
    border_radius: '12px',
    glow_effects: true,
    glow_color: '#8B5CF680',
  },
  pages: {
    home: true,
    miners: true,
    blocks: true,
    payments: true,
    getting_started: true,
    goals: false,
    leaderboard: false,
  },
  connection: {
    domain: 'pool.example.com',
    stratum_port_cpu: 3333,
    stratum_port_gpu: 3052,
    stratum_port_gpu_high: 3152,
    region: 'US-East',
    ssl_enabled: false,
  },
  goals: { enabled: false, items: [] },
  celebrations: { enabled: false, style: 'none', sound: false, show_finder: true },
  discord: { enabled: false },
}

/**
 * Deep merge two objects. Source values override target values.
 * Arrays are replaced, not merged (a community's goal list replaces the default).
 */
function deepMerge(target: any, source: any): any {
  const output = { ...target }
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      output[key] = deepMerge(target[key], source[key])
    } else {
      output[key] = source[key]
    }
  }
  return output
}

export default defineNitroPlugin((nitroApp) => {
  // --- Locate the config file ---
  // Priority: Docker volume mount → local dev fallback → bundled default
  const configPaths = [
    '/app/config/pool.config.yml',                          // Docker mount path
    resolve(process.cwd(), '../config/pool-theme/pool.config.yml'),  // Local dev
    resolve(process.cwd(), 'config/pool.config.yml'),       // Alt local path
  ]

  let rawYaml: string | null = null
  let loadedFrom: string = 'defaults'

  for (const configPath of configPaths) {
    if (existsSync(configPath)) {
      try {
        rawYaml = readFileSync(configPath, 'utf-8')
        loadedFrom = configPath
        break
      } catch (err) {
        console.warn(`[pool-config] Could not read ${configPath}:`, err)
      }
    }
  }

  // --- Parse YAML ---
  let userConfig: any = {}
  if (rawYaml) {
    try {
      userConfig = yaml.load(rawYaml) || {}
      console.log(`[pool-config] ✓ Loaded config from: ${loadedFrom}`)
    } catch (err) {
      console.error('[pool-config] ✗ YAML parse error — using defaults:', err)
      userConfig = {}
    }
  } else {
    console.warn('[pool-config] ⚠ No pool.config.yml found — using defaults')
  }

  // --- Merge with defaults (user values override defaults) ---
  const finalConfig = deepMerge(DEFAULT_CONFIG, userConfig)

  // --- Store on the Nitro app context ---
  // This is accessed by server API routes and the config endpoint.
  ;(nitroApp as any).poolConfig = finalConfig

  console.log(`[pool-config] ✓ Pool name: "${finalConfig.pool.name}"`)
  console.log(`[pool-config] ✓ Theme mode: ${finalConfig.theme.mode}`)
  console.log(`[pool-config] ✓ Coins configured: ${Object.keys(finalConfig.coins).join(', ') || 'none'}`)
})