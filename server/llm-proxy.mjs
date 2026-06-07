/**
 * Server-side Anthropic proxy — API key never sent to the browser.
 */

import { clientSafeError, sanitizeLlmPayload } from './security.mjs'

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_VERSION = '2023-06-01'
const MAX_BODY_BYTES = 12 * 1024 * 1024

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

function getApiKey(getApiKey) {
  const key = typeof getApiKey === 'function' ? getApiKey() : getApiKey
  return typeof key === 'string' ? key.trim() : ''
}

function getModel(getModel) {
  const model = typeof getModel === 'function' ? getModel() : getModel
  return model || 'claude-sonnet-4-20250514'
}

export function createLlmProxyMiddleware({ getApiKey, getModel }) {
  return async function llmProxyMiddleware(req, res, next) {
    const pathname = req.url?.split('?')[0] || ''

    if (!pathname.startsWith('/api/llm')) {
      return next()
    }

    if (pathname === '/api/llm/status' && req.method === 'GET') {
      const apiKey = getApiKey()
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Cache-Control', 'no-store')
      res.end(
        JSON.stringify({
          configured: apiKey.length > 10,
          model: getModel(getModel),
        })
      )
      return
    }

    if (pathname !== '/api/llm' || req.method !== 'POST') {
      res.statusCode = 405
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Method not allowed' }))
      return
    }

    const apiKey = getApiKey()
    if (apiKey.length <= 10) {
      res.statusCode = 503
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'LLM not configured on server' }))
      return
    }

    try {
      const raw = await readBody(req)
      const parsed = JSON.parse(raw || '{}')
      const payload = sanitizeLlmPayload(parsed, getModel())

      const upstream = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': ANTHROPIC_VERSION,
        },
        body: JSON.stringify(payload),
      })

      const text = await upstream.text()
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Cache-Control', 'no-store')
      if (!upstream.ok) {
        res.statusCode = upstream.status >= 500 ? 502 : upstream.status
        res.end(JSON.stringify({ error: clientSafeError(null) }))
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
}

export function createSecurityHeadersMiddleware() {
  const csp =
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"

  return function securityHeaders(req, res, next) {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.setHeader('Permissions-Policy', 'camera=(self), microphone=(), geolocation=()')
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
    res.setHeader('Content-Security-Policy', csp)
    next()
  }
}
