# =============================================================================
# Best Player of All Time Quiz – Production Dockerfile
# =============================================================================
# Build:  docker build -t best-player-quiz .
# Run:    docker run -p 3000:3000 --env-file .env best-player-quiz
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Dependencies & Build
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only for smaller image)
RUN npm ci

# Copy source
COPY . .

# Build (Next.js standalone output)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Production Runtime
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
