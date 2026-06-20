import { useState } from 'react'
import { Plus, Calendar } from 'lucide-react'
import { addTimelineEvent } from '@/lib/lawyer/caseStore'

export default function CaseTimeline({ conversationId, timeline = [], onUpdate }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('planned')

  const add = () => {
    if (!title.trim()) return
    addTimelineEvent(conversationId, { title: title.trim(), status })
    setTitle('')
    setOpen(false)
    onUpdate?.()
  }

  return (
    <div className="premium-card mb-3 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="flex items-center gap-1 text-xs font-semibold text-slate-400">
          <Calendar className="h-3.5 w-3.5" /> Case timeline
        </p>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 text-[10px] text-brand-400"
        >
          <Plus className="h-3 w-3" /> Event
        </button>
      </div>
      {open && (
        <div className="mb-2 flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Finanzamt Fragebogen submitted"
            className="flex-1 rounded-lg bg-slate-900 px-2 py-1.5 text-xs"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg bg-slate-900 px-2 text-xs"
          >
            <option value="planned">Planned</option>
            <option value="submitted">Submitted</option>
            <option value="done">Done</option>
          </select>
          <button type="button" onClick={add} className="rounded-lg bg-brand-600 px-2 text-xs">
            Add
          </button>
        </div>
      )}
      {timeline.length === 0 ? (
        <p className="text-[10px] text-slate-600">No milestones yet</p>
      ) : (
        <ul className="space-y-1">
          {timeline.slice(0, 5).map((e) => (
            <li key={e.id} className="flex min-w-0 justify-between gap-2 text-[11px]">
              <span className="min-w-0 flex-1 break-words text-slate-300">{e.title}</span>
              <span className="text-slate-500">
                {e.date} · {e.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
