/**
 * eBay user tokens — sessionStorage only (not localStorage, not VITE_*).
 */

const KEY = 'scanlogic_ebay_oauth'
const STATE_KEY = 'scanlogic_ebay_oauth_state'

function read() {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function write(value) {
  sessionStorage.setItem(KEY, JSON.stringify(value))
}

export function loadEbayAuth() {
  const data = read()
  if (!data?.access_token) return null
  return {
    access_token: String(data.access_token || ''),
    refresh_token: String(data.refresh_token || ''),
    expires_at: Number(data.expires_at) || 0,
    sandbox: !!data.sandbox,
    connected_at: data.connected_at || null,
  }
}

export function saveEbayAuth({ access_token, refresh_token, expires_in, sandbox }) {
  const expiresAt = Date.now() + Math.max(60, Number(expires_in) || 7200) * 1000 - 60_000
  const next = {
    access_token,
    refresh_token: refresh_token || loadEbayAuth()?.refresh_token || '',
    expires_at: expiresAt,
    sandbox: !!sandbox,
    connected_at: new Date().toISOString(),
  }
  write(next)
  return next
}

export function clearEbayAuth() {
  try {
    sessionStorage.removeItem(KEY)
    sessionStorage.removeItem(STATE_KEY)
  } catch {
    /* ignore */
  }
}

export function isEbayConnected() {
  const a = loadEbayAuth()
  return !!(a?.access_token || a?.refresh_token)
}

export function createOauthState() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  const state = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
  sessionStorage.setItem(STATE_KEY, state)
  return state
}

export function consumeOauthState(expected) {
  const stored = sessionStorage.getItem(STATE_KEY) || ''
  sessionStorage.removeItem(STATE_KEY)
  return stored && expected && stored === expected
}

export function ebayTokenNeedsRefresh() {
  const a = loadEbayAuth()
  if (!a?.access_token) return !!a?.refresh_token
  return Date.now() >= (a.expires_at || 0)
}
