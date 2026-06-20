import { KLEINUNTERNEHMER_FOOTNOTE } from '@/lib/docCalculations'

export const DOC_LANGUAGES = [
  { id: 'de', label: 'Deutsch' },
  { id: 'en', label: 'English' },
]

const DOC_TYPE_LABELS = {
  invoice: { de: { title: 'RECHNUNG', label: 'Rechnung' }, en: { title: 'INVOICE', label: 'Invoice' } },
  quote: { de: { title: 'ANGEBOT', label: 'Angebot' }, en: { title: 'QUOTE', label: 'Quote' } },
  receipt: { de: { title: 'QUITTUNG', label: 'Quittung' }, en: { title: 'RECEIPT', label: 'Receipt' } },
  credit_note: {
    de: { title: 'GUTSCHRIFT', label: 'Gutschrift' },
    en: { title: 'CREDIT NOTE', label: 'Credit note' },
  },
  delivery_note: {
    de: { title: 'LIEFERSCHEIN', label: 'Lieferschein' },
    en: { title: 'DELIVERY NOTE', label: 'Delivery note' },
  },
}

const STRINGS = {
  de: {
    number: 'Nr.',
    date: 'Datum',
    deliveryDate: 'Leistungsdatum',
    dueDate: 'Zahlungsziel',
    validUntil: 'Gültig bis',
    recipient: 'Empfänger',
    description: 'Beschreibung',
    quantity: 'Menge',
    unitPrice: 'Einzel',
    vat: 'MwSt',
    total: 'Gesamt',
    net: 'Netto',
    gross: 'Brutto',
    payment: 'Zahlung',
    reference: 'Verwendungszweck',
    linkedInvoice: 'Bezieht sich auf Rechnung',
    reverseCharge: 'Steuerschuldnerschaft des Leistungsempfängers',
    kleinunternehmer: KLEINUNTERNEHMER_FOOTNOTE,
    thankYou: 'Vielen Dank für Ihre Zusammenarbeit!',
    taxId: 'St.-Nr.',
    vatId: 'USt-IdNr.',
    sepaQr: 'SEPA QR-Zahlung',
    amountInWords: 'Betrag in Worten',
  },
  en: {
    number: 'No.',
    date: 'Date',
    deliveryDate: 'Service date',
    dueDate: 'Due date',
    validUntil: 'Valid until',
    recipient: 'Recipient',
    description: 'Description',
    quantity: 'Qty',
    unitPrice: 'Unit',
    vat: 'VAT',
    total: 'Total',
    net: 'Net',
    gross: 'Gross',
    payment: 'Payment',
    reference: 'Payment reference',
    linkedInvoice: 'Referencing invoice',
    reverseCharge: 'Reverse charge — VAT due by recipient',
    kleinunternehmer: 'No VAT charged pursuant to § 19 UStG (small business regulation).',
    thankYou: 'Thank you for your business!',
    taxId: 'Tax ID',
    vatId: 'VAT ID',
    sepaQr: 'SEPA QR payment',
    amountInWords: 'Amount in words',
  },
}

const UNIT_LABELS = {
  piece: { de: 'Stk', en: 'pc' },
  hour: { de: 'Std', en: 'hr' },
  day: { de: 'Tag', en: 'day' },
  kg: { de: 'kg', en: 'kg' },
  flat: { de: 'Pausch.', en: 'flat' },
  month: { de: 'Mon.', en: 'mo' },
  year: { de: 'Jahr', en: 'yr' },
  km: { de: 'km', en: 'km' },
}

export function resolveDocumentLanguage(doc, profile, override) {
  const lang = override || doc?.language || profile?.defaultLanguage || 'de'
  return lang === 'en' ? 'en' : 'de'
}

export function docTypeLabels(documentType, lang) {
  const l = lang === 'en' ? 'en' : 'de'
  const entry = DOC_TYPE_LABELS[documentType] || DOC_TYPE_LABELS.invoice
  return entry[l]
}

export function docT(lang, key) {
  const l = lang === 'en' ? 'en' : 'de'
  return STRINGS[l][key] ?? STRINGS.de[key] ?? key
}

export function unitLabel(unit, lang) {
  const l = lang === 'en' ? 'en' : 'de'
  return UNIT_LABELS[unit]?.[l] || unit || (l === 'de' ? 'Stk' : 'pc')
}

export function formatDocumentDate(iso, lang) {
  if (!iso) return '—'
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString(lang === 'en' ? 'en-GB' : 'de-DE')
  } catch {
    return iso
  }
}

export function formatMoney(amount, currency = 'EUR', lang = 'de') {
  const n = Number(amount)
  if (Number.isNaN(n)) return '—'
  const sym = currency === 'EUR' ? '€' : currency
  const formatted = n.toFixed(2)
  return lang === 'en' ? `${sym}${formatted}` : `${formatted} ${sym}`
}
