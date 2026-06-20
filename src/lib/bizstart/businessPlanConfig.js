/** Business plan wizard — structure based on gruenderplattform.de template (self-employment). */

export const BUSINESS_PLAN_STEPS = [
  'meta',
  'summary',
  'production',
  'customers',
  'idea',
  'market',
  'values',
  'sales',
  'organization',
  'competencies',
  'partners',
  'company',
  'risks',
  'finances',
  'annexes',
  'review',
]

export function businessPlanProgressPct(stepIndex) {
  return Math.round(((stepIndex + 1) / BUSINESS_PLAN_STEPS.length) * 100)
}

export function planningYearLabels(draft) {
  const start = Number(draft.planStartYear) || new Date().getFullYear()
  return [start, start + 1, start + 2]
}

export function defaultRevenueLines() {
  return [
    { id: 'rev-1', nameDe: 'Hauptdienstleistung', nameEn: 'Main service', y1: '', y2: '', y3: '' },
    { id: 'rev-2', nameDe: 'Zusatzleistung', nameEn: 'Additional service', y1: '', y2: '', y3: '' },
  ]
}

export function defaultOperatingCosts() {
  return [
    { id: 'oc-office', nameDe: 'Büromaterial', nameEn: 'Office supplies', y1: '', y2: '', y3: '' },
    { id: 'oc-lit', nameDe: 'Fachliteratur', nameEn: 'Professional literature', y1: '', y2: '', y3: '' },
    { id: 'oc-it', nameDe: 'Instandhaltung IT-Geräte', nameEn: 'IT maintenance', y1: '', y2: '', y3: '' },
    { id: 'oc-rent', nameDe: 'Miete / Nebenkosten', nameEn: 'Rent / utilities', y1: '', y2: '', y3: '' },
    { id: 'oc-online', nameDe: 'Online-Vertrieb / Marketing', nameEn: 'Online marketing', y1: '', y2: '', y3: '' },
    { id: 'oc-comms', nameDe: 'Telefon, Porto, Internet', nameEn: 'Phone, postage, internet', y1: '', y2: '', y3: '' },
    { id: 'oc-print', nameDe: 'Visitenkarten / Flyer', nameEn: 'Business cards / flyers', y1: '', y2: '', y3: '' },
    { id: 'oc-training', nameDe: 'Weiterbildung', nameEn: 'Training', y1: '', y2: '', y3: '' },
  ]
}

export function defaultPrivateCosts() {
  return [
    { id: 'pc-house', nameDe: 'Haushaltsgeld', nameEn: 'Household allowance', y1: '', y2: '', y3: '' },
    { id: 'pc-health', nameDe: 'Kranken- und Pflegeversicherung', nameEn: 'Health insurance', y1: '', y2: '', y3: '' },
    { id: 'pc-rent', nameDe: 'Miete (Privatanteil)', nameEn: 'Rent (private share)', y1: '', y2: '', y3: '' },
    { id: 'pc-pension', nameDe: 'Rentenversicherung', nameEn: 'Pension insurance', y1: '', y2: '', y3: '' },
    { id: 'pc-util', nameDe: 'Strom, Wasser, Heizung', nameEn: 'Utilities', y1: '', y2: '', y3: '' },
    { id: 'pc-tax', nameDe: 'Rücklage Einkommensteuer', nameEn: 'Income tax reserve', y1: '', y2: '', y3: '' },
  ]
}

export function defaultInvestments() {
  return [
    { id: 'inv-1', nameDe: 'Computer / Arbeitsgeräte', nameEn: 'Computer / equipment', amount: '' },
    { id: 'inv-2', nameDe: 'Büroeinrichtung', nameEn: 'Office furniture', amount: '' },
    { id: 'inv-3', nameDe: 'Telefon / Drucker', nameEn: 'Phone / printer', amount: '' },
  ]
}

export function lineName(line, lang) {
  if (!line) return ''
  if (lang === 'de') return line.nameDe || line.nameEn || line.name || ''
  return line.nameEn || line.nameDe || line.name || ''
}

export function sumYear(lines, key) {
  return (lines || []).reduce((acc, row) => acc + (Number(row[key]) || 0), 0)
}

export function sumAmount(lines) {
  return (lines || []).reduce((acc, row) => acc + (Number(row.amount) || 0), 0)
}

export function fmtEuro(n, lang = 'de') {
  const val = Number(n) || 0
  return val.toLocaleString(lang === 'de' ? 'de-DE' : 'en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}
