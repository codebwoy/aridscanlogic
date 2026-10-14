/**
 * ProWritingAid Manuscript Analysis–inspired structures (original implementation).
 * Five sections + feedback severity colors + editing-process order (AutoCrit).
 */

/** PWA feedback colors: Working well / Minor concern / Concern / Major concern */
export const FEEDBACK_LEVELS = Object.freeze([
  { id: 'working_well', label: 'Working well', color: 'green', maps_from: [] },
  { id: 'minor_concern', label: 'Minor concern', color: 'yellow', maps_from: ['suggestion', 'minor'] },
  { id: 'concern', label: 'Concern', color: 'orange', maps_from: ['moderate', 'needs_verification'] },
  { id: 'major_concern', label: 'Major concern', color: 'red', maps_from: ['major', 'critical'] },
])

export function severityToFeedbackLevel(severity) {
  const s = String(severity || '')
  for (const row of FEEDBACK_LEVELS) {
    if (row.maps_from.includes(s)) return row.id
  }
  return 'minor_concern'
}

/** AutoCrit recommended editing process order */
export const EDITING_PROCESS_STEPS = Object.freeze([
  {
    id: 'dialogue',
    label: '1. Dialogue',
    filter: { categories: ['style', 'structure'], subcategories: ['dialogue', 'dialogue_tag'] },
    note: 'Listen to dialogue first — tags, adverb+said, naturalness (AutoCrit process).',
  },
  {
    id: 'repetition',
    label: '2. Repetition',
    filter: { categories: ['repetition'], subcategories: ['repeated_phrase', 'repeated_sentence_start'] },
    note: 'Clean words/phrases used too often and too close together.',
  },
  {
    id: 'summary',
    label: '3. Summary categories',
    filter: { categories: ['structure', 'consistency', 'naturalness'], subcategories: ['pacing', 'chapter'] },
    note: 'Use category scores as a navigation map — not a quality verdict.',
  },
  {
    id: 'easy_wins',
    label: '4. Easy wins',
    filter: { categories: ['style', 'grammar'], subcategories: ['adverb', 'filler', 'cliche', 'emotion_tell', 'hidden_verb'] },
    note: 'Adverbs, filler, clichés, emotion tells, hidden verbs — gather editing momentum.',
  },
])

/** AutoCrit-style genre baselines for category score comparison (guides only). */
export const GENRE_COMPARISON = Object.freeze([
  { id: 'general_fiction', label: 'General Fiction', defaults: { dialogue: 0.18, pacing_tolerance: 1 } },
  { id: 'romance', label: 'Romance', defaults: { dialogue: 0.28, pacing_tolerance: 1.1 } },
  { id: 'thriller', label: 'Thriller / Suspense', defaults: { dialogue: 0.2, pacing_tolerance: 0.7 } },
  { id: 'literary', label: 'Literary', defaults: { dialogue: 0.14, pacing_tolerance: 1.3 } },
  { id: 'fantasy', label: 'Fantasy / Speculative', defaults: { dialogue: 0.16, pacing_tolerance: 1.15 } },
  { id: 'mystery', label: 'Mystery', defaults: { dialogue: 0.22, pacing_tolerance: 0.85 } },
  { id: 'nonfiction', label: 'Nonfiction', defaults: { dialogue: 0.05, pacing_tolerance: 1.4 } },
  { id: 'memoir', label: 'Memoir', defaults: { dialogue: 0.12, pacing_tolerance: 1.25 } },
  { id: 'self_help', label: 'Self-help / Coaching', defaults: { dialogue: 0.08, pacing_tolerance: 1.35 } },
])

export function getGenreComparison(id) {
  return GENRE_COMPARISON.find((g) => g.id === id) || GENRE_COMPARISON[0]
}

/**
 * Adjust AutoCrit-style category scores using selected comparison genre.
 */
export function applyGenreComparison(categoryScores, genreId) {
  const g = getGenreComparison(genreId)
  const scores = { ...(categoryScores || {}) }
  const dialogueRatioHint = g.defaults.dialogue
  // Soft nudge: if dialogue score exists, annotate expected dialogue density
  scores.genre_comparison = {
    genre_id: g.id,
    label: g.label,
    expected_dialogue_ratio: dialogueRatioHint,
    pacing_tolerance: g.defaults.pacing_tolerance,
    note: 'Genre comparison is a reference point, not a rule (AutoCrit Summary Report).',
  }
  if (typeof scores.dialogue === 'number') {
    // Mild recalibration toward genre dialogue expectation (guide only)
    const delta = (dialogueRatioHint - 0.18) * 40
    scores.dialogue = Math.max(0, Math.min(100, Math.round(scores.dialogue + delta)))
  }
  if (typeof scores.pacing_and_momentum === 'number') {
    const tol = g.defaults.pacing_tolerance
    scores.pacing_and_momentum = Math.max(
      0,
      Math.min(100, Math.round(100 - (100 - scores.pacing_and_momentum) / tol))
    )
  }
  return scores
}

