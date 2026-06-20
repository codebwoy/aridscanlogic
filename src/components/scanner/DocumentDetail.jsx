import { useState } from 'react'
import { ChevronLeft, Star, Trash2, RefreshCw, Receipt, FilePenLine, FileDown, FolderInput } from 'lucide-react'
import { toast } from 'sonner'
import { useConfirm } from '@/context/ConfirmContext'
import appApi from '@/lib/appApi'
import { analyzeScannedDocument } from '@/lib/scanPipeline'
import { useAiLanguage } from '@/context/AiLanguageContext'
import AiLanguageBar from '@/components/shared/AiLanguageBar'
import DocumentBrandingToggle from '@/components/shared/DocumentBrandingToggle'
import ResultsView from './ResultsView'

export default function DocumentDetail({
  document: doc,
  onBack,
  onUpdated,
  onSendToTaxVault,
  onSendToDocDraft,
  folders = [],
  onMoveFolder,
  onExportPdf,
  includeBranding,
  onBrandingChange,
}) {
  const confirm = useConfirm()
  const { language, setLanguage } = useAiLanguage()
  const [pageIdx, setPageIdx] = useState(0)
  const [title, setTitle] = useState(doc.title)
  const [ocrText, setOcrText] = useState(doc.ocr_text || '')
  const [markdown, setMarkdown] = useState(doc.markdown_result || '')
  const [reprocessing, setReprocessing] = useState(false)
  const pages = doc.pages || []

  const saveTitle = async () => {
    await appApi.entities.Document.update(doc.id, { title })
    toast.success('Saved')
    onUpdated?.()
  }

  const toggleStar = async () => {
    await appApi.entities.Document.update(doc.id, { is_starred: !doc.is_starred })
    onUpdated?.()
  }

  const remove = async () => {
    const ok = await confirm({
      title: 'Dokument löschen',
      message: 'Dieses Dokument endgültig löschen?',
      confirmLabel: 'Löschen',
      destructive: true,
    })
    if (!ok) return
    await appApi.entities.Document.delete(doc.id)
    toast.success('Deleted')
    onBack?.()
    onUpdated?.()
  }

  const reOcr = async () => {
    if (!pages.length) return
    setReprocessing(true)
    try {
      const analysis = await analyzeScannedDocument(pages, language)
      setOcrText(analysis.ocr_text)
      setMarkdown(analysis.markdown_result)
      await appApi.entities.Document.update(doc.id, {
        ocr_text: analysis.ocr_text,
        markdown_result: analysis.markdown_result,
        document_type: analysis.document_type,
        status: 'processed',
      })
      toast.success('Re-processed')
      onUpdated?.()
    } catch {
      toast.error('Re-OCR failed')
    } finally {
      setReprocessing(false)
    }
  }

  return (
    <div className="w-full">
      <button type="button" onClick={onBack} className="safe-top mb-3 flex items-center gap-1 text-sm text-slate-400">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      <div className="mb-3 flex items-center gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={saveTitle}
          className="flex-1 rounded-xl bg-slate-800 px-3 py-2 font-semibold"
        />
        <button type="button" onClick={toggleStar} className="rounded-xl bg-slate-800 p-2">
          <Star className={`h-5 w-5 ${doc.is_starred ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`} />
        </button>
      </div>
      {folders.length > 0 && onMoveFolder && (
        <div className="mb-3 flex items-center gap-2">
          <FolderInput className="h-4 w-4 text-slate-500" />
          <select
            value={doc.folder || 'Inbox'}
            onChange={(e) => onMoveFolder(e.target.value)}
            className="flex-1 rounded-lg bg-slate-800 px-2 py-2 text-sm"
          >
            {folders.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      )}
      {pages[pageIdx] && (
        <img src={pages[pageIdx]} alt="" className="mb-3 max-h-56 w-full rounded-xl object-contain bg-black" />
      )}
      <div className="mb-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {pages.map((p, i) => (
          <button key={i} type="button" onClick={() => setPageIdx(i)}>
            <img
              src={p}
              alt=""
              className={`h-12 w-9 rounded object-cover ${i === pageIdx ? 'ring-2 ring-brand-500' : ''}`}
            />
          </button>
        ))}
      </div>
      <AiLanguageBar
        language={language}
        onChange={setLanguage}
        disabled={reprocessing}
        className="mb-3"
      />
      {onExportPdf && onBrandingChange && (
        <DocumentBrandingToggle
          checked={includeBranding}
          onChange={onBrandingChange}
          className="mb-3"
        />
      )}
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" onClick={reOcr} disabled={reprocessing} className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-2 text-xs">
          <RefreshCw className={`h-3 w-3 ${reprocessing ? 'animate-spin' : ''}`} /> Re-OCR
        </button>
        {onExportPdf && (
          <button type="button" onClick={onExportPdf} className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-2 text-xs">
            <FileDown className="h-3 w-3" /> PDF
          </button>
        )}
        {onSendToTaxVault && (
          <button type="button" onClick={() => onSendToTaxVault(doc)} className="flex items-center gap-1 rounded-lg bg-brand-600/20 px-3 py-2 text-xs text-brand-300">
            <Receipt className="h-3 w-3" /> Tax Vault
          </button>
        )}
        {onSendToDocDraft && (
          <button type="button" onClick={() => onSendToDocDraft(doc)} className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-2 text-xs">
            <FilePenLine className="h-3 w-3" /> DocDraft
          </button>
        )}
        <button type="button" onClick={remove} className="flex items-center gap-1 rounded-lg border border-red-500/40 px-3 py-2 text-xs text-red-400">
          <Trash2 className="h-3 w-3" /> Delete
        </button>
      </div>
      <ResultsView pages={pages} ocrText={ocrText} markdownResult={markdown} title={title} />
    </div>
  )
}
