import { getPool } from './db-pool.mjs'
import { timingSafeEqual } from './crypto.mjs'

const SUCCESS_BODY = {
  success: true,
  message: 'Supabase keep-alive ping successful — Supabase kept active',
}

function getBearerToken(req) {
  const auth = req.headers?.authorization || req.headers?.get?.('authorization') || ''
  return auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
}

function sendJson(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

/**
 * Lightweight Supabase Postgres ping for cron keep-alive.
 * Works with Node http.ServerResponse (Vite dev/preview + Vercel serverless).
 */
export async function handleKeepAliveRequest(req, res) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed' })
    return
  }

  const cronSecret = (process.env.CRON_SECRET || '').trim()
  if (!cronSecret) {
    sendJson(res, 500, { error: 'CRON_SECRET not configured' })
    return
  }

  const token = getBearerToken(req)
  if (!token || !timingSafeEqual(token, cronSecret)) {
    sendJson(res, 401, { error: 'Unauthorized' })
    return
  }

  const dbUrl = (process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || '').trim()
  if (!dbUrl) {
    sendJson(res, 500, { error: 'Database not configured' })
    return
  }

  try {
    await getPool(dbUrl).query('SELECT id FROM scanlogic_records LIMIT 1')
    sendJson(res, 200, SUCCESS_BODY)
  } catch {
    sendJson(res, 500, { error: 'Database ping failed' })
  }
}

export function createKeepAliveMiddleware() {
  return async function keepAliveMiddleware(req, res, next) {
    const pathname = req.url?.split('?')[0] || ''
    if (pathname !== '/api/cron/keep-alive') return next()
    await handleKeepAliveRequest(req, res)
  }
}
