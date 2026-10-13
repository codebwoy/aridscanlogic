import { useCallback, useEffect, useState } from 'react'
import { BookOpen, Coins, Compass, LayoutTemplate } from 'lucide-react'
import { PUBLISHING_SPECS } from '@storyforge/shared'
import { checkDesktopGate } from './lib/desktopGate.js'
import { api, openDesktopSession, getSessionToken } from './lib/api.js'
import DesktopGate from './pages/DesktopGate.jsx'
import Studio from './pages/Studio.jsx'
import Launchpad from './pages/Launchpad.jsx'

function initialView() {
  if (typeof window === 'undefined') return 'studio'
  const hash = window.location.hash.replace(/^#/, '')
  if (hash.startsWith('launchpad')) return 'launchpad'
  const q = new URLSearchParams(window.location.search)
  if (q.get('view') === 'launchpad') return 'launchpad'
  return 'studio'
}

export default function App() {
  const [gate, setGate] = useState(() => checkDesktopGate())
  const [view, setView] = useState(initialView)
  const [session, setSession] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [projects, setProjects] = useState([])
  const [active, setActive] = useState(null)
  const [printReq, setPrintReq] = useState(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const onResize = () => setGate(checkDesktopGate())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const selectProject = useCallback(async (id) => {
    setBusy(true)
    setError('')
    try {
      const data = await api(`/v1/projects/${id}`)
      setActive(data.project)
      setPrintReq(data.printRequirements)
      setStatus(`Specs last verified: ${data.specsLastVerified}`)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }, [])

  const bootstrap = useCallback(async () => {
    if (!gate.ok) return
    setBusy(true)
    setError('')
    setStatus('Connecting to StoryForge API…')
    try {
      let data
      if (getSessionToken()) {
        try {
          const me = await api('/v1/me')
          data = {
            userId: me.userId,
            credits: me.credits,
            trialCredits: me.trialCredits,
            token: getSessionToken(),
          }
        } catch {
          data = await openDesktopSession()
        }
      } else {
        data = await openDesktopSession()
      }
      setSession(data)
      const list = await api('/v1/projects')
      setProjects(list.projects || [])
      setStatus('')
    } catch (e) {
      const msg = e.message || 'Failed to open desktop session'
      setError(
        /unavailable|Failed to fetch|503|starting/i.test(msg)
          ? `${msg} — wait for API on :8787, then click Retry session.`
          : msg,
      )
    } finally {
      setBusy(false)
    }
  }, [gate.ok])

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  if (!gate.ok) {
    return <DesktopGate width={gate.width} minWidth={gate.minWidth} />
  }

  return (
    <div className="sf-shell">
      <header className="sf-header">
        <div>
          <div className="sf-brand">StoryForge</div>
          <div className="sf-muted">AI children’s book studio · desktop · KDP-oriented</div>
        </div>
        <nav className="sf-nav" aria-label="Primary">
          <button
            type="button"
            className={view === 'studio' ? 'sf-nav-active' : ''}
            onClick={() => {
              setView('studio')
              window.location.hash = 'studio'
            }}
          >
            <LayoutTemplate size={16} aria-hidden /> Studio
          </button>
          <button
            type="button"
            className={view === 'launchpad' ? 'sf-nav-active' : ''}
            onClick={() => {
              setView('launchpad')
              window.location.hash = 'launchpad'
            }}
          >
            <Compass size={16} aria-hidden /> Launchpad
          </button>
        </nav>
        <div className="sf-btn-row">
          <span className="sf-badge sf-badge-ok" title="S25">
            {session?.onboarding?.freeCredits || session?.trialCredits || 20} free to start
          </span>
          <span className="sf-badge">
            <Coins size={14} aria-hidden /> {session?.credits ?? '—'} credits
          </span>
          <span className="sf-badge sf-badge-ok">
            <BookOpen size={14} aria-hidden /> KDP specs {PUBLISHING_SPECS.lastVerified}
          </span>
          {(error || !session) && (
            <button type="button" className="sf-btn" disabled={busy} onClick={() => bootstrap()}>
              Retry session
            </button>
          )}
        </div>
      </header>

      {error ? (
        <div className="sf-card" role="alert" style={{ margin: '0.75rem 1rem', borderColor: 'hsl(var(--sf-danger))' }}>
          {error}
        </div>
      ) : null}

      {view === 'studio' ? (
        <Studio
          session={session}
          setSession={setSession}
          projects={projects}
          setProjects={setProjects}
          active={active}
          setActive={setActive}
          printReq={printReq}
          setPrintReq={setPrintReq}
          busy={busy}
          setBusy={setBusy}
          error={error}
          setError={setError}
          status={status}
          setStatus={setStatus}
          onSelectProject={selectProject}
        />
      ) : (
        <Launchpad
          activeProject={active}
          onRefreshProject={selectProject}
          setStatus={setStatus}
          setError={setError}
        />
      )}
    </div>
  )
}
