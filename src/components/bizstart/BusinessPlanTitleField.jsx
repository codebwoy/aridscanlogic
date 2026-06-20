import { bpT } from '@/lib/bizstart/businessPlanI18n'

/** Editable business / plan title — used in wizard header and download screen. */
export default function BusinessPlanTitleField({ variant = 'header', lang, value, onChange }) {
  const label = bpT(lang, 'planTitle')
  const placeholder = bpT(lang, 'phPlanTitle')

  if (variant === 'download') {
    return (
      <div>
        <label htmlFor="bp-plan-title-download" className="block text-xs font-semibold uppercase tracking-wide text-brand-300">
          {label}
        </label>
        <p className="mt-1 text-[11px] text-slate-500">{bpT(lang, 'planTitlePdfHint')}</p>
        <input
          id="bp-plan-title-download"
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-2 w-full rounded-xl border-2 border-brand-500/30 bg-slate-900/50 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm outline-none transition placeholder:font-normal placeholder:text-slate-500 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/25"
        />
      </div>
    )
  }

  return (
    <label className="mt-1 block">
      <span className="sr-only">{label}</span>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-lg font-bold text-white shadow-sm outline-none transition placeholder:font-medium placeholder:text-white/45 focus:border-white/60 focus:bg-white/15 focus:ring-2 focus:ring-white/20 sm:text-xl"
      />
    </label>
  )
}
