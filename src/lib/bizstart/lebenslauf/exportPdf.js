import { jsPDF } from 'jspdf'
import { cvDisplayName, cvSlug } from './schema'
import { bulletsFromMultiline, formatGeburtsdatum, familienstandLabel } from './formatters'

const MARGIN = 18
const PAGE_W = 210
const CONTENT_W = PAGE_W - MARGIN * 2

function ensureSpace(pdf, y, need = 12) {
  if (y + need > 285) {
    pdf.addPage()
    return MARGIN
  }
  return y
}

function sectionTitle(pdf, y, title) {
  y = ensureSpace(pdf, y, 14)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(11)
  pdf.setTextColor(30, 30, 30)
  pdf.text(title, MARGIN, y)
  pdf.setDrawColor(180, 180, 180)
  pdf.line(MARGIN, y + 1.5, PAGE_W - MARGIN, y + 1.5)
  return y + 8
}

function bodyLines(pdf, y, text, indent = 0) {
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(50, 50, 50)
  const lines = pdf.splitTextToSize(text, CONTENT_W - indent)
  for (const line of lines) {
    y = ensureSpace(pdf, y, 5)
    pdf.text(line, MARGIN + indent, y)
    y += 4.2
  }
  return y
}

function timelineEntry(pdf, y, { von, bis, headline, sub, bullets = [] }) {
  y = ensureSpace(pdf, y, 16)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(9)
  pdf.setTextColor(30, 30, 30)
  const period = [von, bis].filter(Boolean).join(' – ') || '—'
  pdf.text(period, MARGIN, y)
  pdf.setFont('helvetica', 'bold')
  pdf.text(headline || '', MARGIN + 38, y)
  y += 4.5
  if (sub) {
    pdf.setFont('helvetica', 'italic')
    pdf.setFontSize(8.5)
    pdf.setTextColor(80, 80, 80)
    pdf.text(sub, MARGIN + 38, y)
    y += 4.5
  }
  for (const b of bullets) {
    y = ensureSpace(pdf, y, 5)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8.5)
    pdf.setTextColor(50, 50, 50)
    const wrapped = pdf.splitTextToSize(`• ${b}`, CONTENT_W - 42)
    for (const line of wrapped) {
      pdf.text(line, MARGIN + 40, y)
      y += 4
    }
  }
  return y + 2
}

function drawPhoto(pdf, photoBase64, x, y, size = 35) {
  if (!photoBase64?.startsWith('data:image')) return
  try {
    pdf.addImage(photoBase64, 'JPEG', x, y, size, size * 1.25)
    pdf.setDrawColor(200, 200, 200)
    pdf.rect(x, y, size, size * 1.25)
  } catch {
    /* skip invalid photo */
  }
}

