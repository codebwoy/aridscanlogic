import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BookOpen, Coins, Download, Save, Sparkles, Upload } from 'lucide-react'
import {
  WIZARD_STEPS,
  t,
  costFor,
  productCopy,
  RECOMMENDED_NICHES,
  MARKET_DISCLAIMER,
  applyRecommendedNiche,
  nicheLocalized,
  applyAngleToBookPatch,
  BOOK_LANGUAGES,
  normalizeBookLanguage,
  normalizeBookLanguageVariety,
  bookLanguageLabel,
  bookLanguageCultureHint,
  bookLanguageVarieties,
  bookLanguageVarietyLabel,
  SECTION_ROLE_OPTIONS,
  KINDLE_CREATE_SPECS,
  inferSectionRole,
} from '@authorforge/shared'
import CompetitiveAdvantagePanel from '../components/CompetitiveAdvantagePanel.jsx'
import ManuscriptImport from '../components/ManuscriptImport.jsx'
import LaunchReadinessPanel from '../components/LaunchReadinessPanel.jsx'
import {
  createBook,
  deleteBook,
  ensureSession,
  getBook,
  getCoverage,
  getExportGate,
  getMe,
  getSpecs,
  grantDevCredits,
  importBook,
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
import StepAssistant from '../components/StepAssistant'
import { handoffBookToProofForge } from '../lib/proofforgeHandoff'

const LAST_BOOK_KEY = 'authorforge_last_book_id'

function rememberBookId(id) {
  try {
    if (id) localStorage.setItem(LAST_BOOK_KEY, id)
  } catch {
    /* ignore */
  }
}

function recalledBookId() {
  try {
    return localStorage.getItem(LAST_BOOK_KEY) || ''
  } catch {
    return ''
  }
}

function formatUpdated(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

export default function Studio({ lang = 'en' }) {
  const [ready, setReady] = useState(false)
  const [credits, setCredits] = useState(0)
  const [specs, setSpecs] = useState(null)
  const [books, setBooks] = useState([])
  const [book, setBook] = useState(null)
  const [busy, setBusy] = useState('')
  const [message, setMessage] = useState('')
  const [assist, setAssist] = useState(null)
  const [sectionKey, setSectionKey] = useState('')
  const [editorText, setEditorText] = useState('')
  const [coverage, setCoverage] = useState(null)
  const [gate, setGate] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [persistOn, setPersistOn] = useState(true)
  const [savedFlash, setSavedFlash] = useState(false)
  const [primaryLanguage, setPrimaryLanguage] = useState(() =>
    normalizeBookLanguage(lang === 'de' ? 'de' : 'en')
  )
  const [primaryVariety, setPrimaryVariety] = useState(() =>
    normalizeBookLanguageVariety(lang === 'de' ? 'de' : 'en')
  )
  const importRef = useRef(null)

  function onPrimaryLanguageChange(code) {
    const next = normalizeBookLanguage(code)
    setPrimaryLanguage(next)
    setPrimaryVariety(normalizeBookLanguageVariety(next))
  }

  const step = book?.wizard_step || 'basics'
  const stepMeta = WIZARD_STEPS.find((s) => s.id === step) || WIZARD_STEPS[2]

  const refreshMe = useCallback(async () => {
    const me = await getMe()
    setCredits(me.credits)
  }, [])

  const refreshLibrary = useCallback(async () => {
    const list = await listBooks()
    setBooks(list.books || [])
    return list.books || []
  }, [])

  const loadBook = useCallback(async (id) => {
    const { book: b } = await getBook(id)
    setBook(b)
    rememberBookId(b.id)
    const keys = Object.keys(b.sections || {})
    if (keys.length) {
      setSectionKey(keys[0])
      setEditorText(b.sections[keys[0]]?.content_md || '')
    } else {
      setSectionKey('')
      setEditorText('')
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
        setPersistOn(me.persist?.enabled !== false)
        setBooks(list.books || [])
        const remembered = recalledBookId()
        const pick =
          (remembered && list.books?.find((b) => b.id === remembered)) || list.books?.[0] || null
        if (pick) await loadBook(pick.id)
        setReady(true)
        if (me.persist?.enabled === false) {
          setMessage('Library persistence is off — books will be lost when the API restarts.')
        }
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

  async function downloadExportUrl(url, filename) {
    if (!url) return false
    const name = filename || 'authorforge-export'
    const clickAnchor = (href, downloadName) => {
      const a = document.createElement('a')
      a.href = href
      if (downloadName) a.download = downloadName
      a.rel = 'noopener noreferrer'
      document.body.appendChild(a)
      a.click()
      a.remove()
    }
    try {
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) throw new Error(`Download failed (${res.status})`)
      const blob = await res.blob()
      if (!blob.size) throw new Error('Empty export file')
      const objectUrl = URL.createObjectURL(blob)
      clickAnchor(objectUrl, name)
      // Delay revoke so the browser can finish starting the download
      setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000)
      return true
    } catch {
      // Anchor fallback (not window.open — popup blockers kill async opens)
      try {
        clickAnchor(url, name)
        return true
      } catch {
        return false
      }
    }
  }

  function exportFilename(type, outputs) {
    const format = outputs?.meta?.format || outputs?.format || outputs?.cover?.export?.meta?.format
    const t = String(type || '')
    const ext =
      t.includes('epub') || format === 'epub'
        ? 'epub'
        : t.includes('docx') || format === 'docx'
          ? 'docx'
          : t.includes('kdp') || t.includes('zip') || format === 'kdp_zip'
            ? 'zip'
            : t.includes('cover_generate') ||
                t.includes('cover_revise') ||
                t.includes('aplus') ||
                format === 'cover_svg' ||
                String(format || '').includes('svg') ||
                String(format || '').startsWith('aplus_')
              ? 'svg'
              : 'pdf'
    const slug = String(book?.working_title || 'book')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'book'
    return `authorforge-${slug}-${t.replace(/_/g, '-') || 'export'}.${ext}`
  }

  /** Trigger downloads / open storefront for job outputs that previously only showed JSON. */
  async function consumeJobOutputs(type, outputs) {
    if (!outputs) return { downloaded: 0, storefrontHref: '' }
    let downloaded = 0
    const seen = new Set()
    const urls = []
    const pushUrl = (url, name) => {
      if (!url || seen.has(url)) return
      seen.add(url)
      urls.push({ url, name })
    }
    // Cover / export artifacts
    pushUrl(outputs.url, exportFilename(type, outputs))
    pushUrl(outputs.download, exportFilename(type, outputs))
    pushUrl(outputs.cover?.export?.url, exportFilename(type === 'cover_revise' ? 'cover_revise' : 'cover_generate', outputs.cover?.export))
    // A+ module SVGs only when that job was requested (ad_script also returns modules — skip auto-dl)
    if (type === 'aplus_module' && Array.isArray(outputs.modules)) {
      for (const mod of outputs.modules) {
        pushUrl(mod?.export?.url, exportFilename(`aplus-${mod.type || 'module'}`, mod?.export))
      }
    }
    for (const item of urls) {
      if (await downloadExportUrl(item.url, item.name)) downloaded += 1
    }
    let storefrontHref = ''
    if (type === 'storefront_publish' && outputs.storefront?.slug) {
      storefrontHref = `/?view=store&slug=${encodeURIComponent(outputs.storefront.slug)}`
      window.open(storefrontHref, '_blank', 'noopener,noreferrer')
    }
    return { downloaded, storefrontHref }
  }

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
      await refreshLibrary()
      const { downloaded, storefrontHref } = await consumeJobOutputs(type, done.outputs)
      const isExportJob =
        String(type).startsWith('export_') || type === 'cover_wrap' || type === 'cover_generate' || type === 'cover_revise'
      if (storefrontHref) {
        setMessage(`${type} completed — storefront opened`)
      } else if (downloaded > 0) {
        setMessage(`${type} completed — download started (${downloaded} file${downloaded > 1 ? 's' : ''})`)
      } else if (isExportJob && (done.outputs?.url || done.outputs?.download || done.outputs?.cover?.export?.url)) {
        setMessage(`${type} completed — file ready; use Download below if it did not start`)
      } else if (type === 'ad_script' && done.outputs?.ad_script) {
        setMessage('ad_script completed — script ready below')
      } else if (type === 'metadata_generate') {
        setMessage('metadata_generate completed — edit fields below, then Save')
      } else if (type === 'cover_generate' || type === 'cover_revise') {
        setMessage(`${type} completed — preview below`)
      } else {
        setMessage(`${type} completed`)
      }
      setAssist({ type, outputs: done.outputs, downloaded })
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
      const manuscriptLang = normalizeBookLanguage(primaryLanguage)
      const manuscriptVariety = normalizeBookLanguageVariety(manuscriptLang, primaryVariety)
      const { book: b } = await createBook({
        working_title: 'Untitled non-fiction',
        language: manuscriptLang,
        language_variety: manuscriptVariety,
        wizard_step: 'basics',
      })
      rememberBookId(b.id)
      setBook(b)
      setSectionKey('')
      setEditorText('')
      await refreshLibrary()
      setMessage(
        `Book created (${bookLanguageLabel(manuscriptLang)} · ${bookLanguageVarietyLabel(manuscriptLang, manuscriptVariety)}) — saved to your library`
      )
    } catch (e) {
      setMessage(e.message)
    } finally {
      setBusy('')
    }
  }

  function syncBookListEntry(b) {
    if (!b?.id) return
    setBooks((prev) => {
      const row = {
        id: b.id,
        working_title: b.working_title,
        wizard_step: b.wizard_step,
        status: b.status,
        updated_at: b.updated_at,
        section_count: Object.keys(b.sections || {}).length,
        word_count: Object.values(b.sections || {}).reduce(
          (s, sec) => s + (Number(sec?.word_count) || String(sec?.content_md || '').split(/\s+/).filter(Boolean).length),
          0,
        ),
        chapter_count: (b.outline?.chapters || []).length,
      }
      const idx = prev.findIndex((x) => x.id === b.id)
      if (idx < 0) return [row, ...prev]
      const next = [...prev]
      next[idx] = { ...next[idx], ...row }
      return next
    })
  }

  async function saveNow() {
    if (!book) return
    setBusy('save')
    try {
      const patch = collectWizardPatch(book)
      let latest = book
      if (patch) {
        const saved = await saveBasics(patch)
        if (saved) latest = saved
      }
      if (sectionKey) {
        const r = await saveSection(latest.id, sectionKey, editorText)
        latest = r.book
        setBook(latest)
        syncBookListEntry(latest)
      }
      rememberBookId(latest.id)
      await refreshLibrary()
      setSavedFlash(true)
      setTimeout(() => setSavedFlash(false), 2000)
      setMessage('Book saved to your library — reopen anytime from the left rail.')
    } catch (e) {
      setMessage(e.message || 'Save failed')
    } finally {
      setBusy('')
    }
  }

  async function downloadBookBackup() {
    if (!book?.id) return
    try {
      const { book: full } = await getBook(book.id)
      const payload = {
        format: 'authorforge-book-backup',
        version: 1,
        exported_at: new Date().toISOString(),
        book: full,
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const slug =
        String(full.working_title || 'book')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          .slice(0, 40) || 'book'
      a.href = url
      a.download = `authorforge-${slug}-backup.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setMessage('Backup downloaded — import it later to restore this book.')
    } catch (e) {
      setMessage(e.message || 'Backup failed')
    }
  }

  async function onImportBackupFile(file) {
    if (!file) return
    setBusy('import')
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const { book: imported } = await importBook(parsed)
      rememberBookId(imported.id)
      await refreshLibrary()
      await loadBook(imported.id)
      setMessage(`Imported “${imported.working_title}” into your library`)
    } catch (e) {
      setMessage(e.message || 'Import failed — use an AuthorForge backup JSON file')
    } finally {
      setBusy('')
      if (importRef.current) importRef.current.value = ''
    }
  }

  /** Flush visible wizard inputs before Next/Back — blur-only save was dropping titles. */
  function collectWizardPatch(current) {
    const form = document.getElementById('af-wizard-form')
    if (!form || !current) return null
    const fd = new FormData(form)
    const patch = {}
    const str = (key) => {
      if (!fd.has(key)) return null
      return String(fd.get(key) ?? '')
    }
    const wt = str('working_title')
    if (wt != null && wt.trim()) patch.working_title = wt.trim().slice(0, 200)
    const sub = str('subtitle')
    if (sub != null) patch.subtitle = sub.slice(0, 300)
    const author = str('author_name')
    if (author != null) patch.author_name = author.slice(0, 120)
    const topic = str('topic')
    if (topic != null) patch.topic = topic.slice(0, 4000)
    const tw = str('target_words')
    if (tw != null && tw !== '') {
      const n = Number(tw)
      if (Number.isFinite(n)) patch.target_words = Math.max(500, Math.min(120000, Math.floor(n)))
    }
    const trim = str('trim_size')
    if (trim != null && trim) patch.trim_size = trim
    const usp = str('usp')
    const tone = str('tone')
    if (usp != null || tone != null) {
      patch.bible = {
        ...(current.bible || {}),
        ...(usp != null ? { usp } : {}),
        ...(tone != null ? { tone } : {}),
      }
    }
    return Object.keys(patch).length ? patch : null
  }

  async function saveBasics(patch) {
    if (!book) return null
    try {
      const { book: b } = await patchBook(book.id, patch)
      setBook(b)
      syncBookListEntry(b)
      setMessage('Saved')
      return b
    } catch (e) {
      setMessage(e.message || 'Save failed')
      return null
    }
  }

  async function recoverStaleBook(reason) {
    setMessage(reason || 'Book session expired — reloading…')
    setBook(null)
    try {
      await ensureSession()
      const list = await listBooks()
      setBooks(list.books || [])
      if (list.books?.[0]) {
        await loadBook(list.books[0].id)
        setMessage('Reloaded your latest book. Continue from the wizard steps.')
      } else {
        setMessage('Server restarted with an empty library. Click “New book” to start again.')
      }
    } catch (e) {
      setMessage(e.message || 'Could not recover session')
    }
  }

  async function navigateWizard(dir, stepId) {
    if (!book) return
    try {
      const patch = collectWizardPatch(book)
      if (patch) {
        const saved = await saveBasics(patch)
        if (!saved && patch.working_title) return
      }
      const r = await stepBook(book.id, dir, stepId)
      if (!r?.book) throw new Error('Could not update wizard step')
      setBook(r.book)
      syncBookListEntry(r.book)
      setMessage('')
    } catch (e) {
      if (e.status === 404 || e.code === 'not_found' || /not found/i.test(e.message || '')) {
        await recoverStaleBook('Book not found (server restarted). Reloading…')
        return
      }
      setMessage(e.message || 'Navigation failed — try again')
    }
  }

  async function onDeleteBook(id) {
    if (!id) return
    if (!window.confirm('Delete this book permanently from your library?')) return
    try {
      await deleteBook(id)
      if (recalledBookId() === id) {
        try {
          localStorage.removeItem(LAST_BOOK_KEY)
        } catch {
          /* ignore */
        }
      }
      const rest = (await refreshLibrary()).filter((b) => b.id !== id)
      if (book?.id === id) {
        if (rest[0]) await loadBook(rest[0].id)
        else {
          setBook(null)
          setSectionKey('')
          setEditorText('')
        }
      }
      setMessage('Book removed from library')
    } catch (e) {
      setMessage(e.message || 'Delete failed')
    }
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
        <p className="badge" style={{ marginTop: '0.45rem', display: 'inline-block' }}>
          {t(lang, 'categoryBadge')}
        </p>
        <p className="muted" style={{ marginTop: '0.35rem' }}>
          {t(lang, 'tagline')}
        </p>
        <p className="muted" style={{ marginTop: '0.5rem', fontSize: '0.72rem' }}>
          {t(lang, 'hybridHint')}
        </p>
        <div className="field" style={{ marginTop: '1rem' }}>
          <label htmlFor="af-new-book-lang">Primary language</label>
          <select
            id="af-new-book-lang"
            value={primaryLanguage}
            onChange={(e) => onPrimaryLanguageChange(e.target.value)}
            disabled={!!busy}
            aria-label="Primary manuscript language for new book"
          >
            {BOOK_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label} ({l.nativeLabel})
              </option>
            ))}
          </select>
          {bookLanguageVarieties(primaryLanguage).length > 1 ? (
            <>
              <label htmlFor="af-new-book-variety" style={{ marginTop: '0.5rem' }}>
                Variety
              </label>
              <select
                id="af-new-book-variety"
                value={primaryVariety}
                onChange={(e) =>
                  setPrimaryVariety(normalizeBookLanguageVariety(primaryLanguage, e.target.value))
                }
                disabled={!!busy}
                aria-label="Language variety for new book"
              >
                {bookLanguageVarieties(primaryLanguage).map((v) => (
                  <option key={v.code} value={v.code}>
                    {v.label}
                  </option>
                ))}
              </select>
            </>
          ) : null}
          <p className="muted" style={{ fontSize: '0.7rem', marginTop: '0.35rem' }}>
            {bookLanguageCultureHint(primaryLanguage)}
          </p>
        </div>
        <button type="button" className="btn btn-primary" style={{ width: '100%', marginTop: '0.65rem' }} onClick={onNewBook} disabled={!!busy}>
          {t(lang, 'newBook')}
        </button>
        <div className="row" style={{ marginTop: '0.65rem', gap: '0.35rem' }}>
          <button
            type="button"
            className="btn"
            style={{ flex: 1 }}
            disabled={!!busy}
            onClick={() => importRef.current?.click()}
            title="Import a saved book backup"
          >
            <Upload size={14} /> Import
          </button>
          <input
            ref={importRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => onImportBackupFile(e.target.files?.[0])}
          />
        </div>
        <h3 style={{ marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--af-muted)' }}>
          Library {books?.length ? `(${books.length})` : ''}
        </h3>
        <p className="muted" style={{ margin: '0.25rem 0 0.65rem', fontSize: '0.72rem' }}>
          {persistOn
            ? 'Books stay saved on this studio. Open one anytime to edit or continue.'
            : 'Persistence is off — export a backup before restarting.'}
        </p>
        <div className="library-list">
          {(books || []).length === 0 ? (
            <p className="muted" style={{ fontSize: '0.78rem' }}>
              No saved books yet. Create one or import a backup.
            </p>
          ) : (
            (books || []).map((b) => {
              const stepTitle = WIZARD_STEPS.find((s) => s.id === b.wizard_step)?.title || b.wizard_step
              return (
                <div key={b.id} className={`library-item ${book?.id === b.id ? 'active' : ''}`}>
                  <button
                    type="button"
                    className="library-open"
                    onClick={() => loadBook(b.id)}
                    title={b.working_title}
                  >
                    <span className="library-title">
                      {b.working_title || 'Untitled'}
                      {b.language ? (
                        <span className="muted" style={{ fontWeight: 400 }}>
                          {' '}
                          · {String(b.language).toUpperCase()}
                        </span>
                      ) : null}
                    </span>
                    <span className="library-meta">
                      {stepTitle}
                      {b.word_count ? ` · ${b.word_count.toLocaleString()}w` : ''}
                      {b.section_count ? ` · ${b.section_count} sec` : ''}
                    </span>
                    {b.updated_at ? (
                      <span className="library-meta">{formatUpdated(b.updated_at)}</span>
                    ) : null}
                  </button>
                  <button
                    type="button"
                    className="btn library-delete"
                    title="Delete book"
                    aria-label={`Delete ${b.working_title || 'book'}`}
                    onClick={() => onDeleteBook(b.id)}
                  >
                    ×
                  </button>
                </div>
              )
            })
          )}
        </div>
        <h3 style={{ marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--af-muted)' }}>Wizard</h3>
        <ul className="step-list">
          {WIZARD_STEPS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className={s.id === step ? 'active' : stepIndexDone(step, s.id) ? 'done' : ''}
                onClick={() => navigateWizard('set', s.id)}
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
            {book ? (
              <span className="muted">
                {' '}
                · {bookLanguageLabel(book.language)}
                {book.language_variety
                  ? ` · ${bookLanguageVarietyLabel(book.language, book.language_variety)}`
                  : ''}
              </span>
            ) : null}
            <span className="badge">{stepMeta.title}</span>
            {savedFlash ? <span className="badge">Saved</span> : null}
          </div>
          <div className="row">
            <button
              type="button"
              className="btn btn-primary"
              disabled={!book || !!busy}
              onClick={saveNow}
              title="Save this book to your library"
            >
              <Save size={14} /> Save book
            </button>
            <button
              type="button"
              className="btn"
              disabled={!book || !!busy}
              onClick={downloadBookBackup}
              title="Download a JSON backup you can import later"
            >
              <Download size={14} /> Backup
            </button>
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
              <p>Create a non-fiction book to start the guided wizard.</p>
              <div className="field" style={{ maxWidth: 320, margin: '0.85rem 0' }}>
                <label htmlFor="af-empty-book-lang">Primary language</label>
                <select
                  id="af-empty-book-lang"
                  value={primaryLanguage}
                  onChange={(e) => onPrimaryLanguageChange(e.target.value)}
                  disabled={!!busy}
                  aria-label="Primary manuscript language for new book"
                >
                  {BOOK_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label} ({l.nativeLabel})
                    </option>
                  ))}
                </select>
                {bookLanguageVarieties(primaryLanguage).length > 1 ? (
                  <>
                    <label htmlFor="af-empty-book-variety" style={{ marginTop: '0.5rem' }}>
                      Variety
                    </label>
                    <select
                      id="af-empty-book-variety"
                      value={primaryVariety}
                      onChange={(e) =>
                        setPrimaryVariety(normalizeBookLanguageVariety(primaryLanguage, e.target.value))
                      }
                      disabled={!!busy}
                      aria-label="Language variety for new book"
                    >
                      {bookLanguageVarieties(primaryLanguage).map((v) => (
                        <option key={v.code} value={v.code}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                  </>
                ) : null}
                <p className="muted" style={{ fontSize: '0.7rem', marginTop: '0.35rem' }}>
                  {bookLanguageCultureHint(primaryLanguage)}
                </p>
              </div>
              <button type="button" className="btn btn-primary" onClick={onNewBook} disabled={!!busy}>
                {t(lang, 'newBook')}
              </button>
              <PositioningCallout lang={lang} />
            </div>
          ) : (
            <WizardStep
              step={step}
              book={book}
              busy={busy}
              assist={assist}
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
              onDownloadExport={(url, typeHint) =>
                downloadExportUrl(url, exportFilename(typeHint || assist?.type || 'export', assist?.outputs || {}))
              }
              onSaveSection={async (extras = {}) => {
                const r = await saveSection(book.id, sectionKey, editorText, extras)
                setBook(r.book)
                setMessage(
                  extras.section_role
                    ? `Section saved · role: ${extras.section_role}`
                    : 'Section saved (human edit)',
                )
              }}
              onFillSlot={(i, text) => fillStorySlot(book.id, i, text).then((r) => setBook(r.book))}
              onConfirmClaim={(i) => updateClaim(book.id, i, 'user_confirmed').then((r) => setBook(r.book))}
              onCompliance={async (body) => {
                try {
                  const r = await saveCompliance(book.id, body)
                  setBook(r.book)
                  setMessage(
                    body.export_override
                      ? 'Launch readiness saved (export override noted)'
                      : body.passed
                        ? 'Launch readiness — required items complete'
                        : 'Launch readiness progress saved',
                  )
                } catch (e) {
                  setMessage(e.message || 'Compliance save failed')
                }
              }}
              onInlineAction={async ({ instruction, selection }) => {
                const out = await runJob('inline_edit', { instruction, selection })
                return out
              }}
              onNav={(dir) => navigateWizard(dir)}
              onMessage={setMessage}
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
          {t(lang, 'assistantIdle')}
        </p>
        <StepAssistant
          assist={assist}
          busy={busy}
          canSuggest={!!book}
          idleCopy={t(lang, 'assistantIdle')}
          onSuggestTitles={() => runJob('title_variations', { seed: book?.working_title })}
          onApplyTitle={async (opt) => {
            if (!opt?.title) return
            await saveBasics({
              working_title: String(opt.title).slice(0, 200),
              subtitle: String(opt.subtitle || '').slice(0, 300),
            })
            setMessage(`Applied title: ${opt.title}`)
          }}
          onApplyAngle={async (angle) => {
            if (!book || !angle) return
            await saveBasics(applyAngleToBookPatch(angle, book))
            setMessage(`Selected positioning: ${angle.name || angle.strategy_label || 'angle'}`)
          }}
          onDownload={(url) => {
            if (!url) return
            downloadExportUrl(url, exportFilename(assist?.type || 'export', assist?.outputs || {}))
          }}
        />
      </aside>
    </div>
  )
}

function PositioningCallout({ lang = 'en', book, onApplyNiche }) {
  const copy = productCopy(lang)
  const activeId = book?.bible?.recommended_niche_id || ''
  return (
    <div className="position-callout" role="note">
      <p className="position-callout-lead">
        <strong>{copy.categoryLabel}.</strong> {t(lang, 'positioningLead')}
      </p>
      <p className="muted" style={{ margin: '0 0 0.65rem', fontSize: '0.78rem' }}>
        {copy.strategyLine}
      </p>
      <div className="position-callout-grid">
        <div>
          <h3>{copy.forLabel}</h3>
          <ul>
            {copy.forLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>{copy.notLabel}</h3>
          <ul>
            {copy.notLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
      <h3 style={{ margin: '0.85rem 0 0.4rem' }}>{t(lang, 'nichesHeading')}</h3>
      <ul className="niche-list">
        {RECOMMENDED_NICHES.map((raw) => {
          const niche = nicheLocalized(raw, lang)
          const isAf = niche.studio === 'authorforge'
          const selected = activeId === niche.id
          return (
            <li key={niche.id} className={selected ? 'niche-item niche-item-active' : 'niche-item'}>
              <div className="niche-item-head">
                <span className="badge">#{niche.priority}</span>
                <strong>{niche.title}</strong>
                <span className="muted" style={{ fontSize: '0.7rem' }}>
                  {isAf ? 'AuthorForge' : 'StoryForge'}
                </span>
              </div>
              <p className="muted" style={{ margin: '0.35rem 0', fontSize: '0.75rem' }}>
                {niche.angle}
              </p>
              <p className="muted" style={{ margin: '0 0 0.5rem', fontSize: '0.72rem' }}>
                {niche.why}
              </p>
              {isAf && onApplyNiche ? (
                <button
                  type="button"
                  className={selected ? 'btn btn-primary' : 'btn'}
                  style={{ minHeight: 44 }}
                  onClick={() => onApplyNiche(niche.id)}
                >
                  {selected ? '✓ ' : ''}
                  {copy.applyNiche}
                </button>
              ) : (
                <p className="muted" style={{ margin: 0, fontSize: '0.72rem' }}>
                  {isAf
                    ? t(lang, 'applyNicheHint') ||
                      'Create or open a book, then tap Use this niche to seed title, USP, and audience.'
                    : `${copy.storyforgeOnly} — ${t(lang, 'hybridHint')}`}
                </p>
              )}
            </li>
          )
        })}
      </ul>
      <p className="muted" style={{ margin: '0.65rem 0 0', fontSize: '0.72rem' }}>
        {copy.hybridHint}
      </p>
      <p className="warn" style={{ margin: '0.35rem 0 0', fontSize: '0.72rem' }}>
        {t(lang, 'marketDisclaimer') || MARKET_DISCLAIMER}
      </p>
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

function MetadataPanel({ book, busy, assist, onRunJob, onSaveBasics }) {
  const meta = book?.metadata || {}
  const disclosure = book?.compliance?.ai_disclosure || {}
  const [description, setDescription] = useState(meta.description_html || '')
  const [keywords, setKeywords] = useState((meta.keywords || []).join(', '))
  const [categories, setCategories] = useState((meta.categories || []).join(', '))
  const [backCopy, setBackCopy] = useState(meta.back_cover_copy || '')
  const [usedAiText, setUsedAiText] = useState(disclosure.used_ai_text !== false)
  const [usedAiImages, setUsedAiImages] = useState(!!disclosure.used_ai_images)
  const [disclosureNote, setDisclosureNote] = useState(
    disclosure.note || 'Disclose AI-assisted text (and images if used) at KDP upload when required.',
  )

  useEffect(() => {
    const m = book?.metadata || {}
    const d = book?.compliance?.ai_disclosure || {}
    setDescription(m.description_html || '')
    setKeywords((m.keywords || []).join(', '))
    setCategories((m.categories || []).join(', '))
    setBackCopy(m.back_cover_copy || '')
    setUsedAiText(d.used_ai_text !== false)
    setUsedAiImages(!!d.used_ai_images)
    setDisclosureNote(
      d.note || 'Disclose AI-assisted text (and images if used) at KDP upload when required.',
    )
  }, [book?.id, book?.metadata, book?.compliance?.ai_disclosure])

  const warnings =
    assist?.type === 'metadata_generate' && Array.isArray(assist?.outputs?.warnings)
      ? assist.outputs.warnings
      : []

  async function saveManual() {
    const kw = keywords
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 7)
    const cats = categories
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3)
    await onSaveBasics({
      metadata: {
        ...(book.metadata || {}),
        description_html: description.slice(0, 8000),
        keywords: kw,
        categories: cats,
        back_cover_copy: backCopy.slice(0, 2000),
      },
      compliance: {
        ...(book.compliance || {}),
        ai_disclosure: {
          ...(book.compliance?.ai_disclosure || {}),
          used_ai_text: usedAiText,
          used_ai_images: usedAiImages,
          note: disclosureNote.slice(0, 500),
        },
      },
    })
  }

  return (
    <div className="card">
      <h2>Metadata & description</h2>
      <p className="muted" style={{ marginBottom: '0.75rem' }}>
        Draft the KDP product description, 7 keywords, and categories from this book — then edit and save.
        Never invent reviews, rankings, or credentials.
      </p>
      <div className="row" style={{ marginBottom: '0.75rem' }}>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!!busy}
          onClick={() => onRunJob('metadata_generate')}
        >
          Generate metadata + AI disclosure helper
        </button>
        <button type="button" className="btn" disabled={!!busy} onClick={saveManual}>
          Save metadata
        </button>
      </div>
      {warnings.map((w) => (
        <p key={w} className="warn" style={{ marginTop: 0 }}>
          {w}
        </p>
      ))}
      <div className="field">
        <label htmlFor="af-desc">Description (HTML subset)</label>
        <textarea
          id="af-desc"
          rows={8}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="<p>Your Amazon description…</p>"
        />
      </div>
      <div className="field">
        <label htmlFor="af-keywords">Keywords (7, comma-separated)</label>
        <input
          id="af-keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="courage, children, emotions, …"
        />
      </div>
      <div className="field">
        <label htmlFor="af-categories">Categories (3, comma-separated)</label>
        <input
          id="af-categories"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          placeholder="Children's Books, Education & Teaching, …"
        />
      </div>
      <div className="field">
        <label htmlFor="af-back">Back cover copy</label>
        <textarea
          id="af-back"
          rows={4}
          value={backCopy}
          onChange={(e) => setBackCopy(e.target.value)}
          placeholder="Short back-cover blurb…"
        />
      </div>
      <h3 style={{ marginTop: '1rem', fontSize: '1rem' }}>AI disclosure helper</h3>
      <p className="muted" style={{ marginBottom: '0.5rem' }}>
        Reminder for KDP upload — you confirm what applies.
      </p>
      <label className="row" style={{ gap: '0.5rem', marginBottom: '0.35rem' }}>
        <input type="checkbox" checked={usedAiText} onChange={(e) => setUsedAiText(e.target.checked)} />
        Used AI for text
      </label>
      <label className="row" style={{ gap: '0.5rem', marginBottom: '0.35rem' }}>
        <input type="checkbox" checked={usedAiImages} onChange={(e) => setUsedAiImages(e.target.checked)} />
        Used AI for images
      </label>
      <div className="field">
        <label htmlFor="af-disclosure-note">Disclosure note</label>
        <input
          id="af-disclosure-note"
          value={disclosureNote}
          onChange={(e) => setDisclosureNote(e.target.value)}
        />
      </div>
      {description ? (
        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>Preview</h3>
          <div className="meta-preview">
            <p className="muted" style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
              {description
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<\/p>/gi, '\n\n')
                .replace(/<[^>]+>/g, '')
                .trim()}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function CoverStudioPanel({ book, busy, assist, onRunJob, onDownloadExport }) {
  const covers = book?.covers || []
  const latestCover = covers.length ? covers[covers.length - 1] : null
  const coverUrl =
    (assist?.type === 'cover_generate' || assist?.type === 'cover_revise'
      ? assist?.outputs?.download || assist?.outputs?.cover?.export?.url
      : null) || latestCover?.export?.url
  const coverMeta = assist?.outputs?.cover || latestCover
  const wrapUrl =
    assist?.type === 'cover_wrap' && assist?.outputs?.url ? assist.outputs.url : null
  const wrapMeta = assist?.type === 'cover_wrap' ? assist.outputs?.meta : null
  const modules =
    assist?.type === 'aplus_module' && Array.isArray(assist?.outputs?.modules)
      ? assist.outputs.modules
      : []
  const adScript =
    assist?.type === 'ad_script' && assist?.outputs?.ad_script ? assist.outputs.ad_script : ''

  return (
    <div className="card">
      <h2>Cover studio</h2>
      <p className="muted" style={{ marginBottom: '0.75rem' }}>
        Generate a front cover SVG, then export the KDP wrap PDF. A+ modules and ad script download or
        appear below when ready.
      </p>
      <div className="row">
        <button
          type="button"
          className="btn btn-primary"
          disabled={!!busy}
          onClick={() => onRunJob('cover_generate')}
        >
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

      {coverUrl ? (
        <div className="cover-result" style={{ marginTop: '1rem' }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>Front cover</h3>
          {coverMeta?.warning ? <p className="warn">{coverMeta.warning}</p> : null}
          {coverMeta?.legibility != null ? (
            <p className="muted" style={{ margin: '0 0 0.5rem' }}>
              Thumbnail legibility: {Number(coverMeta.legibility).toFixed(2)}
              {coverMeta.typography_ok === false ? ' · typography needs review' : ' · typography OK'}
            </p>
          ) : null}
          <div className="cover-preview">
            <img src={coverUrl} alt={coverMeta?.title || book?.working_title || 'Cover preview'} />
          </div>
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: '0.75rem' }}
            onClick={() => onDownloadExport?.(coverUrl, 'cover_generate')}
          >
            Download cover SVG
          </button>
        </div>
      ) : (
        <p className="muted" style={{ marginTop: '1rem' }}>
          No cover yet — click Generate cover to create one.
        </p>
      )}

      {wrapUrl ? (
        <div style={{ marginTop: '1.25rem' }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>Cover wrap PDF</h3>
          {wrapMeta?.pageCount != null ? (
            <p className="muted" style={{ margin: '0 0 0.5rem' }}>
              Based on {wrapMeta.pageCount} interior pages
              {wrapMeta.layout?.spinePt != null
                ? ` · spine ~${(Number(wrapMeta.layout.spinePt) / 72).toFixed(3)} in`
                : ''}
            </p>
          ) : null}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onDownloadExport?.(wrapUrl, 'cover_wrap')}
          >
            Download wrap PDF
          </button>
        </div>
      ) : null}

      {modules.length ? (
        <div style={{ marginTop: '1.25rem' }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>A+ modules</h3>
          <ul className="assist-simple">
            {modules.map((m) => (
              <li key={m.type}>
                <span style={{ textTransform: 'capitalize' }}>{String(m.type).replace(/_/g, ' ')}</span>
                {m.export?.url ? (
                  <>
                    {' · '}
                    <button
                      type="button"
                      className="btn"
                      onClick={() => onDownloadExport?.(m.export.url, `aplus-${m.type}`)}
                    >
                      Download
                    </button>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {adScript ? (
        <div style={{ marginTop: '1.25rem' }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>Ad script</h3>
          <pre
            className="muted"
            style={{
              whiteSpace: 'pre-wrap',
              margin: 0,
              padding: '0.75rem',
              border: '1px solid var(--af-border)',
              borderRadius: 8,
            }}
          >
            {adScript}
          </pre>
          <button
            type="button"
            className="btn"
            style={{ marginTop: '0.5rem' }}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(adScript)
              } catch {
                /* ignore */
              }
            }}
          >
            Copy ad script
          </button>
        </div>
      ) : null}
    </div>
  )
}

function WizardStep(props) {
  const {
    step,
    book,
    busy,
    assist,
    onSaveBasics,
    onNav,
    onRunJob,
    onDownloadExport,
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
    onMessage,
    lang = 'en',
  } = props

  const [translateTarget, setTranslateTarget] = useState(() =>
    normalizeBookLanguage(book?.language === 'en' ? 'de' : 'en')
  )
  const [translateVariety, setTranslateVariety] = useState(() =>
    normalizeBookLanguageVariety(book?.language === 'en' ? 'de' : 'en')
  )

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

      <form id="af-wizard-form" onSubmit={(e) => e.preventDefault()}>
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
        <CompetitiveAdvantagePanel
          book={book}
          busy={busy}
          assist={assist}
          costLabel={`${costFor('competitive_analysis')} cr`}
          onRunJob={onRunJob}
          onSaveBasics={onSaveBasics}
          onMessage={onMessage}
        />
      )}

      {(step === 'basics' || step === 'positioning' || step === 'title_opt' || step === 'details' || step === 'bio') && (
        <div className="card">
          <h2>{step === 'basics' ? 'Book Basics' : step}</h2>
          {step === 'basics' ? (
            <PositioningCallout
              lang={lang}
              book={book}
              onApplyNiche={async (nicheId) => {
                const patch = applyRecommendedNiche(nicheId, lang)
                if (!patch) return
                await onSaveBasics(patch)
                onMessage?.(`Applied niche — review title, USP, and audience, then continue.`)
              }}
            />
          ) : null}
          {step === 'positioning' && book.bible?.selected_angle ? (
            <p className="competitive-panel__selected" style={{ marginBottom: '1rem' }}>
              From Competitive Advantage:{' '}
              <strong>
                {book.bible.selected_angle.strategy_label || book.bible.selected_angle.name}
              </strong>
              {book.bible.selected_angle.unique_value
                ? ` — ${book.bible.selected_angle.unique_value}`
                : null}
            </p>
          ) : null}
          <div className="grid-2">
            <div className="field">
              <label>Working title</label>
              <input
                key={`${book.id}-title-${book.bible?.recommended_niche_id || 'x'}-${book.working_title}`}
                name="working_title"
                defaultValue={book.working_title}
                onBlur={(e) => onSaveBasics({ working_title: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor={`af-book-lang-${book.id}`}>Primary language</label>
              <select
                id={`af-book-lang-${book.id}`}
                key={`${book.id}-lang-${book.language}`}
                value={normalizeBookLanguage(book.language)}
                onChange={(e) => {
                  const next = normalizeBookLanguage(e.target.value)
                  onSaveBasics({
                    language: next,
                    language_variety: normalizeBookLanguageVariety(next),
                  })
                }}
                disabled={!!busy}
                aria-label="Primary manuscript language"
              >
                {BOOK_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label} ({l.nativeLabel})
                  </option>
                ))}
              </select>
              {bookLanguageVarieties(book.language).length > 1 ? (
                <>
                  <label htmlFor={`af-book-variety-${book.id}`} style={{ marginTop: '0.5rem' }}>
                    Variety
                  </label>
                  <select
                    id={`af-book-variety-${book.id}`}
                    key={`${book.id}-variety-${book.language_variety}`}
                    value={normalizeBookLanguageVariety(book.language, book.language_variety)}
                    onChange={(e) =>
                      onSaveBasics({
                        language_variety: normalizeBookLanguageVariety(book.language, e.target.value),
                      })
                    }
                    disabled={!!busy}
                    aria-label="Language variety"
                  >
                    {bookLanguageVarieties(book.language).map((v) => (
                      <option key={v.code} value={v.code}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </>
              ) : null}
              <p className="muted" style={{ fontSize: '0.72rem', marginTop: '0.35rem' }}>
                AI drafts this book in {bookLanguageLabel(book.language)}
                {book.language_variety
                  ? ` (${bookLanguageVarietyLabel(book.language, book.language_variety)})`
                  : ''}
                .
              </p>
              <p className="muted" style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>
                {bookLanguageCultureHint(book.language)}
              </p>
            </div>
            <div className="field">
              <label>Subtitle</label>
              <input
                key={`${book.id}-subtitle-${book.bible?.recommended_niche_id || 'x'}`}
                name="subtitle"
                defaultValue={book.subtitle || ''}
                onBlur={(e) => onSaveBasics({ subtitle: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Author name (real)</label>
              <input
                key={`${book.id}-author`}
                name="author_name"
                defaultValue={book.author_name || ''}
                onBlur={(e) => onSaveBasics({ author_name: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Topic</label>
              <input
                key={`${book.id}-topic-${book.bible?.recommended_niche_id || 'x'}`}
                name="topic"
                defaultValue={book.topic || ''}
                onBlur={(e) => onSaveBasics({ topic: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Target words</label>
              <input
                key={`${book.id}-words-${book.bible?.recommended_niche_id || 'x'}`}
                name="target_words"
                type="number"
                min={500}
                max={120000}
                defaultValue={book.target_words}
                onBlur={(e) => onSaveBasics({ target_words: Number(e.target.value) || 28000 })}
              />
            </div>
            <div className="field">
              <label>Trim size</label>
              <select
                key={`${book.id}-trim-${book.bible?.recommended_niche_id || 'x'}`}
                name="trim_size"
                defaultValue={book.trim_size}
                onChange={(e) => onSaveBasics({ trim_size: e.target.value })}
              >
                <option value="5x8">5 × 8</option>
                <option value="5.5x8.5">5.5 × 8.5</option>
                <option value="6x9">6 × 9</option>
                <option value="8.5x11">8.5 × 11 (workbook)</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>USP / what stands out</label>
            <textarea
              key={`${book.id}-usp-${book.bible?.recommended_niche_id || 'x'}`}
              name="usp"
              defaultValue={book.bible?.usp || ''}
              onBlur={(e) => onSaveBasics({ bible: { ...book.bible, usp: e.target.value } })}
            />
          </div>
          <div className="field">
            <label>Tone</label>
            <input
              key={`${book.id}-tone-${book.bible?.recommended_niche_id || 'x'}`}
              name="tone"
              defaultValue={book.bible?.tone || ''}
              onBlur={(e) => onSaveBasics({ bible: { ...book.bible, tone: e.target.value } })}
            />
          </div>
          <div className="field">
            <label>Ideal reader / audience</label>
            <textarea
              key={`${book.id}-audience-${book.bible?.recommended_niche_id || 'x'}`}
              name="audience"
              defaultValue={book.bible?.audience || book.bible?.ideal_reader || ''}
              onBlur={(e) =>
                onSaveBasics({
                  bible: {
                    ...book.bible,
                    audience: e.target.value,
                    ideal_reader: e.target.value,
                  },
                })
              }
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
          <p className="muted">
            Mock/licensed metadata only — not live Amazon scrape. Click Fetch comps, then Next to continue.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!!busy}
            onClick={async () => {
              const out = await onRunJob('competitive_analysis', {
                topic: book.topic || book.working_title,
              })
              const titles = out?.meta?.titles
              if (titles?.length) {
                await onSaveBasics({ competitors: titles })
              } else if (out) {
                onMessage?.('No comparable titles returned — you can still continue with Next.')
              }
            }}
          >
            Fetch comps
          </button>
          {(book.competitors || []).length ? (
            <ul>
              {(book.competitors || []).map((c) => (
                <li key={c.asin || c.title}>
                  {c.title} — <span className="muted">est. only</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted" style={{ marginTop: '0.75rem' }}>
              No comps loaded yet.
            </p>
          )}
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
          <h3 style={{ marginTop: '1.25rem' }}>Bring your own manuscript</h3>
          <p className="muted">
            Paste Markdown or plain text. Chapters are detected from headings (`# Title`, `Chapter 1`,
            ALL CAPS). Preview structure, then import (replaces sections if you confirm).
          </p>
          <ManuscriptImport book={book} busy={busy} onRunJob={onRunJob} onMessage={onMessage} />
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
          <p className="muted">
            Full outline in one pass, or step-by-step: chapters first, then expand each chapter into
            sections.
          </p>
          <div className="row" style={{ marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!!busy}
              onClick={() => onRunJob('outline_generate')}
            >
              Generate full outline ({costFor('outline_generate')} cr)
            </button>
            <button
              type="button"
              className="btn"
              disabled={!!busy}
              onClick={() => onRunJob('outline_generate', { mode: 'chapters_only' })}
            >
              Chapters only (step-by-step)
            </button>
          </div>
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
                    onClick={() => onRunJob('outline_expand_chapter', { chapterIndex: i })}
                  >
                    Expand sections ({costFor('outline_expand_chapter')} cr)
                  </button>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      {(step === 'writing' || step === 'edit_verify') && (
        <div className="card">
          <h2>{step === 'writing' ? 'Writing' : 'Edit & Verify'}</h2>
          <div className="row" style={{ marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <select value={sectionKey} onChange={(e) => setSectionKey(e.target.value)}>
              {leafNodes.map(({ key, node }) => (
                <option key={key} value={key}>
                  {node.title}
                </option>
              ))}
            </select>
            <label className="muted" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              Kindle Create role
              <select
                aria-label="Section role for Kindle Create"
                value={
                  book.sections?.[sectionKey]?.section_role ||
                  inferSectionRole(
                    book.sections?.[sectionKey]?.title ||
                      leafNodes.find((l) => l.key === sectionKey)?.node?.title,
                  )
                }
                disabled={!!busy || !sectionKey}
                onChange={(e) => onSaveSection({ section_role: e.target.value })}
              >
                {SECTION_ROLE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
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
            <button type="button" className="btn" onClick={() => onSaveSection()}>
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
              <h3>Claims & sources</h3>
              {(book.claims || []).map((c, i) => (
                <div key={i} style={{ marginBottom: '0.75rem' }}>
                  <div className="row" style={{ marginBottom: '0.25rem' }}>
                    <span className="muted">
                      [{c.verification_status}] {c.text}
                    </span>
                    <button type="button" className="btn" onClick={() => onConfirmClaim(i)}>
                      I confirm
                    </button>
                  </div>
                  {(c.evidence || []).length ? (
                    <ul className="assist-simple" style={{ margin: 0 }}>
                      {c.evidence.slice(0, 3).map((e) => (
                        <li key={e.url || e.title}>
                          {e.url ? (
                            <a href={e.url} target="_blank" rel="noopener noreferrer">
                              {e.title || e.url}
                            </a>
                          ) : (
                            e.title || 'Source'
                          )}
                          {e.snippet ? <div className="muted">{e.snippet}</div> : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="muted" style={{ margin: 0, fontSize: '0.72rem' }}>
                      No evidence links yet — run fact-check (mock never marks verified).
                    </p>
                  )}
                </div>
              ))}
              {assist?.type === 'fact_check_section' && Array.isArray(assist?.outputs?.sweeping) && assist.outputs.sweeping.length ? (
                <div className="card" style={{ marginBottom: '0.75rem' }}>
                  <strong>Sweeping claims</strong>
                  <ul className="assist-simple">
                    {assist.outputs.sweeping.map((s) => (
                      <li key={s.text}>
                        <div>{s.text}</div>
                        <div className="muted">Milder: {s.milder}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {assist?.type === 'finish_repetition_scan' && assist?.outputs ? (
                <div className="card" style={{ marginBottom: '0.75rem' }}>
                  <strong>Finish scan</strong>
                  <p className="muted" style={{ margin: '0.35rem 0' }}>
                    {assist.outputs.note}
                  </p>
                  {(assist.outputs.rewrite_flags || []).length ? (
                    <p className="warn">
                      Rewrite needed:{' '}
                      {assist.outputs.rewrite_flags.map((r) => r.title || r.key).join(', ')}
                    </p>
                  ) : (
                    <p className="ok">No heavy rewrite flags.</p>
                  )}
                  {(assist.outputs.light_fixes || []).length ? (
                    <p className="muted">
                      Light trim: {assist.outputs.light_fixes.map((r) => r.title || r.key).join(', ')}
                    </p>
                  ) : null}
                </div>
              ) : null}
              {assist?.type === 'title_promise_check' && assist?.outputs ? (
                <div className="card" style={{ marginBottom: '0.75rem' }}>
                  <strong>Title promise check</strong>
                  {(assist.outputs.results || []).length ? (
                    <ul className="assist-simple">
                      {assist.outputs.results.map((r) => (
                        <li key={r.phrase}>
                          [{r.status}] {r.message}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="muted">{assist.outputs.note}</p>
                  )}
                </div>
              ) : null}
              <div className="row" style={{ flexWrap: 'wrap', marginTop: '0.5rem' }}>
                <button type="button" className="btn" disabled={!!busy} onClick={() => onRunJob('fact_check_section', { sectionKey })}>
                  Fact-check section ({costFor('fact_check_section')} cr)
                </button>
                <button type="button" className="btn" disabled={!!busy} onClick={() => onRunJob('finish_repetition_scan')}>
                  Finish repetition scan ({costFor('finish_repetition_scan')} cr)
                </button>
                <button type="button" className="btn" disabled={!!busy} onClick={() => onRunJob('title_promise_check')}>
                  Title promise check ({costFor('title_promise_check')} cr)
                </button>
                <button type="button" className="btn" disabled={!!busy} onClick={() => onRunJob('quality_report')}>
                  Quality report
                </button>
                <button type="button" className="btn" disabled={!!busy} onClick={() => onRunJob('originality_scan', { sectionKey })}>
                  Originality scan
                </button>
                <label className="muted" style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                  Translate to
                  <select
                    value={translateTarget}
                    onChange={(e) => {
                      const next = normalizeBookLanguage(e.target.value)
                      setTranslateTarget(next)
                      setTranslateVariety(normalizeBookLanguageVariety(next))
                    }}
                    disabled={!!busy}
                    aria-label="Translation target language"
                    style={{ minHeight: 44 }}
                  >
                    {BOOK_LANGUAGES.filter((l) => l.code !== normalizeBookLanguage(book.language)).map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                  {bookLanguageVarieties(translateTarget).length > 1 ? (
                    <select
                      value={translateVariety}
                      onChange={(e) =>
                        setTranslateVariety(
                          normalizeBookLanguageVariety(translateTarget, e.target.value)
                        )
                      }
                      disabled={!!busy}
                      aria-label="Translation target variety"
                      style={{ minHeight: 44 }}
                    >
                      {bookLanguageVarieties(translateTarget).map((v) => (
                        <option key={v.code} value={v.code}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                  ) : null}
                </label>
                <button
                  type="button"
                  className="btn"
                  disabled={!!busy}
                  onClick={() =>
                    onRunJob('translation_chapter', {
                      sectionKey,
                      target_lang: normalizeBookLanguage(translateTarget),
                      target_variety: normalizeBookLanguageVariety(
                        translateTarget,
                        translateVariety
                      ),
                    })
                  }
                >
                  Translate chapter (AI disclosure)
                </button>
              </div>
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
        <MetadataPanel book={book} busy={busy} assist={assist} onRunJob={onRunJob} onSaveBasics={onSaveBasics} />
      )}

      {step === 'cover' && (
        <CoverStudioPanel
          book={book}
          busy={busy}
          assist={assist}
          onRunJob={onRunJob}
          onDownloadExport={onDownloadExport}
        />
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
          <LaunchReadinessPanel
            book={book}
            busy={busy}
            gate={gate}
            onSaveCompliance={onCompliance}
          />
          <h3 style={{ marginTop: '1.25rem' }}>ProofForge audit</h3>
          <p className="muted">
            Send this manuscript to ProofForge for a whole-book proofread / localization pass
            (accept or reject each finding). Requires local{' '}
            <code>npm run proofforge:dev</code> (:5183). Does not guarantee KDP approval.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!!busy || !book}
            onClick={async () => {
              setBusy('proofforge')
              try {
                const result = await handoffBookToProofForge(book)
                if (result.opened) {
                  setMessage('Opened ProofForge with this manuscript')
                } else {
                  setMessage(result.error || result.reason || 'ProofForge handoff failed')
                }
              } catch (e) {
                setMessage(e.message || 'ProofForge handoff failed')
              } finally {
                setBusy('')
              }
            }}
          >
            Audit in ProofForge
          </button>
          <h3 style={{ marginTop: '1.25rem' }}>Export files</h3>
          <p className="muted" style={{ marginBottom: '0.75rem' }}>
            Each export runs the job, then downloads the file to your computer. Storefront opens the public
            sales page in a new tab. Studio does not upload to Amazon for you.
          </p>
          <p className="muted" style={{ marginBottom: '0.75rem', fontSize: '0.82rem' }}>
            DOCX / KDP ZIP are structured for{' '}
            <a href={KINDLE_CREATE_SPECS.helpUrl} target="_blank" rel="noopener noreferrer">
              Kindle Create
            </a>{' '}
            (Heading 1 + page breaks → HTML TOC / NCX). Open DOCX in Kindle Create to export KPF —
            keep the KCB folder backed up. ZIP includes KINDLE-CREATE-NOTES.txt.
          </p>
          <div className="row">
            <button type="button" className="btn" disabled={!!busy} onClick={() => onRunJob('export_interior_pdf')}>
              Interior PDF
            </button>
            <button type="button" className="btn" disabled={!!busy} onClick={() => onRunJob('export_epub')}>
              EPUB
            </button>
            <button type="button" className="btn" disabled={!!busy} onClick={() => onRunJob('export_docx')}>
              DOCX (Kindle Create)
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
          {assist?.outputs?.url &&
          (String(assist?.type || '').startsWith('export_') || assist?.type === 'cover_wrap') ? (
            <div className="row" style={{ marginTop: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!!busy}
                onClick={() => onDownloadExport?.(assist.outputs.url, assist.type)}
              >
                <Download size={14} /> Download{' '}
                {String(assist.type || 'export')
                  .replace(/^export_/, '')
                  .replace(/_/g, ' ')}
              </button>
              <a
                className="btn"
                href={assist.outputs.url}
                download
                rel="noopener noreferrer"
              >
                Open export link
              </a>
            </div>
          ) : null}
          {book.storefront?.slug ? (
            <p style={{ marginTop: '0.75rem' }}>
              Storefront:{' '}
              <a
                href={`/?view=store&slug=${encodeURIComponent(book.storefront.slug)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open /?view=store&slug={book.storefront.slug}
              </a>
              {book.storefront.status ? ` · ${book.storefront.status}` : ''}
            </p>
          ) : null}
        </div>
      )}
      </form>
    </div>
  )
}
