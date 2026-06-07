import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { useFocusTrap } from '@/hooks/useFocusTrap'

export default function ConfirmModal({
  title,
  message,
  confirmLabel,
  cancelLabel,
  destructive,
  onConfirm,
  onCancel,
}) {
  const trapRef = useFocusTrap(true)

  useEffect(() => {
    const el = trapRef.current
    if (!el) return
    const onEscape = () => onCancel()
    el.addEventListener('modal-escape', onEscape)
    return () => el.removeEventListener('modal-escape', onEscape)
  }, [onCancel, trapRef])

  return (
    <motion.div
      ref={trapRef}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-full max-w-md rounded-2xl bg-slate-800 p-6 shadow-2xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              destructive ? 'bg-red-500/20' : 'bg-amber-500/20'
            }`}
          >
            <AlertTriangle
              className={`h-5 w-5 ${destructive ? 'text-red-400' : 'text-amber-400'}`}
              aria-hidden
            />
          </div>
          <div>
            <h2 id="confirm-title" className="text-lg font-bold text-white">
              {title}
            </h2>
            <p id="confirm-message" className="mt-1 text-sm text-slate-300">
              {message}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-600 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-700"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white ${
              destructive ? 'bg-red-600 hover:bg-red-500' : 'bg-brand-600 hover:bg-brand-500'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
