/**
 * Grammarly-style document domains — adjust which style findings are emphasized.
 * Source concept: Grammarly document domain help (General/Academic/Business/Email/Creative/Casual).
 */

export const DOCUMENT_DOMAINS = Object.freeze([
  {
    id: 'general',
    label: 'General',
    note: 'Medium strictness — default for most manuscripts',
    suppress: [],
  },
  {
    id: 'academic',
    label: 'Academic',
    note: 'Stricter on passive, informal pronouns, unclear antecedents',
    suppress: [],
    emphasize: ['passive', 'style'],
  },
  {
    id: 'business',
    label: 'Business',
    note: 'Formal criteria; some informal expressions allowed',
    suppress: [],
  },
  {
    id: 'creative',
    label: 'Creative',
    note: 'Most permissive — allows fragments, dialect, intentional rule-bending',
    suppress: ['pacing', 'style_adverbs', 'style_filler', 'repeated_sentence_start'],
  },
  {
    id: 'casual',
    label: 'Casual',
    note: 'Ignores most style noise; keeps grammar/spelling',
    suppress: ['style_adverbs', 'style_filler', 'style_cliches', 'pacing'],
  },
  {
    id: 'email',
    label: 'Email',
    note: 'Engaging tone; flag overly harsh directness when relevant',
    suppress: [],
  },
])

export function documentDomainPayload() {
  return { domains: DOCUMENT_DOMAINS.map((d) => ({ ...d })), default: 'general' }
}

export function getDocumentDomain(id) {
  return DOCUMENT_DOMAINS.find((d) => d.id === id) || DOCUMENT_DOMAINS[0]
}

/** Soft-filter findings for creative/casual domains (keep grammar/spelling/localization). */
export function filterFindingsByDomain(findings, domainId) {
  const domain = getDocumentDomain(domainId)
  const suppress = new Set(domain.suppress || [])
  if (!suppress.size) return findings
  return (findings || []).filter((f) => {
    if (['grammar', 'spelling', 'punctuation', 'localization', 'kdp_technical', 'kdp_policy'].includes(f.category)) {
      return true
    }
    if (suppress.has(f.subcategory)) return false
    if (suppress.has('pacing') && f.subcategory === 'pacing') return false
    if (suppress.has('style_adverbs') && f.subcategory === 'adverb') return false
    if (suppress.has('style_filler') && f.subcategory === 'filler') return false
    if (suppress.has('style_cliches') && f.subcategory === 'cliche') return false
    if (suppress.has('repeated_sentence_start') && f.subcategory === 'repeated_sentence_start') return false
    return true
  })
}
