import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import ScanVaultRoot from './pages/scanvault/ScanVaultRoot'
import AdminRoot from './pages/admin/AdminRoot'
import { applySeo } from '@/lib/seo/applySeo'
import { getAppMode, getShareToken, setAppMode, RETURN_TAB_KEY, isAdminMode } from '@/lib/navigation/mode'
import { setTabHash } from '@/lib/navigation/tabs'

export default function App() {
  const [mode, setMode] = useState(getAppMode)

  const openSuite = () => {
    setAppMode('suite')
    setMode('suite')
    if (isAdminMode()) {
      const url = new URL(window.location.href)
      url.searchParams.delete('admin')
      window.history.replaceState({}, '', url.pathname + url.search + url.hash)
    }
    const returnTab = sessionStorage.getItem(RETURN_TAB_KEY)
    if (returnTab) {
      sessionStorage.removeItem(RETURN_TAB_KEY)
      setTabHash(returnTab)
    }
  }

  const openScanVault = () => {
    sessionStorage.setItem(RETURN_TAB_KEY, 'settings')
    setAppMode('scanvault')
    setMode('scanvault')
  }

  useEffect(() => {
    if (mode === 'admin') applySeo('suite')
    else if (mode === 'scanvault' || getShareToken()) applySeo('scanvault')
    else applySeo('suite')
  }, [mode])

  if (mode === 'admin') {
    return <AdminRoot onExit={openSuite} />
  }

  if (mode === 'scanvault' || getShareToken()) {
    return <ScanVaultRoot onOpenBusinessSuite={openSuite} />
  }

  return <Dashboard onOpenScanVault={openScanVault} />
}
