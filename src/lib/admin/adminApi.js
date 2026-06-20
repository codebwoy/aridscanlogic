import { apiFetch } from '@/lib/apiFetch'
import { getAdminSecret } from '@/lib/activity/trackActivity'

function adminFetch(path, options = {}) {
  const secret = getAdminSecret()
  const headers = new Headers(options.headers || {})
  if (secret) {
    headers.set('Authorization', `Bearer ${secret}`)
    headers.set('X-Admin-Secret', secret)
  }
  return apiFetch(path, { ...options, headers })
}

async function parseJson(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  return data
}

export async function fetchAdminStatus() {
  const res = await apiFetch('/api/admin/status')
  return parseJson(res)
}

export async function fetchAdminStats() {
  const res = await adminFetch('/api/admin/stats')
  return parseJson(res)
}

export async function fetchAdminUsers({ limit = 50, offset = 0, search = '' } = {}) {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) })
  if (search) params.set('search', search)
  const res = await adminFetch(`/api/admin/users?${params}`)
  return parseJson(res)
}

export async function fetchAdminUserDetail(userId) {
  const res = await adminFetch(`/api/admin/users/${encodeURIComponent(userId)}`)
  return parseJson(res)
}

export async function fetchAdminActivity({ limit = 50, offset = 0, userId = '', action = '' } = {}) {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) })
  if (userId) params.set('user_id', userId)
  if (action) params.set('action', action)
  const res = await adminFetch(`/api/admin/activity?${params}`)
  return parseJson(res)
}
