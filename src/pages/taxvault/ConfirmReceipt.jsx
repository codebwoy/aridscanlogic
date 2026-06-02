import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'
import base44 from '@/lib/base44'
import { getAllCategories } from '@/lib/taxvault/categories'
import { calcDeductibleAmount } from '@/lib/taxvault/stats'
import { loadTaxVaultProfile, loadTaxVaultSettings } from '@/lib/taxvault/profile'

export default function ConfirmReceipt({ draft, imageUrl, onBack, onSaved, manualEntry = false }) {
  const profile = loadTaxVaultProfile()
  const settings = loadTaxVaultSettings()
  const categories = getAllCategories()
  const [form, setForm] = useState({
    vendor_name: draft.vendor_name || '',
    purchase_date: draft.purchase_date || new Date().toISOString().slice(0, 10),
    total_amount: draft.total_amount ?? '',
    vat_amount: draft.vat_amount ?? '',
    currency: draft.currency || profile.homeCurrency || 'EUR',
    converted_amount: draft.converted_amount ?? '',
    exchange_rate: draft.exchange_rate ?? '',
    category: draft.category || settings.defaultCategory || 'Other Business Expense',
    note: '',
    expense_type: 'business',
    business_use_pct: 100,
    is_recurring: false,
    recurring_interval: 'monthly',
    tax_year: new Date().getFullYear(),
  })
  const [saving, setSaving] = useState(false)

  const homeCurrency = profile.homeCurrency || 'EUR'
  const isForeign = form.currency !== homeCurrency

  const save = async () => {
    const total = parseFloat(form.total_amount)
    if (!total || total <= 0) {
      toast.error('Enter a valid total amount')
      return
    }
    setSaving(true)
    try {
      const vat = parseFloat(form.vat_amount) || 0
      const converted =
        isForeign && form.converted_amount
          ? parseFloat(form.converted_amount)
          : total
      const deductible = calcDeductibleAmount(
        converted,
        form.expense_type,
        form.business_use_pct
      )
      await base44.entities.Receipt.create({
        vendor_name: form.vendor_name || 'Unknown',
        purchase_date: form.purchase_date,
        total_amount: total,
        vat_amount: vat,
        currency: form.currency,
        converted_amount: converted,
        home_currency: homeCurrency,
        category: form.category,
        note: manualEntry
          ? [form.note, '(Manual entry — no receipt scan)'].filter(Boolean).join(' ')
          : form.note,
        expense_type: form.expense_type,
        business_use_pct: form.business_use_pct,
        deductible_amount: deductible,
        tax_year: form.tax_year,
        image_url: imageUrl || null,
        manual_entry: manualEntry,
        is_recurring: form.is_recurring,
        recurring_interval: form.is_recurring ? form.recurring_interval : null,
      })
      toast.success('Saved to Tax Vault')
      onSaved?.()
    } catch (err) {
      toast.error('Could not save receipt')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="px-4 pb-4">
      <button type="button" onClick={onBack} className="safe-top mb-3 flex items-center gap-1 text-sm text-slate-400">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      <h2 className="mb-4 text-xl font-bold">{manualEntry ? 'Log manual expense' : 'Confirm Receipt Details'}</h2>
      {manualEntry && (
        <p className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          No receipt scan — this expense will be flagged in your tax summary.
        </p>
      )}
      {imageUrl && (
        <img src={imageUrl} alt="Receipt" className="mb-4 max-h-40 w-full rounded-xl object-contain bg-slate-900" />
      )}
      <div className="space-y-3">
        {[
          ['vendor_name', 'Vendor / Store', 'text'],
          ['purchase_date', 'Purchase date', 'date'],
          ['total_amount', 'Total amount', 'number'],
          ['vat_amount', 'VAT / tax amount', 'number'],
          ['currency', 'Currency', 'text'],
        ].map(([key, label, type]) => (
          <label key={key} className="block">
            <span className="text-xs text-slate-400">{label}</span>
            <input
              type={type}
              step={type === 'number' ? '0.01' : undefined}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="mt-1 w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
            />
          </label>
        ))}
        {isForeign && (
          <>
            <label className="block">
              <span className="text-xs text-slate-400">Exchange rate</span>
              <input
                type="number"
                step="0.0001"
                value={form.exchange_rate}
                onChange={(e) => {
                  const rate = parseFloat(e.target.value)
                  const total = parseFloat(form.total_amount) || 0
                  setForm({
                    ...form,
                    exchange_rate: e.target.value,
                    converted_amount: rate ? (total * rate).toFixed(2) : '',
                  })
                }}
                className="mt-1 w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs text-slate-400">Amount in {homeCurrency}</span>
              <input
                type="number"
                step="0.01"
                value={form.converted_amount}
                onChange={(e) => setForm({ ...form, converted_amount: e.target.value })}
                className="mt-1 w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
              />
            </label>
          </>
        )}
        <label className="block">
          <span className="text-xs text-slate-400">Category</span>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="mt-1 w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
          >
            {categories.map((c) => (
              <option key={c.id || c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs text-slate-400">Note (optional)</span>
          <textarea
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            rows={2}
            className="mt-1 w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
          />
        </label>
        <div>
          <span className="text-xs text-slate-400">Expense type</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {['business', 'personal', 'mixed'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, expense_type: t })}
                className={`rounded-full px-3 py-1 text-xs capitalize ${
                  form.expense_type === t ? 'bg-brand-600' : 'bg-slate-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        {form.expense_type === 'mixed' && (
          <div>
            <span className="text-xs text-slate-400">
              Business use: {form.business_use_pct}%
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={form.business_use_pct}
              onChange={(e) => setForm({ ...form, business_use_pct: Number(e.target.value) })}
              className="mt-2 w-full"
            />
          </div>
        )}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_recurring}
            onChange={(e) => setForm({ ...form, is_recurring: e.target.checked })}
          />
          Recurring expense
        </label>
        {form.is_recurring && (
          <select
            value={form.recurring_interval}
            onChange={(e) => setForm({ ...form, recurring_interval: e.target.value })}
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annually">Annually</option>
          </select>
        )}
      </div>
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="mt-6 w-full rounded-xl bg-brand-600 py-3 font-semibold disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save to Tax Vault'}
      </button>
    </div>
  )
}
