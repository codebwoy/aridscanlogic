import { handleDbApiRequest } from '../../server/db-api.mjs'

function buildDbPath(slug) {
  const parts = Array.isArray(slug) ? slug : slug ? [slug] : []
  return `/api/db/${parts.map((part) => encodeURIComponent(part)).join('/')}`
}

function buildQueryString(query = {}) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (key === 'slug') continue
    if (Array.isArray(value)) {
      value.forEach((entry) => params.append(key, entry))
    } else if (value != null) {
      params.set(key, value)
    }
  }
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export default async function handler(req, res) {
  const pathname = buildDbPath(req.query.slug)
  const queryString = buildQueryString(req.query)
  await handleDbApiRequest(req, res, { pathname: `${pathname}${queryString}` })
}
