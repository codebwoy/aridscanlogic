import { KLEINUNTERNEHMER_FOOTNOTE } from '@/lib/docCalculations'
import { amountToWords } from '@/lib/docdraft/amountInWords'
import { TEMPLATES } from '@/lib/docdraft/constants'
import {
  docT,
  docTypeLabels,
  formatDocumentDate,
  formatMoney,
  resolveDocumentLanguage,
  unitLabel,
} from '@/lib/docdraft/documentI18n'

export default function DocumentPreview({ doc, profile, client, lang: langOverride }) {
  const lang = resolveDocumentLanguage(doc, profile, langOverride)
  const type = docTypeLabels(doc.document_type, lang)
  const template = TEMPLATES.find((t) => t.id === doc.templateId) || TEMPLATES[0]
  const isDelivery = doc.document_type === 'delivery_note'
  const isReceipt = doc.document_type === 'receipt'
  const bilingual = template.id === 'bilingual'
  const headerStyle = template.id === 'bold' ? { background: profile?.headerColor || '#4f46e5' } : {}
  const currency = doc.currency || profile?.defaultCurrency || 'EUR'

  const recipient = client || {
    companyName: doc.recipient_name,
    contactName: doc.recipient_contact,
    billingAddress: doc.recipient_address,
    email: doc.recipient_email,
  }

  const words =
    isReceipt && doc.total_gross
      ? amountToWords(Math.abs(doc.total_gross))
      : null

  const footerText =
    doc.footer ||
    profile?.defaultFooter ||
    (lang === 'en' ? docT('en', 'thankYou') : docT('de', 'thankYou'))

  return (
    <div
      className={`overflow-hidden rounded-xl border border-slate-600/40 bg-white text-slate-900 shadow-xl ${
        template.id === 'compact' ? 'text-[11px]' : 'text-xs'
      }`}
    >
      {template.id === 'bold' && (
        <div className="px-4 py-3 text-white" style={headerStyle}>
          <p className="text-lg font-bold">{profile?.businessName}</p>
          <p className="opacity-90">
            {type.title} {doc.document_number}
          </p>
        </div>
      )}

      <div className="p-4">
        <div className="mb-4 flex justify-between gap-4">
          <div>
            {profile?.logoUrl && (
              <img src={profile.logoUrl} alt="" className="mb-2 h-10 object-contain" />
            )}
            {template.id !== 'bold' && (
              <p className="font-bold text-sm">{profile?.businessName}</p>
            )}
            <p className="text-slate-600">
              {[profile?.street, profile?.houseNumber].filter(Boolean).join(' ')}
            </p>
            <p className="text-slate-600">
              {[profile?.plz, profile?.city].filter(Boolean).join(' ')}
            </p>
            {profile?.steuernummer && (
              <p className="mt-1 text-slate-500">
                {docT(lang, 'taxId')} {profile.steuernummer}
              </p>
            )}
            {profile?.ustIdNr && (
              <p className="text-slate-500">
                {docT(lang, 'vatId')} {profile.ustIdNr}
              </p>
            )}
          </div>
          <div className="text-right">
            {template.id !== 'bold' && (
              <p className="text-base font-bold">
                {bilingual ? `${type.title} / ${docTypeLabels(doc.document_type, lang === 'de' ? 'en' : 'de').title}` : type.title}
              </p>
            )}
            <p>
              {docT(lang, 'number')} {doc.document_number}
            </p>
            <p>
              {docT(lang, 'date')}: {formatDocumentDate(doc.issue_date, lang)}
            </p>
            {doc.delivery_date && !isReceipt && (
              <p>
                {docT(lang, 'deliveryDate')}: {formatDocumentDate(doc.delivery_date, lang)}
              </p>
            )}
            {doc.due_date && !isDelivery && !isReceipt && doc.document_type !== 'quote' && (
              <p>
                {docT(lang, 'dueDate')}: {formatDocumentDate(doc.due_date, lang)}
              </p>
            )}
            {(doc.valid_until || doc.document_type === 'quote') && (
              <p>
                {docT(lang, 'validUntil')}: {formatDocumentDate(doc.valid_until, lang)}
              </p>
            )}
          </div>
        </div>

        <div className="mb-4 rounded-lg bg-slate-50 p-3">
          <p className="font-semibold text-slate-700">{docT(lang, 'recipient')}</p>
          <p>{recipient?.companyName || recipient?.contactName}</p>
          {recipient?.contactName && recipient?.companyName && <p>{recipient.contactName}</p>}
          <p className="text-slate-600">{recipient?.billingAddress}</p>
        </div>

        {doc.linked_invoice_number && (
          <p className="mb-2 text-amber-800">
            {docT(lang, 'linkedInvoice')} {doc.linked_invoice_number}
          </p>
        )}

        <table className="mb-4 w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-300 text-left text-slate-600">
              <th className="py-1">{docT(lang, 'description')}</th>
              <th className="py-1 text-right">{docT(lang, 'quantity')}</th>
              {!isDelivery && <th className="py-1 text-right">{docT(lang, 'unitPrice')}</th>}
              {!isDelivery && !profile?.isKleinunternehmer && (
                <th className="py-1 text-right">{docT(lang, 'vat')}</th>
              )}
              {!isDelivery && <th className="py-1 text-right">{docT(lang, 'total')}</th>}
            </tr>
          </thead>
          <tbody>
            {(doc.line_items || []).map((line, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-1.5">{line.description}</td>
                <td className="py-1.5 text-right">
                  {line.quantity} {unitLabel(line.unit, lang)}
                </td>
                {!isDelivery && (
                  <>
                    <td className="py-1.5 text-right">
                      {formatMoney(line.unit_price, currency, lang)}
                    </td>
                    {!profile?.isKleinunternehmer && (
                      <td className="py-1.5 text-right">{line.vat_rate}%</td>
                    )}
                    <td className="py-1.5 text-right font-medium">
                      {formatMoney(line.total_gross ?? line.total, currency, lang)}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {!isDelivery && (
          <div className="ml-auto w-48 space-y-1 text-right">
            <p>
              {docT(lang, 'net')}: {formatMoney(doc.subtotal_net, currency, lang)}
            </p>
            {!profile?.isKleinunternehmer &&
              Object.entries(doc.vat_breakdown || {}).map(([rate, amt]) =>
                Number(rate) > 0 ? (
                  <p key={rate} className="text-slate-600">
                    {rate}% {docT(lang, 'vat')}: {formatMoney(amt, currency, lang)}
                  </p>
                ) : null
              )}
            <p className="text-base font-bold">
              {docT(lang, 'gross')}: {formatMoney(doc.total_gross, currency, lang)}
            </p>
          </div>
        )}

        {words && (
          <div className="mt-4 rounded border border-slate-200 p-2 text-[10px] text-slate-600">
            <p>
              {docT(lang, 'amountInWords')}: {lang === 'en' ? words.en : words.de}
            </p>
          </div>
        )}

        {profile?.iban && (
          <div className="mt-4 border-t pt-3 text-slate-600">
            <p className="font-semibold">{docT(lang, 'payment')}</p>
            <p>{profile.bankName}</p>
            <p>IBAN: {profile.iban}</p>
            {profile.bic && <p>BIC: {profile.bic}</p>}
            <p>
              {docT(lang, 'reference')}: {doc.document_number}
            </p>
            <p className="mt-1">{doc.payment_terms || profile.defaultPaymentTerms}</p>
          </div>
        )}

        {(profile?.isKleinunternehmer || doc.legal_footnote) && (
          <p className="mt-3 text-[10px] italic text-slate-500">
            {doc.legal_footnote ||
              (lang === 'en' ? docT('en', 'kleinunternehmer') : KLEINUNTERNEHMER_FOOTNOTE)}
          </p>
        )}

        {doc.reverse_charge_notice && (
          <p className="mt-2 text-[10px] font-medium">{docT(lang, 'reverseCharge')}</p>
        )}

        {doc.notes && <p className="mt-2 text-slate-600">{doc.notes}</p>}
        <p className="mt-2 text-slate-500">{footerText}</p>
      </div>
    </div>
  )
}
