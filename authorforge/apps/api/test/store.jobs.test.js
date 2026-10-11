import { test } from 'node:test'
import assert from 'node:assert/strict'

process.env.AUTHORFORGE_LLM_PROVIDER = 'fake'
process.env.AUTHORFORGE_PERSIST = '0'
process.env.ANTHROPIC_API_KEY = ''

const { createMemoryStore } = await import('../src/db/memoryStore.js')
const { wireLocalJobHandlers, submitJob } = await import('../src/services/jobs.js')
const { initQueue } = await import('../src/queue/queues.js')

test('outline + section draft job path (fake LLM)', async () => {
  const store = createMemoryStore({ persist: false })
  wireLocalJobHandlers(store)
  await initQueue()
  const user = await store.ensureUser('test-user')
  const book = await store.createBook(user.id, {
    working_title: 'Test',
    bible: { focus_tags: ['tag-1', 'tag-2'], usp: 'Clarity' },
  })
  const job1 = await submitJob(store, {
    userId: user.id,
    type: 'outline_generate',
    bookId: book.id,
    inputs: {},
  })
  for (let i = 0; i < 50; i++) {
    const j = await store.getJob(user.id, job1.id)
    if (j.status === 'completed' || j.status === 'failed') {
      assert.equal(j.status, 'completed', j.error)
      break
    }
    await new Promise((r) => setTimeout(r, 50))
  }
  const b2 = await store.getBook(user.id, book.id)
  assert.ok((b2.outline?.chapters || []).length >= 1)
  assert.ok(b2.outline?.coverage?.passed)

  const node = b2.outline.chapters[0]
  const job2 = await submitJob(store, {
    userId: user.id,
    type: 'section_draft',
    bookId: book.id,
    inputs: { sectionKey: 'c0', node },
  })
  for (let i = 0; i < 80; i++) {
    const j = await store.getJob(user.id, job2.id)
    if (j.status === 'completed' || j.status === 'failed') {
      assert.equal(j.status, 'completed', j.error)
      break
    }
    await new Promise((r) => setTimeout(r, 50))
  }
  const b3 = await store.getBook(user.id, book.id)
  assert.ok(b3.sections?.c0?.content_md)
})
