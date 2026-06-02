/** German tax formulas — simplified estimates, not legal advice */

export const MILEAGE_RATE_EUR = 0.3
export const VAT_RATES = { standard: 19, reduced: 7 }
export const GEWERBE_FREIBETRAG = 24500
export const GEWERBE_MESSZAHL = 0.035
export const DEFAULT_HEBESATZ = 400

export function calcVatFromGross(gross, ratePercent = 19) {
  const net = gross / (1 + ratePercent / 100)
  return {
    net: round2(net),
    vat: round2(gross - net),
    gross: round2(gross),
    rate: ratePercent,
  }
}

export function calcDeductible(amount, expenseType, businessPercent = 100) {
  if (expenseType === 'personal') return 0
  if (expenseType === 'business') return round2(amount)
  return round2((amount * businessPercent) / 100)
}

export function calcMileageDeduction(distanceKm, ratePerKm = MILEAGE_RATE_EUR) {
  return round2(distanceKm * ratePerKm)
}

/**
 * Gewerbesteuer: Freibetrag 24.500 €, Messzahl 3,5 % × Hebesatz (default 400).
 */
export function estimateGewerbesteuer(profit, hebesatz = DEFAULT_HEBESATZ) {
  const taxableProfit = Math.max(0, profit - GEWERBE_FREIBETRAG)
  const messbetrag = taxableProfit * GEWERBE_MESSZAHL
  return round2((messbetrag * hebesatz) / 100)
}

/**
 * Einkommensteuer — German progressive brackets up to 45 %.
 */
export function estimateEinkommensteuer(taxableIncome) {
  const zvE = Math.max(0, taxableIncome)
  if (zvE <= 11604) return 0
  if (zvE <= 17005) {
    const y = (zvE - 11604) / 5401
    return round2((922.98 * y + 1400) * y)
  }
  if (zvE <= 66760) {
    const z = (zvE - 17005) / 49755
    return round2((181.19 * z + 2397) * z + 1025.38)
  }
  if (zvE <= 277825) {
    return round2(0.42 * zvE - 10602.13)
  }
  return round2(0.45 * zvE - 18936.88)
}

/**
 * Umsatzsteuer liability = VAT collected on invoices − input VAT on business receipts.
 */
export function estimateUmsatzsteuer(vatCollected, inputVat) {
  return round2(vatCollected - inputVat)
}

export function sumVatFromInvoices(invoices = []) {
  return round2(
    invoices
      .filter((d) => ['invoice', 'quote'].includes(d.document_type))
      .reduce((s, d) => s + (d.total_vat || 0), 0)
  )
}

export function sumInputVatFromReceipts(receipts = []) {
  return round2(receipts.reduce((s, r) => s + (r.vat_amount || 0), 0))
}

export function computeTaxVaultSummary({
  expectedProfit = 0,
  receipts = [],
  mileage = [],
  invoices = [],
  hebesatz = DEFAULT_HEBESATZ,
}) {
  const mileageDed = mileage.reduce((s, m) => s + (m.deductible_amount || 0), 0)
  const expenseDed = receipts.reduce((s, r) => s + (r.deductible_amount || 0), 0)
  const taxableIncome = Math.max(0, expectedProfit - expenseDed - mileageDed)
  const vatCollected = sumVatFromInvoices(invoices)
  const inputVat = sumInputVatFromReceipts(receipts)

  return {
    taxableIncome,
    gewerbesteuer: estimateGewerbesteuer(taxableIncome, hebesatz),
    einkommensteuer: estimateEinkommensteuer(taxableIncome),
    umsatzsteuer: estimateUmsatzsteuer(vatCollected, inputVat),
    vatCollected,
    inputVat,
  }
}

export function round2(n) {
  return Math.round(n * 100) / 100
}
