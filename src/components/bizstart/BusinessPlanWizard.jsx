import { useEffect, useState, useCallback } from 'react'
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
import { getBpGuidelines, PLAN_AUDIENCES } from '@/lib/bizstart/businessPlanGuidelines'
import {
  getBusinessPlanDraft,
  patchBusinessPlanDraft,
  initBusinessPlanDraft,
  importProfileIntoBusinessPlanDraft,
} from '@/lib/bizstart/businessPlanDraft'
import { rewriteBusinessPlanField, polishBusinessPlanDraft, countPolishableFields, BP_TEXT_FIELDS } from '@/lib/bizstart/businessPlanAi'
import ScanLogicAiTextarea, { ScanLogicAiOverlay } from '@/components/bizstart/ScanLogicAiTextarea'

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

function Sidebar({ lang, stepIndex, onJump }) {
  return (
    <nav className="hidden shrink-0 lg:block lg:w-52">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-400">
        {bpT(lang, 'applicationProgress')}
      </p>
      <ol className="space-y-1">
        {BUSINESS_PLAN_STEPS.map((id, i) => {
          const done = i < stepIndex
          const current = i === stepIndex
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
                    done ? 'bg-emerald-500 text-white' : current ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'
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

  const patch = (fields) => {
    onChange({ ...patchBusinessPlanDraft(formData, fields), businessPlanWizardStep: stepIndex })
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

  const AiField = ({ fieldKey, titleKey, rows, placeholder, value }) => {
    const title = bpT(lang, titleKey)
    const loading = aiLoading === fieldKey || aiLoading === 'all'
    return (
      <ScanLogicAiTextarea
        lang={lang}
        value={value || ''}
        onChange={(v) => f(fieldKey, v)}
        onRewrite={() => rewriteField(fieldKey, title)}
        loading={loading}
        polished={!!d.businessPlanAiPolished?.[fieldKey]}
        rows={rows}
        placeholder={placeholder}
      />
    )
  }

  useEffect(() => {
    const init = initBusinessPlanDraft(formData)
    if (Object.keys(init).length) onChange(init)
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
        return !!(d.planTitle && d.planStartYear && d.planEndYear && d.planAudience)
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
      toast.error(bpT(lang, 'requiredHint'))
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

  const renderStep = () => {
    switch (stepId) {
      case 'meta':
        return (
          <div className="space-y-4">
            <FormSection>
              <FormLabel hint={bpT(lang, 'planTitleHint')}>{bpT(lang, 'planTitle')}</FormLabel>
              <FormInput placeholder={bpT(lang, 'phPlanTitle')} value={d.planTitle || ''} onChange={(e) => f('planTitle', e.target.value)} />
            </FormSection>
            <FormSection>
              <FormLabel hint={bpT(lang, 'planAudienceHint')}>{bpT(lang, 'planAudience')}</FormLabel>
              <FormSelect
                value={d.planAudience || ''}
                onChange={(e) => f('planAudience', e.target.value)}
                placeholder={bpT(lang, 'selectAudience')}
                required
              >
                {PLAN_AUDIENCES.map((a) => (
                  <option key={a.id} value={a.id}>
                    {lang === 'de' ? a.de : a.en}
                  </option>
                ))}
              </FormSelect>
            </FormSection>
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
          <FormSection>
            <FormLabel hint={bpT(lang, 'summaryHint')}>{bpT(lang, 'summaryDesc')}</FormLabel>
            <AiField fieldKey="summary" titleKey="summaryTitle" rows={10} placeholder={bpT(lang, 'phSummary')} value={d.summary} />
          </FormSection>
        )

      case 'production':
        return (
          <FormSection>
            <FormLabel hint={bpT(lang, 'productionHint')}>{bpT(lang, 'productionDesc')}</FormLabel>
            <AiField fieldKey="production" titleKey="productionTitle" rows={8} placeholder={bpT(lang, 'phProduction')} value={d.production} />
          </FormSection>
        )

      case 'customers':
        return (
          <FormSection>
            <FormLabel hint={bpT(lang, 'customersHint')}>{bpT(lang, 'customersDesc')}</FormLabel>
            <AiField fieldKey="customers" titleKey="customersTitle" rows={8} placeholder={bpT(lang, 'phCustomers')} value={d.customers} />
          </FormSection>
        )

      case 'idea':
        return (
          <div className="space-y-4">
            <FormSection title={bpT(lang, 'offer')}>
              <FormLabel hint={bpT(lang, 'offerHint')}>{bpT(lang, 'offer')}</FormLabel>
              <AiField fieldKey="offer" titleKey="offer" rows={6} placeholder={bpT(lang, 'phOffer')} value={d.offer} />
            </FormSection>
            <FormSection title={bpT(lang, 'benefit')}>
              <FormLabel hint={bpT(lang, 'benefitHint')}>{bpT(lang, 'benefit')}</FormLabel>
              <AiField fieldKey="benefit" titleKey="benefit" rows={5} placeholder={bpT(lang, 'phBenefit')} value={d.benefit} />
            </FormSection>
          </div>
        )

      case 'market':
        return (
          <FormSection>
            <FormLabel hint={bpT(lang, 'marketHint')}>{bpT(lang, 'marketDesc')}</FormLabel>
            <AiField fieldKey="market" titleKey="marketTitle" rows={10} placeholder={bpT(lang, 'phMarket')} value={d.market} />
          </FormSection>
        )

      case 'values':
        return (
          <FormSection>
            <FormLabel>{bpT(lang, 'valuesDesc')}</FormLabel>
            <AiField fieldKey="values" titleKey="valuesTitle" rows={5} placeholder={bpT(lang, 'phValues')} value={d.values} />
          </FormSection>
        )

      case 'sales':
        return (
          <FormSection>
            <FormLabel hint={bpT(lang, 'salesHint')}>{bpT(lang, 'salesDesc')}</FormLabel>
            <AiField fieldKey="sales" titleKey="salesTitle" rows={8} placeholder={bpT(lang, 'phSales')} value={d.sales} />
          </FormSection>
        )

      case 'organization':
        return (
          <FormSection>
            <FormLabel hint={bpT(lang, 'organizationHint')}>{bpT(lang, 'organizationDesc')}</FormLabel>
            <AiField fieldKey="organization" titleKey="organizationTitle" rows={6} placeholder={bpT(lang, 'phOrganization')} value={d.organization} />
          </FormSection>
        )

      case 'competencies':
        return (
          <FormSection>
            <FormLabel>{bpT(lang, 'competenciesDesc')}</FormLabel>
            <AiField fieldKey="competencies" titleKey="competenciesTitle" rows={6} placeholder={bpT(lang, 'phCompetencies')} value={d.competencies} />
          </FormSection>
        )

      case 'partners':
        return (
          <FormSection>
            <FormLabel>{bpT(lang, 'partnersDesc')}</FormLabel>
            <AiField fieldKey="partners" titleKey="partnersTitle" rows={5} placeholder={bpT(lang, 'phPartners')} value={d.partners} />
          </FormSection>
        )

      case 'company':
        return (
          <div className="space-y-4">
            <FormSection title={bpT(lang, 'foundersTeam')}>
              <FormLabel hint={bpT(lang, 'foundersHint')}>{bpT(lang, 'foundersTeam')}</FormLabel>
              <AiField fieldKey="foundersTeam" titleKey="foundersTeam" rows={6} placeholder={bpT(lang, 'phFounders')} value={d.foundersTeam} />
            </FormSection>
            <FormSection title={bpT(lang, 'location')}>
              <FormLabel hint={bpT(lang, 'locationHint')}>{bpT(lang, 'location')}</FormLabel>
              <AiField fieldKey="location" titleKey="location" rows={3} placeholder={bpT(lang, 'phLocation')} value={d.location} />
            </FormSection>
            <FormSection title={bpT(lang, 'legalForm')}>
              <FormLabel hint={bpT(lang, 'legalHint')}>{bpT(lang, 'legalForm')}</FormLabel>
              <AiField fieldKey="legalFormNotes" titleKey="legalForm" rows={3} placeholder={bpT(lang, 'phLegal')} value={d.legalFormNotes} />
            </FormSection>
          </div>
        )

      case 'risks':
        return (
          <FormSection>
            <FormLabel>{bpT(lang, 'risksDesc')}</FormLabel>
            <AiField fieldKey="risks" titleKey="risksTitle" rows={6} placeholder={bpT(lang, 'phRisks')} value={d.risks} />
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
              <AiField fieldKey="financeAssumptions" titleKey="financeAssumptions" rows={4} placeholder={bpT(lang, 'phFinanceAssumptions')} value={d.financeAssumptions} />
            </FormSection>

            <FormSection title={bpT(lang, 'profitabilitySection')}>
              <FormLabel hint={bpT(lang, 'profitabilityHint')}>{bpT(lang, 'profitabilitySection')}</FormLabel>
              <AiField fieldKey="profitabilityNotes" titleKey="profitabilitySection" rows={4} placeholder={bpT(lang, 'phProfitability')} value={d.profitabilityNotes} />
            </FormSection>

            <FormSection title={bpT(lang, 'liquiditySection')}>
              <FormLabel hint={bpT(lang, 'liquidityHint')}>{bpT(lang, 'liquiditySection')}</FormLabel>
              <AiField fieldKey="liquidityNotes" titleKey="liquiditySection" rows={4} placeholder={bpT(lang, 'phLiquidity')} value={d.liquidityNotes} />
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
                <AiField fieldKey="capitalNotes" titleKey="capitalNotesSection" rows={3} placeholder={bpT(lang, 'phCapitalNotes')} value={d.capitalNotes} />
              </div>
            </FormSection>
          </div>
        )

      case 'annexes':
        return (
          <FormSection>
            <FormLabel hint={bpT(lang, 'annexesDesc')}>{bpT(lang, 'annexesTitle')}</FormLabel>
            <AiField fieldKey="annexes" titleKey="annexesTitle" rows={8} placeholder={bpT(lang, 'phAnnexes')} value={d.annexes} />
          </FormSection>
        )

      case 'review':
        return (
          <div className="space-y-3">
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
      <div className="light-form-surface overflow-hidden rounded-2xl border border-brand-200/60 bg-white text-slate-900 shadow-xl">
      <div className="bg-gradient-to-r from-brand-950 via-brand-800 to-brand-600 px-4 py-5 sm:px-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-200">{bpT(lang, 'wizardSubtitle')}</p>
        <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">{bpT(lang, 'wizardTitle')}</h2>
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
        <Sidebar lang={lang} stepIndex={stepIndex} onJump={setStepIndex} />

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
