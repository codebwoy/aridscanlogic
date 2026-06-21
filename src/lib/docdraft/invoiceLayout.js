import { docT } from './documentI18n'

export const INVOICE_LAYOUT = {
  margin: 18,
  pageWidth: 210,
  footerY: 248,
  companyFooterY: 252,
}

export function invoiceContentWidth(margin = INVOICE_LAYOUT.margin, pageWidth = INVOICE_LAYOUT.pageWidth) {
  return pageWidth - margin * 2
}

export function profileStreetLine(profile) {
  return [profile?.street, profile?.houseNumber].filter(Boolean).join(' ')
}

export function profileCityLine(profile) {
  return [profile?.plz, profile?.city].filter(Boolean).join(' ')
}

export function profileAddressLines(profile) {
  return [profileStreetLine(profile), profileCityLine(profile)].filter(Boolean)
}

export function profileOneLineAddress(profile) {
  const name = profile?.businessName || profile?.company_name || ''
  const parts = [name, ...profileAddressLines(profile)].filter(Boolean)
  return parts.join(' · ')
}

export function recipientFrom(doc, client) {
  return {
    companyName: doc.recipient_name || client?.companyName || client?.contactName,
    contactName:
      doc.recipient_contact ||
      (client?.companyName && client?.contactName ? client.contactName : undefined),
    billingAddress: doc.recipient_address || client?.billingAddress,
    shippingAddress: doc.recipient_shipping_address || client?.shippingAddress,
    email: doc.recipient_email || client?.email,
  }
}

export function recipientDisplayName(recipient) {
  return recipient?.companyName || recipient?.contactName || '—'
}

export function customerNumber(client) {
  if (!client?.id) return null
  const digits = String(client.id).replace(/\D/g, '')
  if (digits.length >= 6) return digits.slice(-8)
  return client.id.slice(-8).toUpperCase()
}

export function resolveProcessor(doc, profile) {
  const value = doc?.processor?.trim() || profile?.defaultProcessor?.trim()
  return value || null
}

export function lineItemsHaveProductMeta(lineItems) {
  return (lineItems || []).some((l) => l.lot_number || l.ean || l.expiry_date)
}

function pushCol(cols, key, label, x, w, align) {
  cols.push({ key, label, x, w, align })
  return x + w
}

export function buildTableColumns({ showPrices, showVat, showProductMeta, lang, margin, contentWidth }) {
  if (!showPrices) {
    const cols = []
    let x = margin
    x = pushCol(cols, 'pos', docT(lang, 'position'), x, 10)
    const descW = showProductMeta ? contentWidth - 98 : contentWidth - 54
    x = pushCol(cols, 'desc', docT(lang, 'description'), x, descW)
    if (showProductMeta) {
      x = pushCol(cols, 'lot', docT(lang, 'lotNumber'), x, 16)
      x = pushCol(cols, 'ean', docT(lang, 'ean'), x, 20)
      x = pushCol(cols, 'expiry', docT(lang, 'expiryDate'), x, 12)
    }
    pushCol(cols, 'qty', docT(lang, 'quantity'), margin + contentWidth - 44, 44, 'right')
    return cols
  }

  if (showProductMeta) {
    const cols = []
    let x = margin
    x = pushCol(cols, 'pos', docT(lang, 'position'), x, 8)
    x = pushCol(cols, 'desc', docT(lang, 'description'), x, showVat ? 36 : 42)
    x = pushCol(cols, 'lot', docT(lang, 'lotNumber'), x, 14)
    x = pushCol(cols, 'ean', docT(lang, 'ean'), x, 18)
    x = pushCol(cols, 'expiry', docT(lang, 'expiryDate'), x, 12)
    x = pushCol(cols, 'qty', docT(lang, 'quantity'), x, 12, 'right')
    x = pushCol(cols, 'price', docT(lang, 'unitPrice'), x, 16, 'right')
    if (showVat) x = pushCol(cols, 'vat', docT(lang, 'vat'), x, 9, 'right')
    pushCol(cols, 'total', docT(lang, 'total'), x, margin + contentWidth - x, 'right')
    return cols
  }

  if (showVat) {
    return [
      { key: 'pos', label: docT(lang, 'position'), x: margin, w: 10 },
      { key: 'desc', label: docT(lang, 'description'), x: margin + 10, w: 72 },
      { key: 'qty', label: docT(lang, 'quantity'), x: margin + 82, w: 18, align: 'right' },
      { key: 'price', label: docT(lang, 'unitPrice'), x: margin + 100, w: 24, align: 'right' },
      { key: 'vat', label: docT(lang, 'vat'), x: margin + 124, w: 14, align: 'right' },
      { key: 'total', label: docT(lang, 'total'), x: margin + 138, w: 36, align: 'right' },
    ]
  }

  return [
    { key: 'pos', label: docT(lang, 'position'), x: margin, w: 10 },
    { key: 'desc', label: docT(lang, 'description'), x: margin + 10, w: 84 },
    { key: 'qty', label: docT(lang, 'quantity'), x: margin + 94, w: 20, align: 'right' },
    { key: 'price', label: docT(lang, 'unitPrice'), x: margin + 114, w: 26, align: 'right' },
    { key: 'total', label: docT(lang, 'total'), x: margin + 140, w: 34, align: 'right' },
  ]
}

export function primaryVatRate(doc) {
  const rates = Object.keys(doc?.vat_breakdown || {})
    .map(Number)
    .filter((r) => r > 0)
  if (rates.length === 1) return rates[0]
  if (rates.length > 1) return null
  const fromLines = (doc?.line_items || []).map((l) => Number(l.vat_rate)).filter((r) => r > 0)
  return fromLines[0] ?? 19
}

export function formatVatRateLabel(rate) {
  return `${Number(rate).toFixed(2).replace('.', ',')} %`
}

/** Totals block rows matching classic DE invoice (inkl. MwSt → Netto → MwSt → Gesamt). */
export function invoiceTotalsRows(doc, { isKu = false } = {}) {
  if (isKu) {
    return [{ key: 'total', labelKey: 'gross', amount: doc.total_gross, bold: true }]
  }

  const rows = [
    { key: 'grossIncl', labelKey: 'grossInclVat', amount: doc.total_gross, bold: true },
  ]

  const rates = [
    ...new Set([
      ...Object.keys(doc?.net_breakdown || {}),
      ...Object.keys(doc?.vat_breakdown || {}),
    ]),
  ]
    .map(Number)
    .filter((r) => r > 0)
    .sort((a, b) => b - a)

  rates.forEach((rate) => {
    const net =
      doc.net_breakdown?.[rate] ??
      doc.net_breakdown?.[String(rate)] ??
      (rates.length === 1 ? doc.subtotal_net : undefined)
    const vat = doc.vat_breakdown?.[rate] ?? doc.vat_breakdown?.[String(rate)]

    if (net != null) {
      rows.push({ key: 'net', labelKey: 'net', rate, amount: net })
    }
    if (vat != null && vat > 0) {
      rows.push({ key: 'vat', labelKey: 'vat', rate, amount: vat })
    }
  })

  rows.push({ key: 'total', labelKey: 'gross', amount: doc.total_gross, bold: true })
  return rows
}
