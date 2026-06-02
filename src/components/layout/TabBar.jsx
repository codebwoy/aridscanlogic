import {
  FileText,
  Receipt,
  FilePenLine,
  FileSignature,
  Settings,
  Scale,
  BookOpen,
} from 'lucide-react'
import ResponsiveNav from './ResponsiveNav'
import { useGuideOptional } from '@/context/GuideContext'

const TABS = [
  { id: 'docs', label: 'Docs', icon: FileText },
  { id: 'tax', label: 'Tax Vault', icon: Receipt },
  { id: 'docdraft', label: 'DocDraft', icon: FilePenLine },
  { id: 'contracts', label: 'Contracts', icon: FileSignature },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'lawyer', label: 'Lawyer AI', icon: Scale },
]

export default function TabBar({ activeTab, onTabChange }) {
  const guide = useGuideOptional()

  return (
    <ResponsiveNav
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={onTabChange}
      variant="suite"
      layoutId="suite-tab"
      brandTitle="ScanLogic"
      brandSubtitle="Business Suite"
      footerAction={
        guide
          ? {
              label: 'App-Guide',
              icon: BookOpen,
              onClick: () => guide.openGuide(activeTab),
            }
          : undefined
      }
    />
  )
}
