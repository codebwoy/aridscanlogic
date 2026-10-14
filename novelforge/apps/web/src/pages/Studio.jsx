import { useCallback, useEffect, useMemo, useState } from 'react'
import { BookOpen, Coins, Save, Sparkles } from 'lucide-react'
import {
  WIZARD_STEPS,
  t,
  costFor,
  productCopy,
  RECOMMENDED_NICHES,
  MARKET_DISCLAIMER,
  applyRecommendedNiche,
  nextStepId,
  prevStepId,
  ADULT_CONTENT_NOTE,
} from '@novelforge/shared'
import {
  createBook,
  deleteBook,
  ensureSession,
  getBook,
  getMe,
  grantDevCredits,
  listBooks,
  lockBible,
  patchBook,
  saveSection,
  stepBook,
  submitJob,
  waitJob,
} from '../lib/api'
import BookEditor from '../components/BookEditor'
import ManuscriptImport from '../components/ManuscriptImport'

function flattenLeaves(chapters = []) {
  const out = []
  function walk(node, path) {
    const kids = node.children || []
    if (!kids.length) out.push({ key: path, node })
    else kids.forEach((ch, i) => walk(ch, `${path}.${i}`))
  }
  chapters.forEach((ch, i) => walk(ch, `c${i}`))
  return out
}

