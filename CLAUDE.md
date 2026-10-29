# Bellish Architects website (bellish.co.il)

Portfolio site for בליש אדריכלים. The site itself is English-only; the owner talks to Claude in Hebrew.
Full handoff notes (must-keep features, business data, new-project checklist): [README.md](README.md).
Work plan and open decisions: [PLAN.md](PLAN.md).

## Layout
This folder is the clone of `github.com/tomer-bellish/bellish-website` (branch `main`).
- `docs/` — the published site. Static files, no build step. GitHub Pages serves only this folder.
- `design-source/` — original Claude Design files (`*.dc.html` + `support.js` runtime). Reference only.
- `tools/serve.mjs` — local preview server (no dependencies): `node tools/serve.mjs` → http://localhost:8080/
- `tools/template.mjs` — safe read/write of the bundled page templates (see below).
- Local-only branch `handoff` — the original Claude Design handoff snapshot (its `site/` lacks `CNAME` and the
  `/projects/<slug>/` redirect pages; never deploy from it).

## Astro rebuild (branch `astro`, phase 3 of PLAN.md — not live yet)
- `src/` (layouts, components, pages, data) + `public/` (assets, fonts, CNAME, robots, `/projects/<slug>/` redirects).
  `docs/` stays on this branch as the reference until cutover; `npm run build` → `dist/`.
- Preview: launch config `astro` (`npx astro dev --port 4321`) next to `site` (old pages on 8080).
- `node tools/seo-parity.mjs [path…]` after `npm run build`: diffs title/meta/canonical/og/JSON-LD of docs/ vs dist/.
  In Git Bash pass paths with `MSYS_NO_PATHCONV=1`.
- Visual parity is checked element-by-element (position, size, font, color) old vs new at 1280px and 375px.
- Consent (new site): `public/assets/cookie-consent.js` is the only place that loads Google — GTM, GA4 and
  Preferred Sources are injected in its `loadTags()` after "Accept". Never add a third-party script to `Base.astro`
  directly; add it there and list it in the cookie policy. Compliance status and owner to-dos: [COMPLIANCE.md](COMPLIANCE.md).
- Text colours must keep ≥ 4.5:1 (secondary grey on paper is `#71706B`, not the design's `#7B7A74`); axe-core
  (`https://cdn.jsdelivr.net/npm/axe-core@4.14.0/axe.min.js`) should report 0 violations on every page.

## How the pages are built (read before editing any `docs/**/index.html`)
Each page is a Claude Design bundle:
- `<main id="__static_seo">` — plain-HTML fallback for crawlers / no-JS.
- `<script type="__bundler/manifest">` — base64 assets (incl. the ~160 KB design runtime) keyed by UUID.
- `<script type="__bundler/template">` — the real page as one JSON-encoded string, unpacked at runtime.
Editing the template: parse the JSON string, edit, re-encode with `<` written as `\u003C`. A raw `</script>`
inside the string breaks the page. Never hand-edit the escaped string with find/replace — use `tools/template.mjs`
(`readTemplate` / `writeTemplate`; refuses pages that don't round-trip). `node tools/template.mjs check` after any edit.
Project data (titles, text, galleries) is duplicated in every `docs/project/*/index.html` — change all 12 together.

The rendered pages load images and scripts from `https://bellish.co.il/assets/...` (absolute URLs),
so the local preview shows the **live** assets — a new image only appears after it is deployed.
`assets/preview-nav.js` rewrites link clicks to `*.dc.html` on non-production hosts; `serve.mjs` redirects those
back to the real routes.

## Deploy
Hosted on **GitHub Pages**, source `main` → `/docs`, custom domain via `docs/CNAME`. Every push to `main` goes live.
Owner pushes with GitHub Desktop. Anything outside `docs/` is never published.
GitHub handles HTTPS/www redirects and serves `404.html`; custom HTTP headers are not possible (no `.htaccess`).
Owner chose Claude to push from here; still confirm with the owner before each push, since every push goes live.
Keep every URL, meta tag, JSON-LD block and asset path identical — SEO depends on them.
When adding/removing pages, update `docs/sitemap.xml` (one `<url>` per page, no duplicates).
