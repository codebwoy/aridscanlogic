import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createMemoryStore } from '../src/db/memoryStore.js'

test('books flush to disk and reload for later editing', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'af-persist-'))
  const persistPath = join(dir, 'state.json')
  try {
    const store = createMemoryStore({ persist: true, persistPath })
    const user = await store.ensureUser('library-test-user')
    const book = await store.createBook(user.id, {
      working_title: 'Saved Field Notes',
      wizard_step: 'writing',
      topic: 'focus',
    })
    await store.updateBook(user.id, book.id, {
      sections: {
        c0: {
          title: 'Chapter 1',
          content_md: 'Hello persisted world with enough words.',
          word_count: 6,
          status: 'draft',
        },
      },
      outline: { chapters: [{ title: 'Chapter 1', writing_direction: 'Start', target_words: 800 }] },
    })
    assert.equal(store.flushPersist(), true)

    const raw = JSON.parse(readFileSync(persistPath, 'utf8'))
    assert.ok(raw.books.some((b) => b.id === book.id))

    const store2 = createMemoryStore({ persist: true, persistPath })
    const user2 = await store2.ensureUser('library-test-user')
    assert.equal(user2.id, user.id)
    const list = await store2.listBooks(user2.id)
    assert.equal(list.length, 1)
    assert.equal(list[0].working_title, 'Saved Field Notes')
    assert.equal(list[0].section_count, 1)
    assert.equal(list[0].word_count, 6)

    const loaded = await store2.getBook(user2.id, book.id)
    assert.equal(loaded.sections.c0.content_md.includes('persisted'), true)

    const imported = await store2.importBook(user2.id, {
      format: 'novelforge-book-backup',
      book: loaded,
    })
    assert.notEqual(imported.id, loaded.id)
    assert.equal(imported.working_title, 'Saved Field Notes')
    assert.equal(imported.sections.c0.content_md.includes('persisted'), true)
    const list2 = await store2.listBooks(user2.id)
    assert.equal(list2.length, 2)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
