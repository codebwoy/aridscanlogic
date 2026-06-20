import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Languages,
  Rocket,
  ChevronRight,
  Download,
} from 'lucide-react'
import { toast } from 'sonner'
import { t } from '@/lib/bizstart/i18n'
import { STRUCTURES, getApplicableSteps, STEP_LABELS } from '@/lib/bizstart/steps'
import {
  loadFormData,
  saveFormData,
  loadStepStatus,
  setStepStatus,
  syncRegistrationToTaxVault,
  seedPersonalizedDeadlines,
} from '@/lib/bizstart/store'
import StructureSelector from './StructureSelector'
import InfoCollector from './InfoCollector'
import StepGewerbe from './StepGewerbe'
import StepFinanzamt from './StepFinanzamt'
import StepVat from './StepVat'
import StepHandelsregister from './StepHandelsregister'
import StepIhk from './StepIhk'
import StepKrankenkasse from './StepKrankenkasse'
import StepBank from './StepBank'
import StepWebsiteLegal from './StepWebsiteLegal'
import StepBusinessPlan from './StepBusinessPlan'
import StepComplete from './StepComplete'
import ComplianceCalendar from './ComplianceCalendar'
import RegistrationChat from './RegistrationChat'
import PremiumCard from '@/components/shared/PremiumCard'
import { exportRegistrationChecklistPdf } from '@/lib/bizstart/exportChecklist'

const STATUS_COLORS = {
  not_started: 'bg-slate-700 text-slate-400',
  in_progress: 'bg-amber-500/20 text-amber-300',
  submitted: 'bg-blue-500/20 text-blue-300',
  confirmed: 'bg-emerald-500/20 text-emerald-300',
}

