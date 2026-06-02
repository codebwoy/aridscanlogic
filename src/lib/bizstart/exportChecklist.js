import { jsPDF } from 'jspdf'
import { STEP_LABELS } from './steps'
import { loadFormData, loadStepStatus } from './store'

export function exportRegistrationChecklistPdf(lang = 'en', steps = []) {
  const form = loadFormData()
  const status = loadStepStatus()
  const labels = STEP_LABELS[lang] || STEP_LABELS.en
  const pdf = new jsPDF()
  let y = 20

  pdf.setFontSize(18)
  pdf.text('BizStart Germany — Registration Checklist', 20, y)
  y += 10
  pdf.setFontSize(10)
  pdf.text(`Structure: ${form.businessStructure || '—'}`, 20, y)
  y += 6
  pdf.text(`Business: ${form.businessName || form.tradeName || '—'}`, 20, y)
  y += 6
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, y)
  y += 12

  pdf.setFontSize(12)
  pdf.text('Steps', 20, y)
  y += 8
  pdf.setFontSize(9)

  steps.forEach((step) => {
    const st = status[step.id]?.status || 'not_started'
    if (y > 270) {
      pdf.addPage()
      y = 20
    }
    pdf.text(`[${st}] ${labels[step.id] || step.id} (~${step.estMin} min)`, 20, y)
    y += 6
  })

  y += 8
  pdf.text('Documents checklist:', 20, y)
  y += 6
  ;['ID / passport', 'Proof of address', 'Business plan (if GmbH)', 'Shareholder list'].forEach((item) => {
    pdf.text(`☐ ${item}`, 25, y)
    y += 5
  })

  pdf.save(`BizStart_Checklist_${form.businessName || 'registration'}.pdf`.replace(/\s+/g, '_'))
}
