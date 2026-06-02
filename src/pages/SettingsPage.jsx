import { useState } from 'react'
import { Crown, User, Database, Info, Receipt, ChevronRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { usePremium } from '@/context/PremiumContext'
import TaxVaultSettings from './taxvault/TaxVaultSettings'

export default function SettingsPage({ onOpenScanVault }) {
  const { user } = useAuth()
  const { isPremium, setModalOpen } = usePremium()
  const [taxVaultSettings, setTaxVaultSettings] = useState(false)

  if (taxVaultSettings) {
    return <TaxVaultSettings onBack={() => setTaxVaultSettings(false)} />
  }

  return (
    <div className="px-4 pb-4">
      <header className="safe-top mb-6">
        <h1 className="text-2xl font-bold">Einstellungen</h1>
      </header>

      <div className="space-y-3">
        <div className="flex items-center gap-4 rounded-2xl bg-slate-800/80 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600/30">
            <User className="h-6 w-6 text-brand-400" />
          </div>
          <div>
            <p className="font-medium">{user?.name || 'Benutzer'}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>

        {onOpenScanVault && (
          <button
            type="button"
            onClick={onOpenScanVault}
            className="flex w-full items-center justify-between rounded-2xl bg-slate-800/80 p-4"
          >
            <div className="flex items-center gap-3">
              <Receipt className="h-6 w-6 text-[#007AFF]" />
              <div className="text-left">
                <p className="font-medium">ScanVault</p>
                <p className="text-xs text-slate-400">Document scanner app</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-500" />
          </button>
        )}

        <button
          type="button"
          onClick={() => setTaxVaultSettings(true)}
          className="flex w-full items-center justify-between rounded-2xl bg-slate-800/80 p-4"
        >
          <div className="flex items-center gap-3">
            <Receipt className="h-6 w-6 text-brand-400" />
            <div className="text-left">
              <p className="font-medium">Tax Vault Settings</p>
              <p className="text-xs text-slate-400">Business profile, OCR, mileage</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-500" />
        </button>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-brand-900/80 to-slate-800 p-4"
        >
          <div className="flex items-center gap-3">
            <Crown className="h-6 w-6 text-amber-400" />
            <div className="text-left">
              <p className="font-medium">ScanLogic Premium</p>
              <p className="text-xs text-slate-400">
                {isPremium ? 'Aktiv' : '14 Tage testen'}
              </p>
            </div>
          </div>
        </button>

        <div className="rounded-2xl bg-slate-800/60 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Database className="h-4 w-4" />
            Base44 SDK
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Ohne API-Keys läuft die App im Demo-Modus mit localStorage. Setzen Sie
            VITE_BASE44_* in .env für Live-Daten.
          </p>
        </div>

        <div className="flex items-start gap-2 rounded-2xl bg-slate-800/40 p-4 text-xs text-slate-500">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            ScanLogic AI & Business Suite v1.0 — Steuer- und Rechtsangaben sind
            vereinfachte Schätzungen, keine professionelle Beratung.
          </p>
        </div>
      </div>
    </div>
  )
}
