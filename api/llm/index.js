import { handleLlmPostRequest } from '../../server/llm-proxy.mjs'

export const config = { maxDuration: 60 }

export default async function handler(req, res) {
  await handleLlmPostRequest(req, res)
}
