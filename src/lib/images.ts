import { existsSync, openSync, readSync, closeSync } from 'node:fs';
import { join } from 'node:path';

// Resolved from the project root: import.meta.url points into the build output during `astro build`.
const ASSETS = join(process.cwd(), 'public', 'assets');

/** Responsive sizes written by tools/images.mjs (`npm run images`), each only when the original is wider. */
const WIDTHS = [800, 1200, 1920, 2880];

/** Pixel width of a WebP file, read from its header (VP8, VP8L or VP8X). */
function webpWidth(file: string): number {
  const b = Buffer.alloc(30);
  const fd = openSync(file, 'r');
  try { readSync(fd, b, 0, 30, 0); } finally { closeSync(fd); }
  const chunk = b.toString('latin1', 12, 16);
  if (chunk === 'VP8X') return 1 + b.readUIntLE(24, 3);
  if (chunk === 'VP8L') return 1 + (((b[22] & 0x3f) << 8) | b[21]);
  return b.readUInt16LE(26) & 0x3fff; // 'VP8 '
}

/** "x-800.webp 800w, x-1200.webp 1200w, …, x.webp <width>w" for the sizes that exist; undefined when there are none. */
export function srcset(name: string): string | undefined {
  if (!name.endsWith('.webp')) return undefined;
  const base = name.slice(0, -'.webp'.length);
  const sizes = WIDTHS.filter((w) => existsSync(join(ASSETS, `${base}-${w}.webp`))).map((w) => `/assets/${base}-${w}.webp ${w}w`);
  return sizes.length ? [...sizes, `/assets/${name} ${webpWidth(join(ASSETS, name))}w`].join(', ') : undefined;
}
