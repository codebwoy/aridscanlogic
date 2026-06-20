import { useMemo, useState } from 'react'
import { ChevronLeft, HeartPulse, Landmark, Languages, Receipt, Settings, CalendarClock } from 'lucide-react'
import { loadTaxOverheadConfig } from '@/lib/taxvault/overheadConfig'
import { computeTaxVaultSummary } from '@/lib/taxCalculations'
import {
  KRANKENKASSE_DISCLAIMER_DE,
  KRANKENKASSE_DISCLAIMER_EN,
} from '@/lib/taxvault/krankenkasse'
import EstimatedTaxes from './EstimatedTaxes'

const STRUCTURE_LABELS = {
  freiberufler: { de: 'Freiberufler', en: 'Freelancer' },
  einzelunternehmer: { de: 'Einzelunternehmer', en: 'Sole trader' },
  kleinunternehmer: { de: 'Kleinunternehmer', en: 'Small business' },
  gbr: { de: 'GbR', en: 'GbR' },
  ug: { de: 'UG', en: 'UG' },
  gmbh: { de: 'GmbH', en: 'GmbH' },
}

const STATUS_LABELS = {
  not_started: { de: 'Nicht begonnen', en: 'Not started' },
  submitted: { de: 'Beantragt', en: 'Submitted' },
  confirmed: { de: 'Bestätigt', en: 'Confirmed' },
}

function ConfigRow({ label, value }) {
  if (!value && value !== 0) return null
  return (
    <div className="flex justify-between gap-2 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-200">{value}</span>
    </div>
  )
}

function daysUntil(dateStr) {
  if (!dateStr) return null
  const due = new Date(dateStr)
  return Math.ceil((due - new Date()) / 86400000)
}

