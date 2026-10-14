import { config } from '../config.js'

const localHandlers = new Map()

export function registerLocalHandler(name, fn) {
  localHandlers.set(name, fn)
}

export async function initQueue() {
  if (config.redisUrl) {
    console.info('[novelforge-api] REDIS_URL set — BullMQ available (local handlers still used in MVP)')
  } else {
    console.info('[novelforge-api] in-process job queue')
  }
}

export async function enqueue(name, data) {
  const handler = localHandlers.get(name)
  if (!handler) throw new Error(`No handler for ${name}`)
  setImmediate(() => {
    handler(data).catch((err) => {
      console.error('[novelforge-api] job failed', name, err)
    })
  })
  return { queued: true, mode: 'local' }
}
