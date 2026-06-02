import { HelpCircle } from 'lucide-react'
import { useGuide } from '@/context/GuideContext'

export default function GuideFab() {
  const { openGuide, activeModule } = useGuide()

  return (
    <button
      type="button"
      onClick={() => openGuide(activeModule)}
      className="fixed bottom-[calc(var(--nav-mobile-h)+env(safe-area-inset-bottom)+0.75rem)] right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-900/40 transition-transform hover:scale-105 active:scale-95 lg:bottom-6 lg:left-[calc(var(--sidebar-w)+1rem)] lg:right-auto"
      aria-label="Open app guide"
      title="App-Guide"
    >
      <HelpCircle className="h-6 w-6" />
    </button>
  )
}
