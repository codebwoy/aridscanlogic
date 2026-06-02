import { syncEntityToRemote } from './remoteStore'

const STORAGE_PREFIX = 'scanlogic_entities_'
const LEGACY_PREFIX = 'scanlogic_base44_'

const ENTITY_NAMES = [
  'Document',
  'Folder',
  'SavedLawyerMessage',
  'Receipt',
  'MileageLog',
  'BusinessProfile',
  'BusinessRegistration',
  'TaxDeadline',
  'DocDraftDocument',
  'Contract',
  'ContractSigner',
]

function readLocal(entity) {
  try {
    let raw = localStorage.getItem(`${STORAGE_PREFIX}${entity}`)
    if (!raw) {
      raw = localStorage.getItem(`${LEGACY_PREFIX}${entity}`)
    }
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export async function pushAllLocalDataToSupabase(onProgress) {
  const results = []
  for (const name of ENTITY_NAMES) {
    const records = readLocal(name)
    onProgress?.(name, records.length)
    if (records.length === 0) {
      results.push({ entity: name, count: 0, skipped: true })
      continue
    }
    const { count } = await syncEntityToRemote(name, records)
    results.push({ entity: name, count })
  }
  localStorage.setItem('scanlogic_supabase_synced_at', new Date().toISOString())
  return results
}
