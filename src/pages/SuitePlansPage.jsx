import { useState } from 'react'
import { ChevronLeft, Check, Crown, Sparkles, Zap, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import BrandLogo from '@/components/shared/BrandLogo'
import { BRAND_SUITE_NAME } from '@/lib/brand'
import { useAiLanguage } from '@/context/AiLanguageContext'
import { usePremium } from '@/context/PremiumContext'
import {
  SUITE_PLANS,
  SUITE_PLAN_COMPARISON,
  formatSuitePlanPrice,
  suitePlanDisplayName,
  suitePlanHighlights,
} from '@/lib/suite/plans'

const PLAN_ORDER = ['free', 'pro', 'plus']
const PLAN_ICONS = { free: Sparkles, pro: Zap, plus: Crown }

const COPY = {
  de: {
    title: 'Pläne & Zahlung',
    subtitle: 'Wählen Sie Free, Pro oder Plus für die ScanLogic Business Suite.',
    monthly: 'Monatlich',
    yearly: 'Jährlich',
    save: 'Sparen ~33%',
    current: 'Aktueller Plan',
    useFree: 'Free nutzen',
    startTrial: (d) => `${d}-Tage-Test starten`,
    subscribe: 'Abonnieren',
    restore: 'Kauf wiederherstellen',
    paymentNote:
      'Demo-Abrechnung — keine echte Zahlung. Pläne werden auf diesem Gerät gespeichert. Produktions-Zahlungsanbieter kann später angebunden werden.',
    yourPlan: 'Ihr Plan',
    bestValue: 'Bestes Angebot',
    popular: 'Beliebt',
    feature: 'Funktion',
  },
  en: {
    title: 'Plans & billing',
    subtitle: 'Choose Free, Pro, or Plus for ScanLogic Business Suite.',
    monthly: 'Monthly',
    yearly: 'Yearly',
    save: 'Save ~33%',
    current: 'Current plan',
    useFree: 'Use Free',
    startTrial: (d) => `Start ${d}-day trial`,
    subscribe: 'Subscribe',
    restore: 'Restore purchase',
    paymentNote:
      'Demo billing — no real payment processed. Plans are stored on this device. Payment provider can be wired for production.',
    yourPlan: 'Your plan',
    bestValue: 'Best value',
    popular: 'Popular',
    feature: 'Feature',
  },
}

function PlanCard({ plan, billing, currentPlan, onTrial, onSubscribe, busy, lang }) {
  const t = COPY[lang] || COPY.de
  const Icon = PLAN_ICONS[plan.id]
  const isCurrent = currentPlan === plan.id
  const isFree = plan.id === 'free'
  const name = plan.name[lang] || plan.name.de
  const tagline = plan.tagline[lang] || plan.tagline.de
  const highlights = suitePlanHighlights(plan.id, lang)

  return (
    <article
      className={`relative flex flex-col rounded-2xl border p-5 ${
        plan.recommended
          ? 'border-brand-500/60 bg-gradient-to-b from-brand-900/40 to-slate-900/80 shadow-lg shadow-brand-900/20'
          : 'border-slate-700/60 bg-slate-800/50'
      } ${isCurrent ? 'ring-2 ring-emerald-500/50' : ''}`}
    >
      {plan.recommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-0.5 text-[10px] font-bold uppercase text-white">
          {t.bestValue}
        </span>
      )}
      {plan.id === 'pro' && !plan.recommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-700 px-3 py-0.5 text-[10px] font-semibold uppercase text-slate-300">
          {t.popular}
        </span>
      )}

      <div className="mb-4 flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            plan.recommended ? 'bg-brand-600/25 text-brand-300' : 'bg-slate-900/60 text-slate-400'
          }`}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{name}</h3>
          <p className="text-xs text-slate-500">{tagline}</p>
        </div>
      </div>

      <p className="mb-4 text-3xl font-bold text-white">{formatSuitePlanPrice(plan.id, billing)}</p>
      {!isFree && plan.trialDays > 0 && (
        <p className="mb-4 text-xs font-medium text-brand-300">
          {lang === 'de' ? `${plan.trialDays} Tage kostenlos testen` : `${plan.trialDays}-day free trial`}
        </p>
      )}

      <ul className="mb-6 flex-1 space-y-2 border-t border-slate-700/60 pt-4">
        {highlights.map((line) => (
          <li key={line} className="flex items-start gap-2 text-sm text-slate-300">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
            <span>{line}</span>
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <button
          type="button"
          disabled
          className="min-h-[48px] rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-3 text-sm font-semibold text-emerald-400"
        >
          {t.current}
        </button>
      ) : isFree ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => onSubscribe('free')}
          className="min-h-[48px] rounded-xl border border-slate-600 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-50"
        >
          {t.useFree}
        </button>
      ) : (
        <div className="space-y-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onTrial(plan.id)}
            className={`min-h-[48px] w-full rounded-xl py-3 text-sm font-semibold disabled:opacity-50 ${
              plan.recommended ? 'bg-brand-600 text-white hover:bg-brand-500' : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
          >
            {t.startTrial(plan.trialDays)}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onSubscribe(plan.id)}
            className="flex w-full items-center justify-center gap-1.5 py-2 text-xs font-medium text-brand-300 hover:underline disabled:opacity-50"
          >
            <CreditCard className="h-3.5 w-3.5" aria-hidden />
            {t.subscribe} {formatSuitePlanPrice(plan.id, billing)} →
          </button>
        </div>
      )}
    </article>
  )
}

