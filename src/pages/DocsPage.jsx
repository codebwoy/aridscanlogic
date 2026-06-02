import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Scan, Star, FolderOpen, Plus, Search, Trash2, CheckSquare, Square, FileDown, Archive } from 'lucide-react'
import { toast } from 'sonner'
import appApi from '@/lib/appApi'
import ScannerFlow from '@/components/scanner/ScannerFlow'
import DocumentDetail from '@/components/scanner/DocumentDetail'
import EmptyState from '@/components/shared/EmptyState'
import { exportDocumentPdf, exportDocumentsZip } from '@/lib/docs/export'
import { createDraftFromScan } from '@/lib/docdraft/fromScan'
import ModuleGuideBanner from '@/components/guide/ModuleGuideBanner'

const FOLDERS = ['Inbox', 'Receipts', 'Contracts', 'Archive']

export default function DocsPage({ onOpenTaxVault, onOpenDocDraft }) {
  const [scanning, setScanning] = useState(false)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [search, setSearch] = useState('')
  const [folder, setFolder] = useState('all')
  const [starredOnly, setStarredOnly] = useState(false)
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected] = useState(new Set())

  const loadDocs = async () => {
    try {
      setDocuments(await appApi.entities.Document.list())
    } catch {
      toast.error('Dokumente konnten nicht geladen werden')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDocs()
  }, [])

  const filtered = useMemo(() => {
    let list = [...documents]
    if (folder !== 'all') list = list.filter((d) => (d.folder || 'Inbox') === folder)
    if (starredOnly) list = list.filter((d) => d.is_starred)
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (d) =>
          d.title?.toLowerCase().includes(q) ||
          d.ocr_text?.toLowerCase().includes(q) ||
          d.markdown_result?.toLowerCase().includes(q)
      )
    }
    return list
  }, [documents, search, folder, starredOnly])

  const bulkDelete = async () => {
    if (!selected.size || !window.confirm(`Delete ${selected.size} documents?`)) return
    for (const id of selected) await appApi.entities.Document.delete(id)
    setSelected(new Set())
    setSelectMode(false)
    loadDocs()
    toast.success('Deleted')
  }

  const bulkZip = async () => {
    const items = filtered.filter((d) => selected.has(d.id))
    if (!items.length) return
    try {
      await exportDocumentsZip(items)
      toast.success('ZIP downloaded')
    } catch {
      toast.error('Export failed')
    }
  }

  const moveFolder = async (doc, newFolder) => {
    await appApi.entities.Document.update(doc.id, { folder: newFolder })
    loadDocs()
    toast.success(`Moved to ${newFolder}`)
  }

  const sendToTaxVault = async (doc) => {
    try {
      await appApi.entities.Receipt.create({
        vendor_name: doc.title || 'From scan',
        purchase_date: new Date().toISOString().slice(0, 10),
        total_amount: 0,
        vat_amount: 0,
        currency: 'EUR',
        category: 'Other Business Expense',
        deductible_amount: 0,
        tax_year: new Date().getFullYear(),
        image_url: doc.pages?.[0],
        note: doc.ocr_text?.slice(0, 500),
        expense_type: 'business',
      })
      toast.success('Sent to Tax Vault')
      onOpenTaxVault?.()
    } catch {
      toast.error('Failed')
    }
  }

  const sendToDocDraft = async (doc) => {
    try {
      await createDraftFromScan(doc)
      toast.success('Draft invoice created in DocDraft')
      onOpenDocDraft?.()
    } catch {
      toast.error('Could not create draft')
    }
  }

  if (scanning) {
    return (
      <ScannerFlow
        onBack={() => setScanning(false)}
        onSaved={() => {
          setScanning(false)
          loadDocs()
        }}
      />
    )
  }

  if (selectedDoc) {
    return (
      <DocumentDetail
        document={selectedDoc}
        onBack={() => setSelectedDoc(null)}
        onUpdated={loadDocs}
        onSendToTaxVault={sendToTaxVault}
        onSendToDocDraft={sendToDocDraft}
        folders={FOLDERS}
        onMoveFolder={(f) => moveFolder(selectedDoc, f)}
        onExportPdf={async () => {
          await exportDocumentPdf(selectedDoc)
          toast.success('PDF downloaded')
        }}
      />
    )
  }

  return (
    <div className="w-full">
      <header className="safe-top mb-4">
        <h1 className="bg-gradient-to-r from-white via-brand-100 to-slate-400 bg-clip-text text-xl font-bold text-transparent sm:text-2xl lg:text-3xl">
          ScanLogic AI
        </h1>
        <p className="text-sm text-slate-400">Multi-page scan · OCR · Search · Folders · Export</p>
      </header>

      <ModuleGuideBanner moduleId="docs" title="Docs" />

      <div className="relative mb-3">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title & OCR text…"
          className="w-full rounded-xl bg-slate-800 py-2 pl-9 pr-3 text-sm"
        />
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        <select value={folder} onChange={(e) => setFolder(e.target.value)} className="rounded-lg bg-slate-800 px-2 py-1 text-xs">
          <option value="all">All folders</option>
          {FOLDERS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setStarredOnly(!starredOnly)}
          className={`rounded-lg px-2 py-1 text-xs ${starredOnly ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800'}`}
        >
          <Star className="inline h-3 w-3" /> Starred
        </button>
        <button type="button" onClick={() => setSelectMode(!selectMode)} className="rounded-lg bg-slate-800 px-2 py-1 text-xs">
          {selectMode ? 'Cancel' : 'Select'}
        </button>
        {selectMode && selected.size > 0 && (
          <>
            <button type="button" onClick={bulkDelete} className="flex items-center gap-1 rounded-lg bg-red-500/20 px-2 py-1 text-xs text-red-300">
              <Trash2 className="h-3 w-3" /> Delete ({selected.size})
            </button>
            <button type="button" onClick={bulkZip} className="flex items-center gap-1 rounded-lg bg-brand-600/20 px-2 py-1 text-xs text-brand-300">
              <Archive className="h-3 w-3" /> ZIP
            </button>
          </>
        )}
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => setScanning(true)}
        className="btn-primary mb-4 flex w-full items-center justify-center gap-3 rounded-2xl py-4 font-semibold"
      >
        <Scan className="h-6 w-6" />
        Neuer Scan
      </motion.button>

      {loading ? (
        <p className="text-center text-slate-500">Laden…</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Keine Dokumente"
          description="Starten Sie Ihren ersten Multi-Page-Scan mit KI-OCR."
          action={
            <button type="button" onClick={() => setScanning(true)} className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm">
              <Plus className="h-4 w-4" /> Scan starten
            </button>
          }
        />
      ) : (
        <div className="space-y-3 md:max-w-none">
          {filtered.map((doc) => (
            <div key={doc.id} className="flex gap-2">
              {selectMode && (
                <button
                  type="button"
                  className="self-center"
                  onClick={() => {
                    const n = new Set(selected)
                    if (n.has(doc.id)) n.delete(doc.id)
                    else n.add(doc.id)
                    setSelected(n)
                  }}
                >
                  {selected.has(doc.id) ? (
                    <CheckSquare className="h-5 w-5 text-brand-400" />
                  ) : (
                    <Square className="h-5 w-5 text-slate-600" />
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={() => !selectMode && setSelectedDoc(doc)}
                className="premium-card flex flex-1 gap-3 p-3 text-left"
              >
                {doc.pages?.[0] ? (
                  <img src={doc.pages[0]} alt="" className="h-14 w-10 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-14 w-10 items-center justify-center rounded-lg bg-slate-700">
                    <Scan className="h-5 w-5 text-slate-500" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <p className="truncate font-medium">{doc.title}</p>
                    {doc.is_starred && <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />}
                  </div>
                  <p className="text-xs text-slate-500">
                    {doc.page_count} Seite(n) · {doc.folder || 'Inbox'} · {doc.document_type}
                  </p>
                </div>
                {!selectMode && (
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation()
                      await exportDocumentPdf(doc)
                      toast.success('PDF')
                    }}
                    className="self-center rounded-lg bg-slate-800 p-2"
                  >
                    <FileDown className="h-4 w-4" />
                  </button>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
