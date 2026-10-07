/**
 * eBay.de contribution / profit estimate — configurable defaults, not live fee API.
 * Labels must always show that fees are estimates.
 */

function num(v, fallback = 0) {
  if (v === '' || v == null) return fallback
  const n = Number(String(v).replace(',', '.').replace(/[^\d.-]/g, ''))
  return Number.isFinite(n) ? n : fallback
}

export const DEFAULT_EBAY_FEE_PCT = 12.9
export const DEFAULT_EBAY_FIXED_FEE = 0.35
export const DEFAULT_RETURN_RATE_PCT = 5
export const DEFAULT_DAMAGE_RATE_PCT = 1
export const DEFAULT_TARGET_MARGIN_PCT = 15

export function emptyEconomics() {
  return {
    selling_price: '',
    product_cost: '',
    supplier_shipping: '',
    outbound_shipping_cost: '',
    ebay_fee_pct: String(DEFAULT_EBAY_FEE_PCT),
    ebay_fixed_fee: String(DEFAULT_EBAY_FIXED_FEE),
    ad_cost_per_order: '',
    payment_cost_pct: '0',
    expected_return_rate_pct: String(DEFAULT_RETURN_RATE_PCT),
    damage_allowance_pct: String(DEFAULT_DAMAGE_RATE_PCT),
    other_cost_per_order: '',
    software_allocation: '',
    target_margin_pct: String(DEFAULT_TARGET_MARGIN_PCT),
  }
}

export function normalizeEconomics(raw = {}) {
  const base = emptyEconomics()
  const out = { ...base }
  for (const key of Object.keys(base)) {
    out[key] = raw[key] == null ? base[key] : String(raw[key])
  }
  return out
}

/**
 * @returns {{
 *   selling_price: number,
 *   total_cost: number,
 *   ebay_fees: number,
 *   variable_costs: number,
 *   return_cost_allowance: number,
 *   damage_allowance: number,
 *   contribution: number,
 *   contribution_margin_pct: number,
 *   max_ad_spend: number,
 *   recommended_cac_low: number,
 *   recommended_cac_high: number,
 *   meets_target: boolean,
 *   target_margin_pct: number,
 *   status: 'ok' | 'thin' | 'loss' | 'incomplete',
 * }}
 */
export function calculateProfit(economics = {}) {
  const e = normalizeEconomics(economics)
  const selling = num(e.selling_price)
  const product = num(e.product_cost)
  const supplierShip = num(e.supplier_shipping)
  const outbound = num(e.outbound_shipping_cost)
  const feePct = num(e.ebay_fee_pct, DEFAULT_EBAY_FEE_PCT)
  const fixedFee = num(e.ebay_fixed_fee, DEFAULT_EBAY_FIXED_FEE)
  const ad = num(e.ad_cost_per_order)
  const payPct = num(e.payment_cost_pct)
  const returnRate = num(e.expected_return_rate_pct, DEFAULT_RETURN_RATE_PCT) / 100
  const damageRate = num(e.damage_allowance_pct, DEFAULT_DAMAGE_RATE_PCT) / 100
  const other = num(e.other_cost_per_order)
  const software = num(e.software_allocation)
  const target = num(e.target_margin_pct, DEFAULT_TARGET_MARGIN_PCT)

  const incomplete = selling <= 0 || product <= 0

  const ebayFees = selling > 0 ? selling * (feePct / 100) + fixedFee : 0
  const paymentCost = selling * (payPct / 100)
  const cogs = product + supplierShip
  const returnCostAllowance = (cogs + outbound) * returnRate
  const damageAllowance = cogs * damageRate

  const variableCosts =
    cogs + outbound + ebayFees + paymentCost + ad + other + software + returnCostAllowance + damageAllowance

  const contribution = selling - variableCosts
  const marginPct = selling > 0 ? (contribution / selling) * 100 : 0
  const maxAd = Math.max(0, contribution + ad)
  const cacLow = Math.round(maxAd * 0.35 * 100) / 100
  const cacHigh = Math.round(maxAd * 0.5 * 100) / 100

  let status = 'incomplete'
  if (!incomplete) {
    if (contribution < 0) status = 'loss'
    else if (marginPct < target) status = 'thin'
    else status = 'ok'
  }

  const round2 = (x) => Math.round(x * 100) / 100

  return {
    selling_price: round2(selling),
    total_cost: round2(variableCosts),
    ebay_fees: round2(ebayFees),
    variable_costs: round2(variableCosts),
    return_cost_allowance: round2(returnCostAllowance),
    damage_allowance: round2(damageAllowance),
    contribution: round2(contribution),
    contribution_margin_pct: round2(marginPct),
    max_ad_spend: round2(maxAd),
    recommended_cac_low: cacLow,
    recommended_cac_high: cacHigh,
    meets_target: !incomplete && marginPct >= target && contribution >= 0,
    target_margin_pct: target,
    status,
  }
}

/** Seed product_cost from product.wholesale_cost when economics empty. */
export function seedEconomicsFromProduct(economics, product) {
  const e = normalizeEconomics(economics)
  if (!e.product_cost && product?.wholesale_cost) {
    e.product_cost = String(product.wholesale_cost)
  }
  return e
}
