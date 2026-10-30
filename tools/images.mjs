// Responsive sizes for the project images: writes <name>-800/-1200/-1920/-2880.webp next to every image that
// src/data/projects.ts uses, each only when the original is wider, as WebP quality 92 with the original's colour
// profile. Tested in PLAN.md 4.5: no visible difference at display size. Existing files are left alone, and a
// size that would not be clearly lighter than the original (over 80% of its bytes) is skipped — it would save nothing.
// The originals stay as they are (the gallery and 4K screens use them); src/lib/images.ts adds whatever exists to srcset.
// Usage: npm run images   (after adding a project's images to public/assets/)
import { readFileSync, existsSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const ASSETS = ROOT + 'public/assets/';
export const WIDTHS = [800, 1200, 1920, 2880];

const names = [...new Set([...readFileSync(ROOT + 'src/data/projects.ts', 'utf8').matchAll(/"([\w-]+\.webp)"/g)].map((m) => m[1]))];
let made = 0, bytes = 0, skipped = 0;
for (const name of names) {
  const file = ASSETS + name;
  if (!existsSync(file)) { console.warn(`missing: ${name}`); continue; }
  const { width } = await sharp(file).metadata();
  const size = statSync(file).size;
  for (const w of WIDTHS) {
    const out = ASSETS + name.replace(/\.webp$/, `-${w}.webp`);
    if (w >= width || existsSync(out)) continue;
    const buf = await sharp(file).resize(w).keepIccProfile().webp({ quality: 92, effort: 6 }).toBuffer();
    if (buf.length > size * 0.8) { skipped++; continue; }
    writeFileSync(out, buf);
    made++; bytes += buf.length;
    console.log(`${name} → ${w}px (${Math.round(buf.length / 1024)} KB)`);
  }
}
console.log(`${names.length} images checked, ${made} sizes written (${(bytes / 1048576).toFixed(1)} MB), ${skipped} skipped as no lighter.`);
