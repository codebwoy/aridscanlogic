/**
 * Duplicate detection across catalog: EAN/UPC/MPN + fuzzy title.
 */

function normId(v) {
  return String(v || '')
    .replace(/\D/g, '')
    .trim()
}

function normTitle(t) {
  return String(t || '')
    .toLowerCase()
    .replace(/[^a-z0-9äöüß]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function titleSimilarity(a, b) {
  const ta = normTitle(a)
  const tb = normTitle(b)
  if (!ta || !tb) return 0
  if (ta === tb) return 1
  const wa = new Set(ta.split(' ').filter((w) => w.length > 2))
  const wb = new Set(tb.split(' ').filter((w) => w.length > 2))
  if (!wa.size || !wb.size) return 0
  let inter = 0
  for (const w of wa) if (wb.has(w)) inter++
  return inter / Math.max(wa.size, wb.size)
}

/**
 * Mark duplicates on products (mutates copies). Returns { products, duplicateCount }.
 */
export function flagDuplicates(products) {
  const byEan = new Map()
  const byUpc = new Map()
  const byMpn = new Map()
  let duplicateCount = 0

  const out = products.map((p) => ({ ...p, duplicate_of: '', duplicate_flags: [] }))

  out.forEach((p, i) => {
    const flags = []
    const ean = normId(p.ean)
    const upc = normId(p.upc)
    const mpn = String(p.mpn || '')
      .toLowerCase()
      .trim()

    if (ean.length >= 8) {
      if (byEan.has(ean)) {
        flags.push(`ean:${byEan.get(ean)}`)
      } else byEan.set(ean, p.supplier_sku || p.id)
    }
    if (upc.length >= 8) {
      if (byUpc.has(upc)) {
        flags.push(`upc:${byUpc.get(upc)}`)
      } else byUpc.set(upc, p.supplier_sku || p.id)
    }
    if (mpn.length >= 3 && p.brand) {
      const key = `${String(p.brand).toLowerCase()}|${mpn}`
      if (byMpn.has(key)) {
        flags.push(`mpn:${byMpn.get(key)}`)
      } else byMpn.set(key, p.supplier_sku || p.id)
    }

    // Fuzzy title vs earlier products
    for (let j = 0; j < i; j++) {
      const sim = titleSimilarity(p.title, out[j].title)
      if (sim >= 0.85) {
        flags.push(`title:${out[j].supplier_sku || out[j].id}`)
        break
      }
    }

    if (flags.length) {
      duplicateCount++
      out[i].duplicate_flags = flags
      out[i].duplicate_of = flags[0]
      out[i].policy_flags = [...new Set([...(p.policy_flags || []), 'duplicate', ...flags])]
      out[i].policy_ok = false
    }
  })

  return { products: out, duplicateCount }
}
