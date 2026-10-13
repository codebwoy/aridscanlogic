import { describe, it, before } from 'node:test'
import assert from 'node:assert/strict'
import { createMemoryStore } from '../src/db/memoryStore.js'
import { submitJob, wireLocalJobHandlers } from '../src/services/jobs.js'
import { buildCoverWrapPdf } from '../src/services/pdfExport.js'
import { initQueue } from '../src/queue/queues.js'

const VALID_ISBN = '9783161484100'

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

describe('ISBN barcode on cover wrap (S72)', () => {
  before(async () => {
    await initQueue()
  })

  it('buildCoverWrapPdf embeds EAN-13 when requested', async () => {
    const pdf = await buildCoverWrapPdf({
      title: 'ISBN Test',
      author: 'A. Author',
      blurb: 'Test',
      trimId: 'sq_85',
      pageCount: 24,
      paperTypeId: 'white',
      isbn: VALID_ISBN,
      embedIsbnBarcode: true,
    })
    assert.equal(pdf.barcodeEmbedded, true)
    assert.equal(pdf.isbn, VALID_ISBN)
    assert.ok(pdf.byteLength > 500)
  })

  it('leaves reserve empty without embed flag', async () => {
    const pdf = await buildCoverWrapPdf({
      title: 'No Barcode',
      author: 'A. Author',
      trimId: 'sq_85',
      pageCount: 24,
      isbn: VALID_ISBN,
      embedIsbnBarcode: false,
    })
    assert.equal(pdf.barcodeEmbedded, false)
    assert.equal(pdf.isbn, null)
  })

  it('export_cover_pdf job passes ISBN through', async () => {
    const store = createMemoryStore({ persist: false })
    wireLocalJobHandlers(store)
    const user = await store.ensureUser('isbn-cover-job')
    let project = await store.createProject(user.id, {
      title: 'Barcode Book',
      page_count: 24,
      trim_id: 'sq_85',
      cover_studio: {
        author: 'Test',
        isbn: VALID_ISBN,
        embed_isbn_barcode: true,
      },
    })
    project = await store.updateProject(user.id, project.id, {
      cover_studio: {
        ...(project.cover_studio || {}),
        isbn: VALID_ISBN,
        embed_isbn_barcode: true,
        author: 'Test',
      },
    })
    const job = await submitJob(store, {
      userId: user.id,
      type: 'export_cover_pdf',
      projectId: project.id,
      inputs: {
        isbn: VALID_ISBN,
        embed_isbn_barcode: true,
        author: 'Test',
      },
    })
    const done = await waitJob(store, user.id, job.id)
    assert.equal(done.status, 'completed', done.error)
    assert.equal(done.outputs?.pdf?.barcodeEmbedded, true)
    assert.equal(done.outputs?.pdf?.isbn, VALID_ISBN)
  })
})

describe('Cover Studio ISBN persists via PATCH (S72)', () => {
  it('normalizeCoverStudioState keeps isbn after merge', async () => {
    const { normalizeCoverStudioState } = await import('@storyforge/shared')
    const next = normalizeCoverStudioState({
      ...normalizeCoverStudioState({ author: 'A' }),
      isbn: VALID_ISBN,
      embed_isbn_barcode: true,
    })
    assert.equal(next.isbn, VALID_ISBN)
    assert.equal(next.embed_isbn_barcode, true)
  })

  it('memoryStore updateProject retains isbn on cover_studio', async () => {
    const store = createMemoryStore({ persist: false })
    const user = await store.ensureUser('isbn-patch-user')
    let project = await store.createProject(user.id, {
      title: 'ISBN Persist',
      page_count: 24,
    })
    project = await store.updateProject(user.id, project.id, {
      cover_studio: {
        author: 'Test',
        isbn: VALID_ISBN,
        embed_isbn_barcode: true,
      },
    })
    const got = await store.getProject(user.id, project.id)
    assert.equal(got.cover_studio.isbn, VALID_ISBN)
    assert.equal(got.cover_studio.embed_isbn_barcode, true)
  })
})

describe('Series manager store + catalog (S74)', () => {
  it('listSeries groups locked DNA by seriesId', async () => {
    const store = createMemoryStore({ persist: false })
    const user = await store.ensureUser('series-mgr-user')
    const a = await store.createProject(user.id, {
      title: 'Series Book A',
      page_count: 24,
    })
    const b = await store.createProject(user.id, {
      title: 'Series Book B',
      page_count: 24,
    })
    await store.createProject(user.id, { title: 'No Series', page_count: 24 })

    await store.setIpCharacter(
      user.id,
      a.id,
      {
        name: 'Kofi',
        seriesId: 'kofi-adventures',
        ageBand: '3–7',
        signatureColor: 'gold',
        signatureTrait: 'brave',
        signatureObject: 'drum',
        silhouette: 'round',
      },
      { lock: true },
    )
    await store.setIpCharacter(user.id, b.id, {
      name: 'Ama',
      seriesId: 'Kofi-Adventures',
      ageBand: '3–7',
      signatureColor: 'teal',
      signatureTrait: 'kind',
      signatureObject: 'bead',
      silhouette: 'tall',
    })

    const catalog = await store.listSeries(user.id)
    assert.equal(catalog.series.length, 1)
    assert.equal(catalog.series[0].bookCount, 2)
    assert.equal(catalog.series[0].lockedHeroes, 1)

    const heroes = await store.listSeriesIpDna(user.id, 'kofi-adventures')
    assert.equal(heroes.length, 1)
    assert.equal(heroes[0].projectId, a.id)
  })
})
