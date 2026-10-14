const TOKEN_KEY = 'proofforge_desktop_token'

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore */
  }
}

async function api(path, opts = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'X-ProofForge-Viewport': String(typeof window !== 'undefined' ? window.innerWidth : 1280),
    ...(opts.headers || {}),
  }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(path, {
    ...opts,
    headers,
    body: opts.body != null ? JSON.stringify(opts.body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || `HTTP ${res.status}`)
    err.code = data.code
    err.status = res.status
    throw err
  }
  return data
}

export const pfApi = {
  health: () => api('/health'),
  specs: () => api('/v1/specs'),
  credits: () => api('/v1/credits'),
  session: (viewportWidth) =>
    api('/v1/session/desktop', { method: 'POST', body: { viewportWidth } }).then((d) => {
      setToken(d.token)
      return d
    }),
  listProjects: () => api('/v1/projects'),
  getProject: (id) => api(`/v1/projects/${id}`),
  createProject: (body) => api('/v1/projects', { method: 'POST', body }),
  importProject: (body) => api('/v1/projects/import', { method: 'POST', body }),
  patchProject: (id, body) => api(`/v1/projects/${id}`, { method: 'PATCH', body }),
  estimate: (id) => api(`/v1/projects/${id}/estimate`),
  analyze: (id) => api(`/v1/projects/${id}/analyze`, { method: 'POST', body: {} }),
  getJob: (id) => api(`/v1/jobs/${id}`),
  resolveFinding: (projectId, findingId, body) =>
    api(`/v1/projects/${projectId}/findings/${findingId}/resolve`, { method: 'POST', body }),
  batchResolve: (projectId, body) =>
    api(`/v1/projects/${projectId}/findings/batch-resolve`, { method: 'POST', body }),
  undo: (projectId) => api(`/v1/projects/${projectId}/undo`, { method: 'POST', body: {} }),
  ingest: (body) => api('/v1/projects/ingest', { method: 'POST', body }),
  exportUrl: (projectId, kind) => `/v1/projects/${projectId}/export/${kind}`,
  kdpRulesAdmin: () => api('/v1/admin/kdp-rules'),
  kdpChecklist: (projectId) => api(`/v1/projects/${projectId}/kdp-checklist`),
}
