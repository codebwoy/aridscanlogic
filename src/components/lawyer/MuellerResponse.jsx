import { ListChecks } from 'lucide-react'
import LawyerMarkdown, { isExecutiveSummary } from '@/components/lawyer/LawyerMarkdown'
import BrandLogo from '@/components/shared/BrandLogo'

export default function MuellerResponse({ children, language = 'de' }) {
  const summary = isExecutiveSummary(children)

  if (!summary) {
    return <LawyerMarkdown>{children}</LawyerMarkdown>
  }

  const badge = language === 'en' ? 'Executive Summary' : 'Executive Summary'
  const body = children.replace(/^##\s*(Executive Summary|Zusammenfassung)\s*\n+/im, '')

  return (
    <div className="mueller-summary">
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-brand-500/25 bg-gradient-to-r from-brand-600/15 via-indigo-900/20 to-slate-900/40 px-3 py-2.5">
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
      <LawyerMarkdown>{body}</LawyerMarkdown>
    </div>
  )
}
