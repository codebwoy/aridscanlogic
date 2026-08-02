import { useMemo } from 'react'
import { PieChart, Pie, Cell } from 'recharts'
import { computeTaxVaultSummary } from '@/lib/taxCalculations'
import SafeChart from '@/components/shared/SafeChart'

const COLORS = ['#6366f1', '#22c55e', '#f59e0b']

function TaxWheel({ title, value, max, color }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  const data = [
    { name: 'paid', value: pct || 0.001 },
    { name: 'rest', value: Math.max(0.001, 100 - pct) },
  ]
  return (
    <div className="flex min-w-0 flex-col items-center">
      <SafeChart height={112} minWidth={48} className="h-28 w-28">
        <PieChart>
          <Pie
            data={data}
            innerRadius={32}
            outerRadius={48}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            isAnimationActive={false}
          >
            <Cell fill={color} />
            <Cell fill="#334155" />
          </Pie>
        </PieChart>
      </SafeChart>
      <p className="mt-1 text-center text-xs font-medium text-slate-400">{title}</p>
      <p className="text-sm font-bold tabular-nums">{value.toLocaleString('de-DE')} €</p>
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
  const hebesatzLabel = hebesatz ?? 400

  const labels =
    lang === 'en'
      ? {
          title: 'Estimated taxes',
          gewerbeNote: `Trade tax: €24,500 allowance · 3.5% × Hebesatz ${hebesatzLabel}`,
          ustNote: `VAT: ${stats.vatCollected.toFixed(2)} € collected − ${stats.inputVat.toFixed(2)} € input VAT`,
          gewerbe: 'Trade tax',
          est: 'Income tax',
          ust: 'VAT',
        }
      : {
          title: 'Geschätzte Steuern',
          gewerbeNote: `Gewerbe: Freibetrag 24.500 € · Messzahl 3,5 % × Hebesatz ${hebesatzLabel}`,
          ustNote: `USt: ${stats.vatCollected.toFixed(2)} € gesammelt − ${stats.inputVat.toFixed(2)} € Vorsteuer`,
          gewerbe: 'Gewerbesteuer',
          est: 'Einkommensteuer',
          ust: 'Umsatzsteuer',
        }

  return (
    <div className="mb-4 min-w-0 rounded-2xl bg-slate-800/60 p-4">
      <h3 className="mb-4 text-center font-semibold">{labels.title}</h3>
      <p className="mb-2 text-center text-xs text-slate-500">{labels.gewerbeNote}</p>
      <p className="mb-4 text-center text-xs text-slate-500">{labels.ustNote}</p>
      <div className="flex min-w-0 justify-around gap-2">
        <TaxWheel title={labels.gewerbe} value={stats.gewerbesteuer} max={max} color={COLORS[0]} />
        <TaxWheel title={labels.est} value={stats.einkommensteuer} max={max} color={COLORS[1]} />
        <TaxWheel title={labels.ust} value={stats.umsatzsteuer} max={max} color={COLORS[2]} />
      </div>
    </div>
  )
}
