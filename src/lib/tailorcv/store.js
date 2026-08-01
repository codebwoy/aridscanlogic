import {
  emptyTailorSession,
  emptyJobInput,
  emptyGapAnalysis,
  emptyCoverLetter,
  normalizeCandidateCv,
  normalizeJobProfile,
} from './schema'

const SESSION_KEY = 'scanlogic_tailorcv_session'
const DAILY_USAGE_KEY = 'scanlogic_tailorcv_daily_usage'
/** Soft client-side cap for generation runs (parse+tailor counts as usage). */
export const DAILY_GENERATION_CAP = 20

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function loadTailorSession() {
  const raw = readJson(SESSION_KEY, null)
  if (!raw || typeof raw !== 'object') return emptyTailorSession()
  return {
    ...emptyTailorSession(),
    ...raw,
    job_input: { ...emptyJobInput(), ...(raw.job_input || {}) },
    candidate: normalizeCandidateCv(raw.candidate || {}),
    job_profile: normalizeJobProfile(raw.job_profile || {}),
    gap_analysis: { ...emptyGapAnalysis(), ...(raw.gap_analysis || {}) },
    tailored_cv: normalizeCandidateCv(raw.tailored_cv || {}),
    cover_letter: { ...emptyCoverLetter(), ...(raw.cover_letter || {}) },
    fabrication_flags: Array.isArray(raw.fabrication_flags) ? raw.fabrication_flags : [],
  }
}

export function saveTailorSession(patch) {
  const current = loadTailorSession()
  const next = {
    ...current,
    ...patch,
    job_input: patch.job_input
      ? { ...current.job_input, ...patch.job_input }
      : current.job_input,
    updated_at: new Date().toISOString(),
  }
  if (patch.candidate) next.candidate = normalizeCandidateCv(patch.candidate)
  if (patch.tailored_cv) next.tailored_cv = normalizeCandidateCv(patch.tailored_cv)
  if (patch.job_profile) next.job_profile = normalizeJobProfile(patch.job_profile)
  writeJson(SESSION_KEY, next)
  return next
}

/** Permanent wipe of TailorCV session data (privacy). */
export function deleteTailorData() {
  localStorage.removeItem(SESSION_KEY)
  return emptyTailorSession()
}

export function resetTailorSessionKeepPrivacy() {
  const prev = loadTailorSession()
  const next = {
    ...emptyTailorSession(),
    privacy_acknowledged: !!prev.privacy_acknowledged,
    updated_at: new Date().toISOString(),
  }
  writeJson(SESSION_KEY, next)
  return next
}

export function getDailyUsage() {
  const data = readJson(DAILY_USAGE_KEY, { day: todayKey(), count: 0 })
  if (data.day !== todayKey()) return { day: todayKey(), count: 0 }
  return data
}

export function canRunGeneration() {
  return getDailyUsage().count < DAILY_GENERATION_CAP
}

export function recordGenerationUse(n = 1) {
  const cur = getDailyUsage()
  const next = { day: todayKey(), count: cur.count + n }
  writeJson(DAILY_USAGE_KEY, next)
  return next
}

export function remainingGenerations() {
  return Math.max(0, DAILY_GENERATION_CAP - getDailyUsage().count)
}

/** Clear daily counter only (dev / support). */
export function resetDailyUsage() {
  localStorage.removeItem(DAILY_USAGE_KEY)
}
