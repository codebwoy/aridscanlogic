/**
 * Launch AuthorForge desktop studio from ScanLogic (Amazon Hub).
 * Mobile / narrow viewports must not open the editor — show messaging instead.
 */

export const AUTHORFORGE_DESKTOP_MIN_WIDTH = 1024

export function getAuthorforgeWebUrl() {
  const raw = (import.meta.env.VITE_AUTHORFORGE_URL || 'http://127.0.0.1:5181').trim()
  return raw.replace(/\/$/, '')
}

export function isAuthorforgeDesktopViewport(width = typeof window !== 'undefined' ? window.innerWidth : 0) {
  return Number(width) >= AUTHORFORGE_DESKTOP_MIN_WIDTH
}

/**
 * @param {string} [baseUrl]
 * @param {number} [timeoutMs]
 * @returns {Promise<boolean>}
 */
export async function probeAuthorforgeReady(baseUrl = getAuthorforgeWebUrl(), timeoutMs = 2500) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    try {
      const res = await fetch(`${baseUrl}/health`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-store',
        signal: ctrl.signal,
      })
      if (res.ok) {
        const data = await res.json().catch(() => null)
        if (data?.ok) return true
      }
    } catch {
      /* CORS or network — try opaque probe below */
    }
    const opaque = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store',
      signal: ctrl.signal,
    })
    return opaque.type === 'opaque' || opaque.ok
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

/**
 * @param {{ view?: 'studio' | 'store', slug?: string }} [opts]
 * @returns {Promise<{ opened: boolean, reason?: 'mobile' | 'popup_blocked' | 'offline', url?: string }>}
 */
export async function launchAuthorforgeDesktop(opts = {}) {
  if (!isAuthorforgeDesktopViewport()) {
    return { opened: false, reason: 'mobile' }
  }
  const base = getAuthorforgeWebUrl()
  const view = opts.view === 'store' ? 'store' : 'studio'
  const slug = opts.slug ? `&slug=${encodeURIComponent(opts.slug)}` : ''
  const url = `${base}/?view=${view}${slug}#${view}`

  const ready = await probeAuthorforgeReady(base)
  if (!ready) {
    return { opened: false, reason: 'offline', url }
  }

  const win = window.open(url, 'authorforge_studio')
  if (!win) return { opened: false, reason: 'popup_blocked', url }
  try {
    win.opener = null
  } catch {
    /* ignore */
  }
  try {
    win.focus()
  } catch {
    /* ignore */
  }
  return { opened: true, url }
}

/**
 * @param {(key: string) => string} t
 * @param {{ opened: boolean, reason?: string }} result
 * @param {{ message: (m: string) => void, error: (m: string) => void }} toastApi
 */
export function notifyAuthorforgeLaunchResult(t, result, toastApi) {
  if (result?.opened) return
  if (result?.reason === 'mobile') {
    toastApi.message(t('authorforgeMobile'))
    return
  }
  if (result?.reason === 'offline') {
    toastApi.error(t('authorforgeOffline'))
    return
  }
  toastApi.error(t('authorforgePopupBlocked'))
}
