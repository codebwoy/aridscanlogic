import { useState } from 'react'
import { ChevronLeft, Mail, Link2, MessageCircle, Archive } from 'lucide-react'
import { toast } from 'sonner'
import {
  exportDocumentPdf,
  exportDocumentText,
  downloadPageImages,
  exportDocumentZip,
} from '@/lib/scanvault/export'
import { createShareLink } from '@/lib/scanvault/store'
import { hasWatermark } from '@/lib/scanvault/limits'
import DocumentBrandingToggle, { useDocumentBranding } from '@/components/shared/DocumentBrandingToggle'

export default function ExportShare({ document: doc, user, onBack, onUpgrade }) {
  const watermark = hasWatermark(user)
  const [linkDays, setLinkDays] = useState(7)
  const { includeBranding, setIncludeBranding } = useDocumentBranding()

  const shareEmail = async () => {
    if (watermark) toast.info('PDF will include ScanVault Free watermark')
    await exportDocumentPdf(doc, user, undefined, { branding: includeBranding })
    const subject = encodeURIComponent(doc.name)
    window.location.href = `mailto:?subject=${subject}&body=See attached PDF from ScanVault`
  }

  const shareLink = () => {
    const link = createShareLink(doc.id, linkDays)
    const url = `${window.location.origin}${window.location.pathname}?share=${link.token}`
    navigator.clipboard.writeText(url)
    toast.success(`Link copied — valid ${linkDays} days`)
  }

  const shareWhatsApp = () => {
    const link = createShareLink(doc.id, linkDays)
    const url = `${window.location.origin}${window.location.pathname}?share=${link.token}`
    const text = encodeURIComponent(`ScanVault: ${doc.name}\n${url}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <div className="scanvault-shell fixed inset-0 z-[80] overflow-y-auto bg-[#0f0f0f] px-4 pb-8 text-white">
      <button type="button" onClick={onBack} className="safe-top mb-4 flex items-center gap-1 text-sm text-slate-400">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      <h2 className="text-xl font-bold">Export & Share</h2>
      {watermark && (
        <p className="mt-2 text-xs text-amber-300">
          Free exports include a watermark.{' '}
          <button type="button" onClick={onUpgrade} className="text-[#007AFF] underline">
            Upgrade to remove
          </button>
        </p>
      )}
      <h3 className="mt-6 mb-2 text-sm font-semibold text-slate-400">Export</h3>
      <DocumentBrandingToggle checked={includeBranding} onChange={setIncludeBranding} className="mb-3" />
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => exportDocumentPdf(doc, user, undefined, { branding: includeBranding })}
          className="flex min-h-[48px] w-full items-center gap-3 rounded-xl bg-white/10 px-4"
        >
          Export as PDF
        </button>
        <button
          type="button"
          onClick={() => downloadPageImages(doc)}
          className="flex min-h-[48px] w-full items-center gap-3 rounded-xl bg-white/10 px-4"
        >
          Export as Images (JPG)
        </button>
        <button
          type="button"
          onClick={async () => {
            try {
              await exportDocumentZip(doc)
              toast.success('ZIP downloaded')
            } catch {
              toast.error('ZIP export failed')
            }
          }}
          className="flex min-h-[48px] w-full items-center gap-3 rounded-xl bg-white/10 px-4"
        >
          <Archive className="h-5 w-5" /> Export as ZIP (pages + OCR)
        </button>
        <button
          type="button"
          onClick={() => exportDocumentText(doc)}
          className="flex min-h-[48px] w-full items-center gap-3 rounded-xl bg-white/10 px-4"
        >
          Export as Text (.txt)
        </button>
      </div>
      <h3 className="mt-6 mb-2 text-sm font-semibold text-slate-400">Share</h3>
      <label className="mb-3 block text-xs text-slate-500">
        Link expires in
        <select
          value={linkDays}
          onChange={(e) => setLinkDays(Number(e.target.value))}
          className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm"
        >
          <option value={1}>1 day</option>
          <option value={7}>7 days</option>
          <option value={30}>30 days</option>
        </select>
      </label>
      <div className="space-y-2">
        <button
          type="button"
          onClick={shareEmail}
          className="flex min-h-[48px] w-full items-center gap-3 rounded-xl bg-white/10 px-4"
        >
          <Mail className="h-5 w-5" /> Email
        </button>
        <button
          type="button"
          onClick={shareLink}
          className="flex min-h-[48px] w-full items-center gap-3 rounded-xl bg-white/10 px-4"
        >
          <Link2 className="h-5 w-5" /> Copy hosted share link
        </button>
        <button
          type="button"
          onClick={shareWhatsApp}
          className="flex min-h-[48px] w-full items-center gap-3 rounded-xl bg-white/10 px-4"
        >
          <MessageCircle className="h-5 w-5" /> WhatsApp
        </button>
        {navigator.share && (
          <button
            type="button"
            onClick={async () => {
              const link = createShareLink(doc.id, linkDays)
              const url = `${window.location.origin}${window.location.pathname}?share=${link.token}`
              try {
                await navigator.share({ title: doc.name, text: doc.extractedText?.slice(0, 200), url })
              } catch {
                /* cancelled */
              }
            }}
            className="flex min-h-[48px] w-full items-center gap-3 rounded-xl bg-[#007AFF]/20 px-4"
          >
            Native share sheet
          </button>
        )}
      </div>
      <p className="mt-4 text-center text-xs text-slate-500">
        Share links open a read-only viewer in the browser (no login required).
      </p>
    </div>
  )
}
