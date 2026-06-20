import { Download, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { generateFragebogenPdf } from '@/lib/bizstart/pdfForms'
import { addRegistrationDoc } from '@/lib/bizstart/store'

export default function StepFinanzamt({ lang, formData, onUpdateForm, onUpdateStep, onNext }) {
  const download = () => {
    generateFragebogenPdf(formData)
    toast.success('Fragebogen PDF ready')
  }

  const saveSteuernummer = () => {
    const sn = prompt(lang === 'de' ? 'Steuernummer eingeben:' : 'Enter Steuernummer:')
    if (sn) {
      onUpdateForm({ steuernummer: sn })
      onUpdateStep('finanzamt', 'confirmed')
      toast.success('Steuernummer saved to Tax Vault')
      onNext('krankenkasse')
    }
  }

  const uploadLetter = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      addRegistrationDoc({ type: 'steuernummer_letter', name: file.name, url: reader.result })
      toast.success('Letter stored in registration vault')
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Fragebogen zur steuerlichen Erfassung</h2>
      <p className="text-sm text-slate-400">
        Registers you with Finanzamt. You receive your Steuernummer for invoices. Submit via ELSTER (elster.de) or paper form.
      </p>
      <a href="https://www.elster.de" target="_blank" rel="noreferrer" className="text-sm text-brand-400 underline">
        Register at ELSTER →
      </a>
      <button type="button" onClick={download} className="premium-card flex w-full items-center gap-2 p-4">
        <Download className="h-5 w-5" /> Pre-filled Fragebogen PDF
      </button>
      <label className="premium-card flex cursor-pointer items-center gap-2 p-4">
        <Upload className="h-4 w-4" /> Upload Finanzamt confirmation
        <input type="file" className="hidden" onChange={uploadLetter} />
      </label>
      <button type="button" onClick={() => onUpdateStep('finanzamt', 'submitted')} className="w-full rounded-xl bg-slate-700 py-3 text-sm">
        Mark as submitted
      </button>
      <button type="button" onClick={saveSteuernummer} className="btn-primary w-full rounded-xl py-3 font-semibold">
        Enter Steuernummer & continue
      </button>
    </div>
  )
}
