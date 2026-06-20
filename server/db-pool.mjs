import pg from 'pg'

const { Pool } = pg

let pool = null

function resolveSslConfig(connectionString = '') {
  const flag = process.env.SCANLOGIC_PG_SSL_REJECT_UNAUTHORIZED
  if (flag !== undefined && flag !== '') {
    const relaxed = String(flag).toLowerCase() === 'false' || flag === '0'
    return { rejectUnauthorized: !relaxed }
  }
  // Supabase direct/pooler endpoints use cert chains that fail strict Node verify by default.
  if (/supabase\.co/i.test(connectionString)) {
    return { rejectUnauthorized: false }
  }
  return { rejectUnauthorized: true }
}

export function getPool(connectionString) {
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: resolveSslConfig(connectionString),
      max: 5,
      idleTimeoutMillis: 30_000,
    })
  }
  return pool
}

export async function closePool() {
  if (pool) {
    await pool.end()
    pool = null
  }
}
