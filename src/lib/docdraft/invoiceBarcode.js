import JsBarcode from 'jsbarcode'

/** CODE128 barcode PNG data URL for invoice number (browser only). */
export function buildInvoiceBarcodeDataUrl(text) {
  const value = String(text || '').trim()
  if (!value) return null

  const canvas = document.createElement('canvas')
  JsBarcode(canvas, value, {
    format: 'CODE128',
    width: 1.4,
    height: 36,
    displayValue: true,
    fontSize: 10,
    margin: 0,
    textMargin: 2,
  })
  return canvas.toDataURL('image/png')
}

export function shouldShowInvoiceBarcode(doc, profile) {
  if (profile?.showInvoiceBarcode === false) return false
  if (doc?.show_barcode === false) return false
  return Boolean(String(doc?.document_number || '').trim())
}