export default function SuitePlansPage({ onBack }) {
  const { language } = useAiLanguage()
  const lang = language === 'en' ? 'en' : 'de'
  const t = COPY[lang]
  const { plan, startTrial, subscribe, setFree, restore, refreshPlan } = usePremium()
  const [billing, setBilling] = useState('yearly')
  const [busy, setBusy] = useState(false)

  const finish = (message) => {
    refreshPlan()
    toast.success(message)
    onBack?.()
  }

  const handleTrial = async (planId) => {
    setBusy(true)
    try {
      startTrial(planId, billing)
      finish(
        lang === 'de'
          ? `${suitePlanDisplayName(planId, lang)}-Test gestartet`
          : `${suitePlanDisplayName(planId, lang)} trial started`
      )
    } catch (e) {
      toast.error(e.message || 'Failed')
    } finally {
      setBusy(false)
    }
  }

  const handleSubscribe = async (planId) => {
    setBusy(true)
    try {
      if (planId === 'free') {
        setFree()
        finish(lang === 'de' ? 'Free-Plan aktiv' : 'Switched to Free')
        return
      }
      subscribe(planId, billing)
      finish(
        lang === 'de'
          ? `${suitePlanDisplayName(planId, lang)} abonniert (${formatSuitePlanPrice(planId, billing)})`
          : `Subscribed to ${suitePlanDisplayName(planId, lang)}`
      )
    } catch (e) {
      toast.error(e.message || 'Failed')
    } finally {
      setBusy(false)
    }
  }

  const handleRestore = () => {
    const restored = restore()
    if (!restored) {
      toast.message(lang === 'de' ? 'Kein aktives Abo gefunden' : 'No active subscription found')
      return
    }
    refreshPlan()
    toast.success(lang === 'de' ? 'Plan wiederhergestellt' : 'Plan restored')
    onBack?.()
  }

  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto bg-slate-950/95">
      <div className="mx-auto max-w-5xl px-4 pb-10 pt-safe">
        <button
          type="button"
          onClick={onBack}
          className="safe-top mb-4 flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm font-medium text-slate-200 hover:border-brand-500/40"
        >
          <ChevronLeft className="h-5 w-5 text-brand-400" aria-hidden />
          {lang === 'de' ? 'Zurück' : 'Back'}
        </button>

        <div className="mb-8 text-center">
          <BrandLogo size={52} className="mx-auto mb-4" rounded="rounded-2xl" />
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{t.title}</h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-400">{t.subtitle}</p>
          {plan !== 'free' && (
            <p className="mt-3 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              {t.yourPlan}: {suitePlanDisplayName(plan, lang)}
            </p>
          )}
        </div>

        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-xl border border-slate-700 bg-slate-800/80 p-1">
            <button
              type="button"
              onClick={() => setBilling('monthly')}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                billing === 'monthly' ? 'bg-brand-600 text-white' : 'text-slate-400'
              }`}
            >
              {t.monthly}
            </button>
            <button
              type="button"
              onClick={() => setBilling('yearly')}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                billing === 'yearly' ? 'bg-brand-600 text-white' : 'text-slate-400'
              }`}
            >
              {t.yearly}
              <span className="ml-1.5 text-[10px] font-bold text-emerald-400">{t.save}</span>
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {PLAN_ORDER.map((id) => (
            <PlanCard
              key={id}
              plan={SUITE_PLANS[id]}
              billing={billing}
              currentPlan={plan}
              onTrial={handleTrial}
              onSubscribe={handleSubscribe}
              busy={busy}
              lang={lang}
            />
          ))}
        </div>

        <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-700/60">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="px-4 py-3 text-slate-400">{t.feature}</th>
                {PLAN_ORDER.map((id) => (
                  <th key={id} className="px-4 py-3 text-center font-semibold text-white">
                    {suitePlanDisplayName(id, lang)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SUITE_PLAN_COMPARISON[lang].map((row) => (
                <tr key={row.label} className="border-b border-slate-800 last:border-0">
                  <td className="px-4 py-3 text-slate-400">{row.label}</td>
                  <td className="px-4 py-3 text-center text-slate-300">{row.free}</td>
                  <td className="px-4 py-3 text-center text-slate-300">{row.pro}</td>
                  <td className="px-4 py-3 text-center text-emerald-400">{row.plus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-slate-500">{t.paymentNote}</p>
        <button
          type="button"
          onClick={handleRestore}
          className="mx-auto mt-3 flex min-h-[44px] items-center justify-center text-sm font-medium text-brand-400 hover:underline"
        >
          {t.restore}
        </button>
      </div>
    </div>
  )
}
