import { drawLegalMarkdownBody } from '@/lib/pdf/drawLegalMarkdownBody'
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

function sectionBodyLooksLikeMarkdown(body = '') {
  return /(\*\*|^#+\s|^- )/m.test(body)
}

export async function generateSignedContractPdf(contract, signers = [], { branding } = {}) {
  const pdf = createBrandedPdf()
  const pdfOpts = { branding, module: 'Contract Safe' }

  let y = drawBrandedHeader(pdf, {
    title: contract.title || 'Vertrag',
    subtitle: contract.template_type ? `Typ: ${contract.template_type}` : undefined,
    ...pdfOpts,
  })

  const sections = contract.contract_body?.sections || contract.sections || []
  sections.forEach((sec, i) => {
    y = ensureSpace(pdf, y, 20, { title: contract.title, ...pdfOpts })
    y = drawSectionTitle(pdf, y, sec.heading || `Abschnitt ${i + 1}`)
    if (sectionBodyLooksLikeMarkdown(sec.body)) {
      y = drawLegalMarkdownBody(pdf, y, sec.body || '', {
        module: 'Contract Safe',
        docTitle: contract.title,
        fragment: true,
        branding,
      })
    } else {
      y = drawBodyParagraph(pdf, y, sec.body || '')
    }
    y += 4
  })

  y = ensureSpace(pdf, y, 16, { title: contract.title, ...pdfOpts })
  y = drawSectionTitle(pdf, y, 'Unterschriften')

  signers.forEach((s) => {
    y = ensureSpace(pdf, y, 30, pdfOpts)
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
          y = drawBrandedHeader(pdf, { title: contract.title, ...pdfOpts })
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
    'Contract Safe — Entwurf, keine Rechtsberatung. Vor Unterzeichnung Rechtsanwalt konsultieren.',
    { branding }
  )
}
