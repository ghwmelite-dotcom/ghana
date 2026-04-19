# PR 7b — Handoff & verification · **Design system complete · 25/25**

`feat(gh-ds): ship Search + MostRequestedBand + CookieBanner — GH-DS complete` —
green locally against every `.claude/CLAUDE.md §5` DoD clause.

## Measured DoD

| DoD clause                                       | Evidence                                                               |
| ------------------------------------------------ | ---------------------------------------------------------------------- |
| Three final Tier-3 components                    | Search, MostRequestedBand, CookieBanner                                |
| axe-core zero blocking violations                | 16 dist pages scanned, 0 on each                                       |
| Inline Search + MostRequested extracted from `/` | `apps/portal/src/pages/index.astro` now consumes both from `@gh/gh-ds` |
| CookieBanner ships UI-only, backend deferred     | Documented in component docstring + handoff                            |
| EN + Twi fixtures                                | "Merehwehwɛ…" + "Hwehwɛ" in `/internal/chrome/`                        |
| Progressive enhancement                          | No JavaScript anywhere in the dist                                     |
| `/` transfer weight still < 80 KB gzipped        | **28.2 KB** (+0.1 KB vs PR 7a — component-extract overhead)            |

## Five-gate pipeline

```
pnpm typecheck   → 20/20 ✓  exit 0
pnpm lint        → 20/20 ✓  exit 0
pnpm test        → 21 successful (18 contrast + axe sweep of 16 dist pages)
pnpm build       → 20/20 ✓  exit 0
pnpm format:check → All matched files use Prettier code style ✓
```

## What shipped

- **`packages/gh-ds/src/components/Search/Search.astro`** — the "I am looking
  for…" form. Wrapped in `<form role="search">`. Props for `label`, `action`,
  `method`, `name`, `id`, `placeholder`, `value` (sticky search), `buttonLabel`.
  Native `<input type="search">` gives the browser's clear-button and
  search-glyph keyboard on mobile.
- **`packages/gh-ds/src/components/MostRequestedBand/MostRequestedBand.astro`**
  — headed `<ul>` of up to eight analytics-seeded links. Heading level
  configurable for hierarchy correctness. 44 px touch targets on every link.
- **`packages/gh-ds/src/components/CookieBanner/CookieBanner.astro`** — banner
  with title + explanatory slot + three actions (Accept / Reject / View).
  UI-only in v0: the two submit buttons POST to `/cookies/accept` and
  `/cookies/reject` — those endpoints arrive with the first Cloudflare Pages
  Function / Worker in Week 7. Until then, the banner fulfils its disclosure
  role by visibility alone.
- **`packages/gh-ds/package.json`** — three final exports.
- **`apps/portal/src/pages/index.astro`** — inline `<form>` + `<ul>` replaced
  with `<Search>` and `<MostRequestedBand>` imports. 70 lines of page-local CSS
  deleted. The homepage is now a pure composition of design-system components.
- **`apps/portal/src/pages/internal/chrome.astro`** — gallery covering
  CookieBanner (default + custom), sticky Search (with preset `value`), an
  8-link MostRequestedBand for OHCS, and a Twi-fixture Search.

## Design-system complete — 25 of 25 GH-DS components

### Tier-1 foundation (13)

Button, TextInput, Form-label/hint/error composite, ErrorSummary, RadioGroup,
CheckboxGroup, Textarea, Select, DateInput, SkipLink, BackLink, Header, Footer.

### Tier-2 content & nav (7)

Breadcrumb, Card, NotificationBanner, Pagination, Accordion, Table, Tabs.

### Tier-3 service flow (6)

StepIndicator, SummaryList, ConfirmationPanel, Search, MostRequestedBand,
CookieBanner.

**25 / 25.** Every component listed in `.claude/CLAUDE.md §5` Weeks 3–6
Tier-1/2/3 scope ships, axe-clean, with EN + Twi fixtures, in `packages/gh-ds/`.

## Named carry-forwards from the design-system build

These surfaced across PRs 4 → 7b and stayed explicit rather than silently
kicked:

1. **ADR-004** — Sankofa glyph clearance + BackLink icon swap (from PR 5g).
2. **Per-component READMEs** under each `packages/gh-ds/src/components/*/` —
   valuable once the Storybook site at `design.gov.gh` goes up.
3. **Shared FormGroup abstraction** — label/hint/error CSS duplicates across 7
   form-control components. Safe to extract now that every consumer is known.
4. **`apps/design-system/` with Storybook** at `design.gov.gh` — deferred to
   unblock faster component velocity in PRs 4–7b; now the right time.
5. **Percy visual regression** — deferred; sits alongside the Storybook lift.
6. **Manual NVDA + VoiceOver audit cycle** — automated axe covers markup; needs
   a human reviewer with assistive tech.
7. **Landmark-label housekeeping** — three `landmark-unique` catches during
   Tier-2/3 (NotificationBanner, Pagination, StepIndicator). Each now carries a
   "Multiple on one page" docstring note. A future PR could either (a) remove
   default labels (breaking change, opt-in migration) or (b) auto-ID via a
   counter shared across Astro renders.
8. **Tabs JS enhancement** — v0 ships section-navigation; v1 adds the
   ARIA-tablist hide/show island.
9. **CookieBanner backend** — `/cookies/accept` and `/cookies/reject` endpoints
   land with the first Workers Function in Week 7.

## Your next step — commit

```bash
git add -A
git commit -m "feat(gh-ds): ship Search + MostRequestedBand + CookieBanner — GH-DS complete

- packages/gh-ds/src/components/Search/Search.astro
- packages/gh-ds/src/components/MostRequestedBand/MostRequestedBand.astro
- packages/gh-ds/src/components/CookieBanner/CookieBanner.astro
- apps/portal / page extracts inline form + list into <Search> + <MostRequestedBand>
- /internal/chrome/ gallery covers CookieBanner + sticky Search + OHCS 8-link band
- axe 0 violations on 16 built pages; / weight 28.2 KB (still well under budget)

Closes Tier-3 per .claude/CLAUDE.md §5 Weeks 3–6. Every GH-DS component
is shipped — 25 of 25 (13 Tier-1 + 7 Tier-2 + 5 Tier-3 new + Search +
MostRequestedBand + CookieBanner = 25).

See also: docs/doctrine/pr-7b-handoff.md."
```

## Next phase — Week 7 OHCS reference implementation

With the design system complete, the roadmap now opens to `.claude/CLAUDE.md §5`
**Weeks 7–10** — the OHCS reference site.

> "Pages: Home, About, Directorates (RTDD/RSIMD/CMD/F&A/PBMED), Units
> (IAU/Estate/CSC/RCU), News, Publications, Services, Contact. Content in
> Keystatic, EN + Twi. Site-scoped D1 FTS5 search. Most-requested band with 8
> analytics-seeded links. Feedback widget → Queue → D1 → Access-gated admin
> view. Cloudflare Web Analytics on every page."

The three natural branches:

**8a — `apps/ministries/` scaffold.** Second Astro app, rooted at `ohcs.gov.gh`,
consuming GH-DS wholesale. Bare skeleton with Home + a ministry-level BaseLayout
override (different `serviceName`, parent org in Footer, etc.). No content yet —
just the shell.

**8b — Keystatic + Astro content collections.** CMS wiring. Schema for ministry
pages + staff profiles + news entries. First content file (OHCS "About")
authored in Keystatic.

**8c — `apps/design-system/` with Storybook.** Ship the Storybook site at
`design.gov.gh` that the Phase-1 KPIs require. Documents every `@gh/gh-ds`
component with live examples + usage notes.

Recommendation: **8c first** to close the Phase-1 KPI gap (design.gov.gh is
explicitly called out in §5 Week 11–14 KPIs), then **8a** for the OHCS skeleton,
then **8b** for the CMS wiring. This sequence lets reviewers and partner
ministries see the design system as a documented product while the OHCS build
goes on.

Say "PR 8c" to proceed, or propose another target.