export default function Studio({ lang = 'en' }) {
  const [ready, setReady] = useState(false)
  const [me, setMe] = useState(null)
  const [books, setBooks] = useState([])
  const [book, setBook] = useState(null)
  const [busy, setBusy] = useState('')
  const [message, setMessage] = useState('')
  const [sectionKey, setSectionKey] = useState('')
  const [editorText, setEditorText] = useState('')
  const [assist, setAssist] = useState(null)
  const [coverPreview, setCoverPreview] = useState('')

  const copy = productCopy(lang)
  const step = book?.wizard_step || 'genre'
  const leafNodes = useMemo(() => flattenLeaves(book?.outline?.chapters || []), [book])

  const refresh = useCallback(async () => {
    const m = await getMe()
    setMe(m)
    const list = await listBooks()
    setBooks(list.books || list || [])
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        await ensureSession()
        await refresh()
        setReady(true)
      } catch (e) {
        setMessage(e.message || 'Session failed')
      }
    })()
  }, [refresh])

  useEffect(() => {
    if (!sectionKey && leafNodes[0]) setSectionKey(leafNodes[0].key)
  }, [leafNodes, sectionKey])

  useEffect(() => {
    if (!book || !sectionKey) return
    const sec = book.sections?.[sectionKey]
    setEditorText(sec?.content_md || '')
  }, [book?.id, sectionKey, book?.sections?.[sectionKey]?.version])

  async function loadBook(id) {
    const r = await getBook(id)
    setBook(r.book || r)
    setMessage('')
    setCoverPreview('')
  }

  async function onNewBook() {
    setBusy('create')
    try {
      const { book: b } = await createBook({
        working_title: 'Untitled novel',
        language: lang === 'de' ? 'de' : 'en',
        wizard_step: 'genre',
        target_words: 80000,
        chapter_count: 12,
        trim_size: '5.5x8.5',
        genre: 'contemporary',
      })
      setBook(b)
      await refresh()
      setMessage('Novel created')
    } catch (e) {
      setMessage(e.message)
    } finally {
      setBusy('')
    }
  }

  async function saveBasics(patch) {
    if (!book) return null
    const r = await patchBook(book.id, patch)
    const next = r.book || r
    setBook(next)
    await refresh()
    return next
  }

  async function runJob(type, inputs = {}) {
    if (!book && type !== 'genre_search') {
      setMessage('Create a novel first')
      return null
    }
    setBusy(type)
    setMessage(`Running ${type} (${costFor(type) ?? 0} credits)…`)
    try {
      const { job } = await submitJob(type, book?.id, inputs)
      const done = await waitJob(job.id)
      if (done.status === 'failed') throw new Error(done.error || 'Job failed')
      await refresh()
      if (book?.id) await loadBook(book.id)
      setAssist({ type, outputs: done.outputs })
      const url = done.outputs?.url || done.outputs?.download || done.outputs?.cover?.export?.url
      if (type === 'cover_generate' || type === 'cover_revise') {
        if (url) setCoverPreview(url)
      }
      if (url && String(type).startsWith('export_')) {
        window.open(url, '_blank', 'noopener,noreferrer')
      }
      setMessage(`${type} completed`)
      return done.outputs
    } catch (e) {
      setMessage(e.message)
      return null
    } finally {
      setBusy('')
    }
  }

  async function onNav(dir) {
    if (!book) return
    const next = dir === 'next' ? nextStepId(step) : dir === 'prev' ? prevStepId(step) : null
    if (!next) return
    const r = await stepBook(book.id, dir, next)
    setBook(r.book || r)
  }

  async function onInlineAction({ instruction, selection }) {
    const out = await runJob('inline_edit', { instruction, selection })
    return out
  }

  if (!ready) {
    return (
      <div className="app-shell">
        <p className="muted">Starting NovelForge…</p>
      </div>
    )
  }

  const creditBal = typeof me?.credits === 'number' ? me.credits : me?.credits?.balance

  return (
    <div className="app-shell">
      <aside className="rail-left">
        <div className="brand-block">
          <h1 className="brand">NovelForge</h1>
          <span className="badge">{copy.categoryLabel}</span>
        </div>
        <p className="muted" style={{ fontSize: '0.78rem' }}>
          {t(lang, 'positioningLead')}
        </p>
        <div className="row" style={{ marginTop: '0.75rem' }}>
          <button type="button" className="btn btn-primary" disabled={!!busy} onClick={onNewBook}>
            {t(lang, 'newBook')}
          </button>
          <button
            type="button"
            className="btn"
            disabled={!!busy}
            onClick={async () => {
              await grantDevCredits()
              await refresh()
              setMessage('+ credits granted')
            }}
          >
            <Coins size={14} /> +credits
          </button>
        </div>
        <p className="muted" style={{ marginTop: '0.5rem' }}>
          Credits: <strong>{creditBal ?? '—'}</strong>
        </p>
        <h3 style={{ marginTop: '1.25rem' }}>Library</h3>
        <ul className="book-list">
          {books.map((b) => (
            <li key={b.id}>
              <button
                type="button"
                className={`book-item${book?.id === b.id ? ' is-active' : ''}`}
                onClick={() => loadBook(b.id)}
              >
                <BookOpen size={14} /> {b.working_title || 'Untitled'}
              </button>
              <button
                type="button"
                className="btn"
                style={{ minHeight: 36, fontSize: '0.7rem' }}
                onClick={async () => {
                  await deleteBook(b.id)
                  if (book?.id === b.id) setBook(null)
                  await refresh()
                }}
              >
                Del
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="main-pane">
        <header className="topbar">
          <div>
            <strong>{book?.working_title || 'No novel open'}</strong>
            {book ? (
              <span className="muted"> · {WIZARD_STEPS.find((s) => s.id === step)?.title || step}</span>
            ) : null}
          </div>
          {message ? <p className="status-msg">{message}</p> : null}
        </header>

        {!book ? (
          <div className="card">
            <h2>Adult fiction studio</h2>
            <p>{copy.strategyLine}</p>
            <p className="muted">{ADULT_CONTENT_NOTE}</p>
            <p className="muted" style={{ fontSize: '0.75rem' }}>
              {MARKET_DISCLAIMER}
            </p>
            <button type="button" className="btn btn-primary" onClick={onNewBook}>
              {t(lang, 'newBook')}
            </button>
          </div>
        ) : (
          <>
            <div className="wizard-tabs">
              {WIZARD_STEPS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`wizard-tab${step === s.id ? ' is-active' : ''}`}
                  onClick={() => saveBasics({ wizard_step: s.id })}
                >
                  {s.number}. {s.title}
                </button>
              ))}
            </div>

            <div className="row" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
              <button type="button" className="btn" disabled={!!busy} onClick={() => onNav('prev')}>
                Back
              </button>
              <button type="button" className="btn btn-primary" disabled={!!busy} onClick={() => onNav('next')}>
                Next
              </button>
              <button
                type="button"
                className="btn"
                disabled={!!busy}
                onClick={async () => {
                  if (sectionKey) {
                    const r = await saveSection(book.id, sectionKey, editorText)
                    setBook(r.book)
                  } else {
                    await saveBasics({})
                  }
                  setMessage('Saved')
                }}
              >
                <Save size={14} /> Save
              </button>
              <button
                type="button"
                className="btn"
                disabled={!!busy}
                onClick={async () => {
                  const r = await lockBible(book.id)
                  setBook(r.book)
                  setMessage(`Bible locked v${r.book?.bible?.version || ''}`)
                }}
              >
                Lock bible
              </button>
            </div>

            {step === 'genre' && (
              <div className="card">
                <h2>Genre & niche</h2>
                <p className="muted">{MARKET_DISCLAIMER}</p>
                <div className="grid-2">
                  <div className="field">
                    <label>Working title</label>
                    <input
                      defaultValue={book.working_title}
                      key={`wt-${book.id}`}
                      onBlur={(e) => saveBasics({ working_title: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Topic / logline seed</label>
                    <input
                      defaultValue={book.topic || ''}
                      key={`topic-${book.id}`}
                      onBlur={(e) => saveBasics({ topic: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Target words</label>
                    <input
                      type="number"
                      min={10000}
                      max={200000}
                      defaultValue={book.target_words || 80000}
                      onBlur={(e) => saveBasics({ target_words: Number(e.target.value) || 80000 })}
                    />
                  </div>
                  <div className="field">
                    <label>Chapter count (outline)</label>
                    <input
                      type="number"
                      min={3}
                      max={40}
                      defaultValue={book.chapter_count || 12}
                      onBlur={(e) => saveBasics({ chapter_count: Number(e.target.value) || 12 })}
                    />
                  </div>
                </div>
                <div className="niche-grid">
                  {RECOMMENDED_NICHES.filter((n) => n.studio === 'novelforge').map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      className="niche-card"
                      disabled={!!busy}
                      onClick={async () => {
                        const patch = applyRecommendedNiche(n.id, lang)
                        if (patch) await saveBasics(patch)
                        setMessage(`Applied ${n.en.title}`)
                      }}
                    >
                      <strong>{n.en.title}</strong>
                      <span className="muted">{n.en.angle}</span>
                    </button>
                  ))}
                </div>
                <button type="button" className="btn" disabled={!!busy} onClick={() => runJob('genre_search')}>
                  List niches ({costFor('genre_search')} cr)
                </button>
              </div>
            )}

            {step === 'premise' && (
              <div className="card">
                <h2>Premise & promise</h2>
                <div className="field">
                  <label>Premise</label>
                  <textarea
                    rows={4}
                    defaultValue={book.bible?.premise || ''}
                    key={`premise-${book.bible?.premise || book.id}`}
                    onBlur={(e) => saveBasics({ bible: { ...book.bible, premise: e.target.value } })}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!!busy}
                  onClick={() => runJob('premise_generate')}
                >
                  Generate premise ({costFor('premise_generate')} cr)
                </button>
                {book.bible?.promise_to_reader ? (
                  <p style={{ marginTop: '0.75rem' }}>
                    <strong>Promise:</strong> {book.bible.promise_to_reader}
                  </p>
                ) : null}
                {book.bible?.stakes ? (
                  <p>
                    <strong>Stakes:</strong> {book.bible.stakes}
                  </p>
                ) : null}
                {book.bible?.unique_hook ? (
                  <p>
                    <strong>Hook:</strong> {book.bible.unique_hook}
                  </p>
                ) : null}
              </div>
            )}

            {step === 'cast' && (
              <div className="card">
                <h2>Cast</h2>
                <p className="muted">Adult characters only (18+). {ADULT_CONTENT_NOTE}</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!!busy}
                  onClick={() => runJob('cast_generate')}
                >
                  Generate cast ({costFor('cast_generate')} cr)
                </button>
                <ul>
                  {(book.bible?.cast || []).map((c) => (
                    <li key={c.name}>
                      <strong>{c.name}</strong> ({c.role}
                      {c.age != null ? `, ${c.age}` : ''}) — want: {c.want}; need: {c.need}
                      {c.voice_notes ? <div className="muted">{c.voice_notes}</div> : null}
                    </li>
                  ))}
                </ul>
                {(book.bible?.relationships || []).length ? (
                  <p className="muted">Relationships: {(book.bible.relationships || []).join(' · ')}</p>
                ) : null}
              </div>
            )}

            {step === 'world' && (
              <div className="card">
                <h2>World & setting</h2>
                <div className="field">
                  <label>Setting notes</label>
                  <textarea
                    rows={5}
                    defaultValue={book.bible?.world || ''}
                    key={`world-${book.id}-${book.bible?.world || ''}`}
                    onBlur={(e) => saveBasics({ bible: { ...book.bible, world: e.target.value } })}
                    placeholder="City, era, social rules, sensory details…"
                  />
                </div>
              </div>
            )}

            {step === 'plot' && (
              <div className="card">
                <h2>Plot beats</h2>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!!busy}
                  onClick={() => runJob('plot_generate')}
                >
                  Generate beats ({costFor('plot_generate')} cr)
                </button>
                <ol>
                  {(book.bible?.beats || []).map((b, i) => (
                    <li key={`${b.name}-${i}`}>
                      <strong>{b.name}</strong>
                      {b.act != null ? ` (act ${b.act})` : ''} — {b.summary}
                    </li>
                  ))}
                </ol>
                {book.bible?.theme ? (
                  <p>
                    <strong>Theme:</strong> {book.bible.theme}
                  </p>
                ) : null}
                {book.bible?.ending_type ? (
                  <p>
                    <strong>Ending:</strong> {book.bible.ending_type}
                  </p>
                ) : null}
              </div>
            )}

            {step === 'title_opt' && (
              <div className="card">
                <h2>Title options</h2>
                <div className="grid-2">
                  <div className="field">
                    <label>Working title</label>
                    <input
                      defaultValue={book.working_title}
                      key={book.working_title}
                      onBlur={(e) => saveBasics({ working_title: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Subtitle</label>
                    <input
                      defaultValue={book.subtitle || ''}
                      onBlur={(e) => saveBasics({ subtitle: e.target.value })}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!!busy}
                  onClick={() => runJob('title_variations')}
                >
                  Generate titles ({costFor('title_variations')} cr)
                </button>
                {assist?.type === 'title_variations' && (
                  <ul>
                    {(assist.outputs?.options || []).map((o) => (
                      <li key={o.title}>
                        {o.title}
                        {o.subtitle ? <span className="muted"> — {o.subtitle}</span> : null}
                        <button
                          type="button"
                          className="btn"
                          onClick={() =>
                            saveBasics({ working_title: o.title, subtitle: o.subtitle || '' })
                          }
                        >
                          Apply
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {step === 'voice' && (
              <div className="card">
                <h2>Voice / POV / tense</h2>
                <div className="grid-2">
                  <div className="field">
                    <label>POV</label>
                    <select
                      defaultValue={book.bible?.pov || 'third_limited'}
                      onChange={(e) => saveBasics({ bible: { ...book.bible, pov: e.target.value } })}
                    >
                      <option value="first">First person</option>
                      <option value="third_limited">Third limited</option>
                      <option value="third_omniscient">Third omniscient</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Tense</label>
                    <select
                      defaultValue={book.bible?.tense || 'past'}
                      onChange={(e) => saveBasics({ bible: { ...book.bible, tense: e.target.value } })}
                    >
                      <option value="past">Past</option>
                      <option value="present">Present</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>Tone</label>
                  <input
                    defaultValue={book.bible?.tone || ''}
                    onBlur={(e) => saveBasics({ bible: { ...book.bible, tone: e.target.value } })}
                  />
                </div>
                <div className="field">
                  <label>Author name</label>
                  <input
                    defaultValue={book.author_name || ''}
                    onBlur={(e) => saveBasics({ author_name: e.target.value })}
                  />
                </div>
                <p className="muted">
                  Lock the bible when premise, cast, plot, and voice are ready — then outline.
                </p>
              </div>
            )}

            {step === 'outline' && (
              <div className="card">
                <h2>Outline</h2>
                <div className="row" style={{ flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!!busy}
                    onClick={() => runJob('outline_generate')}
                  >
                    Generate outline ({costFor('outline_generate')} cr)
                  </button>
                </div>
                <ol>
                  {(book.outline?.chapters || []).map((ch, i) => (
                    <li key={`${ch.title}-${i}`}>
                      <strong>{ch.title}</strong> — {ch.target_words}w
                      <div className="muted">{ch.writing_direction}</div>
                      {(ch.children || []).length ? (
                        <ul>
                          {ch.children.map((sec, j) => (
                            <li key={`${sec.title}-${j}`}>
                              {sec.title} <span className="muted">({sec.target_words}w)</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <button
                          type="button"
                          className="btn"
                          style={{ marginTop: '0.35rem' }}
                          disabled={!!busy}
                          onClick={() => runJob('outline_expand_chapter', { chapterIndex: i })}
                        >
                          Expand scenes ({costFor('outline_expand_chapter')} cr)
                        </button>
                      )}
                    </li>
                  ))}
                </ol>
                <h3 style={{ marginTop: '1.25rem' }}>Import manuscript</h3>
                <ManuscriptImport
                  book={book}
                  busy={busy}
                  onRunJob={runJob}
                  onMessage={setMessage}
                />
              </div>
            )}

            {(step === 'writing' || step === 'continuity') && (
              <div className="card">
                <h2>{step === 'writing' ? 'Writing' : 'Continuity edit'}</h2>
                <div className="row" style={{ marginBottom: '0.75rem', flexWrap: 'wrap' }}>
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
                      if (leaf) runJob('section_draft', { sectionKey, node: leaf.node })
                    }}
                  >
                    Draft scene ({costFor('section_draft')} cr)
                  </button>
                  <button
                    type="button"
                    className="btn"
                    disabled={!!busy}
                    onClick={() => runJob('generate_all_chapter', { chapterIndex: 0 })}
                  >
                    Generate chapter 1 ({costFor('generate_all_chapter')} cr)
                  </button>
                  {step === 'continuity' ? (
                    <button
                      type="button"
                      className="btn"
                      disabled={!!busy}
                      onClick={() => runJob('continuity_scan', { sectionKey })}
                    >
                      Continuity scan ({costFor('continuity_scan')} cr)
                    </button>
                  ) : null}
                </div>
                <BookEditor
                  value={editorText}
                  onChange={setEditorText}
                  onInlineAction={onInlineAction}
                  disabled={!!busy}
                />
                {(book.continuity?.summaries || []).length ? (
                  <div style={{ marginTop: '0.75rem' }}>
                    <strong>Continuity ledger</strong>
                    <ul className="assist-simple">
                      {(book.continuity.summaries || []).slice(-8).map((s) => (
                        <li key={s.id}>
                          {s.title}: {s.summary}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {assist?.type === 'continuity_scan' && assist.outputs ? (
                  <div style={{ marginTop: '0.75rem' }}>
                    <p>{assist.outputs.summary}</p>
                    {(assist.outputs.issues || []).map((iss) => (
                      <p key={iss.note} className="warn">
                        [{iss.severity}] {iss.note}
                      </p>
                    ))}
                    {(assist.outputs.open_loops || []).length ? (
                      <p className="muted">Open loops: {(assist.outputs.open_loops || []).join(' · ')}</p>
                    ) : null}
                  </div>
                ) : null}
                {assist?.type === 'inline_edit' && assist.outputs?.proposed ? (
                  <p className="muted" style={{ marginTop: '0.5rem', fontSize: '0.72rem' }}>
                    Inline suggestion ready in the editor bubble — approve or reject there.
                  </p>
                ) : null}
              </div>
            )}

            {step === 'formatting' && (
              <div className="card">
                <h2>Formatting</h2>
                <div className="field">
                  <label>Trim size</label>
                  <select
                    defaultValue={book.trim_size || '5.5x8.5'}
                    onChange={(e) => saveBasics({ trim_size: e.target.value })}
                  >
                    <option value="5x8">5 × 8</option>
                    <option value="5.5x8.5">5.5 × 8.5</option>
                    <option value="6x9">6 × 9</option>
                  </select>
                </div>
              </div>
            )}

            {step === 'metadata' && (
              <div className="card">
                <h2>Metadata</h2>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!!busy}
                  onClick={() => runJob('metadata_generate')}
                >
                  Generate description ({costFor('metadata_generate')} cr)
                </button>
                {book.metadata?.description_html ? (
                  <div
                    className="muted"
                    style={{ marginTop: '0.75rem' }}
                    dangerouslySetInnerHTML={{ __html: book.metadata.description_html }}
                  />
                ) : null}
                {(book.metadata?.keywords || []).length ? (
                  <p className="muted">Keywords: {(book.metadata.keywords || []).join(', ')}</p>
                ) : null}
              </div>
            )}

            {step === 'cover' && (
              <div className="card">
                <h2>Cover</h2>
                <p className="muted">Typography SVG stub — replace with final art before print.</p>
                <div className="row" style={{ flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!!busy}
                    onClick={() => runJob('cover_generate')}
                  >
                    Generate cover ({costFor('cover_generate')} cr)
                  </button>
                  <button
                    type="button"
                    className="btn"
                    disabled={!!busy}
                    onClick={() => runJob('cover_revise')}
                  >
                    Revise cover ({costFor('cover_revise')} cr)
                  </button>
                  <button
                    type="button"
                    className="btn"
                    disabled={!!busy}
                    onClick={async () => {
                      const out = await runJob('cover_wrap')
                      const url = out?.url || out?.download
                      if (url) window.open(url, '_blank', 'noopener,noreferrer')
                    }}
                  >
                    Cover wrap PDF ({costFor('cover_wrap')} cr)
                  </button>
                </div>
                {coverPreview ? (
                  <div style={{ marginTop: '1rem' }}>
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      style={{ maxWidth: 280, width: '100%', borderRadius: 8, border: '1px solid var(--nf-border)' }}
                    />
                    <p>
                      <a href={coverPreview} target="_blank" rel="noopener noreferrer">
                        Open cover file
                      </a>
                    </p>
                  </div>
                ) : null}
              </div>
            )}

            {step === 'publish' && (
              <div className="card">
                <h2>Publish / export</h2>
                <p className="muted">Export files + checklist only — no unofficial Amazon upload.</p>
                <div className="row" style={{ flexWrap: 'wrap' }}>
                  {['export_docx', 'export_interior_pdf', 'export_epub', 'export_cover_pdf', 'export_kdp_zip'].map(
                    (jt) => (
                      <button
                        key={jt}
                        type="button"
                        className="btn"
                        disabled={!!busy}
                        onClick={() => runJob(jt)}
                      >
                        {jt.replace('export_', '').toUpperCase()} ({costFor(jt)} cr)
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <aside className="rail-right">
        <div className="row">
          <Sparkles size={16} color="var(--nf-accent)" />
          <strong>Assistant</strong>
        </div>
        <p className="muted" style={{ fontSize: '0.78rem' }}>
          {t(lang, 'assistantIdle')}
        </p>
        {assist?.type ? (
          <p className="muted" style={{ fontSize: '0.72rem' }}>
            Last job: <strong>{assist.type}</strong>
          </p>
        ) : null}
        {assist?.outputs ? (
          <pre className="assist-json">
            {JSON.stringify(assist.outputs, null, 2).slice(0, 4000)}
          </pre>
        ) : null}
      </aside>
    </div>
  )
}
