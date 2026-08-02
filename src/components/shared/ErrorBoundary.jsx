import { Component } from 'react'

function isDomInsertError(error) {
  const msg = String(error?.message || error || '')
  return (
    error?.name === 'NotFoundError' ||
    /insertBefore|removeChild|NotFoundError/i.test(msg)
  )
}

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info?.componentStack)
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      const domClash = isDomInsertError(this.state.error)
      const title = this.props.title || 'Etwas ist schiefgelaufen'
      const hint = domClash
        ? 'Oft durch Browser-Übersetzung oder eine Erweiterung verursacht. Übersetzung für diese Seite ausschalten und neu laden.'
        : 'Die App ist auf einen unerwarteten Fehler gestoßen. Bitte laden Sie die Seite neu.'

      return (
        <div
          className={
            this.props.compact
              ? 'flex flex-col items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-8 text-center text-slate-100'
              : 'flex min-h-dvh flex-col items-center justify-center bg-slate-950 px-6 text-center text-slate-100'
          }
          translate="no"
        >
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="mt-2 max-w-md text-sm text-slate-400">{hint}</p>
          {domClash && (
            <p className="mt-2 max-w-md text-xs text-slate-500">
              Tip: disable Google Translate / page translation for this site, then reload.
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {this.props.allowReset && (
              <button
                type="button"
                onClick={this.handleReset}
                className="rounded-xl border border-slate-600 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800"
              >
                Erneut versuchen
              </button>
            )}
            <button
              type="button"
              onClick={this.handleReload}
              className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-500"
            >
              Seite neu laden
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
