import { describe, it, before } from 'node:test'
import assert from 'node:assert/strict'
import { createMemoryStore } from '../src/db/memoryStore.js'
import { submitJob, wireLocalJobHandlers } from '../src/services/jobs.js'
import { initQueue } from '../src/queue/queues.js'
import { config } from '../src/config.js'
import { CREDIT_COSTS } from '@storyforge/shared'

const TINY_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

async function waitJob(store, userId, jobId, tries = 80) {
  for (let i = 0; i < tries; i++) {
    const job = await store.getJob(userId, jobId)
    if (job.status === 'completed' || job.status === 'failed') return job
    await new Promise((r) => setTimeout(r, 40))
  }
  throw new Error('job timeout')
}

describe('coloring pages + back cover art', () => {
  before(async () => {
    process.env.STORYFORGE_IMAGE_PROVIDER = 'mock'
    await initQueue()
  })

  it('requires page art before coloring_all_pages can generate', async (t) => {
    if (config.imageProvider !== 'mock') {
      t.skip('requires mock image provider')
      return
    }
    const store = createMemoryStore({ persist: false })
    wireLocalJobHandlers(store)
    const user = await store.ensureUser('coloring-test')
    await store.appendLedger({ userId: user.id, delta: 200, reason: 'test_grant' })
    let project = await store.createProject(user.id, {
      title: 'Coloring Test',
      page_count: 24,
      trim_id: 'sq_85',
    })
    project = await store.pinAnchor(user.id, project.id, {
      assetId: 'a1',
      heroUrl: TINY_PNG,
      name: 'Luna',
      engine: 'v3',
      embedding: [0.1, 0.2],
    })
    // No page art yet — job completes with all skipped
    const job = await submitJob(store, {
      userId: user.id,
      type: 'coloring_all_pages',
      projectId: project.id,
      inputs: {},
    })
    assert.equal(job.cost_credits, 0)
    const done = await waitJob(store, user.id, job.id)
    assert.equal(done.status, 'completed', done.error)
    assert.equal(done.outputs.generated, 0)
    assert.equal(done.outputs.skipped, 24)

    // Seed a few pages with art then derive coloring
    const artCount = 3
    for (let i = 0; i < artCount; i++) {
      await store.setPage(user.id, project.id, i, {
        asset: { url: TINY_PNG, assetId: `p${i}`, width: 100, height: 100 },
        status: 'generated',
      })
    }
    const job2 = await submitJob(store, {
      userId: user.id,
      type: 'coloring_all_pages',
      projectId: project.id,
      inputs: { skipExisting: false },
    })
    assert.equal(job2.cost_credits, artCount * CREDIT_COSTS.coloring_page)
    const done2 = await waitJob(store, user.id, job2.id)
    assert.equal(done2.status, 'completed', done2.error)
    assert.equal(done2.outputs.generated, artCount)
    const fresh = await store.getProject(user.id, project.id)
    assert.ok(fresh.pages[0].coloring_asset?.url)

    const pdfJob = await submitJob(store, {
      userId: user.id,
      type: 'export_coloring_pdf',
      projectId: project.id,
      inputs: {},
    })
    const pdfDone = await waitJob(store, user.id, pdfJob.id)
    assert.equal(pdfDone.status, 'completed', pdfDone.error)
    assert.ok(pdfDone.outputs?.pdf?.dataUrl || pdfDone.outputs?.pdf?.downloadPath)
  })

  it('generate_back_cover_art persists back_art_url', async (t) => {
    if (config.imageProvider !== 'mock') {
      t.skip('requires mock image provider')
      return
    }
    const store = createMemoryStore({ persist: false })
    wireLocalJobHandlers(store)
    const user = await store.ensureUser('back-cover-test')
    await store.appendLedger({ userId: user.id, delta: 50, reason: 'test_grant' })
    let project = await store.createProject(user.id, {
      title: 'Back Cover Test',
      page_count: 24,
      trim_id: 'sq_85',
      emotional_core: 'belonging',
    })
    project = await store.pinAnchor(user.id, project.id, {
      assetId: 'b1',
      heroUrl: TINY_PNG,
      name: 'Luna',
      engine: 'v3',
      embedding: [0.2, 0.3],
    })
    const job = await submitJob(store, {
      userId: user.id,
      type: 'generate_back_cover_art',
      projectId: project.id,
      inputs: { author: 'A. Creator' },
    })
    assert.equal(job.cost_credits, CREDIT_COSTS.generate_back_cover_art)
    const done = await waitJob(store, user.id, job.id)
    assert.equal(done.status, 'completed', done.error)
    assert.ok(done.outputs?.cover_studio?.back_art_url)
    assert.match(done.outputs.cover_studio.back_prompt || '', /barcode|LOWER-RIGHT/i)
    const fresh = await store.getProject(user.id, project.id)
    assert.ok(fresh.cover_studio?.back_art_url)
  })
})
