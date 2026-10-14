# Hybrid production: one container serves NovelForge API + built web SPA
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json* ./
COPY packages ./packages
COPY apps ./apps
COPY scripts ./scripts
RUN npm install
RUN npm run build -w @novelforge/shared \
 && npm run build -w @novelforge/llm \
 && npm run build -w @novelforge/agents \
 && npm run build -w @novelforge/export \
 && npm run build -w @novelforge/market \
 && npm run build -w @novelforge/web

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NOVELFORGE_SERVE_STATIC=1
ENV NOVELFORGE_WEB_DIST=/app/apps/web/dist
ENV NOVELFORGE_PERSIST=1
ENV NOVELFORGE_DATA_PATH=/data/state.json
COPY --from=build /app/package.json /app/package-lock.json* ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps ./apps
RUN mkdir -p /data
EXPOSE 8080
ENV PORT=8080
ENV NOVELFORGE_API_PORT=8080
# Run as root so Fly volume mount at /data is writable after auto-stop/start
CMD ["node", "apps/api/src/index.js"]
