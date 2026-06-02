const KEY = 'herr_mueller_cases'

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

function write(cases) {
  localStorage.setItem(KEY, JSON.stringify(cases))
}

export function getActiveCase(conversationId) {
  return read().find((c) => c.conversationId === conversationId) || null
}

export function ensureCase(conversationId, title = 'Beratung') {
  const cases = read()
  let c = cases.find((x) => x.conversationId === conversationId)
  if (!c) {
    c = {
      id: `case-${Date.now()}`,
      conversationId,
      title,
      categoryIds: [],
      timeline: [],
      summaries: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    cases.unshift(c)
    write(cases)
  }
  return c
}

export function updateCase(conversationId, patch) {
  const cases = read()
  const idx = cases.findIndex((c) => c.conversationId === conversationId)
  if (idx < 0) return null
  cases[idx] = { ...cases[idx], ...patch, updatedAt: new Date().toISOString() }
  write(cases)
  return cases[idx]
}

export function addTimelineEvent(conversationId, event) {
  const c = ensureCase(conversationId)
  const timeline = [
    ...(c.timeline || []),
    {
      id: `evt-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      ...event,
    },
  ]
  return updateCase(conversationId, { timeline })
}

export function addSummary(conversationId, summary) {
  const c = ensureCase(conversationId)
  const summaries = [
    ...(c.summaries || []),
    {
      id: `sum-${Date.now()}`,
      createdAt: new Date().toISOString(),
      content: summary,
    },
  ]
  return updateCase(conversationId, { summaries })
}

export function listCases() {
  return read().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}

export function setCaseCategory(conversationId, categoryId) {
  const c = ensureCase(conversationId)
  const ids = new Set([...(c.categoryIds || []), categoryId])
  return updateCase(conversationId, { categoryIds: [...ids] })
}

export function createNewCase(title = 'New consultation') {
  const conversationId = `conv-${Date.now()}`
  return ensureCase(conversationId, title)
}
