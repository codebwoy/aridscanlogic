import { cvDisplayName } from '@/lib/bizstart/lebenslauf/schema'
import { bulletsFromMultiline, formatGeburtsdatum, familienstandLabel } from '@/lib/bizstart/lebenslauf/formatters'

function Section({ title, children }) {
  if (!children) return null
  return (
    <section className="cv-preview-section">
      <h2 className="cv-preview-h2">{title}</h2>
      {children}
    </section>
  )
}

function Timeline({ entries, renderEntry }) {
  if (!entries?.length) return null
  const items = entries.map(renderEntry).filter(Boolean)
  if (!items.length) return null
  return <div className="cv-timeline">{items}</div>
}

function PersonalRow({ label, value }) {
  if (!value?.trim()) return null
  return (
    <div className="cv-personal-row">
      <span className="cv-personal-label">{label}</span>
      <span className="cv-personal-value">{value}</span>
    </div>
  )
}

export default function LebenslaufPreview({ cv, printRef }) {
  const name = cvDisplayName(cv)
  const sigName = cv.unterschriftName?.trim() || name

  return (
    <div ref={printRef} className="cv-a4-page" id="lebenslauf-print-root">
      <header className="cv-header">
        <div className="cv-header-text">
          <h1 className="cv-name">{name || 'Lebenslauf'}</h1>
          {cv.job_title?.trim() && <p className="cv-job-title">{cv.job_title}</p>}
        </div>
        {cv.photo?.startsWith('data:image') && (
          <img src={cv.photo} alt="" className="cv-photo" />
        )}
      </header>

      <Section title="Persönliche Daten">
        <div className="cv-personal-grid">
          <PersonalRow label="Adresse" value={[cv.strasse, `${cv.plz} ${cv.stadt}`.trim()].filter(Boolean).join(', ')} />
          <PersonalRow label="Telefon" value={cv.telefon} />
          <PersonalRow label="E-Mail" value={cv.email} />
          <PersonalRow label="LinkedIn" value={cv.linkedin} />
          <PersonalRow label="Geburtsdatum" value={formatGeburtsdatum(cv.geburtsdatum)} />
          <PersonalRow label="Geburtsort" value={cv.geburtsort} />
          <PersonalRow label="Staatsangehörigkeit" value={cv.nationalitaet} />
          <PersonalRow label="Familienstand" value={familienstandLabel(cv.familienstand)} />
          {cv.fuehrerschein && cv.fuehrerschein !== 'Kein' && (
            <PersonalRow label="Führerschein" value={cv.fuehrerschein} />
          )}
        </div>
      </Section>

      {cv.profil?.trim() && (
        <Section title="Profil">
          <p className="cv-body whitespace-pre-wrap">{cv.profil}</p>
        </Section>
      )}

      {(cv.erfahrung || []).some((e) => e.titel?.trim() || e.unternehmen?.trim()) && (
      <Section title="Berufserfahrung">
        <Timeline
          entries={cv.erfahrung}
          renderEntry={(e) => {
            if (!e.titel?.trim() && !e.unternehmen?.trim()) return null
            const bullets = bulletsFromMultiline(e.aufgaben)
            return (
              <div key={`${e.von}-${e.titel}`} className="cv-timeline-item">
                <div className="cv-period">{[e.von, e.bis || 'heute'].filter(Boolean).join(' – ')}</div>
                <div className="cv-timeline-body">
                  <p className="cv-entry-title">{e.titel}</p>
                  <p className="cv-entry-sub">
                    {[e.unternehmen, e.stadt, e.branche].filter(Boolean).join(' · ')}
                  </p>
                  {bullets.length > 0 && (
                    <ul className="cv-bullets">
                      {bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )
          }}
        />
      </Section>
      )}

      {(cv.ausbildung || []).some((e) => e.abschluss?.trim() || e.institution?.trim()) && (
      <Section title="Ausbildung">
        <Timeline
          entries={cv.ausbildung}
          renderEntry={(e) => {
            if (!e.abschluss?.trim() && !e.institution?.trim()) return null
            const bullets = bulletsFromMultiline(e.schwerpunkte)
            return (
              <div key={`${e.von}-${e.abschluss}`} className="cv-timeline-item">
                <div className="cv-period">{[e.von, e.bis].filter(Boolean).join(' – ')}</div>
                <div className="cv-timeline-body">
                  <p className="cv-entry-title">
                    {e.abschluss}
                    {e.note?.trim() && <span className="cv-note"> (Note: {e.note})</span>}
                  </p>
                  <p className="cv-entry-sub">{[e.institution, e.stadt].filter(Boolean).join(', ')}</p>
                  {bullets.length > 0 && (
                    <ul className="cv-bullets">
                      {bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )
          }}
        />
      </Section>
      )}

      {(cv.weiterbildung || []).some((w) => w.titel?.trim()) && (
      <Section title="Weiterbildung & Zertifikate">
        <Timeline
          entries={cv.weiterbildung}
          renderEntry={(w) =>
            w.titel?.trim() ? (
              <div key={`${w.jahr}-${w.titel}`} className="cv-simple-entry">
                <strong>{w.jahr}</strong> — {w.titel}
                {w.anbieter ? `, ${w.anbieter}` : ''}
              </div>
            ) : null
          }
        />
      </Section>
      )}

      {(cv.sprachen || []).some((s) => s.sprache?.trim()) && (
      <Section title="Sprachkenntnisse">
        {(cv.sprachen || [])
          .filter((s) => s.sprache?.trim())
          .map((s, i) => (
            <p key={i} className="cv-line">
              {s.sprache}: {s.niveau}
              {s.zertifikat?.trim() ? ` (${s.zertifikat})` : ''}
            </p>
          ))}
      </Section>
      )}

      {(cv.itSkills || []).some((s) => s.software?.trim()) && (
      <Section title="IT-Kenntnisse">
        {(cv.itSkills || [])
          .filter((s) => s.software?.trim())
          .map((s, i) => (
            <p key={i} className="cv-line">
              {s.software}: {s.niveau}
            </p>
          ))}
      </Section>
      )}

      {cv.weitereKenntnisse?.trim() && (
        <Section title="Weitere Kenntnisse">
          <ul className="cv-bullets">
            {bulletsFromMultiline(cv.weitereKenntnisse).map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </Section>
      )}

      {(cv.ehrenamt || []).some((e) => e.taetigkeit?.trim()) && (
      <Section title="Ehrenamt & Engagement">
        <Timeline
          entries={cv.ehrenamt}
          renderEntry={(e) =>
            e.taetigkeit?.trim() ? (
              <div key={`${e.zeitraum}-${e.taetigkeit}`} className="cv-simple-entry">
                <strong>{e.zeitraum}</strong> — {e.taetigkeit}
                {e.organisation ? `, ${e.organisation}` : ''}
              </div>
            ) : null
          }
        />
      </Section>
      )}

      {cv.interessen?.trim() && (
        <Section title="Interessen">
          <p className="cv-body">{cv.interessen}</p>
        </Section>
      )}

      <footer className="cv-signature">
        <p>{[cv.unterschriftOrt, cv.unterschriftDatum].filter(Boolean).join(', ')}</p>
        <p className="cv-sig-name">{sigName}</p>
        <p className="cv-sig-label">Unterschrift</p>
      </footer>
    </div>
  )
}
