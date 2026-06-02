import { useState } from 'react'
import { CheckCircle, Clock, FileDown, Send, ArrowRightLeft } from 'lucide-react'
import { toast } from 'sonner'
import base44 from '@/lib/base44'
import { getAuditLog, addPayment, getTotalPaid, loadPayments } from '@/lib/docdraft/store'
import { convertQuoteToInvoice } from '@/lib/docdraft/convertQuote'
import { generateInvoicePdf } from '@/lib/pdfUtils'
import DocumentPreview from '@/components/docdraft/DocumentPreview'
import { getClient } from '@/lib/docdraft/store'

export default function DocumentDetail({ doc, profile, onBack, onUpdated, onSend }) {
  const [payments, setPayments] = useState(() => loadPayments(doc.id))
  const [converting, setConverting] = useState(false)
  const audit = getAuditLog(doc.id)
  const client = doc.client_id ? getClient(profile.id, doc.client_id) : null
  const paid = getTotalPaid(doc.id)
  const remaining = (doc.total_gross || 0) - paid

  const markPaid = async () => {
    const amount = remaining > 0 ? remaining : doc.total_gross
    addPayment(doc.id, {
      amount,
      paymentDate: new Date().toISOString().slice(0, 10),
      paymentMethod: 'bank_transfer',
    })
    await base44.entities.DocDraftDocument.update(doc.id, {
      status: 'paid',
      paid_at: new Date().toISOString(),
    })
    setPayments(loadPayments(doc.id))
    toast.success('Marked as paid')
    onUpdated?.()
  }

  const downloadPdf = async () => {
    await generateInvoicePdf(doc, {
      company_name: profile.businessName,
      steuernummer: profile.steuernummer,
      ust_id_nr: profile.ustIdNr,
      iban: profile.iban,
      bic: profile.bic,
      is_kleinunternehmer: profile.isKleinunternehmer,
    })
    toast.success('PDF downloaded')
  }

  const convertQuote = async () => {
    setConverting(true)
    try {
      const invoice = await convertQuoteToInvoice(doc, profile)
      toast.success(`Invoice ${invoice.document_number} created`)
      onUpdated?.()
    } catch (e) {
      toast.error(e.message || 'Conversion failed')
    } finally {
      setConverting(false)
    }
  }

  return (
    <div className="px-4 pb-4">
      <button type="button" onClick={onBack} className="safe-top mb-4 text-sm text-slate-400">
        ← Back
      </button>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">{doc.document_number}</h2>
        <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs capitalize">{doc.status}</span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {doc.status !== 'paid' && doc.status !== 'draft' && (
          <button
            type="button"
            onClick={markPaid}
            className="btn-primary flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm min-w-[140px]"
          >
            <CheckCircle className="h-4 w-4" /> Mark paid
          </button>
        )}
        <button
          type="button"
          onClick={downloadPdf}
          className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm"
        >
          <FileDown className="h-4 w-4" /> PDF
        </button>
        {onSend && doc.status !== 'void' && (
          <button
            type="button"
            onClick={() => onSend(doc)}
            className="flex items-center gap-2 rounded-xl bg-brand-600/30 px-4 py-3 text-sm"
          >
            <Send className="h-4 w-4" /> Send
          </button>
        )}
        {doc.document_type === 'quote' && doc.status !== 'accepted' && (
          <button
            type="button"
            onClick={convertQuote}
            disabled={converting}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-500/40 py-3 text-sm text-brand-300"
          >
            <ArrowRightLeft className="h-4 w-4" />
            {converting ? 'Converting…' : 'Convert to invoice'}
          </button>
        )}
      </div>

      {paid > 0 && (
        <p className="mb-4 text-sm text-slate-400">
          €{paid.toFixed(2)} of €{doc.total_gross?.toFixed(2)} paid — €{remaining.toFixed(2)} remaining
        </p>
      )}

      <DocumentPreview doc={doc} profile={profile} client={client} />

      <div className="premium-card mt-4 p-4">
        <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Audit trail</p>
        {audit.length === 0 ? (
          <p className="text-xs text-slate-600">No events yet</p>
        ) : (
          audit.map((a) => (
            <div key={a.id} className="flex gap-2 border-b border-slate-700/50 py-2 text-xs last:border-0">
              <Clock className="mt-0.5 h-3 w-3 shrink-0 text-slate-500" />
              <div>
                <p className="text-slate-300">{a.action}</p>
                <p className="text-slate-600">{new Date(a.performedAt).toLocaleString('de-DE')}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="mt-4 text-[10px] text-slate-600">
        GoBD: Finalized documents require typing DELETE to remove. Keep invoices 10 years.
      </p>
    </div>
  )
}
