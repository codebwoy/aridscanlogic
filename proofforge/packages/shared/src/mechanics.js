/**
 * Deterministic mechanics — duplicate words, confused pairs, wordiness, nominalizations,
 * long subordinate clauses (BookReady §11–12 / PWA Style Report concepts).
 */

const CONFUSED_PAIRS = Object.freeze([
  { a: 'their', b: 'there', note: 'their (possessive) vs there (place)' },
  { a: 'its', b: "it's", note: 'its (possessive) vs it’s (it is)' },
  { a: 'your', b: "you're", note: 'your (possessive) vs you’re (you are)' },
  { a: 'affect', b: 'effect', note: 'affect (verb) vs effect (noun) — context matters' },
  { a: 'then', b: 'than', note: 'then (time) vs than (comparison)' },
  { a: 'lose', b: 'loose', note: 'lose (verb) vs loose (adjective)' },
  { a: 'principal', b: 'principle', note: 'principal (main/person) vs principle (rule)' },
  { a: 'compliment', b: 'complement', note: 'compliment (praise) vs complement (complete)' },
  { a: 'discrete', b: 'discreet', note: 'discrete (separate) vs discreet (tactful)' },
  { a: 'ensure', b: 'insure', note: 'ensure (make sure) vs insure (insurance)' },
])

const WORDY = Object.freeze([
  { phrase: 'in order to', suggestion: 'to', label: 'wordiness' },
  { phrase: 'due to the fact that', suggestion: 'because', label: 'wordiness' },
  { phrase: 'at this point in time', suggestion: 'now', label: 'wordiness' },
  { phrase: 'in spite of the fact that', suggestion: 'although', label: 'wordiness' },
  { phrase: 'for the purpose of', suggestion: 'to / for', label: 'wordiness' },
  { phrase: 'each and every', suggestion: 'each / every', label: 'redundancy' },
  { phrase: 'end result', suggestion: 'result', label: 'redundancy' },
  { phrase: 'past history', suggestion: 'history', label: 'redundancy' },
  { phrase: 'completely finish', suggestion: 'finish', label: 'redundancy' },
  { phrase: 'advance planning', suggestion: 'planning', label: 'redundancy' },
  { phrase: 'basic fundamentals', suggestion: 'fundamentals', label: 'redundancy' },
  { phrase: 'true fact', suggestion: 'fact', label: 'redundancy' },
])

const NOMINALIZATIONS = Object.freeze([
  { re: /\bmake\s+(?:a|an|the)\s+decision\b/gi, label: 'make a decision → decide' },
  { re: /\bgive\s+(?:a|an|the)\s+consideration\b/gi, label: 'give consideration → consider' },
  { re: /\btake\s+(?:a|an|the)\s+action\b/gi, label: 'take action → act' },
  { re: /\bprovide\s+(?:a|an|the)\s+assistance\b/gi, label: 'provide assistance → assist' },
  { re: /\bconduct\s+(?:a|an|the)\s+(?:investigation|analysis)\b/gi, label: 'conduct investigation/analysis → investigate/analyze' },
  { re: /\bhave\s+(?:a|an|the)\s+discussion\b/gi, label: 'have a discussion → discuss' },
])

/** Adjacent duplicate words: "the the", "She she" */
export function duplicateWordFindings(text, { sectionKey = '', chapter = '' } = {}) {
  const out = []
  const re = /\b([A-Za-zÀ-ÿ]{2,})\s+([A-Za-zÀ-ÿ]{2,})\b/g
  const raw = String(text || '')
  let m
  const seen = new Set()
  while ((m = re.exec(raw)) !== null && out.length < 8) {
    if (m[1].toLowerCase() !== m[2].toLowerCase()) continue
    const excerpt = m[0]
    const key = excerpt.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push({
      category: 'grammar',
      subcategory: 'duplicate_word',
      severity: 'minor',
      title: `Duplicate word: “${m[1]}”`,
      explanation: 'Same word repeated back-to-back. Often a typing slip — keep if intentional stutter/dialect.',
      original_excerpt: excerpt,
      suggested_correction: m[1],
      reason: 'deterministic_duplicate_word',
      confidence: 0.9,
      objective: true,
      section_key: sectionKey,
      chapter,
    })
  }
  return out
}

/**
 * Soft confused-word flags when BOTH members of a pair appear nearby (author review).
 * Does not auto-“correct” — only highlights possible mix-ups.
 */
