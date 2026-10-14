import { config as loadEnv } from 'dotenv'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DESKTOP_MIN_WIDTH } from '@novelforge/shared'

const __dirname = dirname(fileURLToPath(import.meta.url))
loadEnv({ path: resolve(__dirname, '../../../.env') })
loadEnv({ path: resolve(__dirname, '../../../.env.local') })

function intEnv(name, fallback) {
  const n = Number(process.env[name])
  return Number.isFinite(n) ? n : fallback
}

const isProd = process.env.NODE_ENV === 'production'

/** Fly/Railway set PORT; prefer NOVELFORGE_API_PORT, then PORT, then 8789 */
function resolvePort() {
  return intEnv('NOVELFORGE_API_PORT', intEnv('PORT', 8789))
}

/** In production listen on all interfaces unless explicitly overridden */
function resolveHost() {
  if (process.env.NOVELFORGE_API_HOST) return process.env.NOVELFORGE_API_HOST
  return isProd ? '0.0.0.0' : '127.0.0.1'
}

export const config = {
  isProd,
  host: resolveHost(),
  port: resolvePort(),
  sessionSecret: process.env.NOVELFORGE_SESSION_SECRET || '',
  apiSecret: process.env.NOVELFORGE_API_SECRET || '',
  /** Public hostname (e.g. novelforge.example.com) for same-origin allow without Origin header */
  publicHost: (process.env.NOVELFORGE_PUBLIC_HOST || '').trim().toLowerCase(),
  webOrigins: (
    process.env.NOVELFORGE_WEB_ORIGIN ||
    'http://localhost:5182,http://127.0.0.1:5182,http://localhost:5173,http://127.0.0.1:5173'
  )
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  serveStatic: process.env.NOVELFORGE_SERVE_STATIC !== '0',
  redisUrl: process.env.REDIS_URL || '',
  databaseUrl: process.env.DATABASE_URL || '',
  llmProvider: process.env.NOVELFORGE_LLM_PROVIDER || 'fake',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  bookBudgetEur: Number(process.env.NOVELFORGE_BOOK_BUDGET_EUR || 8),
  marketProvider: process.env.NOVELFORGE_MARKET_PROVIDER || 'mock',
  imageProvider: process.env.NOVELFORGE_IMAGE_PROVIDER || 'mock',
  originalityProvider: process.env.NOVELFORGE_ORIGINALITY_PROVIDER || 'mock',
  trialCredits: intEnv('NOVELFORGE_TRIAL_CREDITS', 200),
  dailyCreditCap: intEnv('NOVELFORGE_DAILY_CREDIT_CAP', 800),
  desktopMinWidth: intEnv('NOVELFORGE_DESKTOP_MIN_WIDTH', DESKTOP_MIN_WIDTH),
  exportTtlMs: intEnv('NOVELFORGE_EXPORT_TTL_MS', 7_200_000),
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
}

export function assertRuntimeSecrets() {
  if (isProd && (!config.sessionSecret || config.sessionSecret.length < 32)) {
    throw new Error('NOVELFORGE_SESSION_SECRET (≥32 chars) is required in production')
  }
  if (!config.sessionSecret) {
    config.sessionSecret = 'dev-only-novelforge-session-secret-do-not-use-in-prod'
    console.warn('[novelforge-api] Using insecure dev session secret. Set NOVELFORGE_SESSION_SECRET.')
  }
}
