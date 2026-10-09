import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Archive,
  Scale,
  FileText,
  ListChecks,
  Paperclip,
  Download,
  Plus,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from 'lucide-react'
import MuellerResponse from '@/components/lawyer/MuellerResponse'
import { isExecutiveSummary } from '@/components/lawyer/LawyerMarkdown'
import { toast } from 'sonner'
import QuickPrompts from '@/components/lawyer/QuickPrompts'
import CategoryPicker from '@/components/lawyer/CategoryPicker'
import MessageActions from '@/components/lawyer/MessageActions'
import LawyerAIArchive from '@/components/lawyer/LawyerAIArchive'
import CaseTimeline from '@/components/lawyer/CaseTimeline'
import ContractQuickDraft from '@/components/lawyer/ContractQuickDraft'
import {
  invokeHerrMueller,
  generateExecutiveSummary,
  translateMuellerContent,
} from '@/lib/lawyer/invokeMueller'
import { SAFETY_DISCLAIMER_DE } from '@/lib/lawyer/herrMuellerPrompt'
import AiLanguageTabs from '@/components/shared/AiLanguageTabs'
import AiLanguageBar from '@/components/shared/AiLanguageBar'
import { useAiLanguage } from '@/context/AiLanguageContext'
import { getStarterPrompt } from '@/lib/lawyer/categories'
import {
  ensureCase,
  getActiveCase,
  setCaseCategory,
  addSummary,
  createNewCase,
  listCases,
} from '@/lib/lawyer/caseStore'
import DocumentPicker from '@/components/lawyer/DocumentPicker'
import { exportConversationTranscript } from '@/lib/lawyer/exportTranscript'
import { findSavedResponse } from '@/lib/lawyer/savedResponses'
import ModuleGuideBanner from '@/components/guide/ModuleGuideBanner'
import { refreshLlmStatus, isAnthropicConfigured } from '@/lib/anthropic'

const WELCOME_DE = `**Guten Tag!** Ich bin **Herr Müller** — Ihr Mentor für Finanzen, Steuern, Recht und Unternehmensführung.

Ich verbinde die Perspektive eines erfahrenen **Wirtschaftsjuristen**, **Steuerstrategen** und **Investors**.

Wählen Sie einen der **13 Beratungsbereiche**, eine Starter-Karte oder stellen Sie Ihre Frage.

${SAFETY_DISCLAIMER_DE}`

const WELCOME_EN = `**Hello!** I am **Herr Müller** — your mentor for finance, tax, law, and business leadership.

I combine the perspective of an experienced **business lawyer**, **tax strategist**, and **investor**.

Pick one of **13 expertise areas**, a starter card, or ask your question.

*Note: Educational coaching only — not a substitute for licensed Rechtsanwalt / Steuerberater advice.*`

