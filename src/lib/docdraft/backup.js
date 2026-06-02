import JSZip from 'jszip'
import appApi from '@/lib/appApi'
import {
  loadProfiles,
  loadDocuments,
  getActiveProfileId,
  setActiveProfileId,
  saveProfile,
} from './store'

const FILE = 'docdraft-backup.json'

export async function exportDocDraftBackup() {
  const profileId = getActiveProfileId()
  const docs = profileId ? await loadDocuments(profileId) : []
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    activeProfileId: profileId,
    profiles: loadProfiles(),
    clients: localStorage.getItem('scanlogic_dd_clients'),
    products: localStorage.getItem('scanlogic_dd_products'),
    payments: localStorage.getItem('scanlogic_dd_payments'),
    audit: localStorage.getItem('scanlogic_dd_audit'),
    settings: localStorage.getItem('scanlogic_dd_settings'),
    documents: docs,
  }
  const zip = new JSZip()
  zip.file(FILE, JSON.stringify(payload))
  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `docdraft_backup_${new Date().toISOString().slice(0, 10)}.zip`
  a.click()
  URL.revokeObjectURL(url)
}

export async function importDocDraftBackup(file) {
  const zip = await JSZip.loadAsync(file)
  const entry = zip.file(FILE)
  if (!entry) throw new Error('Invalid DocDraft backup')
  const payload = JSON.parse(await entry.async('string'))
  if (payload.clients) localStorage.setItem('scanlogic_dd_clients', payload.clients)
  if (payload.products) localStorage.setItem('scanlogic_dd_products', payload.products)
  if (payload.payments) localStorage.setItem('scanlogic_dd_payments', payload.payments)
  if (payload.audit) localStorage.setItem('scanlogic_dd_audit', payload.audit)
  if (payload.settings) localStorage.setItem('scanlogic_dd_settings', payload.settings)
  payload.profiles?.forEach((p) => saveProfile(p))
  if (payload.activeProfileId) setActiveProfileId(payload.activeProfileId)
  for (const d of payload.documents || []) {
    if (d.id) await appApi.entities.DocDraftDocument.update(d.id, d)
    else await appApi.entities.DocDraftDocument.create(d)
  }
  return payload.documents?.length || 0
}
