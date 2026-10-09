/**
 * Fetch required/recommended item aspects for a category; flag missing required.
 */

import { apiFetch } from '@/lib/apiFetch'
import { loadEbayAuth, ebayTokenNeedsRefresh, saveEbayAuth } from '../ebay/authStore'
import { loadCatalog, upsertProducts } from './store'
import { PRODUCT_STATUS } from './schema'
import { isEbayConnected } from '../ebay/authStore'

async function ensureToken() {
  let auth = loadEbayAuth()
  if (!auth?.access_token && !auth?.refresh_token) throw new Error('eBay nicht verbunden.')
  if (auth.access_token && !ebayTokenNeedsRefresh()) return auth.access_token
  const res = await apiFetch('/api/ebay/oauth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: auth.refresh_token }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Token refresh failed')
  saveEbayAuth({
    access_token: data.access_token,
    refresh_token: data.refresh_token || auth.refresh_token,
    expires_in: data.expires_in,
    sandbox: auth.sandbox,
  })
  return data.access_token
}

export async function fetchItemAspectsForCategory(categoryId, marketplaceId = 'EBAY_DE') {
  const token = await ensureToken()
  const q = new URLSearchParams({
    category_id: String(categoryId).replace(/\D/g, ''),
    marketplace_id: marketplaceId,
  })
  const res = await apiFetch(`/api/ebay/taxonomy/aspects?${q}`, {
    headers: { 'X-Ebay-User-Token': token },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `aspects HTTP ${res.status}`)
  return data
}

function fillAspectFromProduct(aspectName, product) {
  const n = String(aspectName || '').toLowerCase()
  if (/marke|brand|hersteller/.test(n) && product.brand) return product.brand
  if (/ean|gtin/.test(n) && product.ean) return product.ean
  if (/mpn|herstellernummer|modell/.test(n) && product.mpn) return product.mpn
  if (/upc/.test(n) && product.upc) return product.upc
  if (/gewicht|weight/.test(n) && product.weight) return product.weight
  if (product.aspects?.[aspectName]) {
    const v = product.aspects[aspectName]
    return Array.isArray(v) ? v[0] : String(v)
  }
  return ''
}

/**
 * For products with category_id: load required aspects, fill from data, flag NEEDS_ATTENTION if missing.
 */
export async function enrichAspectsForCatalog({ productIds = null, marketplaceId = 'EBAY_DE' } = {}) {
  if (!isEbayConnected()) throw new Error('eBay nicht verbunden.')
  const catalog = loadCatalog()
  let targets = catalog.products.filter((p) => p.category_id)
  if (Array.isArray(productIds) && productIds.length) {
    const set = new Set(productIds)
    targets = targets.filter((p) => set.has(p.id))
  }

  const cache = new Map()
  const updates = []
  const errors = []

  for (const p of targets) {
    try {
      let aspectsMeta = cache.get(p.category_id)
      if (!aspectsMeta) {
        aspectsMeta = await fetchItemAspectsForCategory(p.category_id, marketplaceId)
        cache.set(p.category_id, aspectsMeta)
      }
      const required = aspectsMeta.required || []
      const recommended = aspectsMeta.recommended || []
      const nextAspects = { ...(p.aspects || {}) }
      const missing = []

      for (const name of [...required, ...recommended]) {
        if (nextAspects[name]?.length) continue
        const filled = fillAspectFromProduct(name, p)
        if (filled) nextAspects[name] = [String(filled)]
        else if (required.includes(name)) missing.push(name)
      }

      const flags = [...(p.policy_flags || [])].filter((f) => !f.startsWith('missing_aspect:'))
      for (const m of missing) flags.push(`missing_aspect:${m}`)

      let status = p.status
      if (missing.length) {
        status = PRODUCT_STATUS.NEEDS_ATTENTION
      }

      updates.push({
        ...p,
        aspects: nextAspects,
        required_aspects: required,
        missing_aspects: missing,
        policy_flags: flags,
        policy_ok: missing.length === 0 && p.policy_ok !== false,
        status,
        human_approved: missing.length ? false : p.human_approved,
        updated_at: new Date().toISOString(),
      })
    } catch (err) {
      errors.push({ id: p.id, sku: p.supplier_sku, message: err?.message || String(err) })
    }
  }

  const next = updates.length ? upsertProducts(updates) : catalog
  return { catalog: next, updated: updates.length, errors }
}
