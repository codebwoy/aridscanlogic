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

export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'X-StoryForge-Viewport': String(getViewportWidth()),
  }
  if (auth) {
    const token = getSessionToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }
  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'same-origin',
  })
  return parse(res)
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
