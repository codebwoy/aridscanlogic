/**
 * Launch StoryForge desktop studio from ScanLogic (Amazon Hub).
 * Mobile / narrow viewports must not open the editor — show messaging instead.
 * Probes the local studio before opening so users never land on ERR_CONNECTION_REFUSED.
 */

export const STORYFORGE_DESKTOP_MIN_WIDTH = 1024

export function getStoryforgeWebUrl() {
  const raw = (import.meta.env.VITE_STORYFORGE_URL || 'http://127.0.0.1:5180').trim()
  return raw.replace(/\/$/, '')
}

export function isStoryforgeDesktopViewport(width = typeof window !== 'undefined' ? window.innerWidth : 0) {
  return Number(width) >= STORYFORGE_DESKTOP_MIN_WIDTH
}

/**
 * @param {string} [baseUrl]
 * @param {number} [timeoutMs]
 * @returns {Promise<boolean>}
 */
export async function probeStoryforgeReady(baseUrl = getStoryforgeWebUrl(), timeoutMs = 2500) {
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
    // Cross-origin from ScanLogic: opaque response still proves the studio port is up.
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
 * @param {{ view?: 'studio' | 'launchpad' }} [opts]
 * @returns {Promise<{ opened: boolean, reason?: 'mobile' | 'popup_blocked' | 'offline', url?: string }>}
 */
export async function launchStoryforgeDesktop(opts = {}) {
  if (!isStoryforgeDesktopViewport()) {
    return { opened: false, reason: 'mobile' }
  }
  const base = getStoryforgeWebUrl()
  const view = opts.view === 'launchpad' ? 'launchpad' : 'studio'
  const url = `${base}/?view=${view}#${view}`

  const ready = await probeStoryforgeReady(base)
  if (!ready) {
    return { opened: false, reason: 'offline', url }
  }

  // Do not pass noopener as windowFeatures — Chrome then returns null even when the tab opens.
  const win = window.open(url, 'storyforge_studio')
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
 * Shared toast handling for Amazon Hub panels.
 * @param {(key: string) => string} t
 * @param {{ opened: boolean, reason?: string }} result
 * @param {{ message: (m: string) => void, error: (m: string) => void }} toastApi
 */
export function notifyStoryforgeLaunchResult(t, result, toastApi) {
  if (result?.opened) return
  if (result?.reason === 'mobile') {
    toastApi.message(t('storyforgeMobile'))
    return
  }
  if (result?.reason === 'offline') {
    toastApi.error(t('storyforgeOffline'))
    return
  }
  toastApi.error(t('storyforgePopupBlocked'))
}
