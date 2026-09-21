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

## Deploy

Static output, so any host works:

- **GitHub Pages** — push, then Settings → Pages → build from GitHub Actions (Astro's `withastro/action`)
- **Netlify / Vercel / Cloudflare Pages** — connect the repo, build `npm run build`, publish `dist`
