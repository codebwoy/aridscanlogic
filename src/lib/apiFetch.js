const API_SECRET_KEY = 'scanlogic_api_secret'

/** Bearer token for non-local dev (session only — never use VITE_ for secrets). */
export function getApiSecret() {
  try {
    return sessionStorage.getItem(API_SECRET_KEY) || ''
  } catch {
    return ''
  }
}

export function setApiSecret(value) {
  try {
    if (!value) sessionStorage.removeItem(API_SECRET_KEY)
    else sessionStorage.setItem(API_SECRET_KEY, value.trim())
  } catch {
    /* ignore */
  }
}

export function apiFetch(url, options = {}) {
  const secret = getApiSecret()
  const headers = new Headers(options.headers || {})
  if (secret) headers.set('Authorization', `Bearer ${secret}`)
  return fetch(url, { ...options, headers })
}
