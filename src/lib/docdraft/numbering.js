import { DOC_TYPES } from './constants'

export function formatDocumentNumber(profile, documentType, year = new Date().getFullYear()) {
  const meta = DOC_TYPES[documentType] || DOC_TYPES.invoice
  const seqKey = documentType === 'credit_note' ? 'credit_note' : documentType
  const num = profile.sequences?.[seqKey] ?? 1
  const padding = profile.numberPadding ?? 4
  const padded = String(num).padStart(padding, '0')
  const fmt = profile.invoiceFormat || '{PREFIX}-{YEAR}-{NUMBER}'
  return fmt
    .replace(/\{PREFIX\}/g, meta.prefix)
    .replace(/\{YEAR\}/g, String(year))
    .replace(/\{NUMBER\}/g, padded)
}

export function consumeNextNumber(profile, documentType) {
  const seqKey = documentType === 'credit_note' ? 'credit_note' : documentType
  const next = { ...profile.sequences }
  const current = next[seqKey] ?? 1
  const number = formatDocumentNumber({ ...profile, sequences: { ...next, [seqKey]: current } }, documentType)
  next[seqKey] = current + 1
  return { number, sequences: next }
}
