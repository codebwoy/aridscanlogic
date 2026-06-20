import { motion } from 'framer-motion'
import { MUELLER_CATEGORIES, getStarterPrompt } from '@/lib/lawyer/categories'

/** Featured starter cards (subset of 13 categories) */
const FEATURED_IDS = [
  'financial-literacy',
  'portfolio',
  'legal-structure',
  'tax',
  'international',
  'strategy',
]

export default function QuickPrompts({ onSelect, language = 'de', compact }) {
  if (compact) return null

  const cards = FEATURED_IDS.map((id) => MUELLER_CATEGORIES.find((c) => c.id === id)).filter(Boolean)

  return (
    <div className="mb-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {language === 'en' ? 'Featured topics' : 'Empfohlene Themen'}
      </p>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {cards.map((card, i) => {
          const Icon = card.icon
          const title = language === 'en' ? card.title : card.titleDe
          return (
            <motion.button
              key={card.id}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => onSelect(getStarterPrompt(card, language), card.id)}
              className="premium-card flex w-[168px] shrink-0 flex-col gap-2 p-4 text-left hover:border-brand-500/30"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500/30 to-indigo-600/20">
                <Icon className="h-4 w-4 text-brand-300" />
              </div>
              <p className="line-clamp-3 text-sm font-semibold leading-tight text-white">{title}</p>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export { MUELLER_CATEGORIES }
