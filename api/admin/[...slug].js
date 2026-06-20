import { handleAdminApiRequest } from '../../server/admin-api.mjs'

function buildAdminPath(slug) {
  const parts = Array.isArray(slug) ? slug : slug ? [slug] : []
  return `/api/admin/${parts.map((part) => encodeURIComponent(part)).join('/')}`
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
  const pathname = buildAdminPath(req.query.slug)
  const queryString = buildQueryString(req.query)
  await handleAdminApiRequest(req, res, { pathname: `${pathname}${queryString}` })
}
