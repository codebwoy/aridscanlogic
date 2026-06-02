import { DOC_TYPES, TEMPLATES } from '@/lib/docdraft/constants'
import { KLEINUNTERNEHMER_FOOTNOTE } from '@/lib/docCalculations'
import { amountToWords } from '@/lib/docdraft/amountInWords'

export default function DocumentPreview({ doc, profile, client }) {
  const type = DOC_TYPES[doc.document_type] || DOC_TYPES.invoice
  const template = TEMPLATES.find((t) => t.id === doc.templateId) || TEMPLATES[0]
  const isDelivery = doc.document_type === 'delivery_note'
  const isReceipt = doc.document_type === 'receipt'
  const bilingual = template.id === 'bilingual'
  const headerStyle = template.id === 'bold' ? { background: profile?.headerColor || '#4f46e5' } : {}

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
              <p className="mt-1 text-slate-500">St.-Nr. {profile.steuernummer}</p>
            )}
            {profile?.ustIdNr && <p className="text-slate-500">USt-IdNr. {profile.ustIdNr}</p>}
          </div>
          <div className="text-right">
            {template.id !== 'bold' && (
              <p className="text-base font-bold">
                {bilingual ? `${type.title} / ${type.label}` : type.title}
              </p>
            )}
            <p>
              {bilingual ? 'Nr. / No.' : 'Nr.'} {doc.document_number}
            </p>
            <p>
              {bilingual ? 'Datum / Date' : 'Datum'}: {doc.issue_date}
            </p>
            {doc.delivery_date && (
              <p>Leistungsdatum: {doc.delivery_date}</p>
            )}
            {doc.due_date && <p>Zahlungsziel: {doc.due_date}</p>}
            {doc.valid_until && <p>Gültig bis: {doc.valid_until}</p>}
          </div>
        </div>

        <div className="mb-4 rounded-lg bg-slate-50 p-3">
          <p className="font-semibold text-slate-700">
            {bilingual ? 'Empfänger / Recipient' : 'Empfänger'}
          </p>
          <p>{recipient?.companyName || recipient?.contactName}</p>
          {recipient?.contactName && recipient?.companyName && <p>{recipient.contactName}</p>}
          <p className="text-slate-600">{recipient?.billingAddress}</p>
        </div>

        {doc.linked_invoice_number && (
          <p className="mb-2 text-amber-800">
            Bezieht sich auf Rechnung {doc.linked_invoice_number}
          </p>
        )}

        <table className="mb-4 w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-300 text-left text-slate-600">
              <th className="py-1">Beschreibung</th>
              <th className="py-1 text-right">Menge</th>
              {!isDelivery && <th className="py-1 text-right">Einzel</th>}
              {!isDelivery && !profile?.isKleinunternehmer && (
                <th className="py-1 text-right">MwSt</th>
              )}
              {!isDelivery && <th className="py-1 text-right">Gesamt</th>}
            </tr>
          </thead>
          <tbody>
            {(doc.line_items || []).map((line, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-1.5">{line.description}</td>
                <td className="py-1.5 text-right">
                  {line.quantity} {line.unit || 'Stk'}
                </td>
                {!isDelivery && (
                  <>
                    <td className="py-1.5 text-right">{line.unit_price?.toFixed(2)} €</td>
                    {!profile?.isKleinunternehmer && (
                      <td className="py-1.5 text-right">{line.vat_rate}%</td>
                    )}
                    <td className="py-1.5 text-right font-medium">
                      {(line.total_gross ?? line.total)?.toFixed(2)} €
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {!isDelivery && (
          <div className="ml-auto w-48 space-y-1 text-right">
            <p>Netto: {doc.subtotal_net?.toFixed(2)} €</p>
            {!profile?.isKleinunternehmer &&
              Object.entries(doc.vat_breakdown || {}).map(([rate, amt]) =>
                Number(rate) > 0 ? (
                  <p key={rate} className="text-slate-600">
                    {rate}% MwSt: {Number(amt).toFixed(2)} €
                  </p>
                ) : null
              )}
            <p className="text-base font-bold">Brutto: {doc.total_gross?.toFixed(2)} €</p>
          </div>
        )}

        {words && (
          <div className="mt-4 rounded border border-slate-200 p-2 text-[10px] text-slate-600">
            <p>{words.formatted}</p>
          </div>
        )}

        {profile?.iban && (
          <div className="mt-4 border-t pt-3 text-slate-600">
            <p className="font-semibold">Zahlung</p>
            <p>{profile.bankName}</p>
            <p>IBAN: {profile.iban}</p>
            {profile.bic && <p>BIC: {profile.bic}</p>}
            <p>Verwendungszweck: {doc.document_number}</p>
            <p className="mt-1">{doc.payment_terms || profile.defaultPaymentTerms}</p>
          </div>
        )}

        {(profile?.isKleinunternehmer || doc.legal_footnote) && (
          <p className="mt-3 text-[10px] italic text-slate-500">
            {doc.legal_footnote || KLEINUNTERNEHMER_FOOTNOTE}
          </p>
        )}

        {doc.reverse_charge_notice && (
          <p className="mt-2 text-[10px] font-medium">
            Steuerschuldnerschaft des Leistungsempfängers
          </p>
        )}

        {doc.notes && <p className="mt-2 text-slate-600">{doc.notes}</p>}
        <p className="mt-2 text-slate-500">{doc.footer || profile?.defaultFooter}</p>
      </div>
    </div>
  )
}
