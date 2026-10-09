/**
 * Enrich → price → review gate → publish (dry-run or live via /api/ebay).
 */

import { PRODUCT_STATUS, normalizeCatalogSettings, effectiveDailyCap } from './schema'
import {
  loadCatalog,
  saveCatalog,
  upsertProducts,
  updateProduct,
  appendPublishLog,
  remainingPublishSlots,
  recordDailyPublish,
  getDailyPublishUsage,
  bumpCleanDayOrReset,
} from './store'
import { notifySeller } from '../ops/notifications'
import { priceProduct } from './pricing'
import { runPolicyCheck } from './policyCheck'
import { buildTitle, buildDescription, buildAspects, uniquifyTitles } from './content'
import { flagDuplicates } from './dedupe'
import { validateImageUrls } from './imageValidate'
import { publishListingToEbay } from '../ebay/client'
import { loadLockedLegalModules } from '../legalInsert'

function ebaySkuFor(product) {
  const raw = product.ebay_sku || product.supplier_sku || product.id
  return String(raw)
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50)
}

/**
 * Enrich + price + policy → PENDING_REVIEW or NEEDS_ATTENTION.
 */
export function enrichAndPriceAll(productIds = null) {
  const catalog = loadCatalog()
  const settings = catalog.settings
  let products = catalog.products
  if (Array.isArray(productIds) && productIds.length) {
    const set = new Set(productIds)
    products = products.filter((p) => set.has(p.id))
  }

  let enriched = uniquifyTitles(
    products.map((p) => {
      const title = p.title?.trim() ? p.title.slice(0, 80) : buildTitle(p)
      const { plain } = buildDescription({ ...p, title })
      const img = validateImageUrls(p.images)
      const priced = priceProduct({ ...p, title, description: plain || p.description }, settings)
      const policy = runPolicyCheck(
        {
          ...p,
          title,
          description: plain || p.description,
          list_price: priced.list_price,
          category_id: p.category_id || settings.default_category_id,
        },
        settings
      )
      const flags = [...new Set([...(policy.flags || []), ...(img.flags || [])])]
      const policyOk = policy.ok && img.ok

      let status = PRODUCT_STATUS.PENDING_REVIEW
      if (!priced.ok || !policyOk) status = PRODUCT_STATUS.NEEDS_ATTENTION
      else if (
        settings.auto_approve_enabled &&
        settings.approved_clean_count >= settings.auto_approve_after
      ) {
        status = PRODUCT_STATUS.APPROVED
      }

      return {
        ...p,
        title,
        description: plain || p.description,
        list_price: priced.list_price,
        expected_profit: priced.expected_profit,
        expected_margin_pct: priced.expected_margin_pct,
        fee_breakdown: priced.fee_breakdown,
        policy_flags: flags,
        policy_ok: policyOk,
        category_id: p.category_id || settings.default_category_id || '',
        aspects: buildAspects(p),
        status:
          status === PRODUCT_STATUS.APPROVED
            ? PRODUCT_STATUS.APPROVED
            : status,
        human_approved: status === PRODUCT_STATUS.APPROVED,
        ebay_sku: ebaySkuFor(p),
        updated_at: new Date().toISOString(),
      }
    })
  )

  const deduped = flagDuplicates(enriched)
  enriched = deduped.products.map((p) => {
    if (!p.duplicate_flags?.length) return p
    return {
      ...p,
      status: PRODUCT_STATUS.NEEDS_ATTENTION,
      policy_ok: false,
      human_approved: false,
    }
  })

  return upsertProducts(enriched)
}

export function approveProducts(ids) {
  const set = new Set(ids)
  const catalog = loadCatalog()
  const products = catalog.products.map((p) => {
    if (!set.has(p.id)) return p
    if (p.status === PRODUCT_STATUS.NEEDS_ATTENTION && !p.policy_ok) {
      return p
    }
    if (!p.list_price || Number(p.list_price) <= 0) return p
    return {
      ...p,
      status: PRODUCT_STATUS.APPROVED,
      human_approved: true,
      updated_at: new Date().toISOString(),
    }
  })
  return saveCatalog({ products })
}

