import { ScanLine, Cloud, CloudOff } from 'lucide-react'
import { isPremiumUser, canCloudSync } from '@/lib/scanvault/limits'
import { BrandMark } from '@/components/shared/BrandLogo'
import { BRAND_SCANVAULT_NAME } from '@/lib/brand'

export default function ScanTab({ user, onStartScan }) {
  const premium = isPremiumUser(user)
  const cloud = canCloudSync(user)

  return (
    <div className="flex flex-col items-center pt-6 sm:pt-10 lg:pt-16">
      <div className="mb-6 flex w-full items-center justify-between gap-3">
        <BrandMark title={BRAND_SCANVAULT_NAME} size={44} />
        <div className="flex items-center gap-1 text-xs text-slate-500">
          {cloud ? (
            <>
              <Cloud className="h-4 w-4 text-[#007AFF]" /> Synced
            </>
          ) : (
            <>
              <CloudOff className="h-4 w-4" /> Local only
            </>
          )}
        </div>
      </div>
      {!premium && (
        <p className="mb-4 w-full rounded-xl bg-amber-500/10 px-3 py-2 text-center text-xs text-amber-200">
          Free plan: scans stored locally. Clearing browser data deletes them.
        </p>
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
