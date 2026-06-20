import { saveSessionUser } from './store'
import { getEffectivePlan } from './limits'
import { getPlan, PLAN_IDS } from './plans'

const ACCOUNTS_KEY = 'scanvault_accounts'

function loadAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveAccounts(users) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(users))
}

function persistUserPlan(user) {
  if (!user?.email) return
  const accounts = loadAccounts()
  const idx = accounts.findIndex((a) => a.email === user.email)
  if (idx >= 0) {
    accounts[idx] = {
      ...accounts[idx],
      plan: user.plan,
      trialEndsAt: user.trialEndsAt,
      subscriptionExpiresAt: user.subscriptionExpiresAt,
    }
    saveAccounts(accounts)
  }
}

function applyPlan(user, planId, { trial = false, subscriptionYears = 1 } = {}) {
  if (!PLAN_IDS.includes(planId)) throw new Error('Invalid plan')

  const next = { ...user, plan: planId, trialEndsAt: null, subscriptionExpiresAt: null }

  if (planId === 'free') {
    saveSessionUser(next)
    persistUserPlan(next)
    return next
  }

  if (trial) {
    const trialEnds = new Date()
    trialEnds.setDate(trialEnds.getDate() + getPlan(planId).trialDays)
    next.trialEndsAt = trialEnds.toISOString()
  } else {
    const expires = new Date()
    expires.setFullYear(expires.getFullYear() + subscriptionYears)
    next.subscriptionExpiresAt = expires.toISOString()
  }

  saveSessionUser(next)
  persistUserPlan(next)
  return next
}

export function startPlanTrial(user, planId) {
  if (planId === 'free') return applyPlan(user, 'free')
  return applyPlan(user, planId, { trial: true })
}

export function subscribeToPlan(user, planId) {
  if (planId === 'free') return applyPlan(user, 'free')
  return applyPlan(user, planId, { trial: false, subscriptionYears: 1 })
}

export function setFreePlan(user) {
  return applyPlan(user, 'free')
}

/** Restore plan from registered account record (demo — no App Store). */
export function restorePurchases(user) {
  if (!user?.email) return null
  const account = loadAccounts().find((a) => a.email === user.email)
  if (!account?.plan || account.plan === 'free') return null

  const restored = {
    ...user,
    plan: account.plan,
    trialEndsAt: account.trialEndsAt || null,
    subscriptionExpiresAt: account.subscriptionExpiresAt || null,
  }

  if (getEffectivePlan(restored) === 'free') return null

  saveSessionUser(restored)
  return restored
}

/** @deprecated use startPlanTrial(user, 'plus') */
export function startPremiumTrial(user) {
  return startPlanTrial(user, 'plus')
}
