import { useState } from 'react'
import SafeMarkdown from '@/components/SafeMarkdown'
import { Copy, Download, FileText, Mail, Image } from 'lucide-react'
import { toast } from 'sonner'
import { downloadTextFile, generateScanPdf } from '@/lib/pdfUtils'
import DocumentBrandingToggle, { useDocumentBranding } from '@/components/shared/DocumentBrandingToggle'

export default function ResultsView({ pages, ocrText, markdownResult, title, onEmail }) {
  const [tab, setTab] = useState('markdown')
  const { includeBranding, setIncludeBranding } = useDocumentBranding()

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(markdownResult || ocrText)
      toast.success('In Zwischenablage kopiert')
    } catch {
      toast.error('Kopieren fehlgeschlagen')
    }
  }

  const downloadTxt = () => {
    downloadTextFile(markdownResult || ocrText, `${title || 'scan'}.txt`)
    toast.success('TXT heruntergeladen')
  }

  const downloadPdf = async () => {
    try {
      await generateScanPdf(pages, title, { branding: includeBranding })
      toast.success('PDF erstellt')
    } catch {
      toast.error('PDF-Erstellung fehlgeschlagen')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 rounded-xl bg-slate-800 p-1">
        <button
          type="button"
          onClick={() => setTab('images')}
          className={`flex-1 rounded-lg py-2 text-sm ${tab === 'images' ? 'bg-brand-600 font-medium' : ''}`}
        >
          <Image className="mx-auto mb-0.5 h-4 w-4" />
          Bilder
        </button>
        <button
          type="button"
          onClick={() => setTab('markdown')}
          className={`flex-1 rounded-lg py-2 text-sm ${tab === 'markdown' ? 'bg-brand-600 font-medium' : ''}`}
        >
          <FileText className="mx-auto mb-0.5 h-4 w-4" />
          Markdown
        </button>
      </div>

      {tab === 'images' ? (
        <div className="space-y-3">
          {pages.map((p, i) => (
            <img key={i} src={p} alt={`Seite ${i + 1}`} className="w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="prose prose-invert max-w-none rounded-xl bg-slate-800/50 p-4 text-sm prose-headings:text-white prose-p:text-slate-300">
          <SafeMarkdown>{markdownResult || ocrText || '*Kein Text erkannt*'}</SafeMarkdown>
        </div>
      )}

      <DocumentBrandingToggle checked={includeBranding} onChange={setIncludeBranding} className="mb-2" />

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={copyText}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-sm"
        >
          <Copy className="h-4 w-4" /> Kopieren
        </button>
        <button
          type="button"
          onClick={downloadTxt}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-sm"
        >
          <Download className="h-4 w-4" /> TXT
        </button>
        <button
          type="button"
          onClick={downloadPdf}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-sm"
        >
          <Download className="h-4 w-4" /> PDF
        </button>
        <button
          type="button"
          onClick={onEmail}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-medium"
        >
          <Mail className="h-4 w-4" /> E-Mail
        </button>
      </div>
    </div>
  )
}
