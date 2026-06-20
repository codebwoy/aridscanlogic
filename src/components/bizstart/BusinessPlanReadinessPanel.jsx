import { useEffect, useState } from 'react'
import { Gauge, Sparkles, Loader2, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react'
import { bpT } from '@/lib/bizstart/businessPlanI18n'
import {
  assessBusinessPlanReadiness,
  computeStaticReadiness,
  readinessColor,
  readinessLevel,
} from '@/lib/bizstart/businessPlanReadiness'

export default function BusinessPlanReadinessPanel({
  lang,
  formData,
  draft,
  compact = false,
  autoAssess = false,
}) {
  const [result, setResult] = useState(() => computeStaticReadiness(draft, lang))
  const [loading, setLoading] = useState(false)

  const runAssess = async () => {
    setLoading(true)
    try {
      const next = await assessBusinessPlanReadiness(formData, draft, lang)
      setResult(next)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setResult(computeStaticReadiness(draft, lang))
  }, [draft, lang])

  useEffect(() => {
    if (autoAssess && draft?.planAudience) runAssess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoAssess, draft?.planAudience])

  const score = result?.score ?? 0
  const level = readinessLevel(score, lang)

  return (
    <div
      className={`rounded-2xl border border-brand-200/80 bg-gradient-to-br from-white to-brand-50/60 shadow-sm ring-1 ring-brand-100/50 ${
        compact ? 'p-4' : 'p-5'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-brand-600" aria-hidden />
          <div>
            <p className="text-sm font-bold text-brand-900">{bpT(lang, 'readinessTitle')}</p>
            <p className="text-[11px] text-slate-500">
              {bpT(lang, 'readinessFor')}: {result?.audienceLabel || '—'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold tabular-nums ${readinessColor(score)}`}>{score}%</p>
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">{level}</p>
        </div>
      </div>

      {result?.headline && (
        <p className="mt-3 text-xs leading-relaxed text-slate-600">{result.headline}</p>
      )}

      {result?.strengths?.length > 0 && (
        <ul className="mt-3 space-y-1">
          {result.strengths.slice(0, 3).map((s, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-emerald-700">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              {s}
            </li>
          ))}
        </ul>
      )}

      {result?.gaps?.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {bpT(lang, 'readinessGaps')}
          </p>
          <ul className="space-y-2">
            {result.gaps.map((g) => (
              <li
                key={g.id}
                className="flex items-start gap-2 rounded-xl border border-amber-200/80 bg-amber-50/50 px-3 py-2 text-xs text-slate-700"
              >
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden />
                <div>
                  <p className="font-medium text-slate-800">{g.label}</p>
                  {g.action && <p className="mt-0.5 text-slate-500">{g.action}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={runAssess}
        disabled={loading}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-brand-300 bg-white py-2.5 text-xs font-semibold text-brand-700 hover:bg-brand-50 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
        ) : result?.aiEnhanced ? (
          <RefreshCw className="h-3.5 w-3.5" aria-hidden />
        ) : (
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
        )}
        {loading ? bpT(lang, 'readinessAssessing') : bpT(lang, 'readinessAssess')}
      </button>
    </div>
  )
}
