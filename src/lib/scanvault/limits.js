import { listDocuments, listFolders } from './store'
import { getPlan, PLANS } from './plans'

function normalizePlanId(plan) {
  if (!plan || plan === 'free') return 'free'
  if (plan === 'premium') return 'plus'
  return PLANS[plan] ? plan : 'free'
}

/** Active plan tier after trial/subscription expiry checks. */
export function getEffectivePlan(user) {
  if (!user) return 'free'
  const planId = normalizePlanId(user.plan)

  if (planId === 'free') return 'free'

  const now = new Date()
  if (user.trialEndsAt && new Date(user.trialEndsAt) > now) return planId
  if (user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > now) return planId

  return 'free'
}

export function getUserPlanLimits(user) {
  return getPlan(getEffectivePlan(user)).limits
}

export function isPremiumUser(user) {
  const plan = getEffectivePlan(user)
  return plan === 'pro' || plan === 'plus'
}

export function isPlusUser(user) {
  return getEffectivePlan(user) === 'plus'
}

export function isProUser(user) {
  return getEffectivePlan(user) === 'pro'
}

function limitMessage(feature, planName = 'Pro') {
  return `Upgrade to ${planName} or Plus to unlock ${feature}.`
}

export function canAddScan(user) {
  const limits = getUserPlanLimits(user)
  if (limits.scans === Infinity) return { ok: true }
  if (listDocuments().length >= limits.scans) {
    return {
      ok: false,
      reason: 'scan_limit',
      message: `Free plan allows ${limits.scans} scans. Upgrade for more.`,
    }
  }
  return { ok: true }
}

export function canAddPage(user, currentPageCount) {
  const limits = getUserPlanLimits(user)
  if (limits.pagesPerDoc === Infinity) return { ok: true }
  if (currentPageCount >= limits.pagesPerDoc) {
    return {
      ok: false,
      reason: 'page_limit',
      message: limitMessage('multi-page scanning', 'Pro'),
    }
  }
  return { ok: true }
}

export function canCreateFolder(user) {
  const plan = getEffectivePlan(user)
  const limits = getPlan(plan).limits
  if (limits.folders === Infinity) return { ok: true }
  const custom = listFolders().filter((f) => !f.isDefault)
  if (custom.length >= limits.folders) {
    return {
      ok: false,
      reason: 'folder_limit',
      message: limitMessage('more folders', 'Pro'),
    }
  }
  return { ok: true }
}

export function hasWatermark(user) {
  return getPlan(getEffectivePlan(user)).capabilities.watermark
}

export function canBatchExport(user) {
  return getPlan(getEffectivePlan(user)).capabilities.batchExport
}

export function canCloudSync(user) {
  return getPlan(getEffectivePlan(user)).capabilities.cloudSync
}
