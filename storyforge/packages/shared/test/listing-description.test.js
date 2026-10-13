import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  buildListingDescription,
  normalizeListingDescription,
  LISTING_DESCRIPTION_PARTS,
  TRACEABILITY,
} from '../src/index.js'

describe('listing description (5-part)', () => {
  it('exposes five formula parts', () => {
    assert.equal(LISTING_DESCRIPTION_PARTS.length, 5)
    assert.deepEqual(
      LISTING_DESCRIPTION_PARTS.map((p) => p.id),
      ['hook', 'promise', 'sel', 'social', 'cta'],
    )
  })

  it('builds EN copy from project facts without inventing reviews', () => {
    const built = buildListingDescription({
      title: 'Leo Finds Courage',
      characterName: 'Leo',
      emotionalCore: 'courage',
      premise: 'Leo faces his first day at a new school',
      refrain: 'I can try one more time',
      formatId: 'picture',
      language: 'en',
    })
    assert.match(built.parts.hook, /Leo|child|worry|courage/i)
    assert.match(built.parts.promise, /Leo/)
    assert.match(built.parts.sel, /3–7|3-7/)
    assert.equal(built.parts.social, '')
    assert.match(built.parts.cta, /basket|cart|Scroll/i)
    assert.match(built.plain, /Leo Finds Courage/)
    assert.match(built.html, /<p>/)
    assert.equal(built.meta.hasSocialProof, false)
  })

  it('only adds social proof when a real quote is provided', () => {
    const built = buildListingDescription({
      characterName: 'Leo',
      language: 'en',
      reviewQuote: 'Our daughter asks for this book every bedtime',
    })
    assert.match(built.parts.social, /daughter asks/)
    assert.match(built.parts.social, /verified Amazon reviewer/i)
    assert.equal(built.meta.hasSocialProof, true)
  })

  it('builds German copy when language is de', () => {
    const built = buildListingDescription({
      characterName: 'Mira',
      emotionalCore: 'belonging',
      language: 'de',
      formatId: 'picture',
    })
    assert.match(built.parts.hook, /Kind|Sorgen|Zugehörigkeit|belonging/i)
    assert.match(built.parts.cta, /Warenkorb/)
  })

  it('normalizes partial saved listings', () => {
    const n = normalizeListingDescription({
      parts: { hook: 'Hello' },
      review_quote: 'x'.repeat(10),
    })
    assert.equal(n.parts.hook, 'Hello')
    assert.equal(n.parts.cta, '')
    assert.ok(n.plain.includes('Hello'))
  })

  it('traceability S67 done', () => {
    assert.ok(TRACEABILITY.some((t) => t.id === 'S67' && t.status === 'done'))
  })
})
