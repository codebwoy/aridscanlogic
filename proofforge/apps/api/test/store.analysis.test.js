import test from 'node:test'
import assert from 'node:assert/strict'
import { createMemoryStore } from '../src/db/memoryStore.js'
import { createJobRunner } from '../src/services/jobs.js'

test('create project, analyze with fake LLM, accept finding', async () => {
  process.env.PROOFFORGE_LLM_PROVIDER = 'fake'
  process.env.PROOFFORGE_PERSIST = '0'

  const store = createMemoryStore({ persist: false })
  const runner = createJobRunner(store)

  const project = store.createProject('local-author', {
    title: 'Demo',
    language: 'en',
    language_variety: 'us',
    manuscript_text:
      '# Chapter 1\n\nShe she walked to the market under the colour sky and smiled again and again and again and again at the crowd.',
  })
  assert.ok(Object.keys(project.sections).length >= 1)

  const job = await runner.enqueueAnalysis('local-author', project.id)
  // Wait for in-process job
  for (let i = 0; i < 50; i++) {
    const j = store.getJob(job.id)
    if (j.status === 'completed' || j.status === 'failed') break
    await new Promise((r) => setTimeout(r, 50))
  }
  const done = store.getJob(job.id)
  assert.equal(done.status, 'completed', done.error)

  const analyzed = store.getProject(project.id)
  assert.ok(analyzed.findings.length >= 1)
  assert.ok(analyzed.scores)

  const finding = analyzed.findings[0]
  const resolved = store.resolveFinding(project.id, finding.id, {
    action: finding.suggested_correction ? 'accept' : 'reject',
  })
  assert.ok(resolved.finding.resolution === 'accepted' || resolved.finding.resolution === 'rejected')
})
