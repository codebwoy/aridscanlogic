/**
 * Listing Engine V2 — multi-product catalog for eBay Sell Inventory publish.
 * Status lifecycle mirrors ListFlow; persistence is localStorage (appApi-ready).
 */

export const PRODUCT_STATUS = {
  IMPORTED: 'IMPORTED',
  ENRICHED: 'ENRICHED',
  PRICED: 'PRICED',
  PENDING_REVIEW: 'PENDING_REVIEW',
  NEEDS_ATTENTION: 'NEEDS_ATTENTION',
  APPROVED: 'APPROVED',
  LISTED: 'LISTED',
  PAUSED: 'PAUSED',
  ENDED: 'ENDED',
  REJECTED: 'REJECTED',
  ERROR: 'ERROR',
}

export const DEFAULT_PROHIBITED_KEYWORDS = [
  'replica',
  'counterfeit',
  'fake',
  'knockoff',
  'fälschung',
  'nachbau',
  'plagiat',
  'oem chip',
]

export function emptyCatalogSettings() {
  return {
    live_mode: false,
    dry_run: true,
    kill_switch: false,
    marketplace_id: 'EBAY_DE',
    currency: 'EUR',
    daily_listing_cap: 10,
    ramp_start: 10,
    ramp_step: 10,
    ramp_max: 100,
    consecutive_clean_days: 0,
    min_margin_pct: 15,
    min_profit_eur: 2,
    target_margin_pct: 25,
    ebay_fee_pct: 12.9,
    ebay_fixed_fee: 0.35,
    payment_cost_pct: 0,
    promoted_listing_pct: 0,
    price_rounding: 0.99,
    default_category_id: '',
    merchant_location_key: '',
    fulfillment_policy_id: '',
    payment_policy_id: '',
    return_policy_id: '',
    auto_approve_enabled: false,
    auto_approve_after: 50,
    approved_clean_count: 0,
    prohibited_keywords: [...DEFAULT_PROHIBITED_KEYWORDS],
    publish_stagger_ms: 2500,
    telegram_webhook_url: '',
    telegram_chat_id: '',
    notify_on_publish: true,
    notify_on_handling_alert: true,
    notify_daily_summary: true,
  }
}

