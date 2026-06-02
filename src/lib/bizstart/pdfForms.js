import { jsPDF } from 'jspdf'

export function generateGewerbePdf(form) {
  const pdf = new jsPDF()
  let y = 20
  pdf.setFontSize(16)
  pdf.text('Gewerbeanmeldung (Voranmeldung)', 20, y)
  y += 12
  pdf.setFontSize(10)
  pdf.text(`Name: ${form.firstName || ''} ${form.lastName || ''}`, 20, y)
  y += 6
  pdf.text(`Geburtsdatum: ${form.dateOfBirth || ''}`, 20, y)
  y += 6
  pdf.text(`Anschrift: ${form.street || ''} ${form.houseNumber || ''}, ${form.plz || ''} ${form.city || ''}`, 20, y)
  y += 6
  pdf.text(`Gewerbe/ Tätigkeit: ${form.businessActivityDescription || ''}`, 20, y)
  y += 6
  pdf.text(`Betriebseröffnung: ${form.businessStartDate || ''}`, 20, y)
  y += 6
  pdf.text(`Telefon: ${form.phone || ''} | E-Mail: ${form.email || ''}`, 20, y)
  y += 10
  pdf.setFontSize(8)
  pdf.text('Dieses Dokument wurde von AcridScanLogic BizStart vorab ausgefüllt. Bitte prüfen und beim Gewerbeamt einreichen.', 20, y)
  pdf.save(`Gewerbeanmeldung_${form.plz || 'draft'}.pdf`)
}

export function generateFragebogenPdf(form) {
  const pdf = new jsPDF()
  let y = 20
  pdf.setFontSize(14)
  pdf.text('Fragebogen zur steuerlichen Erfassung', 20, y)
  y += 10
  pdf.setFontSize(10)
  const lines = [
    `1. Name: ${form.firstName} ${form.lastName}`,
    `2. Adresse: ${form.street} ${form.houseNumber}, ${form.plz} ${form.city}`,
    `3. Steuer-ID: ${form.taxId || '—'}`,
    `4. Tätigkeit: ${form.businessActivityDescription}`,
    `5. Beginn: ${form.businessStartDate}`,
    `6. Umsatz Jahr 1: ${form.expectedRevenueYear1 || '—'} EUR`,
    `7. Gewinn Jahr 1: ${form.expectedProfitYear1 || '—'} EUR`,
    `8. USt: ${form.vatScheme === 'kleinunternehmer' ? 'Kleinunternehmer §19' : 'Regelbesteuerung'}`,
    `9. USt-Voranmeldung: ${form.vatFilingFrequency || 'quarterly'}`,
    `10. Bank: ${form.bankName || ''} IBAN: ${form.iban || ''}`,
    `11. Wirtschaftsjahr: Januar – Dezember`,
  ]
  lines.forEach((line) => {
    pdf.text(line, 20, y)
    y += 7
  })
  pdf.save(`Fragebogen_stErfassung_${form.lastName || 'draft'}.pdf`)
}
