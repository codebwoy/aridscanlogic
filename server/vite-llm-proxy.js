import { createLlmProxyMiddleware, createSecurityHeadersMiddleware } from './llm-proxy.mjs'
import { createDbApiMiddleware } from './db-api.mjs'
import { createKeepAliveMiddleware } from './cron-keep-alive.mjs'
import { createApiAccessMiddleware, createRateLimitMiddleware } from './security.mjs'

export function llmProxyPlugin({ getApiKey, getModel, getDatabaseUrl, getApiSecret, getJwtSecret }) {
  const llm = createLlmProxyMiddleware({ getApiKey, getModel })
  const db = createDbApiMiddleware(getDatabaseUrl, getJwtSecret)
  const securityDev = createSecurityHeadersMiddleware({ enableCsp: false })
  const securityPreview = createSecurityHeadersMiddleware({ enableCsp: true })
  const apiAccess = createApiAccessMiddleware(getApiSecret)
  const rateLimitLlm = createRateLimitMiddleware({ pathPrefix: '/api/llm', windowMs: 60_000, max: 30 })
  const rateLimitDb = createRateLimitMiddleware({ pathPrefix: '/api/db', windowMs: 60_000, max: 120 })

  const keepAlive = createKeepAliveMiddleware()

  const attachApi = (server) => {
    server.middlewares.use(keepAlive)
    server.middlewares.use(apiAccess)
    server.middlewares.use(rateLimitDb)
    server.middlewares.use(rateLimitLlm)
    server.middlewares.use(db)
    server.middlewares.use(llm)
  }

  const attachDev = (server) => {
    server.middlewares.use(securityDev)
    attachApi(server)
  }

  const attachPreview = (server) => {
    server.middlewares.use(securityPreview)
    attachApi(server)
  }

  const prodCsp =
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"

  return {
    name: 'scanlogic-llm-proxy',
    configureServer: attachDev,
    configurePreviewServer: attachPreview,
    transformIndexHtml(html, ctx) {
      if (ctx.server) return html
      const tag = `<meta http-equiv="Content-Security-Policy" content="${prodCsp}" />`
      return html.includes('Content-Security-Policy') ? html : html.replace('<head>', `<head>\n    ${tag}`)
    },
  }
}
