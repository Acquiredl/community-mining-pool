// ============================================================
// CLIENT PLUGIN: Theme Injector
// ============================================================
//
// This runs on the client (browser) when the app first loads.
// It calls usePoolConfig() which fetches the config and injects
// CSS variables into :root.
//
// Why a plugin instead of just calling it in app.vue?
// - Plugins run before any component renders
// - Ensures CSS variables are set before the first paint
// - Prevents a flash of default colors before config loads
// ============================================================

export default defineNuxtPlugin(async () => {
  // Trigger the config fetch + CSS injection.
  // usePoolConfig() is smart enough to only fetch once,
  // so calling it here AND in components is fine.
  const { config } = usePoolConfig()

  // The composable's watcher handles injection when data arrives.
  // Nothing else needed here — this just ensures the fetch starts early.
})