# ProofForge production image — API serves web dist when PROOFFORGE_SERVE_STATIC=1
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages ./packages
COPY apps ./apps
COPY scripts ./scripts
RUN npm ci && npm run build

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PROOFFORGE_SERVE_STATIC=1
ENV PROOFFORGE_API_HOST=0.0.0.0
ENV PROOFFORGE_API_PORT=8790
COPY --from=build /app /app
EXPOSE 8790
CMD ["npm", "run", "start:prod"]
