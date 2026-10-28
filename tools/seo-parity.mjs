// Compare the SEO head of the old bundled pages (docs/) with the Astro build (dist/).
// Usage: npm run build && node tools/seo-parity.mjs [path ...]   (default: every page in docs/)
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

function seo(file) {
  // Only the outer <head>: the bundle's template string lives in <body> and is not what crawlers see first.
  const head = readFileSync(file, 'utf8').split('</head>')[0];
  const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
  const out = { title: head.match(/<title>([^<]*)<\/title>/)?.[1] };
  for (const m of head.matchAll(/<meta\b[^>]*>/g)) {
    const k = attr(m[0], 'name') ?? attr(m[0], 'property');
    if (k && k !== 'viewport' && k !== 'theme-color') out[k] = attr(m[0], 'content');
  }
  for (const m of head.matchAll(/<link\b[^>]*>/g)) {
    const rel = attr(m[0], 'rel');
    if (rel === 'canonical') out.canonical = attr(m[0], 'href');
    if (rel === 'preload' && attr(m[0], 'as') === 'image') out['preload image'] = attr(m[0], 'href');
  }
  const ld = [...head.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  for (const block of ld) out['ld:' + block['@type']] = JSON.stringify(block);
  return out;
}

function pages(dir, base = '') {
  const found = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) found.push(...pages(join(dir, e.name), `${base}/${e.name}`));
    else if (e.name === 'index.html') found.push(base + '/');
  }
  return found;
}

const decode = (s) => s?.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const paths = process.argv.slice(2).length ? process.argv.slice(2) : pages(join(ROOT, 'docs'));
let failed = 0;
for (const p of paths) {
  const oldFile = join(ROOT, 'docs', p, 'index.html');
  const newFile = join(ROOT, 'dist', p, 'index.html');
  if (!existsSync(newFile)) { console.log(`MISSING  ${p}`); failed++; continue; }
  const a = seo(oldFile), b = seo(newFile);
  const diffs = [...new Set([...Object.keys(a), ...Object.keys(b)])]
    .filter((k) => decode(a[k]) !== decode(b[k]))
    .map((k) => `    ${k}\n      old: ${a[k] ?? '(none)'}\n      new: ${b[k] ?? '(none)'}`);
  if (diffs.length) { failed++; console.log(`DIFF     ${p}\n${diffs.join('\n')}`); }
  else console.log(`ok       ${p}`);
}
process.exit(failed ? 1 : 0);
