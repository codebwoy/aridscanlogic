import { sanitizeRecordId, sanitizeUserId } from './security.mjs'

const ACTION_RE = /^[a-z][a-z0-9._-]{0,63}$/
const ENTITY_TYPE_RE = /^[A-Za-z][A-Za-z0-9]{0,63}$/
const MAX_BATCH = 50
const MAX_METADATA_BYTES = 4096

export function sanitizeAction(action) {
  if (typeof action !== 'string' || !ACTION_RE.test(action)) return null
  return action
}

function sanitizeEntityType(entityType) {
  if (entityType == null || entityType === '') return null
  if (typeof entityType !== 'string' || !ENTITY_TYPE_RE.test(entityType)) return null
  return entityType
}

function sanitizeMetadata(metadata) {
  if (metadata == null) return {}
  if (typeof metadata !== 'object' || Array.isArray(metadata)) return {}
  try {
    const json = JSON.stringify(metadata)
    if (json.length > MAX_METADATA_BYTES) return {}
    return JSON.parse(json)
  } catch {
    return {}
  }
}

export function normalizeActivityEntry(entry, fallbackUserId) {
  const action = sanitizeAction(entry?.action)
  if (!action) return null
  const userId = sanitizeUserId(entry?.user_id, fallbackUserId)
  const entityType = sanitizeEntityType(entry?.entity_type)
  const entityId = entry?.entity_id ? sanitizeRecordId(String(entry.entity_id)) : null
  return {
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    metadata: sanitizeMetadata(entry?.metadata),
  }
}

/**
 * @param {import('pg').Pool} pool
 * @param {string} fallbackUserId
 * @param {Array<object>} rawEntries
 */
export async function logActivityEntries(pool, fallbackUserId, rawEntries) {
  if (!pool || !Array.isArray(rawEntries) || !rawEntries.length) return 0
  const entries = rawEntries
    .slice(0, MAX_BATCH)
    .map((entry) => normalizeActivityEntry(entry, fallbackUserId))
    .filter(Boolean)
  if (!entries.length) return 0

  const values = []
  const placeholders = entries.map((entry, index) => {
    const base = index * 5
    values.push(
      entry.user_id,
      entry.action,
      entry.entity_type,
      entry.entity_id,
      JSON.stringify(entry.metadata)
    )
    return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}::jsonb)`
  })

  await pool.query(
    `INSERT INTO scanlogic_activity (user_id, action, entity_type, entity_id, metadata)
     VALUES ${placeholders.join(', ')}`,
    values
  )
  return entries.length
}

export { MAX_BATCH as MAX_ACTIVITY_BATCH }
