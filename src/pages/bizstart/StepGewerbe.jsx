import { Download, Upload, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { generateGewerbePdf } from '@/lib/bizstart/pdfForms'
import { addRegistrationDoc } from '@/lib/bizstart/store'

const CITY_LINKS = {
  '10': 'https://service.berlin.de',
  '80': 'https://www.muenchen.de/gewerbe',
  '20': 'https://www.hamburg.de/gewerbeanmeldung',
  '60': 'https://frankfurt.de',
  '50': 'https://www.stadt-koeln.de',
}

export default function StepGewerbe({ lang, formData, onUpdateForm, onUpdateStep, onNext }) {
  const plzPrefix = (formData.plz || '').slice(0, 2)
  const portal = CITY_LINKS[plzPrefix] || 'https://www.gewerbeamt.de'

  const downloadPdf = () => {
    generateGewerbePdf(formData)
    toast.success('PDF downloaded')
  }

  const markSubmitted = () => {
    onUpdateStep('gewerbe', 'submitted', { submittedAt: new Date().toISOString().slice(0, 10) })
    toast.success('Marked as submitted')
    onNext('finanzamt')
  }

  const uploadCert = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      addRegistrationDoc({ type: 'gewerbeschein', name: file.name, url: reader.result })
      onUpdateStep('gewerbe', 'confirmed', { gewerbescheinUrl: reader.result })
      toast.success('Gewerbeschein saved')
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Gewerbeanmeldung</h2>
      <p className="text-sm text-slate-400">
        Register your trade at the local Gewerbeamt (€10–€65). You receive a Gewerbeschein in 3–10 days.
      </p>
      <a href={portal} target="_blank" rel="noreferrer" className="premium-card flex items-center gap-2 p-4 text-sm text-brand-300">
        <ExternalLink className="h-4 w-4" /> Online portal for your region
      </a>
      <button type="button" onClick={downloadPdf} className="premium-card flex w-full items-center gap-2 p-4">
        <Download className="h-5 w-5 text-brand-400" /> Download pre-filled PDF
      </button>
      <label className="premium-card flex cursor-pointer items-center gap-2 p-4">
        <Upload className="h-5 w-5" />
        <span className="text-sm">Upload Gewerbeschein scan</span>
        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={uploadCert} />
      </label>
      <button type="button" onClick={markSubmitted} className="btn-primary w-full rounded-xl py-3 font-semibold">
        Mark as submitted →
      </button>
    </div>
  )
}
