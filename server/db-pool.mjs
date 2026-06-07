import pg from 'pg'

const { Pool } = pg

let pool = null

function resolveSslConfig() {
  const flag = (process.env.SCANLOGIC_PG_SSL_REJECT_UNAUTHORIZED ?? 'true').toLowerCase()
  if (flag === 'false' || flag === '0') {
    return { rejectUnauthorized: false }
  }
  return { rejectUnauthorized: true }
}

export function getPool(connectionString) {
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: resolveSslConfig(),
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
