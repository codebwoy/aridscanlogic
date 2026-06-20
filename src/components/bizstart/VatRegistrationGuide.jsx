import { useState } from 'react'
import { ExternalLink, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { toast } from 'sonner'
import { vatT } from '@/lib/bizstart/vatI18n'
import {
  ELSTER_URL,
  BZST_URL,
  KLEINUNTERNEHMER_INVOICE_RULES,
  INVOICE_MANDATORY_FIELDS,
  REGELBESTEUERUNG_EFFECTS,
  VORSTEUER_REQUIREMENTS,
  COMMON_UST_ERRORS,
  UST_VA_RULES,
  recommendVatScheme,
  vatPreReturnFrequency,
  KLEINUNTERNEHMER_LIMITS,
} from '@/lib/vat/germanVatRules'

function SectionCard({ title, desc, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-white text-slate-900 shadow-lg">
      <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-950 to-indigo-700 px-4 py-3">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        {desc && <p className="mt-0.5 text-xs text-indigo-100/90">{desc}</p>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function FieldInput({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:bg-white"
      />
    </label>
  )
}

export default function VatRegistrationGuide({ lang, formData, onChange }) {
  const [recommendation, setRecommendation] = useState(null)
  const isKlein = formData.vatScheme === 'kleinunternehmer'
  const isNewFounder = !formData.priorYearRevenue && formData.businessStartDate

  const runRecommendation = () => {
    const rec = recommendVatScheme({
      priorYearNet: Number(formData.priorYearRevenue) || 0,
      currentYearForecastNet: Number(formData.expectedRevenueYear1) || 0,
      plannedInvestmentNet: Number(formData.plannedInvestmentNet) || 0,
      isNewFounder: !!isNewFounder,
      monthsActive: Number(formData.foundingMonthsActive) || 12,
    })
    setRecommendation(rec)
  }

  const applyRecommendation = () => {
    if (!recommendation) return
    onChange({
      vatScheme: recommendation.scheme,
      vatFilingFrequency:
        recommendation.scheme === 'standard'
          ? vatPreReturnFrequency(Number(formData.priorYearVatPaid) || 0)
          : formData.vatFilingFrequency,
    })
    toast.success(vatT(lang, 'saved'))
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
        {vatT(lang, 'disclaimer')}
      </div>

      <SectionCard title={vatT(lang, 'schemeTitle')} desc={vatT(lang, 'schemeDesc')}>
        <div className="mb-3 rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-900">
          <p className="font-semibold">{vatT(lang, 'kleinTitle')}</p>
          <p className="mt-1">{vatT(lang, 'kleinDesc')}</p>
          <p className="mt-2 text-indigo-700">{vatT(lang, 'kleinFounderNote')}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <FieldInput
            label={vatT(lang, 'priorYearNet')}
            type="number"
            value={formData.priorYearRevenue ?? ''}
            onChange={(e) => onChange({ priorYearRevenue: e.target.value === '' ? '' : Number(e.target.value) })}
          />
          <FieldInput
            label={vatT(lang, 'forecastNet')}
            type="number"
            value={formData.expectedRevenueYear1 ?? ''}
            onChange={(e) => onChange({ expectedRevenueYear1: e.target.value === '' ? '' : Number(e.target.value) })}
          />
          <FieldInput
            label={vatT(lang, 'plannedInvestment')}
            type="number"
            value={formData.plannedInvestmentNet ?? ''}
            onChange={(e) => onChange({ plannedInvestmentNet: e.target.value === '' ? '' : Number(e.target.value) })}
          />
          {isNewFounder && (
            <FieldInput
              label={vatT(lang, 'monthsActive')}
              type="number"
              min="1"
              max="12"
              value={formData.foundingMonthsActive ?? 12}
              onChange={(e) => onChange({ foundingMonthsActive: Number(e.target.value) || 12 })}
            />
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={runRecommendation} className="rounded-lg bg-indigo-100 px-3 py-2 text-xs font-semibold text-indigo-800">
            {vatT(lang, 'recommend')}
          </button>
          {recommendation && (
            <button type="button" onClick={applyRecommendation} className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white">
              {vatT(lang, 'applyRecommendation')}
            </button>
          )}
        </div>

        {recommendation && (
          <div className={`mt-3 rounded-lg border px-3 py-2 text-xs ${recommendation.scheme === 'standard' ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>
            <p className="font-semibold">{lang === 'de' ? recommendation.reasonDe : recommendation.reasonEn}</p>
            {recommendation.refundEstimate > 0 && (
              <p className="mt-1">{vatT(lang, 'refundHint')}: ~{recommendation.refundEstimate} €</p>
            )}
          </div>
        )}

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onChange({ vatScheme: 'kleinunternehmer' })}
            className={`rounded-xl border-2 p-3 text-left text-sm transition ${isKlein ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`}
          >
            <p className="font-bold">Kleinunternehmer §19</p>
            <p className="mt-1 text-xs text-slate-600">≤ {KLEINUNTERNEHMER_LIMITS.priorYearNetMax.toLocaleString()} / {KLEINUNTERNEHMER_LIMITS.currentYearForecastNetMax.toLocaleString()} € netto</p>
          </button>
          <button
            type="button"
            onClick={() => onChange({ vatScheme: 'standard', vatFilingFrequency: vatPreReturnFrequency(Number(formData.priorYearVatPaid) || 0) })}
            className={`rounded-xl border-2 p-3 text-left text-sm transition ${!isKlein ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`}
          >
            <p className="font-bold">{lang === 'de' ? 'Regelbesteuerung' : 'Standard VAT'}</p>
            <p className="mt-1 text-xs text-slate-600">{lang === 'de' ? `${KLEINUNTERNEHMER_LIMITS.optInBindingYears} Jahre bindend bei Option` : `${KLEINUNTERNEHMER_LIMITS.optInBindingYears}-year binding if opted in`}</p>
          </button>
        </div>

        {!isKlein && (
          <ul className="mt-3 space-y-1 text-xs text-slate-600">
            {REGELBESTEUERUNG_EFFECTS.map((item) => (
              <li key={item.de} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
                {lang === 'de' ? item.de : item.en}
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard title={vatT(lang, 'registrationTitle')} desc={vatT(lang, 'registrationDesc')}>
        <div className="grid gap-3 sm:grid-cols-2">
          <FieldInput
            label={vatT(lang, 'steuernummer')}
            value={formData.steuernummer || ''}
            onChange={(e) => onChange({ steuernummer: e.target.value })}
            placeholder="12/345/67890"
          />
          <FieldInput
            label={vatT(lang, 'ustIdNr')}
            value={formData.ustIdNr || ''}
            onChange={(e) => onChange({ ustIdNr: e.target.value.toUpperCase() })}
            placeholder="DE123456789"
          />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <a href={ELSTER_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50">
            <ExternalLink className="h-4 w-4" /> {vatT(lang, 'elster')}
          </a>
          <a href={BZST_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50">
            <ExternalLink className="h-4 w-4" /> {vatT(lang, 'bzst')}
          </a>
        </div>
      </SectionCard>

      <SectionCard title={vatT(lang, 'voranmeldungTitle')} desc={vatT(lang, 'voranmeldungDesc')}>
        {isKlein ? (
          <p className="flex items-start gap-2 text-xs text-slate-600">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
            {lang === 'de'
              ? 'Keine Umsatzsteuervoranmeldung, solange Sie Kleinunternehmer sind und nur inländische Umsätze erbringen.'
              : 'No VAT pre-returns while you are Kleinunternehmer with domestic supplies only.'}
          </p>
        ) : (
          <>
            <p className="text-xs text-slate-600">{vatT(lang, 'voranmeldungRegel')}</p>
            <p className="mt-2 text-xs text-slate-500">{lang === 'de' ? UST_VA_RULES.filingDeadlineNoteDe : UST_VA_RULES.filingDeadlineNoteEn}</p>
            <label className="mt-3 block">
              <span className="mb-1 block text-xs font-medium text-slate-600">{vatT(lang, 'filingFreq')}</span>
              <select
                value={formData.vatFilingFrequency || 'quarterly'}
                onChange={(e) => onChange({ vatFilingFrequency: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
              >
                <option value="monthly">{vatT(lang, 'monthly')}</option>
                <option value="quarterly">{vatT(lang, 'quarterly')}</option>
              </select>
            </label>
          </>
        )}
      </SectionCard>

      <SectionCard title={vatT(lang, 'invoiceTitle')} desc={vatT(lang, 'invoiceDesc')}>
        {isKlein && (
          <div className="mb-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">{vatT(lang, 'kleinInvoiceWarn')}</p>
              <ul className="mt-1 list-disc pl-4">
                {(lang === 'de' ? KLEINUNTERNEHMER_INVOICE_RULES.prohibitedDe : KLEINUNTERNEHMER_INVOICE_RULES.prohibitedEn).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <ul className="space-y-1.5">
          {INVOICE_MANDATORY_FIELDS.map((field, i) => (
            <li key={field.id} className="flex gap-2 text-xs text-slate-700">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                {i + 1}
              </span>
              {lang === 'de' ? field.de : field.en}
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title={vatT(lang, 'vorsteuerTitle')} desc={vatT(lang, 'vorsteuerDesc')}>
        <ul className="mb-3 space-y-1 text-xs text-slate-600">
          {VORSTEUER_REQUIREMENTS.map((item) => (
            <li key={item.de} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
              {lang === 'de' ? item.de : item.en}
            </li>
          ))}
        </ul>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{vatT(lang, 'commonErrors')}</p>
        <ul className="space-y-1">
          {COMMON_UST_ERRORS.map((err) => (
            <li key={err.id} className="rounded-md bg-slate-50 px-2 py-1.5 text-xs text-slate-700">
              {lang === 'de' ? err.de : err.en}
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  )
}
