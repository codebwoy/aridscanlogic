/**
 * Competitive Advantage — positioning angle helpers for AuthorForge.
 * Evidence must come from market adapters / user input — never invent Amazon stats.
 */

export const STRATEGY_KINDS = Object.freeze({
  MORE_VALUE: 'more_value',
  NICHE_END_GOAL: 'niche_end_goal',
  SIMPLER_FASTER: 'simpler_faster',
  CUSTOM: 'custom',
})

export const STRATEGY_META = Object.freeze({
  [STRATEGY_KINDS.MORE_VALUE]: {
    label: 'MORE VALUE',
    accent: 'value',
    blurb: 'Broader coverage, more examples, exercises, or templates.',
  },
  [STRATEGY_KINDS.NICHE_END_GOAL]: {
    label: 'NICHE END GOAL',
    accent: 'niche',
    blurb: 'Tight audience + one clear outcome.',
  },
  [STRATEGY_KINDS.SIMPLER_FASTER]: {
    label: 'SIMPLER / FASTER',
    accent: 'speed',
    blurb: 'Shorter path, clearer steps, less prep.',
  },
  [STRATEGY_KINDS.CUSTOM]: {
    label: 'YOUR ANGLE',
    accent: 'custom',
    blurb: 'Author-defined differentiation.',
  },
})

function asStringArray(v) {
  if (Array.isArray(v)) return v.map((x) => String(x || '').trim()).filter(Boolean)
  if (typeof v === 'string' && v.trim()) return [v.trim()]
  return []
}

/** Normalize a loose LLM / form angle into a stable shape. */
export function normalizeAngle(raw = {}, index = 0) {
  const a = raw && typeof raw === 'object' ? raw : {}
  const kindRaw = String(a.strategy_kind || a.kind || a.strategy || '').toLowerCase()
  let strategy_kind = STRATEGY_KINDS.CUSTOM
  if (kindRaw.includes('value') || kindRaw.includes('more')) strategy_kind = STRATEGY_KINDS.MORE_VALUE
  else if (kindRaw.includes('niche') || kindRaw.includes('end')) strategy_kind = STRATEGY_KINDS.NICHE_END_GOAL
  else if (kindRaw.includes('simple') || kindRaw.includes('fast') || kindRaw.includes('speed')) {
    strategy_kind = STRATEGY_KINDS.SIMPLER_FASTER
  } else if (a.strategy_label) {
    const lab = String(a.strategy_label).toUpperCase()
    if (lab.includes('VALUE')) strategy_kind = STRATEGY_KINDS.MORE_VALUE
    else if (lab.includes('NICHE') || lab.includes('GOAL')) strategy_kind = STRATEGY_KINDS.NICHE_END_GOAL
    else if (lab.includes('SIMPLE') || lab.includes('FAST')) strategy_kind = STRATEGY_KINDS.SIMPLER_FASTER
  } else if (index === 0) strategy_kind = STRATEGY_KINDS.MORE_VALUE
  else if (index === 1) strategy_kind = STRATEGY_KINDS.NICHE_END_GOAL
  else if (index === 2) strategy_kind = STRATEGY_KINDS.SIMPLER_FASTER

  const meta = STRATEGY_META[strategy_kind] || STRATEGY_META[STRATEGY_KINDS.CUSTOM]
  const name = String(a.name || a.title || a.angle || meta.label).trim() || meta.label
  const rationale = String(a.rationale || a.reason || a.description || a.summary || '').trim()

  return {
    id: String(a.id || `angle-${index + 1}-${strategy_kind}`),
    strategy_kind,
    strategy_label: String(a.strategy_label || meta.label).trim() || meta.label,
    name,
    proposed_title: String(a.proposed_title || a.title_option || '').trim(),
    proposed_subtitle: String(a.proposed_subtitle || a.subtitle || '').trim(),
    target_audience: String(a.target_audience || a.audience || a.ideal_reader || '').trim(),
    reader_problem: String(a.reader_problem || a.problem || '').trim(),
    unique_value: String(a.unique_value || a.uvp || a.usp || '').trim(),
    differentiation: String(a.differentiation || a.why_different || a.stand_apart || rationale).trim(),
    evidence: asStringArray(a.evidence || a.evidence_points || a.sources),
    risks: asStringArray(a.risks || a.weaknesses || a.potential_weaknesses),
    must_contain: asStringArray(a.must_contain || a.must_deliver || a.deliverables),
    toc_direction: String(a.toc_direction || a.outline_direction || a.toc || '').trim(),
    rationale,
    confidence: a.confidence != null ? String(a.confidence) : 'medium',
  }
}

/**
 * Build a book patch when the author selects a positioning angle.
 * Does not invent titles — only applies proposed fields when present.
 */
export function applyAngleToBookPatch(angle, book = {}) {
  const a = normalizeAngle(angle)
  const bible = { ...(book.bible || {}) }
  bible.selected_angle = a
  bible.positioning = a.name
  if (a.differentiation) bible.differentiation = a.differentiation
  if (a.unique_value) bible.usp = a.unique_value
  if (a.target_audience) {
    bible.audience = a.target_audience
    bible.ideal_reader = a.target_audience
  }
  if (a.must_contain.length) bible.key_selling_points = a.must_contain
  if (a.reader_problem) bible.reader_problem = a.reader_problem
  if (a.toc_direction) bible.toc_direction = a.toc_direction

  const patch = { bible }
  if (a.proposed_title) patch.working_title = a.proposed_title
  if (a.proposed_subtitle) patch.subtitle = a.proposed_subtitle
  return patch
}

/** Empty custom angle for “Write my own”. */
export function emptyCustomAngle() {
  return normalizeAngle(
    {
      strategy_kind: STRATEGY_KINDS.CUSTOM,
      name: '',
      rationale: '',
      unique_value: '',
      target_audience: '',
      reader_problem: '',
      differentiation: '',
      must_contain: [],
      toc_direction: '',
      confidence: 'medium',
    },
    99
  )
}
