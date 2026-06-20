import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { FileText, Shield, FileSignature, ChevronRight, Download, Copy, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  buildLegalProfileFromFields,
  initLegalProfileFields,
  getMissingProfileFields,
} from '@/lib/legal/profile'
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
import { persistLegalProfile } from '@/lib/legal/sync'
import LegalProfileForm from '@/components/legal/LegalProfileForm'
import LegalDocumentPreview from '@/components/legal/LegalDocumentPreview'

const PHASES = ['impressum', 'datenschutz', 'avv']

const PHASE_META = {
  de: {
    impressum: { title: 'Impressum', icon: FileText, desc: 'Pflichtangaben für den Website-Footer (§ 5 DDG)' },
    datenschutz: { title: 'Datenschutzerklärung', icon: Shield, desc: 'DSGVO-konforme Datenschutzseite vorbereiten' },
    avv: { title: 'AVV', icon: FileSignature, desc: 'Auftragsverarbeitungsvertrag mit Kunden oder Dienstleistern' },
    disclaimer:
      'Entwürfe zur Vorbereitung — keine Rechtsberatung. Vor Veröffentlichung oder Unterzeichnung einen Rechtsanwalt konsultieren.',
    generate: 'Entwurf erstellen / aktualisieren',
    updateHint: 'Vorschau aktualisiert sich automatisch bei Änderungen.',
    next: 'Weiter',
    back: 'Zurück',
    done: 'Fertig — weiter',
    copy: 'Kopieren',
    exportMd: 'Markdown',
    exportHtml: 'HTML',
    exportPdf: 'PDF',
    privacySection: 'Website & Datenverarbeitung',
    avvSection: 'Vertragsdetails',
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
    clientCompany: 'Kundenfirma (Verantwortlicher)',
    clientContact: 'Kunden-Ansprechpartner',
    clientEmail: 'Kunden-E-Mail',
    clientAddress: 'Kunden-Adresse (kein Postfach)',
    processingPurpose: 'Verarbeitungszweck',
    preview: 'Vorschau',
    exportThis: 'Dieses Dokument',
    exportSeparate: 'Alle 3 einzeln herunterladen',
    exportCombined: 'Alle 3 in einer Datei',
    exportZip: 'Alle 3 als ZIP',
    exportSeparateHint: '3 separate Dateien (Impressum, Datenschutz, AVV)',
    exportCombinedHint: 'Eine Datei mit allen drei Abschnitten',
    exportZipHint: 'ZIP-Archiv mit je einer Datei pro Dokument',
    fillRequired: 'Bitte Pflichtfelder ausfüllen (markiert in Gelb).',
  },
  en: {
    impressum: { title: 'Imprint (Impressum)', icon: FileText, desc: 'Mandatory footer page (§ 5 DDG)' },
    datenschutz: { title: 'Privacy Policy', icon: Shield, desc: 'Prepare a GDPR-compliant privacy page' },
    avv: { title: 'DPA (AVV)', icon: FileSignature, desc: 'Data processing agreement with clients or vendors' },
    disclaimer:
      'Drafts for preparation only — not legal advice. Consult a lawyer before publishing or signing.',
    generate: 'Generate / update draft',
    updateHint: 'Preview updates automatically when you edit the form.',
    next: 'Next',
    back: 'Back',
    done: 'Done — continue',
    copy: 'Copy',
    exportMd: 'Markdown',
    exportHtml: 'HTML',
    exportPdf: 'PDF',
    privacySection: 'Website & data processing',
    avvSection: 'Contract details',
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
    clientAddress: 'Client address (no P.O. box)',
    processingPurpose: 'Processing purpose',
    preview: 'Preview',
    exportThis: 'This document',
    exportSeparate: 'Download all 3 separately',
    exportCombined: 'Download all 3 in one file',
    exportZip: 'Download all 3 as ZIP',
    exportSeparateHint: '3 separate files (Impressum, Privacy, AVV)',
    exportCombinedHint: 'Single file with all three sections',
    exportZipHint: 'ZIP archive with one file per document',
    fillRequired: 'Please fill required fields (highlighted in yellow).',
  },
}

