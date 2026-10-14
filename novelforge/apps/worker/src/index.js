import { config as loadEnv } from 'dotenv'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
loadEnv({ path: resolve(__dirname, '../../../.env') })

const redisUrl = process.env.REDIS_URL || ''
if (!redisUrl) {
  console.info('[novelforge-worker] REDIS_URL unset — idle (API runs jobs in-process)')
  setInterval(() => {}, 60_000)
} else {
  const { Worker } = await import('bullmq')
  const connection = { url: redisUrl }
  // eslint-disable-next-line no-new
  new Worker(
    'novelforge-generation',
    async (job) => {
      console.info('[novelforge-worker] received', job.name, job.id)
      return { ok: true, stub: true, note: 'Wire to API job runners for multi-instance deploy' }
    },
    { connection }
  )
  console.info('[novelforge-worker] listening on novelforge-generation')
}
