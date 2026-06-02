import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Sparkles, X } from 'lucide-react'
import { usePremium } from '@/context/PremiumContext'

export default function PremiumModal() {
  const { modalOpen, modalFeature, setModalOpen, activateTrial } = usePremium()

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-4 safe-bottom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setModalOpen(false)}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl bg-slate-800 p-6 shadow-2xl"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/30">
                <Crown className="h-6 w-6 text-brand-400" />
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-white">ScanLogic Premium</h2>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-medium text-brand-300">{modalFeature}</span> ist ein
              Premium-Feature. Starten Sie Ihre kostenlose Testphase.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-400" /> KI-Hintergrundentfernung
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-400" /> Unbegrenzte OCR & Markdown
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-400" /> Erweiterte Steuer- & Vertrags-Tools
              </li>
            </ul>
            <button
              type="button"
              onClick={activateTrial}
              className="mt-6 w-full rounded-xl bg-brand-600 py-3 font-semibold text-white hover:bg-brand-500"
            >
              14 Tage kostenlos testen
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
