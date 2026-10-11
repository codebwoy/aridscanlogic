import { test } from 'node:test'
import assert from 'node:assert/strict'
import { config } from '../src/config.js'
import { isAllowlistedBrowser } from '../src/http.js'

test('allowlisted Origin passes', () => {
  config.webOrigins.push('https://aridscanlogic.cycroommedia.com')
  const ok = isAllowlistedBrowser({
    headers: { origin: 'https://aridscanlogic.cycroommedia.com', host: 'other.fly.dev' },
  })
  assert.equal(ok, true)
})

test('publicHost same-host passes', () => {
  config.publicHost = 'scanlogic-authorforge.fly.dev'
  const ok = isAllowlistedBrowser({
    headers: { host: 'scanlogic-authorforge.fly.dev', origin: '' },
  })
  assert.equal(ok, true)
})
