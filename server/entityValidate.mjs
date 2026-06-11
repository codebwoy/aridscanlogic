/** Server-side entity payload validation (subset of src/lib/schemas.js). */

const ENTITY_FIELDS = {
  Document: new Set([
    'title',
    'document_type',
    'ocr_text',
    'markdown_result',
    'pages',
    'page_count',
    'status',
    'is_starred',
    'folder',
    'folder_id',
    'created_by_id',
    'created_date',
    'updated_date',
  ]),
  Folder: new Set(['name', 'emoji', 'color', 'created_by_id', 'created_date', 'updated_date']),
  SavedLawyerMessage: new Set([
    'conversation_id',
    'user_prompt',
    'category_id',
    'message_content',
    'message_title',
    'conversation_title',
    'is_hidden',
    'saved_date',
    'created_by_id',
    'created_date',
    'updated_date',
  ]),
  Receipt: new Set([
    'vendor_name',
    'purchase_date',
    'total_amount',
    'vat_amount',
    'currency',
    'category',
    'deductible_amount',
    'tax_year',
    'image_url',
    'expense_type',
    'created_by_id',
    'created_date',
    'updated_date',
  ]),
  MileageLog: new Set([
    'trip_date',
    'start_location',
    'end_location',
    'distance_km',
    'rate_per_km',
    'deductible_amount',
    'tax_year',
    'created_by_id',
    'created_date',
    'updated_date',
  ]),
  BusinessProfile: new Set(['created_by_id', 'created_date', 'updated_date']),
  BusinessRegistration: new Set([
    'business_structure',
    'registration_status',
    'gewerbe_status',
    'finanzamt_status',
    'vat_status',
    'steuernummer',
    'ust_id_nr',
    'created_by_id',
    'created_date',
    'updated_date',
  ]),
  TaxDeadline: new Set([
    'deadline_name',
    'due_date',
    'is_filed',
    'category',
    'created_by_id',
    'created_date',
    'updated_date',
  ]),
  DocDraftDocument: new Set([
    'profile_id',
    'client_id',
    'document_type',
    'document_number',
    'status',
    'issue_date',
    'due_date',
    'currency',
    'line_items',
    'subtotal_net',
    'total_vat',
    'total_gross',
    'notes',
    'created_by_id',
    'created_date',
    'updated_date',
  ]),
  Contract: new Set([
    'title',
    'template_type',
    'status',
    'contract_body',
    'effective_date',
    'signing_order',
    'parties',
    'created_by_id',
    'created_date',
    'updated_date',
  ]),
  ContractSigner: new Set([
    'contract_id',
    'signer_name',
    'signer_email',
    'signing_order_index',
    'signing_status',
    'signature_image_url',
    'signed_at',
    'created_by_id',
    'created_date',
    'updated_date',
  ]),
}

const MAX_PAYLOAD_KEYS = 64
const MAX_STRING_LEN = 500_000

function sanitizeValue(value) {
  if (value === null || typeof value === 'boolean' || typeof value === 'number') return value
  if (typeof value === 'string') return value.slice(0, MAX_STRING_LEN)
  if (Array.isArray(value)) return value.slice(0, 200).map(sanitizeValue)
  if (typeof value === 'object') {
    const out = {}
    let count = 0
    for (const [k, v] of Object.entries(value)) {
      if (count >= MAX_PAYLOAD_KEYS) break
      if (typeof k !== 'string' || k.length > 64) continue
      out[k] = sanitizeValue(v)
      count += 1
    }
    return out
  }
  return undefined
}

export function validateEntityPayload(entityType, data) {
  const allowed = ENTITY_FIELDS[entityType]
  if (!allowed || !data || typeof data !== 'object') {
    throw new Error('Invalid entity payload')
  }
  const out = {}
  for (const [key, value] of Object.entries(data)) {
    if (key === 'id') continue
    if (!allowed.has(key)) continue
    out[key] = sanitizeValue(value)
  }
  return out
}

export function mergeEntityPayload(entityType, existing, patch) {
  return { ...existing, ...validateEntityPayload(entityType, patch) }
}
