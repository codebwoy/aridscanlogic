import { motion } from 'framer-motion'
import { ScanLine, Files, FolderOpen, Settings } from 'lucide-react'

const TABS = [
  { id: 'scan', label: 'Scan', icon: ScanLine },
  { id: 'documents', label: 'Documents', icon: Files },
  { id: 'folders', label: 'Folders', icon: FolderOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function ScanVaultTabBar({ activeTab, onTabChange }) {
  return (
    <nav className="scanvault-shell fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0f0f0f]/95 backdrop-blur-xl safe-bottom">
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 pt-1">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className="relative flex min-h-[48px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium"
            >
              {active && (
                <motion.div
                  layoutId="sv-tab"
                  className="absolute -top-px left-3 right-3 h-0.5 rounded-full bg-[#007AFF]"
                />
              )}
              <Icon className={`h-5 w-5 ${active ? 'text-[#007AFF]' : 'text-slate-500'}`} />
              <span className={active ? 'text-[#007AFF]' : 'text-slate-500'}>{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
