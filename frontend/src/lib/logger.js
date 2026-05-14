/**
 * Tiny logger: debug/info are dev-only; warn/error always emit (for real failures).
 * Avoids shipping verbose auth traffic logs in production bundles.
 */
const dev = import.meta.env.DEV

export const logger = {
  debug: (...args) => {
    if (dev) console.debug(...args)
  },
  info: (...args) => {
    if (dev) console.info(...args)
  },
  warn: (...args) => {
    console.warn(...args)
  },
  error: (...args) => {
    console.error(...args)
  },
}