export function rejectProducts(ids) {
  const set = new Set(ids)
  const catalog = loadCatalog()
  const products = catalog.products.map((p) =>
    set.has(p.id)
      ? {
          ...p,
          status: PRODUCT_STATUS.REJECTED,
          human_approved: false,
          updated_at: new Date().toISOString(),
        }
      : p
  )
  return saveCatalog({ products })
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildPublishPayload(product, settings, { dryRun }) {
  let legalHtml = ''
  try {
    const legal = loadLockedLegalModules({})
    legalHtml = [legal.impressum, legal.widerrufsbelehrung, legal.agb, legal.datenschutz]
      .filter(Boolean)
      .map((t) => `<section><pre>${escapeHtml(t)}</pre></section>`)
      .join('\n')
  } catch {
    /* legal store may be empty outside browser */
  }
  const { html } = buildDescription(product, { legalHtml })

  return {
    human_approved: true,
    compliance_blocked: false,
    dry_run: !!dryRun,
    sku: ebaySkuFor(product),
    title: (product.title || buildTitle(product)).slice(0, 80),
    description: html || `<p>${product.description || product.title}</p>`,
    categoryId: product.category_id || settings.default_category_id,
    merchantLocationKey: settings.merchant_location_key,
    fulfillmentPolicyId: settings.fulfillment_policy_id,
    paymentPolicyId: settings.payment_policy_id,
    returnPolicyId: settings.return_policy_id,
    currency: settings.currency || 'EUR',
    price: String(product.list_price),
    quantity: String(Math.max(1, product.stock_qty || 1)),
    condition: 'NEW',
    marketplaceId: settings.marketplace_id || 'EBAY_DE',
    aspects: product.aspects || buildAspects(product),
    imageUrls: product.images || [],
    ean: product.ean || '',
    offerId: product.offer_id || undefined,
  }
}

export function canPublishProduct(product, settings) {
  const s = normalizeCatalogSettings(settings)
  const reasons = []
  if (s.kill_switch) reasons.push('kill_switch')
  if (!product.human_approved && product.status !== PRODUCT_STATUS.APPROVED) {
    reasons.push('not_approved')
  }
  if (!product.policy_ok) reasons.push('policy_blocked')
  if (!product.list_price || Number(product.list_price) <= 0) reasons.push('no_price')
  if (product.stock_qty <= 0) reasons.push('out_of_stock')
  if (!(product.category_id || s.default_category_id)) reasons.push('no_category')
  if (!s.merchant_location_key) reasons.push('no_location')
  if (!s.fulfillment_policy_id || !s.payment_policy_id || !s.return_policy_id) {
    reasons.push('missing_policies')
  }
  if (!(product.images || []).length) reasons.push('no_images')
  return { ok: reasons.length === 0, reasons }
}

/**
 * Publish up to `limit` approved products. Respects daily cap, kill switch, dry-run.
 */
export async function publishApprovedBatch({ limit = 10 } = {}) {
  const catalog = loadCatalog()
  const settings = normalizeCatalogSettings(catalog.settings)
  const slots = remainingPublishSlots(settings)
  const cap = effectiveDailyCap(settings)
  const max = Math.min(limit, slots, cap)

  if (settings.kill_switch) {
    return { published: [], errors: [{ message: 'Kill switch is ON' }], dryRun: true, cap, slots }
  }
  if (max <= 0) {
    return {
      published: [],
      errors: [{ message: `Daily cap reached (${cap}).` }],
      dryRun: settings.dry_run,
      cap,
      slots,
    }
  }

  const dryRun = settings.dry_run || !settings.live_mode
  const queue = catalog.products.filter(
    (p) =>
      (p.status === PRODUCT_STATUS.APPROVED || p.human_approved) &&
      p.status !== PRODUCT_STATUS.LISTED &&
      p.status !== PRODUCT_STATUS.REJECTED
  )

  const published = []
  const errors = []
  const stagger = Math.max(0, Number(settings.publish_stagger_ms) || 0)
  const batch = queue.slice(0, max)

  for (let i = 0; i < batch.length; i++) {
    const product = batch[i]
    if (i > 0 && stagger > 0) {
      await new Promise((r) => setTimeout(r, stagger))
    }

    const gate = canPublishProduct(product, settings)
    if (!gate.ok) {
      errors.push({ id: product.id, sku: product.supplier_sku, message: gate.reasons.join(', ') })
      updateProduct(product.id, {
        status: PRODUCT_STATUS.NEEDS_ATTENTION,
        last_error: gate.reasons.join(', '),
      })
      continue
    }

    const payload = buildPublishPayload(product, settings, { dryRun })

    try {
      let result
      if (dryRun) {
        result = {
          ok: true,
          dry_run: true,
          sku: payload.sku,
          offerId: product.offer_id || `dry-offer-${product.id}`,
          listingId: product.listing_id || `dry-${Date.now()}`,
          marketplaceId: payload.marketplaceId,
        }
      } else {
        result = await publishListingToEbay(payload)
      }

      const next = updateProduct(product.id, {
        status: PRODUCT_STATUS.LISTED,
        ebay_sku: result.sku || payload.sku,
        offer_id: result.offerId || '',
        listing_id: result.listingId || '',
        dry_run_published: !!dryRun,
        published_at: new Date().toISOString(),
        last_error: '',
      })
      const listed = next.products.find((p) => p.id === product.id)
      published.push(listed)
      recordDailyPublish({ success: true })
      appendPublishLog({
        product_id: product.id,
        sku: payload.sku,
        dry_run: dryRun,
        listing_id: result.listingId,
        offer_id: result.offerId,
        ok: true,
      })

      if (!dryRun) {
        const cat = loadCatalog()
        saveCatalog({
          settings: {
            approved_clean_count: (cat.settings.approved_clean_count || 0) + 1,
          },
        })
      }
    } catch (err) {
      const message = err?.message || String(err)
      const sellingLimit =
        /selling.?limit|quota|limit.?exceeded/i.test(message) ||
        (Array.isArray(err?.details) &&
          err.details.some((d) => /selling.?limit|25002|2191/i.test(JSON.stringify(d))))
      errors.push({
        id: product.id,
        sku: product.supplier_sku,
        message,
        selling_limit: !!sellingLimit,
      })
      updateProduct(product.id, {
        status: PRODUCT_STATUS.ERROR,
        last_error: message,
      })
      recordDailyPublish({ success: false })
      appendPublishLog({
        product_id: product.id,
        sku: product.supplier_sku,
        dry_run: dryRun,
        ok: false,
        error: message,
        selling_limit: !!sellingLimit,
      })
      if (sellingLimit) break
    }
  }

  if (published.length || errors.length) {
    bumpCleanDayOrReset(errors.length > 0)
  }

  if (published.length) {
    notifySeller(
      'publish',
      `${published.length} listing(s) ${dryRun ? 'dry-run' : 'live'} · errors ${errors.length}`
    ).catch(() => {})
  }

  return {
    published,
    errors,
    dryRun,
    cap,
    slots: remainingPublishSlots(settings),
    usage: getDailyPublishUsage(),
  }
}

/**
 * Apply stock/price updates from a re-imported feed map: { supplier_sku: { stock_qty, supplier_cost, shipping_cost } }
 */
export function applyStockPriceUpdates(updates) {
  const catalog = loadCatalog()
  const bySku = new Map(updates.map((u) => [String(u.supplier_sku), u]))
  const products = catalog.products.map((p) => {
    const u = bySku.get(p.supplier_sku)
    if (!u) return p
    const stock_qty =
      u.stock_qty != null ? Math.max(0, Number.parseInt(String(u.stock_qty), 10) || 0) : p.stock_qty
    const next = {
      ...p,
      stock_qty,
      supplier_cost: u.supplier_cost != null ? String(u.supplier_cost) : p.supplier_cost,
      shipping_cost: u.shipping_cost != null ? String(u.shipping_cost) : p.shipping_cost,
      last_synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    if (stock_qty === 0 && p.status === PRODUCT_STATUS.LISTED) {
      next.status = PRODUCT_STATUS.PAUSED
    }
    const priced = priceProduct(next, catalog.settings)
    next.list_price = priced.list_price
    next.expected_profit = priced.expected_profit
    next.expected_margin_pct = priced.expected_margin_pct
    next.fee_breakdown = priced.fee_breakdown
    return next
  })
  return saveCatalog({ products })
}

export function setKillSwitch(on) {
  return saveCatalog({ settings: { kill_switch: !!on } })
}

export function setLiveMode(on) {
  return saveCatalog({
    settings: {
      live_mode: !!on,
      dry_run: !on,
    },
  })
}
