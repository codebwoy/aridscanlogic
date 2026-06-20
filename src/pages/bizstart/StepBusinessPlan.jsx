import { useState } from 'react'
import { Download, RotateCcw, Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getNextStepId } from '@/lib/bizstart/steps'
import { bpT } from '@/lib/bizstart/businessPlanI18n'
import { generateBusinessPlanPdf } from '@/lib/bizstart/businessPlanPdf'
import {
  getBusinessPlanDraft,
  mergeBusinessPlanForExport,
  emptyBusinessPlanDraftPatch,
  patchBusinessPlanDraft,
} from '@/lib/bizstart/businessPlanDraft'
import { polishBusinessPlanDraft, isBusinessPlanAiComplete, countPolishableFields } from '@/lib/bizstart/businessPlanAi'
import BusinessPlanWizard from '@/components/bizstart/BusinessPlanWizard'
import BusinessPlanTitleField from '@/components/bizstart/BusinessPlanTitleField'
import { ScanLogicAiOverlay } from '@/components/bizstart/ScanLogicAiTextarea'

function HowToSection({ lang }) {
  const steps = [
    { n: '01', title: bpT(lang, 'howTo1Title'), text: bpT(lang, 'howTo1') },
    { n: '02', title: bpT(lang, 'howTo2Title'), text: bpT(lang, 'howTo2') },
    { n: '03', title: bpT(lang, 'howTo3Title'), text: bpT(lang, 'howTo3') },
  ]
  return (
    <div className="premium-card mt-6 p-5">
      <h3 className="text-base font-bold text-brand-200">{bpT(lang, 'howToTitle')}</h3>
      <p className="mt-2 text-sm text-slate-400">{bpT(lang, 'howToIntro')}</p>
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

export default function StepBusinessPlan({ lang, formData, onUpdateForm, onUpdateStep, onNext }) {
  const [showWizard, setShowWizard] = useState(!formData.businessPlanComplete)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiProgress, setAiProgress] = useState({ current: 0, total: 0 })

  const ensurePolished = async () => {
    const draft = getBusinessPlanDraft(formData)
    if (isBusinessPlanAiComplete(draft) || countPolishableFields(draft) === 0) {
      return mergeBusinessPlanForExport(formData)
    }
    setAiLoading(true)
    setAiProgress({ current: 0, total: countPolishableFields(draft) })
    try {
      let done = 0
      const updates = await polishBusinessPlanDraft(draft, lang, {
        onFieldDone: () => {
          done += 1
          setAiProgress({ current: done, total: countPolishableFields(draft) })
        },
      })
      const nextForm = { ...formData, ...patchBusinessPlanDraft(formData, updates) }
      onUpdateForm(patchBusinessPlanDraft(formData, updates))
      toast.success(bpT(lang, 'aiPolishComplete'))
      return mergeBusinessPlanForExport(nextForm)
    } catch {
      toast.error(bpT(lang, 'aiFailed'))
      return null
    } finally {
      setAiLoading(false)
    }
  }

  const downloadPdf = async () => {
    const draft = getBusinessPlanDraft(formData)
    if (!draft.planTitle?.trim()) {
      toast.error(bpT(lang, 'requiredHint'))
      return
    }
    toast.message(bpT(lang, 'aiBeforeDownload'))
    const merged = await ensurePolished()
    if (!merged) return
    generateBusinessPlanPdf(merged, lang)
    toast.success(bpT(lang, 'pdfDownloaded'))
  }

  const markSubmitted = () => {
    onUpdateStep('businessPlan', 'confirmed')
    toast.success(lang === 'de' ? 'Businessplan abgeschlossen' : 'Business plan completed')
    onNext(getNextStepId('businessPlan', formData.businessStructure, formData))
  }

  const restartForm = () => {
    onUpdateForm({ businessPlanComplete: false, businessPlanWizardStep: 0, ...emptyBusinessPlanDraftPatch() })
    setShowWizard(true)
  }

  const handleFormComplete = () => {
    setShowWizard(false)
    onUpdateStep('businessPlan', 'in_progress')
  }

  const draft = getBusinessPlanDraft(formData)
  const aiDone = isBusinessPlanAiComplete(draft)

  return (
    <div>
      {aiLoading && <ScanLogicAiOverlay lang={lang} progress={aiProgress} />}

      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
        {bpT(lang, 'disclaimer')}
      </div>

      {showWizard ? (
        <div className="mt-4">
          <BusinessPlanWizard lang={lang} formData={formData} onChange={onUpdateForm} onComplete={handleFormComplete} />
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="premium-card p-4 space-y-3">
            <BusinessPlanTitleField
              variant="download"
              lang={lang}
              value={draft.planTitle}
              onChange={(v) => onUpdateForm(patchBusinessPlanDraft(formData, { planTitle: v }))}
            />
            <p className="text-sm font-semibold text-emerald-300">
              {lang === 'de' ? 'Businessplan ausgefüllt' : 'Business plan completed'}
            </p>
            {aiDone && (
              <p className="flex items-center gap-1 text-xs text-brand-300">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                ScanLogic AI — {bpT(lang, 'aiPolishComplete')}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={downloadPdf}
            disabled={aiLoading}
            className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold disabled:opacity-50"
          >
            {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {bpT(lang, 'downloadPdf')}
          </button>
          <button type="button" onClick={markSubmitted} className="premium-card flex w-full items-center justify-center gap-2 py-3 text-sm font-medium text-brand-300">
            {bpT(lang, 'markSubmitted')}
          </button>
          <button type="button" onClick={restartForm} className="flex w-full items-center justify-center gap-2 py-2 text-xs text-slate-500 hover:text-brand-400">
            <RotateCcw className="h-3.5 w-3.5" /> {bpT(lang, 'restartForm')}
          </button>
        </div>
      )}

      <HowToSection lang={lang} />
    </div>
  )
}
