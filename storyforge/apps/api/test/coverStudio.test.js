import { describe, it, before } from 'node:test'
import assert from 'node:assert/strict'
import { createMemoryStore } from '../src/db/memoryStore.js'
import { submitJob, wireLocalJobHandlers } from '../src/services/jobs.js'
import { initQueue } from '../src/queue/queues.js'
import { buildCoverWrapPdf } from '../src/services/pdfExport.js'
import { config } from '../src/config.js'
import { CREDIT_COSTS } from '@storyforge/shared'

/** Valid 1×1 PNG */
const TINY_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function waitJob(store, userId, jobId, tries = 60) {
  for (let i = 0; i < tries; i++) {
    const job = await store.getJob(userId, jobId)
    if (job.status === 'completed' || job.status === 'failed') return job
    await sleep(50)
  }
  throw new Error('job timeout')
}

describe('Cover Studio generate_cover_art', () => {
  before(async () => {
    process.env.STORYFORGE_IMAGE_PROVIDER = 'mock'
    await initQueue()
  })

  it('requires pinned Character Turbo anchor', async () => {
    const store = createMemoryStore({ persist: false })
    wireLocalJobHandlers(store)
    const user = await store.ensureUser('cover-studio-no-anchor')
    const project = await store.createProject(user.id, {
      title: 'No Anchor Cover',
      page_count: 24,
      trim_id: 'sq_85',
    })
    await assert.rejects(
      () =>
        submitJob(store, {
          userId: user.id,
          type: 'generate_cover_art',
          projectId: project.id,
          inputs: { layout_id: 'hero_centered' },
        }),
      /anchor/i,
    )
  })

  it('generates title-safe front art and persists cover_studio (mock provider)', async (t) => {
    if (config.imageProvider !== 'mock') {
      t.skip('requires STORYFORGE_IMAGE_PROVIDER=mock (provider is fixed at process start)')
      return
    }
    const store = createMemoryStore({ persist: false })
    wireLocalJobHandlers(store)
    const user = await store.ensureUser('cover-studio-gen')
    await store.appendLedger({ userId: user.id, delta: 50, reason: 'test_grant' })
    let project = await store.createProject(user.id, {
      title: 'Luna Finds Home',
      page_count: 32,
      trim_id: 'sq_85',
      paper_type: 'white',
      emotional_core: 'belonging',
      premise: 'A little fox learns she belongs',
      style_preset: 'storybook',
    })
    project = await store.pinAnchor(user.id, project.id, {
      assetId: 'anchor-1',
      heroUrl: TINY_PNG,
      name: 'Luna',
      engine: 'v3',
      embedding: [0.1, 0.2, 0.3],
    })
    const job = await submitJob(store, {
      userId: user.id,
      type: 'generate_cover_art',
      projectId: project.id,
      inputs: {
        layout_id: 'bedtime_soft',
        author: 'A. Creator',
        subtitle: 'A bedtime story',
        title_placement: 'top',
      },
    })
    assert.equal(job.cost_credits, CREDIT_COSTS.generate_cover_art)
    const done = await waitJob(store, user.id, job.id)
    assert.equal(done.status, 'completed', done.error)
    assert.ok(done.outputs?.cover_studio?.front_art_url)
    assert.equal(done.outputs.cover_studio.layout_id, 'bedtime_soft')
    assert.match(done.outputs.cover_studio.prompt, /title-safe/i)
    const refreshed = await store.getProject(user.id, project.id)
    assert.ok(refreshed.cover_studio?.front_art_url)
    assert.equal(refreshed.cover_studio.author, 'A. Creator')
  })

  it('export_cover_pdf prefers Cover Studio front art + subtitle', async () => {
    const pdf = await buildCoverWrapPdf({
      title: 'Luna Finds Home',
      author: 'A. Creator',
      subtitle: 'A bedtime story',
      blurb: 'Warm SEL picture book.',
      trimId: 'sq_85',
      pageCount: 32,
      paperTypeId: 'white',
      titlePlacement: 'bottom',
      frontImageUrl: TINY_PNG,
    })
    assert.equal(pdf.mime, 'application/pdf')
    assert.ok(pdf.byteLength > 500)

    const store = createMemoryStore({ persist: false })
    wireLocalJobHandlers(store)
    const user = await store.ensureUser('cover-studio-export')
    await store.appendLedger({ userId: user.id, delta: 50, reason: 'test_grant' })
    let project = await store.createProject(user.id, {
      title: 'Luna Finds Home',
      page_count: 32,
      trim_id: 'sq_85',
      cover_studio: {
        layout_id: 'hero_centered',
        author: 'A. Creator',
        subtitle: 'A bedtime story',
        front_art_url: TINY_PNG,
        title_placement: 'top',
        finish: 'glossy',
      },
    })
    project = await store.pinAnchor(user.id, project.id, {
      assetId: 'a2',
      heroUrl: TINY_PNG,
      name: 'Luna',
      engine: 'v3',
    })
    const job = await submitJob(store, {
      userId: user.id,
      type: 'export_cover_pdf',
      projectId: project.id,
      inputs: {},
    })
    const done = await waitJob(store, user.id, job.id)
    assert.equal(done.status, 'completed', done.error)
    assert.ok(done.outputs?.pdf?.dataUrl)
    assert.ok(done.outputs?.checklist?.length >= 5)
    assert.ok(done.outputs?.kdpHelpUrl?.includes('G201953020'))
    assert.equal(done.outputs?.coverStudio?.author, 'A. Creator')
  })
})
