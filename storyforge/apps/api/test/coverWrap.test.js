import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { coverWrapLayout } from '@storyforge/shared'
import { buildCoverWrapPdf } from '../src/services/pdfExport.js'
import { createMemoryStore } from '../src/db/memoryStore.js'
import { submitJob, wireLocalJobHandlers } from '../src/services/jobs.js'

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function waitJob(store, userId, jobId, tries = 40) {
  for (let i = 0; i < tries; i++) {
    const job = await store.getJob(userId, jobId)
    if (job.status === 'completed' || job.status === 'failed') return job
    await sleep(50)
  }
  throw new Error('job timeout')
}

describe('cover wrap finish flow', () => {
  it('layout is BACK|SPINE|FRONT wider than one page', () => {
    const layout = coverWrapLayout('sq_85', 32, 'white')
    assert.ok(layout.widthPx > layout.heightPx || layout.widthIn > layout.trim.width)
    assert.ok(layout.front.xIn > layout.spine.xIn)
    assert.ok(layout.spine.xIn > layout.back.xIn)
    assert.equal(layout.spineTextAllowed, false)
    assert.ok(layout.barcode.widthIn >= 2)
  })

  it('allows spine text at 80+ pages', () => {
    const layout = coverWrapLayout('sq_85', 80, 'white')
    assert.equal(layout.spineTextAllowed, true)
  })

  it('buildCoverWrapPdf returns a downloadable PDF', async () => {
    const pdf = await buildCoverWrapPdf({
      title: 'Luna und der Mond',
      author: 'Test Author',
      blurb: 'A warm bilingual bedtime story.',
      trimId: 'sq_85',
      pageCount: 24,
      paperTypeId: 'premium_color',
    })
    assert.equal(pdf.mime, 'application/pdf')
    assert.ok(pdf.dataUrl.startsWith('data:application/pdf;base64,'))
    assert.ok(pdf.byteLength > 500)
    assert.ok(pdf.layout.widthPx > 2625)
    assert.match(pdf.filename, /cover-wrap\.pdf$/)
  })

  it('export_cover_pdf job completes and returns pdf', async () => {
    const store = createMemoryStore()
    wireLocalJobHandlers(store)
    const user = await store.ensureUser('cover-wrap-test')
    const project = await store.createProject(user.id, {
      title: 'Cover Test Book',
      page_count: 24,
      trim_id: 'sq_85',
      paper_type: 'white',
      premise: 'A brave little fox finds home.',
    })
    const job = await submitJob(store, {
      userId: user.id,
      type: 'export_cover_pdf',
      projectId: project.id,
      inputs: { author: 'A. Creator' },
    })
    const done = await waitJob(store, user.id, job.id)
    assert.equal(done.status, 'completed', done.error)
    assert.ok(done.outputs?.pdf?.dataUrl)
    assert.ok(done.outputs?.coverWrap?.widthPx > 0)
  })
})
