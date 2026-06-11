import { handleDbApiRequest } from '../../server/db-api.mjs'

export default async function handler(req, res) {
  await handleDbApiRequest(req, res, { pathname: '/api/db/status' })
}
