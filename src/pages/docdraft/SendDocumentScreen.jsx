import { Mail, MessageCircle, Link2, Download, Printer } from 'lucide-react'
import { toast } from 'sonner'
import base44 from '@/lib/base44'
import { addAuditEntry } from '@/lib/docdraft/store'
import { generateInvoicePdf } from '@/lib/pdfUtils'

export default function SendDocumentScreen({ doc, profile, client, onBack, onSent }) {
  const subject = `${doc.document_type} ${doc.document_number} — ${profile?.businessName}`
  const body = encodeURIComponent(
    `Sehr geehrte Damen und Herren,\n\nanbei erhalten Sie ${doc.document_number}.\n\nMit freundlichen Grüßen\n${profile?.businessName}`
  )

  const markSent = async (channel) => {
    await base44.entities.DocDraftDocument.update(doc.id, {
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
    await generateInvoicePdf(doc, {
      company_name: profile.businessName,
      steuernummer: profile.steuernummer,
      ust_id_nr: profile.ustIdNr,
      iban: profile.iban,
      bic: profile.bic,
      is_kleinunternehmer: profile.isKleinunternehmer,
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
    <div className="px-4 pb-4">
      <button type="button" onClick={onBack} className="safe-top mb-4 text-sm text-slate-400">
        ← Back
      </button>
      <h2 className="mb-2 text-lg font-bold">Send document</h2>
      <p className="mb-6 text-sm text-slate-500">{doc.document_number}</p>
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
