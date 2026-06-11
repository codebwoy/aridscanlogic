import { handleLlmStatusRequest } from '../../server/llm-proxy.mjs'

export default async function handler(req, res) {
  await handleLlmStatusRequest(req, res)
}
