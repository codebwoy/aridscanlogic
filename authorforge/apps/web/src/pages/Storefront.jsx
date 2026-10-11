import { useEffect, useState } from 'react'
import { checkoutStore, getStorefront } from '../lib/api'

export default function Storefront({ slug }) {
  const [data, setData] = useState(null)
  const [email, setEmail] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getStorefront(slug)
      .then(setData)
      .catch((e) => setError(e.message))
  }, [slug])

  useEffect(() => {
    if (!data?.jsonld) return
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.text = JSON.stringify(data.jsonld)
    el.id = 'af-jsonld'
    document.getElementById('af-jsonld')?.remove()
    document.head.appendChild(el)
    return () => el.remove()
  }, [data])

  async function buy() {
    setError('')
    try {
      const r = await checkoutStore(slug, email || undefined)
      setResult(r)
      if (r.checkoutUrl) {
        window.location.href = r.checkoutUrl
      }
    } catch (e) {
      setError(e.message)
    }
  }

  if (error && !data) {
    return (
      <div className="gate">
        <div className="card">{error}</div>
      </div>
    )
  }
  if (!data) {
    return (
      <div className="gate">
        <p className="muted">Loading storefront…</p>
      </div>
    )
  }

  return (
    <div className="panel" style={{ maxWidth: 720, margin: '0 auto' }}>
      <p className="badge">AuthorForge storefront</p>
      <h1 className="brand" style={{ fontSize: '2.4rem', margin: '0.75rem 0 0.25rem' }}>
        {data.title}
      </h1>
      {data.subtitle ? <p className="muted">{data.subtitle}</p> : null}
      <p style={{ marginTop: '0.5rem' }}>by {data.author || 'Author'}</p>

      <div className="card" style={{ marginTop: '1.25rem' }}>
        <h2 style={{ marginTop: 0, fontFamily: 'var(--af-serif)' }}>Why this book</h2>
        <ul>
          {(data.key_selling_points || ['A practical first draft you can trust and revise']).map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        {data.bio ? <p className="muted">{data.bio}</p> : null}
      </div>

      {data.sample?.length ? (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h2 style={{ marginTop: 0, fontFamily: 'var(--af-serif)' }}>Sample</h2>
          {data.sample.map((s) => (
            <div key={s.title} className="prose">
              <h3>{s.title}</h3>
              {String(s.content_md || '')
                .split(/\n\n+/)
                .slice(0, 4)
                .map((p, i) => (
                  <p key={i}>{p.replace(/<!--[\s\S]*?-->/g, '')}</p>
                ))}
            </div>
          ))}
        </div>
      ) : null}

      <div className="card" style={{ marginTop: '1rem' }}>
        <p style={{ fontSize: '1.4rem', margin: 0 }}>
          {(data.price_cents / 100).toFixed(2)} {(data.currency || 'eur').toUpperCase()}
        </p>
        <div className="field" style={{ marginTop: '0.75rem' }}>
          <label htmlFor="email">Email (optional receipt)</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button type="button" className="btn btn-primary" onClick={buy}>
          Buy & download (test)
        </button>
        {error ? <p className="warn" style={{ marginTop: '0.75rem' }}>{error}</p> : null}
        {result ? (
          <p className="muted" style={{ marginTop: '0.75rem' }}>
            Order {result.orderId} —{' '}
            <a href={result.downloadPath} rel="noopener noreferrer">
              Secure download
            </a>
          </p>
        ) : null}
      </div>

      <p className="muted" style={{ marginTop: '1.5rem' }}>
        Privacy-friendly digital delivery. EU customers: Stripe Tax recommended in production. Not affiliated
        with Amazon.
      </p>
    </div>
  )
}
