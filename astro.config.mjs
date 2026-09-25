import { defineConfig, fontProviders } from 'astro/config';

// SITE_URL / BASE_PATH are set by the Pages workflow. Unset (local, Docker,
// a domain of your own) the site builds at the root of `site`.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://example.com',
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'ignore',
  // lightningcss (Vite's default) folds animation-timeline into the `animation`
  // shorthand, which browsers reject — every scroll-driven animation vanishes
  vite: { build: { cssMinify: 'esbuild' } },
  // downloaded at build time and self-hosted, so the page makes no third-party requests
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Schibsted Grotesk',
      cssVariable: '--font-sans',
      weights: ['400 900'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Instrument Serif',
      cssVariable: '--font-serif',
      weights: [400],
      styles: ['italic'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Georgia', 'serif'],
    },
  ],
});
