import { test } from 'node:test'
import assert from 'node:assert/strict'

process.env.AUTHORFORGE_LLM_PROVIDER = 'fake'
process.env.AUTHORFORGE_PERSIST = '0'
process.env.ANTHROPIC_API_KEY = ''

const { createMemoryStore } = await import('../src/db/memoryStore.js')
const { wireLocalJobHandlers, submitJob } = await import('../src/services/jobs.js')
const { initQueue } = await import('../src/queue/queues.js')
const { resolveExportArtifact, verifyExportToken } = await import('../src/services/exportStore.js')

async function waitJob(store, userId, jobId, tries = 80) {
  for (let i = 0; i < tries; i++) {
    const j = await store.getJob(userId, jobId)
    if (j.status === 'completed' || j.status === 'failed') return j
    await new Promise((r) => setTimeout(r, 50))
  }
  throw new Error('job timeout')
}

test('export_interior_pdf persists artifact with signed download url', async () => {
  const store = createMemoryStore({ persist: false })
  wireLocalJobHandlers(store)
  await initQueue()
  const user = await store.ensureUser('export-user')
  const book = await store.createBook(user.id, {
    working_title: 'The Little Brave Heart',
    author_name: 'Test Author',
    sections: {
      c0: {
        title: 'Chapter 1',
        content_md: 'Once upon a time a small heart learned to be brave.',
        word_count: 12,
        status: 'draft',
      },
    },
  })

  const job = await submitJob(store, {
    userId: user.id,
    type: 'export_interior_pdf',
    bookId: book.id,
    inputs: {},
  })
  const done = await waitJob(store, user.id, job.id)
  assert.equal(done.status, 'completed', done.error)
  assert.ok(done.outputs?.url)
  assert.ok(done.outputs?.id)
  assert.ok(done.outputs?.token)
  assert.equal(verifyExportToken(done.outputs.token, done.outputs.id), true)
  assert.match(done.outputs.url, /^\/v1\/exports\//)

  const art = await resolveExportArtifact(store, done.outputs.id)
  assert.ok(art)
  assert.equal(art.format, 'interior_pdf')
  const bytes = Buffer.from(art.bytes, 'base64')
  assert.ok(bytes.length > 100)
  assert.equal(bytes.subarray(0, 4).toString('utf8'), '%PDF')
})

test('export_kdp_zip and export_epub return download urls', async () => {
  const store = createMemoryStore({ persist: false })
  wireLocalJobHandlers(store)
  await initQueue()
  const user = await store.ensureUser('export-user-2')
  const book = await store.createBook(user.id, {
    working_title: 'Export Pack',
    author_name: 'Author',
    sections: {
      c0: { title: 'One', content_md: 'Hello world chapter body.', word_count: 4, status: 'draft' },
    },
  })

  for (const type of ['export_epub', 'export_docx', 'export_kdp_zip']) {
    const job = await submitJob(store, {
      userId: user.id,
      type,
      bookId: book.id,
      inputs: {},
    })
    const done = await waitJob(store, user.id, job.id)
    assert.equal(done.status, 'completed', `${type}: ${done.error}`)
    assert.ok(done.outputs?.url, `${type} missing url`)
    const art = await resolveExportArtifact(store, done.outputs.id)
    assert.ok(art, `${type} missing artifact`)
    assert.ok(Buffer.from(art.bytes, 'base64').length > 20, `${type} empty bytes`)
  }
})
