const BLOCKED_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '[::1]',
  'metadata.google.internal',
])

function isPrivateIpv4(host) {
  const parts = host.split('.').map((n) => Number.parseInt(n, 10))
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return false
  if (parts[0] === 10) return true
  if (parts[0] === 127) return true
  if (parts[0] === 169 && parts[1] === 254) return true
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true
  if (parts[0] === 192 && parts[1] === 168) return true
  return false
}

/** Allow https/data URLs for user-provided images; block SSRF to private networks. */
export function isSafeFetchUrl(url) {
  if (!url || typeof url !== 'string') return false
  if (url.startsWith('data:')) return /^data:image\/[a-z0-9+.-]+;base64,/i.test(url)
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:') return false
    const host = parsed.hostname.toLowerCase()
    if (BLOCKED_HOSTS.has(host)) return false
    if (host.endsWith('.local') || host.endsWith('.internal')) return false
    if (isPrivateIpv4(host)) return false
    if (host.startsWith('fe80:') || host.startsWith('fc') || host.startsWith('fd')) return false
    return true
  } catch {
    return false
  }
}
