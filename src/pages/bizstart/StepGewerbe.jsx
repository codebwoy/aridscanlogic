import { useState } from 'react'
import { Download, Upload, ExternalLink, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { generateGewerbePdf } from '@/lib/bizstart/pdfForms'
import { addRegistrationDoc } from '@/lib/bizstart/store'
import { getNextStepId } from '@/lib/bizstart/steps'
import { gewerbeT } from '@/lib/bizstart/gewerbeI18n'
import { mergeGewerbeForExport, emptyGewerbeDraftPatch } from '@/lib/bizstart/gewerbeDraft'
import GewerbeFormWizard from '@/components/bizstart/GewerbeFormWizard'

const CITY_LINKS = {
  '10': 'https://service.berlin.de',
  '80': 'https://www.muenchen.de/gewerbe',
  '20': 'https://www.hamburg.de/gewerbeanmeldung',
  '60': 'https://frankfurt.de',
  '50': 'https://www.stadt-koeln.de',
}

function HowToSection({ lang }) {
  const steps = [
    { n: '01', title: gewerbeT(lang, 'howTo1Title'), text: gewerbeT(lang, 'howTo1') },
    { n: '02', title: gewerbeT(lang, 'howTo2Title'), text: gewerbeT(lang, 'howTo2') },
    { n: '03', title: gewerbeT(lang, 'howTo3Title'), text: gewerbeT(lang, 'howTo3') },
  ]
  return (
    <div className="premium-card mt-6 p-5">
      <h3 className="text-base font-bold text-brand-200">{gewerbeT(lang, 'howToTitle')}</h3>
      <p className="mt-2 text-sm text-slate-400">{gewerbeT(lang, 'howToIntro')}</p>
      <div className="mt-4 space-y-4">
        {steps.map((s) => (
          <div key={s.n} className="flex gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600/30 text-xs font-bold text-brand-200">
              {s.n}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-200">{s.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{s.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function StepGewerbe({ lang, formData, onUpdateForm, onUpdateStep, onNext }) {
  const [showWizard, setShowWizard] = useState(!formData.gewerbeFormComplete)
  const plzPrefix = (formData.plz || '').slice(0, 2)
  const portal = CITY_LINKS[plzPrefix] || 'https://www.gewerbeamt.de'

  const downloadPdf = () => {
    generateGewerbePdf(mergeGewerbeForExport(formData), lang)
    toast.success(gewerbeT(lang, 'pdfDownloaded'))
  }

  const markSubmitted = () => {
    onUpdateStep('gewerbe', 'submitted', { submittedAt: new Date().toISOString().slice(0, 10) })
    toast.success(gewerbeT(lang, 'markedSubmitted'))
    onNext(getNextStepId('gewerbe', formData.businessStructure, formData))
  }

  const uploadCert = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      addRegistrationDoc({ type: 'gewerbeschein', name: file.name, url: reader.result })
      onUpdateStep('gewerbe', 'confirmed', { gewerbescheinUrl: reader.result })
      toast.success(gewerbeT(lang, 'certSaved'))
    }
    reader.readAsDataURL(file)
  }

  const handleFormComplete = () => {
    setShowWizard(false)
    onUpdateStep('gewerbe', 'in_progress')
  }

  const restartForm = () => {
    onUpdateForm({ gewerbeFormComplete: false, gewerbeWizardStep: 0, ...emptyGewerbeDraftPatch() })
    setShowWizard(true)
  }

  if (showWizard) {
    return (
      <div className="space-y-4">
        <GewerbeFormWizard
          lang={lang}
          formData={formData}
          onChange={onUpdateForm}
          onComplete={handleFormComplete}
        />
        <HowToSection lang={lang} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="premium-card border-emerald-500/30 bg-emerald-500/10 p-4">
        <p className="text-sm font-semibold text-emerald-300">✓ {gewerbeT(lang, 'formComplete')}</p>
        <p className="mt-1 text-xs text-slate-400">{gewerbeT(lang, 'costNote')}</p>
        <button type="button" onClick={restartForm} className="mt-2 flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300">
          <RotateCcw className="h-3 w-3" /> {lang === 'de' ? 'Formular bearbeiten' : 'Edit form'}
        </button>
      </div>

      <a
        href={portal}
        target="_blank"
        rel="noopener noreferrer"
        className="premium-card flex items-center gap-2 p-4 text-sm text-brand-300"
      >
        <ExternalLink className="h-4 w-4" /> {gewerbeT(lang, 'portalLink')}
      </a>
      <button type="button" onClick={downloadPdf} className="premium-card flex w-full items-center gap-2 p-4">
        <Download className="h-5 w-5 text-brand-400" /> {gewerbeT(lang, 'downloadPdf')}
      </button>
      <label className="premium-card flex cursor-pointer items-center gap-2 p-4">
        <Upload className="h-5 w-5" />
        <span className="text-sm">{gewerbeT(lang, 'uploadCert')}</span>
        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={uploadCert} />
      </label>
      <button type="button" onClick={markSubmitted} className="btn-primary w-full rounded-xl py-3 font-semibold">
        {gewerbeT(lang, 'markSubmitted')} →
      </button>

      <HowToSection lang={lang} />
    </div>
  )
}
