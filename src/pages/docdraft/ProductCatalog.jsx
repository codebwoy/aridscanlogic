import { useState } from 'react'
import { Plus, Trash2, Package } from 'lucide-react'
import { toast } from 'sonner'
import { loadProducts, saveProduct, deleteProduct } from '@/lib/docdraft/store'
import PremiumCard from '@/components/shared/PremiumCard'

export default function ProductCatalog({ profileId, onBack, onSelect }) {
  const [products, setProducts] = useState(() => loadProducts(profileId))
  const [form, setForm] = useState({
    name: '',
    description: '',
    unitPrice: 0,
    vatRate: 19,
    unit: 'piece',
    sku: '',
    ean: '',
    lot_number: '',
    category: '',
    isActive: true,
  })

  const refresh = () => setProducts([...loadProducts(profileId)])

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Product name required')
      return
    }
    saveProduct(profileId, form)
    setForm({
      name: '',
      description: '',
      unitPrice: 0,
      vatRate: 19,
      unit: 'piece',
      sku: '',
      ean: '',
      lot_number: '',
      category: '',
      isActive: true,
    })
    refresh()
    toast.success('Product saved')
  }

  return (
    <div className="w-full">
      <button type="button" onClick={onBack} className="safe-top mb-4 text-sm text-slate-400">
        ← Back
      </button>
      <h2 className="mb-4 text-xl font-bold">Products & Services</h2>

      <form onSubmit={submit} className="premium-card mb-6 space-y-3 p-4">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            step="0.01"
            placeholder="Unit price (net)"
            value={form.unitPrice}
            onChange={(e) => setForm({ ...form, unitPrice: parseFloat(e.target.value) || 0 })}
            className="rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
          />
          <select
            value={form.vatRate}
            onChange={(e) => setForm({ ...form, vatRate: parseInt(e.target.value, 10) })}
            className="rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
          >
            <option value={19}>19%</option>
            <option value={7}>7%</option>
            <option value={0}>0%</option>
          </select>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <input
            placeholder="Art.-Nr. / SKU"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            className="rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
          />
          <input
            placeholder="EAN"
            value={form.ean}
            onChange={(e) => setForm({ ...form, ean: e.target.value })}
            className="rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
          />
          <input
            placeholder="Losnummer"
            value={form.lot_number}
            onChange={(e) => setForm({ ...form, lot_number: e.target.value })}
            className="rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
          />
        </div>
        <button type="submit" className="btn-primary w-full rounded-xl py-2.5 text-sm font-semibold">
          <Plus className="mr-1 inline h-4 w-4" /> Add product
        </button>
      </form>

      <div className="space-y-2">
        {products.map((p) => (
          <PremiumCard key={p.id} className="flex items-center gap-3 p-4">
            <Package className="h-5 w-5 text-brand-400" />
            <div className="flex-1">
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-slate-500">
                {p.unitPrice?.toFixed(2)} € · {p.vatRate}% · {p.unit}
              </p>
            </div>
            {onSelect && (
              <button type="button" onClick={() => onSelect(p)} className="text-xs text-brand-400">
                Use
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                deleteProduct(profileId, p.id)
                refresh()
              }}
              className="text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </PremiumCard>
        ))}
      </div>
    </div>
  )
}
