import { useState } from 'react'
import {
  BookOpen,
  Check,
  FileOutput,
  Pin,
  Sparkles,
  Wand2,
} from 'lucide-react'
import {
  CREDIT_COSTS,
  CHARACTER_TURBO_ENGINES,
  NAMED_TOOLS,
  PUBLISHING_SPECS,
  estimateBookCredits,
} from '@storyforge/shared'
import { api } from '../lib/api.js'
import { runAndWait } from '../lib/jobs.js'
import PageCanvas from '../components/PageCanvas.jsx'

const STEPS = ['story', 'characters', 'scenes', 'layout', 'preflight', 'export']

export default function Studio({
  session,
  setSession,
  projects,
  setProjects,
  active,
  printReq,
  busy,
  setBusy,
  error,
  setError,
  status,
  setStatus,
  onSelectProject,
}) {
  const [toolTab, setToolTab] = useState('character_turbo')
  const [pageIndex, setPageIndex] = useState(0)
  const [charName, setCharName] = useState('Luna')
  const [engine, setEngine] = useState('v3')
  const [sceneBrief, setSceneBrief] = useState('waves hello in a sunny park')
  const [pageText, setPageText] = useState('')
  const [lastOutputs, setLastOutputs] = useState(null)
  const [consent, setConsent] = useState(false)
  const [createForm, setCreateForm] = useState({
    title: 'Mein Bilderbuch',
    language: 'de',
    trim_id: 'sq_85',
    page_count: 24,
    premise: '',
    emotional_core: '',
    format_id: 'picture',
  })

  const estimate = estimateBookCredits({ pages: createForm.page_count, characters: 1 })
  const step = active?.progress_step || 'story'
  const stepIdx = Math.max(0, STEPS.indexOf(step))
  const currentPage = active?.pages?.[pageIndex]
  const heroPreview =
    lastOutputs?.assets?.find((a) => a.role === 'hero_frame')?.url ||
    active?.pinned_anchor?.heroUrl ||
    currentPage?.asset?.url

  async function createProject() {
    setBusy(true)
    setError('')
    try {
      const { project } = await api('/v1/projects', {
        method: 'POST',
        body: createForm,
      })
      setProjects((p) => [project, ...p])
      await onSelectProject(project.id)
      setStatus('Project created — start with Character Turbo')
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function runJob(type, inputs = {}) {
    if (!active && type !== 'character_turbo') return
    const cost = CREDIT_COSTS[type] ?? 0
    if (cost > 0 && !window.confirm(`Run “${type}” for ${cost} credit(s)?`)) return
    setBusy(true)
    setError('')
    try {
      const res = await runAndWait(type, {
        projectId: active?.id,
        inputs,
      })
      setSession((s) => (s ? { ...s, credits: res.balance } : s))
      if (res.job.status === 'failed') {
        setError(res.job.error || 'Job failed')
        setStatus(`Failed: ${type}`)
      } else {
        setLastOutputs(res.job.outputs)
        setStatus(
          `Done: ${type}${
            res.job.outputs?.consistencyBadge
              ? ` · consistency ${res.job.outputs.consistencyBadge}`
              : ''
          }`
        )
        if (active?.id) await onSelectProject(active.id)
        if (res.job.outputs?.pdf?.dataUrl) {
          const a = document.createElement('a')
          a.href = res.job.outputs.pdf.dataUrl
          a.download = res.job.outputs.pdf.filename || 'interior.pdf'
          a.click()
        }
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function approvePin() {
    if (!active || !lastOutputs?.assets?.[0]) {
      setError('Generate Character Turbo first')
      return
    }
    setBusy(true)
    setError('')
    try {
      const hero = lastOutputs.assets.find((a) => a.role === 'hero_frame') || lastOutputs.assets[0]
      await api(`/v1/projects/${active.id}/pin`, {
        method: 'POST',
        body: {
          assetId: hero.assetId,
          heroUrl: hero.url,
          palette: lastOutputs.palette,
          embedding: lastOutputs.embedding,
          name: charName,
          engine,
        },
      })
      await onSelectProject(active.id)
      setStatus('Anchor pinned — Editor Pro will use this character')
      setToolTab('editor_pro')
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function savePageText() {
    if (!active) return
    setBusy(true)
    try {
      await api(`/v1/projects/${active.id}/pages/${pageIndex}`, {
        method: 'PATCH',
        body: { text_content: pageText, illustration_brief: sceneBrief },
      })
      await onSelectProject(active.id)
      setStatus(`Page ${pageIndex + 1} text saved (0 credits)`)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="sf-main">
      <aside className="sf-sidebar">
        <div className="sf-progress" aria-label="Project progress">
          {STEPS.map((id, i) => (
            <span key={id} className={`sf-step ${i === stepIdx ? 'sf-step-active' : ''}`}>
              {id}
            </span>
          ))}
        </div>

        <div className="sf-card" style={{ marginBottom: '0.75rem' }}>
          <h3 style={{ marginTop: 0, fontFamily: 'var(--sf-font-display)' }}>New book</h3>
          <div className="sf-field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              value={createForm.title}
              onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div className="sf-field">
            <label htmlFor="lang">Language</label>
            <select
              id="lang"
              value={createForm.language}
              onChange={(e) => setCreateForm((f) => ({ ...f, language: e.target.value }))}
            >
              <option value="de">Deutsch</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="sf-field">
            <label htmlFor="trim">Trim</label>
            <select
              id="trim"
              value={createForm.trim_id}
              onChange={(e) => setCreateForm((f) => ({ ...f, trim_id: e.target.value }))}
            >
              {PUBLISHING_SPECS.trimSizesInches.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sf-field">
            <label htmlFor="pages">Pages</label>
            <select
              id="pages"
              value={createForm.page_count}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, page_count: Number(e.target.value) }))
              }
            >
              {[24, 32, 40].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="sf-field">
            <label htmlFor="core">Emotional core</label>
            <input
              id="core"
              value={createForm.emotional_core}
              onChange={(e) => setCreateForm((f) => ({ ...f, emotional_core: e.target.value }))}
              placeholder="e.g. overcoming fear"
            />
          </div>
          <button
            type="button"
            className="sf-btn sf-btn-primary"
            onClick={createProject}
            disabled={busy}
            style={{ width: '100%' }}
          >
            Create project
          </button>
          <p className="sf-muted" style={{ marginBottom: 0 }}>
            ~{estimate.total} credits estimate for {createForm.page_count} pages
          </p>
        </div>

        <ul className="sf-list">
          {projects.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="sf-btn"
                onClick={() => onSelectProject(p.id)}
                disabled={busy}
              >
                {p.title}
                {p.pinned_anchor_asset_id ? ' · 📌' : ''}
              </button>
            </li>
          ))}
        </ul>

        <p className="sf-disclaimer">{PUBLISHING_SPECS.disclaimers.notAffiliated}</p>
      </aside>

      <main className="sf-canvas-wrap">
        {error ? (
          <div className="sf-card" role="alert" style={{ borderColor: 'hsl(var(--sf-danger))' }}>
            {error}
          </div>
        ) : null}

        {!active ? (
          <div className="sf-card">
            <h2 style={{ marginTop: 0, fontFamily: 'var(--sf-font-display)' }}>
              Welcome to StoryForge
            </h2>
            <p className="sf-muted">
              General AI tools drift characters across pages. StoryForge pins one Character Turbo
              anchor, then every scene starts from that anchor — built for non-illustrators
              publishing to Amazon KDP.
            </p>
            <p className="sf-muted">
              You have {session?.credits ?? '—'} credits (trial {session?.trialCredits ?? 20}). Create
              a project to begin.
            </p>
          </div>
        ) : (
          <>
            <div className="sf-card">
              <h2 style={{ marginTop: 0, fontFamily: 'var(--sf-font-display)' }}>{active.title}</h2>
              <p className="sf-muted">
                Trim {active.trim_id} · {active.page_count} pages ·{' '}
                {printReq
                  ? `print min ${printReq.widthPx}×${printReq.heightPx}px @ ${printReq.dpi} DPI`
                  : ''}{' '}
                · specs {PUBLISHING_SPECS.lastVerified}
              </p>
              {active.pinned_anchor ? (
                <div className="sf-anchor">
                  {active.pinned_anchor.heroUrl ? (
                    <img src={active.pinned_anchor.heroUrl} alt="Pinned anchor" />
                  ) : (
                    <Pin size={20} aria-hidden />
                  )}
                  <div>
                    <strong>Anchor pinned</strong>
                    <div className="sf-muted">
                      {active.pinned_anchor.name} · engine {active.pinned_anchor.engine}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="sf-warn-note">No anchor pinned yet — use Character Turbo, then Approve.</p>
              )}
              <div className="sf-filmstrip" aria-label="Storyboard">
                {(active.pages || []).map((p) => (
                  <button
                    key={p.page_index}
                    type="button"
                    className={`sf-film ${pageIndex === p.page_index ? 'sf-film-active' : ''}`}
                    onClick={() => {
                      setPageIndex(p.page_index)
                      setPageText(p.text_content || '')
                      setSceneBrief(p.illustration_brief || sceneBrief)
                    }}
                  >
                    {p.page_index + 1}
                    {p.consistencyBadge ? ` · ${p.consistencyBadge}` : ''}
                  </button>
                ))}
              </div>
              {status ? <p className="sf-status">{status}</p> : null}
            </div>

            <PageCanvas
              title={`Page ${pageIndex + 1}`}
              previewUrl={heroPreview}
              pageLabel={`Page ${pageIndex + 1}`}
              pageText={currentPage?.text_content || pageText}
            />

            <div className="sf-card">
              <div className="sf-field">
                <label htmlFor="pagetext">Page text (0 credits)</label>
                <textarea
                  id="pagetext"
                  value={pageText}
                  onChange={(e) => setPageText(e.target.value)}
                  placeholder="Short text for this page…"
                />
              </div>
              <button type="button" className="sf-btn" disabled={busy} onClick={savePageText}>
                Save page text
              </button>
            </div>
          </>
        )}
      </main>

      <aside className="sf-tools">
        <div className="sf-tabs" role="tablist">
          {['character_turbo', 'editor_pro', 'canvas'].map((id) => (
            <button
              key={id}
              type="button"
              className={toolTab === id ? 'sf-tab-active' : ''}
              onClick={() => setToolTab(id)}
            >
              {NAMED_TOOLS[id]?.label || id}
            </button>
          ))}
        </div>

        {toolTab === 'character_turbo' ? (
          <div className="sf-card">
            <h3 style={{ marginTop: 0 }}>{NAMED_TOOLS.character_turbo.label}</h3>
            <p className="sf-muted">{NAMED_TOOLS.character_turbo.description}</p>
            <div className="sf-field">
              <label htmlFor="cname">Character name</label>
              <input id="cname" value={charName} onChange={(e) => setCharName(e.target.value)} />
            </div>
            <div className="sf-field">
              <label htmlFor="engine">Engine</label>
              <select id="engine" value={engine} onChange={(e) => setEngine(e.target.value)}>
                {CHARACTER_TURBO_ENGINES.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.label}
                    {e.default ? ' (default)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="sf-btn-row">
              <button
                type="button"
                className="sf-btn sf-btn-primary"
                disabled={busy || !active}
                onClick={() =>
                  runJob('character_turbo', { name: charName, engine, quality: 'final' })
                }
              >
                <Sparkles size={16} aria-hidden /> Generate ({CREDIT_COSTS.character_turbo})
              </button>
              <button
                type="button"
                className="sf-btn"
                disabled={busy || !active || !lastOutputs}
                onClick={approvePin}
              >
                <Check size={16} aria-hidden /> Approve / pin
              </button>
            </div>
            <hr style={{ border: 0, borderTop: '1px solid hsl(var(--sf-border))', margin: '1rem 0' }} />
            <h4 style={{ marginBottom: '0.35rem' }}>{NAMED_TOOLS.photo_to_cartoon.label}</h4>
            <p className="sf-muted">
              Child photos require guardian consent. Raw photo bytes are never sent to the job API.
              Photos are not used for model training.
            </p>
            <label className="sf-check">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>I am the guardian / have authority; no model training; prefer delete after approval</span>
            </label>
            <button
              type="button"
              className="sf-btn"
              disabled={busy || !active || !consent}
              onClick={async () => {
                try {
                  await api(`/v1/projects/${active.id}/consent`, {
                    method: 'POST',
                    body: {
                      guardian_name: 'Guardian',
                      relationship: 'parent_or_guardian',
                      acknowledged_guardian: true,
                      acknowledged_no_model_training: true,
                    },
                  })
                  await runJob('photo_to_cartoon', {
                    name: charName,
                    engine,
                    photoRef: 'client-transient-only',
                  })
                } catch (e) {
                  setError(e.message)
                }
              }}
            >
              Photo to Cartoon ({CREDIT_COSTS.photo_to_cartoon})
            </button>
          </div>
        ) : null}

        {toolTab === 'editor_pro' ? (
          <div className="sf-card">
            <h3 style={{ marginTop: 0 }}>{NAMED_TOOLS.editor_pro.label}</h3>
            <p className="sf-muted">{NAMED_TOOLS.editor_pro.description}</p>
            <div className="sf-field">
              <label htmlFor="brief">Scene brief</label>
              <textarea
                id="brief"
                value={sceneBrief}
                onChange={(e) => setSceneBrief(e.target.value)}
              />
            </div>
            <div className="sf-btn-row">
              <button
                type="button"
                className="sf-btn sf-btn-primary"
                disabled={busy || !active}
                onClick={() =>
                  runJob('editor_pro', {
                    brief: sceneBrief,
                    pageIndex,
                    characterName: charName,
                  })
                }
              >
                <Wand2 size={16} aria-hidden /> Generate scene ({CREDIT_COSTS.editor_pro})
              </button>
              <button
                type="button"
                className="sf-btn"
                disabled={busy || !active}
                onClick={() =>
                  runJob('story_scene_pro', {
                    brief: sceneBrief,
                    pageIndex,
                    characterName: charName,
                    secondCharacterName: 'Friend',
                  })
                }
              >
                Story Scene Pro ({CREDIT_COSTS.story_scene_pro})
              </button>
            </div>
            {currentPage?.consistencyBadge ? (
              <p className={`sf-badge sf-badge-${currentPage.consistencyBadge === 'pass' ? 'ok' : currentPage.consistencyBadge === 'fail' ? 'fail' : 'warn'}`}>
                Consistency: {currentPage.consistencyBadge}
              </p>
            ) : null}
          </div>
        ) : null}

        {toolTab === 'canvas' ? (
          <div className="sf-card">
            <h3 style={{ marginTop: 0 }}>{NAMED_TOOLS.canvas.label}</h3>
            <p className="sf-muted">{NAMED_TOOLS.canvas.description}</p>
            <div className="sf-btn-row">
              <button
                type="button"
                className="sf-btn"
                disabled={busy || !active}
                onClick={() => runJob('preflight', { trim_id: active.trim_id })}
              >
                <BookOpen size={16} aria-hidden /> Preflight (0)
              </button>
              <button
                type="button"
                className="sf-btn sf-btn-primary"
                disabled={busy || !active}
                onClick={() =>
                  runJob('export_interior_pdf', {
                    trim_id: active.trim_id,
                    page_count: active.page_count,
                  })
                }
              >
                <FileOutput size={16} aria-hidden /> Export interior (
                {CREDIT_COSTS.export_interior_pdf})
              </button>
              <button
                type="button"
                className="sf-btn"
                disabled={busy || !active}
                onClick={() =>
                  runJob('export_interior_pdf', {
                    trim_id: active.trim_id,
                    page_count: active.page_count,
                    images: [{ widthPx: 2560, heightPx: 2560 }],
                  })
                }
              >
                Test under-res block
              </button>
            </div>
            <p className="sf-muted">
              Cover wrap is Phase 2 — prepare cover separately for KDP.
            </p>
          </div>
        ) : null}
      </aside>
    </div>
  )
}
