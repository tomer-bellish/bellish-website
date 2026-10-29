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
- `public/` — assets (images, scripts), fonts, CNAME, robots.txt, favicon.ico, 404.html, and the static
  `/projects/<slug>/` redirect pages. Other old-URL redirects live in `redirects` in `astro.config.mjs`.
- `npm run build` → `dist/`. Preview configs: `astro` (dev server, 4321) and `dist` (`tools/serve.mjs`, built site, 8081).
- `design-source/` — the original Claude Design files (`*.dc.html`), kept as a design reference only.
- The previous bundled site (`docs/`) was removed on 29.10.2026 after the cutover; it is in git history before
  that commit. Local-only branches: `astro` (where the rebuild was done), `handoff`, `backup/site-2026-07-04`.

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
Rollback: `git revert` the bad commit and push — the workflow redeploys in 1–2 minutes.
