import base44 from '@/lib/base44'
import { ensureDefaultProfile, saveDocument, reserveDocumentNumber } from './store'

/** Create a draft invoice from a scanned Document entity */
export async function createDraftFromScan(doc) {
  const profile = ensureDefaultProfile()
  const { number, profile: updatedProfile } = reserveDocumentNumber(profile, 'invoice')
  const text = doc.ocr_text || ''
  const amountMatch = text.match(/(\d+[.,]\d{2})\s*€|EUR\s*(\d+[.,]\d{2})/i)
  const gross = amountMatch
    ? parseFloat((amountMatch[1] || amountMatch[2]).replace(',', '.'))
    : 0
  const vatRate = profile.isKleinunternehmer ? 0 : 19
  const net = vatRate ? gross / (1 + vatRate / 100) : gross
  const vat = gross - net

  const saved = await saveDocument(
    {
      document_type: 'invoice',
      document_number: number,
      status: 'draft',
      issue_date: new Date().toISOString().slice(0, 10),
      due_date: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      client_name: doc.title || 'From scan',
      line_items: [
        {
          description: doc.title || 'Scanned document',
          quantity: 1,
          unit_price: net,
          vat_rate: vatRate,
        },
      ],
      total_net: net,
      total_vat: vat,
      total_gross: gross,
      notes: text.slice(0, 2000),
    },
    updatedProfile
  )

  if (doc.pages?.[0]) {
    await base44.entities.DocDraftDocument.update(saved.id, {
      attachment_url: doc.pages[0],
    })
  }

  return saved
}
