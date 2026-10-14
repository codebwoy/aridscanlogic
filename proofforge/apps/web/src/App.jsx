import { useEffect, useState } from 'react'
import { DESKTOP_MIN_WIDTH, isDesktop } from './lib/desktopGate.js'
import { pfApi } from './lib/api.js'
import { LibraryPage } from './pages/LibraryPage.jsx'
import { ProjectPage } from './pages/ProjectPage.jsx'

export function App() {
  const [desktop, setDesktop] = useState(isDesktop())
  const [sessionReady, setSessionReady] = useState(false)
  const [projectId, setProjectId] = useState(() => {
    const u = new URL(window.location.href)
    return u.searchParams.get('project') || ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    const onResize = () => setDesktop(isDesktop())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!desktop) return
    let cancelled = false
    ;(async () => {
      try {
        await pfApi.session(window.innerWidth)
        if (!cancelled) setSessionReady(true)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Session failed')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [desktop])

  // Handoff: ?handoff=1 with sessionStorage payload from NovelForge
  useEffect(() => {
    if (!sessionReady) return
    const u = new URL(window.location.href)
    if (u.searchParams.get('handoff') !== '1') return
    let cancelled = false
    ;(async () => {
      try {
        const raw = sessionStorage.getItem('proofforge_handoff')
        if (!raw) return
        sessionStorage.removeItem('proofforge_handoff')
        const payload = JSON.parse(raw)
        const { project } = await pfApi.importProject(payload)
        if (cancelled) return
        setProjectId(project.id)
        u.searchParams.delete('handoff')
        u.searchParams.set('project', project.id)
        window.history.replaceState({}, '', u.toString())
      } catch (err) {
        if (!cancelled) setError(err.message || 'Import failed')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [sessionReady])

  if (!desktop) {
    return (
      <div className="gate">
        <div>
          <h1 className="brand">ProofForge</h1>
          <p className="tagline">
            Desktop required (≥{DESKTOP_MIN_WIDTH}px). Open this studio on a computer — same pattern
            as NovelForge and AuthorForge.
          </p>
        </div>
      </div>
    )
  }

  if (!sessionReady) {
    return (
      <div className="gate">
        <p className="muted">{error || 'Starting desktop session…'}</p>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <header style={{ marginBottom: '1.5rem' }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>
            <h1 className="brand">ProofForge</h1>
            <p className="tagline">
              Humanoid proofreader · whole-manuscript audit · not Amazon-affiliated
            </p>
          </div>
          {projectId ? (
            <button type="button" className="btn" onClick={() => setProjectId('')}>
              All projects
            </button>
          ) : null}
        </div>
        {error ? (
          <p style={{ color: 'var(--danger)', marginTop: '0.75rem' }} role="alert">
            {error}
          </p>
        ) : null}
      </header>

      {projectId ? (
        <ProjectPage
          projectId={projectId}
          onError={setError}
          onBack={() => setProjectId('')}
        />
      ) : (
        <LibraryPage
          onOpen={(id) => {
            setProjectId(id)
            const u = new URL(window.location.href)
            u.searchParams.set('project', id)
            window.history.replaceState({}, '', u.toString())
          }}
          onError={setError}
        />
      )}
    </div>
  )
}
