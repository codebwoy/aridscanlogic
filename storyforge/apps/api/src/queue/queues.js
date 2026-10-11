import { config } from '../config.js'

/**
 * Job queue abstraction:
 * - With REDIS_URL: BullMQ
 * - Without: in-process async runner (dev only)
 */

let Queue
let Worker
let connection = null
let useRedis = false

export async function initQueue() {
  if (!config.redisUrl) {
    useRedis = false
    console.info('[storyforge-api] REDIS_URL unset — using in-process job runner')
    return { useRedis: false }
  }
  try {
    const bull = await import('bullmq')
    const IORedis = (await import('ioredis')).default
    Queue = bull.Queue
    Worker = bull.Worker
    connection = new IORedis(config.redisUrl, { maxRetriesPerRequest: null })
    useRedis = true
    console.info('[storyforge-api] BullMQ connected')
    return { useRedis: true, Queue, Worker, connection }
  } catch (err) {
    console.warn('[storyforge-api] Redis/BullMQ unavailable, falling back to in-process:', err.message)
    useRedis = false
    return { useRedis: false }
  }
}

const localHandlers = new Map()
const generationQueueName = 'storyforge-generation'
const exportQueueName = 'storyforge-export'

export function registerLocalHandler(queueName, handler) {
  localHandlers.set(queueName, handler)
}

export async function enqueue(queueName, jobName, data, opts = {}) {
  if (useRedis && Queue && connection) {
    const q = new Queue(queueName, { connection })
    const job = await q.add(jobName, data, {
      removeOnComplete: 100,
      removeOnFail: 200,
      attempts: opts.attempts ?? 2,
      backoff: { type: 'exponential', delay: 2000 },
    })
    await q.close()
    return { id: job.id, mode: 'redis' }
  }
  const handler = localHandlers.get(queueName)
  if (!handler) throw new Error(`No local handler for queue ${queueName}`)
  // Fire-and-forget; handler updates store
  setImmediate(() => {
    handler({ name: jobName, data }).catch((e) => console.error('[storyforge-job]', e))
  })
  return { id: data.jobId, mode: 'local' }
}

export { generationQueueName, exportQueueName }
