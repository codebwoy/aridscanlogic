import { ChevronLeft, LayoutGrid } from 'lucide-react'
import { BRAND_SUITE_NAME } from '@/lib/brand'

/** Return to ScanLogic Business Suite when ScanVault was opened from Settings. */
export default function ScanVaultSuiteBack({ onBack, className = '' }) {
  if (!onBack) return null

  return (
    <button
      type="button"
      onClick={onBack}
      className={`group flex min-h-[44px] items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-sm font-medium text-slate-200 transition hover:border-[#007AFF]/40 hover:bg-[#007AFF]/10 hover:text-white ${className}`}
      aria-label={`Back to ${BRAND_SUITE_NAME}`}
    >
      <ChevronLeft className="h-5 w-5 shrink-0 text-[#007AFF] transition group-hover:-translate-x-0.5" aria-hidden />
      <LayoutGrid className="h-4 w-4 shrink-0 text-slate-500 group-hover:text-[#007AFF]" aria-hidden />
      <span className="min-w-0 truncate">
        <span className="text-slate-400">Back to</span>{' '}
        <span className="text-slate-100">{BRAND_SUITE_NAME}</span>
      </span>
    </button>
  )
}
