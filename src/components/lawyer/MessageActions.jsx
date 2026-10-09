import { useState, useEffect } from 'react'
import { Bookmark, BookmarkCheck, Copy, Trash2, Database } from 'lucide-react'
import { toast } from 'sonner'
import {
  saveLawyerResponse,
  findSavedResponse,
  deleteSavedResponse,
  parseMessageTitle,
} from '@/lib/lawyer/savedResponses'
import { addTimelineEvent } from '@/lib/lawyer/caseStore'

export { parseMessageTitle } from '@/lib/lawyer/savedResponses'

export default function MessageActions({
  content,
  userPrompt = '',
  conversationId,
  conversationTitle,
  categoryId,
  fromArchive = false,
  savedId: savedIdProp = null,
  language = 'de',
  onSaved,
  onDeleted,
  onTimelineUpdate,
}) {
  const en = language === 'en'
  const [savedId, setSavedId] = useState(savedIdProp)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setSavedId(savedIdProp)
  }, [savedIdProp])

  useEffect(() => {
    if (savedIdProp || !userPrompt) return
    let cancelled = false
    findSavedResponse(userPrompt, categoryId).then((hit) => {
      if (!cancelled && hit) setSavedId(hit.id)
    })
    return () => {
      cancelled = true
    }
  }, [userPrompt, categoryId, savedIdProp])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      toast.success(en ? 'Copied' : 'Kopiert')
    } catch {
      toast.error(en ? 'Copy failed' : 'Kopieren fehlgeschlagen')
    }
  }

  const saveInsight = async () => {
    if (busy) return
    setBusy(true)
    try {
      if (savedId) {
        toast.info(en ? 'Already saved in archive' : 'Bereits im Archiv gespeichert')
        return
      }
      if (userPrompt) {
        const existing = await findSavedResponse(userPrompt, categoryId)
        if (existing) {
          setSavedId(existing.id)
          onSaved?.(existing.id)
          toast.info(en ? 'Already saved in archive' : 'Bereits im Archiv gespeichert')
          return
        }
      }
      const created = await saveLawyerResponse({
        userPrompt,
        content,
        conversationId,
        conversationTitle,
        categoryId,
        isHidden: false,
      })
      setSavedId(created.id)
      onSaved?.(created.id)
      toast.success(
        en
          ? 'Saved — same question later loads free (no API)'
          : 'Gespeichert — gleiche Frage später ohne API-Kosten'
      )
    } catch {
      toast.error(en ? 'Save failed' : 'Speichern fehlgeschlagen')
    } finally {
      setBusy(false)
    }
  }

  const removeSaved = async () => {
    if (!savedId || busy) return
    setBusy(true)
    try {
      await deleteSavedResponse(savedId)
      setSavedId(null)
      onDeleted?.()
      toast.success(en ? 'Removed from archive' : 'Aus Archiv gelöscht')
    } catch {
      toast.error(en ? 'Delete failed' : 'Löschen fehlgeschlagen')
    } finally {
      setBusy(false)
    }
  }

  const pinToTimeline = () => {
    const title = parseMessageTitle(content).slice(0, 80)
    addTimelineEvent(conversationId, {
      title: `Insight: ${title}`,
      status: 'done',
      categoryId,
    })
    onTimelineUpdate?.()
    toast.success(en ? 'Added to case timeline' : 'Zur Fall-Timeline hinzugefügt')
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-700/50 pt-3">
      {(fromArchive || savedId) && (
        <span className="flex items-center gap-1 rounded-lg bg-emerald-500/15 px-2 py-1 text-[10px] font-medium text-emerald-300">
          <Database className="h-3 w-3" />
          {en ? 'Cached — no API' : 'Archiv — kein API'}
        </span>
      )}

      {savedId ? (
        <button
          type="button"
          onClick={removeSaved}
          disabled={busy}
          className="flex items-center gap-1.5 rounded-lg bg-red-500/15 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/25 disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          {en ? 'Delete save' : 'Speichern löschen'}
        </button>
      ) : (
        <button
          type="button"
          onClick={saveInsight}
          disabled={busy}
          className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-brand-900/30 hover:bg-brand-500 disabled:opacity-50"
        >
          <Bookmark className="h-3.5 w-3.5" />
          {en ? 'Save for later (free reuse)' : 'Speichern (später ohne API)'}
        </button>
      )}

      {savedId ? (
        <span className="flex items-center gap-1 rounded-lg bg-brand-600/20 px-2.5 py-1.5 text-xs font-medium text-brand-200">
          <BookmarkCheck className="h-3.5 w-3.5" />
          {en ? 'Saved' : 'Gespeichert'}
        </span>
      ) : null}

      <button
        type="button"
        onClick={pinToTimeline}
        className="flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-700"
      >
        {en ? 'Pin timeline' : 'Timeline'}
      </button>
      <button
        type="button"
        onClick={copy}
        className="flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-700"
      >
        <Copy className="h-3.5 w-3.5" /> {en ? 'Copy' : 'Kopieren'}
      </button>
    </div>
  )
}
