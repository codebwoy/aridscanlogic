export const DOC_TYPES = {
  invoice: { label: 'Rechnung', prefix: 'RE', title: 'RECHNUNG' },
  quote: { label: 'Angebot', prefix: 'ANG', title: 'ANGEBOT' },
  receipt: { label: 'Quittung', prefix: 'QU', title: 'QUITTUNG' },
  credit_note: { label: 'Gutschrift', prefix: 'GU', title: 'GUTSCHRIFT' },
  delivery_note: { label: 'Lieferschein', prefix: 'LS', title: 'LIEFERSCHEIN' },
}

export const PAYMENT_STATUSES = [
  'draft',
  'sent',
  'viewed',
  'partially_paid',
  'paid',
  'overdue',
  'cancelled',
  'disputed',
  'accepted',
  'rejected',
  'expired',
]

export const UNIT_TYPES = [
  'piece',
  'hour',
  'day',
  'kg',
  'flat',
  'month',
  'year',
  'km',
]

export const TEMPLATES = [
  { id: 'classic', name: 'Classic German' },
  { id: 'minimal', name: 'Modern Minimal' },
  { id: 'bold', name: 'Bold Header' },
  { id: 'compact', name: 'Compact' },
  { id: 'bilingual', name: 'Bilingual DE/EN' },
]

export const DEFAULT_PROFILE = {
  businessName: '',
  legalStructure: 'Einzelunternehmer',
  logoUrl: '',
  street: '',
  houseNumber: '',
  plz: '',
  city: '',
  country: 'Deutschland',
  phone: '',
  email: '',
  website: '',
  steuernummer: '',
  ustIdNr: '',
  bankName: '',
  iban: '',
  bic: '',
  defaultCurrency: 'EUR',
  defaultVatRate: 19,
  defaultPaymentTerms: 'Zahlbar innerhalb von 14 Tagen',
  defaultLanguage: 'de',
  defaultFooter: 'Vielen Dank für Ihre Zusammenarbeit!',
  isKleinunternehmer: false,
  invoiceFormat: 'RE-{YEAR}-{NUMBER}',
  numberPadding: 4,
  sequences: {
    invoice: 1,
    quote: 1,
    receipt: 1,
    credit_note: 1,
    delivery_note: 1,
  },
  defaultTemplateId: 'classic',
  headerColor: '#4f46e5',
}
