import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

export default function StepComplete({ formData, onFinish }) {
  return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
      <CheckCircle className="mx-auto mb-4 h-20 w-20 text-emerald-400" />
      <h2 className="text-xl font-bold">Your business registration is complete!</h2>
      <div className="premium-card mt-6 space-y-2 p-4 text-left text-sm">
        <p>
          <span className="text-slate-500">Structure:</span> {formData.businessStructure}
        </p>
        {formData.steuernummer && (
          <p>
            <span className="text-slate-500">St.-Nr.:</span> {formData.steuernummer}
          </p>
        )}
        {formData.ustIdNr && (
          <p>
            <span className="text-slate-500">USt-IdNr.:</span> {formData.ustIdNr}
          </p>
        )}
      </div>
      <div className="premium-card mt-4 p-4 text-left text-sm">
        <p className="font-semibold text-brand-300">Tax Vault configured</p>
        <ul className="mt-2 space-y-1 text-xs text-slate-400">
          <li>✓ Business profile & Steuernummer</li>
          <li>✓ VAT scheme & filing schedule</li>
          <li>✓ German deadlines loaded</li>
          <li>✓ SKR03 expense categories</li>
        </ul>
      </div>
      <button type="button" onClick={onFinish} className="btn-primary mt-6 w-full rounded-xl py-3 font-semibold">
        Activate Tax Vault
      </button>
    </motion.div>
  )
}
