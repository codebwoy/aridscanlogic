import { getPool } from './db-pool.mjs'
import { defaultGetDatabaseUrl } from './db-api.mjs'
import { validateAdminRequest, isAdminSecretConfigured } from './admin-auth.mjs'
import { clientSafeError, sanitizeUserId } from './security.mjs'

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > 64 * 1024) {
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

function resolveGetter(getter, fallback) {
  if (typeof getter === 'function') return getter()
  if (typeof getter === 'string') return getter.trim()
  return fallback()
}

function clampInt(value, fallback, min, max) {
  const n = parseInt(value, 10)
  if (Number.isNaN(n)) return fallback
  return Math.min(max, Math.max(min, n))
}

function json(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

function requireAdmin(req, res) {
  const auth = validateAdminRequest(req)
  if (!auth.valid) {
    json(res, auth.reason === 'ADMIN_API_SECRET not configured' ? 503 : 401, {
      error: auth.reason === 'ADMIN_API_SECRET not configured' ? 'Admin not configured' : 'Unauthorized',
    })
    return false
  }
  return true
}

async function queryAuthUsers(pool) {
  try {
    const { rows } = await pool.query(
      `SELECT id::text AS id, email, created_at, last_sign_in_at,
              raw_user_meta_data->>'name' AS name
       FROM auth.users
       ORDER BY created_at DESC`
    )
    return rows
  } catch {
    return null
  }
}

async function fetchOverviewStats(pool) {
  const [usersRes, activeRes, entitiesRes, activityRes, recentRes] = await Promise.all([
    pool.query(`
      SELECT COUNT(*)::int AS total FROM (
        SELECT user_id FROM scanlogic_records
        UNION
        SELECT user_id FROM scanlogic_activity
      ) u
    `),
    pool.query(`
      SELECT COUNT(DISTINCT user_id)::int AS active_24h
      FROM scanlogic_activity
      WHERE created_at > NOW() - INTERVAL '24 hours'
    `),
    pool.query(`
      SELECT entity_type, COUNT(*)::int AS count
      FROM scanlogic_records
      GROUP BY entity_type
      ORDER BY count DESC
    `),
    pool.query(`
      SELECT action, COUNT(*)::int AS count
      FROM scanlogic_activity
      WHERE created_at > NOW() - INTERVAL '7 days'
      GROUP BY action
      ORDER BY count DESC
      LIMIT 20
    `),
    pool.query(`
      SELECT COUNT(*)::int AS total
      FROM scanlogic_activity
      WHERE created_at > NOW() - INTERVAL '7 days'
    `),
  ])

  return {
    totalUsers: usersRes.rows[0]?.total ?? 0,
    activeLast24h: activeRes.rows[0]?.active_24h ?? 0,
    entityTotals: entitiesRes.rows,
    topActions7d: activityRes.rows,
    activityEvents7d: recentRes.rows[0]?.total ?? 0,
  }
}

async function fetchUserSummaries(pool, { limit, offset, search }) {
  const params = [limit, offset]
  let searchClause = ''
  if (search) {
    params.push(`%${search.slice(0, 128)}%`)
    searchClause = `AND u.user_id ILIKE $3`
  }

  const { rows } = await pool.query(
    `WITH user_ids AS (
       SELECT user_id FROM scanlogic_records
       UNION
       SELECT user_id FROM scanlogic_activity
     ),
     agg AS (
       SELECT user_id,
              COUNT(*)::int AS record_count,
              MAX(COALESCE(updated_date, created_date)) AS last_record_at
       FROM scanlogic_records
       GROUP BY user_id
     ),
     act AS (
       SELECT user_id,
              COUNT(*)::int AS activity_count,
              MAX(created_at) AS last_activity_at
       FROM scanlogic_activity
       GROUP BY user_id
     )
     SELECT u.user_id,
            COALESCE(agg.record_count, 0) AS record_count,
            COALESCE(act.activity_count, 0) AS activity_count,
            GREATEST(agg.last_record_at, act.last_activity_at) AS last_seen_at,
            NULL::text AS email,
            NULL::text AS name,
            NULL::timestamptz AS signed_up_at,
            NULL::timestamptz AS last_sign_in_at
     FROM user_ids u
     LEFT JOIN agg ON agg.user_id = u.user_id
     LEFT JOIN act ON act.user_id = u.user_id
     WHERE 1=1 ${searchClause}
     ORDER BY last_seen_at DESC NULLS LAST, u.user_id
     LIMIT $1 OFFSET $2`,
    params
  )

  try {
    const authMap = new Map()
    const authRows = await queryAuthUsers(pool)
    authRows?.forEach((u) => authMap.set(u.id, u))
    rows.forEach((row) => {
      const auth = authMap.get(row.user_id)
      if (auth) {
        row.email = auth.email
        row.name = auth.name
        row.signed_up_at = auth.created_at
        row.last_sign_in_at = auth.last_sign_in_at
      }
    })
  } catch {
    /* auth enrichment optional */
  }

  let users = rows
  if (search) {
    const q = search.toLowerCase()
    users = rows.filter(
      (r) => r.user_id.toLowerCase().includes(q) || (r.email || '').toLowerCase().includes(q)
    )
  }

  const countRes = await pool.query(
    `SELECT COUNT(*)::int AS total FROM (
       SELECT user_id FROM scanlogic_records
       UNION
       SELECT user_id FROM scanlogic_activity
     ) u`,
    []
  )

  return { users, total: countRes.rows[0]?.total ?? users.length }
}

async function fetchUserDetail(pool, userId) {
  const [profileRes, entitiesRes, activityRes, authRes] = await Promise.all([
    pool.query(
      `SELECT COUNT(*)::int AS record_count,
              MAX(COALESCE(updated_date, created_date)) AS last_record_at
       FROM scanlogic_records WHERE user_id = $1`,
      [userId]
    ),
    pool.query(
      `SELECT entity_type, COUNT(*)::int AS count,
              MAX(COALESCE(updated_date, created_date)) AS last_at
       FROM scanlogic_records
       WHERE user_id = $1
       GROUP BY entity_type
       ORDER BY count DESC`,
      [userId]
    ),
    pool.query(
      `SELECT id, action, entity_type, entity_id, metadata, created_at
       FROM scanlogic_activity
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 100`,
      [userId]
    ),
    pool.query(
      `SELECT id::text AS id, email, created_at, last_sign_in_at,
              raw_user_meta_data->>'name' AS name
       FROM auth.users WHERE id::text = $1 LIMIT 1`,
      [userId]
    ).catch(() => ({ rows: [] })),
  ])

  const recentRecords = await pool.query(
    `SELECT id, entity_type, created_date, updated_date,
            COALESCE(payload->>'title', payload->>'name', payload->>'vendor_name', id) AS label
     FROM scanlogic_records
     WHERE user_id = $1
     ORDER BY COALESCE(updated_date, created_date) DESC
     LIMIT 25`,
    [userId]
  )

  return {
    userId,
    email: authRes.rows[0]?.email ?? null,
    name: authRes.rows[0]?.name ?? null,
    signedUpAt: authRes.rows[0]?.created_at ?? null,
    lastSignInAt: authRes.rows[0]?.last_sign_in_at ?? null,
    recordCount: profileRes.rows[0]?.record_count ?? 0,
    lastRecordAt: profileRes.rows[0]?.last_record_at ?? null,
    entities: entitiesRes.rows,
    recentActivity: activityRes.rows,
    recentRecords: recentRecords.rows,
  }
}

async function fetchActivityFeed(pool, { limit, offset, userId, action }) {
  const params = [limit, offset]
  const filters = []
  if (userId) {
    params.push(userId)
    filters.push(`a.user_id = $${params.length}`)
  }
  if (action) {
    params.push(action)
    filters.push(`a.action = $${params.length}`)
  }
  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : ''

  const { rows } = await pool.query(
    `SELECT a.id, a.user_id, a.action, a.entity_type, a.entity_id,
            a.metadata, a.created_at,
            au.email
     FROM scanlogic_activity a
     LEFT JOIN auth.users au ON au.id::text = a.user_id
     ${where}
     ORDER BY a.created_at DESC
     LIMIT $1 OFFSET $2`,
    params
  )

  const countParams = params.slice(2)
  const countRes = await pool.query(
    `SELECT COUNT(*)::int AS total FROM scanlogic_activity a ${where}`,
    countParams
  )

  return { events: rows, total: countRes.rows[0]?.total ?? rows.length }
}

export async function handleAdminApiRequest(
  req,
  res,
  { getDatabaseUrl = defaultGetDatabaseUrl, pathname: pathnameOverride } = {}
) {
  const url = new URL(pathnameOverride || req.url || '/', 'http://localhost')
  if (!url.pathname.startsWith('/api/admin')) {
    json(res, 404, { error: 'Not found' })
    return
  }

  if (url.pathname === '/api/admin/status' && req.method === 'GET') {
    const dbUrl = resolveGetter(getDatabaseUrl, defaultGetDatabaseUrl)
    const configured = isAdminSecretConfigured()
    if (!configured) {
      json(res, 200, { configured: false, connected: false, hint: 'admin_secret_missing' })
      return
    }
    if (!dbUrl) {
      json(res, 200, { configured: true, connected: false, hint: 'database_missing' })
      return
    }
    try {
      await getPool(dbUrl).query('SELECT 1')
      json(res, 200, { configured: true, connected: true })
    } catch {
      json(res, 200, { configured: true, connected: false, hint: 'connection_failed' })
    }
    return
  }

  if (!requireAdmin(req, res)) return

  const dbUrl = resolveGetter(getDatabaseUrl, defaultGetDatabaseUrl)
  if (!dbUrl) {
    json(res, 503, { error: 'Database not configured' })
    return
  }

  const pool = getPool(dbUrl)

  try {
    if (url.pathname === '/api/admin/stats' && req.method === 'GET') {
      const stats = await fetchOverviewStats(pool)
      const authUsers = await queryAuthUsers(pool)
      json(res, 200, { ...stats, registeredUsers: authUsers?.length ?? null })
      return
    }

    if (url.pathname === '/api/admin/users' && req.method === 'GET') {
      const limit = clampInt(url.searchParams.get('limit'), 50, 1, 200)
      const offset = clampInt(url.searchParams.get('offset'), 0, 0, 10000)
      const search = (url.searchParams.get('search') || '').trim()
      const result = await fetchUserSummaries(pool, { limit, offset, search })
      json(res, 200, result)
      return
    }

    const userMatch = url.pathname.match(/^\/api\/admin\/users\/([^/]+)$/)
    if (userMatch && req.method === 'GET') {
      const userId = sanitizeUserId(decodeURIComponent(userMatch[1]), '')
      if (!userId) {
        json(res, 400, { error: 'Invalid user id' })
        return
      }
      const detail = await fetchUserDetail(pool, userId)
      json(res, 200, detail)
      return
    }

    if (url.pathname === '/api/admin/activity' && req.method === 'GET') {
      const limit = clampInt(url.searchParams.get('limit'), 50, 1, 200)
      const offset = clampInt(url.searchParams.get('offset'), 0, 0, 10000)
      const userId = url.searchParams.get('user_id')
        ? sanitizeUserId(url.searchParams.get('user_id'), '')
        : null
      const action = (url.searchParams.get('action') || '').trim().slice(0, 64) || null
      const result = await fetchActivityFeed(pool, { limit, offset, userId, action })
      json(res, 200, result)
      return
    }

    json(res, 404, { error: 'Not found' })
  } catch (err) {
    json(res, err.status || 500, { error: clientSafeError(err) })
  }
}

export function createAdminApiMiddleware(getDatabaseUrl) {
  return async function adminApiMiddleware(req, res, next) {
    const url = new URL(req.url || '/', 'http://localhost')
    if (!url.pathname.startsWith('/api/admin')) return next()
    await handleAdminApiRequest(req, res, { getDatabaseUrl })
  }
}
