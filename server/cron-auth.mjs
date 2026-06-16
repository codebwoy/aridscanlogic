import { timingSafeEqual } from './crypto.mjs'

/**
 * Returns true if CRON_SECRET is set in the environment.
 */
export function isCronSecretConfigured() {
  return Boolean((process.env.CRON_SECRET || '').trim())
}

/**
 * Validates an incoming request against CRON_SECRET.
 *
 * Accepted forms (checked in order):
 *   1. Authorization: Bearer <secret>
 *   2. x-cron-secret: <secret>
 *   3. ?secret=<secret>  (query param)
 *
 * @param {Request|import('http').IncomingMessage} req
 * @returns {{ valid: boolean, reason?: string }}
 */
export function validateCronRequest(req) {
  const secret = (process.env.CRON_SECRET || '').trim()
  if (!secret) return { valid: false, reason: 'CRON_SECRET not configured' }

  // 1. Authorization: Bearer <secret>
  const authHeader =
    req.headers?.authorization || req.headers?.get?.('authorization') || ''
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim()
    if (timingSafeEqual(token, secret)) return { valid: true }
  }

  // 2. x-cron-secret header
  const headerSecret =
    req.headers?.['x-cron-secret'] ||
    req.headers?.get?.('x-cron-secret') ||
    ''
  if (headerSecret && timingSafeEqual(String(headerSecret).trim(), secret)) {
    return { valid: true }
  }

  // 3. ?secret= query param
  const rawUrl = req.url || ''
  const qIdx = rawUrl.indexOf('?')
  if (qIdx !== -1) {
    const params = new URLSearchParams(rawUrl.slice(qIdx + 1))
    const qSecret = params.get('secret') || ''
    if (qSecret && timingSafeEqual(qSecret, secret)) return { valid: true }
  }

  return { valid: false, reason: 'Invalid credentials' }
}
