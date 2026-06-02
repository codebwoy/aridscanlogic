import { useState } from 'react'
import { ChevronRight, Crown, LogOut, Trash2, Cloud, Download, Upload } from 'lucide-react'
import { toast } from 'sonner'
import {
  getSettings,
  saveSettings,
  listDocuments,
  deleteDocument,
  clearSessionUser,
} from '@/lib/scanvault/store'
import { isPremiumUser, canCloudSync } from '@/lib/scanvault/limits'
import { exportScanVaultBackup, importScanVaultBackup } from '@/lib/scanvault/backup'
import { syncToCloud, pullFromCloud, getLastSyncTime } from '@/lib/scanvault/cloudSync'

export default function ScanVaultSettings({
  user,
  onProfile,
  onUpgrade,
  onLogout,
  onOpenBusinessSuite,
}) {
  const [settings, setSettings] = useState(getSettings())
  const [syncing, setSyncing] = useState(false)
  const premium = isPremiumUser(user)
  const lastSync = getLastSyncTime()

  const patch = (p) => {
    const next = saveSettings(p)
    setSettings(next)
    toast.success('Saved')
  }

  const clearAll = () => {
    if (!window.confirm('Delete ALL scans? This cannot be undone.')) return
    if (window.prompt('Type DELETE to confirm') !== 'DELETE') return
    listDocuments().forEach((d) => deleteDocument(d.id))
    toast.success('All scans cleared')
  }

  const handleSync = async () => {
    if (!canCloudSync(user)) {
      onUpgrade?.()
      return
    }
    setSyncing(true)
    try {
      const at = await syncToCloud(user)
      toast.success(`Synced at ${new Date(at).toLocaleString()}`)
    } catch {
      toast.error('Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  const handlePull = async () => {
    if (!canCloudSync(user)) {
      onUpgrade?.()
      return
    }
    if (!window.confirm('Restore from last cloud snapshot? Local changes may be overwritten.')) return
    setSyncing(true)
    try {
      const at = await pullFromCloud(user)
      toast.success(`Restored from ${new Date(at).toLocaleString()}`)
    } catch (e) {
      toast.error(e.message || 'Restore failed')
    } finally {
      setSyncing(false)
    }
  }

  const importRef = (input) => {
    if (!input?.files?.[0]) return
    importScanVaultBackup(input.files[0])
      .then((n) => toast.success(`Imported ${n} document(s)`))
      .catch((e) => toast.error(e.message))
    input.value = ''
  }

  return (
    <div className="px-4 pb-4">
      <h1 className="safe-top mb-4 text-2xl font-bold">Settings</h1>

      <section className="mb-4 rounded-2xl bg-white/5 p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-400">Account</h2>
        <button
          type="button"
          onClick={onProfile}
          className="flex min-h-[48px] w-full items-center justify-between"
        >
          <div className="text-left">
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-500" />
        </button>
        <div className="mt-2 flex items-center justify-between rounded-xl bg-black/30 p-3">
          <span className="text-sm">{premium ? 'Premium' : 'Free'}</span>
          {!premium && (
            <button
              type="button"
              onClick={onUpgrade}
              className="flex items-center gap-1 rounded-lg bg-[#007AFF] px-3 py-1 text-xs font-medium"
            >
              <Crown className="h-3 w-3" /> Upgrade
            </button>
          )}
        </div>
        {canCloudSync(user) ? (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-slate-500">
              {lastSync ? `Last sync: ${new Date(lastSync).toLocaleString()}` : 'Not synced yet'}
            </p>
            <button
              type="button"
              disabled={syncing}
              onClick={handleSync}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#007AFF]/40 py-2 text-sm text-[#007AFF]"
            >
              <Cloud className="h-4 w-4" /> {syncing ? 'Syncing…' : 'Sync now'}
            </button>
            <button
              type="button"
              disabled={syncing}
              onClick={handlePull}
              className="w-full rounded-xl bg-white/10 py-2 text-xs text-slate-400"
            >
              Restore from cloud snapshot
            </button>
          </div>
        ) : (
          <p className="mt-2 text-xs text-slate-500">Cloud sync requires Premium</p>
        )}
      </section>

      <section className="mb-4 space-y-3 rounded-2xl bg-white/5 p-4">
        <h2 className="text-sm font-semibold text-slate-400">Scanner</h2>
        <label className="block text-xs text-slate-500">
          Default filter
          <select
            value={settings.defaultFilter}
            onChange={(e) => patch({ defaultFilter: e.target.value })}
            className="mt-1 w-full rounded-lg bg-black/30 px-3 py-2 text-sm"
          >
            {['auto', 'bw', 'grayscale', 'color', 'photo'].map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center justify-between text-sm">
          Auto-capture when edges detected
          <input
            type="checkbox"
            checked={settings.autoCapture}
            onChange={(e) => patch({ autoCapture: e.target.checked })}
          />
        </label>
        <label className="block text-xs text-slate-500">
          OCR language
          <select
            value={settings.ocrLanguage}
            onChange={(e) => patch({ ocrLanguage: e.target.value })}
            className="mt-1 w-full rounded-lg bg-black/30 px-3 py-2 text-sm"
          >
            <option value="eng">English</option>
            <option value="deu">German</option>
            <option value="fra">French</option>
            <option value="spa">Spanish</option>
            <option value="ara">Arabic</option>
          </select>
        </label>
      </section>

      <section className="mb-4 space-y-2 rounded-2xl bg-white/5 p-4">
        <h2 className="text-sm font-semibold text-slate-400">Storage</h2>
        <p className="text-xs text-slate-500">
          Used: {((user?.storageUsedBytes || 0) / 1024 / 1024).toFixed(2)} MB · {user?.scanCount || 0}{' '}
          scans
        </p>
        <button
          type="button"
          onClick={() => exportScanVaultBackup().then(() => toast.success('Backup ZIP downloaded'))}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-2 text-sm"
        >
          <Download className="h-4 w-4" /> Export full backup (ZIP)
        </button>
        <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white/10 py-2 text-sm">
          <Upload className="h-4 w-4" /> Import backup
          <input type="file" accept=".zip" className="hidden" onChange={(e) => importRef(e.target)} />
        </label>
        <button
          type="button"
          onClick={clearAll}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/40 py-2 text-sm text-red-400"
        >
          <Trash2 className="h-4 w-4" /> Clear all scans
        </button>
      </section>

      {onOpenBusinessSuite && (
        <button
          type="button"
          onClick={onOpenBusinessSuite}
          className="mb-4 w-full rounded-xl border border-white/10 py-3 text-sm"
        >
          Open ScanLogic Business Suite
        </button>
      )}

      <button
        type="button"
        onClick={() => {
          clearSessionUser()
          onLogout?.()
        }}
        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-white/5 text-red-400"
      >
        <LogOut className="h-5 w-5" /> Sign out
      </button>

      <p className="mt-6 text-center text-xs text-slate-600">ScanVault v1.1</p>
    </div>
  )
}
