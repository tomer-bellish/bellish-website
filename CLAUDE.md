# Bellish Architects website (bellish.co.il)

Portfolio site for בליש אדריכלים. The site itself is English-only; the owner talks to Claude in Hebrew.
Handoff notes (must-keep features, business data, new-project checklist): [README.md](README.md).
Work plan: [PLAN.md](PLAN.md). Accessibility / cookie compliance status and owner to-dos: [COMPLIANCE.md](COMPLIANCE.md).

## Layout — Astro site on `main` (live since 29.10.2026)
This folder is the clone of `github.com/tomer-bellish/bellish-website`.
- `src/layouts/Base.astro` — `<head>` (SEO tags, JSON-LD, consent script), skip link, menu + scroll-reveal scripts.
- `src/components/` — Header, Footer, ProjectBody (project page), FormScript (Formspree forms). Every form keeps a
  hidden `_gotcha` spam trap (`<div class="hp">`, hidden in base.css); `npm run check` fails without it.
- `src/data/projects.ts` — every project, in site order. Project pages, the grid, ItemList, breadcrumbs, next-project
  links and the sitemap all derive from it. `team.ts` — Studio team. `site.ts` — Organization JSON-LD.
- `src/lib/images.ts` — srcset helper: lists whichever of `-800/-1200/-1920/-2880.webp` exist, plus the original at
  its real width (read from the WebP header). `tools/images.mjs` (`npm run images`) writes those sizes.
- `public/` — assets (images, scripts), fonts, CNAME, robots.txt, favicon.ico, 404.html, and the static
  `/projects/<slug>/` redirect pages. Other old-URL redirects live in `redirects` in `astro.config.mjs`.
- `npm run build` → `dist/`. Preview configs: `astro` (dev server, 4321) and `dist` (`tools/serve.mjs`, built site, 8081).
- `npm run check` (after a build) → `tools/check.mjs`: internal links, SEO tags, JSON-LD, sitemap, axe-core on every
  page at 1280 and 375px, and cookie consent (no third party before "Accept" except tabnav; GA loads after it).
  Uses Playwright's Chromium if installed, otherwise the local Chrome or Edge. Takes about 40 seconds.
- `design-source/` — the original Claude Design files (`*.dc.html`), kept as a design reference only.
- The previous bundled site (`docs/`) was removed on 29.10.2026 after the cutover; it is in git history before
  that commit. Local-only branches: `astro` (where the rebuild was done), `handoff`, `backup/site-2026-07-04`.

## Changing content
- New project: entry in `src/data/projects.ts` (first image = hero, `updated` = today, `description` = one complete
  sentence of 120–155 characters for Google) + WebP images in `public/assets/`, then `npm run images` to write the
  smaller sizes (WebP q92, only where lighter than the original; existing files are kept). Nothing else to edit.
- Team: `src/data/team.ts`. Contact details: `src/data/site.ts` (JSON-LD), the contact page and the footer.
- Open positions: `src/data/jobs.ts` only (list, role count, form options, page description). "updated <month>" is
  the build month; a scheduled run in `deploy.yml` rebuilds on the 1st of each month to keep it current.
- The second office is labelled **Tel Aviv** on the site (it is on the border); its address is Glilot, Big Fashion
  Tower, Ramat HaSharon.

## Rules
- Consent: `public/assets/cookie-consent.js` is the only place that loads Google — GA4 and Preferred Sources are
  injected in its `loadTags()` after "Accept". GTM was removed (its container GTM-T3H6PWPH was empty). Never add a
  third-party script to `Base.astro` directly; add it there and list it in the cookie policy.
- GA4 events go through `window.__bellishConsent.track(name, params)` (sends nothing without consent). Clicks, project
  views, scroll depth and 404 are in `public/assets/track.js`; forms in FormScript, gallery in `lightbox.js`, filter /
  pager / card carousel on the projects page. Never send personal data (names, emails, phones, message text). The
  event list and the GA custom dimensions are in PLAN.md 4.1.
- Text colours must keep ≥ 4.5:1 (secondary grey on paper is `#71706B`, not the design's `#7B7A74`); UI borders ≥ 3:1.
  axe-core (4.14.0, a dev dependency) must report 0 violations on every page — `npm run check` enforces it.
- Run `npm run build && npm run check` before every commit that changes the site; a failure blocks the deploy anyway.
- Keep every URL, meta tag, JSON-LD block and asset path stable — SEO depends on them.
- The owner sometimes runs several Claude sessions on this folder at once. Before committing, check `git status` /
  `git diff` for changes you did not make and commit only your own (stage partial files from a HEAD-based copy).

## Deploy
GitHub Pages with Source = **GitHub Actions**: `.github/workflows/deploy.yml` builds, runs `npm run check` and
publishes on every push to `main` (about 1.5 minutes; the check itself ~35 s). If the check fails nothing is published, the live site stays as
it was, and GitHub emails the owner. The owner chose Claude to push from here; still confirm before each push — it goes live.
GitHub handles HTTPS and the www redirect; custom HTTP headers are not possible.
Rollback: `git revert` the bad commit and push — the workflow redeploys in about 1.5 minutes.
