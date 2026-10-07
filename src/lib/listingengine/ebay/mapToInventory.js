/**
 * Map Listing Engine session → eBay Inventory / Offer publish payload.
 */

import { formatCustomerListing } from '../exportListing'
import {
  emptyEbayPublishSettings,
  normalizeListingCopy,
  normalizeProductData,
} from '../schema'

export { emptyEbayPublishSettings }

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function textToHtml(text) {
  return escapeHtml(text)
    .split(/\n{2,}/)
    .map((p) => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
    .join('\n')
}

function conditionFromGerman(zustand) {
  const z = String(zustand || '').toLowerCase()
  if (z.includes('neu') || z === 'new') return 'NEW'
  if (z.includes('refurbished') || z.includes('generalüberholt')) return 'SELLER_REFURBISHED'
  if (z.includes('gebraucht') || z.includes('used')) return 'USED_GOOD'
  return 'NEW'
}

function buildAspects(product) {
  const p = normalizeProductData(product)
  const aspects = {}
  const put = (key, val) => {
    if (!val) return
    aspects[key] = [String(val)]
  }
  put('Marke', p.marke)
  put('Modell', p.modell)
  put('Farbe', p.farbe)
  put('Material', p.material)
  put('Größe', p.groesse)
  if (p.masse.breite) put('Breite', p.masse.breite)
  if (p.masse.hoehe) put('Höhe', p.masse.hoehe)
  if (p.masse.tiefe) put('Tiefe', p.masse.tiefe)
  if (p.masse.sitzhoehe) put('Sitzhöhe', p.masse.sitzhoehe)
  if (p.masse.gewicht) put('Gewicht', p.masse.gewicht)
  if (p.masse.tragfaehigkeit) put('Tragfähigkeit', p.masse.tragfaehigkeit)
  ;(p.spezifikationen || []).forEach((s) => {
    if (s.key && s.value) put(s.key, s.value)
  })
  return aspects
}

export function normalizeEbayPublishSettings(raw = {}) {
  return { ...emptyEbayPublishSettings(), ...raw }
}

/**
 * Build sanitized body for POST /api/ebay/publish
 */
export function buildEbayPublishPayload({
  product,
  listing,
  legal,
  economics,
  ebaySettings,
  humanApproved,
  complianceBlocked,
}) {
  const L = normalizeListingCopy(listing)
  const p = normalizeProductData(product)
  const settings = normalizeEbayPublishSettings(ebaySettings)
  const title = (L.seo_titel || L.titel || '').slice(0, 80)
  const plain = formatCustomerListing({
    listing: L,
    product: p,
    legal,
    includeLegal: true,
  })
  const description = textToHtml(plain)
  const price = economics?.selling_price || ''
  const sku = p.artikelnummer || p.ean || `sl-${Date.now()}`
  const imageUrls = String(settings.imageUrlsText || '')
    .split(/[\n,]+/)
    .map((u) => u.trim())
    .filter((u) => /^https:\/\//i.test(u))

  return {
    human_approved: !!humanApproved,
    compliance_blocked: !!complianceBlocked,
    sku,
    title,
    description,
    categoryId: settings.categoryId,
    merchantLocationKey: settings.merchantLocationKey,
    fulfillmentPolicyId: settings.fulfillmentPolicyId,
    paymentPolicyId: settings.paymentPolicyId,
    returnPolicyId: settings.returnPolicyId,
    currency: settings.currency || 'EUR',
    price: String(price || '').trim(),
    quantity: settings.quantity || '1',
    condition: conditionFromGerman(p.zustand),
    marketplaceId: settings.marketplaceId || 'EBAY_DE',
    aspects: buildAspects(p),
    imageUrls,
    ean: p.ean || '',
    offerId: settings.lastOfferId || undefined,
  }
}
