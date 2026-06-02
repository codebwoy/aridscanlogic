import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

export default function StepVat({ formData, onUpdateForm, onUpdateStep, onNext }) {
  const [ustId, setUstId] = useState(formData.ustIdNr || '')
  const [steuerNr, setSteuerNr] = useState(formData.steuernummer || '')

  const save = () => {
    onUpdateForm({ ustIdNr: ustId, steuernummer: steuerNr || formData.steuernummer })
    if (ustId) onUpdateStep('vat', 'confirmed')
    onNext('ihk')
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">VAT ID (USt-IdNr.)</h2>
      <p className="text-sm text-slate-400">
        Steuernummer for domestic tax. USt-IdNr. (DE + 9 digits) for EU B2B invoices.
      </p>
      <label className="block text-xs text-slate-500">
        Steuernummer
        <input
          value={steuerNr}
          onChange={(e) => setSteuerNr(e.target.value)}
          className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
          placeholder="12/345/67890"
        />
      </label>
      <label className="block text-xs text-slate-500">
        USt-IdNr.
        <input
          value={ustId}
          onChange={(e) => setUstId(e.target.value.toUpperCase())}
          className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
          placeholder="DE123456789"
        />
      </label>
      <a
        href="https://www.bzst.de/DE/Home/home_node.html"
        target="_blank"
        rel="noopener noreferrer"
        rel="noreferrer"
        className="premium-card flex items-center gap-2 p-4 text-sm text-brand-300"
      >
        <ExternalLink className="h-4 w-4" /> BZSt — apply for USt-IdNr.
      </a>
      <a
        href="https://www.elster.de"
        target="_blank"
        rel="noopener noreferrer"
        rel="noreferrer"
        className="premium-card flex items-center gap-2 p-4 text-sm text-slate-300"
      >
        <ExternalLink className="h-4 w-4" /> ELSTER — USt-Voranmeldung (after registration)
      </a>
      <p className="text-xs text-slate-500">Processing: usually 2–6 weeks for USt-IdNr.</p>
      <button type="button" onClick={() => onUpdateStep('vat', 'submitted')} className="w-full rounded-xl bg-slate-700 py-3 text-sm">
        Mark BZSt application submitted
      </button>
      <button type="button" onClick={save} className="btn-primary w-full rounded-xl py-3 font-semibold">
        Save & continue →
      </button>
      <button type="button" onClick={() => onNext('ihk')} className="w-full text-sm text-slate-500">
        Skip for now
      </button>
    </div>
  )
}
