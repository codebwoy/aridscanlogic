import { useState } from 'react'
import { Building2, User } from 'lucide-react'
import { toast } from 'sonner'
import appApi from '@/lib/appApi'

const STRUCTURES = [
  { id: 'freelancer', label: 'Freelancer', icon: User },
  { id: 'sole_trader', label: 'Einzelunternehmer', icon: Building2 },
]

export default function TaxVaultOnboarding({ onComplete }) {
  const [structure, setStructure] = useState('')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!structure) {
      toast.error('Bitte Struktur wählen')
      return
    }
    setSaving(true)
    try {
      await appApi.entities.BusinessRegistration.create({
        business_structure: structure,
        registration_status: 'pending',
        gewerbe_status: 'not_started',
        finanzamt_status: 'not_started',
        vat_status: 'kleinunternehmer',
        steuernummer: '',
        ust_id_nr: '',
      })
      toast.success('Profil angelegt')
      onComplete?.()
    } catch {
      toast.error('Speichern fehlgeschlagen')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-2xl bg-slate-800/60 p-5">
      <h2 className="text-lg font-semibold">Steuer-Setup</h2>
      <p className="mt-1 text-sm text-slate-400">Wählen Sie Ihre Unternehmensform</p>
      <div className="mt-4 grid gap-3">
        {STRUCTURES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setStructure(id)}
            className={`flex items-center gap-3 rounded-xl border p-4 text-left ${
              structure === id ? 'border-brand-500 bg-brand-600/20' : 'border-slate-700 bg-slate-900/50'
            }`}
          >
            <Icon className="h-6 w-6 text-brand-400" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="mt-4 w-full rounded-xl bg-brand-600 py-3 font-semibold disabled:opacity-50"
      >
        {saving ? 'Speichern…' : 'Weiter'}
      </button>
    </div>
  )
}
