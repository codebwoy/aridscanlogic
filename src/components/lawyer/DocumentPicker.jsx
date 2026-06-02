import { useState, useEffect } from 'react'
import { X, FileText } from 'lucide-react'
import appApi from '@/lib/appApi'

export default function DocumentPicker({ open, onClose, onSelect, language = 'de' }) {
  const [docs, setDocs] = useState([])

  useEffect(() => {
    if (!open) return
    appApi.entities.Document.list().then(setDocs).catch(() => setDocs([]))
  }, [open])

  if (!open) return null

  const withText = docs.filter((d) => (d.ocr_text?.length || 0) > 30)

  return (
    <div className="fixed inset-0 z-[65] flex items-end justify-center bg-black/70 p-4 sm:items-center">
      <div className="max-h-[70vh] w-full max-w-lg overflow-hidden rounded-2xl bg-slate-900 sm:max-h-[min(80vh,32rem)]">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <h3 className="font-semibold">
            {language === 'en' ? 'Attach document' : 'Dokument anhängen'}
          </h3>
          <button type="button" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-2">
          {withText.length === 0 ? (
            <p className="p-4 text-center text-sm text-slate-500">
              {language === 'en'
                ? 'No scanned documents with OCR text. Use Docs tab first.'
                : 'Keine Dokumente mit OCR. Bitte zuerst unter Docs scannen.'}
            </p>
          ) : (
            withText.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  onSelect?.(d)
                  onClose?.()
                }}
                className="flex w-full gap-3 rounded-xl p-3 text-left hover:bg-slate-800"
              >
                <FileText className="h-5 w-5 shrink-0 text-brand-400" />
                <div className="min-w-0">
                  <p className="truncate font-medium">{d.title}</p>
                  <p className="text-xs text-slate-500">
                    {d.page_count} pages · {d.ocr_text?.length} chars OCR
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
