const PBKDF2_ITERATIONS = 310_000
const SALT_BYTES = 16
const PREFIX = 'pbkdf2:v1:'

function toBase64(bytes) {
  const bin = String.fromCharCode(...bytes)
  return btoa(bin)
}

function fromBase64(str) {
  const bin = atob(str)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

async function deriveKey(password, salt) {
  const enc = new TextEncoder()
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    baseKey,
    256
  )
  return toBase64(new Uint8Array(bits))
}

export function isPasswordHash(stored) {
  return typeof stored === 'string' && stored.startsWith(PREFIX)
}

export async function hashPassword(password) {
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters')
  }
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES))
  const hash = await deriveKey(password, salt)
  return `${PREFIX}${toBase64(salt)}:${hash}`
}

function timingSafeEqualString(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  const len = Math.max(a.length, b.length)
  let diff = a.length ^ b.length
  for (let i = 0; i < len; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0)
  }
  return diff === 0
}

export async function verifyPassword(password, stored) {
  if (!isPasswordHash(stored)) {
    return timingSafeEqualString(password, stored)
  }
  const body = stored.slice(PREFIX.length)
  const colon = body.indexOf(':')
  if (colon < 0) return false
  const saltB64 = body.slice(0, colon)
  const hashB64 = body.slice(colon + 1)
  const salt = fromBase64(saltB64)
  const computed = await deriveKey(password, salt)
  return computed === hashB64
}
