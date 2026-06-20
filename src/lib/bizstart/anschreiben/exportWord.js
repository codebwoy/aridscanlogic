import {
  anschreibenDisplayName,
  anschreibenSlug,
  buildAnrede,
  defaultBetreff,
  normalizeEinleitung,
} from './schema'

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function buildAnschreibenHtml(a) {
  const name = esc(anschreibenDisplayName(a))
  const betreff = esc(defaultBetreff(a))
  const sig = esc(a.unterschriftName?.trim() || anschreibenDisplayName(a))
  const beruf = esc(a.berufsbezeichnung?.trim())

  const sender = [
    esc([a.strasse, `${a.plz || ''} ${a.stadt || ''}`.trim()].filter(Boolean).join(', ')),
    esc([a.telefon, a.email].filter(Boolean).join(' · ')),
  ]
    .filter(Boolean)
    .map((l) => `<div class="sender-line">${l}</div>`)
    .join('')

  const recipient = [
    esc(a.firma),
    esc(a.abteilung),
    a.ansprechpartnerNachname
      ? esc(
          `${a.ansprechpartnerAnrede === 'frau' ? 'Frau' : a.ansprechpartnerAnrede === 'herr' ? 'Herr' : ''} ${a.ansprechpartnerNachname}`.trim()
        )
      : '',
    esc(a.firmaStrasse),
    esc(`${a.firmaPlz || ''} ${a.firmaStadt || ''}`.trim()),
  ]
    .filter(Boolean)
    .map((l) => `<div>${l}</div>`)
    .join('')

  const para = (t) => (t?.trim() ? `<p class="body">${esc(t).replace(/\n/g, '<br/>')}</p>` : '')

  return `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"/>
<title>Anschreiben ${name}</title>
<style>
  @page { size: A4; margin: 15mm 18mm; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; line-height: 1.45; color: #1a1a1a; margin: 0; }
  .page { max-width: 174mm; margin: 0 auto; }
  .name { font-size: 20pt; font-weight: bold; margin: 0 0 2mm; line-height: 1.15; color: #141414; }
  .job { font-size: 11pt; color: #555; margin: 0 0 4mm; }
  .rule { border: none; border-bottom: 1px solid #bbb; margin: 0 0 4mm; }
  .sender { font-size: 8pt; color: #555; margin-bottom: 10mm; line-height: 1.4; }
  .sender-line { margin: 0; }
  .recipient { font-size: 10pt; line-height: 1.55; margin-bottom: 6mm; }
  .date { text-align: right; font-size: 10pt; margin-bottom: 6mm; color: #333; }
  .betreff { font-weight: bold; font-size: 11pt; margin: 0 0 5mm; line-height: 1.4; }
  .anrede { margin-bottom: 4mm; font-size: 11pt; }
  .body { margin: 0 0 4mm; font-size: 11pt; line-height: 1.5; text-align: justify; }
  .gruss { margin-top: 6mm; margin-bottom: 2mm; font-size: 11pt; }
  .sig-space { height: 14mm; }
  .sig-name { font-style: italic; font-size: 11pt; margin: 0; }
  .sig-label { font-size: 8pt; color: #888; margin: 1mm 0 0; }
  .anlagen { font-size: 9pt; color: #555; margin-top: 8mm; }
</style></head><body><div class="page">
<h1 class="name">${name || 'Anschreiben'}</h1>
${beruf ? `<p class="job">${beruf}</p>` : ''}
<hr class="rule"/>
${sender ? `<div class="sender">${sender}</div>` : ''}
${recipient ? `<div class="recipient">${recipient}</div>` : ''}
${a.ortDatum?.trim() ? `<div class="date">${esc(a.ortDatum)}</div>` : ''}
${betreff ? `<hr class="rule"/><p class="betreff">${betreff}</p>` : ''}
<div class="anrede">${esc(buildAnrede(a))}</div>
${para(normalizeEinleitung(a.einleitung))}
${para(a.hauptteil)}
${para(a.motivation)}
${para(a.schlussteil)}
<div class="gruss">${esc(a.grussformel || 'Mit freundlichen Grüßen')}</div>
<div class="sig-space"></div>
<p class="sig-name">${sig}</p>
<p class="sig-label">Unterschrift</p>
<div class="anlagen">${esc(a.anlagenHinweis || 'Anlagen')}</div>
</div></body></html>`
}

export function downloadAnschreibenWord(a) {
  const html = buildAnschreibenHtml(a)
  const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Anschreiben_${anschreibenSlug(a)}.doc`
  link.click()
  URL.revokeObjectURL(url)
}
