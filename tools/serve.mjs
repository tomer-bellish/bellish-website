// Local preview server for the built site (dist/) — zero dependencies.
// Mimics GitHub Pages: directory index.html, trailing-slash redirects, custom 404.
// Usage: npm run build && node tools/serve.mjs [port] [folder=dist]
import { createServer } from 'node:http';
import { stat, readFile } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL(`../${process.argv[3] || 'dist'}/`, import.meta.url));
const PORT = Number(process.argv[2] || process.env.PORT || 8081);

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
  const path = normalize(join(ROOT, decodeURIComponent(url.pathname)));
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
