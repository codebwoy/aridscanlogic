import { bpT } from '@/lib/bizstart/businessPlanI18n'

const OPTIONS = [
  { id: 'clean', titleKey: 'planPdfClean', hintKey: 'planPdfCleanHint' },
  { id: 'branded', titleKey: 'planPdfBranded', hintKey: 'planPdfBrandedHint' },
]

export default function BusinessPlanPdfOptions({ lang, value = 'clean', onChange }) {
  return (
    <fieldset>
      <legend className="block text-xs font-semibold uppercase tracking-wide text-brand-300">
        {bpT(lang, 'planPdfBrandingLabel')}
      </legend>
      <div className="mt-2 space-y-2">
        {OPTIONS.map((opt) => {
          const checked = (value || 'clean') === opt.id
          return (
            <label
              key={opt.id}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 transition ${
                checked ? 'border-brand-400/60 bg-brand-500/10' : 'border-slate-700/50 bg-slate-900/30 hover:border-slate-600'
              }`}
            >
              <input
                type="radio"
                name="planPdfBranding"
                value={opt.id}
                checked={checked}
                onChange={() => onChange(opt.id)}
                className="mt-0.5 accent-brand-500"
              />
              <span>
                <span className="block text-sm font-medium text-slate-100">{bpT(lang, opt.titleKey)}</span>
                <span className="mt-0.5 block text-[11px] leading-relaxed text-slate-500">{bpT(lang, opt.hintKey)}</span>
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
