import { motion } from 'framer-motion'
import {
  FileText,
  Receipt,
  FilePenLine,
  FileSignature,
  Settings,
  Scale,
} from 'lucide-react'

const TABS = [
  { id: 'docs', label: 'Docs', icon: FileText },
  { id: 'tax', label: 'Tax Vault', icon: Receipt },
  { id: 'docdraft', label: 'DocDraft', icon: FilePenLine },
  { id: 'contracts', label: 'Contracts', icon: FileSignature },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'lawyer', label: 'Lawyer AI', icon: Scale },
]

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-700/50 bg-slate-950/90 backdrop-blur-xl safe-bottom">
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 pt-1">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className="relative flex min-w-0 flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium"
            >
              {active && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute -top-px left-2 right-2 h-0.5 rounded-full bg-brand-500"
                />
              )}
              <Icon
                className={`h-5 w-5 shrink-0 ${active ? 'text-brand-400' : 'text-slate-500'}`}
              />
              <span className={active ? 'text-brand-300' : 'text-slate-500'}>{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
