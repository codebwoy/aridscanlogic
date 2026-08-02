import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScanLine, FileText, Share2 } from 'lucide-react'
import { setOnboardingDone } from '@/lib/scanvault/store'
import BrandLogo from '@/components/shared/BrandLogo'

const SLIDES = [
  {
    icon: ScanLine,
    title: 'Scan anything',
    body: 'Documents, receipts, notes, and books — capture with your phone camera.',
  },
  {
    icon: FileText,
    title: 'Extract text instantly',
    body: 'OCR turns your scans into searchable, copyable text.',
  },
  {
    icon: Share2,
    title: 'Organize & share',
    body: 'Folders, PDF export, and email sharing — all in one place.',
  },
]

export default function Onboarding({ onDone }) {
  const [idx, setIdx] = useState(0)
  const slide = SLIDES[idx]
  const Icon = slide.icon

  const finish = () => {
    setOnboardingDone()
    onDone?.()
  }

  return (
    <div className="scanvault-shell flex h-full max-h-dvh flex-col overflow-y-auto overscroll-contain bg-[#0f0f0f] px-6 pb-8 text-white">
      <button
        type="button"
        onClick={finish}
        className="safe-top self-end py-4 text-sm text-[#007AFF]"
      >
        Skip
      </button>
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          className="flex flex-1 flex-col items-center justify-center text-center"
        >
          {idx === 0 ? (
            <BrandLogo size={96} rounded="rounded-3xl" className="mb-8 shadow-lg shadow-[#007AFF]/20" />
          ) : (
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#007AFF]/20">
              <Icon className="h-12 w-12 text-[#007AFF]" />
            </div>
          )}
          <h1 className="text-2xl font-bold">{slide.title}</h1>
          <p className="mt-3 max-w-xs text-slate-400">{slide.body}</p>
        </motion.div>
      </AnimatePresence>
      <div className="mb-8 flex justify-center gap-2">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${i === idx ? 'w-6 bg-[#007AFF]' : 'w-2 bg-white/20'}`}
          />
        ))}
      </div>
      {idx < SLIDES.length - 1 ? (
        <button
          type="button"
          onClick={() => setIdx((i) => i + 1)}
          className="min-h-[48px] w-full rounded-xl bg-[#007AFF] py-3 font-semibold"
        >
          Next
        </button>
      ) : (
        <button
          type="button"
          onClick={finish}
          className="min-h-[48px] w-full rounded-xl bg-[#007AFF] py-3 font-semibold"
        >
          Get Started
        </button>
      )}
    </div>
  )
}
