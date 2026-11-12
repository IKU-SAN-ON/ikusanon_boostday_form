# Multi-stage build for the Next.js (standalone) application.
#
# Deployment model:
#   * `dependencies` installs the exact pnpm lockfile (production + dev, since the
#     Next.js build needs devDependencies).
#   * `builder` generates the Prisma client and compiles Next.js in standalone mode.
#   * `migrate` is a one-shot image target that runs `prisma migrate deploy`. It is
#     meant to be used as a short-lived job (see docker-compose*.yml) instead of
#     running migrations from the long-lived web container.
#   * `runner` is the final, minimal runtime image and runs as the unprivileged
#     `node` user.
#
# Pin the Node.js major version deliberately. Node 24 is the current LTS line and
# matches Prisma 7's supported engine range (^20.19 || ^22.12 || >=24.0).
ARG NODE_VERSION=24-slim

# ============================================
# Stage 0: Shared Node.js base
# ============================================
FROM node:${NODE_VERSION} AS base

# Prisma's engine downloader probes `openssl version` to choose the right
# schema-engine binary. Without the CLI it falls back to the OpenSSL 1.1.x
# engine, which does not match the OpenSSL 3.x libraries in the Debian base.
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# ============================================
# Stage 1: Dependencies
# ============================================
FROM base AS dependencies

WORKDIR /app

ENV CI=1

# Install a pinned pnpm instead of relying on Corepack: recent Node.js releases
# no longer ship it, and `npm i -g corepack` at runtime is both slow and a
# supply-chain risk. Keep this in sync with package.json#packageManager.
RUN npm install --global pnpm@11.7.0

# Copy only the manifests first; this layer is reused until dependencies change.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# `pnpm-workspace.yaml` is the allow-list for dependency build scripts (Prisma
# engines, esbuild, ...). Those scripts must run at build time so that
# `prisma migrate deploy` never has to download binaries when a container starts.
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install \
        --frozen-lockfile \
        --prefer-offline \
        --store-dir=/pnpm/store

# ============================================
# Stage 2: Build the Next.js application
# ============================================
FROM base AS builder

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    CI=1

# Reuse the exact dependency tree that was resolved in the dependencies stage.
COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

# Generate the Prisma client into src/generated/prisma (see prisma/schema.prisma).
# Invoke the local CLI from the lockfile instead of downloading one with
# `pnpm dlx`, so the build is reproducible and offline-capable.
RUN node_modules/.bin/prisma7 generate

RUN node_modules/.bin/next build

# ============================================
# Stage 3: One-shot database migration job
# ============================================
# Build with `--target migrate` and run it before the web container. Keeping the
# Prisma CLI and its engines out of the runner image keeps the production image
# small and free of a package-manager/runtime download path. This stage reuses
# the full dependency tree on purpose: it is a short-lived job, never the image
# that serves traffic.
FROM dependencies AS migrate

WORKDIR /app

COPY --chown=node:node prisma ./prisma
COPY --chown=node:node prisma7.config.ts ./

# Pre-download the schema engine that matches the image's OpenSSL version.
# Otherwise Prisma would try to fetch it on first `migrate deploy`, which both
# requires network access at container start and fails because the unprivileged
# user cannot write into root-owned node_modules.
RUN node_modules/.bin/prisma7 -v \
    && chown -R node:node node_modules/.pnpm/@prisma+engines@*/node_modules/@prisma/engines

USER node

CMD ["node_modules/.bin/prisma7", "migrate", "deploy"]

# ============================================
# Stage 4: Runtime image
# ============================================
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Only the standalone server, static assets and public files are copied into the
# runtime image. Everything is owned by `node` so Next.js can write its image
# optimisation/ISR cache.
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Next.js writes image-optimisation and ISR data below .next/cache. Pre-create
# it (and make the workdir writable) so the unprivileged user never hits a
# permission error on the first request.
RUN mkdir -p /app/.next/cache \
    && chown node:node /app/.next/cache /app

# Run as the unprivileged user that ships with the official Node.js image.
USER node

EXPOSE 3000

# The route is served by the standalone server; this catches crashed or
# unresponsive instances without needing curl/wget in the image.
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || '3000') + '/').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]
