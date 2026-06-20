import { Download, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { loadSettings, saveSettings, saveProfile } from '@/lib/docdraft/store'
import { TEMPLATES } from '@/lib/docdraft/constants'
import { DOC_LANGUAGES } from '@/lib/docdraft/documentI18n'
import { exportDocDraftBackup, importDocDraftBackup } from '@/lib/docdraft/backup'
import DocumentBrandingToggle, { useDocumentBranding } from '@/components/shared/DocumentBrandingToggle'

export default function DocDraftSettings({ profile, onBack, onChanged }) {
  const settings = loadSettings()
  const { includeBranding, setIncludeBranding } = useDocumentBranding()

  return (
    <div className="w-full">
      <button type="button" onClick={onBack} className="safe-top mb-4 text-sm text-slate-400">
        ← Back
      </button>
      <h2 className="mb-4 text-lg font-bold">DocDraft Settings</h2>
      <div className="space-y-4">
        <DocumentBrandingToggle checked={includeBranding} onChange={setIncludeBranding} />
        <label className="premium-card flex items-center justify-between p-4">
          <span className="text-sm">GoBD compliance mode</span>
          <input
            type="checkbox"
            checked={settings.gobdMode !== false}
            onChange={(e) => saveSettings({ gobdMode: e.target.checked })}
          />
        </label>
        <label className="premium-card flex items-center justify-between p-4">
          <span className="text-sm">Auto payment reminders</span>
          <input
            type="checkbox"
            checked={!!settings.autoReminders}
            onChange={(e) => saveSettings({ autoReminders: e.target.checked })}
          />
        </label>
        <label className="premium-card block p-4">
          <span className="text-sm">Default document language</span>
          <select
            value={profile?.defaultLanguage || 'de'}
            onChange={(e) => {
              saveProfile({ ...profile, defaultLanguage: e.target.value })
              toast.success('Saved')
              onChanged?.()
            }}
            className="mt-2 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
          >
            {DOC_LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
        <div className="premium-card p-4 text-sm">
          <p className="mb-2 text-slate-400">Default template</p>
          <p>{TEMPLATES.find((t) => t.id === profile?.defaultTemplateId)?.name || 'Classic'}</p>
        </div>
        <div className="premium-card p-4 text-xs text-slate-500">
          <p className="mb-2 font-semibold text-slate-400">Numbering format</p>
          <p>{profile?.invoiceFormat || 'RE-{YEAR}-{NUMBER}'}</p>
          <p className="mt-2">Next invoice: {profile?.sequences?.invoice}</p>
        </div>
        <p className="text-[10px] text-slate-600">
          German law requires keeping invoices for 10 years (GoBD). Finalized documents have delete
          protection.
        </p>
        <button
          type="button"
          onClick={() => exportDocDraftBackup().then(() => toast.success('Backup downloaded'))}
          className="premium-card flex w-full items-center justify-center gap-2 p-4 text-sm"
        >
          <Download className="h-4 w-4" /> Export backup (ZIP)
        </button>
        <label className="premium-card flex w-full cursor-pointer items-center justify-center gap-2 p-4 text-sm">
          <Upload className="h-4 w-4" /> Import backup
          <input
            type="file"
            accept=".zip"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (!f) return
              importDocDraftBackup(f)
                .then((n) => {
                  toast.success(`Imported ${n} documents`)
                  onChanged?.()
                })
                .catch((err) => toast.error(err.message))
              e.target.value = ''
            }}
          />
        </label>
      </div>
    </div>
  )
}
