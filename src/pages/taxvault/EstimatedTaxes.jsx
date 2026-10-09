import { useMemo } from 'react'
import { Info } from 'lucide-react'
import { computeTaxVaultSummary } from '@/lib/taxCalculations'

function TaxMetric({ title, value, max, colorClass, barClass, hint }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  const hasValue = value > 0

  return (
    <div
      className={`rounded-xl border px-3 py-3 ${
        hasValue
          ? 'border-slate-600/80 bg-slate-900/50'
          : 'border-slate-700/50 bg-slate-900/30'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={`text-[11px] font-medium uppercase tracking-wide ${colorClass}`}>
            {title}
          </p>
          <p
            className={`mt-1 text-xl font-bold tabular-nums tracking-tight sm:text-2xl ${
              hasValue ? 'text-white' : 'text-slate-500'
            }`}
          >
            {value.toLocaleString('de-DE', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
            <span className="text-sm font-semibold text-slate-400">€</span>
          </p>
          {hint ? <p className="mt-1 text-[10px] leading-snug text-slate-500">{hint}</p> : null}
        </div>
        <span
          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${barClass} ${
            hasValue ? 'opacity-100' : 'opacity-30'
          }`}
          aria-hidden
        />
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${barClass}`}
          style={{ width: `${hasValue ? Math.max(pct, 6) : 0}%` }}
        />
      </div>
    </div>
  )
}

export default function EstimatedTaxes({
  receipts = [],
  mileage = [],
  invoices = [],
  expectedProfit = 80000,
  hebesatz,
  lang = 'de',
}) {
  const stats = useMemo(
    () =>
      computeTaxVaultSummary({
        expectedProfit,
        receipts,
        mileage,
        invoices,
        hebesatz,
      }),
    [receipts, mileage, invoices, expectedProfit, hebesatz]
  )

  const max = Math.max(stats.gewerbesteuer, stats.einkommensteuer, stats.umsatzsteuer, 1)
  const total =
    (Number(stats.gewerbesteuer) || 0) +
    (Number(stats.einkommensteuer) || 0) +
    (Number(stats.umsatzsteuer) || 0)
  const hebesatzLabel = hebesatz ?? 400

  const labels =
    lang === 'en'
      ? {
          title: 'Estimated taxes',
          subtitle: 'Indicative only — not tax advice',
          total: 'Combined estimate',
          gewerbeHint: `€24,500 allowance · 3.5% × Hebesatz ${hebesatzLabel}`,
          estHint: 'Based on deductible profit',
          ustHint: `${stats.vatCollected.toFixed(2)} € collected − ${stats.inputVat.toFixed(2)} € input`,
          gewerbe: 'Trade tax',
          est: 'Income tax',
          ust: 'VAT',
        }
      : {
          title: 'Geschätzte Steuern',
          subtitle: 'Nur Schätzung — keine Steuerberatung',
          total: 'Summe Schätzung',
          gewerbeHint: `Freibetrag 24.500 € · 3,5 % × Hebesatz ${hebesatzLabel}`,
          estHint: 'Auf Basis absetzbarer Gewinne',
          ustHint: `${stats.vatCollected.toFixed(2)} € gesammelt − ${stats.inputVat.toFixed(2)} € Vorsteuer`,
          gewerbe: 'Gewerbesteuer',
          est: 'Einkommensteuer',
          ust: 'Umsatzsteuer',
        }

  return (
    <div className="premium-card mb-4 space-y-4 border border-slate-700/60 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">{labels.title}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
            <Info className="h-3 w-3 shrink-0" aria-hidden />
            {labels.subtitle}
          </p>
        </div>
        <div className="rounded-xl bg-slate-900/70 px-3 py-2 text-right">
          <p className="text-[10px] uppercase tracking-wide text-slate-500">{labels.total}</p>
          <p className="text-lg font-bold tabular-nums text-brand-200">
            {total.toLocaleString('de-DE', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
            €
          </p>
        </div>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-3">
        <TaxMetric
          title={labels.gewerbe}
          value={stats.gewerbesteuer}
          max={max}
          colorClass="text-indigo-300"
          barClass="bg-indigo-500"
          hint={labels.gewerbeHint}
        />
        <TaxMetric
          title={labels.est}
          value={stats.einkommensteuer}
          max={max}
          colorClass="text-emerald-300"
          barClass="bg-emerald-500"
          hint={labels.estHint}
        />
        <TaxMetric
          title={labels.ust}
          value={stats.umsatzsteuer}
          max={max}
          colorClass="text-amber-300"
          barClass="bg-amber-500"
          hint={labels.ustHint}
        />
      </div>
    </div>
  )
}
