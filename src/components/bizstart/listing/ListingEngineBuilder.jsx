import { useCallback, useMemo, useState } from 'react'
import {
  ArrowLeft,
  Upload,
  ClipboardPaste,
  Loader2,
  Shield,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Download,
  Lock,
  Package,
  Calculator,
  Search,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAiLanguage } from '@/context/AiLanguageContext'
import AiLanguageBar from '@/components/shared/AiLanguageBar'
import SafeMarkdown from '@/components/SafeMarkdown'
import {
  LISTING_MODES,
  PUBLISH_STATUS,
  loadListingSession,
  saveListingSession,
  deleteListingData,
  remainingGenerations,
  DAILY_GENERATION_CAP,
  extractTextFromSupplierFile,
  SupplierParseError,
  runListingPipeline,
  formatCustomerListing,
  formatInternalNotes,
  copyTextToClipboard,
  downloadTextFile,
  loadLockedLegalModules,
  legalModulesReady,
  computePublishReadiness,
  READINESS_VERDICT,
  recommendTitleFromProduct,
} from '@/lib/listingengine'

const PHASE_LABELS = {
  de: {
    extracting: 'Produktdaten werden extrahiert…',
    copywriting: 'Deutsche Verkaufstexte werden erstellt…',
    compliance: 'Compliance-Prüfung läuft…',
  },
  en: {
    extracting: 'Extracting product data…',
    copywriting: 'Writing German retail copy…',
    compliance: 'Running compliance check…',
  },
}

function StatusBadge({ status, lang }) {
  if (status === PUBLISH_STATUS.READY) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-300">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {lang === 'de' ? 'Bereit zur Freigabe' : 'Ready for approval'}
      </span>
    )
  }
  if (status === PUBLISH_STATUS.BLOCKED) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 px-2.5 py-1 text-xs font-medium text-rose-300">
        <XCircle className="h-3.5 w-3.5" />
        {lang === 'de' ? 'Nicht bereit' : 'Not ready'}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-300">
      <AlertTriangle className="h-3.5 w-3.5" />
      {lang === 'de' ? 'Prüfung nötig' : 'Needs review'}
    </span>
  )
}

function ClaimRow({ claim }) {
  const tone =
    claim.level === 'RED'
      ? 'border-rose-500/40 bg-rose-500/10 text-rose-200'
      : claim.level === 'GREEN'
        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
        : 'border-amber-500/30 bg-amber-500/10 text-amber-200'
  return (
    <li className={`rounded-lg border px-3 py-2 text-xs ${tone}`}>
      <span className="font-semibold">[{claim.level}]</span> {claim.claim}
      {claim.reason ? <span className="mt-0.5 block opacity-80">{claim.reason}</span> : null}
    </li>
  )
}

function ReadinessBadge({ verdict, lang }) {
  if (verdict === READINESS_VERDICT.READY) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-300">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {lang === 'de' ? 'Bereit zum Veröffentlichen' : 'Ready to publish'}
      </span>
    )
  }
  if (verdict === READINESS_VERDICT.FIX) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 px-2.5 py-1 text-xs font-medium text-rose-300">
        <XCircle className="h-3.5 w-3.5" />
        {lang === 'de' ? 'Nicht veröffentlichen' : 'Do not publish'}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-300">
      <AlertTriangle className="h-3.5 w-3.5" />
      {lang === 'de' ? 'Nachbessern' : 'Needs fixes'}
    </span>
  )
}

function FieldInput({ label, value, onChange, hint, type = 'text' }) {
  return (
    <label className="block text-xs text-slate-400">
      {label}
      <input
        type={type}
        inputMode={type === 'number' ? 'decimal' : undefined}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm text-slate-100"
      />
      {hint ? <span className="mt-0.5 block text-[10px] text-slate-500">{hint}</span> : null}
    </label>
  )
}

