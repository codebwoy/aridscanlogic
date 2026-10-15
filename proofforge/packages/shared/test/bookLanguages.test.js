import test from 'node:test'
import assert from 'node:assert/strict'
import {
  BOOK_LANGUAGE_CODES,
  bookLanguagesPayload,
  bookLanguageAgentInstruction,
  localizationFindings,
  normalizeBookLanguage,
} from '../src/index.js'

test('primary manuscript languages include DE FR IT ES NL EN', () => {
  assert.deepEqual([...BOOK_LANGUAGE_CODES].sort(), ['de', 'en', 'es', 'fr', 'it', 'nl'])
  const payload = bookLanguagesPayload()
  assert.equal(payload.languages.length, 6)
  for (const code of BOOK_LANGUAGE_CODES) {
    const row = payload.languages.find((l) => l.code === code)
    assert.ok(row, `missing ${code}`)
    assert.ok(row.label)
    assert.ok(row.nativeLabel)
    assert.ok(row.defaultVariety)
    assert.ok(Array.isArray(row.varieties) && row.varieties.length >= 1)
  }
})

test('agent instruction injects manuscript language profile', () => {
  const de = bookLanguageAgentInstruction('de', 'de')
  assert.match(de, /German/i)
  assert.match(de, /Deutsch/)
  const fr = bookLanguageAgentInstruction('fr', 'fr')
  assert.match(fr, /French/i)
  assert.match(fr, /Français/)
})

test('normalize rejects unknown language codes securely', () => {
  assert.equal(normalizeBookLanguage('de'), 'de')
  assert.equal(normalizeBookLanguage('xx'), 'en')
  assert.equal(normalizeBookLanguage('<script>'), 'en')
})

test('German pack flags English false-friend bleed', () => {
  const f = localizationFindings(
    { key: 'c1', title: 'Kapitel 1', content_md: 'Sie wartete eventually am Bahnhof.' },
    'de',
    'de'
  )
  assert.ok(f.some((x) => x.subcategory === 'false_friend' && /eventually/i.test(x.original_excerpt)))
})

test('Spanish LatAm pack flags vosotros drift', () => {
  const f = localizationFindings(
    { key: 'c1', title: 'Capítulo 1', content_md: 'Vosotros debéis venir mañana.' },
    'es',
    'latam'
  )
  assert.ok(f.some((x) => x.subcategory === 'regional_spelling'))
})
