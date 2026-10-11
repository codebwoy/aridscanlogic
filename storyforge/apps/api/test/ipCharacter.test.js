import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createMemoryStore } from '../src/db/memoryStore.js'
import { submitJob, wireLocalJobHandlers } from '../src/services/jobs.js'
import { initQueue } from '../src/queue/queues.js'
import { lockTestIpDna } from './helpers/ipDna.js'
import { emptyIpCharacter } from '@storyforge/shared'

describe('IP Character Builder gate', () => {
  it('locks DNA and injects description into character_turbo inputs', async () => {
    await initQueue()
    const store = createMemoryStore({ persist: false })
    wireLocalJobHandlers(store)
    const user = await store.ensureUser('ip-dna-test')
    const project = await store.createProject(user.id, { title: 'IP Book' })

    const incomplete = emptyIpCharacter({ name: 'Ama' })
    await store.setIpCharacter(user.id, project.id, incomplete)
    await assert.rejects(
      () =>
        submitJob(store, {
          userId: user.id,
          type: 'character_turbo',
          projectId: project.id,
          inputs: {},
        }),
      (err) => err.code === 'ip_dna_required',
    )

    await lockTestIpDna(store, user.id, project.id, {
      name: 'Kofi',
      signatureObject: 'small drum',
    })
    const locked = await store.getProject(user.id, project.id)
    assert.ok(locked.ip_character.locked_at)

    const job = await submitJob(store, {
      userId: user.id,
      type: 'character_turbo',
      projectId: project.id,
      inputs: {},
    })
    assert.equal(job.inputs.name, 'Kofi')
    assert.match(job.inputs.description || '', /drum|Merch-ready/i)
  })
})
