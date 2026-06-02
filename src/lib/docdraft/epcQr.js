/** EPC QR (GiroCode) payload for SEPA credit transfer */
export function buildEpcQrPayload({ iban, bic, name, amount, reference, purpose = '' }) {
  const cleanIban = (iban || '').replace(/\s/g, '').toUpperCase()
  const amt = Number(amount) || 0
  const lines = [
    'BCD',
    '002',
    '1',
    'SCT',
    (bic || '').replace(/\s/g, '').toUpperCase(),
    (name || '').slice(0, 70),
    cleanIban,
    `EUR${amt.toFixed(2)}`,
    '',
    (reference || '').slice(0, 35),
    (purpose || '').slice(0, 70),
  ]
  return lines.join('\n')
}

export function epcQrImageUrl(payload) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(payload)}`
}
