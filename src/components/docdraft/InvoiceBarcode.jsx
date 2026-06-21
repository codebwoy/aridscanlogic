import { useMemo } from 'react'
import { buildInvoiceBarcodeDataUrl, shouldShowInvoiceBarcode } from '@/lib/docdraft/invoiceBarcode'

export default function InvoiceBarcode({ doc, profile, className = '' }) {
  const src = useMemo(() => {
    if (!shouldShowInvoiceBarcode(doc, profile)) return null
    try {
      return buildInvoiceBarcodeDataUrl(doc.document_number)
    } catch {
      return null
    }
  }, [doc?.document_number, doc?.show_barcode, profile?.showInvoiceBarcode])

  if (!src) return null

  return <img src={src} alt="" className={`max-w-full object-contain ${className}`} />
}
