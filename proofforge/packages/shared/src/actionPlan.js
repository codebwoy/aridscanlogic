/**
 * Final synthesis — ordered action plan from findings (BookReady Level 5).
 */

const SEV_ORDER = {
  critical: 0,
  major: 1,
  moderate: 2,
  needs_verification: 3,
  minor: 4,
  suggestion: 5,
}

const EDIT_PRIORITY = [
  { id: 'dialogue', match: (f) => f.subcategory === 'dialogue' || /dialogue/i.test(f.title || '') },
  { id: 'repetition', match: (f) => f.category === 'repetition' || f.subcategory === 'repeated_sentence_start' },
  {
    id: 'easy_wins',
    match: (f) =>
      ['adverb', 'filler', 'cliche', 'emotion_tell', 'hidden_verb', 'duplicate_word'].includes(f.subcategory) ||
      ['grammar', 'spelling', 'punctuation'].includes(f.category),
  },
  {
    id: 'structure',
    match: (f) => ['structure', 'consistency', 'naturalness'].includes(f.category),
  },
  { id: 'kdp', match: (f) => f.category === 'kdp_technical' || f.category === 'kdp_policy' },
  { id: 'style', match: (f) => f.category === 'style' || f.category === 'localization' },
]

export function buildActionPlan(findings = [], { scores = null, kdp = null } = {}) {
  const open = (findings || []).filter((f) => !f.resolution || f.resolution === 'open')
  const sorted = [...open].sort((a, b) => {
    const sa = SEV_ORDER[a.severity] ?? 9
    const sb = SEV_ORDER[b.severity] ?? 9
    if (sa !== sb) return sa - sb
    return (b.confidence || 0) - (a.confidence || 0)
  })

  const steps = []
  const used = new Set()
  for (const bucket of EDIT_PRIORITY) {
    const items = sorted.filter((f) => !used.has(f.id) && bucket.match(f)).slice(0, 12)
    for (const f of items) used.add(f.id)
    if (items.length) {
      steps.push({
        id: bucket.id,
        title: stepTitle(bucket.id),
        count: items.length,
        finding_ids: items.map((f) => f.id).filter(Boolean),
        items: items.map((f) => ({
          id: f.id,
          title: f.title,
          severity: f.severity,
          category: f.category,
          excerpt: String(f.original_excerpt || '').slice(0, 120),
          section_key: f.section_key,
        })),
      })
    }
  }
  const rest = sorted.filter((f) => !used.has(f.id)).slice(0, 10)
  if (rest.length) {
    steps.push({
      id: 'other',
      title: 'Remaining open findings',
      count: rest.length,
      finding_ids: rest.map((f) => f.id).filter(Boolean),
      items: rest.map((f) => ({
        id: f.id,
        title: f.title,
        severity: f.severity,
        category: f.category,
        excerpt: String(f.original_excerpt || '').slice(0, 120),
        section_key: f.section_key,
      })),
    })
  }

  const blocking = (kdp?.summary?.blocking || 0) + open.filter((f) => f.severity === 'critical').length
  return {
    generated_at: new Date().toISOString(),
    open_count: open.length,
    readiness: scores?.readiness || null,
    overall_score: scores?.overall ?? null,
    blocking,
    recommended_order: steps.map((s) => s.id),
    steps,
    note:
      'Ordered action plan (AutoCrit process + severity). Work dialogue/repetition/easy wins before deep structure. Scores are guides — not KDP approval.',
  }
}

function stepTitle(id) {
  const map = {
    dialogue: '1. Review dialogue',
    repetition: '2. Clean repetition',
    easy_wins: '3. Easy wins (mechanics + style noise)',
    structure: '4. Structure / consistency / naturalness',
    kdp: '5. KDP technical & policy checklist',
    style: '6. Remaining style / localization',
    other: '7. Other open findings',
  }
  return map[id] || id
}
