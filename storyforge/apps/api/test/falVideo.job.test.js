import { describe, it, before } from 'node:test'
import assert from 'node:assert/strict'
import { createMemoryStore } from '../src/db/memoryStore.js'
import { submitJob, wireLocalJobHandlers } from '../src/services/jobs.js'
import { initQueue } from '../src/queue/queues.js'
import { lockTestIpDna } from './helpers/ipDna.js'

async function waitForJob(store, userId, jobId, tries = 60) {
  for (let i = 0; i < tries; i++) {
    const job = await store.getJob(userId, jobId)
    if (job?.status === 'completed' || job?.status === 'failed') return job
    await new Promise((r) => setTimeout(r, 25))
  }
  return store.getJob(userId, jobId)
}

describe('scene_to_video (fal / mock)', () => {
  let store
  let user
  let project

  before(async () => {
    process.env.STORYFORGE_IMAGE_PROVIDER = 'mock'
    await initQueue()
    store = createMemoryStore()
    wireLocalJobHandlers(store)
    user = await store.ensureUser('test-video')
    project = await store.createProject(user.id, { title: 'Video test', page_count: 24 })
  })

  it('rejects without pinned anchor', async () => {
    await assert.rejects(
      () =>
        submitJob(store, {
          userId: user.id,
          type: 'scene_to_video',
          projectId: project.id,
          inputs: { pageIndex: 0 },
        }),
      (err) => err.code === 'anchor_required',
    )
  })

  it('rejects pageIndex without scene art after turbo pin', async () => {
    await lockTestIpDna(store, user.id, project.id, { name: 'Luna' })
    const turbo = await submitJob(store, {
      userId: user.id,
      type: 'character_turbo',
      projectId: project.id,
      inputs: { name: 'Luna', quality: 'final' },
    })
    const turboDone = await waitForJob(store, user.id, turbo.id)
    assert.equal(turboDone.status, 'completed')

    await assert.rejects(
      () =>
        submitJob(store, {
          userId: user.id,
          type: 'scene_to_video',
          projectId: project.id,
          inputs: { pageIndex: 0 },
        }),
      (err) => err.code === 'scene_required',
    )
  })

  it('animates an Editor Pro page still (mock poster)', async () => {
    const scene = await submitJob(store, {
      userId: user.id,
      type: 'editor_pro',
      projectId: project.id,
      inputs: { brief: 'waves in a park', pageIndex: 0 },
    })
    const sceneDone = await waitForJob(store, user.id, scene.id)
    assert.equal(sceneDone.status, 'completed')

    const vid = await submitJob(store, {
      userId: user.id,
      type: 'scene_to_video',
      projectId: project.id,
      inputs: { pageIndex: 0, prompt: 'subtle wave', duration: '5' },
    })
    const vidDone = await waitForJob(store, user.id, vid.id)
    assert.equal(vidDone.status, 'completed')
    assert.equal(vidDone.outputs?.assets?.[0]?.role, 'scene_video')

    const refreshed = await store.getProject(user.id, project.id)
    assert.ok(refreshed.pages[0].video?.url)
  })
})
