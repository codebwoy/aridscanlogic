import test from 'node:test'
import assert from 'node:assert/strict'
import {
  BOOK_LANGUAGE_CODES,
  BOOK_LANGUAGES,
  normalizeBookLanguage,
  normalizeBookLanguageVariety,
  bookLanguageLabel,
  bookLanguageProfile,
  bookLanguageAgentInstruction,
  bookLanguageCultureHint,
  bookLanguagesPayload,
  bookLanguageVarieties,
} from '../src/book-languages.js'

test('six primary manuscript languages', () => {
  assert.deepEqual([...BOOK_LANGUAGE_CODES], ['en', 'de', 'es', 'fr', 'it', 'nl'])
  assert.equal(BOOK_LANGUAGES.length, 6)
})

test('each language has culture undertone fields and varieties', () => {
  for (const row of BOOK_LANGUAGES) {
    assert.ok(row.audience)
    assert.ok(row.register)
    assert.ok(row.structure)
    assert.ok(row.tone)
    assert.ok(Array.isArray(row.norms) && row.norms.length >= 2)
    assert.ok(Array.isArray(row.avoid) && row.avoid.length >= 2)
    assert.ok(Array.isArray(row.varieties) && row.varieties.length >= 1)
    assert.ok(row.defaultVariety)
  }
})

test('normalizeBookLanguage accepts codes and falls back', () => {
  assert.equal(normalizeBookLanguage('FR'), 'fr')
  assert.equal(normalizeBookLanguage('xx'), 'en')
  assert.equal(normalizeBookLanguage(''), 'en')
})

test('normalizeBookLanguageVariety locks to language options', () => {
  assert.equal(normalizeBookLanguageVariety('en', 'uk'), 'uk')
  assert.equal(normalizeBookLanguageVariety('en', 'xx'), 'us')
  assert.equal(normalizeBookLanguageVariety('es', 'es'), 'es')
  assert.equal(normalizeBookLanguageVariety('es', 'bad'), 'latam')
})

test('profile and agent instruction include culture + variety', () => {
  assert.equal(bookLanguageLabel('it'), 'Italian')
  assert.match(bookLanguageProfile('nl').tone, /understated|Honest/i)
  const de = bookLanguageAgentInstruction('de', 'ch')
  assert.match(de, /German/)
  assert.match(de, /Language variety:/)
  assert.match(de, /Switzerland|CH/i)
  assert.match(de, /Register:/)
  assert.match(de, /Audience norms:/)
  const es = bookLanguageAgentInstruction('es', 'latam')
  assert.match(es, /Spanish/)
  assert.match(es, /Latin America|LatAm/i)
  assert.ok(bookLanguageVarieties('fr').length >= 2)
})

test('culture hint and specs payload expose all languages', () => {
  assert.match(bookLanguageCultureHint('fr'), /French|Francophone|nuance/i)
  const payload = bookLanguagesPayload()
  assert.deepEqual(payload.codes, [...BOOK_LANGUAGE_CODES])
  assert.equal(payload.default, 'en')
  assert.equal(payload.languages.length, 6)
  assert.ok(payload.languages.every((l) => l.tone && l.norms?.length && l.varieties?.length))
})
