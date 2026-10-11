import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createMarketProvider } from '../src/index.js'

test('mock niche search labels estimates', async () => {
  const m = createMarketProvider()
  const r = await m.searchNiches({ maxBsr: 50000 })
  assert.equal(r.estimated, true)
  assert.ok(r.results.length >= 1)
  assert.match(r.disclaimer, /No scraping/)
})
