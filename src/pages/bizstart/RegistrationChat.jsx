import { useState } from 'react'
import { X, Send, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import appApi from '@/lib/appApi'
import { useAiLanguage } from '@/context/AiLanguageContext'
import AiLanguageTabs from '@/components/shared/AiLanguageTabs'
import AiLanguageBar from '@/components/shared/AiLanguageBar'
import { aiLanguageInstruction } from '@/lib/ai/promptLanguage'

const DISCLAIMER =
  'This guide provides general information only. For your specific legal and tax situation, consult a licensed Steuerberater or Rechtsanwalt in Germany.'

export default function RegistrationChat({ open, onClose }) {
  const { language, setLanguage } = useAiLanguage()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        language === 'de'
          ? 'Hallo! Ich bin Ihr BizStart-Anmelde-Assistent. Fragen Sie mich zu Gewerbeanmeldung, Finanzamt, USt oder Kleinunternehmerregelung.'
          : 'Hello! I am your BizStart registration guide. Ask about Gewerbeanmeldung, Finanzamt, VAT, or Kleinunternehmer rules.',
      language,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', content: text }])
    setLoading(true)
    try {
      const res = await appApi.integrations.Core.InvokeLLM({
        prompt: `${aiLanguageInstruction(language)}

You are a German business registration guide (BizStart Germany). You are NOT a licensed Rechtsanwalt or Steuerberater. Be practical and step-by-step. Cover Gewerbeanmeldung, Finanzamt, USt, Handelsregister, IHK, and Kleinunternehmer §19 UStG when relevant. Always mention when the user should consult a licensed Steuerberater or lawyer.

User question: ${text}`,
      })
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: res?.text || res?.content || 'No response.',
          language,
        },
      ])
    } catch {
      toast.error(language === 'en' ? 'Chat failed' : 'Chat fehlgeschlagen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => onClose?.(true)}
          className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 shadow-lg shadow-brand-600/40"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-slate-950 safe-top safe-bottom"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 p-4">
              <h3 className="font-semibold">
                {language === 'en' ? 'Registration guide' : 'Anmelde-Assistent'}
              </h3>
              <div className="flex items-center gap-2">
                <AiLanguageTabs
                  language={language}
                  onChange={setLanguage}
                  disabled={loading}
                  compact
                />
                <button type="button" onClick={() => onClose(false)} className="p-2">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <p className="bg-amber-500/10 px-4 py-2 text-[10px] text-amber-200">{DISCLAIMER}</p>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
                    m.role === 'user' ? 'ml-auto bg-brand-600' : 'bg-slate-800'
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {loading && (
                <p className="text-sm text-slate-500">{language === 'en' ? '…' : '…'}</p>
              )}
            </div>
            <div className="border-t border-slate-800 p-4">
              <AiLanguageBar
                language={language}
                onChange={setLanguage}
                disabled={loading}
                className="mb-3"
              />
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  send()
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 rounded-xl bg-slate-800 px-4 py-2 text-sm"
                  placeholder={language === 'de' ? 'Ihre Frage…' : 'Your question…'}
                />
                <button type="submit" className="rounded-xl bg-brand-600 p-3" disabled={loading}>
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
