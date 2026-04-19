# PR 6b — Handoff & verification

`feat(gh-ds): ship Tier-2 content starter pack — Breadcrumb + Card + NotificationBanner`
— green locally against every `.claude/CLAUDE.md §5` DoD clause.

## Measured DoD

| DoD clause                                  | Evidence                                                        |
| ------------------------------------------- | --------------------------------------------------------------- |
| Three Tier-2 components in `packages/gh-ds` | Breadcrumb, Card, NotificationBanner                            |
| axe-core zero blocking violations           | 10 dist pages scanned, 0 on each                                |
| Consumed from apps/portal                   | Gallery at `/internal/content/` — 3 sections + Twi fixture      |
| EN + Twi fixtures                           | "Yɛreyɛ ho adwuma" banner + "Ghana Card" card in `lang="tw"`    |
| Progressive enhancement                     | No JavaScript anywhere in the dist                              |
| Entire-card-clickable via single `<a>`      | Card `href` mode uses pseudo-element overlay; no JS             |
| `role="alert"` only where warranted         | Info banner = `role="region"`; success/warning = `role="alert"` |
| `/` weight still < 80 KB gzipped            | **28.1 KB unchanged** (new components do not load on `/`)       |

## Five-gate pipeline

```
pnpm typecheck   → 20/20 ✓  exit 0
pnpm lint        → 20/20 ✓  exit 0
pnpm test        → 21 successful (18 contrast + axe sweep of 10 dist pages)
pnpm build       → 20/20 ✓  exit 0
pnpm format:check → All matched files use Prettier code style ✓
```

## What shipped

- **`packages/gh-ds/src/components/Breadcrumb/Breadcrumb.astro`** — wrapped in
  `<nav aria-label="Breadcrumb">`, ordered list of ancestor links, last item is
  `aria-current="page"` and non-linked. Chevron separators are `aria-hidden`.
  Wraps on narrow viewports instead of truncating (cheap phones with small
  screens should not lose hierarchy).
- **`packages/gh-ds/src/components/Card/Card.astro`** — a bordered container
  with a configurable heading level (`h2` default) and a body slot. When `href`
  is set, the whole card becomes clickable via a pseudo-element overlay on the
  single internal `<a>` — no JavaScript. `description` prop for the short
  one-line blurb pattern.
- **`packages/gh-ds/src/components/NotificationBanner/NotificationBanner.astro`**
  — three types (`info` / `success` / `warning`) map to coloured edges and ARIA
  roles. `info` is `role="region"`; the other two are `role="alert"` so
  assistive tech announces on mount. `tabindex="-1"` for future JS focus
  enhancement. Each instance needs a unique `id` when multiple banners render on
  one page (documented in the component frontmatter).
- **`packages/gh-ds/package.json`** — three new exports.
- **`apps/portal/src/pages/internal/content.astro`** — gallery at
  `/internal/content/`: three banners, four cards (including the
  entire-card-clickable pattern), a breadcrumb at page top, and a Twi fixture
  section.

## Axe catch — unique landmark names

First violation in six PRs: all three banners defaulted to
`id="notification-banner"`, so their `aria-labelledby` targets collided and
`axe` flagged `landmark-unique`. Fix: pass explicit `id` to every banner on the
page. Component docstring updated so future authors see this at the top.

## Design-system state after PR 6b

- ✅ 13 Tier-1 components (PRs 4, 5a–5g)
- ✅ 3 Tier-2 content components (PR 6b)
- ⬜ 4 remaining Tier-2: Pagination, Accordion, Tabs, Responsive table
- ⬜ 6 Tier-3: Step indicator, Summary list, Confirmation template, Search,
  Cookie banner, Most-requested band

**16 of 25 GH-DS components shipped.** Every content page in Weeks 7–10 can now
render hierarchy (Breadcrumb), content blocks (Card), and status messages
(NotificationBanner) from the design system.

## Your next step — commit

```bash
git add -A
git commit -m "feat(gh-ds): ship Tier-2 content starter pack — Breadcrumb + Card + NotificationBanner

- packages/gh-ds/src/components/Breadcrumb/Breadcrumb.astro
- packages/gh-ds/src/components/Card/Card.astro
- packages/gh-ds/src/components/NotificationBanner/NotificationBanner.astro
- entire-card-clickable via single <a> + pseudo-element overlay (no JS)
- 3 banner types mapping to role=region|alert (info vs success/warning)
- apps/portal /internal/content/ gallery with Twi fixture
- axe 0 violations on 10 built pages; / weight unchanged at 28.1 KB

Delivers the first 3 of 7 Tier-2 components per .claude/CLAUDE.md §5.
See also: docs/doctrine/pr-6b-handoff.md."
```

## Next PR options

Remaining Tier-2 (4): **Pagination**, **Accordion**, **Tabs**, **Responsive
table**.

**6b.2 — Pagination + Accordion** — paired. Pagination unblocks news and
publication lists; Accordion unblocks FAQ pages. Both have compact DOM surfaces
and clear ARIA contracts.

**6b.3 — Tabs + Responsive table** — paired. Tabs is the most complex remaining
Tier-2 (needs keyboard arrow-navigation and `aria-selected` wiring — the one
piece in Tier-2 that benefits from a small JS island). Responsive table needs
the mobile-scroll pattern plus a caption contract.

**6a — Keystatic content collections** — shift to CMS wiring while the remaining
four Tier-2 pieces queue up.

Recommendation: **6b.2 (Pagination + Accordion)** first — both are used on any
content-heavy page, and both are pure-HTML progressive-enhancement friendly.
Tabs/Responsive table can follow in 6b.3, then 6a opens Week 7.

Say "PR 6b.2" to proceed.
