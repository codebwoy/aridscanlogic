import { CheckCircle2 } from 'lucide-react'
import { PLAN_AUDIENCES } from '@/lib/bizstart/businessPlanGuidelines'

const AUDIENCE_ICONS = {
  bank: '🏦',
  investor: '📈',
  award: '🏆',
  sponsor: '🤝',
  employment: '📋',
  advisor: '💼',
  general: '📝',
}

/** Card-based audience picker — avoids native select validation/focus issues on mobile. */
export default function BusinessPlanAudiencePicker({ lang, value, onChange, disabled = false }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label={lang === 'de' ? 'Zielgruppe' : 'Plan audience'}>
      {PLAN_AUDIENCES.map((a) => {
        const selected = value === a.id
        const label = lang === 'de' ? a.de : a.en
        return (
          <button
            key={a.id}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(a.id)}
            className={`flex items-start gap-3 rounded-xl border-2 px-3.5 py-3 text-left transition ${
              selected
                ? 'border-brand-500 bg-brand-50 shadow-md ring-2 ring-brand-500/25'
                : 'border-brand-100 bg-white hover:border-brand-300 hover:bg-brand-50/50'
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <span className="mt-0.5 text-lg leading-none" aria-hidden>
              {AUDIENCE_ICONS[a.id] || '•'}
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block text-sm font-semibold ${selected ? 'text-brand-900' : 'text-slate-800'}`}>
                {label}
              </span>
            </span>
            {selected && (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
            )}
          </button>
        )
      })}
    </div>
  )
}
