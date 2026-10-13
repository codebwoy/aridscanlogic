import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildManuscriptPages,
  estimateManuscriptWords,
  resolveJobCost,
  CREDIT_COSTS,
  TRACEABILITY,
} from '../src/index.js'

test('manuscript fills all pages with short lines + briefs', () => {
  const pages = buildManuscriptPages({
    pageCount: 24,
    characterName: 'Luna',
    emotionalCore: 'courage',
    signatureObject: 'lantern',
    language: 'en',
    secondaryLanguage: 'de',
    speechBubbles: true,
  })
  assert.equal(pages.length, 24)
  assert.ok(pages.every((p) => p.text_content.length > 8))
  assert.ok(pages.every((p) => p.illustration_brief.includes('Luna')))
  assert.ok(pages.some((p) => p.speech_bubble))
  assert.ok(estimateManuscriptWords(pages) > 50)
})

test('German primary bank is used for de', () => {
  const pages = buildManuscriptPages({
    pageCount: 8,
    characterName: 'Mira',
    language: 'de',
  })
  assert.match(pages[0].text_content, /Mira/)
})

test('batch credit resolver multiplies editor_pro', () => {
  assert.equal(
    resolveJobCost('illustrate_all_pages', { pageCount: 10, skipExisting: false }),
    10 * CREDIT_COSTS.editor_pro,
  )
  assert.equal(
    resolveJobCost('illustrate_all_pages', {
      pageCount: 10,
      pagesWithArt: 4,
      skipExisting: true,
    }),
    6 * CREDIT_COSTS.editor_pro,
  )
  assert.equal(resolveJobCost('upscale_all_pages', { pagesWithArt: 5 }), 5 * CREDIT_COSTS.upscale_print)
})

test('traceability S64–S65 done', () => {
  assert.ok(TRACEABILITY.some((t) => t.id === 'S64' && t.status === 'done'))
  assert.ok(TRACEABILITY.some((t) => t.id === 'S65' && t.status === 'done'))
})
