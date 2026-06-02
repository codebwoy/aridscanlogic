/**
 * Mobile-first app chrome: bottom nav on small screens, sidebar + wide content on lg+.
 */
export default function AppShell({ variant = 'suite', nav, children, fullHeight = false }) {
  const shellClass = variant === 'scanvault' ? 'scanvault-shell' : 'app-shell'

  return (
    <div className={`${shellClass} flex min-h-dvh flex-col text-slate-100`}>
      {nav}
      <main className="app-main flex min-h-0 flex-1 flex-col">
        <div className={`app-main-scroll ${fullHeight ? 'flex flex-col' : ''}`}>
          <div className={`app-main-inner ${fullHeight ? 'flex min-h-0 flex-1 flex-col' : ''}`}>
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
