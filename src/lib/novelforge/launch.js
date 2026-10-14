/**
 * Launch NovelForge desktop fiction studio from ScanLogic (Amazon Hub).
 * Mobile / narrow viewports must not open the editor — show messaging instead.
 */

export const NOVELFORGE_DESKTOP_MIN_WIDTH = 1024

export function getNovelforgeWebUrl() {
  const raw = (import.meta.env.VITE_NOVELFORGE_URL || 'http://127.0.0.1:5182').trim()
  return raw.replace(/\/$/, '')
}

export function isLocalNovelforgeUrl(baseUrl = getNovelforgeWebUrl()) {
  try {
    const host = new URL(baseUrl).hostname.toLowerCase()
    return host === 'localhost' || host === '127.0.0.1' || host === '[::1]'
  } catch {
    return true
  }
}

export function isNovelforgeDesktopViewport(width = typeof window !== 'undefined' ? window.innerWidth : 0) {
  return Number(width) >= NOVELFORGE_DESKTOP_MIN_WIDTH
}

export async function probeNovelforgeReady(baseUrl = getNovelforgeWebUrl(), timeoutMs = 2500) {
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
      /* CORS or network */
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
 */
export async function launchNovelforgeDesktop(opts = {}) {
  if (!isNovelforgeDesktopViewport()) {
    return { opened: false, reason: 'mobile' }
  }
  const base = getNovelforgeWebUrl()
  const view = opts.view === 'store' ? 'store' : 'studio'
  const slug = opts.slug ? `&slug=${encodeURIComponent(opts.slug)}` : ''
  const url = `${base}/?view=${view}${slug}#${view}`

  if (isLocalNovelforgeUrl(base)) {
    const ready = await probeNovelforgeReady(base, 2500)
    if (!ready) {
      return { opened: false, reason: 'offline', url }
    }
  }

  const win = window.open(url, 'novelforge_studio')
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

export function notifyNovelforgeLaunchResult(t, result, toastApi) {
  if (result?.opened) return
  if (result?.reason === 'mobile') {
    toastApi.message(t('novelforgeMobile'))
    return
  }
  if (result?.reason === 'offline') {
    toastApi.error(t('novelforgeOffline'))
    return
  }
  toastApi.error(t('novelforgePopupBlocked'))
}
