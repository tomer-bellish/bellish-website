# Bellish Architects website (bellish.co.il)

Portfolio site for בליש אדריכלים. The site itself is English-only; the owner talks to Claude in Hebrew.
Handoff notes (must-keep features, business data, new-project checklist): [README.md](README.md).
Work plan: [PLAN.md](PLAN.md). Accessibility / cookie compliance status and owner to-dos: [COMPLIANCE.md](COMPLIANCE.md).

## Layout — Astro site on `main` (live since 29.10.2026)
This folder is the clone of `github.com/tomer-bellish/bellish-website`.
- `src/layouts/Base.astro` — `<head>` (SEO tags, JSON-LD, consent script), skip link, menu + scroll-reveal scripts.
- `src/components/` — Header, Footer, ProjectBody (project page), FormScript (Formspree forms).
- `src/data/projects.ts` — every project, in site order. Project pages, the grid, ItemList, breadcrumbs, next-project
  links and the sitemap all derive from it. `team.ts` — Studio team. `site.ts` — Organization JSON-LD.
- `src/lib/images.ts` — srcset helper (adds the `-800.webp` variant only if the file exists).
- `public/` — assets (images, scripts), fonts, CNAME, robots.txt, 404.html, legacy `/projects/<slug>/` redirect pages.
- `npm run build` → `dist/`. Preview configs: `astro` (dev server, 4321), `dist` (built site, 8081), `site` (old docs/, 8080).
- `docs/` — the old Claude Design bundles, kept **only as a rollback target** until the cleanup step in PLAN.md 3.9.
  Don't edit it. `design-source/`, `tools/template.mjs`, `tools/seo-parity.mjs` belong to that legacy and go with it.
- Local-only branches: `astro` (where the rebuild was done), `handoff`, `backup/site-2026-07-04`.

## Changing content
- New project: entry in `src/data/projects.ts` (first image = hero, `updated` = today) + WebP images in
  `public/assets/`, ideally with an 800px `-800.webp` variant for each. Nothing else to edit.
- Team: `src/data/team.ts`. Contact details: `src/data/site.ts` (JSON-LD), the contact page and the footer.

## Rules
- Consent: `public/assets/cookie-consent.js` is the only place that loads Google — GA4 and Preferred Sources are
  injected in its `loadTags()` after "Accept". GTM was removed (its container GTM-T3H6PWPH was empty). Never add a
  third-party script to `Base.astro` directly; add it there and list it in the cookie policy.
- Text colours must keep ≥ 4.5:1 (secondary grey on paper is `#71706B`, not the design's `#7B7A74`); UI borders ≥ 3:1.
  axe-core (`https://cdn.jsdelivr.net/npm/axe-core@4.14.0/axe.min.js`) should report 0 violations on every page.
- Keep every URL, meta tag, JSON-LD block and asset path stable — SEO depends on them.
- The owner sometimes runs several Claude sessions on this folder at once. Before committing, check `git status` /
  `git diff` for changes you did not make and commit only your own (stage partial files from a HEAD-based copy).

## Deploy
GitHub Pages with Source = **GitHub Actions**: `.github/workflows/deploy.yml` builds and publishes on every push to
`main` (about 1–2 minutes). The owner chose Claude to push from here; still confirm before each push — it goes live.
GitHub handles HTTPS and the www redirect; custom HTTP headers are not possible.
Rollback (while `docs/` still exists): Settings → Pages → Source "Deploy from a branch", `main` / `/docs`.

## Legacy: the old bundled pages in `docs/` (rollback only)
Each old page is a Claude Design bundle: a plain-HTML SEO fallback, base64 assets keyed by UUID, and the real page as
one JSON-encoded string inside `<script type="__bundler/template">`, unpacked by JavaScript. If one ever has to be
edited, use `tools/template.mjs` (`readTemplate` / `writeTemplate`, `node tools/template.mjs check`) — never
find/replace inside the escaped string; a raw `</script>` in it breaks the page.
