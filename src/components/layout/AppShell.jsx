/**
 * Mobile-first app chrome: bottom nav on small screens, sidebar + wide content on lg+.
 */
export default function AppShell({ variant = 'suite', nav, children, fullHeight = false }) {
  const shellClass = variant === 'scanvault' ? 'scanvault-shell' : 'app-shell'

  return (
    <div className={`${shellClass} flex min-h-dvh flex-col text-slate-100`}>
      <a
        href="#main-content"
        className="absolute left-4 top-4 z-[200] -translate-y-20 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition focus:translate-y-0"
      >
        Zum Inhalt springen
      </a>
      {nav}
      <main id="main-content" className="app-main flex min-h-0 flex-1 flex-col">
        <div className={`app-main-scroll ${fullHeight ? 'flex flex-col' : ''}`}>
          <div className={`app-main-inner ${fullHeight ? 'flex min-h-0 flex-1 flex-col' : ''}`}>
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
