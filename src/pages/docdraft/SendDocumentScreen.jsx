import { Mail, MessageCircle, Link2, Download, Printer } from 'lucide-react'
import { toast } from 'sonner'
import appApi from '@/lib/appApi'
import { addAuditEntry } from '@/lib/docdraft/store'
import DocumentBrandingToggle, { useDocumentBranding } from '@/components/shared/DocumentBrandingToggle'
import { generateInvoicePdf } from '@/lib/pdfUtils'

export default function SendDocumentScreen({ doc, profile, client, onBack, onSent }) {
  const { includeBranding, setIncludeBranding } = useDocumentBranding()
  const subject = `${doc.document_type} ${doc.document_number} — ${profile?.businessName}`
  const body = encodeURIComponent(
    `Sehr geehrte Damen und Herren,\n\nanbei erhalten Sie ${doc.document_number}.\n\nMit freundlichen Grüßen\n${profile?.businessName}`
  )

  const markSent = async (channel) => {
    await appApi.entities.DocDraftDocument.update(doc.id, {
      status: doc.status === 'draft' ? 'sent' : doc.status,
      sent_at: new Date().toISOString(),
    })
    addAuditEntry(doc.id, 'sent', channel)
    onSent?.()
  }

  const email = () => {
    const to = client?.email || ''
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${body}`
    markSent('email')
    toast.success('Email client opened')
  }

  const whatsapp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(subject)}`, '_blank')
    markSent('whatsapp')
  }

  const shareLink = () => {
    const link = `${window.location.origin}/doc/${doc.id}`
    navigator.clipboard.writeText(link)
    markSent('share_link')
    toast.success('Link copied (30-day view simulated)')
  }

  const download = async () => {
    await generateInvoicePdf(doc, profile, client, {
      branding: includeBranding,
      lang: doc.language,
    })
    toast.success('PDF downloaded')
  }

  const options = [
    { icon: Mail, label: 'Email', onClick: email },
    { icon: MessageCircle, label: 'WhatsApp', onClick: whatsapp },
    { icon: Link2, label: 'Share link', onClick: shareLink },
    { icon: Download, label: 'Download PDF', onClick: download },
    { icon: Printer, label: 'Print', onClick: () => window.print() },
  ]

  return (
    <div className="w-full">
      <button type="button" onClick={onBack} className="safe-top mb-4 text-sm text-slate-400">
        ← Back
      </button>
      <h2 className="mb-2 text-lg font-bold">Send document</h2>
      <p className="mb-4 text-sm text-slate-500">{doc.document_number}</p>
      <DocumentBrandingToggle checked={includeBranding} onChange={setIncludeBranding} className="mb-4" />
      <div className="grid gap-2">
        {options.map(({ icon: Icon, label, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className="premium-card flex items-center gap-3 p-4 text-left"
          >
            <Icon className="h-5 w-5 text-brand-400" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>
      <p className="mt-6 text-xs text-slate-500">
        Delivery confirmation: client views are logged when share link is opened (demo: manual
        status update on document).
      </p>
    </div>
  )
}
