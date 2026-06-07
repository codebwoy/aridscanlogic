import { useState, useEffect, useCallback } from 'react'
import {
  FilePenLine,
  Plus,
  Settings,
  Package,
  Users,
  ChevronRight,
  AlertTriangle,
  FileText,
  Receipt,
  FileMinus,
  Truck,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  ensureDefaultProfile,
  getActiveProfile,
  loadDocuments,
  computeDocStats,
} from '@/lib/docdraft/store'
import BusinessProfileManager from './BusinessProfileManager'
import DocumentBuilder from './DocumentBuilder'
import SendDocumentScreen from './SendDocumentScreen'
import DocumentDetail from './DocumentDetail'
import ProductCatalog from './ProductCatalog'
import ClientDatabase from './ClientDatabase'
import DocDraftSettings from './DocDraftSettings'
import ReportsPage from './ReportsPage'
import RecurringInvoices from './RecurringInvoices'
import PaymentDonut from '@/components/docdraft/PaymentDonut'
import PremiumCard from '@/components/shared/PremiumCard'
import ModuleGuideBanner from '@/components/guide/ModuleGuideBanner'
import EmptyState from '@/components/shared/EmptyState'

const QUICK_ACTIONS = [
  { type: 'invoice', label: 'New Invoice', icon: FileText, color: 'from-brand-600 to-indigo-600' },
  { type: 'quote', label: 'New Quote', icon: FilePenLine, color: 'from-violet-600 to-brand-600' },
  { type: 'receipt', label: 'New Receipt', icon: Receipt, color: 'from-emerald-600 to-teal-600' },
  { type: 'credit_note', label: 'Credit Note', icon: FileMinus, color: 'from-amber-600 to-orange-600' },
]

