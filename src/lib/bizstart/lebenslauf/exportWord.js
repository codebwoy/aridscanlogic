import { cvDisplayName, cvSlug } from './schema'
import { bulletsFromMultiline, formatGeburtsdatum, familienstandLabel } from './formatters'

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function liBullets(text) {
  const items = bulletsFromMultiline(text)
  if (!items.length) return ''
  return `<ul>${items.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`
}

function timelineBlock(entries, renderEntry) {
  if (!entries?.length) return ''
  return entries.map(renderEntry).filter(Boolean).join('')
}

export function buildLebenslaufHtml(cv) {
  const name = esc(cvDisplayName(cv))
  const sigName = esc(cv.unterschriftName?.trim() || cvDisplayName(cv))
  const photo = cv.photo?.startsWith('data:image')
    ? `<img src="${cv.photo}" alt="" style="width:35mm;height:44mm;object-fit:cover;border:1px solid #ccc;" />`
    : ''

  const personalRows = [
    ['Adresse', [cv.strasse, `${cv.plz} ${cv.stadt}`.trim()].filter(Boolean).join(', ')],
    ['Telefon', cv.telefon],
    ['E-Mail', cv.email],
    ['LinkedIn', cv.linkedin],
    ['Geburtsdatum', formatGeburtsdatum(cv.geburtsdatum)],
    ['Geburtsort', cv.geburtsort],
    ['Staatsangehörigkeit', cv.nationalitaet],
    ['Familienstand', familienstandLabel(cv.familienstand)],
    ['Führerschein', cv.fuehrerschein !== 'Kein' ? cv.fuehrerschein : ''],
  ]
    .filter(([, v]) => v?.trim())
    .map(
      ([k, v]) =>
        `<tr><td style="font-weight:bold;width:38mm;padding:1mm 2mm 1mm 0;vertical-align:top;">${esc(k)}</td><td style="padding:1mm 0;">${esc(v)}</td></tr>`
    )
    .join('')

  const erfahrung = timelineBlock(cv.erfahrung, (e) => {
    if (!e.titel?.trim() && !e.unternehmen?.trim()) return ''
    const period = esc([e.von, e.bis || 'heute'].filter(Boolean).join(' – '))
    const sub = esc([e.unternehmen, e.stadt, e.branche].filter(Boolean).join(' · '))
    return `<div style="margin-bottom:3mm;"><table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="32mm" style="vertical-align:top;font-size:9pt;">${period}</td>
      <td style="vertical-align:top;"><strong>${esc(e.titel)}</strong><br/><em style="font-size:9pt;color:#555;">${sub}</em>${liBullets(e.aufgaben)}</td>
    </tr></table></div>`
  })

  const ausbildung = timelineBlock(cv.ausbildung, (e) => {
    if (!e.abschluss?.trim() && !e.institution?.trim()) return ''
    const note = e.note?.trim() ? ` (Note: ${esc(e.note)})` : ''
    const period = esc([e.von, e.bis].filter(Boolean).join(' – '))
    const sub = esc([e.institution, e.stadt].filter(Boolean).join(', '))
    return `<div style="margin-bottom:3mm;"><table width="100%"><tr>
      <td width="32mm" style="vertical-align:top;font-size:9pt;">${period}</td>
      <td><strong>${esc(e.abschluss)}${note}</strong><br/><em style="font-size:9pt;color:#555;">${sub}</em>${liBullets(e.schwerpunkte)}</td>
    </tr></table></div>`
  })

  const weiter = timelineBlock(cv.weiterbildung, (w) => {
    if (!w.titel?.trim()) return ''
    return `<div style="margin-bottom:2mm;"><strong>${esc(w.jahr)}</strong> — ${esc(w.titel)}${w.anbieter ? `, ${esc(w.anbieter)}` : ''}</div>`
  })

  const sprachen = (cv.sprachen || [])
    .filter((s) => s.sprache?.trim())
    .map(
      (s) =>
        `<div>${esc(s.sprache)}: ${esc(s.niveau)}${s.zertifikat?.trim() ? ` (${esc(s.zertifikat)})` : ''}</div>`
    )
    .join('')

  const it = (cv.itSkills || [])
    .filter((s) => s.software?.trim())
    .map((s) => `<div>${esc(s.software)}: ${esc(s.niveau)}</div>`)
    .join('')

  const ehren = timelineBlock(cv.ehrenamt, (e) => {
    if (!e.taetigkeit?.trim()) return ''
    return `<div style="margin-bottom:2mm;"><strong>${esc(e.zeitraum)}</strong> — ${esc(e.taetigkeit)}${e.organisation ? `, ${esc(e.organisation)}` : ''}</div>`
  })

  return `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"/>
<title>Lebenslauf ${name}</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; color: #222; margin: 0; }
  .page { width: 170mm; margin: 0 auto; padding: 15mm 20mm; }
  h1 { font-size: 20pt; margin: 0 0 2mm; }
  .subtitle { font-size: 11pt; color: #555; margin-bottom: 6mm; }
  h2 { font-size: 11pt; border-bottom: 1px solid #bbb; padding-bottom: 1mm; margin: 5mm 0 3mm; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; }
  .sig { margin-top: 12mm; }
  .sig-name { font-style: italic; font-size: 11pt; }
</style></head><body><div class="page">
<div class="header">
  <div>
    <h1>${name || 'Lebenslauf'}</h1>
    ${cv.job_title?.trim() ? `<div class="subtitle">${esc(cv.job_title)}</div>` : ''}
  </div>
  ${photo ? `<div>${photo}</div>` : ''}
</div>
<h2>Persönliche Daten</h2>
<table>${personalRows}</table>
${cv.profil?.trim() ? `<h2>Profil</h2><p>${esc(cv.profil).replace(/\n/g, '<br/>')}</p>` : ''}
${erfahrung ? `<h2>Berufserfahrung</h2>${erfahrung}` : ''}
${ausbildung ? `<h2>Ausbildung</h2>${ausbildung}` : ''}
${weiter ? `<h2>Weiterbildung &amp; Zertifikate</h2>${weiter}` : ''}
${sprachen ? `<h2>Sprachkenntnisse</h2>${sprachen}` : ''}
${it ? `<h2>IT-Kenntnisse</h2>${it}` : ''}
${cv.weitereKenntnisse?.trim() ? `<h2>Weitere Kenntnisse</h2>${liBullets(cv.weitereKenntnisse)}` : ''}
${ehren ? `<h2>Ehrenamt &amp; Engagement</h2>${ehren}` : ''}
${cv.interessen?.trim() ? `<h2>Interessen</h2><p>${esc(cv.interessen)}</p>` : ''}
<div class="sig">
  <p>${esc([cv.unterschriftOrt, cv.unterschriftDatum].filter(Boolean).join(', '))}</p>
  <p class="sig-name">${sigName}</p>
  <p style="font-size:8pt;color:#888;">Unterschrift</p>
</div>
</div></body></html>`
}

export function downloadLebenslaufWord(cv) {
  const html = buildLebenslaufHtml(cv)
  const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Lebenslauf_${cvSlug(cv)}.doc`
  a.click()
  URL.revokeObjectURL(url)
}
