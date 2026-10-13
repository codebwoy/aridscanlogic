import { useEffect, useMemo, useState } from 'react'
import { Copy, ExternalLink } from 'lucide-react'
import { api } from '../lib/api.js'

const TABS = [
  { id: 'tutorials', label: 'Tutorials' },
  { id: 'craft', label: 'Craft' },
  { id: 'guides', label: 'Guides' },
  { id: 'course', label: 'Course' },
  { id: 'prompts', label: 'Prompt Library' },
  { id: 'disclosure', label: 'Disclosure Helper' },
  { id: 'books', label: 'Books & Guides' },
  { id: 'admin', label: 'Admin config' },
  { id: 'trace', label: 'S1–S74' },
]

export default function Launchpad({ activeProject, onRefreshProject, setStatus, setError }) {
  const [tab, setTab] = useState('tutorials')
  const [data, setData] = useState(null)
  const [busy, setBusy] = useState(false)
  const [mode, setMode] = useState('prompt')
  const [usedAi, setUsedAi] = useState(true)
  const [assessment, setAssessment] = useState(null)
  const [promptVars, setPromptVars] = useState({
    characterName: 'Luna',
    sceneBrief: 'first day of school',
    emotionalCore: 'bravery',
    secondCharacterName: 'Max',
    ageBand: '8-year-old',
    whoDescriptor: 'curious explorer',
    features: 'large round eyes, freckles, messy auburn bob with a tuft',
    outfit: 'yellow raincoat and red rain boots',
    styleLock: '2D flat, thick black outlines, soft cel shading, warm palette',
    actionVerb: 'waving hello with raised hand',
    emotion: 'worried, eyes looking down, mouth small frown, eyebrows raised',
  })
  const [filled, setFilled] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const lp = await api('/v1/launchpad', { auth: false })
        if (!cancelled) setData(lp)
      } catch (e) {
        if (!cancelled) setError?.(e.message)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [setError])

  const coursePct = useMemo(() => {
    if (!activeProject?.course_progress || !data?.courseSteps) return 0
    const total = data.courseSteps.length
    const done = data.courseSteps.filter((s) => activeProject.course_progress[s.key]).length
    return total ? Math.round((done / total) * 100) : 0
  }, [activeProject, data])

  async function toggleCourse(key) {
    if (!activeProject) {
      setError?.('Open a project in Studio first')
      return
    }
    setBusy(true)
    try {
      const next = {
        ...(activeProject.course_progress || {}),
        [key]: !activeProject.course_progress?.[key],
      }
      await api(`/v1/projects/${activeProject.id}`, {
        method: 'PATCH',
        body: { course_progress: next },
      })
      await onRefreshProject?.(activeProject.id)
      setStatus?.(`Course progress ${key} updated`)
    } catch (e) {
      setError?.(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function applyFormat(fmt) {
    if (!activeProject) {
      setError?.('Open a project in Studio first')
      return
    }
    setBusy(true)
    try {
      const pages = fmt.pageMin === 12 ? 24 : fmt.pageMin <= 24 ? 24 : 32
      await api(`/v1/projects/${activeProject.id}`, {
        method: 'PATCH',
        body: {
          format_id: fmt.id,
          page_count: Math.min(fmt.pageMax, Math.max(fmt.pageMin, pages)),
          trim_id: fmt.recommendedTrims?.[0] || 'sq_85',
          progress_step: 'story',
        },
      })
      await onRefreshProject?.(activeProject.id)
      setStatus?.(`Format set to ${fmt.format}`)
    } catch (e) {
      setError?.(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function runDisclosure() {
    if (!activeProject) {
      setError?.('Open a project in Studio first')
      return
    }
    setBusy(true)
    try {
      const res = await api('/v1/disclosure/assess', {
        method: 'POST',
        body: { projectId: activeProject.id, usedAi, generationMode: mode },
      })
      setAssessment(res)
      setStatus?.('Disclosure assessment saved')
    } catch (e) {
      setError?.(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function fillPrompt(templateId) {
    setBusy(true)
    try {
      const res = await api('/v1/prompts/fill', {
        method: 'POST',
        body: { templateId, vars: promptVars },
      })
      setFilled(res.filled)
      setStatus?.('Prompt filled')
    } catch (e) {
      setError?.(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function saveConfig(key, value) {
    setBusy(true)
    try {
      await api(`/v1/admin/config/${encodeURIComponent(key)}`, {
        method: 'PATCH',
        body: { value },
      })
      const lp = await api('/v1/launchpad', { auth: false })
      setData(lp)
      setStatus?.(`Config ${key} updated`)
    } catch (e) {
      setError?.(e.message)
    } finally {
      setBusy(false)
    }
  }

  if (!data) {
    return (
      <div className="sf-canvas-wrap">
        <div className="sf-card">Loading Launchpad…</div>
      </div>
    )
  }

  const cfg = data.config?.map || {}
  const craft = data.craft || {}

  return (
    <div className="sf-main sf-launchpad-main">
      <aside className="sf-sidebar">
        <p className="sf-muted" style={{ marginTop: 0 }}>
          Launchpad · course {coursePct}%
        </p>
        <div className="sf-tabs" style={{ flexDirection: 'column' }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={tab === t.id ? 'sf-tab-active' : ''}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="sf-disclaimer">{data.notAffiliated}</p>
      </aside>

      <main className="sf-canvas-wrap">
        {tab === 'tutorials' ? (
          <div className="sf-stack">
            <div className="sf-card">
              <h2 style={{ marginTop: 0, fontFamily: 'var(--sf-font-display)' }}>
                Video tutorials → StoryForge path
              </h2>
              <p className="sf-muted">
                Catalogue last verified {data.tutorialsMeta?.lastVerified}. Learn the consistency
                workflow, then build with Character Turbo, Editor Pro, Story Scene Pro, Photo to
                Cartoon, and Canvas.
              </p>
              <p className="sf-warn-note">{data.tutorialsMeta?.independenceNote}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <a
                  className="sf-btn"
                  href={data.tutorialsMeta?.catalogueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open catalogue <ExternalLink size={14} aria-hidden />
                </a>
                <a
                  className="sf-btn"
                  href={data.tutorialsMeta?.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube channel <ExternalLink size={14} aria-hidden />
                </a>
              </div>
            </div>

            <div className="sf-grid-2">
              {(data.videoTutorials || []).map((v) => (
                <div key={v.id} className="sf-card">
                  <h3 style={{ marginTop: 0, fontFamily: 'var(--sf-font-display)' }}>{v.title}</h3>
                  <p className="sf-muted">{v.summary}</p>
                  <p>
                    <strong>In StoryForge:</strong> {v.storyforgePath}
                  </p>
                  <p className="sf-muted">
                    Recipe: {v.recipeId}
                    {v.guideId ? ` · Guide: ${v.guideId}` : ''}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <a
                      className="sf-btn sf-btn-primary"
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Watch on YouTube <ExternalLink size={14} aria-hidden />
                    </a>
                    <button
                      type="button"
                      className="sf-btn"
                      onClick={() =>
                        setStatus?.(
                          `Next: open Studio and run recipe ${v.recipeId} (pin anchor before scenes)`,
                        )
                      }
                    >
                      Use this recipe
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="sf-card">
              <h3 style={{ marginTop: 0, fontFamily: 'var(--sf-font-display)' }}>
                Tool playbooks
              </h3>
              <p className="sf-muted">
                Distilled rules for StoryForge tools — not third-party scripts.
              </p>
              <div className="sf-grid-2">
                {(data.workflowPlaybooks || []).map((wf) => (
                  <div key={wf.id} className="sf-card">
                    <h4 style={{ marginTop: 0 }}>{wf.title}</h4>
                    <ul>
                      {wf.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {tab === 'craft' ? (
          <div className="sf-stack">
            <div className="sf-card">
              <h2 style={{ marginTop: 0, fontFamily: 'var(--sf-font-display)' }}>
                Craft library
              </h2>
              <p className="sf-muted">
                Plan → lock identity → pick a style → produce → QC. StoryForge-owned distillations
                of public children’s-book consistency teaching (incl. themes from Neolemon guides /
                blog). Verified {craft.meta?.lastVerified}.
              </p>
              <p className="sf-warn-note">{craft.meta?.independenceNote}</p>
            </div>

            <div className="sf-card">
              <h3 style={{ marginTop: 0 }}>{craft.storytellingCompass?.title}</h3>
              <ol>
                {(craft.storytellingCompass?.steps || []).map((s) => (
                  <li key={s.id}>
                    <strong>{s.label}:</strong> {s.prompt}
                  </li>
                ))}
              </ol>
              <p className="sf-muted">{craft.storytellingCompass?.note}</p>
            </div>

            <div className="sf-card">
              <h3 style={{ marginTop: 0 }}>{craft.characterDna?.title}</h3>
              <ul>
                {(craft.characterDna?.bullets || []).map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div className="sf-table-wrap">
                <table className="sf-table">
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>Your notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(craft.characterDna?.fields || []).map((f) => (
                      <tr key={f.key}>
                        <td>{f.label}</td>
                        <td>
                          <input placeholder="Fill in Studio / notes" readOnly />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="sf-card">
              <h3 style={{ marginTop: 0 }}>{craft.artStyles?.title}</h3>
              <p className="sf-muted">{craft.artStyles?.note}</p>
              <ul>
                {(craft.artStyles?.chooseBy || []).map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <div className="sf-table-wrap">
                <table className="sf-table">
                  <thead>
                    <tr>
                      <th>Style</th>
                      <th>Best for</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(craft.artStyles?.styles || []).map((st) => (
                      <tr key={st.id}>
                        <td>{st.label}</td>
                        <td>{st.bestFor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="sf-grid-2">
              <div className="sf-card">
                <h3 style={{ marginTop: 0 }}>{craft.coverDesign?.title}</h3>
                <ul>
                  {(craft.coverDesign?.bullets || []).map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <p className="sf-warn-note">{craft.coverDesign?.note}</p>
              </div>
              <div className="sf-card">
                <h3 style={{ marginTop: 0 }}>{craft.ageWordCounts?.title}</h3>
                <div className="sf-table-wrap">
                  <table className="sf-table">
                    <thead>
                      <tr>
                        <th>Ages</th>
                        <th>Words</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(craft.ageWordCounts?.rows || []).map((r) => (
                        <tr key={r.ages}>
                          <td>{r.ages}</td>
                          <td>{r.words}</td>
                          <td>{r.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="sf-card">
              <h3 style={{ marginTop: 0 }}>{craft.sevenDayPlan?.title}</h3>
              <p className="sf-warn-note">{craft.sevenDayPlan?.note}</p>
              <ol>
                {(craft.sevenDayPlan?.days || []).map((d) => (
                  <li key={d.day}>
                    <strong>
                      Day {d.day}: {d.title}
                    </strong>
                    <ul>
                      {d.tasks.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
              <button
                type="button"
                className="sf-btn sf-btn-primary"
                onClick={() =>
                  setStatus?.(
                    'Next: recipe_seven_day_launch — Compass + DNA before Character Turbo',
                  )
                }
              >
                Use 7-day recipe
              </button>
            </div>

            <div className="sf-grid-2">
              <div className="sf-card">
                <h3 style={{ marginTop: 0 }}>{craft.multiCharacterMethod?.title}</h3>
                <ul>
                  {(craft.multiCharacterMethod?.bullets || []).map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
              <div className="sf-card">
                <h3 style={{ marginTop: 0 }}>{craft.expressionArc?.title}</h3>
                <p>
                  <strong>Hierarchy</strong>
                </p>
                <ul>
                  {(craft.expressionArc?.hierarchy || []).map((h) => (
                    <li key={h.id}>
                      <strong>{h.label}:</strong> {h.tip}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>3-act emotions</strong>
                </p>
                <ul>
                  {(craft.expressionArc?.acts || []).map((a) => (
                    <li key={a.act}>
                      Act {a.act} · {a.label}: {a.tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="sf-card">
              <h3 style={{ marginTop: 0 }}>{craft.continuityChecklist?.title}</h3>
              <div className="sf-grid-2">
                {(craft.continuityChecklist?.passes || []).map((p) => (
                  <div key={p.id}>
                    <h4>{p.title}</h4>
                    <ul>
                      {p.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {data.characterNames ? (
              <div className="sf-card">
                <h3 style={{ marginTop: 0 }}>
                  {data.characterNames.meta?.title || 'Theme-aware name ideas'}
                </h3>
                <p className="sf-muted">{data.characterNames.meta?.disclaimer}</p>
                <ul>
                  {(data.characterNames.meta?.rules || []).map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                <p className="sf-muted" style={{ marginBottom: 0 }}>
                  Generate live ideas in Studio → Character Turbo → IP Character Builder (uses book
                  emotional core + DNA). Sample:{' '}
                  {(data.characterNames.sample?.ideas || [])
                    .slice(0, 5)
                    .map((i) => i.name)
                    .join(', ')}
                  .
                </p>
              </div>
            ) : null}

            {data.publicationReadiness ? (
              <div className="sf-card">
                <h3 style={{ marginTop: 0 }}>
                  {data.publicationReadiness.meta?.title || 'Publication readiness'}
                </h3>
                <p className="sf-muted">{data.publicationReadiness.meta?.disclaimer}</p>
                <div className="sf-grid-2">
                  {Object.entries(data.publicationReadiness.weights || {}).map(([gate, weight]) => (
                    <div key={gate}>
                      <strong style={{ textTransform: 'capitalize' }}>{gate}</strong>
                      <span className="sf-muted"> · weight {weight}</span>
                    </div>
                  ))}
                </div>
                <p className="sf-muted" style={{ marginBottom: 0 }}>
                  Run the live score in Studio → Canvas (Save &amp; score). Levels:{' '}
                  {(data.publicationReadiness.meta?.levels || [])
                    .map((l) => l.label)
                    .join(' → ')}
                  .
                </p>
              </div>
            ) : null}

            <div className="sf-grid-2">
              <div className="sf-card">
                <h3 style={{ marginTop: 0 }}>{craft.characterDesignPrinciples?.title}</h3>
                <ol>
                  {(craft.characterDesignPrinciples?.principles || []).map((p) => (
                    <li key={p.id}>
                      <strong>{p.label}:</strong> {p.tip}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="sf-card">
                <h3 style={{ marginTop: 0 }}>{craft.cameraBodyAge?.title}</h3>
                <ul>
                  {(craft.cameraBodyAge?.bullets || []).map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <h4>{craft.coloringWorkflow?.title}</h4>
                <ul>
                  {(craft.coloringWorkflow?.bullets || []).map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <h4>{craft.seriesWorkflow?.title}</h4>
                <ul>
                  {(craft.seriesWorkflow?.bullets || []).map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="sf-card">
              <h3 style={{ marginTop: 0 }}>{craft.kdpEarningsRealism?.title}</h3>
              <ul>
                {(craft.kdpEarningsRealism?.bullets || []).map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <p className="sf-warn-note">{craft.kdpEarningsRealism?.note}</p>
            </div>

            <div className="sf-card">
              <h3 style={{ marginTop: 0 }}>External learning index</h3>
              <p className="sf-muted">
                Links to public Neolemon pages for further reading — content stays on their site.
                Their pricing / legal pages are not StoryForge policy.
              </p>
              {(craft.externalLearningIndex || []).map((group) => (
                <div key={group.group} style={{ marginBottom: '0.75rem' }}>
                  <h4>{group.group}</h4>
                  <ul>
                    {group.links.map((link) => (
                      <li key={link.url}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          {link.label} <ExternalLink size={12} aria-hidden />
                        </a>
                        {link.warn ? (
                          <span className="sf-warn-note"> · third-party / not our policy</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {tab === 'guides' ? (
          <div className="sf-grid-2">
            {data.guides.map((g) => (
              <div key={g.id} className="sf-card">
                <h3 style={{ marginTop: 0, fontFamily: 'var(--sf-font-display)' }}>{g.title}</h3>
                <p className="sf-muted">{g.body}</p>
                {g.timingAdvice?.map((t) => (
                  <p key={t.key} className="sf-warn-note">
                    {cfg[t.key]?.value || t.key}
                    {cfg[t.key]?.verified_note ? ` ${cfg[t.key].verified_note}` : ''}
                  </p>
                ))}
                {g.personalisationWarning ? (
                  <p className="sf-warn-note">{g.personalisationWarning}</p>
                ) : null}
                <div className="sf-field">
                  <label>Manual BSR / revenue (owner-entered)</label>
                  <input placeholder="Rank + source + as-of date — no scraping" readOnly />
                </div>
                <a
                  className="sf-btn"
                  href={g.trendsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Trends <ExternalLink size={14} aria-hidden />
                </a>
                <p className="sf-muted">Recipe: {g.recipeId}</p>
                <button
                  type="button"
                  className="sf-btn sf-btn-primary"
                  disabled={busy}
                  onClick={() => setStatus?.(`Start recipe ${g.recipeId} in Studio (Character Turbo → pin → scenes)`)}
                >
                  Start this book
                </button>
              </div>
            ))}
            <div className="sf-card">
              <h3 style={{ marginTop: 0 }}>Quick Book</h3>
              <p className="sf-muted">
                {cfg.quick_book_time_estimate?.value}{' '}
                <span className="sf-warn-note">{cfg.quick_book_time_estimate?.verified_note}</span>
              </p>
              <ol>
                {data.recipes
                  .find((r) => r.id === 'recipe_quick_book')
                  ?.steps.map((s) => (
                    <li key={s.id}>{s.title}</li>
                  ))}
              </ol>
            </div>
          </div>
        ) : null}

        {tab === 'course' ? (
          <div className="sf-card">
            <h2 style={{ marginTop: 0, fontFamily: 'var(--sf-font-display)' }}>
              Publish your first book
            </h2>
            <p className="sf-muted">Per-project checklist · {coursePct}% complete</p>

            <h3>1. Format Chooser</h3>
            <div className="sf-table-wrap">
              <table className="sf-table">
                <thead>
                  <tr>
                    <th>Format</th>
                    <th>Age</th>
                    <th>Pages</th>
                    <th>Key</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.formats.map((f) => (
                    <tr key={f.id}>
                      <td>{f.format}</td>
                      <td>{f.ageRange}</td>
                      <td>{f.pages}</td>
                      <td>{f.keyFeature}</td>
                      <td>
                        <button
                          type="button"
                          className="sf-btn"
                          disabled={busy}
                          onClick={() => applyFormat(f)}
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="sf-muted">
              Most first-timers target picture books ages 3–7.
            </p>

            <h3>2. Manuscript Coach</h3>
            <ul>
              {data.manuscriptPrinciples.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            {data.referenceBooks.map((r) => (
              <div key={r.id} className="sf-card" style={{ marginTop: '0.5rem' }}>
                <strong>{r.title}</strong>
                <p className="sf-muted">{r.role}</p>
                <p className="sf-warn-note">{r.note}</p>
              </div>
            ))}

            {data.courseSteps.map((step) => (
              <div key={step.id} className="sf-card" style={{ marginTop: '0.75rem' }}>
                <label className="sf-check">
                  <input
                    type="checkbox"
                    checked={Boolean(activeProject?.course_progress?.[step.key])}
                    onChange={() => toggleCourse(step.key)}
                    disabled={busy || !activeProject}
                  />
                  <strong>
                    {step.id}. {step.title}
                  </strong>
                </label>
                <ul>
                  {step.checklist.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                {step.key === 'upload' ? (
                  <p className="sf-warn-note">
                    Royalty display default {cfg.kdp_print_royalty_rate?.value}%{' '}
                    {cfg.kdp_print_royalty_rate?.verified_note}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {tab === 'prompts' ? (
          <div className="sf-card">
            <h2 style={{ marginTop: 0 }}>Prompt Library</h2>
            <div className="sf-grid-2">
              {Object.entries(promptVars).map(([k, v]) => (
                <div className="sf-field" key={k}>
                  <label htmlFor={k}>{k}</label>
                  <input
                    id={k}
                    value={v}
                    onChange={(e) => setPromptVars((p) => ({ ...p, [k]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            {data.prompts.map((p) => (
              <div key={p.id} className="sf-card" style={{ marginTop: '0.5rem' }}>
                <strong>{p.title}</strong>
                <p className="sf-muted">{p.text}</p>
                <div className="sf-btn-row">
                  <button type="button" className="sf-btn" onClick={() => fillPrompt(p.id)}>
                    Apply
                  </button>
                  <button
                    type="button"
                    className="sf-btn"
                    onClick={() => {
                      navigator.clipboard?.writeText(filled || p.text)
                      setStatus?.('Copied')
                    }}
                  >
                    <Copy size={14} aria-hidden /> Copy
                  </button>
                </div>
              </div>
            ))}
            {filled ? (
              <div className="sf-card" style={{ marginTop: '0.75rem' }}>
                <strong>Filled prompt</strong>
                <p>{filled}</p>
              </div>
            ) : null}
          </div>
        ) : null}

        {tab === 'disclosure' ? (
          <div className="sf-card">
            <h2 style={{ marginTop: 0 }}>Disclosure Helper</h2>
            <p className="sf-muted">Guidance only — not legal advice.</p>
            <p className="sf-warn-note">{cfg.kdp_ai_disclosure_confidential?.value}</p>
            <p className="sf-warn-note">{cfg.kdp_ai_disclosure_confidential?.verified_note}</p>
            <p className="sf-warn-note">
              Required since {cfg.kdp_ai_disclosure_required_since?.value}{' '}
              {cfg.kdp_ai_disclosure_required_since?.verified_note}
            </p>
            <label className="sf-check">
              <input type="checkbox" checked={usedAi} onChange={(e) => setUsedAi(e.target.checked)} />
              Used AI for images
            </label>
            <div className="sf-field">
              <label htmlFor="mode">Generation mode</label>
              <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="prompt">From prompt → AI-generated</option>
                <option value="enhance_hand_painted">Enhance hand-painted → AI-assisted</option>
                <option value="mixed">Mixed / uncertain</option>
              </select>
            </div>
            <button
              type="button"
              className="sf-btn sf-btn-primary"
              disabled={busy}
              onClick={runDisclosure}
            >
              Assess & save
            </button>
            {assessment ? (
              <div className="sf-card" style={{ marginTop: '0.75rem' }}>
                <p>
                  <strong>
                    {assessment.assessment.recommendDisclose ? 'Disclose' : 'No disclose (per source)'}
                  </strong>{' '}
                  · {assessment.assessment.kdpCategory}
                </p>
                <p className="sf-muted">{assessment.assessment.rationale}</p>
                <p className="sf-muted">{assessment.commercialUse?.mock}</p>
                <p className="sf-warn-note">{assessment.configClaims?.usCopyright?.value}</p>
              </div>
            ) : null}
          </div>
        ) : null}

        {tab === 'books' ? (
          <div>
            {data.readingResources.map((group) => (
              <div key={group.group} className="sf-card" style={{ marginBottom: '0.75rem' }}>
                <h3 style={{ marginTop: 0 }}>{group.group}</h3>
                {group.slots.map((slot) => (
                  <div key={slot.id} style={{ marginBottom: '0.75rem' }}>
                    <p className="sf-muted">{slot.description}</p>
                    <div className="sf-grid-2">
                      <div className="sf-field">
                        <label>Title (owner fill)</label>
                        <input defaultValue={slot.title} placeholder="Add title" />
                      </div>
                      <div className="sf-field">
                        <label>Author</label>
                        <input defaultValue={slot.author} placeholder="Add author" />
                      </div>
                      <div className="sf-field">
                        <label>Link</label>
                        <input defaultValue={slot.link} placeholder="https://" />
                      </div>
                      <div className="sf-field">
                        <label>Rating as of</label>
                        <input
                          defaultValue={
                            slot.rating
                              ? `${slot.rating}${slot.dateChecked ? ` as of ${slot.dateChecked}` : ' (add dateChecked)'}`
                              : ''
                          }
                          placeholder="rating + dateChecked"
                        />
                      </div>
                    </div>
                    <p className="sf-warn-note">Affiliate links require disclosure.</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : null}

        {tab === 'admin' ? (
          <div className="sf-card">
            <h2 style={{ marginTop: 0 }}>Admin config</h2>
            <p className="sf-muted">Each value shows source + verification note (⚠).</p>
            {(data.config?.values || []).map((c) => (
              <div key={c.key} className="sf-card" style={{ marginTop: '0.5rem' }}>
                <strong>{c.key}</strong>
                <p className="sf-muted">
                  Source: {c.source_label}
                  {c.verified_note ? ` · ${c.verified_note}` : ''}
                </p>
                <div className="sf-field">
                  <label htmlFor={c.key}>Value</label>
                  <textarea
                    id={c.key}
                    defaultValue={c.value}
                    onBlur={(e) => {
                      if (e.target.value !== c.value) saveConfig(c.key, e.target.value)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {tab === 'trace' ? (
          <div className="sf-card">
            <h2 style={{ marginTop: 0 }}>Traceability S1–S74</h2>
            <div className="sf-table-wrap">
              <table className="sf-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Area</th>
                    <th>Status</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {data.traceability.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.area}</td>
                      <td>
                        <span
                          className={`sf-badge ${
                            row.status === 'done'
                              ? 'sf-badge-ok'
                              : row.status === 'partial'
                                ? 'sf-badge-warn'
                                : 'sf-badge-fail'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}
