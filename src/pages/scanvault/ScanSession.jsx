import { useState } from 'react'
import { ChevronLeft, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import ScanVaultCamera from '@/components/scanvault/ScanVaultCamera'
import PerspectiveCrop from '@/components/scanner/PerspectiveCrop'
import ScanVaultOptimizer from '@/components/scanvault/ScanVaultOptimizer'
import { getSettings } from '@/lib/scanvault/store'
import { canAddPage } from '@/lib/scanvault/limits'
import { runOcrOnPages } from '@/lib/scanvault/ocr'
import { saveDocument } from '@/lib/scanvault/store'

export default function ScanSession({ user, onClose, onSaved, onUpgrade }) {
  const settings = getSettings()
  const [step, setStep] = useState('camera')
  const [sessionPages, setSessionPages] = useState([])
  const [currentRaw, setCurrentRaw] = useState(null)
  const [editingIdx, setEditingIdx] = useState(null)
  const [cropCorners, setCropCorners] = useState(null)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [saving, setSaving] = useState(false)

  const startCapture = (dataUrl, corners) => {
    setCurrentRaw(dataUrl)
    setCropCorners(corners || null)
    setStep('crop')
  }

  const afterCrop = (cropped) => {
    setCurrentRaw(cropped)
    setStep('process')
  }

  const afterProcess = (processed) => {
    if (editingIdx !== null) {
      const updated = [...sessionPages]
      updated[editingIdx] = {
        ...updated[editingIdx],
        processedImageUrl: processed,
        imageUrl: updated[editingIdx].imageUrl || processed,
      }
      setSessionPages(updated)
      setEditingIdx(null)
      setStep('session')
      return
    }
    setSessionPages([
      ...sessionPages,
      {
        pageNumber: sessionPages.length + 1,
        imageUrl: currentRaw,
        processedImageUrl: processed,
        filter: settings.defaultFilter,
      },
    ])
    setCurrentRaw(null)
    setStep('session')
  }

  const addAnother = () => {
    const check = canAddPage(user, sessionPages.length)
    if (!check.ok) {
      toast.error(check.message)
      onUpgrade?.()
      return
    }
    setStep('camera')
  }

  const saveDocumentFlow = async () => {
    if (!sessionPages.length) return
    setSaving(true)
    setStep('ocr')
    try {
      const pages = [...sessionPages]
      const { fullText, pages: withText } = await runOcrOnPages(
        pages,
        settings.ocrLanguage,
        setOcrProgress
      )
      const name = `Scan ${new Date().toLocaleDateString()}`
      const bytes = pages.reduce((s, p) => s + (p.processedImageUrl?.length || 0), 0)
      saveDocument({
        name,
        pageCount: pages.length,
        fileSizeBytes: bytes,
        thumbnailUrl: pages[0].processedImageUrl,
        pages: withText,
        extractedText: fullText,
        folderId: 'uncategorized',
      })
      toast.success('Document saved')
      onSaved?.()
      onClose?.()
    } catch (err) {
      toast.error('OCR failed — document saved without text')
      saveDocument({
        name: `Scan ${new Date().toLocaleDateString()}`,
        pageCount: sessionPages.length,
        pages: sessionPages,
        extractedText: '',
        folderId: 'uncategorized',
        thumbnailUrl: sessionPages[0]?.processedImageUrl,
      })
      onSaved?.()
      onClose?.()
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (step === 'camera') {
    return (
      <>
        <ScanVaultCamera
          onCapture={startCapture}
          onGalleryPick={startCapture}
          flashMode={settings.flash}
          autoCapture={settings.autoCapture}
        />
        <button
          type="button"
          onClick={onClose}
          className="fixed left-4 z-[70] rounded-full bg-black/50 px-3 py-2 text-sm text-white safe-top"
        >
          Cancel
        </button>
      </>
    )
  }

  return (
    <div className="scanvault-shell fixed inset-0 z-[60] overflow-y-auto bg-[#0f0f0f] px-4 pb-8">
      <button
        type="button"
        onClick={() => {
          if (step === 'session') onClose()
          else if (step === 'crop') setStep('camera')
          else if (step === 'process') setStep('crop')
          else onClose()
        }}
        className="safe-top mb-4 flex items-center gap-1 text-sm text-slate-400"
      >
        <ChevronLeft className="h-4 w-4" />
        {step === 'session' ? 'Close' : 'Back'}
      </button>

      {step === 'crop' && currentRaw && (
        <>
          <h2 className="mb-2 text-lg font-semibold">Adjust corners</h2>
          <PerspectiveCrop imageSrc={currentRaw} initialCorners={cropCorners} onCropped={afterCrop} />
          <button
            type="button"
            onClick={() => setStep('camera')}
            className="mt-4 w-full min-h-[48px] rounded-xl border border-white/20 py-3"
          >
            Retake
          </button>
        </>
      )}

      {step === 'process' && currentRaw && (
        <>
          <h2 className="mb-2 text-lg font-semibold">Enhance scan</h2>
          <ScanVaultOptimizer
            imageSrc={currentRaw}
            defaultFilter={settings.defaultFilter}
            onApply={afterProcess}
          />
        </>
      )}

      {step === 'session' && (
        <>
          <h2 className="mb-4 text-lg font-semibold">{sessionPages.length} page(s)</h2>
          <div className="mb-4 flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {sessionPages.map((p, i) => (
              <div key={i} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditingIdx(i)
                    setCurrentRaw(p.processedImageUrl)
                    setStep('process')
                  }}
                >
                  <img
                    src={p.processedImageUrl}
                    alt=""
                    className="h-20 w-14 rounded-lg object-cover ring-2 ring-[#007AFF]"
                  />
                  <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1 text-[10px]">
                    {i + 1}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setSessionPages(sessionPages.filter((_, j) => j !== i))}
                  className="absolute -right-1 -top-1 rounded-full bg-red-500 p-1"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={addAnother}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#007AFF] py-3"
            >
              <Plus className="h-5 w-5" /> Add another page
            </button>
            <button
              type="button"
              onClick={saveDocumentFlow}
              disabled={saving}
              className="min-h-[48px] rounded-xl bg-[#007AFF] py-3 font-semibold"
            >
              Save document
            </button>
          </div>
        </>
      )}

      {step === 'ocr' && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg font-medium">Reading text…</p>
          <div className="mt-4 h-2 w-48 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-[#007AFF] transition-all"
              style={{ width: `${ocrProgress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-slate-500">{ocrProgress}%</p>
        </div>
      )}
    </div>
  )
}
