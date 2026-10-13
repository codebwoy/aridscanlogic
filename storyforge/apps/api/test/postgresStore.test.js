import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createMemoryStore } from '../src/db/memoryStore.js'

/**
 * Full Postgres round-trip needs DATABASE_URL. Without it we still prove the
 * scheduleSave / initialState path used by createPostgresStore (S73).
 */
describe('Postgres-compatible memory hydrate (S73)', () => {
  it('restores snapshot via initialState + scheduleSave', async () => {
    const saves = []
    const store = createMemoryStore({
      persist: false,
      scheduleSave: (getState) => {
        saves.push(typeof getState === 'function' ? getState() : getState)
      },
    })
    const user = await store.ensureUser('pg-hydrate')
    await store.appendLedger({ userId: user.id, delta: 10, reason: 'test' })
    const project = await store.createProject(user.id, {
      title: 'Cloud Persist',
      page_count: 24,
    })
    assert.ok(saves.length >= 1)
    const snap = saves[saves.length - 1]
    assert.ok(snap.projects.some((p) => p.id === project.id))

    const restored = createMemoryStore({
      persist: false,
      initialState: snap,
    })
    const listed = await restored.listProjects(user.id)
    assert.equal(listed.length, 1)
    assert.equal(listed[0].title, 'Cloud Persist')
    // ensureUser grants trial credits; we appended +10 on top
    assert.equal(await restored.getBalance(user.id), await store.getBalance(user.id))
    assert.ok((await restored.getBalance(user.id)) >= 10)
  })

  it('createStore module exports', async () => {
    const mod = await import('../src/db/createStore.js')
    assert.equal(typeof mod.createStore, 'function')
  })
})
