import {
  anschreibenDisplayName,
  buildAnrede,
  defaultBetreff,
} from '@/lib/bizstart/anschreiben/schema'
import { anschreibenForPreview, isPlaceholderField } from '@/lib/bizstart/bewerbungTemplate'

function Phrase({ raw, fieldKey, rawDoc, className, children }) {
  const isPh = isPlaceholderField(rawDoc, fieldKey, rawDoc)
  return <span className={isPh ? `${className || ''} ansch-ph`.trim() : className}>{children}</span>
}

export default function AnschreibenPreview({ a, printRef }) {
  const raw = a
  const p = anschreibenForPreview(a)
  const name = anschreibenDisplayName(p)
  const betreff = p.betreff?.trim() ? p.betreff : defaultBetreff(p)
  const sig = p.unterschriftName?.trim() || name
  const showTemplateHint = !anschreibenDisplayName(raw)?.trim()

  const senderLines = [
    [p.strasse, `${p.plz || ''} ${p.stadt || ''}`.trim()].filter(Boolean).join(', '),
    [p.telefon, p.email].filter(Boolean).join(' · '),
  ].filter(Boolean)

  const recipientLines = [
    p.firma,
    p.abteilung,
    p.ansprechpartnerNachname
      ? `${p.ansprechpartnerAnrede === 'frau' ? 'Frau' : p.ansprechpartnerAnrede === 'herr' ? 'Herr' : ''} ${p.ansprechpartnerNachname}`.trim()
      : '',
    p.firmaStrasse,
    `${p.firmaPlz || ''} ${p.firmaStadt || ''}`.trim(),
  ].filter(Boolean)

  return (
    <div ref={printRef} id="anschreiben-print-root" className="anschreiben-a4">
      {showTemplateHint && (
        <p className="ansch-template-banner no-print" role="note">
          Vorlage mit Platzhaltern — ersetzen Sie alle Angaben durch Ihre eigenen Daten.
        </p>
      )}

      <header className="ansch-header">
        <h1 className="ansch-name">
          <Phrase rawDoc={raw} fieldKey="vorname">
            {name || 'Anschreiben'}
          </Phrase>
        </h1>
        {p.berufsbezeichnung?.trim() && (
          <p className="ansch-job-title">
            <Phrase rawDoc={raw} fieldKey="berufsbezeichnung">
              {p.berufsbezeichnung.trim()}
            </Phrase>
          </p>
        )}
      </header>

      <div className="ansch-header-rule" aria-hidden />

      {senderLines.length > 0 && (
        <div className="ansch-sender">
          {senderLines.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      )}

      {recipientLines.length > 0 && (
        <div className="ansch-recipient">
          {recipientLines.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      )}

      {p.ortDatum?.trim() && (
        <div className="ansch-date">
          <Phrase rawDoc={raw} fieldKey="ortDatum">
            {p.ortDatum.trim()}
          </Phrase>
        </div>
      )}

      {betreff && (
        <>
          <div className="ansch-betreff-rule" aria-hidden />
          <p className="ansch-betreff">
            <Phrase rawDoc={raw} fieldKey="betreff">
              {betreff}
            </Phrase>
          </p>
        </>
      )}

      <div className="ansch-letter">
        <div className="ansch-anrede">{buildAnrede(p)}</div>

        {(raw.einleitung?.length > 0 || isPlaceholderField(raw, 'einleitung', raw)) && (
          <p className="ansch-body">
            <Phrase rawDoc={raw} fieldKey="einleitung">
              {raw.einleitung?.trim() ? raw.einleitung : p.einleitung}
            </Phrase>
          </p>
        )}
        {p.hauptteil?.trim() && (
          <p className="ansch-body">
            <Phrase rawDoc={raw} fieldKey="hauptteil">
              {p.hauptteil}
            </Phrase>
          </p>
        )}
        {p.motivation?.trim() && (
          <p className="ansch-body">
            <Phrase rawDoc={raw} fieldKey="motivation">
              {p.motivation}
            </Phrase>
          </p>
        )}
        {p.schlussteil?.trim() && (
          <p className="ansch-body">
            <Phrase rawDoc={raw} fieldKey="schlussteil">
              {p.schlussteil}
            </Phrase>
          </p>
        )}

        <div className="ansch-gruss">{p.grussformel || 'Mit freundlichen Grüßen'}</div>
      </div>

      <footer className="ansch-signature">
        <div className="ansch-sig-space" aria-hidden />
        <p className="ansch-sig-name">
          <Phrase rawDoc={raw} fieldKey="unterschriftName">
            {sig}
          </Phrase>
        </p>
        <p className="ansch-sig-label">Unterschrift</p>
      </footer>

      <div className="ansch-anlagen">{p.anlagenHinweis || 'Anlagen'}</div>
    </div>
  )
}
