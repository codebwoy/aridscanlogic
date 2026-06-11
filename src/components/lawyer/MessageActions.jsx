import { Bookmark, Copy, EyeOff, Database } from 'lucide-react'
import { toast } from 'sonner'
import { addTimelineEvent } from '@/lib/lawyer/caseStore'
import { saveLawyerResponse, isResponseSaved, parseMessageTitle } from '@/lib/lawyer/savedResponses'

export { parseMessageTitle } from '@/lib/lawyer/savedResponses'

export default function MessageActions({
  content,
  userPrompt = '',
  conversationId,
  conversationTitle,
  categoryId,
  fromArchive = false,
  onTimelineUpdate,
}) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      toast.success('Copied')
    } catch {
      toast.error('Copy failed')
    }
  }

  const saveInsight = async () => {
    try {
      if (userPrompt && (await isResponseSaved(userPrompt))) {
        toast.info('Bereits im Archiv gespeichert')
        return
      }
      await saveLawyerResponse({
        userPrompt,
        content,
        conversationId,
        conversationTitle,
        categoryId,
        isHidden: false,
      })
      toast.success('Insight im Archiv gespeichert — gleiche Frage später ohne API')
    } catch {
      toast.error('Save failed')
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
    toast.success('Added to case timeline')
  }

  const hideInsight = async () => {
    try {
      await saveLawyerResponse({
        userPrompt,
        content,
        conversationId,
        conversationTitle,
        categoryId,
        isHidden: true,
      })
      toast.success('Saved and hidden from default view')
    } catch {
      toast.error('Hide failed')
    }
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-700/50 pt-3">
      {fromArchive && (
        <span className="flex items-center gap-1 rounded-lg bg-emerald-500/15 px-2 py-1 text-[10px] text-emerald-300">
          <Database className="h-3 w-3" /> Aus Archiv
        </span>
      )}
      <button
        type="button"
        onClick={saveInsight}
        className="flex items-center gap-1.5 rounded-lg bg-brand-600/20 px-3 py-1.5 text-xs font-medium text-brand-300 hover:bg-brand-600/30"
      >
        <Bookmark className="h-3.5 w-3.5" /> Speichern
      </button>
      <button
        type="button"
        onClick={pinToTimeline}
        className="flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-700"
      >
        Pin timeline
      </button>
      <button
        type="button"
        onClick={copy}
        className="flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-700"
      >
        <Copy className="h-3.5 w-3.5" /> Copy
      </button>
      <button
        type="button"
        onClick={hideInsight}
        className="flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-700"
      >
        <EyeOff className="h-3.5 w-3.5" /> Hide
      </button>
    </div>
  )
}
