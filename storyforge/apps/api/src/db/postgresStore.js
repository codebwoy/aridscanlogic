import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import { createMemoryStore } from './memoryStore.js'

const { Pool } = pg

async function ensureSchema(pool) {
  const schemaPath = join(dirname(fileURLToPath(import.meta.url)), 'schema.sql')
  const sql = readFileSync(schemaPath, 'utf8')
  await pool.query(sql)
}

async function loadSnapshot(pool) {
  const { rows } = await pool.query(`SELECT value FROM sf_kv WHERE key = 'storyforge_state'`)
  if (!rows[0]?.value) return null
  return rows[0].value
}

async function saveSnapshot(pool, state) {
  await pool.query(
    `INSERT INTO sf_kv(key, value, updated_at)
     VALUES ('storyforge_state', $1::jsonb, NOW())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    [JSON.stringify(state)],
  )

  for (const u of state.users || []) {
    await pool.query(
      `INSERT INTO sf_users(id, external_ref, email, locale, guardian_affirmed, created_at)
       VALUES ($1::uuid, $2, $3, $4, $5, COALESCE($6::timestamptz, NOW()))
       ON CONFLICT (id) DO UPDATE SET
         external_ref = EXCLUDED.external_ref,
         email = EXCLUDED.email,
         locale = EXCLUDED.locale,
         guardian_affirmed = EXCLUDED.guardian_affirmed`,
      [
        u.id,
        u.external_ref || u.id,
        u.email || null,
        u.locale || 'de',
        Boolean(u.guardianAffirmed || u.guardian_affirmed),
        u.created_at,
      ],
    )
  }

  for (const p of state.projects || []) {
    await pool.query(
      `INSERT INTO sf_projects(id, user_id, data, updated_at, created_at)
       VALUES ($1::uuid, $2::uuid, $3::jsonb, $4::timestamptz, COALESCE($5::timestamptz, NOW()))
       ON CONFLICT (id) DO UPDATE SET
         data = EXCLUDED.data,
         user_id = EXCLUDED.user_id,
         updated_at = EXCLUDED.updated_at`,
      [
        p.id,
        p.user_id,
        JSON.stringify(p),
        p.updated_at || new Date().toISOString(),
        p.created_at,
      ],
    )
  }
}

/**
 * Cloud-backed store: same API as memoryStore, snapshot + project rows in Postgres.
 * Enabled when DATABASE_URL is set (createStore).
 */
export async function createPostgresStore(databaseUrl) {
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.PGSSL === '0' ? false : { rejectUnauthorized: false },
    max: 5,
  })
  await ensureSchema(pool)
  const initialState = await loadSnapshot(pool)
  let timer = null
  let pendingState = null

  function scheduleSave(getStateOrState) {
    const state = typeof getStateOrState === 'function' ? getStateOrState() : getStateOrState
    pendingState = state
    if (timer) return
    timer = setTimeout(async () => {
      timer = null
      const snap = pendingState
      pendingState = null
      if (!snap) return
      try {
        await saveSnapshot(pool, snap)
      } catch (err) {
        console.warn('[storyforge] postgres persist failed:', err.message)
      }
    }, 500)
  }

  const store = createMemoryStore({
    persist: false,
    initialState: initialState || undefined,
    scheduleSave,
  })

  store.persistPath = null
  store.persistence = {
    driver: 'postgres',
    ready: true,
    async health() {
      const r = await pool.query('SELECT 1 AS ok')
      return { ok: r.rows[0]?.ok === 1, driver: 'postgres' }
    },
    async flush() {
      if (pendingState) {
        const snap = pendingState
        pendingState = null
        await saveSnapshot(pool, snap)
      }
    },
    async close() {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      if (pendingState) {
        try {
          await saveSnapshot(pool, pendingState)
        } catch {
          /* ignore on shutdown */
        }
        pendingState = null
      }
      await pool.end()
    },
  }

  console.info(
    `[storyforge] postgres store ready${initialState ? ' (restored snapshot)' : ' (empty)'}`,
  )
  return store
}