export default function DocDraftHome() {
  const [profile, setProfile] = useState(() => ensureDefaultProfile())
  const [docs, setDocs] = useState([])
  const [view, setView] = useState('home')
  const [builderType, setBuilderType] = useState('invoice')
  const [activeDoc, setActiveDoc] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const p = ensureDefaultProfile()
    setProfile(p)
    try {
      const list = await loadDocuments(p.id)
      setDocs(list)
      setStats(computeDocStats(list))
    } catch {
      toast.error('Dokumente konnten nicht geladen werden')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const openBuilder = (type, doc = null) => {
    setBuilderType(type)
    setActiveDoc(doc)
    setView('builder')
  }

  if (!profile) return null

  if (loading && view === 'home') {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4" aria-busy="true" aria-label="DocDraft wird geladen">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-800" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-800/80" />
          ))}
        </div>
        <div className="h-40 animate-pulse rounded-2xl bg-slate-800/60" />
      </div>
    )
  }

  if (view === 'profiles') {
    return <BusinessProfileManager onBack={() => setView('home')} onChanged={refresh} />
  }
  if (view === 'products') {
    return <ProductCatalog profileId={profile.id} onBack={() => setView('home')} />
  }
  if (view === 'clients') {
    return <ClientDatabase profileId={profile.id} onBack={() => setView('home')} />
  }
  if (view === 'settings') {
    return <DocDraftSettings profile={profile} onBack={() => setView('home')} onChanged={refresh} />
  }
  if (view === 'reports') {
    return <ReportsPage onBack={() => setView('home')} />
  }
  if (view === 'recurring') {
    return <RecurringInvoices onBack={() => setView('home')} />
  }
  if (view === 'builder') {
    return (
      <div className="w-full">
        <header className="safe-top mb-4">
          <h1 className="text-xl font-bold capitalize">{builderType.replace('_', ' ')}</h1>
        </header>
        <DocumentBuilder
          profile={profile}
          documentType={builderType}
          existingDoc={activeDoc}
          onCancel={() => {
            setView('home')
            setActiveDoc(null)
          }}
          onSaved={() => refresh()}
          onSend={(saved) => {
            setActiveDoc(saved)
            setView('send')
          }}
        />
      </div>
    )
  }
  if (view === 'send' && activeDoc) {
    return (
      <SendDocumentScreen
        doc={activeDoc}
        profile={profile}
        client={null}
        onBack={() => setView('detail')}
        onSent={refresh}
      />
    )
  }
  if (view === 'detail' && activeDoc) {
    return (
      <DocumentDetail
        doc={activeDoc}
        profile={profile}
        onBack={() => {
          setView('home')
          setActiveDoc(null)
        }}
        onUpdated={refresh}
        onSend={(d) => {
          setActiveDoc(d)
          setView('send')
        }}
      />
    )
  }

  const recent = docs.slice(0, 8)
  const overdue = docs.filter((d) => {
    if (!d.due_date || d.status === 'paid') return false
    return new Date(d.due_date) < new Date() && d.status !== 'draft'
  })

  return (
    <div className="w-full">
      <header className="safe-top mb-4">
        <h1 className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
          DocDraft
        </h1>
      </header>

      <ModuleGuideBanner moduleId="docdraft" title="DocDraft" />

      <PremiumCard
        gradient
        className="mb-4 flex items-center gap-3 p-4"
        onClick={() => setView('profiles')}
      >
        {profile.logoUrl ? (
          <img src={profile.logoUrl} alt="" className="h-12 w-12 rounded-xl object-cover" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/30">
            <FilePenLine className="h-6 w-6 text-brand-300" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{profile.businessName || 'Set up business'}</p>
          <p className="text-xs text-slate-400">{profile.legalStructure}</p>
        </div>
        <span className="text-xs text-brand-400">Switch</span>
        <ChevronRight className="h-4 w-4 text-slate-500" />
      </PremiumCard>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-4">
        {QUICK_ACTIONS.map(({ type, label, icon: Icon, color }) => (
          <motion.button
            key={type}
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => openBuilder(type)}
            className={`flex flex-col items-start gap-2 rounded-2xl bg-gradient-to-br ${color} p-4 text-left shadow-lg`}
          >
            <Icon className="h-6 w-6 text-white/90" />
            <span className="text-sm font-semibold text-white">{label}</span>
          </motion.button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => openBuilder('delivery_note')}
        className="premium-card mb-4 flex w-full items-center gap-2 p-3 text-sm"
      >
        <Truck className="h-4 w-4 text-brand-400" /> New delivery note (Lieferschein)
      </button>

      {stats && (
        <div className="mb-4 grid grid-cols-2 gap-2 text-center text-sm">
          <div className="premium-card p-3">
            <p className="text-xs text-slate-500">Invoiced (month)</p>
            <p className="font-bold">€{stats.invoicedMonth.toFixed(0)}</p>
          </div>
          <div className="premium-card p-3">
            <p className="text-xs text-slate-500">Paid (month)</p>
            <p className="font-bold text-emerald-400">€{stats.paidMonth.toFixed(0)}</p>
          </div>
          <div className="premium-card p-3">
            <p className="text-xs text-slate-500">Outstanding</p>
            <p className="font-bold">€{stats.outstanding.toFixed(0)}</p>
          </div>
          <div className="premium-card p-3">
            <p className="text-xs text-slate-500">Overdue</p>
            <p className={`font-bold ${stats.overdueCount ? 'text-red-400' : ''}`}>
              {stats.overdueCount}
            </p>
          </div>
        </div>
      )}

      {overdue.length > 0 && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
          <p className="flex items-center gap-2 text-sm font-medium text-red-200">
            <AlertTriangle className="h-4 w-4" />
            {overdue.length} overdue invoice(s)
          </p>
        </div>
      )}

      <PaymentDonut statusCounts={stats?.statusCounts || {}} />

      <div className="mb-4 mt-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {[
          { v: 'clients', icon: Users, l: 'Clients' },
          { v: 'products', icon: Package, l: 'Products' },
          { v: 'reports', icon: FileText, l: 'Reports' },
          { v: 'recurring', icon: Receipt, l: 'Recurring' },
          { v: 'settings', icon: Settings, l: 'Settings' },
        ].map(({ v, icon: Icon, l }) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className="premium-card flex shrink-0 items-center gap-2 px-4 py-2 text-sm"
          >
            <Icon className="h-4 w-4 text-brand-400" /> {l}
          </button>
        ))}
      </div>

      <h3 className="mb-2 text-sm font-semibold text-slate-400">Recent documents</h3>
      {recent.length === 0 ? (
        <EmptyState
          icon={FilePenLine}
          title="No documents yet"
          description="Create your first Rechnung, Angebot, or Quittung."
        />
      ) : (
        <div className="space-y-2">
          {recent.map((d) => (
            <PremiumCard
              key={d.id}
              className="flex items-center justify-between p-4"
              onClick={() => {
                setActiveDoc(d)
                setView('detail')
              }}
            >
              <div>
                <p className="font-medium capitalize">{d.document_type?.replace('_', ' ')}</p>
                <p className="text-xs text-slate-500">
                  {d.document_number} · {d.total_gross?.toFixed(2)} €
                </p>
              </div>
              <span className="rounded-full bg-slate-700/80 px-2 py-0.5 text-xs capitalize">
                {d.status}
              </span>
            </PremiumCard>
          ))}
        </div>
      )}
    </div>
  )
}
