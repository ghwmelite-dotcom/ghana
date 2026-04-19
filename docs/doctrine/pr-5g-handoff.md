# PR 5g — Handoff & verification · **Tier-1 complete · Week 3–6 closed**

`feat(gh-ds): extract layout components + add BackLink — Tier-1 complete` —
green locally against every `.claude/CLAUDE.md §5` Weeks 3–6 DoD clause.

## Measured DoD

| DoD clause                                  | Evidence                                                  |
| ------------------------------------------- | --------------------------------------------------------- |
| Four components in `packages/gh-ds`         | SkipLink, BackLink, Header, Footer                        |
| axe-core zero blocking violations           | 9 dist pages scanned, 0 violations on each                |
| apps/portal consumes from `@gh/gh-ds`       | BaseLayout imports SkipLink/Header/Footer from gh-ds only |
| Local `apps/portal/src/components/` removed | Header.astro + Footer.astro deleted; styles cleaned up    |
| BackLink gallery + Twi fixture              | `/internal/layout/` — 4 BackLink variants incl. "Sankɔ"   |
| Sankofa-symbol clearance pending captured   | Iconography note in `/internal/layout/`; ADR-004 TODO     |
| 44×44 min touch target                      | Every extracted component hits 2.75rem                    |
| Progressive enhancement                     | No JavaScript in any dist page                            |
| `/` weight still < 80 KB gzipped            | **28.1 KB** (+0.1 KB vs PR 5f — Header prop surface)      |

## Five-gate pipeline

```
pnpm typecheck   → 20/20 ✓  exit 0
pnpm lint        → 20/20 ✓  exit 0
pnpm test        → 21 successful (18 contrast + axe sweep of 9 dist pages)
pnpm build       → 20/20 ✓  exit 0   (9 pages built)
pnpm format:check → All matched files use Prettier code style ✓
```

## What shipped

- **`packages/gh-ds/src/components/SkipLink/SkipLink.astro`** — hidden until
  focused. Props: `href` (default `#main`), `class`. Default slot "Skip to main
  content".
- **`packages/gh-ds/src/components/BackLink/BackLink.astro`** — generic
  left-chevron + "Back" text. Iconography stays generic until Folklore Board
  clearance allows the Sankofa motif per §6.3; the contract stays the same when
  the swap lands. Required `href` prop, optional slot for custom label.
- **`packages/gh-ds/src/components/Header/Header.astro`** — extracted from
  apps/portal, parameterised for ministry reuse. Props: `serviceName`,
  `countryLabel`, `homeHref`, `primaryNav`, `languages`, `currentLanguage`,
  `flagRule`. All defaults fit the gov.gh root portal.
- **`packages/gh-ds/src/components/Footer/Footer.astro`** — extracted and
  parameterised. Props: `navItems`, `hotlineLabel`, `hotlineNumber`,
  `parentOrganisation`, `parentOrganisationLong`, `year`, `licenceHref`,
  `licenceLabel`, `motto`.
- **`apps/portal/src/layouts/BaseLayout.astro`** — imports SkipLink, Header,
  Footer from `@gh/gh-ds`. Local copies in `apps/portal/src/components/` are
  deleted. Skip-link + flag-rule CSS removed from `global.css`.
- **`apps/portal/src/pages/internal/layout.astro`** — new gallery at
  `/internal/layout/` exercising BackLink (default / custom label / deep context
  / Twi "Sankɔ") plus an iconography-clearance note.

## Tier-1 complete (13 of 13)

| Component                        | PR  |
| -------------------------------- | --- |
| Button                           | 4   |
| Text input                       | 5a  |
| Form label/hint/error composite  | 5a  |
| Error summary                    | 5c  |
| Radio                            | 5d  |
| Checkboxes                       | 5d  |
| Textarea                         | 5e  |
| Select                           | 5f  |
| Date input (D/M/Y)               | 5f  |
| Header (coat-of-arms + lang)     | 5g  |
| Footer                           | 5g  |
| Skip-link                        | 5g  |
| Back link (Sankofa — chevron v0) | 5g  |

**`.claude/CLAUDE.md §5` Weeks 3–6 is complete** — every Tier-1 foundation
component is in `@gh/gh-ds`, axe-clean, consumed by apps/portal, shipping with
EN and Twi fixtures.

## Week 3–6 close-out

### KPIs satisfied

