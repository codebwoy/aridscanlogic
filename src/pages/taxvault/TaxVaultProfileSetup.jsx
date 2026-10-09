import { useState } from 'react'
import { ChevronRight, Rocket, GraduationCap } from 'lucide-react'
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

export default function TaxVaultProfileSetup({ onComplete, onOpenBizStart, onOpenFinanceEdu }) {
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
    <div className="w-full space-y-4">
      <header className="safe-top">
        <h1 className="text-2xl font-bold">Tax Vault Setup</h1>
        <p className="text-sm text-slate-400">Business profile for reports & exports</p>
      </header>

      {/* Visible before profile is complete — users were stuck without this */}
      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-300/90">
          Gründung &amp; Wachstum · ohne Profil nutzbar
        </p>
        <button
          type="button"
          onClick={() => onOpenBizStart?.()}
          className="flex w-full min-h-[64px] items-center gap-3 rounded-2xl border-2 border-violet-400/50 bg-gradient-to-r from-violet-950/80 via-violet-900/40 to-slate-900/60 px-4 py-3.5 text-left shadow-lg shadow-violet-950/40 transition active:scale-[0.99]"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/25 text-violet-200 ring-1 ring-violet-400/40">
            <Rocket className="h-6 w-6" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-bold tracking-tight text-white">
              BizStart Germany
            </span>
            <span className="mt-0.5 block text-[11px] leading-snug text-violet-200/80">
              Gewerbe · Listing · CV — jetzt öffnen (Setup unten optional)
            </span>
          </span>
          <ChevronRight className="h-5 w-5 shrink-0 text-violet-300" aria-hidden />
        </button>
        {onOpenFinanceEdu ? (
          <button
            type="button"
            onClick={() => onOpenFinanceEdu()}
            className="flex w-full min-h-[48px] items-center gap-3 rounded-xl border border-brand-500/35 bg-brand-950/30 px-3.5 py-2.5 text-left transition hover:border-brand-500/55"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-brand-200">
              <GraduationCap className="h-4 w-4" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-brand-100">Finanz-Bildung</span>
              <span className="block text-[11px] text-slate-500">Vermögen · Zielrechner</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-brand-400/80" aria-hidden />
          </button>
        ) : null}
      </div>

      <form onSubmit={submit} className="space-y-3 rounded-2xl bg-slate-800/60 p-5">
        <p className="text-xs font-semibold text-slate-300">Tax Vault Profil (für Belege & Reports)</p>
        <p className="text-[11px] text-slate-500">
          Pflicht nur für Belege, Steuer-Schätzungen und Export. BizStart braucht dieses Formular nicht.
        </p>
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
