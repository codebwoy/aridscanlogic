import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import { useEffect, useState } from 'react'

/**
 * Tiptap manuscript editor with inline-agent bubble menu.
 * Suggestions are approve/reject only — never silent overwrite.
 */
export default function BookEditor({
  value = '',
  onChange,
  onInlineAction,
  disabled = false,
}) {
  const [selection, setSelection] = useState('')
  const [menu, setMenu] = useState(null)
  const [suggestion, setSuggestion] = useState(null)
  const [busy, setBusy] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: 'Draft appears here. Edit freely — you are the editor-in-chief.',
      }),
    ],
    content: mdToHtml(value),
    editable: !disabled,
    onUpdate: ({ editor: ed }) => {
      onChange?.(htmlToMd(ed.getHTML()))
    },
    onSelectionUpdate: ({ editor: ed }) => {
      const { from, to } = ed.state.selection
      if (from === to) {
        setMenu(null)
        setSelection('')
        return
      }
      const text = ed.state.doc.textBetween(from, to, ' ')
      setSelection(text)
      const view = ed.view
      const start = view.coordsAtPos(from)
      const end = view.coordsAtPos(to)
      setMenu({
        top: Math.max(8, start.top - 48 + window.scrollY),
        left: (start.left + end.left) / 2 + window.scrollX,
      })
    },
  })

  useEffect(() => {
    if (!editor) return
    const current = htmlToMd(editor.getHTML())
    if (normalize(current) !== normalize(value || '')) {
      editor.commands.setContent(mdToHtml(value || ''), false)
    }
  }, [value, editor])

  async function runAction(instruction) {
    if (!selection || !onInlineAction) return
    setBusy(true)
    try {
      const result = await onInlineAction({ instruction, selection })
      setSuggestion({
        instruction,
        original: selection,
        text: result?.suggestion || result?.content_md || '',
      })
    } finally {
      setBusy(false)
    }
  }

  function approve() {
    if (!editor || !suggestion) return
    const { from, to } = editor.state.selection
    editor.chain().focus().deleteRange({ from, to }).insertContent(suggestion.text).run()
    setSuggestion(null)
    setMenu(null)
  }

  function reject() {
    setSuggestion(null)
  }

  return (
    <div className="book-editor">
      {menu && !suggestion ? (
        <div className="bubble-menu" style={{ top: menu.top, left: menu.left }} role="toolbar">
          <button type="button" className="btn" disabled={busy} onClick={() => runAction('Improve readability')}>
            Improve
          </button>
          <button type="button" className="btn" disabled={busy} onClick={() => runAction('Rephrase')}>
            Rephrase
          </button>
          <button type="button" className="btn" disabled={busy} onClick={() => runAction('Elaborate')}>
            Elaborate
          </button>
          <button
            type="button"
            className="btn"
            disabled={busy}
            onClick={() => runAction('Rewrite qualitatively — no invented statistics')}
          >
            Soften claim
          </button>
        </div>
      ) : null}

      {suggestion ? (
        <div className="card suggest-diff" style={{ marginBottom: '0.75rem' }}>
          <strong>Suggestion ({suggestion.instruction})</strong>
          <div className="grid-2" style={{ marginTop: '0.5rem' }}>
            <div>
              <p className="muted">Original</p>
              <p>{suggestion.original}</p>
            </div>
            <div>
              <p className="muted">Suggested</p>
              <p>{suggestion.text}</p>
            </div>
          </div>
          <div className="row" style={{ marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-primary" onClick={approve}>
              Approve
            </button>
            <button type="button" className="btn" onClick={reject}>
              Reject
            </button>
            <button type="button" className="btn" disabled={busy} onClick={() => runAction(suggestion.instruction)}>
              Regenerate
            </button>
          </div>
        </div>
      ) : null}

      <EditorContent editor={editor} className="editor-area tiptap" />
    </div>
  )
}

function mdToHtml(md) {
  const paras = String(md || '')
    .split(/\n\n+/)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`)
  return paras.join('') || '<p></p>'
}

function htmlToMd(html) {
  return String(html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim()
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function normalize(s) {
  return String(s || '').replace(/\s+/g, ' ').trim()
}
