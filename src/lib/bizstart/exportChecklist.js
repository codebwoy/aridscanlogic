import { STEP_LABELS } from './steps'
import { loadFormData, loadStepStatus } from './store'
import {
  createBrandedPdf,
  drawBrandedHeader,
  drawFieldRow,
  drawSectionTitle,
  drawBodyParagraph,
  ensureSpace,
  saveBrandedPdf,
} from '@/lib/pdf/brandedPdf'

export function exportRegistrationChecklistPdf(lang = 'en', steps = []) {
  const form = loadFormData()
  const status = loadStepStatus()
  const labels = STEP_LABELS[lang] || STEP_LABELS.en
  const pdf = createBrandedPdf()

  let y = drawBrandedHeader(pdf, {
    title: lang === 'de' ? 'Anmelde-Checkliste' : 'Registration Checklist',
    subtitle: 'BizStart Germany — Schritt für Schritt',
    module: 'BizStart Germany',
  })

  y = drawFieldRow(pdf, y, lang === 'de' ? 'Rechtsform' : 'Structure', form.businessStructure, { alt: true })
  y = drawFieldRow(
    pdf,
    y,
    lang === 'de' ? 'Unternehmen' : 'Business',
    form.businessName || form.intendedBusinessName || form.tradeName
  )

  y = drawSectionTitle(pdf, y + 6, lang === 'de' ? 'Schritte' : 'Steps')
  steps.forEach((step, i) => {
    const st = status[step.id]?.status || 'not_started'
    y = ensureSpace(pdf, y, 8, {
      title: lang === 'de' ? 'Anmelde-Checkliste' : 'Registration Checklist',
      module: 'BizStart Germany',
    })
    y = drawFieldRow(
      pdf,
      y,
      `[${st}]`,
      `${labels[step.id] || step.id} (~${step.estMin} min)`,
      { alt: i % 2 === 0 }
    )
  })

  y = drawSectionTitle(pdf, y + 4, lang === 'de' ? 'Dokumente' : 'Documents')
  ;['ID / passport', 'Proof of address', 'Business plan (if GmbH)', 'Shareholder list'].forEach((item) => {
    y = ensureSpace(pdf, y, 8, { module: 'BizStart Germany' })
    y = drawBodyParagraph(pdf, y, `☐  ${item}`)
  })

  saveBrandedPdf(
    pdf,
    `BizStart_Checklist_${form.businessName || form.intendedBusinessName || 'registration'}.pdf`.replace(/\s+/g, '_')
  )
}
