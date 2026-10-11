# Hybrid production: one container serves AuthorForge API + built web SPA
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json* ./
COPY packages ./packages
COPY apps ./apps
COPY scripts ./scripts
RUN npm install
RUN npm run build -w @authorforge/shared \
 && npm run build -w @authorforge/llm \
 && npm run build -w @authorforge/agents \
 && npm run build -w @authorforge/export \
 && npm run build -w @authorforge/market \
 && npm run build -w @authorforge/web

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV AUTHORFORGE_SERVE_STATIC=1
ENV AUTHORFORGE_WEB_DIST=/app/apps/web/dist
COPY --from=build /app/package.json /app/package-lock.json* ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps ./apps
EXPOSE 8080
ENV PORT=8080
ENV AUTHORFORGE_API_PORT=8080
USER node
CMD ["node", "apps/api/src/index.js"]