export default function TaxOverheadHub({
  receipts = [],
  mileage = [],
  invoices = [],
  expectedProfit,
  onBack,
  onOpenSettings,
  onOpenBizStart,
}) {
  const [lang, setLang] = useState('de')
  const config = loadTaxOverheadConfig()
  const profit = expectedProfit ?? config.expectedProfitYear1 ?? 0

  const taxStats = useMemo(
    () =>
      computeTaxVaultSummary({
        expectedProfit: profit,
        receipts,
        mileage,
        invoices,
        hebesatz: config.hebesatz,
      }),
    [profit, receipts, mileage, invoices, config.hebesatz]
  )

  const health = config.healthEstimate
  const annualOverhead =
    (health.annualTotal || 0) +
    taxStats.gewerbesteuer +
    taxStats.einkommensteuer +
    Math.max(0, taxStats.umsatzsteuer)

  const disclaimer = lang === 'de' ? KRANKENKASSE_DISCLAIMER_DE : KRANKENKASSE_DISCLAIMER_EN
  const statusLabel = STATUS_LABELS[config.healthInsuranceStatus] || STATUS_LABELS.not_started
  const structureLabel =
    STRUCTURE_LABELS[config.businessStructure]?.[lang] || config.businessStructure || '—'
  const kvDays = config.krankenkasseDueDate ? daysUntil(config.krankenkasseDueDate) : null
  const kvUrgent = kvDays !== null && kvDays >= 0 && kvDays < 14

  return (
    <div className="w-full">
      <div className="safe-top mb-3 flex items-center justify-between">
        <button type="button" onClick={onBack} className="flex items-center gap-1 text-sm text-slate-400">
          <ChevronLeft className="h-4 w-4" /> Tax Vault
        </button>
        <button
          type="button"
          onClick={() => setLang(lang === 'en' ? 'de' : 'en')}
          className="flex items-center gap-1 rounded-lg bg-slate-800 px-2 py-1 text-xs"
        >
          <Languages className="h-3 w-3" /> {lang === 'en' ? 'DE' : 'EN'}
        </button>
      </div>

      <header className="mb-4">
        <h1 className="text-xl font-bold">
          {lang === 'de' ? 'Steuer-Overhead (Gewerbe)' : 'Tax overhead (Gewerbe)'}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {lang === 'de'
            ? 'Krankenkasse, Gewerbesteuer und Umsatzsteuer — Ihre Gewerbe-Konfiguration auf einen Blick.'
            : 'Health insurance, trade tax, and VAT — your Gewerbe configuration at a glance.'}
        </p>
      </header>

      <div className="mb-4 rounded-2xl bg-gradient-to-br from-brand-600/20 to-rose-600/10 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          {lang === 'de' ? 'Geschätzter Jahres-Overhead (Orientierung)' : 'Estimated annual overhead (guide)'}
        </p>
        <p className="mt-1 text-3xl font-bold">{annualOverhead.toLocaleString('de-DE')} €</p>
        <p className="mt-1 text-xs text-slate-500">
          {lang === 'de'
            ? 'KV + geschätzte Steuern — keine verbindliche Berechnung'
            : 'Health + estimated taxes — not a binding calculation'}
        </p>
      </div>

      {config.showKrankenkasseDeadline && config.krankenkasseDueDate && (
        <section
          className={`mb-4 rounded-2xl p-4 ${kvUrgent ? 'border border-amber-500/40 bg-amber-500/10' : 'bg-slate-800/60'}`}
        >
          <div className="flex items-start gap-2">
            <CalendarClock className={`mt-0.5 h-4 w-4 shrink-0 ${kvUrgent ? 'text-amber-400' : 'text-brand-400'}`} />
            <div>
              <p className="text-sm font-semibold">
                {lang === 'de'
                  ? 'Frist: Krankenkasse — Selbstständigkeit melden'
                  : 'Deadline: register self-employment with Krankenkasse'}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {lang === 'de' ? 'Fällig bis' : 'Due by'}: {config.krankenkasseDueDate}
                {kvDays !== null && (
                  <span className={kvDays < 0 ? ' text-red-400' : kvUrgent ? ' text-amber-300' : ''}>
                    {' '}
                    · {kvDays < 0
                      ? lang === 'de'
                        ? `${Math.abs(kvDays)} Tage überfällig`
                        : `${Math.abs(kvDays)} days overdue`
                      : lang === 'de'
                        ? `noch ${kvDays} Tage`
                        : `${kvDays} days left`}
                  </span>
                )}
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                {lang === 'de'
                  ? 'Melden Sie Ihre Selbstständigkeit bei der Krankenkasse (Gewerbe-/Finanzamt-Nachweis).'
                  : 'Notify your Krankenkasse of self-employment (submit Gewerbe/Finanzamt proof).'}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="mb-4 space-y-2 rounded-2xl bg-slate-800/60 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Settings className="h-4 w-4 text-slate-400" />
          <h2 className="font-semibold">{lang === 'de' ? 'Gewerbe-Konfiguration' : 'Business configuration'}</h2>
        </div>
        <ConfigRow label={lang === 'de' ? 'Rechtsform' : 'Structure'} value={structureLabel} />
        <ConfigRow
          label="USt"
          value={
            config.isKleinunternehmer
              ? lang === 'de'
                ? 'Kleinunternehmer §19'
                : 'Small business §19'
              : lang === 'de'
                ? 'Regelbesteuerung'
                : 'Standard VAT'
          }
        />
        <ConfigRow label={lang === 'de' ? 'Gewerbesteuer Hebesatz' : 'Trade tax Hebesatz'} value={config.hebesatz} />
        <ConfigRow label={lang === 'de' ? 'Steuernummer' : 'Tax number'} value={config.steuernummer} />
        <ConfigRow label="USt-IdNr." value={config.ustIdNr} />
        <ConfigRow
          label={lang === 'de' ? 'Erwarteter Gewinn (Jahr)' : 'Expected profit (year)'}
          value={config.expectedProfitYear1 ? `${config.expectedProfitYear1.toLocaleString('de-DE')} €` : null}
        />
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex-1 rounded-xl bg-slate-700 py-2 text-xs font-medium"
          >
            {lang === 'de' ? 'Einstellungen' : 'Settings'}
          </button>
          <button
            type="button"
            onClick={onOpenBizStart}
            className="flex-1 rounded-xl bg-brand-600/80 py-2 text-xs font-medium"
          >
            BizStart
          </button>
        </div>
      </section>

      <section className="mb-4 rounded-2xl bg-slate-800/60 p-4">
        <div className="mb-3 flex items-center gap-2">
          <HeartPulse className="h-4 w-4 text-rose-400" />
          <h2 className="font-semibold">Krankenkasse</h2>
        </div>
        <ConfigRow
          label={lang === 'de' ? 'Art' : 'Type'}
          value={
            config.healthInsuranceType === 'gkv'
              ? 'GKV'
              : config.healthInsuranceType === 'pkv'
                ? 'PKV'
                : config.healthInsuranceType === 'family'
                  ? lang === 'de'
                    ? 'Familienversicherung'
                    : 'Family insurance'
                  : lang === 'de'
                    ? 'Offen'
                    : 'Pending'
          }
        />
        <ConfigRow label={lang === 'de' ? 'Kasse' : 'Insurer'} value={config.healthInsurerName} />
        <ConfigRow label={lang === 'de' ? 'Status' : 'Status'} value={statusLabel[lang]} />
        {health.monthlyTotal > 0 && (
          <>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-sm text-slate-500">
                {lang === 'de' ? 'Monatsbeitrag (Schätzung)' : 'Monthly (estimate)'}
              </span>
              <span className="text-lg font-bold text-rose-300">
                {health.monthlyTotal.toLocaleString('de-DE')} €
              </span>
            </div>
            <p className="mt-2 text-[10px] leading-snug text-slate-500">{disclaimer}</p>
          </>
        )}
        {config.healthInsuranceStatus === 'not_started' && (
          <p className="mt-2 text-xs text-amber-300">
            {lang === 'de'
              ? 'Krankenkasse noch nicht konfiguriert — starten Sie BizStart oder öffnen Sie die Einstellungen.'
              : 'Health insurance not configured — use BizStart or Settings.'}
          </p>
        )}
      </section>

      <section className="mb-4">
        <div className="mb-2 flex items-center gap-2">
          <Landmark className="h-4 w-4 text-indigo-400" />
          <h2 className="font-semibold">{lang === 'de' ? 'Geschätzte Steuern' : 'Estimated taxes'}</h2>
        </div>
        <EstimatedTaxes
          receipts={receipts}
          mileage={mileage}
          invoices={invoices}
          expectedProfit={profit}
          hebesatz={config.hebesatz}
          lang={lang}
        />
      </section>

      <section className="rounded-2xl border border-slate-700/50 p-4 text-xs text-slate-500">
        <div className="mb-1 flex items-center gap-2 text-slate-400">
          <Receipt className="h-3 w-3" />
          <span className="font-medium">{lang === 'de' ? 'Hinweis' : 'Note'}</span>
        </div>
        {lang === 'de'
          ? 'Alle Werte dienen der Orientierung für Selbstständige (Gewerbe). Für verbindliche Beiträge und Steuern konsultieren Sie Krankenkasse und Steuerberater.'
          : 'All figures guide self-employed Gewerbe founders only. Consult your Krankenkasse and Steuerberater for binding amounts.'}
      </section>
    </div>
  )
}
