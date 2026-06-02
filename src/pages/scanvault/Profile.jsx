import { ChevronLeft } from 'lucide-react'
import { saveSessionUser } from '@/lib/scanvault/store'
import { isPremiumUser } from '@/lib/scanvault/limits'

export default function Profile({ user, onBack, onUserChange }) {
  const premium = isPremiumUser(user)

  const update = (patch) => {
    const updated = { ...user, ...patch }
    saveSessionUser(updated)
    onUserChange?.(updated)
  }

  return (
    <div className="scanvault-shell min-h-full bg-[#0f0f0f] px-4 pb-8 text-white">
      <button type="button" onClick={onBack} className="safe-top mb-4 flex items-center gap-1 text-sm text-[#007AFF]">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      <div className="mb-6 flex flex-col items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#007AFF]/30 text-2xl font-bold">
          {user?.name?.[0] || '?'}
        </div>
        <p className="mt-3 text-lg font-semibold">{user?.name}</p>
        <p className="text-sm text-slate-500">{user?.email}</p>
        <span className="mt-2 rounded-full bg-white/10 px-3 py-1 text-xs">
          {premium ? 'Premium' : 'Free plan'}
        </span>
      </div>
      <dl className="space-y-3 rounded-2xl bg-white/5 p-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">Total scans</dt>
          <dd>{user?.scanCount ?? 0}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Storage used</dt>
          <dd>{((user?.storageUsedBytes || 0) / 1024).toFixed(0)} KB</dd>
        </div>
      </dl>
      <label className="mt-4 block">
        <span className="text-xs text-slate-500">Display name</span>
        <input
          defaultValue={user?.name}
          onBlur={(e) => update({ name: e.target.value })}
          className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2"
        />
      </label>
    </div>
  )
}
