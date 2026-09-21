/**
 * Zero-dependency static server for dist/ — used by the Playwright webServer
 * and by `npm run serve:dist`. Mirrors the production Caddy rules that matter
 * to the tests: 404.html served with a 404 status, immutable asset caching.
 *
 * Astro's own `preview` daemonises, which Playwright reads as a crashed
 * webServer, so tests run against this instead.
 */
import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, extname, normalize } from 'node:path';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const port = Number(process.env.PORT ?? 4321);
const host = process.env.HOST ?? '127.0.0.1';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

function resolveFile(pathname) {
  const clean = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const candidates = clean.endsWith('/')
    ? [join(clean, 'index.html')]
    : [clean, `${clean}.html`, join(clean, 'index.html')];

  for (const candidate of candidates) {
    const file = join(root, candidate);
    if (!file.startsWith(root)) continue;
    try {
      if (statSync(file).isFile()) return file;
    } catch {
      /* next candidate */
    }
  }
  return null;
}

createServer((req, res) => {
  const { pathname } = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

  const send = (file, status) => {
    res.writeHead(status, {
      'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream',
      'Cache-Control': pathname.startsWith('/_astro/')
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=0, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
    });
    createReadStream(file).pipe(res);
  };

  const file = resolveFile(pathname);
  if (file) return send(file, 200);

  const notFound = join(root, '404.html');
  try {
    statSync(notFound);
    return send(notFound, 404);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found\n');
  }
}).listen(port, host, () => {
  console.log(`serving dist/ on http://${host}:${port}`);
});
