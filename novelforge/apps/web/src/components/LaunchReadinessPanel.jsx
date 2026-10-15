import {
  LAUNCH_READINESS,
  PUBLISHING_SPECS,
  KINDLE_CREATE_SPECS,
  mergeLaunchChecklist,
  launchReadinessProgress,
} from '@novelforge/shared'

/**
 * Interactive pre-Amazon launch checklist on the Publish step.
 */
export default function LaunchReadinessPanel({ book, busy, onSaveCompliance }) {
  const merged = mergeLaunchChecklist(book?.compliance?.checklist || [])
  const progress = launchReadinessProgress(book?.compliance?.checklist || [])
  const helpUrls = PUBLISHING_SPECS.kdpHelpUrls

  async function toggleItem(id, checked) {
    const nextRows = merged.map((row) =>
      row.id === id ? { id: row.id, checked } : { id: row.id, checked: !!row.checked }
    )
    const checklist = nextRows.map((r) => ({ id: r.id, checked: r.checked }))
    const nextProgress = launchReadinessProgress(checklist)
    await onSaveCompliance({
      checklist,
      passed: nextProgress.requiredComplete,
      ai_disclosure: book?.compliance?.ai_disclosure || { used_ai_text: true },
      launch_readiness_version: LAUNCH_READINESS.version,
    })
  }

  async function markAllRequired() {
    const checklist = merged.map((row) => ({
      id: row.id,
      checked: row.required ? true : !!row.checked,
    }))
    await onSaveCompliance({
      checklist,
      passed: true,
      ai_disclosure: book?.compliance?.ai_disclosure || { used_ai_text: true },
      launch_readiness_version: LAUNCH_READINESS.version,
    })
  }

  const phases = LAUNCH_READINESS.phases.map((phase) => ({
    ...phase,
    items: merged.filter((i) => i.phaseId === phase.id),
  }))

  return (
    <div className="launch-readiness">
      <h3 style={{ margin: '0 0 0.35rem' }}>Launch readiness (before Amazon)</h3>
      <p className="muted" style={{ fontSize: '0.78rem', marginTop: 0 }}>
        {LAUNCH_READINESS.lead}
      </p>
      <p className="muted" style={{ fontSize: '0.75rem' }}>
        Print target ~{PUBLISHING_SPECS.dpiTarget} DPI · bleed {PUBLISHING_SPECS.bleedInches}&quot; · verify on
        current KDP help.
      </p>
      <aside
        className="launch-readiness__kc"
        style={{
          margin: '0.65rem 0 0.85rem',
          padding: '0.65rem 0.75rem',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          background: 'var(--surface-2)',
          fontSize: '0.78rem',
          lineHeight: 1.45,
        }}
      >
        <strong>Kindle Create (reflowable)</strong>
        <p className="muted" style={{ margin: '0.35rem 0 0.45rem' }}>
          Exported DOCX uses Heading 1 chapters and page breaks so Kindle Create can build HTML TOC +
          NCX. KPF is produced only inside Amazon Kindle Create — keep the KCB folder backed up.
          Verified {KINDLE_CREATE_SPECS.lastVerified}.
        </p>
        <a
          href={KINDLE_CREATE_SPECS.helpUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Amazon Kindle Create help
        </a>
        {' · '}
        <a
          href={KINDLE_CREATE_SPECS.helpUrlDe}
          target="_blank"
          rel="noopener noreferrer"
        >
          DE
        </a>
      </aside>
      <div className="launch-readiness__progress" aria-live="polite">
        <strong>
          {progress.requiredChecked}/{progress.requiredTotal} required
        </strong>
        <span className="muted">
          {' '}
          · {progress.checked}/{progress.total} total ({progress.percent}%)
        </span>
        {progress.requiredComplete ? (
          <span className="launch-readiness__ok"> · Required items complete</span>
        ) : (
          <span className="warn" style={{ display: 'inline', marginLeft: '0.35rem' }}>
            · Finish required items before treating this as upload-ready
          </span>
        )}
      </div>

      {phases.map((phase) => (
        <section key={phase.id} className="launch-readiness__phase">
          <h4>{phase.title}</h4>
          <ul className="launch-readiness__list">
            {phase.items.map((item) => {
              const href = item.linkKey ? helpUrls[item.linkKey] : null
              return (
                <li key={item.id}>
                  <label className="launch-readiness__item">
                    <input
                      type="checkbox"
                      checked={!!item.checked}
                      disabled={!!busy}
                      onChange={(e) => toggleItem(item.id, e.target.checked)}
                    />
                    <span>
                      {item.label}
                      {item.required ? (
                        <span className="launch-readiness__req"> required</span>
                      ) : (
                        <span className="muted"> optional</span>
                      )}
                      {href ? (
                        <>
                          {' '}
                          <a href={href} target="_blank" rel="noopener noreferrer">
                            KDP help
                          </a>
                        </>
                      ) : null}
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      <div className="row" style={{ marginTop: '0.75rem', flexWrap: 'wrap' }}>
        <button type="button" className="btn" disabled={!!busy} onClick={markAllRequired}>
          Mark all required done
        </button>
        {book?.compliance?.passed ? (
          <span className="muted" style={{ alignSelf: 'center' }}>
            Compliance marked reviewed.
          </span>
        ) : null}
      </div>
    </div>
  )
}
