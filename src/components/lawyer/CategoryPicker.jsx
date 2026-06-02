import { motion } from 'framer-motion'
import { MUELLER_CATEGORIES } from '@/lib/lawyer/categories'

export default function CategoryPicker({ activeCategory, onSelect, language = 'de' }) {
  return (
    <div className="mb-3">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {language === 'en' ? '13 expertise areas' : '13 Beratungsbereiche'}
      </p>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {MUELLER_CATEGORIES.map((cat, i) => {
          const Icon = cat.icon
          const active = activeCategory === cat.id
          const label = language === 'en' ? cat.title : cat.titleDe
          return (
            <motion.button
              key={cat.id}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => onSelect(cat)}
              className={`flex w-[100px] shrink-0 flex-col items-center gap-1 rounded-xl border p-2 text-center ${
                active
                  ? 'border-brand-500/50 bg-brand-600/20'
                  : 'border-slate-700/50 bg-slate-800/40 hover:border-slate-600'
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? 'text-brand-300' : 'text-slate-500'}`} />
              <span className="text-[10px] font-medium leading-tight text-slate-300">{label}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
