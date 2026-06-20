import { useState } from 'react'
import { Shield, Lock, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import BrandLogo from '@/components/shared/BrandLogo'
import { BRAND_SUITE_NAME } from '@/lib/brand'
import { setAdminSecret } from '@/lib/activity/trackActivity'
import { fetchAdminStatus, fetchAdminStats } from '@/lib/admin/adminApi'
import AdminDashboard from './AdminDashboard'

export default function AdminRoot({ onExit }) {
  const [secret, setSecret] = useState('')
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    const trimmed = secret.trim()
    if (!trimmed) {
      toast.error('Admin secret required')
      return
    }
    setChecking(true)
    setAdminSecret(trimmed)
    try {
      const status = await fetchAdminStatus()
      if (!status.configured) {
        toast.error('Admin API not configured on server (ADMIN_API_SECRET)')
        setAdminSecret('')
        return
      }
      if (!status.connected) {
        toast.error('Database not connected — check DATABASE_URL')
        setAdminSecret('')
        return
      }
      const statsRes = await fetchAdminStats()
      if (!statsRes) {
        toast.error('Invalid admin credentials')
        setAdminSecret('')
        return
      }
      setAuthed(true)
      toast.success('Admin access granted')
    } catch {
      toast.error('Could not reach admin API')
      setAdminSecret('')
    } finally {
      setChecking(false)
    }
  }

  if (authed) {
    return <AdminDashboard onExit={onExit} />
  }

  return (
    <div className="safe-top flex min-h-dvh flex-col bg-[#0a0f1a] text-slate-100">
      <header className="border-b border-slate-800/80 bg-slate-900/60 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo className="h-8 w-8" />
            <div>
              <p className="text-sm font-semibold">{BRAND_SUITE_NAME}</p>
              <p className="text-xs text-slate-400">Admin Console</p>
            </div>
          </div>
          {onExit && (
            <button
              type="button"
              onClick={onExit}
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              App
            </button>
          )}
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-6">
        <form
          onSubmit={handleLogin}
          className="premium-card w-full max-w-md space-y-6 p-8"
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600/20 text-brand-400">
              <Shield className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-bold text-white">Admin sign-in</h1>
            <p className="mt-2 text-sm text-slate-400">
              Enter your server-side admin secret. This is never stored in the app bundle — session only.
            </p>
          </div>

          <label className="block space-y-2">
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              <Lock className="h-3.5 w-3.5" />
              Admin API secret
            </span>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="ADMIN_API_SECRET from .env"
              autoComplete="off"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </label>

          <button
            type="submit"
            disabled={checking}
            className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white transition hover:bg-brand-500 disabled:opacity-60"
          >
            {checking ? 'Verifying…' : 'Access dashboard'}
          </button>

          <p className="text-center text-[11px] leading-relaxed text-slate-500">
            Requires <code className="text-slate-400">DATABASE_URL</code> and{' '}
            <code className="text-slate-400">ADMIN_API_SECRET</code> on the server. Run the activity migration in Supabase first.
          </p>
        </form>
      </main>
    </div>
  )
}
