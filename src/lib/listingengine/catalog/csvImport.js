/**
 * Multi-row supplier CSV/JSON → catalog products.
 * Licensed feeds only — no marketplace scraping.
 */

import { emptyCatalogProduct, PRODUCT_STATUS } from './schema'

/** Default column aliases (case-insensitive). */
export const DEFAULT_COLUMN_MAP = {
  supplier_sku: ['sku', 'supplier_sku', 'artikelnummer', 'item_sku', 'product_sku'],
  title: ['title', 'titel', 'name', 'product_name', 'produktname'],
  description: ['description', 'beschreibung', 'desc', 'product_description'],
  brand: ['brand', 'marke', 'manufacturer', 'hersteller'],
  mpn: ['mpn', 'herstellerreferenz', 'manufacturer_part', 'modell'],
  ean: ['ean', 'gtin', 'barcode'],
  upc: ['upc'],
  images: ['images', 'image', 'image_url', 'image_urls', 'bilder', 'photo'],
  weight: ['weight', 'gewicht', 'weight_kg'],
  supplier_cost: ['cost', 'price', 'wholesale', 'einkaufspreis', 'supplier_cost', 'net_price'],
  shipping_cost: ['shipping', 'shipping_cost', 'versand', 'supplier_shipping'],
  stock_qty: ['stock', 'qty', 'quantity', 'bestand', 'stock_qty', 'available'],
  category_hint: ['category', 'kategorie', 'category_hint', 'ebay_category'],
  category_id: ['category_id', 'ebay_category_id', 'leaf_category_id'],
}

function normalizeHeader(h) {
  return String(h || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
}

function parseCsvLine(line) {
  const out = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        cur += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',' || c === ';') {
      out.push(cur.trim())
      cur = ''
    } else {
      cur += c
    }
  }
  out.push(cur.trim())
  return out
}

export function parseCsvText(text) {
  const lines = String(text || '')
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((l) => l.trim().length)
  if (lines.length < 2) {
    throw new Error('CSV needs a header row and at least one data row.')
  }
  const headers = parseCsvLine(lines[0]).map(normalizeHeader)
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i])
    if (cols.every((c) => !c)) continue
    const row = {}
    headers.forEach((h, idx) => {
      row[h] = cols[idx] ?? ''
    })
    rows.push(row)
  }
  return { headers, rows }
}

function resolveField(row, field, columnMap) {
  const aliases = columnMap[field] || DEFAULT_COLUMN_MAP[field] || [field]
  for (const alias of aliases) {
    const key = normalizeHeader(alias)
    if (row[key] != null && String(row[key]).trim() !== '') {
      return String(row[key]).trim()
    }
  }
  return ''
}

function splitImages(raw) {
  return String(raw || '')
    .split(/[|;,\n]+/)
    .map((u) => u.trim())
    .filter((u) => /^https?:\/\//i.test(u))
    .slice(0, 12)
}

function numish(v) {
  if (v == null || v === '') return ''
  const n = Number(String(v).replace(',', '.').replace(/[^\d.-]/g, ''))
  return Number.isFinite(n) ? String(n) : ''
}

/**
 * Map raw rows → catalog products. Dedupes by supplier_sku within the batch.
 */
export function rowsToCatalogProducts(rows, { columnMap = DEFAULT_COLUMN_MAP } = {}) {
  const seen = new Set()
  const products = []
  const errors = []

  rows.forEach((row, idx) => {
    const supplier_sku = resolveField(row, 'supplier_sku', columnMap)
    const title = resolveField(row, 'title', columnMap)
    if (!supplier_sku && !title) {
      errors.push({ row: idx + 2, message: 'Missing sku and title' })
      return
    }
    const skuKey = supplier_sku || `row_${idx + 2}`
    if (seen.has(skuKey)) {
      errors.push({ row: idx + 2, message: `Duplicate SKU ${skuKey}` })
      return
    }
    seen.add(skuKey)

    const images = splitImages(resolveField(row, 'images', columnMap))
    const stockRaw = resolveField(row, 'stock_qty', columnMap)
    const stock_qty = Math.max(0, Number.parseInt(stockRaw || '0', 10) || 0)

    products.push(
      emptyCatalogProduct({
        status: PRODUCT_STATUS.IMPORTED,
        supplier_sku: supplier_sku || skuKey,
        title: title.slice(0, 80),
        description: resolveField(row, 'description', columnMap),
        brand: resolveField(row, 'brand', columnMap),
        mpn: resolveField(row, 'mpn', columnMap),
        ean: resolveField(row, 'ean', columnMap),
        upc: resolveField(row, 'upc', columnMap),
        images,
        weight: resolveField(row, 'weight', columnMap),
        supplier_cost: numish(resolveField(row, 'supplier_cost', columnMap)),
        shipping_cost: numish(resolveField(row, 'shipping_cost', columnMap)),
        stock_qty,
        category_hint: resolveField(row, 'category_hint', columnMap),
        category_id: resolveField(row, 'category_id', columnMap).replace(/\D/g, ''),
      })
    )
  })

  return { products, errors }
}

export function importCsvText(text, options) {
  const { rows } = parseCsvText(text)
  return rowsToCatalogProducts(rows, options)
}

export function importJsonText(text, options) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('Invalid JSON')
  }
  const rows = Array.isArray(data)
    ? data
    : Array.isArray(data?.products)
      ? data.products
      : Array.isArray(data?.items)
        ? data.items
        : null
  if (!rows) throw new Error('JSON must be an array or { products: [] }')
  const normalized = rows.map((r) => {
    if (!r || typeof r !== 'object') return {}
    const out = {}
    for (const [k, v] of Object.entries(r)) {
      out[normalizeHeader(k)] = v == null ? '' : String(v)
    }
    return out
  })
  return rowsToCatalogProducts(normalized, options)
}

export const SAMPLE_CSV = `sku,title,description,brand,mpn,ean,images,cost,shipping,stock,category_id
WH-001,LED Schreibtischlampe Schwarz 10W,Energieeffiziente LED-Lampe mit Touch-Dimmer. Material Metall/Kunststoff. Farbe Schwarz.,Homelux,HL-LED-10W,4006381333931,https://picsum.photos/seed/wh001/1000/1000,12.50,3.90,25,20697
WH-002,Kabelorganizer Set 5er,Set mit 5 Kabelbindern und Clips. Farbe Grau. Keine weiteren Spezifikationen angegeben.,CablePro,CP-ORG-5,,https://picsum.photos/seed/wh002/1000/1000,4.20,2.50,100,67084
`
