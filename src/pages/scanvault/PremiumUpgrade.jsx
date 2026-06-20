import { useState } from 'react'
import { ChevronLeft, Check, Crown, Sparkles, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { BrandMark } from '@/components/shared/BrandLogo'
import { BRAND_SCANVAULT_NAME } from '@/lib/brand'
import { getEffectivePlan } from '@/lib/scanvault/limits'
import {
  PLANS,
  PLAN_COMPARISON,
  formatPlanPrice,
  planDisplayName,
} from '@/lib/scanvault/plans'
import { startPlanTrial, subscribeToPlan, setFreePlan, restorePurchases } from '@/lib/scanvault/subscription'
import { saveSessionUser } from '@/lib/scanvault/store'

const PLAN_ORDER = ['free', 'pro', 'plus']

const PLAN_ICONS = {
  free: Sparkles,
  pro: Zap,
  plus: Crown,
}

function PlanCard({ plan, billing, currentPlan, onSelectTrial, onSelectSubscribe, busy }) {
  const Icon = PLAN_ICONS[plan.id]
  const isCurrent = currentPlan === plan.id
  const isFree = plan.id === 'free'

  return (
    <article
      className={`relative flex flex-col rounded-2xl border p-5 transition ${
        plan.recommended
          ? 'border-[#007AFF] bg-gradient-to-b from-[#007AFF]/15 to-[#0f0f0f] shadow-lg shadow-[#007AFF]/10'
          : 'border-white/10 bg-white/[0.03]'
      } ${isCurrent ? 'ring-2 ring-emerald-500/50' : ''}`}
    >
      {plan.recommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#007AFF] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          Best value
        </span>
      )}
      {plan.id === 'pro' && !plan.recommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
          Popular
        </span>
      )}

      <div className="mb-4 flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            plan.recommended ? 'bg-[#007AFF]/25 text-[#007AFF]' : 'bg-white/10 text-slate-300'
          }`}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{plan.name}</h3>
          <p className="text-xs text-slate-500">{plan.tagline}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-3xl font-bold tracking-tight text-white">
          {formatPlanPrice(plan.id, billing)}
        </p>
        {!isFree && billing === 'yearly' && (
          <p className="mt-1 text-xs text-slate-500">
            ≈ €{(plan.priceYearly / 12).toFixed(2)}/month billed annually
          </p>
        )}
        {!isFree && plan.trialDays > 0 && (
          <p className="mt-2 text-xs font-medium text-[#007AFF]">{plan.trialDays}-day free trial</p>
        )}
      </div>

      <ul className="mb-6 flex-1 space-y-2.5 border-t border-white/10 pt-4">
        {plan.highlights.map((line) => (
          <li key={line} className="flex items-start gap-2 text-sm text-slate-300">
            <Check
              className={`mt-0.5 h-4 w-4 shrink-0 ${plan.recommended ? 'text-[#007AFF]' : 'text-emerald-500'}`}
              aria-hidden
            />
            <span>{line}</span>
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <button
          type="button"
          disabled
          className="min-h-[48px] w-full rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-3 text-sm font-semibold text-emerald-400"
        >
          Current plan
        </button>
      ) : isFree ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => onSelectSubscribe('free')}
          className="min-h-[48px] w-full rounded-xl border border-white/15 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5 disabled:opacity-50"
        >
          Use Free plan
        </button>
      ) : (
        <div className="space-y-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onSelectTrial(plan.id)}
            className={`min-h-[48px] w-full rounded-xl py-3 text-sm font-semibold disabled:opacity-50 ${
              plan.recommended
                ? 'bg-[#007AFF] text-white hover:bg-[#0066DD]'
                : 'bg-white/10 text-white hover:bg-white/15'
            }`}
          >
            Start {plan.trialDays}-day trial
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onSelectSubscribe(plan.id)}
            className="w-full py-2 text-xs font-medium text-slate-500 hover:text-[#007AFF]"
          >
            Subscribe {formatPlanPrice(plan.id, billing)} →
          </button>
        </div>
      )}
    </article>
  )
}

function ComparisonTable({ billing: _billing }) {
  return (
    <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03]">
            <th className="px-4 py-3 font-medium text-slate-400">Feature</th>
            {PLAN_ORDER.map((id) => (
              <th key={id} className="px-4 py-3 text-center font-semibold text-white">
                {PLANS[id].name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PLAN_COMPARISON.map((row) => (
            <tr key={row.label} className="border-b border-white/5 last:border-0">
              <td className="px-4 py-3 text-slate-400">{row.label}</td>
              {PLAN_ORDER.map((id) => {
                const plan = PLANS[id]
                let val
                if (row.key in plan.limits) {
                  val = row.format(plan.limits[row.key])
                } else if (row.key in plan.capabilities) {
                  const cap = plan.capabilities[row.key]
                  val = row.invert ? row.format(cap) : row.format(cap)
                } else {
                  val = '—'
                }
                const positive = val === '✓'
                return (
                  <td
                    key={id}
                    className={`px-4 py-3 text-center ${positive ? 'font-medium text-emerald-400' : 'text-slate-300'}`}
                  >
                    {val}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function PremiumUpgrade({ user, onBack, onUpgraded }) {
  const [billing, setBilling] = useState('yearly')
  const [busy, setBusy] = useState(false)
  const currentPlan = getEffectivePlan(user)

  const finish = (updated, message) => {
    saveSessionUser(updated)
    toast.success(message)
    onUpgraded?.(updated)
    if (updated.plan === 'free' || getEffectivePlan(updated) !== 'free') {
      onBack?.()
    }
  }

  const handleTrial = async (planId) => {
    setBusy(true)
    try {
      const updated = startPlanTrial(user, planId)
      finish(updated, `${planDisplayName(planId)} trial started — ${PLANS[planId].trialDays} days`)
    } catch (e) {
      toast.error(e.message || 'Could not start trial')
    } finally {
      setBusy(false)
    }
  }

  const handleSubscribe = async (planId) => {
    setBusy(true)
    try {
      if (planId === 'free') {
        const updated = setFreePlan(user)
        finish(updated, 'Switched to Free plan')
        return
      }
      const updated = subscribeToPlan(user, planId)
      finish(
        updated,
        `Subscribed to ${planDisplayName(planId)} (${formatPlanPrice(planId, billing)})`
      )
    } catch (e) {
      toast.error(e.message || 'Subscription failed')
    } finally {
      setBusy(false)
    }
  }

  const handleRestore = () => {
    const restored = restorePurchases(user)
    if (!restored) {
      toast.message('No active subscription found for this account')
      return
    }
    finish(restored, `Restored ${planDisplayName(getEffectivePlan(restored))} plan`)
  }

  return (
    <div className="scanvault-shell min-h-full bg-[#0a0a0a] pb-10 text-white">
      <div className="mx-auto max-w-5xl px-4">
        <button
          type="button"
          onClick={onBack}
          className="safe-top mb-6 flex min-h-[44px] items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-slate-200 hover:border-[#007AFF]/40 hover:bg-[#007AFF]/10"
        >
          <ChevronLeft className="h-5 w-5 text-[#007AFF]" aria-hidden />
          Back
        </button>

        <div className="mb-8 text-center">
          <BrandMark title={BRAND_SCANVAULT_NAME} subtitle="Choose the plan that fits your workflow" size={48} className="mx-auto mb-4 justify-center" />
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Plans & pricing</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
            Free for local scanning. Pro for power users. Plus for unlimited cloud-backed archiving.
          </p>
          {currentPlan !== 'free' && (
            <p className="mt-3 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              Your plan: {planDisplayName(currentPlan)}
            </p>
          )}
        </div>

        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.04] p-1">
            <button
              type="button"
              onClick={() => setBilling('monthly')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                billing === 'monthly' ? 'bg-[#007AFF] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBilling('yearly')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                billing === 'yearly' ? 'bg-[#007AFF] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="ml-1.5 text-[10px] font-bold text-emerald-400">Save ~33%</span>
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {PLAN_ORDER.map((id) => (
            <PlanCard
              key={id}
              plan={PLANS[id]}
              billing={billing}
              currentPlan={currentPlan}
              onSelectTrial={handleTrial}
              onSelectSubscribe={handleSubscribe}
              busy={busy}
            />
          ))}
        </div>

        <ComparisonTable billing={billing} />

        <p className="mt-8 text-center text-[11px] leading-relaxed text-slate-500">
          Demo billing — no real payment processed. Trials and subscriptions are stored on this device.
          Cancel anytime from Settings. Payment provider integration can be added for production.
        </p>

        <button
          type="button"
          onClick={handleRestore}
          className="mx-auto mt-4 flex min-h-[44px] w-full max-w-xs items-center justify-center text-sm font-medium text-[#007AFF] hover:underline"
        >
          Restore purchase
        </button>
      </div>
    </div>
  )
}
