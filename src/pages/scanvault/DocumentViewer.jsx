import { useState } from 'react'
import { ChevronLeft, FileDown, Trash2, Type, FolderInput, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { deleteDocument, saveDocument, listFolders, getDocument } from '@/lib/scanvault/store'
import { downloadTextFile } from '@/lib/pdfUtils'
import { getSettings } from '@/lib/scanvault/store'
import { runOcrOnPages } from '@/lib/scanvault/ocr'

export default function DocumentViewer({ document: doc, onBack, onExport, onDelete, onUpdated }) {
  const [pageIdx, setPageIdx] = useState(0)
  const [showOcr, setShowOcr] = useState(false)
  const [name, setName] = useState(doc.name)
  const [ocrBusy, setOcrBusy] = useState(false)
  const pages = doc.pages || []
  const current = pages[pageIdx]
  const folders = listFolders()

  const remove = () => {
    if (!window.confirm('Delete this document?')) return
    deleteDocument(doc.id)
    toast.success('Deleted')
    onDelete?.()
    onBack?.()
  }

  const copyText = () => {
    navigator.clipboard.writeText(doc.extractedText || '')
    toast.success('Copied')
  }

  const moveToFolder = (folderId) => {
    const updated = saveDocument({ ...doc, folderId })
    onUpdated?.(updated)
    toast.success('Moved to folder')
  }

  const rerunOcr = async () => {
    setOcrBusy(true)
    try {
      const settings = getSettings()
      const pagesCopy = [...(doc.pages || [])]
      const { fullText, pages: withText } = await runOcrOnPages(pagesCopy, settings.ocrLanguage)
      const updated = saveDocument({
        ...doc,
        pages: withText,
        extractedText: fullText,
      })
      onUpdated?.(updated)
      toast.success('OCR updated')
    } catch {
      toast.error('OCR failed')
    } finally {
      setOcrBusy(false)
    }
  }

  return (
    <div className="scanvault-shell fixed inset-0 z-[70] flex flex-col bg-black">
      <div className="flex items-center justify-between px-4 py-3 safe-top">
        <button type="button" onClick={onBack} className="min-h-[48px] text-[#007AFF]">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => {
            const updated = saveDocument({ ...doc, name })
            onUpdated?.(updated)
          }}
          className="max-w-[50%] truncate bg-transparent text-center font-medium"
        />
        <div className="flex gap-1">
          <button type="button" onClick={() => onExport?.(getDocument(doc.id) || doc)} className="p-2">
            <FileDown className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => setShowOcr(!showOcr)} className="p-2">
            <Type className="h-5 w-5" />
          </button>
          <button type="button" onClick={remove} className="p-2 text-red-400">
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto px-4 pb-2">
        <FolderInput className="h-4 w-4 shrink-0 text-slate-500" />
        <select
          value={doc.folderId || 'uncategorized'}
          onChange={(e) => moveToFolder(e.target.value)}
          className="min-h-[40px] flex-1 rounded-lg bg-white/10 px-2 text-xs"
        >
          {folders.map((f) => (
            <option key={f.id} value={f.id}>
              {f.emoji} {f.name}
            </option>
          ))}
        </select>
      </div>

      {!showOcr ? (
        <>
          <div
            className="flex flex-1 items-center justify-center overflow-hidden"
            onClick={() => pages.length > 1 && setPageIdx((i) => (i + 1) % pages.length)}
          >
            {current && (
              <img
                src={current.processedImageUrl || current.imageUrl}
                alt=""
                className="max-h-full max-w-full object-contain"
              />
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
            {pages.map((p, i) => (
              <button key={i} type="button" onClick={() => setPageIdx(i)}>
                <img
                  src={p.processedImageUrl || p.imageUrl}
                  alt=""
                  className={`h-12 w-9 rounded object-cover ${
                    i === pageIdx ? 'ring-2 ring-[#007AFF]' : 'opacity-60'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="pb-4 text-center text-xs text-slate-500">
            Page {pageIdx + 1} of {pages.length} · Tap to navigate
          </p>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 pb-8">
          <div className="mb-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyText}
              className="min-h-[48px] flex-1 rounded-xl bg-[#007AFF] text-sm font-medium"
            >
              Copy all text
            </button>
            <button
              type="button"
              onClick={() => downloadTextFile(doc.extractedText, `${doc.name}.txt`)}
              className="min-h-[48px] flex-1 rounded-xl bg-white/10 text-sm"
            >
              Export .txt
            </button>
            <button
              type="button"
              onClick={rerunOcr}
              disabled={ocrBusy}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-white/20 text-sm"
            >
              <RefreshCw className={`h-4 w-4 ${ocrBusy ? 'animate-spin' : ''}`} />
              {ocrBusy ? 'Running OCR…' : 'Re-run OCR'}
            </button>
          </div>
          <pre className="whitespace-pre-wrap rounded-xl bg-white/5 p-4 text-sm text-slate-300">
            {doc.extractedText || 'No text extracted yet — tap Re-run OCR.'}
          </pre>
        </div>
      )}
    </div>
  )
}