export function buildLebenslaufPdfDocument(cv) {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
  const name = cvDisplayName(cv)
  const sigName = cv.unterschriftName?.trim() || name

  let y = MARGIN
  const photoX = PAGE_W - MARGIN - 35

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(18)
  pdf.setTextColor(20, 20, 20)
  pdf.text(name || 'Lebenslauf', MARGIN, y + 6)

  if (cv.job_title?.trim()) {
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(11)
    pdf.setTextColor(80, 80, 80)
    pdf.text(cv.job_title.trim(), MARGIN, y + 13)
    y += 4
  }

  drawPhoto(pdf, cv.photo, photoX, MARGIN - 2)
  y += cv.job_title?.trim() ? 14 : 10

  // Persönliche Daten
  y = sectionTitle(pdf, y, 'Persönliche Daten')
  const personal = [
    ['Adresse', [cv.strasse, `${cv.plz} ${cv.stadt}`.trim()].filter(Boolean).join(', ')],
    ['Telefon', cv.telefon],
    ['E-Mail', cv.email],
    ['LinkedIn', cv.linkedin],
    ['Geburtsdatum', formatGeburtsdatum(cv.geburtsdatum)],
    ['Geburtsort', cv.geburtsort],
    ['Staatsangehörigkeit', cv.nationalitaet],
    ['Familienstand', familienstandLabel(cv.familienstand)],
    ['Führerschein', cv.fuehrerschein !== 'Kein' ? cv.fuehrerschein : ''],
  ].filter(([, v]) => v?.trim())

  pdf.setFontSize(8.5)
  for (const [label, val] of personal) {
    y = ensureSpace(pdf, y, 5)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(60, 60, 60)
    pdf.text(`${label}:`, MARGIN, y)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(40, 40, 40)
    pdf.text(String(val), MARGIN + 38, y)
    y += 4.5
  }
  y += 3

  if (cv.profil?.trim()) {
    y = sectionTitle(pdf, y, 'Profil')
    y = bodyLines(pdf, y, cv.profil.trim())
    y += 2
  }

  if (cv.erfahrung?.length) {
    y = sectionTitle(pdf, y, 'Berufserfahrung')
    for (const e of cv.erfahrung) {
      if (!e.titel?.trim() && !e.unternehmen?.trim()) continue
      y = timelineEntry(pdf, y, {
        von: e.von,
        bis: e.bis || 'heute',
        headline: e.titel,
        sub: [e.unternehmen, e.stadt, e.branche].filter(Boolean).join(' · '),
        bullets: bulletsFromMultiline(e.aufgaben),
      })
    }
    y += 2
  }

  if (cv.ausbildung?.length) {
    y = sectionTitle(pdf, y, 'Ausbildung')
    for (const e of cv.ausbildung) {
      if (!e.abschluss?.trim() && !e.institution?.trim()) continue
      const note = e.note?.trim() ? ` (Note: ${e.note})` : ''
      y = timelineEntry(pdf, y, {
        von: e.von,
        bis: e.bis,
        headline: `${e.abschluss}${note}`,
        sub: [e.institution, e.stadt].filter(Boolean).join(', '),
        bullets: bulletsFromMultiline(e.schwerpunkte),
      })
    }
    y += 2
  }

  if (cv.weiterbildung?.length) {
    y = sectionTitle(pdf, y, 'Weiterbildung & Zertifikate')
    for (const w of cv.weiterbildung) {
      if (!w.titel?.trim()) continue
      y = timelineEntry(pdf, y, {
        von: w.jahr,
        bis: '',
        headline: w.titel,
        sub: w.anbieter,
        bullets: [],
      })
    }
    y += 2
  }

  if (cv.sprachen?.length) {
    y = sectionTitle(pdf, y, 'Sprachkenntnisse')
    for (const s of cv.sprachen) {
      if (!s.sprache?.trim()) continue
      const line = `${s.sprache}: ${s.niveau}${s.zertifikat?.trim() ? ` (${s.zertifikat})` : ''}`
      y = bodyLines(pdf, y, line)
    }
    y += 2
  }

  if (cv.itSkills?.length) {
    y = sectionTitle(pdf, y, 'IT-Kenntnisse')
    for (const s of cv.itSkills) {
      if (!s.software?.trim()) continue
      y = bodyLines(pdf, y, `${s.software}: ${s.niveau}`)
    }
    y += 2
  }

  if (cv.weitereKenntnisse?.trim()) {
    y = sectionTitle(pdf, y, 'Weitere Kenntnisse')
    for (const b of bulletsFromMultiline(cv.weitereKenntnisse)) {
      y = bodyLines(pdf, y, `• ${b}`)
    }
    y += 2
  }

  if (cv.ehrenamt?.length) {
    y = sectionTitle(pdf, y, 'Ehrenamt & Engagement')
    for (const e of cv.ehrenamt) {
      if (!e.taetigkeit?.trim()) continue
      y = timelineEntry(pdf, y, {
        von: e.zeitraum,
        bis: '',
        headline: e.taetigkeit,
        sub: e.organisation,
        bullets: [],
      })
    }
    y += 2
  }

  if (cv.interessen?.trim()) {
    y = sectionTitle(pdf, y, 'Interessen')
    y = bodyLines(pdf, y, cv.interessen.trim())
    y += 2
  }

  y = ensureSpace(pdf, y, 20)
  y += 6
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(50, 50, 50)
  const ortDatum = [cv.unterschriftOrt, cv.unterschriftDatum].filter(Boolean).join(', ')
  if (ortDatum) pdf.text(ortDatum, MARGIN, y)
  y += 12
  pdf.setFont('helvetica', 'italic')
  pdf.text(sigName, MARGIN, y)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(7.5)
  pdf.setTextColor(120, 120, 120)
  pdf.text('Unterschrift', MARGIN, y + 4)

  return pdf
}

export function lebenslaufPdfBlob(cv) {
  const pdf = buildLebenslaufPdfDocument(cv)
  return pdf.output('blob')
}

export function downloadLebenslaufPdf(cv) {
  const pdf = buildLebenslaufPdfDocument(cv)
  pdf.save(`Lebenslauf_${cvSlug(cv)}.pdf`)
}

export function printLebenslauf() {
  window.print()
}