export function confusedWordFindings(text, { sectionKey = '', chapter = '', language = 'en' } = {}) {
  if (language && language !== 'en') return []
  const lower = String(text || '').toLowerCase()
  const out = []
  for (const pair of CONFUSED_PAIRS) {
    const hasA = new RegExp(`\\b${pair.a.replace(/'/g, "['’]?")}\\b`, 'i').test(lower)
    const hasB = new RegExp(`\\b${pair.b.replace(/'/g, "['’]?")}\\b`, 'i').test(lower)
    if (!(hasA && hasB)) continue
    // Only flag if both appear — high chance of intentional mix is still soft
    const excerpt = pair.a
    out.push({
      category: 'grammar',
      subcategory: 'confused_words',
      severity: 'suggestion',
      title: `Review ${pair.a} / ${pair.b}`,
      explanation: `${pair.note}. Both appear in this section — confirm each use is intentional.`,
      original_excerpt: excerpt,
      suggested_correction: '',
      reason: 'deterministic_confused_pair',
      confidence: 0.4,
      objective: false,
      section_key: sectionKey,
      chapter,
    })
    if (out.length >= 4) break
  }
  return out
}

export function wordinessFindings(text, { sectionKey = '', chapter = '' } = {}) {
  const lower = String(text || '').toLowerCase()
  const raw = String(text || '')
  const out = []
  for (const w of WORDY) {
    if (!lower.includes(w.phrase)) continue
    const idx = lower.indexOf(w.phrase)
    const excerpt = raw.slice(idx, idx + w.phrase.length)
    out.push({
      category: 'style',
      subcategory: w.label === 'redundancy' ? 'redundancy' : 'wordiness',
      severity: 'suggestion',
      title: `${w.label}: “${w.phrase}”`,
      explanation: `Possible ${w.label}. Consider “${w.suggestion}” if meaning stays clear.`,
      original_excerpt: excerpt || w.phrase,
      suggested_correction: w.suggestion,
      reason: 'deterministic_wordiness',
      confidence: 0.65,
      objective: false,
      section_key: sectionKey,
      chapter,
    })
    if (out.length >= 6) break
  }
  return out
}

export function nominalizationFindings(text, { sectionKey = '', chapter = '' } = {}) {
  const raw = String(text || '')
  const out = []
  for (const n of NOMINALIZATIONS) {
    n.re.lastIndex = 0
    const m = n.re.exec(raw)
    if (!m) continue
    out.push({
      category: 'style',
      subcategory: 'nominalization',
      severity: 'suggestion',
      title: `Hidden/nominalized verb (${n.label})`,
      explanation: 'PWA Style / BookReady: weak verb + noun may hide a stronger verb.',
      original_excerpt: m[0],
      suggested_correction: '',
      reason: 'deterministic_nominalization',
      confidence: 0.6,
      objective: false,
      section_key: sectionKey,
      chapter,
    })
    if (out.length >= 5) break
  }
  return out
}

/** Long subordinate clause heuristic: commas + length + because/although/which */
export function longClauseFindings(text, { sectionKey = '', chapter = '' } = {}) {
  const out = []
  const parts = String(text || '').split(/(?<=[.!?])\s+/)
  for (const s of parts) {
    const words = s.split(/\s+/).filter(Boolean)
    if (words.length < 28) continue
    const commas = (s.match(/,/g) || []).length
    if (commas < 2) continue
    if (!/\b(because|although|which|that|while|when|where|if)\b/i.test(s)) continue
    out.push({
      category: 'style',
      subcategory: 'long_clause',
      severity: 'suggestion',
      title: 'Possibly long subordinate clause',
      explanation:
        'PWA Style Report: lengthy subordinate clauses can weaken clarity. Consider splitting if rhythm allows.',
      original_excerpt: s.slice(0, 140),
      suggested_correction: '',
      reason: 'deterministic_long_clause',
      confidence: 0.45,
      objective: false,
      section_key: sectionKey,
      chapter,
    })
    if (out.length >= 4) break
  }
  return out
}

export function mechanicsFindings(text, ctx = {}) {
  return [
    ...duplicateWordFindings(text, ctx),
    ...confusedWordFindings(text, ctx),
    ...wordinessFindings(text, ctx),
    ...nominalizationFindings(text, ctx),
    ...longClauseFindings(text, ctx),
  ]
}

