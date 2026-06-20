import { Sparkles, Target, Loader2, RefreshCw, FileText, ChevronRight } from 'lucide-react'
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
  strategy,
  loadingStrategy = false,
  loadingSummary = false,
  onRefreshStrategy,
  onGenerateSummary,
  compact = false,
}) {
  if (!audienceId) return null

  const prioritySteps = strategy?.prioritySteps || []
  const summaryFocus = strategy?.summaryFocus || []
  const busy = loadingStrategy || loadingSummary

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-brand-300/50 bg-gradient-to-br from-brand-50 via-white to-indigo-50/60 shadow-md ring-1 ring-brand-200/40 ${
        compact ? '' : 'mt-4'
      }`}
    >
      <div className="border-b border-brand-200/60 bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-800 px-4 py-3.5 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <Target className="h-5 w-5 text-white" aria-hidden />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  ScanLogic AI
                </span>
                {strategy?.aiEnhanced && (
                  <span className="text-[10px] font-medium text-brand-200">{bpT(lang, 'strategyAiEnhanced')}</span>
                )}
              </div>
              <h3 className="mt-1 text-sm font-bold text-white sm:text-base">{bpT(lang, 'strategyTitle')}</h3>
              <p className="mt-0.5 text-xs text-brand-100">
                {bpT(lang, 'strategyFor')}: <span className="font-semibold text-white">{audienceName(audienceId, lang)}</span>
              </p>
            </div>
          </div>
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
