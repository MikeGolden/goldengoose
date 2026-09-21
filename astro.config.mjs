import { defineConfig } from 'astro/config';

// SITE_URL / BASE_PATH are set by the Pages workflow. Unset (local, Docker,
// a domain of your own) the site builds at the root of `site`.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://example.com',
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'ignore',
});
