import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, CreditCard } from 'lucide-react'
import BrandLogo from '@/components/shared/BrandLogo'
import { usePremium } from '@/context/PremiumContext'
import { useAiLanguage } from '@/context/AiLanguageContext'
import { useFocusTrap } from '@/hooks/useFocusTrap'

export default function PremiumModal() {
  const { modalOpen, modalFeature, setModalOpen, activateTrial, openPlans } = usePremium()
  const { language } = useAiLanguage()
  const de = language !== 'en'
  const trapRef = useFocusTrap(modalOpen)

  useEffect(() => {
    const el = trapRef.current
    if (!el || !modalOpen) return
    const onEscape = () => setModalOpen(false)
    el.addEventListener('modal-escape', onEscape)
    return () => el.removeEventListener('modal-escape', onEscape)
  }, [modalOpen, setModalOpen, trapRef])

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          ref={trapRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="premium-modal-title"
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-4 safe-bottom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setModalOpen(false)}
        >
          <motion.div
            className="mx-4 w-full max-w-md rounded-2xl bg-slate-800 p-6 shadow-2xl sm:mx-auto sm:max-w-lg"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <BrandLogo size={48} rounded="rounded-2xl" />
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-700"
                aria-label={de ? 'Schließen' : 'Close'}
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <h2 id="premium-modal-title" className="text-xl font-bold text-white">
              ScanLogic Premium
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-medium text-brand-300">{modalFeature}</span>{' '}
              {de
                ? 'ist ein Premium-Feature. Wählen Sie einen Plan oder starten Sie die Testphase.'
                : 'is a premium feature. Choose a plan or start your free trial.'}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-400" aria-hidden />
                {de ? 'KI-Hintergrundentfernung' : 'AI background removal'}
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-400" aria-hidden />
                {de ? 'Unbegrenzte OCR & Markdown' : 'Unlimited OCR & Markdown'}
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-400" aria-hidden />
                {de ? 'Erweiterte Steuer- & Vertrags-Tools' : 'Advanced tax & contract tools'}
              </li>
            </ul>
            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={activateTrial}
                className="w-full rounded-xl bg-brand-600 py-3 font-semibold text-white hover:bg-brand-500"
              >
                {de ? '14 Tage kostenlos testen' : '14-day free trial'}
              </button>
              <button
                type="button"
                onClick={openPlans}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-500/40 bg-brand-900/30 py-3 text-sm font-semibold text-brand-200 hover:bg-brand-900/50"
              >
                <CreditCard className="h-4 w-4" aria-hidden />
                {de ? 'Pläne & Zahlung ansehen' : 'View plans & billing'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
