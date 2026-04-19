# gov.gh v1 — Design spec

**Date:** 2026-04-19
**Owner:** ohcs.gov.gh (Ozzy)
**Status:** Design locked via brainstorming · awaiting user review
**Target shipping window:** ~4–6 weeks from plan approval

---

## 1. Summary

A three-pillar public portal for the Republic of Ghana — **front door, service
catalogue, news hub** — mimicking the structural elegance of
[gov.rw](https://www.gov.rw/) but with a distinctly Ghanaian identity. The v1 is a
**Soft launch**: a content volume small enough to finish, large enough to
genuinely help a citizen on day one. Visual direction is **Refined warmth**:
off-white paper, Kente micro-stripe, editorial serif display, Adinkra symbols
as quiet punctuation. Hero is **cultural close-up photography** (macro Kente,
cocoa, brass scales, drum skins) — distinctly Ghanaian without literal
depiction, and sourceable this week.

The v1 is **read-only content**: no logins, no forms, no payments, no backend
services. Every "apply" action deep-links to the existing agency site
(passports.gov.gh, gra.gov.gh, etc.). The platform's value is **signal** — the
definitive, trustworthy, beautiful map of how Ghana's government works.

This scope is dramatically smaller than the aspirational 8-service
Cloudflare-native architecture laid out in `.claude/CLAUDE.md`. That larger
architecture is parked as a forward option, not v1 work.

---

## 2. Goals & non-goals

### 2.1 Goals

1. **Dignity** — feel presidential, restrained, worldclass on first impression.
2. **Utility** — every "most-requested" service documented clearly enough that
   a citizen can prepare before visiting an agency site.
3. **Trust** — correct, current, cited. Each service page names its authoritative
   source; each news item carries a date and issuing ministry.
4. **Performance** — LCP ≤ 2.5s on 4G, ≤ 4s on 3G; total page weight ≤ 300 KB
   gzipped; Lighthouse mobile ≥ 95 across every category.
5. **Accessibility** — WCAG 2.2 AA, verified in axe + manual keyboard pass.
6. **Progressive enhancement** — every page readable without JavaScript.
7. **Bilingual-ready** — EN is primary; Twi stubs ship for the 5 highest-value
   pages; architecture allows painless expansion to full Twi + Ewe + Ga + Dagbani
   later.

### 2.2 Non-goals (explicitly out of scope for v1)

- User accounts, GhanaConnect OIDC, MyInfoGH, payment rails, signed forms.
- Dynamic backend services (workers beyond static-host Pages Functions).
- Full Twi/Ewe/Ga/Dagbani content parity.
- Ministry-level micro-sites (`{ministry}.gov.gh`).
- CMS admin UI (Keystatic/Payload). Content is authored in git as markdown.
- Editorial workflow tooling, analytics dashboards, feedback ingestion.
- Storybook site at `design.gov.gh` (parked — existing `apps/design-system`
  app is sufficient for now).

These are all valuable; none are v1.

---

## 3. Information architecture

### 3.1 Page tree

```
/                              Homepage
│
├── /services/                 Services index (life-stage tiles + A–Z)
│   ├── /services/live/        Live landing (~8 services)
│   ├── /services/work/        Work landing (~8 services)
│   ├── /services/business/    Do business landing (~8 services)
│   ├── /services/visit/       Visit landing (~6 services)
│   ├── /services/a-z/         A–Z topic index
│   ├── /services/{slug}/      One page per service (30 total)
│   └── /services/diaspora/    Diaspora curated landing
│
├── /news/                     News index
│   ├── /news/{year}/{slug}/   One page per article (6–10 total at launch)
│   └── /news/feed.xml         RSS/Atom feed
│
├── /ministries/               Ministries directory
│   └── /ministries/{slug}/    One page per ministry (21 total)
│
├── /about/                    About the portal
├── /accessibility/            Accessibility statement (WCAG 2.2 AA claim)
├── /privacy/                  Privacy notice (DPA 2012 Act 843 aligned)
├── /contact/                  Contact / feedback (mailto + phone for v1)
└── /search/                   Search results page
```

Total pages at launch: **~75** (homepage + 4 category landings + A–Z + 30 services
+ Diaspora + news index + 6–10 articles + 21 ministries + 5 boilerplate + search).

### 3.2 Navigation

- **Primary nav** (every page, always visible): `Services · News · Ministries · About`
- **Language toggle** (top-right): `EN / Twi` — Twi routes fall back to EN when
  translation missing, with a visible "English fallback" notice.
- **Search** (header icon on every page; full box on homepage hero).
- **Footer**: Contact · Accessibility · Privacy · RTI · Anti-corruption hotline ·
  Parent organisation (OHCS) · CC-BY licence · coat of arms.

---

## 4. Visual system

### 4.1 Tokens (already in `packages/gh-ds/`, v1 adjusts defaults)

**Colour palette**

```css
--ghana-red-700:   #820B18;   /* accent, decorative, warnings */
--ghana-gold-500:  #E0B912;   /* accent, chips, decorative only */
--ghana-green-600: #005A35;   /* primary CTAs, links, brand mark */
--ghana-green-900: #001A0E;   /* footer ground */
--ghana-ink-700:   #2B2E34;   /* body text */

--paper:           #FAF7F2;   /* body background (refined warmth) */
--paper-line:      #E5E0D6;   /* hairline borders on paper */
--paper-raised:    #FFFFFF;   /* card surfaces */
```

Semantic tokens delegate to these; no raw hex in component styles.

### 4.2 Typography

- **Display / headings:** Georgia 400/600/700 (system-safe) with
  `Playfair Display` OFL as optional progressive enhancement via `font-display: swap`.
- **UI / body:** Inter 400/500/700 (already self-hosted WOFF2 in `packages/gh-ds/fonts/`).
- **Monospace:** JetBrains Mono (already present).
- **Scale:** 12 / 14 / 16 / 18 / 20 / 24 / 32 / 40 / 48 / 64 px (unchanged from `packages/gh-ds/src/tokens/typography.ts`).

### 4.3 Ornament — cultural grammar

- **Kente micro-stripe** — 6–8 px repeating pattern (green / gold / red / black)
  at the very top edge of every page. The only decorative flag-colour moment.
- **Adinkra symbols** — used *only* as functional punctuation per CLAUDE.md §6.3:
  - **Sankofa** → BackLink icon (pending Folklore Board clearance per ADR-004; generic chevron ships first)
  - **Nyansapo** → help icon on service pages
  - **Akoma** → accessibility statement
  - **Fihankra** → privacy notice
- **No Kente as wallpaper. No Gye Nyame as brandmark.** Hard constraint.
- **Brand mark** — simple red/gold circle with "Ghana" in Georgia bold. Coat of
  arms appears only in the footer and on the About page (legal usage).

### 4.4 Photography

- **Hero:** cultural close-ups (Kente weaving, cocoa pods, brass scales,
  calabash textures, drum skins). 3 images in rotation at launch. Full-bleed
  above the fold on home + category landings.
- **Service pages:** no photography. Typography + Kente accent only.
- **News articles:** one lead image per article, 16:9, compressed to ≤ 80 KB.
- **Sourcing:** curated from Unsplash / Pexels under permissive licences
  (credited in `/about#credits`) + public-domain government archive where
  available. Budget for commissioned macro shoot listed as v2 upgrade.
- **Optimisation:** Cloudflare Images or Astro's built-in image pipeline.
  Always AVIF → WebP → JPEG, responsive `srcset` to 480 / 960 / 1600 w.

### 4.5 Components

Every UI primitive comes from `@gh/gh-ds` (25 components already shipped).
No new components needed for v1 unless one of these templates exposes a gap:

- **Page layouts** (new in this spec): `HomepageLayout`, `CategoryLandingLayout`,
  `ServicePageLayout`, `NewsArticleLayout`, `MinistryPageLayout`, `BoilerplatePageLayout`.
- **Composite blocks** (new, composed of existing GH-DS components):
  `Hero`, `LifeStageTiles`, `MostRequestedBand` (already exists), `NewsStrip`,
  `PublicationsList`, `MinistryDirectoryEntry`, `ServiceMetaPanel`.

See §6 for the full list.

---

## 5. Content model

All content lives in the repo as markdown with YAML frontmatter, in
`apps/portal/src/content/`. Astro Content Collections enforce the schema at
build time. No database, no CMS UI in v1.

### 5.1 Service (`content/services/*.md`)

```yaml
---
slug: renew-passport                       # url-safe
title: Renew your Ghanaian passport
lifeStage: visit                           # live | work | business | visit
topics: [passport, travel, identity]       # for A–Z index
lede: Renew your passport online or at any Ghana Immigration Service office.
priority: 1                                # display order on category page (1=top)
eligibility:
  - text: You already hold a valid or recently-expired Ghanaian passport
  - text: You are 18 years or older (guardians apply for minors)
youWillNeed:
  - Ghana Card (original)
  - Two passport photographs (35mm × 45mm, white background)
  - Old passport (all pages)
  - Fee payment receipt
cost:
  amount: 100
  currency: GHS
  unit: standard (32 pages)
  notes: Executive (64 pages) is GH₵ 150.
timeline: ~7 working days
agency:
  name: Ghana Immigration Service
  url: https://passports.gov.gh
  phone: +233 30 266 6301
applyUrl: https://passports.gov.gh/apply
updatedAt: 2026-04-01
sourceOfTruth: https://passports.gov.gh
twiSlug: renew-passport                    # optional; present if Twi version exists
---

Body text in plain Ghanaian English. Grade-8 reading. Active voice. Second
person. Optional sections: "Before you apply", "Step by step", "After you apply",
"Related services".
```

### 5.2 News article (`content/news/*.md`)

```yaml
---
slug: budget-midyear-2026
title: 2026 mid-year budget review
lede: The Minister of Finance presented the mid-year review to Parliament.
publishedAt: 2026-04-18
ministry: finance                          # links to /ministries/finance
author: Ministry of Finance
heroImage: /images/news/budget-2026-midyear.jpg
topics: [budget, finance, parliament]
---

Article body in markdown.
```

### 5.3 Ministry (`content/ministries/*.md`)

```yaml
---
slug: finance
name: Ministry of Finance
shortName: MoF
minister: Hon. [name]
deputyMinister: Hon. [name]
parentGovernment: Executive
phone: +233 [number]
email: info@mofep.gov.gh
website: https://mofep.gov.gh
address: Finance Drive, Ministries, Accra
mandate: |
  Short paragraph on the ministry's mandate and responsibilities.
departments: [GRA, CAGD, PPA, Bank of Ghana (supervised)]
keyServices: [file-tax, tin-registration]  # slugs from services collection
---

Optional longer body in markdown for About-style content.
```

### 5.4 Boilerplate pages (`content/pages/*.md`)

`about.md`, `accessibility.md`, `privacy.md`, `contact.md`, `diaspora.md` — all
long-form markdown with a minimal frontmatter (title, lede, updatedAt).

---

## 6. Technology

### 6.1 Stack

- **Astro 5** (static-site generation) — already configured in `apps/portal/`.
- **`@gh/gh-ds`** (25 components, already shipped) — consumed directly, no changes.
- **Cloudflare Pages** — deploy target, already in `apps/portal/wrangler.toml`.
- **Astro Content Collections** — content schema + type safety.
- **Pagefind** (client-side search, ~30 KB) — indexed at build, served as a static
  asset. No D1, no worker, no backend.
- **astro:assets** — responsive images, AVIF/WebP.
- **No React, no JS framework**. Astro islands only where absolutely needed
  (language switcher; search results; nothing else).

### 6.2 Monorepo cleanup

We already have a commit at `9176ee2` with the broader monorepo scaffolded.
For v1 we **keep and use**:

- `apps/portal/` — the Ghana.gov site
- `packages/gh-ds/` — the design system (25 components, unchanged)
- `docs/` — ADRs + this spec
- `infra/terraform/` — Cloudflare Pages config for `apps/portal/` only
- `.github/workflows/ci.yml` — five-gate pipeline (typecheck / lint / test / build / format:check)

We **park (keep files, remove from active build)**:

- `apps/ministries/`, `apps/dashboard/`, `apps/data-portal/`, `apps/design-system/`
- `services/api/`, `services/identity/`, `services/myinfo-gateway/`,
  `services/payments/`, `services/cms-admin/`, `services/search/`,
  `services/webhooks/`, `services/workflows/`
- `packages/identity-client/`, `packages/myinfo-client/`, `packages/payment-client/`,
  `packages/schemas/`, `packages/telemetry/`, `packages/i18n/`

"Park" means: add `"private": true` + remove from `pnpm-workspace.yaml` build
filters so turbo skips them, but keep the files on disk as a forward option.
An ADR (ADR-004, see §10) documents the decision.

### 6.3 Bilingual architecture

- Routes: `/` (EN default) and `/tw/` (Twi).
- Astro i18n routing generates both sides.
- `Twi stubs ship for 5 pages at launch`: `/`, `/services/live`, `/services/work`,
  `/services/business`, `/services/visit`. Every other Twi URL resolves to the
  EN page with a visible "We're working on a Twi translation" notice.
- No runtime translation. Every Twi page is hand-authored markdown.

### 6.4 Search

- Pagefind indexes every service + news + ministry + boilerplate page at build.
- Index split per language: `/pagefind/` (EN) and `/tw/pagefind/` (Twi).
- Search results page (`/search`) is a thin Astro page that loads the Pagefind
  UI and renders matches with Kente-accent bars per category.
- No typo tolerance / stemming beyond Pagefind's defaults in v1. A future
  upgrade to Cloudflare D1 FTS5 is noted in §11.

---

## 7. Content sourcing & workflow

### 7.1 v1 content policy

Decision (default; tell me to flip if wrong): **we stub from publicly-available
authoritative sources** (agency websites, published fee schedules, gazette
notices). Every service page's frontmatter carries a `sourceOfTruth:` URL that
renders on-page as an "Official source" citation. Agencies get a post-launch
review cycle; corrections merge within 5 working days of receipt.

**Reason:** waiting for signed-off copy from 21 agencies takes months. Launching
with clearly-cited, carefully-researched stubs — visibly linked to the authoritative
source — is honest, fast, and creates pressure for agencies to engage with corrections.

### 7.2 Editorial tone (per CLAUDE.md §6.4)

- Plain Ghanaian English, active voice, ≤ 20-word sentences, Grade-8 reading.
- Second person: "You must…" not "The applicant shall…".
- Dates: `DD Month YYYY`. Currency: `GH₵` prefix. Phone: `+233 XX XXX XXXX`.
- No jargon on first mention; abbreviations expanded on first use.
- No Pidgin in transactional copy.

### 7.3 Publish workflow

Content author (initially: owner) writes markdown in VS Code → commits to a
feature branch → opens PR → CI runs typecheck/lint/test/build → human review →
merge → Cloudflare Pages auto-deploys to production.

---

## 8. Accessibility & performance gates (CI-enforced)

Inherits CLAUDE.md §8 thresholds. Every PR blocked on:

- **Lighthouse mobile** · Performance ≥ 95, Accessibility 100, Best Practices ≥ 95, SEO 100
- **LCP** ≤ 2.5 s (4G throttle), **INP** ≤ 200 ms, **CLS** ≤ 0.1
- **Total transfer** ≤ 300 KB gzipped per page
- **Unused JS** ≤ 20 KB
- **axe-core** · zero blocking violations across every built page
- **Contrast** · automated 4.5:1 min body, 3:1 large; manual review for semantic pairs

Plus manual (per release):

- Keyboard-only walk-through across every page template
- NVDA (Windows) + VoiceOver (macOS) skim of every page template
- Responsive check at 320 / 375 / 768 / 1024 / 1440 px

---

## 9. Deliverables — the v1 launch checklist

- [ ] Monorepo trimmed per §6.2; ADR-004 documents the parked packages.
- [ ] `apps/portal/` routing scaffold with all §3.1 URLs resolvable.
- [ ] Layouts built (6 page templates per §4.5).
- [ ] Composite blocks built (`Hero`, `LifeStageTiles`, `NewsStrip`,
      `PublicationsList`, `MinistryDirectoryEntry`, `ServiceMetaPanel`).
- [ ] Content collections + Zod schemas wired per §5.
- [ ] **30 service markdown files** authored + reviewed for tone.
- [ ] **21 ministry markdown files** authored (name + contact + mandate).
- [ ] **6–10 news markdown files** authored.
- [ ] 5 boilerplate pages (about / accessibility / privacy / contact / diaspora).
- [ ] 5 Twi stubs (home + 4 life-stage landings).
- [ ] 3 cultural close-up hero images sourced, licensed, optimised.
- [ ] Pagefind integration + `/search/` results page.
- [ ] Responsive image pipeline verified.
- [ ] CI five-gate pipeline still green end-to-end.
- [ ] External WCAG 2.2 AA audit (or documented self-audit with axe + manual).
- [ ] Lighthouse run against deployed Pages preview hits every threshold in §8.
- [ ] Accessibility statement published with audit results.
- [ ] Privacy notice published (DPA 2012-aligned).
- [ ] Cloudflare Web Analytics wired (privacy-respecting, no consent banner needed).
- [ ] Custom domain (`gov.gh` staging subdomain first, then production) and DNS.

---

## 10. New ADRs required

1. **ADR-004: v1 scope — soft launch on a trimmed monorepo** — records §6.2
   (what's kept vs parked) and §7.1 (content sourcing policy). Supersedes the
   CLAUDE.md §5 Weeks 11–14 scope; cites this spec.
2. **ADR-005: Bilingual launch — EN primary, Twi stubs** — records §6.3.
3. *(Pre-existing, still pending)* **ADR: Sankofa glyph clearance + BackLink icon
   swap** — was noted in `docs/doctrine/pr-7b-handoff.md` carry-forward #1;
   remains open, generic chevron ships first.

---

## 11. Out of scope for v1, post-v1 roadmap

In rough order of likely sequence after v1 lands:

1. **v1.1 — content expansion**: services 31–80, all ministries deepened to
   full pages, news cadence established.
2. **v1.2 — bilingual parity**: every page in Twi; Ewe + Ga + Dagbani begins.
3. **v2 — photography upgrade**: commissioned people-centric hero photography,
   moving the site from cultural-close-up to cultural + human.
4. **v2 — Keystatic editorial UI**: git-backed CMS so non-developer content
   editors can work without VS Code.
5. **v2 — feedback ingestion**: Cloudflare Pages Function + Queue + D1 +
   Access-gated admin view.
6. **v2 — full search**: Cloudflare D1 FTS5 + Vectorize semantic search.
7. **v3 — transactional services**: GhanaConnect OIDC, MyInfoGH, payment
   abstraction — the CLAUDE.md §2 doctrine executed incrementally as agency
   integrations materialise.

Each of these earns its own spec + plan when it enters a milestone. None of them
block v1.

---

## 12. Risks

| Risk | Mitigation |
|---|---|
| Agency disputes v1 stub copy publicly | Source citation on every service page; visible "Report an error" link; 5-working-day correction SLA. |
| Kente micro-stripe reads as "kitsch" to some audiences | Max 6–8 px height, only on top edge, never repeated on the page. Reviewed against `100-cedi note` reference. |
| Photography search yields poor results | 3 confirmed curated images locked before build week begins; if not, fall back to typography-only hero (Direction B from brainstorming). |
| 4–6 weeks is optimistic for 30 services | Start with 10 flagship services visible + 20 "coming soon" placeholders publicly linked. Iterate weekly post-launch. |
| Twi stubs feel tokenistic | Each Twi stub is hand-authored and reviewed by a Twi-first speaker; no machine translation at launch. |

---

## 13. What gets built first (the first five PRs, approximate)

1. **PR A — monorepo trim + ADR-004.** Park unused packages/apps/services; root
   `pnpm install` + five-gate pipeline stay green.
2. **PR B — Astro routing scaffold + Content Collections schemas.** Every URL
   in §3.1 resolves (mostly to placeholders). Content schemas per §5 with Zod.
3. **PR C — page layouts + composite blocks.** 6 layouts, 6 composite blocks,
   all axe-clean. Placeholder content.
4. **PR D — homepage + life-stage category pages with real content + hero
   photography pipeline.** Real images optimised through astro:assets.
5. **PR E — 10 flagship service markdown files + Pagefind integration + search
   results page.**

PRs F, G, H, I follow for remaining services, ministries, news, boilerplate,
and Twi stubs. These are planned once the user signs off on this spec and we
invoke the writing-plans skill.
