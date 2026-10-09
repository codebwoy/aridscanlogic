/**
 * Template-based title/description from supplier data — no invented specs.
 */

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

/** Build ≤80 char title from supplier fields only. */
export function buildTitle(product) {
  const parts = [
    product.brand,
    product.title || product.mpn,
    product.mpn && product.title && !String(product.title).includes(product.mpn)
      ? product.mpn
      : '',
  ].filter(Boolean)
  let title = parts.join(' ').replace(/\s+/g, ' ').trim()
  if (!title) title = product.supplier_sku || 'Artikel'
  return title.slice(0, 80)
}

/** Plain + HTML description from verified supplier fields only. */
export function buildDescription(product, { legalHtml = '' } = {}) {
  const lines = []
  if (product.description) lines.push(product.description.trim())
  const details = []
  if (product.brand) details.push(`Marke: ${product.brand}`)
  if (product.mpn) details.push(`Hersteller-Nr.: ${product.mpn}`)
  if (product.ean) details.push(`EAN: ${product.ean}`)
  if (product.weight) details.push(`Gewicht: ${product.weight}`)
  if (details.length) {
    lines.push('')
    lines.push('Produktdetails (laut Lieferant):')
    lines.push(...details.map((d) => `• ${d}`))
  }
  lines.push('')
  lines.push(
    'Hinweis: Angaben gemäß Lieferantendaten. Keine zusätzlichen Eigenschaften erfunden.'
  )
  const plain = lines.join('\n').trim()
  let html = textToHtml(plain)
  if (legalHtml) {
    html += `\n<hr/>\n${legalHtml}`
  }
  return { plain, html }
}

export function buildAspects(product) {
  const aspects = {}
  const put = (k, v) => {
    if (!v) return
    aspects[k] = [String(v)]
  }
  put('Marke', product.brand)
  put('Herstellernummer', product.mpn)
  put('EAN', product.ean)
  if (product.aspects && typeof product.aspects === 'object') {
    for (const [k, v] of Object.entries(product.aspects)) {
      if (!k) continue
      aspects[k] = Array.isArray(v) ? v.map(String) : [String(v)]
    }
  }
  return aspects
}

/**
 * Ensure titles are unique across a batch (append SKU suffix if needed).
 */
export function uniquifyTitles(products) {
  const seen = new Map()
  return products.map((p) => {
    let title = (p.title || buildTitle(p)).slice(0, 80)
    const key = title.toLowerCase()
    if (seen.has(key)) {
      const suffix = ` ${p.supplier_sku}`.slice(0, 20)
      title = `${title.slice(0, Math.max(0, 80 - suffix.length))}${suffix}`.trim()
    }
    seen.set(title.toLowerCase(), true)
    return { ...p, title }
  })
}
