import { getPool } from './db-pool.mjs'
import { resolveAuthenticatedUserId } from './auth.mjs'
import { mergeEntityPayload, validateEntityPayload } from './entityValidate.mjs'
import {
  clientSafeError,
  sanitizeFilterKey,
  sanitizeRecordId,
  sanitizeUserId,
} from './security.mjs'

const MAX_SYNC_BATCH = 500

const ENTITY_TYPES = new Set([
  'Document',
  'Folder',
  'SavedLawyerMessage',
  'Receipt',
  'MileageLog',
  'BusinessProfile',
  'BusinessRegistration',
  'TaxDeadline',
  'DocDraftDocument',
  'Contract',
  'ContractSigner',
])

function rowToRecord(row) {
  const payload = row.payload || {}
  return {
    id: row.id,
    ...payload,
    created_by_id: payload.created_by_id ?? row.user_id,
    created_date: payload.created_date ?? row.created_date?.toISOString?.() ?? row.created_date,
    updated_date: row.updated_date?.toISOString?.() ?? row.updated_date ?? payload.updated_date,
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > 8 * 1024 * 1024) {
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

export function defaultGetDatabaseUrl() {
  return (process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || '').trim()
}

export function defaultGetJwtSecret() {
  return (process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET || '').trim()
}

export async function handleDbApiRequest(
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
  if (!url.pathname.startsWith('/api/db')) {
    res.statusCode = 404
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Not found' }))
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

  if (url.pathname === '/api/db/status' && req.method === 'GET') {
    const dbUrl = resolveGetter(getDatabaseUrl, defaultGetDatabaseUrl)
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 'no-store')
    if (!dbUrl) {
      res.end(JSON.stringify({ connected: false, configured: false }))
      return
    }
    try {
      await getPool(dbUrl).query('SELECT 1')
      res.end(JSON.stringify({ connected: true, configured: true }))
    } catch {
      res.end(JSON.stringify({ connected: false, configured: true }))
    }
    return
  }

  const dbUrl = resolveGetter(getDatabaseUrl, defaultGetDatabaseUrl)
  if (!dbUrl) {
    res.statusCode = 503
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Database not configured' }))
    return
  }

  const pool = getPool(dbUrl)

  const syncMatch = url.pathname.match(/^\/api\/db\/sync\/([^/]+)$/)
  if (syncMatch && req.method === 'POST') {
    const entityType = decodeURIComponent(syncMatch[1])
    if (!ENTITY_TYPES.has(entityType)) {
      res.statusCode = 400
      res.end(JSON.stringify({ error: 'Unknown entity type' }))
      return
    }
    try {
      const raw = await readRequestBody(req)
      const { records = [], user_id } = JSON.parse(raw || '{}')
      if (!Array.isArray(records) || records.length > MAX_SYNC_BATCH) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: `Sync batch exceeds ${MAX_SYNC_BATCH} records` }))
        return
      }
      const userId = resolveUserId(user_id)
      const client = await pool.connect()
      try {
        await client.query('BEGIN')
        for (const rec of records) {
          const id = sanitizeRecordId(rec?.id)
          if (!id) continue
          const { id: _id, created_date, updated_date, created_by_id, ...rest } = rec
          const payload = { ...rest, created_by_id: created_by_id || userId }
          await client.query(
            `INSERT INTO scanlogic_records (id, entity_type, user_id, payload, created_date, updated_date)
             VALUES ($1, $2, $3, $4::jsonb, COALESCE($5::timestamptz, NOW()), $6::timestamptz)
             ON CONFLICT (id) DO UPDATE SET
               payload = EXCLUDED.payload,
               updated_date = COALESCE(EXCLUDED.updated_date, NOW())
             WHERE scanlogic_records.user_id = EXCLUDED.user_id`,
            [
              id,
              entityType,
              userId,
              JSON.stringify(payload),
              created_date || null,
              updated_date || null,
            ]
          )
        }
        await client.query('COMMIT')
      } catch (e) {
        await client.query('ROLLBACK')
        throw e
      } finally {
        client.release()
      }
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: true, count: records.length }))
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
    return
  }

  const entityMatch = url.pathname.match(/^\/api\/db\/([^/]+)(?:\/([^/]+))?$/)
  if (!entityMatch) {
    res.statusCode = 404
    res.end(JSON.stringify({ error: 'Not found' }))
    return
  }

  const entityType = decodeURIComponent(entityMatch[1])
  const rawRecordId = entityMatch[2] ? decodeURIComponent(entityMatch[2]) : null
  const recordId = rawRecordId ? sanitizeRecordId(rawRecordId) : null

  if (rawRecordId && !recordId) {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Invalid record id' }))
    return
  }

  if (entityType === 'status' || !ENTITY_TYPES.has(entityType)) {
    res.statusCode = entityType === 'status' ? 404 : 400
    res.end(JSON.stringify({ error: 'Unknown entity' }))
    return
  }

  try {
    const userId = resolveUserId(url.searchParams.get('user_id'))

    if (req.method === 'GET' && !recordId) {
      const filterKey = sanitizeFilterKey(url.searchParams.get('filter_key'))
      const filterVal = url.searchParams.get('filter_value')
      let query = `SELECT * FROM scanlogic_records WHERE entity_type = $1 AND user_id = $2`
      const params = [entityType, userId]
      if (filterKey && filterVal !== null && filterVal.length <= 512) {
        query += ` AND payload->>$3 = $4`
        params.push(filterKey, filterVal)
      }
      query += ' ORDER BY created_date DESC'
      const { rows } = await pool.query(query, params)
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(rows.map(rowToRecord)))
      return
    }

    if (req.method === 'GET' && recordId) {
      const { rows } = await pool.query(
        `SELECT * FROM scanlogic_records WHERE entity_type = $1 AND id = $2 AND user_id = $3`,
        [entityType, recordId, userId]
      )
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(rows[0] ? rowToRecord(rows[0]) : null))
      return
    }

    if (req.method === 'POST' && !recordId) {
      const raw = await readRequestBody(req)
      const data = JSON.parse(raw || '{}')
      const id =
        sanitizeRecordId(data.id) || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      const created_date = data.created_date || new Date().toISOString()
      const { id: _i, created_date: _cd, updated_date, created_by_id, ...rest } = data
      const payload = validateEntityPayload(entityType, {
        ...rest,
        created_by_id: created_by_id || userId,
        created_date,
      })
      await pool.query(
        `INSERT INTO scanlogic_records (id, entity_type, user_id, payload, created_date)
         VALUES ($1, $2, $3, $4::jsonb, $5::timestamptz)`,
        [id, entityType, userId, JSON.stringify(payload), created_date]
      )
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ id, ...payload, created_date }))
      return
    }

    if (req.method === 'PATCH' && recordId) {
      const raw = await readRequestBody(req)
      const data = JSON.parse(raw || '{}')
      const updated_date = new Date().toISOString()
      const { rows: existing } = await pool.query(
        `SELECT payload FROM scanlogic_records WHERE entity_type = $1 AND id = $2 AND user_id = $3`,
        [entityType, recordId, userId]
      )
      if (!existing.length) {
        res.statusCode = 404
        res.end(JSON.stringify({ error: 'Not found' }))
        return
      }
      const merged = mergeEntityPayload(entityType, existing[0].payload, { ...data, updated_date })
      await pool.query(
        `UPDATE scanlogic_records SET payload = $1::jsonb, updated_date = $2::timestamptz WHERE id = $3 AND entity_type = $4`,
        [JSON.stringify(merged), updated_date, recordId, entityType]
      )
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ id: recordId, ...merged }))
      return
    }

    if (req.method === 'DELETE' && recordId) {
      const { rowCount } = await pool.query(
        `DELETE FROM scanlogic_records WHERE entity_type = $1 AND id = $2 AND user_id = $3`,
        [entityType, recordId, userId]
      )
      if (!rowCount) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Not found' }))
        return
      }
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ success: true }))
      return
    }

    res.statusCode = 405
    res.end(JSON.stringify({ error: 'Method not allowed' }))
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

export function createDbApiMiddleware(getDatabaseUrl, getJwtSecret, getDefaultUserId = () => 'local-user') {
  return async function dbApiMiddleware(req, res, next) {
    const url = new URL(req.url || '/', 'http://localhost')
    if (!url.pathname.startsWith('/api/db')) return next()
    await handleDbApiRequest(req, res, { getDatabaseUrl, getJwtSecret, getDefaultUserId })
  }
}
