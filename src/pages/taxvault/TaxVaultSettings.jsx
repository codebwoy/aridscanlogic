import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'
import appApi from '@/lib/appApi'
import {
  loadTaxVaultProfile,
  saveTaxVaultProfile,
  loadTaxVaultSettings,
  saveTaxVaultSettings,
} from '@/lib/taxvault/profile'
import { getAllCategories } from '@/lib/taxvault/categories'
import { exportEncryptedBackup, importEncryptedBackup } from '@/lib/taxvault/backup'

export default function TaxVaultSettings({ onBack }) {
  const [profile, setProfile] = useState(loadTaxVaultProfile())
  const [settings, setSettings] = useState(loadTaxVaultSettings())
  const [resetConfirm, setResetConfirm] = useState('')
  const [backupPass, setBackupPass] = useState('')
  const [importPass, setImportPass] = useState('')

  const saveProfile = () => {
    saveTaxVaultProfile(profile)
    toast.success('Profile saved')
  }

  const saveSettings = () => {
    saveTaxVaultSettings(settings)
    toast.success('Settings saved')
  }

  const resetVault = async () => {
    if (resetConfirm !== 'DELETE') {
      toast.error('Type DELETE to confirm')
      return
    }
    try {
      const receipts = await appApi.entities.Receipt.list()
      for (const r of receipts) {
        await appApi.entities.Receipt.delete(r.id)
      }
      toast.success('Tax Vault data cleared')
      setResetConfirm('')
    } catch {
      toast.error('Reset failed')
    }
  }

  const categories = getAllCategories()

  return (
    <div className="w-full">
      <button type="button" onClick={onBack} className="safe-top mb-3 flex items-center gap-1 text-sm text-slate-400">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      <h2 className="mb-4 text-xl font-bold">Tax Vault Settings</h2>

      <section className="mb-6 space-y-2 rounded-2xl bg-slate-800/60 p-4">
        <h3 className="font-semibold">Business profile</h3>
        {['businessName', 'ownerName', 'taxId', 'vatNumber', 'address', 'accountantEmail'].map((key) => (
          <label key={key} className="block">
            <span className="text-xs text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            <input
              value={profile[key] || ''}
              onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
              className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
            />
          </label>
        ))}
        <button type="button" onClick={saveProfile} className="w-full rounded-xl bg-brand-600 py-2 text-sm font-semibold">
          Save profile
        </button>
      </section>

      <section className="mb-6 space-y-3 rounded-2xl bg-slate-800/60 p-4">
        <h3 className="font-semibold">Preferences</h3>
        <label className="block">
          <span className="text-xs text-slate-400">Home currency</span>
          <select
            value={profile.homeCurrency}
            onChange={(e) => setProfile({ ...profile, homeCurrency: e.target.value })}
            className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
          >
            {['EUR', 'USD', 'GBP', 'CHF'].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs text-slate-400">Mileage rate (per km)</span>
          <input
            type="number"
            step="0.01"
            value={settings.mileageRatePerKm}
            onChange={(e) =>
              setSettings({ ...settings, mileageRatePerKm: parseFloat(e.target.value) })
            }
            className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs text-slate-400">Default category</span>
          <select
            value={settings.defaultCategory}
            onChange={(e) => setSettings({ ...settings, defaultCategory: e.target.value })}
            className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
          >
            {categories.map((c) => (
              <option key={c.id || c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center justify-between text-sm">
          <span>Auto OCR on scan</span>
          <input
            type="checkbox"
            checked={settings.autoOcr}
            onChange={(e) => setSettings({ ...settings, autoOcr: e.target.checked })}
          />
        </label>
        <label className="flex items-center justify-between text-sm">
          <span>Recurring reminders</span>
          <input
            type="checkbox"
            checked={settings.recurringReminders}
            onChange={(e) => setSettings({ ...settings, recurringReminders: e.target.checked })}
          />
        </label>
        <button type="button" onClick={saveSettings} className="w-full rounded-xl bg-brand-600 py-2 text-sm font-semibold">
          Save settings
        </button>
      </section>

      <section className="mb-6 space-y-2 rounded-2xl bg-slate-800/60 p-4">
        <h3 className="font-semibold">Encrypted backup</h3>
        <p className="text-xs text-slate-500">Export or restore all receipts, mileage, and profile (AES-256).</p>
        <input
          type="password"
          placeholder="Passphrase (min 8 chars)"
          value={backupPass}
          onChange={(e) => setBackupPass(e.target.value)}
          className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={async () => {
            try {
              await exportEncryptedBackup(backupPass)
              toast.success('Backup downloaded')
            } catch (e) {
              toast.error(e.message)
            }
          }}
          className="w-full rounded-xl bg-slate-700 py-2 text-sm"
        >
          Export encrypted backup
        </button>
        <input
          type="file"
          accept=".tvbackup"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file || !importPass) return
            try {
              await importEncryptedBackup(file, importPass)
              toast.success('Backup restored')
            } catch {
              toast.error('Import failed — check passphrase')
            }
          }}
          className="w-full text-xs"
        />
        <input
          type="password"
          placeholder="Passphrase for import"
          value={importPass}
          onChange={(e) => setImportPass(e.target.value)}
          className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
        />
      </section>

      <section className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4">
        <h3 className="font-semibold text-red-400">Reset Tax Vault</h3>
        <p className="mt-1 text-xs text-slate-500">Deletes all receipts. Type DELETE to confirm.</p>
        <input
          value={resetConfirm}
          onChange={(e) => setResetConfirm(e.target.value)}
          placeholder="DELETE"
          className="mt-2 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={resetVault}
          className="mt-2 w-full rounded-xl border border-red-500 py-2 text-sm text-red-400"
        >
          Delete all receipts
        </button>
      </section>
    </div>
  )
}
