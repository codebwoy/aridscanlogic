/**
 * KDP compliance checklist — prevention aids for honest publishing.
 * Not legal advice. Does not bypass Amazon enforcement.
 * Helps authors document ISBN plan, trademark self-check, rights, and AI disclosure
 * before Finish pack / KDP export.
 */

import { assessDisclosure } from './disclosure.js'

export const KDP_COMPLIANCE_META = {
  id: 'kdp_compliance',
  title: 'KDP compliance checklist',
  sourceIds: ['S66'],
  disclaimer:
    'Checklist only — not legal advice, not a guarantee against account action, and not a way to hide AI use. Complete honestly before uploading to Amazon KDP.',
}

/** External reference links (official or widely used registries). */
export const COMPLIANCE_LINKS = [
  {
    id: 'euipo',
    label: 'EUIPO trademark search',
    url: 'https://euipo.europa.eu/eSearch/',
    note: 'Search title + character names before publish (EU/DE).',
  },
  {
    id: 'uspto',
    label: 'USPTO TESS (US)',
    url: 'https://tmsearch.uspto.gov/',
    note: 'If you sell on Amazon.com, also clear US marks.',
  },
  {
    id: 'mvb_isbn',
    label: 'MVB / German ISBN',
    url: 'https://www.mvb.de/',
    note: 'Own ISBNs via MVB — optional but stronger control than free KDP ISBN.',
  },
  {
    id: 'kdp_help_ai',
    label: 'Amazon KDP Help (AI content)',
    url: 'https://kdp.amazon.com/help',
    note: 'Verify current AI disclosure wording in KDP Help before upload.',
  },
  {
    id: 'kindle_create',
    label: 'Kindle Create (text books only)',
    url: 'https://kdp.amazon.com/en_US/help/topic/G7R2L7V5X6SJH948',
    note: 'Reflowable DOC(X) path — not for illustrated picture-book spreads. StoryForge uses print PDF packs.',
  },
]

export const ISBN_CHOICES = [
  { id: 'mvb_own', label: 'Own ISBN (e.g. MVB Germany)' },
  { id: 'kdp_free', label: 'KDP free ISBN (Amazon imprint)' },
  { id: 'undecided', label: 'Not decided yet — I will decide before live upload' },
]

export const AI_MODE_CHOICES = [
  { id: 'prompt', label: 'AI art from prompts / Character Turbo (disclose)' },
  { id: 'enhance_hand_painted', label: 'AI only enhanced hand-painted art (verify KDP)' },
  { id: 'mixed', label: 'Mixed AI + human (disclose)' },
  { id: 'none', label: 'No AI used for this book' },
  { id: 'unknown', label: 'Not sure yet' },
]

/** Max rights-doc attachment stored in project signoff (bytes of raw file). */
export const RIGHTS_DOC_MAX_BYTES = 200_000

export function emptyComplianceChecklist() {
  return {
    isbn_plan_acknowledged: false,
    isbn_choice: 'undecided',
    trademark_self_checked: false,
    trademark_query: '',
    trademark_notes: '',
    rights_docs_acknowledged: false,
    rights_docs_note: '',
    rights_doc: null,
    used_ai: true,
    ai_generation_mode: 'prompt',
    ai_disclose_acknowledged: false,
    wide_publish_noted: false,
    single_account_acknowledged: false,
    no_review_manipulation_acknowledged: false,
    completed_at: null,
  }
}

