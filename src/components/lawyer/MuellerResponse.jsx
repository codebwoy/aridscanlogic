import { ListChecks } from 'lucide-react'
import LawyerMarkdown, { isExecutiveSummary } from '@/components/lawyer/LawyerMarkdown'
import BrandLogo from '@/components/shared/BrandLogo'
import AiLanguageTabs from '@/components/shared/AiLanguageTabs'

export default function MuellerResponse({
  children,
  language = 'de',
  onLanguageChange,
  languageSwitchDisabled = false,
}) {
  const summary = isExecutiveSummary(children)

  if (!summary) {
    return <LawyerMarkdown>{children}</LawyerMarkdown>
  }

  const badge = language === 'en' ? 'Executive Summary' : 'Zusammenfassung'
  const body = children.replace(/^##\s*(Executive Summary|Zusammenfassung)\s*\n+/im, '')

  return (
    <div className="mueller-summary min-w-0 max-w-full">
      <div className="mb-4 rounded-xl border border-brand-500/25 bg-gradient-to-r from-brand-600/15 via-indigo-900/20 to-slate-900/40 px-3 py-2.5">
        <div className="flex items-start gap-3">
          <BrandLogo size={36} rounded="rounded-lg" className="shrink-0 shadow-brand-900/40" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <ListChecks className="h-3.5 w-3.5 shrink-0 text-brand-400" aria-hidden />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-300">
                {badge}
              </span>
            </div>
            <p className="text-xs text-slate-400">Herr Müller · ScanLogic Business Suite</p>
          </div>
        </div>
        {onLanguageChange && (
          <div className="mt-3 border-t border-brand-500/15 pt-3">
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
              {language === 'en' ? 'Switch language' : 'Sprache wechseln'}
            </p>
            <AiLanguageTabs
              language={language}
              onChange={onLanguageChange}
              disabled={languageSwitchDisabled}
              compact
            />
          </div>
        )}
      </div>
      <LawyerMarkdown>{body}</LawyerMarkdown>
    </div>
  )
}
