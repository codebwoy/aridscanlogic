import JSZip from 'jszip'
import { businessPlanPdfBlob, buildFinanceSnapshotText } from '@/lib/bizstart/businessPlanPdf'
import { mergeBusinessPlanForExport } from '@/lib/bizstart/businessPlanDraft'
import { PLAN_AUDIENCES } from '@/lib/bizstart/businessPlanGuidelines'
import { loadCv } from '@/lib/bizstart/lebenslauf/store'
import { lebenslaufPdfBlob } from '@/lib/bizstart/lebenslauf/exportPdf'
import { cvDisplayName, cvIsSubmissionReady } from '@/lib/bizstart/lebenslauf/schema'
import { loadAnschreiben } from '@/lib/bizstart/anschreiben/store'
import { anschreibenDisplayName, anschreibenIsSubmissionReady } from '@/lib/bizstart/anschreiben/schema'
import { anschreibenPdfBlob } from '@/lib/bizstart/anschreiben/exportPdf'

function audienceName(id, lang) {
  const a = PLAN_AUDIENCES.find((x) => x.id === id)
  if (!a) return id || '—'
  return lang === 'de' ? a.de : a.en
}

function slug(name) {
  return (name || 'businessplan').replace(/[^\wäöüß-]+/gi, '_').slice(0, 40)
}

function buildReadme(d, lang) {
  const title = d.planTitle || (lang === 'de' ? 'Businessplan' : 'Business plan')
  const audience = audienceName(d.planAudience, lang)
  if (lang === 'de') {
    return `${title}
Einreichungspaket — vorbereitet mit ScanLogic BizStart
Zielgruppe: ${audience}
Datum: ${new Date().toLocaleDateString('de-DE')}

Inhalt dieses Pakets:
1. Businessplan_Komplett.pdf — vollständiger Businessplan
2. Executive_Summary.pdf — Zusammenfassung (1–2 Seiten)
3. Finanzuebersicht.pdf — Finanzplan & Tabellen
4. Finanzuebersicht.txt — Finanzdaten als Text
5. README.txt — diese Datei
${cvIsSubmissionReady(loadCv()) ? '6. Lebenslauf.pdf — tabellarischer Lebenslauf\n' : ''}${anschreibenIsSubmissionReady(loadAnschreiben()) ? '7. Anschreiben.pdf — DIN 5008 Bewerbungsanschreiben\n' : ''}

Hinweis: Entwurf zur Vorbereitung — keine Rechts- oder Steuerberatung.
Vor Einreichung bei Bank, Förderstelle oder Wettbewerb prüfen lassen.
`
  }
  return `${title}
Submission pack — prepared with ScanLogic BizStart
Target reader: ${audience}
Date: ${new Date().toLocaleDateString('en-GB')}

This package contains:
1. Businessplan_Complete.pdf — full business plan
2. Executive_Summary.pdf — executive summary (1–2 pages)
3. Finance_Overview.pdf — finance plan & tables
4. Finance_Overview.txt — finance data as text
5. README.txt — this file
${cvIsSubmissionReady(loadCv()) ? '6. Lebenslauf.pdf — tabular CV\n' : ''}${anschreibenIsSubmissionReady(loadAnschreiben()) ? '7. Anschreiben.pdf — DIN 5008 cover letter\n' : ''}

Note: Draft for preparation only — not legal or tax advice.
Have reviewed by bank, funding agency, or competition jury before submission.
`
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** ZIP bundle for bank / award / grant submission. */
export async function downloadBusinessPlanSubmissionPack(formData, lang = 'de') {
  const d = mergeBusinessPlanForExport(formData)
  const name = slug(d.planTitle)
  const zip = new JSZip()
  const folder = zip.folder(lang === 'de' ? 'Einreichungspaket' : 'Submission_Pack')

  const [fullBlob, summaryBlob, financeBlob] = await Promise.all([
    businessPlanPdfBlob(formData, lang, { variant: 'full' }),
    businessPlanPdfBlob(formData, lang, { variant: 'summary' }),
    businessPlanPdfBlob(formData, lang, { variant: 'finance' }),
  ])

  folder.file(lang === 'de' ? '01_Businessplan_Komplett.pdf' : '01_Businessplan_Complete.pdf', fullBlob)
  folder.file('02_Executive_Summary.pdf', summaryBlob)
  folder.file(lang === 'de' ? '03_Finanzuebersicht.pdf' : '03_Finance_Overview.pdf', financeBlob)
  folder.file(lang === 'de' ? '04_Finanzuebersicht.txt' : '04_Finance_Overview.txt', buildFinanceSnapshotText(formData, lang))
  folder.file('README.txt', buildReadme(d, lang))

  const cv = loadCv()
  if (cvIsSubmissionReady(cv)) {
    const cvBlob = lebenslaufPdfBlob(cv)
    folder.file(`05_Lebenslauf_${cvDisplayName(cv).replace(/\s+/g, '_')}.pdf`, cvBlob)
  }

  const letter = loadAnschreiben()
  if (anschreibenIsSubmissionReady(letter)) {
    const letterBlob = anschreibenPdfBlob(letter)
    folder.file(`06_Anschreiben_${anschreibenDisplayName(letter).replace(/\s+/g, '_')}.pdf`, letterBlob)
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  downloadBlob(blob, `${lang === 'de' ? 'Einreichungspaket' : 'Submission_Pack'}_${name}.zip`)
}
