import { Sparkles, Target, Loader2, RefreshCw, FileText, ChevronRight, ChevronDown, EyeOff } from 'lucide-react'
import { bpT, bpStepLabel } from '@/lib/bizstart/businessPlanI18n'
import { PLAN_AUDIENCES } from '@/lib/bizstart/businessPlanGuidelines'

function audienceName(audienceId, lang) {
  const a = PLAN_AUDIENCES.find((x) => x.id === audienceId)
  if (!a) return audienceId
  return lang === 'de' ? a.de : a.en
}

export default function BusinessPlanAudienceStrategy({
  lang,
  audienceId,
  planTitle,
  strategy,
  loadingStrategy = false,
  loadingSummary = false,
  onRefreshStrategy,
  onGenerateSummary,
  compact = false,
  hidden = false,
  onToggleHidden,
  showPdfNote = false,
}) {
  if (!audienceId) return null

  const prioritySteps = strategy?.prioritySteps || []
  const summaryFocus = strategy?.summaryFocus || []
  const busy = loadingStrategy || loadingSummary
  const displayName = planTitle?.trim()
  const headerTitle = displayName || bpT(lang, 'strategyTitle')
  const headerSubtitle = displayName
    ? `${bpT(lang, 'strategyFor')}: ${audienceName(audienceId, lang)}`
    : `${bpT(lang, 'strategyFor')}: ${audienceName(audienceId, lang)}`

  if (hidden) {
    return (
      <div
        className={`rounded-2xl border border-brand-200/70 bg-white shadow-sm ring-1 ring-brand-100/50 ${
          compact ? '' : 'mt-4'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            {displayName ? (
              <>
                <p className="truncate text-sm font-bold text-brand-900">{displayName}</p>
                <p className="text-[11px] text-slate-500">{headerSubtitle}</p>
              </>
            ) : (
              <p className="text-sm font-semibold text-slate-700">{bpT(lang, 'strategyTitle')}</p>
            )}
            {showPdfNote && (
              <p className="mt-1 text-[10px] text-slate-400">{bpT(lang, 'strategyNotInPdf')}</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onGenerateSummary}
              disabled={busy}
              className="flex items-center gap-1.5 rounded-lg border border-brand-300 bg-brand-50 px-2.5 py-1.5 text-[11px] font-semibold text-brand-800 transition hover:bg-brand-100 disabled:opacity-50"
            >
              {loadingSummary ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
              {loadingSummary ? bpT(lang, 'strategyGeneratingSummary') : bpT(lang, 'strategyGenerateSummary')}
            </button>
            <button
              type="button"
              onClick={onToggleHidden}
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-brand-700 hover:bg-brand-50"
            >
              <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              {bpT(lang, 'strategyShowGuide')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-brand-300/50 bg-gradient-to-br from-brand-50 via-white to-indigo-50/60 shadow-md ring-1 ring-brand-200/40 ${
        compact ? '' : 'mt-4'
      }`}
    >
      <div className="border-b border-brand-200/60 bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-800 px-4 py-3.5 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <Target className="h-5 w-5 text-white" aria-hidden />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  ScanLogic AI
                </span>
                {strategy?.aiEnhanced && (
                  <span className="text-[10px] font-medium text-brand-200">{bpT(lang, 'strategyAiEnhanced')}</span>
                )}
              </div>
              <h3 className="mt-1 truncate text-sm font-bold text-white sm:text-base">{headerTitle}</h3>
              <p className="mt-0.5 text-xs text-brand-100">{headerSubtitle}</p>
              {showPdfNote && (
                <p className="mt-1.5 text-[10px] text-brand-200/90">{bpT(lang, 'strategyNotInPdf')}</p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onToggleHidden}
              className="flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-white/20"
            >
              <EyeOff className="h-3.5 w-3.5" aria-hidden />
              {bpT(lang, 'strategyHideGuide')}
            </button>
            <button
              type="button"
              onClick={onRefreshStrategy}
              disabled={busy}
              className="flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-white/20 disabled:opacity-50"
            >
              {loadingStrategy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              {bpT(lang, 'strategyRefresh')}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        {strategy?.tone && (
          <p className="rounded-xl border border-brand-100 bg-white/80 px-3.5 py-2.5 text-xs italic leading-relaxed text-slate-600">
            {strategy.tone}
          </p>
        )}

        {prioritySteps.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-700">
              {bpT(lang, 'strategyPrioritySections')}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {prioritySteps.map((stepId, i) => (
                <span
                  key={stepId}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    i === 0
                      ? 'bg-brand-600 text-white shadow-sm'
                      : i < 3
                        ? 'bg-brand-100 text-brand-800 ring-1 ring-brand-200'
                        : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
                  }`}
                >
                  {i === 0 && <ChevronRight className="h-3 w-3" aria-hidden />}
                  {bpStepLabel(stepId, lang)}
                </span>
              ))}
            </div>
          </div>
        )}

        {summaryFocus.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-700">
              {bpT(lang, 'strategySummaryFocus')}
            </p>
            <ul className="space-y-2">
              {summaryFocus.map((bullet) => (
                <li key={bullet} className="flex gap-2.5 rounded-xl border border-brand-50 bg-white px-3 py-2 text-xs leading-relaxed text-slate-700 shadow-sm">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" aria-hidden />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-2 border-t border-brand-100 pt-4 sm:flex-row">
          <button
            type="button"
            onClick={onGenerateSummary}
            disabled={busy}
            className="btn-primary flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50"
          >
            {loadingSummary ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            {loadingSummary ? bpT(lang, 'strategyGeneratingSummary') : bpT(lang, 'strategyGenerateSummary')}
          </button>
        </div>
        <p className="text-[10px] leading-relaxed text-slate-400">{bpT(lang, 'strategyDisclaimer')}</p>
      </div>
    </div>
  )
}
