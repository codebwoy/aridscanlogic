import { useState } from 'react'
import { Plus, Check, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  loadProfiles,
  saveProfile,
  setActiveProfileId,
  getActiveProfileId,
} from '@/lib/docdraft/store'
import { DEFAULT_PROFILE as DEF } from '@/lib/docdraft/constants'
import PremiumCard from '@/components/shared/PremiumCard'

export default function BusinessProfileManager({ onBack, onChanged }) {
  const [profiles, setProfiles] = useState(loadProfiles)
  const [editing, setEditing] = useState(null)
  const activeId = getActiveProfileId()

  const refresh = () => {
    setProfiles([...loadProfiles()])
    onChanged?.()
  }

  const startNew = () =>
    setEditing({
      ...DEF,
      businessName: '',
      sequences: { ...DEF.sequences },
    })

  const submit = (e) => {
    e.preventDefault()
    if (!editing.businessName?.trim()) {
      toast.error('Business name required')
      return
    }
    saveProfile(editing)
    toast.success('Profile saved')
    setEditing(null)
    refresh()
  }

  const setField = (key, val) => setEditing({ ...editing, [key]: val })

  const handleLogo = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setField('logoUrl', reader.result)
    reader.readAsDataURL(file)
  }

  if (editing) {
    return (
      <div className="px-4 pb-4">
        <button type="button" onClick={() => setEditing(null)} className="safe-top mb-4 text-sm text-slate-400">
          ← Back
        </button>
        <form onSubmit={submit} className="space-y-3">
          <h2 className="text-lg font-bold">{editing.id ? 'Edit business' : 'New business'}</h2>
          <label className="block">
            <span className="text-xs text-slate-500">Logo</span>
            <input type="file" accept="image/*" onChange={handleLogo} className="mt-1 w-full text-sm" />
          </label>
          <input
            placeholder="Business name *"
            value={editing.businessName}
            onChange={(e) => setField('businessName', e.target.value)}
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
          />
          <select
            value={editing.legalStructure}
            onChange={(e) => setField('legalStructure', e.target.value)}
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
          >
            {['Einzelunternehmer', 'Freiberufler', 'GmbH', 'UG', 'GbR', 'e.K.'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            placeholder="Straße"
            value={editing.street}
            onChange={(e) => setField('street', e.target.value)}
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              placeholder="Nr."
              value={editing.houseNumber}
              onChange={(e) => setField('houseNumber', e.target.value)}
              className="rounded-lg bg-slate-800 px-3 py-2 text-sm"
            />
            <input
              placeholder="PLZ"
              value={editing.plz}
              onChange={(e) => setField('plz', e.target.value)}
              className="rounded-lg bg-slate-800 px-3 py-2 text-sm"
            />
            <input
              placeholder="Stadt"
              value={editing.city}
              onChange={(e) => setField('city', e.target.value)}
              className="rounded-lg bg-slate-800 px-3 py-2 text-sm"
            />
          </div>
          <input
            placeholder="Steuernummer *"
            value={editing.steuernummer}
            onChange={(e) => setField('steuernummer', e.target.value)}
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
          />
          <input
            placeholder="USt-IdNr."
            value={editing.ustIdNr}
            onChange={(e) => setField('ustIdNr', e.target.value)}
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
          />
          <input
            placeholder="IBAN"
            value={editing.iban}
            onChange={(e) => setField('iban', e.target.value)}
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
          />
          <input
            placeholder="BIC"
            value={editing.bic}
            onChange={(e) => setField('bic', e.target.value)}
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={editing.isKleinunternehmer}
              onChange={(e) => setField('isKleinunternehmer', e.target.checked)}
            />
            Kleinunternehmer (§19 UStG)
          </label>
          <button type="submit" className="btn-primary w-full rounded-xl py-3 font-semibold">
            Save profile
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="px-4 pb-4">
      <button type="button" onClick={onBack} className="safe-top mb-4 text-sm text-slate-400">
        ← Back
      </button>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Business profiles</h2>
        <button type="button" onClick={startNew} className="flex items-center gap-1 text-sm text-brand-400">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
      <div className="space-y-2">
        {profiles.map((p) => (
          <PremiumCard key={p.id} className="flex items-center gap-3 p-4">
            {p.logoUrl ? (
              <img src={p.logoUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />
            ) : (
              <Building2 className="h-10 w-10 text-slate-600" />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-medium">{p.businessName}</p>
              <p className="text-xs text-slate-500">{p.legalStructure}</p>
            </div>
            {activeId === p.id ? (
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <Check className="h-4 w-4" /> Active
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setActiveProfileId(p.id)
                  toast.success('Profile switched')
                  refresh()
                }}
                className="text-xs text-brand-400"
              >
                Switch
              </button>
            )}
            <button
              type="button"
              onClick={() => setEditing(p)}
              className="text-xs text-slate-400"
            >
              Edit
            </button>
          </PremiumCard>
        ))}
      </div>
    </div>
  )
}
