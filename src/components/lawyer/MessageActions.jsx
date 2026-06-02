import { Bookmark, Copy, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import base44 from '@/lib/base44'
import { addTimelineEvent } from '@/lib/lawyer/caseStore'

/** First line of markdown response → message_title */
export function parseMessageTitle(content) {
  if (!content) return 'Beratung'
  const firstLine = content.split(/\r?\n/).find((l) => l.trim()) || ''
  return firstLine
    .replace(/^#+\s*/, '')
    .replace(/\*\*/g, '')
    .replace(/[_*`]/g, '')
    .trim()
    .slice(0, 120) || 'Beratung'
}

export default function MessageActions({
  content,
  conversationId,
  conversationTitle,
  categoryId,
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
    const messageTitle = parseMessageTitle(content)
    try {
      await base44.entities.SavedLawyerMessage.create({
        conversation_id: conversationId,
        message_content: content,
        message_title: messageTitle,
        conversation_title: conversationTitle || 'Herr Müller',
        is_hidden: false,
        saved_date: new Date().toISOString(),
      })
      toast.success('Insight saved to archive')
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
    const messageTitle = parseMessageTitle(content)
    try {
      await base44.entities.SavedLawyerMessage.create({
        conversation_id: conversationId,
        message_content: content,
        message_title: messageTitle,
        conversation_title: conversationTitle || 'Herr Müller',
        is_hidden: true,
        saved_date: new Date().toISOString(),
      })
      toast.success('Saved and hidden from default view')
    } catch {
      toast.error('Hide failed')
    }
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-700/50 pt-3">
      <button
        type="button"
        onClick={saveInsight}
        className="flex items-center gap-1.5 rounded-lg bg-brand-600/20 px-3 py-1.5 text-xs font-medium text-brand-300 hover:bg-brand-600/30"
      >
        <Bookmark className="h-3.5 w-3.5" /> Save Insight
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
