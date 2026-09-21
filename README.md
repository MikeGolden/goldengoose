# goldengoose

Personal landing page — Astro, static output, dark theme, no runtime JS beyond a 4-line scroll listener.

## Run

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run preview
```

## Editing

All content lives in **`src/data/site.ts`** — name, bio, stack, projects, links, nav.
Components read from it; nothing is hardcoded in markup.

Anything in CAPS in that file is a placeholder. Before deploying, replace:

- `YOUR-HANDLE` in the GitHub / LinkedIn / Telegram URLs
- `PROJECT ONE/TWO/THREE` + their descriptions, years and links
- `LANGUAGE 1`, `FRAMEWORK 1`, `DATABASE 3`, `CLOUD PROVIDER` in `stack`
- `site.url` here **and** `site` in `astro.config.mjs` (same domain)
- `site.name` — add your surname

## Assets

| Path | What |
|---|---|
| `public/img/avatar.svg` | placeholder — swap for a square photo (`avatar.jpg`, then update `site.avatar`) |
| `public/img/project-N.svg` | placeholder thumbs — swap for real 16:10 screenshots |
| `public/cv.pdf` | not there yet — drop your CV here, the hero button already points at it |
| `public/favicon.svg` | gold `M` monogram |

## Design tokens

`src/styles/global.css`, top of file. One accent (`--accent: #e3b55c`), one background ramp,
one mono face for labels. Changing the accent recolors the whole page.

## Tests

Playwright, three projects: `data` (no browser), `chromium`, `mobile` (Pixel 5). 73 tests.

```bash
npx playwright install chromium   # once
npm test                          # builds, serves dist/, runs everything
npm run test:ui                   # watch mode
npm run test:report               # last HTML report
```

| File | Covers |
|---|---|
| `tests/unit/site-data.spec.ts` | `site.ts` integrity — required fields, valid hrefs, referenced images exist on disk, unique nav anchors |
| `tests/e2e/home.spec.ts` | every field in `site.ts` renders; CTA targets; thumbnails actually load; `rel="noopener noreferrer"` on external links; no console errors or 4xx; 404 route |
| `tests/e2e/nav.spec.ts` | nav entries, anchor jumps land in viewport, sticky-header border on scroll |
| `tests/e2e/a11y.spec.ts` | axe WCAG 2.1 A/AA, single h1, heading order, alt text + explicit dimensions, focus ring, palette contrast |
| `tests/e2e/seo.spec.ts` | title, description, canonical, OG tags, Person JSON-LD parses |
| `tests/e2e/responsive.spec.ts` | no horizontal overflow at 360/768/1280/1920, nav breakpoint, card reflow, 40px tap targets |

Tests read `src/data/site.ts` directly, so when you replace the placeholder content the
assertions follow it — no fixture to update.

`BASE_URL=https://your-domain npm test` runs the same suite against a deployed site instead
of a local build.

## Docker

Three compose files, one Dockerfile per role.

```bash
npm run docker:dev    # dev server + hot reload → http://localhost:4321
npm run test:docker   # prod image + Playwright container, exits with the test status
npm run prod:up       # production, detached
npm run prod:logs
npm run prod:down
```

**Production** (`Dockerfile` → `docker-compose.prod.yml`): Node builds the site, then the
output is copied into `caddy:2-alpine`. The final image carries no Node, no `node_modules`,
no source — just Caddy and `dist/`.

```bash
cp .env.example .env     # DOMAIN + ACME_EMAIL
npm run prod:up
```

Caddy handles TLS itself: it requests a Let's Encrypt certificate for `DOMAIN` on first
boot, redirects HTTP→HTTPS, serves HTTP/2 and HTTP/3, and renews automatically. Requirements:
`DOMAIN`'s A/AAAA record points at the host, and ports 80 + 443 are open. Certificates live in
the `caddy_data` volume — keep it, or you re-issue on every deploy and hit rate limits.

`SITE_ADDRESS=":80"` instead of a domain turns TLS off, for running behind an existing proxy
or in CI.

Also in `Caddyfile`: HSTS, CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`,
`Permissions-Policy`, zstd/gzip, immutable caching for `/_astro/*`, revalidate for HTML, and
`404.html` served with a real 404 status.

## Deploy

Static output, so any host works:

- **GitHub Pages** — push, then Settings → Pages → build from GitHub Actions (Astro's `withastro/action`)
- **Netlify / Vercel / Cloudflare Pages** — connect the repo, build `npm run build`, publish `dist`
