import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { computeTaxVaultSummary } from '@/lib/taxCalculations'

const COLORS = ['#6366f1', '#22c55e', '#f59e0b']

function TaxWheel({ title, value, max, color }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  const data = [
    { name: 'paid', value: pct },
    { name: 'rest', value: 100 - pct },
  ]
  return (
    <div className="flex flex-col items-center">
      <div className="h-28 w-28">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={32}
              outerRadius={48}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              <Cell fill={color} />
              <Cell fill="#334155" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-1 text-xs font-medium text-slate-400">{title}</p>
      <p className="text-sm font-bold">{value.toLocaleString('de-DE')} €</p>
    </div>
  )
}

export default function EstimatedTaxes({
  receipts = [],
  mileage = [],
  invoices = [],
  expectedProfit = 80000,
}) {
  const stats = useMemo(
    () =>
      computeTaxVaultSummary({
        expectedProfit,
        receipts,
        mileage,
        invoices,
      }),
    [receipts, mileage, invoices, expectedProfit]
  )

  const max = Math.max(stats.gewerbesteuer, stats.einkommensteuer, stats.umsatzsteuer, 1)

  return (
    <div className="rounded-2xl bg-slate-800/60 p-4">
      <h3 className="mb-4 text-center font-semibold">Geschätzte Steuern</h3>
      <p className="mb-2 text-center text-xs text-slate-500">
        Gewerbe: Freibetrag 24.500 € · Messzahl 3,5 % × Hebesatz 400
      </p>
      <p className="mb-4 text-center text-xs text-slate-500">
        USt: {stats.vatCollected.toFixed(2)} € gesammelt − {stats.inputVat.toFixed(2)} € Vorsteuer
      </p>
      <div className="flex justify-around">
        <TaxWheel title="Gewerbesteuer" value={stats.gewerbesteuer} max={max} color={COLORS[0]} />
        <TaxWheel title="Einkommensteuer" value={stats.einkommensteuer} max={max} color={COLORS[1]} />
        <TaxWheel title="Umsatzsteuer" value={stats.umsatzsteuer} max={max} color={COLORS[2]} />
      </div>
    </div>
  )
}
