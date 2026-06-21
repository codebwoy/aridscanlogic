import { round2 } from '@/lib/taxCalculations'

export const KLEINUNTERNEHMER_FOOTNOTE =
  'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.'

/**
 * Line + document totals with German VAT rules.
 * Kleinunternehmer → 0% VAT on all lines; legal footnote required on output.
 * pricesIncludeVat: unit_price is gross (Brutto) — typical for retail-style invoices.
 */
export function calcLineItem(item, isKleinunternehmer, pricesIncludeVat = false) {
  const quantity = Number(item.quantity) || 0
  const unitPrice = Number(item.unit_price) || 0
  const vatRate = isKleinunternehmer ? 0 : Number(item.vat_rate) || 0

  if (pricesIncludeVat && vatRate > 0) {
    const gross = round2(quantity * unitPrice)
    const net = round2(gross / (1 + vatRate / 100))
    const vat = round2(gross - net)
    return {
      ...item,
      quantity,
      unit_price: unitPrice,
      vat_rate: vatRate,
      total_net: net,
      total_vat: vat,
      total_gross: gross,
    }
  }

  const net = round2(quantity * unitPrice)
  const vat = round2(net * (vatRate / 100))
  return {
    ...item,
    quantity,
    unit_price: unitPrice,
    vat_rate: vatRate,
    total_net: net,
    total_vat: vat,
    total_gross: round2(net + vat),
  }
}

export function calcDocDraftTotals(
  lineItems,
  discountPercent = 0,
  isKleinunternehmer = false,
  pricesIncludeVat = false
) {
  const calculated = (lineItems || []).map((item) =>
    calcLineItem(item, isKleinunternehmer, pricesIncludeVat)
  )
  const discountFactor = 1 - (Number(discountPercent) || 0) / 100

  const netBreakdown = {}
  const vatBreakdown = {}
  calculated.forEach((l) => {
    const rate = l.vat_rate
    if (!netBreakdown[rate]) netBreakdown[rate] = 0
    if (!vatBreakdown[rate]) vatBreakdown[rate] = 0
    netBreakdown[rate] = round2(netBreakdown[rate] + l.total_net * discountFactor)
    vatBreakdown[rate] = round2(vatBreakdown[rate] + l.total_vat * discountFactor)
  })

  const subtotalNet = round2(Object.values(netBreakdown).reduce((s, v) => s + v, 0))
  const totalVat = round2(Object.values(vatBreakdown).reduce((s, v) => s + v, 0))
  const totalGross = round2(subtotalNet + totalVat)

  return {
    line_items: calculated,
    subtotal_net: subtotalNet,
    total_vat: totalVat,
    net_breakdown: netBreakdown,
    vat_breakdown: vatBreakdown,
    total_gross: totalGross,
    prices_include_vat: pricesIncludeVat,
    legal_footnote: isKleinunternehmer ? KLEINUNTERNEHMER_FOOTNOTE : null,
  }
}
