import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  generateCharacterNames,
  hasSoftEnding,
  CHARACTER_NAME_META,
  CULTURAL_NAME_BANK,
} from '../src/character-names.js'
import { assessCharacterName } from '../src/ip-character.js'

describe('theme-aware character names', () => {
  it('exposes rules and disclaimer', () => {
    assert.ok(CHARACTER_NAME_META.rules.length >= 4)
    assert.match(CHARACTER_NAME_META.disclaimer, /not trademark/i)
    assert.ok(CULTURAL_NAME_BANK.some((n) => n.name === 'Kofi'))
  })

  it('returns short scored ideas tied to belonging + Ghana cues', () => {
    const r = generateCharacterNames({
      emotionalHook: 'belonging',
      emotionalCore: 'finding a place to belong',
      culturalEnrichment: 'kente scarf · Ghana Akan names',
      bookTitle: 'Willkommen, Kofi',
      seed: 7,
      count: 8,
    })
    assert.ok(r.ideas.length >= 4)
    assert.ok(r.ideas.every((i) => assessCharacterName(i.name).syllables <= 2))
    assert.ok(r.ideas.every((i) => i.why && i.score > 0))
    assert.ok(
      r.ideas.some((i) => i.kind === 'cultural'),
      'expected a cultural name in the batch',
    )
  })

  it('boosts theme names for bedtime / moon cores', () => {
    const r = generateCharacterNames({
      emotionalHook: 'love',
      emotionalCore: 'a moon bedtime hug',
      premise: 'night time comfort under the moon',
      seed: 99,
      count: 8,
    })
    assert.ok(r.ideas.some((i) => /luna|luma|bibi/i.test(i.name) || /moon|bed|soft/i.test(i.why)))
  })

  it('respects exclude list and soft-ending helper', () => {
    assert.equal(hasSoftEnding('Kofi'), true)
    assert.equal(hasSoftEnding('Pip'), false)
    const r = generateCharacterNames({
      seed: 1,
      count: 6,
      exclude: ['Kofi', 'Ama'],
    })
    assert.ok(!r.ideas.some((i) => i.name === 'Kofi' || i.name === 'Ama'))
  })

  it('is deterministic for the same seed', () => {
    const a = generateCharacterNames({ seed: 12345, emotionalHook: 'courage', count: 6 })
    const b = generateCharacterNames({ seed: 12345, emotionalHook: 'courage', count: 6 })
    assert.deepEqual(
      a.ideas.map((i) => i.name),
      b.ideas.map((i) => i.name),
    )
  })
})
