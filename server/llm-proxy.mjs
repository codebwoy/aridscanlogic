/**
 * Server-side Anthropic proxy — API key never sent to the browser.
 */

import { clientSafeError, sanitizeLlmPayload } from './security.mjs'
import { DEFAULT_ANTHROPIC_MODEL, resolveAnthropicModel } from './llmModel.mjs'

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_VERSION = '2023-06-01'
const MAX_BODY_BYTES = 12 * 1024 * 1024
/** Stay under Vercel serverless maxDuration (60s on Pro) */
const UPSTREAM_TIMEOUT_MS = 55_000

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        reject(new Error('Request body too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

async function readRequestBody(req) {
  if (req.body != null) {
    if (typeof req.body === 'string') return req.body
    if (Buffer.isBuffer(req.body)) return req.body.toString('utf8')
    if (typeof req.body === 'object') return JSON.stringify(req.body)
  }
  return readBody(req)
}

function resolveApiKey(getApiKey) {
  const key = typeof getApiKey === 'function' ? getApiKey() : getApiKey
  return typeof key === 'string' ? key.trim() : ''
}

function resolveModel(getModel) {
  const model = typeof getModel === 'function' ? getModel() : getModel
  return resolveAnthropicModel(model)
}

export function defaultGetApiKey() {
  return (process.env.ANTHROPIC_API_KEY || '').trim()
}

export function defaultGetModel() {
  return resolveAnthropicModel(process.env.ANTHROPIC_MODEL)
}

export async function handleLlmStatusRequest(req, res, { getApiKey = defaultGetApiKey, getModel = defaultGetModel } = {}) {
  if (req.method !== 'GET') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  const apiKey = resolveApiKey(getApiKey)
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(
    JSON.stringify({
      configured: apiKey.length > 10,
      model: resolveModel(getModel),
    })
  )
}

export async function handleLlmPostRequest(req, res, { getApiKey = defaultGetApiKey, getModel = defaultGetModel } = {}) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  const apiKey = resolveApiKey(getApiKey)
  if (apiKey.length <= 10) {
    res.statusCode = 503
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'LLM not configured on server' }))
    return
  }

  try {
    const raw = await readRequestBody(req)
    const parsed = JSON.parse(raw || '{}')
    const payload = sanitizeLlmPayload(parsed, resolveModel(getModel))

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(new Error('upstream_timeout')), UPSTREAM_TIMEOUT_MS)

    let upstream
    try {
      upstream = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': ANTHROPIC_VERSION,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
    } catch (err) {
      clearTimeout(timeoutId)
      const timedOut = err?.message === 'upstream_timeout' || err?.name === 'AbortError'
      res.statusCode = timedOut ? 504 : 502
      res.setHeader('Content-Type', 'application/json')
      res.end(
        JSON.stringify({
          error: timedOut
            ? 'LLM request timed out — try a shorter question or retry in a moment'
            : clientSafeError(err),
        })
      )
      return
    }
    clearTimeout(timeoutId)

    const text = await upstream.text()
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 'no-store')
    if (!upstream.ok) {
      const isModelError = upstream.status === 404 || upstream.status === 400
      res.statusCode = isModelError ? 502 : upstream.status >= 500 ? 502 : upstream.status
      res.end(
        JSON.stringify({
          error: isModelError
            ? 'Claude model unavailable — set ANTHROPIC_MODEL=claude-sonnet-4-6 on the server and redeploy'
            : clientSafeError(null),
        })
      )
      return
    }
    res.statusCode = upstream.status
    res.end(text)
  } catch (err) {
    const tooLarge = err.message === 'Request body too large'
    const badPayload = err.message === 'Invalid messages'
    res.statusCode = tooLarge ? 413 : badPayload ? 400 : 500
    res.setHeader('Content-Type', 'application/json')
    res.end(
      JSON.stringify({
        error: tooLarge || badPayload ? err.message : clientSafeError(err),
      })
    )
  }
}

export function createLlmProxyMiddleware({ getApiKey, getModel }) {
  return async function llmProxyMiddleware(req, res, next) {
    const pathname = req.url?.split('?')[0] || ''

    if (!pathname.startsWith('/api/llm')) {
      return next()
    }

    if (pathname === '/api/llm/status') {
      await handleLlmStatusRequest(req, res, { getApiKey, getModel })
      return
    }

    if (pathname === '/api/llm') {
      await handleLlmPostRequest(req, res, { getApiKey, getModel })
      return
    }

    res.statusCode = 404
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Not found' }))
  }
}

export function createSecurityHeadersMiddleware({ enableCsp = false } = {}) {
  const csp =
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"

  return function securityHeaders(req, res, next) {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.setHeader('Permissions-Policy', 'camera=(self), microphone=(), geolocation=()')
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
    // Strict CSP breaks Vite dev (HMR websockets + inline/eval). Use meta CSP in production HTML only.
    if (enableCsp) {
      res.setHeader('Content-Security-Policy', csp)
    }
    next()
  }
}
