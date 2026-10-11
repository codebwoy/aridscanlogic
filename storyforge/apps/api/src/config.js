import { config as loadEnv } from 'dotenv'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DESKTOP_MIN_WIDTH } from '@storyforge/shared'

const __dirname = dirname(fileURLToPath(import.meta.url))
loadEnv({ path: resolve(__dirname, '../../../.env') })
loadEnv({ path: resolve(__dirname, '../../../.env.local') })

function intEnv(name, fallback) {
  const n = Number(process.env[name])
  return Number.isFinite(n) ? n : fallback
}

const isProd = process.env.NODE_ENV === 'production'

export const config = {
  isProd,
  host: process.env.STORYFORGE_API_HOST || '127.0.0.1',
  port: intEnv('STORYFORGE_API_PORT', 8787),
  sessionSecret: process.env.STORYFORGE_SESSION_SECRET || '',
  apiSecret: process.env.STORYFORGE_API_SECRET || '',
  webOrigins: (process.env.STORYFORGE_WEB_ORIGIN || 'http://localhost:5180')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  redisUrl: process.env.REDIS_URL || '',
  databaseUrl: process.env.DATABASE_URL || '',
  imageProvider: process.env.STORYFORGE_IMAGE_PROVIDER || 'mock',
  trialCredits: intEnv('STORYFORGE_TRIAL_CREDITS', 20),
  dailyCreditCap: intEnv('STORYFORGE_DAILY_CREDIT_CAP', 500),
  desktopMinWidth: intEnv('STORYFORGE_DESKTOP_MIN_WIDTH', DESKTOP_MIN_WIDTH),
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
}

export function assertRuntimeSecrets() {
  if (isProd && (!config.sessionSecret || config.sessionSecret.length < 32)) {
    throw new Error('STORYFORGE_SESSION_SECRET (≥32 chars) is required in production')
  }
  if (!config.sessionSecret) {
    // Dev fallback — never use in production
    config.sessionSecret = 'dev-only-storyforge-session-secret-do-not-use-in-prod'
    console.warn('[storyforge-api] Using insecure dev session secret. Set STORYFORGE_SESSION_SECRET.')
  }
}
