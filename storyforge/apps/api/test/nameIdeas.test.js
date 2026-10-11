import { describe, it, before } from 'node:test'
import assert from 'node:assert/strict'
import { createMemoryStore } from '../src/db/memoryStore.js'
import { generateCharacterNames, characterNamesPayload } from '@storyforge/shared'

describe('name-ideas generator (API shared path)', () => {
  let store
  let user
  let project

  before(async () => {
    store = createMemoryStore({ persist: false })
    user = await store.ensureUser('name-ideas-test')
    project = await store.createProject(user.id, {
      title: 'Willkommen unter dem Mond',
      emotional_core: 'bedtime belonging under the moon',
      premise: 'A child finds comfort at night',
      page_count: 24,
    })
    await store.setIpCharacter(user.id, project.id, {
      name: '',
      signatureColor: 'blue',
      definingTrait: 'gentle helper',
      signatureObject: 'small drum',
      emotionalHook: 'belonging',
      culturalEnrichment: 'Ghana Akan day-name tradition',
      silhouetteNote: 'round soft silhouette',
      merchChecks: {
        silhouette: true,
        simple_shapes: true,
        one_colour_role: true,
        signature_object: true,
        tee_first: true,
        series_intent: true,
      },
    })
  })

  it('builds ideas from project emotional core + culture DNA', async () => {
    const fresh = await store.getProject(user.id, project.id)
    const dna = fresh.ip_character
    const ideas = generateCharacterNames({
      bookTitle: fresh.title,
      emotionalCore: fresh.emotional_core,
      premise: fresh.premise,
      emotionalHook: dna.emotionalHook,
      definingTrait: dna.definingTrait,
      culturalEnrichment: dna.culturalEnrichment,
      seed: 42,
      count: 8,
    })
    assert.ok(ideas.ideas.length >= 4)
    assert.ok(ideas.ideas.some((i) => i.kind === 'cultural'))
    assert.ok(ideas.disclaimer)
  })

  it('exposes catalogue payload for specs / Launchpad', () => {
    const p = characterNamesPayload()
    assert.ok(p.meta?.rules?.length)
    assert.ok(p.sample?.ideas?.length >= 4)
  })

  it('project PATCH emotional_core changes generator input', async () => {
    await store.updateProject(user.id, project.id, {
      emotional_core: 'courage on the first day of school',
    })
    const fresh = await store.getProject(user.id, project.id)
    const a = generateCharacterNames({
      bookTitle: fresh.title,
      emotionalCore: fresh.emotional_core,
      emotionalHook: 'courage',
      seed: 11,
      count: 8,
    })
    assert.equal(a.hook, 'courage')
    assert.ok(a.ideas.every((i) => i.why))
  })
})
