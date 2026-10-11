import { test } from 'node:test'
import assert from 'node:assert/strict'
import { costFor, estimateBookCredits, spineWidthInches } from '../src/index.js'
import { spineWidthInches as spine } from '../src/publishing-specs.js'
import { assembleWriterContext, approxTokens } from '../src/token-budget.js'

test('costFor returns known actions', () => {
  assert.equal(costFor('section_draft'), 4)
  assert.equal(costFor('unknown_xyz'), null)
})

test('estimateBookCredits positive total', () => {
  const e = estimateBookCredits({ chapters: 8, sectionsPerChapter: 4 })
  assert.ok(e.total > 50)
})

test('spine width increases with pages', () => {
  assert.ok(spine(100) < spine(300))
  assert.ok(spineWidthInches(200) > 0)
})

test('assembleWriterContext compresses continuity', () => {
  const continuity = {
    summaries: Array.from({ length: 40 }, (_, i) => ({
      id: String(i),
      title: `S${i}`,
      summary: 'x'.repeat(500),
    })),
    open_loops: ['keep-me'],
    used_examples: [],
  }
  const ctx = assembleWriterContext({
    bookBible: { title: 'T' },
    persona: {},
    styleGuide: '',
    outlineDigest: 'ch1',
    continuity,
    node: { title: 'A', writing_direction: 'Go', target_words: 800 },
  })
  assert.ok(approxTokens(ctx.dynamic.continuity) <= 6000 + 200)
  assert.ok(ctx.dynamic.continuity.includes('keep-me'))
})
