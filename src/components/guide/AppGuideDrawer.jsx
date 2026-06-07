import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Send, ChevronRight, BookOpen, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useGuide } from '@/context/GuideContext'
import { APP_GUIDE_MODULES, formatModule } from '@/lib/guide/appModules'
import { askAppGuide } from '@/lib/guide/invokeAppGuide'
import { useFocusTrap } from '@/hooks/useFocusTrap'

const NAV_IDS = ['docs', 'tax', 'docdraft', 'contracts', 'lawyer', 'settings']

export default function AppGuideDrawer() {
  const { open, closeGuide, focusModule, language, setLanguage } = useGuide()
  const trapRef = useFocusTrap(open)
  const [selected, setSelected] = useState(focusModule || 'docs')

  useEffect(() => {
    const el = trapRef.current
    if (!el || !open) return
    const onEscape = () => closeGuide()
    el.addEventListener('modal-escape', onEscape)
    return () => el.removeEventListener('modal-escape', onEscape)
  }, [open, closeGuide, trapRef])

  useEffect(() => {
    if (open && focusModule) setSelected(focusModule)
  }, [open, focusModule])
  const [question, setQuestion] = useState('')
  const [aiReply, setAiReply] = useState('')
  const [loading, setLoading] = useState(false)

  const module = APP_GUIDE_MODULES.find((m) => m.id === selected) || APP_GUIDE_MODULES[0]
  const f = formatModule(module, language)

  const ask = async (q) => {
    const text = (q || question).trim()
    if (!text || loading) return
    setLoading(true)
    setAiReply('')
    try {
      const reply = await askAppGuide({ question: text, moduleId: selected, language })
      setAiReply(reply)
    } catch {
      toast.error(language === 'en' ? 'Guide could not answer' : 'Guide konnte nicht antworten')
    } finally {
      setLoading(false)
    }
  }

  const quickQuestions =
    language === 'en'
      ? [
          `What is ${f.title} for?`,
          `How do I start with ${f.title}?`,
          'How do the tabs work together?',
        ]
      : [
          `Wofür ist ${f.title}?`,
          `Wie starte ich mit ${f.title}?`,
          'Wie greifen die Bereiche ineinander?',
        ]

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
        onClick={closeGuide}
        aria-hidden
      />
      <motion.aside
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-guide-title"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="fixed bottom-0 right-0 top-0 z-[71] flex w-full max-w-lg flex-col border-l border-slate-700/80 bg-slate-950/98 shadow-2xl safe-top safe-bottom lg:max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-3 border-b border-slate-800 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/40 to-indigo-800/40">
              <BookOpen className="h-5 w-5 text-brand-300" />
            </div>
            <div>
              <h2 id="app-guide-title" className="text-lg font-bold">
                {language === 'en' ? 'App Guide' : 'App-Guide'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'en'
                  ? 'How every part of ScanLogic works'
                  : 'So funktioniert jeder Bereich von ScanLogic'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLanguage((l) => (l === 'de' ? 'en' : 'de'))}
              className="rounded-lg bg-slate-800 px-2 py-1 text-[10px] uppercase text-slate-400"
            >
              {language === 'de' ? 'EN' : 'DE'}
            </button>
            <button
              type="button"
              onClick={closeGuide}
              className="rounded-xl p-2 hover:bg-slate-800"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <nav className="flex gap-2 overflow-x-auto border-b border-slate-800 p-3 scrollbar-hide lg:w-44 lg:flex-col lg:border-b-0 lg:border-r">
            {APP_GUIDE_MODULES.filter((m) => NAV_IDS.includes(m.id) || m.id === 'scanvault').map((m) => {
              const Icon = m.icon
              const active = selected === m.id
              const label = language === 'en' ? m.titleEn : m.titleDe
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setSelected(m.id)
                    setAiReply('')
                  }}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors lg:w-full ${
                    active ? 'bg-brand-600/25 text-brand-200' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="font-medium">{label}</span>
                </button>
              )
            })}
          </nav>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-400">{f.tagline}</p>
              <h3 className="mt-1 text-xl font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{f.summary}</p>
            </div>

            <Section title={language === 'en' ? 'Key features' : 'Funktionen'} items={f.features} />
            <Section
              title={language === 'en' ? 'Typical workflow' : 'Typischer Ablauf'}
              items={f.workflow}
              numbered
            />
            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {language === 'en' ? 'Works with' : 'Zusammenspiel'}
              </p>
              <div className="flex flex-wrap gap-2">
                {f.connects.map((c) => (
                  <span
                    key={c}
                    className="rounded-lg border border-slate-700 bg-slate-800/60 px-2 py-1 text-xs text-slate-300"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <Section title={language === 'en' ? 'Pro tips' : 'Prof-Tipps'} items={f.tips} />

            <div className="mt-4 rounded-2xl border border-brand-500/25 bg-brand-950/40 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand-200">
                <Sparkles className="h-4 w-4" />
                {language === 'en' ? 'Ask the guide AI' : 'Guide-KI fragen'}
              </div>
              <div className="mb-2 flex flex-wrap gap-2">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setQuestion(q)
                      ask(q)
                    }}
                    className="rounded-lg bg-slate-800/80 px-2 py-1 text-[10px] text-slate-300 hover:bg-slate-700"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  ask()
                }}
                className="flex gap-2"
              >
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={
                    language === 'en' ? 'Ask anything about this app…' : 'Fragen Sie etwas zu dieser App…'
                  }
                  className="premium-card flex-1 rounded-xl px-3 py-2.5 text-sm outline-none ring-brand-500/40 focus:ring-2"
                />
                <button
                  type="submit"
                  disabled={loading || !question.trim()}
                  className="btn-primary flex h-11 w-11 items-center justify-center rounded-xl disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </form>
              {aiReply && (
                <div className="mt-3 rounded-xl bg-slate-900/80 p-3 text-sm leading-relaxed text-slate-200 whitespace-pre-wrap">
                  {aiReply}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}

function Section({ title, items, numbered }) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={item} className="flex gap-2 text-sm text-slate-300">
            {numbered ? (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600/30 text-[10px] font-bold text-brand-300">
                {i + 1}
              </span>
            ) : (
              <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
            )}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
