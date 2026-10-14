import { useMemo, useState } from 'react'
import {
  STRATEGY_META,
  STRATEGY_KINDS,
  applyAngleToBookPatch,
  emptyCustomAngle,
  normalizeAngle,
} from '@authorforge/shared'

function strategyAccent(kind) {
  return STRATEGY_META[kind]?.accent || 'custom'
}

function AngleCard({ angle, selected, evidenceOpen, onToggleEvidence, onSelect, busy }) {
  const a = normalizeAngle(angle)
  const meta = STRATEGY_META[a.strategy_kind] || STRATEGY_META[STRATEGY_KINDS.CUSTOM]
  return (
    <article
      className={`angle-card angle-card--${strategyAccent(a.strategy_kind)}${selected ? ' is-selected' : ''}`}
    >
      <header className="angle-card__head">
        <span className="angle-card__badge">{a.strategy_label || meta.label}</span>
        {a.confidence ? <span className="angle-card__conf">{a.confidence}</span> : null}
      </header>
      <h3 className="angle-card__title">{a.name}</h3>
      {(a.proposed_title || a.proposed_subtitle) && (
        <p className="angle-card__proposed">
          {a.proposed_title}
          {a.proposed_subtitle ? <span className="muted"> — {a.proposed_subtitle}</span> : null}
        </p>
      )}
      <dl className="angle-card__dl">
        {a.target_audience ? (
          <>
            <dt>Audience</dt>
            <dd>{a.target_audience}</dd>
          </>
        ) : null}
        {a.reader_problem ? (
          <>
            <dt>Problem</dt>
            <dd>{a.reader_problem}</dd>
          </>
        ) : null}
        {a.unique_value ? (
          <>
            <dt>Promise</dt>
            <dd>{a.unique_value}</dd>
          </>
        ) : null}
        {a.differentiation ? (
          <>
            <dt>Stands apart</dt>
            <dd>{a.differentiation}</dd>
          </>
        ) : null}
        {a.toc_direction ? (
          <>
            <dt>TOC direction</dt>
            <dd>{a.toc_direction}</dd>
          </>
        ) : null}
        {!a.unique_value && a.rationale ? (
          <>
            <dt>Rationale</dt>
            <dd>{a.rationale}</dd>
          </>
        ) : null}
      </dl>
      {(a.must_contain || []).length ? (
        <ul className="angle-card__list">
          {a.must_contain.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      ) : null}
      {(a.risks || []).length ? (
        <p className="angle-card__risks">
          <strong>Risks:</strong> {a.risks.join(' · ')}
        </p>
      ) : null}
      {evidenceOpen && (a.evidence || []).length ? (
        <div className="angle-card__evidence">
          <p className="muted" style={{ margin: '0 0 0.35rem', fontSize: '0.72rem' }}>
            Evidence (adapter / metadata — not verified sales)
          </p>
          <ul className="assist-simple">
            {a.evidence.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="angle-card__actions">
        <button
          type="button"
          className="btn"
          disabled={busy || !(a.evidence || []).length}
          onClick={onToggleEvidence}
        >
          {evidenceOpen ? 'Hide evidence' : 'View evidence'}
        </button>
        <button type="button" className="btn btn-primary" disabled={busy} onClick={() => onSelect(a)}>
          {selected ? 'Selected' : 'Select this positioning'}
        </button>
      </div>
    </article>
  )
}

export default function CompetitiveAdvantagePanel({
  book,
  busy,
  assist,
  costLabel,
  onRunJob,
  onSaveBasics,
  onMessage,
}) {
  const [evidenceId, setEvidenceId] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const [custom, setCustom] = useState(() => emptyCustomAngle())
  const [notes, setNotes] = useState(book?.bible?.positioning_notes || '')

  const angles = useMemo(() => {
    const fromAssist = assist?.type === 'competitive_analysis'
      ? assist?.outputs?.angles?.angles || assist?.outputs?.angles
      : null
    const raw = Array.isArray(fromAssist) && fromAssist.length
      ? fromAssist
      : book?.bible?.positioning_angles || []
    return raw.map((a, i) => normalizeAngle(a, i))
  }, [assist, book?.bible?.positioning_angles])

  const titles = useMemo(() => {
    const fromAssist = assist?.outputs?.meta?.titles
    if (Array.isArray(fromAssist) && fromAssist.length) return fromAssist
    return book?.competitors || []
  }, [assist, book?.competitors])

  const disclaimer =
    assist?.outputs?.angles?.disclaimer ||
    assist?.outputs?.disclaimer ||
    book?.bible?.positioning_disclaimer ||
    ''

  const selectedId = book?.bible?.selected_angle?.id || book?.bible?.selected_angle?.name || ''

  async function selectAngle(angle) {
    const patch = applyAngleToBookPatch(angle, book)
    await onSaveBasics(patch)
    onMessage?.(
      `Selected “${normalizeAngle(angle).name}” — USP, audience, and titles updated. Later outline/title jobs will use this angle.`
    )
  }

  async function analyze(regenerate = false) {
    const out = await onRunJob('competitive_analysis', {
      topic: book.topic || book.working_title,
      regenerate,
      notes,
      target_reader: book.bible?.audience || '',
      format: book.structure_type || '',
      exclude_names: regenerate ? angles.map((a) => a.name) : [],
    })
    if (notes !== (book.bible?.positioning_notes || '')) {
      await onSaveBasics({ bible: { ...book.bible, positioning_notes: notes } })
    }
    if (!out) return
    const n = out?.angles?.angles?.length || out?.angles?.length || 0
    onMessage?.(
      regenerate
        ? `Regenerated ${n} positioning angle${n === 1 ? '' : 's'} (previous selection kept until you pick again).`
        : `Analysis ready — ${n} positioning angle${n === 1 ? '' : 's'}. Select one to lock it into the book bible.`
    )
  }

  async function saveCustom() {
    const angle = normalizeAngle(
      { ...custom, strategy_kind: STRATEGY_KINDS.CUSTOM, name: custom.name || 'Custom angle' },
      99
    )
    if (!angle.name.trim() || !angle.rationale.trim()) {
      onMessage?.('Add at least a name and rationale for your angle.')
      return
    }
    await selectAngle(angle)
    setShowCustom(false)
  }

  return (
    <div className="card competitive-panel">
      <h2>Analyze Competitive Advantage</h2>
      <p className="muted">
        Research permitted metadata, then pick a differentiated positioning. Selected strategy flows into
        titles, outline, and writing. Never treats estimates as verified Amazon sales data.
      </p>

      <div className="field">
        <label>How should your book differ? (optional notes)</label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. more worksheets, bilingual Germany focus, shorter chapters…"
        />
      </div>

      <div className="competitive-panel__toolbar">
        <button
          type="button"
          className="btn btn-primary"
          disabled={!!busy}
          onClick={() => analyze(false)}
        >
          {angles.length ? 'Re-run research' : 'Analyze angles'} ({costLabel})
        </button>
        <button
          type="button"
          className="btn"
          disabled={!!busy || !angles.length}
          onClick={() => analyze(true)}
        >
          Regenerate ideas
        </button>
        <button type="button" className="btn" disabled={!!busy} onClick={() => setShowCustom((v) => !v)}>
          {showCustom ? 'Hide custom' : 'Write my own angle'}
        </button>
      </div>

      {titles.length ? (
        <div className="competitive-panel__comps">
          <p className="muted" style={{ margin: '0 0 0.35rem', fontSize: '0.72rem' }}>
            Source comps (estimates only)
          </p>
          <ul className="assist-simple">
            {titles.slice(0, 8).map((c) => (
              <li key={c.asin || c.title}>
                {c.title}
                {c.author ? <span className="muted"> — {c.author}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {showCustom ? (
        <div className="competitive-panel__custom card" style={{ marginTop: '1rem' }}>
          <h3 style={{ marginTop: 0, fontFamily: 'var(--af-serif)' }}>Your angle</h3>
          <div className="grid-2">
            <div className="field">
              <label>Label</label>
              <input
                value={custom.name}
                onChange={(e) => setCustom({ ...custom, name: e.target.value })}
                placeholder="e.g. Bilingual Germany workbook"
              />
            </div>
            <div className="field">
              <label>Target audience</label>
              <input
                value={custom.target_audience}
                onChange={(e) => setCustom({ ...custom, target_audience: e.target.value })}
              />
            </div>
          </div>
          <div className="field">
            <label>Reader problem</label>
            <input
              value={custom.reader_problem}
              onChange={(e) => setCustom({ ...custom, reader_problem: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Unique promise</label>
            <textarea
              rows={2}
              value={custom.unique_value}
              onChange={(e) => setCustom({ ...custom, unique_value: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Rationale</label>
            <textarea
              rows={2}
              value={custom.rationale}
              onChange={(e) => setCustom({ ...custom, rationale: e.target.value })}
            />
          </div>
          <button type="button" className="btn btn-primary" disabled={!!busy} onClick={saveCustom}>
            Select custom positioning
          </button>
        </div>
      ) : null}

      {angles.length ? (
        <div className="angle-grid">
          {angles.map((a) => (
            <AngleCard
              key={a.id}
              angle={a}
              selected={selectedId === a.id || selectedId === a.name}
              evidenceOpen={evidenceId === a.id}
              onToggleEvidence={() => setEvidenceId((id) => (id === a.id ? '' : a.id))}
              onSelect={selectAngle}
              busy={!!busy}
            />
          ))}
        </div>
      ) : (
        <p className="muted" style={{ marginTop: '1rem' }}>
          Run analysis to generate three distinct positioning cards (More value · Niche end goal ·
          Simpler/faster).
        </p>
      )}

      {book?.bible?.selected_angle ? (
        <p className="competitive-panel__selected">
          Locked strategy:{' '}
          <strong>{book.bible.selected_angle.strategy_label || book.bible.selected_angle.name}</strong>
          {' — '}
          {book.bible.selected_angle.name}
        </p>
      ) : null}

      {disclaimer ? (
        <p className="muted" style={{ marginTop: '0.75rem', fontSize: '0.72rem' }}>
          {disclaimer}
        </p>
      ) : null}
    </div>
  )
}
