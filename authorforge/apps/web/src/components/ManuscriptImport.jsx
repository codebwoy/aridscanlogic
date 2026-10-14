import { useState } from 'react'
import { costFor } from '@authorforge/shared'

export default function ManuscriptImport({ book, busy, onRunJob, onMessage }) {
  const [text, setText] = useState('')
  const [preview, setPreview] = useState(null)

  async function runImport(replace) {
    if (!String(text).trim()) {
      onMessage?.('Paste manuscript text first.')
      return
    }
    const hasSections = Object.keys(book?.sections || {}).length > 0
    if (hasSections && !replace) {
      onMessage?.('This book already has sections — use “Replace & import” to overwrite.')
      return
    }
    const out = await onRunJob('import_manuscript', { text, replace: !!replace || !hasSections })
    if (out?.preview) {
      setPreview(out)
      onMessage?.(
        `Imported ${out.chapter_count} chapter${out.chapter_count === 1 ? '' : 's'}${
          out.warnings?.length ? ` — ${out.warnings.join(' ')}` : ''
        }`
      )
    }
  }

  return (
    <div>
      <div className="field">
        <label>Manuscript text / Markdown</label>
        <textarea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={'# Chapter 1\nYour prose…\n\n# Chapter 2\n…'}
        />
      </div>
      <div className="row" style={{ flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!!busy || !text.trim()}
          onClick={() => runImport(false)}
        >
          Import manuscript ({costFor('import_manuscript')} cr)
        </button>
        <button
          type="button"
          className="btn"
          disabled={!!busy || !text.trim()}
          onClick={() => runImport(true)}
        >
          Replace &amp; import
        </button>
      </div>
      {preview?.preview?.length ? (
        <div style={{ marginTop: '0.85rem' }}>
          <p className="muted" style={{ margin: '0 0 0.35rem', fontSize: '0.72rem' }}>
            Import preview
          </p>
          <ol>
            {preview.preview.map((p) => (
              <li key={p.index}>
                <strong>{p.title}</strong> — {p.words}w
                <div className="muted">{p.excerpt}…</div>
              </li>
            ))}
          </ol>
          {(preview.warnings || []).map((w) => (
            <p key={w} className="warn">
              {w}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  )
}
