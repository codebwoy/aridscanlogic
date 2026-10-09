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
  GraduationCap,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
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
import FinanceEduHub from '../finance-edu/FinanceEduHub'
import IncomeOverview from './IncomeOverview'
import EstimatedTaxes from './EstimatedTaxes'
import SafeChart from '@/components/shared/SafeChart'
import ErrorBoundary from '@/components/shared/ErrorBoundary'
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
  const [showFinanceEdu, setShowFinanceEdu] = useState(false)
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
  const hasMonthlySpend = monthlyData.some((d) => d.amount > 0)
  const recent = [...stats.receipts]
    .sort((a, b) => (b.purchase_date || '').localeCompare(a.purchase_date || ''))
    .slice(0, 5)

  const budgetWarnings = getAllCategories().filter((c) => isOverBudget(stats.receipts, c))
  const overheadConfig = loadTaxOverheadConfig()

  const navTiles = [
    { id: 'summary', label: 'Tax Summary', icon: FileBarChart, onClick: () => setView('summary') },
    { id: 'list', label: 'All receipts', icon: Receipt, onClick: () => setView('list') },
    { id: 'manager', label: 'Beleg-Upload', icon: Receipt, onClick: () => setView('manager') },
    { id: 'mileage', label: 'Mileage log', icon: Car, onClick: () => setView('mileage') },
    { id: 'categories', label: 'Categories', icon: Tags, onClick: () => setView('categories') },
  ]

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

  if (showFinanceEdu) {
    return <FinanceEduHub onExit={() => setShowFinanceEdu(false)} />
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
    <ErrorBoundary compact allowReset title="Tax Vault — Fehler">
    <div className="w-full min-w-0 max-w-full">
      <header className="safe-top mb-4 flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold sm:text-2xl">Tax Vault</h1>
          <p className="truncate text-sm text-slate-400">{profile.businessName}</p>
        </div>
        <button
          type="button"
          onClick={() => setView('settings')}
          className="shrink-0 rounded-xl bg-slate-800 p-2"
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
        className="premium-card mb-4 w-full border border-slate-700/60 p-4 text-left transition hover:border-brand-500/40"
      >
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
              <Landmark className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">Steuer-Overhead (Gewerbe)</p>
              <p className="mt-0.5 text-xs text-slate-400">
                Krankenkasse, Gewerbesteuer & USt — Konfiguration & Schätzungen
              </p>
              {overheadConfig.healthEstimate?.monthlyTotal > 0 && (
                <p className="mt-2 text-xs font-medium text-rose-300">
                  KV ~{overheadConfig.healthEstimate.monthlyTotal.toLocaleString('de-DE')} €/Monat
                  {overheadConfig.healthInsurerName ? ` · ${overheadConfig.healthInsurerName}` : ''}
                </p>
              )}
            </div>
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

      {/* Primary capture actions */}
      <div className="premium-card mb-4 space-y-3 border border-brand-500/25 p-4 sm:p-5">
        <div>
          <p className="text-sm font-semibold text-white">Ausgabe erfassen</p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Beleg scannen oder Betrag manuell eintragen
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setView('scan')}
            className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-500"
          >
            <ScanLine className="h-5 w-5 shrink-0" />
            Scan Receipt
          </button>
          <button
            type="button"
            onClick={() => setView('manual')}
            className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-900/40 px-4 py-3.5 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/60"
          >
            <PenLine className="h-4 w-4 shrink-0" />
            Without receipt
          </button>
        </div>
      </div>

      {stats.donutData.length > 0 && (
        <div className="premium-card mb-4 min-w-0 p-4 sm:p-5">
          <h3 className="mb-3 text-sm font-semibold text-white">Spending by category</h3>
          <SafeChart height={176} className="h-44 w-full">
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
                isAnimationActive={false}
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
          </SafeChart>
        </div>
      )}

      {/* Monthly spending */}
      <div className="premium-card mb-4 min-w-0 p-4 sm:p-5">
        <div className="mb-3 flex items-end justify-between gap-2">
          <h3 className="text-sm font-semibold text-white">Monthly spending</h3>
          {hasMonthlySpend ? (
            <p className="text-[11px] tabular-nums text-slate-500">
              {sym}
              {stats.totalExpenses.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              YTD
            </p>
          ) : null}
        </div>
        {hasMonthlySpend ? (
          <SafeChart height={144} className="h-36 w-full">
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip
                formatter={(v) => `${sym}${Number(v).toFixed(2)}`}
                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }}
              />
              <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </SafeChart>
        ) : (
          <div className="flex h-28 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700/80 bg-slate-900/40 px-4 text-center">
            <p className="text-sm font-medium text-slate-400">Noch keine Ausgaben in {taxYear}</p>
            <p className="mt-1 text-[11px] text-slate-600">
              Nach dem ersten Beleg erscheint hier die Monatsübersicht.
            </p>
          </div>
        )}
      </div>

      {/* Navigation tools */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Tools & Berichte
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {navTiles.map((tile) => {
            const Icon = tile.icon
            return (
              <button
                key={tile.id}
                type="button"
                onClick={tile.onClick}
                className="flex min-h-[72px] flex-col items-start justify-center gap-2 rounded-xl border border-slate-700/70 bg-slate-800/50 px-3 py-3 text-left transition hover:border-slate-500 hover:bg-slate-800"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900/80 text-brand-300">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-xs font-medium leading-snug text-slate-200">{tile.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Growth modules */}
      <div className="mb-5 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setShowBizStart(true)}
          className="flex min-h-[56px] items-center gap-3 rounded-xl border border-slate-700/70 bg-slate-800/40 px-4 py-3 text-left transition hover:border-slate-500 hover:bg-slate-800/70"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
            <Rocket className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-slate-100">BizStart Germany</span>
            <span className="block text-[11px] text-slate-500">Gewerbe · Listing · CV</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => setShowFinanceEdu(true)}
          className="flex min-h-[56px] items-center gap-3 rounded-xl border border-brand-500/30 bg-brand-950/25 px-4 py-3 text-left transition hover:border-brand-500/50 hover:bg-brand-950/40"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-brand-200">
            <GraduationCap className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-brand-100">Finanz-Bildung</span>
            <span className="block text-[11px] text-slate-500">Vermögen · Zielrechner</span>
          </span>
        </button>
      </div>

      {/* Recent receipts */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="font-semibold text-white">Recent receipts</h3>
        {recent.length > 0 ? (
          <button
            type="button"
            onClick={() => setView('list')}
            className="text-xs font-medium text-brand-300 hover:text-brand-200"
          >
            Alle anzeigen
          </button>
        ) : null}
      </div>
      <div className="space-y-2">
        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700/80 bg-slate-900/40 px-4 py-8 text-center">
            <Receipt className="mb-2 h-8 w-8 text-slate-600" aria-hidden />
            <p className="text-sm font-medium text-slate-400">Noch keine Belege</p>
            <p className="mt-1 max-w-xs text-[11px] text-slate-600">
              Tippe auf Scan Receipt, um den ersten Beleg zu erfassen.
            </p>
            <button
              type="button"
              onClick={() => setView('scan')}
              className="mt-4 rounded-lg bg-brand-600/90 px-3 py-2 text-xs font-semibold text-white"
            >
              Beleg scannen
            </button>
          </div>
        ) : null}
        {recent.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => {
              setSelectedReceipt(r)
              setView('detail')
            }}
            className="flex w-full gap-3 rounded-xl border border-slate-700/50 bg-slate-800/70 p-3 text-left transition hover:border-slate-600 hover:bg-slate-800"
          >
            {r.image_url ? (
              <img src={r.image_url} alt="" className="h-12 w-10 rounded object-cover" />
            ) : (
              <span className="flex h-12 w-10 items-center justify-center rounded bg-slate-900/80">
                <Receipt className="h-5 w-5 text-slate-500" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-slate-100">{r.vendor_name}</p>
              <p className="text-xs text-slate-500">{r.purchase_date}</p>
            </div>
            <p className="font-semibold tabular-nums text-slate-100">
              {sym}
              {r.total_amount?.toFixed(2)}
            </p>
          </button>
        ))}
      </div>
    </div>
    </ErrorBoundary>
  )
}
