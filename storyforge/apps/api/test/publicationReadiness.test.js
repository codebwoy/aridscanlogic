import { describe, it, before } from 'node:test'
import assert from 'node:assert/strict'
import { createMemoryStore } from '../src/db/memoryStore.js'
import { submitJob, wireLocalJobHandlers } from '../src/services/jobs.js'
import { initQueue } from '../src/queue/queues.js'
import {
  CONTINUITY_SIGNOFF_ITEMS,
  emptyPublicationSignoff,
  requiredBleedPixels,
} from '@storyforge/shared'

async function waitJob(store, userId, jobId, tries = 60) {
  for (let i = 0; i < tries; i++) {
    const job = await store.getJob(userId, jobId)
    if (job?.status === 'completed' || job?.status === 'failed') return job
    await new Promise((r) => setTimeout(r, 25))
  }
  return store.getJob(userId, jobId)
}

describe('publication_readiness job', () => {
  let store
  let user

  before(async () => {
    process.env.STORYFORGE_IMAGE_PROVIDER = 'mock'
    await initQueue()
    store = createMemoryStore({ persist: false })
    wireLocalJobHandlers(store)
    user = await store.ensureUser('readiness-test')
  })

  it('scores a project and persists sign-off', async () => {
    const req = requiredBleedPixels('sq_85')
    const project = await store.createProject(user.id, {
      title: 'Ready Book',
      page_count: 24,
      trim_id: 'sq_85',
    })
    await store.updateProject(user.id, project.id, {
      ip_character: { locked_at: new Date().toISOString(), name: 'Luna' },
    })
    await store.pinAnchor(user.id, project.id, {
      heroUrl: 'data:image/svg+xml,<svg/>',
      name: 'Luna',
    })
    for (let i = 0; i < 24; i++) {
      await store.setPage(user.id, project.id, i, {
        text_content: `Page ${i + 1} Luna is brave.`,
        asset: {
          url: `data:image/svg+xml,p${i}`,
          width: req.widthPx,
          height: req.heightPx,
        },
        consistencyBadge: 'pass',
      })
    }
    const signoff = emptyPublicationSignoff()
    for (const item of CONTINUITY_SIGNOFF_ITEMS) signoff.continuity[item.id] = true
    signoff.kdp_previewer_reviewed = true

    const submitted = await submitJob(store, {
      userId: user.id,
      type: 'publication_readiness',
      projectId: project.id,
      inputs: { publication_signoff: signoff },
    })
    const job = await waitJob(store, user.id, submitted.id)
    assert.equal(job.status, 'completed', job?.error || 'expected completed')
    assert.ok(job.outputs?.readiness?.score >= 90, `score ${job.outputs?.readiness?.score}`)
    assert.equal(job.outputs.readiness.publishClaimAllowed, false)

    const fresh = await store.getProject(user.id, project.id)
    assert.equal(fresh.publication_signoff?.kdp_previewer_reviewed, true)
    assert.ok(fresh.meta?.last_readiness?.score >= 90)
  })
})