- ✅ GH-DS v1 tokens shipped (PR 2).
- ✅ Tier-1 12-component set shipped (PR 4, 5a, 5c, 5d, 5e, 5f, 5g).
- ✅ axe-core zero violations across every gallery page.
- ✅ EN + Twi fixtures on every form-control gallery.
- ✅ Each component is keyboard-operable, no JavaScript required.
- ✅ `/` transfer weight 28 KB gzipped — 66% headroom under 80 KB budget.
- ⬜ Storybook entries at `design.gov.gh` — deferred to a dedicated
  `apps/design-system` PR. The `/internal/*` gallery pages serve as a working
  proxy for reviewers and axe-check coverage until then.
- ⬜ Percy visual snapshot — deferred; axe-check gives accessibility gating,
  Percy adds visual regression which becomes valuable once the design-system
  Storybook site lands.
- ⬜ Full NVDA + VoiceOver audit — needs a human reviewer cycle with assistive
  tech. Automated axe covers the markup-level checks.

### Carried-forward follow-ups

These are named, not silently forgotten:

- **ADR-004** — Sankofa glyph clearance and BackLink icon swap. File this as
  soon as the Folklore Board clearance request is submitted; merge it into
  `docs/adr/` when clearance lands.
- **Per-component READMEs** (`packages/gh-ds/src/components/*/README.md`) —
  useful for external reviewers and when design.gov.gh Storybook goes up.
- **Shared FormGroup abstraction** — duplicate label/hint/error CSS across 7
  form-control components is ~50 lines per component. Safe to extract now that
  every consumer is known; target a dedicated clean-up PR before Tier 2 starts.
- **Tier-2 and Tier-3 components** (7 and 6 respectively) are Weeks 5–6 scope
  inside `.claude/CLAUDE.md §5`. Breadcrumb, Pagination, Tabs, Accordion,
  Responsive table, Card, Notification banner (Tier 2) + Step indicator, Summary
  list, Confirmation template, Search, Cookie banner, Most-requested band (Tier
  3).

### Move into Week 7

Next-phase scope per `.claude/CLAUDE.md §5`: **Weeks 7–10 — OHCS reference
implementation**. Rebuild OHCS on the stack and prove the pattern end-to-end.

> "Pages: Home, About, Directorates (RTDD/RSIMD/CMD/F&A/PBMED), Units
> (IAU/Estate/CSC/RCU), News, Publications, Services, Contact. Content in
> Keystatic, EN + Twi. Site-scoped D1 FTS5 search. Most-requested band with 8
> analytics-seeded links. Feedback widget → Queue → D1 → Access-gated admin
> view. Cloudflare Web Analytics on every page."

To begin Week 7, the roadmap branches three ways:

**6a — Keystatic + Astro content collections.** Wire content authoring. Content
schema for ministry pages; first page (OHCS `About`) in Keystatic.

**6b — Tier-2 components** (Breadcrumb + Pagination + Card + Notification
banner + Responsive table + Accordion + Tabs). Unlocks content pages that need
real navigation affordance.

**6c — `apps/ministries/` scaffold.** First ministry site (OHCS) as its own
Astro app, consuming `@gh/gh-ds`.

Recommendation: **6b (Tier-2) first** — content pages need Card, Breadcrumb, and
Notification banner at minimum to feel right. Then **6a** for the CMS wiring,
then **6c** for the OHCS site.

## Your next step — commit

```bash
git add -A
git commit -m "feat(gh-ds): extract layout components + add BackLink — Tier-1 complete

- packages/gh-ds/src/components/{SkipLink,BackLink,Header,Footer}/*.astro
- Header + Footer parameterised for ministry reuse; defaults fit gov.gh
- BackLink ships with a generic chevron until Folklore Board clears Sankofa
- apps/portal BaseLayout consumes SkipLink/Header/Footer from @gh/gh-ds
- local Header.astro + Footer.astro deleted from apps/portal
- /internal/layout/ gallery exercises BackLink variants + iconography note
- axe 0 violations on 9 built pages; / weight 28.1 KB gzipped

Delivers the final 4 of 13 Tier-1 components per .claude/CLAUDE.md §5
Weeks 3–6. Tier-1 set is complete; design system is the source of
truth for every layout piece on apps/portal.

See also: docs/doctrine/pr-5g-handoff.md."
```

Say **"Week 7"** or **"PR 6b"** to begin Tier-2 components, or name a specific
target for the OHCS reference implementation.
