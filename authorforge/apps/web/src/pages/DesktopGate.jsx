import { Monitor } from 'lucide-react'
import { DESKTOP_MIN_WIDTH } from '../lib/desktopGate'
import { t } from '@authorforge/shared'

export default function DesktopGate({ lang = 'en' }) {
  return (
    <div className="gate">
      <div className="card" style={{ maxWidth: 420 }}>
        <Monitor size={36} color="var(--af-accent)" aria-hidden />
        <h1 className="brand" style={{ marginTop: '0.75rem' }}>
          {t(lang, 'appName')}
        </h1>
        <p className="badge" style={{ marginTop: '0.5rem', display: 'inline-block' }}>
          {t(lang, 'categoryBadge')}
        </p>
        <p className="muted" style={{ marginTop: '0.5rem' }}>
          {t(lang, 'positioningLead')}
        </p>
        <p className="muted">{t(lang, 'desktopRequired')}</p>
        <p className="muted" style={{ marginTop: '0.75rem' }}>
          Minimum width: {DESKTOP_MIN_WIDTH}px. {t(lang, 'offlineHint')}
        </p>
      </div>
    </div>
  )
}
