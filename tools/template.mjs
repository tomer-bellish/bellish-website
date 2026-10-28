// Read and write the page template inside a Claude Design bundle (docs/**/index.html).
// The template is a JSON string in <script type="__bundler/template">, with every '<' written as <.
// writeTemplate() refuses to save unless the original encoding round-trips byte for byte.
//
// CLI:
//   node tools/template.mjs check            verify every page round-trips unchanged
//   node tools/template.mjs extract <page>   print the decoded template
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const DOCS = fileURLToPath(new URL('../docs/', import.meta.url));
const RE = /(<script type="__bundler\/template">\s*)([\s\S]*?)(\s*<\/script>)/;

export function encode(template) {
  return JSON.stringify(template).replace(/</g, '\\u003C');
}

export function readTemplate(file) {
  const html = readFileSync(file, 'utf8');
  const m = html.match(RE);
  if (!m) return null;
  const template = JSON.parse(m[2]);
  if (encode(template) !== m[2]) throw new Error(`${file}: template does not round-trip; refusing to edit`);
  return template;
}

export function writeTemplate(file, template) {
  const html = readFileSync(file, 'utf8');
  if (!RE.test(html)) throw new Error(`${file}: no template`);
  const out = html.replace(RE, (_, open, _old, close) => open + encode(template) + close);
  writeFileSync(file, out);
}

export function bundlePages(dir = DOCS) {
  const pages = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) pages.push(...bundlePages(p));
    else if (e.name === 'index.html' && RE.test(readFileSync(p, 'utf8'))) pages.push(p);
  }
  return pages;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [cmd, arg] = process.argv.slice(2);
  if (cmd === 'check') {
    let bad = 0;
    for (const p of bundlePages()) {
      try { readTemplate(p); console.log('ok  ', p); } catch (e) { bad++; console.log('FAIL', e.message); }
    }
    process.exit(bad ? 1 : 0);
  } else if (cmd === 'extract' && arg) {
    process.stdout.write(readTemplate(arg) ?? '');
  } else {
    console.log('usage: node tools/template.mjs check | extract <page>');
    process.exit(2);
  }
}
