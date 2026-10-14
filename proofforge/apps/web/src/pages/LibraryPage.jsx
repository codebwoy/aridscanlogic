import { useEffect, useState } from 'react'
import { pfApi } from '../lib/api.js'

const SAMPLE = `# Chapter 1

She she walked through the colour market at dusk. The air smelled of cardamom and rain. She she told herself the story again and again and again and again until the words felt thin.

# Chapter 2

Jonas waited by the Spree. "Du kommst zu spät," he said, mixing languages without meaning to. The colour of the water matched the sky.`

export function LibraryPage({ onOpen, onError }) {
  const [projects, setProjects] = useState([])
  const [specs, setSpecs] = useState(null)
  const [title, setTitle] = useState('My manuscript audit')
  const [language, setLanguage] = useState('en')
  const [variety, setVariety] = useState('us')
  const [bookType, setBookType] = useState('fiction')
  const [editMode, setEditMode] = useState('natural')
  const [publishingTarget, setPublishingTarget] = useState('editorial_only')
  const [documentDomain, setDocumentDomain] = useState('creative')
  const [genreComparison, setGenreComparison] = useState('general_fiction')
  const [authorGoals, setAuthorGoals] = useState('')
  const [translationMode, setTranslationMode] = useState(false)
  const [plagiarismConsent, setPlagiarismConsent] = useState(false)
  const [manuscript, setManuscript] = useState(SAMPLE)
  const [busy, setBusy] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  async function refresh() {
    const [list, sp] = await Promise.all([pfApi.listProjects(), pfApi.specs()])
    setProjects(list.projects || [])
    setSpecs(sp)
  }

  useEffect(() => {
    refresh().catch((e) => onError?.(e.message))
  }, [onError])

  useEffect(() => {
    const langs = specs?.book_languages?.languages || []
    const row = langs.find((l) => l.code === language)
    if (row?.defaultVariety) setVariety(row.defaultVariety)
  }, [language, specs])

  const varieties =
    specs?.book_languages?.languages?.find((l) => l.code === language)?.varieties || []

  async function onCreate(e) {
    e.preventDefault()
    setBusy(true)
    onError?.('')
    try {
      const { project } = await pfApi.createProject({
        title,
        language,
        language_variety: variety,
        book_type: bookType,
        edit_mode: editMode,
        publishing_target: publishingTarget,
        document_domain: documentDomain,
        genre_comparison: genreComparison,
        author_goals: authorGoals,
        translation_mode: translationMode,
        plagiarism_consent: plagiarismConsent,
        manuscript_text: manuscript,
      })
      await refresh()
      onOpen(project.id)
    } catch (err) {
      onError?.(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function onUploadFile(file) {
    if (!file) return
    setBusy(true)
    onError?.('')
    try {
      const buf = await file.arrayBuffer()
      const bytes = new Uint8Array(buf)
      let binary = ''
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
      const base64 = btoa(binary)
      const { project } = await pfApi.ingest({
        filename: file.name,
        mime: file.type,
        base64,
        title: title || file.name,
        language,
        language_variety: variety,
        book_type: bookType,
        edit_mode: editMode,
        publishing_target: publishingTarget,
        document_domain: documentDomain,
        genre_comparison: genreComparison,
        author_goals: authorGoals,
        translation_mode: translationMode,
        plagiarism_consent: plagiarismConsent,
        enable_ocr: true,
      })
      await refresh()
      onOpen(project.id)
    } catch (err) {
      onError?.(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid-2">
      <section className="panel">
        <h2 style={{ marginTop: 0, fontFamily: 'var(--font-display)' }}>New audit project</h2>
        <p className="muted">
          Paste a finished manuscript (or import from NovelForge). Analysis covers the whole text in
          chunks — accept or reject each finding. Scores are guides, not KDP approval.
        </p>
        <form onSubmit={onCreate} style={{ display: 'grid', gap: '0.85rem', marginTop: '1rem' }}>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="row">
            <div className="field">
              <label htmlFor="lang">Language</label>
              <select id="lang" value={language} onChange={(e) => setLanguage(e.target.value)}>
                {(specs?.book_languages?.languages || []).map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
            {varieties.length > 1 ? (
              <div className="field">
                <label htmlFor="variety">Variety</label>
                <select id="variety" value={variety} onChange={(e) => setVariety(e.target.value)}>
                  {varieties.map((v) => (
                    <option key={v.code} value={v.code}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="field">
              <label htmlFor="type">Book type</label>
              <select id="type" value={bookType} onChange={(e) => setBookType(e.target.value)}>
                {(specs?.book_types?.types || ['fiction']).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="mode">Edit mode</label>
              <select id="mode" value={editMode} onChange={(e) => setEditMode(e.target.value)}>
                {(specs?.edit_modes?.modes || []).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="pub">Publishing target</label>
              <select
                id="pub"
                value={publishingTarget}
                onChange={(e) => setPublishingTarget(e.target.value)}
              >
                {(specs?.publishing_targets?.targets || ['editorial_only']).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="domain">Document domain</label>
              <select
                id="domain"
                value={documentDomain}
                onChange={(e) => setDocumentDomain(e.target.value)}
              >
                {(specs?.document_domains?.domains || [{ id: 'creative', label: 'Creative' }]).map(
                  (d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="field">
              <label htmlFor="genre">Genre comparison</label>
              <select
                id="genre"
                value={genreComparison}
                onChange={(e) => setGenreComparison(e.target.value)}
              >
                {(
                  specs?.manuscript_analysis?.genre_comparison || [
                    { id: 'general_fiction', label: 'General Fiction' },
                  ]
                ).map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="goals">Fine-tune goals / concerns (optional)</label>
            <textarea
              id="goals"
              value={authorGoals}
              onChange={(e) => setAuthorGoals(e.target.value)}
              placeholder="Steer Manuscript Analysis — e.g. stronger antagonist, first-chapter pace"
              rows={2}
            />
          </div>
          <label className="row" style={{ gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={translationMode}
              onChange={(e) => setTranslationMode(e.target.checked)}
            />
            <span>Translation mode (flag bilingual / localization issues)</span>
          </label>
          <label className="row" style={{ gap: '0.5rem', alignItems: 'flex-start' }}>
            <input
              type="checkbox"
              checked={plagiarismConsent}
              onChange={(e) => setPlagiarismConsent(e.target.checked)}
            />
            <span>
              Consent to external similarity check (optional). Text is only sent when a licensed
              provider is configured — never silent upload.
            </span>
          </label>
          <div
            className="field"
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              const f = e.dataTransfer.files?.[0]
              if (f) onUploadFile(f)
            }}
            style={{
              border: `1px dashed ${dragOver ? 'var(--brand)' : 'var(--line)'}`,
              borderRadius: 10,
              padding: '0.75rem',
            }}
          >
            <label htmlFor="file">Upload DOCX / TXT / MD / PDF / EPUB (drag & drop or browse)</label>
            <input
              id="file"
              type="file"
              accept=".docx,.txt,.md,.pdf,.epub,text/plain,application/pdf,application/epub+zip,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => onUploadFile(e.target.files?.[0])}
            />
            <p className="muted" style={{ margin: '0.35rem 0 0', fontSize: '0.85rem' }}>
              Thin PDFs use OCR. File hash recorded on ingest. Max 12MB.
            </p>
          </div>
          <div className="field">
            <label htmlFor="ms">Or paste manuscript</label>
            <textarea
              id="ms"
              value={manuscript}
              onChange={(e) => setManuscript(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? 'Creating…' : 'Create project'}
          </button>
        </form>
      </section>

      <aside className="panel">
        <h2 style={{ marginTop: 0, fontFamily: 'var(--font-display)' }}>Library</h2>
        <p className="muted">Personal studio — unlimited local audits for your own books.</p>
        <p className="muted" style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
          Recommended length {specs?.word_count_gate?.recommended_min ?? 6000}–
          {specs?.word_count_gate?.recommended_max ?? 300000} words (soft gate). OCR:{' '}
          {specs?.formats?.ocr ? 'on' : 'off'} · Plagiarism:{' '}
          {specs?.plagiarism?.provider || 'off'}
        </p>
        <div style={{ display: 'grid', gap: '0.55rem', marginTop: '0.75rem' }}>
          {(projects || []).length === 0 ? (
            <p className="muted">No projects yet.</p>
          ) : (
            projects.map((p) => (
              <button key={p.id} type="button" className="list-btn" onClick={() => onOpen(p.id)}>
                <strong>{p.title}</strong>
                <div className="muted" style={{ fontSize: '0.9rem' }}>
                  {p.language}
                  {p.language_variety ? `/${p.language_variety}` : ''} · {p.status} ·{' '}
                  {(p.findings || []).length} findings
                </div>
              </button>
            ))
          )}
        </div>
      </aside>
    </div>
  )
}
