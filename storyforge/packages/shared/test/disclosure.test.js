import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { assessDisclosure } from '../src/disclosure.js'

describe('assessDisclosure', () => {
  it('requires disclose for prompt-based AI', () => {
    const r = assessDisclosure({ usedAi: true, generationMode: 'prompt' })
    assert.equal(r.recommendDisclose, true)
    assert.equal(r.kdpCategory, 'ai_generated')
  })

  it('source S22: enhance hand-painted → assisted, no disclose', () => {
    const r = assessDisclosure({ usedAi: true, generationMode: 'enhance_hand_painted' })
    assert.equal(r.recommendDisclose, false)
    assert.equal(r.kdpCategory, 'ai_assisted')
  })

  it('defaults unknown edge cases to disclose', () => {
    const r = assessDisclosure({ usedAi: true, generationMode: 'unknown' })
    assert.equal(r.recommendDisclose, true)
  })
})
