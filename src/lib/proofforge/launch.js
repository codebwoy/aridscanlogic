/**
 * Launch ProofForge desktop manuscript-audit studio from ScanLogic (Amazon Hub).
 */

export const PROOFFORGE_DESKTOP_MIN_WIDTH = 1024

export function getProofforgeWebUrl() {
  const raw = (import.meta.env.VITE_PROOFFORGE_URL || 'http://127.0.0.1:5183').trim()
  return raw.replace(/\/$/, '')
}

export function getProofforgeApiUrl() {
  const raw = (import.meta.env.VITE_PROOFFORGE_API_URL || '').trim()
  if (raw) return raw.replace(/\/$/, '')
  // Local default: web proxies /v1; for cross-studio import use API directly
  try {
    const web = new URL(getProofforgeWebUrl())
    if (web.hostname === '127.0.0.1' || web.hostname === 'localhost') {
      return 'http://127.0.0.1:8790'
    }
  } catch {
    /* fall through */
  }
  return getProofforgeWebUrl()
}

export function isLocalProofforgeUrl(baseUrl = getProofforgeWebUrl()) {
  try {
    const host = new URL(baseUrl).hostname.toLowerCase()
    return host === 'localhost' || host === '127.0.0.1' || host === '[::1]'
  } catch {
    return true
  }
}

export function isProofforgeDesktopViewport(width = typeof window !== 'undefined' ? window.innerWidth : 0) {
  return Number(width) >= PROOFFORGE_DESKTOP_MIN_WIDTH
}

export async function probeProofforgeReady(baseUrl = getProofforgeWebUrl(), timeoutMs = 2500) {
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
 * @param {{ projectId?: string }} [opts]
 */
export async function launchProofforgeDesktop(opts = {}) {
  if (!isProofforgeDesktopViewport()) {
    return { opened: false, reason: 'mobile' }
  }
  const base = getProofforgeWebUrl()
  const project = opts.projectId ? `&project=${encodeURIComponent(opts.projectId)}` : ''
  const url = `${base}/?view=studio${project}`

  if (isLocalProofforgeUrl(base)) {
    const ready = await probeProofforgeReady(base, 2500)
    if (!ready) {
      return { opened: false, reason: 'offline', url }
    }
  }

  const win = window.open(url, 'proofforge_studio')
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
 * Import a manuscript package into ProofForge, then open the project.
 * @param {{
 *   title: string,
 *   language?: string,
 *   language_variety?: string,
 *   book_type?: string,
 *   sections?: { key?: string, title?: string, content_md?: string }[],
 *   manuscript_text?: string,
 *   source_studio?: string,
 *   source_book_id?: string,
 * }} payload
 */
export async function importAndOpenProofforge(payload) {
  if (!isProofforgeDesktopViewport()) {
    return { opened: false, reason: 'mobile' }
  }
  const api = getProofforgeApiUrl()
  const web = getProofforgeWebUrl()

  if (isLocalProofforgeUrl(web)) {
    const ready = await probeProofforgeReady(web, 2500)
    if (!ready) return { opened: false, reason: 'offline', url: web }
  }

  try {
    const res = await fetch(`${api}/v1/projects/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ProofForge-Viewport': String(window.innerWidth),
      },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return {
        opened: false,
        reason: 'import_failed',
        error: data.error || `HTTP ${res.status}`,
        url: web,
      }
    }
    const projectId = data.project?.id
    return launchProofforgeDesktop({ projectId })
  } catch (err) {
    return { opened: false, reason: 'import_failed', error: err.message, url: web }
  }
}
