import { createLlmProxyMiddleware, createSecurityHeadersMiddleware } from './llm-proxy.mjs'
import { createDbApiMiddleware } from './db-api.mjs'

export function llmProxyPlugin({ getApiKey, getModel, getDatabaseUrl }) {
  const llm = createLlmProxyMiddleware({ getApiKey, getModel })
  const db = createDbApiMiddleware(getDatabaseUrl)
  const security = createSecurityHeadersMiddleware()

  const attach = (server) => {
    server.middlewares.use(security)
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
