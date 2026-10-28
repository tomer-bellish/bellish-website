import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://bellish.co.il',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: false,
  devToolbar: { enabled: false },
});
