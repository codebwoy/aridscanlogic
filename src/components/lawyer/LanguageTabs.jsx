export default function LanguageTabs({
  language,
  onChange,
  disabled = false,
  compact = false,
  className = '',
}) {
  const deLabel = compact ? 'DE' : 'Deutsch'
  const enLabel = compact ? 'EN' : 'English'

  return (
    <div
      className={`flex rounded-xl border border-brand-500/30 bg-slate-900/80 p-1 shadow-inner shadow-black/20 ${className}`}
      role="tablist"
      aria-label="Response language"
    >
      <button
        type="button"
        role="tab"
        aria-selected={language === 'de'}
        disabled={disabled}
        onClick={() => onChange('de')}
        className={`${compact ? 'min-h-[32px] px-2.5 text-[11px]' : 'min-h-[40px] flex-1 px-3 text-xs'} rounded-lg font-semibold transition-colors ${
          language === 'de'
            ? 'bg-brand-600 text-white shadow-md shadow-brand-900/40'
            : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
        }`}
      >
        {deLabel}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={language === 'en'}
        disabled={disabled}
        onClick={() => onChange('en')}
        className={`${compact ? 'min-h-[32px] px-2.5 text-[11px]' : 'min-h-[40px] flex-1 px-3 text-xs'} rounded-lg font-semibold transition-colors ${
          language === 'en'
            ? 'bg-brand-600 text-white shadow-md shadow-brand-900/40'
            : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
        }`}
      >
        {enLabel}
      </button>
    </div>
  )
}
