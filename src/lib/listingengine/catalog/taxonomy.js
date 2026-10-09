/**
 * Suggest eBay category IDs via Taxonomy API and apply to catalog products.
 */

import { suggestEbayCategory } from '../ebay/client'
import { loadCatalog, upsertProducts } from './store'
import { isEbayConnected } from '../ebay/authStore'

/**
 * For products missing category_id, call Taxonomy suggestions from title/brand.
 */
export async function suggestCategoriesForCatalog({
  productIds = null,
  marketplaceId = 'EBAY_DE',
  onlyMissing = true,
  onProgress,
} = {}) {
  if (!isEbayConnected()) {
    throw new Error('eBay nicht verbunden.')
  }
  const catalog = loadCatalog()
  let targets = catalog.products
  if (Array.isArray(productIds) && productIds.length) {
    const set = new Set(productIds)
    targets = targets.filter((p) => set.has(p.id))
  }
  if (onlyMissing) {
    targets = targets.filter((p) => !p.category_id)
  }

  const updates = []
  const errors = []
  for (let i = 0; i < targets.length; i++) {
    const p = targets[i]
    const q = [p.brand, p.title, p.category_hint].filter(Boolean).join(' ').trim() || p.supplier_sku
    onProgress?.({ index: i + 1, total: targets.length, sku: p.supplier_sku })
    if (!q || q.length < 2) {
      errors.push({ id: p.id, message: 'no query text' })
      continue
    }
    try {
      const data = await suggestEbayCategory(q, marketplaceId)
      const top = data.suggestions?.[0]
      if (!top?.categoryId) {
        errors.push({ id: p.id, message: 'no suggestion' })
        continue
      }
      updates.push({
        ...p,
        category_id: top.categoryId,
        category_hint: top.categoryName || p.category_hint,
        category_suggestions: data.suggestions.slice(0, 5),
        updated_at: new Date().toISOString(),
      })
    } catch (err) {
      errors.push({ id: p.id, sku: p.supplier_sku, message: err?.message || String(err) })
    }
  }

  const next = updates.length ? upsertProducts(updates) : loadCatalog()
  return { catalog: next, updated: updates.length, errors }
}
