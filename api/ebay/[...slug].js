import { handleEbayRequest } from '../../server/ebay-api.mjs'

export const config = { maxDuration: 60 }

export default async function handler(req, res) {
  // Vercel path may omit /api prefix depending on routing — normalize
  if (req.url && !req.url.startsWith('/api/ebay')) {
    const q = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''
    const slug = Array.isArray(req.query?.slug) ? req.query.slug.join('/') : req.query?.slug || ''
    req.url = `/api/ebay/${slug}${q}`
  }
  await handleEbayRequest(req, res)
}
