/**
 * Investment Goal Lab — educational scenario math only.
 * Not investment, tax, or product advice. No ISINs / buy lists.
 */

export const GOALS = {
  rent: 'rent',
  property: 'property',
  business: 'business',
}

export const RISK = {
  conservative: 'conservative',
  balanced: 'balanced',
  aggressive: 'aggressive',
}

/** Illustrative expected real (inflation-adjusted) annual returns by risk band. */
export const DEFAULT_REAL_RETURN = {
  [RISK.conservative]: 0.03,
  [RISK.balanced]: 0.05,
  [RISK.aggressive]: 0.065,
}

/**
 * Sleeve weights by risk × goal (illustrative educational defaults).
 * Keys: equity | yield | liquidity — must sum to 1.
 */
const SLEEVE_TABLE = {
  [RISK.conservative]: {
    [GOALS.rent]: { equity: 0.5, yield: 0.25, liquidity: 0.25 },
    [GOALS.property]: { equity: 0.45, yield: 0.2, liquidity: 0.35 },
    [GOALS.business]: { equity: 0.4, yield: 0.2, liquidity: 0.4 },
  },
  [RISK.balanced]: {
    [GOALS.rent]: { equity: 0.65, yield: 0.2, liquidity: 0.15 },
    [GOALS.property]: { equity: 0.6, yield: 0.15, liquidity: 0.25 },
    [GOALS.business]: { equity: 0.55, yield: 0.15, liquidity: 0.3 },
  },
  [RISK.aggressive]: {
    [GOALS.rent]: { equity: 0.8, yield: 0.12, liquidity: 0.08 },
    [GOALS.property]: { equity: 0.75, yield: 0.1, liquidity: 0.15 },
    [GOALS.business]: { equity: 0.7, yield: 0.1, liquidity: 0.2 },
  },
}

/** Category cards — index families only, never tickers/ISINs. */
export const CATEGORY_CARDS = [
  {
    id: 'equity',
    sleeve: 'equity',
    titleDe: 'Breite globale Aktien',
    titleEn: 'Broad global equities',
    indexDe: 'MSCI World / FTSE All-World (UCITS-Familie)',
    indexEn: 'MSCI World / FTSE All-World (UCITS family)',
    traitsDe: 'Physische Replikation · thesaurierend oder ausschüttend · TER oft unter 0,22 %',
    traitsEn: 'Physical replication · accumulating or distributing · TER often under 0.22%',
    roleDe: 'Langfristiger Compounding-Kern',
    roleEn: 'Long-term compounding core',
  },
  {
    id: 'yield',
    sleeve: 'yield',
    titleDe: 'Ertrags-/Dividenden-Baustein',
    titleEn: 'Yield / dividend sleeve',
    indexDe: 'Globale Dividenden-Indizes (UCITS)',
    indexEn: 'Global dividend indices (UCITS)',
    traitsDe: 'Cashflow-orientiert · oft ausschüttend · höhere Volatilität als Geldmarkt',
    traitsEn: 'Cash-flow oriented · often distributing · more volatile than money markets',
    roleDe: 'Illustrativer Ertragsanteil neben dem Kern',
    roleEn: 'Illustrative income sleeve beside the core',
  },
  {
    id: 'liquidity',
    sleeve: 'liquidity',
    titleDe: 'Liquiditäts- / Stabilitäts-Puffer',
    titleEn: 'Liquidity / stability buffer',
    indexDe: 'Kurzläufer-Staatsanleihen / Geldmarkt (EUR)',
    indexEn: 'Short government bonds / EUR money markets',
    traitsDe: 'Hohe Liquidität · geringe Duration · Puffer für Ausgaben und Timing',
    traitsEn: 'High liquidity · short duration · buffer for spending and timing',
    roleDe: 'Polster für Miete, Kauf oder Geschäfts-Cashflow',
    roleEn: 'Cushion for rent, purchase, or business cash flow',
  },
]

export const DEFAULT_INPUTS = {
  liquidNetWorth: 10000,
  monthlySurplus: 300,
  horizonYears: 15,
  risk: RISK.balanced,
  goal: GOALS.rent,
  annualLivingCost: 18000,
  safeWithdrawalRate: 0.0375,
  propertyTarget: 250000,
  businessRoe: 0.12,
  expectedEquityReturn: 0.07,
  applyTaxHaircut: true,
  freistellungUsed: 1000,
  currency: 'EUR',
}

/**
 * Clamp numeric inputs — prevent negatives and zero-division.
 * @param {Partial<typeof DEFAULT_INPUTS>} raw
 */
