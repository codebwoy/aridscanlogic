import { useState } from 'react'
import { ChevronLeft, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  getAllCategories,
  saveCustomCategory,
  deleteCustomCategory,
  setCategoryBudget,
  isOverBudget,
  getCategorySpend,
} from '@/lib/taxvault/categories'

export default function TaxVaultCategoryManager({ receipts, taxYear, onBack }) {
  const [categories, setCategories] = useState(getAllCategories())
  const [name, setName] = useState('')
  const [budget, setBudget] = useState('')
  const [color, setColor] = useState('#6366f1')

  const refresh = () => setCategories(getAllCategories())

  const yearReceipts = receipts.filter(
    (r) => (r.tax_year || new Date(r.purchase_date).getFullYear()) === taxYear
  )

  const addCustom = () => {
    if (!name.trim()) return
    saveCustomCategory({ name: name.trim(), color, budget: parseFloat(budget) || 0, icon: null })
    setName('')
    setBudget('')
    refresh()
    toast.success('Category added')
  }

  return (
    <div className="w-full">
      <button type="button" onClick={onBack} className="safe-top mb-3 flex items-center gap-1 text-sm text-slate-400">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      <h2 className="mb-4 text-xl font-bold">Expense categories</h2>

      <div className="mb-6 space-y-2 rounded-xl bg-slate-800/60 p-4">
        <p className="text-xs font-semibold text-slate-400">Add custom category</p>
        <input
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Monthly budget €"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm"
          />
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-12 rounded" />
        </div>
        <button type="button" onClick={addCustom} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-2 text-sm">
          <Plus className="h-4 w-4" /> Add category
        </button>
      </div>

      <div className="space-y-2">
        {categories.map((c) => {
          const spend = getCategorySpend(yearReceipts, c.name)
          const over = isOverBudget(yearReceipts, c)
          return (
            <div
              key={c.id || c.name}
              className={`rounded-xl border p-3 ${over ? 'border-amber-500/50 bg-amber-500/10' : 'border-slate-700 bg-slate-800/60'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="font-medium">{c.name}</span>
                  {c.isCustom && (
                    <span className="text-[10px] text-slate-500">custom</span>
                  )}
                </div>
                {c.isCustom && (
                  <button
                    type="button"
                    onClick={() => {
                      deleteCustomCategory(c.id)
                      refresh()
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <label className="text-xs text-slate-500">Budget €/mo</label>
                <input
                  type="number"
                  defaultValue={c.budget}
                  onBlur={(e) => {
                    setCategoryBudget(c.name, parseFloat(e.target.value) || 0)
                    refresh()
                  }}
                  className="w-24 rounded bg-slate-900 px-2 py-1 text-xs"
                />
                <span className={`text-xs ${over ? 'text-amber-300' : 'text-slate-500'}`}>
                  Spent: {spend.toFixed(0)} €{over ? ' — over budget!' : ''}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
