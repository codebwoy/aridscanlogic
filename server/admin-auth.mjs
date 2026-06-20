import { timingSafeEqual } from './crypto.mjs'

/**
 * Returns true if ADMIN_API_SECRET is set in the environment.
 */
export function isAdminSecretConfigured() {
  return Boolean((process.env.ADMIN_API_SECRET || '').trim())
}

/**
 * Validates an incoming admin request against ADMIN_API_SECRET.
 *
 * Accepted forms:
 *   1. Authorization: Bearer <secret>
 *   2. x-admin-secret: <secret>
 *
 * @param {import('http').IncomingMessage} req
 * @returns {{ valid: boolean, reason?: string }}
 */
export function validateAdminRequest(req) {
  const secret = (process.env.ADMIN_API_SECRET || '').trim()
  if (!secret) return { valid: false, reason: 'ADMIN_API_SECRET not configured' }

  const authHeader = req.headers?.authorization || req.headers?.get?.('authorization') || ''
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim()
    if (timingSafeEqual(token, secret)) return { valid: true }
  }

  const headerSecret =
    req.headers?.['x-admin-secret'] || req.headers?.get?.('x-admin-secret') || ''
  if (headerSecret && timingSafeEqual(String(headerSecret).trim(), secret)) {
    return { valid: true }
  }

  return { valid: false, reason: 'Invalid credentials' }
}
