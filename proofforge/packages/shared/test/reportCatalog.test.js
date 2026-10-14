import test from 'node:test'
import assert from 'node:assert/strict'
import {
  overusedWordsReport,
  sentenceStructureReport,
  readabilityBands,
  grammarReportFromFindings,
  buildSummaryReport,
  runKdpChecks,
} from '../src/index.js'

test('overused words ranks content tokens', () => {
  const text = Array(12).fill('shadow').join(' ') + ' ' + Array(5).fill('river').join(' ')
  const r = overusedWordsReport(text, { minCount: 3 })
  assert.ok(r.items[0].word === 'shadow')
  assert.ok(r.items[0].count >= 12)
})

test('sentence structure buckets starts', () => {
  const text = 'She walked. Suddenly he stopped. And then they left. In the dark she waited.'
  const r = sentenceStructureReport(text)
  assert.ok(r.sentence_count >= 4)
  assert.ok(r.percents.subject_pronoun > 0 || r.percents.adverb > 0)
})

test('readability bands for English', () => {
  const r = readabilityBands('Short. Also short.\n\nThis is a much longer paragraph that keeps going with many words and clauses until it becomes harder to skim quickly for most readers.', 'en')
  assert.ok(r.paragraph_count >= 1)
  assert.ok(r.easy_pct != null)
})

test('grammar report from findings', () => {
  const g = grammarReportFromFindings([
    { category: 'spelling', subcategory: 'typo', resolution: 'open', title: 't', original_excerpt: 'teh' },
    { category: 'grammar', subcategory: 'dup', resolution: 'open', title: 'd', original_excerpt: 'the the' },
  ])
  assert.equal(g.open_count, 2)
  assert.ok(g.spelling_score < 100)
})

test('summary report splits looks great vs needs work', () => {
  const s = buildSummaryReport({
    categoryScores: {
      pacing_and_momentum: 90,
      dialogue: 50,
      strong_writing: 80,
      word_choice: 60,
      repetition: 40,
    },
  })
  assert.ok(s.looks_great.some((a) => a.id === 'pacing'))
  assert.ok(s.needs_work.some((a) => a.id === 'dialogue' || a.id === 'repetition'))
})

test('hardcover KDP rule applies for hardcover target', () => {
  const kdp = runKdpChecks(
    { title: 'HC', publishing_target: 'hardcover', print_config: { trim_size_in: '6x9' } },
    { wordCountTotal: 40000, sectionCount: 10 }
  )
  assert.ok(kdp.results.some((r) => r.rule_id === 'kdp.hardcover.case_laminate'))
})
