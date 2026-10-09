/**
 * German Copywriter for catalog products — correct wrong words / spelling, rewrite to retail DE.
 */

import { generateListingCopy } from '../api'
import { canRunGeneration, remainingGenerations, recordGenerationUse } from '../store'
import { PRODUCT_STATUS } from './schema'
import { loadCatalog, upsertProducts, updateProduct } from './store'
import { buildTitle, buildDescription, buildAspects, uniquifyTitles } from './content'
import { priceProduct } from './pricing'
import { runPolicyCheck } from './policyCheck'

function catalogToProductData(p) {
  return {
    produkttyp: '',
    marke: p.brand || '',
    modell: p.mpn || '',
    farbe: '',
    material: '',
    groesse: '',
    anzahl: '',
    ean: p.ean || '',
    artikelnummer: p.supplier_sku || '',
    herstellerreferenz: p.mpn || '',
    zustand: 'Neu',
    kurz_lieferantenbeschreibung: p.description || p.title || '',
    spezifikationen: Object.entries(p.aspects || {}).map(([key, val]) => ({
      key,
      value: Array.isArray(val) ? val.join(', ') : String(val),
      source: 'verified',
    })),
    masse: { gewicht: p.weight || '' },
    lieferumfang: [],
    montage: '',
    hinweise: [],
    shipping: {},
    gpsr: {},
    wholesale_cost: p.supplier_cost || '',
    category_hint: p.category_hint || '',
  }
}

function listingToCatalogFields(listing, fallback) {
  const title = String(listing.seo_titel || listing.titel || fallback.title || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
  const parts = [
    listing.kurzbeschreibung,
    listing.produktbeschreibung,
    (listing.vorteile || []).length ? `Vorteile:\n${listing.vorteile.map((v) => `• ${v}`).join('\n')}` : '',
    listing.masse_text,
    listing.material_text,
    listing.farbe_text,
    listing.versand_text,
    listing.kundenservice,
  ]
    .map((s) => String(s || '').trim())
    .filter(Boolean)
  const description = parts.join('\n\n') || fallback.description || ''
  return { title, description, listing_copy: listing }
}

/**
 * Run German Copywriter (correct/rewrite) on catalog products.
 * @returns {{ catalog, rewritten, skipped, errors }}
 */
export async function rewriteCatalogGermanCopy({
  productIds = null,
  mode = 'correct',
  language = 'de',
  onProgress,
} = {}) {
  const catalog = loadCatalog()
  const settings = catalog.settings
  let targets = catalog.products
  if (Array.isArray(productIds) && productIds.length) {
    const set = new Set(productIds)
    targets = targets.filter((p) => set.has(p.id))
  }
  if (!targets.length) {
    return { catalog, rewritten: 0, skipped: 0, errors: [] }
  }

  const remaining = remainingGenerations()
  if (remaining <= 0) {
    throw new Error(
      language === 'de'
        ? 'Tageslimit für Listing-Generierungen erreicht.'
        : 'Daily listing generation limit reached.'
    )
  }

  const queue = targets.slice(0, remaining)
  const skipped = targets.length - queue.length
  const errors = []
  let rewritten = 0
  const updates = []

  for (let i = 0; i < queue.length; i++) {
    const p = queue[i]
    onProgress?.({ index: i + 1, total: queue.length, sku: p.supplier_sku })
    if (!canRunGeneration()) {
      errors.push({ id: p.id, message: 'daily cap' })
      break
    }
    try {
      const product = catalogToProductData(p)
      const existingListing = {
        titel: p.title || buildTitle(p),
        seo_titel: p.title || '',
        kurzbeschreibung: p.description || '',
        produktbeschreibung: p.description || '',
      }
      const listing = await generateListingCopy({
        product,
        mode: mode === 'correct' || mode === 'rewrite' || mode === 'translate' ? mode : 'correct',
        existingListing,
        language: language === 'en' ? 'en' : 'de',
      })
      recordGenerationUse(1)
      const fields = listingToCatalogFields(listing, p)
      const next = {
        ...p,
        title: fields.title,
        description: fields.description,
        listing_copy: fields.listing_copy,
        copy_corrected_at: new Date().toISOString(),
        aspects: buildAspects(p),
        updated_at: new Date().toISOString(),
      }
      const priced = priceProduct(next, settings)
      const policy = runPolicyCheck(
        {
          ...next,
          list_price: priced.list_price,
          category_id: next.category_id || settings.default_category_id,
        },
        settings
      )
      next.list_price = priced.list_price
      next.expected_profit = priced.expected_profit
      next.expected_margin_pct = priced.expected_margin_pct
      next.fee_breakdown = priced.fee_breakdown
      next.policy_flags = policy.flags
      next.policy_ok = policy.ok
      if (next.status === PRODUCT_STATUS.IMPORTED || next.status === PRODUCT_STATUS.ENRICHED) {
        next.status = policy.ok && priced.ok ? PRODUCT_STATUS.PENDING_REVIEW : PRODUCT_STATUS.NEEDS_ATTENTION
      } else if (!policy.ok || !priced.ok) {
        next.status = PRODUCT_STATUS.NEEDS_ATTENTION
        next.human_approved = false
      }
      updates.push(next)
      rewritten++
    } catch (err) {
      errors.push({ id: p.id, sku: p.supplier_sku, message: err?.message || String(err) })
      updateProduct(p.id, {
        last_error: err?.message || 'German copy failed',
        status: PRODUCT_STATUS.NEEDS_ATTENTION,
      })
    }
  }

  let nextCatalog = loadCatalog()
  if (updates.length) {
    const uniqued = uniquifyTitles(updates)
    nextCatalog = upsertProducts(uniqued)
  }
  return { catalog: nextCatalog, rewritten, skipped, errors }
}

/**
 * Single-product German correction without full catalog batch.
 */
export async function rewriteOneCatalogProduct(productId, { language = 'de', mode = 'correct' } = {}) {
  return rewriteCatalogGermanCopy({
    productIds: [productId],
    language,
    mode,
  })
}

/** Template-only fallback when LLM unavailable — light DE cleanup. */
export function lightGermanCleanup(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .replace(/\b(Farbe|Color)\s*:\s*/gi, 'Farbe: ')
    .replace(/\b(Material)\s*:\s*/gi, 'Material: ')
    .replace(/\s+([,.!?;:])/g, '$1')
    .trim()
}

export function applyLightCleanupToProduct(p) {
  const title = lightGermanCleanup(p.title || buildTitle(p)).slice(0, 80)
  const { plain } = buildDescription({ ...p, title, description: lightGermanCleanup(p.description) })
  return { ...p, title, description: plain }
}
