import { test } from 'node:test'
import assert from 'node:assert/strict'
import { config } from '../src/config.js'
import { isAllowlistedBrowser } from '../src/http.js'

test('storyforge allowlisted Origin passes', () => {
  if (!config.webOrigins.includes('https://aridscanlogic.cycroommedia.com')) {
    config.webOrigins.push('https://aridscanlogic.cycroommedia.com')
  }
  assert.equal(
    isAllowlistedBrowser({
      headers: { origin: 'https://aridscanlogic.cycroommedia.com', host: 'x.fly.dev' },
    }),
    true
  )
})

test('storyforge publicHost passes', () => {
  config.publicHost = 'scanlogic-storyforge.fly.dev'
  assert.equal(
    isAllowlistedBrowser({
      headers: { host: 'scanlogic-storyforge.fly.dev', origin: '' },
    }),
    true
  )
})
