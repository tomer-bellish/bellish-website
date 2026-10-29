// Checks the built site (dist/) before it goes live. Usage: npm run build && npm run check
// The deploy workflow runs it on every push to main and publishes nothing if any check fails.
//   1. Links: every internal href/src/srcset/url() points to a file in dist/.
//   2. SEO: title, description, canonical and og tags on every indexable page; JSON-LD parses;
//      sitemap.xml lists exactly the indexable pages; redirect pages are noindex.
//   3. Accessibility: axe-core reports no violations, at desktop and mobile widths.
//   4. Consent: nothing third-party loads before "Accept" (except the accessibility toolbar),
//      Google Analytics loads after it, and nothing loads after "Decline".
// Uses Playwright's Chromium when installed (CI), otherwise the local Chrome or Edge.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const SITE = 'https://bellish.co.il';
const OG_IMAGE = `${SITE}/assets/og-logo.png`;
const PORT = Number(process.env.CHECK_PORT || 8091);
const LOCAL = `http://localhost:${PORT}`;
// Third parties allowed before consent: the accessibility toolbar, which keeps display preferences in
// local storage (listed in the cookie policy). Anything else before "Accept" fails the check.
const PRE_CONSENT_HOSTS = ['widget.tabnav.com', 'tabnav.com'];
const GOOGLE = /(^|\.)(google|googletagmanager|google-analytics|gstatic|doubleclick|googleapis)\.com$/;
const VIEWPORTS = { desktop: { width: 1280, height: 800 }, mobile: { width: 375, height: 812 } };

const failures = [];
const fail = (section, msg) => failures.push(`[${section}] ${msg}`);

const decode = (s) => s.replace(/&(#x?[0-9a-f]+|amp|quot|apos|lt|gt);/gi, (m, e) => {
  const named = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' }[e.toLowerCase()];
  if (named) return named;
  return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
});
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)].map((m) => [m[1].toLowerCase(), decode(m[2])]));
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((m) => attrs(m[0]));
const meta = (html, key, value) => tags(html, 'meta').filter((a) => a[key] === value);

// ---- Collect pages -------------------------------------------------------------------------------
const pages = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, e.name);
    if (e.isDirectory()) walk(file);
    else if (e.name.endsWith('.html')) {
      const rel = relative(DIST, file).split(sep).join('/');
      const path = '/' + rel.replace(/(^|\/)index\.html$/, '$1');
      const html = readFileSync(file, 'utf8');
      const refresh = meta(html, 'http-equiv', 'refresh')[0];
      const noindex = meta(html, 'name', 'robots').some((a) => /noindex/i.test(a.content || ''));
      pages.push({ path, html, redirect: refresh?.content, noindex });
    }
  }
})(DIST);
const indexable = pages.filter((p) => !p.redirect && !p.noindex);
const browsable = pages.filter((p) => !p.redirect); // indexable pages + 404

