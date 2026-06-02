import { useState } from 'react'
import { ChevronLeft, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { listRecurring, saveRecurring, deleteRecurring } from '@/lib/docdraft/recurring'

export default function RecurringInvoices({ onBack }) {
  const [items, setItems] = useState(listRecurring())
  const [form, setForm] = useState({
    clientName: '',
    amount: '',
    interval: 'monthly',
    nextDate: new Date().toISOString().slice(0, 10),
  })

  const add = () => {
    if (!form.clientName || !form.amount) return
    saveRecurring({ ...form, amount: parseFloat(form.amount) })
    setItems(listRecurring())
    setForm({ clientName: '', amount: '', interval: 'monthly', nextDate: form.nextDate })
    toast.success('Recurring series saved')
  }

  return (
    <div className="px-4 pb-4">
      <button type="button" onClick={onBack} className="safe-top mb-3 text-sm text-slate-400">
        ← Back
      </button>
      <h2 className="mb-4 text-xl font-bold">Recurring invoices</h2>
      <div className="mb-4 space-y-2 rounded-xl bg-slate-800/60 p-4">
        <input
          placeholder="Client name"
          value={form.clientName}
          onChange={(e) => setForm({ ...form, clientName: e.target.value })}
          className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
        />
        <input
          type="number"
          placeholder="Amount €"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
        />
        <select
          value={form.interval}
          onChange={(e) => setForm({ ...form, interval: e.target.value })}
          className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
        >
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="annually">Annually</option>
        </select>
        <input
          type="date"
          value={form.nextDate}
          onChange={(e) => setForm({ ...form, nextDate: e.target.value })}
          className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
        />
        <button type="button" onClick={add} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-2 text-sm">
          <Plus className="h-4 w-4" /> Add series
        </button>
      </div>
      <div className="space-y-2">
        {items.map((r) => (
          <div key={r.id} className="flex items-center justify-between rounded-xl bg-slate-800/80 p-3 text-sm">
            <div>
              <p className="font-medium">{r.clientName}</p>
              <p className="text-xs text-slate-500">
                {r.amount} € · {r.interval} · next {r.nextDate}
              </p>
            </div>
            <button type="button" onClick={() => { deleteRecurring(r.id); setItems(listRecurring()) }}>
              <Trash2 className="h-4 w-4 text-red-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
