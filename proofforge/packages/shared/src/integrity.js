/**
 * Accuracy / integrity heuristics — conflicting dates & numbers (BookReady §18).
 * Does not prove facts; flags internal inconsistencies for author review.
 */

export function integrityFindingsFromText(text, { sectionKey = '', chapter = '' } = {}) {
  const out = []
  const body = String(text || '')
  if (body.length < 40) return out

  // Year mentions — flag if many distinct years clustered as conflicting claims style
  const years = [...body.matchAll(/\b((?:19|20)\d{2})\b/g)].map((m) => m[1])
  const yearCounts = {}
  for (const y of years) yearCounts[y] = (yearCounts[y] || 0) + 1
  const distinctYears = Object.keys(yearCounts)
  if (distinctYears.length >= 4) {
    out.push({
      category: 'consistency',
      subcategory: 'dates',
      severity: 'needs_verification',
      title: 'Multiple year references — check chronology',
      explanation: `Found years ${distinctYears.slice(0, 8).join(', ')}. Confirm timeline consistency (integrity review — not fact-checked externally).`,
      original_excerpt: distinctYears.slice(0, 3).join(', '),
      suggested_correction: '',
      reason: 'integrity_year_spread',
      confidence: 0.45,
      objective: false,
      section_key: sectionKey,
      chapter,
    })
  }

  // Same label different numbers: e.g. "population of 1000" vs "population of 2000" hard; simpler: "Chapter 3" refs
  const money = [...body.matchAll(/\$\s?([\d,]+(?:\.\d+)?)/g)].map((m) => m[1])
  if (money.length >= 3) {
    const uniq = [...new Set(money)]
    if (uniq.length >= 3) {
      out.push({
        category: 'consistency',
        subcategory: 'numbers',
        severity: 'suggestion',
        title: 'Multiple currency figures — verify consistency',
        explanation:
          'Several dollar amounts appear in this section. Confirm they refer to intended different values (integrity heuristic).',
        original_excerpt: `$${uniq[0]}`,
        suggested_correction: '',
        reason: 'integrity_money_spread',
        confidence: 0.35,
        objective: false,
        section_key: sectionKey,
        chapter,
      })
    }
  }

  // Conflicting absolute claims pattern: "always" / "never" near opposite
  if (/\balways\b/i.test(body) && /\bnever\b/i.test(body)) {
    const m = body.match(/\b(?:always|never)\b[^.!?]{0,40}/i)
    out.push({
      category: 'consistency',
      subcategory: 'claims',
      severity: 'suggestion',
      title: 'Absolute claims (always/never) nearby',
      explanation:
        'Absolute wording can conflict with exceptions elsewhere. Soft flag for review — may be intentional voice.',
      original_excerpt: (m?.[0] || 'always').slice(0, 80),
      suggested_correction: '',
      reason: 'integrity_absolute_claims',
      confidence: 0.4,
      objective: false,
      section_key: sectionKey,
      chapter,
    })
  }

  return out.slice(0, 6)
}

/**
 * Cross-section terminology drift: Title Case terms that also appear with different casing.
 */
export function terminologyDriftFindings(sections = []) {
  const full = sections.map((s) => String(s.content_md || '')).join('\n')
  const titleCase = full.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}\b/g) || []
  const out = []
  const seen = new Set()
  for (const phrase of titleCase) {
    if (phrase.length < 4) continue
    const key = phrase.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    const esc = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const matches = full.match(new RegExp(`\\b${esc}\\b`, 'gi')) || []
    const variants = [...new Set(matches)]
    if (variants.length < 2) continue
    out.push({
      category: 'consistency',
      subcategory: 'terminology',
      severity: 'suggestion',
      title: `Possible name/term variant: ${variants.join(' / ')}`,
      explanation:
        'Same term appears with different capitalization forms across the manuscript. Confirm intentional vs drift.',
      original_excerpt: variants[0],
      suggested_correction: phrase,
      reason: 'integrity_terminology_drift',
      confidence: 0.5,
      objective: false,
      section_key: '',
      chapter: 'Cross-section',
    })
    if (out.length >= 8) break
  }
  return out
}
