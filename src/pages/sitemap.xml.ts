import { projects } from '../data/projects';
import { SITE } from '../data/site';

// [path, lastmod, priority]. Bump a page's date when its content changes in substance.
const PAGES: [string, string, string][] = [
  ['/', '2026-07-08', '1.0'],
  ['/projects/', '2026-08-03', '0.9'],
  ...projects.map((p): [string, string, string] => [`/project/${p.slug}/`, p.updated, '0.8']),
  ['/studio/', '2026-07-08', '0.6'],
  ['/career/', '2026-07-08', '0.5'],
  ['/contact/', '2026-07-08', '0.6'],
  ['/cookie-policy/', '2026-10-30', '0.3'],
  ['/accessibility/', '2026-07-08', '0.3'],
];

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(([path, lastmod, priority]) => `  <url><loc>${SITE}${path}</loc><lastmod>${lastmod}</lastmod><priority>${priority}</priority></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
