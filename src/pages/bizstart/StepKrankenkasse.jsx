import { useMemo, useState } from 'react'
import { ExternalLink, HeartPulse } from 'lucide-react'
import { toast } from 'sonner'
import { saveTaxVaultProfile } from '@/lib/taxvault/profile'
import {
  HEALTH_INSURANCE_TYPES,
  POPULAR_GKV,
  POPULAR_PKV,
  estimateHealthInsuranceMonthly,
  KRANKENKASSE_DISCLAIMER_DE,
  KRANKENKASSE_DISCLAIMER_EN,
} from '@/lib/taxvault/krankenkasse'
import { getNextStepId } from '@/lib/bizstart/steps'

export default function StepKrankenkasse({ lang, formData, onUpdateForm, onUpdateStep, onNext }) {
  const [type, setType] = useState(formData.healthInsuranceType || 'gkv')
  const [insurer, setInsurer] = useState(formData.healthInsurerName || '')
  const [memberId, setMemberId] = useState(formData.healthInsuranceMemberId || '')
  const [zusatz, setZusatz] = useState(formData.healthInsuranceZusatzbeitrag ?? 1.7)
  const [age, setAge] = useState(formData.healthInsuranceAge ?? 35)

  const profit = Number(formData.expectedProfitYear1) || 0

  const estimate = useMemo(
    () =>
      estimateHealthInsuranceMonthly({
        healthInsuranceType: type,
        expectedProfitYear1: profit,
        zusatzbeitragPct: zusatz,
        healthInsuranceAge: age,
      }),
    [type, profit, zusatz, age]
  )

  const disclaimer = lang === 'de' ? KRANKENKASSE_DISCLAIMER_DE : KRANKENKASSE_DISCLAIMER_EN

  const save = (status = 'confirmed') => {
    onUpdateForm({
      healthInsuranceType: type,
      healthInsurerName: insurer,
      healthInsuranceMemberId: memberId,
      healthInsuranceZusatzbeitrag: zusatz,
      healthInsuranceAge: age,
      healthInsuranceStatus: status,
    })
    onUpdateStep('krankenkasse', status)
    saveTaxVaultProfile({
      healthInsuranceType: type,
      healthInsurerName: insurer,
      healthInsuranceMemberId: memberId,
      healthInsuranceZusatzbeitrag: zusatz,
      healthInsuranceAge: age,
      healthInsuranceStatus: status,
      expectedProfitYear1: profit,
      businessStructure: formData.businessStructure,
      vatScheme: formData.vatScheme,
    })
    toast.success(lang === 'de' ? 'Krankenkasse gespeichert' : 'Health insurance saved')
    const next = getNextStepId('krankenkasse', formData.businessStructure, {
      ...formData,
      healthInsuranceType: type,
    })
    onNext(next)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <HeartPulse className="h-5 w-5 text-rose-400" />
        <h2 className="text-lg font-bold">
          {lang === 'de' ? 'Krankenkasse & Krankenversicherung' : 'Health insurance (Krankenkasse)'}
        </h2>
      </div>
      <p className="text-sm text-slate-400">
        {lang === 'de'
          ? 'Als Selbstständiger müssen Sie sich krankenversichern. Melden Sie sich bei Ihrer Krankenkasse an — oft parallel zum Finanzamt.'
          : 'As self-employed you must have health cover. Register with your Krankenkasse — often in parallel with Finanzamt registration.'}
      </p>

      <div className="space-y-2">
        {HEALTH_INSURANCE_TYPES.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setType(opt.id)}
            className={`premium-card w-full p-4 text-left ${type === opt.id ? 'ring-2 ring-brand-500' : ''}`}
          >
            <p className="font-semibold">{lang === 'de' ? opt.labelDe : opt.labelEn}</p>
          </button>
        ))}
      </div>

      {(type === 'gkv' || type === 'pkv') && (
        <div className="space-y-3 rounded-2xl bg-slate-800/60 p-4">
          {type === 'gkv' && (
            <>
              <label className="block text-xs text-slate-500">
                {lang === 'de' ? 'Krankenkasse' : 'Insurer'}
                <select
                  value={insurer}
                  onChange={(e) => setInsurer(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
                >
                  <option value="">— {lang === 'de' ? 'Auswählen' : 'Select'} —</option>
                  {POPULAR_GKV.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                  <option value="other">{lang === 'de' ? 'Andere' : 'Other'}</option>
                </select>
              </label>
              <label className="block text-xs text-slate-500">
                {lang === 'de' ? 'Zusatzbeitrag Ihrer Kasse (%)' : 'Your fund Zusatzbeitrag (%)'}
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={zusatz}
                  onChange={(e) => setZusatz(parseFloat(e.target.value) || 1.7)}
                  className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
                />
              </label>
            </>
          )}
          {type === 'pkv' && (
            <>
              <label className="block text-xs text-slate-500">
                {lang === 'de' ? 'Alter (für Schätzung)' : 'Age (for estimate)'}
                <input
                  type="number"
                  min="18"
                  max="99"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value, 10) || 35)}
                  className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-xs text-slate-500">
                {lang === 'de' ? 'PKV-Anbieter' : 'PKV provider'}
                <select
                  value={insurer}
                  onChange={(e) => setInsurer(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
                >
                  <option value="">— {lang === 'de' ? 'Auswählen' : 'Select'} —</option>
                  {POPULAR_PKV.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                  <option value="other">{lang === 'de' ? 'Andere' : 'Other'}</option>
                </select>
              </label>
            </>
          )}
          <label className="block text-xs text-slate-500">
            {lang === 'de' ? 'Versichertennummer (optional)' : 'Member ID (optional)'}
            <input
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
            />
          </label>
        </div>
      )}

      {(type === 'gkv' || type === 'pkv') && estimate.monthlyTotal > 0 && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
          <p className="text-xs uppercase tracking-wide text-rose-300">
            {lang === 'de' ? 'Geschätzter Monatsbeitrag' : 'Estimated monthly contribution'}
          </p>
          <p className="mt-1 text-2xl font-bold text-white">
            {estimate.monthlyTotal.toLocaleString('de-DE')} €
            <span className="text-sm font-normal text-slate-400"> / {lang === 'de' ? 'Monat' : 'mo'}</span>
          </p>
          {type === 'gkv' && (
            <p className="mt-1 text-xs text-slate-400">
              KV {estimate.healthPortion?.toFixed(2)} € + Pflege {estimate.pflegePortion?.toFixed(2)} € · BBG{' '}
              {estimate.monthlyAssessmentBase?.toFixed(0)} €
            </p>
          )}
          {type === 'pkv' && estimate.rangeMin && (
            <p className="mt-1 text-xs text-slate-400">
              {lang === 'de' ? 'Typische Spanne' : 'Typical range'}: {estimate.rangeMin}–{estimate.rangeMax} €
            </p>
          )}
          <p className="mt-2 text-[10px] leading-snug text-slate-500">{disclaimer}</p>
        </div>
      )}

      <a
        href="https://www.gkv-spitzenverband.de/service/krankenkassenliste/krankenkassenliste.jsp"
        target="_blank"
        rel="noopener noreferrer"
        className="premium-card flex items-center gap-2 p-4 text-sm text-brand-300"
      >
        <ExternalLink className="h-4 w-4" />
        {lang === 'de' ? 'Krankenkassenliste (GKV)' : 'GKV insurer directory'}
      </a>
      {type === 'pkv' && (
        <a
          href="https://www.pkv.de/pkv/pkv-vergleich/"
          target="_blank"
          rel="noopener noreferrer"
          className="premium-card flex items-center gap-2 p-4 text-sm text-brand-300"
        >
          <ExternalLink className="h-4 w-4" />
          {lang === 'de' ? 'PKV-Vergleich (Verband) — pkv.de' : 'PKV comparison — pkv.de'}
        </a>
      )}

      <button
        type="button"
        onClick={() => save('submitted')}
        className="w-full rounded-xl bg-slate-700 py-3 text-sm"
      >
        {lang === 'de' ? 'Als beantragt markieren' : 'Mark application submitted'}
      </button>
      <button type="button" onClick={() => save('confirmed')} className="btn-primary w-full rounded-xl py-3 font-semibold">
        {lang === 'de' ? 'Speichern & weiter' : 'Save & continue →'}
      </button>
      <button
        type="button"
        onClick={() => {
          onUpdateStep('krankenkasse', 'not_started')
          onNext(getNextStepId('krankenkasse', formData.businessStructure, formData))
        }}
        className="w-full text-sm text-slate-500"
      >
        {lang === 'de' ? 'Später klären' : 'Decide later'}
      </button>
    </div>
  )
}