export function filterFindingsByEditingStep(findings, stepId) {
  const step = EDITING_PROCESS_STEPS.find((s) => s.id === stepId)
  if (!step) return findings
  const cats = new Set(step.filter.categories || [])
  const subs = new Set(step.filter.subcategories || [])
  return (findings || []).filter((f) => {
    if (subs.has(f.subcategory)) return true
    if (cats.has(f.category) && (!subs.size || !f.subcategory)) return true
    if (stepId === 'dialogue' && (f.subcategory === 'dialogue' || /dialogue/i.test(f.title || ''))) {
      return true
    }
    if (stepId === 'repetition' && f.category === 'repetition') return true
    if (stepId === 'easy_wins' && ['adverb', 'filler', 'cliche', 'emotion_tell', 'hidden_verb', 'duplicate_word'].includes(f.subcategory)) {
      return true
    }
    if (stepId === 'summary' && ['structure', 'consistency', 'naturalness'].includes(f.category)) return true
    return false
  })
}

export function manuscriptAnalysisPayload() {
  return {
    feedback_levels: FEEDBACK_LEVELS.map((f) => ({ ...f })),
    editing_process: EDITING_PROCESS_STEPS.map((s) => ({ ...s })),
    genre_comparison: GENRE_COMPARISON.map((g) => ({
      id: g.id,
      label: g.label,
    })),
    sections: [
      { id: 'about_story', label: 'About My Story' },
      { id: 'themes', label: 'Themes & Message' },
      { id: 'plot', label: 'Plot & Structure' },
      { id: 'characters', label: 'Characters' },
      { id: 'setting', label: 'Setting' },
    ],
  }
}

/**
 * Normalize overview LLM output into PWA-style manuscript analysis sections.
 */
export function buildManuscriptAnalysisSections(overview = {}, findings = []) {
  const open = (findings || []).filter((f) => !f.resolution || f.resolution === 'open')
  const levelFromFindings = (pred) => {
    const hits = open.filter(pred)
    if (!hits.length) return 'working_well'
    if (hits.some((f) => ['critical', 'major'].includes(f.severity))) return 'major_concern'
    if (hits.some((f) => ['moderate', 'needs_verification'].includes(f.severity))) return 'concern'
    return 'minor_concern'
  }

  const sections = overview.manuscript_sections || {}
  return {
    about_story: {
      label: 'About My Story',
      level: sections.about_story?.level || 'working_well',
      summary: sections.about_story?.summary || overview.subject_or_story || '',
      genre: overview.likely_genre || '',
      audience: overview.audience_fit || '',
      competitive_landscape: sections.about_story?.competitive_landscape || overview.audience_fit || '',
      items: sections.about_story?.items || [],
    },
    themes: {
      label: 'Themes & Message',
      level: sections.themes?.level || levelFromFindings((f) => f.subcategory === 'theme'),
      summary: sections.themes?.summary || (overview.themes || []).join('; '),
      themes: overview.themes || [],
      items: sections.themes?.items || [],
    },
    plot: {
      label: 'Plot & Structure',
      level:
        sections.plot?.level ||
        levelFromFindings((f) => f.category === 'structure' || f.subcategory === 'pacing'),
      summary: sections.plot?.summary || overview.structure_summary || '',
      items: sections.plot?.items || [],
    },
    characters: {
      label: 'Characters',
      level: sections.characters?.level || levelFromFindings((f) => /character/i.test(f.title || '')),
      summary: sections.characters?.summary || (overview.character_notes || []).join('; '),
      notes: overview.character_notes || [],
      items: sections.characters?.items || [],
    },
    setting: {
      label: 'Setting',
      level: sections.setting?.level || levelFromFindings((f) => /setting|world/i.test(f.title || '')),
      summary: sections.setting?.summary || (overview.setting_notes || []).join('; '),
      notes: overview.setting_notes || [],
      items: sections.setting?.items || [],
    },
    strengths: overview.strengths || [],
    opportunities: overview.opportunities || [],
    note: overview.note || '',
  }
}
