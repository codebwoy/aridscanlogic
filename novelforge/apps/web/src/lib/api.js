const TOKEN_KEY = 'novelforge_desktop_token'

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY) || ''
}

export function setToken(token) {
  if (token) sessionStorage.setItem(TOKEN_KEY, token)
  else sessionStorage.removeItem(TOKEN_KEY)
}

async function api(path, { method = 'GET', body, headers = {} } = {}) {
  const token = getToken()
  const res = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'X-NovelForge-Viewport': String(window.innerWidth || 0),
      ...headers,
    },
    body: body != null ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || `HTTP ${res.status}`)
    err.status = res.status
    err.code = data.code
    err.data = data
    throw err
  }
  return data
}

export async function ensureSession() {
  const data = await api('/v1/session/desktop', {
    method: 'POST',
    body: { viewportWidth: window.innerWidth, externalRef: 'local-dev' },
  })
  setToken(data.token)
  return data
}

export async function getMe() {
  return api('/v1/me')
}

export async function getSpecs() {
  return api('/v1/specs')
}

export async function listBooks() {
  return api('/v1/books')
}

export async function createBook(body) {
  return api('/v1/books', { method: 'POST', body })
}

export async function importBook(body) {
  return api('/v1/books/import', { method: 'POST', body })
}

export async function getBook(id) {
  return api(`/v1/books/${id}`)
}

export async function patchBook(id, body) {
  return api(`/v1/books/${id}`, { method: 'PATCH', body })
}

export async function deleteBook(id) {
  return api(`/v1/books/${id}`, { method: 'DELETE' })
}

export async function stepBook(id, direction, step) {
  return api(`/v1/books/${id}/step`, { method: 'POST', body: { direction, step } })
}

export async function lockBible(id) {
  return api(`/v1/books/${id}/lock-bible`, { method: 'POST', body: {} })
}

export async function getCoverage(id) {
  return api(`/v1/books/${id}/coverage`)
}

export async function saveSection(id, sectionKey, content_md) {
  return api(`/v1/books/${id}/section`, {
    method: 'PATCH',
    body: { sectionKey, content_md, status: 'edited' },
  })
}

export async function fillStorySlot(id, index, user_supplied_text, status = 'filled') {
  return api(`/v1/books/${id}/story-slot`, {
    method: 'POST',
    body: { index, user_supplied_text, status },
  })
}

export async function updateClaim(id, index, verification_status) {
  return api(`/v1/books/${id}/claim`, {
    method: 'POST',
    body: { index, verification_status },
  })
}

export async function getExportGate(id) {
  return api(`/v1/books/${id}/export-gate`)
}

export async function saveCompliance(id, body) {
  return api(`/v1/books/${id}/compliance`, { method: 'POST', body })
}

export async function submitJob(type, bookId, inputs = {}) {
  return api('/v1/jobs', { method: 'POST', body: { type, bookId, inputs } })
}

export async function getJob(id) {
  return api(`/v1/jobs/${id}`)
}

/** Client poll budget — writing/outline Anthropic calls often exceed 2 minutes. */
export function jobWaitTimeoutMs(type) {
  switch (type) {
    case 'generate_all_chapter':
      return 900_000 // 15 min — multiple scene drafts in one job
    case 'section_draft':
    case 'section_regenerate':
    case 'outline_generate':
    case 'outline_regenerate_subtree':
    case 'outline_expand_chapter':
    case 'manuscript_import':
      return 600_000 // 10 min
    default:
      return 300_000 // 5 min
  }
}

export async function waitJob(id, { timeoutMs = 300_000, intervalMs = 800 } = {}) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const { job } = await getJob(id)
    if (job.status === 'completed' || job.status === 'failed') return job
    await new Promise((r) => setTimeout(r, intervalMs))
  }
  const mins = Math.round(timeoutMs / 60_000)
  throw new Error(
    `Job timed out after ${mins} min (still running on the server). Wait a moment, refresh the book, or retry Draft scene one scene at a time.`
  )
}

export async function grantDevCredits() {
  return api('/v1/credits/grant-dev', { method: 'POST', body: {} })
}

export async function getStorefront(slug) {
  return api(`/v1/store/${encodeURIComponent(slug)}`)
}

export async function checkoutStore(slug, email) {
  return api('/v1/store/checkout', { method: 'POST', body: { slug, email } })
}

export async function getAdminStats() {
  return api('/v1/admin/stats')
}
