import { normalizeListingCopy, normalizeProductData, normalizeCompliance } from './schema'

function bullets(items) {
  return (items || []).map((x) => `• ${x}`).join('\n')
}

/**
 * Customer-facing German listing (no internal notes).
 */
export function formatCustomerListing({ listing, product, legal, includeLegal = true }) {
  const L = normalizeListingCopy(listing)
  const p = normalizeProductData(product)
  const parts = []

  parts.push(L.seo_titel || L.titel || 'Produktlisting')
  parts.push('')
  if (L.kurzbeschreibung) {
    parts.push(L.kurzbeschreibung)
    parts.push('')
  }
  if (L.produktbeschreibung) {
    parts.push('Produktbeschreibung')
    parts.push(L.produktbeschreibung)
    parts.push('')
  }
  if (L.vorteile?.length) {
    parts.push('Ihre Vorteile auf einen Blick')
    parts.push(bullets(L.vorteile))
    parts.push('')
  }
  if (L.produktdetails?.length) {
    parts.push('Produktdetails')
    parts.push(bullets(L.produktdetails))
    parts.push('')
  }
  if (L.masse_text) {
    parts.push('Maße')
    parts.push(L.masse_text)
    parts.push('')
  }
  if (L.material_text) {
    parts.push('Material')
    parts.push(L.material_text)
    parts.push('')
  }
  if (L.farbe_text) {
    parts.push('Farbe')
    parts.push(L.farbe_text)
    parts.push('')
  }
  if (L.ausstattung?.length) {
    parts.push('Ausstattung')
    parts.push(bullets(L.ausstattung))
    parts.push('')
  }
  if (L.lieferumfang?.length) {
    parts.push('Lieferumfang')
    parts.push(bullets(L.lieferumfang))
    parts.push('')
  }
  if (L.montage_text) {
    parts.push('Montage')
    parts.push(L.montage_text)
    parts.push('')
  }
  if (L.hinweise?.length) {
    parts.push('Hinweise')
    parts.push(bullets(L.hinweise))
    parts.push('')
  }
  if (L.versand_text) {
    parts.push('Versand')
    parts.push(L.versand_text)
    parts.push('')
  }
  if (L.faq?.length) {
    parts.push('Häufige Fragen')
    L.faq.forEach((f) => {
      if (f.flagged) return
      parts.push(`F: ${f.question}`)
      parts.push(`A: ${f.answer}`)
      parts.push('')
    })
  }
  if (L.kundenservice) {
    parts.push('Kundenservice')
    parts.push(L.kundenservice)
    parts.push('')
  }

  if (p.gpsr?.gpsr_applicable) {
    const g = p.gpsr
    const gpsrLines = [
      g.hersteller && `Hersteller: ${g.hersteller}`,
      g.hersteller_anschrift && `Anschrift: ${g.hersteller_anschrift}`,
      g.hersteller_email && `E-Mail: ${g.hersteller_email}`,
      g.eu_verantwortliche_person && `EU Verantwortliche Person: ${g.eu_verantwortliche_person}`,
      g.eu_verantwortliche_anschrift && `EU Anschrift: ${g.eu_verantwortliche_anschrift}`,
      g.eu_verantwortliche_email && `EU E-Mail: ${g.eu_verantwortliche_email}`,
      g.produktidentifikation && `Produkt-ID: ${g.produktidentifikation}`,
      g.modellnummer && `Modell: ${g.modellnummer}`,
      g.warnhinweise && `Warnhinweise: ${g.warnhinweise}`,
      g.sicherheitsinformationen && `Sicherheit: ${g.sicherheitsinformationen}`,
      g.gebrauchsanleitung && `Gebrauchsanleitung: ${g.gebrauchsanleitung}`,
    ].filter(Boolean)
    if (gpsrLines.length) {
      parts.push('Produktsicherheit (GPSR)')
      parts.push(gpsrLines.join('\n'))
      parts.push('')
    }
  }

  if (includeLegal && legal) {
    if (legal.impressum) {
      parts.push('Impressum')
      parts.push(String(legal.impressum).trim())
      parts.push('')
    }
    if (legal.widerrufsbelehrung) {
      parts.push('Widerrufsbelehrung')
      parts.push(String(legal.widerrufsbelehrung).trim())
      parts.push('')
    }
    if (legal.widerrufsformular) {
      parts.push('Widerrufsformular')
      parts.push(String(legal.widerrufsformular).trim())
      parts.push('')
    }
    if (legal.rueckgabebedingungen) {
      parts.push('Rückgabebedingungen')
      parts.push(String(legal.rueckgabebedingungen).trim())
      parts.push('')
    }
    if (legal.agb) {
      parts.push('AGB')
      parts.push(String(legal.agb).trim())
      parts.push('')
    }
    if (legal.datenschutz) {
      parts.push('Datenschutz')
      parts.push(String(legal.datenschutz).trim())
      parts.push('')
    }
  }

  return parts.join('\n').trim()
}

export function formatInternalNotes({ compliance, score, readiness, profit }) {
  const c = normalizeCompliance(compliance || {})
  const lines = ['Interne Prüfhinweise (nicht für Kunden)', '']
  if (readiness?.total != null) {
    lines.push(`Publish Readiness: ${readiness.total}/100 — ${readiness.verdict}`)
  }
  lines.push(`Compliance-Status: ${c.publish_status}`)
  if (score?.total != null) lines.push(`Qualitätsscore: ${score.total}/100`)
  if (profit && profit.status !== 'incomplete') {
    lines.push(
      `Deckungsbeitrag (Schätzung): €${profit.contribution} (${profit.contribution_margin_pct}%)`
    )
  }
  lines.push('')
  if (readiness?.problems?.length) {
    lines.push('Publish-Probleme:')
    readiness.problems.forEach((p) =>
      lines.push(`• [${p.severity === 'block' ? 'BLOCK' : 'WARN'}] ${p.de}`)
    )
    lines.push('')
  }
  if (c.blocked_reasons?.length) {
    lines.push('Blocker:')
    c.blocked_reasons.forEach((r) => lines.push(`• ${r}`))
    lines.push('')
  }
  if (c.missing?.length) {
    lines.push('Fehlende Angaben:')
    c.missing.forEach((r) => lines.push(`• ${r}`))
    lines.push('')
  }
  if (c.claims?.length) {
    lines.push('Aussagen-Prüfung:')
    c.claims.forEach((cl) => {
      lines.push(`• [${cl.level}] ${cl.claim}${cl.reason ? ` — ${cl.reason}` : ''}`)
    })
    lines.push('')
  }
  if (c.warnings?.length) {
    lines.push('Warnungen:')
    c.warnings.forEach((r) => lines.push(`• ${r}`))
    lines.push('')
  }
  if (c.image_conflicts?.length) {
    lines.push('Bild/Text-Konflikte:')
    c.image_conflicts.forEach((r) => lines.push(`• ${r}`))
    lines.push('')
  }
  if (c.internal_notes?.length) {
    lines.push('Notizen:')
    c.internal_notes.forEach((r) => lines.push(`• ${r}`))
  }
  return lines.join('\n').trim()
}

export async function copyTextToClipboard(text) {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return true
  }
  return false
}

export function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
