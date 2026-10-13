import { useEffect, useState } from 'react'
import { BookOpen, ExternalLink, ImagePlus, Save } from 'lucide-react'
import {
  COVER_FINISH_OPTIONS,
  COVER_KDP_CHECKLIST,
  COVER_LAYOUT_PRESETS,
  COVER_STUDIO_META,
  CREDIT_COSTS,
  NAMED_TOOLS,
  assessCoverStudio,
  normalizeCoverStudioState,
} from '@storyforge/shared'

/**
 * Professional KDP paperback Cover Studio — layout presets, title-safe art,
 * wrap checklist (Amazon G201953020), optional Canva handoff notes.
 */
export default function CoverStudio({
  project,
  busy,
  setBusy,
  setError,
  setStatus,
  onSaved,
  runJob,
}) {
  const [draft, setDraft] = useState(() => normalizeCoverStudioState(project?.cover_studio))

  useEffect(() => {
    setDraft(normalizeCoverStudioState(project?.cover_studio))
  }, [project?.id, project?.cover_studio?.generated_at, project?.cover_studio?.front_art_url])

  const assessment = assessCoverStudio(project, draft)
  const hasAnchor = Boolean(project?.pinned_anchor?.heroUrl)
  const frontPreview = draft.front_art_url || project?.pinned_anchor?.heroUrl || null

  function patch(partial) {
    setDraft((d) => normalizeCoverStudioState({ ...d, ...partial }))
  }

  async function saveSettings() {
    if (!project?.id || !onSaved) return
    setBusy(true)
    setError('')
    try {
      await onSaved(normalizeCoverStudioState(draft))
      setStatus('Cover Studio settings saved')
    } catch (e) {
      setError(e.message || 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  async function generateArt() {
    if (!project?.id || !runJob) return
    setError('')
    try {
      await onSaved?.(normalizeCoverStudioState(draft))
      const res = await runJob('generate_cover_art', {
        layout_id: draft.layout_id,
        author: draft.author,
        subtitle: draft.subtitle,
        title_placement: draft.title_placement,
        finish: draft.finish,
      })
      if (!res?.job) return
      const next = normalizeCoverStudioState(res.job.outputs?.cover_studio || draft)
      setDraft(next)
      setStatus(
        `Cover art generated (${CREDIT_COSTS.generate_cover_art} credits) — export wrap PDF next`,
      )
    } catch (e) {
      setError(e.message || 'Cover art failed')
    }
  }

  async function exportWrap() {
    if (!runJob) return
    setError('')
    try {
      await onSaved?.(normalizeCoverStudioState(draft))
      const res = await runJob('export_cover_pdf', {
        trim_id: project.trim_id,
        page_count: project.page_count,
        paper_type: project.paper_type || 'white',
        author: draft.author,
        subtitle: draft.subtitle,
        title_placement: draft.title_placement,
        frontImageUrl: draft.front_art_url || undefined,
        blurb: project?.listing_description?.plain || project?.premise || '',
      })
      if (!res?.job) return
      setStatus('Cover wrap PDF ready — verify in Amazon KDP cover calculator before upload')
    } catch (e) {
      setError(e.message || 'Cover export failed')
    }
  }

  return (
    <section className="sf-card sf-cover-studio" aria-labelledby="cover-studio-heading">
      <header className="sf-card-head">
        <h3 id="cover-studio-heading">
          <BookOpen size={16} aria-hidden /> {COVER_STUDIO_META.title}
        </h3>
        <p className="sf-muted">{NAMED_TOOLS.cover_studio?.description}</p>
        <p className="sf-muted">
          <a
            href={COVER_STUDIO_META.kdpHelpUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Amazon KDP cover help (G201953020) <ExternalLink size={12} aria-hidden />
          </a>
        </p>
      </header>

      <div className="sf-cover-studio-grid">
        <div className="sf-cover-studio-preview">
          {frontPreview ? (
            <img src={frontPreview} alt="Front cover preview" />
          ) : (
            <div className="sf-cover-studio-placeholder">
              Pin Character Turbo, then Generate cover art
            </div>
          )}
          <p className="sf-muted">
            Wrap {assessment.layout.widthIn.toFixed(2)}″ × {assessment.layout.heightIn.toFixed(2)}″
            · spine {assessment.layout.spineIn.toFixed(3)}″
            {assessment.layout.spineTextAllowed
              ? ' · spine text OK'
              : ' · no spine text (<80 pp)'}
          </p>
        </div>

        <div className="sf-cover-studio-fields">
          <label>
            Layout mood
            <select
              value={draft.layout_id}
              disabled={busy}
              onChange={(e) => patch({ layout_id: e.target.value })}
            >
              {COVER_LAYOUT_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label} — {p.bestFor}
                </option>
              ))}
            </select>
          </label>
          <label>
            Author (must match KDP)
            <input
              type="text"
              value={draft.author}
              disabled={busy}
              maxLength={120}
              onChange={(e) => patch({ author: e.target.value })}
              placeholder="Author name on cover"
            />
          </label>
          <label>
            Subtitle (optional)
            <input
              type="text"
              value={draft.subtitle}
              disabled={busy}
              maxLength={160}
              onChange={(e) => patch({ subtitle: e.target.value })}
            />
          </label>
          <label>
            Title placement
            <select
              value={draft.title_placement}
              disabled={busy}
              onChange={(e) => patch({ title_placement: e.target.value })}
            >
              <option value="top">Top band (title-safe art)</option>
              <option value="bottom">Bottom band</option>
            </select>
          </label>
          <label>
            Print finish (KDP option)
            <select
              value={draft.finish}
              disabled={busy}
              onChange={(e) => patch({ finish: e.target.value })}
            >
              {COVER_FINISH_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>

          <div className="sf-btn-row">
            <button type="button" className="sf-btn" disabled={busy || !project} onClick={saveSettings}>
              <Save size={16} aria-hidden /> Save
            </button>
            <button
              type="button"
              className="sf-btn sf-btn-primary"
              disabled={busy || !hasAnchor}
              onClick={generateArt}
              title={hasAnchor ? undefined : 'Pin Character Turbo first'}
            >
              <ImagePlus size={16} aria-hidden /> Generate cover art (
              {CREDIT_COSTS.generate_cover_art})
            </button>
            <button
              type="button"
              className="sf-btn sf-btn-primary"
              disabled={busy || !project}
              onClick={exportWrap}
            >
              Export cover wrap ({CREDIT_COSTS.export_cover_pdf})
            </button>
          </div>
        </div>
      </div>

      <details className="sf-details">
        <summary>KDP cover checklist (G201953020)</summary>
        <ul>
          {COVER_KDP_CHECKLIST.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="sf-muted">{COVER_STUDIO_META.kdpCalculatorNote}</p>
      </details>

      <details className="sf-details">
        <summary>Optional Canva polish handoff</summary>
        <p className="sf-muted">{assessment.canvaHandoff.note}</p>
        <ol>
          {assessment.canvaHandoff.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <p>
          <a href={assessment.canvaHandoff.docsUrl} target="_blank" rel="noopener noreferrer">
            Canva Connect REST APIs <ExternalLink size={12} aria-hidden />
          </a>
        </p>
        <label className="sf-check-row">
          <input
            type="checkbox"
            checked={Boolean(draft.canva_handoff_acknowledged)}
            disabled={busy}
            onChange={(e) => patch({ canva_handoff_acknowledged: e.target.checked })}
          />
          <span>I understand StoryForge does not auto-push designs to Canva</span>
        </label>
      </details>

      {assessment.issues.length > 0 ? (
        <ul className="sf-issue-list">
          {assessment.issues.map((iss) => (
            <li key={iss.message} data-severity={iss.severity}>
              {iss.message}
            </li>
          ))}
        </ul>
      ) : null}

      <p className="sf-muted">{COVER_STUDIO_META.disclaimer}</p>
    </section>
  )
}
