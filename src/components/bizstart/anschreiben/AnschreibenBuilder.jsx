import { useCallback, useEffect, useRef, useState } from 'react'
import { Save, RotateCcw, Printer, FileDown, FileText, Eye, Edit3, Sparkles, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { bpT } from '@/lib/bizstart/businessPlanI18n'
import { ScanLogicAiOverlay } from '@/components/bizstart/ScanLogicAiTextarea'
import BewerbungNav from '@/components/bizstart/BewerbungNav'
import AnschreibenForm from './AnschreibenForm'
import AnschreibenPreview from './AnschreibenPreview'
import {
  loadAnschreiben,
  saveAnschreiben,
  resetAnschreiben,
  anschreibenSavedAt,
  importAnschreibenFromCv,
  importAnschreibenFromBizStart,
} from '@/lib/bizstart/anschreiben/store'
import { loadCv } from '@/lib/bizstart/lebenslauf/store'
import { anschreibenIsSubmissionReady } from '@/lib/bizstart/anschreiben/schema'
import {
  applyAnschreibenFieldValue,
  countPolishableAnschreibenFields,
  getAnschreibenFieldValue,
  isAnschreibenAiComplete,
  polishAnschreiben,
  rewriteAnschreibenField,
  generateFullAnschreibenDraft,
  listPolishableAnschreibenFields,
} from '@/lib/bizstart/anschreiben/anschreibenAi'
import { downloadAnschreibenPdf } from '@/lib/bizstart/anschreiben/exportPdf'
import { downloadAnschreibenWord } from '@/lib/bizstart/anschreiben/exportWord'
import { syncBewerbungDocuments } from '@/lib/bizstart/bewerbungLink'
import { hasAnschreibenUserData } from '@/lib/bizstart/bewerbungTemplate'
import './anschreiben.css'

const LANG = 'de'
const AUTOSAVE_MS = 30_000

export default function AnschreibenBuilder({ formData, onUpdateForm, onBack, onNavigate }) {
  const [a, setA] = useState(loadAnschreiben)
  const [savedLabel, setSavedLabel] = useState(() => anschreibenSavedAt(loadAnschreiben()))
  const [mobileView, setMobileView] = useState('form')
  const [resetOpen, setResetOpen] = useState(false)
  const [aiLoading, setAiLoading] = useState(null)
  const [aiProgress, setAiProgress] = useState({ current: 0, total: 0 })
  const [aiFieldLabel, setAiFieldLabel] = useState('')
  const printRef = useRef(null)
  const aRef = useRef(a)
  aRef.current = a

  const persist = useCallback(
    (next, { silent = false, syncPlan = true } = {}) => {
      const saved = saveAnschreiben(next)
      setA(saved)
      setSavedLabel(anschreibenSavedAt(saved))
      if (syncPlan && onUpdateForm) {
        onUpdateForm(syncBewerbungDocuments(formData, { cv: loadCv(), anschreiben: saved }))
      }
      if (!silent) toast.success('Anschreiben gespeichert')
      return saved
    },
    [formData, onUpdateForm]
  )

  useEffect(() => {
    const id = setInterval(() => {
      persist(aRef.current, { silent: true, syncPlan: true })
    }, AUTOSAVE_MS)
    return () => clearInterval(id)
  }, [persist])

  const onAiFieldChange = useCallback((fieldKey, value) => {
    setA((prev) => {
      const polished = { ...(prev.anschreibenAiPolished || {}) }
      delete polished[fieldKey]
      const next = applyAnschreibenFieldValue(prev, fieldKey, value)
      return { ...next, anschreibenAiPolished: polished, anschreibenAiComplete: false }
    })
  }, [])

  const onSimpleChange = useCallback((patch) => {
    setA((prev) => ({ ...prev, ...patch }))
  }, [])

  const rewriteField = useCallback(
    async (fieldKey, fieldTitle) => {
      const current = aRef.current
      const text = getAnschreibenFieldValue(current, fieldKey)
      if (!text?.trim()) {
        toast.error(bpT(LANG, 'aiEmptyField'))
        return
      }
      setAiLoading(fieldKey)
      try {
        const rewritten = await rewriteAnschreibenField({
          lang: LANG,
          fieldTitle,
          text,
          a: current,
          formData,
          fieldKey,
        })
        setA((prev) => ({
          ...applyAnschreibenFieldValue(prev, fieldKey, rewritten),
          anschreibenAiPolished: { ...(prev.anschreibenAiPolished || {}), [fieldKey]: true },
        }))
        toast.success(bpT(LANG, 'aiRewritten'))
      } catch {
        toast.error(bpT(LANG, 'aiFailed'))
      } finally {
        setAiLoading(null)
      }
    },
    [formData]
  )

  const polishAll = useCallback(async () => {
    const current = aRef.current
    const total = countPolishableAnschreibenFields(current)
    if (!total) {
      toast.error(bpT(LANG, 'aiEmptyField'))
      return false
    }
    setAiLoading('all')
    setAiProgress({ current: 0, total })
    try {
      let done = 0
      const polished = await polishAnschreiben(current, LANG, formData, {
        onFieldDone: (_k, title) => {
          done += 1
          setAiFieldLabel(title)
          setAiProgress({ current: done, total })
        },
      })
      setA(polished)
      toast.success(bpT(LANG, 'aiPolishComplete'))
      return true
    } catch {
      toast.error(bpT(LANG, 'aiFailed'))
      return false
    } finally {
      setAiLoading(null)
      setAiFieldLabel('')
    }
  }, [formData])

  const handleGenerateDraft = useCallback(async () => {
    setAiLoading('draft')
    try {
      const draft = await generateFullAnschreibenDraft(aRef.current, formData, LANG)
      setA((prev) => ({ ...draft, anschreibenAiPolished: prev.anschreibenAiPolished }))
      toast.success('Entwurf erstellt — bitte prüfen und mit ScanLogic AI verfeinern')
    } catch {
      toast.error(bpT(LANG, 'aiFailed'))
    } finally {
      setAiLoading(null)
    }
  }, [formData])

  const ensurePolished = useCallback(async () => {
    const current = aRef.current
    if (isAnschreibenAiComplete(current) || countPolishableAnschreibenFields(current) === 0) {
      return current
    }
    const ok = await polishAll()
    return ok ? aRef.current : null
  }, [polishAll])

  const handlePdf = async () => {
    if (!hasAnschreibenUserData(aRef.current)) {
      toast.error('Bitte zuerst Ihre eigenen Daten eintragen — die Vorschau zeigt nur Platzhalter.')
      return
    }
    toast.message('ScanLogic AI bereitet Ihr Anschreiben vor …')
    const merged = await ensurePolished()
    if (!merged) return
    persist(merged, { silent: true })
    downloadAnschreibenPdf(merged)
    toast.success('PDF heruntergeladen')
  }

  const handleWord = async () => {
    if (!hasAnschreibenUserData(aRef.current)) {
      toast.error('Bitte zuerst Ihre eigenen Daten eintragen — die Vorschau zeigt nur Platzhalter.')
      return
    }
    toast.message('ScanLogic AI bereitet Ihr Anschreiben vor …')
    const merged = await ensurePolished()
    if (!merged) return
    persist(merged, { silent: true })
    downloadAnschreibenWord(merged)
    toast.success('Word-Datei heruntergeladen')
  }

  const aiFieldProps = useCallback(
    (fieldKey, fieldTitle, rows, placeholder) => ({
      lang: LANG,
      value: getAnschreibenFieldValue(a, fieldKey),
      onChange: (v) => onAiFieldChange(fieldKey, v),
      onRewrite: () => rewriteField(fieldKey, fieldTitle),
      loading: aiLoading === fieldKey,
      polished: !!a.anschreibenAiPolished?.[fieldKey],
      rows,
      placeholder,
    }),
    [a, aiLoading, onAiFieldChange, rewriteField]
  )

  const ready = anschreibenIsSubmissionReady(a)
  const aiDone = isAnschreibenAiComplete(a)

  return (
    <div className="ansch-builder-root pb-24 md:pb-6">
      {aiLoading === 'all' && <ScanLogicAiOverlay lang={LANG} fieldLabel={aiFieldLabel} progress={aiProgress} />}
      {aiLoading === 'draft' && <ScanLogicAiOverlay lang={LANG} fieldLabel="Anschreiben-Entwurf" progress={null} />}

      <header className="ansch-builder-header sticky top-0 z-20 border-b border-slate-200/80 bg-slate-950/95 backdrop-blur-md safe-top">
        <div className="px-3 py-3 sm:px-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              {onBack && (
                <button type="button" onClick={onBack} className="mb-1 text-xs text-slate-400 hover:text-brand-300">
                  ← BizStart
                </button>
              )}
              <h1 className="text-lg font-bold text-white">Anschreiben-Builder</h1>
              <p className="text-[11px] text-slate-400">
                DIN 5008 — tabellarisches Anschreiben für Job, Förderung & Gründung
                {savedLabel && <> · Gespeichert: {savedLabel}</>}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => persist(a)} className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white">
                <Save className="h-3.5 w-3.5" /> Speichern
              </button>
              <button type="button" onClick={() => setResetOpen(true)} className="flex items-center gap-1.5 rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-400">
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
              <button type="button" onClick={() => setMobileView((v) => (v === 'form' ? 'preview' : 'form'))} className="flex items-center gap-1.5 rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-200 md:hidden">
                {mobileView === 'form' ? <><Eye className="h-3.5 w-3.5" /> Vorschau</> : <><Edit3 className="h-3.5 w-3.5" /> Formular</>}
              </button>
            </div>
          </div>
          {ready && (
            <p className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-300">
              Einreichungsreif — zusammen mit Lebenslauf & Businessplan für Bewerbung, Förderung oder Wettbewerb.
            </p>
          )}
        </div>
      </header>

      <div className="px-3 pt-3 sm:px-4">
        {onNavigate && <BewerbungNav current="anschreiben" onNavigate={onNavigate} />}
      </div>

      <div className="ansch-split">
        <aside className={`ansch-form-panel ${mobileView === 'preview' ? 'ansch-panel-hidden-mobile' : ''}`}>
          <div className="mb-4 rounded-2xl border border-brand-300/80 bg-gradient-to-r from-brand-50 to-indigo-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-600" aria-hidden />
              <p className="text-sm font-bold text-brand-900">ScanLogic AI</p>
            </div>
            <p className="text-xs text-slate-600">{bpT(LANG, 'aiPolishAllHint')}</p>
            <button type="button" onClick={polishAll} disabled={!!aiLoading || countPolishableAnschreibenFields(a) === 0} className="btn-primary mt-3 w-full rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50">
              {aiLoading === 'all' ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> {bpT(LANG, 'aiPolishingAll')}</span> : bpT(LANG, 'aiPolishAll')}
            </button>
            {aiDone && (
              <p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                {bpT(LANG, 'aiPolishComplete')}
              </p>
            )}
          </div>
          <AnschreibenForm
            a={a}
            onChange={onSimpleChange}
            onImportCv={() => { const n = importAnschreibenFromCv(); setA(n); toast.success('Aus Lebenslauf übernommen') }}
            onImportBizStart={() => { const n = importAnschreibenFromBizStart(formData || {}); setA(n); toast.success('Aus BizStart übernommen') }}
            aiFieldProps={aiFieldProps}
            onGenerateDraft={handleGenerateDraft}
            generatingDraft={aiLoading === 'draft'}
          />
        </aside>
        <section className={`ansch-preview-panel ${mobileView === 'form' ? 'ansch-panel-hidden-mobile' : ''}`}>
          <div className="ansch-export-toolbar no-print">
            <button type="button" onClick={() => window.print()} className="ansch-export-btn"><Printer className="h-4 w-4" /> Drucken</button>
            <button type="button" onClick={handlePdf} disabled={!!aiLoading} className="ansch-export-btn"><FileDown className="h-4 w-4" /> PDF</button>
            <button type="button" onClick={handleWord} disabled={!!aiLoading} className="ansch-export-btn"><FileText className="h-4 w-4" /> Word</button>
          </div>
          <div className="ansch-preview-scroll">
            <AnschreibenPreview a={a} printRef={printRef} />
          </div>
        </section>
      </div>

      {resetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 p-5 shadow-xl ring-1 ring-slate-700">
            <h2 className="text-base font-bold text-white">Anschreiben zurücksetzen?</h2>
            <p className="mt-2 text-sm text-slate-400">Alle Eingaben werden gelöscht.</p>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setResetOpen(false)} className="flex-1 rounded-xl border border-slate-600 py-2 text-sm text-slate-300">Abbrechen</button>
              <button type="button" onClick={() => { setA(resetAnschreiben()); setResetOpen(false); toast.message('Zurückgesetzt') }} className="flex-1 rounded-xl bg-red-600 py-2 text-sm font-semibold text-white">Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
