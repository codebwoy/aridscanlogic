import AiLanguageTabs from '@/components/shared/AiLanguageTabs'

/** Standard AI language switch — use above chat inputs in every AI surface. */
export default function AiLanguageBar({
  language,
  onChange,
  disabled = false,
  compact = false,
  className = '',
}) {
  return (
    <div
      className={`rounded-xl border border-brand-500/20 bg-brand-950/20 px-2 py-2 ${className}`}
    >
      <p className="mb-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-brand-300">
        {language === 'en' ? 'AI response language' : 'KI-Antwortsprache'}
      </p>
      <AiLanguageTabs
        language={language}
        onChange={onChange}
        disabled={disabled}
        compact={compact}
      />
    </div>
  )
}
