/** GKV/PKV contribution estimates — informational only, not legal or insurance advice */

import { round2 } from '@/lib/taxCalculations'

/** Monthly KV assessment base bounds (2025 approx., self-employed) */
export const GKV_MIN_ASSESSMENT_MONTHLY = 1342.5
export const GKV_MAX_ASSESSMENT_MONTHLY = 5512.5

/** Statutory health insurance base rate + average Zusatzbeitrag */
export const GKV_BASE_RATE = 0.146
export const GKV_DEFAULT_ZUSATZ = 1.7
/** Long-term care — self-employed pay full share (childless surcharge included approx.) */
export const GKV_PFLEGE_RATE = 0.034

export const HEALTH_INSURANCE_TYPES = [
  { id: 'gkv', labelDe: 'Gesetzliche Krankenkasse (GKV)', labelEn: 'Statutory health insurance (GKV)' },
  { id: 'pkv', labelDe: 'Private Krankenversicherung (PKV)', labelEn: 'Private health insurance (PKV)' },
  { id: 'family', labelDe: 'Familienversicherung', labelEn: 'Family insurance (via spouse/parent)' },
  { id: 'pending', labelDe: 'Noch nicht geklärt', labelEn: 'Not decided yet' },
]

export const POPULAR_GKV = [
  'AOK',
  'Techniker Krankenkasse (TK)',
  'Barmer',
  'DAK-Gesundheit',
  'IKK classic',
  'hkk',
  'SBK',
  'HEK',
  'KKH',
]

/** Common PKV providers for founders — compare tariffs individually */
export const POPULAR_PKV = [
  'Debeka',
  'Allianz Private Krankenversicherung',
  'AXA',
  'DKV',
  'HanseMerkur',
  'Signal Iduna',
  'Barmenia',
  'HUK-COBURG',
  'Continentale',
  'LVM',
  'R+V',
  'Universa',
]

/** PKV monthly ballpark by age bracket (EUR) — highly individual */
const PKV_BY_AGE = [
  { maxAge: 29, min: 380, mid: 520, max: 720 },
  { maxAge: 39, min: 450, mid: 620, max: 880 },
  { maxAge: 49, min: 550, mid: 780, max: 1100 },
  { maxAge: 59, min: 680, mid: 950, max: 1350 },
  { maxAge: 120, min: 850, mid: 1200, max: 1800 },
]

/** Mandatory GKV Pflege minimum top-up when on PKV (approx.) */
export const PKV_GKV_PFLEGE_MIN = 180

/** Days after business start to register with Krankenkasse (typical guidance) */
export const KRANKENKASSE_REGISTER_DAYS = 14

/**
 * Due date for Krankenkasse self-employment registration.
 * Uses businessStartDate + 14 days, or today + 30 days if no start date set.
 */
export function krankenkasseRegistrationDueDate(formData = {}) {
  const fallback = new Date()
  fallback.setDate(fallback.getDate() + 30)
  if (!formData.businessStartDate) {
    return fallback.toISOString().slice(0, 10)
  }
  const start = new Date(formData.businessStartDate)
  if (Number.isNaN(start.getTime())) return fallback.toISOString().slice(0, 10)
  start.setDate(start.getDate() + KRANKENKASSE_REGISTER_DAYS)
  return start.toISOString().slice(0, 10)
}

export function shouldShowKrankenkasseDeadline(formData = {}) {
  const status = formData.healthInsuranceStatus
  return status !== 'confirmed' && status !== 'submitted'
}

export function clampAssessmentBase(monthlyIncome) {
  return Math.min(GKV_MAX_ASSESSMENT_MONTHLY, Math.max(GKV_MIN_ASSESSMENT_MONTHLY, monthlyIncome))
}

/**
 * Estimate monthly GKV + Pflege for self-employed based on annual profit.
 */
export function estimateGkvMonthly({
  annualProfit = 0,
  zusatzbeitragPct = GKV_DEFAULT_ZUSATZ,
} = {}) {
  const monthlyIncome = Math.max(0, annualProfit) / 12
  const base = clampAssessmentBase(monthlyIncome)
  const health = base * (GKV_BASE_RATE + zusatzbeitragPct / 100)
  const pflege = base * GKV_PFLEGE_RATE
  const total = round2(health + pflege)
  return {
    monthlyAssessmentBase: round2(base),
    healthPortion: round2(health),
    pflegePortion: round2(pflege),
    monthlyTotal: total,
    annualTotal: round2(total * 12),
    zusatzbeitragPct,
  }
}

/**
 * PKV ballpark — depends on age, health, coverage; use mid estimate.
 */
export function estimatePkvMonthly({ age = 35 } = {}) {
  const bracket = PKV_BY_AGE.find((b) => age <= b.maxAge) || PKV_BY_AGE[PKV_BY_AGE.length - 1]
  const pkvPremium = bracket.mid
  const pflegeTopUp = PKV_GKV_PFLEGE_MIN
  return {
    pkvPremium,
    pflegeTopUp,
    monthlyTotal: round2(pkvPremium + pflegeTopUp),
    annualTotal: round2((pkvPremium + pflegeTopUp) * 12),
    rangeMin: round2(bracket.min + PKV_GKV_PFLEGE_MIN),
    rangeMax: round2(bracket.max + PKV_GKV_PFLEGE_MIN),
    age,
  }
}

export function estimateHealthInsuranceMonthly(config = {}) {
  const type = config.healthInsuranceType || 'gkv'
  const profit = config.expectedProfitYear1 ?? config.annualProfit ?? 0

  if (type === 'gkv') {
    return {
      type: 'gkv',
      ...estimateGkvMonthly({
        annualProfit: profit,
        zusatzbeitragPct: config.zusatzbeitragPct ?? GKV_DEFAULT_ZUSATZ,
      }),
    }
  }

  if (type === 'pkv') {
    return {
      type: 'pkv',
      ...estimatePkvMonthly({ age: config.healthInsuranceAge ?? 35 }),
    }
  }

  return { type, monthlyTotal: 0, annualTotal: 0 }
}

export const KRANKENKASSE_DISCLAIMER_DE =
  'Schätzwerte zur Orientierung — keine Rechts-, Steuer- oder Versicherungsberatung. Beiträge hängen von Krankenkasse, Alter, Familienstand und Einkommen ab. Konsultieren Sie Ihre Krankenkasse oder einen Versicherungsberater.'

export const KRANKENKASSE_DISCLAIMER_EN =
  'Estimates for guidance only — not legal, tax, or insurance advice. Actual premiums depend on insurer, age, family status, and income. Consult your Krankenkasse or a licensed advisor.'
