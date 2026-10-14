/** Append-only in-memory audit log (also persisted with store when enabled). */

const MAX = 2000
const entries = []

export function audit(event, detail = {}) {
  const row = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
    event,
    ...detail,
  }
  entries.push(row)
  if (entries.length > MAX) entries.splice(0, entries.length - MAX)
  return row
}

export function listAudit({ limit = 100 } = {}) {
  return entries.slice(-limit).reverse()
}
