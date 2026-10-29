import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://bellish.co.il',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: false,
  devToolbar: { enabled: false },
  // Addresses Google still knows from earlier versions of the site (Search Console, 29.10.2026).
  // GitHub Pages can't send 301s, so Astro writes a page that redirects instantly (meta refresh + canonical).
  // Removed content with no equivalent (/notes, /note/*) is left to 404 on purpose.
  redirects: {
    '/project/': '/projects/', // generic project URL, was a duplicate of B House
    '/about/': '/studio/',
    '/work/': '/projects/',
    '/projects/kkg-warehouse/': '/projects/',
    '/projects/av-house/': '/projects/',
  },
});
