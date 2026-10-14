/**
 * ProWritingAid Manuscript Analysis recommends ~6,000–300,000 words.
 * We soft-gate: warn below/above; still allow analysis with coverage notes.
 */

export const MANUSCRIPT_WORD_MIN = 6000
export const MANUSCRIPT_WORD_MAX = 300_000
export const MANUSCRIPT_WORD_SOFT_MIN = 1500 // short samples still analyzable

export function assessWordCount(totalWords) {
  const n = Number(totalWords) || 0
  const notes = []
  let status = 'ok'
  if (n < MANUSCRIPT_WORD_SOFT_MIN) {
    status = 'too_short'
    notes.push(
      `Word count ${n} is below a useful sample (${MANUSCRIPT_WORD_SOFT_MIN}+). Results may be noisy.`
    )
  } else if (n < MANUSCRIPT_WORD_MIN) {
    status = 'below_recommended'
    notes.push(
      `Word count ${n} is below the recommended Manuscript Analysis range (${MANUSCRIPT_WORD_MIN}–${MANUSCRIPT_WORD_MAX}). Analysis runs; overview depth may be limited.`
    )
  } else if (n > MANUSCRIPT_WORD_MAX) {
    status = 'above_recommended'
    notes.push(
      `Word count ${n} exceeds the recommended range (${MANUSCRIPT_WORD_MAX}). Consider splitting volumes; analysis may take longer and cost more credits.`
    )
  }
  return {
    word_count: n,
    status,
    recommended_min: MANUSCRIPT_WORD_MIN,
    recommended_max: MANUSCRIPT_WORD_MAX,
    notes,
  }
}

export function wordCountGateFinding(assessment) {
  if (assessment.status === 'ok') return null
  return {
    category: 'structure',
    subcategory: 'word_count',
    severity: assessment.status === 'too_short' ? 'major' : 'suggestion',
    title: 'Manuscript length vs recommended range',
    explanation: assessment.notes.join(' '),
    original_excerpt: `${assessment.word_count} words`,
    suggested_correction: '',
    reason: 'pwa_manuscript_analysis_range',
    confidence: 0.9,
    objective: true,
  }
}
