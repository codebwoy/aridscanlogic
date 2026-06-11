import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Eye, EyeOff, Trash2, X, FolderOpen, MessageSquare } from 'lucide-react'
import MuellerResponse from '@/components/lawyer/MuellerResponse'
import { toast } from 'sonner'
import appApi from '@/lib/appApi'
import { useAiLanguage } from '@/context/AiLanguageContext'
import { listCases } from '@/lib/lawyer/caseStore'

export default function LawyerAIArchive({ open, onClose, onUseInChat, language: languageProp }) {
  const { language: globalLanguage } = useAiLanguage()
  const language = languageProp ?? globalLanguage
  const [items, setItems] = useState([])
  const [cases, setCases] = useState([])
  const [tab, setTab] = useState('insights')
  const [query, setQuery] = useState('')
  const [showHidden, setShowHidden] = useState(false)
  const [expanded, setExpanded] = useState(null)

  const load = async () => {
    try {
      const all = await appApi.entities.SavedLawyerMessage.list()
      setItems(all.sort((a, b) => new Date(b.saved_date) - new Date(a.saved_date)))
      setCases(listCases())
    } catch {
      toast.error('Archive could not be loaded')
    }
  }

  useEffect(() => {
    if (open) load()
  }, [open])

  if (!open) return null

  const filtered = items.filter((i) => {
    if (!showHidden && i.is_hidden) return false
    if (!query) return true
    const q = query.toLowerCase()
    return (
      i.message_title?.toLowerCase().includes(q) ||
      i.user_prompt?.toLowerCase().includes(q) ||
      i.message_content?.toLowerCase().includes(q) ||
      i.conversation_title?.toLowerCase().includes(q)
    )
  })

  const toggleHidden = async (item) => {
    try {
      await appApi.entities.SavedLawyerMessage.update(item.id, {
        is_hidden: !item.is_hidden,
      })
      load()
      toast.success(item.is_hidden ? 'Unhidden' : 'Hidden')
    } catch {
      toast.error('Update failed')
    }
  }

  const remove = async (id) => {
    try {
      await appApi.entities.SavedLawyerMessage.delete(id)
      load()
      toast.success('Permanently deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col bg-slate-950/98 backdrop-blur-lg safe-top safe-bottom"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: 'spring', damping: 28, stiffness: 320 }}
    >
      <div className="border-b border-slate-800/80 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600/30">
              <FolderOpen className="h-5 w-5 text-brand-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {language === 'en' ? 'Saved insights' : 'Gespeicherte Beratung'}
              </h2>
              <p className="text-xs text-slate-500">
                {items.length}{' '}
                {language === 'en' ? 'saved — reuse without API' : 'gespeichert — ohne API wiederverwenden'}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={language === 'en' ? 'Search questions & answers…' : 'Fragen & Antworten suchen…'}
            className="premium-card w-full py-2 pl-10 pr-4 text-sm"
          />
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setTab('insights')}
            className={`rounded-lg px-3 py-1 text-xs ${tab === 'insights' ? 'bg-brand-600' : 'bg-slate-800'}`}
          >
            Insights
          </button>
          <button
            type="button"
            onClick={() => setTab('cases')}
            className={`rounded-lg px-3 py-1 text-xs ${tab === 'cases' ? 'bg-brand-600' : 'bg-slate-800'}`}
          >
            Cases ({cases.length})
          </button>
        </div>
        {tab === 'insights' && (
          <button
            type="button"
            onClick={() => setShowHidden(!showHidden)}
            className="mt-2 flex items-center gap-2 text-xs text-slate-400"
          >
            {showHidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            {showHidden ? 'Showing all' : 'Show hidden insights'}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {tab === 'cases' ? (
          cases.length === 0 ? (
            <p className="text-center text-sm text-slate-500">No case files yet</p>
          ) : (
            cases.map((c) => (
              <div key={c.id} className="premium-card mb-3 p-4">
                <p className="font-medium">{c.title}</p>
                <p className="text-xs text-slate-500">
                  {c.timeline?.length || 0} events · {c.summaries?.length || 0} summaries
                </p>
                {c.summaries?.[0] && (
                  <div className="prose prose-invert mt-2 max-w-none text-xs prose-p:text-slate-400">
                    <SafeMarkdown>{c.summaries[c.summaries.length - 1].content.slice(0, 400)}…</SafeMarkdown>
                  </div>
                )}
              </div>
            ))
          )
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-slate-500">No saved consultations</p>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`premium-card mb-3 p-4 ${item.is_hidden ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.message_title}</p>
                  {item.user_prompt && (
                    <p className="mt-1 truncate text-xs text-slate-400">
                      {language === 'en' ? 'Question:' : 'Frage:'} {item.user_prompt}
                    </p>
                  )}
                  <p className="text-xs text-slate-500">
                    {item.conversation_title} ·{' '}
                    {new Date(item.saved_date).toLocaleDateString('de-DE')}
                    {item.is_hidden && ' · Hidden'}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => toggleHidden(item)}
                    className="rounded-lg p-1.5 hover:bg-slate-800"
                    title={item.is_hidden ? 'Unhide' : 'Hide'}
                  >
                    {item.is_hidden ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="rounded-lg p-1.5 text-red-400 hover:bg-slate-800"
                    title="Delete permanently"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {onUseInChat && (
                  <button
                    type="button"
                    onClick={() => {
                      onUseInChat(item)
                      onClose()
                    }}
                    className="flex items-center gap-1 rounded-lg bg-brand-600/25 px-2.5 py-1 text-xs text-brand-300 hover:bg-brand-600/35"
                  >
                    <MessageSquare className="h-3 w-3" />
                    {language === 'en' ? 'Load in chat' : 'In Chat laden'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                  className="text-xs text-brand-400"
                >
                  {expanded === item.id
                    ? language === 'en'
                      ? 'Collapse'
                      : 'Einklappen'
                    : language === 'en'
                      ? 'Read full insight'
                      : 'Vollständig lesen'}
                </button>
              </div>
              {expanded === item.id && (
                <div className="mt-3 text-sm">
                  <MuellerResponse language={language}>{item.message_content}</MuellerResponse>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </motion.div>
  )
}
