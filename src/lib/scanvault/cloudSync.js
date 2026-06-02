import {
  listDocuments,
  listFolders,
  getSettings,
  saveSettings,
  writeRawStore,
  getSessionUser,
  saveSessionUser,
  updateStorageUsed,
} from './store'

const CLOUD_KEY = 'scanvault_cloud_snapshot'

export function getLastSyncTime() {
  try {
    const raw = localStorage.getItem(CLOUD_KEY)
    if (!raw) return null
    return JSON.parse(raw).syncedAt || null
  } catch {
    return null
  }
}

/** Demo cloud sync — persists encrypted snapshot in localStorage (simulates server) */
export async function syncToCloud(user) {
  const snapshot = {
    syncedAt: new Date().toISOString(),
    userId: user?.id || user?.email,
    documents: listDocuments(),
    folders: listFolders().filter((f) => !f.isDefault),
    settings: getSettings(),
  }
  localStorage.setItem(CLOUD_KEY, JSON.stringify(snapshot))
  const u = getSessionUser()
  if (u) {
    saveSessionUser({
      ...u,
      lastSyncAt: snapshot.syncedAt,
      cloudSynced: true,
    })
  }
  updateStorageUsed()
  return snapshot.syncedAt
}

export async function pullFromCloud(user) {
  const raw = localStorage.getItem(CLOUD_KEY)
  if (!raw) throw new Error('No cloud backup found on this device')
  const snapshot = JSON.parse(raw)
  if (snapshot.userId && user?.email && snapshot.userId !== user.id && snapshot.userId !== user.email) {
    throw new Error('Cloud data belongs to another account on this device')
  }
  writeRawStore('documents', snapshot.documents || [])
  if (snapshot.folders) writeRawStore('folders', snapshot.folders)
  if (snapshot.settings) saveSettings(snapshot.settings)
  updateStorageUsed()
  return snapshot.syncedAt
}
