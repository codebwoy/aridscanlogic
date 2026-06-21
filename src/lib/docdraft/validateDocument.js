import { KLEINUNTERNEHMER_FOOTNOTE } from '@/lib/docCalculations'

export function validateInvoice(doc, profile, client) {
  const errors = []
  const warnings = []

  if (!profile?.businessName) errors.push('Business name required')
  if (!profile?.steuernummer && !profile?.ustIdNr) {
    errors.push('Steuernummer or USt-IdNr. required on invoice')
  }
  if (!profile?.street || !profile?.city) errors.push('Business address incomplete')
  if (!doc.recipient_name?.trim()) errors.push('Recipient name required (Empfänger)')
  if (!client && !doc.recipient_address?.trim()) {
    errors.push('Recipient address required (Rechnungsadresse)')
  }
  if (!doc.issue_date) errors.push('Invoice date (Rechnungsdatum) required')
  if (!doc.document_number) errors.push('Invoice number required')
  if (!doc.delivery_date && doc.document_type === 'invoice') {
    warnings.push('Leistungsdatum recommended')
  }
  if (!doc.line_items?.length) errors.push('At least one line item required')
  if (!profile?.iban) warnings.push('IBAN recommended for payment')
  if (!doc.due_date) warnings.push('Payment deadline (Zahlungsziel) recommended')

  doc.line_items?.forEach((l, i) => {
    if (!l.description) errors.push(`Line ${i + 1}: description required`)
  })

  if (profile?.isKleinunternehmer) {
    if (!doc.legal_footnote?.includes('§19')) {
      doc.legal_footnote = KLEINUNTERNEHMER_FOOTNOTE
    }
    if ((doc.total_vat || 0) > 0) {
      errors.push('Kleinunternehmer: keine USt auf Rechnung ausweisen (§ 14c UStG)')
    }
  }

  if (!profile?.isKleinunternehmer && (doc.total_gross || 0) > 250) {
    if ((doc.total_vat || 0) === 0) {
      warnings.push('VAT breakdown required for invoices over €250 (§ 14 UStG)')
    }
    if (!profile?.steuernummer && !profile?.ustIdNr) {
      warnings.push('Steuernummer or USt-IdNr. required on invoice (§ 14 Abs. 4 UStG)')
    }
  }

  if (client?.ustIdNr && doc.document_type === 'invoice') {
    if (!doc.reverse_charge_notice) {
      warnings.push('EU B2B: reverse charge notice may be required')
    }
  }

  return { valid: errors.length === 0, errors, warnings }
}
