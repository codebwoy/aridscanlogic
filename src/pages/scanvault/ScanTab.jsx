import { ScanLine, Cloud, CloudOff } from 'lucide-react'
import { canCloudSync, getEffectivePlan } from '@/lib/scanvault/limits'
import { planDisplayName } from '@/lib/scanvault/plans'
import { BrandMark } from '@/components/shared/BrandLogo'
import { BRAND_SCANVAULT_NAME } from '@/lib/brand'

export default function ScanTab({ user, onStartScan, onUpgrade }) {
  const plan = getEffectivePlan(user)
  const cloud = canCloudSync(user)

  return (
    <div className="flex flex-col items-center pt-6 sm:pt-10 lg:pt-16">
      <div className="mb-6 flex w-full items-center justify-between gap-3">
        <BrandMark title={BRAND_SCANVAULT_NAME} size={44} />
        <div className="flex flex-col items-end gap-1 text-xs text-slate-500">
          <span className="rounded-full bg-white/10 px-2 py-0.5 font-medium text-slate-300">
            {planDisplayName(plan)}
          </span>
          {cloud ? (
            <span className="flex items-center gap-1">
              <Cloud className="h-3.5 w-3.5 text-[#007AFF]" /> Cloud sync
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <CloudOff className="h-3.5 w-3.5" /> Local only
            </span>
          )}
        </div>
      </div>
      {plan === 'free' && (
        <button
          type="button"
          onClick={onUpgrade}
          className="mb-4 w-full rounded-xl bg-amber-500/10 px-3 py-2.5 text-center text-xs text-amber-200 hover:bg-amber-500/15"
        >
          Free plan: scans stored locally. Upgrade to Pro or Plus for more —{' '}
          <span className="font-semibold text-[#007AFF]">View plans</span>
        </button>
      )}
      <button
        type="button"
        onClick={onStartScan}
        className="flex min-h-[120px] w-full max-w-sm flex-col items-center justify-center gap-3 rounded-3xl bg-[#007AFF] py-8 shadow-lg shadow-[#007AFF]/30 sm:min-h-[140px] md:max-w-md lg:max-w-lg"
      >
        <ScanLine className="h-14 w-14" />
        <span className="text-lg font-semibold">Tap to Scan</span>
      </button>
      <p className="mt-6 max-w-xs text-center text-sm text-slate-500">
        Point your camera at a document. Edge detection helps frame your scan automatically.
      </p>
    </div>
  )
}
