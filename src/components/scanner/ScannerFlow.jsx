import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import appApi from '@/lib/appApi'
import { uploadScanPages, analyzeScannedDocument } from '@/lib/scanPipeline'
import { useAiLanguage } from '@/context/AiLanguageContext'
import AiLanguageBar from '@/components/shared/AiLanguageBar'
import CameraCapture from './CameraCapture'
import PerspectiveCrop from './PerspectiveCrop'
import DocOptimizer from './DocOptimizer'
import ProcessingOverlay from './ProcessingOverlay'
import ResultsView from './ResultsView'

const STEPS = ['capture', 'crop', 'optimize', 'process', 'results']

export default function ScannerFlow({ onBack, onSaved }) {
  const { language, setLanguage } = useAiLanguage()
  const [step, setStep] = useState('capture')
  const [rawPages, setRawPages] = useState([])
  const [processedPages, setProcessedPages] = useState([])
  const [storedPageUrls, setStoredPageUrls] = useState([])
  const [currentPageIdx, setCurrentPageIdx] = useState(0)
  const [processStage, setProcessStage] = useState('ingesting')

  const slideUp = {
    initial: { opacity: 0, y: 48 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 32 },
    transition: { type: 'spring', damping: 28, stiffness: 320 },
  }
  const [ocrText, setOcrText] = useState('')
  const [markdownResult, setMarkdownResult] = useState('')
  const [documentType, setDocumentType] = useState('Other')
  const [title, setTitle] = useState('Scan')

  const currentRaw = rawPages[currentPageIdx]

  const processAllPages = async (finalDataUrls) => {
    setStep('process')
    try {
      setProcessStage('ingesting')
      const pageUrls = await uploadScanPages(finalDataUrls)
      setStoredPageUrls(pageUrls)

      setProcessStage('enhancing')
      await new Promise((r) => setTimeout(r, 400))

      setProcessStage('ocr')
      const analysis = await analyzeScannedDocument(pageUrls, language)

      setProcessStage('markdown')
      setOcrText(analysis.ocr_text)
      setMarkdownResult(analysis.markdown_result)
      setDocumentType(analysis.document_type)
      setTitle(analysis.title)
      setStep('results')

      const doc = await appApi.entities.Document.create({
        title: analysis.title,
        document_type: analysis.document_type,
        ocr_text: analysis.ocr_text,
        markdown_result: analysis.markdown_result,
        pages: pageUrls,
        page_count: pageUrls.length,
        status: 'processed',
        is_starred: false,
        folder: 'Inbox',
      })
      onSaved?.(doc)
      toast.success('Dokument gespeichert')
    } catch (err) {
      toast.error('Verarbeitung fehlgeschlagen')
      console.error(err)
      setStep('optimize')
    }
  }

  const finishOptimize = () => {
    const updated = [...processedPages]
    updated[currentPageIdx] = updated[currentPageIdx] || currentRaw
    setProcessedPages(updated)
    if (currentPageIdx < rawPages.length - 1) {
      setCurrentPageIdx((i) => i + 1)
      setStep('crop')
    } else {
      processAllPages(updated.length ? updated : rawPages)
    }
  }

  const handleCrop = (cropped) => {
    const updated = [...processedPages]
    updated[currentPageIdx] = cropped
    setProcessedPages(updated)
    setStep('optimize')
  }

  const handleEmail = () => {
    const body = encodeURIComponent(markdownResult || ocrText)
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${body}`
  }

  const displayPages =
    storedPageUrls.length > 0
      ? storedPageUrls
      : processedPages.length
        ? processedPages
        : rawPages

  return (
    <div className="flex flex-col">
      {step !== 'process' && step !== 'results' && (
        <button
          type="button"
          onClick={() => (step === 'capture' ? onBack() : setStep(STEPS[STEPS.indexOf(step) - 1]))}
          className="mb-4 flex items-center gap-2 text-sm text-slate-400"
        >
          <ArrowLeft className="h-4 w-4" /> Zurück
        </button>
      )}

      <AnimatePresence mode="wait">
        {step === 'capture' && (
          <motion.div key="capture" {...slideUp}>
            <AiLanguageBar
              language={language}
              onChange={setLanguage}
              className="mb-4"
            />
            <CameraCapture
              pages={rawPages}
              onPagesChange={setRawPages}
              onDone={() => {
                setProcessedPages([...rawPages])
                setCurrentPageIdx(0)
                setStep('crop')
              }}
            />
          </motion.div>
        )}

        {step === 'crop' && currentRaw && (
          <motion.div key="crop" {...slideUp}>
            <p className="mb-2 text-center text-sm text-brand-300">
              Seite {currentPageIdx + 1} von {rawPages.length}
            </p>
            <PerspectiveCrop imageSrc={currentRaw} onCropped={handleCrop} />
          </motion.div>
        )}

        {step === 'optimize' && (processedPages[currentPageIdx] || currentRaw) && (
          <motion.div key="opt" {...slideUp}>
            <DocOptimizer
              imageSrc={processedPages[currentPageIdx] || currentRaw}
              onOptimized={(img) => {
                const u = [...processedPages]
                u[currentPageIdx] = img
                setProcessedPages(u)
              }}
            />
            <button
              type="button"
              onClick={finishOptimize}
              className="btn-primary mt-4 w-full rounded-xl py-3 font-semibold"
            >
              {currentPageIdx < rawPages.length - 1 ? 'Nächste Seite' : 'Verarbeiten'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {step === 'process' && <ProcessingOverlay key="proc" stage={processStage} />}
      </AnimatePresence>

      {step === 'results' && (
        <motion.div {...slideUp}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-2 w-full rounded-xl bg-slate-800 px-4 py-2 text-lg font-semibold"
            placeholder="Dokumenttitel"
          />
          <p className="mb-4 text-xs text-slate-500">Typ: {documentType}</p>
          <ResultsView
            pages={displayPages}
            ocrText={ocrText}
            markdownResult={markdownResult}
            title={title}
            onEmail={handleEmail}
          />
        </motion.div>
      )}
    </div>
  )
}
