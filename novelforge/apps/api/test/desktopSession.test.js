import { test } from 'node:test'
import assert from 'node:assert/strict'
import { issueDesktopSession, verifyDesktopSession } from '../src/security/desktopSession.js'
import { assertRuntimeSecrets } from '../src/config.js'

assertRuntimeSecrets()

test('desktop session issues and verifies ≥1024', () => {
  const { token } = issueDesktopSession({ userId: 'u1', viewportWidth: 1280 })
  const body = verifyDesktopSession(token)
  assert.equal(body.sub, 'u1')
  assert.equal(body.surface, 'desktop')
})

test('desktop session rejects narrow viewport', () => {
  assert.throws(() => issueDesktopSession({ userId: 'u1', viewportWidth: 800 }), /Desktop viewport/)
})