function generatePhaseText(phaseId, profile, lang) {
  if (phaseId === 'impressum') return generateImpressum(profile, lang)
  if (phaseId === 'datenschutz') return generateDatenschutz(profile, lang)
  return generateAvv(profile, lang)
}

export default function StepWebsiteLegal({ lang, formData, onUpdateForm, onUpdateStep, onNext }) {
  const s = PHASE_META[lang] || PHASE_META.en
  const [phase, setPhase] = useState(0)
  const [profileFields, setProfileFields] = useState(() => initLegalProfileFields(formData))
  const [questionnaire, setQuestionnaire] = useState(() => {
    const q = loadLegalData().questionnaire
    const website = initLegalProfileFields(formData).website
    return { ...q, websiteUrl: q.websiteUrl || website }
  })
  const [drafts, setDrafts] = useState(() => loadLegalData().drafts)
  const [preview, setPreview] = useState('')
  const autoGenRef = useRef(null)

  const profile = useMemo(
    () =>
      buildLegalProfileFromFields(profileFields, {
        ...questionnaire,
        websiteUrl: profileFields.website || questionnaire.websiteUrl,
      }),
    [profileFields, questionnaire]
  )

  const missing = useMemo(() => getMissingProfileFields(profileFields), [profileFields])

  const persistAll = useCallback(
    (nextProfile, nextQuestionnaire = questionnaire) => {
      persistLegalProfile(nextProfile, formData, onUpdateForm)
      saveQuestionnaire({
        ...nextQuestionnaire,
        websiteUrl: nextProfile.website || nextQuestionnaire.websiteUrl,
      })
    },
    [formData, onUpdateForm, questionnaire]
  )

  const updateProfile = (next) => {
    setProfileFields(next)
    persistAll(next)
  }

  const setQ = (key, val) => {
    const next = { ...questionnaire, [key]: val }
    setQuestionnaire(next)
    saveQuestionnaire(next)
  }

  const phaseId = PHASES[phase]
  const PhaseIcon = s[phaseId]?.icon || FileText

  const applyDraft = (text) => {
    const nextDrafts = { ...drafts, [phaseId]: text, lastGeneratedAt: new Date().toISOString() }
    setDrafts(nextDrafts)
    setPreview(text)
    saveDrafts(nextDrafts)
  }

  const generateCurrent = useCallback(() => {
    if (phaseId === 'impressum' && missing.length > 0) {
      toast.error(s.fillRequired)
      return
    }
    const text = generatePhaseText(phaseId, profile, lang)
    applyDraft(text)
    toast.success(lang === 'de' ? 'Entwurf aktualisiert' : 'Draft updated')
  }, [phaseId, profile, lang, missing, s.fillRequired])

  useEffect(() => {
    clearTimeout(autoGenRef.current)
    autoGenRef.current = setTimeout(() => {
      if (phaseId === 'impressum' && missing.length > 0) return
      const text = generatePhaseText(phaseId, profile, lang)
      applyDraft(text)
    }, 600)
    return () => clearTimeout(autoGenRef.current)
  }, [profileFields, questionnaire, phaseId, lang, missing, profile])

  const confirmPhase = () => {
    if (!preview && !drafts[phaseId]) {
      generateCurrent()
      return
    }
    const key = `${phaseId}Confirmed`
    const nextDrafts = { ...drafts, [key]: true }
    setDrafts(nextDrafts)
    saveDrafts(nextDrafts)
    persistAll(profileFields)
    if (phase < PHASES.length - 1) {
      setPhase(phase + 1)
      setPreview(drafts[PHASES[phase + 1]] || '')
    } else {
      onUpdateStep('websiteLegal', 'confirmed')
      persistAll(profileFields)
      onNext(getNextStepId('websiteLegal', formData.businessStructure, formData))
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

  const qField = (label, key, type = 'text') => (
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
        <LegalProfileForm
          lang={lang}
          fields={profileFields}
          onChange={updateProfile}
          variant="full"
        />
      )
    }

    if (phaseId === 'datenschutz') {
      return (
        <div className="space-y-4">
          <LegalProfileForm
            lang={lang}
            fields={profileFields}
            onChange={updateProfile}
            variant="controller"
          />
          <div className="space-y-3 rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
            <p className="text-sm font-semibold text-brand-300">{s.privacySection}</p>
            {check(s.contactForm, 'hasContactForm')}
            {check(s.newsletter, 'hasNewsletter')}
            {check(s.analytics, 'hasAnalytics')}
            {questionnaire.hasAnalytics && qField(s.analyticsProvider, 'analyticsProvider')}
            {check(s.cookies, 'hasCookies')}
            {qField(s.hosting, 'hostingProvider')}
            {qField(s.email, 'emailProvider')}
            {check(s.aiApi, 'usesAiApi')}
            {questionnaire.usesAiApi && qField(s.aiProvider, 'aiApiProvider')}
            {check(s.payment, 'usesPaymentProcessor')}
            {questionnaire.usesPaymentProcessor && qField(s.paymentProvider, 'paymentProvider')}
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {check(s.webAgency, 'isWebAgency')}
        {questionnaire.isWebAgency ? (
          <>
            <div className="space-y-3 rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
              <p className="text-sm font-semibold text-brand-300">
                {lang === 'de' ? 'Kunde (Verantwortlicher)' : 'Client (controller)'}
              </p>
              {qField(s.clientCompany, 'clientCompanyName')}
              {qField(s.clientContact, 'clientContactName')}
              {qField(s.clientEmail, 'clientEmail', 'email')}
              {qField(s.clientAddress, 'clientAddress')}
            </div>
            <LegalProfileForm
              lang={lang}
              fields={profileFields}
              onChange={updateProfile}
              variant="processor"
            />
          </>
        ) : (
          <>
            <p className="text-sm text-slate-400">
              {lang === 'de'
                ? 'Für Ihre eigene Website: AVV mit Hosting-, E-Mail- und anderen Dienstleistern abschließen (nicht im Footer veröffentlichen).'
                : 'For your own website: sign AVVs with hosting, email, and other vendors (not published in footer).'}
            </p>
            <LegalProfileForm
              lang={lang}
              fields={profileFields}
              onChange={updateProfile}
              variant="controller"
            />
          </>
        )}
        <div className="space-y-3 rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
          <p className="text-sm font-semibold text-brand-300">{s.avvSection}</p>
          {qField(s.processingPurpose, 'processingPurpose')}
          {qField(s.hosting, 'hostingProvider')}
        </div>
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
    toast.success(lang === 'de' ? '3 Dateien werden heruntergeladen…' : 'Downloading 3 separate files…')
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

  const FormatButtons = ({ onMd, onHtml, onPdf }) => (
    <div className="mt-2 flex flex-wrap gap-2">
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

      <p className="text-center text-xs text-slate-500">{s.updateHint}</p>

      <button type="button" onClick={generateCurrent} className="btn-primary w-full rounded-xl py-3 text-sm font-semibold">
        {s.generate}
      </button>

      {currentText && (
        <div className="premium-card p-4">
          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">{s.preview}</p>
          <div className="max-h-[28rem] overflow-y-auto">
            <LegalDocumentPreview content={currentText} />
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
          disabled={phaseId === 'impressum' && missing.length > 0}
          className="btn-primary flex flex-1 items-center justify-center gap-1 rounded-xl py-3 text-sm font-semibold disabled:opacity-40"
        >
          {drafts[`${phaseId}Confirmed`] ? <CheckCircle2 className="h-4 w-4" /> : null}
          {phase < PHASES.length - 1 ? s.next : s.done}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
