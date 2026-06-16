import { handleKeepAliveRequest } from '../../server/cron-keep-alive.mjs'

// Vercel: allow cold-start wakeup via HEAD, scheduled GET, and manual POST
export const config = { maxDuration: 30 }

export default async function handler(req, res) {
  await handleKeepAliveRequest(req, res)
}
