/**
 * Prefix a root-relative path with Astro's base.
 *
 * Locally and on a domain of its own BASE_URL is "/", so paths pass through
 * unchanged. On a GitHub project page it is "/<repo>/", and every asset and
 * internal link has to carry it or the page 404s.
 */
export function withBase(path: string): string {
  if (!path.startsWith('/')) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}
