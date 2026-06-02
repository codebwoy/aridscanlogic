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
    <div className="premium-card mb-4 p-4">
      <h3 className="mb-3 text-sm font-semibold">P&L (DocDraft + Tax Vault)</h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          <div>
            <p className="text-xs text-slate-500">Income (invoices)</p>
            <p className="font-bold">€{income.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-red-400" />
          <div>
            <p className="text-xs text-slate-500">Expenses (receipts)</p>
            <p className="font-bold">€{expenses.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <p className="mt-3 border-t border-slate-700/50 pt-3 font-semibold">
        Net profit: €{profit.toFixed(2)}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        USt position: €{vatCollected.toFixed(2)} collected − €{vatPaid.toFixed(2)} input = €
        {vatOwed.toFixed(2)} payable
      </p>
    </div>
  )
}
