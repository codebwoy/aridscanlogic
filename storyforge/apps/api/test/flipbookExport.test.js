import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { buildFlipbookZip } from '../src/services/flipbookExport.js'
import { buildZip, dataUrlToBuffer } from '../src/services/zipPack.js'
import { createMemoryStore } from '../src/db/memoryStore.js'
import { submitJob, wireLocalJobHandlers } from '../src/services/jobs.js'
import { CREDIT_COSTS } from '@storyforge/shared'

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

const TINY_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

describe('digital flipbook export', () => {
  it('builds ZIP with index.html and page assets', async () => {
    const result = await buildFlipbookZip({
      userId: 'flip-user',
      project: {
        title: 'Luna Flip',
        language: 'en',
        secondary_language: 'tw',
        bilingual_layout: 'stacked',
        page_count: 3,
        premise: 'A brave night.',
        pinned_anchor: { heroUrl: TINY_PNG },
        pages: [
          { text_content: 'Hello moon', text_secondary: 'Maakye ɔsram', asset: { url: TINY_PNG } },
          { text_content: 'Page two', asset: { url: TINY_PNG } },
          { text_content: 'The end', asset: { url: TINY_PNG } },
        ],
      },
    })
    assert.equal(result.pageCount, 3)
    assert.equal(result.hasCover, true)
    assert.ok(result.zip?.downloadPath || result.zip?.dataUrl)
    assert.ok(Array.isArray(result.checklist))
  })

  it('export_flipbook job completes', async () => {
    assert.equal(CREDIT_COSTS.export_flipbook, 1)
    const store = createMemoryStore({ persist: false })
    wireLocalJobHandlers(store)
    const user = await store.ensureUser('flipbook-job-test')
    const project = await store.createProject(user.id, {
      title: 'Flip Job Book',
      page_count: 4,
      trim_id: 'sq_85',
      language: 'de',
    })
    await store.pinAnchor(user.id, project.id, {
      assetId: 'a1',
      heroUrl: TINY_PNG,
      name: 'Luna',
    })
    await store.setPage(user.id, project.id, 0, {
      text_content: 'Hallo',
      asset: { url: TINY_PNG },
      status: 'generated',
    })
    const job = await submitJob(store, {
      userId: user.id,
      type: 'export_flipbook',
      projectId: project.id,
      inputs: { includeCover: true },
    })
    const done = await waitJob(store, user.id, job.id)
    assert.equal(done.status, 'completed', done.error)
    assert.ok(done.outputs?.zip?.downloadPath || done.outputs?.zip?.dataUrl)
    assert.equal(done.outputs?.flipbook?.pageCount, 4)
  })

  it('ZIP magic from buildZip still valid', () => {
    const zip = buildZip([{ name: 'index.html', data: '<html></html>', compress: true }])
    assert.equal(zip.readUInt32LE(0), 0x04034b50)
    assert.ok(dataUrlToBuffer(TINY_PNG)?.length)
  })
})
