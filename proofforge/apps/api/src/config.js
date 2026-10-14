import { config as loadEnv } from 'dotenv'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DESKTOP_MIN_WIDTH } from '@proofforge/shared'

const __dirname = dirname(fileURLToPath(import.meta.url))
loadEnv({ path: resolve(__dirname, '../../../.env') })
loadEnv({ path: resolve(__dirname, '../../../.env.local') })

function intEnv(name, fallback) {
  const n = Number(process.env[name])
  return Number.isFinite(n) ? n : fallback
}

const isProd = process.env.NODE_ENV === 'production'

function resolvePort() {
  return intEnv('PROOFFORGE_API_PORT', intEnv('PORT', 8790))
}

function resolveHost() {
  if (process.env.PROOFFORGE_API_HOST) return process.env.PROOFFORGE_API_HOST
  return isProd ? '0.0.0.0' : '127.0.0.1'
}

export const config = {
  isProd,
  host: resolveHost(),
  port: resolvePort(),
  sessionSecret: process.env.PROOFFORGE_SESSION_SECRET || '',
  apiSecret: process.env.PROOFFORGE_API_SECRET || '',
  publicHost: (process.env.PROOFFORGE_PUBLIC_HOST || '').trim().toLowerCase(),
  webOrigins: (
    process.env.PROOFFORGE_WEB_ORIGIN ||
    'http://localhost:5183,http://127.0.0.1:5183,http://localhost:5173,http://127.0.0.1:5173,http://localhost:5182,http://127.0.0.1:5182'
  )
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  serveStatic: process.env.PROOFFORGE_SERVE_STATIC !== '0',
  llmProvider: String(process.env.PROOFFORGE_LLM_PROVIDER || 'fake').trim(),
  verifyProvider: String(process.env.PROOFFORGE_VERIFY_PROVIDER || '').trim(),
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  /** Soft usage counter only — personal studio does not bill or gate on credits */
  trialCredits: intEnv('PROOFFORGE_TRIAL_CREDITS', 999_999),
  desktopMinWidth: intEnv('PROOFFORGE_DESKTOP_MIN_WIDTH', DESKTOP_MIN_WIDTH),
  persist:
    process.env.PROOFFORGE_PERSIST === '1' ||
    process.env.PROOFFORGE_PERSIST === 'true' ||
    (isProd && process.env.PROOFFORGE_PERSIST !== '0'),
  dataPath: process.env.PROOFFORGE_DATA_PATH || '',
  rateLimitMax: intEnv('PROOFFORGE_RATE_LIMIT_MAX', 120),
}

export function assertRuntimeSecrets() {
  if (isProd && (!config.sessionSecret || config.sessionSecret.length < 32)) {
    throw new Error('PROOFFORGE_SESSION_SECRET (≥32 chars) is required in production')
  }
  if (!config.sessionSecret) {
    config.sessionSecret = 'dev-only-proofforge-session-secret-do-not-use-in-prod'
    console.warn('[proofforge-api] Using insecure dev session secret. Set PROOFFORGE_SESSION_SECRET.')
  }
}
