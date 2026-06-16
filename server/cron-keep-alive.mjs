/**
 * Supabase keep-alive ping for cron jobs.
 *
 * Strategy (in order):
 *   1. GET /rest/v1/scanlogic_records?select=id&limit=1  (service role key — real DB query)
 *   2. GET /auth/v1/health  (anon key — fallback only, does NOT reset DB inactivity timer)
 *
 * Retry: up to 3 attempts, 3 s apart, on 502/503 and transient network errors.
 * Timeout: 10 s per attempt (Supabase needs time to wake from cold start).
 */

import PUBLIC_SUPABASE from '../config/supabase-public.json' with { type: 'json' }
import { isCronSecretConfigured, validateCronRequest } from './cron-auth.mjs'

const FETCH_TIMEOUT_MS = 10_000
const RETRY_DELAY_MS = 3_000
const MAX_ATTEMPTS = 3

const RETRYABLE_HTTP = new Set([502, 503])
const RETRYABLE_MSGS = [
  'fetch failed',
  'timed out',
  'econnrefused',
  'enotfound',
  'network error',
]

// ---------------------------------------------------------------------------
// Env helpers
// ---------------------------------------------------------------------------

function getSupabaseUrl() {
  return (
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    (typeof PUBLIC_SUPABASE?.url === 'string' ? PUBLIC_SUPABASE.url : '') ||
    ''
  ).trim()
}

function getServiceRoleKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    ''
  ).trim()
}

function getAnonKey() {
  return (
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    (typeof PUBLIC_SUPABASE?.anonKey === 'string' ? PUBLIC_SUPABASE.anonKey : '') ||
    ''
  ).trim()
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController()
  const tid = setTimeout(() => controller.abort(new Error('timed out')), timeoutMs)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(tid)
  }
}

function isRetryable(err, httpStatus) {
  if (httpStatus && RETRYABLE_HTTP.has(httpStatus)) return true
  if (err?.message) {
    const msg = err.message.toLowerCase()
    return RETRYABLE_MSGS.some((s) => msg.includes(s))
  }
  return false
}

// ---------------------------------------------------------------------------
// Ping primitives
// ---------------------------------------------------------------------------

async function pingRestTable(supabaseUrl, table, apiKey) {
  const url = `${supabaseUrl}/rest/v1/${table}?select=id&limit=1`
  const res = await fetchWithTimeout(
    url,
    { headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` } },
    FETCH_TIMEOUT_MS,
  )
  if (!res.ok) {
    const err = new Error(`REST ping HTTP ${res.status}`)
    err.status = res.status
    throw err
  }
}

async function pingAuthHealth(supabaseUrl, anonKey) {
  const url = `${supabaseUrl}/auth/v1/health`
  const res = await fetchWithTimeout(
    url,
    { headers: { apikey: anonKey } },
    FETCH_TIMEOUT_MS,
  )
  if (!res.ok) {
    const err = new Error(`Auth health HTTP ${res.status}`)
    err.status = res.status
    throw err
  }
}

// ---------------------------------------------------------------------------
// Main exported ping function
// ---------------------------------------------------------------------------

/**
 * @returns {Promise<{
 *   ok: boolean,
 *   error?: string,
 *   attempts: number,
 *   method?: 'rest-scanlogic_records' | 'auth-health',
 * }>}
 */
export async function pingSupabaseKeepAlive() {
  const supabaseUrl = getSupabaseUrl()
  const serviceKey = getServiceRoleKey()
  const anonKey = getAnonKey()

  const canRest = Boolean(supabaseUrl && serviceKey)
  const canAuth = Boolean(supabaseUrl && anonKey)

  if (!canRest && !canAuth) {
    return {
      ok: false,
      error: 'NOT_CONFIGURED: set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY',
      attempts: 0,
    }
  }

  let lastError = null
  let attempts = 0

  // ---- Primary: REST DB query (resets Supabase inactivity timer) ----
  if (canRest) {
    for (let i = 1; i <= MAX_ATTEMPTS; i++) {
      attempts = i
      try {
        await pingRestTable(supabaseUrl, 'scanlogic_records', serviceKey)
        return { ok: true, attempts, method: 'rest-scanlogic_records' }
      } catch (err) {
        lastError = err
        if (i < MAX_ATTEMPTS && isRetryable(err, err?.status)) {
          await sleep(RETRY_DELAY_MS)
          continue
        }
        break
      }
    }
  }

  // ---- Fallback: Auth health check ----
  if (canAuth) {
    attempts++
    try {
      await pingAuthHealth(supabaseUrl, anonKey)
      return { ok: true, attempts, method: 'auth-health' }
    } catch (err) {
      lastError = err
    }
  }

  return {
    ok: false,
    error: lastError?.message || 'Ping failed after all attempts',
    attempts,
  }
}

// ---------------------------------------------------------------------------
// HTTP handler (shared by Vite dev middleware + Vercel serverless)
// ---------------------------------------------------------------------------

function sendJson(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-cache, no-store')
  res.end(JSON.stringify(body))
}

export async function handleKeepAliveRequest(req, res) {
  const method = (req.method || 'GET').toUpperCase()

  if (!['GET', 'POST', 'HEAD'].includes(method)) {
    sendJson(res, 405, { error: 'Method not allowed' })
    return
  }

  if (!isCronSecretConfigured()) {
    sendJson(res, 500, { error: 'CRON_SECRET not configured' })
    return
  }

  const auth = validateCronRequest(req)
  if (!auth.valid) {
    sendJson(res, 401, { error: 'Unauthorized' })
    return
  }

  // HEAD: auth check only, no body
  if (method === 'HEAD') {
    res.statusCode = 200
    res.setHeader('Cache-Control', 'no-cache, no-store')
    res.end()
    return
  }

  const result = await pingSupabaseKeepAlive()

  if (result.ok) {
    sendJson(res, 200, {
      success: true,
      message: 'Database keep-alive ping successful — Supabase kept active',
      attempts: result.attempts,
      method: result.method,
    })
  } else {
    // Always return 200 so cron-job.org does not mark the job as failed/disabled.
    sendJson(res, 200, {
      success: false,
      message: 'Auth OK — Supabase ping failed, will retry on next schedule',
      details: result.error,
      attempts: result.attempts,
    })
  }
}

export function createKeepAliveMiddleware() {
  return async function keepAliveMiddleware(req, res, next) {
    const pathname = req.url?.split('?')[0] || ''
    if (pathname !== '/api/cron/keep-alive') return next()
    await handleKeepAliveRequest(req, res)
  }
}
