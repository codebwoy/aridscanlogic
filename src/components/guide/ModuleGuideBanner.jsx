import { Sparkles } from 'lucide-react'
import { useGuide } from '@/context/GuideContext'

/** One-line contextual CTA under page titles — opens guide for current module */
export default function ModuleGuideBanner({ moduleId, title }) {
  const { openGuide, language } = useGuide()

  return (
    <button
      type="button"
      onClick={() => openGuide(moduleId)}
      className="mb-4 flex w-full items-center gap-2 rounded-xl border border-brand-500/20 bg-brand-950/30 px-3 py-2.5 text-left text-xs text-brand-200/90 transition-colors hover:border-brand-500/40 hover:bg-brand-900/30"
    >
      <Sparkles className="h-4 w-4 shrink-0 text-brand-400" />
      <span>
        {language === 'en' ? (
          <>
            New to <strong className="font-semibold text-brand-100">{title}</strong>? Tap for how it works →
          </>
        ) : (
          <>
            Neu bei <strong className="font-semibold text-brand-100">{title}</strong>? So funktioniert der Bereich →
          </>
        )}
      </span>
    </button>
  )
}
