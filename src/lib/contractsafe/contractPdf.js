import {
  createBrandedPdf,
  drawBrandedHeader,
  drawSectionTitle,
  drawBodyParagraph,
  drawFieldRow,
  ensureSpace,
  saveBrandedPdf,
  PDF_THEME,
} from '@/lib/pdf/brandedPdf'

export async function generateSignedContractPdf(contract, signers = []) {
  const pdf = createBrandedPdf()
  let y = drawBrandedHeader(pdf, {
    title: contract.title || 'Vertrag',
    subtitle: contract.template_type ? `Typ: ${contract.template_type}` : undefined,
    module: 'Contract Safe',
  })

  const sections = contract.contract_body?.sections || contract.sections || []
  sections.forEach((sec, i) => {
    y = ensureSpace(pdf, y, 20, { title: contract.title, module: 'Contract Safe' })
    y = drawSectionTitle(pdf, y, sec.heading || `Abschnitt ${i + 1}`)
    y = drawBodyParagraph(pdf, y, sec.body || '')
    y += 4
  })

  y = ensureSpace(pdf, y, 16, { title: contract.title, module: 'Contract Safe' })
  y = drawSectionTitle(pdf, y, 'Unterschriften')

  signers.forEach((s) => {
    y = ensureSpace(pdf, y, 30, { module: 'Contract Safe' })
    y = drawFieldRow(
      pdf,
      y,
      s.signer_name || s.name || 'Partei',
      `${s.signing_status || s.status || 'pending'}${s.signed_at ? ` · ${s.signed_at}` : ''}`,
      { alt: true }
    )
    const sig = s.signature_image_url || s.signature_data_url
    if (sig) {
      try {
        if (y + 28 > PDF_THEME.footerY) {
          pdf.addPage()
          y = drawBrandedHeader(pdf, { title: contract.title, module: 'Contract Safe' })
        }
        pdf.addImage(sig, 'JPEG', PDF_THEME.margin, y, 55, 22)
        y += 28
      } catch {
        y += 4
      }
    }
  })

  saveBrandedPdf(
    pdf,
    `${(contract.title || 'contract').replace(/\s+/g, '_')}_signed.pdf`,
    'Contract Safe — Entwurf, keine Rechtsberatung. Vor Unterzeichnung Rechtsanwalt konsultieren.'
  )
}