/** Citation-ish consistency for nonfiction (heuristic — not a style-guide validator). */
export function citationFindings(text, { sectionKey = '', chapter = '' } = {}) {
  const body = String(text || '')
  const out = []
  const parenYears = [
    ...body.matchAll(
      /\b[A-Z][a-zA-Z\-]+(?:\s+(?:et\s+al\.?|&)\s*[A-Z][a-zA-Z\-]+)?\s*\(\s*((?:19|20)\d{2}[a-z]?)\s*\)/g
    ),
    ...body.matchAll(
      /\(([A-Z][a-zA-Z\-]+(?:\s+(?:et\s+al\.?|&)\s*[A-Z][a-zA-Z\-]+)?),?\s*((?:19|20)\d{2}[a-z]?)\)/g
    ),
  ]
  const bracketNums = [...body.matchAll(/\[(\d{1,3})\]/g)]
  if (parenYears.length >= 1 && bracketNums.length >= 2) {
    out.push({
      category: 'consistency',
      subcategory: 'citation',
      severity: 'needs_verification',
      title: 'Mixed citation styles detected',
      explanation:
        'Author–year parentheses and numeric [n] citations both appear. Pick one style (APA/Chicago/Vancouver/etc.) and stay consistent. Formatting check ≠ source accuracy.',
      original_excerpt: parenYears[0][0],
      suggested_correction: '',
      reason: 'citation_style_mix',
      confidence: 0.7,
      objective: false,
      section_key: sectionKey,
      chapter,
    })
  }
  if (/\b(doi:|https?:\/\/doi\.org\/)/i.test(body) && /\bibid\.?\b/i.test(body)) {
    out.push({
      category: 'consistency',
      subcategory: 'citation',
      severity: 'suggestion',
      title: 'DOI + ibid. in same section',
      explanation: 'Modern DOI links and classic “ibid.” can mix awkwardly — confirm house style.',
      original_excerpt: 'ibid',
      suggested_correction: '',
      reason: 'citation_doi_ibid',
      confidence: 0.5,
      objective: false,
      section_key: sectionKey,
      chapter,
    })
  }
  return out.slice(0, 3)
}

/** High-stakes nonfiction disclaimer (medical/legal/financial). */
export function highStakesFindings(text, { bookType = '', documentDomain = '', sectionKey = '', chapter = '' } = {}) {
  const body = String(text || '').toLowerCase()
  const domain = String(documentDomain || '').toLowerCase()
  const risky =
    domain === 'academic' ||
    /medical|legal|financ|health|diagnos|prescription|lawsuit|investment|tax advice|dosage/i.test(
      `${bookType} ${body.slice(0, 2000)}`
    )
  if (!risky) return []
  if (!/(should|must|recommend|prescribe|invest|sue|liable|diagnos)/i.test(body)) return []
  return [
    {
      category: 'consistency',
      subcategory: 'high_stakes',
      severity: 'needs_verification',
      title: 'High-stakes content — expert verification needed',
      explanation:
        'Medical, legal, or financial guidance-like language detected. ProofForge does not verify professional accuracy. Have a qualified expert review before publish.',
      original_excerpt: (body.match(/\b(?:should|must|recommend|prescribe|invest)\b[^.!?]{0,40}/i) || [
        'recommend',
      ])[0].slice(0, 80),
      suggested_correction: '',
      reason: 'high_stakes_disclaimer',
      confidence: 0.75,
      objective: false,
      section_key: sectionKey,
      chapter: chapter || 'Nonfiction',
    },
  ]
}

/** Author style-guide lines: "prefer X not Y" or "never use Z" */
export function styleGuideFindings(text, styleGuide = '', { sectionKey = '', chapter = '' } = {}) {
  const guide = String(styleGuide || '').trim()
  if (!guide || guide.length < 4) return []
  const out = []
  const prefer = [...guide.matchAll(/prefer\s+[“"']?([^“"'/\n]+)[”"']?\s+(?:not|over|instead of)\s+[“"']?([^“"'/\n.,;]+)[”"']?/gi)]
  const never = [...guide.matchAll(/never\s+use\s+[“"']?([^“"'/\n.,;]+)[”"']?/gi)]
  const body = String(text || '')
  for (const m of prefer) {
    const preferred = m[1].trim()
    const banned = m[2].trim()
    if (banned.length < 2) continue
    if (body.toLowerCase().includes(banned.toLowerCase())) {
      out.push({
        category: 'style',
        subcategory: 'style_guide',
        severity: 'moderate',
        title: `Style guide: avoid “${banned}”`,
        explanation: `Your style guide prefers “${preferred}” over “${banned}”.`,
        original_excerpt: banned,
        suggested_correction: preferred,
        reason: 'author_style_guide',
        confidence: 0.8,
        objective: false,
        section_key: sectionKey,
        chapter,
      })
    }
    if (out.length >= 6) break
  }
  for (const m of never) {
    const banned = m[1].trim()
    if (banned.length < 2) continue
    if (body.toLowerCase().includes(banned.toLowerCase())) {
      out.push({
        category: 'style',
        subcategory: 'style_guide',
        severity: 'moderate',
        title: `Style guide: never use “${banned}”`,
        explanation: 'Matches an author style-guide “never use” rule.',
        original_excerpt: banned,
        suggested_correction: '',
        reason: 'author_style_guide_never',
        confidence: 0.85,
        objective: false,
        section_key: sectionKey,
        chapter,
      })
    }
    if (out.length >= 8) break
  }
  return out
}
