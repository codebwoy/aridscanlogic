import { useMemo, useState } from 'react'
import { Plus, Download } from 'lucide-react'
import { toast } from 'sonner'
import base44 from '@/lib/base44'
import { generateInvoicePdf } from '@/lib/pdfUtils'
import { calcDocDraftTotals, KLEINUNTERNEHMER_FOOTNOTE } from '@/lib/docCalculations'
import { loadProfile } from './ProfileSetup'
import { loadClients, loadProducts } from '@/lib/docdraftStore'

const DOC_TYPES = ['invoice', 'quote', 'receipt', 'credit_note', 'delivery_note']

export default function DocumentEditor({ doc, onSaved, onCancel }) {
  const profile = loadProfile()
  const isKleinunternehmer = !!profile.is_kleinunternehmer

  const [form, setForm] = useState(
    doc || {
      document_type: 'invoice',
      document_number: `INV-${Date.now().toString().slice(-6)}`,
      status: 'draft',
      issue_date: new Date().toISOString().slice(0, 10),
      due_date: '',
      currency: 'EUR',
      client_id: '',
      notes: '',
      line_items: [
        {
          description: '',
          quantity: 1,
          unit_price: 0,
          vat_rate: isKleinunternehmer ? 0 : 19,
        },
      ],
      discount_percent: 0,
    }
  )

  const totals = useMemo(
    () => calcDocDraftTotals(form.line_items, form.discount_percent, isKleinunternehmer),
    [form.line_items, form.discount_percent, isKleinunternehmer]
  )

  const updateLine = (idx, key, val) => {
    const lines = [...form.line_items]
    lines[idx] = { ...lines[idx], [key]: val }
    if (isKleinunternehmer && key !== 'description') {
      lines[idx].vat_rate = 0
    }
    setForm({ ...form, line_items: lines })
  }

  const clients = loadClients()
  const products = loadProducts()

  const addFromProduct = (product) => {
    setForm({
      ...form,
      line_items: [
        ...form.line_items,
        {
          description: product.description || product.name,
          quantity: 1,
          unit_price: product.unit_price,
          vat_rate: isKleinunternehmer ? 0 : product.vat_rate,
        },
      ],
    })
    toast.success(`Added ${product.name}`)
  }

  const addLine = () => {
    setForm({
      ...form,
      line_items: [
        ...form.line_items,
        {
          description: '',
          quantity: 1,
          unit_price: 0,
          vat_rate: isKleinunternehmer ? 0 : 19,
        },
      ],
    })
  }

  const save = async () => {
    try {
      const payload = {
        ...form,
        ...totals,
        profile_id: 'default',
        legal_footnote: totals.legal_footnote,
      }
      const saved = doc?.id
        ? await base44.entities.DocDraftDocument.update(doc.id, payload)
        : await base44.entities.DocDraftDocument.create(payload)
      toast.success('Dokument gespeichert')
      onSaved?.(saved)
    } catch {
      toast.error('Speichern fehlgeschlagen')
    }
  }

  const exportPdf = () => {
    try {
      generateInvoicePdf({ ...form, ...totals }, profile)
      toast.success('PDF erstellt')
    } catch {
      toast.error('PDF fehlgeschlagen')
    }
  }

  return (
    <div className="space-y-4">
      {isKleinunternehmer && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          {KLEINUNTERNEHMER_FOOTNOTE}
        </p>
      )}
      <select
        value={form.document_type}
        onChange={(e) => setForm({ ...form, document_type: e.target.value })}
        className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
      >
        {DOC_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <input
        value={form.document_number}
        onChange={(e) => setForm({ ...form, document_number: e.target.value })}
        className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
        placeholder="Dokumentnummer"
      />
      <select
        value={form.client_id}
        onChange={(e) => setForm({ ...form, client_id: e.target.value })}
        className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
      >
        <option value="">— Client —</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
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
          <option value="">+ From product catalog</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {p.unit_price}€
            </option>
          ))}
        </select>
      )}
      <input
        type="number"
        min="0"
        max="100"
        value={form.discount_percent}
        onChange={(e) =>
          setForm({ ...form, discount_percent: parseFloat(e.target.value) || 0 })
        }
        className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
        placeholder="Rabatt %"
      />
      {form.line_items.map((line, i) => {
        const calc = totals.line_items[i]
        return (
          <div key={i} className="space-y-2 rounded-xl bg-slate-800/60 p-3">
            <input
              placeholder="Beschreibung"
              value={line.description}
              onChange={(e) => updateLine(i, 'description', e.target.value)}
              className="w-full rounded-lg bg-slate-900 px-2 py-1.5 text-sm"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                placeholder="Menge"
                value={line.quantity}
                onChange={(e) => updateLine(i, 'quantity', parseFloat(e.target.value) || 0)}
                className="rounded-lg bg-slate-900 px-2 py-1.5 text-sm"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Einzelpreis (netto)"
                value={line.unit_price}
                onChange={(e) => updateLine(i, 'unit_price', parseFloat(e.target.value) || 0)}
                className="rounded-lg bg-slate-900 px-2 py-1.5 text-sm"
              />
              <select
                value={isKleinunternehmer ? 0 : line.vat_rate}
                disabled={isKleinunternehmer}
                onChange={(e) => updateLine(i, 'vat_rate', parseInt(e.target.value, 10))}
                className="rounded-lg bg-slate-900 px-2 py-1.5 text-sm disabled:opacity-50"
              >
                <option value={19}>19 %</option>
                <option value={7}>7 %</option>
                <option value={0}>0 %</option>
              </select>
            </div>
            <p className="text-right text-xs text-slate-500">
              {calc?.total_gross?.toFixed(2)} € brutto
            </p>
          </div>
        )
      })}
      <button type="button" onClick={addLine} className="flex items-center gap-2 text-sm text-brand-400">
        <Plus className="h-4 w-4" /> Position
      </button>
      <div className="rounded-xl bg-slate-800 p-3 text-sm space-y-1">
        <p>Zwischensumme (Netto): {totals.subtotal_net?.toFixed(2)} €</p>
        {!isKleinunternehmer &&
          Object.entries(totals.vat_breakdown || {}).map(([rate, amount]) =>
            Number(rate) > 0 ? (
              <p key={rate} className="text-slate-400">
                MwSt {rate} %: {amount.toFixed(2)} €
              </p>
            ) : null
          )}
        <p>MwSt gesamt: {totals.total_vat?.toFixed(2)} €</p>
        <p className="font-bold text-base">Brutto gesamt: {totals.total_gross?.toFixed(2)} €</p>
        {totals.legal_footnote && (
          <p className="mt-2 border-t border-slate-700 pt-2 text-xs italic text-slate-400">
            {totals.legal_footnote}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="flex-1 rounded-xl bg-slate-800 py-3">
          Abbrechen
        </button>
        <button type="button" onClick={exportPdf} className="rounded-xl bg-slate-700 px-4 py-3">
          <Download className="h-5 w-5" />
        </button>
        <button type="button" onClick={save} className="flex-1 rounded-xl bg-brand-600 py-3 font-semibold">
          Speichern
        </button>
      </div>
    </div>
  )
}
