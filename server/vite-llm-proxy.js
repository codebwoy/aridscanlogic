import { createLlmProxyMiddleware, createSecurityHeadersMiddleware } from './llm-proxy.mjs'
import { createDbApiMiddleware } from './db-api.mjs'
import { createApiAccessMiddleware, createRateLimitMiddleware } from './security.mjs'

export function llmProxyPlugin({ getApiKey, getModel, getDatabaseUrl, getApiSecret, getJwtSecret }) {
  const llm = createLlmProxyMiddleware({ getApiKey, getModel })
  const db = createDbApiMiddleware(getDatabaseUrl, getJwtSecret)
  const security = createSecurityHeadersMiddleware()
  const apiAccess = createApiAccessMiddleware(getApiSecret)
  const rateLimitLlm = createRateLimitMiddleware({ pathPrefix: '/api/llm', windowMs: 60_000, max: 30 })
  const rateLimitDb = createRateLimitMiddleware({ pathPrefix: '/api/db', windowMs: 60_000, max: 120 })

  const attach = (server) => {
    server.middlewares.use(security)
    server.middlewares.use(apiAccess)
    server.middlewares.use(rateLimitDb)
    server.middlewares.use(rateLimitLlm)
    server.middlewares.use(db)
    server.middlewares.use(llm)
  }

  const prodCsp =
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"

  return {
    name: 'scanlogic-llm-proxy',
    configureServer: attach,
    configurePreviewServer: attach,
    transformIndexHtml(html, ctx) {
      if (ctx.server) return html
      const tag = `<meta http-equiv="Content-Security-Policy" content="${prodCsp}" />`
      return html.includes('Content-Security-Policy') ? html : html.replace('<head>', `<head>\n    ${tag}`)
    },
  }
}
