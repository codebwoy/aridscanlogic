import { useMemo, useEffect } from 'react'
import { FileText, Download } from 'lucide-react'
import { getShareByToken, incrementShareView } from '@/lib/scanvault/store'
import { exportDocumentPdf } from '@/lib/scanvault/export'

export default function ShareLinkViewer({ token, onOpenApp }) {
  const data = useMemo(() => getShareByToken(token), [token])

  useEffect(() => {
    if (data) incrementShareView(token)
  }, [token, data])

  if (!data) {
    return (
      <div className="scanvault-shell flex min-h-screen flex-col items-center justify-center bg-[#0f0f0f] px-6 text-white">
        <FileText className="mb-4 h-12 w-12 text-slate-600" />
        <h1 className="text-xl font-bold">Link expired or invalid</h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          This share link may have expired (7 days) or was revoked.
        </p>
        {onOpenApp && (
          <button
            type="button"
            onClick={onOpenApp}
            className="mt-6 rounded-xl bg-[#007AFF] px-6 py-3 text-sm font-semibold"
          >
            Open ScanVault
          </button>
        )}
      </div>
    )
  }

  const { link, document: doc } = data
  const pages = doc.pages || []

  return (
    <div className="scanvault-shell min-h-screen bg-[#0f0f0f] text-white">
      <header className="safe-top border-b border-white/10 px-4 py-4">
        <p className="text-xs text-slate-500">Shared via ScanVault</p>
        <h1 className="text-lg font-bold">{doc.name}</h1>
        <p className="text-xs text-slate-500">
          {doc.pageCount} page(s) · viewed {link.viewCount} time(s)
        </p>
      </header>
      <div className="space-y-4 px-4 py-4">
        {pages.map((p, i) => (
          <img
            key={i}
            src={p.processedImageUrl || p.imageUrl}
            alt={`Page ${i + 1}`}
            className="w-full rounded-xl border border-white/10"
          />
        ))}
        {doc.extractedText && (
          <div className="rounded-xl bg-white/5 p-4">
            <p className="mb-2 text-xs font-semibold text-slate-400">Extracted text</p>
            <pre className="whitespace-pre-wrap text-sm text-slate-300">{doc.extractedText.slice(0, 4000)}</pre>
          </div>
        )}
      </div>
      <div className="sticky bottom-0 flex gap-2 border-t border-white/10 bg-[#0f0f0f] p-4 safe-bottom">
        <button
          type="button"
          onClick={() => exportDocumentPdf(doc, { plan: 'premium' })}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#007AFF] py-3 text-sm font-semibold"
        >
          <Download className="h-4 w-4" /> Download PDF
        </button>
        {onOpenApp && (
          <button type="button" onClick={onOpenApp} className="rounded-xl border border-white/20 px-4 py-3 text-sm">
            Get app
          </button>
        )}
      </div>
    </div>
  )
}
