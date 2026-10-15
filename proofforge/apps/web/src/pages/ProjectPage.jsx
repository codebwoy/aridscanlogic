import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { pfApi } from '../lib/api.js'

const EDIT_STEPS = [
  { id: 'all', label: 'All findings' },
  { id: 'dialogue', label: '1. Dialogue' },
  { id: 'repetition', label: '2. Repetition' },
  { id: 'summary', label: '3. Summary' },
  { id: 'easy_wins', label: '4. Easy wins' },
]

function matchesEditStep(f, step) {
  if (!step || step === 'all') return true
  if (step === 'dialogue') {
    return (
      f.subcategory === 'dialogue' ||
      f.subcategory === 'dialogue_tag' ||
      /dialogue/i.test(f.title || '')
    )
  }
  if (step === 'repetition') return f.category === 'repetition' || f.subcategory === 'repeated_sentence_start'
  if (step === 'easy_wins') {
    return ['adverb', 'filler', 'cliche', 'emotion_tell', 'hidden_verb', 'duplicate_word'].includes(
      f.subcategory
    )
  }
  if (step === 'summary') return ['structure', 'consistency', 'naturalness'].includes(f.category)
  return true
}

export function ProjectPage({ projectId, onError, onBack }) {
  const [project, setProject] = useState(null)
  const [job, setJob] = useState(null)
  const [selectedId, setSelectedId] = useState('')
  const [filter, setFilter] = useState('open')
  const [category, setCategory] = useState('all')
  const [editStep, setEditStep] = useState('all')
  const [tab, setTab] = useState('findings')
  const [busy, setBusy] = useState(false)
  const [highlightExcerpt, setHighlightExcerpt] = useState('')
  const [estimate, setEstimate] = useState(null)
  const [showDialogue, setShowDialogue] = useState(false)
  const [reportPane, setReportPane] = useState('summary')
  const [kdpChecklist, setKdpChecklist] = useState(null)
  const manuscriptRef = useRef(null)

  const load = useCallback(async () => {
    const { project: p } = await pfApi.getProject(projectId)
    setProject(p)
  }, [projectId])

  useEffect(() => {
    load().catch((e) => onError?.(e.message))
    pfApi
      .estimate(projectId)
      .then(setEstimate)
      .catch(() => setEstimate(null))
    pfApi
      .kdpChecklist(projectId)
      .then(setKdpChecklist)
      .catch(() => setKdpChecklist(null))
  }, [load, onError, projectId])

  useEffect(() => {
    if (tab !== 'export') return
    pfApi
      .kdpChecklist(projectId)
      .then(setKdpChecklist)
      .catch(() => setKdpChecklist(null))
  }, [tab, projectId, project?.status, project?.print_config])

  useEffect(() => {
    if (!job || job.status === 'completed' || job.status === 'failed') return
    const t = setInterval(async () => {
      try {
        const { job: j } = await pfApi.getJob(job.id)
        setJob(j)
        if (j.status === 'completed') await load()
        if (j.status === 'failed') onError?.(j.error || 'Analysis failed')
      } catch (e) {
        onError?.(e.message)
      }
    }, 800)
    return () => clearInterval(t)
  }, [job, load, onError])

  const findings = useMemo(() => {
    let list = project?.findings || []
    if (filter === 'open') list = list.filter((f) => !f.resolution || f.resolution === 'open')
    else if (filter !== 'all') list = list.filter((f) => f.resolution === filter)
    if (category !== 'all') list = list.filter((f) => f.category === category)
    list = list.filter((f) => matchesEditStep(f, editStep))
    return list
  }, [project, filter, category, editStep])

  const selected = findings.find((f) => f.id === selectedId) || findings[0]
  const running = job && (job.status === 'queued' || job.status === 'running')
  const cats = project?.scores?.autocrit_style || project?.style_reports?.category_scores

  function jumpToFinding(f) {
    if (!f?.original_excerpt) return
    setSelectedId(f.id)
    setHighlightExcerpt(f.original_excerpt)
    setTab('findings')
    requestAnimationFrame(() => {
      const el = manuscriptRef.current?.querySelector('[data-pf-highlight="1"]')
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  function renderSectionText(text) {
    let content = text || ''
    if (showDialogue) {
      content = content.replace(
        /("[^"]{2,}"|'[^']{2,}'|„[^“]+“|«[^»]+»)/g,
        '⟦D⟧$1⟦/D⟧'
      )
    }
    if (highlightExcerpt && content.includes(highlightExcerpt)) {
      const parts = content.split(highlightExcerpt)
      return parts.map((part, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <span key={i}>
          {formatDialogueMarks(part)}
          {i < parts.length - 1 ? (
            <mark className="ms-highlight" data-pf-highlight="1">
              {highlightExcerpt}
            </mark>
          ) : null}
        </span>
      ))
    }
    return formatDialogueMarks(content)
  }

  function formatDialogueMarks(chunk) {
    if (!showDialogue || !String(chunk).includes('⟦D⟧')) return chunk
    const parts = String(chunk).split(/⟦D⟧|⟦\/D⟧/)
    return parts.map((p, i) =>
      i % 2 === 1 ? (
        // eslint-disable-next-line react/no-array-index-key
        <mark key={i} className="dialogue-mark">
          {p}
        </mark>
      ) : (
        // eslint-disable-next-line react/no-array-index-key
        <span key={i}>{p}</span>
      )
    )
  }

  async function runAnalyze() {
    setBusy(true)
    onError?.('')
    try {
      const { job: j, estimate: est } = await pfApi.analyze(projectId)
      setEstimate(est || null)
      setJob(j)
    } catch (e) {
      onError?.(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function resolve(action) {
    if (!selected) return
    setBusy(true)
    try {
      const { project: p } = await pfApi.resolveFinding(projectId, selected.id, { action })
      setProject(p)
    } catch (e) {
      onError?.(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function batchAcceptObjective() {
    setBusy(true)
    try {
      const { project: p, applied } = await pfApi.batchResolve(projectId, {
        action: 'accept',
        only_objective: true,
      })
      setProject(p)
      onError?.('')
      if (!applied) onError?.('No objective findings with suggestions to batch-accept')
    } catch (e) {
      onError?.(e.message)
    } finally {
      setBusy(false)
    }
  }

  function download(kind) {
    window.open(pfApi.exportUrl(projectId, kind), '_blank', 'noopener,noreferrer')
  }

  if (!project) return <p className="muted">Loading project…</p>

  const sections = Object.values(project.sections || {}).sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  )

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <section className="panel">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)' }}>{project.title}</h2>
            <p className="muted" style={{ margin: '0.35rem 0 0' }}>
              {project.language}/{project.language_variety} · {project.book_type} ·{' '}
              {project.edit_mode} · {project.publishing_target} · {project.status}
            </p>
          </div>
          <div className="row">
            <button type="button" className="btn" onClick={onBack}>
              Back
            </button>
            <button
              type="button"
              className="btn"
              disabled={busy || !(project.revisions || []).length}
              onClick={async () => {
                setBusy(true)
                try {
                  const { project: p } = await pfApi.undo(projectId)
                  setProject(p)
                } catch (e) {
                  onError?.(e.message)
                } finally {
                  setBusy(false)
                }
              }}
            >
              Undo ({(project.revisions || []).length})
            </button>
            <button type="button" className="btn" disabled={busy || running} onClick={batchAcceptObjective}>
              Batch-accept objective
            </button>
            <button type="button" className="btn btn-primary" disabled={busy || running} onClick={runAnalyze}>
              {running ? 'Analyzing…' : 'Run full audit'}
            </button>
          </div>
        </div>
        {estimate ? (
          <p className="muted" style={{ marginTop: '0.5rem' }}>
            Work units (not billed): <strong>{estimate.credits}</strong> — {estimate.note}
          </p>
        ) : null}
        {running ? (
          <p className="muted" style={{ marginTop: '0.75rem' }}>
            Progress: {job.progress?.phase || '…'} ({job.progress?.done ?? 0}/{job.progress?.total ?? '—'})
          </p>
        ) : null}
        {project.ingest_warnings?.length ? (
          <p className="muted" style={{ marginTop: '0.5rem' }}>
            Ingest warnings: {project.ingest_warnings.join(' · ')}
          </p>
        ) : null}

        {project.scores ? (
          <div className="row" style={{ marginTop: '1rem', gap: '1.25rem', alignItems: 'flex-start' }}>
            <div>
              <p className="score">
                {project.scores.overall == null ? '—' : project.scores.overall}
              </p>
              <p className="muted" style={{ margin: 0 }}>
                Editorial score (guide)
              </p>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0 }}>
                <strong>{project.scores.readiness?.replaceAll('_', ' ')}</strong>
              </p>
              <p className="muted" style={{ margin: '0.25rem 0 0' }}>
                {project.scores.note}
              </p>
              {project.scores.overall != null ? (
                <p className="muted" style={{ margin: '0.35rem 0 0' }}>
                  Open {project.scores.counts?.total_open ?? 0} · Critical{' '}
                  {project.scores.counts?.critical ?? 0} · Major {project.scores.counts?.major ?? 0}
                  {project.scores.kdp_blocking != null
                    ? ` · KDP blocking ${project.scores.kdp_blocking}`
                    : ''}
                </p>
              ) : (
                <p className="muted" style={{ margin: '0.35rem 0 0' }}>
                  No score yet — click <strong>Run full audit</strong> to analyze this manuscript.
                </p>
              )}
              {cats && project.scores.overall != null ? (
                <div className="row" style={{ marginTop: '0.75rem', gap: '0.75rem' }}>
                  {[
                    ['Pacing', cats.pacing_and_momentum],
                    ['Dialogue', cats.dialogue],
                    ['Strong writing', cats.strong_writing],
                    ['Word choice', cats.word_choice],
                    ['Repetition', cats.repetition],
                  ].map(([label, val]) => (
                    <span key={label} className="sev">
                      {label} {val}
                    </span>
                  ))}
                  {cats.genre_comparison ? (
                    <span className="sev sev-working_well">
                      vs {cats.genre_comparison.label}
                    </span>
                  ) : null}
                </div>
              ) : null}
              {project.scores?.dimensions && project.scores.overall != null ? (
                <div className="row" style={{ marginTop: '0.65rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {Object.entries(project.scores.dimensions)
                    .filter(([, v]) => v != null)
                    .map(([k, v]) => (
                      <span key={k} className="sev" title="Scorecard dimension (guide)">
                        {k.replaceAll('_', ' ')} {v}
                      </span>
                    ))}
                </div>
              ) : null}
              {project.tone?.overall ? (
                <p className="muted" style={{ margin: '0.5rem 0 0' }}>
                  Tone: {project.tone.overall}
                  {project.formality ? ` · Formality: ${project.formality}` : ''}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="row" style={{ marginTop: '1rem' }}>
          {[
            'story',
            'plan',
            'findings',
            'compare',
            'reports',
            'chapters',
            'kdp',
            'prefs',
            'memory',
            'export',
          ].map((t) => (
            <button
              key={t}
              type="button"
              className="btn"
              style={{
                borderColor: tab === t ? 'var(--brand)' : undefined,
                fontWeight: tab === t ? 700 : 400,
              }}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {tab === 'plan' ? (
        <section className="panel">
          <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)' }}>Action plan</h3>
          <p className="muted">
            Ordered priorities after synthesis (BookReady Level 5 / AutoCrit process). Re-run full
            audit after accepting corrections to verify.
          </p>
          {project.action_plan ? (
            <div style={{ display: 'grid', gap: '0.75rem', marginTop: '0.75rem' }}>
              <p className="muted">
                Open {project.action_plan.open_count} · Blocking {project.action_plan.blocking} ·
                Score {project.action_plan.overall_score ?? '—'}
              </p>
              {(project.action_plan.steps || []).map((step) => (
                <div key={step.id} className="finding">
                  <strong>
                    {step.title} ({step.count})
                  </strong>
                  <ul className="muted" style={{ margin: '0.35rem 0 0' }}>
                    {(step.items || []).slice(0, 8).map((it) => (
                      <li key={it.id || it.title}>
                        <button
                          type="button"
                          className="btn"
                          style={{ padding: '0.2rem 0.5rem', minHeight: 32 }}
                          onClick={() => {
                            const f = (project.findings || []).find((x) => x.id === it.id)
                            if (f) jumpToFinding(f)
                          }}
                        >
                          [{it.severity}] {it.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <p className="muted" style={{ fontSize: '0.85rem' }}>
                {project.action_plan.note}
              </p>
              <button type="button" className="btn btn-primary" disabled={busy || running} onClick={runAnalyze}>
                Re-verify (run full audit again)
              </button>
            </div>
          ) : (
            <p className="muted">Run a full audit to generate the action plan.</p>
          )}
        </section>
      ) : null}

      {tab === 'story' ? (
        <section className="panel">
          <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)' }}>
            Manuscript Analysis
          </h3>
          <p className="muted">
            Five sections inspired by ProWritingAid Manuscript Analysis. Levels: Working well /
            Minor concern / Concern / Major concern. Scores are guides — do not chase 100%.
          </p>
          {project.manuscript_analysis ? (
            <div style={{ display: 'grid', gap: '0.75rem', marginTop: '0.75rem' }}>
              {['about_story', 'themes', 'plot', 'characters', 'setting'].map((key) => {
                const s = project.manuscript_analysis[key]
                if (!s) return null
                return (
                  <div key={key} className="finding">
                    <div className="row" style={{ justifyContent: 'space-between' }}>
                      <strong>{s.label}</strong>
                      <span className={`sev sev-${s.level || 'working_well'}`}>
                        {(s.level || 'working_well').replaceAll('_', ' ')}
                      </span>
                    </div>
                    <p className="muted">{s.summary}</p>
                    {s.competitive_landscape ? (
                      <p className="muted" style={{ fontSize: '0.9rem' }}>
                        Competitive landscape: {s.competitive_landscape}
                      </p>
                    ) : null}
                    {(s.items || []).length ? (
                      <ul className="muted">
                        {s.items.map((it) => (
                          <li key={it}>{it}</li>
                        ))}
                      </ul>
                    ) : null}
                    {(s.text_locations || []).length ? (
                      <div style={{ marginTop: '0.5rem' }}>
                        <p className="muted" style={{ margin: '0 0 0.35rem', fontSize: '0.85rem' }}>
                          Text locations (jump):
                        </p>
                        <div className="row" style={{ gap: '0.35rem', flexWrap: 'wrap' }}>
                          {s.text_locations.map((loc, i) => (
                            <button
                              key={`${loc.preview}-${i}`}
                              type="button"
                              className="btn"
                              style={{ fontSize: '0.8rem' }}
                              title={loc.title || loc.preview}
                              onClick={() => {
                                if (loc.finding_id) {
                                  const f = (project.findings || []).find((x) => x.id === loc.finding_id)
                                  if (f) jumpToFinding(f)
                                  else {
                                    setHighlightExcerpt(loc.excerpt || loc.preview)
                                    setTab('findings')
                                  }
                                } else {
                                  setHighlightExcerpt(loc.excerpt || loc.preview)
                                  setTab('findings')
                                }
                              }}
                            >
                              Loc: {(loc.preview || '').slice(0, 42)}
                              {(loc.preview || '').length > 42 ? '…' : ''}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="muted">Run a full audit to generate Manuscript Analysis sections.</p>
          )}
        </section>
      ) : null}

      {tab === 'export' ? (
        <section className="panel">
          <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)' }}>Exports</h3>
          <p className="muted">
            KDP accepts different files for ebook vs print. Set trim / margins / bleed under the{' '}
            <button type="button" className="btn" style={{ padding: '0.15rem 0.5rem' }} onClick={() => setTab('kdp')}>
              kdp
            </button>{' '}
            tab before print PDF. Not affiliated with Amazon — always validate in Kindle Previewer /
            Print Previewer.
          </p>

          <h4 style={{ marginBottom: '0.35rem', fontFamily: 'var(--font-display)' }}>
            Print (paperback / hardcover) — fixed page size
          </h4>
          <p className="muted" style={{ marginTop: 0 }}>
            Highest quality for print: PDF at your trim size with mirror margins
            {project.print_config?.trim_size_in
              ? ` (trim ${project.print_config.trim_size_in}`
              : ' (default trim 6×9'}
            {project.print_config?.bleed ? ', bleed on' : ''}
            ). Prefer this over reflowable formats for text/design fidelity on paper.
          </p>
          <div className="row" style={{ marginBottom: '1rem' }}>
            <button type="button" className="btn btn-primary" onClick={() => download('pdf')}>
              Print PDF (KDP interior)
            </button>
            <button type="button" className="btn" onClick={() => download('docx')}>
              DOCX (Word → embed fonts → PDF)
            </button>
          </div>

          <h4 style={{ marginBottom: '0.35rem', fontFamily: 'var(--font-display)' }}>
            Kindle ebook — reflowable
          </h4>
          <p className="muted" style={{ marginTop: 0 }}>
            Upload DOCX or EPUB to KDP, or open DOCX in Kindle Create to build KPF. MOBI fixed-layout
            is no longer accepted (March 2025).
          </p>
          <div className="row" style={{ marginBottom: '1rem' }}>
            <button type="button" className="btn btn-primary" onClick={() => download('docx')}>
              DOCX (Kindle / Create)
            </button>
            <button type="button" className="btn" onClick={() => download('epub')}>
              EPUB
            </button>
            <button type="button" className="btn" onClick={() => download('html')}>
              HTML
            </button>
            <button type="button" className="btn" onClick={() => download('txt')}>
              TXT
            </button>
            <button type="button" className="btn" onClick={() => download('rtf')}>
              RTF
            </button>
          </div>
          <p className="muted" style={{ fontSize: '0.85rem', marginTop: '-0.5rem' }}>
            KPF is produced inside Amazon Kindle Create — ProofForge cannot emit KPF directly. MOBI
            fixed-layout ended March 2025. PDF-as-ebook only for limited languages — prefer
            DOCX/EPUB/KPF. RTF is accepted by KDP but DOCX/EPUB are preferred.
          </p>

          {kdpChecklist ? (
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ marginBottom: '0.35rem', fontFamily: 'var(--font-display)' }}>
                KDP upload checklist
              </h4>
              <p className="muted" style={{ marginTop: 0 }}>
                {kdpChecklist.disclaimer}
              </p>
              <ul style={{ margin: '0.5rem 0', paddingLeft: '1.2rem' }}>
                {(kdpChecklist.items || []).map((it) => (
                  <li key={it.id} className="muted" style={{ marginBottom: '0.35rem' }}>
                    <span style={{ color: it.done ? 'var(--brand)' : undefined }}>
                      {it.done ? '[x]' : '[ ]'}
                    </span>{' '}
                    {it.label}
                    {it.link ? (
                      <>
                        {' '}
                        <a href={it.link} target="_blank" rel="noopener noreferrer">
                          source
                        </a>
                      </>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <h4 style={{ marginBottom: '0.35rem', fontFamily: 'var(--font-display)' }}>
            Editorial reports
          </h4>
          <div className="row">
            <button type="button" className="btn" onClick={() => download('pdf-report')}>
              Audit PDF report
            </button>
            <button type="button" className="btn" onClick={() => download('json')}>
              JSON report
            </button>
            <button type="button" className="btn" onClick={() => download('csv')}>
              CSV findings
            </button>
            <button type="button" className="btn" onClick={() => download('md')}>
              Markdown report
            </button>
            <button type="button" className="btn" onClick={() => download('manuscript')}>
              Corrected manuscript (.md)
            </button>
          </div>
          <p className="muted" style={{ marginTop: '0.75rem' }}>
            Print PDF uses Times Roman at your configured trim. For custom commercial fonts: export
            DOCX → Word (File → Options → Save → Embed fonts) → Save as PDF, then upload that PDF to
            KDP.
          </p>
        </section>
      ) : null}

      {tab === 'compare' ? (
        <section className="panel">
          <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)' }}>
            Side-by-side correction
          </h3>
          <p className="muted">
            Original excerpt vs suggested rewrite. Accept applies to the manuscript; Undo restores a
            snapshot.
          </p>
          {(project.disagreements || []).length ? (
            <div className="finding" style={{ marginBottom: '1rem' }}>
              <strong>Model disagreements</strong>
              <pre className="mono muted">
                {JSON.stringify(project.disagreements, null, 2)}
              </pre>
            </div>
          ) : null}
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {(project.findings || [])
              .filter((f) => !f.resolution || f.resolution === 'open')
              .slice(0, 40)
              .map((f) => (
                <div key={f.id} className="finding">
                  <div className="row" style={{ justifyContent: 'space-between' }}>
                    <span className={`sev sev-${f.severity}`}>{f.severity}</span>
                    <span className="muted">{f.category}</span>
                  </div>
                  <strong>{f.title}</strong>
                  <p className="muted">{f.explanation}</p>
                  <div className="grid-2" style={{ marginTop: '0.5rem' }}>
                    <div>
                      <div className="muted">Original</div>
                      <div className="mono">{f.original_excerpt}</div>
                    </div>
                    <div>
                      <div className="muted">Suggested</div>
                      <div className="mono">{f.suggested_correction || '—'}</div>
                    </div>
                  </div>
                  {(f.alternatives || []).length ? (
                    <div style={{ marginTop: '0.5rem' }}>
                      <div className="muted">Alternatives</div>
                      <div className="row" style={{ marginTop: '0.35rem' }}>
                        {f.alternatives.map((alt) => (
                          <button
                            key={alt}
                            type="button"
                            className="btn"
                            disabled={busy}
                            onClick={async () => {
                              setBusy(true)
                              try {
                                const { project: p } = await pfApi.resolveFinding(projectId, f.id, {
                                  action: 'edit',
                                  edited_text: alt,
                                })
                                setProject(p)
                              } catch (e) {
                                onError?.(e.message)
                              } finally {
                                setBusy(false)
                              }
                            }}
                          >
                            Use: {String(alt).slice(0, 60)}
                            {String(alt).length > 60 ? '…' : ''}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <div className="row" style={{ marginTop: '0.65rem' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={busy || !f.suggested_correction}
                      onClick={async () => {
                        setBusy(true)
                        try {
                          const { project: p } = await pfApi.resolveFinding(projectId, f.id, {
                            action: 'accept',
                          })
                          setProject(p)
                        } catch (e) {
                          onError?.(e.message)
                        } finally {
                          setBusy(false)
                        }
                      }}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      className="btn"
                      disabled={busy}
                      onClick={async () => {
                        setBusy(true)
                        try {
                          const { project: p } = await pfApi.resolveFinding(projectId, f.id, {
                            action: 'reject',
                          })
                          setProject(p)
                        } catch (e) {
                          onError?.(e.message)
                        } finally {
                          setBusy(false)
                        }
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      ) : null}

      {tab === 'chapters' ? (
        <section className="panel">
          <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)' }}>
            Chapter critiques
          </h3>
          <p className="muted">
            Per-section diagnostic critique (ProWritingAid Manuscript Analysis style). Not a formula.
          </p>
          {(project.chapter_critiques || []).length === 0 ? (
            <p className="muted">Run a full audit to generate chapter critiques.</p>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {project.chapter_critiques.map((c) => (
                <div key={c.section_key} className="finding">
                  <strong>{c.title || c.section_key}</strong>
                  <p className="muted">{c.chapter_summary}</p>
                  <p className="muted" style={{ fontSize: '0.9rem' }}>
                    Purpose: {c.purpose || '—'} · Stakes: {c.tension_or_stakes || '—'}
                  </p>
                  <p className="muted" style={{ fontSize: '0.9rem' }}>
                    Hook: {c.opening_hook || '—'} · Ending: {c.ending_drive || '—'}
                  </p>
                  {c.pacing_note ? <p className="muted">{c.pacing_note}</p> : null}
                </div>
              ))}
            </div>
          )}
          {project.word_gate ? (
            <div className="finding" style={{ marginTop: '1rem' }}>
              <strong>Word-count gate</strong>
              <p className="muted">
                {project.word_gate.word_count} words · {project.word_gate.status}
              </p>
              {(project.word_gate.notes || []).map((n) => (
                <p key={n} className="muted" style={{ fontSize: '0.9rem' }}>
                  {n}
                </p>
              ))}
            </div>
          ) : null}
          {project.plagiarism ? (
            <div className="finding" style={{ marginTop: '1rem' }}>
              <strong>Similarity / plagiarism</strong>
              <pre className="mono muted">{JSON.stringify(project.plagiarism, null, 2)}</pre>
            </div>
          ) : null}
          {project.translation ? (
            <div className="finding" style={{ marginTop: '1rem' }}>
              <strong>Translation mode</strong>
              <pre className="mono muted">{JSON.stringify(project.translation, null, 2)}</pre>
            </div>
          ) : null}
        </section>
      ) : null}

      {tab === 'reports' ? (
        <section className="panel">
          <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)' }}>Reports catalog</h3>
          <p className="muted">
            Summary hub + Style / Grammar / Overused / Sticky / Sentence Structure / Readability /
            Dialogue (PWA Reports index — original engines).
          </p>
          <div className="row" style={{ marginTop: '0.5rem' }}>
            {[
              'summary',
              'style',
              'grammar',
              'overused',
              'sticky',
              'sentence_structure',
              'readability',
              'dialogue',
            ].map((r) => (
              <button
                key={r}
                type="button"
                className={`editing-step${reportPane === r ? ' active' : ''}`}
                onClick={() => setReportPane(r)}
              >
                {r.replaceAll('_', ' ')}
              </button>
            ))}
          </div>

          {!project.style_reports ? (
            <p className="muted" style={{ marginTop: '1rem' }}>
              Run a full audit to generate reports.
            </p>
          ) : null}

          {project.style_reports && reportPane === 'summary' ? (
            <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
              <p className="muted">{project.style_reports.summary_report?.note}</p>
              <div>
                <strong>Looks great</strong>
                <div className="row" style={{ marginTop: '0.35rem' }}>
                  {(project.style_reports.summary_report?.looks_great || []).length ? (
                    project.style_reports.summary_report.looks_great.map((a) => (
                      <span key={a.id} className="sev sev-working_well">
                        {a.label} {a.score}
                      </span>
                    ))
                  ) : (
                    <span className="muted">None yet above 75</span>
                  )}
                </div>
              </div>
              <div>
                <strong>May need work</strong>
                <div className="row" style={{ marginTop: '0.35rem' }}>
                  {(project.style_reports.summary_report?.needs_work || []).length ? (
                    project.style_reports.summary_report.needs_work.map((a) => (
                      <span key={a.id} className="sev sev-concern">
                        {a.label} {a.score}
                      </span>
                    ))
                  ) : (
                    <span className="muted">No category below 65</span>
                  )}
                </div>
              </div>
              <div className="row">
                {(project.style_reports.summary_report?.key_scores || []).map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    className="btn"
                    onClick={() =>
                      setReportPane(
                        a.id === 'pacing'
                          ? 'summary'
                          : a.id === 'dialogue'
                            ? 'dialogue'
                            : a.id === 'repetition'
                              ? 'overused'
                              : 'style'
                      )
                    }
                  >
                    {a.label}: {a.score}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {project.style_reports && reportPane === 'grammar' ? (
            <pre className="mono muted" style={{ marginTop: '1rem', maxHeight: '50vh', overflow: 'auto' }}>
              {JSON.stringify(project.style_reports.grammar_report, null, 2)}
            </pre>
          ) : null}
          {project.style_reports && reportPane === 'overused' ? (
            <pre className="mono muted" style={{ marginTop: '1rem', maxHeight: '50vh', overflow: 'auto' }}>
              {JSON.stringify(project.style_reports.overused_words, null, 2)}
            </pre>
          ) : null}
          {project.style_reports && reportPane === 'sticky' ? (
            <pre className="mono muted" style={{ marginTop: '1rem', maxHeight: '50vh', overflow: 'auto' }}>
              {JSON.stringify(project.style_reports.manuscript?.sticky?.slice(0, 20), null, 2)}
            </pre>
          ) : null}
          {project.style_reports && reportPane === 'sentence_structure' ? (
            <pre className="mono muted" style={{ marginTop: '1rem', maxHeight: '50vh', overflow: 'auto' }}>
              {JSON.stringify(project.style_reports.sentence_structure, null, 2)}
            </pre>
          ) : null}
          {project.style_reports && reportPane === 'readability' ? (
            <pre className="mono muted" style={{ marginTop: '1rem', maxHeight: '50vh', overflow: 'auto' }}>
              {JSON.stringify(
                {
                  flesch: project.style_reports.manuscript?.readability,
                  bands: project.style_reports.readability_bands,
                },
                null,
                2
              )}
            </pre>
          ) : null}
          {project.style_reports && reportPane === 'dialogue' ? (
            <div style={{ marginTop: '1rem' }}>
              <label className="row" style={{ gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={showDialogue}
                  onChange={(e) => setShowDialogue(e.target.checked)}
                />
                Highlight dialogue in manuscript (AutoCrit dialogue toggle)
              </label>
              <pre className="mono muted" style={{ maxHeight: '40vh', overflow: 'auto' }}>
                {JSON.stringify(
                  {
                    ...project.style_reports.manuscript?.dialogue,
                    genre_expected:
                      project.style_reports.category_scores?.genre_comparison?.expected_dialogue_ratio,
                    score: project.style_reports.category_scores?.dialogue,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          ) : null}
          {project.style_reports && reportPane === 'style' ? (
            <pre className="mono muted" style={{ marginTop: '1rem', maxHeight: '60vh', overflow: 'auto' }}>
              {JSON.stringify(
                {
                  readability: project.style_reports.manuscript.readability,
                  sentence_length: project.style_reports.manuscript.sentence_length,
                  pacing: project.style_reports.manuscript.pacing,
                  emotion_tells: project.style_reports.manuscript.emotion_tells?.slice(0, 8),
                  hidden_verbs: project.style_reports.manuscript.hidden_verbs?.slice(0, 8),
                  cliches: project.style_reports.manuscript.cliches,
                  adverbs: project.style_reports.manuscript.adverbs?.slice(0, 8),
                  filler: project.style_reports.manuscript.filler?.slice(0, 8),
                  passive: project.style_reports.manuscript.passive,
                  category_scores: project.style_reports.category_scores,
                },
                null,
                2
              )}
            </pre>
          ) : null}
        </section>
      ) : null}

      {tab === 'kdp' ? (
        <section className="panel">
          <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)' }}>KDP compliance</h3>
          <p className="muted">{project.kdp?.disclaimer}</p>
          <p className="muted">
            Rules version {project.kdp?.rules_version || '—'} · Est. pages{' '}
            {project.kdp?.estimated_pages ?? '—'}
          </p>
          <div style={{ display: 'grid', gap: '0.55rem', marginTop: '0.75rem' }}>
            {(project.kdp?.results || []).map((r) => (
              <div key={r.rule_id} className="finding">
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <strong>{r.title}</strong>
                  <span className={`sev sev-${r.status === 'fail' ? 'critical' : 'minor'}`}>
                    {r.status}
                  </span>
                </div>
                <p className="muted" style={{ margin: '0.35rem 0 0' }}>
                  {r.detail}
                </p>
                <p className="muted" style={{ margin: '0.25rem 0 0', fontSize: '0.8rem' }}>
                  <a href={r.source_url} target="_blank" rel="noopener noreferrer">
                    Source
                  </a>{' '}
                  · retrieved {r.retrieved}
                </p>
              </div>
            ))}
            {!project.kdp ? <p className="muted">Run a full audit (set publishing target + print_config as needed).</p> : null}
          </div>
          <button
            type="button"
            className="btn"
            style={{ marginTop: '0.75rem' }}
            onClick={async () => {
              try {
                const rules = await pfApi.kdpRulesAdmin()
                onError?.('')
                // eslint-disable-next-line no-alert
                window.alert(
                  `KDP rules ${rules.version}: ${rules.rules?.length || 0} rules. Edit packages/shared/src/kdpRules.js to change.`
                )
              } catch (e) {
                onError?.(e.message)
              }
            }}
          >
            View admin rules catalog
          </button>
          <div className="row" style={{ marginTop: '1rem' }}>
            <div className="field">
              <label>Trim size (in)</label>
              <input
                placeholder="6x9"
                defaultValue={project.print_config?.trim_size_in || ''}
                onBlur={async (e) => {
                  const { project: p } = await pfApi.patchProject(projectId, {
                    print_config: { trim_size_in: e.target.value || null },
                  })
                  setProject(p)
                }}
              />
            </div>
            <div className="field">
              <label>Outside margin (in)</label>
              <input
                type="number"
                step="0.125"
                defaultValue={project.print_config?.outside_margin_in ?? ''}
                onBlur={async (e) => {
                  const v = e.target.value === '' ? null : Number(e.target.value)
                  const { project: p } = await pfApi.patchProject(projectId, {
                    print_config: { outside_margin_in: v },
                  })
                  setProject(p)
                }}
              />
            </div>
            <div className="field">
              <label>Gutter (in)</label>
              <input
                type="number"
                step="0.125"
                defaultValue={project.print_config?.gutter_in ?? ''}
                onBlur={async (e) => {
                  const v = e.target.value === '' ? null : Number(e.target.value)
                  const { project: p } = await pfApi.patchProject(projectId, {
                    print_config: { gutter_in: v },
                  })
                  setProject(p)
                }}
              />
            </div>
            <label className="row" style={{ alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                checked={Boolean(project.print_config?.bleed)}
                onChange={async (e) => {
                  const { project: p } = await pfApi.patchProject(projectId, {
                    print_config: { bleed: e.target.checked },
                  })
                  setProject(p)
                }}
              />
              Interior bleed (0.125″ — if any image reaches the edge)
            </label>
          </div>
        </section>
      ) : null}

      {tab === 'prefs' ? (
        <section className="panel">
          <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)' }}>
            Writing preferences
          </h3>
          <p className="muted">
            Toggle suggestion categories (Grammarly-style). Document domains adjust style strictness.
            Genre comparison nudges AutoCrit-style category scores. Fine-tune goals steer Manuscript
            Analysis (PWA).
          </p>
          <div className="field" style={{ marginTop: '0.75rem' }}>
            <label>Document domain</label>
            <select
              value={project.document_domain || 'general'}
              onChange={async (e) => {
                const { project: p } = await pfApi.patchProject(projectId, {
                  document_domain: e.target.value,
                })
                setProject(p)
              }}
              style={selectStyle}
            >
              {['general', 'academic', 'business', 'creative', 'casual', 'email'].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Formality</label>
            <select
              value={project.formality || 'neutral'}
              onChange={async (e) => {
                const { project: p } = await pfApi.patchProject(projectId, {
                  formality: e.target.value,
                })
                setProject(p)
              }}
              style={selectStyle}
            >
              {['casual', 'neutral', 'formal'].map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Reading level (optional)</label>
            <input
              defaultValue={project.reading_level || ''}
              placeholder="e.g. adult, YA, middle grade"
              onBlur={async (e) => {
                const { project: p } = await pfApi.patchProject(projectId, {
                  reading_level: e.target.value,
                })
                setProject(p)
              }}
            />
          </div>
          <div className="field">
            <label>Character list (comma-separated)</label>
            <input
              defaultValue={(project.character_list || []).join(', ')}
              placeholder="Ada, Malik, …"
              onBlur={async (e) => {
                const list = e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
                const { project: p } = await pfApi.patchProject(projectId, {
                  character_list: list,
                })
                setProject(p)
              }}
            />
          </div>
          <div className="field">
            <label>Glossary preferred terms (comma-separated)</label>
            <input
              defaultValue={(project.glossary || [])
                .map((g) => (typeof g === 'string' ? g : g.preferred || g.term))
                .join(', ')}
              placeholder="preferred spellings / terms"
              onBlur={async (e) => {
                const glossary = e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((term) => ({ term, preferred: term, aliases: [] }))
                const { project: p } = await pfApi.patchProject(projectId, { glossary })
                setProject(p)
              }}
            />
          </div>
          <div className="field">
            <label>Translation glossary (comma-separated preferred terms)</label>
            <input
              defaultValue={(project.translation_glossary || [])
                .map((g) => (typeof g === 'string' ? g : g.preferred || g.term))
                .join(', ')}
              placeholder="Bilingual / localization preferred spellings"
              onBlur={async (e) => {
                const translation_glossary = e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((term) => ({ term, preferred: term, aliases: [] }))
                const { project: p } = await pfApi.patchProject(projectId, {
                  translation_glossary,
                })
                setProject(p)
              }}
            />
          </div>
          {project.translation_mode ? (
            <div className="field">
              <label>Source language (translation)</label>
              <input
                defaultValue={project.source_language || ''}
                placeholder="e.g. de, fr, es"
                onBlur={async (e) => {
                  const { project: p } = await pfApi.patchProject(projectId, {
                    source_language: e.target.value,
                  })
                  setProject(p)
                }}
              />
            </div>
          ) : null}
          <div className="field">
            <label>Author / pen name</label>
            <input
              defaultValue={project.author_name || ''}
              onBlur={async (e) => {
                const { project: p } = await pfApi.patchProject(projectId, {
                  author_name: e.target.value,
                })
                setProject(p)
              }}
            />
          </div>
          <div className="field">
            <label>Subtitle</label>
            <input
              defaultValue={project.subtitle || ''}
              onBlur={async (e) => {
                const { project: p } = await pfApi.patchProject(projectId, {
                  subtitle: e.target.value,
                })
                setProject(p)
              }}
            />
          </div>
          <div className="field">
            <label>Intended tone</label>
            <input
              defaultValue={project.intended_tone || ''}
              placeholder="e.g. warm, urgent, wry"
              onBlur={async (e) => {
                const { project: p } = await pfApi.patchProject(projectId, {
                  intended_tone: e.target.value,
                })
                setProject(p)
              }}
            />
          </div>
          <div className="field">
            <label>Style guide (prefer X not Y / never use Z)</label>
            <textarea
              rows={3}
              defaultValue={project.style_guide || ''}
              placeholder={'prefer color not colour\nnever use suddenly'}
              onBlur={async (e) => {
                const { project: p } = await pfApi.patchProject(projectId, {
                  style_guide: e.target.value,
                })
                setProject(p)
              }}
              style={{ width: '100%', fontFamily: 'inherit' }}
            />
          </div>
          <div className="field">
            <label>Genre comparison</label>
            <select
              value={project.genre_comparison || 'general_fiction'}
              onChange={async (e) => {
                const { project: p } = await pfApi.patchProject(projectId, {
                  genre_comparison: e.target.value,
                })
                setProject(p)
              }}
              style={selectStyle}
            >
              {[
                'general_fiction',
                'romance',
                'thriller',
                'literary',
                'fantasy',
                'mystery',
                'nonfiction',
                'memoir',
                'self_help',
              ].map((g) => (
                <option key={g} value={g}>
                  {g.replaceAll('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Fine-tune goals / concerns</label>
            <textarea
              defaultValue={project.author_goals || ''}
              placeholder="e.g. Strengthen antagonist; check first-chapter pace; keep dialect intentional"
              rows={3}
              onBlur={async (e) => {
                const { project: p } = await pfApi.patchProject(projectId, {
                  author_goals: e.target.value,
                })
                setProject(p)
              }}
            />
          </div>
          <label className="row" style={{ marginTop: '0.75rem', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={!!project.translation_mode}
              onChange={async (e) => {
                const { project: p } = await pfApi.patchProject(projectId, {
                  translation_mode: e.target.checked,
                })
                setProject(p)
              }}
            />
            Translation mode
          </label>
          <label className="row" style={{ gap: '0.5rem', alignItems: 'flex-start' }}>
            <input
              type="checkbox"
              checked={!!project.plagiarism_consent}
              onChange={async (e) => {
                const { project: p } = await pfApi.patchProject(projectId, {
                  plagiarism_consent: e.target.checked,
                })
                setProject(p)
              }}
            />
            <span>
              Consent to external plagiarism scan on next audit (requires configured provider)
            </span>
          </label>
          <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.75rem' }}>
            {Object.entries(project.preferences || {}).map(([key, on]) => (
              <label key={key} className="row" style={{ justifyContent: 'space-between' }}>
                <span>{key}</span>
                <input
                  type="checkbox"
                  checked={!!on}
                  onChange={async (e) => {
                    const { project: p } = await pfApi.patchProject(projectId, {
                      preferences: { [key]: e.target.checked },
                    })
                    setProject(p)
                  }}
                />
              </label>
            ))}
          </div>
        </section>
      ) : null}

      {tab === 'memory' ? (
        <section className="panel">
          <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)' }}>Project memory</h3>
          <p className="muted">Stored from fiction/nonfiction passes — not model chat memory.</p>
          <pre className="mono muted">{JSON.stringify(project.memory || {}, null, 2)}</pre>
          {project.last_analysis?.coverage ? (
            <>
              <h4>Coverage</h4>
              <pre className="mono muted">
                {JSON.stringify(project.last_analysis.coverage, null, 2)}
              </pre>
            </>
          ) : null}
          <h4>Author decisions</h4>
          <p className="muted" style={{ marginTop: 0 }}>
            Accept / reject / ignore history (also in JSON &amp; Markdown exports).
          </p>
          {(project.author_decisions || []).length === 0 ? (
            <p className="muted">No decisions yet.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
              {(project.author_decisions || []).slice(-40).reverse().map((d, i) => (
                <li key={`${d.finding_id}-${d.at}-${i}`} className="muted" style={{ marginBottom: '0.35rem' }}>
                  <strong>{d.action}</strong>
                  {d.title ? ` — ${d.title}` : ''}
                  {d.category ? ` (${d.category})` : ''}
                  {d.at ? (
                    <span style={{ fontSize: '0.85rem' }}> · {new Date(d.at).toLocaleString()}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {tab === 'findings' ? (
        <div className="grid-2">
          <section className="panel">
            <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)' }}>Manuscript</h3>
            <p className="muted" style={{ fontSize: '0.85rem' }}>
              Click Jump on a finding to highlight its text location (PWA Text Location).
            </p>
            <div
              ref={manuscriptRef}
              style={{ maxHeight: '70vh', overflow: 'auto', display: 'grid', gap: '1rem' }}
            >
              {sections.map((s) => (
                <article key={s.key} id={`section-${s.key}`}>
                  <h4 style={{ margin: '0 0 0.35rem' }}>{s.title}</h4>
                  <div className="mono muted">{renderSectionText(s.content_md)}</div>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)' }}>Findings</h3>
              <div className="row">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={selectStyle}
                >
                  <option value="open">Open</option>
                  <option value="all">All</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="intentional">Intentional</option>
                </select>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={selectStyle}
                >
                  <option value="all">All categories</option>
                  {[
                    'grammar',
                    'localization',
                    'repetition',
                    'style',
                    'structure',
                    'consistency',
                    'naturalness',
                    'kdp_technical',
                    'kdp_policy',
                  ].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row" style={{ marginTop: '0.65rem' }}>
              {EDIT_STEPS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`editing-step${editStep === s.id ? ' active' : ''}`}
                  onClick={() => setEditStep(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <p className="muted" style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}>
              AutoCrit editing order: dialogue → repetition → summary → easy wins.
            </p>
            <div style={{ marginTop: '0.75rem', maxHeight: '70vh', overflow: 'auto' }}>
              {findings.length === 0 ? (
                <p className="muted">No findings in this filter — run a full audit.</p>
              ) : (
                findings.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="finding"
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      borderColor: selected?.id === f.id ? 'var(--brand)' : undefined,
                      marginBottom: '0.55rem',
                    }}
                    onClick={() => jumpToFinding(f)}
                  >
                    <div className="row" style={{ justifyContent: 'space-between' }}>
                      <span className={`sev sev-${f.feedback_level || f.severity}`}>
                        {(f.feedback_level || f.severity || '').replaceAll('_', ' ')}
                      </span>
                      <span className="muted" style={{ fontSize: '0.8rem' }}>
                        {f.category}/{f.subcategory || '—'} · {f.resolution || 'open'}
                      </span>
                    </div>
                    <strong style={{ display: 'block', marginTop: '0.35rem' }}>{f.title}</strong>
                    <p className="muted" style={{ margin: '0.35rem 0 0', fontSize: '0.92rem' }}>
                      {f.explanation}
                    </p>
                    <p className="mono" style={{ margin: '0.5rem 0 0' }}>
                      “{f.original_excerpt}”
                    </p>
                    <span className="muted" style={{ fontSize: '0.75rem' }}>
                      ↪ Jump to text
                    </span>
                    {f.suggested_correction ? (
                      <p style={{ margin: '0.35rem 0 0' }}>
                        → <em>{f.suggested_correction}</em>
                      </p>
                    ) : null}
                    {selected?.id === f.id && (!f.resolution || f.resolution === 'open') ? (
                      <div className="row" style={{ marginTop: '0.75rem' }}>
                        <button
                          type="button"
                          className="btn btn-primary"
                          disabled={busy || !f.suggested_correction}
                          onClick={(e) => {
                            e.stopPropagation()
                            resolve('accept')
                          }}
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          className="btn"
                          disabled={busy}
                          onClick={(e) => {
                            e.stopPropagation()
                            resolve('reject')
                          }}
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          className="btn"
                          disabled={busy}
                          onClick={(e) => {
                            e.stopPropagation()
                            resolve('intentional')
                          }}
                        >
                          Mark intentional
                        </button>
                        <button
                          type="button"
                          className="btn"
                          disabled={busy}
                          onClick={(e) => {
                            e.stopPropagation()
                            resolve('agree')
                          }}
                        >
                          Agree
                        </button>
                        <button
                          type="button"
                          className="btn"
                          disabled={busy}
                          onClick={(e) => {
                            e.stopPropagation()
                            resolve('disagree')
                          }}
                        >
                          Disagree
                        </button>
                        <button
                          type="button"
                          className="btn"
                          disabled={busy}
                          onClick={(e) => {
                            e.stopPropagation()
                            resolve('ignore')
                          }}
                        >
                          Ignore
                        </button>
                        <button
                          type="button"
                          className="btn"
                          disabled={busy}
                          onClick={(e) => {
                            e.stopPropagation()
                            resolve('defer')
                          }}
                        >
                          Defer
                        </button>
                        {f.category === 'spelling' ? (
                          <button
                            type="button"
                            className="btn"
                            disabled={busy}
                            onClick={(e) => {
                              e.stopPropagation()
                              resolve('add_to_dictionary')
                            }}
                          >
                            Add to dictionary
                          </button>
                        ) : null}
                      </div>
                    ) : null}
                    {f.author_feedback ? (
                      <p className="muted" style={{ margin: '0.35rem 0 0', fontSize: '0.8rem' }}>
                        Feedback: {f.author_feedback}
                      </p>
                    ) : null}
                  </button>
                ))
              )}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}

const selectStyle = {
  background: 'var(--bg)',
  color: 'inherit',
  border: '1px solid var(--line)',
  borderRadius: 8,
  padding: '0.4rem 0.6rem',
}