export function normalizeComplianceChecklist(raw) {
  const base = emptyComplianceChecklist()
  if (!raw || typeof raw !== 'object') return base
  const isbn = ISBN_CHOICES.some((c) => c.id === raw.isbn_choice) ? raw.isbn_choice : 'undecided'
  const mode = AI_MODE_CHOICES.some((c) => c.id === raw.ai_generation_mode)
    ? raw.ai_generation_mode
    : 'prompt'
  let rightsDoc = null
  if (raw.rights_doc && typeof raw.rights_doc === 'object') {
    rightsDoc = {
      filename: String(raw.rights_doc.filename || 'rights-doc').slice(0, 180),
      mime: String(raw.rights_doc.mime || 'application/octet-stream').slice(0, 120),
      byteLength: Math.max(0, Number(raw.rights_doc.byteLength) || 0),
      uploaded_at: raw.rights_doc.uploaded_at || null,
      // Keep dataUrl only if present and reasonably small
      dataUrl:
        typeof raw.rights_doc.dataUrl === 'string' && raw.rights_doc.dataUrl.length < 350_000
          ? raw.rights_doc.dataUrl
          : undefined,
    }
    if (!rightsDoc.dataUrl) delete rightsDoc.dataUrl
  }
  return {
    isbn_plan_acknowledged: Boolean(raw.isbn_plan_acknowledged),
    isbn_choice: isbn,
    trademark_self_checked: Boolean(raw.trademark_self_checked),
    trademark_query: String(raw.trademark_query || '').slice(0, 200),
    trademark_notes: String(raw.trademark_notes || '').slice(0, 1000),
    rights_docs_acknowledged: Boolean(raw.rights_docs_acknowledged),
    rights_docs_note: String(raw.rights_docs_note || '').slice(0, 1000),
    rights_doc: rightsDoc,
    used_ai: raw.used_ai === false ? false : true,
    ai_generation_mode: mode,
    ai_disclose_acknowledged: Boolean(raw.ai_disclose_acknowledged),
    wide_publish_noted: Boolean(raw.wide_publish_noted),
    single_account_acknowledged: Boolean(raw.single_account_acknowledged),
    no_review_manipulation_acknowledged: Boolean(raw.no_review_manipulation_acknowledged),
    completed_at: raw.completed_at || null,
  }
}

/**
 * Disclosure recommendation from checklist AI fields.
 */
export function complianceDisclosure(compliance) {
  const c = normalizeComplianceChecklist(compliance)
  if (!c.used_ai || c.ai_generation_mode === 'none') {
    return assessDisclosure({ usedAi: false, generationMode: 'unknown' })
  }
  const mode =
    c.ai_generation_mode === 'enhance_hand_painted'
      ? 'enhance_hand_painted'
      : c.ai_generation_mode === 'mixed'
        ? 'mixed'
        : c.ai_generation_mode === 'prompt'
          ? 'prompt'
          : 'unknown'
  return assessDisclosure({ usedAi: true, generationMode: mode })
}

/**
 * Soft requirements for “compliance complete” before Finish pack.
 * Returns missing item labels (empty = ok).
 */
export function missingComplianceItems(compliance) {
  const c = normalizeComplianceChecklist(compliance)
  const missing = []
  if (!c.isbn_plan_acknowledged) {
    missing.push('ISBN plan acknowledged (own MVB ISBN or KDP free — decide before live listing)')
  }
  if (!c.trademark_self_checked) {
    missing.push('Trademark self-check (EUIPO / relevant registry for title + character names)')
  }
  if (!c.rights_docs_acknowledged) {
    missing.push(
      'Rights documentation (sole author OR signed rights transfer / work-for-hire on file)',
    )
  }
  const disclosure = complianceDisclosure(c)
  if (!c.ai_disclose_acknowledged) {
    missing.push(
      disclosure.recommendDisclose
        ? 'AI disclosure acknowledged — you will disclose AI-generated content in KDP when required'
        : 'Confirm AI status / disclosure plan for this book (N/A or assisted — verify current KDP Help)',
    )
  }
  if (!c.single_account_acknowledged) {
    missing.push('One KDP account per person/entity acknowledged')
  }
  if (!c.no_review_manipulation_acknowledged) {
    missing.push('No fake reviews / rank manipulation acknowledged')
  }
  return missing
}

export function assessComplianceGate(compliance) {
  const c = normalizeComplianceChecklist(compliance)
  const missing = missingComplianceItems(c)
  const disclosure = complianceDisclosure(c)
  const requiredCount = 6
  const doneCount = requiredCount - missing.length
  return {
    ok: missing.length === 0,
    missing,
    doneCount: Math.max(0, doneCount),
    requiredCount,
    disclosure,
    checklist: c,
    links: COMPLIANCE_LINKS,
    meta: KDP_COMPLIANCE_META,
  }
}

/** Mark completed_at when all gates pass. */
export function stampComplianceIfComplete(compliance) {
  const c = normalizeComplianceChecklist(compliance)
  const gate = assessComplianceGate(c)
  return {
    ...c,
    completed_at: gate.ok ? c.completed_at || new Date().toISOString() : null,
  }
}

export function kdpCompliancePayload() {
  return {
    meta: KDP_COMPLIANCE_META,
    links: COMPLIANCE_LINKS,
    isbnChoices: ISBN_CHOICES,
    aiModeChoices: AI_MODE_CHOICES,
    rightsDocMaxBytes: RIGHTS_DOC_MAX_BYTES,
    empty: emptyComplianceChecklist(),
  }
}
