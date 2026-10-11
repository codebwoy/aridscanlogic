import { api } from './api.js'

/** Submit a job and poll until completed/failed. */
export async function runAndWait(type, { projectId, inputs = {}, onTick } = {}) {
  const res = await api('/v1/jobs', {
    method: 'POST',
    body: { type, projectId, inputs },
  })
  let job = res.job
  for (let i = 0; i < 40; i++) {
    if (job.status === 'completed' || job.status === 'failed') break
    await new Promise((r) => setTimeout(r, 200))
    const next = await api(`/v1/jobs/${job.id}`)
    job = next.job
    onTick?.(job)
  }
  return { ...res, job, balance: res.balance }
}
