# PR 6b.2 — Handoff & verification

`feat(gh-ds): ship Pagination + Accordion` — green locally against every
`.claude/CLAUDE.md §5` DoD clause.

## Measured DoD

| DoD clause                               | Evidence                                                              |
| ---------------------------------------- | --------------------------------------------------------------------- |
| Two more Tier-2 components               | `Pagination.astro`; `Accordion.astro` + `AccordionItem.astro`         |
| axe-core zero blocking violations        | 12 dist pages scanned, 0 violations on each                           |
| Consumed from apps/portal                | `/internal/pagination/` (6 sections) + `/internal/accordion/` (3)     |
| EN + Twi fixtures                        | "Akyi/Anim" Pagination + "Adwuma no bere…" Accordion                  |
| Progressive enhancement                  | Pagination = native anchors; Accordion = native `<details>/<summary>` |
| Ellipsis behaviour for large page counts | First, last, current±1 shown; gaps filled with ellipsis (aria-hidden) |
| 44 px touch target                       | Both components — Pagination links and Accordion summaries            |
| `/` weight still < 80 KB gzipped         | **28.1 KB unchanged**                                                 |

## Five-gate pipeline

```
pnpm typecheck   → 20/20 ✓  exit 0
pnpm lint        → 20/20 ✓  exit 0
pnpm test        → 21 successful (18 contrast + axe sweep of 12 dist pages)
pnpm build       → 20/20 ✓  exit 0
pnpm format:check → All matched files use Prettier code style ✓
```

## What shipped

- **`packages/gh-ds/src/components/Pagination/Pagination.astro`** — numeric
  pagination with Previous/Next. Ellipsis (`…`) hides pages far from `current`
  when `total > 7`. Props: `current`, `total`, `baseUrl`, `previousLabel`,
  `nextLabel`, `ariaLabel`. Clamps `current` and `total` defensively to guard
  against bad server data. Previous/Next disappear at page boundaries — never
  render as disabled links (WCAG 2.4.4).
- **`packages/gh-ds/src/components/Accordion/Accordion.astro`** — slot wrapper
  for one or more `AccordionItem`s.
- **`packages/gh-ds/src/components/Accordion/AccordionItem.astro`** — a single
  expandable section built on `<details>` + `<summary>`. Native keyboard, touch,
  and screen-reader behaviour — no ARIA kludges, no JavaScript. Chevron rotates
  via CSS; respects `prefers-reduced-motion`. Props: `heading` (string,
  required), `id`, `open`, `class`.
- **`packages/gh-ds/package.json`** — three new exports (`@gh/gh-ds/Pagination`,
  `@gh/gh-ds/Accordion`, `@gh/gh-ds/AccordionItem`).
- **`apps/portal/src/pages/internal/pagination.astro`** — gallery with six
  scenarios: few pages, middle of range, first-page, last-page, single page, Twi
  labels.
- **`apps/portal/src/pages/internal/accordion.astro`** — gallery with the
  passport-renewal FAQ (4 items, one preopened), a single-item "read more"
  pattern, and a Twi fixture.

## Axe catch (again) — unique landmark names

Second `landmark-unique` violation in two PRs — six
`<nav aria-label="Pagination">` on one page collided. Fixed by passing a
distinct `ariaLabel` per instance in the gallery, and adding the same
"multiple-on-one-page" warning to the Pagination docstring that
NotificationBanner already carries. Pattern to remember for future
landmark-bearing components.

## Design-system state after PR 6b.2

- ✅ 13 Tier-1 components
- ✅ 5 Tier-2 components (Breadcrumb, Card, NotificationBanner, Pagination,
  Accordion)
- ⬜ 2 remaining Tier-2: Responsive table, Tabs
- ⬜ 6 Tier-3

**18 of 25 GH-DS components shipped.**

## Your next step — commit

```bash
git add -A
git commit -m "feat(gh-ds): ship Pagination + Accordion

- packages/gh-ds/src/components/Pagination/Pagination.astro with ellipsis
- packages/gh-ds/src/components/Accordion/{Accordion,AccordionItem}.astro
- Accordion uses native <details>/<summary> — no JavaScript
- Pagination defensively clamps current+total; disappears prev/next at edges
- exports all three via package.json exports map
- apps/portal /internal/pagination/ + /internal/accordion/ galleries
- axe 0 violations on 12 built pages; / weight unchanged at 28.1 KB

Delivers 2 more of 7 Tier-2 components per .claude/CLAUDE.md §5.
See also: docs/doctrine/pr-6b-2-handoff.md."
```

## Next PR options

Remaining Tier-2: **Responsive table**, **Tabs**.

**6b.3 — Responsive table + Tabs.** The last two Tier-2 components. Tabs is the
only remaining piece that benefits from a small JavaScript island (keyboard
arrow-nav + `aria-selected` toggling). Responsive table wraps `<table>` with a
horizontal-scroll pattern and a caption contract.

**6a — Keystatic content collections** — CMS wiring. Unlocks Week 7 OHCS
reference implementation.

**6c — `apps/ministries/` scaffold** — first ministry-site structure.

Recommendation: **6b.3** to close Tier-2, then **6a** to open Week 7. After
6b.3, 20 of 25 GH-DS components are shipped and every content-page pattern is
unblocked.

Say "PR 6b.3" to proceed.