export default function ListingEngineBuilder({ onBack }) {
  const { language, setLanguage } = useAiLanguage()
  const lang = language === 'en' ? 'en' : 'de'
  const [session, setSession] = useState(() => {
    const s = loadListingSession()
    if (!s.legal?.impressum) {
      return { ...s, legal: loadLockedLegalModules(s.legal) }
    }
    return s
  })
  const [busy, setBusy] = useState(false)
  const [phase, setPhase] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [tab, setTab] = useState('input') // input | product | listing | legal | review
  const [previewMode, setPreviewMode] = useState('customer') // customer | internal

  const persist = useCallback((patch) => {
    const next = saveListingSession(patch)
    setSession(next)
    return next
  }, [])

  const remaining = remainingGenerations()

  const customerText = useMemo(
    () =>
      formatCustomerListing({
        listing: session.listing,
        product: session.product,
        legal: session.legal,
        includeLegal: true,
      }),
    [session.listing, session.product, session.legal]
  )

  const readiness = useMemo(
    () =>
      computePublishReadiness({
        product: session.product,
        listing: session.listing,
        compliance: session.compliance,
        score: session.score,
        legal: session.legal,
        economics: session.economics,
        humanApproved: session.human_approved,
      }),
    [
      session.product,
      session.listing,
      session.compliance,
      session.score,
      session.legal,
      session.economics,
      session.human_approved,
    ]
  )

  const profit = readiness.profit
  const seo = readiness.seo

  const internalText = useMemo(
    () =>
      formatInternalNotes({
        compliance: session.compliance,
        score: session.score,
        readiness,
        profit,
      }),
    [session.compliance, session.score, readiness, profit]
  )

  const onFile = async (file) => {
    if (!file) return
    try {
      const { text, filename } = await extractTextFromSupplierFile(file)
      persist({
        source: 'upload',
        raw_supplier_text: text,
        source_filename: filename,
        phase: 'input',
        error: '',
      })
      toast.success(lang === 'de' ? 'Datei gelesen' : 'File read')
    } catch (err) {
      const msg =
        err instanceof SupplierParseError
          ? err.message
          : lang === 'de'
            ? 'Datei konnte nicht gelesen werden.'
            : 'Could not read file.'
      toast.error(msg)
    }
  }

  const syncLegalFromBizStart = () => {
    const legal = loadLockedLegalModules({})
    persist({ legal })
    toast.success(
      lang === 'de'
        ? 'Rechtstexte aus Website-Rechtliches übernommen'
        : 'Legal texts loaded from Website Legal'
    )
  }

  const wipeData = () => {
    const empty = deleteListingData()
    setSession({ ...empty, legal: loadLockedLegalModules({}) })
    toast.success(lang === 'de' ? 'Listing-Daten gelöscht' : 'Listing data deleted')
  }

  const run = async () => {
    if (!session.privacy_acknowledged) {
      toast.error(
        lang === 'de'
          ? 'Bitte Datenschutz-Hinweis bestätigen.'
          : 'Please acknowledge the privacy notice.'
      )
      return
    }
    const text = String(session.raw_supplier_text || '').trim()
    const hasProduct =
      session.product.produkttyp || session.product.marke || session.product.modell
    if (!text && !hasProduct) {
      toast.error(
        lang === 'de'
          ? 'Bitte Lieferantentext einfügen oder Produktdaten ausfüllen.'
          : 'Paste supplier text or fill product fields.'
      )
      return
    }

    setBusy(true)
    setPhase('extracting')
    try {
      const result = await runListingPipeline({
        rawText: text,
        productOverride: hasProduct ? session.product : null,
        mode: session.mode || 'complete',
        existingListing: session.listing?.titel ? session.listing : null,
        language: lang,
        onPhase: setPhase,
      })
      persist({
        product: result.product,
        listing: result.listing,
        compliance: result.compliance,
        score: result.score,
        phase: 'review',
        human_approved: false,
        error: '',
      })
      setTab('review')
      toast.success(
        lang === 'de'
          ? 'Listing erstellt — bitte Compliance prüfen'
          : 'Listing generated — review compliance'
      )
    } catch (err) {
      const msg = err?.message || (lang === 'de' ? 'Generierung fehlgeschlagen.' : 'Generation failed.')
      persist({ phase: 'error', error: msg })
      toast.error(msg)
    } finally {
      setBusy(false)
      setPhase(null)
    }
  }

  const approve = () => {
    if (
      session.compliance.publish_status === PUBLISH_STATUS.BLOCKED ||
      readiness.verdict === READINESS_VERDICT.FIX
    ) {
      toast.error(
        lang === 'de'
          ? 'Nicht freigabefähig — Publish Readiness zuerst verbessern.'
          : 'Cannot approve — improve Publish Readiness first.'
      )
      return
    }
    persist({ human_approved: true })
    toast.success(lang === 'de' ? 'Menschliche Freigabe gespeichert' : 'Human approval saved')
  }

  const applyRecommendedTitle = () => {
    const t = recommendTitleFromProduct(session.product)
    if (!t) {
      toast.error(
        lang === 'de'
          ? 'Zu wenig Produktdaten für einen Titelvorschlag.'
          : 'Not enough product data for a title suggestion.'
      )
      return
    }
    persist({ listing: { ...session.listing, titel: t, seo_titel: t } })
    toast.success(lang === 'de' ? 'Titel aus Produktdaten übernommen' : 'Title applied from product data')
  }

  const copyOut = async () => {
    const text = previewMode === 'customer' ? customerText : internalText
    const ok = await copyTextToClipboard(text)
    if (ok) toast.success(lang === 'de' ? 'Kopiert' : 'Copied')
    else toast.error(lang === 'de' ? 'Kopieren fehlgeschlagen' : 'Copy failed')
  }

  const downloadOut = () => {
    const text =
      previewMode === 'customer'
        ? customerText
        : `${customerText}\n\n---\n\n${internalText}`
    const name = (session.listing.titel || 'ebay-listing')
      .slice(0, 40)
      .replace(/[^\w\-äöüÄÖÜß]+/g, '-')
    downloadTextFile(`${name || 'ebay-listing'}.txt`, text)
    toast.success(lang === 'de' ? 'Download gestartet' : 'Download started')
  }

  const setProduct = (patch) => persist({ product: { ...session.product, ...patch } })
  const setGpsr = (patch) =>
    persist({ product: { ...session.product, gpsr: { ...session.product.gpsr, ...patch } } })
  const setShipping = (patch) =>
    persist({
      product: { ...session.product, shipping: { ...session.product.shipping, ...patch } },
    })
  const setLegal = (patch) => persist({ legal: { ...session.legal, ...patch, locked: true } })
  const setListingField = (key, value) => persist({ listing: { ...session.listing, [key]: value } })
  const setEconomics = (patch) =>
    persist({ economics: { ...session.economics, ...patch } })

  const tabs = [
    { id: 'input', de: 'Eingabe', en: 'Input' },
    { id: 'product', de: 'Produktdaten', en: 'Product' },
    { id: 'economics', de: 'Profit', en: 'Profit' },
    { id: 'listing', de: 'Listing', en: 'Listing' },
    { id: 'legal', de: 'Rechtliches', en: 'Legal' },
    { id: 'review', de: 'Prüfung', en: 'Review' },
  ]

  return (
    <div className="w-full min-w-0 max-w-full pb-24">
      <button
        type="button"
        onClick={onBack}
        className="safe-top mb-3 flex items-center gap-2 text-sm text-slate-400"
      >
        <ArrowLeft className="h-4 w-4" />
        BizStart
      </button>

      <header className="mb-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600/20 px-3 py-1 text-xs text-brand-300">
            <Package className="h-3 w-3" />
            Listing Engine
          </span>
          <StatusBadge status={session.compliance?.publish_status} lang={lang} />
          <span className="text-xs text-slate-500">
            Readiness {readiness.total}/100
          </span>
        </div>
        <h1 className="text-xl font-bold leading-tight">
          {lang === 'de'
            ? 'Deutsche E-Commerce Listing Engine'
            : 'German E-Commerce Listing Engine'}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {lang === 'de'
            ? 'Copy · SEO · Compliance · Profit · Publish Readiness — keine erfundenen Angaben, Freigabe vor Export.'
            : 'Copy · SEO · Compliance · Profit · Publish Readiness — no invented specs, approval before export.'}
        </p>
      </header>

      <div className="mb-4 flex gap-1 overflow-x-auto rounded-xl bg-slate-900/80 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition ${
              tab === t.id ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'de' ? t.de : t.en}
          </button>
        ))}
      </div>

      {tab === 'input' && (
        <section className="space-y-4">
          <div className="premium-card space-y-3 p-4">
            <label className="block text-xs font-medium text-slate-400">
              {lang === 'de' ? 'Modus' : 'Mode'}
            </label>
            <select
              value={session.mode}
              onChange={(e) => persist({ mode: e.target.value })}
              className="w-full rounded-lg bg-slate-900/80 px-3 py-2.5 text-sm"
            >
              {LISTING_MODES.map((m) => (
                <option key={m.id} value={m.id}>
                  {lang === 'de' ? m.labelDe : m.labelEn}
                </option>
              ))}
            </select>

            <label className="block text-xs font-medium text-slate-400">
              {lang === 'de' ? 'Lieferanten- / Produktdaten' : 'Supplier / product data'}
            </label>
            <textarea
              value={session.raw_supplier_text}
              onChange={(e) => persist({ raw_supplier_text: e.target.value, source: 'paste' })}
              rows={10}
              placeholder={
                lang === 'de'
                  ? 'Beschreibung, Spezifikationen, Maße, Lieferumfang, Hersteller… einfügen'
                  : 'Paste description, specs, dimensions, contents, manufacturer…'
              }
              className="w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm leading-relaxed"
            />

            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                onFile(e.dataTransfer.files?.[0])
              }}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-6 text-center text-xs ${
                dragOver ? 'border-brand-400 bg-brand-500/10' : 'border-slate-700 bg-slate-900/40'
              }`}
            >
              <Upload className="h-5 w-5 text-slate-500" />
              <p className="text-slate-400">
                {lang === 'de'
                  ? 'PDF, DOCX, TXT, CSV (max. 5 MB) — oder Datei wählen'
                  : 'PDF, DOCX, TXT, CSV (max 5 MB) — or choose file'}
              </p>
              {session.source_filename ? (
                <p className="text-brand-300">{session.source_filename}</p>
              ) : null}
              <label className="cursor-pointer rounded-lg bg-slate-800 px-3 py-2 text-slate-200">
                <ClipboardPaste className="mr-1 inline h-3.5 w-3.5" />
                {lang === 'de' ? 'Datei wählen' : 'Choose file'}
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.md,.csv,text/plain,application/pdf"
                  className="hidden"
                  onChange={(e) => onFile(e.target.files?.[0])}
                />
              </label>
            </div>

            <label className="flex items-start gap-2 text-xs text-slate-400">
              <input
                type="checkbox"
                checked={!!session.privacy_acknowledged}
                onChange={(e) => persist({ privacy_acknowledged: e.target.checked })}
                className="mt-0.5"
              />
              <span>
                {lang === 'de'
                  ? 'Ich bestätige: Produktdaten werden zur KI-Verarbeitung an den Server gesendet. Keine erfundenen Angaben veröffentlichen. Rechtstexte sind keine Rechtsberatung.'
                  : 'I confirm: product data is sent to the server for AI processing. Do not publish invented claims. Legal modules are not legal advice.'}
              </span>
            </label>
          </div>

          <AiLanguageBar language={language} onChange={setLanguage} className="mb-2" />

          <button
            type="button"
            disabled={busy}
            onClick={run}
            className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {PHASE_LABELS[lang][phase] || (lang === 'de' ? 'Arbeitet…' : 'Working…')}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {lang === 'de'
                  ? 'Copywriter + Compliance starten'
                  : 'Run copywriter + compliance'}
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-slate-500">
            {remaining}/{DAILY_GENERATION_CAP}{' '}
            {lang === 'de' ? 'Generierungen heute' : 'generations today'}
          </p>
        </section>
      )}

      {tab === 'product' && (
        <section className="space-y-3">
          <p className="text-xs text-slate-500">
            {lang === 'de'
              ? 'Nur verifizierte Angaben. Fehlende Werte leer lassen — die KI darf nichts erfinden.'
              : 'Verified facts only. Leave blanks empty — AI must not invent values.'}
          </p>
          <div className="premium-card grid gap-3 p-4 sm:grid-cols-2">
            {[
              ['produkttyp', 'Produkttyp', 'Product type'],
              ['marke', 'Marke', 'Brand'],
              ['modell', 'Modell', 'Model'],
              ['farbe', 'Farbe', 'Color'],
              ['material', 'Material', 'Material'],
              ['groesse', 'Größe', 'Size'],
              ['anzahl', 'Anzahl', 'Quantity'],
              ['ean', 'EAN/GTIN', 'EAN/GTIN'],
              ['artikelnummer', 'Artikelnr.', 'SKU'],
              ['zustand', 'Zustand', 'Condition'],
              ['category_hint', 'eBay-Kategorie (Hinweis)', 'eBay category hint'],
              ['wholesale_cost', 'Einkaufspreis (€)', 'Wholesale cost (€)'],
            ].map(([key, de, en]) => (
              <label key={key} className="block text-xs text-slate-400">
                {lang === 'de' ? de : en}
                <input
                  value={session.product[key] || ''}
                  onChange={(e) => {
                    const v = e.target.value
                    setProduct({ [key]: v })
                    if (key === 'wholesale_cost' && !session.economics?.product_cost) {
                      setEconomics({ product_cost: v })
                    }
                  }}
                  className="mt-1 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm text-slate-100"
                />
              </label>
            ))}
          </div>

          <div className="premium-card grid gap-3 p-4 sm:grid-cols-2">
            <p className="sm:col-span-2 text-xs font-semibold text-slate-300">
              {lang === 'de' ? 'Maße' : 'Dimensions'}
            </p>
            {Object.keys(session.product.masse || {}).map((key) => (
              <label key={key} className="block text-xs text-slate-400">
                {key}
                <input
                  value={session.product.masse[key] || ''}
                  onChange={(e) =>
                    setProduct({ masse: { ...session.product.masse, [key]: e.target.value } })
                  }
                  className="mt-1 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
                />
              </label>
            ))}
          </div>

          <div className="premium-card grid gap-3 p-4 sm:grid-cols-2">
            <p className="sm:col-span-2 text-xs font-semibold text-slate-300">
              {lang === 'de' ? 'Versand (verifiziert)' : 'Shipping (verified)'}
            </p>
            {Object.keys(session.product.shipping || {}).map((key) => (
              <label key={key} className="block text-xs text-slate-400">
                {key}
                <input
                  value={session.product.shipping[key] || ''}
                  onChange={(e) => setShipping({ [key]: e.target.value })}
                  className="mt-1 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
                />
              </label>
            ))}
          </div>

          <div className="premium-card space-y-3 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-300">GPSR / Produktsicherheit</p>
              <label className="flex items-center gap-2 text-[11px] text-slate-400">
                <input
                  type="checkbox"
                  checked={session.product.gpsr.gpsr_applicable !== false}
                  onChange={(e) => setGpsr({ gpsr_applicable: e.target.checked })}
                />
                {lang === 'de' ? 'Anwendbar' : 'Applicable'}
              </label>
            </div>
            {[
              ['hersteller', 'Hersteller'],
              ['hersteller_anschrift', 'Herstelleranschrift'],
              ['hersteller_email', 'Hersteller-E-Mail'],
              ['eu_verantwortliche_person', 'EU Verantwortliche Person'],
              ['eu_verantwortliche_anschrift', 'EU Anschrift'],
              ['eu_verantwortliche_email', 'EU E-Mail'],
              ['produktidentifikation', 'Produkt-ID'],
              ['modellnummer', 'Modellnummer'],
              ['warnhinweise', 'Warnhinweise'],
              ['sicherheitsinformationen', 'Sicherheitsinformationen'],
              ['gebrauchsanleitung', 'Gebrauchsanleitung'],
            ].map(([key, label]) => (
              <label key={key} className="block text-xs text-slate-400">
                {label}
                <textarea
                  rows={key.includes('hinweis') || key.includes('sicher') || key.includes('gebrauch') || key.includes('anschrift') ? 2 : 1}
                  value={session.product.gpsr[key] || ''}
                  onChange={(e) => setGpsr({ [key]: e.target.value })}
                  className="mt-1 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
                />
              </label>
            ))}
          </div>

          <label className="premium-card block p-4 text-xs text-slate-400">
            {lang === 'de' ? 'Lieferumfang (eine Zeile pro Position)' : 'Package contents (one per line)'}
            <textarea
              rows={4}
              value={(session.product.lieferumfang || []).join('\n')}
              onChange={(e) =>
                setProduct({
                  lieferumfang: e.target.value
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="mt-1 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
            />
          </label>
        </section>
      )}

      {tab === 'economics' && (
        <section className="space-y-4">
          <div className="premium-card space-y-3 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Calculator className="h-4 w-4 text-brand-300" />
              {lang === 'de' ? 'Deckungsbeitrag (Schätzung)' : 'Contribution margin (estimate)'}
            </div>
            <p className="text-[11px] text-slate-500">
              {lang === 'de'
                ? 'eBay-Gebühren sind Schätzwerte — bitte mit deinem Verkäuferkonto abgleichen. Keine Finanzberatung.'
                : 'eBay fees are estimates — verify against your seller account. Not financial advice.'}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <FieldInput
                label={lang === 'de' ? 'Verkaufspreis (€)' : 'Selling price (€)'}
                value={session.economics.selling_price}
                onChange={(v) => setEconomics({ selling_price: v })}
              />
              <FieldInput
                label={lang === 'de' ? 'Einkaufspreis (€)' : 'Product cost (€)'}
                value={session.economics.product_cost}
                onChange={(v) => setEconomics({ product_cost: v })}
              />
              <FieldInput
                label={lang === 'de' ? 'Lieferanten-Versand (€)' : 'Supplier shipping (€)'}
                value={session.economics.supplier_shipping}
                onChange={(v) => setEconomics({ supplier_shipping: v })}
              />
              <FieldInput
                label={lang === 'de' ? 'Dein Versand (€)' : 'Your outbound shipping (€)'}
                value={session.economics.outbound_shipping_cost}
                onChange={(v) => setEconomics({ outbound_shipping_cost: v })}
              />
              <FieldInput
                label={lang === 'de' ? 'eBay-Gebühr %' : 'eBay fee %'}
                value={session.economics.ebay_fee_pct}
                onChange={(v) => setEconomics({ ebay_fee_pct: v })}
                hint={lang === 'de' ? 'Standard ~12,9 % (anpassbar)' : 'Default ~12.9% (editable)'}
              />
              <FieldInput
                label={lang === 'de' ? 'eBay Fixgebühr (€)' : 'eBay fixed fee (€)'}
                value={session.economics.ebay_fixed_fee}
                onChange={(v) => setEconomics({ ebay_fixed_fee: v })}
              />
              <FieldInput
                label={lang === 'de' ? 'Werbung / Auftrag (€)' : 'Ad cost / order (€)'}
                value={session.economics.ad_cost_per_order}
                onChange={(v) => setEconomics({ ad_cost_per_order: v })}
              />
              <FieldInput
                label={lang === 'de' ? 'Retourenquote %' : 'Return rate %'}
                value={session.economics.expected_return_rate_pct}
                onChange={(v) => setEconomics({ expected_return_rate_pct: v })}
              />
              <FieldInput
                label={lang === 'de' ? 'Schadenspauschale %' : 'Damage allowance %'}
                value={session.economics.damage_allowance_pct}
                onChange={(v) => setEconomics({ damage_allowance_pct: v })}
              />
              <FieldInput
                label={lang === 'de' ? 'Sonstige Kosten (€)' : 'Other cost (€)'}
                value={session.economics.other_cost_per_order}
                onChange={(v) => setEconomics({ other_cost_per_order: v })}
              />
              <FieldInput
                label={lang === 'de' ? 'Zielmarge %' : 'Target margin %'}
                value={session.economics.target_margin_pct}
                onChange={(v) => setEconomics({ target_margin_pct: v })}
              />
            </div>
          </div>

          <div
            className={`premium-card space-y-2 p-4 ${
              profit.status === 'ok'
                ? 'border border-emerald-500/30'
                : profit.status === 'loss'
                  ? 'border border-rose-500/40'
                  : 'border border-amber-500/30'
            }`}
          >
            <p className="text-xs font-semibold text-slate-300">
              {lang === 'de' ? 'Ergebnis' : 'Result'}
            </p>
            {profit.status === 'incomplete' ? (
              <p className="text-xs text-slate-500">
                {lang === 'de'
                  ? 'Verkaufspreis und Einkaufspreis eingeben.'
                  : 'Enter selling price and product cost.'}
              </p>
            ) : (
              <dl className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt className="text-slate-500">{lang === 'de' ? 'eBay-Gebühren' : 'eBay fees'}</dt>
                  <dd className="font-medium text-slate-200">€{profit.ebay_fees.toFixed(2)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">{lang === 'de' ? 'Variable Kosten' : 'Variable costs'}</dt>
                  <dd className="font-medium text-slate-200">€{profit.variable_costs.toFixed(2)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">{lang === 'de' ? 'Deckungsbeitrag' : 'Contribution'}</dt>
                  <dd
                    className={`text-sm font-bold ${
                      profit.contribution >= 0 ? 'text-emerald-300' : 'text-rose-300'
                    }`}
                  >
                    €{profit.contribution.toFixed(2)}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">{lang === 'de' ? 'Marge' : 'Margin'}</dt>
                  <dd className="text-sm font-bold text-slate-100">
                    {profit.contribution_margin_pct.toFixed(1)}%
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-slate-500">
                    {lang === 'de' ? 'Max. Werbung / Auftrag' : 'Max ad spend / order'}
                  </dt>
                  <dd className="font-medium text-slate-200">
                    €{profit.max_ad_spend.toFixed(2)} · CAC-Ziel €
                    {profit.recommended_cac_low.toFixed(2)}–€{profit.recommended_cac_high.toFixed(2)}
                  </dd>
                </div>
              </dl>
            )}
          </div>
        </section>
      )}

      {tab === 'listing' && (
        <section className="space-y-3">
          <div className="premium-card space-y-3 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Search className="h-4 w-4 text-brand-300" />
                {lang === 'de' ? 'SEO / Artikelmerkmale' : 'SEO / item specifics'}
              </div>
              <span className="text-xs text-slate-400">{seo.score}/100</span>
            </div>
            {seo.title.recommended ? (
              <div className="rounded-lg border border-slate-700/80 bg-slate-900/50 px-3 py-2 text-xs">
                <p className="text-slate-500">
                  {lang === 'de' ? 'Titelvorschlag (nur aus Produktdaten)' : 'Title suggestion (product data only)'}
                </p>
                <p className="mt-1 text-slate-200">{seo.title.recommended}</p>
                <button
                  type="button"
                  onClick={applyRecommendedTitle}
                  className="mt-2 rounded-lg bg-slate-800 px-2.5 py-1.5 text-[11px] text-brand-200"
                >
                  {lang === 'de' ? 'Übernehmen' : 'Apply'}
                </button>
              </div>
            ) : null}
            {seo.missing.length ? (
              <div>
                <p className="mb-1 text-[11px] font-medium text-amber-300">
                  {lang === 'de' ? 'Fehlende Merkmale' : 'Missing specifics'}
                </p>
                <ul className="flex flex-wrap gap-1.5">
                  {seo.missing.map((m) => (
                    <li
                      key={m.id}
                      className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-200"
                    >
                      {lang === 'de' ? m.de : m.en}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-[11px] text-emerald-300">
                {lang === 'de' ? 'Kern-Artikelmerkmale befüllt' : 'Core item specifics filled'}
              </p>
            )}
            <ul className="space-y-1">
              {seo.checks.map((c) => (
                <li
                  key={c.id}
                  className={`text-[11px] ${c.ok ? 'text-emerald-300/90' : 'text-slate-400'}`}
                >
                  {c.ok ? '✓' : '○'} {lang === 'de' ? c.de : c.en}
                </li>
              ))}
            </ul>
          </div>

          {[
            ['titel', 'Titel', 'Title'],
            ['seo_titel', 'SEO-Titel', 'SEO title'],
            ['mobil_titel', 'Mobil-Titel', 'Mobile title'],
          ].map(([key, de, en]) => (
            <label key={key} className="premium-card block p-4 text-xs text-slate-400">
              {lang === 'de' ? de : en}
              <input
                value={session.listing[key] || ''}
                onChange={(e) => setListingField(key, e.target.value)}
                className="mt-1 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
              />
            </label>
          ))}
          {[
            ['kurzbeschreibung', 'Kurzbeschreibung', 'Short description'],
            ['produktbeschreibung', 'Produktbeschreibung', 'Product description'],
            ['masse_text', 'Maße', 'Dimensions'],
            ['material_text', 'Material', 'Material'],
            ['farbe_text', 'Farbe', 'Color'],
            ['montage_text', 'Montage', 'Assembly'],
            ['versand_text', 'Versand', 'Shipping'],
            ['kundenservice', 'Kundenservice', 'Customer service'],
          ].map(([key, de, en]) => (
            <label key={key} className="premium-card block p-4 text-xs text-slate-400">
              {lang === 'de' ? de : en}
              <textarea
                rows={key.includes('beschreibung') ? 5 : 2}
                value={session.listing[key] || ''}
                onChange={(e) => setListingField(key, e.target.value)}
                className="mt-1 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm leading-relaxed"
              />
            </label>
          ))}
          <label className="premium-card block p-4 text-xs text-slate-400">
            {lang === 'de' ? 'Vorteile (eine Zeile)' : 'Benefits (one per line)'}
            <textarea
              rows={5}
              value={(session.listing.vorteile || []).join('\n')}
              onChange={(e) =>
                setListingField(
                  'vorteile',
                  e.target.value
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
              className="mt-1 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
            />
          </label>
        </section>
      )}

      {tab === 'legal' && (
        <section className="space-y-3">
          <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-100">
            <Lock className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              {lang === 'de'
                ? 'Rechtstexte sind gesperrt für KI-Umschreibung. Nur freigegebene Vorlagen einfügen. Keine Rechtsberatung.'
                : 'Legal text is locked against AI rewriting. Insert approved templates only. Not legal advice.'}
            </p>
          </div>
          <button
            type="button"
            onClick={syncLegalFromBizStart}
            className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-200"
          >
            {lang === 'de'
              ? 'Aus Website-Rechtliches laden'
              : 'Load from Website Legal'}
          </button>
          {!legalModulesReady(session.legal) ? (
            <p className="text-xs text-amber-300">
              {lang === 'de'
                ? 'Impressum fehlt oder ist zu kurz — bitte ausfüllen oder aus BizStart laden.'
                : 'Impressum missing or too short — fill in or load from BizStart.'}
            </p>
          ) : null}
          {[
            ['impressum', 'Impressum'],
            ['widerrufsbelehrung', 'Widerrufsbelehrung'],
            ['widerrufsformular', 'Widerrufsformular'],
            ['rueckgabebedingungen', 'Rückgabebedingungen'],
            ['agb', 'AGB'],
            ['datenschutz', 'Datenschutz'],
          ].map(([key, label]) => (
            <label key={key} className="premium-card block p-4 text-xs text-slate-400">
              {label}
              <textarea
                rows={4}
                value={session.legal[key] || ''}
                onChange={(e) => setLegal({ [key]: e.target.value })}
                className="mt-1 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm font-mono leading-relaxed"
              />
            </label>
          ))}
        </section>
      )}

      {tab === 'review' && (
        <section className="space-y-4">
          <div
            className={`premium-card space-y-3 p-4 ${
              readiness.verdict === READINESS_VERDICT.READY
                ? 'border border-emerald-500/40'
                : readiness.verdict === READINESS_VERDICT.FIX
                  ? 'border border-rose-500/40'
                  : 'border border-amber-500/30'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <ReadinessBadge verdict={readiness.verdict} lang={lang} />
              <span className="text-lg font-bold text-slate-100">
                {readiness.total}
                <span className="text-sm font-normal text-slate-500">/100</span>
              </span>
            </div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Publish Readiness
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {readiness.parts.map((p) => (
                <div key={p.id} className="rounded-lg bg-slate-900/60 px-2.5 py-2">
                  <p className="text-[10px] text-slate-500">{lang === 'de' ? p.de : p.en}</p>
                  <p className="text-sm font-semibold text-slate-200">{p.score}</p>
                </div>
              ))}
            </div>
            {readiness.problems.length ? (
              <ul className="space-y-1.5">
                {readiness.problems.map((p) => (
                  <li
                    key={p.de}
                    className={`text-xs ${
                      p.severity === 'block' ? 'text-rose-300' : 'text-amber-200/90'
                    }`}
                  >
                    {p.severity === 'block' ? '❌' : '⚠'} {lang === 'de' ? p.de : p.en}
                  </li>
                ))}
              </ul>
            ) : null}
            {readiness.strengths.length ? (
              <ul className="space-y-1">
                {readiness.strengths.map((s) => (
                  <li key={s.de} className="text-xs text-emerald-300/90">
                    ✅ {lang === 'de' ? s.de : s.en}
                  </li>
                ))}
              </ul>
            ) : null}
            {session.human_approved ? (
              <p className="flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {lang === 'de' ? 'Menschlich freigegeben' : 'Human approved'}
              </p>
            ) : null}
          </div>

          <div className="premium-card space-y-3 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <StatusBadge status={session.compliance?.publish_status} lang={lang} />
              <span className="text-sm font-semibold text-slate-200">
                {lang === 'de' ? 'Copy-Score' : 'Copy score'} {session.score?.total ?? 0}/100
              </span>
            </div>

            {session.compliance?.blocked_reasons?.length ? (
              <div>
                <p className="mb-1 text-xs font-semibold text-rose-300">
                  {lang === 'de' ? 'Compliance-Blocker' : 'Compliance blockers'}
                </p>
                <ul className="space-y-1 text-xs text-rose-200/90">
                  {session.compliance.blocked_reasons.map((r) => (
                    <li key={r}>• {r}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {session.compliance?.missing?.length ? (
              <div>
                <p className="mb-1 text-xs font-semibold text-amber-300">
                  {lang === 'de' ? 'Fehlende Angaben' : 'Missing information'}
                </p>
                <ul className="space-y-1 text-xs text-slate-300">
                  {session.compliance.missing.map((r) => (
                    <li key={r}>• {r}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {session.compliance?.claims?.length ? (
              <ul className="space-y-2">
                {session.compliance.claims.map((c, i) => (
                  <ClaimRow key={`${c.claim}-${i}`} claim={c} />
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">
                {lang === 'de'
                  ? 'Noch keine Compliance-Ergebnisse — Generierung starten.'
                  : 'No compliance results yet — run generation.'}
              </p>
            )}
          </div>

          <div className="flex gap-1 rounded-xl bg-slate-900/80 p-1">
            <button
              type="button"
              onClick={() => setPreviewMode('customer')}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium ${
                previewMode === 'customer' ? 'bg-brand-600 text-white' : 'text-slate-400'
              }`}
            >
              {lang === 'de' ? 'Kundenlisting' : 'Customer listing'}
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('internal')}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium ${
                previewMode === 'internal' ? 'bg-brand-600 text-white' : 'text-slate-400'
              }`}
            >
              {lang === 'de' ? 'Interne Hinweise' : 'Internal notes'}
            </button>
          </div>

          <div className="premium-card prose-invert max-w-none p-4 text-sm text-slate-200">
            <SafeMarkdown>
              {(previewMode === 'customer' ? customerText : internalText).replace(/\n/g, '  \n')}
            </SafeMarkdown>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyOut}
              className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-xs font-medium"
            >
              <Copy className="h-3.5 w-3.5" />
              {lang === 'de' ? 'Kopieren' : 'Copy'}
            </button>
            <button
              type="button"
              onClick={downloadOut}
              className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-xs font-medium"
            >
              <Download className="h-3.5 w-3.5" />
              {lang === 'de' ? 'TXT Download' : 'TXT download'}
            </button>
            <button
              type="button"
              onClick={approve}
              className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600/90 px-3 py-2 text-xs font-semibold text-white"
            >
              <Shield className="h-3.5 w-3.5" />
              {lang === 'de' ? 'Freigeben' : 'Approve'}
            </button>
          </div>

          <AiLanguageBar language={language} onChange={setLanguage} className="mb-2" />
          <button
            type="button"
            disabled={busy}
            onClick={run}
            className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {lang === 'de' ? 'Erneut generieren' : 'Regenerate'}
          </button>
        </section>
      )}

      <div className="mt-6 flex items-center justify-between gap-2 border-t border-slate-800 pt-4">
        <button
          type="button"
          onClick={wipeData}
          className="flex items-center gap-1.5 text-xs text-rose-400/90"
        >
          <Trash2 className="h-3.5 w-3.5" />
          {lang === 'de' ? 'Alle Listing-Daten löschen' : 'Delete all listing data'}
        </button>
      </div>
    </div>
  )
}
