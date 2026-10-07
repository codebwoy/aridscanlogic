import {
  emptyListingSession,
  emptyProductData,
  emptyListingCopy,
  emptyLegalModules,
  emptyComplianceReport,
  emptyQualityScore,
  emptyEconomicsFields,
  emptyEbayPublishSettings,
  normalizeProductData,
  normalizeListingCopy,
  normalizeCompliance,
  normalizeScore,
} from './schema'
import { normalizeEconomics } from './profit'

const SESSION_KEY = 'scanlogic_listingengine_session'
const DAILY_USAGE_KEY = 'scanlogic_listingengine_daily_usage'
export const DAILY_GENERATION_CAP = 25

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

export function loadListingSession() {
  const raw = readJson(SESSION_KEY, null)
  if (!raw || typeof raw !== 'object') return emptyListingSession()
  return {
    ...emptyListingSession(),
    ...raw,
    product: normalizeProductData(raw.product || {}),
    listing: normalizeListingCopy(raw.listing || {}),
    legal: { ...emptyLegalModules(), ...(raw.legal || {}) },
    compliance: normalizeCompliance(raw.compliance || {}),
    score: normalizeScore(raw.score || {}),
    economics: normalizeEconomics({
      ...emptyEconomicsFields(),
      ...(raw.economics || {}),
      // Migrate wholesale_cost into product_cost if economics empty
      product_cost:
        raw.economics?.product_cost ||
        raw.product?.wholesale_cost ||
        emptyEconomicsFields().product_cost,
    }),
    image_checklist:
      raw.image_checklist && typeof raw.image_checklist === 'object'
        ? { ...raw.image_checklist }
        : {},
    ebay_settings: {
      ...emptyEbayPublishSettings(),
      ...(raw.ebay_settings || {}),
    },
  }
}

export function saveListingSession(patch) {
  const current = loadListingSession()
  const next = {
    ...current,
    ...patch,
    product: patch.product
      ? normalizeProductData({ ...current.product, ...patch.product })
      : current.product,
    listing: patch.listing
      ? normalizeListingCopy({ ...current.listing, ...patch.listing })
      : current.listing,
    legal: patch.legal ? { ...current.legal, ...patch.legal } : current.legal,
    compliance: patch.compliance
      ? normalizeCompliance(patch.compliance)
      : current.compliance,
    score: patch.score ? normalizeScore(patch.score) : current.score,
    economics: patch.economics
      ? normalizeEconomics({ ...current.economics, ...patch.economics })
      : current.economics,
    image_checklist: patch.image_checklist
      ? { ...(current.image_checklist || {}), ...patch.image_checklist }
      : current.image_checklist || {},
    ebay_settings: patch.ebay_settings
      ? {
          ...emptyEbayPublishSettings(),
          ...current.ebay_settings,
          ...patch.ebay_settings,
        }
      : current.ebay_settings,
    updated_at: new Date().toISOString(),
  }
  writeJson(SESSION_KEY, next)
  return next
}

export function deleteListingData() {
  localStorage.removeItem(SESSION_KEY)
  return emptyListingSession()
}

export function resetListingSessionKeepPrivacy() {
  const prev = loadListingSession()
  const next = {
    ...emptyListingSession(),
    privacy_acknowledged: !!prev.privacy_acknowledged,
    legal: prev.legal?.impressum || prev.legal?.widerrufsbelehrung ? prev.legal : emptyLegalModules(),
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

export function emptyDraftProduct() {
  return emptyProductData()
}

export function emptyDraftListing() {
  return emptyListingCopy()
}

export function emptyDraftCompliance() {
  return emptyComplianceReport()
}

export function emptyDraftScore() {
  return emptyQualityScore()
}
