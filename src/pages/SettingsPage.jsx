import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Crown, User, Database, Receipt, ChevronRight, Sparkles, CloudUpload, BookOpen } from 'lucide-react'
import { useGuide } from '@/context/GuideContext'
import { useAiLanguage } from '@/context/AiLanguageContext'
import AiLanguageBar from '@/components/shared/AiLanguageBar'
import { checkDbConnected, isDbConnected } from '@/lib/supabase/remoteStore'
import { getApiSecret, setApiSecret } from '@/lib/apiFetch'
import { pushAllLocalDataToSupabase } from '@/lib/supabase/migrateLocal'
import { initAppStorage } from '@/lib/appApi'
import { isAnthropicConfigured, getAnthropicModel, refreshLlmStatus } from '@/lib/anthropic'
import { useAuth } from '@/context/AuthContext'
import { usePremium } from '@/context/PremiumContext'
import TaxVaultSettings from './taxvault/TaxVaultSettings'
import InstallPwaButton from '@/components/pwa/InstallPwaButton'
import BrandLogo from '@/components/shared/BrandLogo'
import { BRAND_SUITE_NAME } from '@/lib/brand'

export default function SettingsPage({ onOpenScanVault }) {
  const { user, supabaseReady, signIn, signUp, signOut } = useAuth()
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authBusy, setAuthBusy] = useState(false)
  const { isPremium, setModalOpen } = usePremium()
  const [taxVaultSettings, setTaxVaultSettings] = useState(false)
  const [llmReady, setLlmReady] = useState(isAnthropicConfigured())
  const [dbReady, setDbReady] = useState(isDbConnected())
  const [syncing, setSyncing] = useState(false)
  const [apiSecret, setApiSecretState] = useState(() => getApiSecret())
  const { openGuide } = useGuide()
  const { language, setLanguage } = useAiLanguage()

  useEffect(() => {
    refreshLlmStatus().then(() => setLlmReady(isAnthropicConfigured()))
    checkDbConnected().then(() => setDbReady(isDbConnected()))
  }, [])

  const pushToSupabase = async () => {
    setSyncing(true)
    try {
      await initAppStorage()
      if (!isDbConnected()) {
        toast.error('Supabase not connected. Add DATABASE_URL to .env and restart the dev server.')
        return
      }
      const results = await pushAllLocalDataToSupabase()
      const total = results.reduce((n, r) => n + (r.count || 0), 0)
      toast.success(`Pushed ${total} records to Supabase`)
      setDbReady(true)
    } catch (e) {
      toast.error(e.message || 'Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  if (taxVaultSettings) {
    return <TaxVaultSettings onBack={() => setTaxVaultSettings(false)} />
  }

  return (
    <div className="w-full">
      <header className="safe-top mb-6">
        <h1 className="text-2xl font-bold">Einstellungen</h1>
      </header>

      <div className="space-y-3">
        <AiLanguageBar language={language} onChange={setLanguage} />

        <button
          type="button"
          onClick={() => openGuide('docs')}
          className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-indigo-900/80 via-brand-900/60 to-slate-800 p-4"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="h-7 w-7 text-brand-300" />
            <div className="text-left">
              <p className="font-semibold">
                {language === 'en' ? 'App Guide & AI Tour' : 'App-Guide & KI-Tour'}
              </p>
              <p className="text-xs text-slate-400">
                {language === 'en'
                  ? 'What Docs, Tax Vault, DocDraft, Contracts & more do'
                  : 'Was Docs, Tax Vault, DocDraft, Contracts & mehr leisten'}
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-brand-400" />
        </button>

        <InstallPwaButton />

        <div className="flex items-center gap-4 rounded-2xl bg-slate-800/80 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600/30">
            <User className="h-6 w-6 text-brand-400" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium">{user?.name || 'Benutzer'}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
            {user?.mode === 'supabase' && (
              <p className="text-xs text-emerald-400">Supabase angemeldet</p>
            )}
          </div>
          {user?.mode === 'supabase' && (
            <button
              type="button"
              onClick={() => signOut().then(() => toast.success('Abgemeldet'))}
              className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs"
            >
              Abmelden
            </button>
          )}
        </div>

        {supabaseReady && user?.mode !== 'supabase' && (
          <div className="rounded-2xl bg-slate-800/60 p-4">
            <p className="mb-2 text-sm font-medium text-slate-300">Cloud-Konto (Supabase)</p>
            <label className="mb-2 block text-xs text-slate-400" htmlFor="auth-email">
              E-Mail
            </label>
            <input
              id="auth-email"
              type="email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              className="mb-2 w-full rounded-xl bg-slate-900 px-3 py-2 text-sm"
              autoComplete="email"
            />
            <label className="mb-2 block text-xs text-slate-400" htmlFor="auth-password">
              Passwort
            </label>
            <input
              id="auth-password"
              type="password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              className="mb-3 w-full rounded-xl bg-slate-900 px-3 py-2 text-sm"
              autoComplete="current-password"
            />
            <div className="flex gap-2">
              <button
                type="button"
                disabled={authBusy}
                onClick={async () => {
                  setAuthBusy(true)
                  try {
                    await signIn(authEmail, authPassword)
                    toast.success('Angemeldet')
                  } catch (e) {
                    toast.error(e.message || 'Anmeldung fehlgeschlagen')
                  } finally {
                    setAuthBusy(false)
                  }
                }}
                className="flex-1 rounded-xl bg-brand-600 py-2 text-sm font-semibold disabled:opacity-50"
              >
                Anmelden
              </button>
              <button
                type="button"
                disabled={authBusy}
                onClick={async () => {
                  setAuthBusy(true)
                  try {
                    await signUp(authEmail, authPassword)
                    toast.success('Konto erstellt — E-Mail bestätigen falls erforderlich')
                  } catch (e) {
                    toast.error(e.message || 'Registrierung fehlgeschlagen')
                  } finally {
                    setAuthBusy(false)
                  }
                }}
                className="flex-1 rounded-xl border border-slate-600 py-2 text-sm"
              >
                Registrieren
              </button>
            </div>
          </div>
        )}

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
            <Sparkles className="h-4 w-4" />
            Anthropic Claude
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {llmReady
              ? `Active — ${getAnthropicModel()}. API key stays on the server (not in the browser).`
              : 'Not configured. Add ANTHROPIC_API_KEY to .env and restart the dev server.'}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-800/60 p-4">
          <p className="text-sm text-slate-400">Remote API access (LAN dev)</p>
          <p className="mt-1 text-xs text-slate-500">
            Only needed with <code className="text-slate-400">npm run dev:lan</code>. Set{' '}
            <code className="text-slate-400">SCANLOGIC_API_SECRET</code> in .env, then paste the same
            value here (stored in this tab&apos;s session only).
          </p>
          <input
            type="password"
            autoComplete="off"
            value={apiSecret}
            onChange={(e) => {
              setApiSecretState(e.target.value)
              setApiSecret(e.target.value)
            }}
            placeholder="SCANLOGIC_API_SECRET"
            className="mt-3 w-full rounded-xl border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm"
          />
        </div>

        <div className="rounded-2xl bg-slate-800/60 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Database className="h-4 w-4" />
            Supabase PostgreSQL
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {dbReady
              ? 'Connected. New saves go to Supabase (server proxy). Credentials stay in .env only.'
              : 'Not connected. Set DATABASE_URL in .env and restart npm run dev.'}
          </p>
          <button
            type="button"
            disabled={syncing}
            onClick={pushToSupabase}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-sm font-medium disabled:opacity-50"
          >
            <CloudUpload className="h-4 w-4" />
            {syncing ? 'Pushing…' : 'Push local data to Supabase'}
          </button>
        </div>

        <div className="flex items-start gap-3 rounded-2xl bg-slate-800/40 p-4 text-xs text-slate-500">
          <BrandLogo size={36} className="shrink-0" />
          <p>
            {BRAND_SUITE_NAME} v1.0 — Steuer- und Rechtsangaben sind vereinfachte Schätzungen,
            keine professionelle Beratung.
          </p>
        </div>
      </div>
    </div>
  )
}
