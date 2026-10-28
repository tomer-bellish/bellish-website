// Local preview server for docs/ — zero dependencies.
// Mimics GitHub Pages: directory index.html, trailing-slash redirects, custom 404.
// Usage: node tools/serve.mjs [port]
import { createServer } from 'node:http';
import { stat, readFile } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../docs/', import.meta.url));
const PORT = Number(process.argv[2] || process.env.PORT || 8080);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

// The pages load https://bellish.co.il/assets/preview-nav.js, which on any host other than
// bellish.co.il rewrites link clicks to Claude Design files (Home.dc.html, Project.dc.html?p=slug).
// Send those back to the real routes so navigation works locally.
const DC_ROUTES = {
  'Home': '/', 'Projects': '/projects/', 'Studio': '/studio/', 'Career': '/career/',
  'Contact': '/contact/', 'CookiePolicy': '/cookie-policy/', 'Accessibility': '/accessibility/',
};
function dcRedirect(url) {
  const m = url.pathname.match(/\/(\w+)\.dc\.html$/);
  if (!m) return null;
  if (m[1] === 'Project') {
    const slug = url.searchParams.get('p');
    return slug ? `/project/${slug}/` : '/project/';
  }
  return DC_ROUTES[m[1]] ?? null;
}

async function send(res, file, status = 200) {
  const body = await readFile(file);
  res.writeHead(status, {
    'Content-Type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const redirect = dcRedirect(url);
  if (redirect) {
    res.writeHead(302, { Location: redirect + url.hash });
    return res.end();
  }

  // Project pages use relative 'assets/x.webp' and only prefix '/' when the host is bellish.co.il,
  // so locally /project/<slug>/assets/x.webp must resolve to /assets/x.webp.
  const pathname = url.pathname.replace(/^\/.+?\/(assets\/[^/]+)$/, '/$1');
  const path = normalize(join(ROOT, decodeURIComponent(pathname)));
  if (!path.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end();
  }

  try {
    const info = await stat(path);
    if (info.isDirectory()) {
      if (!url.pathname.endsWith('/')) {
        res.writeHead(301, { Location: url.pathname + '/' + url.search });
        return res.end();
      }
      return await send(res, join(path, 'index.html'));
    }
    return await send(res, path);
  } catch {
    return send(res, join(ROOT, '404.html'), 404);
  }
}).listen(PORT, () => {
  console.log(`Bellish site preview: http://localhost:${PORT}/`);
});
