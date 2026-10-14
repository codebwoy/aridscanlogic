import { createHmac, timingSafeEqual, randomBytes, createHash } from 'node:crypto'

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString('base64url')
}

export function sha256Hex(input) {
  return createHash('sha256').update(String(input)).digest('hex')
}

export function hmacSign(secret, payload) {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function safeEqual(a, b) {
  const aa = Buffer.from(String(a || ''))
  const bb = Buffer.from(String(b || ''))
  if (aa.length !== bb.length) return false
  return timingSafeEqual(aa, bb)
}
