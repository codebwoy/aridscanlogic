import { Component } from 'react'

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

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-slate-950 px-6 text-center text-slate-100">
          <h1 className="text-xl font-bold">Etwas ist schiefgelaufen</h1>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            Die App ist auf einen unerwarteten Fehler gestoßen. Bitte laden Sie die Seite neu.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-500"
          >
            Seite neu laden
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
