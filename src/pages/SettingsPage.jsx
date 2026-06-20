import { useState } from 'react'
import { toast } from 'sonner'
import { Crown, User, Receipt, ChevronRight, BookOpen, Shield } from 'lucide-react'
import { useGuide } from '@/context/GuideContext'
import { useAiLanguage } from '@/context/AiLanguageContext'
import AiLanguageBar from '@/components/shared/AiLanguageBar'
import { useAuth } from '@/context/AuthContext'
import { usePremium } from '@/context/PremiumContext'
import TaxVaultSettings from './taxvault/TaxVaultSettings'
import InstallPwaButton from '@/components/pwa/InstallPwaButton'
import DocumentBrandingToggle, { useDocumentBranding } from '@/components/shared/DocumentBrandingToggle'
import BrandLogo from '@/components/shared/BrandLogo'
import { BRAND_SUITE_NAME } from '@/lib/brand'

function SettingsRow({ icon: Icon, iconClass, title, subtitle, onClick, trailing }) {
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl bg-slate-800/80 p-4 text-left ${onClick ? 'transition hover:bg-slate-800' : ''}`}
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900/60 ${iconClass || ''}`}>
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-slate-100">{title}</p>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
      {trailing || (onClick && <ChevronRight className="h-5 w-5 shrink-0 text-slate-500" aria-hidden />)}
    </Comp>
  )
}

