import { ChevronLeft, FileText, Table, Mail, AlertTriangle, Archive, Package } from 'lucide-react'
import { toast } from 'sonner'
import { loadTaxVaultProfile } from '@/lib/taxvault/profile'
import { computeReceiptStats } from '@/lib/taxvault/stats'
import {
  exportReceiptsCsv,
  exportTaxReportPdf,
  exportReceiptImagesZip,
  exportTaxYearBundle,
  emailAccountant,
  shareAccountantPackage,
} from '@/lib/taxvault/exportReport'
import { getTaxYearLabel } from '@/lib/taxvault/stats'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function TaxSummaryReport({ receipts, mileageLogs = [], taxYear, onBack, onCategorySelect }) {
  const profile = loadTaxVaultProfile()
  const stats = computeReceiptStats(receipts, taxYear, mileageLogs)
  const sym = profile.homeCurrency === 'EUR' ? '€' : profile.homeCurrency

  return (
    <div className="w-full">
      <button type="button" onClick={onBack} className="safe-top mb-3 flex items-center gap-1 text-sm text-slate-400">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      <h2 className="mb-1 text-xl font-bold">Tax Summary {taxYear}</h2>
      <p className="mb-4 text-xs text-slate-500">
        {profile.businessName} · {getTaxYearLabel(taxYear, profile.taxYearStartMonth || 1)}
      </p>

      {stats.missingScans > 0 && (
        <div className="mb-4 flex gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-200">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {stats.missingScans} expense(s) have no receipt scan — your accountant may need proof.
        </div>
      )}

      <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-slate-800/80 p-4 text-sm">
        <div>
          <p className="text-slate-500">Gross expenses</p>
          <p className="text-lg font-bold">
            {sym}
            {stats.totalExpenses.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-slate-500">VAT paid</p>
          <p className="text-lg font-bold">
            {sym}
            {stats.totalVat.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-slate-500">Deductible</p>
          <p className="text-lg font-bold text-emerald-400">
            {sym}
            {stats.totalDeductible.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-slate-500">Non-deductible</p>
          <p className="text-lg font-bold">
            {sym}
            {stats.personalPortion.toFixed(2)}
          </p>
        </div>
        <p className="col-span-2 text-xs text-slate-500">
          {stats.count} receipts
          {stats.mileageTrips > 0 &&
            ` · ${stats.mileageTrips} mileage trips (${stats.mileageKm.toFixed(0)} km, ${sym}${stats.mileageDeductible.toFixed(2)} deductible)`}
        </p>
      </div>

      {stats.mileage?.length > 0 && (
        <>
          <h3 className="mb-2 font-semibold">Mileage log</h3>
          <div className="mb-4 overflow-x-auto rounded-xl border border-slate-700">
            <table className="w-full min-w-[320px] text-xs">
              <thead className="bg-slate-800 text-slate-400">
                <tr>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Route</th>
                  <th className="p-2 text-right">km</th>
                  <th className="p-2 text-right">Ded.</th>
                </tr>
              </thead>
              <tbody>
                {stats.mileage.map((m) => (
                  <tr key={m.id} className="border-t border-slate-700/50">
                    <td className="p-2">{m.trip_date}</td>
                    <td className="p-2 truncate max-w-[120px]">
                      {m.start_location} → {m.end_location}
                    </td>
                    <td className="p-2 text-right">{m.distance_km?.toFixed(1)}</td>
                    <td className="p-2 text-right text-emerald-400">
                      {sym}
                      {m.deductible_amount?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h3 className="mb-2 font-semibold">By category</h3>
      <div className="mb-4 overflow-x-auto rounded-xl border border-slate-700">
        <table className="w-full min-w-[280px] text-xs">
          <thead className="bg-slate-800 text-slate-400">
            <tr>
              <th className="p-2 text-left">Category</th>
              <th className="p-2">#</th>
              <th className="p-2 text-right">Gross</th>
              <th className="p-2 text-right">Deduct.</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats.byCategory).map(([cat, d]) => (
              <tr
                key={cat}
                className="border-t border-slate-700/50 cursor-pointer hover:bg-slate-800/50"
                onClick={() => onCategorySelect?.(cat)}
              >
                <td className="p-2">{cat}</td>
                <td className="p-2 text-center">{d.count}</td>
                <td className="p-2 text-right">
                  {sym}
                  {d.gross.toFixed(0)}
                </td>
                <td className="p-2 text-right text-emerald-400">
                  {sym}
                  {d.deductible.toFixed(0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mb-2 font-semibold">By month</h3>
      <div className="mb-6 grid grid-cols-4 gap-1 text-center text-[10px]">
        {stats.byMonth.map((amt, i) => (
          <div key={MONTHS[i]} className="rounded-lg bg-slate-800/60 p-2">
            <p className="text-slate-500">{MONTHS[i]}</p>
            <p className="font-medium">
              {sym}
              {amt > 0 ? (amt >= 1000 ? `${(amt / 1000).toFixed(1)}k` : amt.toFixed(0)) : '—'}
            </p>
          </div>
        ))}
      </div>

      <h3 className="mb-2 font-semibold">Export</h3>
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => exportTaxReportPdf(stats.receipts, stats, profile, taxYear)}
          className="flex w-full items-center gap-3 rounded-xl bg-brand-600/20 p-3 text-left text-sm"
        >
          <FileText className="h-5 w-5 text-brand-400" />
          Full Tax Report PDF
        </button>
        <button
          type="button"
          onClick={() => {
            exportReceiptsCsv(stats.receipts, profile, taxYear)
            toast.success('CSV downloaded')
          }}
          className="flex w-full items-center gap-3 rounded-xl bg-slate-800 p-3 text-left text-sm"
        >
          <Table className="h-5 w-5 text-slate-400" />
          Excel / CSV export
        </button>
        <button
          type="button"
          onClick={async () => {
            await exportReceiptImagesZip(stats.receipts, taxYear)
            toast.success('Images ZIP downloaded')
          }}
          className="flex w-full items-center gap-3 rounded-xl bg-slate-800 p-3 text-left text-sm"
        >
          <Archive className="h-5 w-5 text-slate-400" />
          Receipt images (ZIP by category)
        </button>
        <button
          type="button"
          onClick={async () => {
            await exportTaxYearBundle(stats.receipts, stats, profile, taxYear)
            toast.success('Full bundle: PDF + CSV + ZIP')
          }}
          className="flex w-full items-center gap-3 rounded-xl bg-brand-600/30 p-3 text-left text-sm font-medium"
        >
          <Package className="h-5 w-5 text-brand-300" />
          Export everything (PDF + CSV + ZIP)
        </button>
        <button
          type="button"
          onClick={async () => {
            if (!profile.accountantEmail) {
              toast.error('Add accountant email in Tax Vault Settings')
              return
            }
            try {
              await shareAccountantPackage(stats.receipts, stats, profile, taxYear)
              toast.success('Exports downloaded — share or attach via email')
            } catch {
              toast.error('Export failed')
            }
          }}
          className="flex w-full items-center gap-3 rounded-xl bg-slate-800 p-3 text-left text-sm"
        >
          <Mail className="h-5 w-5 text-slate-400" />
          Share with accountant (PDF + CSV + ZIP)
        </button>
        <button
          type="button"
          onClick={() => {
            if (!profile.accountantEmail) {
              toast.error('Add accountant email in Tax Vault Settings')
              return
            }
            emailAccountant(profile, taxYear, async () => {
              await exportTaxYearBundle(stats.receipts, stats, profile, taxYear)
            })
          }}
          className="flex w-full items-center gap-3 rounded-xl bg-slate-800/60 p-3 text-left text-xs text-slate-400"
        >
          <Mail className="h-4 w-4" />
          Email only (mailto, attach downloads manually)
        </button>
      </div>
    </div>
  )
}
