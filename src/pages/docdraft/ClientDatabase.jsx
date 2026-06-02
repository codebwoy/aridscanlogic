import { useState } from 'react'
import { Plus, Trash2, Users } from 'lucide-react'
import { toast } from 'sonner'
import { loadClients, saveClient, deleteClient } from '@/lib/docdraft/store'
import PremiumCard from '@/components/shared/PremiumCard'

export default function ClientDatabase({ profileId, onBack, onSelect }) {
  const [clients, setClients] = useState(() => loadClients(profileId))
  const [form, setForm] = useState({
    clientType: 'business',
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    billingAddress: '',
    shippingAddress: '',
    ustIdNr: '',
    defaultPaymentTerms: '',
    notes: '',
    tags: [],
  })

  const refresh = () => setClients([...loadClients(profileId)])

  const submit = (e) => {
    e.preventDefault()
    if (!form.companyName?.trim() && !form.contactName?.trim()) {
      toast.error('Name required')
      return
    }
    saveClient(profileId, form)
    setForm({
      clientType: 'business',
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      billingAddress: '',
      shippingAddress: '',
      ustIdNr: '',
      defaultPaymentTerms: '',
      notes: '',
      tags: [],
    })
    refresh()
    toast.success('Client saved')
  }

  return (
    <div className="px-4 pb-4">
      <button type="button" onClick={onBack} className="safe-top mb-4 text-sm text-slate-400">
        ← Back
      </button>
      <h2 className="mb-4 text-xl font-bold">Clients</h2>

      <form onSubmit={submit} className="premium-card mb-6 space-y-3 p-4">
        <select
          value={form.clientType}
          onChange={(e) => setForm({ ...form, clientType: e.target.value })}
          className="w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
        >
          <option value="business">Business (B2B)</option>
          <option value="individual">Individual (B2C)</option>
        </select>
        <input
          placeholder="Company name"
          value={form.companyName}
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          className="w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
        />
        <input
          placeholder="Contact person"
          value={form.contactName}
          onChange={(e) => setForm({ ...form, contactName: e.target.value })}
          className="w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
        />
        <input
          placeholder="Billing address"
          value={form.billingAddress}
          onChange={(e) => setForm({ ...form, billingAddress: e.target.value })}
          className="w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
        />
        <input
          placeholder="USt-IdNr (EU B2B)"
          value={form.ustIdNr}
          onChange={(e) => setForm({ ...form, ustIdNr: e.target.value })}
          className="w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
        />
        <button type="submit" className="btn-primary w-full rounded-xl py-2.5 text-sm font-semibold">
          <Plus className="mr-1 inline h-4 w-4" /> Add client
        </button>
      </form>

      <div className="space-y-2">
        {clients.map((c) => (
          <PremiumCard key={c.id} className="flex items-center gap-3 p-4">
            <Users className="h-5 w-5 shrink-0 text-brand-400" />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{c.companyName || c.contactName}</p>
              <p className="text-xs text-slate-500">
                {c.customerNumber} · {c.email}
              </p>
            </div>
            {onSelect && (
              <button
                type="button"
                onClick={() => onSelect(c)}
                className="rounded-lg bg-brand-600/30 px-3 py-1.5 text-xs text-brand-300"
              >
                Select
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                deleteClient(profileId, c.id)
                refresh()
              }}
              className="rounded-lg p-2 text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </PremiumCard>
        ))}
      </div>
    </div>
  )
}
