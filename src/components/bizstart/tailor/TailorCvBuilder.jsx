import { useCallback, useState } from 'react'
import {
  ArrowLeft,
  Upload,
  FileUser,
  ClipboardPaste,
  Loader2,
  Shield,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  CircleDot,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAiLanguage } from '@/context/AiLanguageContext'
import AiLanguageBar from '@/components/shared/AiLanguageBar'
import BewerbungNav from '@/components/bizstart/BewerbungNav'
import {
  loadTailorSession,
  saveTailorSession,
  deleteTailorData,
  remainingGenerations,
  DAILY_GENERATION_CAP,
  extractTextFromCvFile,
  CvParseError,
  lebenslaufToPlainText,
  runTailorPipeline,
  TONE_OPTIONS,
  getMaxUploadBytes,
  candidateToLebenslauf,
  coverLetterToAnschreiben,
} from '@/lib/tailorcv'
import { loadCv, saveCv } from '@/lib/bizstart/lebenslauf/store'
import { loadAnschreiben, saveAnschreiben } from '@/lib/bizstart/anschreiben/store'
import { syncBewerbungDocuments } from '@/lib/bizstart/bewerbungLink'

const PHASE_LABELS = {
  de: {
    parsing_cv: 'Lebenslauf wird analysiert…',
    parsing_job: 'Stellenanzeige wird analysiert…',
    analyzing: 'Abgleich & Lückenanalyse…',
    generating_cv: 'Zugeschnittener Lebenslauf wird erstellt…',
    generating_letter: 'Anschreiben wird geschrieben…',
  },
  en: {
    parsing_cv: 'Parsing CV…',
    parsing_job: 'Parsing job posting…',
    analyzing: 'Match & gap analysis…',
    generating_cv: 'Generating tailored CV…',
    generating_letter: 'Writing cover letter…',
  },
}