export default function BizStartGermany({ onExit, onComplete }) {
  const [lang, setLang] = useState('en')
  const [screen, setScreen] = useState('home')
  const [formData, setFormData] = useState(loadFormData)
  const [stepStatus, setStepStatusState] = useState(loadStepStatus)
  const [chatOpen, setChatOpen] = useState(false)

  const structure = formData.businessStructure
  const steps = useMemo(
    () => (structure ? getApplicableSteps(structure, formData) : getApplicableSteps('einzelunternehmer')),
    [structure, formData]
  )

  const refresh = () => {
    setFormData(loadFormData())
    setStepStatusState(loadStepStatus())
  }

  useEffect(() => {
    refresh()
  }, [screen])

  const updateForm = (patch) => {
    const next = saveFormData(patch)
    setFormData(next)
  }

  const updateStep = (id, status, extra) => {
    setStepStatus(id, status, extra)
    setStepStatusState(loadStepStatus())
  }

  const statusLabel = (status) => {
    const key = status || 'not_started'
    return t(lang, key === 'not_started' ? 'notStarted' : key === 'in_progress' ? 'inProgress' : key === 'submitted' ? 'submitted' : key === 'confirmed' ? 'confirmed' : key)
  }

  const progressPct = useMemo(() => {
    if (!steps.length) return 0
    const done = steps.filter((s) => {
      const st = stepStatus[s.id]?.status
      return st === 'confirmed' || st === 'submitted'
    }).length
    return Math.round((done / steps.length) * 100)
  }, [steps, stepStatus])

  const continueStep = () => {
    const order = steps.map((s) => s.id)
    for (const id of order) {
      const st = stepStatus[id]?.status
      if (st !== 'confirmed' && st !== 'submitted') {
        setScreen(id === 'structure' ? 'structure' : id)
        return
      }
    }
    setScreen('structure')
  }

  const finishModule = async () => {
    await syncRegistrationToTaxVault(formData, stepStatus)
    await seedPersonalizedDeadlines(formData)
    updateStep('complete', 'confirmed')
    toast.success(lang === 'de' ? 'Tax Vault aktiviert' : 'Tax Vault activated')
    onComplete?.()
  }

  if (screen === 'structure') {
    return (
      <div className="w-full">
        <NavBack onBack={() => setScreen('home')} />
        <StructureSelector
          lang={lang}
          selected={structure}
          onSelect={(id) => {
            updateForm({ businessStructure: id })
            updateStep('structure', 'confirmed')
            setScreen('info')
          }}
        />
        <RegistrationChat lang={lang} open={chatOpen} onClose={setChatOpen} />
      </div>
    )
  }

  if (screen === 'info') {
    return (
      <div className="w-full">
        <NavBack onBack={() => setScreen('home')} />
        <InfoCollector
          lang={lang}
          formData={formData}
          onChange={updateForm}
          onComplete={() => {
            updateStep('info', 'confirmed')
            const applicable = getApplicableSteps(formData.businessStructure, formData)
            const idx = applicable.findIndex((s) => s.id === 'info')
            const nextStep = applicable[idx + 1]
            setScreen(nextStep?.id || 'finanzamt')
          }}
        />
        <RegistrationChat lang={lang} open={chatOpen} onClose={setChatOpen} />
      </div>
    )
  }

  const stepScreens = {
    businessPlan: StepBusinessPlan,
    gewerbe: StepGewerbe,
    finanzamt: StepFinanzamt,
    vat: StepVat,
    handelsregister: StepHandelsregister,
    ihk: StepIhk,
    krankenkasse: StepKrankenkasse,
    bank: StepBank,
    websiteLegal: StepWebsiteLegal,
    complete: StepComplete,
    calendar: ComplianceCalendar,
  }

  if (stepScreens[screen]) {
    const Step = stepScreens[screen]
    return (
      <div className="w-full">
        <NavBack onBack={() => setScreen('home')} />
        <Step
          lang={lang}
          formData={formData}
          stepStatus={stepStatus[screen]}
          onUpdateForm={updateForm}
          onUpdateStep={updateStep}
          onNext={(next) => setScreen(next || 'home')}
          onFinish={finishModule}
        />
        <RegistrationChat lang={lang} open={chatOpen} onClose={setChatOpen} />
      </div>
    )
  }

  return (
    <div className="w-full">
      {onExit && (
        <button type="button" onClick={onExit} className="safe-top mb-2 flex items-center gap-2 text-sm text-slate-400">
          <ArrowLeft className="h-4 w-4" /> Tax Vault
        </button>
      )}

      <header className="safe-top mb-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full bg-brand-600/20 px-3 py-1 text-xs text-brand-300">
            <Rocket className="h-3 w-3" /> BizStart Germany
          </div>
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'de' : 'en')}
            className="flex items-center gap-1 rounded-lg bg-slate-800 px-2 py-1 text-xs"
          >
            <Languages className="h-3 w-3" /> {lang === 'en' ? 'DE' : 'EN'}
          </button>
        </div>
        <h1 className="text-xl font-bold leading-tight">{t(lang, 'title')}</h1>
        <p className="mt-1 text-sm text-slate-400">{t(lang, 'subtitle')}</p>
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs text-slate-500">
            <span>{lang === 'de' ? 'Fortschritt' : 'Progress'}</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-brand-500 transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </header>

      <button
        type="button"
        onClick={() => {
          exportRegistrationChecklistPdf(lang, steps)
          toast.success(lang === 'de' ? 'Checkliste heruntergeladen' : 'Checklist downloaded')
        }}
        className="premium-card mb-4 flex w-full items-center justify-center gap-2 p-3 text-sm"
      >
        <Download className="h-4 w-4" /> {lang === 'de' ? 'Checkliste als PDF' : 'Export checklist PDF'}
      </button>

      {Object.keys(stepStatus).length > 0 && (
        <button type="button" onClick={continueStep} className="btn-primary mb-4 w-full rounded-xl py-3 text-sm font-semibold">
          {t(lang, 'continue')}
        </button>
      )}

      <button
        type="button"
        onClick={() => setScreen('structure')}
        className="premium-card mb-4 flex w-full items-center justify-between p-4 text-left"
      >
        <span className="text-sm font-medium">{t(lang, 'startRegistration')}</span>
        <ChevronRight className="h-5 w-5 text-brand-400" />
      </button>

      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Registration steps
      </p>
      <div className="space-y-2">
        {steps.map((step, i) => {
          const st = stepStatus[step.id]?.status || 'not_started'
          const labels = STEP_LABELS[lang] || STEP_LABELS.en
          return (
            <motion.button
              key={step.id}
              type="button"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setScreen(step.id === 'structure' ? 'structure' : step.id)}
              className="premium-card flex w-full items-center gap-3 p-4 text-left"
            >
              {st === 'confirmed' ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-slate-600" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{labels[step.id]}</p>
                <p className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="h-3 w-3" /> ~{step.estMin} min
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${STATUS_COLORS[st]}`}>
                {statusLabel(st)}
              </span>
            </motion.button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => setScreen('calendar')}
        className="mt-4 w-full text-center text-sm text-brand-400"
      >
        Tax compliance calendar →
      </button>

      <p className="mt-4 text-center text-xs text-slate-500">{t(lang, 'chatHelp')}</p>

      <RegistrationChat lang={lang} open={chatOpen} onClose={setChatOpen} />
    </div>
  )
}

function NavBack({ onBack }) {
  return (
    <button type="button" onClick={onBack} className="safe-top mb-4 flex items-center gap-2 text-sm text-slate-400">
      <ArrowLeft className="h-4 w-4" /> BizStart
    </button>
  )
}
