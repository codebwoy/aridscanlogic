/**
 * Client-side activity tracking — batches events to POST /api/activity/events.
 */

import { apiFetch } from '@/lib/apiFetch'
import { isDbConnected } from '@/lib/supabase/remoteStore'

const ADMIN_SECRET_KEY = 'scanlogic_admin_secret'
const FLUSH_MS = 4000
const MAX_BUFFER = 30

let buffer = []
let flushTimer = null
let dbReady = false

function getUserId() {
  try {
    return localStorage.getItem('scanlogic_user_id') || 'local-user'
  } catch {
    return 'local-user'
  }
}

async function ensureDbReady() {
  if (dbReady) return true
  try {
    dbReady = await isDbConnected()
  } catch {
    dbReady = false
  }
  return dbReady
}

async function flush() {
  if (!buffer.length) return
  const events = buffer.splice(0, MAX_BUFFER)
  if (!(await ensureDbReady())) {
    buffer.unshift(...events)
    return
  }
  try {
    await apiFetch('/api/activity/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: getUserId(), events }),
    })
  } catch {
    buffer.unshift(...events.slice(0, MAX_BUFFER - buffer.length))
  }
}

function scheduleFlush() {
  if (flushTimer) return
  flushTimer = setTimeout(() => {
    flushTimer = null
    flush()
  }, FLUSH_MS)
}

/**
 * Track a user activity event (fire-and-forget).
 * @param {string} action e.g. module.view, auth.sign_in, llm.invoke
 * @param {{ entity_type?: string, entity_id?: string, metadata?: object }} [detail]
 */
export function trackActivity(action, detail = {}) {
  buffer.push({
    action,
    entity_type: detail.entity_type,
    entity_id: detail.entity_id,
    metadata: detail.metadata || {},
  })
  if (buffer.length >= MAX_BUFFER) {
    flush()
    return
  }
  scheduleFlush()
}

export function initActivityTracking() {
  if (typeof window === 'undefined') return
  ensureDbReady()
  window.addEventListener('beforeunload', () => {
    if (!buffer.length) return
    const payload = JSON.stringify({ user_id: getUserId(), events: buffer.splice(0, MAX_BUFFER) })
    navigator.sendBeacon?.('/api/activity/events', new Blob([payload], { type: 'application/json' }))
  })
}

/** Admin API secret — session only, never bundled. */
export function getAdminSecret() {
  try {
    return sessionStorage.getItem(ADMIN_SECRET_KEY) || ''
  } catch {
    return ''
  }
}

export function setAdminSecret(value) {
  try {
    if (!value) sessionStorage.removeItem(ADMIN_SECRET_KEY)
    else sessionStorage.setItem(ADMIN_SECRET_KEY, value.trim())
  } catch {
    /* ignore */
  }
}

export function clearAdminSecret() {
  setAdminSecret('')
}
