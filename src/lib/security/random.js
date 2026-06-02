export function secureToken() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

export function secureId(prefix = 'id') {
  return `${prefix}-${secureToken()}`
}

const SHARE_TOKEN_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/** UUID v4 (new links) or legacy `timestamp-random` tokens. */
export function isValidShareToken(token) {
  if (typeof token !== 'string' || token.length > 80) return false
  if (SHARE_TOKEN_RE.test(token)) return true
  return /^[0-9]{10,16}-[a-z0-9]{2,12}$/i.test(token)
}
