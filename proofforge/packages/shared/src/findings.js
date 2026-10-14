/** Structured editorial finding schema (BookReady-inspired). */

export const FINDING_SEVERITIES = Object.freeze([
  'critical',
  'major',
  'moderate',
  'minor',
  'suggestion',
  'needs_verification',
])

export const FINDING_CATEGORIES = Object.freeze([
  'grammar',
  'spelling',
  'punctuation',
  'naturalness',
  'localization',
  'repetition',
  'style',
  'structure',
  'consistency',
  'kdp_technical',
  'kdp_policy',
  'other',
])

export const EDIT_MODES = Object.freeze([
  { id: 'proofread', label: 'Proofread only', note: 'Objective grammar, spelling, punctuation, usage' },
  { id: 'natural', label: 'Natural and faithful', note: 'Fluency while preserving voice' },
  { id: 'line_edit', label: 'Professional line edit', note: 'Clarity, flow, word choice' },
  { id: 'deep_edit', label: 'Deep editorial revision', note: 'Larger passage changes — always author-approved' },
  { id: 'localization', label: 'Localization', note: 'Regional language fit for the selected variety' },
  { id: 'voice', label: 'Author-voice preservation', note: 'Tighten mechanics; protect established voice' },
  { id: 'plain', label: 'Plain language', note: 'Clarity for a specified reading level' },
  { id: 'genre', label: 'Genre-specific', note: 'Apply genre editorial criteria as diagnostics, not formulas' },
])

export const BOOK_TYPES = Object.freeze([
  'fiction',
  'nonfiction',
  'memoir',
  'self_help',
  'workbook',
  'journal',
  'poetry',
  'children',
  'young_adult',
  'other',
])

export const PUBLISHING_TARGETS = Object.freeze([
  'kindle_ebook',
  'paperback',
  'hardcover',
  'multiple',
  'editorial_only',
])

export const RESOLUTION_STATUSES = Object.freeze([
  'open',
  'accepted',
  'rejected',
  'edited',
  'intentional',
  'deferred',
])

/**
 * Normalize / validate a finding from AI or deterministic engines.
 * @returns {{ ok: true, finding: object } | { ok: false, error: string }}
 */
export function normalizeFinding(raw, ctx = {}) {
  if (!raw || typeof raw !== 'object') return { ok: false, error: 'not_object' }
  const original = String(raw.original_excerpt || raw.original || '').trim()
  if (!original) return { ok: false, error: 'missing_excerpt' }

  const sectionText = String(ctx.sectionText || '')
  if (sectionText && !sectionText.includes(original)) {
    // Allow short fuzzy: whitespace-normalized match
    const norm = (s) => s.replace(/\s+/g, ' ').trim()
    if (!norm(sectionText).includes(norm(original))) {
      return { ok: false, error: 'excerpt_not_in_source' }
    }
  }

  const severity = FINDING_SEVERITIES.includes(raw.severity) ? raw.severity : 'suggestion'
  const category = FINDING_CATEGORIES.includes(raw.category) ? raw.category : 'other'
  const confidence = Math.max(0, Math.min(1, Number(raw.confidence) || 0.5))

  let start_offset = Number.isFinite(raw.start_offset) ? raw.start_offset : null
  let end_offset = Number.isFinite(raw.end_offset) ? raw.end_offset : null
  if (sectionText && start_offset == null) {
    const idx = sectionText.indexOf(original)
    if (idx >= 0) {
      start_offset = idx
      end_offset = idx + original.length
    }
  }

  return {
    ok: true,
    finding: {
      id: raw.id || undefined,
      analysis_run_id: ctx.analysisRunId || raw.analysis_run_id || null,
      category,
      subcategory: String(raw.subcategory || '').slice(0, 80),
      severity,
      title: String(raw.title || raw.short_title || category).slice(0, 120),
      explanation: String(raw.explanation || '').slice(0, 2000),
      original_excerpt: original.slice(0, 2000),
      suggested_correction: String(raw.suggested_correction || raw.suggestion || '').slice(0, 2000),
      alternatives: Array.isArray(raw.alternatives)
        ? raw.alternatives.map((a) => String(a).slice(0, 2000)).slice(0, 3)
        : [],
      reason: String(raw.reason || '').slice(0, 1000),
      confidence,
      verification_status: raw.verification_status === 'verified' ? 'verified' : 'unverified',
      section_key: ctx.sectionKey || raw.section_key || '',
      chapter: String(raw.chapter || ctx.chapter || ''),
      start_offset,
      end_offset,
      objective: Boolean(raw.objective),
      resolution: 'open',
      user_decision: null,
      edited_correction: null,
    },
  }
}

