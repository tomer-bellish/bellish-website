import { existsSync } from 'node:fs';
import { join } from 'node:path';

// Resolved from the project root: import.meta.url points into the build output during `astro build`.
const ASSETS = join(process.cwd(), 'public', 'assets');

/** "x-800.webp 800w, x.webp 1600w" when the 800px variant exists (missing variants used to 404 on 1x screens). */
export function srcset(name: string): string | undefined {
  const small = name.replace(/\.webp$/, '-800.webp');
  return name.endsWith('.webp') && existsSync(join(ASSETS, small)) ? `/assets/${small} 800w, /assets/${name} 1600w` : undefined;
}
