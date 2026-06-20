import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Download, Send, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { calcDocDraftTotals } from '@/lib/docCalculations'
import { DOC_TYPES, UNIT_TYPES, TEMPLATES } from '@/lib/docdraft/constants'
import { DOC_LANGUAGES } from '@/lib/docdraft/documentI18n'
import { validateInvoice } from '@/lib/docdraft/validateDocument'
import {
  saveDocument,
  reserveDocumentNumber,
  getClient,
  loadProducts,
  loadClients,
  addAuditEntry,
} from '@/lib/docdraft/store'
import DocumentPreview from '@/components/docdraft/DocumentPreview'
import DocumentBrandingToggle, { useDocumentBranding } from '@/components/shared/DocumentBrandingToggle'
import { generateInvoicePdf } from '@/lib/pdfUtils'

const EMPTY_LINE = () => ({
  description: '',
  quantity: 1,
  unit_price: 0,
  vat_rate: 19,
  unit: 'piece',
})

export default function DocumentBuilder({
  profile,
  documentType = 'invoice',
  existingDoc,
  onSaved,
  onCancel,
  onSend,
}) {
  const isKu = !!profile?.isKleinunternehmer
  const isDelivery = documentType === 'delivery_note'
  const isReceipt = documentType === 'receipt'
  const isCredit = documentType === 'credit_note'
  const isQuote = documentType === 'quote'

  const [form, setForm] = useState(() => {
    if (existingDoc?.id) return { ...existingDoc }
    const today = new Date().toISOString().slice(0, 10)
    const due = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10)
    return {
      document_type: documentType,
      document_number: '',
      status: 'draft',
      issue_date: today,
      delivery_date: today,
      due_date: due,
      valid_until: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      currency: profile?.defaultCurrency || 'EUR',
      client_id: '',
      line_items: [EMPTY_LINE()],
      discount_percent: 0,
      notes: '',
      footer: profile?.defaultFooter || '',
      payment_terms: profile?.defaultPaymentTerms || '',
      templateId: profile?.defaultTemplateId || 'classic',
      linked_invoice_number: '',
      credit_reason: '',
      language: existingDoc?.language || profile?.defaultLanguage || 'de',
    }
  })

  const [reservedNumber, setReservedNumber] = useState(false)
  const { includeBranding, setIncludeBranding } = useDocumentBranding()

  const clients = loadClients(profile.id)
  const client = form.client_id ? getClient(profile.id, form.client_id) : null
  const products = loadProducts(profile.id)

  const totals = useMemo(
    () => calcDocDraftTotals(form.line_items, form.discount_percent, isKu),
    [form.line_items, form.discount_percent, isKu]
  )

  const previewDoc = useMemo(
    () => ({
      ...form,
      ...totals,
      recipient_name: client?.companyName || client?.contactName,
      recipient_address: client?.billingAddress,
    }),
    [form, totals, client]
  )

  const validation = useMemo(
    () => validateInvoice(previewDoc, profile, client),
    [previewDoc, profile, client]
  )

  const ensureNumber = () => {
    if (form.document_number || reservedNumber) return form.document_number
    const { number, profile: updated } = reserveDocumentNumber(profile, documentType)
    setReservedNumber(true)
    setForm((f) => ({ ...f, document_number: number }))
    return number
  }

  const updateLine = (idx, key, val) => {
    const lines = [...form.line_items]
    lines[idx] = { ...lines[idx], [key]: val }
    if (isKu && key !== 'description') lines[idx].vat_rate = 0
    setForm({ ...form, line_items: lines })
  }

  const addFromProduct = (p) => {
    setForm({
      ...form,
      line_items: [
        ...form.line_items,
        {
          description: p.description || p.name,
          quantity: 1,
          unit_price: p.unitPrice,
          vat_rate: isKu ? 0 : p.vatRate,
          unit: p.unit || 'piece',
          sku: p.sku,
        },
      ],
    })
  }

  const buildPayload = (status) => ({
    ...form,
    ...totals,
    profile_id: profile.id,
    status,
    legal_footnote: totals.legal_footnote,
    vat_breakdown: totals.vat_breakdown,
  })

  const handleSaveDraft = async () => {
    try {
      if (!form.document_number) ensureNumber()
      const saved = await saveDocument(buildPayload('draft'), profile)
      toast.success('Draft saved')
      onSaved?.(saved)
    } catch {
      toast.error('Save failed')
    }
  }

  const handleFinalize = async () => {
    const { valid, errors } = validation
    if (!valid) {
      toast.error(errors[0])
      return
    }
    try {
      ensureNumber()
      const saved = await saveDocument(buildPayload('sent'), profile)
      addAuditEntry(saved.id, 'finalized', form.document_number)
      toast.success('Document finalized')
      onSend?.(saved)
    } catch {
      toast.error('Finalize failed')
    }
  }

  const handlePdf = async () => {
    try {
      await generateInvoicePdf(
        {
          ...previewDoc,
          document_type: form.document_type,
        },
        profile,
        client,
        { branding: includeBranding, lang: form.language }
      )
    } catch {
      toast.error('PDF failed')
    }
  }

  return (
    <div className="space-y-4 pb-8">
      {!validation.valid && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200">
          <p className="mb-1 flex items-center gap-1 font-semibold">
            <AlertCircle className="h-4 w-4" /> Missing required fields
          </p>
          <ul className="list-inside list-disc">
            {validation.errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4">
        <div className="space-y-3">
          <select
            value={form.client_id}
            onChange={(e) => setForm({ ...form, client_id: e.target.value })}
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
          >
            <option value="">Select client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.companyName || c.contactName}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={form.issue_date}
            onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
          />
          {!isQuote && !isReceipt && (
            <input
              type="date"
              value={form.delivery_date}
              onChange={(e) => setForm({ ...form, delivery_date: e.target.value })}
              placeholder="Leistungsdatum"
              className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
            />
          )}
          {isQuote && (
            <input
              type="date"
              value={form.valid_until}
              onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
              className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
            />
          )}
          {!isDelivery && !isReceipt && (
            <input
              type="date"
              value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
            />
          )}
          {isCredit && (
            <>
              <input
                placeholder="Original invoice number"
                value={form.linked_invoice_number}
                onChange={(e) => setForm({ ...form, linked_invoice_number: e.target.value })}
                className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
              />
              <input
                placeholder="Reason for credit"
                value={form.credit_reason}
                onChange={(e) => setForm({ ...form, credit_reason: e.target.value })}
                className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
              />
            </>
          )}
          <select
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
            aria-label="Document language"
          >
            {DOC_LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>

          <select
            value={form.templateId}
            onChange={(e) => setForm({ ...form, templateId: e.target.value })}
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
          >
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {products.length > 0 && (
            <select
              className="w-full rounded-lg border border-brand-500/30 bg-slate-800 px-3 py-2 text-sm"
              defaultValue=""
              onChange={(e) => {
                const p = products.find((x) => x.id === e.target.value)
                if (p) addFromProduct(p)
                e.target.value = ''
              }}
            >
              <option value="">+ From catalog</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}

          {form.line_items.map((line, i) => (
            <div key={i} className="premium-card space-y-2 p-3">
              <input
                placeholder="Description"
                value={line.description}
                onChange={(e) => updateLine(i, 'description', e.target.value)}
                className="w-full rounded-lg bg-slate-900/80 px-2 py-1.5 text-sm"
              />
              <div className="grid grid-cols-4 gap-1">
                <input
                  type="number"
                  value={line.quantity}
                  onChange={(e) => updateLine(i, 'quantity', parseFloat(e.target.value) || 0)}
                  className="rounded-lg bg-slate-900/80 px-2 py-1.5 text-sm"
                />
                <select
                  value={line.unit}
                  onChange={(e) => updateLine(i, 'unit', e.target.value)}
                  className="rounded-lg bg-slate-900/80 px-1 py-1.5 text-xs"
                >
                  {UNIT_TYPES.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                {!isDelivery && (
                  <>
                    <input
                      type="number"
                      step="0.01"
                      value={line.unit_price}
                      onChange={(e) => updateLine(i, 'unit_price', parseFloat(e.target.value) || 0)}
                      className="rounded-lg bg-slate-900/80 px-2 py-1.5 text-sm"
                    />
                    <select
                      value={isKu ? 0 : line.vat_rate}
                      disabled={isKu}
                      onChange={(e) => updateLine(i, 'vat_rate', parseInt(e.target.value, 10))}
                      className="rounded-lg bg-slate-900/80 px-1 py-1.5 text-xs"
                    >
                      <option value={19}>19%</option>
                      <option value={7}>7%</option>
                      <option value={0}>0%</option>
                    </select>
                  </>
                )}
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setForm({ ...form, line_items: [...form.line_items, EMPTY_LINE()] })} className="flex items-center gap-2 text-sm text-brand-400">
            <Plus className="h-4 w-4" /> Line item
          </button>

          {!isDelivery && (
            <div className="premium-card p-3 text-sm">
              <p>Subtotal (Net): {totals.subtotal_net?.toFixed(2)} €</p>
              {!isKu &&
                Object.entries(totals.vat_breakdown || {}).map(([r, a]) =>
                  Number(r) > 0 ? (
                    <p key={r} className="text-slate-400">
                      VAT {r}%: {a.toFixed(2)} €
                    </p>
                  ) : null
                )}
              <p className="font-bold">Total Gross: {totals.total_gross?.toFixed(2)} €</p>
            </div>
          )}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:sticky lg:top-4">
          <p className="mb-2 text-xs font-medium text-slate-500">Live preview</p>
          <DocumentPreview doc={previewDoc} profile={profile} client={client} lang={form.language} />
        </motion.div>
      </div>

      <DocumentBrandingToggle checked={includeBranding} onChange={setIncludeBranding} className="mb-2" />

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onCancel} className="flex-1 rounded-xl bg-slate-800 py-3 text-sm">
          Cancel
        </button>
        <button type="button" onClick={handlePdf} className="rounded-xl bg-slate-700 px-4 py-3">
          <Download className="h-5 w-5" />
        </button>
        <button type="button" onClick={handleSaveDraft} className="flex-1 rounded-xl bg-slate-700 py-3 text-sm">
          Save draft
        </button>
        <button type="button" onClick={handleFinalize} className="btn-primary flex flex-1 items-center justify-center gap-2 py-3 text-sm">
          <Send className="h-4 w-4" /> Finalize
        </button>
      </div>
    </div>
  )
}
