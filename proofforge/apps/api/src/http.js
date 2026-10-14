import { config } from './config.js'
import { safeEqual } from './security/crypto.js'
import { extractBearer, verifyDesktopSession } from './security/desktopSession.js'

export function sendJson(res, status, body) {
  const payload = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store',
  })
  res.end(payload)
}

export function sendError(res, status, error, code) {
  sendJson(res, status, code ? { error, code } : { error })
}

export async function readJson(req, { maxBytes = 4_000_000 } = {}) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > maxBytes) {
      const err = new Error('Payload too large')
      err.status = 413
      throw err
    }
    chunks.push(chunk)
  }
  if (!chunks.length) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    const err = new Error('Invalid JSON')
    err.status = 400
    throw err
  }
}

export function securityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
}

export function cors(req, res) {
  const origin = req.headers.origin
  if (origin && config.webOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Authorization, Content-Type, X-ProofForge-Api-Secret, X-ProofForge-Viewport'
    )
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, OPTIONS')
  }
}

export function isLocalSocket(req) {
  const ip = req.socket?.remoteAddress || ''
  return (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === '::ffff:127.0.0.1' ||
    ip.endsWith('127.0.0.1')
  )
}

export function isAllowlistedBrowser(req) {
  const origin = (req.headers.origin || '').trim()
  if (origin && config.webOrigins.includes(origin)) return true
  const host = String(req.headers.host || '')
    .split(':')[0]
    .toLowerCase()
  if (config.publicHost && host === config.publicHost) return true
  return false
}

export function assertApiAccess(req, res) {
  if (isLocalSocket(req)) return true
  if (isAllowlistedBrowser(req)) return true
  const bearer = extractBearer(req)
  if (bearer.includes('.') && verifyDesktopSession(bearer)) return true
  if (!config.apiSecret) {
    sendError(res, 401, 'Unauthorized', 'auth_required')
    return false
  }
  const header = req.headers['x-proofforge-api-secret'] || ''
  if (!safeEqual(header, config.apiSecret)) {
    sendError(res, 401, 'Unauthorized', 'auth_required')
    return false
  }
  return true
}
