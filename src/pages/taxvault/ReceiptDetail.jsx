import { useState } from 'react'
import { ChevronLeft, Trash2, Share2, FileDown, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import base44 from '@/lib/base44'
import { loadTaxVaultProfile } from '@/lib/taxvault/profile'
import { getCategoryByName, getAllCategories } from '@/lib/taxvault/categories'
import { calcDeductibleAmount } from '@/lib/taxvault/stats'
import { exportReceiptPdf } from '@/lib/taxvault/exportReport'

export default function ReceiptDetail({ receipt, onBack, onUpdated }) {
  const profile = loadTaxVaultProfile()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...receipt })
  const sym = profile.homeCurrency === 'EUR' ? '€' : profile.homeCurrency
  const cat = getCategoryByName(receipt.category)

  const saveEdit = async () => {
    try {
      const total = parseFloat(form.total_amount) || 0
      const deductible = calcDeductibleAmount(
        form.converted_amount || total,
        form.expense_type,
        form.business_use_pct ?? 100
      )
      await base44.entities.Receipt.update(receipt.id, {
        ...form,
        deductible_amount: deductible,
      })
      toast.success('Receipt updated')
      setEditing(false)
      onUpdated?.()
    } catch {
      toast.error('Update failed')
    }
  }

  const remove = async () => {
    if (!window.confirm('Delete this receipt permanently? This cannot be undone.')) return
    try {
      await base44.entities.Receipt.delete(receipt.id)
      toast.success('Receipt deleted')
      onBack?.()
      onUpdated?.()
    } catch {
      toast.error('Delete failed')
    }
  }

  const share = () => {
    const text = `${receipt.vendor_name} — ${sym}${receipt.total_amount?.toFixed(2)} — ${receipt.purchase_date}`
    if (navigator.share) {
      navigator.share({ title: 'Receipt', text, url: receipt.image_url }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard')
    }
  }

  const exportPdf = async () => {
    try {
      await exportReceiptPdf(editing ? { ...receipt, ...form } : receipt, profile)
      toast.success('PDF downloaded')
    } catch {
      toast.error('PDF export failed')
    }
  }

  return (
    <div className="px-4 pb-4">
      <button type="button" onClick={onBack} className="safe-top mb-3 flex items-center gap-1 text-sm text-slate-400">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      {receipt.image_url && (
        <a href={receipt.image_url} target="_blank" rel="noreferrer" className="block mb-4">
          <img
            src={receipt.image_url}
            alt="Receipt"
            className="max-h-64 w-full rounded-xl object-contain bg-slate-900"
          />
        </a>
      )}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold">{receipt.vendor_name}</h2>
          <span
            className="mt-1 inline-block rounded-full px-2 py-0.5 text-xs"
            style={{ backgroundColor: `${cat.color}33`, color: cat.color }}
          >
            {receipt.category}
          </span>
        </div>
        <p className="text-2xl font-bold text-brand-300">
          {sym}
          {receipt.total_amount?.toFixed(2)}
        </p>
      </div>
      {editing ? (
        <div className="space-y-2">
          <input
            value={form.vendor_name}
            onChange={(e) => setForm({ ...form, vendor_name: e.target.value })}
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={form.purchase_date?.slice(0, 10)}
            onChange={(e) => setForm({ ...form, purchase_date: e.target.value })}
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
          >
            {getAllCategories().map((c) => (
              <option key={c.id || c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <label className="block text-xs text-slate-400">
            Tax year
            <input
              type="number"
              value={form.tax_year || ''}
              onChange={(e) => setForm({ ...form, tax_year: parseInt(e.target.value, 10) })}
              className="mt-1 w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
            />
          </label>
          <textarea
            value={form.note || ''}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
            rows={2}
          />
          <button type="button" onClick={saveEdit} className="w-full rounded-xl bg-brand-600 py-2 text-sm font-semibold">
            Save changes
          </button>
        </div>
      ) : (
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Date</dt>
            <dd>{receipt.purchase_date}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">VAT</dt>
            <dd>
              {sym}
              {receipt.vat_amount?.toFixed(2)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Currency</dt>
            <dd>{receipt.currency}</dd>
          </div>
          {receipt.converted_amount && receipt.currency !== receipt.home_currency && (
            <div className="flex justify-between">
              <dt className="text-slate-500">In {receipt.home_currency}</dt>
              <dd>
                {sym}
                {receipt.converted_amount?.toFixed(2)}
              </dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-slate-500">Business use</dt>
            <dd>{receipt.business_use_pct ?? 100}%</dd>
          </div>
          <div className="flex justify-between font-medium text-emerald-400">
            <dt>Deductible</dt>
            <dd>
              {sym}
              {receipt.deductible_amount?.toFixed(2)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Tax year</dt>
            <dd>{receipt.tax_year}</dd>
          </div>
          {receipt.note && (
            <div>
              <dt className="text-slate-500">Note</dt>
              <dd className="mt-1">{receipt.note}</dd>
            </div>
          )}
        </dl>
      )}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-2 text-sm"
        >
          <Pencil className="h-4 w-4" /> Edit
        </button>
        <button
          type="button"
          onClick={exportPdf}
          className="flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-2 text-sm"
        >
          <FileDown className="h-4 w-4" /> Export
        </button>
        <button
          type="button"
          onClick={share}
          className="flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-2 text-sm"
        >
          <Share2 className="h-4 w-4" /> Share
        </button>
        <button
          type="button"
          onClick={remove}
          className="flex items-center gap-1 rounded-xl border border-red-500/40 px-3 py-2 text-sm text-red-400"
        >
          <Trash2 className="h-4 w-4" /> Delete
        </button>
      </div>
    </div>
  )
}
