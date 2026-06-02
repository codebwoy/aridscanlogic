import { motion } from 'framer-motion'
import { Upload, Sparkles, FileSearch, FileText } from 'lucide-react'

export const PIPELINE_STAGES = [
  { id: 'ingesting', label: 'Ingesting', icon: Upload },
  { id: 'enhancing', label: 'Enhancing', icon: Sparkles },
  { id: 'ocr', label: 'Running OCR', icon: FileSearch },
  { id: 'markdown', label: 'Translation to Markdown', icon: FileText },
]

export default function ProcessingOverlay({ stage }) {
  const currentIdx = PIPELINE_STAGES.findIndex((s) => s.id === stage)

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 px-6 backdrop-blur-md"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: 'spring', damping: 28, stiffness: 320 }}
    >
      <div className="relative mb-10 flex h-24 w-24 items-center justify-center">
        <div className="pulse-ring absolute inset-0 rounded-full border-2 border-brand-500/40" />
        <div
          className="pulse-ring absolute inset-2 rounded-full border-2 border-brand-400/30"
          style={{ animationDelay: '0.4s' }}
        />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-600/40">
          {(() => {
            const Icon = PIPELINE_STAGES[Math.max(0, currentIdx)]?.icon || Upload
            return <Icon className="h-7 w-7 text-white" />
          })()}
        </div>
      </div>

      <h2 className="text-lg font-semibold tracking-tight">Processing document</h2>
      <p className="mt-1 text-sm text-slate-500">Please keep the app open</p>

      <div className="mt-10 w-full max-w-xs space-y-4">
        {PIPELINE_STAGES.map((s, i) => {
          const Icon = s.icon
          const done = i < currentIdx
          const active = i === currentIdx
          return (
            <motion.div
              key={s.id}
              className="flex items-center gap-3"
              animate={{ opacity: done || active ? 1 : 0.45 }}
            >
              <div
                className={`relative flex h-11 w-11 items-center justify-center rounded-xl ${
                  done
                    ? 'bg-emerald-500/20'
                    : active
                      ? 'bg-brand-600/40'
                      : 'bg-slate-800/80'
                }`}
              >
                {active && (
                  <span className="pulse-ring absolute inset-0 rounded-xl border border-brand-400/50" />
                )}
                <Icon
                  className={`relative h-5 w-5 ${
                    done ? 'text-emerald-400' : active ? 'text-brand-300' : 'text-slate-600'
                  }`}
                />
              </div>
              <span className={active ? 'font-medium text-white' : 'text-slate-500'}>
                {s.label}
              </span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