export function sanitizeInputs(raw = {}) {
  const n = (v, fallback, min = 0, max = Number.POSITIVE_INFINITY) => {
    const x = Number(v)
    if (!Number.isFinite(x)) return fallback
    return Math.min(max, Math.max(min, x))
  }

  const risk = Object.values(RISK).includes(raw.risk) ? raw.risk : DEFAULT_INPUTS.risk
  const goal = Object.values(GOALS).includes(raw.goal) ? raw.goal : DEFAULT_INPUTS.goal

  return {
    liquidNetWorth: n(raw.liquidNetWorth, DEFAULT_INPUTS.liquidNetWorth, 0, 1e9),
    monthlySurplus: n(raw.monthlySurplus, DEFAULT_INPUTS.monthlySurplus, 0, 1e7),
    horizonYears: n(raw.horizonYears, DEFAULT_INPUTS.horizonYears, 1, 50),
    risk,
    goal,
    annualLivingCost: n(raw.annualLivingCost, DEFAULT_INPUTS.annualLivingCost, 0, 1e8),
    safeWithdrawalRate: n(raw.safeWithdrawalRate, DEFAULT_INPUTS.safeWithdrawalRate, 0.02, 0.06),
    propertyTarget: n(raw.propertyTarget, DEFAULT_INPUTS.propertyTarget, 0, 1e9),
    businessRoe: n(raw.businessRoe, DEFAULT_INPUTS.businessRoe, 0, 1),
    expectedEquityReturn: n(
      raw.expectedEquityReturn,
      DEFAULT_INPUTS.expectedEquityReturn,
      0,
      0.2
    ),
    applyTaxHaircut: Boolean(raw.applyTaxHaircut ?? DEFAULT_INPUTS.applyTaxHaircut),
    freistellungUsed: n(raw.freistellungUsed, DEFAULT_INPUTS.freistellungUsed, 0, 2000),
    currency: raw.currency === 'USD' || raw.currency === 'GBP' ? raw.currency : 'EUR',
  }
}

/**
 * Target portfolio for rent coverage: annual cost / SWR.
 */
export function targetPortfolioForRent(annualLivingCost, safeWithdrawalRate) {
  const swr = Number(safeWithdrawalRate)
  if (!Number.isFinite(swr) || swr <= 0) return 0
  const cost = Math.max(0, Number(annualLivingCost) || 0)
  return cost / swr
}

/**
 * Future value of lump sum + end-of-year annuity (annualized monthly contributions).
 * V_t = P*(1+r)^t + PMT_year * [((1+r)^t - 1) / r]
 * When r ≈ 0: V_t = P + PMT_year * t
 */
export function compoundGrowth(P, annualPmt, r, t) {
  const principal = Math.max(0, Number(P) || 0)
  const pmt = Math.max(0, Number(annualPmt) || 0)
  const years = Math.max(0, Number(t) || 0)
  const rate = Number(r)

  if (!Number.isFinite(rate) || years === 0) return principal

  if (Math.abs(rate) < 1e-10) {
    return principal + pmt * years
  }

  const growth = (1 + rate) ** years
  return principal * growth + pmt * ((growth - 1) / rate)
}

/**
 * Approximate DE Abgeltung haircut on equity-fund gains (illustrative).
 * 25% + 5.5% Soli on taxable share; Teilfreistellung 30% for equity funds ≥51%.
 * Freistellungsauftrag reduces taxable base (simplified annual model).
 */
export function germanEquityTaxHaircut({
  grossGain,
  freistellung = 1000,
  teilfreistellung = 0.3,
  abgeltung = 0.25,
  soli = 0.055,
} = {}) {
  const gain = Math.max(0, Number(grossGain) || 0)
  const free = Math.max(0, Number(freistellung) || 0)
  const afterTeil = gain * (1 - teilfreistellung)
  const taxable = Math.max(0, afterTeil - free)
  const taxRate = abgeltung * (1 + soli)
  const tax = taxable * taxRate
  const netGain = gain - tax
  const effectiveRate = gain > 0 ? tax / gain : 0
  return { tax, netGain, effectiveRate, taxable }
}

/**
 * Apply optional tax haircut to a projected terminal value vs starting capital.
 */
export function applyOptionalTaxHaircut(terminalValue, startCapital, inputs) {
  const terminal = Math.max(0, Number(terminalValue) || 0)
  const start = Math.max(0, Number(startCapital) || 0)
  const contributions = Math.max(0, (Number(inputs.monthlySurplus) || 0) * 12 * (Number(inputs.horizonYears) || 0))
  const costBasis = start + contributions
  const grossGain = Math.max(0, terminal - costBasis)

  if (!inputs.applyTaxHaircut || grossGain <= 0) {
    return { terminalNet: terminal, tax: 0, effectiveRate: 0, grossGain }
  }

  const { tax, netGain, effectiveRate } = germanEquityTaxHaircut({
    grossGain,
    freistellung: inputs.freistellungUsed,
  })
  return {
    terminalNet: costBasis + netGain,
    tax,
    effectiveRate,
    grossGain,
  }
}

