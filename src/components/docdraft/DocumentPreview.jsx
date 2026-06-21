import { KLEINUNTERNEHMER_FOOTNOTE } from '@/lib/docCalculations'
import { amountToWords } from '@/lib/docdraft/amountInWords'
import { TEMPLATES } from '@/lib/docdraft/constants'
import {
  customerNumber,
  formatVatRateLabel,
  invoiceTotalsRows,
  lineItemsHaveProductMeta,
  profileAddressLines,
  profileOneLineAddress,
  profileStreetLine,
  recipientDisplayName,
  resolveProcessor,
} from '@/lib/docdraft/invoiceLayout'
import InvoiceBarcode from '@/components/docdraft/InvoiceBarcode'
import {
  docT,
  docTypeLabels,
  formatDocumentDate,
  formatMoney,
  resolveDocumentLanguage,
  unitLabel,
} from '@/lib/docdraft/documentI18n'

function ClassicGermanPreview({ doc, profile, client, lang }) {
  const type = docTypeLabels(doc.document_type, lang)
  const isDelivery = doc.document_type === 'delivery_note'
  const isReceipt = doc.document_type === 'receipt'
  const currency = doc.currency || profile?.defaultCurrency || 'EUR'
  const isKu = profile?.isKleinunternehmer

  const recipient = {
    companyName: doc.recipient_name || client?.companyName || client?.contactName,
    contactName:
      doc.recipient_contact ||
      (client?.companyName && client?.contactName ? client.contactName : undefined),
    billingAddress: doc.recipient_address || client?.billingAddress,
    shippingAddress: doc.recipient_shipping_address || client?.shippingAddress,
    email: doc.recipient_email || client?.email,
  }

  const words =
    isReceipt && doc.total_gross ? amountToWords(Math.abs(doc.total_gross)) : null

  const footerText =
    doc.footer ||
    profile?.defaultFooter ||
    `${docT(lang, 'thankYouTeam')} ${profile?.businessName || ''} Team`.trim()

  const custNo = customerNumber(client)
  const processor = resolveProcessor(doc, profile)
  const showProductMeta = lineItemsHaveProductMeta(doc.line_items)
  const showShipping =
    recipient?.shippingAddress && recipient.shippingAddress !== recipient.billingAddress

  return (
    <div className="overflow-hidden rounded-xl border border-slate-300 bg-white text-[11px] leading-snug text-slate-900 shadow-xl">
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div className="max-w-[48%]">
            <InvoiceBarcode doc={doc} profile={profile} className="h-10" />
          </div>
          <div className="min-w-[140px] text-right">
            {profile?.logoUrl ? (
              <img src={profile.logoUrl} alt="" className="ml-auto mb-2 h-10 object-contain" />
            ) : (
              <p className="text-sm font-bold italic">{profile?.businessName}</p>
            )}
            <div className="space-y-0.5 text-[10px] text-slate-500">
              <p>{docT(lang, 'page')}: 1 / 1</p>
              {custNo && (
                <p>
                  {docT(lang, 'customerNo')} {custNo}
                </p>
              )}
              {processor && (
                <p>
                  {docT(lang, 'processor')} {processor}
                </p>
              )}
              <p>
                {docT(lang, 'date')} {formatDocumentDate(doc.issue_date, lang)}
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
            </div>
          </div>
        </div>

        <p className="mb-6 text-[9px] text-slate-500">{profileOneLineAddress(profile)}</p>

        <div className="mb-8 min-h-[72px] text-[12px]">
          <p className="font-medium">{recipientDisplayName(recipient)}</p>
          {recipient?.contactName && recipient?.companyName && <p>{recipient.contactName}</p>}
          <p className="whitespace-pre-line text-slate-700">{recipient?.billingAddress}</p>
        </div>

        <div className="mb-4 flex items-end justify-between gap-4 border-b border-slate-900 pb-2">
          <h2 className="text-xl font-bold tracking-tight">
            {type.label} {doc.document_number}
          </h2>
          {(doc.linked_invoice_number || doc.reference_number) && (
            <p className="text-[10px] text-slate-500">
              {doc.reference_number
                ? `${docT(lang, 'orderRef')}: ${doc.reference_number} ${docT(lang, 'orderFrom')} ${formatDocumentDate(doc.reference_date, lang)}`
                : `${docT(lang, 'linkedInvoice')} ${doc.linked_invoice_number}`}
            </p>
          )}
        </div>

        {showShipping && (
          <div className="mb-4 text-[11px]">
            <p className="font-semibold">
              {docT(lang, 'deliveryTo')}: {recipientDisplayName(recipient)}
            </p>
            <p className="whitespace-pre-line text-slate-600">{recipient.shippingAddress}</p>
          </div>
        )}

        <table className="mb-4 w-full border-collapse text-[10px]">
          <thead>
            <tr className="border-y border-slate-900 font-semibold uppercase tracking-wide text-slate-600">
              <th className="w-7 py-1.5 text-left">{docT(lang, 'position')}</th>
              <th className="py-1.5 text-left">{docT(lang, 'description')}</th>
              {showProductMeta && (
                <>
                  <th className="w-14 py-1.5 text-left">{docT(lang, 'lotNumber')}</th>
                  <th className="w-16 py-1.5 text-left">{docT(lang, 'ean')}</th>
                  <th className="w-14 py-1.5 text-left">{docT(lang, 'expiryDate')}</th>
                </>
              )}
              <th className="w-14 py-1.5 text-right">{docT(lang, 'quantity')}</th>
              {!isDelivery && <th className="w-16 py-1.5 text-right">{docT(lang, 'unitPrice')}</th>}
              {!isDelivery && !isKu && <th className="w-10 py-1.5 text-right">{docT(lang, 'vat')}</th>}
              {!isDelivery && <th className="w-20 py-1.5 text-right">{docT(lang, 'total')}</th>}
            </tr>
          </thead>
          <tbody>
            {(doc.line_items || []).map((line, i) => (
              <tr key={i} className="border-b border-slate-200">
                <td className="py-2 align-top text-slate-500">{i + 1}</td>
                <td className="py-2 align-top">
                  <p>{line.description}</p>
                  {line.sku && (
                    <p className="text-[9px] text-slate-500">
                      {docT(lang, 'articleNo')} {line.sku}
                    </p>
                  )}
                </td>
                {showProductMeta && (
                  <>
                    <td className="py-2 align-top text-[9px]">{line.lot_number || '—'}</td>
                    <td className="py-2 align-top text-[9px]">{line.ean || '—'}</td>
                    <td className="py-2 align-top text-[9px]">
                      {line.expiry_date ? formatDocumentDate(line.expiry_date, lang) : '—'}
                    </td>
                  </>
                )}
                <td className="py-2 align-top text-right tabular-nums">
                  {line.quantity} {unitLabel(line.unit, lang)}
                </td>
                {!isDelivery && (
                  <>
                    <td className="py-2 align-top text-right tabular-nums">
                      {formatMoney(line.unit_price, currency, lang)}
                    </td>
                    {!isKu && (
                      <td className="py-2 align-top text-right tabular-nums">{line.vat_rate}%</td>
                    )}
                    <td className="py-2 align-top text-right font-medium tabular-nums">
                      {formatMoney(line.total_gross ?? line.total, currency, lang)}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {!isDelivery && (
          <div className="mb-6 ml-auto w-64 space-y-1 border-t border-slate-900 pt-2 text-right text-[11px]">
            {invoiceTotalsRows(doc, { isKu }).map((row) => {
              const label =
                row.rate != null && row.key === 'net'
                  ? `${docT(lang, 'net')} ${formatVatRateLabel(row.rate)}`
                  : row.rate != null && row.key === 'vat'
                    ? `${docT(lang, 'vat')} ${formatVatRateLabel(row.rate)}`
                    : docT(lang, row.labelKey)

              if (row.key === 'total') {
                return (
                  <div key={row.key} className="border-t border-slate-900 pt-1">
                    <p className="text-sm font-bold">
                      {label}: {formatMoney(row.amount, currency, lang)}
                    </p>
                  </div>
                )
              }

              return (
                <p key={`${row.key}-${row.rate ?? 'x'}`} className={row.bold ? 'font-semibold' : 'text-slate-600'}>
                  {label}: {formatMoney(row.amount, currency, lang)}
                </p>
              )
            })}
          </div>
        )}

        {words && (
          <p className="mb-4 text-[10px] italic text-slate-600">
            {docT(lang, 'amountInWords')}: {lang === 'en' ? words.en : words.de}
          </p>
        )}

        <div className="mb-4 space-y-1 text-[11px]">
          {(doc.payment_terms || profile?.defaultPaymentTerms) && (
            <p>
              {docT(lang, 'paymentTermsLabel')}: {doc.payment_terms || profile.defaultPaymentTerms}
            </p>
          )}
          {profile?.iban && (
            <p className="text-slate-600">
              {[profile.bankName, profile.iban && `IBAN ${profile.iban}`, profile.bic && `BIC ${profile.bic}`]
                .filter(Boolean)
                .join(' · ')}
              {' · '}
              {docT(lang, 'reference')}: {doc.document_number}
            </p>
          )}
          <p>{footerText}</p>
        </div>

        {(isKu || doc.legal_footnote) && (
          <p className="mb-3 text-[9px] italic text-slate-500">
            {doc.legal_footnote ||
              (lang === 'en' ? docT('en', 'kleinunternehmer') : KLEINUNTERNEHMER_FOOTNOTE)}
          </p>
        )}

        {doc.reverse_charge_notice && (
          <p className="mb-2 text-[10px] font-medium">{docT(lang, 'reverseCharge')}</p>
        )}

        {doc.notes && <p className="mb-4 text-slate-600">{doc.notes}</p>}

        <div className="mt-6 border-t border-slate-300 pt-3">
          <div className="grid grid-cols-2 gap-3 text-[9px] text-slate-500 sm:grid-cols-4">
            <div>
              <p className="mb-1 font-semibold text-slate-700">{docT(lang, 'company')}</p>
              <p>{profile?.businessName}</p>
              <p>{profileStreetLine(profile)}</p>
              <p>{profileAddressLines(profile)[1]}</p>
            </div>
            <div>
              <p className="mb-1 font-semibold text-slate-700">{docT(lang, 'contact')}</p>
              {profile?.phone && (
                <p>
                  {docT(lang, 'phone')} {profile.phone}
                </p>
              )}
              {profile?.email && (
                <p>
                  {docT(lang, 'email')} {profile.email}
                </p>
              )}
              {profile?.website && (
                <p>
                  {docT(lang, 'web')} {profile.website}
                </p>
              )}
            </div>
            <div>
              <p className="mb-1 font-semibold text-slate-700">{docT(lang, 'bank')}</p>
              {profile?.bankName && <p>{profile.bankName}</p>}
              {profile?.iban && <p>IBAN {profile.iban}</p>}
              {profile?.bic && <p>BIC {profile.bic}</p>}
            </div>
            <div>
              <p className="mb-1 font-semibold text-slate-700">{docT(lang, 'legal')}</p>
              {profile?.legalStructure && <p>{profile.legalStructure}</p>}
              {profile?.ustIdNr && (
                <p>
                  {docT(lang, 'vatId')} {profile.ustIdNr}
                </p>
              )}
              {profile?.steuernummer && (
                <p>
                  {docT(lang, 'taxId')} {profile.steuernummer}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AlternateTemplatePreview({ doc, profile, client, lang, template }) {
  const type = docTypeLabels(doc.document_type, lang)
  const isDelivery = doc.document_type === 'delivery_note'
  const isReceipt = doc.document_type === 'receipt'
  const bilingual = template.id === 'bilingual'
  const headerStyle = template.id === 'bold' ? { background: profile?.headerColor || '#4f46e5' } : {}
  const currency = doc.currency || profile?.defaultCurrency || 'EUR'

  const recipient = {
    companyName: doc.recipient_name || client?.companyName || client?.contactName,
    contactName:
      doc.recipient_contact ||
      (client?.companyName && client?.contactName ? client.contactName : undefined),
    billingAddress: doc.recipient_address || client?.billingAddress,
    email: doc.recipient_email || client?.email,
  }

  const words =
    isReceipt && doc.total_gross ? amountToWords(Math.abs(doc.total_gross)) : null

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
              <p className="text-sm font-bold">{profile?.businessName}</p>
            )}
            <p className="text-slate-600">{profileStreetLine(profile)}</p>
            <p className="text-slate-600">{profileAddressLines(profile)[1]}</p>
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
                {bilingual
                  ? `${type.title} / ${docTypeLabels(doc.document_type, lang === 'de' ? 'en' : 'de').title}`
                  : type.title}
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

export default function DocumentPreview({ doc, profile, client, lang: langOverride }) {
  const lang = resolveDocumentLanguage(doc, profile, langOverride)
  const template = TEMPLATES.find((t) => t.id === doc.templateId) || TEMPLATES[0]

  if (template.id === 'classic') {
    return <ClassicGermanPreview doc={doc} profile={profile} client={client} lang={lang} />
  }

  return (
    <AlternateTemplatePreview
      doc={doc}
      profile={profile}
      client={client}
      lang={lang}
      template={template}
    />
  )
}
