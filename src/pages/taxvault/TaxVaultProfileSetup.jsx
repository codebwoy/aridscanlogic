import { useState } from 'react'
import { toast } from 'sonner'
import { saveTaxVaultProfile } from '@/lib/taxvault/profile'

const BUSINESS_TYPES = [
  { id: 'sole_trader', label: 'Sole trader' },
  { id: 'freelancer', label: 'Freelancer' },
  { id: 'limited', label: 'Limited company' },
  { id: 'partnership', label: 'Partnership' },
]

const CURRENCIES = ['EUR', 'USD', 'GBP', 'CHF']
const MONTHS = [
  { v: 1, l: 'January' },
  { v: 4, l: 'April (UK)' },
  { v: 7, l: 'July' },
]

export default function TaxVaultProfileSetup({ onComplete }) {
  const [form, setForm] = useState({
    businessName: '',
    ownerName: '',
    taxId: '',
    vatNumber: '',
    address: '',
    businessType: 'sole_trader',
    homeCurrency: 'EUR',
    taxYearStartMonth: 1,
    accountantName: '',
    accountantEmail: '',
  })

  const submit = (e) => {
    e.preventDefault()
    if (!form.businessName.trim() || !form.ownerName.trim()) {
      toast.error('Business name and owner name are required')
      return
    }
    saveTaxVaultProfile(form)
    toast.success('Tax Vault profile saved')
    onComplete?.()
  }

  const field = (key, label, type = 'text', placeholder = '') => (
    <label className="block">
      <span className="text-xs text-slate-400">{label}</span>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
      />
    </label>
  )

  return (
    <div className="w-full">
      <header className="safe-top mb-4">
        <h1 className="text-2xl font-bold">Tax Vault Setup</h1>
        <p className="text-sm text-slate-400">Business profile for reports & exports</p>
      </header>
      <form onSubmit={submit} className="space-y-3 rounded-2xl bg-slate-800/60 p-5">
        {field('businessName', 'Business name *')}
        {field('ownerName', 'Owner full name *')}
        {field('taxId', 'Tax ID')}
        {field('vatNumber', 'VAT number')}
        {field('address', 'Business address')}
        <label className="block">
          <span className="text-xs text-slate-400">Business type</span>
          <select
            value={form.businessType}
            onChange={(e) => setForm({ ...form, businessType: e.target.value })}
            className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
          >
            {BUSINESS_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs text-slate-400">Home currency</span>
          <select
            value={form.homeCurrency}
            onChange={(e) => setForm({ ...form, homeCurrency: e.target.value })}
            className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs text-slate-400">Tax year start month</span>
          <select
            value={form.taxYearStartMonth}
            onChange={(e) => setForm({ ...form, taxYearStartMonth: Number(e.target.value) })}
            className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
          >
            {MONTHS.map((m) => (
              <option key={m.v} value={m.v}>
                {m.l}
              </option>
            ))}
          </select>
        </label>
        {field('accountantName', 'Accountant name (optional)')}
        {field('accountantEmail', 'Accountant email', 'email')}
        <button type="submit" className="mt-2 w-full rounded-xl bg-brand-600 py-3 font-semibold">
          Start Tax Vault
        </button>
      </form>
    </div>
  )
}
