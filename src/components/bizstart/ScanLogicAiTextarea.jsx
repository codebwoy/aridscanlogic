import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react'
import { bpT } from '@/lib/bizstart/businessPlanI18n'

export default function ScanLogicAiTextarea({
  lang,
  value,
  onChange,
  onRewrite,
  loading = false,
  polished = false,
  rows = 6,
  placeholder,
  className = '',
}) {
  return (
    <div className={className}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            ScanLogic AI
          </span>
          {polished && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
              <CheckCircle2 className="h-3 w-3" aria-hidden />
              {bpT(lang, 'aiPolished')}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onRewrite}
          disabled={loading || !value?.trim()}
          className="flex items-center gap-1.5 rounded-lg border border-brand-300 bg-brand-50 px-2.5 py-1.5 text-[11px] font-semibold text-brand-800 transition hover:border-brand-500 hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          ) : (
            <Sparkles className="h-3.5 w-3.5 text-brand-600" aria-hidden />
          )}
          {loading ? bpT(lang, 'aiRewriting') : bpT(lang, 'aiRewrite')}
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        disabled={loading}
        className="w-full rounded-xl border-2 border-brand-100 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 placeholder:font-normal focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25 disabled:opacity-70"
      />
      <p className="mt-1.5 text-[10px] text-slate-400">{bpT(lang, 'aiFieldHint')}</p>
    </div>
  )
}

export function ScanLogicAiOverlay({ lang, fieldLabel, progress }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-brand-500/30 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-indigo-600">
            <Sparkles className="h-5 w-5 animate-pulse text-white" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-bold text-brand-900">ScanLogic AI</p>
            <p className="text-xs text-slate-500">{bpT(lang, 'aiPolishingAll')}</p>
          </div>
        </div>
        {fieldLabel && (
          <p className="mb-2 truncate text-xs text-brand-700">
            {bpT(lang, 'aiCurrentSection')}: {fieldLabel}
          </p>
        )}
        {progress?.total > 0 && (
          <div className="mb-2">
            <div className="mb-1 flex justify-between text-[10px] text-slate-500">
              <span>
                {progress.current}/{progress.total}
              </span>
              <span>{Math.round((progress.current / progress.total) * 100)}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-brand-100">
              <div
                className="h-full bg-brand-600 transition-all"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}
        <p className="text-[11px] leading-relaxed text-slate-500">{bpT(lang, 'aiPolishingWait')}</p>
      </div>
    </div>
  )
}
