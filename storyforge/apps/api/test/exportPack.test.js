import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { buildInteriorPdf, buildCoverWrapPdf } from '../src/services/pdfExport.js'
import { buildZip, dataUrlToBuffer } from '../src/services/zipPack.js'
import {
  persistExport,
  resolveExportArtifact,
  verifyExportToken,
  attachSignedDownload,
} from '../src/services/exportStore.js'
import { createMemoryStore } from '../src/db/memoryStore.js'
import { submitJob, wireLocalJobHandlers } from '../src/services/jobs.js'

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

describe('print export pipeline', () => {
  it('builds print-ready interior without chrome overlays by default', async () => {
    const pdf = await buildInteriorPdf({
      title: 'Luna Test',
      trimId: 'sq_85',
      pageCount: 4,
      pages: [{ text_content: 'Hello moon' }, {}, {}, {}],
    })
    assert.equal(pdf.printReady, true)
    assert.ok(pdf.byteLength > 400)
    assert.ok(pdf.bytes?.length)
    assert.equal(pdf.pageCount, 4)
  })

  it('zips PDFs + checklist', () => {
    const zip = buildZip([
      { name: 'a.pdf', data: Buffer.from('%PDF-1.4 test'), compress: false },
      { name: 'UPLOAD-CHECKLIST.txt', data: 'upload me', compress: true },
    ])
    assert.ok(zip.length > 40)
    assert.equal(zip.readUInt32LE(0), 0x04034b50)
  })

  it('signed export round-trip', () => {
    const artifact = persistExport({
      bytes: Buffer.from('hello-pdf'),
      filename: 'test.pdf',
      mime: 'application/pdf',
      userId: 'user-1',
    })
    assert.ok(artifact.downloadPath.includes('/v1/exports/'))
    assert.ok(verifyExportToken(artifact.exportId, 'user-1', artifact.token))
    assert.equal(verifyExportToken(artifact.exportId, 'user-2', artifact.token), false)
    const resolved = resolveExportArtifact(artifact.exportId)
    assert.equal(resolved.bytes.toString(), 'hello-pdf')
  })

  it('attachSignedDownload strips huge dataUrls', () => {
    const huge = `data:application/pdf;base64,${Buffer.alloc(2_000_000).toString('base64')}`
    const out = attachSignedDownload(
      {
        mime: 'application/pdf',
        filename: 'big.pdf',
        dataUrl: huge,
        byteLength: 2_000_000,
      },
      { userId: 'u-big', stripDataUrlAbove: 100_000 },
    )
    assert.equal(out.signed, true)
    assert.ok(out.downloadPath)
    assert.equal(out.dataUrlOmitted, true)
    assert.equal(out.dataUrl, undefined)
  })

  it('export_source_zip job completes with signed zip', async () => {
    const store = createMemoryStore({ persist: false })
    wireLocalJobHandlers(store)
    const user = await store.ensureUser('export-pack-test')
    const project = await store.createProject(user.id, {
      title: 'Pack Book',
      page_count: 24,
      trim_id: 'sq_85',
      paper_type: 'white',
      premise: 'A fox finds a lamp.',
    })
    await store.updateProject(user.id, project.id, {
      publication_signoff: {
        continuity: {},
        kdp_previewer_reviewed: true,
        compliance: {
          isbn_plan_acknowledged: true,
          isbn_choice: 'mvb_own',
          trademark_self_checked: true,
          rights_docs_acknowledged: true,
          used_ai: true,
          ai_generation_mode: 'prompt',
          ai_disclose_acknowledged: true,
          single_account_acknowledged: true,
          no_review_manipulation_acknowledged: true,
        },
      },
    })
    const job = await submitJob(store, {
      userId: user.id,
      type: 'export_source_zip',
      projectId: project.id,
      inputs: {},
    })
    const done = await waitJob(store, user.id, job.id)
    assert.equal(done.status, 'completed', done.error)
    assert.ok(done.outputs?.zip?.downloadPath || done.outputs?.zip?.dataUrl)
    assert.ok(done.outputs?.pdf?.signed || done.outputs?.pdf?.dataUrl)
    assert.ok(Array.isArray(done.outputs?.uploadChecklist))
    assert.ok(dataUrlToBuffer(done.outputs?.pdf?.dataUrl) || done.outputs?.pdf?.downloadPath)
  })

  it('export_source_zip fails without compliance checklist', async () => {
    const store = createMemoryStore({ persist: false })
    wireLocalJobHandlers(store)
    const user = await store.ensureUser('export-pack-compliance')
    const project = await store.createProject(user.id, {
      title: 'Blocked Pack',
      page_count: 24,
      trim_id: 'sq_85',
    })
    const job = await submitJob(store, {
      userId: user.id,
      type: 'export_source_zip',
      projectId: project.id,
      inputs: {},
    })
    const done = await waitJob(store, user.id, job.id)
    assert.equal(done.status, 'failed')
    assert.match(done.error || '', /compliance/i)
    assert.equal(done.outputs?.code, 'compliance_required')
  })
})
