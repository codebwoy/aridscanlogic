import { useState, useMemo } from 'react'
import { Search, Grid, List, FileText, Trash2, Archive, CheckSquare, Square } from 'lucide-react'
import { toast } from 'sonner'
import { listDocuments, deleteDocument } from '@/lib/scanvault/store'
import { canBatchExport } from '@/lib/scanvault/limits'
import { exportDocumentsZip } from '@/lib/scanvault/export'

const SORTS = [
  { id: 'newest', fn: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) },
  { id: 'oldest', fn: (a, b) => new Date(a.createdAt) - new Date(b.createdAt) },
  { id: 'name', fn: (a, b) => (a.name || '').localeCompare(b.name || '') },
  { id: 'size', fn: (a, b) => (b.fileSizeBytes || 0) - (a.fileSizeBytes || 0) },
]

export default function DocumentsTab({ onOpenDoc, onSearch, folderId, user, onUpgrade }) {
  const [docs, setDocs] = useState(listDocuments())
  const [view, setView] = useState('grid')
  const [sort, setSort] = useState('newest')
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected] = useState(new Set())

  const refresh = () => {
    setDocs(listDocuments())
    setSelected(new Set())
  }

  const filtered = useMemo(() => {
    let list = folderId ? docs.filter((d) => d.folderId === folderId) : [...docs]
    const s = SORTS.find((x) => x.id === sort)
    if (s) list.sort(s.fn)
    if (filter === 'week') {
      const week = Date.now() - 7 * 86400000
      list = list.filter((d) => new Date(d.createdAt) >= week)
    }
    if (filter === 'month') {
      const month = Date.now() - 30 * 86400000
      list = list.filter((d) => new Date(d.createdAt) >= month)
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (d) =>
          d.name?.toLowerCase().includes(q) || d.extractedText?.toLowerCase().includes(q)
      )
    }
    return list
  }, [docs, sort, filter, query, folderId])

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const bulkDelete = () => {
    if (!selected.size) return
    if (!window.confirm(`Delete ${selected.size} document(s)?`)) return
    selected.forEach((id) => deleteDocument(id))
    toast.success('Deleted')
    setSelectMode(false)
    refresh()
  }

  const bulkZip = async () => {
    if (!canBatchExport(user)) {
      toast.error('Batch export is Premium')
      onUpgrade?.()
      return
    }
    const items = filtered.filter((d) => selected.has(d.id))
    if (!items.length) {
      toast.error('Select documents first')
      return
    }
    try {
      await exportDocumentsZip(items, user)
      toast.success('ZIP downloaded')
    } catch (e) {
      toast.error(e.message || 'Export failed')
    }
  }

  const formatSize = (b) => {
    if (!b) return '—'
    if (b < 1024) return `${b} B`
    return `${(b / 1024).toFixed(0)} KB`
  }

  const DocCard = ({ d }) => {
    const isSel = selected.has(d.id)
    return (
      <button
        key={d.id}
        type="button"
        onClick={() => (selectMode ? toggleSelect(d.id) : onOpenDoc(d))}
        className={`rounded-xl bg-white/5 p-2 text-left ${isSel ? 'ring-2 ring-[#007AFF]' : ''}`}
      >
        <div className="relative">
          <img
            src={d.thumbnailUrl}
            alt=""
            className="mb-2 aspect-[3/4] w-full rounded-lg object-cover bg-black"
          />
          {selectMode && (
            <span className="absolute right-2 top-2 rounded-full bg-black/60 p-1">
              {isSel ? <CheckSquare className="h-4 w-4 text-[#007AFF]" /> : <Square className="h-4 w-4" />}
            </span>
          )}
        </div>
        <p className="truncate text-sm font-medium">{d.name}</p>
        <p className="text-[10px] text-slate-500">
          {d.pageCount} pg · {formatSize(d.fileSizeBytes)}
        </p>
      </button>
    )
  }

  return (
    <div className="px-4 pb-4">
      <div className="safe-top mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Documents</h1>
        <button
          type="button"
          onClick={() => {
            setSelectMode(!selectMode)
            setSelected(new Set())
          }}
          className="text-sm text-[#007AFF]"
        >
          {selectMode ? 'Cancel' : 'Select'}
        </button>
      </div>

      {selectMode && selected.size > 0 && (
        <div className="mb-3 flex gap-2">
          <button
            type="button"
            onClick={bulkDelete}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-red-500/20 py-2 text-sm text-red-300"
          >
            <Trash2 className="h-4 w-4" /> Delete ({selected.size})
          </button>
          <button
            type="button"
            onClick={bulkZip}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#007AFF]/20 py-2 text-sm"
          >
            <Archive className="h-4 w-4" /> ZIP ({selected.size})
          </button>
        </div>
      )}

      <div className="relative mb-3">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (e.target.value.length > 2) onSearch?.(e.target.value)
          }}
          placeholder="Search documents & OCR text…"
          className="min-h-[48px] w-full rounded-xl bg-white/10 py-2 pl-10 pr-3 text-sm"
        />
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg bg-white/10 px-2 py-1 text-xs"
        >
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id}
            </option>
          ))}
        </select>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg bg-white/10 px-2 py-1 text-xs"
        >
          <option value="all">All</option>
          <option value="week">This week</option>
          <option value="month">This month</option>
        </select>
        <button type="button" onClick={() => setView('grid')} className="rounded-lg bg-white/10 p-2">
          <Grid className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => setView('list')} className="rounded-lg bg-white/10 p-2">
          <List className="h-4 w-4" />
        </button>
        <button type="button" onClick={refresh} className="text-xs text-[#007AFF]">
          Refresh
        </button>
      </div>
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-slate-500">
          <FileText className="mx-auto mb-3 h-12 w-12 opacity-40" />
          <p>No documents yet</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((d) => (
            <DocCard key={d.id} d={d} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => (selectMode ? toggleSelect(d.id) : onOpenDoc(d))}
              className={`flex w-full gap-3 rounded-xl bg-white/5 p-3 text-left ${
                selected.has(d.id) ? 'ring-2 ring-[#007AFF]' : ''
              }`}
            >
              <img src={d.thumbnailUrl} alt="" className="h-14 w-10 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{d.name}</p>
                <p className="text-xs text-slate-500">
                  {new Date(d.createdAt).toLocaleDateString()} · {d.pageCount} pages
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
