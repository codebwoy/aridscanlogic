/**
 * Pricing engine — refuse to list below min margin / min profit.
 */

import { normalizeCatalogSettings } from './schema'

function num(v, fallback = 0) {
  if (v === '' || v == null) return fallback
  const n = Number(String(v).replace(',', '.').replace(/[^\d.-]/g, ''))
  return Number.isFinite(n) ? n : fallback
}

function round2(x) {
  return Math.round(x * 100) / 100
}

/** Round up to .99 (or configured ending). */
export function applyPriceRounding(price, ending = 0.99) {
  const p = Number(price)
  if (!Number.isFinite(p) || p <= 0) return 0
  const whole = Math.floor(p)
  const target = whole + ending
  if (target >= p) return round2(target)
  return round2(whole + 1 + ending)
}

/**
 * Solve for list price given costs and target margin %.
 * list = (cost_base + fixed) / (1 - feePct - payPct - adPct - targetMargin)
 */
export function computeListPrice(product, settings) {
  const s = normalizeCatalogSettings(settings)
  const cost = num(product.supplier_cost)
  const ship = num(product.shipping_cost)
  const costBase = cost + ship
  const feePct = num(s.ebay_fee_pct, 12.9) / 100
  const payPct = num(s.payment_cost_pct) / 100
  const adPct = num(s.promoted_listing_pct) / 100
  const target = num(s.target_margin_pct, 25) / 100
  const fixed = num(s.ebay_fixed_fee, 0.35)

  const denom = 1 - feePct - payPct - adPct - target
  if (costBase <= 0) {
    return {
      list_price: '',
      expected_profit: null,
      expected_margin_pct: null,
      fee_breakdown: null,
      ok: false,
      reason: 'missing_cost',
    }
  }
  if (denom <= 0.05) {
    return {
      list_price: '',
      expected_profit: null,
      expected_margin_pct: null,
      fee_breakdown: null,
      ok: false,
      reason: 'fees_too_high',
    }
  }

  let list = (costBase + fixed) / denom
  list = applyPriceRounding(list, num(s.price_rounding, 0.99))
  return evaluatePrice(list, product, settings)
}

export function evaluatePrice(listPrice, product, settings) {
  const s = normalizeCatalogSettings(settings)
  const selling = num(listPrice)
  const cost = num(product.supplier_cost)
  const ship = num(product.shipping_cost)
  const feePct = num(s.ebay_fee_pct, 12.9) / 100
  const payPct = num(s.payment_cost_pct) / 100
  const adPct = num(s.promoted_listing_pct) / 100
  const fixed = num(s.ebay_fixed_fee, 0.35)
  const minMargin = num(s.min_margin_pct, 15)
  const minProfit = num(s.min_profit_eur, 2)

  const ebayFees = selling * feePct + fixed
  const payment = selling * payPct
  const ads = selling * adPct
  const cogs = cost + ship
  const profit = selling - cogs - ebayFees - payment - ads
  const marginPct = selling > 0 ? (profit / selling) * 100 : 0

  const fee_breakdown = {
    supplier_cost: round2(cost),
    shipping_cost: round2(ship),
    ebay_fees: round2(ebayFees),
    payment: round2(payment),
    ads: round2(ads),
    list_price: round2(selling),
    profit: round2(profit),
    margin_pct: round2(marginPct),
  }

  let ok = true
  let reason = ''
  if (selling <= 0 || cost <= 0) {
    ok = false
    reason = 'incomplete'
  } else if (profit < minProfit) {
    ok = false
    reason = 'below_min_profit'
  } else if (marginPct < minMargin) {
    ok = false
    reason = 'below_min_margin'
  }

  return {
    list_price: selling > 0 ? String(round2(selling)) : '',
    expected_profit: round2(profit),
    expected_margin_pct: round2(marginPct),
    fee_breakdown,
    ok,
    reason,
  }
}

export function priceProduct(product, settings) {
  if (product.list_price && num(product.list_price) > 0) {
    return evaluatePrice(product.list_price, product, settings)
  }
  return computeListPrice(product, settings)
}
