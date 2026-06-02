import { ChevronLeft, Check } from 'lucide-react'
import { startPremiumTrial } from '@/lib/scanvault/auth'
import { saveSessionUser } from '@/lib/scanvault/store'
import { toast } from 'sonner'

const FEATURES = [
  'Unlimited scans and storage',
  'No watermarks on exports',
  'Unlimited folders',
  'Batch scanning (unlimited pages)',
  'Batch export to PDF/ZIP',
  'Cloud backup & sync',
  'Ad-free experience',
  'Priority support',
]

export default function PremiumUpgrade({ user, onBack, onUpgraded }) {
  const startTrial = () => {
    const updated = startPremiumTrial(user)
    saveSessionUser(updated)
    toast.success('3-day Premium trial started')
    onUpgraded?.(updated)
    onBack?.()
  }

  return (
    <div className="scanvault-shell min-h-full bg-[#0f0f0f] px-4 pb-8 text-white">
      <button type="button" onClick={onBack} className="safe-top mb-4 flex items-center gap-1 text-sm text-slate-400">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="text-2xl font-bold">ScanVault Premium</h1>
      <p className="mt-1 text-slate-400">$X.99/year · 3-day free trial</p>
      <div className="mt-6 grid grid-cols-2 gap-2 text-center text-xs">
        <div className="rounded-xl bg-white/5 p-3">
          <p className="font-semibold text-slate-400">Free</p>
          <p className="mt-2">50 scans</p>
          <p>5 pages/doc</p>
          <p>3 folders</p>
          <p>Watermark</p>
        </div>
        <div className="rounded-xl border border-[#007AFF]/50 bg-[#007AFF]/10 p-3">
          <p className="font-semibold text-[#007AFF]">Premium</p>
          <p className="mt-2">Unlimited</p>
          <p>Unlimited pages</p>
          <p>Unlimited folders</p>
          <p>No watermark</p>
        </div>
      </div>
      <ul className="mt-6 space-y-2">
        {FEATURES.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 shrink-0 text-[#007AFF]" />
            {f}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={startTrial}
        className="mt-8 min-h-[48px] w-full rounded-xl bg-[#007AFF] py-3 font-semibold"
      >
        Start 3-Day Free Trial
      </button>
      <p className="mt-3 text-center text-[10px] text-slate-500">
        Cancel anytime. Payment charged after trial ends.
      </p>
      <button type="button" className="mt-4 w-full text-sm text-[#007AFF]">
        Restore purchase
      </button>
    </div>
  )
}
