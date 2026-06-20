import { cvDisplayName } from '@/lib/bizstart/lebenslauf/schema'
import { bulletsFromMultiline, formatGeburtsdatum, familienstandLabel } from '@/lib/bizstart/lebenslauf/formatters'
import { cvForPreview, hasCvUserData } from '@/lib/bizstart/bewerbungTemplate'

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

function PersonalRow({ label, value, placeholder = false }) {
  if (!value?.trim()) return null
  return (
    <div className="cv-personal-row">
      <span className="cv-personal-label">{label}</span>
      <span className={`cv-personal-value${placeholder ? ' cv-ph' : ''}`}>{value}</span>
    </div>
  )
}

export default function LebenslaufPreview({ cv, printRef }) {
  const raw = cv
  const p = cvForPreview(cv)
  const name = cvDisplayName(p)
  const sigName = p.unterschriftName?.trim() || name
  const showTemplateHint = !hasCvUserData(raw)
  const ph = (key) => !raw?.[key]?.trim()

  return (
    <div ref={printRef} className="cv-a4-page" id="lebenslauf-print-root">
      {showTemplateHint && (
        <p className="cv-template-banner no-print" role="note">
          Vorlage mit Platzhaltern — ersetzen Sie alle Angaben durch Ihre eigenen Daten.
        </p>
      )}
      <header className="cv-header">
        <div className="cv-header-text">
          <h1 className={`cv-name${ph('vorname') && ph('nachname') ? ' cv-ph' : ''}`}>{name || 'Lebenslauf'}</h1>
          {p.job_title?.trim() && (
            <p className={`cv-job-title${ph('job_title') ? ' cv-ph' : ''}`}>{p.job_title}</p>
          )}
        </div>
        {raw?.photo?.startsWith('data:image') && (
          <img src={raw.photo} alt="" className="cv-photo" />
        )}
      </header>

      <Section title="Persönliche Daten">
        <div className="cv-personal-grid">
          <PersonalRow
            label="Adresse"
            value={[p.strasse, `${p.plz} ${p.stadt}`.trim()].filter(Boolean).join(', ')}
            placeholder={ph('strasse') && ph('plz') && ph('stadt')}
          />
          <PersonalRow label="Telefon" value={p.telefon} placeholder={ph('telefon')} />
          <PersonalRow label="E-Mail" value={p.email} placeholder={ph('email')} />
          <PersonalRow label="LinkedIn" value={raw?.linkedin} />
          <PersonalRow label="Geburtsdatum" value={formatGeburtsdatum(raw?.geburtsdatum)} />
          <PersonalRow label="Geburtsort" value={raw?.geburtsort} />
          <PersonalRow label="Staatsangehörigkeit" value={raw?.nationalitaet} />
          <PersonalRow label="Familienstand" value={familienstandLabel(raw?.familienstand)} />
          {raw?.fuehrerschein && raw.fuehrerschein !== 'Kein' && (
            <PersonalRow label="Führerschein" value={raw.fuehrerschein} />
          )}
        </div>
      </Section>

      {p.profil?.trim() && (
        <Section title="Profil">
          <p className={`cv-body whitespace-pre-wrap${ph('profil') ? ' cv-ph' : ''}`}>{p.profil}</p>
        </Section>
      )}

      {(raw?.erfahrung || []).some((e) => e.titel?.trim() || e.unternehmen?.trim()) && (
      <Section title="Berufserfahrung">
        <Timeline
          entries={raw.erfahrung}
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

      {(raw?.ausbildung || []).some((e) => e.abschluss?.trim() || e.institution?.trim()) && (
      <Section title="Ausbildung">
        <Timeline
          entries={raw.ausbildung}
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

      {(raw?.weiterbildung || []).some((w) => w.titel?.trim()) && (
      <Section title="Weiterbildung & Zertifikate">
        <Timeline
          entries={raw.weiterbildung}
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

      {(raw?.sprachen || []).some((s) => s.sprache?.trim()) && (
      <Section title="Sprachkenntnisse">
        {(raw.sprachen || [])
          .filter((s) => s.sprache?.trim())
          .map((s, i) => (
            <p key={i} className="cv-line">
              {s.sprache}: {s.niveau}
              {s.zertifikat?.trim() ? ` (${s.zertifikat})` : ''}
            </p>
          ))}
      </Section>
      )}

      {(raw?.itSkills || []).some((s) => s.software?.trim()) && (
      <Section title="IT-Kenntnisse">
        {(raw.itSkills || [])
          .filter((s) => s.software?.trim())
          .map((s, i) => (
            <p key={i} className="cv-line">
              {s.software}: {s.niveau}
            </p>
          ))}
      </Section>
      )}

      {raw?.weitereKenntnisse?.trim() && (
        <Section title="Weitere Kenntnisse">
          <ul className="cv-bullets">
            {bulletsFromMultiline(raw.weitereKenntnisse).map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </Section>
      )}

      {(raw?.ehrenamt || []).some((e) => e.taetigkeit?.trim()) && (
      <Section title="Ehrenamt & Engagement">
        <Timeline
          entries={raw.ehrenamt}
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

      {raw?.interessen?.trim() && (
        <Section title="Interessen">
          <p className="cv-body">{raw.interessen}</p>
        </Section>
      )}

      <footer className="cv-signature">
        <p className={!raw?.unterschriftOrt?.trim() && !raw?.unterschriftDatum?.trim() ? 'cv-ph' : ''}>
          {[p.unterschriftOrt, p.unterschriftDatum].filter(Boolean).join(', ')}
        </p>
        <p className={`cv-sig-name${ph('unterschriftName') && ph('vorname') && ph('nachname') ? ' cv-ph' : ''}`}>{sigName}</p>
        <p className="cv-sig-label">Unterschrift</p>
      </footer>
    </div>
  )
}
