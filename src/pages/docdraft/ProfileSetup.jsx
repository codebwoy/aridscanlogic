import { useState } from 'react'
import { toast } from 'sonner'

const STORAGE_KEY = 'scanlogic_docdraft_profile'

export function loadProfile() {
  try {
    const p = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return {
      ...p,
      is_kleinunternehmer: p.is_kleinunternehmer ?? p.kleinunternehmer ?? false,
    }
  } catch {
    return { is_kleinunternehmer: false }
  }
}

export function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

export default function ProfileSetup({ onSaved }) {
  const [form, setForm] = useState(() => ({
    company_name: '',
    steuernummer: '',
    ust_id_nr: '',
    iban: '',
    bic: '',
    is_kleinunternehmer: false,
    address: '',
    ...loadProfile(),
  }))

  const submit = (e) => {
    e.preventDefault()
    try {
      saveProfile(form)
      toast.success('Profil gespeichert')
      onSaved?.(form)
    } catch {
      toast.error('Speichern fehlgeschlagen')
    }
  }

  const field = (key, label, type = 'text') => (
    <div>
      <label className="mb-1 block text-xs text-slate-500">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) =>
          setForm({
            ...form,
            [key]: type === 'checkbox' ? e.target.checked : e.target.value,
          })
        }
        className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
      />
    </div>
  )

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl bg-slate-800/60 p-4">
      <h3 className="font-semibold">Unternehmensprofil</h3>
      {field('company_name', 'Firmenname')}
      {field('address', 'Adresse')}
      {field('steuernummer', 'Steuernummer')}
      {field('ust_id_nr', 'USt-IdNr.')}
      {field('iban', 'IBAN')}
      {field('bic', 'BIC')}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.is_kleinunternehmer}
          onChange={(e) => setForm({ ...form, is_kleinunternehmer: e.target.checked })}
          className="rounded"
        />
        Kleinunternehmer (§19 UStG) — 0 % MwSt.
      </label>
      <button type="submit" className="w-full rounded-xl bg-brand-600 py-3 font-semibold">
        Speichern
      </button>
    </form>
  )
}
