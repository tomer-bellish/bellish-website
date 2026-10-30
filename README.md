# Handoff: Bellish Architects website (bellish.co.il)

## Overview
Portfolio site for Bellish Architects (בליש אדריכלים), English-only. Live at https://bellish.co.il — an Astro static site built from `src/` and published to GitHub Pages by GitHub Actions on every push to `main` (since 29 October 2026).

## What's in this folder
- `src/`, `public/` — the site (see CLAUDE.md for the layout and how to add a project).
- The previous Claude Design bundles (`docs/`) were removed on 29.10.2026 after the cutover; they remain in git history.
- `design-source/` — the original design files (`*.dc.html`) the pages were generated from. Reference only — they show layout, copy, data and styling. `support.js` is the design runtime they need to open in a browser.

## History: the rebuild recommendation (done)
That rebuild is done (Astro, phase 3 of PLAN.md, live since 29.10.2026). Every URL, meta tag, schema block and asset path was kept and each page was checked against the old one. The original note follows (it refers to the old bundles, since removed).

The pages in `docs/` are self-contained bundles: each `index.html` holds a static SEO `<main id="__static_seo">` block plus the full page template as an escaped JSON string inside `<script type="__bundler/template">`. Editing that string by hand is fragile (an unescaped `</script>` inside it breaks the page — this happened once).

Options:
1. **Keep as-is** — edit `docs/` files carefully (parse the JSON string, edit, re-encode with `<` → `\u003C`).
2. **Recommended: rebuild** as a small static-site project (Astro or Eleventy) using `design-source/` and `docs/` as the visual/content reference: one layout, one project template driven by a `projects` data file. Keep every URL, meta tag, schema block and asset path identical so SEO is preserved.

## Site map / URLs
`/` home · `/projects/` · `/project/<slug>/` (12 projects) · `/studio/` · `/contact/` · `/career/` · `/cookie-policy/` · `/accessibility/` · `404.html`
Legacy redirect pages: `/projects/<slug>/` for every project slug (noindex + canonical → `/project/<slug>/`).
Project slugs: aa-house, ak-house, b-house, g-hotel, h-house, inside-out-house, kv-house, lili-house, p-office, pg-house, the-concrete-box (+ `project/index.html` generic).

## Must-keep technical features
- HTTPS + non-www canonical, gzip and custom `404.html` — handled by GitHub Pages. (`.htaccess` is not used on GitHub Pages; security headers and long cache rules need a different host or a CDN in front.)
- **Google Tag** GA4 `G-4TLRV6RJNT` on every page, with **Consent Mode v2** default `denied`.
- `assets/cookie-consent.js` — self-built consent banner (Accept/Reject equal weight; storage key `bellish-consent`; any element with `data-consent-open` reopens it).
- Google **Preferred Sources** button in footer (`publisher.js` + `assets/preferred-source.js`) — inactive until Google lists the domain.
- Accessibility toolbar (bottom-right), Israeli Standard 5568 / WCAG AA.
- Schema.org JSON-LD: Organization with Hebrew `alternateName`, two LocalBusiness offices, Person (Tomer, Jenine), ItemList on /projects/.
- Favicon 96×96 (`sizes="96x96"`) on all pages.
- Images: WebP with `srcset`/`sizes`; heroes `loading="eager"`.
- Project gallery lightbox: arrows, keyboard, swipe, circular loop, counter.
- `sitemap.xml`, `robots.txt`.

## Visual system
- Fonts: Archivo (headings, 800, lowercase, tight negative tracking), body serif/sans as in source.
- Colors: ink `#111110`, paper `#F5F4F2`, body text `#3A3A37`, muted `#7B7A74` / `#56554F`, rules `#D8D7D2`.
- Exact values for every component are inline in `design-source/*.dc.html`.

## Business data
- Tiberias office: Tarshish 4, Kidmat HaGalil · Ramat HaSharon: Big Fashion Tower, Floor 5 (labelled "Tel Aviv" on the site — it is on the Tel Aviv border)
- Office: office@bellish.co.il · 04-602-9585
- Project statuses: Idea / In Progress / Construction / Complete (pulsing dot). Types: Private Houses / Residential / Offices / Hospitality.

## Adding a new project (checklist)
Ask the owner for: name, type, status, location, year, built m², plot m², description (Hebrew OK → translate), images (first = hero), credits (design team, collaborators, render studio — default PB3DVIS).
Then: WebP images in `assets/` · project page `/project/<slug>/` · add to projects list + ItemList schema · update previous project's "next" link · `sitemap.xml`.
Credits format: `BELLISH DESIGN TEAM / Tomer Bellish, Hadar Hatav / RENDER - PB3DVIS`.

## Legal pages
`/cookie-policy/` — based on Israel Protection of Privacy Law incl. Amendment 13 (Aug 2025), opt-in cookies, GDPR for EU visitors.
`/accessibility/` — Regulation 35, Israeli Standard 5568 AA; contact Tomer Bellish, office@bellish.co.il, 04-602-9585. Review yearly.
