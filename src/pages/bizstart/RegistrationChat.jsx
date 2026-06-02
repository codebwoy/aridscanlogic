import { useState } from 'react'
import { X, Send, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import base44 from '@/lib/base44'

const DISCLAIMER =
  'This guide provides general information only. For your specific legal and tax situation, consult a licensed Steuerberater or Rechtsanwalt in Germany.'

export default function RegistrationChat({ lang = 'en', open, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        lang === 'de'
          ? 'Hallo! Ich bin Ihr BizStart-Anmelde-Assistent. Fragen Sie mich zu Gewerbeanmeldung, Finanzamt, USt oder Kleinunternehmerregelung.'
          : 'Hello! I am your BizStart registration guide. Ask about Gewerbeanmeldung, Finanzamt, VAT, or Kleinunternehmer rules.',
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
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a German business registration guide (not a lawyer). Answer in ${lang === 'de' ? 'German' : 'English'}. Be practical. Mention when to consult Steuerberater.\n\nUser: ${text}`,
      })
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: res?.text || res?.content || 'No response.' },
      ])
    } catch {
      toast.error('Chat failed')
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
            <div className="flex items-center justify-between border-b border-slate-800 p-4">
              <h3 className="font-semibold">Registration guide</h3>
              <button type="button" onClick={() => onClose(false)} className="p-2">
                <X className="h-5 w-5" />
              </button>
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
              {loading && <p className="text-sm text-slate-500">…</p>}
            </div>
            <form
              className="flex gap-2 border-t border-slate-800 p-4"
              onSubmit={(e) => {
                e.preventDefault()
                send()
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded-xl bg-slate-800 px-4 py-2 text-sm"
                placeholder={lang === 'de' ? 'Ihre Frage…' : 'Your question…'}
              />
              <button type="submit" className="rounded-xl bg-brand-600 p-3">
                <Send className="h-5 w-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
