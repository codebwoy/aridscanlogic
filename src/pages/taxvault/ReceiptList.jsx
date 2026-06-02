import { useMemo, useState } from 'react'
import { Search, ChevronRight, CheckSquare, Square, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import appApi from '@/lib/appApi'
import { getCategoryByName } from '@/lib/taxvault/categories'
import { filterByTaxYear } from '@/lib/taxvault/stats'
import { loadTaxVaultProfile } from '@/lib/taxvault/profile'
import { exportReceiptsCsv } from '@/lib/taxvault/exportReport'

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'amount_high', label: 'Highest amount' },
  { id: 'amount_low', label: 'Lowest amount' },
  { id: 'category', label: 'Category' },
]

export default function ReceiptList({ receipts, taxYear, onSelect, onRefresh }) {
  const profile = loadTaxVaultProfile()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [expenseFilter, setExpenseFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected] = useState(new Set())
  const [moveYear, setMoveYear] = useState(String(taxYear))

  const filtered = useMemo(() => {
    let list = filterByTaxYear(receipts, taxYear)
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (r) =>
          r.vendor_name?.toLowerCase().includes(q) ||
          r.note?.toLowerCase().includes(q) ||
          String(r.total_amount).includes(q)
      )
    }
    if (category) list = list.filter((r) => r.category === category)
    if (expenseFilter !== 'all') list = list.filter((r) => r.expense_type === expenseFilter)
    if (minAmount) list = list.filter((r) => (r.total_amount || 0) >= parseFloat(minAmount))
    if (maxAmount) list = list.filter((r) => (r.total_amount || 0) <= parseFloat(maxAmount))

    const sorted = [...list]
    if (sort === 'newest')
      sorted.sort((a, b) => (b.purchase_date || '').localeCompare(a.purchase_date || ''))
    if (sort === 'oldest')
      sorted.sort((a, b) => (a.purchase_date || '').localeCompare(b.purchase_date || ''))
    if (sort === 'amount_high') sorted.sort((a, b) => (b.total_amount || 0) - (a.total_amount || 0))
    if (sort === 'amount_low') sorted.sort((a, b) => (a.total_amount || 0) - (b.total_amount || 0))
    if (sort === 'category') sorted.sort((a, b) => (a.category || '').localeCompare(b.category || ''))
    return sorted
  }, [receipts, taxYear, search, category, expenseFilter, sort, minAmount, maxAmount])

  const total = filtered.reduce((s, r) => s + (r.total_amount || 0), 0)
  const deductible = filtered.reduce((s, r) => s + (r.deductible_amount || 0), 0)
  const sym = profile.homeCurrency === 'EUR' ? '€' : profile.homeCurrency
  const categories = [...new Set(receipts.map((r) => r.category).filter(Boolean))]

  const toggle = (id) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  const bulkDelete = async () => {
    if (!selected.size) return
    if (!window.confirm(`Delete ${selected.size} receipts permanently?`)) return
    try {
      for (const id of selected) {
        await appApi.entities.Receipt.delete(id)
      }
      toast.success('Deleted')
      setSelected(new Set())
      setSelectMode(false)
      onRefresh?.()
    } catch {
      toast.error('Delete failed')
    }
  }

  const bulkMoveYear = async () => {
    const y = parseInt(moveYear, 10)
    if (!y || !selected.size) return
    try {
      for (const id of selected) {
        await appApi.entities.Receipt.update(id, { tax_year: y })
      }
      toast.success(`Moved ${selected.size} to tax year ${y}`)
      setSelected(new Set())
      onRefresh?.()
    } catch {
      toast.error('Move failed')
    }
  }

  const exportSelected = () => {
    const list = filtered.filter((r) => selected.has(r.id))
    exportReceiptsCsv(list.length ? list : filtered, profile, taxYear)
    toast.success('CSV exported')
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setSelectMode(!selectMode)
            setSelected(new Set())
          }}
          className="rounded-lg bg-slate-800 px-3 py-1 text-xs"
        >
          {selectMode ? 'Cancel select' : 'Select multiple'}
        </button>
        {selectMode && selected.size > 0 && (
          <>
            <button type="button" onClick={bulkDelete} className="flex items-center gap-1 rounded-lg bg-red-500/20 px-3 py-1 text-xs text-red-300">
              <Trash2 className="h-3 w-3" /> Delete ({selected.size})
            </button>
            <select
              value={moveYear}
              onChange={(e) => setMoveYear(e.target.value)}
              className="rounded-lg bg-slate-800 px-2 py-1 text-xs"
            >
              {[taxYear - 1, taxYear, taxYear + 1].map((y) => (
                <option key={y} value={y}>
                  Year {y}
                </option>
              ))}
            </select>
            <button type="button" onClick={bulkMoveYear} className="rounded-lg bg-brand-600 px-3 py-1 text-xs">
              Move year
            </button>
            <button type="button" onClick={exportSelected} className="rounded-lg bg-slate-800 px-3 py-1 text-xs">
              Export CSV
            </button>
          </>
        )}
      </div>
      <div className="relative mb-3">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search vendor, note, amount…"
          className="w-full rounded-xl bg-slate-800 py-2 pl-9 pr-3 text-sm"
        />
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg bg-slate-800 px-2 py-1 text-xs">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={expenseFilter} onChange={(e) => setExpenseFilter(e.target.value)} className="rounded-lg bg-slate-800 px-2 py-1 text-xs">
          <option value="all">All types</option>
          <option value="business">Business</option>
          <option value="personal">Personal</option>
          <option value="mixed">Mixed</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg bg-slate-800 px-2 py-1 text-xs">
          {SORT_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3 flex gap-2">
        <input type="number" placeholder="Min" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} className="w-20 rounded-lg bg-slate-800 px-2 py-1 text-xs" />
        <input type="number" placeholder="Max" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} className="w-20 rounded-lg bg-slate-800 px-2 py-1 text-xs" />
      </div>
      <div className="space-y-2">
        {filtered.map((r) => {
          const cat = getCategoryByName(r.category)
          const isSel = selected.has(r.id)
          return (
            <div key={r.id} className="flex gap-2">
              {selectMode && (
                <button type="button" onClick={() => toggle(r.id)} className="self-center p-2">
                  {isSel ? <CheckSquare className="h-5 w-5 text-brand-400" /> : <Square className="h-5 w-5 text-slate-600" />}
                </button>
              )}
              <button
                type="button"
                onClick={() => (selectMode ? toggle(r.id) : onSelect(r))}
                className="flex flex-1 gap-3 rounded-xl bg-slate-800/80 p-3 text-left"
              >
                {r.image_url ? (
                  <img src={r.image_url} alt="" className="h-12 w-10 shrink-0 rounded object-cover" />
                ) : (
                  <div className="h-12 w-10 shrink-0 rounded bg-slate-700" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{r.vendor_name}</p>
                  <p className="text-xs text-slate-500">
                    {r.purchase_date} · {sym}
                    {r.total_amount?.toFixed(2)} · Y{r.tax_year}
                  </p>
                  <span className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px]" style={{ backgroundColor: `${cat.color}33`, color: cat.color }}>
                    {r.category}
                  </span>
                </div>
                <div className="text-right text-xs">
                  <p className="text-emerald-400">
                    {sym}
                    {r.deductible_amount?.toFixed(2)}
                  </p>
                </div>
                {!selectMode && <ChevronRight className="h-4 w-4 shrink-0 self-center text-slate-600" />}
              </button>
            </div>
          )
        })}
      </div>
      <p className="sticky bottom-0 mt-4 rounded-xl bg-slate-900/95 p-3 text-center text-xs text-slate-400">
        Showing {filtered.length} receipts — Total: {sym}
        {total.toFixed(2)} — Deductible: {sym}
        {deductible.toFixed(2)}
      </p>
    </div>
  )
}
