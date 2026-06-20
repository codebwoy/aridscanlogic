import { useState, useEffect, useMemo } from 'react'
import { FileText, Shield, FileSignature, ChevronRight, Download, Copy, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { buildLegalProfile } from '@/lib/legal/profile'
import { loadLegalData, saveQuestionnaire, saveDrafts } from '@/lib/legal/store'
import { generateImpressum, generateDatenschutz, generateAvv, generateAllDrafts } from '@/lib/legal/generators'
import {
  exportLegalDraftMarkdown,
  exportLegalDraftHtml,
  exportLegalDraftPdf,
  exportAllLegalDraftsSeparate,
  exportAllLegalDraftsCombined,
  exportAllLegalDraftsZip,
} from '@/lib/legal/export'
import { getNextStepId } from '@/lib/bizstart/steps'
import { syncLegalToDocDraft } from '@/lib/legal/sync'
import SafeMarkdown from '@/components/SafeMarkdown'

const PHASES = ['impressum', 'datenschutz', 'avv']

const PHASE_META = {
  de: {
    impressum: { title: 'Impressum', icon: FileText, desc: 'Pflichtangaben für den Website-Footer (§ 5 DDG)' },
    datenschutz: { title: 'Datenschutzerklärung', icon: Shield, desc: 'DSGVO-konforme Datenschutzseite vorbereiten' },
    avv: { title: 'AVV', icon: FileSignature, desc: 'Auftragsverarbeitungsvertrag mit Kunden oder Dienstleistern' },
    disclaimer:
      'Entwürfe zur Vorbereitung — keine Rechtsberatung. Vor Veröffentlichung oder Unterzeichnung einen Rechtsanwalt konsultieren.',
    generate: 'Entwurf erstellen',
    next: 'Weiter',
    back: 'Zurück',
    done: 'Fertig — weiter',
    copy: 'Kopieren',
    exportMd: 'Markdown',
    exportHtml: 'HTML',
    exportPdf: 'PDF',
    confirm: 'Geprüft — Entwurf gespeichert',
    website: 'Website-URL',
    contactForm: 'Kontaktformular auf der Website',
    newsletter: 'Newsletter / E-Mail-Marketing',
    analytics: 'Webanalyse (z. B. Google Analytics, Plausible)',
    analyticsProvider: 'Analyse-Anbieter',
    cookies: 'Marketing- / Tracking-Cookies',
    hosting: 'Hosting-Anbieter',
    email: 'E-Mail-Anbieter',
    aiApi: 'KI-API (z. B. OpenAI, Anthropic)',
    aiProvider: 'KI-Anbieter',
    payment: 'Zahlungsdienstleister',
    paymentProvider: 'Zahlungsanbieter',
    webAgency: 'Ich baue/hoste Websites für Kunden (Web-Agentur)',
    clientCompany: 'Kundenfirma (Auftraggeber)',
    clientContact: 'Kunden-Ansprechpartner',
    clientEmail: 'Kunden-E-Mail',
    clientAddress: 'Kunden-Adresse',
    processingPurpose: 'Verarbeitungszweck',
    preview: 'Vorschau',
    exportThis: 'Dieses Dokument',
    exportSeparate: 'Alle 3 einzeln herunterladen',
    exportCombined: 'Alle 3 in einer Datei',
    exportZip: 'Alle 3 als ZIP',
    exportSeparateHint: '3 separate Dateien (Impressum, Datenschutz, AVV)',
    exportCombinedHint: 'Eine Datei mit allen drei Abschnitten',
    exportZipHint: 'ZIP-Archiv mit je einer Datei pro Dokument',
    exportAll: 'Alle Entwürfe exportieren',
    toContracts: 'In Contracts öffnen',
  },
  en: {
    impressum: { title: 'Imprint (Impressum)', icon: FileText, desc: 'Mandatory footer page (§ 5 DDG)' },
    datenschutz: { title: 'Privacy Policy', icon: Shield, desc: 'Prepare a GDPR-compliant privacy page' },
    avv: { title: 'DPA (AVV)', icon: FileSignature, desc: 'Data processing agreement with clients or vendors' },
    disclaimer:
      'Drafts for preparation only — not legal advice. Consult a lawyer before publishing or signing.',
    generate: 'Generate draft',
    next: 'Next',
    back: 'Back',
    done: 'Done — continue',
    copy: 'Copy',
    exportMd: 'Markdown',
    exportHtml: 'HTML',
    exportPdf: 'PDF',
    confirm: 'Reviewed — draft saved',
    website: 'Website URL',
    contactForm: 'Contact form on website',
    newsletter: 'Newsletter / email marketing',
    analytics: 'Web analytics (e.g. Google Analytics, Plausible)',
    analyticsProvider: 'Analytics provider',
    cookies: 'Marketing / tracking cookies',
    hosting: 'Hosting provider',
    email: 'Email provider',
    aiApi: 'AI API (e.g. OpenAI, Anthropic)',
    aiProvider: 'AI provider',
    payment: 'Payment processor',
    paymentProvider: 'Payment provider',
    webAgency: 'I build/host websites for clients (web agency)',
    clientCompany: 'Client company (controller)',
    clientContact: 'Client contact person',
    clientEmail: 'Client email',
    clientAddress: 'Client address',
    processingPurpose: 'Processing purpose',
    preview: 'Preview',
    exportThis: 'This document',
    exportSeparate: 'Download all 3 separately',
    exportCombined: 'Download all 3 in one file',
    exportZip: 'Download all 3 as ZIP',
    exportSeparateHint: '3 separate files (Impressum, Privacy, AVV)',
    exportCombinedHint: 'Single file with all three sections',
    exportZipHint: 'ZIP archive with one file per document',
    exportAll: 'Export all drafts',
    toContracts: 'Open in Contracts',
  },
}

export default function StepWebsiteLegal({ lang, formData, onUpdateForm, onUpdateStep, onNext }) {
  const s = PHASE_META[lang] || PHASE_META.en
  const [phase, setPhase] = useState(0)
  const [questionnaire, setQuestionnaire] = useState(() => loadLegalData().questionnaire)
  const [drafts, setDrafts] = useState(() => loadLegalData().drafts)
  const [preview, setPreview] = useState('')

  const profile = useMemo(
    () => buildLegalProfile({ questionnaire }),
    [questionnaire, formData]
  )

  useEffect(() => {
    saveQuestionnaire(questionnaire)
  }, [questionnaire])

  const phaseId = PHASES[phase]
  const PhaseIcon = s[phaseId]?.icon || FileText

  const setQ = (key, val) => setQuestionnaire((q) => ({ ...q, [key]: val }))

  const generateCurrent = () => {
    let text = ''
    if (phaseId === 'impressum') text = generateImpressum(profile, lang)
    else if (phaseId === 'datenschutz') text = generateDatenschutz(profile, lang)
    else text = generateAvv(profile, lang)

    const nextDrafts = { ...drafts, [phaseId]: text, lastGeneratedAt: new Date().toISOString() }
    setDrafts(nextDrafts)
    setPreview(text)
    saveDrafts(nextDrafts)
    toast.success(lang === 'de' ? 'Entwurf erstellt' : 'Draft generated')
  }

  const confirmPhase = () => {
    const key = `${phaseId}Confirmed`
    const nextDrafts = { ...drafts, [key]: true }
    setDrafts(nextDrafts)
    saveDrafts(nextDrafts)
    if (phase < PHASES.length - 1) {
      setPhase(phase + 1)
      setPreview(drafts[PHASES[phase + 1]] || '')
    } else {
      onUpdateStep('websiteLegal', 'confirmed')
      if (questionnaire.websiteUrl) {
        onUpdateForm({ website: questionnaire.websiteUrl })
      }
      syncLegalToDocDraft(formData)
      const next = getNextStepId('websiteLegal', formData.businessStructure, formData)
      onNext(next)
    }
  }

  const copyPreview = async () => {
    const text = preview || drafts[phaseId]
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      toast.success(lang === 'de' ? 'Kopiert' : 'Copied')
    } catch {
      toast.error('Copy failed')
    }
  }

  const field = (label, key, type = 'text') => (
    <label className="block">
      <span className="mb-1 block text-xs text-slate-500">{label}</span>
      <input
        type={type}
        value={questionnaire[key] || ''}
        onChange={(e) => setQ(key, e.target.value)}
        className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
      />
    </label>
  )

  const check = (label, key) => (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={!!questionnaire[key]}
        onChange={(e) => setQ(key, e.target.checked)}
        className="rounded"
      />
      {label}
    </label>
  )

  const renderQuestionnaire = () => {
    if (phaseId === 'impressum') {
      return (
        <div className="space-y-3">
          <p className="text-sm text-slate-400">
            {lang === 'de'
              ? 'Daten aus BizStart werden automatisch übernommen. Ergänzen Sie Ihre Website-URL.'
              : 'Data from BizStart is pre-filled. Add your website URL.'}
          </p>
          {field(s.website, 'websiteUrl')}
          <div className="premium-card space-y-1 p-3 text-xs text-slate-400">
            <p>
              <span className="text-slate-300">{profile.businessName}</span>
            </p>
            <p>{profile.ownerName}</p>
            <p>
              {[profile.street, profile.houseNumber, profile.plz, profile.city].filter(Boolean).join(', ')}
            </p>
            <p>{profile.email} · {profile.phone}</p>
            {profile.steuernummer && <p>St.-Nr.: {profile.steuernummer}</p>}
          </div>
        </div>
      )
    }

    if (phaseId === 'datenschutz') {
      return (
        <div className="space-y-3">
          {check(s.contactForm, 'hasContactForm')}
          {check(s.newsletter, 'hasNewsletter')}
          {check(s.analytics, 'hasAnalytics')}
          {questionnaire.hasAnalytics && field(s.analyticsProvider, 'analyticsProvider')}
          {check(s.cookies, 'hasCookies')}
          {field(s.hosting, 'hostingProvider')}
          {field(s.email, 'emailProvider')}
          {check(s.aiApi, 'usesAiApi')}
          {questionnaire.usesAiApi && field(s.aiProvider, 'aiApiProvider')}
          {check(s.payment, 'usesPaymentProcessor')}
          {questionnaire.usesPaymentProcessor && field(s.paymentProvider, 'paymentProvider')}
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {check(s.webAgency, 'isWebAgency')}
        {questionnaire.isWebAgency ? (
          <>
            {field(s.clientCompany, 'clientCompanyName')}
            {field(s.clientContact, 'clientContactName')}
            {field(s.clientEmail, 'clientEmail')}
            {field(s.clientAddress, 'clientAddress')}
          </>
        ) : (
          <p className="text-sm text-slate-400">
            {lang === 'de'
              ? 'Für Ihre eigene Website: AVV mit Hosting-, E-Mail- und anderen Dienstleistern abschließen (nicht im Footer veröffentlichen).'
              : 'For your own website: sign AVVs with hosting, email, and other vendors (not published in footer).'}
          </p>
        )}
        {field(s.processingPurpose, 'processingPurpose')}
        {field(s.hosting, 'hostingProvider')}
      </div>
    )
  }

  const currentText = preview || drafts[phaseId] || ''

  const allDraftsReady = drafts.impressum && drafts.datenschutz && drafts.avv

  const ensureAllDrafts = () => {
    const all = generateAllDrafts(profile, lang)
    setDrafts(all)
    saveDrafts(all)
    return all
  }

  const downloadAllSeparate = async (format) => {
    const all = ensureAllDrafts()
    await exportAllLegalDraftsSeparate(all, profile.businessName, format)
    toast.success(
      lang === 'de' ? '3 Dateien werden heruntergeladen…' : 'Downloading 3 separate files…'
    )
  }

  const downloadAllCombined = (format) => {
    const all = ensureAllDrafts()
    exportAllLegalDraftsCombined(all, profile.businessName, format)
    toast.success(lang === 'de' ? 'Kombinierte Datei heruntergeladen' : 'Combined file downloaded')
  }

  const downloadAllZip = async (format) => {
    const all = ensureAllDrafts()
    await exportAllLegalDraftsZip(all, profile.businessName, format)
    toast.success(lang === 'de' ? 'ZIP heruntergeladen' : 'ZIP downloaded')
  }

  const FormatButtons = ({ onMd, onHtml, onPdf, compact }) => (
    <div className={`flex flex-wrap gap-2 ${compact ? '' : 'mt-2'}`}>
      <button type="button" onClick={onMd} className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs">
        <Download className="h-3 w-3" /> {s.exportMd}
      </button>
      <button type="button" onClick={onHtml} className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs">
        <Download className="h-3 w-3" /> {s.exportHtml}
      </button>
      <button type="button" onClick={onPdf} className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs">
        <Download className="h-3 w-3" /> {s.exportPdf}
      </button>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex gap-1">
        {PHASES.map((p, i) => (
          <div
            key={p}
            className={`h-1 flex-1 rounded-full ${i <= phase ? 'bg-brand-500' : 'bg-slate-700'}`}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <PhaseIcon className="h-5 w-5 text-brand-400" />
        <div>
          <h2 className="text-lg font-bold">{s[phaseId]?.title}</h2>
          <p className="text-xs text-slate-500">{s[phaseId]?.desc}</p>
        </div>
      </div>

      <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
        {s.disclaimer}
      </p>

      {renderQuestionnaire()}

      <button type="button" onClick={generateCurrent} className="btn-primary w-full rounded-xl py-3 text-sm font-semibold">
        {s.generate}
      </button>

      {currentText && (
        <div className="premium-card p-4">
          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">{s.preview}</p>
          <div className="max-h-48 overflow-y-auto rounded-lg bg-slate-900/60 p-3 text-xs">
            <SafeMarkdown>{currentText}</SafeMarkdown>
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-400">{s.exportThis}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" onClick={copyPreview} className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs">
              <Copy className="h-3 w-3" /> {s.copy}
            </button>
            <button
              type="button"
              onClick={() => exportLegalDraftMarkdown(s[phaseId].title, currentText, profile.businessName)}
              className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs"
            >
              <Download className="h-3 w-3" /> {s.exportMd}
            </button>
            <button
              type="button"
              onClick={() => exportLegalDraftHtml(s[phaseId].title, currentText, profile.businessName)}
              className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs"
            >
              <Download className="h-3 w-3" /> {s.exportHtml}
            </button>
            <button
              type="button"
              onClick={() => exportLegalDraftPdf(s[phaseId].title, currentText, profile.businessName)}
              className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs"
            >
              <Download className="h-3 w-3" /> {s.exportPdf}
            </button>
          </div>
        </div>
      )}

      {(allDraftsReady || currentText) && (
        <div className="premium-card space-y-4 border border-brand-500/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-300">
            {lang === 'de' ? 'Alle drei Dokumente' : 'All three documents'}
          </p>

          <div>
            <p className="text-sm font-medium">{s.exportSeparate}</p>
            <p className="text-xs text-slate-500">{s.exportSeparateHint}</p>
            <FormatButtons
              onMd={() => downloadAllSeparate('md')}
              onHtml={() => downloadAllSeparate('html')}
              onPdf={() => downloadAllSeparate('pdf')}
            />
          </div>

          <div className="border-t border-slate-700/60 pt-4">
            <p className="text-sm font-medium">{s.exportCombined}</p>
            <p className="text-xs text-slate-500">{s.exportCombinedHint}</p>
            <FormatButtons
              onMd={() => downloadAllCombined('md')}
              onHtml={() => downloadAllCombined('html')}
              onPdf={() => downloadAllCombined('pdf')}
            />
          </div>

          <div className="border-t border-slate-700/60 pt-4">
            <p className="text-sm font-medium">{s.exportZip}</p>
            <p className="text-xs text-slate-500">{s.exportZipHint}</p>
            <FormatButtons
              onMd={() => downloadAllZip('md')}
              onHtml={() => downloadAllZip('html')}
              onPdf={() => downloadAllZip('pdf')}
            />
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {phase > 0 && (
          <button
            type="button"
            onClick={() => {
              setPhase(phase - 1)
              setPreview(drafts[PHASES[phase - 1]] || '')
            }}
            className="flex-1 rounded-xl bg-slate-800 py-3 text-sm"
          >
            {s.back}
          </button>
        )}
        <button
          type="button"
          onClick={confirmPhase}
          disabled={!currentText}
          className="btn-primary flex flex-1 items-center justify-center gap-1 rounded-xl py-3 text-sm font-semibold disabled:opacity-40"
        >
          {drafts[`${phaseId}Confirmed`] ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : null}
          {phase < PHASES.length - 1 ? s.next : s.done}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
