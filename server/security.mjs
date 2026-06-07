/**
 * Shared security helpers for dev/preview API middleware.
 */

import { looksLikeJwt, extractBearerToken } from './auth.mjs'
export { timingSafeEqual } from './crypto.mjs'
import { timingSafeEqual } from './crypto.mjs'

const RATE_BUCKETS = new Map()

/** Trust only the socket address — never Host header (spoofable on LAN). */
export function isLocalRequest(req) {
  const ip = req.socket?.remoteAddress || ''
  return (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === '::ffff:127.0.0.1' ||
    ip.endsWith('127.0.0.1')
  )
}

/** Block remote /api access unless SCANLOGIC_API_SECRET is set and sent as Bearer token. */
export function createApiAccessMiddleware(getSecret) {
  return function apiAccessMiddleware(req, res, next) {
    const pathname = req.url?.split('?')[0] || ''
    if (!pathname.startsWith('/api/')) return next()

    if (isLocalRequest(req)) return next()

    const bearer = extractBearerToken(req)
    if (looksLikeJwt(bearer)) return next()

    const secret = typeof getSecret === 'function' ? getSecret() : getSecret
    const headerSecret = (req.headers['x-scanlogic-api-secret'] || '').trim()

    if (!secret) {
      res.statusCode = 403
      res.setHeader('Content-Type', 'application/json')
      res.end(
        JSON.stringify({
          error:
            'API blocked from non-local hosts. Set SCANLOGIC_API_SECRET in .env and pass Bearer token from Settings.',
        })
      )
      return
    }

    if (!timingSafeEqual(bearer, secret) && !timingSafeEqual(headerSecret, secret)) {
      res.statusCode = 401
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Unauthorized' }))
      return
    }

    next()
  }
}

export function createRateLimitMiddleware({
  windowMs = 60_000,
  max = 60,
  pathPrefix = '/api/',
  keyFn,
}) {
  const getKey =
    keyFn ||
    ((req) => {
      const ip = req.socket?.remoteAddress || 'unknown'
      return `${pathPrefix}:${ip}`
    })

  return function rateLimitMiddleware(req, res, next) {
    const pathname = req.url?.split('?')[0] || ''
    if (!pathname.startsWith(pathPrefix)) return next()

    const key = getKey(req)
    const now = Date.now()
    let bucket = RATE_BUCKETS.get(key)
    if (!bucket || now - bucket.start > windowMs) {
      bucket = { start: now, count: 0 }
      RATE_BUCKETS.set(key, bucket)
    }
    // Periodic cleanup — drop stale buckets to limit memory growth
    if (RATE_BUCKETS.size > 500 && Math.random() < 0.02) {
      for (const [k, b] of RATE_BUCKETS) {
        if (now - b.start > windowMs) RATE_BUCKETS.delete(k)
      }
    }
    bucket.count += 1
    if (bucket.count > max) {
      res.statusCode = 429
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Retry-After', String(Math.ceil(windowMs / 1000)))
      res.end(JSON.stringify({ error: 'Too many requests' }))
      return
    }
    next()
  }
}

const USER_ID_RE = /^[a-zA-Z0-9._-]{1,128}$/
const RECORD_ID_RE = /^[a-zA-Z0-9._-]{1,128}$/

export function sanitizeRecordId(id) {
  if (typeof id !== 'string' || !RECORD_ID_RE.test(id)) return null
  return id
}
const FILTER_KEY_RE = /^[a-zA-Z0-9_]{1,64}$/
const MODEL_RE = /^claude-[a-z0-9][a-z0-9._-]{0,63}$/i

export function sanitizeUserId(id, fallback = 'local-user') {
  if (typeof id !== 'string' || !USER_ID_RE.test(id)) return fallback
  return id
}

export function sanitizeFilterKey(key) {
  if (typeof key !== 'string' || !FILTER_KEY_RE.test(key)) return null
  return key
}

export function clientSafeError(err, exposeDetails = false) {
  if (exposeDetails && err?.message) return err.message
  return 'Internal server error'
}

const MAX_LLM_MESSAGES = 40
const MAX_MESSAGE_CHARS = 120_000
const MAX_SYSTEM_CHARS = 32_000
const MAX_LLM_IMAGES = 8
const MAX_IMAGE_BYTES = 4 * 1024 * 1024

export function sanitizeLlmPayload(raw, defaultModel) {
  const model =
    typeof raw.model === 'string' && MODEL_RE.test(raw.model.trim())
      ? raw.model.trim()
      : defaultModel

  const maxTokens = Math.min(
    8192,
    Math.max(1, Number.parseInt(String(raw.max_tokens ?? 4096), 10) || 4096)
  )

  const system =
    typeof raw.system === 'string' ? raw.system.slice(0, MAX_SYSTEM_CHARS) : undefined

  const messages = []
  if (Array.isArray(raw.messages)) {
    for (const msg of raw.messages.slice(0, MAX_LLM_MESSAGES)) {
      if (!msg || (msg.role !== 'user' && msg.role !== 'assistant')) continue
      let content = msg.content
      if (typeof content === 'string') {
        content = content.slice(0, MAX_MESSAGE_CHARS)
      } else if (Array.isArray(content)) {
        content = content.slice(0, MAX_LLM_IMAGES).map((block) => {
          if (!block || typeof block !== 'object') return block
          if (block.type === 'text' && typeof block.text === 'string') {
            return { type: 'text', text: block.text.slice(0, MAX_MESSAGE_CHARS) }
          }
          if (block.type === 'image' && block.source?.type === 'base64') {
            const media = String(block.source.media_type || 'image/jpeg').slice(0, 64)
            const data = String(block.source.data || '').slice(0, MAX_IMAGE_BYTES)
            return { type: 'image', source: { type: 'base64', media_type: media, data } }
          }
          return null
        }).filter(Boolean)
      } else {
        continue
      }
      messages.push({ role: msg.role, content })
    }
  }

  if (!messages.length) {
    throw new Error('Invalid messages')
  }

  const out = { model, max_tokens: maxTokens, messages }
  if (system) out.system = system
  return out
}
