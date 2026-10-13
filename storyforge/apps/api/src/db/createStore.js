import { config } from '../config.js'
import { createMemoryStore } from './memoryStore.js'
import { createPostgresStore } from './postgresStore.js'

/**
 * Prefer Postgres when DATABASE_URL is set; otherwise local memory (+ optional .data JSON).
 * SourceIds: S73.
 */
export async function createStore() {
  const url = config.databaseUrl || process.env.DATABASE_URL || ''
  if (url) {
    try {
      return await createPostgresStore(url)
    } catch (err) {
      console.warn(
        '[storyforge] DATABASE_URL set but Postgres init failed — using memory store:',
        err.message,
      )
    }
  }
  return createMemoryStore()
}
