import test from 'node:test'
import assert from 'node:assert/strict'
import { workbookFindings, buildCorrectedEpub, ngramOverlap } from '../src/index.js'

test('workbook engine flags numbering gaps', () => {
  const findings = workbookFindings(
    {
      a: { key: 'a', title: 'A', content_md: 'Exercise 1\nDo this.\n\nExercise 3\nDo that.' },
    },
    'workbook'
  )
  assert.ok(findings.some((f) => f.subcategory === 'workbook_numbering'))
})

test('ngramOverlap detects shared phrases', () => {
  const score = ngramOverlap('the quick brown fox jumps over', 'the quick brown fox sleeps', 3)
  assert.ok(score > 0)
})

test('buildCorrectedEpub returns bytes', async () => {
  const { bytes, chapter_count } = await buildCorrectedEpub({
    title: 'Test',
    language: 'en',
    sections: {
      s1: { key: 's1', title: 'One', order: 0, content_md: 'Hello world.' },
    },
  })
  assert.ok(bytes.length > 100)
  assert.equal(chapter_count, 1)
  assert.equal(bytes[0], 0x50) // PK zip
})
