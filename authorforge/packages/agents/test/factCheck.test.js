import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  extractClaimsFromText,
  factCheckClaims,
  chunkResource,
  retrieveChunks,
  createOriginalityProvider,
} from '../src/index.js'
import { MockSearchProvider } from '../src/search.js'

test('extractClaimsFromText finds CLAIM_NEEDED and stats', () => {
  const md =
    'Growth rose 42% last year for many teams. <!-- CLAIM_NEEDED: verify the 42% figure -->'
  const claims = extractClaimsFromText(md, 'c0')
  assert.ok(claims.length >= 1)
  assert.ok(claims.every((c) => c.verification_status === 'unverified'))
})

test('factCheckClaims with mock never marks verified', async () => {
  const claims = extractClaimsFromText(
    'About 30% of readers prefer short chapters. <!-- CLAIM_NEEDED: confirm the 30% figure -->',
    'c0'
  )
  assert.ok(claims.length >= 1)
  const r = await factCheckClaims(claims, { searchProvider: new MockSearchProvider() })
  assert.equal(r.provider, 'mock')
  assert.ok(r.claims.length >= 1)
  assert.ok(r.claims.every((c) => c.verification_status === 'unverified'))
  assert.equal(r.passed, false)
})

test('resource chunk retrieve prefers related text', () => {
  const chunks = [
    ...chunkResource({ id: 'a', text: 'Templates and worksheets for freelancers.', must_cover: true }),
    ...chunkResource({ id: 'b', text: 'Cooking recipes for pasta night.' }),
  ]
  const top = retrieveChunks(chunks, 'freelancer worksheet templates', { topK: 1 })
  assert.equal(top[0].resource_id, 'a')
})

test('originality scan flags self repetition', async () => {
  const p = createOriginalityProvider()
  const phrase = 'same six words again here'
  const text = Array(5).fill(phrase).join(' ')
  const r = await p.scan(text, { otherTexts: [] })
  assert.ok(r.flagged.length >= 1)
})
