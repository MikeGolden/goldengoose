# syntax=docker/dockerfile:1

# ── build ───────────────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS build
WORKDIR /app
ENV CI=1

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY astro.config.mjs tsconfig.json ./
COPY src ./src
COPY public ./public
RUN bun run build

# ── runtime: Caddy serving static files, automatic HTTPS ────────────────
FROM caddy:2-alpine AS runtime

ENV SITE_ADDRESS=:80

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

RUN caddy validate --config /etc/caddy/Caddyfile

EXPOSE 80 443 443/udp

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD nc -z 127.0.0.1 80 || exit 1
