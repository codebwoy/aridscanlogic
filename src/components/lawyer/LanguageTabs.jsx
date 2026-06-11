export default function LanguageTabs({ language, onChange, disabled = false }) {
  return (
    <div
      className="flex rounded-xl border border-slate-700/60 bg-slate-900/60 p-1"
      role="tablist"
      aria-label="Response language"
    >
      <button
        type="button"
        role="tab"
        aria-selected={language === 'de'}
        disabled={disabled}
        onClick={() => onChange('de')}
        className={`min-h-[36px] flex-1 rounded-lg px-3 text-xs font-semibold transition-colors ${
          language === 'de'
            ? 'bg-brand-600 text-white shadow-md shadow-brand-900/30'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        Deutsch
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={language === 'en'}
        disabled={disabled}
        onClick={() => onChange('en')}
        className={`min-h-[36px] flex-1 rounded-lg px-3 text-xs font-semibold transition-colors ${
          language === 'en'
            ? 'bg-brand-600 text-white shadow-md shadow-brand-900/30'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        English
      </button>
    </div>
  )
}
