import { Monitor } from 'lucide-react'

export default function DesktopGate({ width, minWidth }) {
  return (
    <div className="sf-gate">
      <Monitor aria-hidden size={40} />
      <h1>StoryForge is desktop-only</h1>
      <p>
        The illustration studio needs a wide canvas, print preflight, and focused editors. Open this
        page on a computer with at least {minWidth}px width (yours: {width}px).
      </p>
      <p className="sf-muted">
        On your phone, use ScanLogic → BizStart → Amazon Business Hub for KDP programme guidance.
      </p>
    </div>
  )
}
