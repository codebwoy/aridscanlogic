import { saveDocument, reserveDocumentNumber, addAuditEntry } from './store'
import appApi from '@/lib/appApi'

export async function convertQuoteToInvoice(quote, profile) {
  if (quote.document_type !== 'quote') {
    throw new Error('Only quotes can be converted')
  }
  const { number, profile: updatedProfile } = reserveDocumentNumber(profile, 'invoice')
  const { id: _id, document_number: _num, status: _st, created_date, updated_date, ...rest } = quote
  const invoice = await saveDocument(
    {
      ...rest,
      document_type: 'invoice',
      document_number: number,
      status: 'draft',
      issue_date: new Date().toISOString().slice(0, 10),
      due_date: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      converted_from: quote.id,
    },
    updatedProfile
  )
  await appApi.entities.DocDraftDocument.update(quote.id, {
    status: 'accepted',
    converted_to: invoice.id,
  })
  addAuditEntry(quote.id, 'converted_to_invoice', invoice.document_number)
  addAuditEntry(invoice.id, 'created_from_quote', quote.document_number)
  return invoice
}
