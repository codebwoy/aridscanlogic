import { getPool } from './db-pool.mjs'
import { resolveAuthenticatedUserId } from './auth.mjs'
import { defaultGetDatabaseUrl, defaultGetJwtSecret } from './db-api.mjs'
import { logActivityEntries, MAX_ACTIVITY_BATCH } from './activity-log.mjs'
import { clientSafeError, sanitizeUserId } from './security.mjs'

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > 256 * 1024) {
        reject(new Error('Body too large'))
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

function resolveGetter(getter, fallback) {
  if (typeof getter === 'function') return getter()
  if (typeof getter === 'string') return getter.trim()
  return fallback()
}

export async function handleActivityApiRequest(
  req,
  res,
  {
    getDatabaseUrl = defaultGetDatabaseUrl,
    getJwtSecret = defaultGetJwtSecret,
    getDefaultUserId = () => 'local-user',
    pathname: pathnameOverride,
  } = {}
) {
  const url = new URL(pathnameOverride || req.url || '/', 'http://localhost')
  if (url.pathname !== '/api/activity/events') {
    res.statusCode = 404
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Not found' }))
    return
  }

  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  const dbUrl = resolveGetter(getDatabaseUrl, defaultGetDatabaseUrl)
  if (!dbUrl) {
    res.statusCode = 503
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Database not configured' }))
    return
  }

  const resolveUserId = (queryUserId) => {
    const authUserId = resolveAuthenticatedUserId(req, getJwtSecret)
    if (authUserId) {
      const requested = sanitizeUserId(queryUserId, authUserId)
      if (requested !== authUserId) {
        throw Object.assign(new Error('Forbidden'), { status: 403 })
      }
      return authUserId
    }
    return sanitizeUserId(queryUserId, getDefaultUserId())
  }

  try {
    const raw = await readRequestBody(req)
    const body = JSON.parse(raw || '{}')
    const events = Array.isArray(body.events) ? body.events : [body]
    if (events.length > MAX_ACTIVITY_BATCH) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: `Batch exceeds ${MAX_ACTIVITY_BATCH} events` }))
      return
    }

    const userId = resolveUserId(body.user_id || url.searchParams.get('user_id'))
    const pool = getPool(dbUrl)
    const count = await logActivityEntries(pool, userId, events)
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ ok: true, count }))
  } catch (err) {
    const status = err.status || 500
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json')
    res.end(
      JSON.stringify({
        error: status === 403 ? 'Forbidden' : clientSafeError(err),
      })
    )
  }
}

export function createActivityApiMiddleware(
  getDatabaseUrl,
  getJwtSecret,
  getDefaultUserId = () => 'local-user'
) {
  return async function activityApiMiddleware(req, res, next) {
    const url = new URL(req.url || '/', 'http://localhost')
    if (!url.pathname.startsWith('/api/activity')) return next()
    await handleActivityApiRequest(req, res, { getDatabaseUrl, getJwtSecret, getDefaultUserId })
  }
}
