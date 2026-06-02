import { useState } from 'react'
import ScanVaultTabBar from '@/components/scanvault/ScanVaultTabBar'
import ScanTab from './ScanTab'
import DocumentsTab from './DocumentsTab'
import FoldersTab from './FoldersTab'
import ScanVaultSettings from './ScanVaultSettings'
import ScanSession from './ScanSession'
import DocumentViewer from './DocumentViewer'
import ExportShare from './ExportShare'
import PremiumUpgrade from './PremiumUpgrade'
import Profile from './Profile'
import SearchResults from './SearchResults'
import { getSessionUser } from '@/lib/scanvault/store'
import { canAddScan } from '@/lib/scanvault/limits'

export default function ScanVaultApp({ onOpenBusinessSuite, user: userProp, setUser: setUserProp }) {
  const [userLocal, setUserLocal] = useState(getSessionUser())
  const user = userProp ?? userLocal
  const setUser = setUserProp ?? setUserLocal
  const [tab, setTab] = useState('scan')
  const [scanning, setScanning] = useState(false)
  const [viewDoc, setViewDoc] = useState(null)
  const [exportDoc, setExportDoc] = useState(null)
  const [showPremium, setShowPremium] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [folderFilter, setFolderFilter] = useState(null)

  const startScan = () => {
    const check = canAddScan(user)
    if (!check.ok) {
      setShowPremium(true)
      return
    }
    setScanning(true)
  }

  if (scanning) {
    return (
      <ScanSession
        user={user}
        onClose={() => setScanning(false)}
        onSaved={() => {
          setUser(getSessionUser())
          setTab('documents')
        }}
        onUpgrade={() => setShowPremium(true)}
      />
    )
  }

  if (showPremium) {
    return (
      <PremiumUpgrade
        user={user}
        onBack={() => setShowPremium(false)}
        onUpgraded={setUser}
      />
    )
  }

  if (showProfile) {
    return (
      <Profile
        user={user}
        onBack={() => setShowProfile(false)}
        onUserChange={setUser}
      />
    )
  }

  if (searchQuery) {
    return (
      <SearchResults
        query={searchQuery}
        onBack={() => setSearchQuery('')}
        onSelect={(d) => {
          setSearchQuery('')
          setViewDoc(d)
        }}
      />
    )
  }

  if (exportDoc) {
    return (
      <ExportShare
        document={exportDoc}
        user={user}
        onBack={() => setExportDoc(null)}
        onUpgrade={() => setShowPremium(true)}
      />
    )
  }

  if (viewDoc) {
    return (
      <DocumentViewer
        document={viewDoc}
        onBack={() => setViewDoc(null)}
        onExport={(d) => setExportDoc(d)}
        onDelete={() => setViewDoc(null)}
        onUpdated={(d) => setViewDoc(d)}
      />
    )
  }

  return (
    <div className="scanvault-shell flex min-h-full flex-col bg-[#0f0f0f] text-white">
      <main className="mx-auto w-full max-w-lg flex-1 overflow-y-auto pb-24">
        {folderFilter ? (
          <div className="px-4 pb-4">
            <button
              type="button"
              onClick={() => setFolderFilter(null)}
              className="safe-top mb-3 text-sm text-[#007AFF]"
            >
              ← Folders
            </button>
            <h2 className="mb-4 text-xl font-bold">
              {folderFilter.emoji} {folderFilter.name}
            </h2>
            <DocumentsTab
              folderId={folderFilter.id}
              onOpenDoc={setViewDoc}
              onSearch={setSearchQuery}
            />
          </div>
        ) : (
          <>
            {tab === 'scan' && <ScanTab user={user} onStartScan={startScan} />}
            {tab === 'documents' && (
              <DocumentsTab
                user={user}
                onOpenDoc={setViewDoc}
                onSearch={setSearchQuery}
                onUpgrade={() => setShowPremium(true)}
              />
            )}
            {tab === 'folders' && (
              <FoldersTab
                user={user}
                onOpenFolder={setFolderFilter}
                onUpgrade={() => setShowPremium(true)}
              />
            )}
            {tab === 'settings' && (
              <ScanVaultSettings
                user={user}
                onProfile={() => setShowProfile(true)}
                onUpgrade={() => setShowPremium(true)}
                onLogout={() => window.location.reload()}
                onOpenBusinessSuite={onOpenBusinessSuite}
              />
            )}
          </>
        )}
      </main>
      {!folderFilter && <ScanVaultTabBar activeTab={tab} onTabChange={setTab} />}
    </div>
  )
}
