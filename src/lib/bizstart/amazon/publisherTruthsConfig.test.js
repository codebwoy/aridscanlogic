import test from 'node:test'
import assert from 'node:assert/strict'
import { PUBLISHER_TRUTHS_CONFIG } from './publisherTruthsConfig.js'
import { AMAZON_GUIDES } from './guides.js'

test('publisher truths has ten numbered EN/DE entries', () => {
  assert.equal(PUBLISHER_TRUTHS_CONFIG.truths.length, 10)
  for (const t of PUBLISHER_TRUTHS_CONFIG.truths) {
    assert.ok(t.number >= 1)
    assert.ok(t.title.en)
    assert.ok(t.title.de)
  }
})

test('pricing and timeline sections are present', () => {
  const pricing = PUBLISHER_TRUTHS_CONFIG.truths.find((t) => t.id === 'pricing')
  const longGame = PUBLISHER_TRUTHS_CONFIG.truths.find((t) => t.id === 'long_game')
  assert.ok((pricing?.pricing || []).length >= 4)
  assert.ok((longGame?.timeline || []).length >= 4)
})

test('publisher-truths is the first default-open Amazon Hub guide', () => {
  assert.equal(AMAZON_GUIDES[0].id, 'publisher-truths')
  assert.equal(AMAZON_GUIDES[0].defaultOpen, true)
})

test('independence disclaimer is marked', () => {
  assert.match(PUBLISHER_TRUTHS_CONFIG.independenceDisclaimer.en, /⚠/)
  assert.match(PUBLISHER_TRUTHS_CONFIG.independenceDisclaimer.de, /⚠/)
})

test('distribution links cover KDP alternatives and direct sales', () => {
  const dist = PUBLISHER_TRUTHS_CONFIG.truths.find((t) => t.id === 'distribution')
  const labels = (dist?.links || []).map((l) => l.label)
  for (const need of ['KDP', 'IngramSpark', 'Lulu', 'Gumroad', 'Payhip', 'Draft2Digital']) {
    assert.ok(labels.includes(need), `missing link ${need}`)
  }
})

test('reviews plan includes 10–15 target and advance-copy services', () => {
  const reviews = PUBLISHER_TRUTHS_CONFIG.truths.find((t) => t.id === 'reviews')
  assert.match((reviews?.bullets?.en || []).join(' '), /10–15/)
  const labels = (reviews?.links || []).map((l) => l.label)
  assert.ok(labels.includes('NetGalley'))
  assert.ok(labels.includes('BookSirens'))
})

test('tax truth deep-links to Hub tax-de playbook', () => {
  const tax = PUBLISHER_TRUTHS_CONFIG.truths.find((t) => t.id === 'tax_de')
  assert.equal(tax?.hubGuideId, 'tax-de')
})
