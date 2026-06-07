const API_SECRET_KEY = 'scanlogic_api_secret'

/** LAN dev secret (session only — never use VITE_ for secrets). */
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

function getAuthToken() {
  try {
    return sessionStorage.getItem('scanlogic_auth_token') || ''
  } catch {
    return ''
  }
}

export function apiFetch(url, options = {}) {
  const secret = getApiSecret()
  const authToken = getAuthToken()
  const headers = new Headers(options.headers || {})

  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`)
    if (secret) headers.set('X-ScanLogic-Api-Secret', secret)
  } else if (secret) {
    headers.set('Authorization', `Bearer ${secret}`)
  }

  return fetch(url, { ...options, headers })
}
