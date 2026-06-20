import { useState, useEffect, useMemo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ScanLine,
  Settings,
  Car,
  Rocket,
  Receipt,
  FileBarChart,
  Tags,
  PenLine,
  Landmark,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from 'recharts'
import { toast } from 'sonner'
import appApi from '@/lib/appApi'
import PremiumCard from '@/components/shared/PremiumCard'
import { hasTaxVaultProfile, loadTaxVaultProfile } from '@/lib/taxvault/profile'
import { computeReceiptStats } from '@/lib/taxvault/stats'
import { getAllCategories, isOverBudget } from '@/lib/taxvault/categories'
import TaxVaultProfileSetup from './TaxVaultProfileSetup'
import ReceiptScanFlow from './ReceiptScanFlow'
import ReceiptList from './ReceiptList'
import ReceiptDetail from './ReceiptDetail'
import TaxSummaryReport from './TaxSummaryReport'
import TaxVaultSettings from './TaxVaultSettings'
import ModuleGuideBanner from '@/components/guide/ModuleGuideBanner'
import MileageLogger from './MileageLogger'
import TaxVaultCategoryManager from './TaxVaultCategoryManager'
import ManualExpenseEntry from './ManualExpenseEntry'
import BizStartGermany from '../bizstart/BizStartGermany'
import IncomeOverview from './IncomeOverview'
import EstimatedTaxes from './EstimatedTaxes'
import ReceiptManager from './ReceiptManager'
import TaxOverheadHub from './TaxOverheadHub'
import { loadTaxOverheadConfig } from '@/lib/taxvault/overheadConfig'
import { checkRecurringReminders } from '@/lib/taxvault/reminders'
import { ensureDefaultProfile, loadDocuments } from '@/lib/docdraft/store'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function TaxVaultHome() {
  const [receipts, setReceipts] = useState([])
  const [mileageLogs, setMileageLogs] = useState([])
  const [taxYear, setTaxYear] = useState(new Date().getFullYear())
  const [view, setView] = useState('home')
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [listCategoryFilter, setListCategoryFilter] = useState('')
  const [showBizStart, setShowBizStart] = useState(false)
  const [profileReady, setProfileReady] = useState(hasTaxVaultProfile())
  const [invoices, setInvoices] = useState([])

  const profile = loadTaxVaultProfile()
  const sym = profile.homeCurrency === 'EUR' ? '€' : profile.homeCurrency

  const load = async () => {
    try {
      const [rcpts, mileage] = await Promise.all([
        appApi.entities.Receipt.list(),
        appApi.entities.MileageLog.list(),
      ])
      setReceipts(rcpts)
      setMileageLogs(mileage)
      const p = ensureDefaultProfile()
      setInvoices(await loadDocuments(p.id))
    } catch {
      toast.error('Tax-Vault-Daten konnten nicht geladen werden')
    }
  }

  useEffect(() => {
    if (profileReady) {
      load()
      checkRecurringReminders()
    }
  }, [profileReady])

  const stats = useMemo(
    () => computeReceiptStats(receipts, taxYear, mileageLogs),
    [receipts, taxYear, mileageLogs]
  )

  const monthlyData = stats.byMonth.map((v, i) => ({ month: MONTHS[i], amount: v }))
  const recent = [...stats.receipts]
    .sort((a, b) => (b.purchase_date || '').localeCompare(a.purchase_date || ''))
    .slice(0, 5)

  const budgetWarnings = getAllCategories().filter((c) => isOverBudget(stats.receipts, c))
  const overheadConfig = loadTaxOverheadConfig()

  if (!profileReady) {
    return <TaxVaultProfileSetup onComplete={() => setProfileReady(true)} />
  }

  if (showBizStart) {
    return (
      <BizStartGermany
        onExit={() => setShowBizStart(false)}
        onComplete={() => {
          setShowBizStart(false)
          load()
        }}
      />
    )
  }

  if (view === 'scan') {
    return (
      <ReceiptScanFlow
        onClose={() => setView('home')}
        onSaved={load}
      />
    )
  }

  if (view === 'manual') {
    return (
      <ManualExpenseEntry
        onBack={() => setView('home')}
        onSaved={() => {
          load()
          setView('home')
        }}
      />
    )
  }

  if (view === 'categories') {
    return (
      <TaxVaultCategoryManager
        receipts={receipts}
        taxYear={taxYear}
        onBack={() => setView('home')}
      />
    )
  }

  if (view === 'manager') {
    return (
      <div className="w-full">
        <button
          type="button"
          onClick={() => setView('home')}
          className="safe-top mb-3 text-sm text-slate-400"
        >
          ← Zurück
        </button>
        <ReceiptManager kleinunternehmer={profile.kleinunternehmer} onChanged={load} />
      </div>
    )
  }

  if (view === 'settings') {
    return <TaxVaultSettings onBack={() => setView('home')} />
  }

  if (view === 'overhead') {
    return (
      <TaxOverheadHub
        receipts={receipts}
        mileage={mileageLogs}
        invoices={invoices}
        expectedProfit={stats.totalDeductible}
        onBack={() => setView('home')}
        onOpenSettings={() => setView('settings')}
        onOpenBizStart={() => setShowBizStart(true)}
      />
    )
  }

  if (view === 'summary') {
    return (
      <TaxSummaryReport
        receipts={receipts}
        mileageLogs={mileageLogs}
        taxYear={taxYear}
        onBack={() => setView('home')}
        onCategorySelect={(cat) => {
          setListCategoryFilter(cat)
          setView('list')
        }}
      />
    )
  }

  if (view === 'mileage') {
    return (
      <div className="w-full">
        <button
          type="button"
          onClick={() => setView('home')}
          className="safe-top mb-3 text-sm text-slate-400"
        >
          ← Back
        </button>
        <MileageLogger onChanged={load} />
      </div>
    )
  }

  if (view === 'list') {
    const listReceipts = listCategoryFilter
      ? receipts.filter((r) => r.category === listCategoryFilter)
      : receipts
    return (
      <div className="w-full">
        <button
          type="button"
          onClick={() => {
            setListCategoryFilter('')
            setView('home')
          }}
          className="safe-top mb-3 text-sm text-slate-400"
        >
          ← Back
        </button>
        <h2 className="mb-3 text-lg font-bold">All Receipts</h2>
        <ReceiptList
          receipts={listReceipts}
          taxYear={taxYear}
          onRefresh={load}
          onSelect={(r) => {
            setSelectedReceipt(r)
            setView('detail')
          }}
        />
      </div>
    )
  }

  if (view === 'detail' && selectedReceipt) {
    return (
      <ReceiptDetail
        receipt={selectedReceipt}
        onBack={() => setView('list')}
        onUpdated={load}
      />
    )
  }

  return (
    <div className="w-full">
      <header className="safe-top mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Tax Vault</h1>
          <p className="text-sm text-slate-400">{profile.businessName}</p>
        </div>
        <button
          type="button"
          onClick={() => setView('settings')}
          className="rounded-xl bg-slate-800 p-2"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5 text-slate-400" />
        </button>
      </header>

      <ModuleGuideBanner moduleId="tax" title="Tax Vault" />

      <div className="mb-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setTaxYear((y) => y - 1)}
          className="rounded-full bg-slate-800 p-2"
          aria-label="Vorheriges Steuerjahr"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <span className="text-lg font-semibold">Steuerjahr {taxYear}</span>
        <button
          type="button"
          onClick={() => setTaxYear((y) => y + 1)}
          className="rounded-full bg-slate-800 p-2"
          aria-label="Nächstes Steuerjahr"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <PremiumCard className="mb-4 p-5">
        <p className="text-xs uppercase tracking-wide text-slate-400">Total expenses</p>
        <p className="mt-1 text-3xl font-bold text-white">
          {sym}
          {stats.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <div className="mt-4 grid-stats text-sm">
          <div>
            <p className="text-slate-500">VAT paid</p>
            <p className="font-semibold">
              {sym}
              {stats.totalVat.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Receipts</p>
            <p className="font-semibold">{stats.count}</p>
          </div>
          <div>
            <p className="text-slate-500">Categories</p>
            <p className="font-semibold">{stats.categoriesUsed}</p>
          </div>
          <div>
            <p className="text-slate-500">Deductible</p>
            <p className="font-semibold text-emerald-400">
              {sym}
              {stats.totalDeductible.toFixed(2)}
            </p>
          </div>
          {stats.mileageTrips > 0 && (
            <div className="col-span-2 border-t border-slate-700/50 pt-2">
              <p className="text-slate-500">Mileage ({stats.mileageTrips} trips)</p>
              <p className="font-semibold">
                {stats.mileageKm.toFixed(0)} km · {sym}
                {stats.mileageDeductible.toFixed(2)} deductible
              </p>
            </div>
          )}
        </div>
      </PremiumCard>

      {budgetWarnings.length > 0 && (
        <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          Over budget: {budgetWarnings.map((c) => c.name).join(', ')}
        </div>
      )}

      <IncomeOverview invoices={invoices} receipts={receipts} />

      <button
        type="button"
        onClick={() => setView('overhead')}
        className="premium-card mb-4 w-full p-4 text-left"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Landmark className="h-4 w-4 text-brand-400" />
              Steuer-Overhead (Gewerbe)
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Krankenkasse, Gewerbesteuer & USt — Konfiguration & Schätzungen
            </p>
            {overheadConfig.healthEstimate?.monthlyTotal > 0 && (
              <p className="mt-2 text-xs text-rose-300">
                KV ~{overheadConfig.healthEstimate.monthlyTotal.toLocaleString('de-DE')} €/Monat
                {overheadConfig.healthInsurerName ? ` · ${overheadConfig.healthInsurerName}` : ''}
              </p>
            )}
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-brand-400" />
        </div>
      </button>

      <EstimatedTaxes
        receipts={receipts}
        mileage={mileageLogs}
        invoices={invoices}
        expectedProfit={stats.totalDeductible}
        hebesatz={overheadConfig.hebesatz}
      />

      {stats.donutData.length > 0 && (
        <div className="mb-4 rounded-2xl bg-slate-800/60 p-4">
          <h3 className="mb-2 text-sm font-semibold">Spending by category</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.donutData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {stats.donutData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => `${sym}${Number(v).toFixed(2)}`}
                  contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setView('scan')}
        className="mb-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-4 text-lg font-semibold shadow-lg shadow-brand-600/30"
      >
        <ScanLine className="h-6 w-6" />
        Scan Receipt
      </button>
      <button
        type="button"
        onClick={() => setView('manual')}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-600 py-3 text-sm font-medium"
      >
        <PenLine className="h-4 w-4" />
        Log expense without receipt
      </button>

      <div className="mb-4 rounded-2xl bg-slate-800/60 p-4">
        <h3 className="mb-2 text-sm font-semibold">Monthly spending</h3>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip
                formatter={(v) => `${sym}${Number(v).toFixed(2)}`}
                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }}
              />
              <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setView('summary')}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-sm font-medium"
        >
          <FileBarChart className="h-4 w-4" /> Tax Summary
        </button>
        <button
          type="button"
          onClick={() => setView('list')}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-sm font-medium"
        >
          <Receipt className="h-4 w-4" /> All receipts
        </button>
        <button
          type="button"
          onClick={() => setView('manager')}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-sm font-medium"
        >
          <Receipt className="h-4 w-4" aria-hidden /> Beleg-Upload
        </button>
      </div>

      <div className="mb-2 flex gap-2">
        <button
          type="button"
          onClick={() => setView('mileage')}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 py-2 text-sm"
        >
          <Car className="h-4 w-4" /> Mileage log
        </button>
        <button
          type="button"
          onClick={() => setView('categories')}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 py-2 text-sm"
        >
          <Tags className="h-4 w-4" /> Categories
        </button>
      </div>
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setShowBizStart(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 py-2 text-sm"
        >
          <Rocket className="h-4 w-4" /> BizStart Germany
        </button>
      </div>

      <h3 className="mb-2 font-semibold">Recent receipts</h3>
      <div className="space-y-2">
        {recent.length === 0 && (
          <p className="text-sm text-slate-500">No receipts yet — tap Scan Receipt to start.</p>
        )}
        {recent.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => {
              setSelectedReceipt(r)
              setView('detail')
            }}
            className="flex w-full gap-3 rounded-xl bg-slate-800/80 p-3 text-left"
          >
            {r.image_url ? (
              <img src={r.image_url} alt="" className="h-12 w-10 rounded object-cover" />
            ) : (
              <Receipt className="h-10 w-10 text-slate-600" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{r.vendor_name}</p>
              <p className="text-xs text-slate-500">{r.purchase_date}</p>
            </div>
            <p className="font-semibold">
              {sym}
              {r.total_amount?.toFixed(2)}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
