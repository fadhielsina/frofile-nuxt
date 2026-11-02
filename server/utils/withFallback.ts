import type { H3Event } from 'h3'

/**
 * Runs a database read; if it throws (connection refused, user connection
 * limit reached, timeout...), logs the error and serves the hardcoded backup
 * instead so the public site keeps working. The response header
 * `x-data-source` tells which one was used (`static` | `database` | `fallback`).
 */
export async function withFallback<T>(event: H3Event, query: () => Promise<T>, fallback: T): Promise<T> {
  if (useRuntimeConfig().dataSource !== 'database') {
    setHeader(event, 'x-data-source', 'static')
    return fallback
  }

  try {
    const data = await query()
    setHeader(event, 'x-data-source', 'database')
    return data
  } catch (err: any) {
    console.error(`[fallback] ${event.path} served from hardcoded data:`, err?.cause?.message || err?.message || err)
    setHeader(event, 'x-data-source', 'fallback')
    return fallback
  }
}
