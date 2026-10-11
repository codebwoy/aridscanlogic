import { useCallback, useEffect, useMemo, useState } from 'react'
import { BookOpen, Coins, RefreshCw, Sparkles } from 'lucide-react'
import { WIZARD_STEPS, t, costFor } from '@authorforge/shared'
import {
  createBook,
  ensureSession,
  getBook,
  getCoverage,
  getExportGate,
  getMe,
  getSpecs,
  grantDevCredits,
  listBooks,
  lockBible,
  patchBook,
  saveCompliance,
  saveSection,
  fillStorySlot,
  updateClaim,
  stepBook,
  submitJob,
  waitJob,
  getAdminStats,
} from '../lib/api'
import BookEditor from '../components/BookEditor'

export default function Studio({ lang = 'en' }) {
  const [ready, setReady] = useState(false)
  const [credits, setCredits] = useState(0)
  const [specs, setSpecs] = useState(null)
  const [books, setBooks] = useState([])
  const [book, setBook] = useState(null)
  const [busy, setBusy] = useState('')
  const [message, setMessage] = useState('')
  const [assist, setAssist] = useState('Ask for title ideas, positioning, or outline tweaks. I write into fields — you stay editor-in-chief.')
  const [sectionKey, setSectionKey] = useState('')
  const [editorText, setEditorText] = useState('')
  const [coverage, setCoverage] = useState(null)
  const [gate, setGate] = useState(null)
  const [admin, setAdmin] = useState(null)

  const step = book?.wizard_step || 'basics'
  const stepMeta = WIZARD_STEPS.find((s) => s.id === step) || WIZARD_STEPS[2]

  const refreshMe = useCallback(async () => {
    const me = await getMe()
    setCredits(me.credits)
  }, [])

  const loadBook = useCallback(async (id) => {
    const { book: b } = await getBook(id)
    setBook(b)
    const keys = Object.keys(b.sections || {})
    if (keys.length) {
      setSectionKey((prev) => prev || keys[0])
      setEditorText(b.sections[keys[0]]?.content_md || '')
    }
    try {
      setCoverage((await getCoverage(id)).coverage)
    } catch {
      setCoverage(null)
    }
    try {
      setGate(await getExportGate(id))
    } catch {
      setGate(null)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await ensureSession()
        if (cancelled) return
        const [me, sp, list] = await Promise.all([getMe(), getSpecs(), listBooks()])
        if (cancelled) return
        setCredits(me.credits)
        setSpecs(sp)
        setBooks(list.books || [])
        if (list.books?.[0]) await loadBook(list.books[0].id)
        setReady(true)
      } catch (e) {
        setMessage(e.message || 'Failed to start session')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [loadBook])

  useEffect(() => {
    if (!book || !sectionKey) return
    setEditorText(book.sections?.[sectionKey]?.content_md || '')
  }, [book, sectionKey])

  async function runJob(type, inputs = {}) {
    if (!book && !['niche_search'].includes(type)) {
      setMessage('Create a book first')
      return null
    }
    setBusy(type)
    setMessage(`Running ${type} (${costFor(type) ?? 0} credits)…`)
    try {
      const { job } = await submitJob(type, book?.id, inputs)
      const done = await waitJob(job.id)
      if (done.status === 'failed') throw new Error(done.error || 'Job failed')
      await refreshMe()
      if (book?.id) await loadBook(book.id)
      setMessage(`${type} completed`)
      setAssist(JSON.stringify(done.outputs, null, 2).slice(0, 1800))
      return done.outputs
    } catch (e) {
      setMessage(e.message)
      return null
    } finally {
      setBusy('')
    }
  }

  async function onNewBook() {
    setBusy('create')
    try {
      const { book: b } = await createBook({
        working_title: 'Untitled non-fiction',
        language: lang === 'de' ? 'de' : 'en',
        wizard_step: 'basics',
      })
      setBooks((prev) => [{ id: b.id, working_title: b.working_title, wizard_step: b.wizard_step }, ...prev])
      setBook(b)
      setMessage('Book created')
    } catch (e) {
      setMessage(e.message)
    } finally {
      setBusy('')
    }
  }

  async function saveBasics(patch) {
    if (!book) return
    const { book: b } = await patchBook(book.id, patch)
    setBook(b)
    setMessage('Saved')
  }

  const leafNodes = useMemo(() => flattenLeaves(book?.outline?.chapters || []), [book])

  if (!ready && !message) {
    return (
      <div className="gate">
        <p className="muted">Starting AuthorForge session…</p>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <aside className="rail">
        <div className="brand">{t(lang, 'appName')}</div>
        <p className="muted" style={{ marginTop: '0.35rem' }}>
          {t(lang, 'tagline')}
        </p>
        <button type="button" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={onNewBook} disabled={!!busy}>
          {t(lang, 'newBook')}
        </button>
        <div style={{ marginTop: '1rem' }}>
          {(books || []).map((b) => (
            <button
              key={b.id}
              type="button"
              className="btn"
              style={{ width: '100%', marginBottom: '0.4rem', textAlign: 'left' }}
              onClick={() => loadBook(b.id)}
            >
              {b.working_title}
            </button>
          ))}
        </div>
        <h3 style={{ marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--af-muted)' }}>Wizard</h3>
        <ul className="step-list">
          {WIZARD_STEPS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className={s.id === step ? 'active' : stepIndexDone(step, s.id) ? 'done' : ''}
                onClick={() => book && stepBook(book.id, 'set', s.id).then((r) => setBook(r.book))}
              >
                {s.number}. {s.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="row">
            <BookOpen size={18} aria-hidden />
            <strong>{book?.working_title || 'No book selected'}</strong>
            <span className="badge">{stepMeta.title}</span>
          </div>
          <div className="row">
            <span className="muted">
              <Coins size={14} style={{ verticalAlign: 'middle' }} /> {credits} {t(lang, 'credits')}
            </span>
            <span className="muted">
              {t(lang, 'costToDate')}: ${Number(book?.llm_cost_usd || 0).toFixed(3)} / €
              {specs?.book_budget_eur ?? 8}
            </span>
            <button type="button" className="btn" onClick={() => grantDevCredits().then(refreshMe)}>
              +100
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => getAdminStats().then((r) => setAdmin(r.stats))}
              title="Admin cost snapshot"
            >
              Admin
            </button>
          </div>
        </header>

        <div className="panel">
          {message ? <p className="warn">{message}</p> : null}
          {admin ? (
            <div className="card" style={{ marginBottom: '1rem' }}>
              <strong>Admin</strong>
              <pre className="muted" style={{ whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(admin, null, 2)}
              </pre>
            </div>
          ) : null}

          {!book ? (
            <div className="card">
              <p>Create a book to start the guided wizard.</p>
            </div>
          ) : (
            <WizardStep
              step={step}
              book={book}
              busy={busy}
              leafNodes={leafNodes}
              sectionKey={sectionKey}
              setSectionKey={setSectionKey}
              editorText={editorText}
              setEditorText={setEditorText}
              coverage={coverage}
              gate={gate}
              onSaveBasics={saveBasics}
              onLockBible={() => lockBible(book.id).then((r) => setBook(r.book))}
              onRunJob={runJob}
              onSaveSection={async () => {
                const r = await saveSection(book.id, sectionKey, editorText)
                setBook(r.book)
                setMessage('Section saved (human edit)')
              }}
              onFillSlot={(i, text) => fillStorySlot(book.id, i, text).then((r) => setBook(r.book))}
              onConfirmClaim={(i) => updateClaim(book.id, i, 'user_confirmed').then((r) => setBook(r.book))}
              onCompliance={(body) => saveCompliance(book.id, body).then((r) => setBook(r.book))}
              onInlineAction={async ({ instruction, selection }) => {
                const out = await runJob('inline_edit', { instruction, selection })
                return out
              }}
              onNav={async (dir) => {
                const r = await stepBook(book.id, dir)
                setBook(r.book)
              }}
              lang={lang}
            />
          )}
        </div>
      </div>

      <aside className="rail-right">
        <div className="row">
          <Sparkles size={16} color="var(--af-accent)" />
          <strong>Step assistant</strong>
        </div>
        <p className="muted" style={{ marginTop: '0.5rem' }}>
          Scoped to this step. Suggestions never invent credentials or stats.
        </p>
        <pre
          className="card"
          style={{
            marginTop: '0.75rem',
            whiteSpace: 'pre-wrap',
            fontSize: '0.75rem',
            maxHeight: '60vh',
            overflow: 'auto',
          }}
        >
          {assist}
        </pre>
        <button
          type="button"
          className="btn"
          style={{ width: '100%', marginTop: '0.75rem' }}
          disabled={!book || !!busy}
          onClick={() => runJob('title_variations', { seed: book?.working_title })}
        >
          <RefreshCw size={14} /> Suggest titles
        </button>
      </aside>
    </div>
  )
}

function stepIndexDone(current, candidate) {
  const a = WIZARD_STEPS.findIndex((s) => s.id === current)
  const b = WIZARD_STEPS.findIndex((s) => s.id === candidate)
  return b >= 0 && b < a
}

function flattenLeaves(chapters, prefix = 'c') {
  const out = []
  function walk(node, path) {
    const children = node.children || []
    if (!children.length) out.push({ key: path, node })
    else children.forEach((ch, i) => walk(ch, `${path}.${i}`))
  }
  chapters.forEach((ch, i) => walk(ch, `${prefix}${i}`))
  return out
}

function WizardStep(props) {
  const {
    step,
    book,
    busy,
    onSaveBasics,
    onNav,
    onRunJob,
    onLockBible,
    leafNodes,
    sectionKey,
    setSectionKey,
    editorText,
    setEditorText,
    onSaveSection,
    coverage,
    gate,
    onFillSlot,
    onConfirmClaim,
    onCompliance,
    onInlineAction,
  } = props

  return (
    <div>
      <div className="row" style={{ marginBottom: '1rem' }}>
        <button type="button" className="btn" onClick={() => onNav('prev')} disabled={!!busy}>
          Back
        </button>
        <button type="button" className="btn btn-primary" onClick={() => onNav('next')} disabled={!!busy}>
          Next
        </button>
      </div>

      {step === 'niche' && (
        <div className="card">
          <h2>Niche Hunter</h2>
          <p className="muted">Estimates from mock/licensed adapters only — never Amazon scrape.</p>
          <button type="button" className="btn btn-primary" disabled={!!busy} onClick={() => onRunJob('niche_search', { filters: { maxBsr: 80000 } })}>
            Search niches ({costFor('niche_search')} cr)
          </button>
        </div>
      )}

      {step === 'competitive' && (
        <div className="card">
          <h2>Competitive Advantage</h2>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!!busy}
            onClick={() => onRunJob('competitive_analysis', { topic: book.topic || book.working_title })}
          >
            Analyze angles ({costFor('competitive_analysis')} cr)
          </button>
        </div>
      )}

      {(step === 'basics' || step === 'positioning' || step === 'title_opt' || step === 'details' || step === 'bio') && (
        <div className="card">
          <h2>{step === 'basics' ? 'Book Basics' : step}</h2>
          <div className="grid-2">
            <div className="field">
              <label>Working title</label>
              <input
                defaultValue={book.working_title}
                onBlur={(e) => onSaveBasics({ working_title: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Subtitle</label>
              <input defaultValue={book.subtitle || ''} onBlur={(e) => onSaveBasics({ subtitle: e.target.value })} />
            </div>
            <div className="field">
              <label>Author name (real)</label>
              <input
                defaultValue={book.author_name || ''}
                onBlur={(e) => onSaveBasics({ author_name: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Topic</label>
              <input defaultValue={book.topic || ''} onBlur={(e) => onSaveBasics({ topic: e.target.value })} />
            </div>
            <div className="field">
              <label>Target words</label>
              <input
                type="number"
                defaultValue={book.target_words}
                onBlur={(e) => onSaveBasics({ target_words: Number(e.target.value) || 28000 })}
              />
            </div>
            <div className="field">
              <label>Trim size</label>
              <select
                defaultValue={book.trim_size}
                onChange={(e) => onSaveBasics({ trim_size: e.target.value })}
              >
                <option value="5x8">5 × 8</option>
                <option value="5.5x8.5">5.5 × 8.5</option>
                <option value="6x9">6 × 9</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>USP / what stands out</label>
            <textarea
              defaultValue={book.bible?.usp || ''}
              onBlur={(e) => onSaveBasics({ bible: { ...book.bible, usp: e.target.value } })}
            />
          </div>
          <div className="field">
            <label>Tone</label>
            <input
              defaultValue={book.bible?.tone || ''}
              onBlur={(e) => onSaveBasics({ bible: { ...book.bible, tone: e.target.value } })}
            />
          </div>
          {step === 'title_opt' && (
            <button type="button" className="btn" disabled={!!busy} onClick={() => onRunJob('title_variations')}>
              Generate title options
            </button>
          )}
        </div>
      )}

      {step === 'comps' && (
        <div className="card">
          <h2>Comparable titles (metadata only)</h2>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!!busy}
            onClick={async () => {
              const out = await onRunJob('competitive_analysis', { topic: book.topic })
              if (out?.meta?.titles) {
                await onSaveBasics({ competitors: out.meta.titles })
              }
            }}
          >
            Fetch comps
          </button>
          <ul>
            {(book.competitors || []).map((c) => (
              <li key={c.asin || c.title}>
                {c.title} — <span className="muted">est. only</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {step === 'resources' && (
        <div className="card">
          <h2>Resources</h2>
          <p className="muted">Paste notes/URLs. Treated as untrusted data — never as instructions.</p>
          <div className="field">
            <label>Notes</label>
            <textarea
              placeholder="Must-cover points…"
              onBlur={(e) =>
                onSaveBasics({
                  resources: [{ id: 'notes', type: 'note', text: e.target.value, must_cover: true }],
                })
              }
            />
          </div>
        </div>
      )}

      {step === 'persona' && (
        <div className="card">
          <h2>Author persona</h2>
          <p className="warn">Only real experience. We will not invent credentials.</p>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!!busy}
            onClick={() =>
              onRunJob('persona_derive', {
                name: book.author_name,
                real_experience_notes: book.bible?.stance || '',
                samples: [],
              })
            }
          >
            Derive voice ({costFor('persona_derive')} cr)
          </button>
          {book.persona ? (
            <pre className="muted" style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(book.persona, null, 2)}
            </pre>
          ) : null}
        </div>
      )}

      {step === 'focus_tags' && (
        <div className="card">
          <h2>Focus tags</h2>
          <p className="muted">Selected tags must appear in the outline coverage matrix.</p>
          <div className="row">
            {['tag-1', 'tag-2', 'tag-3', 'tag-4', 'tag-5'].map((tag) => {
              const selected = (book.bible?.focus_tags || []).includes(tag)
              return (
                <button
                  key={tag}
                  type="button"
                  className={`btn ${selected ? 'btn-primary' : ''}`}
                  onClick={() => {
                    const cur = new Set(book.bible?.focus_tags || [])
                    if (cur.has(tag)) cur.delete(tag)
                    else cur.add(tag)
                    onSaveBasics({ bible: { ...book.bible, focus_tags: [...cur] } })
                  }}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {step === 'summary' && (
        <div className="card">
          <h2>Lock book bible</h2>
          <pre className="muted" style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(book.bible, null, 2)}
          </pre>
          <button type="button" className="btn btn-primary" onClick={onLockBible}>
            Lock bible v{(book.bible?.version || 0) + 1}
          </button>
        </div>
      )}

      {step === 'outline' && (
        <div className="card">
          <h2>Outline</h2>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!!busy}
            onClick={() => onRunJob('outline_generate')}
          >
            Generate outline ({costFor('outline_generate')} cr)
          </button>
          {coverage ? (
            <div style={{ marginTop: '0.75rem' }}>
              <strong>Tag coverage: {coverage.passed ? 'PASS' : 'MISSING'}</strong>
              <ul>
                {(coverage.matrix || []).map((m) => (
                  <li key={m.tag}>
                    {m.tag}: {m.covered ? m.nodes.join(', ') : 'uncovered'}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <ol>
            {(book.outline?.chapters || []).map((ch) => (
              <li key={ch.title}>
                <strong>{ch.title}</strong> — {ch.target_words}w
                <div className="muted">{ch.writing_direction}</div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {(step === 'writing' || step === 'edit_verify') && (
        <div className="card">
          <h2>{step === 'writing' ? 'Writing' : 'Edit & Verify'}</h2>
          <div className="row" style={{ marginBottom: '0.75rem' }}>
            <select value={sectionKey} onChange={(e) => setSectionKey(e.target.value)}>
              {leafNodes.map(({ key, node }) => (
                <option key={key} value={key}>
                  {node.title}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!!busy || !sectionKey}
              onClick={() => {
                const leaf = leafNodes.find((l) => l.key === sectionKey)
                if (leaf) onRunJob('section_draft', { sectionKey, node: leaf.node })
              }}
            >
              Draft section
            </button>
            <button
              type="button"
              className="btn"
              disabled={!!busy}
              onClick={() => onRunJob('generate_all_chapter', { chapterIndex: 0 })}
            >
              Generate chapter 1
            </button>
            <button type="button" className="btn" onClick={onSaveSection}>
              Save edits
            </button>
          </div>
          <BookEditor
            value={editorText}
            onChange={setEditorText}
            onInlineAction={onInlineAction}
            disabled={!!busy}
          />
          {step === 'edit_verify' && (
            <>
              <h3>Story slots</h3>
              {(book.story_slots || []).map((s, i) => (
                <div key={i} className="field">
                  <label>
                    {s.prompt_to_user} ({s.status})
                  </label>
                  <textarea
                    placeholder="Your real anecdote…"
                    onBlur={(e) => e.target.value && onFillSlot(i, e.target.value)}
                  />
                </div>
              ))}
              <h3>Claims</h3>
              {(book.claims || []).map((c, i) => (
                <div key={i} className="row" style={{ marginBottom: '0.5rem' }}>
                  <span className="muted">
                    [{c.verification_status}] {c.text}
                  </span>
                  <button type="button" className="btn" onClick={() => onConfirmClaim(i)}>
                    I confirm
                  </button>
                </div>
              ))}
              <button type="button" className="btn" disabled={!!busy} onClick={() => onRunJob('fact_check_section', { sectionKey })}>
                Fact-check section
              </button>
              <button type="button" className="btn" disabled={!!busy} onClick={() => onRunJob('quality_report')}>
                Quality report
              </button>
              <button type="button" className="btn" disabled={!!busy} onClick={() => onRunJob('originality_scan', { sectionKey })}>
                Originality scan
              </button>
              <button
                type="button"
                className="btn"
                disabled={!!busy}
                onClick={() => onRunJob('translation_chapter', { sectionKey, target_lang: book.language === 'en' ? 'de' : 'en' })}
              >
                Translate chapter (AI disclosure)
              </button>
            </>
          )}
        </div>
      )}

      {step === 'formatting' && (
        <div className="card">
          <h2>Formatting</h2>
          <select
            defaultValue={book.formatting?.preset || 'modern'}
            onChange={(e) => onSaveBasics({ formatting: { ...book.formatting, preset: e.target.value } })}
          >
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="workbook">Workbook</option>
          </select>
        </div>
      )}

      {step === 'metadata' && (
        <div className="card">
          <h2>Metadata & description</h2>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!!busy}
            onClick={async () => {
              // reuse description via title agent path — call description by competitive? use inline patch
              await onSaveBasics({
                metadata: {
                  ...book.metadata,
                  description_html: `<p>${book.bible?.usp || book.working_title}</p>`,
                  keywords: ['nonfiction', 'guide', 'practical', 'workbook', 'habits', 'clarity', 'systems'],
                  categories: ['Business', 'Self-Help', 'Education'],
                },
                compliance: {
                  ...book.compliance,
                  ai_disclosure: {
                    used_ai_text: true,
                    used_ai_images: false,
                    note: 'Disclose AI-generated text at KDP upload if applicable.',
                  },
                },
              })
            }}
          >
            Prefill metadata + AI disclosure helper
          </button>
          <pre className="muted">{JSON.stringify(book.metadata, null, 2)}</pre>
        </div>
      )}

      {step === 'cover' && (
        <div className="card">
          <h2>Cover studio</h2>
          <button type="button" className="btn btn-primary" disabled={!!busy} onClick={() => onRunJob('cover_generate')}>
            Generate cover (SVG + typography QA)
          </button>
          <button type="button" className="btn" disabled={!!busy} onClick={() => onRunJob('cover_wrap')}>
            Export cover wrap PDF
          </button>
          <button type="button" className="btn" disabled={!!busy} onClick={() => onRunJob('aplus_module')}>
            A+ modules
          </button>
          <button type="button" className="btn" disabled={!!busy} onClick={() => onRunJob('ad_script')}>
            Ad script
          </button>
        </div>
      )}

      {step === 'publish' && (
        <div className="card">
          <h2>Publish</h2>
          {gate?.softBlock ? (
            <p className="warn">
              Soft gate: {gate.pendingSlots} story slots, {gate.unresolvedClaims} claims unresolved. Override
              allowed with warning.
            </p>
          ) : (
            <p className="muted">Export gate clear (or no pending items).</p>
          )}
          <div className="row">
            <button type="button" className="btn" disabled={!!busy} onClick={() => onRunJob('export_interior_pdf')}>
              Interior PDF
            </button>
            <button type="button" className="btn" disabled={!!busy} onClick={() => onRunJob('export_epub')}>
              EPUB
            </button>
            <button type="button" className="btn" disabled={!!busy} onClick={() => onRunJob('export_docx')}>
              DOCX
            </button>
            <button type="button" className="btn btn-primary" disabled={!!busy} onClick={() => onRunJob('export_kdp_zip')}>
              KDP package ZIP
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!!busy}
              onClick={() => onRunJob('storefront_publish', { price_cents: 1900 })}
            >
              Publish storefront
            </button>
          </div>
          {book.storefront ? (
            <p style={{ marginTop: '0.75rem' }}>
              Storefront:{' '}
              <a href={`/?view=store&slug=${book.storefront.slug}`} rel="noopener noreferrer">
                /?view=store&slug={book.storefront.slug}
              </a>
            </p>
          ) : null}
          <button
            type="button"
            className="btn"
            style={{ marginTop: '0.75rem' }}
            onClick={() =>
              onCompliance({
                passed: true,
                checklist: [{ id: 'previewer', checked: true }],
                ai_disclosure: book.compliance?.ai_disclosure || { used_ai_text: true },
                export_override: !!gate?.softBlock,
              })
            }
          >
            Mark compliance reviewed
          </button>
        </div>
      )}
    </div>
  )
}