export default function LawyerAIPage() {
  const { language, setLanguage } = useAiLanguage()
  const [messages, setMessages] = useState(() => {
    const lang = language
    return [
      {
        role: 'assistant',
        content: lang === 'en' ? WELCOME_EN : WELCOME_DE,
        language: lang,
      },
    ]
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const [documentContext, setDocumentContext] = useState(null)
  const [showTimeline, setShowTimeline] = useState(false)
  const [caseData, setCaseData] = useState(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [casesOpen, setCasesOpen] = useState(false)
  /** On mobile, after the first user message, hide chrome so replies fill the screen. */
  const [toolsExpanded, setToolsExpanded] = useState(false)
  const conversationId = useRef(`conv-${Date.now()}`)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const [llmReady, setLlmReady] = useState(isAnthropicConfigured())

  const aiConfigError =
    language === 'en'
      ? 'Live AI is off — add ANTHROPIC_API_KEY to your server (.env locally, Vercel env on production) and redeploy.'
      : 'Live-KI ist aus — ANTHROPIC_API_KEY auf dem Server setzen (.env lokal, Vercel Env in Produktion) und neu deployen.'

  const aiModelError =
    language === 'en'
      ? 'Claude model outdated — set ANTHROPIC_MODEL=claude-sonnet-4-6 on Vercel (or remove it to use the new default), then redeploy.'
      : 'Claude-Modell veraltet — ANTHROPIC_MODEL=claude-sonnet-4-6 auf Vercel setzen (oder entfernen für Standard), dann neu deployen.'

  const aiTimeoutError =
    language === 'en'
      ? 'Herr Müller took too long to respond — please try again with a shorter question.'
      : 'Herr Müller brauchte zu lange — bitte erneut versuchen oder die Frage kürzer formulieren.'

  const aiErrorMessage = (err, fallbackDe, fallbackEn) => {
    if (isAiTimeoutError(err)) return aiTimeoutError
    if (isAiModelError(err)) return aiModelError
    if (isAiConfigError(err)) return aiConfigError
    return language === 'en' ? fallbackEn : fallbackDe
  }

  const isAiConfigError = (err) =>
    ['ANTHROPIC_NOT_CONFIGURED', 'LLM_API_NOT_FOUND'].includes(err?.message)

  const isAiModelError = (err) => err?.message === 'ANTHROPIC_MODEL_OUTDATED'

  const isAiTimeoutError = (err) => err?.message === 'LLM_TIMEOUT'

  const refreshCase = useCallback(() => {
    setCaseData(getActiveCase(conversationId.current))
  }, [])

  useEffect(() => {
    ensureCase(conversationId.current, 'Herr Müller Beratung')
    refreshCase()
  }, [refreshCase])

  useEffect(() => {
    refreshLlmStatus().then(() => setLlmReady(isAnthropicConfigured()))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const resizeComposer = useCallback(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = '0px'
    // Cap height so the chat transcript stays visible on mobile
    const cap = Math.round(window.innerHeight * 0.22)
    const next = Math.min(el.scrollHeight, Math.max(cap, 72))
    el.style.height = `${Math.max(next, 52)}px`
  }, [])

  useEffect(() => {
    resizeComposer()
  }, [input, resizeComposer])

  const send = async (text, categoryId = activeCategory, { skipCache = false } = {}) => {
    const userText = (text || input).trim()
    if (!userText || loading) return
    const lang = language
    setInput('')
    setToolsExpanded(false)
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.style.height = '52px'
      }
    })
    setMessages((m) => [...m, { role: 'user', content: userText }])
    if (categoryId) setCaseCategory(conversationId.current, categoryId)

    if (!skipCache) {
      try {
        const saved = await findSavedResponse(userText, categoryId)
        if (saved) {
          setMessages((m) => [
            ...m,
            {
              role: 'assistant',
              content: saved.message_content,
              language: lang,
              fromArchive: true,
              savedId: saved.id,
            },
          ])
          toast.success(
            lang === 'en'
              ? 'Loaded from archive — no API call'
              : 'Aus Archiv geladen — kein API-Aufruf'
          )
          refreshCase()
          return
        }
      } catch {
        /* fall through to API */
      }
    }

    setLoading(true)
    try {
      const { text: reply, demo } = await invokeHerrMueller({
        userMessage: userText,
        messages: [...messages, { role: 'user', content: userText }],
        categoryId,
        documentContext,
        language: lang,
      })
      setMessages((m) => [...m, { role: 'assistant', content: reply, language: lang }])
      if (demo) {
        toast.message(
          lang === 'en'
            ? 'Demo reply — set ANTHROPIC_API_KEY for live Herr Müller'
            : 'Demo-Antwort — ANTHROPIC_API_KEY setzen für Live-Herr Müller'
        )
      }
      if (documentContext) setDocumentContext(null)
      refreshCase()
    } catch (err) {
      const errMsg = aiErrorMessage(
        err,
        'Beratung konnte nicht geladen werden',
        'Could not reach Herr Müller'
      )
      toast.error(errMsg)
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: errMsg,
          language: lang,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat.id)
    setCaseCategory(conversationId.current, cat.id)
    if (cat.id === 'case-mgmt') {
      runExecutiveSummary()
      return
    }
    send(getStarterPrompt(cat, language), cat.id)
  }

  const reviewDocument = async (withText) => {
    setDocumentContext(withText.ocr_text)
    setActiveCategory('doc-review')
    toast.success(withText.title || 'Document attached')
    const userLine =
      language === 'en'
        ? `Please review this document: **${withText.title}**`
        : `Bitte prüfen Sie dieses Dokument: **${withText.title}**`
    setMessages((m) => [...m, { role: 'user', content: userLine }])
    setLoading(true)
    try {
      const { text: reply } = await invokeHerrMueller({
        userMessage: 'Review the attached contract/document thoroughly.',
        messages: [...messages, { role: 'user', content: userLine }],
        categoryId: 'doc-review',
        documentContext: withText.ocr_text,
        language,
      })
      setMessages((m) => [...m, { role: 'assistant', content: reply, language }])
      setDocumentContext(null)
      refreshCase()
    } catch {
      toast.error('Review failed')
    } finally {
      setLoading(false)
    }
  }

  const startNewCase = () => {
    const c = createNewCase(language === 'en' ? 'New consultation' : 'Neue Beratung')
    conversationId.current = c.conversationId
    setMessages([
      { role: 'assistant', content: language === 'en' ? WELCOME_EN : WELCOME_DE, language },
    ])
    setActiveCategory(null)
    setDocumentContext(null)
    setCasesOpen(false)
    setToolsExpanded(false)
    refreshCase()
    toast.success(language === 'en' ? 'New case started' : 'Neuer Fall gestartet')
  }

  const runExecutiveSummary = async () => {
    if (messages.length < 2) {
      toast.error(language === 'en' ? 'Start a conversation first' : 'Bitte zuerst ein Gespräch führen')
      return
    }
    setLoading(true)
    try {
      const summary = await generateExecutiveSummary(messages, language)
      addSummary(conversationId.current, summary)
      setMessages((m) => [...m, { role: 'assistant', content: summary, language }])
      refreshCase()
      toast.success(language === 'en' ? 'Summary generated' : 'Zusammenfassung erstellt')
    } catch (err) {
      const code = err?.message || ''
      if (code === 'ANTHROPIC_MODEL_OUTDATED') {
        toast.error(aiModelError)
      } else if (code === 'LLM_TIMEOUT') {
        toast.error(aiTimeoutError)
      } else if (code === 'ANTHROPIC_NOT_CONFIGURED' || code === 'LLM_API_NOT_FOUND') {
        toast.error(aiConfigError)
      } else {
        toast.error(language === 'en' ? 'Summary failed' : 'Zusammenfassung fehlgeschlagen')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadFromArchive = (item) => {
    const userLine = item.user_prompt || item.message_title || ''
    setMessages((m) => [
      ...m,
      ...(userLine ? [{ role: 'user', content: userLine }] : []),
      {
        role: 'assistant',
        content: item.message_content,
        language,
        fromArchive: true,
        savedId: item.id,
      },
    ])
    if (item.category_id) setActiveCategory(item.category_id)
    toast.success(language === 'en' ? 'Loaded into chat' : 'In den Chat geladen')
  }

  const changeLanguage = async (next) => {
    if (next === language || loading || translating) return

    const previousLang = language
    setLanguage(next)

    if (messages.length <= 1) {
      setMessages([
        { role: 'assistant', content: next === 'en' ? WELCOME_EN : WELCOME_DE, language: next },
      ])
      return
    }

    const assistantMsgs = messages.filter((m) => m.role === 'assistant')
    const needsWork = assistantMsgs.some((m) => (m.language || previousLang) !== next)
    if (!needsWork) return

    setTranslating(true)
    try {
      const updated = await Promise.all(
        messages.map(async (m) => {
          if (m.role !== 'assistant') return m
          const msgLang = m.language || previousLang
          if (msgLang === next) return { ...m, language: next }
          if (m.translations?.[next]) {
            return { ...m, content: m.translations[next], language: next }
          }
          const translated = await translateMuellerContent(m.content, next)
          return {
            ...m,
            content: translated,
            language: next,
            translations: { ...(m.translations || {}), [msgLang]: m.content, [next]: translated },
          }
        })
      )
      setMessages(updated)
      toast.success(next === 'en' ? 'Responses translated to English' : 'Antworten auf Deutsch übersetzt')
    } catch {
      setLanguage(previousLang)
      toast.error(
        next === 'en'
          ? 'Translation failed — set ANTHROPIC_API_KEY for live translation'
          : 'Übersetzung fehlgeschlagen — ANTHROPIC_API_KEY für Live-Übersetzung setzen'
      )
    } finally {
      setTranslating(false)
    }
  }

  const showStarters = messages.length <= 1
  const busy = loading || translating
  const hasUserChat = messages.some((m) => m.role === 'user')
  /** Mobile: hide guide/tools/categories so the AI answer owns the screen */
  const chatFocus = hasUserChat && !toolsExpanded

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 max-w-full flex-col overflow-hidden">
      {/* Slim always-visible header */}
      <header className="safe-top shrink-0 flex items-center justify-between gap-2 pb-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/40 to-indigo-700/30">
            <Scale className="h-5 w-5 text-brand-300" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold">Herr Müller</h1>
            {chatFocus ? (
              <p className="truncate text-[10px] text-brand-300/90">
                {language === 'en' ? 'Chat focus — answers fill the screen' : 'Chat-Fokus — Antworten füllen den Screen'}
              </p>
            ) : (
              <p className="truncate text-xs text-slate-500">Rechtsanwalt · Steuerberater · Investor</p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {hasUserChat ? (
            <button
              type="button"
              onClick={() => setToolsExpanded((v) => !v)}
              className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800/80 px-2.5 py-2 text-[10px] font-semibold text-slate-200 lg:hidden"
              aria-expanded={toolsExpanded}
            >
              {toolsExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {toolsExpanded
                ? language === 'en'
                  ? 'Hide menu'
                  : 'Menü zu'
                : language === 'en'
                  ? 'Menu'
                  : 'Menü'}
            </button>
          ) : null}
          <AiLanguageTabs
            language={language}
            onChange={changeLanguage}
            disabled={busy}
            compact
            className="hidden w-[108px] sm:flex"
          />
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="premium-card rounded-xl p-2"
            title="Attach scanned document"
          >
            <Paperclip className="h-4 w-4 text-slate-400" />
          </button>
          <button
            type="button"
            onClick={() => setArchiveOpen(true)}
            className="premium-card rounded-xl p-2"
            title="Archive"
          >
            <Archive className="h-4 w-4 text-brand-300" />
          </button>
        </div>
      </header>

      {/* Tools / guide / categories — hidden on mobile once chat starts (unless Menu opened) */}
      <div
        className={`shrink-0 space-y-2 overflow-hidden transition-[max-height,opacity] duration-300 ${
          chatFocus
            ? 'pointer-events-none max-h-0 opacity-0 lg:pointer-events-auto lg:max-h-[none] lg:opacity-100'
            : 'max-h-[70vh] opacity-100'
        }`}
      >
        <div className="space-y-2 lg:block">
          <ModuleGuideBanner moduleId="lawyer" title="Lawyer AI" />

          {!llmReady && (
            <div className="break-words rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
              {language === 'en'
                ? 'Demo mode: Herr Müller still answers with sample coaching. Add ANTHROPIC_API_KEY for live AI.'
                : 'Demo-Modus: Herr Müller antwortet mit Beispiel-Coaching. ANTHROPIC_API_KEY setzen für Live-KI.'}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={runExecutiveSummary}
              disabled={busy}
              className="flex items-center gap-1 rounded-lg bg-slate-800/80 px-2.5 py-1.5 text-[10px] text-brand-300"
            >
              <ListChecks className="h-3 w-3" />{' '}
              {language === 'en' ? 'Executive Summary' : 'Zusammenfassung'}
            </button>
            <button
              type="button"
              onClick={() => setShowTimeline(!showTimeline)}
              className="flex items-center gap-1 rounded-lg bg-slate-800/80 px-2.5 py-1.5 text-[10px] text-slate-400"
            >
              <FileText className="h-3 w-3" /> Timeline
            </button>
            <button
              type="button"
              onClick={() => exportConversationTranscript(messages, 'Herr_Mueller')}
              className="flex items-center gap-1 rounded-lg bg-slate-800/80 px-2.5 py-1.5 text-[10px] text-slate-400"
            >
              <Download className="h-3 w-3" /> Export
            </button>
            <button
              type="button"
              onClick={startNewCase}
              className="flex items-center gap-1 rounded-lg bg-slate-800/80 px-2.5 py-1.5 text-[10px] text-slate-400"
            >
              <Plus className="h-3 w-3" /> {language === 'en' ? 'New case' : 'Neu'}
            </button>
            <button
              type="button"
              onClick={() => setCasesOpen(!casesOpen)}
              className="rounded-lg bg-slate-800/80 px-2.5 py-1.5 text-[10px] text-slate-400"
            >
              {language === 'en' ? 'Cases' : 'Fälle'}
            </button>
          </div>

          {casesOpen && (
            <div className="max-h-28 overflow-y-auto rounded-xl bg-slate-800/80 p-2 text-xs">
              {listCases().slice(0, 8).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    conversationId.current = c.conversationId
                    refreshCase()
                    setCasesOpen(false)
                    toast.info(c.title)
                  }}
                  className="block w-full truncate rounded-lg px-2 py-1.5 text-left hover:bg-slate-700"
                >
                  {c.title} · {new Date(c.updatedAt).toLocaleDateString()}
                </button>
              ))}
            </div>
          )}

          {showTimeline && (
            <CaseTimeline
              conversationId={conversationId.current}
              timeline={caseData?.timeline || []}
              onUpdate={refreshCase}
            />
          )}

          {documentContext && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[10px] text-amber-200">
              Document attached for review ({documentContext.length} chars)
            </div>
          )}

          <CategoryPicker
            activeCategory={activeCategory}
            onSelect={handleCategorySelect}
            language={language}
          />
        </div>
      </div>

      {/* Full-height chat transcript */}
      <div className="mt-1 flex min-h-0 min-w-0 flex-1 flex-col space-y-3 overflow-x-hidden overflow-y-auto pb-2 scrollbar-hide">
        {chatFocus && (
          <div className="flex items-center gap-2 rounded-xl border border-brand-500/25 bg-brand-950/30 px-3 py-2 text-[11px] text-brand-100 lg:hidden">
            <MessageSquare className="h-3.5 w-3.5 shrink-0 text-brand-300" />
            {language === 'en'
              ? 'Reading mode: tap Menu above for areas & tools.'
              : 'Lesemodus: Menü oben für Bereiche & Tools.'}
          </div>
        )}
        {showStarters && (
          <>
            <QuickPrompts
              language={language}
              onSelect={(prompt, catId) => {
                if (catId) setActiveCategory(catId)
                send(prompt, catId)
              }}
            />
            <ContractQuickDraft
              language={language}
              onSelect={(prompt) => {
                setActiveCategory('contracts')
                send(prompt, 'contracts')
              }}
            />
          </>
        )}
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex w-full min-w-0 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`chat-bubble overflow-hidden rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'max-w-[min(96%,100%)] bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-900/30 sm:max-w-[85%] lg:max-w-2xl'
                  : isExecutiveSummary(msg.content)
                    ? 'premium-card-gradient w-full min-w-0 max-w-full border border-brand-500/20'
                    : chatFocus
                      ? 'premium-card w-full min-w-0 max-w-full sm:max-w-[92%] lg:max-w-2xl'
                      : 'premium-card max-w-[min(92%,100%)] sm:max-w-[85%] lg:max-w-2xl'
              }`}
            >
              {msg.role === 'user' ? (
                <span className="block whitespace-pre-wrap">{msg.content}</span>
              ) : (
                <>
                  <MuellerResponse
                    language={msg.language || language}
                    onLanguageChange={isExecutiveSummary(msg.content) ? changeLanguage : undefined}
                    languageSwitchDisabled={busy}
                  >
                    {msg.content}
                  </MuellerResponse>
                  <MessageActions
                    content={msg.content}
                    userPrompt={messages[i - 1]?.role === 'user' ? messages[i - 1].content : ''}
                    conversationId={conversationId.current}
                    conversationTitle="Herr Müller Beratung"
                    categoryId={activeCategory}
                    fromArchive={!!msg.fromArchive}
                    onTimelineUpdate={refreshCase}
                  />
                </>
              )}
            </div>
          </motion.div>
        ))}
        {busy && (
          <div className="flex justify-start">
            <div className="premium-card px-4 py-3 text-sm text-slate-400">
              {translating
                ? language === 'en'
                  ? 'Translating responses…'
                  : 'Antworten werden übersetzt…'
                : language === 'en'
                  ? 'Herr Müller is thinking…'
                  : 'Herr Müller denkt nach…'}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="min-w-0 shrink-0 border-t border-slate-800/80 bg-slate-950/95 pt-2 backdrop-blur-xl pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {!chatFocus && (
          <AiLanguageBar
            language={language}
            onChange={changeLanguage}
            disabled={busy}
            compact
            className="mb-2"
          />
        )}
        {chatFocus && (
          <div className="mb-2 flex items-center justify-between gap-2 sm:hidden">
            <AiLanguageTabs
              language={language}
              onChange={changeLanguage}
              disabled={busy}
              compact
              className="w-[120px]"
            />
            <button
              type="button"
              onClick={startNewCase}
              className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-[10px] text-slate-300"
            >
              {language === 'en' ? 'New case' : 'Neuer Fall'}
            </button>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
          className="flex min-w-0 items-end gap-2 pr-14 lg:pr-0"
        >
          <textarea
            ref={inputRef}
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder={language === 'en' ? 'Your question…' : 'Ihre Frage…'}
            className="premium-card max-h-[18vh] min-h-[48px] min-w-0 flex-1 resize-none overflow-y-auto rounded-xl px-4 py-3 text-base leading-relaxed outline-none ring-brand-500/50 focus:ring-2 sm:max-h-[28vh] sm:text-sm"
            disabled={busy}
            aria-label={language === 'en' ? 'Your question' : 'Ihre Frage'}
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="btn-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl disabled:opacity-50"
            aria-label={language === 'en' ? 'Send' : 'Senden'}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>

      <DocumentPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        language={language}
        onSelect={(doc) => reviewDocument(doc)}
      />

      <AnimatePresence>
        {archiveOpen && (
          <LawyerAIArchive
            open={archiveOpen}
            onClose={() => setArchiveOpen(false)}
            onUseInChat={loadFromArchive}
            language={language}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