export default function SettingsPage({ onOpenScanVault }) {
  const { user, supabaseReady, signIn, signUp, signOut } = useAuth()
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authBusy, setAuthBusy] = useState(false)
  const { isPremium, setModalOpen } = usePremium()
  const [taxVaultSettings, setTaxVaultSettings] = useState(false)
  const { openGuide } = useGuide()
  const { language, setLanguage } = useAiLanguage()
  const { includeBranding, setIncludeBranding } = useDocumentBranding()
  const de = language === 'de'

  if (taxVaultSettings) {
    return <TaxVaultSettings onBack={() => setTaxVaultSettings(false)} />
  }

  return (
    <div className="w-full pb-8">
      <header className="safe-top mb-6">
        <h1 className="text-2xl font-bold text-slate-50">{de ? 'Einstellungen' : 'Settings'}</h1>
        <p className="mt-1 text-sm text-slate-400">
          {de ? 'Profil, Module & App-Einstellungen' : 'Profile, modules & app preferences'}
        </p>
      </header>

      <div className="space-y-6">
        <section>
          <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {de ? 'Allgemein' : 'General'}
          </p>
          <div className="space-y-2">
            <AiLanguageBar language={language} onChange={setLanguage} />
            <DocumentBrandingToggle checked={includeBranding} onChange={setIncludeBranding} />
            <InstallPwaButton />
          </div>
        </section>

        <section>
          <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {de ? 'Hilfe' : 'Help'}
          </p>
          <button
            type="button"
            onClick={() => openGuide('docs')}
            className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-indigo-900/80 via-brand-900/60 to-slate-800 p-4 text-left transition hover:from-indigo-900 hover:to-slate-800"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="h-7 w-7 text-brand-300" aria-hidden />
              <div>
                <p className="font-semibold text-slate-100">
                  {de ? 'App-Guide & KI-Tour' : 'App guide & AI tour'}
                </p>
                <p className="text-xs text-slate-400">
                  {de
                    ? 'Docs, Tax Vault, DocDraft, Contracts & mehr'
                    : 'Docs, Tax Vault, DocDraft, Contracts & more'}
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-brand-400" aria-hidden />
          </button>
        </section>

        <section>
          <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {de ? 'Konto' : 'Account'}
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-4 rounded-2xl bg-slate-800/80 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600/30">
                <User className="h-6 w-6 text-brand-400" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-100">{user?.name || (de ? 'Benutzer' : 'User')}</p>
                <p className="truncate text-sm text-slate-400">{user?.email || (de ? 'Lokal auf diesem Gerät' : 'Local on this device')}</p>
                {user?.mode === 'supabase' && (
                  <p className="mt-0.5 text-xs text-emerald-400">
                    {de ? 'Cloud-Konto aktiv' : 'Cloud account active'}
                  </p>
                )}
              </div>
              {user?.mode === 'supabase' && (
                <button
                  type="button"
                  onClick={() => signOut().then(() => toast.success(de ? 'Abgemeldet' : 'Signed out'))}
                  className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-600"
                >
                  {de ? 'Abmelden' : 'Sign out'}
                </button>
              )}
            </div>

            {supabaseReady && user?.mode !== 'supabase' && (
              <div className="rounded-2xl border border-slate-700/80 bg-slate-800/60 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-brand-400" aria-hidden />
                  <p className="text-sm font-medium text-slate-200">
                    {de ? 'Cloud-Konto (optional)' : 'Cloud account (optional)'}
                  </p>
                </div>
                <p className="mb-3 text-xs text-slate-500">
                  {de
                    ? 'Melden Sie sich an, um Daten geräteübergreifend zu synchronisieren.'
                    : 'Sign in to sync your data across devices.'}
                </p>
                <label className="mb-1.5 block text-xs text-slate-400" htmlFor="auth-email">
                  E-Mail
                </label>
                <input
                  id="auth-email"
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="mb-3 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2.5 text-sm text-slate-100"
                  autoComplete="email"
                />
                <label className="mb-1.5 block text-xs text-slate-400" htmlFor="auth-password">
                  {de ? 'Passwort' : 'Password'}
                </label>
                <input
                  id="auth-password"
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="mb-3 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2.5 text-sm text-slate-100"
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
                        toast.success(de ? 'Angemeldet' : 'Signed in')
                      } catch (e) {
                        toast.error(e.message || (de ? 'Anmeldung fehlgeschlagen' : 'Sign-in failed'))
                      } finally {
                        setAuthBusy(false)
                      }
                    }}
                    className="flex-1 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {de ? 'Anmelden' : 'Sign in'}
                  </button>
                  <button
                    type="button"
                    disabled={authBusy}
                    onClick={async () => {
                      setAuthBusy(true)
                      try {
                        await signUp(authEmail, authPassword)
                        toast.success(
                          de
                            ? 'Konto erstellt — ggf. E-Mail bestätigen'
                            : 'Account created — confirm email if required'
                        )
                      } catch (e) {
                        toast.error(e.message || (de ? 'Registrierung fehlgeschlagen' : 'Sign-up failed'))
                      } finally {
                        setAuthBusy(false)
                      }
                    }}
                    className="flex-1 rounded-xl border border-slate-600 py-2.5 text-sm font-medium text-slate-200 disabled:opacity-50"
                  >
                    {de ? 'Registrieren' : 'Register'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section>
          <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {de ? 'Module' : 'Modules'}
          </p>
          <div className="space-y-2">
            {onOpenScanVault && (
              <SettingsRow
                icon={Receipt}
                iconClass="text-[#007AFF]"
                title="ScanVault"
                subtitle={de ? 'Fokussierter Dokumenten-Scanner' : 'Focused document scanner'}
                onClick={onOpenScanVault}
              />
            )}
            <SettingsRow
              icon={Receipt}
              iconClass="text-brand-400"
              title={de ? 'Tax Vault' : 'Tax Vault'}
              subtitle={de ? 'Geschäftsprofil, OCR & Fahrtenbuch' : 'Business profile, OCR & mileage'}
              onClick={() => setTaxVaultSettings(true)}
            />
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-brand-900/80 to-slate-800 p-4 text-left transition hover:from-brand-900"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">
                <Crown className="h-5 w-5 text-amber-400" aria-hidden />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-100">ScanLogic Premium</p>
                <p className="text-xs text-slate-400">
                  {isPremium ? (de ? 'Aktiv' : 'Active') : de ? '14 Tage kostenlos testen' : '14-day free trial'}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-500" aria-hidden />
            </button>
          </div>
        </section>

        <footer className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs leading-relaxed text-slate-500">
          <BrandLogo size={36} className="shrink-0" />
          <p>
            {BRAND_SUITE_NAME} v1.0 —{' '}
            {de
              ? 'Steuer- und Rechtsangaben sind vereinfachte Schätzungen, keine professionelle Beratung.'
              : 'Tax and legal information are simplified estimates, not professional advice.'}
          </p>
        </footer>
      </div>
    </div>
  )
}
