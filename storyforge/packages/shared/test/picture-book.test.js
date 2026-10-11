import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { buildEscalatingBeatBriefs, defaultRefrainForHook } from '../src/picture-book.js'

describe('picture-book blueprint', () => {
  it('builds escalating briefs for 32 pages', () => {
    const beats = buildEscalatingBeatBriefs({
      pageCount: 32,
      characterName: 'Kofi',
      emotionalCore: 'belonging',
      signatureObject: 'drum',
      refrain: 'I belong with you',
    })
    assert.equal(beats.length, 32)
    assert.match(beats[0].illustration_brief, /Kofi/)
    assert.match(beats[0].illustration_brief, /meet|Beat 1/)
    assert.match(beats[beats.length - 1].illustration_brief, /close|Beat 32/)
    assert.match(beats[10].illustration_brief, /Refrain cue/)
  })

  it('maps emotional hooks to default refrains', () => {
    assert.match(defaultRefrainForHook('love'), /love/i)
  })
})
