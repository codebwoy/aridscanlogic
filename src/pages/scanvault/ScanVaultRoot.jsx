import { useState } from 'react'
import { isOnboardingDone, getSessionUser } from '@/lib/scanvault/store'
import Onboarding from './Onboarding'
import Login from './Login'
import Register from './Register'
import ScanVaultApp from './ScanVaultApp'
import ShareLinkViewer from './ShareLinkViewer'
import Dashboard from '../Dashboard'
import { getShareToken } from '@/lib/navigation/mode'

export default function ScanVaultRoot({ onOpenBusinessSuite }) {
  const shareToken = getShareToken()
  const [onboarded, setOnboarded] = useState(isOnboardingDone())
  const [user, setUser] = useState(getSessionUser())
  const [authView, setAuthView] = useState('login')
  const [suite, setSuite] = useState(false)

  const openSuite = () => {
    if (onOpenBusinessSuite) {
      onOpenBusinessSuite()
      return
    }
    setSuite(true)
  }

  if (shareToken) {
    return (
      <ShareLinkViewer
        token={shareToken}
        onOpenApp={() => {
          const url = new URL(window.location.href)
          url.searchParams.delete('share')
          window.history.replaceState({}, '', url.pathname + url.search)
          window.location.reload()
        }}
      />
    )
  }

  if (suite) {
    return <Dashboard onOpenScanVault={() => setSuite(false)} />
  }

  if (!onboarded) {
    return <Onboarding onDone={() => setOnboarded(true)} />
  }

  if (!user) {
    if (authView === 'register') {
      return <Register onSuccess={setUser} onLogin={() => setAuthView('login')} />
    }
    return <Login onSuccess={setUser} onRegister={() => setAuthView('register')} />
  }

  return <ScanVaultApp user={user} setUser={setUser} onOpenBusinessSuite={openSuite} />
}
