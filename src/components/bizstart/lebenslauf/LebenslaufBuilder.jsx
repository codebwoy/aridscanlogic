import { useCallback, useEffect, useRef, useState } from 'react'
import { Save, RotateCcw, Printer, FileDown, FileText, Eye, Edit3, Sparkles, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { bpT } from '@/lib/bizstart/businessPlanI18n'
import { ScanLogicAiOverlay } from '@/components/bizstart/ScanLogicAiTextarea'
import LebenslaufForm from './LebenslaufForm'
import LebenslaufPreview from './LebenslaufPreview'
import { loadCv, saveCv, resetCv, cvSavedAt, importCvFromBizStart } from '@/lib/bizstart/lebenslauf/store'
import { cvDisplayName, cvIsSubmissionReady } from '@/lib/bizstart/lebenslauf/schema'
import {
  applyCvFieldValue,
  countPolishableCvFields,
  getCvFieldValue,
  isCvAiComplete,
  polishLebenslaufCv,
  rewriteLebenslaufField,
  generateCvProfil,
  listPolishableCvFields,
} from '@/lib/bizstart/lebenslauf/lebenslaufAi'
import { downloadLebenslaufPdf } from '@/lib/bizstart/lebenslauf/exportPdf'
import { downloadLebenslaufWord } from '@/lib/bizstart/lebenslauf/exportWord'
import { syncBusinessPlanAnnexesWithCv } from '@/lib/bizstart/lebenslauf/businessPlanLink'
import './lebenslauf.css'

const LANG = 'de'
const AUTOSAVE_MS = 30_000

export default function LebenslaufBuilder({ formData, onUpdateForm, onBack }) {
  const [cv, setCv] = useState(loadCv)
  const [savedLabel, setSavedLabel] = useState(() => cvSavedAt(loadCv()))
  const [mobileView, setMobileView] = useState('form')
  const [resetOpen, setResetOpen] = useState(false)
  const [aiLoading, setAiLoading] = useState(null)
  const [aiProgress, setAiProgress] = useState({ current: 0, total: 0 })
  const [aiFieldLabel, setAiFieldLabel] = useState('')
  const printRef = useRef(null)
  const cvRef = useRef(cv)
  cvRef.current = cv

  const persist = useCallback(
    (next, { silent = false, syncPlan = true } = {}) => {
      const saved = saveCv(next)
      setCv(saved)
      setSavedLabel(cvSavedAt(saved))
      if (syncPlan && onUpdateForm) {
        onUpdateForm(syncBusinessPlanAnnexesWithCv(formData, saved))
      }
      if (!silent) toast.success('Lebenslauf gespeichert')
      return saved
    },
    [formData, onUpdateForm]
  )

  useEffect(() => {
    const id = setInterval(() => {
      persist(cvRef.current, { silent: true, syncPlan: true })
    }, AUTOSAVE_MS)
    return () => clearInterval(id)
  }, [persist])

  const onAiFieldChange = useCallback((fieldKey, value) => {
    setCv((prev) => {
      const polished = { ...(prev.cvAiPolished || {}) }
      delete polished[fieldKey]
      const next = applyCvFieldValue(prev, fieldKey, value)
      return { ...next, cvAiPolished: polished, cvAiComplete: false }
    })
  }, [])

  const onSimpleChange = useCallback((patch) => {
    setCv((prev) => ({ ...prev, ...patch }))
  }, [])

  const rewriteField = useCallback(
    async (fieldKey, fieldTitle) => {
      const current = cvRef.current
      const text = getCvFieldValue(current, fieldKey)
      if (!text?.trim()) {
        toast.error(bpT(LANG, 'aiEmptyField'))
        return
      }
      setAiLoading(fieldKey)
      try {
        const rewritten = await rewriteLebenslaufField({
          lang: LANG,
          fieldTitle,
          text,
          cv: current,
          formData,
          fieldKey,
        })
        setCv((prev) => ({
          ...applyCvFieldValue(prev, fieldKey, rewritten),
          cvAiPolished: { ...(prev.cvAiPolished || {}), [fieldKey]: true },
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
    const current = cvRef.current
    const total = countPolishableCvFields(current)
    if (!total) {
      toast.error(bpT(LANG, 'aiEmptyField'))
      return false
    }
    setAiLoading('all')
    setAiProgress({ current: 0, total })
    try {
      let done = 0
      const polished = await polishLebenslaufCv(current, LANG, formData, {
        onFieldDone: (_key, title) => {
          done += 1
          setAiFieldLabel(title)
          setAiProgress({ current: done, total })
        },
      })
      setCv(polished)
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

  const handleGenerateProfil = useCallback(async () => {
    setAiLoading('profil-gen')
    try {
      const text = await generateCvProfil(cvRef.current, formData, LANG)
      if (!text?.trim()) {
        toast.error(bpT(LANG, 'aiFailed'))
        return
      }
      setCv((prev) => ({
        ...prev,
        profil: text,
        cvAiPolished: { ...(prev.cvAiPolished || {}), profil: true },
        cvAiComplete: false,
      }))
      toast.success('Profil von ScanLogic AI erstellt — bitte prüfen')
    } catch {
      toast.error(bpT(LANG, 'aiFailed'))
    } finally {
      setAiLoading(null)
    }
  }, [formData])

  const ensurePolished = useCallback(async () => {
    const current = cvRef.current
    if (isCvAiComplete(current) || countPolishableCvFields(current) === 0) {
      return current
    }
    const ok = await polishAll()
    return ok ? cvRef.current : null
  }, [polishAll])

  const handleImport = () => {
    const merged = importCvFromBizStart(formData || {})
    setCv(merged)
    setSavedLabel(cvSavedAt(merged))
    toast.success('BizStart-Daten übernommen')
  }

  const handleReset = () => {
    const fresh = resetCv()
    setCv(fresh)
    setSavedLabel(null)
    setResetOpen(false)
    if (onUpdateForm) onUpdateForm(syncBusinessPlanAnnexesWithCv(formData, fresh))
    toast.message('Lebenslauf zurückgesetzt')
  }

  const handlePrint = () => window.print()

  const handlePdf = async () => {
    if (!cvDisplayName(cv)) {
      toast.error('Bitte Vor- und Nachname ausfüllen.')
      return
    }
    toast.message('ScanLogic AI bereitet Texte für den Export vor …')
    const merged = await ensurePolished()
    if (!merged) return
    persist(merged, { silent: true })
    downloadLebenslaufPdf(merged)
    toast.success('PDF heruntergeladen')
  }

  const handleWord = async () => {
    if (!cvDisplayName(cv)) {
      toast.error('Bitte Vor- und Nachname ausfüllen.')
      return
    }
    toast.message('ScanLogic AI bereitet Texte für den Export vor …')
    const merged = await ensurePolished()
    if (!merged) return
    persist(merged, { silent: true })
    downloadLebenslaufWord(merged)
    toast.success('Word-Datei heruntergeladen')
  }

  const aiFieldProps = useCallback(
    (fieldKey, fieldTitle, rows, placeholder) => ({
      lang: LANG,
      value: getCvFieldValue(cv, fieldKey),
      onChange: (v) => onAiFieldChange(fieldKey, v),
      onRewrite: () => rewriteField(fieldKey, fieldTitle),
      loading: aiLoading === fieldKey,
      polished: !!cv.cvAiPolished?.[fieldKey],
      rows,
      placeholder,
    }),
    [cv, aiLoading, onAiFieldChange, rewriteField]
  )

  const ready = cvIsSubmissionReady(cv)
  const aiDone = isCvAiComplete(cv)
  const polishCount = countPolishableCvFields(cv)

  return (
    <div className="cv-builder-root pb-24 md:pb-6">
      {aiLoading === 'all' && <ScanLogicAiOverlay lang={LANG} fieldLabel={aiFieldLabel} progress={aiProgress} />}
      {(aiLoading === 'profil-gen') && (
        <ScanLogicAiOverlay lang={LANG} fieldLabel="Profil" progress={null} />
      )}

      <header className="cv-builder-header sticky top-0 z-20 border-b border-slate-200/80 bg-slate-950/95 backdrop-blur-md safe-top">
        <div className="px-3 py-3 sm:px-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              {onBack && (
                <button type="button" onClick={onBack} className="mb-1 text-xs text-slate-400 hover:text-brand-300">
                  ← BizStart
                </button>
              )}
              <h1 className="text-lg font-bold text-white">Lebenslauf-Builder</h1>
              <p className="text-[11px] text-slate-400">
                Tabellarischer Lebenslauf nach deutscher Bewerbungskonvention
                {savedLabel && <> · Gespeichert: {savedLabel}</>}
              </p>
              {aiDone && polishCount > 0 && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-brand-300">
                  <Sparkles className="h-3 w-3" aria-hidden />
                  ScanLogic AI — {bpT(LANG, 'aiPolishComplete')}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => persist(cv)}
                className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-500"
              >
                <Save className="h-3.5 w-3.5" /> Speichern
              </button>
              <button
                type="button"
                onClick={() => setResetOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileView((v) => (v === 'form' ? 'preview' : 'form'))}
                className="flex items-center gap-1.5 rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-200 md:hidden"
              >
                {mobileView === 'form' ? (
                  <>
                    <Eye className="h-3.5 w-3.5" /> Vorschau
                  </>
                ) : (
                  <>
                    <Edit3 className="h-3.5 w-3.5" /> Formular
                  </>
                )}
              </button>
            </div>
          </div>
          {ready && (
            <p className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-300">
              Einreichungsreif — Lebenslauf kann dem Businessplan-Anhang und Einreichungspaket beigefügt werden.
            </p>
          )}
        </div>
      </header>

      <div className="cv-split">
        <aside className={`cv-form-panel ${mobileView === 'preview' ? 'cv-panel-hidden-mobile' : ''}`}>
          <div className="mb-4 rounded-2xl border border-brand-300/80 bg-gradient-to-r from-brand-50 to-indigo-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-600" aria-hidden />
              <p className="text-sm font-bold text-brand-900">ScanLogic AI</p>
            </div>
            <p className="text-xs text-slate-600">{bpT(LANG, 'aiPolishAllHint')}</p>
            <button
              type="button"
              onClick={polishAll}
              disabled={!!aiLoading || polishCount === 0}
              className="btn-primary mt-3 w-full rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {aiLoading === 'all' ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> {bpT(LANG, 'aiPolishingAll')}
                </span>
              ) : (
                bpT(LANG, 'aiPolishAll')
              )}
            </button>
            {aiDone && polishCount > 0 && (
              <p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                {listPolishableCvFields(cv).length} {bpT(LANG, 'aiPolishComplete').toLowerCase()}
              </p>
            )}
          </div>
          <LebenslaufForm
            cv={cv}
            onChange={onSimpleChange}
            onImportBizStart={handleImport}
            aiFieldProps={aiFieldProps}
            onGenerateProfil={handleGenerateProfil}
            generatingProfil={aiLoading === 'profil-gen'}
          />
        </aside>
        <section className={`cv-preview-panel ${mobileView === 'form' ? 'cv-panel-hidden-mobile' : ''}`}>
          <div className="cv-export-toolbar no-print">
            <button type="button" onClick={handlePrint} className="cv-export-btn">
              <Printer className="h-4 w-4" /> Drucken
            </button>
            <button type="button" onClick={handlePdf} disabled={!!aiLoading} className="cv-export-btn disabled:opacity-50">
              {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
              PDF
            </button>
            <button type="button" onClick={handleWord} disabled={!!aiLoading} className="cv-export-btn disabled:opacity-50">
              {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              Word
            </button>
          </div>
          <div className="cv-preview-scroll">
            <LebenslaufPreview cv={cv} printRef={printRef} />
          </div>
        </section>
      </div>

      {resetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 p-5 shadow-xl ring-1 ring-slate-700">
            <h2 className="text-base font-bold text-white">Lebenslauf zurücksetzen?</h2>
            <p className="mt-2 text-sm text-slate-400">
              Alle Eingaben werden gelöscht. Gespeicherte Daten in localStorage gehen verloren.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setResetOpen(false)}
                className="flex-1 rounded-xl border border-slate-600 py-2 text-sm text-slate-300"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 rounded-xl bg-red-600 py-2 text-sm font-semibold text-white"
              >
                Zurücksetzen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
