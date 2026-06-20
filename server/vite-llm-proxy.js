async function loadServerMiddlewares() {
  const [
    { createLlmProxyMiddleware, createSecurityHeadersMiddleware },
    { createDbApiMiddleware },
    { createAdminApiMiddleware },
    { createActivityApiMiddleware },
    { createKeepAliveMiddleware },
    { createApiAccessMiddleware, createRateLimitMiddleware },
  ] = await Promise.all([
    import('./llm-proxy.mjs'),
    import('./db-api.mjs'),
    import('./admin-api.mjs'),
    import('./activity-api.mjs'),
    import('./cron-keep-alive.mjs'),
    import('./security.mjs'),
  ])

  return {
    createLlmProxyMiddleware,
    createSecurityHeadersMiddleware,
    createDbApiMiddleware,
    createAdminApiMiddleware,
    createActivityApiMiddleware,
    createKeepAliveMiddleware,
    createApiAccessMiddleware,
    createRateLimitMiddleware,
  }
}

export function llmProxyPlugin({ getApiKey, getModel, getDatabaseUrl, getApiSecret, getJwtSecret }) {
  const prodCsp =
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'"

  const attachMiddlewares = (enableCsp) => async (server) => {
    const m = await loadServerMiddlewares()
    const security = m.createSecurityHeadersMiddleware({ enableCsp })
    const llm = m.createLlmProxyMiddleware({ getApiKey, getModel })
    const db = m.createDbApiMiddleware(getDatabaseUrl, getJwtSecret)
    const admin = m.createAdminApiMiddleware(getDatabaseUrl)
    const activity = m.createActivityApiMiddleware(getDatabaseUrl, getJwtSecret)
    const apiAccess = m.createApiAccessMiddleware(getApiSecret)
    const rateLimitLlm = m.createRateLimitMiddleware({
      pathPrefix: '/api/llm',
      windowMs: 60_000,
      max: 30,
    })
    const rateLimitDb = m.createRateLimitMiddleware({
      pathPrefix: '/api/db',
      windowMs: 60_000,
      max: 120,
    })
    const rateLimitAdmin = m.createRateLimitMiddleware({
      pathPrefix: '/api/admin',
      windowMs: 60_000,
      max: 60,
    })
    const rateLimitActivity = m.createRateLimitMiddleware({
      pathPrefix: '/api/activity',
      windowMs: 60_000,
      max: 120,
    })
    const keepAlive = m.createKeepAliveMiddleware()

    server.middlewares.use(security)
    server.middlewares.use(keepAlive)
    server.middlewares.use(apiAccess)
    server.middlewares.use(rateLimitAdmin)
    server.middlewares.use(rateLimitActivity)
    server.middlewares.use(rateLimitDb)
    server.middlewares.use(rateLimitLlm)
    server.middlewares.use(admin)
    server.middlewares.use(activity)
    server.middlewares.use(db)
    server.middlewares.use(llm)
  }

  return {
    name: 'scanlogic-llm-proxy',
    configureServer: attachMiddlewares(false),
    configurePreviewServer: attachMiddlewares(true),
    transformIndexHtml(html, ctx) {
      if (ctx.server) return html
      const tag = `<meta http-equiv="Content-Security-Policy" content="${prodCsp}" />`
      return html.includes('Content-Security-Policy') ? html : html.replace('<head>', `<head>\n    ${tag}`)
    },
  }
}
