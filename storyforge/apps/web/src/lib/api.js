import { getViewportWidth } from './desktopGate.js'

const TOKEN_KEY = 'storyforge_desktop_session'

export function getSessionToken() {
  return sessionStorage.getItem(TOKEN_KEY) || ''
}

export function setSessionToken(token) {
  if (token) sessionStorage.setItem(TOKEN_KEY, token)
  else sessionStorage.removeItem(TOKEN_KEY)
}

async function parse(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || res.statusText)
    err.status = res.status
    err.code = data.code
    throw err
  }
  return data
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function isRetryable(err, res) {
  if (res && (res.status === 502 || res.status === 503 || res.status === 504)) return true
  if (!err) return false
  const msg = String(err.message || err)
  return (
    err.name === 'TypeError' ||
    /Failed to fetch|NetworkError|ECONNREFUSED|api_unavailable/i.test(msg)
  )
}

/**
 * Fetch with short retries — covers API cold start and node --watch restarts.
 */
export async function api(path, { method = 'GET', body, auth = true, retries = 4 } = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'X-StoryForge-Viewport': String(getViewportWidth()),
  }
  if (auth) {
    const token = getSessionToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let lastErr
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(path, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'same-origin',
      })
      if (!res.ok && isRetryable(null, res) && attempt < retries) {
        await sleep(350 * (attempt + 1))
        continue
      }
      return await parse(res)
    } catch (e) {
      lastErr = e
      if (attempt < retries && isRetryable(e)) {
        await sleep(350 * (attempt + 1))
        continue
      }
      throw e
    }
  }
  throw lastErr || new Error('API request failed')
}

export async function openDesktopSession(externalRef = 'local-dev') {
  const data = await api('/v1/session/desktop', {
    method: 'POST',
    auth: false,
    body: { viewportWidth: getViewportWidth(), externalRef },
  })
  setSessionToken(data.token)
  return data
}
