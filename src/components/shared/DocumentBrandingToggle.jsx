import { useState } from 'react'
import { BRAND_SUITE_NAME } from '@/lib/brand'
import {
  isDocumentBrandingEnabled,
  setDocumentBrandingPreference,
} from '@/lib/documentBranding'

export function useDocumentBranding() {
  const [includeBranding, setIncludeBrandingState] = useState(() => isDocumentBrandingEnabled())

  const setIncludeBranding = (enabled) => {
    setIncludeBrandingState(enabled)
    setDocumentBrandingPreference(enabled)
  }

  return { includeBranding, setIncludeBranding }
}

export default function DocumentBrandingToggle({ checked, onChange, className = '' }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border border-slate-700/60 bg-slate-800/50 px-3 py-2.5 ${className}`}
    >
      <input
        type="checkbox"
        className="mt-0.5 accent-brand-500"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-xs leading-relaxed text-slate-300">
        <span className="font-medium text-slate-100">Include ScanLogic branding on PDF</span>
        <span className="mt-0.5 block text-slate-500">
          Adds “{BRAND_SUITE_NAME}” header and footer. Leave off for client-facing invoices and
          exports.
        </span>
      </span>
    </label>
  )
}
