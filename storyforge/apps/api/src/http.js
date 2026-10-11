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

export async function readJson(req, { maxBytes = 1_000_000 } = {}) {
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
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site')
}

export function cors(req, res) {
  const origin = req.headers.origin
  if (origin && config.webOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Authorization, Content-Type, X-StoryForge-Api-Secret, X-StoryForge-Viewport'
    )
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS')
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

/** Non-local requests need STORYFORGE_API_SECRET when configured. */
export function assertApiAccess(req, res) {
  if (isLocalSocket(req)) return true
  if (!config.apiSecret) {
    sendError(res, 403, 'API blocked from non-local hosts. Set STORYFORGE_API_SECRET.', 'api_blocked')
    return false
  }
  const bearer = extractBearer(req)
  const header = (req.headers['x-storyforge-api-secret'] || '').trim()
  // Desktop session tokens are JWTs-like (payload.sig) — allow through to desktop auth
  if (bearer.includes('.') && verifyDesktopSession(bearer)) return true
  if (!safeEqual(bearer, config.apiSecret) && !safeEqual(header, config.apiSecret)) {
    sendError(res, 401, 'Unauthorized', 'unauthorized')
    return false
  }
  return true
}

export function requireDesktop(req, res) {
  const token = extractBearer(req)
  const session = verifyDesktopSession(token)
  if (!session) {
    sendError(res, 403, 'Valid desktop studio session required', 'desktop_required')
    return null
  }
  // Optional live viewport re-check from header (client must still send truthful value;
  // combined with session vw binding raised at issue time).
  const liveVw = Number(req.headers['x-storyforge-viewport'] || 0)
  if (liveVw && liveVw < config.desktopMinWidth) {
    sendError(res, 403, 'Desktop viewport required', 'desktop_required')
    return null
  }
  return session
}