function MatchList({ title, items, tone, icon: Icon, emptyDe, emptyEn, lang }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3">
      <p className={`mb-2 flex items-center gap-2 text-xs font-semibold ${tone}`}>
        <Icon className="h-3.5 w-3.5" aria-hidden />
        {title}
        <span className="font-normal text-slate-500">({items?.length || 0})</span>
      </p>
      {items?.length ? (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={`${item.requirement}-${i}`} className="text-xs text-slate-300">
              <span className="font-medium text-slate-200">{item.requirement}</span>
              {item.evidence ? (
                <span className="mt-0.5 block text-[11px] text-slate-500">{item.evidence}</span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[11px] text-slate-500">{lang === 'de' ? emptyDe : emptyEn}</p>
      )}
    </div>
  )
}

export default function TailorCvBuilder({ formData, onUpdateForm, onBack, onNavigate }) {
  const { language, setLanguage } = useAiLanguage()
  const lang = language === 'en' ? 'en' : 'de'
  const [session, setSession] = useState(loadTailorSession)
  const [busy, setBusy] = useState(false)
  const [phase, setPhase] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  const persist = useCallback((patch) => {
    const next = saveTailorSession(patch)
    setSession(next)
    return next
  }, [])

  const setJob = (patch) => {
    persist({ job_input: { ...session.job_input, ...patch } })
  }

  const loadFromLebenslauf = () => {
    const cv = loadCv()
    const text = lebenslaufToPlainText(cv)
    if (!text || text.length < 40) {
      toast.error(
        lang === 'de'
          ? 'Lebenslauf ist noch zu leer — zuerst im Lebenslauf-Builder ausfüllen.'
          : 'CV is still too empty — fill it in the CV builder first.'
      )
      return
    }
    persist({
      source: 'lebenslauf',
      raw_cv_text: text,
      source_filename: 'Lebenslauf (BizStart)',
      phase: 'input',
      error: '',
    })
    toast.success(lang === 'de' ? 'Lebenslauf übernommen' : 'CV imported')
  }

  const onFile = async (file) => {
    if (!file) return
    try {
      const { text, filename } = await extractTextFromCvFile(file)
      persist({
        source: 'upload',
        raw_cv_text: text,
        source_filename: filename,
        phase: 'input',
        error: '',
      })
      toast.success(lang === 'de' ? 'Datei gelesen' : 'File read')
    } catch (err) {
      const msg =
        err instanceof CvParseError
          ? err.message
          : lang === 'de'
            ? 'Datei konnte nicht gelesen werden.'
            : 'Could not read file.'
      toast.error(msg)
    }
  }

  const wipeData = () => {
    const empty = deleteTailorData()
    setSession(empty)
    toast.success(lang === 'de' ? 'TailorCV-Daten gelöscht' : 'TailorCV data deleted')
  }

  const applyToBuilders = (result, jobInput) => {
    const baseCv = loadCv()
    const nextCv = candidateToLebenslauf(result.tailored_cv, baseCv, jobInput)
    saveCv(nextCv)
    const baseLetter = loadAnschreiben()
    const nextLetter = coverLetterToAnschreiben(result.cover_letter.body, jobInput, {
      ...baseLetter,
      vorname: nextCv.vorname || baseLetter.vorname,
      nachname: nextCv.nachname || baseLetter.nachname,
      email: nextCv.email || baseLetter.email,
      telefon: nextCv.telefon || baseLetter.telefon,
      strasse: nextCv.strasse || baseLetter.strasse,
      plz: nextCv.plz || baseLetter.plz,
      stadt: nextCv.stadt || baseLetter.stadt,
      unterschriftName: nextCv.unterschriftName || `${nextCv.vorname} ${nextCv.nachname}`.trim(),
    })
    saveAnschreiben(nextLetter)
    if (onUpdateForm) {
      onUpdateForm(syncBewerbungDocuments(formData, { cv: nextCv, anschreiben: nextLetter }))
    }
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
    if (!session.raw_cv_text?.trim()) {
      toast.error(lang === 'de' ? 'CV-Text fehlt.' : 'CV text is required.')
      return
    }
    if (!session.job_input.job_description?.trim() || !session.job_input.job_title?.trim()) {
      toast.error(
        lang === 'de'
          ? 'Stellenbezeichnung und Stellenbeschreibung sind Pflicht.'
          : 'Job title and description are required.'
      )
      return
    }

    setBusy(true)
    setPhase('parsing_cv')
    try {
      const result = await runTailorPipeline({
        rawCvText: session.raw_cv_text,
        jobInput: session.job_input,
        language: lang,
        onPhase: setPhase,
      })
      const next = persist({
        ...result,
        phase: 'review',
        error: '',
      })
      applyToBuilders(result, next.job_input)
      toast.success(
        lang === 'de'
          ? 'Entwurf erstellt — bitte prüfen und im Lebenslauf/Anschreiben nachbearbeiten.'
          : 'Draft ready — review and edit in CV / cover letter builders.'
      )
    } catch (err) {
      const message = err?.message || (lang === 'de' ? 'Generierung fehlgeschlagen.' : 'Generation failed.')
      persist({ phase: 'error', error: message })
      toast.error(message)
    } finally {
      setBusy(false)
      setPhase(null)
    }
  }

  const gap = session.gap_analysis || {}
  const left = remainingGenerations()
  const isReview = session.phase === 'review'

  return (
    <div className="w-full pb-24">
      <button
        type="button"
        onClick={onBack}
        className="safe-top mb-2 flex items-center gap-2 text-sm text-slate-400"
      >
        <ArrowLeft className="h-4 w-4" />
        {lang === 'de' ? 'BizStart' : 'BizStart'}
      </button>

      {onNavigate && <BewerbungNav current="tailorcv" onNavigate={onNavigate} lang={lang} />}

      <header className="mb-4">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-400" />
          <h1 className="text-xl font-bold">
            {lang === 'de' ? 'TailorCV — Stellen-Zuschnitt' : 'TailorCV — Job tailoring'}
          </h1>
        </div>
        <p className="text-sm text-slate-400">
          {lang === 'de'
            ? 'Tabellarischer deutscher Lebenslauf + DIN-Anschreiben — zugeschnitten auf die Stelle, ohne erfundene Erfahrung. Entwurf zur Prüfung.'
            : 'German tabular Lebenslauf + DIN cover letter — tailored to the role, no invented experience. Always review before export.'}
        </p>
      </header>

      <AiLanguageBar language={language} onChange={setLanguage} className="mb-4" />

      {/* Privacy */}
      <div className="premium-card mb-4 border border-amber-500/20 bg-amber-500/5 p-4">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-200">
          <Shield className="h-4 w-4" />
          {lang === 'de' ? 'Datenschutz' : 'Privacy'}
        </p>
        <p className="mb-3 text-xs leading-relaxed text-slate-400">
          {lang === 'de'
            ? 'CV- und Stellendaten werden nur für diese Anfrage an die KI-API (Anthropic, Server-Proxy) gesendet — nicht für Modell-Training durch ScanLogic genutzt und nicht an Dritte weitergegeben. Daten liegen lokal in Ihrem Browser und können jederzeit gelöscht werden.'
            : 'CV and job text are sent only for this request to the AI API (Anthropic via server proxy) — not used by ScanLogic for model training and not shared with third parties. Data stays in your browser and can be deleted anytime.'}
        </p>
        <label className="flex cursor-pointer items-start gap-2 text-xs text-slate-300">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={!!session.privacy_acknowledged}
            onChange={(e) => persist({ privacy_acknowledged: e.target.checked })}
          />
          <span>
            {lang === 'de'
              ? 'Ich verstehe, dass Inhalte zur Generierung an die KI-API gesendet werden.'
              : 'I understand content is sent to the AI API for generation.'}
          </span>
        </label>
        <button
          type="button"
          onClick={wipeData}
          className="mt-3 flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300"
        >
          <Trash2 className="h-3.5 w-3.5" />
          {lang === 'de' ? 'Meine TailorCV-Daten löschen' : 'Delete my TailorCV data'}
        </button>
      </div>

      {/* CV source */}
      <section className="premium-card mb-4 p-4">
        <h2 className="mb-3 text-sm font-semibold">
          {lang === 'de' ? '1. Lebenslauf-Quelle' : '1. CV source'}
        </h2>
        <div className="mb-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadFromLebenslauf}
            className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            <FileUser className="h-3.5 w-3.5" />
            {lang === 'de' ? 'Aus Lebenslauf-Builder' : 'From CV builder'}
          </button>
          <label className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700">
            <Upload className="h-3.5 w-3.5" />
            {lang === 'de' ? 'PDF / DOCX / TXT' : 'PDF / DOCX / TXT'}
            <input
              type="file"
              accept=".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </label>
        </div>

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
          className={`mb-3 rounded-xl border border-dashed p-4 text-center text-xs ${
            dragOver ? 'border-brand-400 bg-brand-500/10' : 'border-slate-600 text-slate-500'
          }`}
        >
          <ClipboardPaste className="mx-auto mb-1 h-5 w-5 opacity-60" />
          {lang === 'de'
            ? `Datei hier ablegen (max. ${Math.round(getMaxUploadBytes() / (1024 * 1024))} MB) oder unten Text einfügen`
            : `Drop a file here (max ${Math.round(getMaxUploadBytes() / (1024 * 1024))} MB) or paste text below`}
        </div>

        {session.source_filename ? (
          <p className="mb-2 text-[11px] text-brand-300">
            {lang === 'de' ? 'Quelle:' : 'Source:'} {session.source_filename}
          </p>
        ) : null}

        <textarea
          value={session.raw_cv_text || ''}
          onChange={(e) =>
            persist({ raw_cv_text: e.target.value, source: 'paste', phase: 'input' })
          }
          rows={8}
          placeholder={
            lang === 'de'
              ? 'Lebenslauf-Text hier einfügen…'
              : 'Paste CV text here…'
          }
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600"
        />
      </section>

      {/* Job */}
      <section className="premium-card mb-4 p-4">
        <h2 className="mb-3 text-sm font-semibold">
          {lang === 'de' ? '2. Zielstelle' : '2. Target role'}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs text-slate-400">
            {lang === 'de' ? 'Stellenbezeichnung *' : 'Job title *'}
            <input
              value={session.job_input.job_title || ''}
              onChange={(e) => setJob({ job_title: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
            />
          </label>
          <label className="block text-xs text-slate-400">
            {lang === 'de' ? 'Unternehmen' : 'Company'}
            <input
              value={session.job_input.company || ''}
              onChange={(e) => setJob({ company: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
            />
          </label>
        </div>
        <label className="mt-3 block text-xs text-slate-400">
          {lang === 'de' ? 'Stellenbeschreibung *' : 'Job description *'}
          <textarea
            value={session.job_input.job_description || ''}
            onChange={(e) => setJob({ job_description: e.target.value })}
            rows={8}
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
            placeholder={lang === 'de' ? 'Anzeige / Anforderungsprofil einfügen…' : 'Paste the job ad…'}
          />
        </label>
        <label className="mt-3 block text-xs text-slate-400">
          {lang === 'de' ? 'Zusätzliche Hinweise' : 'Extra notes'}
          <textarea
            value={session.job_input.notes || ''}
            onChange={(e) => setJob({ notes: e.target.value })}
            rows={2}
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
            placeholder={
              lang === 'de'
                ? 'z. B. Führung betonen, 1 Seite, Umzug aus …'
                : 'e.g. emphasize leadership, 1 page, relocating from…'
            }
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-3">
          <label className="text-xs text-slate-400">
            {lang === 'de' ? 'Ton' : 'Tone'}
            <select
              value={session.job_input.tone || 'formal'}
              onChange={(e) => setJob({ tone: e.target.value })}
              className="mt-1 block rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
            >
              {TONE_OPTIONS.map((t) => (
                <option key={t.id} value={t.id}>
                  {lang === 'de' ? t.labelDe : t.labelEn}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-slate-400">
            {lang === 'de' ? 'Seiten (Ziel)' : 'Pages (target)'}
            <select
              value={session.job_input.page_length || 1}
              onChange={(e) => setJob({ page_length: Number(e.target.value) })}
              className="mt-1 block rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </label>
        </div>
      </section>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={run}
          className="btn-primary flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {busy
            ? PHASE_LABELS[lang][phase] || (lang === 'de' ? 'Arbeitet…' : 'Working…')
            : lang === 'de'
              ? 'Analysieren & zuschneiden'
              : 'Analyze & tailor'}
        </button>
        <p className="text-[11px] text-slate-500">
          {lang === 'de'
            ? `${left} / ${DAILY_GENERATION_CAP} Generierungen heute`
            : `${left} / ${DAILY_GENERATION_CAP} generations today`}
        </p>
      </div>

      {session.error ? (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {session.error}
        </div>
      ) : null}

      {isReview ? (
        <>
          <section className="mb-4 space-y-3">
            <h2 className="text-sm font-semibold">
              {lang === 'de' ? '3. Abgleich' : '3. Match analysis'}
            </h2>
            {gap.summary ? (
              <p className="rounded-xl border border-slate-700 bg-slate-900/50 p-3 text-xs text-slate-300">
                {gap.summary}
              </p>
            ) : null}
            <div className="grid gap-3 md:grid-cols-3">
              <MatchList
                lang={lang}
                title={lang === 'de' ? 'Passend' : 'Matched'}
                items={gap.matches}
                tone="text-emerald-400"
                icon={CheckCircle2}
                emptyDe="Keine Treffer"
                emptyEn="No matches"
              />
              <MatchList
                lang={lang}
                title={lang === 'de' ? 'Teilweise' : 'Partial'}
                items={gap.partial}
                tone="text-amber-400"
                icon={CircleDot}
                emptyDe="Keine"
                emptyEn="None"
              />
              <MatchList
                lang={lang}
                title={lang === 'de' ? 'Fehlt (ehrlich)' : 'Missing (honest)'}
                items={gap.missing}
                tone="text-red-400"
                icon={AlertTriangle}
                emptyDe="Keine Lücken erkannt"
                emptyEn="No gaps flagged"
              />
            </div>
          </section>

          {session.change_summary ? (
            <section className="premium-card mb-4 p-4">
              <h2 className="mb-2 text-sm font-semibold">
                {lang === 'de' ? 'Was wir betont haben' : 'What we emphasized'}
              </h2>
              <p className="whitespace-pre-wrap text-xs text-slate-300">{session.change_summary}</p>
            </section>
          ) : null}

          {session.fabrication_flags?.length > 0 ? (
            <section className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
              <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-200">
                <AlertTriangle className="h-4 w-4" />
                {lang === 'de' ? 'Bitte prüfen' : 'Please verify'}
              </h2>
              <ul className="space-y-1 text-xs text-amber-100/90">
                {session.fabrication_flags.map((f, i) => (
                  <li key={`${f.type}-${i}`}>{f.message}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="premium-card mb-4 p-4">
            <h2 className="mb-2 text-sm font-semibold">
              {lang === 'de' ? 'Anschreiben (Entwurf)' : 'Cover letter (draft)'}
            </h2>
            <p className="mb-2 text-[11px] text-slate-500">
              {session.cover_letter?.word_count || 0}{' '}
              {lang === 'de' ? 'Wörter' : 'words'}
            </p>
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-950 p-3 text-xs text-slate-300">
              {session.cover_letter?.body || '—'}
            </pre>
          </section>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onNavigate?.('lebenslauf')}
              className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white"
            >
              {lang === 'de' ? 'Im Lebenslauf prüfen' : 'Review in CV builder'}
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.('anschreiben')}
              className="rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200"
            >
              {lang === 'de' ? 'Im Anschreiben prüfen' : 'Review in cover letter'}
            </button>
          </div>
        </>
      ) : null}
    </div>
  )
}
