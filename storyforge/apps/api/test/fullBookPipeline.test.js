import { describe, it, before } from 'node:test'
import assert from 'node:assert/strict'
import { createMemoryStore } from '../src/db/memoryStore.js'
import { submitJob, wireLocalJobHandlers } from '../src/services/jobs.js'
import { initQueue } from '../src/queue/queues.js'
import { lockTestIpDna } from './helpers/ipDna.js'
import { CREDIT_COSTS } from '@storyforge/shared'

async function waitForJob(store, userId, jobId, tries = 80) {
  for (let i = 0; i < tries; i++) {
    const job = await store.getJob(userId, jobId)
    if (job?.status === 'completed' || job?.status === 'failed') return job
    await new Promise((r) => setTimeout(r, 25))
  }
  return store.getJob(userId, jobId)
}

describe('full book pipeline (manuscript → illustrate all)', () => {
  let store
  let user
  let project

  before(async () => {
    await initQueue()
    store = createMemoryStore({ persist: false })
    wireLocalJobHandlers(store)
    user = await store.ensureUser('full-book-pipeline')
    // Grant credits for batch illustrate (24 × 4)
    await store.appendLedger({
      userId: user.id,
      delta: 400,
      reason: 'test_grant',
    })
    project = await store.createProject(user.id, {
      title: 'Full Book Test',
      page_count: 24,
      trim_id: 'sq_85',
      language: 'en',
      secondary_language: 'de',
      emotional_core: 'belonging',
      refrain: 'I belong here with you',
    })
    await lockTestIpDna(store, user.id, project.id, { name: 'Luna' })
  })

  it('story_text writes manuscript + briefs for every page', async () => {
    const job = await submitJob(store, {
      userId: user.id,
      type: 'story_text',
      projectId: project.id,
      inputs: { overwriteText: true, overwriteBriefs: true, speechBubbles: true },
    })
    assert.equal(job.cost_credits, 0)
    const done = await waitForJob(store, user.id, job.id)
    assert.equal(done.status, 'completed', done.error)
    assert.equal(done.outputs.pagesWritten, 24)
    const fresh = await store.getProject(user.id, project.id)
    assert.ok(fresh.pages[0].text_content)
    assert.ok(fresh.pages[0].illustration_brief)
  })

  it('illustrate_all_pages requires anchor then fills art', async () => {
    await assert.rejects(
      () =>
        submitJob(store, {
          userId: user.id,
          type: 'illustrate_all_pages',
          projectId: project.id,
          inputs: {},
        }),
      (err) => err.code === 'anchor_required',
    )

    const turbo = await submitJob(store, {
      userId: user.id,
      type: 'character_turbo',
      projectId: project.id,
      inputs: { name: 'Luna' },
    })
    const turboDone = await waitForJob(store, user.id, turbo.id)
    assert.equal(turboDone.status, 'completed', turboDone.error)

    const batch = await submitJob(store, {
      userId: user.id,
      type: 'illustrate_all_pages',
      projectId: project.id,
      inputs: { skipExisting: false },
    })
    assert.equal(batch.cost_credits, 24 * CREDIT_COSTS.editor_pro)
    const done = await waitForJob(store, user.id, batch.id, 200)
    assert.equal(done.status, 'completed', done.error)
    assert.equal(done.outputs.generated, 24)
    const fresh = await store.getProject(user.id, project.id)
    assert.ok(fresh.pages.every((p) => p.asset?.url))
  })

  it('upscale_all_pages runs on pages with art', async () => {
    const job = await submitJob(store, {
      userId: user.id,
      type: 'upscale_all_pages',
      projectId: project.id,
      inputs: {},
    })
    assert.equal(job.cost_credits, 24 * CREDIT_COSTS.upscale_print)
    const done = await waitForJob(store, user.id, job.id, 200)
    assert.equal(done.status, 'completed', done.error)
    assert.equal(done.outputs.upscaled, 24)
  })
})
