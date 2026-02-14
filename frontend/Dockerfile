# ============================================================
# FRONTEND DOCKERFILE
# Multi-stage build: install deps + build → slim runtime image
# ============================================================

# --- Stage 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (Docker caches this layer)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# --- Stage 2: Runtime ---
FROM node:20-alpine AS runtime

WORKDIR /app

# Copy only the built output (not source code or node_modules)
COPY --from=builder /app/.output /app/.output

# The Nuxt server runs on port 3000 by default
EXPOSE 3000

# Health check — Nuxt serves a 200 on the root
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the Nuxt production server
CMD ["node", ".output/server/index.mjs"]