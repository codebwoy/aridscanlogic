import { toast } from 'sonner'
import { getNextStepId } from '@/lib/bizstart/steps'
import { vatT } from '@/lib/bizstart/vatI18n'
import VatRegistrationGuide from '@/components/bizstart/VatRegistrationGuide'

export default function StepVat({ lang = 'de', formData, onUpdateForm, onUpdateStep, onNext }) {
  const save = () => {
    onUpdateForm({
      steuernummer: formData.steuernummer,
      ustIdNr: formData.ustIdNr,
      vatScheme: formData.vatScheme,
      vatFilingFrequency: formData.vatFilingFrequency,
    })
    if (formData.ustIdNr || formData.vatScheme === 'kleinunternehmer') {
      onUpdateStep('vat', 'confirmed')
    }
    toast.success(vatT(lang, 'saved'))
    onNext(getNextStepId('vat', formData.businessStructure, formData))
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold">{vatT(lang, 'title')}</h2>
        <p className="text-sm text-slate-400">{vatT(lang, 'subtitle')}</p>
      </div>

      <VatRegistrationGuide lang={lang} formData={formData} onChange={onUpdateForm} />

      <button type="button" onClick={() => onUpdateStep('vat', 'submitted')} className="w-full rounded-xl bg-slate-700 py-3 text-sm">
        {vatT(lang, 'markSubmitted')}
      </button>
      <button type="button" onClick={save} className="btn-primary w-full rounded-xl py-3 font-semibold">
        {vatT(lang, 'saveContinue')} →
      </button>
      <button
        type="button"
        onClick={() => onNext(getNextStepId('vat', formData.businessStructure, formData))}
        className="w-full text-sm text-slate-500"
      >
        {vatT(lang, 'skip')}
      </button>
    </div>
  )
}