// ---- 1. Links ------------------------------------------------------------------------------------
const exists = (path) => {
  path = decodeURI(path.split('#')[0].split('?')[0]);
  const file = join(DIST, path);
  return existsSync(file) && (statSync(file).isFile() || existsSync(join(file, 'index.html')));
};
const internal = (url) => {
  if (url.startsWith(SITE + '/') || url === SITE) return url.slice(SITE.length) || '/';
  return url.startsWith('/') && !url.startsWith('//') ? url : null;
};
let refs = 0;
const checkRef = (from, url) => {
  const path = internal(decode(url.trim()));
  if (path === null) return;
  refs++;
  if (!exists(path)) fail('links', `${from} → ${url} (missing)`);
};
for (const p of pages) {
  for (const m of p.html.matchAll(/\s(?:href|src)="([^"]*)"/g)) checkRef(p.path, m[1]);
  for (const m of p.html.matchAll(/srcset="([^"]*)"/g)) for (const s of m[1].split(',')) checkRef(p.path, s.trim().split(/\s+/)[0]);
  for (const m of p.html.matchAll(/url\((?:&quot;|['"])?([^)'"&]+)/g)) checkRef(p.path, m[1]);
  if (p.redirect) checkRef(p.path, p.redirect.replace(/^\s*\d+\s*;\s*url=/i, ''));
}
checkRef('og:image', OG_IMAGE);
for (const css of readdirSync(join(DIST, '_astro')).filter((f) => f.endsWith('.css')))
  for (const m of readFileSync(join(DIST, '_astro', css), 'utf8').matchAll(/url\(['"]?([^)'"]+)/g)) checkRef(css, m[1]);

// ---- 2. SEO --------------------------------------------------------------------------------------
const seen = { title: new Map(), description: new Map() };
for (const p of indexable) {
  const where = p.path;
  const canonical = SITE + p.path;
  if (!/<html[^>]*\slang="en"/.test(p.html)) fail('seo', `${where}: <html lang="en"> missing`);

  const titles = [...p.html.matchAll(/<title>([^<]*)<\/title>/g)].map((m) => decode(m[1]).trim());
  if (titles.length !== 1 || !titles[0]) fail('seo', `${where}: needs exactly one non-empty <title> (found ${titles.length})`);

  const descs = meta(p.html, 'name', 'description').map((a) => (a.content || '').trim());
  if (descs.length !== 1) fail('seo', `${where}: needs exactly one meta description (found ${descs.length})`);
  else if (descs[0].length < 50 || descs[0].length > 170) fail('seo', `${where}: description is ${descs[0].length} characters (keep it 50–170)`);

  for (const [kind, value] of [['title', titles[0]], ['description', descs[0]]]) {
    if (!value) continue;
    if (seen[kind].has(value)) fail('seo', `${where}: same ${kind} as ${seen[kind].get(value)}`);
    else seen[kind].set(value, where);
  }

  const canon = tags(p.html, 'link').filter((a) => a.rel === 'canonical');
  if (canon.length !== 1 || canon[0].href !== canonical) fail('seo', `${where}: canonical should be ${canonical} (found ${canon.map((a) => a.href).join(', ') || 'none'})`);

  const og = (prop) => meta(p.html, 'property', prop)[0]?.content;
  if (!og('og:title')) fail('seo', `${where}: og:title missing`);
  if (og('og:description') !== descs[0]) fail('seo', `${where}: og:description should match the meta description`);
  if (og('og:url') !== canonical) fail('seo', `${where}: og:url should be ${canonical}`);
  if (og('og:image') !== OG_IMAGE) fail('seo', `${where}: og:image should stay ${OG_IMAGE} (found ${og('og:image') || 'none'})`);

  for (const m of p.html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]);
      for (const block of Array.isArray(data) ? data : [data])
        if (!String(block['@context'] || '').includes('schema.org') || !(block['@type'] || block['@graph'])) fail('seo', `${where}: JSON-LD block without @context/@type`);
    } catch (e) {
      fail('seo', `${where}: JSON-LD does not parse (${e.message})`);
    }
  }
}
for (const p of pages.filter((p) => p.redirect)) {
  if (!p.noindex) fail('seo', `${p.path}: redirect page must be noindex`);
  if (!tags(p.html, 'link').some((a) => a.rel === 'canonical')) fail('seo', `${p.path}: redirect page needs a canonical`);
}
if (!pages.find((p) => p.path === '/404.html')?.noindex) fail('seo', '/404.html must be noindex');

const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const m of sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g))
  if (!/^\d{4}-\d{2}-\d{2}$/.test(m[1]) || isNaN(Date.parse(m[1]))) fail('sitemap', `bad lastmod ${m[1]}`);
for (const loc of locs)
  if (!indexable.some((p) => SITE + p.path === loc)) fail('sitemap', `${loc} is not an indexable page (missing, redirect or noindex)`);
for (const p of indexable) if (!locs.includes(SITE + p.path)) fail('sitemap', `${p.path} is missing from sitemap.xml`);
const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) fail('sitemap', 'robots.txt does not point to the sitemap');
if (/^Disallow:\s*\/\s*$/m.test(robots)) fail('sitemap', 'robots.txt blocks the whole site');
if (readFileSync(join(DIST, 'CNAME'), 'utf8').trim() !== 'bellish.co.il') fail('sitemap', 'CNAME must be bellish.co.il');

console.log(`Static: ${pages.length} HTML files (${indexable.length} indexable), ${refs} internal links, ${locs.length} sitemap URLs.`);

// ---- 3 + 4. Browser checks -----------------------------------------------------------------------
const server = spawn(process.execPath, [join(ROOT, 'tools', 'serve.mjs'), String(PORT), 'dist'], { stdio: ['ignore', 'pipe', 'inherit'] });
await new Promise((resolve, reject) => {
  server.stdout.on('data', (d) => d.toString().includes('localhost') && resolve());
  server.on('exit', (code) => reject(new Error(`preview server exited (${code})`)));
});

async function launch() {
  for (const channel of [undefined, 'chrome', 'msedge']) {
    try {
      const b = await chromium.launch({ channel });
      console.log(`Using ${channel || 'Playwright Chromium'} ${b.version()}`);
      return b;
    } catch (e) { if (channel === 'msedge') throw e; }
  }
}
const browser = await launch();
const axeSource = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');

// A fresh visitor: no stored consent. Records every third-party request; only the accessibility
// toolbar is let through, everything else (Google included) is blocked so CI never sends GA hits.
async function visit(viewport) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
  const thirdParty = [];
  await context.route('**/*', (route) => {
    const host = new URL(route.request().url()).hostname;
    if (host === 'localhost') return route.continue();
    thirdParty.push(host);
    return PRE_CONSENT_HOSTS.includes(host) ? route.continue() : route.abort();
  });
  const page = await context.newPage();
  const settle = () => page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  return { context, page, thirdParty, settle };
}

let axeRuns = 0;
try {
  for (const [name, viewport] of Object.entries(VIEWPORTS)) {
    for (const p of browsable) {
      const { context, page, thirdParty, settle } = await visit(viewport);
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(LOCAL + p.path, { waitUntil: 'load' });
      await settle();
      for (const e of errors) fail('scripts', `${p.path} (${name}): ${e}`);
      const early = [...new Set(thirdParty.filter((h) => !PRE_CONSENT_HOSTS.includes(h)))];
      if (early.length) fail('consent', `${p.path} (${name}): loads ${early.join(', ')} before consent`);

      await page.addScriptTag({ content: axeSource });
      const violations = await page.evaluate(async () =>
        (await window.axe.run(document, { resultTypes: ['violations'] })).violations.map((v) => ({
          id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 3).map((n) => n.target.join(' ')),
        })));
      axeRuns++;
      for (const v of violations) fail('a11y', `${p.path} (${name}): ${v.id} [${v.impact}] ${v.help} — ${v.nodes.join(' | ')}`);
      await context.close();
    }
  }

  // Consent flow on the home page: Accept loads GA; Decline loads nothing, also on the next page.
  {
    const { context, page, thirdParty, settle } = await visit(VIEWPORTS.desktop);
    await page.goto(LOCAL + '/', { waitUntil: 'load' });
    await page.getByRole('button', { name: 'Accept', exact: true }).click();
    await settle();
    if (!thirdParty.includes('www.googletagmanager.com')) fail('consent', 'Google Analytics did not load after "Accept"');
    await context.close();
  }
  {
    const { context, page, thirdParty, settle } = await visit(VIEWPORTS.desktop);
    await page.goto(LOCAL + '/', { waitUntil: 'load' });
    await page.getByRole('button', { name: 'Decline', exact: true }).click();
    await page.goto(LOCAL + '/projects/', { waitUntil: 'load' });
    await settle();
    const loaded = [...new Set(thirdParty.filter((h) => GOOGLE.test(h)))];
    if (loaded.length) fail('consent', `after "Decline": loads ${loaded.join(', ')}`);
    if (await page.locator('[aria-labelledby="consent-title"]').count()) fail('consent', 'the banner shows again after "Decline"');
    await context.close();
  }
} finally {
  await browser.close();
  server.kill();
}

console.log(`Browser: ${browsable.length} pages × ${Object.keys(VIEWPORTS).length} widths (${axeRuns} axe runs), consent flow.`);
if (failures.length) {
  console.error(`\n✗ ${failures.length} problem(s):`);
  for (const f of failures) console.error('  ' + f);
  process.exit(1);
}
console.log('✓ All checks passed.');
