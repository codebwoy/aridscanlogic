import { useState, useEffect, useMemo } from 'react'
import { Plus, FileSignature, PenLine, Library, FileDown, XCircle, Search, Copy, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { useConfirm } from '@/context/ConfirmContext'
import appApi from '@/lib/appApi'
import ContractDesigner from './ContractDesigner'
import SigningFlow from './SigningFlow'
import SigningAudit from './SigningAudit'
import TemplateLibrary from './TemplateLibrary'
import EmptyState from '@/components/shared/EmptyState'
import ModuleGuideBanner from '@/components/guide/ModuleGuideBanner'
import { generateSignedContractPdf } from '@/lib/contractsafe/contractPdf'
import DocumentBrandingToggle, { useDocumentBranding } from '@/components/shared/DocumentBrandingToggle'
import { logContractEvent } from '@/lib/contractsafe/auditLog'

const STATUS_FILTERS = ['all', 'draft', 'sent', 'partially_signed', 'fully_signed', 'voided']

export default function ContractSafeHome() {
  const confirm = useConfirm()
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [signingContract, setSigningContract] = useState(null)
  const [selected, setSelected] = useState(null)
  const [showTemplates, setShowTemplates] = useState(false)
  const [templateSeed, setTemplateSeed] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { includeBranding, setIncludeBranding } = useDocumentBranding()

  const load = async () => {
    setLoading(true)
    try {
      setContracts(await appApi.entities.Contract.list())
    } catch {
      toast.error('Verträge konnten nicht geladen werden')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    let list = [...contracts]
    if (statusFilter !== 'all') list = list.filter((c) => c.status === statusFilter)
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.template_type?.toLowerCase().includes(q)
      )
    }
    return list.sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
  }, [contracts, search, statusFilter])

  const exportPdf = async (c) => {
    try {
      const signers = await appApi.entities.ContractSigner.list({ contract_id: c.id })
      await generateSignedContractPdf(c, signers, { branding: includeBranding })
      toast.success('PDF downloaded')
    } catch {
      toast.error('PDF export failed')
    }
  }

  const voidContract = async (c) => {
    const ok = await confirm({
      title: 'Vertrag annullieren',
      message: 'Diesen Vertrag als ungültig markieren?',
      confirmLabel: 'Annullieren',
      destructive: true,
    })
    if (!ok) return
    await appApi.entities.Contract.update(c.id, { status: 'voided' })
    logContractEvent(c.id, { type: 'voided' })
    load()
    toast.success('Contract voided')
  }

  const duplicateContract = async (c) => {
    const copy = await appApi.entities.Contract.create({
      title: `${c.title} (copy)`,
      template_type: c.template_type,
      sections: c.sections,
      signing_order: c.signing_order,
      status: 'draft',
    })
    logContractEvent(copy.id, { type: 'duplicated', from: c.id })
    load()
    toast.success('Draft duplicate created')
    setEditing(copy)
  }

  if (showTemplates) {
    return (
      <TemplateLibrary
        onBack={() => setShowTemplates(false)}
        onSelect={(key, t) => {
          setTemplateSeed({ templateKey: key, ...t })
          setShowTemplates(false)
          setEditing({
            title: t.title,
            template_type: t.template_type,
            contract_body: { sections: t.sections },
          })
        }}
      />
    )
  }

  if (signingContract) {
    return (
      <SigningFlow
        contract={signingContract}
        onBack={() => setSigningContract(null)}
        onUpdated={load}
      />
    )
  }

  if (editing !== null) {
    return (
      <div className="w-full">
        <header className="safe-top mb-4">
          <h1 className="text-xl font-bold">{editing?.id ? 'Edit contract' : 'Create contract'}</h1>
        </header>
        <ContractDesigner
          contract={editing?.id ? editing : templateSeed ? editing : null}
          initialTemplate={templateSeed}
          onSaved={() => {
            setEditing(null)
            setTemplateSeed(null)
            load()
          }}
          onCancel={() => {
            setEditing(null)
            setTemplateSeed(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="w-full">
      <header className="safe-top mb-4">
        <h1 className="text-xl font-bold sm:text-2xl">Contract Safe</h1>
        <p className="text-sm text-slate-400">Templates · Signing · Audit · Search</p>
      </header>

      <ModuleGuideBanner moduleId="contracts" title="Contracts" />

      <div className="relative mb-3">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contracts…"
          aria-label="Verträge durchsuchen"
          className="w-full rounded-xl bg-slate-800 py-2 pl-9 pr-3 text-sm"
        />
      </div>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        aria-label="Status filtern"
        className="mb-4 w-full rounded-xl bg-slate-800 px-3 py-2 text-sm"
      >
        {STATUS_FILTERS.map((s) => (
          <option key={s} value={s}>
            {s === 'all' ? 'All statuses' : s.replace('_', ' ')}
          </option>
        ))}
      </select>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setEditing({})}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3 font-semibold"
        >
          <Plus className="h-5 w-5" /> New contract
        </button>
        <button
          type="button"
          onClick={() => setShowTemplates(true)}
          className="flex items-center gap-2 rounded-2xl border border-slate-700 px-4 py-3"
        >
          <Library className="h-5 w-5" />
        </button>
      </div>

      <DocumentBrandingToggle checked={includeBranding} onChange={setIncludeBranding} className="mb-4" />

      {loading ? (
        <div className="grid-cards" aria-busy="true" aria-label="Verträge werden geladen">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-800/80" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileSignature}
          title="Keine Verträge"
          description="NDA, Freelance, SaaS, Impressum, Datenschutz, AVV — 9+ templates."
        />
      ) : (
        <div className="grid-cards">
          {filtered.map((c) => (
            <div key={c.id} className="rounded-xl bg-slate-800/80 p-4">
              <button
                type="button"
                onClick={() => setSelected(selected?.id === c.id ? null : c)}
                className="w-full text-left"
              >
                <p className="font-medium">{c.title}</p>
                <p className="text-xs text-slate-500 capitalize">
                  {c.template_type} · {c.status} · {c.signing_order}
                </p>
              </button>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.status === 'draft' && (
                  <button
                    type="button"
                    onClick={() => setEditing(c)}
                    className="flex items-center gap-1 rounded-lg bg-slate-700 px-3 py-2 text-xs"
                  >
                    <Pencil className="h-4 w-4" /> Edit
                  </button>
                )}
                {c.status !== 'fully_signed' && c.status !== 'draft' && c.status !== 'voided' && (
                  <button
                    type="button"
                    onClick={() => setSigningContract(c)}
                    className="flex items-center gap-1 rounded-lg border border-brand-500/40 px-3 py-2 text-xs text-brand-300"
                  >
                    <PenLine className="h-4 w-4" /> Sign
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => exportPdf(c)}
                  className="flex items-center gap-1 rounded-lg bg-slate-700 px-3 py-2 text-xs"
                >
                  <FileDown className="h-4 w-4" /> PDF
                </button>
                <button
                  type="button"
                  onClick={() => duplicateContract(c)}
                  className="flex items-center gap-1 rounded-lg bg-slate-700 px-3 py-2 text-xs"
                >
                  <Copy className="h-4 w-4" /> Duplicate
                </button>
                {c.status !== 'voided' && (
                  <button
                    type="button"
                    onClick={() => voidContract(c)}
                    className="flex items-center gap-1 rounded-lg border border-red-500/30 px-3 py-2 text-xs text-red-400"
                  >
                    <XCircle className="h-4 w-4" /> Void
                  </button>
                )}
              </div>
              {selected?.id === c.id && <SigningAudit contractId={c.id} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
