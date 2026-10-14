import test from 'node:test'
import assert from 'node:assert/strict'
import {
  severityToFeedbackLevel,
  applyGenreComparison,
  filterFindingsByEditingStep,
  buildManuscriptAnalysisSections,
  detectTone,
  buildStyleReports,
} from '../src/index.js'

test('severity maps to PWA feedback levels', () => {
  assert.equal(severityToFeedbackLevel('critical'), 'major_concern')
  assert.equal(severityToFeedbackLevel('suggestion'), 'minor_concern')
  assert.equal(severityToFeedbackLevel('moderate'), 'concern')
})

test('genre comparison annotates and nudges scores', () => {
  const scores = applyGenreComparison(
    { pacing_and_momentum: 80, dialogue: 70, strong_writing: 90, word_choice: 85, repetition: 88 },
    'thriller'
  )
  assert.equal(scores.genre_comparison.genre_id, 'thriller')
  assert.ok(typeof scores.dialogue === 'number')
})

test('editing process filters easy wins', () => {
  const findings = [
    { category: 'style', subcategory: 'adverb', title: 'adv' },
    { category: 'structure', subcategory: 'pacing', title: 'pace' },
    { category: 'repetition', subcategory: 'phrase', title: 'rep' },
  ]
  const easy = filterFindingsByEditingStep(findings, 'easy_wins')
  assert.equal(easy.length, 1)
  assert.equal(easy[0].subcategory, 'adverb')
})

test('manuscript analysis sections built from overview', () => {
  const ma = buildManuscriptAnalysisSections(
    {
      subject_or_story: 'A journey',
      themes: ['Belonging'],
      structure_summary: 'Three acts',
      character_notes: ['Hero'],
      setting_notes: ['City'],
      strengths: ['Voice'],
      opportunities: ['Pace'],
      manuscript_sections: {
        plot: { level: 'concern', summary: 'Midpoint soft', items: ['Raise stakes'] },
      },
    },
    []
  )
  assert.equal(ma.about_story.label, 'About My Story')
  assert.equal(ma.plot.level, 'concern')
})

test('tone detector returns overall label', () => {
  const t = detectTone('She felt hope and joy. She will love this day.')
  assert.ok(t.overall)
  assert.ok(t.signals.positive_hits >= 1)
})

test('style reports flag emotion tells and hidden verbs', () => {
  const text =
    'She felt angry when he would not decide. She made a decision to leave. She gave a smile.'
  const { reports, findings } = buildStyleReports(text, { language: 'en', sectionKey: 's1' })
  assert.ok(reports.emotion_tells.length >= 1)
  assert.ok(reports.hidden_verbs.length >= 1)
  assert.ok(findings.some((f) => f.subcategory === 'emotion_tell' || f.subcategory === 'hidden_verb'))
})

test('first chapter pacing is stricter', () => {
  const para =
    'The old house stood at the end of the lane with shutters that had not been painted in years and memories that clung to every floorboard like dust from another century while nobody spoke a word about the past that followed them.'
  const text = `${para}\n\n${para}`
  const strict = buildStyleReports(text, { language: 'en', firstChapter: true })
  const normal = buildStyleReports(text, { language: 'en', firstChapter: false })
  assert.ok(strict.reports.pacing.slow_count >= normal.reports.pacing.slow_count)
})