export function emptyCatalogProduct(overrides = {}) {
  const now = new Date().toISOString()
  return {
    id: overrides.id || `lp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: PRODUCT_STATUS.IMPORTED,
    supplier_sku: '',
    title: '',
    description: '',
    brand: '',
    mpn: '',
    ean: '',
    upc: '',
    images: [],
    weight: '',
    supplier_cost: '',
    shipping_cost: '',
    stock_qty: 0,
    category_hint: '',
    category_id: '',
    aspects: {},
    duplicate_flags: [],
    duplicate_of: '',
    missing_aspects: [],
    required_aspects: [],
    list_price: '',
    expected_profit: null,
    expected_margin_pct: null,
    fee_breakdown: null,
    policy_flags: [],
    policy_ok: true,
    human_approved: false,
    ebay_sku: '',
    offer_id: '',
    listing_id: '',
    last_error: '',
    last_synced_at: null,
    published_at: null,
    dry_run_published: false,
    created_at: now,
    updated_at: now,
    ...overrides,
  }
}

export function emptyCatalogState() {
  return {
    version: 1,
    settings: emptyCatalogSettings(),
    products: [],
    publish_log: [],
    updated_at: null,
  }
}

export function normalizeCatalogSettings(raw = {}) {
  const base = emptyCatalogSettings()
  const out = { ...base, ...raw }
  out.live_mode = !!raw.live_mode
  out.dry_run = raw.dry_run !== false && !out.live_mode
  out.kill_switch = !!raw.kill_switch
  out.prohibited_keywords = Array.isArray(raw.prohibited_keywords)
    ? raw.prohibited_keywords.map(String).filter(Boolean)
    : [...DEFAULT_PROHIBITED_KEYWORDS]
  for (const key of [
    'daily_listing_cap',
    'ramp_start',
    'ramp_step',
    'ramp_max',
    'consecutive_clean_days',
    'min_margin_pct',
    'min_profit_eur',
    'target_margin_pct',
    'ebay_fee_pct',
    'ebay_fixed_fee',
    'payment_cost_pct',
    'promoted_listing_pct',
    'price_rounding',
    'auto_approve_after',
    'approved_clean_count',
    'publish_stagger_ms',
  ]) {
    if (raw[key] != null && raw[key] !== '') {
      const n = Number(raw[key])
      if (Number.isFinite(n)) out[key] = n
    }
  }
  out.auto_approve_enabled = !!raw.auto_approve_enabled
  out.telegram_webhook_url = String(raw.telegram_webhook_url || '')
  out.telegram_chat_id = String(raw.telegram_chat_id || '')
  out.notify_on_publish = raw.notify_on_publish !== false
  out.notify_on_handling_alert = raw.notify_on_handling_alert !== false
  out.notify_daily_summary = raw.notify_daily_summary !== false
  return out
}

export function normalizeCatalogProduct(raw = {}) {
  const base = emptyCatalogProduct()
  const images = Array.isArray(raw.images)
    ? raw.images.map(String).filter((u) => /^https?:\/\//i.test(u)).slice(0, 12)
    : []
  const status = Object.values(PRODUCT_STATUS).includes(raw.status)
    ? raw.status
    : PRODUCT_STATUS.IMPORTED
  return {
    ...base,
    ...raw,
    id: String(raw.id || base.id),
    status,
    supplier_sku: String(raw.supplier_sku || ''),
    title: String(raw.title || '').slice(0, 80),
    description: String(raw.description || ''),
    brand: String(raw.brand || ''),
    mpn: String(raw.mpn || ''),
    ean: String(raw.ean || '').replace(/\D/g, '').slice(0, 14),
    upc: String(raw.upc || '').replace(/\D/g, '').slice(0, 14),
    images,
    weight: String(raw.weight || ''),
    supplier_cost: String(raw.supplier_cost ?? ''),
    shipping_cost: String(raw.shipping_cost ?? ''),
    stock_qty: Math.max(0, Number.parseInt(String(raw.stock_qty ?? '0'), 10) || 0),
    category_hint: String(raw.category_hint || ''),
    category_id: String(raw.category_id || '').replace(/\D/g, ''),
    aspects:
      raw.aspects && typeof raw.aspects === 'object' && !Array.isArray(raw.aspects)
        ? raw.aspects
        : {},
    duplicate_flags: Array.isArray(raw.duplicate_flags) ? raw.duplicate_flags.map(String) : [],
    duplicate_of: String(raw.duplicate_of || ''),
    missing_aspects: Array.isArray(raw.missing_aspects) ? raw.missing_aspects.map(String) : [],
    required_aspects: Array.isArray(raw.required_aspects) ? raw.required_aspects.map(String) : [],
    list_price: String(raw.list_price ?? ''),
    policy_flags: Array.isArray(raw.policy_flags) ? raw.policy_flags.map(String) : [],
    policy_ok: raw.policy_ok !== false,
    human_approved: !!raw.human_approved,
    ebay_sku: String(raw.ebay_sku || ''),
    offer_id: String(raw.offer_id || ''),
    listing_id: String(raw.listing_id || ''),
    last_error: String(raw.last_error || ''),
    dry_run_published: !!raw.dry_run_published,
  }
}

/** Effective daily cap after ramp-up. */
export function effectiveDailyCap(settings) {
  const s = normalizeCatalogSettings(settings)
  const ramp =
    s.ramp_start + s.consecutive_clean_days * s.ramp_step
  return Math.min(s.daily_listing_cap, s.ramp_max, Math.max(s.ramp_start, ramp))
}
