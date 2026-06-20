import { SUITE_PLAN_IDS, getSuitePlan } from './plans'

const STORAGE_KEY = 'scanlogic_suite_subscription'
const LEGACY_TRIAL_KEY = 'scanlogic_premium_trial'

function loadRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  if (localStorage.getItem(LEGACY_TRIAL_KEY) === 'active') {
    const migrated = {
      plan: 'pro',
      trialEndsAt: new Date(Date.now() + 14 * 86400000).toISOString(),
      subscriptionExpiresAt: null,
      billing: 'yearly',
    }
    saveRaw(migrated)
    localStorage.removeItem(LEGACY_TRIAL_KEY)
    return migrated
  }
  return { plan: 'free', trialEndsAt: null, subscriptionExpiresAt: null, billing: 'yearly' }
}

function saveRaw(sub) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sub))
}

export function loadSuiteSubscription() {
  return loadRaw()
}

/** Active plan after trial / subscription expiry. */
export function getEffectiveSuitePlan() {
  const sub = loadRaw()
  const planId = SUITE_PLAN_IDS.includes(sub.plan) ? sub.plan : 'free'
  if (planId === 'free') return 'free'

  const now = new Date()
  if (sub.trialEndsAt && new Date(sub.trialEndsAt) > now) return planId
  if (sub.subscriptionExpiresAt && new Date(sub.subscriptionExpiresAt) > now) return planId
  return 'free'
}

export function isSuitePremium() {
  const plan = getEffectiveSuitePlan()
  return plan === 'pro' || plan === 'plus'
}

function applyPlan(planId, { trial = false, subscriptionYears = 1, billing = 'yearly' } = {}) {
  if (!SUITE_PLAN_IDS.includes(planId)) throw new Error('Invalid plan')

  if (planId === 'free') {
    const next = { plan: 'free', trialEndsAt: null, subscriptionExpiresAt: null, billing }
    saveRaw(next)
    return next
  }

  const next = { plan: planId, trialEndsAt: null, subscriptionExpiresAt: null, billing }

  if (trial) {
    const trialEnds = new Date()
    trialEnds.setDate(trialEnds.getDate() + getSuitePlan(planId).trialDays)
    next.trialEndsAt = trialEnds.toISOString()
  } else {
    const expires = new Date()
    expires.setFullYear(expires.getFullYear() + subscriptionYears)
    next.subscriptionExpiresAt = expires.toISOString()
  }

  saveRaw(next)
  return next
}

export function startSuitePlanTrial(planId, billing = 'yearly') {
  if (planId === 'free') return applyPlan('free', { billing })
  return applyPlan(planId, { trial: true, billing })
}

export function subscribeToSuitePlan(planId, billing = 'yearly') {
  if (planId === 'free') return applyPlan('free', { billing })
  return applyPlan(planId, { trial: false, subscriptionYears: 1, billing })
}

export function setSuiteFreePlan() {
  return applyPlan('free')
}

export function restoreSuitePurchases() {
  const sub = loadRaw()
  if (!sub.plan || sub.plan === 'free') return null
  if (getEffectiveSuitePlan() === 'free') return null
  return sub
}
