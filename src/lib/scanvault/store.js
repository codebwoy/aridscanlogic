const PREFIX = 'scanvault_'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value))
}

/** Internal — backup/import */
export function writeRawStore(key, value) {
  write(key, value)
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function getSessionUser() {
  return read('user', null)
}

export function saveSessionUser(user) {
  write('user', user)
  return user
}

export function clearSessionUser() {
  localStorage.removeItem(PREFIX + 'user')
}

export function isOnboardingDone() {
  return localStorage.getItem(PREFIX + 'onboarding') === '1'
}

export function setOnboardingDone() {
  localStorage.setItem(PREFIX + 'onboarding', '1')
}

export function getSettings() {
  return {
    defaultFilter: 'auto',
    defaultFormat: 'pdf',
    autoCapture: false,
    flash: 'auto',
    ocrLanguage: 'eng',
    weeklySummary: false,
    backupReminder: true,
    ...read('settings', {}),
  }
}

export function saveSettings(patch) {
  const merged = { ...getSettings(), ...patch }
  write('settings', merged)
  return merged
}

export function listDocuments() {
  return read('documents', []).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )
}

export function getDocument(id) {
  return listDocuments().find((d) => d.id === id) || null
}

export function saveDocument(doc) {
  const list = listDocuments()
  const idx = list.findIndex((d) => d.id === doc.id)
  const item = {
    ...doc,
    id: doc.id || uid(),
    updatedAt: new Date().toISOString(),
  }
  if (idx >= 0) list[idx] = { ...list[idx], ...item }
  else {
    item.createdAt = new Date().toISOString()
    list.unshift(item)
  }
  write('documents', list)
  updateStorageUsed()
  return item
}

export function deleteDocument(id) {
  write(
    'documents',
    listDocuments().filter((d) => d.id !== id)
  )
  updateStorageUsed()
}

export function listFolders() {
  const custom = read('folders', [])
  const uncategorized = {
    id: 'uncategorized',
    name: 'Uncategorized',
    color: '#64748b',
    emoji: '📁',
    isDefault: true,
  }
  return [uncategorized, ...custom]
}

export function saveFolder(folder) {
  const custom = read('folders', [])
  const idx = custom.findIndex((f) => f.id === folder.id)
  const item = { ...folder, id: folder.id || uid() }
  if (idx >= 0) custom[idx] = item
  else custom.push(item)
  write('folders', custom)
  return item
}

export function deleteFolder(id) {
  write(
    'folders',
    read('folders', []).filter((f) => f.id !== id)
  )
  listDocuments().forEach((d) => {
    if (d.folderId === id) saveDocument({ ...d, folderId: 'uncategorized' })
  })
}

export function createShareLink(documentId, daysValid = 7) {
  const token = uid()
  const link = {
    id: uid(),
    documentId,
    token,
    expiresAt: new Date(Date.now() + daysValid * 86400000).toISOString(),
    viewCount: 0,
    createdAt: new Date().toISOString(),
  }
  const links = read('shared_links', [])
  links.push(link)
  write('shared_links', links)
  return link
}

export function incrementShareView(token) {
  const links = read('shared_links', [])
  const idx = links.findIndex((l) => l.token === token)
  if (idx < 0) return
  links[idx] = { ...links[idx], viewCount: (links[idx].viewCount || 0) + 1 }
  write('shared_links', links)
}

export function getShareByToken(token) {
  const link = read('shared_links', []).find((l) => l.token === token)
  if (!link) return null
  if (new Date(link.expiresAt) < new Date()) return null
  return { link, document: getDocument(link.documentId) }
}

export function updateStorageUsed() {
  const docs = listDocuments()
  let bytes = 0
  docs.forEach((d) => {
    ;(d.pages || []).forEach((p) => {
      bytes += (p.processedImageUrl || p.imageUrl || '').length
    })
    bytes += (d.extractedText || '').length
  })
  const user = getSessionUser()
  if (user) saveSessionUser({ ...user, storageUsedBytes: bytes, scanCount: docs.length })
}

export function searchDocuments(query, filters = {}) {
  const q = query.trim().toLowerCase()
  let results = listDocuments()
  if (q) {
    results = results.filter((d) => {
      const inName = d.name?.toLowerCase().includes(q)
      const inText = d.extractedText?.toLowerCase().includes(q)
      const folder = listFolders().find((f) => f.id === d.folderId)
      const inFolder = folder?.name?.toLowerCase().includes(q)
      return inName || inText || inFolder
    })
  }
  if (filters.folderId) results = results.filter((d) => d.folderId === filters.folderId)
  if (filters.type === 'pdf') results = results.filter((d) => d.pageCount > 0)
  return results
}
