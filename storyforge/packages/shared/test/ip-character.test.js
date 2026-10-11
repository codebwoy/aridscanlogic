import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  assessCharacterName,
  validateIpCharacterForLock,
  buildTurboDescriptionFromDna,
  emptyIpCharacter,
  isIpCharacterLocked,
  IP_NAME_SUGGESTIONS,
} from '../src/ip-character.js'

function readyDna(overrides = {}) {
  const dna = emptyIpCharacter({
    name: 'Kofi',
    signatureColor: 'gold',
    definingTrait: 'curious helper',
    signatureObject: 'small drum',
    emotionalHook: 'belonging',
    silhouetteNote: 'round head, short body, drum on hip',
    merchChecks: {
      silhouette: true,
      simple_shapes: true,
      one_colour_role: true,
      signature_object: true,
      tee_first: true,
      series_intent: true,
    },
    ...overrides,
  })
  return dna
}

describe('IP Character Builder', () => {
  it('coaches short toddler-friendly names', () => {
    const good = assessCharacterName('Kofi')
    assert.equal(good.ok, true)
    assert.ok(good.syllables <= 2)
    const long = assessCharacterName('Bartholomew')
    assert.ok(long.syllables >= 3)
    assert.ok(long.score < good.score)
  })

  it('requires DNA + merch checks to lock', () => {
    const bad = validateIpCharacterForLock(emptyIpCharacter({ name: 'Ama' }))
    assert.equal(bad.ok, false)
    assert.ok(bad.unchecked.length > 0)

    const good = validateIpCharacterForLock(readyDna())
    assert.equal(good.ok, true)
    assert.match(buildTurboDescriptionFromDna(good.dna), /Merch-ready/)
    assert.match(buildTurboDescriptionFromDna(good.dna), /drum/)
  })

  it('detects locked state', () => {
    assert.equal(isIpCharacterLocked({ locked_at: null }), false)
    assert.equal(isIpCharacterLocked({ ip_character: { locked_at: '2026-01-01' } }), true)
  })

  it('exposes short name suggestions', () => {
    assert.ok(IP_NAME_SUGGESTIONS.some((n) => n.name === 'Kofi'))
  })
})
