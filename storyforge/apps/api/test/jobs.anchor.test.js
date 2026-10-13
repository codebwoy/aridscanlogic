import { describe, it, before } from 'node:test'
import assert from 'node:assert/strict'
import { createMemoryStore } from '../src/db/memoryStore.js'
import { submitJob, wireLocalJobHandlers } from '../src/services/jobs.js'
import { initQueue } from '../src/queue/queues.js'
import { lockTestIpDna } from './helpers/ipDna.js'

async function waitForJob(store, userId, jobId, tries = 40) {
  for (let i = 0; i < tries; i++) {
    const job = await store.getJob(userId, jobId)
    if (job?.status === 'completed' || job?.status === 'failed') return job
    await new Promise((r) => setTimeout(r, 25))
  }
  return store.getJob(userId, jobId)
}

describe('anchor-required jobs', () => {
  let store
  let user
  let project

  before(async () => {
    await initQueue()
    store = createMemoryStore()
    wireLocalJobHandlers(store)
    user = await store.ensureUser('test-anchor')
    project = await store.createProject(user.id, { title: 'Anchor test' })
  })

  it('rejects editor_pro without pinned anchor', async () => {
    await assert.rejects(
      () =>
        submitJob(store, {
          userId: user.id,
          type: 'editor_pro',
          projectId: project.id,
          inputs: { brief: 'hi' },
        }),
      (err) => err.code === 'anchor_required'
    )
  })

  it('rejects character_turbo without locked IP DNA', async () => {
    await assert.rejects(
      () =>
        submitJob(store, {
          userId: user.id,
          type: 'character_turbo',
          projectId: project.id,
          inputs: { name: 'Luna' },
        }),
      (err) => err.code === 'ip_dna_required',
    )
  })

  it('rejects photo_to_cartoon without recorded consent', async () => {
    await lockTestIpDna(store, user.id, project.id, { name: 'Kid' })
    await assert.rejects(
      () =>
        submitJob(store, {
          userId: user.id,
          type: 'photo_to_cartoon',
          projectId: project.id,
          inputs: { name: 'Kid', guardianAffirmed: true },
        }),
      (err) => err.code === 'consent_required'
    )
  })

  it('rejects raw photo payloads', async () => {
    await store.addPhotoConsent(user.id, project.id, {
      guardian_name: 'Parent',
      relationship: 'parent',
      acknowledged_guardian: true,
      acknowledged_no_model_training: true,
    })
    await assert.rejects(
      () =>
        submitJob(store, {
          userId: user.id,
          type: 'photo_to_cartoon',
          projectId: project.id,
          inputs: { photoBase64: 'AAAA' },
        }),
      (err) => err.code === 'photo_payload_forbidden'
    )
  })

  it('character_turbo pins anchor then editor_pro succeeds', async () => {
    await lockTestIpDna(store, user.id, project.id, { name: 'Luna' })
    const job = await submitJob(store, {
      userId: user.id,
      type: 'character_turbo',
      projectId: project.id,
      inputs: { name: 'Luna', engineVersion: 'v3' },
    })
    const done = await waitForJob(store, user.id, job.id)
    assert.equal(done.status, 'completed')

    const refreshed = await store.getProject(user.id, project.id)
    assert.ok(refreshed.pinned_anchor_asset_id)

    const scene = await submitJob(store, {
      userId: user.id,
      type: 'editor_pro',
      projectId: project.id,
      inputs: { brief: 'Luna waves' },
    })
    assert.equal(scene.inputs.fromAnchor, true)

    const outfit = await submitJob(store, {
      userId: user.id,
      type: 'editor_outfit',
      projectId: project.id,
      inputs: { brief: 'wearing cozy pajamas', pageIndex: 0 },
    })
    assert.equal(outfit.inputs.fromAnchor, true)
    const outfitDone = await waitForJob(store, user.id, outfit.id)
    assert.equal(outfitDone.status, 'completed', outfitDone.error)
  })
})
