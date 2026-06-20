import { handleLlmStatusRequest } from '../../server/llm-proxy.mjs'

export const config = { maxDuration: 10 }

export default async function handler(req, res) {
  await handleLlmStatusRequest(req, res)
}
