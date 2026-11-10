# The production image: Next.js's standalone server with Payload inside it.
# Built and started by docker-compose.yml; see the README for deploying.

ARG NODE_VERSION=24.22.1

FROM node:${NODE_VERSION}-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Dependencies, installed with bun (the project's package manager) from the lockfile.
FROM base AS deps
COPY --from=oven/bun:1-slim /usr/local/bin/bun /usr/local/bin/bun
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# The build. It doesn't need the database: pages are rendered on their first visit.
FROM base AS builder
COPY --from=oven/bun:1-slim /usr/local/bin/bun /usr/local/bin/bun
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Baked into the build, so it must be the live address.
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
RUN bun run build

# The image that runs: only the standalone server and what it reads at runtime.
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# The raw images the first start loads into an empty database (cms/seed).
COPY --from=builder --chown=nextjs:nodejs /app/images ./images
COPY --from=builder --chown=nextjs:nodejs /app/image-based-portfolio ./image-based-portfolio

# Uploaded images live in a volume mounted here; the page cache lives in .next.
RUN mkdir -p media .next/cache && chown -R nextjs:nodejs media .next

USER nextjs
EXPOSE 3000
VOLUME ["/app/media"]

# Database migrations run on start (prodMigrations in payload.config.ts).
CMD ["node", "server.js"]
