# syntax=docker/dockerfile:1.7

# ──────────────────────────────────────────────────────────────
# Stage 1 — Dependencies
# Install node_modules in isolation so Docker can cache them
# when only source files change.
# ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

# Only copy what npm needs for a deterministic install
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# ──────────────────────────────────────────────────────────────
# Stage 2 — Builder
# Compiles the Next.js app into .next/standalone
# ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

# NEXT_PUBLIC_* vars are inlined into the client bundle at build time.
# They MUST be provided here (not only at runtime).
ARG NEXT_PUBLIC_POKT_SEPOLIA_RPC=https://eth-sepolia-testnet.api.pocket.network
ENV NEXT_PUBLIC_POKT_SEPOLIA_RPC=$NEXT_PUBLIC_POKT_SEPOLIA_RPC
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ──────────────────────────────────────────────────────────────
# Stage 3 — Runner
# Tiny production image: standalone server + static assets only
# ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create a non-root user (uid 1001) for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Standalone output includes a minimal server.js and only the
# node_modules that are actually imported at runtime.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public           ./public

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]