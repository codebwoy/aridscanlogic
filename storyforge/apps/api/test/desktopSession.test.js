import { describe, it, before } from 'node:test'
import assert from 'node:assert/strict'

describe('desktopSession', () => {
  before(() => {
    process.env.STORYFORGE_SESSION_SECRET = 'test-secret-at-least-32-characters-long!!'
    process.env.NODE_ENV = 'test'
  })

  it('issues and verifies desktop tokens; rejects narrow viewports', async () => {
    const { issueDesktopSession, verifyDesktopSession } = await import(
      '../src/security/desktopSession.js'
    )

    assert.throws(
      () => issueDesktopSession({ userId: 'u1', viewportWidth: 390 }),
      (e) => e.code === 'desktop_required'
    )

    const { token } = issueDesktopSession({
      userId: 'u1',
      viewportWidth: 1440,
      userAgent: 'test',
    })
    const session = verifyDesktopSession(token)
    assert.equal(session.sub, 'u1')
    assert.equal(session.surface, 'desktop')
    assert.equal(verifyDesktopSession('tampered.' + token.split('.')[1]), null)
  })
})
