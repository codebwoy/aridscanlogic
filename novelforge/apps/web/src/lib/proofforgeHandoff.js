/**
 * Hand finished NovelForge manuscript to ProofForge for audit.
 * ProofForge local defaults: web :5183, API :8790
 */

function proofforgeWebUrl() {
  const raw = (import.meta.env.VITE_PROOFFORGE_URL || 'http://127.0.0.1:5183').trim()
  return raw.replace(/\/$/, '')
}

function proofforgeApiUrl() {
  const raw = (import.meta.env.VITE_PROOFFORGE_API_URL || '').trim()
  if (raw) return raw.replace(/\/$/, '')
  try {
    const web = new URL(proofforgeWebUrl())
    if (web.hostname === '127.0.0.1' || web.hostname === 'localhost') {
      return 'http://127.0.0.1:8790'
    }
  } catch {
    /* fall through */
  }
  return proofforgeWebUrl()
}

/**
 * @param {object} book
 */
export function buildProofForgePayload(book) {
  const sections = Object.entries(book?.sections || {}).map(([key, s], i) => ({
    key,
    title: s.title || key,
    content_md: s.content_md || '',
    order: i,
  }))
  return {
    title: book?.title || book?.working_title || 'NovelForge manuscript',
    language: book?.language || 'en',
    language_variety: book?.language_variety,
    book_type: 'fiction',
    edit_mode: 'natural',
    publishing_target: 'editorial_only',
    sections,
    source: 'novelforge',
    source_studio: 'novelforge',
    source_book_id: book?.id || null,
  }
}

/**
 * @param {object} book
 */
export async function handoffBookToProofForge(book) {
  const payload = buildProofForgePayload(book)
  if (!payload.sections.some((s) => String(s.content_md || '').trim())) {
    return { opened: false, reason: 'empty', error: 'Write at least one section before auditing.' }
  }

  const api = proofforgeApiUrl()
  const web = proofforgeWebUrl()

  try {
    const health = await fetch(`${web}/health`, { method: 'GET', mode: 'cors', cache: 'no-store' })
    if (!health.ok) {
      return {
        opened: false,
        reason: 'offline',
        error: 'ProofForge is not running. Start with npm run proofforge:dev',
        url: web,
      }
    }
  } catch {
    return {
      opened: false,
      reason: 'offline',
      error: 'ProofForge is not running. Start with npm run proofforge:dev',
      url: web,
    }
  }

  try {
    const res = await fetch(`${api}/v1/projects/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ProofForge-Viewport': String(window.innerWidth || 1280),
      },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return { opened: false, reason: 'import_failed', error: data.error || `HTTP ${res.status}` }
    }
    const url = `${web}/?view=studio&project=${encodeURIComponent(data.project.id)}`
    const win = window.open(url, 'proofforge_studio')
    if (!win) return { opened: false, reason: 'popup_blocked', url }
    try {
      win.opener = null
    } catch {
      /* ignore */
    }
    return { opened: true, url, projectId: data.project.id }
  } catch (err) {
    return { opened: false, reason: 'import_failed', error: err.message }
  }
}
