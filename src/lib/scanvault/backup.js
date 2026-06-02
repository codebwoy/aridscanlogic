import JSZip from 'jszip'
import {
  listDocuments,
  listFolders,
  getSettings,
  saveSettings,
  writeRawStore,
  updateStorageUsed,
} from './store'

const BACKUP_VERSION = 1

export async function exportScanVaultBackup() {
  const payload = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    documents: listDocuments(),
    folders: listFolders().filter((f) => !f.isDefault),
    settings: getSettings(),
  }
  const zip = new JSZip()
  zip.file('scanvault-backup.json', JSON.stringify(payload))
  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `scanvault_backup_${new Date().toISOString().slice(0, 10)}.zip`
  a.click()
  URL.revokeObjectURL(url)
}

export async function importScanVaultBackup(file) {
  const zip = await JSZip.loadAsync(file)
  const entry = zip.file('scanvault-backup.json')
  if (!entry) throw new Error('Invalid backup file')
  const payload = JSON.parse(await entry.async('string'))
  if (!payload.documents) throw new Error('Backup has no documents')

  writeRawStore('documents', payload.documents)
  if (payload.folders?.length) writeRawStore('folders', payload.folders)
  if (payload.settings) saveSettings(payload.settings)
  updateStorageUsed()
  return payload.documents.length
}
