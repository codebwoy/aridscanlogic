import { handleKeepAliveRequest } from '../../server/cron-keep-alive.mjs'

export default async function handler(req, res) {
  await handleKeepAliveRequest(req, res)
}
