import { createLlmProvider } from '@proofforge/llm'
import { runManuscriptAnalysis } from '@proofforge/agents'
import { creditCost, estimateProofreadCredits } from '@proofforge/shared'
import { config } from '../config.js'

/**
 * @param {ReturnType<import('../db/memoryStore.js').createMemoryStore>} store
 */
export function createJobRunner(store) {
  let llm = null

  function getLlm() {
    if (!llm) {
      llm = createLlmProvider({
        provider: config.llmProvider,
        anthropicApiKey: config.anthropicApiKey,
      })
    }
    return llm
  }

  async function runAnalysisJob(jobId) {
    const job = store.getJob(jobId)
    if (!job) return
    const project = store.getProject(job.project_id)
    if (!project) {
      store.updateJob(jobId, { status: 'failed', error: 'Project not found' })
      return
    }

    const sectionCount = Object.keys(project.sections || {}).length
    const estimate = estimateProofreadCredits(sectionCount)
    // Personal studio: never gate or bill

    store.updateJob(jobId, { status: 'running', progress: { phase: 'start', done: 0, total: 1 } })

    try {
      const result = await runManuscriptAnalysis(getLlm(), project, {
        onProgress: (p) => store.updateJob(jobId, { progress: p }),
      })
      store.setAnalysisResult(project.id, result)
      store.updateJob(jobId, {
        status: 'completed',
        result: {
          findings_count: result.findings.length,
          scores: result.scores,
          usage: result.usage,
          estimate,
        },
        progress: { phase: 'done', done: 1, total: 1 },
      })
    } catch (err) {
      store.updateJob(jobId, {
        status: 'failed',
        error: err.message || 'Analysis failed',
      })
    }
  }

  return {
    estimateProofreadCredits,
    creditCost,
    async enqueueAnalysis(ownerId, projectId) {
      const job = store.createJob({
        type: 'manuscript_analysis',
        owner_id: ownerId,
        project_id: projectId,
      })
      setImmediate(() => {
        runAnalysisJob(job.id).catch((err) => {
          console.error('[proofforge-jobs]', err)
        })
      })
      return job
    },
    runAnalysisJob,
  }
}
