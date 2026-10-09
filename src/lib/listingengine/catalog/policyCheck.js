/**
 * Policy checklist — blocks listing for spam, prohibited keywords, missing required fields.
 */

import { normalizeCatalogSettings } from './schema'

function isAllCapsSpam(title) {
  const letters = String(title || '').replace(/[^A-Za-zÄÖÜäöüß]/g, '')
  if (letters.length < 8) return false
  const upper = letters.replace(/[^A-ZÄÖÜ]/g, '').length
  return upper / letters.length > 0.85
}

function keywordStuffing(title) {
  const words = String(title || '')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
  if (words.length < 4) return false
  const freq = {}
  for (const w of words) {
    if (w.length < 3) continue
    freq[w] = (freq[w] || 0) + 1
    if (freq[w] >= 3) return true
  }
  return false
}

/**
 * @returns {{ ok: boolean, flags: string[] }}
 */
export function runPolicyCheck(product, settings) {
  const s = normalizeCatalogSettings(settings)
  const flags = []
  const title = String(product.title || '')
  const desc = String(product.description || '')
  const blob = `${title} ${desc}`.toLowerCase()

  if (!title.trim()) flags.push('missing_title')
  if (title.length > 80) flags.push('title_too_long')
  if (!product.supplier_sku) flags.push('missing_sku')
  if (!desc.trim() || desc.trim().length < 40) flags.push('thin_description')
  if (!product.images?.length) flags.push('missing_images')
  if (product.stock_qty <= 0) flags.push('out_of_stock')
  if (!product.supplier_cost || Number(product.supplier_cost) <= 0) {
    flags.push('missing_cost')
  }
  if (!product.category_id && !s.default_category_id) {
    flags.push('missing_category')
  }
  if (isAllCapsSpam(title)) flags.push('all_caps_spam')
  if (keywordStuffing(title)) flags.push('keyword_stuffing')

  for (const kw of s.prohibited_keywords || []) {
    const k = String(kw).toLowerCase().trim()
    if (k && blob.includes(k)) {
      flags.push(`prohibited:${k}`)
    }
  }

  // Brand/MPN soft warnings (don't always block)
  if (!product.brand) flags.push('warn:missing_brand')
  if (!product.ean && !product.mpn) flags.push('warn:missing_ean_mpn')

  const hard = flags.filter((f) => !f.startsWith('warn:'))
  return { ok: hard.length === 0, flags }
}
