import { test } from 'node:test'
import assert from 'node:assert/strict'
import { focusTagCoverage, sectionQualityReport } from '../src/index.js'

test('focusTagCoverage passes when all tags mapped', () => {
  const chapters = [
    {
      title: 'C1',
      writing_direction: 'd',
      target_words: 1000,
      focus_tags: ['a'],
      children: [
        {
          title: 'S1',
          writing_direction: 'd',
          target_words: 400,
          focus_tags: ['b'],
          children: [],
        },
      ],
    },
  ]
  const r = focusTagCoverage(['a', 'b'], chapters)
  assert.equal(r.passed, true)
})

test('focusTagCoverage fails when tag missing', () => {
  const r = focusTagCoverage(['missing'], [{ title: 'C', writing_direction: 'd', target_words: 1, focus_tags: [], children: [] }])
  assert.equal(r.passed, false)
})

test('sectionQualityReport flags banned phrases', () => {
  const r = sectionQualityReport({
    content_md: "Let's dive in to the topic with enough words here to count properly for the test case running now.",
    target_words: 20,
    banned_phrases: ["Let's dive in"],
  })
  assert.ok(r.banned_hits.length >= 1)
  assert.equal(r.passed, false)
})
