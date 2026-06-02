import { jsPDF } from 'jspdf'

export async function generateSignedContractPdf(contract, signers = []) {
  const pdf = new jsPDF()
  let y = 20
  pdf.setFontSize(16)
  pdf.text(contract.title || 'Contract', 20, y)
  y += 12
  pdf.setFontSize(10)
  ;(contract.sections || []).forEach((s) => {
    pdf.setFont(undefined, 'bold')
    pdf.text(s.heading || '', 20, y)
    y += 6
    pdf.setFont(undefined, 'normal')
    const lines = pdf.splitTextToSize(s.body || '', 170)
    pdf.text(lines, 20, y)
    y += lines.length * 5 + 4
    if (y > 260) {
      pdf.addPage()
      y = 20
    }
  })
  y += 10
  pdf.text('Signatures:', 20, y)
  y += 8
  signers.forEach((s) => {
    pdf.text(`${s.signer_name || s.name} — ${s.signing_status || s.status} — ${s.signed_at || 'pending'}`, 20, y)
    y += 6
    if (s.signature_image_url || s.signature_data_url) {
      try {
        pdf.addImage(s.signature_image_url || s.signature_data_url, 'JPEG', 20, y, 50, 20)
        y += 25
      } catch {
        y += 4
      }
    }
  })
  pdf.save(`${(contract.title || 'contract').replace(/\s+/g, '_')}_signed.pdf`)
}