const SCORE_DIMENSIONS = Object.freeze([
  { id: 'grammar_mechanics', cats: ['grammar', 'spelling', 'punctuation'] },
  { id: 'naturalness_fluency', cats: ['naturalness'] },
  { id: 'regional_language', cats: ['localization'] },
  { id: 'clarity_readability', cats: ['style'], subs: ['filler', 'wordiness'] },
  { id: 'style_repetition', cats: ['repetition', 'style'] },
  { id: 'structure_consistency', cats: ['structure', 'consistency'] },
  { id: 'genre_specific', cats: ['structure'], subs: ['chapter', 'pacing'] },
  { id: 'factual_citation', cats: ['consistency'], subs: ['claim', 'dates', 'numbers'] },
  { id: 'formatting_quality', cats: ['kdp_technical'] },
  { id: 'kdp_compliance', cats: ['kdp_technical', 'kdp_policy'] },
])

export function scoreFromFindings(findings = [], { kdpBlocking = 0, coverage = null } = {}) {
  const list = Array.isArray(findings) ? findings : []
  const open = list.filter((f) => !f.resolution || f.resolution === 'open')
  const weight = {
    critical: 25,
    major: 12,
    moderate: 6,
    minor: 3,
    suggestion: 1,
    needs_verification: 4,
  }

  // No findings yet = analysis not run — never show a fake 100
  if (!list.length) {
    const emptyDims = Object.fromEntries(SCORE_DIMENSIONS.map((d) => [d.id, null]))
    const emptyCats = Object.fromEntries(FINDING_CATEGORIES.map((c) => [c, null]))
    return {
      overall: null,
      categories: emptyCats,
      dimensions: emptyDims,
      counts: {
        critical: 0,
        major: 0,
        moderate: 0,
        minor: 0,
        suggestion: 0,
        needs_verification: 0,
        total_open: 0,
        total: 0,
      },
      readiness: 'analysis_incomplete',
      coverage_note: coverage || null,
      note: 'Run a full audit to generate an editorial score. Scores are guides — not KDP approval.',
    }
  }

  let penalty = 0
  for (const f of open) {
    penalty += weight[f.severity] || 2
  }
  // Critical print/KDP blocking must drag overall even if prose looks clean
  penalty += Number(kdpBlocking || 0) * 20
  const overall = Math.max(0, Math.min(100, Math.round(100 - penalty)))
  const byCat = {}
  for (const c of FINDING_CATEGORIES) byCat[c] = 100
  for (const f of open) {
    const c = f.category || 'other'
    byCat[c] = Math.max(0, (byCat[c] ?? 100) - (weight[f.severity] || 2) * 2)
  }

  const dimensions = {}
  for (const dim of SCORE_DIMENSIONS) {
    const relevant = open.filter((f) => {
      if (!dim.cats.includes(f.category)) return false
      if (dim.subs?.length) return dim.subs.includes(f.subcategory) || !f.subcategory
      return true
    })
    let p = 0
    for (const f of relevant) p += weight[f.severity] || 2
    dimensions[dim.id] = Math.max(0, Math.min(100, Math.round(100 - p * 2)))
  }

  const counts = {
    critical: open.filter((f) => f.severity === 'critical').length,
    major: open.filter((f) => f.severity === 'major').length,
    moderate: open.filter((f) => f.severity === 'moderate').length,
    minor: open.filter((f) => f.severity === 'minor').length,
    suggestion: open.filter((f) => f.severity === 'suggestion').length,
    needs_verification: open.filter((f) => f.severity === 'needs_verification').length,
    total_open: open.length,
    total: list.length,
  }
  let readiness = 'not_yet_assessed'
  if (counts.critical > 0 || kdpBlocking > 0) readiness = 'critical_issues_detected'
  else if (counts.major > 0) readiness = 'corrections_recommended'
  else if (counts.total_open > 0) readiness = 'ready_for_final_author_review'
  else readiness = 'checks_passed_for_selected_profile'

  return {
    overall,
    categories: byCat,
    dimensions,
    counts,
    readiness,
    coverage_note: coverage || null,
    note: 'Scores are estimated guides, not proof of literary quality or KDP approval. Critical KDP/print issues outweigh clean grammar.',
  }
}

export function editModesPayload() {
  return { modes: EDIT_MODES.map((m) => ({ ...m })), default: 'natural' }
}

export function bookTypesPayload() {
  return { types: [...BOOK_TYPES], default: 'fiction' }
}

export function publishingTargetsPayload() {
  return { targets: [...PUBLISHING_TARGETS], default: 'editorial_only' }
}
