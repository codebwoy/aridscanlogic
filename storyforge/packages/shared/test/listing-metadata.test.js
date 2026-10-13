import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  buildKeywords,
  buildListingMetadata,
  buildSubtitle,
  normalizeListingMetadata,
  suggestCategories,
  LISTING_METADATA_META,
  CREDIT_COSTS,
  TRACEABILITY,
  NAMED_TOOLS,
} from '../src/index.js'

describe('listing metadata', () => {
  it('builds at most 7 keywords', () => {
    const kws = buildKeywords({
      characterName: 'Luna',
      emotionalCore: 'belonging',
      formatId: 'picture',
      premise: 'A fox finds home under moonlight',
      language: 'en',
    })
    assert.ok(kws.length <= LISTING_METADATA_META.keywordMax)
    assert.ok(kws.length >= 3)
    assert.ok(kws.some((k) => /luna|belonging|picture|ages/i.test(k)))
  })

  it('builds a short subtitle with age range', () => {
    const sub = buildSubtitle({
      characterName: 'Luna',
      emotionalCore: 'courage',
      formatId: 'picture',
      language: 'en',
    })
    assert.match(sub, /Luna/)
    assert.match(sub, /3–7|3-7/)
  })

  it('suggests categories for picture + belonging', () => {
    const cats = suggestCategories({ formatId: 'picture', emotionalCore: 'belonging' })
    assert.ok(cats.length >= 1)
    assert.ok(cats[0].label.includes('Children'))
  })

  it('builds full metadata draft with plain text', () => {
    const built = buildListingMetadata({
      title: 'Luna Finds Home',
      characterName: 'Luna',
      emotionalCore: 'belonging',
      formatId: 'picture',
      language: 'en',
    })
    const n = normalizeListingMetadata({
      ...built,
      updated_at: new Date().toISOString(),
    })
    assert.equal(n.keywords.length, 7)
    assert.ok(n.keywords.filter(Boolean).length <= 7)
    assert.match(n.plain, /Keywords/)
    assert.match(n.plain, /Category/)
    assert.match(n.subtitle, /Luna/)
  })

  it('prices listing_metadata at 0 and traces S69', () => {
    assert.equal(CREDIT_COSTS.listing_metadata, 0)
    assert.ok(TRACEABILITY.some((t) => t.id === 'S69' && t.status === 'done'))
    assert.equal(NAMED_TOOLS.listing_metadata?.id, 'listing_metadata')
  })
})
