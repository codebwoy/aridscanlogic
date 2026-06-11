import { createClient } from '@supabase/supabase-js'
import PUBLIC_SUPABASE from '../config/supabase-public.json' with { type: 'json' }
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

function getSupabaseUrl() {
  return (
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    (typeof PUBLIC_SUPABASE.url === 'string' ? PUBLIC_SUPABASE.url : '') ||
    ''
  ).trim()
}

function getServiceRoleKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.VITE_SUPABASE_SECRET_KEY ||
    ''
  ).trim()
}

function getAnonKey() {
  return (
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    (typeof PUBLIC_SUPABASE.anonKey === 'string' ? PUBLIC_SUPABASE.anonKey : '') ||
    ''
  ).trim()
}

async function pingSupabaseRest(table, key) {
  const url = getSupabaseUrl()
  if (!url || !key) return false

  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { error } = await client.from(table).select('id').limit(1)
  if (error) throw error
  return true
}

async function pingSupabasePg(dbUrl) {
  await getPool(dbUrl).query('SELECT id FROM scanlogic_records LIMIT 1')
}

async function pingDatabase() {
  const dbUrl = (process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || '').trim()
  const serviceKey = getServiceRoleKey()
  const anonKey = getAnonKey()

  if (getSupabaseUrl() && serviceKey) {
    await pingSupabaseRest('scanlogic_records', serviceKey)
    return
  }

  if (dbUrl) {
    await pingSupabasePg(dbUrl)
    return
  }

  if (getSupabaseUrl() && anonKey) {
    await pingSupabaseRest('keep_alive_ping', anonKey)
    return
  }

  throw new Error('NOT_CONFIGURED')
}

/**
 * Lightweight Supabase ping for cron keep-alive.
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

  try {
    await pingDatabase()
    sendJson(res, 200, SUCCESS_BODY)
  } catch (err) {
    if (err?.message === 'NOT_CONFIGURED') {
      sendJson(res, 500, {
        error:
          'Database not configured. Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (or DATABASE_URL) on Vercel.',
      })
      return
    }
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
