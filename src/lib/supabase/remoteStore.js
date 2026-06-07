import { apiFetch } from '@/lib/apiFetch'

const USER_ID_KEY = 'scanlogic_user_id'

export function getRemoteUserId() {
  try {
    return localStorage.getItem(USER_ID_KEY) || 'local-user'
  } catch {
    return 'local-user'
  }
}

export function setRemoteUserId(id) {
  localStorage.setItem(USER_ID_KEY, id)
}

let dbConnected = null
let dbStatusPromise = null

export async function checkDbConnected() {
  if (dbStatusPromise) return dbStatusPromise

  dbStatusPromise = (async () => {
    try {
      const res = await apiFetch('/api/db/status', { cache: 'no-store' })
      if (!res.ok) {
        dbConnected = false
        return false
      }
      const data = await res.json()
      dbConnected = !!data.connected
      return dbConnected
    } catch {
      dbConnected = false
      return false
    } finally {
      dbStatusPromise = null
    }
  })()

  return dbStatusPromise
}

export function isDbConnected() {
  return dbConnected === true
}

function qs(params) {
  return new URLSearchParams(params).toString()
}

export function createRemoteEntityClient(entityName) {
  const userId = () => getRemoteUserId()

  return {
    async list(filter = {}) {
      const [filterKey, filterVal] = Object.entries(filter)[0] || []
      const params = { user_id: userId() }
      if (filterKey) {
        params.filter_key = filterKey
        params.filter_value = String(filterVal)
      }
      const res = await apiFetch(`/api/db/${encodeURIComponent(entityName)}?${qs(params)}`)
      if (!res.ok) throw new Error(await res.text())
      return res.json()
    },

    async get(id) {
      const res = await apiFetch(
        `/api/db/${encodeURIComponent(entityName)}/${encodeURIComponent(id)}?user_id=${encodeURIComponent(userId())}`
      )
      if (!res.ok) throw new Error(await res.text())
      return res.json()
    },

    async create(data) {
      const payload = {
        ...data,
        created_by_id: userId(),
        created_date: new Date().toISOString(),
      }
      const res = await apiFetch(`/api/db/${encodeURIComponent(entityName)}?user_id=${encodeURIComponent(userId())}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      return res.json()
    },

    async update(id, data) {
      const res = await apiFetch(
        `/api/db/${encodeURIComponent(entityName)}/${encodeURIComponent(id)}?user_id=${encodeURIComponent(userId())}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      )
      if (!res.ok) throw new Error(await res.text())
      return res.json()
    },

    async delete(id) {
      const res = await apiFetch(
        `/api/db/${encodeURIComponent(entityName)}/${encodeURIComponent(id)}?user_id=${encodeURIComponent(userId())}`,
        { method: 'DELETE' }
      )
      if (!res.ok) throw new Error(await res.text())
      return res.json()
    },
  }
}

/** Push all local records for one entity type to Supabase */
export async function syncEntityToRemote(entityName, localRecords) {
  const res = await apiFetch(`/api/db/sync/${encodeURIComponent(entityName)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ records: localRecords, user_id: getRemoteUserId() }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
