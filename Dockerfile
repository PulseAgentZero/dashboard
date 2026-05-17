# ─────────────────────────────────────────────────────────────────────────────
# Pulse — Frontend (Cloud)
#
# Standalone Next.js image. Requires the Pulse API to be running separately.
# NEXT_PUBLIC_API_URL must be set to your API's public URL at build time.
#
# Build:
#   docker build \
#     --build-arg NEXT_PUBLIC_API_URL=https://api.yourpulse.io \
#     -t pulseai/pulse-frontend:latest .
#
# Run:
#   docker run -p 3000:3000 pulseai/pulse-frontend:latest
#
# Push to Docker Hub:
#   docker buildx build \
#     --build-arg NEXT_PUBLIC_API_URL=https://api.yourpulse.io \
#     --platform linux/amd64,linux/arm64 \
#     --push \
#     -t pulseai/pulse-frontend:latest .
# ─────────────────────────────────────────────────────────────────────────────


# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps first — cached unless package files change
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f pnpm-lock.yaml ]; then \
    corepack enable && pnpm install --frozen-lockfile; \
  else \
    npm ci; \
  fi

COPY . .

# NEXT_PUBLIC_* vars are baked into the static JS bundle at build time.
# Pass the correct API URL for your deployment target.
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ARG NEXT_PUBLIC_DEPLOYMENT_MODE=cloud

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_DEPLOYMENT_MODE=$NEXT_PUBLIC_DEPLOYMENT_MODE
ENV NEXT_BUILD_STANDALONE=1
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build


# ── Stage 2: Runtime ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

LABEL org.opencontainers.image.title="Pulse Frontend"
LABEL org.opencontainers.image.vendor="AgentZero"

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Standalone output layout:
#   server.js          — the Node.js HTTP server
#   .next/             — compiled server components + routing
#   .next/static/      — hashed client assets (JS, CSS) — must be copied here separately
#   public/            — static public files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public           ./public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
