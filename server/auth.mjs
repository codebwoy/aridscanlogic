import crypto from 'crypto'
import { timingSafeEqual } from './crypto.mjs'

export function looksLikeJwt(token) {
  return typeof token === 'string' && token.split('.').length === 3
}

function base64UrlDecode(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/')
  return Buffer.from(padded, 'base64')
}

/** Verify Supabase HS256 JWT; returns user id (sub) or null. */
export function verifySupabaseJwt(token, jwtSecret) {
  if (!jwtSecret || !looksLikeJwt(token)) return null
  try {
    const [headerB64, payloadB64, signatureB64] = token.split('.')
    const data = `${headerB64}.${payloadB64}`
    const expected = crypto.createHmac('sha256', jwtSecret).update(data).digest('base64url')
    const sig = signatureB64.replace(/=/g, '')
    if (expected.length !== sig.length || !timingSafeEqual(expected, sig)) return null
    const payload = JSON.parse(base64UrlDecode(payloadB64).toString('utf8'))
    if (payload.exp && payload.exp * 1000 < Date.now()) return null
    if (typeof payload.sub !== 'string' || !payload.sub) return null
    return payload.sub
  } catch {
    return null
  }
}

export function extractBearerToken(req) {
  const auth = req.headers.authorization || ''
  return auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
}

export function resolveAuthenticatedUserId(req, getJwtSecret) {
  const bearer = extractBearerToken(req)
  if (!looksLikeJwt(bearer)) return null
  const secret = typeof getJwtSecret === 'function' ? getJwtSecret() : getJwtSecret
  return verifySupabaseJwt(bearer, secret?.trim())
}
