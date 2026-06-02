import { getCategoryByName } from './categories'

export function filterByTaxYear(receipts, taxYear) {
  return receipts.filter((r) => (r.tax_year || new Date(r.purchase_date).getFullYear()) === taxYear)
}

export function filterMileageByTaxYear(logs, taxYear) {
  return (logs || []).filter((m) => (m.tax_year || new Date(m.trip_date).getFullYear()) === taxYear)
}

export function computeReceiptStats(receipts, taxYear, mileageLogs = []) {
  const yearReceipts = filterByTaxYear(receipts, taxYear)
  const yearMileage = filterMileageByTaxYear(mileageLogs, taxYear)
  const mileageDeductible = yearMileage.reduce((s, m) => s + (m.deductible_amount || 0), 0)
  const mileageKm = yearMileage.reduce((s, m) => s + (m.distance_km || 0), 0)

  const totalExpenses = yearReceipts.reduce((s, r) => s + (r.total_amount || 0), 0)
  const totalVat = yearReceipts.reduce((s, r) => s + (r.vat_amount || 0), 0)
  const totalDeductible =
    yearReceipts.reduce((s, r) => s + (r.deductible_amount || 0), 0) + mileageDeductible
  const personalPortion = yearReceipts
    .filter((r) => r.expense_type === 'mixed' || r.expense_type === 'personal')
    .reduce((s, r) => {
      if (r.expense_type === 'personal') return s + (r.total_amount || 0)
      const pct = r.business_use_pct ?? 100
      return s + (r.total_amount || 0) * (1 - pct / 100)
    }, 0)

  const categoriesUsed = new Set(yearReceipts.map((r) => r.category).filter(Boolean)).size
  const missingScans = yearReceipts.filter((r) => !r.image_url).length

  const byCategory = {}
  yearReceipts.forEach((r) => {
    const cat = r.category || 'Other'
    if (!byCategory[cat]) byCategory[cat] = { count: 0, gross: 0, vat: 0, deductible: 0 }
    byCategory[cat].count++
    byCategory[cat].gross += r.total_amount || 0
    byCategory[cat].vat += r.vat_amount || 0
    byCategory[cat].deductible += r.deductible_amount || 0
  })
  if (mileageDeductible > 0) {
    if (!byCategory['Travel & Transport']) {
      byCategory['Travel & Transport'] = { count: 0, gross: 0, vat: 0, deductible: 0 }
    }
    byCategory['Travel & Transport'].count += yearMileage.length
    byCategory['Travel & Transport'].deductible += mileageDeductible
    byCategory['Travel & Transport'].gross += mileageDeductible
  }

  const byMonth = Array(12).fill(0)
  yearReceipts.forEach((r) => {
    const d = r.purchase_date ? new Date(r.purchase_date) : new Date()
    byMonth[d.getMonth()] += r.total_amount || 0
  })
  yearMileage.forEach((m) => {
    const d = m.trip_date ? new Date(m.trip_date) : new Date()
    byMonth[d.getMonth()] += m.deductible_amount || 0
  })

  const donutData = Object.entries(byCategory).map(([name, data]) => {
    const meta = getCategoryByName(name)
    return { name, value: data.gross, color: meta.color || '#64748b' }
  })

  return {
    count: yearReceipts.length,
    mileageTrips: yearMileage.length,
    mileageKm,
    mileageDeductible,
    totalExpenses,
    totalVat,
    totalDeductible,
    personalPortion,
    categoriesUsed,
    missingScans,
    byCategory,
    byMonth,
    donutData,
    receipts: yearReceipts,
    mileage: yearMileage,
  }
}

export function calcDeductibleAmount(total, expenseType, businessUsePct = 100) {
  if (expenseType === 'personal') return 0
  if (expenseType === 'business') return total
  return total * (businessUsePct / 100)
}

export function getTaxYearLabel(taxYear, startMonth = 1) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  const start = months[startMonth - 1] || 'January'
  return `${start} ${taxYear} – December ${taxYear}`
}
