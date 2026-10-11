/**
 * StoryForge worker — consumes BullMQ jobs when REDIS_URL is set.
 * In local/dev without Redis, the API runs jobs in-process; this process idles.
 */
import { config as loadEnv } from 'dotenv'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PUBLISHING_SPECS } from '@storyforge/shared'

const __dirname = dirname(fileURLToPath(import.meta.url))
loadEnv({ path: resolve(__dirname, '../../../.env') })

const redisUrl = process.env.REDIS_URL || ''

console.info('[storyforge-worker] starting')
console.info(`[storyforge-worker] specs last verified: ${PUBLISHING_SPECS.lastVerified}`)

if (!redisUrl) {
  console.info('[storyforge-worker] REDIS_URL unset — idle (API uses in-process runner)')
  setInterval(() => {}, 60_000)
} else {
  const { Worker } = await import('bullmq')
  const IORedis = (await import('ioredis')).default
  const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null })

  const logWorker = (name) =>
    new Worker(
      name,
      async (job) => {
        console.info(`[storyforge-worker] ${name} job=${job.id} name=${job.name}`)
        // Heavy PDF/X + image work lands here in Phase 1+.
        // API currently completes mock generations; this worker is the Redis path.
        return { ok: true, stub: true }
      },
      { connection }
    )

  const gen = logWorker('storyforge-generation')
  const exp = logWorker('storyforge-export')
  for (const w of [gen, exp]) {
    w.on('failed', (job, err) => console.error('[storyforge-worker] failed', job?.id, err.message))
  }
  console.info('[storyforge-worker] listening on generation + export queues')
}
