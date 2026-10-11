import { DESKTOP_SURFACE, isDesktopViewport } from '@authorforge/shared'
import { hmacSign, safeEqual, randomToken, sha256Hex } from './crypto.js'
import { config } from '../config.js'

const SESSION_TTL_MS = 12 * 60 * 60 * 1000

export function issueDesktopSession({ userId, viewportWidth, userAgent = '' }) {
  if (!isDesktopViewport(viewportWidth) || viewportWidth < config.desktopMinWidth) {
    const err = new Error('Desktop viewport required')
    err.code = 'desktop_required'
    err.status = 403
    throw err
  }

  const now = Date.now()
  const body = {
    sub: String(userId),
    surface: DESKTOP_SURFACE,
    vw: Math.floor(Number(viewportWidth)),
    ua: sha256Hex(userAgent).slice(0, 16),
    nonce: randomToken(16),
    iat: now,
    exp: now + SESSION_TTL_MS,
  }
  const payload = Buffer.from(JSON.stringify(body)).toString('base64url')
  const sig = hmacSign(config.sessionSecret, payload)
  return { token: `${payload}.${sig}`, expiresAt: body.exp, surface: DESKTOP_SURFACE }
}

export function verifyDesktopSession(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return null
  const expected = hmacSign(config.sessionSecret, payload)
  if (!safeEqual(sig, expected)) return null

  let body
  try {
    body = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
  } catch {
    return null
  }

  if (body.surface !== DESKTOP_SURFACE) return null
  if (!body.sub || !body.exp || Date.now() > body.exp) return null
  if (!isDesktopViewport(body.vw) || body.vw < config.desktopMinWidth) return null
  return body
}

export function extractBearer(req) {
  const h = req.headers.authorization || req.headers.Authorization || ''
  const m = String(h).match(/^Bearer\s+(.+)$/i)
  return m ? m[1].trim() : ''
}
