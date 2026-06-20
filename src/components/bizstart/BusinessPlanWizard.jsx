import { useEffect, useState, useCallback, useRef } from 'react'
import { CheckCircle2, Plus, Trash2, Lightbulb, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import {
  BUSINESS_PLAN_STEPS,
  planningYearLabels,
  sumYear,
  sumAmount,
  fmtEuro,
} from '@/lib/bizstart/businessPlanConfig'
import { bpT, bpStepLabel, bpProgressPct } from '@/lib/bizstart/businessPlanI18n'
import { getBpGuidelines, isPriorityStep } from '@/lib/bizstart/businessPlanGuidelines'
import {
  getBusinessPlanDraft,
  patchBusinessPlanDraft,
  initBusinessPlanDraft,
  importProfileIntoBusinessPlanDraft,
} from '@/lib/bizstart/businessPlanDraft'
import {
  rewriteBusinessPlanField,
  polishBusinessPlanDraft,
  countPolishableFields,
  BP_TEXT_FIELDS,
  generateAudienceStrategy,
  generateTargetedSummary,
  buildStaticAudienceStrategy,
  getActiveAudienceStrategy,
} from '@/lib/bizstart/businessPlanAi'
import ScanLogicAiTextarea, { ScanLogicAiOverlay } from '@/components/bizstart/ScanLogicAiTextarea'
import BusinessPlanTitleField from '@/components/bizstart/BusinessPlanTitleField'
import BusinessPlanAudienceStrategy from '@/components/bizstart/BusinessPlanAudienceStrategy'
import BusinessPlanAudiencePicker from '@/components/bizstart/BusinessPlanAudiencePicker'
import BusinessPlanReadinessPanel from '@/components/bizstart/BusinessPlanReadinessPanel'

function FormLabel({ children, hint }) {
  return (
    <div className="mb-2">
      <span className="block text-xs font-semibold uppercase tracking-wide text-brand-800">{children}</span>
      {hint && <span className="mt-1 block text-[11px] leading-snug text-slate-500">{hint}</span>}
    </div>
  )
}

function FormSection({ title, children }) {
  return (
    <div className="rounded-2xl border border-brand-200/70 bg-gradient-to-br from-brand-50/50 via-white to-white p-4 shadow-sm ring-1 ring-brand-100/50">
      {title && (
        <div className="mb-4 flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-brand-500" aria-hidden />
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-700">{title}</p>
        </div>
      )}
      {children}
    </div>
  )
}

function FormInput({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border-2 border-brand-100 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 placeholder:font-normal focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25 disabled:bg-slate-50 disabled:text-slate-500 ${className}`}
    />
  )
}

function FormSelect({ className = '', placeholder, value, children, ...props }) {
  const empty = value === '' || value == null
  return (
    <select
      {...props}
      value={value ?? ''}
      className={`w-full rounded-xl border-2 border-brand-100 bg-white px-3.5 py-2.5 text-sm font-medium shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25 ${
        empty ? 'text-slate-500' : 'text-slate-900'
      } [&>option]:bg-white [&>option]:text-slate-900 ${className}`}
    >
      {placeholder && (
        <option value="" disabled={props.required}>
          {placeholder}
        </option>
      )}
      {children}
    </select>
  )
}

function GuidelinePanel({ stepId, lang }) {
  const g = getBpGuidelines(stepId, lang)
  if (!g) return null
  return (
    <div className="mb-4 rounded-2xl border border-brand-200/80 bg-gradient-to-br from-brand-50 to-indigo-50/40 p-4 ring-1 ring-brand-100/60">
      <div className="mb-2 flex items-center gap-2">
        <Lightbulb className="h-4 w-4 shrink-0 text-brand-600" aria-hidden />
        <p className="text-xs font-bold uppercase tracking-wide text-brand-800">{bpT(lang, 'guidelineTitle')}: {g.title}</p>
      </div>
      <ul className="space-y-1.5">
        {g.bullets.map((b) => (
          <li key={b} className="flex gap-2 text-[11px] leading-relaxed text-slate-600">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-500" aria-hidden />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ReviewBlock({ title, text }) {
  if (!text?.trim()) return null
  return (
    <div className="rounded-xl border border-brand-100 bg-white p-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-brand-600">{title}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{text}</p>
    </div>
  )
}

/** Stable module-level wrapper — must not be defined inside BusinessPlanWizard (focus loss on type). */
function BusinessPlanAiField({ lang, value, onChange, onRewrite, loading, polished, rows, placeholder }) {
  return (
    <ScanLogicAiTextarea
      lang={lang}
      value={value || ''}
      onChange={onChange}
      onRewrite={onRewrite}
      loading={loading}
      polished={polished}
      rows={rows}
      placeholder={placeholder}
    />
  )
}

function YearlyFinanceTable({ lang, lines, years, onChange, onAdd, onRemove, totalLabel }) {
  const update = (idx, key, val) => {
    const next = lines.map((row, i) => (i === idx ? { ...row, [key]: val } : row))
    onChange(next)
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-brand-100">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-brand-800 to-brand-600 text-left text-[10px] uppercase tracking-wide text-white">
            <th className="px-3 py-2.5">{bpT(lang, 'lineName')}</th>
            {years.map((y) => (
              <th key={y} className="px-2 py-2.5 text-right">
                {y}
              </th>
            ))}
            <th className="w-10 px-2 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {lines.map((row, idx) => (
            <tr key={row.id || idx} className="border-t border-brand-50 bg-white even:bg-brand-50/30">
              <td className="px-2 py-1.5">
                <FormInput
                  className="border-brand-50 py-2 text-xs"
                  value={lang === 'de' ? row.nameDe || '' : row.nameEn || row.nameDe || ''}
                  onChange={(e) => update(idx, lang === 'de' ? 'nameDe' : 'nameEn', e.target.value)}
                  placeholder={bpT(lang, 'lineName')}
                />
              </td>
              {['y1', 'y2', 'y3'].map((k) => (
                <td key={k} className="px-2 py-1.5">
                  <FormInput
                    type="number"
                    min="0"
                    className="border-brand-50 py-2 text-right text-xs"
                    value={row[k] ?? ''}
                    onChange={(e) => update(idx, k, e.target.value)}
                    placeholder="0"
                  />
                </td>
              ))}
              <td className="px-2 py-1.5">
                {lines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemove(idx)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    aria-label={bpT(lang, 'removeLine')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-brand-200 bg-brand-50/80 font-semibold text-brand-900">
            <td className="px-3 py-2 text-xs">{totalLabel}</td>
            <td className="px-3 py-2 text-right text-xs">{fmtEuro(sumYear(lines, 'y1'), lang)}</td>
            <td className="px-3 py-2 text-right text-xs">{fmtEuro(sumYear(lines, 'y2'), lang)}</td>
            <td className="px-3 py-2 text-right text-xs">{fmtEuro(sumYear(lines, 'y3'), lang)}</td>
            <td />
          </tr>
        </tfoot>
      </table>
      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-1 border-t border-brand-100 py-2.5 text-xs font-semibold text-brand-700 hover:bg-brand-50"
      >
        <Plus className="h-3.5 w-3.5" /> {bpT(lang, 'addLine')}
      </button>
    </div>
  )
}

function Sidebar({ lang, stepIndex, onJump, prioritySteps }) {
  return (
    <nav className="hidden shrink-0 lg:block lg:w-52">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-400">
        {bpT(lang, 'applicationProgress')}
      </p>
      <ol className="space-y-1">
        {BUSINESS_PLAN_STEPS.map((id, i) => {
          const done = i < stepIndex
          const current = i === stepIndex
          const priority = isPriorityStep(id, prioritySteps)
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onJump(i)}
                className={`flex w-full items-start gap-2 rounded-xl px-2.5 py-2 text-left transition ${
                  current ? 'bg-brand-100 ring-2 ring-brand-500/30' : done ? 'hover:bg-brand-50/80' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    done ? 'bg-emerald-500 text-white' : current ? 'bg-brand-600 text-white' : priority ? 'bg-amber-400 text-amber-950' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span>
                  <span className={`block text-xs font-semibold ${current ? 'text-brand-900' : 'text-slate-700'}`}>
                    {bpStepLabel(id, lang)}
                  </span>
                  {current && (
                    <span className="mt-0.5 inline-block rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                      {bpT(lang, 'current')}
                    </span>
                  )}
                  {!current && priority && (
                    <span className="mt-0.5 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-800">
                      {bpT(lang, 'strategyPriorityBadge')}
                    </span>
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default function BusinessPlanWizard({ lang, formData, onChange, onComplete }) {
  const savedStep = Math.min(formData.businessPlanWizardStep || 0, BUSINESS_PLAN_STEPS.length - 1)
  const [stepIndex, setStepIndex] = useState(savedStep)
  const [aiLoading, setAiLoading] = useState(null)
  const [aiProgress, setAiProgress] = useState({ current: 0, total: 0 })
  const [aiFieldLabel, setAiFieldLabel] = useState('')
  const stepId = BUSINESS_PLAN_STEPS[stepIndex]
  const d = getBusinessPlanDraft(formData)
  const years = planningYearLabels(d)
  const activeStrategy = getActiveAudienceStrategy(d, lang)
  const prioritySteps = activeStrategy.prioritySteps || []
  const formDataRef = useRef(formData)
  formDataRef.current = formData

  const patch = (fields) => {
    onChange({
      ...patchBusinessPlanDraft(formDataRef.current, fields),
      businessPlanWizardStep: stepIndex,
    })
  }

  const f = (key, val) => {
    const polished = { ...(d.businessPlanAiPolished || {}) }
    if (polished[key]) delete polished[key]
    patch({
      [key]: val,
      businessPlanAiPolished: polished,
      businessPlanAiComplete: false,
    })
  }

  const rewriteField = useCallback(
    async (fieldKey, fieldTitle) => {
      const text = d[fieldKey]
      if (!text?.trim()) {
        toast.error(bpT(lang, 'aiEmptyField'))
        return
      }
      setAiLoading(fieldKey)
      try {
        const rewritten = await rewriteBusinessPlanField({
          lang,
          fieldTitle,
          text,
          planTitle: d.planTitle,
          planAudience: d.planAudience,
        })
        patch({
          [fieldKey]: rewritten,
          businessPlanAiPolished: { ...(d.businessPlanAiPolished || {}), [fieldKey]: true },
        })
        toast.success(bpT(lang, 'aiRewritten'))
      } catch {
        toast.error(bpT(lang, 'aiFailed'))
      } finally {
        setAiLoading(null)
      }
    },
    [d, lang, formData, stepIndex]
  )

  const polishAll = useCallback(async () => {
    const total = countPolishableFields(d)
    if (!total) return true
    setAiLoading('all')
    setAiProgress({ current: 0, total })
    try {
      let done = 0
      const updates = await polishBusinessPlanDraft(d, lang, {
        onFieldStart: (key) => {
          const field = BP_TEXT_FIELDS.find((x) => x.key === key)
          setAiFieldLabel(field ? bpT(lang, field.titleKey) : key)
        },
        onFieldDone: () => {
          done += 1
          setAiProgress({ current: done, total })
        },
      })
      patch(updates)
      toast.success(bpT(lang, 'aiPolishComplete'))
      return true
    } catch {
      toast.error(bpT(lang, 'aiFailed'))
      return false
    } finally {
      setAiLoading(null)
      setAiFieldLabel('')
    }
  }, [d, lang, formData, stepIndex])

  const runAudienceStrategy = useCallback(
    async (audience, { silent = false } = {}) => {
      if (!audience) return
      setAiLoading('strategy')
      try {
        const latest = getBusinessPlanDraft(formDataRef.current)
        const enhanced = await generateAudienceStrategy({
          lang,
          planAudience: audience,
          planTitle: latest.planTitle,
          formData: formDataRef.current,
          draft: { ...latest, planAudience: audience },
        })
        patch({
          planAudience: audience,
          planAudienceStrategy: enhanced,
        })
        if (!silent) toast.success(bpT(lang, 'strategyReady'))
      } catch {
        patch({
          planAudience: audience,
          planAudienceStrategy: buildStaticAudienceStrategy(audience, lang),
        })
        if (!silent) toast.error(bpT(lang, 'aiFailed'))
      } finally {
        setAiLoading(null)
      }
    },
    [lang, stepIndex]
  )

  const handleAudienceChange = useCallback(
    (audience) => {
      if (!audience || audience === d.planAudience) return
      patch({
        planAudience: audience,
        planAudienceStrategy: buildStaticAudienceStrategy(audience, lang),
      })
      void runAudienceStrategy(audience, { silent: true }).then(() => {
        toast.success(bpT(lang, 'strategyReady'))
      })
    },
    [d.planAudience, lang, runAudienceStrategy, stepIndex]
  )

  const handleGenerateSummary = useCallback(async () => {
    if (!d.planAudience) {
      toast.error(bpT(lang, 'strategySelectAudience'))
      return
    }
    setAiLoading('summary')
    try {
      const strategy = getActiveAudienceStrategy(d, lang)
      const summary = await generateTargetedSummary({
        lang,
        planAudience: d.planAudience,
        planTitle: d.planTitle,
        formData,
        draft: d,
        strategy,
      })
      if (!summary?.trim()) {
        toast.error(bpT(lang, 'aiFailed'))
        return
      }
      const polished = { ...(d.businessPlanAiPolished || {}) }
      delete polished.summary
      patch({
        summary,
        businessPlanAiPolished: { ...polished, summary: true },
      })
      toast.success(bpT(lang, 'strategySummaryReady'))
    } catch {
      toast.error(bpT(lang, 'aiFailed'))
    } finally {
      setAiLoading(null)
    }
  }, [d, lang, formData, stepIndex])

  const aiFieldProps = (fieldKey, titleKey, rows, placeholder) => ({
    lang,
    fieldKey,
    rows,
    placeholder,
    value: d[fieldKey],
    polished: !!d.businessPlanAiPolished?.[fieldKey],
    loading: aiLoading === fieldKey || aiLoading === 'all',
    onChange: (v) => f(fieldKey, v),
    onRewrite: () => rewriteField(fieldKey, bpT(lang, titleKey)),
  })

  useEffect(() => {
    let updates = initBusinessPlanDraft(formData)
    let mergedForm = { ...formData, ...updates }
    let draft = getBusinessPlanDraft(mergedForm)
    if (!draft.planAudience) {
      updates = {
        ...updates,
        ...patchBusinessPlanDraft(mergedForm, { planAudience: 'general' }),
      }
      mergedForm = { ...formData, ...updates }
    }
    draft = getBusinessPlanDraft(mergedForm)
    if (draft.planAudience && draft.planAudienceStrategy?.audience !== draft.planAudience) {
      updates = {
        ...updates,
        ...patchBusinessPlanDraft(mergedForm, {
          planAudienceStrategy: buildStaticAudienceStrategy(draft.planAudience, lang),
        }),
      }
    }
    if (Object.keys(updates).length) onChange(updates)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addRevenueLine = () => {
    const id = `rev-${Date.now()}`
    patch({
      revenueLines: [
        ...(d.revenueLines || []),
        { id, nameDe: '', nameEn: '', y1: '', y2: '', y3: '' },
      ],
    })
  }

  const addOperatingLine = () => {
    const id = `oc-${Date.now()}`
    patch({
      operatingCosts: [
        ...(d.operatingCosts || []),
        { id, nameDe: '', nameEn: '', y1: '', y2: '', y3: '' },
      ],
    })
  }

  const addPrivateLine = () => {
    const id = `pc-${Date.now()}`
    patch({
      privateCosts: [...(d.privateCosts || []), { id, nameDe: '', nameEn: '', y1: '', y2: '', y3: '' }],
    })
  }

  const canProceed = () => {
    switch (stepId) {
      case 'meta':
        return !!(d.planStartYear && d.planEndYear && d.planAudience)
      case 'summary':
        return !!d.summary?.trim()
      case 'production':
        return !!d.production?.trim()
      case 'customers':
        return !!d.customers?.trim()
      case 'idea':
        return !!(d.offer?.trim() && d.benefit?.trim())
      case 'market':
        return !!d.market?.trim()
      case 'company':
        return !!(d.foundersTeam?.trim() && d.location?.trim())
      case 'finances':
        return !!(d.revenueLines?.length && d.financeAssumptions?.trim() && d.profitabilityNotes?.trim())
      case 'review':
        return !!(d.businessPlanDraftAccepted && d.businessPlanPrivacyAccepted)
      default:
        return true
    }
  }

  const next = async () => {
    if (!canProceed()) {
      if (stepId === 'meta' && !d.planAudience) {
        toast.error(bpT(lang, 'strategySelectAudience'))
      } else {
        toast.error(bpT(lang, 'requiredHint'))
      }
      return
    }
    patch({ businessPlanWizardStep: stepIndex })
    if (stepIndex < BUSINESS_PLAN_STEPS.length - 1) {
      setStepIndex(stepIndex + 1)
      toast.success(bpT(lang, 'formSaved'))
    } else {
      if (!d.businessPlanAiComplete && countPolishableFields(d) > 0) {
        const ok = await polishAll()
        if (!ok) return
      }
      onChange({ businessPlanComplete: true, businessPlanWizardStep: stepIndex })
      onComplete?.()
      toast.success(bpT(lang, 'formComplete'))
    }
  }

  const back = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1)
  }

  const renderAudienceSection = (opts = {}) => (
    <div className="mb-4 space-y-4">
      <FormSection>
        <FormLabel hint={bpT(lang, 'planAudienceHint')}>{bpT(lang, 'planAudience')}</FormLabel>
        <BusinessPlanAudiencePicker
          lang={lang}
          value={d.planAudience || ''}
          onChange={handleAudienceChange}
          disabled={aiLoading === 'strategy'}
        />
      </FormSection>
      {d.planAudience ? (
        <BusinessPlanAudienceStrategy
          lang={lang}
          audienceId={d.planAudience}
          planTitle={d.planTitle}
          strategy={activeStrategy}
          loadingStrategy={aiLoading === 'strategy'}
          loadingSummary={aiLoading === 'summary'}
          onRefreshStrategy={() => runAudienceStrategy(d.planAudience)}
          onGenerateSummary={handleGenerateSummary}
          hidden={d.planStrategyGuideHidden === true}
          onToggleHidden={() => patch({ planStrategyGuideHidden: !d.planStrategyGuideHidden })}
          showPdfNote={opts.showPdfNote}
        />
      ) : (
        <p className="rounded-xl border border-dashed border-brand-200 bg-brand-50/40 px-4 py-3 text-xs text-slate-500">
          {bpT(lang, 'strategySelectAudience')}
        </p>
      )}
    </div>
  )

  const renderStep = () => {
    switch (stepId) {
      case 'meta':
        return (
          <div className="space-y-4">
            <FormSection title={bpT(lang, 'planPeriod')}>
              <p className="mb-3 text-[11px] text-slate-500">{bpT(lang, 'planPeriodHint')}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FormLabel>{bpT(lang, 'planStart')}</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    <FormInput placeholder={bpT(lang, 'phMonth')} value={d.planStartMonth || ''} onChange={(e) => f('planStartMonth', e.target.value)} maxLength={2} />
                    <FormInput placeholder={bpT(lang, 'phYear')} value={d.planStartYear || ''} onChange={(e) => f('planStartYear', e.target.value)} maxLength={4} />
                  </div>
                </div>
                <div>
                  <FormLabel>{bpT(lang, 'planEnd')}</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    <FormInput placeholder={bpT(lang, 'phMonth')} value={d.planEndMonth || ''} onChange={(e) => f('planEndMonth', e.target.value)} maxLength={2} />
                    <FormInput placeholder={bpT(lang, 'phYear')} value={d.planEndYear || ''} onChange={(e) => f('planEndYear', e.target.value)} maxLength={4} />
                  </div>
                </div>
              </div>
            </FormSection>
          </div>
        )

      case 'summary':
        return (
          <div className="space-y-4">
            {d.planAudience && (
              <BusinessPlanAudienceStrategy
                lang={lang}
                audienceId={d.planAudience}
                planTitle={d.planTitle}
                strategy={activeStrategy}
                loadingStrategy={aiLoading === 'strategy'}
                loadingSummary={aiLoading === 'summary'}
                onRefreshStrategy={() => runAudienceStrategy(d.planAudience)}
                onGenerateSummary={handleGenerateSummary}
                compact
                hidden={d.planStrategyGuideHidden !== false}
                onToggleHidden={() => patch({ planStrategyGuideHidden: d.planStrategyGuideHidden === false ? true : false })}
                showPdfNote
              />
            )}
            <FormSection>
              <FormLabel hint={bpT(lang, 'summaryHint')}>{bpT(lang, 'summaryDesc')}</FormLabel>
              <BusinessPlanAiField {...aiFieldProps('summary', 'summaryTitle', 10, bpT(lang, 'phSummary'))} />
            </FormSection>
          </div>
        )

      case 'production':
        return (
          <FormSection>
            <FormLabel hint={bpT(lang, 'productionHint')}>{bpT(lang, 'productionDesc')}</FormLabel>
            <BusinessPlanAiField {...aiFieldProps('production', 'productionTitle', 8, bpT(lang, 'phProduction'))} />
          </FormSection>
        )

      case 'customers':
        return (
          <FormSection>
            <FormLabel hint={bpT(lang, 'customersHint')}>{bpT(lang, 'customersDesc')}</FormLabel>
            <BusinessPlanAiField {...aiFieldProps('customers', 'customersTitle', 8, bpT(lang, 'phCustomers'))} />
          </FormSection>
        )

      case 'idea':
        return (
          <div className="space-y-4">
            <FormSection title={bpT(lang, 'offer')}>
              <FormLabel hint={bpT(lang, 'offerHint')}>{bpT(lang, 'offer')}</FormLabel>
              <BusinessPlanAiField {...aiFieldProps('offer', 'offer', 6, bpT(lang, 'phOffer'))} />
            </FormSection>
            <FormSection title={bpT(lang, 'benefit')}>
              <FormLabel hint={bpT(lang, 'benefitHint')}>{bpT(lang, 'benefit')}</FormLabel>
              <BusinessPlanAiField {...aiFieldProps('benefit', 'benefit', 5, bpT(lang, 'phBenefit'))} />
            </FormSection>
          </div>
        )

      case 'market':
        return (
          <FormSection>
            <FormLabel hint={bpT(lang, 'marketHint')}>{bpT(lang, 'marketDesc')}</FormLabel>
            <BusinessPlanAiField {...aiFieldProps('market', 'marketTitle', 10, bpT(lang, 'phMarket'))} />
          </FormSection>
        )

      case 'values':
        return (
          <FormSection>
            <FormLabel>{bpT(lang, 'valuesDesc')}</FormLabel>
            <BusinessPlanAiField {...aiFieldProps('values', 'valuesTitle', 5, bpT(lang, 'phValues'))} />
          </FormSection>
        )

      case 'sales':
        return (
          <FormSection>
            <FormLabel hint={bpT(lang, 'salesHint')}>{bpT(lang, 'salesDesc')}</FormLabel>
            <BusinessPlanAiField {...aiFieldProps('sales', 'salesTitle', 8, bpT(lang, 'phSales'))} />
          </FormSection>
        )

      case 'organization':
        return (
          <FormSection>
            <FormLabel hint={bpT(lang, 'organizationHint')}>{bpT(lang, 'organizationDesc')}</FormLabel>
            <BusinessPlanAiField {...aiFieldProps('organization', 'organizationTitle', 6, bpT(lang, 'phOrganization'))} />
          </FormSection>
        )

      case 'competencies':
        return (
          <FormSection>
            <FormLabel>{bpT(lang, 'competenciesDesc')}</FormLabel>
            <BusinessPlanAiField {...aiFieldProps('competencies', 'competenciesTitle', 6, bpT(lang, 'phCompetencies'))} />
          </FormSection>
        )

      case 'partners':
        return (
          <FormSection>
            <FormLabel>{bpT(lang, 'partnersDesc')}</FormLabel>
            <BusinessPlanAiField {...aiFieldProps('partners', 'partnersTitle', 5, bpT(lang, 'phPartners'))} />
          </FormSection>
        )

      case 'company':
        return (
          <div className="space-y-4">
            <FormSection title={bpT(lang, 'foundersTeam')}>
              <FormLabel hint={bpT(lang, 'foundersHint')}>{bpT(lang, 'foundersTeam')}</FormLabel>
              <BusinessPlanAiField {...aiFieldProps('foundersTeam', 'foundersTeam', 6, bpT(lang, 'phFounders'))} />
            </FormSection>
            <FormSection title={bpT(lang, 'location')}>
              <FormLabel hint={bpT(lang, 'locationHint')}>{bpT(lang, 'location')}</FormLabel>
              <BusinessPlanAiField {...aiFieldProps('location', 'location', 3, bpT(lang, 'phLocation'))} />
            </FormSection>
            <FormSection title={bpT(lang, 'legalForm')}>
              <FormLabel hint={bpT(lang, 'legalHint')}>{bpT(lang, 'legalForm')}</FormLabel>
              <BusinessPlanAiField {...aiFieldProps('legalFormNotes', 'legalForm', 3, bpT(lang, 'phLegal'))} />
            </FormSection>
          </div>
        )

      case 'risks':
        return (
          <FormSection>
            <FormLabel>{bpT(lang, 'risksDesc')}</FormLabel>
            <BusinessPlanAiField {...aiFieldProps('risks', 'risksTitle', 6, bpT(lang, 'phRisks'))} />
          </FormSection>
        )

      case 'finances':
        return (
          <div className="space-y-5">
            <FormSection>
              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <FormLabel>{bpT(lang, 'workingModel')}</FormLabel>
                  <FormSelect value={d.workingModel || 'part_time'} onChange={(e) => f('workingModel', e.target.value)}>
                    <option value="part_time">{bpT(lang, 'partTime')}</option>
                    <option value="full_time">{bpT(lang, 'fullTime')}</option>
                  </FormSelect>
                </div>
                <div>
                  <FormLabel>{bpT(lang, 'hoursPerWeek')}</FormLabel>
                  <FormInput type="number" placeholder={bpT(lang, 'phHours')} value={d.hoursPerWeek || ''} onChange={(e) => f('hoursPerWeek', e.target.value)} />
                </div>
              </div>
              <FormLabel hint={bpT(lang, 'financeAssumptionsHint')}>{bpT(lang, 'financeAssumptions')}</FormLabel>
              <BusinessPlanAiField {...aiFieldProps('financeAssumptions', 'financeAssumptions', 4, bpT(lang, 'phFinanceAssumptions'))} />
            </FormSection>

            <FormSection title={bpT(lang, 'profitabilitySection')}>
              <FormLabel hint={bpT(lang, 'profitabilityHint')}>{bpT(lang, 'profitabilitySection')}</FormLabel>
              <BusinessPlanAiField {...aiFieldProps('profitabilityNotes', 'profitabilitySection', 4, bpT(lang, 'phProfitability'))} />
            </FormSection>

            <FormSection title={bpT(lang, 'liquiditySection')}>
              <FormLabel hint={bpT(lang, 'liquidityHint')}>{bpT(lang, 'liquiditySection')}</FormLabel>
              <BusinessPlanAiField {...aiFieldProps('liquidityNotes', 'liquiditySection', 4, bpT(lang, 'phLiquidity'))} />
            </FormSection>

            <FormSection title={bpT(lang, 'revenueSection')}>
              <YearlyFinanceTable
                lang={lang}
                lines={d.revenueLines || []}
                years={years}
                totalLabel={bpT(lang, 'totalRevenue')}
                onChange={(lines) => f('revenueLines', lines)}
                onAdd={addRevenueLine}
                onRemove={(idx) => f('revenueLines', d.revenueLines.filter((_, i) => i !== idx))}
              />
            </FormSection>

            <FormSection title={bpT(lang, 'costsSection')}>
              <YearlyFinanceTable
                lang={lang}
                lines={d.operatingCosts || []}
                years={years}
                totalLabel={bpT(lang, 'totalOperating')}
                onChange={(lines) => f('operatingCosts', lines)}
                onAdd={addOperatingLine}
                onRemove={(idx) => f('operatingCosts', d.operatingCosts.filter((_, i) => i !== idx))}
              />
            </FormSection>

            <FormSection title={bpT(lang, 'privateSection')}>
              <YearlyFinanceTable
                lang={lang}
                lines={d.privateCosts || []}
                years={years}
                totalLabel={bpT(lang, 'totalPrivate')}
                onChange={(lines) => f('privateCosts', lines)}
                onAdd={addPrivateLine}
                onRemove={(idx) => f('privateCosts', d.privateCosts.filter((_, i) => i !== idx))}
              />
            </FormSection>

            <FormSection title={bpT(lang, 'capitalSection')}>
              <p className="mb-3 text-xs font-semibold text-brand-800">{bpT(lang, 'investments')}</p>
              <div className="space-y-2">
                {(d.investments || []).map((inv, idx) => (
                  <div key={inv.id || idx} className="grid gap-2 sm:grid-cols-[1fr_120px]">
                    <FormInput
                      value={lang === 'de' ? inv.nameDe || '' : inv.nameEn || inv.nameDe || ''}
                      onChange={(e) => {
                        const next = [...d.investments]
                        next[idx] = { ...inv, [lang === 'de' ? 'nameDe' : 'nameEn']: e.target.value }
                        f('investments', next)
                      }}
                    />
                    <FormInput
                      type="number"
                      placeholder={bpT(lang, 'amount')}
                      value={inv.amount ?? ''}
                      onChange={(e) => {
                        const next = [...d.investments]
                        next[idx] = { ...inv, amount: e.target.value }
                        f('investments', next)
                      }}
                    />
                  </div>
                ))}
              </div>
              <p className="mt-2 text-right text-xs font-semibold text-brand-700">
                {bpT(lang, 'totalInvest')}: {fmtEuro(sumAmount(d.investments), lang)}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <FormLabel>{bpT(lang, 'foundingCosts')}</FormLabel>
                  <FormInput type="number" placeholder={bpT(lang, 'phFoundingCosts')} value={d.foundingCosts || ''} onChange={(e) => f('foundingCosts', e.target.value)} />
                </div>
                <div>
                  <FormLabel>{bpT(lang, 'equityCapital')}</FormLabel>
                  <FormInput type="number" placeholder={bpT(lang, 'phEquity')} value={d.equityCapital || ''} onChange={(e) => f('equityCapital', e.target.value)} />
                </div>
                <div>
                  <FormLabel>{bpT(lang, 'loanAmount')}</FormLabel>
                  <FormInput type="number" placeholder={bpT(lang, 'phLoan')} value={d.loanAmount || ''} onChange={(e) => f('loanAmount', e.target.value)} />
                </div>
                <div>
                  <FormLabel>{bpT(lang, 'loanInterest')}</FormLabel>
                  <FormInput type="number" placeholder={bpT(lang, 'phInterest')} value={d.loanInterest || ''} onChange={(e) => f('loanInterest', e.target.value)} />
                </div>
              </div>
              <div className="mt-4">
                <FormLabel hint={bpT(lang, 'capitalNotesHint')}>{bpT(lang, 'capitalNotesSection')}</FormLabel>
                <BusinessPlanAiField {...aiFieldProps('capitalNotes', 'capitalNotesSection', 3, bpT(lang, 'phCapitalNotes'))} />
              </div>
            </FormSection>
          </div>
        )

      case 'annexes':
        return (
          <FormSection>
            <FormLabel hint={bpT(lang, 'annexesDesc')}>{bpT(lang, 'annexesTitle')}</FormLabel>
            <BusinessPlanAiField {...aiFieldProps('annexes', 'annexesTitle', 8, bpT(lang, 'phAnnexes'))} />
          </FormSection>
        )

      case 'review':
        return (
          <div className="space-y-3">
            <BusinessPlanReadinessPanel lang={lang} formData={formData} draft={d} compact />
            <div className="rounded-2xl border border-brand-300/80 bg-gradient-to-r from-brand-50 to-indigo-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-600" aria-hidden />
                <p className="text-sm font-bold text-brand-900">ScanLogic AI</p>
              </div>
              <p className="text-xs text-slate-600">{bpT(lang, 'aiPolishAllHint')}</p>
              <button
                type="button"
                onClick={polishAll}
                disabled={!!aiLoading || countPolishableFields(d) === 0}
                className="btn-primary mt-3 w-full rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50"
              >
                {aiLoading === 'all' ? bpT(lang, 'aiRewriting') : bpT(lang, 'aiPolishAll')}
              </button>
              {d.businessPlanAiComplete && (
                <p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                  {bpT(lang, 'aiPolishComplete')}
                </p>
              )}
            </div>
            <ReviewBlock title={bpT(lang, 'planTitle')} text={d.planTitle} />
            <ReviewBlock title={bpT(lang, 'summaryTitle')} text={d.summary} />
            <ReviewBlock title={bpT(lang, 'productionTitle')} text={d.production} />
            <ReviewBlock title={bpT(lang, 'customersTitle')} text={d.customers} />
            <ReviewBlock title={bpT(lang, 'ideaTitle')} text={[d.offer, d.benefit].filter(Boolean).join('\n\n')} />
            <ReviewBlock title={bpT(lang, 'marketTitle')} text={d.market} />
            <ReviewBlock title={bpT(lang, 'organizationTitle')} text={d.organization} />
            <ReviewBlock title={bpT(lang, 'annexesTitle')} text={d.annexes} />
            <ReviewBlock title={bpT(lang, 'financesTitle')} text={`${bpT(lang, 'totalRevenue')}: ${fmtEuro(sumYear(d.revenueLines, 'y1'), lang)} (${years[0]})`} />
            <FormSection>
              <label className="flex items-start gap-2 text-sm font-medium text-slate-800">
                <input type="checkbox" checked={!!d.businessPlanDraftAccepted} onChange={(e) => f('businessPlanDraftAccepted', e.target.checked)} className="mt-1 accent-brand-600" />
                {bpT(lang, 'draftAccepted')}
              </label>
              <label className="mt-3 flex items-start gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={!!d.businessPlanPrivacyAccepted} onChange={(e) => f('businessPlanPrivacyAccepted', e.target.checked)} className="mt-1 accent-brand-600" />
                {bpT(lang, 'privacyAccepted')}
              </label>
            </FormSection>
          </div>
        )

      default:
        return null
    }
  }

  const stepTitleKey = `${stepId}Title`
  const stepDescKey = `${stepId}Desc`
  const title = bpT(lang, stepTitleKey) !== stepTitleKey ? bpT(lang, stepTitleKey) : bpStepLabel(stepId, lang)
  const desc = bpT(lang, stepDescKey) !== stepDescKey ? bpT(lang, stepDescKey) : ''

  return (
    <>
      {aiLoading === 'all' && <ScanLogicAiOverlay lang={lang} fieldLabel={aiFieldLabel} progress={aiProgress} />}
      {(aiLoading === 'strategy' || aiLoading === 'summary') && (
        <ScanLogicAiOverlay
          lang={lang}
          fieldLabel={aiLoading === 'strategy' ? bpT(lang, 'strategyGenerating') : bpT(lang, 'strategyGeneratingSummary')}
        />
      )}
      <div className="light-form-surface overflow-hidden rounded-2xl border border-brand-200/60 bg-white text-slate-900 shadow-xl">
      <div className="bg-gradient-to-r from-brand-950 via-brand-800 to-brand-600 px-4 py-5 sm:px-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-200">{bpT(lang, 'wizardSubtitle')}</p>
        <BusinessPlanTitleField lang={lang} value={d.planTitle} onChange={(v) => f('planTitle', v)} />
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-[10px] text-brand-100">
            <span>{bpStepLabel(stepId, lang)}</span>
            <span>{bpProgressPct(stepIndex)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-brand-950/50">
            <div className="h-full bg-white/90 transition-all" style={{ width: `${bpProgressPct(stepIndex)}%` }} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:flex-row">
        <Sidebar lang={lang} stepIndex={stepIndex} onJump={setStepIndex} prioritySteps={prioritySteps} />

        <div className="min-w-0 flex-1">
          {(stepId === 'meta' || stepId === 'summary') && (
            <div className="mb-4 space-y-2">
              <button
                type="button"
                onClick={() => onChange(importProfileIntoBusinessPlanDraft(formData))}
                className="w-full rounded-xl border-2 border-dashed border-brand-300 bg-brand-50/50 px-3 py-2.5 text-xs font-semibold text-brand-700 transition hover:border-brand-500 hover:bg-brand-50"
              >
                {bpT(lang, 'importFromProfile')}
              </button>
              <p className="text-[11px] text-slate-500">{bpT(lang, 'importFromProfileHint')}</p>
            </div>
          )}

          <h3 className="text-base font-bold text-brand-900">{title}</h3>
          {desc && <p className="mt-1 text-sm text-slate-500">{desc}</p>}
          {stepId === 'meta' && renderAudienceSection()}
          <GuidelinePanel stepId={stepId} lang={lang} />
          <div className="mt-4">{renderStep()}</div>

          <div className="mt-6 flex flex-wrap gap-2 border-t border-brand-100 pt-4">
            {stepIndex > 0 && (
              <button type="button" onClick={back} className="rounded-xl border-2 border-brand-200 px-4 py-2.5 text-sm font-semibold text-brand-800 hover:bg-brand-50">
                {bpT(lang, 'back')}
              </button>
            )}
            <button type="button" onClick={next} disabled={!!aiLoading} className="btn-primary ml-auto rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
              {stepIndex === BUSINESS_PLAN_STEPS.length - 1 ? bpT(lang, 'completeForm') : bpT(lang, 'further')}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
