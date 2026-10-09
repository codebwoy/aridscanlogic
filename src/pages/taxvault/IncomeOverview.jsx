import { TrendingUp, TrendingDown } from 'lucide-react'
import { round2 } from '@/lib/taxCalculations'

export default function IncomeOverview({ invoices = [], receipts = [] }) {
  const income = invoices
    .filter((d) => d.status && d.status !== 'draft')
    .reduce((s, d) => s + (d.subtotal_net || d.total_gross - (d.total_vat || 0) || 0), 0)
  const expenses = receipts.reduce((s, r) => s + (r.deductible_amount || r.total_amount || 0), 0)
  const vatCollected = invoices.reduce((s, d) => s + (d.total_vat || 0), 0)
  const vatPaid = receipts.reduce((s, r) => s + (r.vat_amount || 0), 0)
  const profit = round2(income - expenses)
  const vatOwed = round2(vatCollected - vatPaid)

  return (
    <div className="premium-card mb-4 border border-slate-700/60 p-4 sm:p-5">
      <h3 className="mb-3 text-sm font-semibold text-white">P&L (DocDraft + Tax Vault)</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-900/50 px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <p className="text-[10px] uppercase tracking-wide">Income</p>
          </div>
          <p className="mt-1 text-lg font-bold tabular-nums text-white">€{income.toFixed(2)}</p>
          <p className="text-[10px] text-slate-500">Invoices</p>
        </div>
        <div className="rounded-xl bg-slate-900/50 px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-rose-400">
            <TrendingDown className="h-3.5 w-3.5" />
            <p className="text-[10px] uppercase tracking-wide">Expenses</p>
          </div>
          <p className="mt-1 text-lg font-bold tabular-nums text-white">€{expenses.toFixed(2)}</p>
          <p className="text-[10px] text-slate-500">Receipts</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-2 border-t border-slate-700/50 pt-3">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-slate-500">Net profit</p>
          <p
            className={`text-lg font-bold tabular-nums ${
              profit >= 0 ? 'text-emerald-300' : 'text-rose-300'
            }`}
          >
            €{profit.toFixed(2)}
          </p>
        </div>
        <p className="max-w-[14rem] text-right text-[11px] leading-snug text-slate-500">
          USt: €{vatCollected.toFixed(2)} − €{vatPaid.toFixed(2)} ={' '}
          <span className="font-medium text-slate-300">€{vatOwed.toFixed(2)}</span>
        </p>
      </div>
    </div>
  )
}
