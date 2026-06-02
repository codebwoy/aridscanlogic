import { useState, useEffect } from 'react'
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'
import { loadDocuments, computeDocStats, getActiveProfile } from '@/lib/docdraft/store'
import { exportDatevCsv, exportDocumentsReportCsv } from '@/lib/docdraft/datevExport'
import PaymentDonut from '@/components/docdraft/PaymentDonut'

export default function ReportsPage({ onBack }) {
  const profile = getActiveProfile()
  const [docs, setDocs] = useState([])
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (!profile) return
    loadDocuments(profile.id).then((list) => {
      setDocs(list)
      setStats(computeDocStats(list))
    })
  }, [profile])

  if (!stats) return <p className="p-4 text-slate-500">Loading…</p>

  const unpaid = docs.filter((d) => d.status === 'sent' && (d.amount_paid || 0) < (d.total_gross || 0))
  const vatTotal = docs.reduce((s, d) => s + (d.total_vat || 0), 0)

  return (
    <div className="w-full">
      <button type="button" onClick={onBack} className="safe-top mb-3 flex items-center gap-1 text-sm text-slate-400">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      <h2 className="mb-4 text-xl font-bold">Reports</h2>
      <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-slate-800/80 p-3">
          <p className="text-slate-500">Revenue YTD</p>
          <p className="text-lg font-bold">{stats.invoicedMonth?.toFixed(2)} €</p>
        </div>
        <div className="rounded-xl bg-slate-800/80 p-3">
          <p className="text-slate-500">Outstanding</p>
          <p className="text-lg font-bold text-amber-300">{stats.outstanding?.toFixed(2)} €</p>
        </div>
        <div className="rounded-xl bg-slate-800/80 p-3">
          <p className="text-slate-500">VAT collected</p>
          <p className="text-lg font-bold">{vatTotal.toFixed(2)} €</p>
        </div>
        <div className="rounded-xl bg-slate-800/80 p-3">
          <p className="text-slate-500">Unpaid invoices</p>
          <p className="text-lg font-bold">{unpaid.length}</p>
        </div>
      </div>
      <PaymentDonut statusCounts={stats?.statusCounts || {}} />
      <h3 className="mb-2 mt-4 font-semibold">Aging (unpaid)</h3>
      <div className="mb-4 space-y-1 text-xs">
        {unpaid.slice(0, 10).map((d) => (
          <div key={d.id} className="flex justify-between rounded-lg bg-slate-800/60 px-3 py-2">
            <span>{d.document_number}</span>
            <span>{((d.total_gross || 0) - (d.amount_paid || 0)).toFixed(2)} €</span>
          </div>
        ))}
        {unpaid.length === 0 && <p className="text-slate-500">All paid</p>}
      </div>
      <div className="space-y-2">
        <button
          type="button"
          onClick={async () => {
            await exportDocumentsReportCsv()
            toast.success('Report CSV downloaded')
          }}
          className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold"
        >
          Export all documents CSV
        </button>
        <button
          type="button"
          onClick={() => {
            exportDatevCsv(docs, profile)
            toast.success('DATEV CSV downloaded')
          }}
          className="w-full rounded-xl bg-slate-800 py-3 text-sm"
        >
          Export DATEV Buchungsstapel (CSV)
        </button>
      </div>
    </div>
  )
}
