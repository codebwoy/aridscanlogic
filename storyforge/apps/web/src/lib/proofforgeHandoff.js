/**
 * Hand StoryForge page text to ProofForge for kids/YA soft audit.
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
 * @param {object} project StoryForge project / book
 */
export function buildProofForgePayload(project) {
  const pages = Array.isArray(project?.pages) ? project.pages : []
  const sections = pages
    .map((p, i) => {
      const primary = String(p?.text_content || p?.text || '').trim()
      const secondary = String(p?.text_secondary || '').trim()
      const body = [primary, secondary].filter(Boolean).join('\n\n')
      if (!body) return null
      return {
        key: `page_${i + 1}`,
        title: p?.title || `Page ${i + 1}`,
        content_md: body,
        order: i,
      }
    })
    .filter(Boolean)

  return {
    title: project?.title || project?.working_title || 'StoryForge manuscript',
    subtitle: project?.subtitle || project?.cover_studio?.subtitle || undefined,
    author_name: project?.author_name || project?.cover_studio?.author || undefined,
    language: project?.language || 'en',
    language_variety: project?.language_variety,
    book_type: 'fiction',
    edit_mode: 'natural',
    publishing_target: 'editorial_only',
    document_domain: 'creative',
    genre_comparison: 'general_fiction',
    reading_level: 'children',
    audience: 'children',
    translation_mode: Boolean(
      pages.some((p) => String(p?.text_secondary || '').trim()) || project?.bilingual
    ),
    sections,
    source: 'storyforge',
    source_studio: 'storyforge',
    source_book_id: project?.id || null,
  }
}

/**
 * @param {object} project
 */
export async function handoffBookToProofForge(project) {
  const payload = buildProofForgePayload(project)
  if (!payload.sections.some((s) => String(s.content_md || '').trim())) {
    return {
      opened: false,
      reason: 'empty',
      error: 'Add page text before auditing in ProofForge.',
    }
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
