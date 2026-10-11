import { describe, it, before } from 'node:test'
import assert from 'node:assert/strict'
import { createMemoryStore } from '../src/db/memoryStore.js'
import { submitJob, wireLocalJobHandlers } from '../src/services/jobs.js'
import { initQueue } from '../src/queue/queues.js'
import { lockTestIpDna } from './helpers/ipDna.js'
import { buildEscalatingBeatBriefs } from '@storyforge/shared'

async function waitForJob(store, userId, jobId, tries = 60) {
  for (let i = 0; i < tries; i++) {
    const job = await store.getJob(userId, jobId)
    if (job?.status === 'completed' || job?.status === 'failed') return job
    await new Promise((r) => setTimeout(r, 25))
  }
  return store.getJob(userId, jobId)
}

describe('merch PNG + beat seed + series DNA', () => {
  let store
  let user
  let project

  before(async () => {
    process.env.STORYFORGE_IMAGE_PROVIDER = 'mock'
    await initQueue()
    store = createMemoryStore({ persist: false })
    wireLocalJobHandlers(store)
    user = await store.ensureUser('merch-complete-test')
    project = await store.createProject(user.id, {
      title: 'Kofi Book 1',
      page_count: 24,
      emotional_core: 'belonging',
      refrain: 'I belong with you',
    })
  })

  it('seeds escalating beats into empty pages', async () => {
    const beats = buildEscalatingBeatBriefs({
      pageCount: project.page_count,
      characterName: 'Kofi',
      emotionalCore: 'belonging',
      signatureObject: 'drum',
      refrain: 'I belong with you',
    })
    const seeded = await store.seedPageBeats(user.id, project.id, beats)
    assert.ok(seeded.pages[0].illustration_brief)
    assert.match(seeded.pages[0].illustration_brief, /Beat 1/)
  })

  it('exports Merch PNG after pinned turbo anchor', async () => {
    await lockTestIpDna(store, user.id, project.id, {
      name: 'Kofi',
      seriesId: 'kofi-adventures',
      signatureObject: 'drum',
    })
    const turbo = await submitJob(store, {
      userId: user.id,
      type: 'character_turbo',
      projectId: project.id,
      inputs: {},
    })
    const turboDone = await waitForJob(store, user.id, turbo.id)
    assert.equal(turboDone.status, 'completed', turboDone.error)

    const merch = await submitJob(store, {
      userId: user.id,
      type: 'export_merch_png',
      projectId: project.id,
      inputs: { background: 'transparent' },
    })
    const merchDone = await waitForJob(store, user.id, merch.id)
    assert.equal(merchDone.status, 'completed', merchDone.error)
    assert.ok(merchDone.outputs?.png?.downloadPath || merchDone.outputs?.png?.dataUrl)
    assert.equal(merchDone.outputs?.png?.width, 4500)
    assert.equal(merchDone.outputs?.png?.height, 5400)

    const heroes = await store.listSeriesIpDna(user.id, 'kofi-adventures')
    assert.ok(heroes.some((h) => h.ip_character?.name === 'Kofi'))
  })
})
