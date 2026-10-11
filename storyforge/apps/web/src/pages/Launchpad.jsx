import { useEffect, useMemo, useState } from 'react'
import { Copy, ExternalLink } from 'lucide-react'
import { api } from '../lib/api.js'

const TABS = [
  { id: 'guides', label: 'Guides' },
  { id: 'course', label: 'Course' },
  { id: 'prompts', label: 'Prompt Library' },
  { id: 'disclosure', label: 'Disclosure Helper' },
  { id: 'books', label: 'Books & Guides' },
  { id: 'admin', label: 'Admin config' },
  { id: 'trace', label: 'S1–S32' },
]

export default function Launchpad({ activeProject, onRefreshProject, setStatus, setError }) {
  const [tab, setTab] = useState('guides')
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
            <h2 style={{ marginTop: 0 }}>Traceability S1–S32</h2>
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
