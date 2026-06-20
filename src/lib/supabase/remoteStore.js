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
let dbStatus = { connected: false, configured: false, blocked: false, hint: null }
let dbStatusPromise = null

export function getDbStatus() {
  return { ...dbStatus }
}

function applyStatus(partial) {
  dbStatus = { ...dbStatus, ...partial }
  dbConnected = dbStatus.connected === true
}

export async function checkDbConnected(force = false) {
  if (dbStatusPromise && !force) return dbStatusPromise

  dbStatusPromise = (async () => {
    try {
      const res = await apiFetch('/api/db/status', { cache: 'no-store' })
      if (res.status === 401 || res.status === 403) {
        applyStatus({
          connected: false,
          configured: null,
          blocked: true,
          hint: 'api_secret',
        })
        return false
      }
      if (!res.ok) {
        applyStatus({
          connected: false,
          configured: false,
          blocked: false,
          hint: 'unavailable',
        })
        return false
      }
      const data = await res.json()
      applyStatus({
        connected: !!data.connected,
        configured: !!data.configured,
        blocked: false,
        hint: data.connected ? null : data.hint || (data.configured ? 'connection_failed' : 'not_configured'),
      })
      return dbConnected
    } catch {
      applyStatus({
        connected: false,
        configured: false,
        blocked: false,
        hint: 'network',
      })
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

/** User-facing hint when Supabase sync is unavailable. */
export function dbConnectionMessage(lang = 'de') {
  const s = getDbStatus()
  if (s.connected) {
    return lang === 'de'
      ? 'Verbunden. Neue Speicherungen gehen an Supabase.'
      : 'Connected. New saves go to Supabase.'
  }
  if (s.blocked || s.hint === 'api_secret') {
    return lang === 'de'
      ? 'LAN-Zugriff blockiert. SCANLOGIC_API_SECRET in .env setzen und per sessionStorage im Browser hinterlegen.'
      : 'LAN access blocked. Set SCANLOGIC_API_SECRET in .env and store it via sessionStorage in the browser.'
  }
  if (!s.configured || s.hint === 'not_configured') {
    return lang === 'de'
      ? 'Nicht konfiguriert. DATABASE_URL in .env setzen und Dev-Server neu starten.'
      : 'Not configured. Set DATABASE_URL in .env and restart the dev server.'
  }
  if (s.hint === 'ssl') {
    return lang === 'de'
      ? 'SSL-Fehler. Für Supabase SCANLOGIC_PG_SSL_REJECT_UNAUTHORIZED=false in .env setzen oder Dev-Server neu starten.'
      : 'SSL error. For Supabase set SCANLOGIC_PG_SSL_REJECT_UNAUTHORIZED=false in .env or restart dev server.'
  }
  if (s.hint === 'auth') {
    return lang === 'de'
      ? 'Anmeldung fehlgeschlagen. Passwort in DATABASE_URL prüfen (Supabase → Database settings).'
      : 'Authentication failed. Check the password in DATABASE_URL (Supabase → Database settings).'
  }
  if (s.hint === 'network' || s.hint === 'unavailable') {
    return lang === 'de'
      ? 'Server nicht erreichbar. npm run dev starten — GitHub Pages hat kein /api/db.'
      : 'Server unreachable. Run npm run dev — GitHub Pages has no /api/db.'
  }
  return lang === 'de'
    ? 'Verbindung fehlgeschlagen. DATABASE_URL prüfen und Dev-Server neu starten.'
    : 'Connection failed. Check DATABASE_URL and restart the dev server.'
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