export function getSleeves(risk, goal) {
  const byRisk = SLEEVE_TABLE[risk] || SLEEVE_TABLE[RISK.balanced]
  return byRisk[goal] || byRisk[GOALS.rent]
}

export function getRealReturn(risk, override) {
  if (Number.isFinite(override) && override >= 0) return override
  return DEFAULT_REAL_RETURN[risk] ?? DEFAULT_REAL_RETURN[RISK.balanced]
}

/**
 * Full lab computation from sanitized inputs.
 */
export function computeGoalLab(rawInputs) {
  const inputs = sanitizeInputs(rawInputs)
  const sleeves = getSleeves(inputs.risk, inputs.goal)
  const r = getRealReturn(inputs.risk)
  const annualPmt = inputs.monthlySurplus * 12

  const rentTarget = targetPortfolioForRent(inputs.annualLivingCost, inputs.safeWithdrawalRate)
  const goalTarget =
    inputs.goal === GOALS.property
      ? inputs.propertyTarget
      : inputs.goal === GOALS.rent
        ? rentTarget
        : Math.max(rentTarget, inputs.propertyTarget * 0.5)

  const projectedGross = compoundGrowth(
    inputs.liquidNetWorth,
    annualPmt,
    r,
    inputs.horizonYears
  )
  const taxAdj = applyOptionalTaxHaircut(projectedGross, inputs.liquidNetWorth, inputs)

  const milestones = [5, 10, 20, 30].map((years) => {
    const gross = compoundGrowth(inputs.liquidNetWorth, annualPmt, r, years)
    const adj = applyOptionalTaxHaircut(gross, inputs.liquidNetWorth, {
      ...inputs,
      horizonYears: years,
    })
    return {
      years,
      gross,
      net: adj.terminalNet,
      progress: goalTarget > 0 ? Math.min(1, adj.terminalNet / goalTarget) : 0,
    }
  })

  const currentProgress =
    goalTarget > 0 ? Math.min(1, inputs.liquidNetWorth / goalTarget) : 0
  const projectedProgress =
    goalTarget > 0 ? Math.min(1, taxAdj.terminalNet / goalTarget) : 0

  const yearsToGoal = estimateYearsToGoal({
    P: inputs.liquidNetWorth,
    annualPmt,
    r,
    target: goalTarget,
  })

  const businessCompare =
    inputs.goal === GOALS.business
      ? compareBusinessVsMarket({
          annualSurplus: annualPmt,
          years: inputs.horizonYears,
          businessRoe: inputs.businessRoe,
          equityReturn: inputs.expectedEquityReturn,
          start: inputs.liquidNetWorth,
        })
      : null

  return {
    inputs,
    sleeves,
    realReturn: r,
    goalTarget,
    rentTarget,
    projectedGross,
    projectedNet: taxAdj.terminalNet,
    taxOnGain: taxAdj.tax,
    effectiveTaxRate: taxAdj.effectiveRate,
    currentProgress,
    projectedProgress,
    yearsToGoal,
    milestones,
    businessCompare,
    sleeveChart: [
      { key: 'equity', nameDe: 'Globale Aktien', nameEn: 'Global equities', value: sleeves.equity, color: '#38bdf8' },
      { key: 'yield', nameDe: 'Ertrag', nameEn: 'Yield', value: sleeves.yield, color: '#34d399' },
      { key: 'liquidity', nameDe: 'Liquidität', nameEn: 'Liquidity', value: sleeves.liquidity, color: '#94a3b8' },
    ],
  }
}

/**
 * Binary search years until FV >= target (max 60).
 */
export function estimateYearsToGoal({ P, annualPmt, r, target }) {
  const tGoal = Number(target) || 0
  if (tGoal <= 0) return 0
  if ((Number(P) || 0) >= tGoal) return 0
  if ((Number(annualPmt) || 0) <= 0 && (Number(r) || 0) <= 0) return null

  let lo = 0
  let hi = 60
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    const v = compoundGrowth(P, annualPmt, r, mid)
    if (v >= tGoal) hi = mid
    else lo = mid
  }
  const years = hi
  if (compoundGrowth(P, annualPmt, r, 60) < tGoal) return null
  return Math.ceil(years * 10) / 10
}

export function compareBusinessVsMarket({
  annualSurplus,
  years,
  businessRoe,
  equityReturn,
  start = 0,
}) {
  const biz = compoundGrowth(start, annualSurplus, businessRoe, years)
  const mkt = compoundGrowth(start, annualSurplus, equityReturn, years)
  return {
    businessTerminal: biz,
    marketTerminal: mkt,
    delta: biz - mkt,
    businessWins: biz >= mkt,
  }
}

export function formatMoney(amount, currency = 'EUR', locale = 'de-DE') {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0)
  } catch {
    return `${Math.round(Number(amount) || 0)} ${currency}`
  }
}

export function pctLabel(fraction, locale = 'de-DE') {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(Number(fraction) || 0)
}
