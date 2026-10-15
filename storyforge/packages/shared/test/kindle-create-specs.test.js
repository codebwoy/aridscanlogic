import test from 'node:test'
import assert from 'node:assert/strict'
import { KINDLE_CREATE_SPECS, kindleCreatePayload } from '../src/kindle-create-specs.js'
import { PUBLISHING_SPECS } from '../src/publishing-specs.js'
import { publicationReadinessPayload } from '../src/publication-readiness.js'

test('StoryForge marks Kindle Create reflowable as not applicable', () => {
  assert.equal(KINDLE_CREATE_SPECS.applicable, false)
  assert.equal(PUBLISHING_SPECS.kindleCreate.applicable, false)
  const payload = kindleCreatePayload()
  assert.equal(payload.applicable, false)
  assert.match(payload.verifiedNote, /picture/i)
  assert.ok(publicationReadinessPayload().kindleCreateNote)
})
