/**
 * Horizontally scrollable segment tabs — mobile snap, tablet/desktop wrap comfortably.
 */
export default function ResponsiveTabs({
  tabs,
  value,
  onChange,
  lang = 'de',
  className = '',
  size = 'md',
}) {
  const pad = size === 'sm' ? 'px-2.5 py-1.5 text-[11px]' : 'px-3 py-2.5 text-xs sm:text-sm'
  return (
    <div
      role="tablist"
      className={`responsive-tabs flex gap-1 overflow-x-auto overscroll-x-contain rounded-xl bg-slate-900/80 p-1 scrollbar-hide ${className}`}
    >
      {tabs.map((t) => {
        const id = t.id
        const label = lang === 'de' ? t.de || t.labelDe || t.label : t.en || t.labelEn || t.label
        const active = value === id
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={`touch-target shrink-0 snap-start rounded-lg font-medium transition ${pad} ${
              active
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
