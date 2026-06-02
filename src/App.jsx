import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import ScanVaultRoot from './pages/scanvault/ScanVaultRoot'
import { applySeo } from '@/lib/seo/applySeo'

const MODE_KEY = 'scanlogic_app_mode'

function getShareToken() {
  return new URLSearchParams(window.location.search).get('share')
}

export default function App() {
  const [mode, setMode] = useState(() => {
    if (getShareToken()) return 'scanvault'
    return sessionStorage.getItem(MODE_KEY) || 'suite'
  })

  const openSuite = () => {
    sessionStorage.setItem(MODE_KEY, 'suite')
    setMode('suite')
  }

  const openScanVault = () => {
    sessionStorage.setItem(MODE_KEY, 'scanvault')
    setMode('scanvault')
  }

  useEffect(() => {
    if (mode === 'scanvault' || getShareToken()) applySeo('scanvault')
    else applySeo('suite')
  }, [mode])

  if (mode === 'scanvault' || getShareToken()) {
    return <ScanVaultRoot onOpenBusinessSuite={openSuite} />
  }

  return <Dashboard onOpenScanVault={openScanVault} />
}
