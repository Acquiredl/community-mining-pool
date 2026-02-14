// ============================================================
// useFormatters — Display Formatting Utilities
//
// Mining dashboards show a lot of numbers. This composable
// provides consistent formatting across all pages.
//
// USAGE:
//   const { formatHashrate, formatCoin, timeAgo } = useFormatters()
//   formatHashrate(450000)   → "450.00 KH/s"
//   formatCoin(0.00352, 'XMR') → "0.00352 XMR"
//   timeAgo('2025-02-10T20:00:00Z') → "3 hours ago"
// ============================================================

export const useFormatters = () => {

  /**
   * Format a hashrate value into human-readable units.
   * MiningCore returns hashrate in H/s (hashes per second).
   */
  function formatHashrate(hashrate: number): string {
    if (hashrate === 0) return '0 H/s'

    const units = ['H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s']
    let unitIndex = 0
    let value = hashrate

    while (value >= 1000 && unitIndex < units.length - 1) {
      value /= 1000
      unitIndex++
    }

    return `${value.toFixed(2)} ${units[unitIndex]}`
  }

  /**
   * Format a coin amount with appropriate decimal places.
   */
  function formatCoin(amount: number, symbol: string, decimals?: number): string {
    const defaultDecimals: Record<string, number> = {
      XMR: 6,
      ERG: 8,
    }
    const dp = decimals ?? defaultDecimals[symbol.toUpperCase()] ?? 6
    return `${amount.toFixed(dp)} ${symbol}`
  }

  /**
   * Format a number with commas for readability.
   */
  function formatNumber(num: number, decimals = 0): string {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  }

  /**
   * Convert an ISO date string to a relative "time ago" string.
   */
  function timeAgo(dateString: string | null): string {
    if (!dateString) return 'Never'

    const now = Date.now()
    const then = new Date(dateString).getTime()
    const seconds = Math.floor((now - then) / 1000)

    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`

    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  /**
   * Format a date string into a readable local format.
   */
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  /**
   * Truncate a wallet address for display.
   */
  function truncateAddress(address: string, chars = 8): string {
    if (address.length <= chars * 2 + 3) return address
    return `${address.slice(0, chars)}...${address.slice(-chars)}`
  }

  /**
   * Format block effort as a percentage with color hint.
   * < 100% = lucky (green), 100% = expected, > 100% = unlucky (red)
   */
  function formatEffort(effort: number): { text: string; color: string } {
    const percent = Math.round(effort * 100)
    let color = 'pool-warning'

    if (percent < 80) color = 'pool-success'
    else if (percent > 150) color = 'pool-danger'

    return { text: `${percent}%`, color }
  }

  /**
   * Format difficulty into human-readable units.
   */
  function formatDifficulty(difficulty: number): string {
    if (difficulty === 0) return '0'

    const units = ['', 'K', 'M', 'G', 'T', 'P']
    let unitIndex = 0
    let value = difficulty

    while (value >= 1000 && unitIndex < units.length - 1) {
      value /= 1000
      unitIndex++
    }

    return `${value.toFixed(2)}${units[unitIndex]}`
  }

  return {
    formatHashrate,
    formatCoin,
    formatNumber,
    timeAgo,
    formatDate,
    truncateAddress,
    formatEffort,
    formatDifficulty,
  }
}