import { round2 } from '@/lib/taxCalculations'

export const KLEINUNTERNEHMER_FOOTNOTE =
  'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.'

/**
 * Line + document totals with German VAT rules.
 * Kleinunternehmer → 0% VAT on all lines; legal footnote required on output.
 */
export function calcLineItem(item, isKleinunternehmer) {
  const quantity = Number(item.quantity) || 0
  const unitPrice = Number(item.unit_price) || 0
  const net = round2(quantity * unitPrice)
  const vatRate = isKleinunternehmer ? 0 : Number(item.vat_rate) || 0
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

export function calcDocDraftTotals(lineItems, discountPercent = 0, isKleinunternehmer = false) {
  const calculated = (lineItems || []).map((item) => calcLineItem(item, isKleinunternehmer))
  const discountFactor = 1 - (Number(discountPercent) || 0) / 100

  const subtotalNet = round2(
    calculated.reduce((s, l) => s + l.total_net, 0) * discountFactor
  )

  const vatBreakdown = {}
  calculated.forEach((l) => {
    const rate = l.vat_rate
    if (!vatBreakdown[rate]) vatBreakdown[rate] = 0
    vatBreakdown[rate] = round2(vatBreakdown[rate] + l.total_vat * discountFactor)
  })

  const totalVat = round2(Object.values(vatBreakdown).reduce((s, v) => s + v, 0))
  const totalGross = round2(subtotalNet + totalVat)

  return {
    line_items: calculated,
    subtotal_net: subtotalNet,
    total_vat: totalVat,
    vat_breakdown: vatBreakdown,
    total_gross: totalGross,
    legal_footnote: isKleinunternehmer ? KLEINUNTERNEHMER_FOOTNOTE : null,
  }
}
