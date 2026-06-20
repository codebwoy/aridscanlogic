import { handleActivityApiRequest } from '../../server/activity-api.mjs'

function buildQueryString(query = {}) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
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
  const queryString = buildQueryString(req.query)
  await handleActivityApiRequest(req, res, { pathname: `/api/activity/events${queryString}` })
}
