# PR 6b.3 — Handoff & verification · **Tier-2 complete**

`feat(gh-ds): ship Table + Tabs — Tier-2 complete` — green locally against every
`.claude/CLAUDE.md §5` DoD clause.

## Measured DoD

| DoD clause                                            | Evidence                                                         |
| ----------------------------------------------------- | ---------------------------------------------------------------- |
| Two final Tier-2 components                           | `Table.astro` + `Tabs.astro`                                     |
| axe-core zero blocking violations                     | 14 dist pages scanned, 0 violations on each                      |
| Consumed from apps/portal                             | `/internal/table/` (3 sections) + `/internal/tabs/` (2)          |
| EN + Twi fixtures                                     | "Passport ho akatua" Table + "Passport ho nsɛm" Tabs             |
| `<caption>` required on every Table                   | Prop is `string` (not optional) — TypeScript enforces            |
| Horizontal scroll for wide tables on narrow viewports | `.gh-table-scroll` wrapper with `tabindex="0"` + `role="region"` |
| Tabs ships progressive-enhancement baseline           | No JavaScript; nav of jump-links over stacked sections           |
| Tabs docstring flags missing ARIA-tablist enhancement | v1 hide/show enhancement noted as future PR                      |
| `/` weight still < 80 KB gzipped                      | **28.1 KB unchanged**                                            |

## Five-gate pipeline

```
pnpm typecheck   → 20/20 ✓  exit 0
pnpm lint        → 20/20 ✓  exit 0
pnpm test        → 21 successful (18 contrast + axe sweep of 14 dist pages)
pnpm build       → 20/20 ✓  exit 0
pnpm format:check → All matched files use Prettier code style ✓
```

## What shipped

- **`packages/gh-ds/src/components/Table/Table.astro`** — semantic HTML table
  with required `<caption>`, optional `captionHidden` flag, and a
  `<div class="gh-table-scroll" tabindex="0" role="region">` wrapper that
  handles horizontal overflow on narrow viewports. Keyboard users can pan
  because the scroll region is focusable; screen readers are referred to the
  caption via `aria-labelledby`. Numeric columns get right-alignment and
  tabular-num via the `.gh-table__cell--numeric` utility class. Author supplies
  `<thead>`, `<tbody>`, `<tr>`, `<th>`, and `<td>` as slotted children — no
  array-based data API in v0 (keeps the component flexible).
- **`packages/gh-ds/src/components/Tabs/Tabs.astro`** — jump-link nav over
  stacked `<section>`s. No JavaScript. Named "Tabs" to match the Tier-2 spec +
  authoring mental model, but the v0 implementation is deliberately
  section-navigation rather than an ARIA-tablist widget. The docstring flags
  this explicitly and documents the future enhancement path.
- **`packages/gh-ds/package.json`** — two new exports.
- **`apps/portal/src/pages/internal/table.astro`** — gallery with three
  sections: passport fees (numeric-aligned), services by region (`scope="row"` +
  `scope="col"` mix), Twi fixture.
- **`apps/portal/src/pages/internal/tabs.astro`** — gallery with passport
  services (3 tabs) and a Twi fixture (2 tabs).

## Deliberate Tabs trade-off

GOV.UK Frontend's Tabs ships both a no-JS fallback (section list + jump links)
and a JS enhancement (tablist with hidden panels). We ship only the no-JS
fallback for v0 because:

1. **§1 progressive-enhancement** is non-negotiable. The no-JS version is the
   canonical fallback regardless of whether a JS enhancement exists.
2. **ARIA tablist patterns have subtle bugs** across assistive-tech pairings
   (JAWS + IE, NVDA + Firefox, VoiceOver + Safari each behave differently).
   Shipping the robust baseline first avoids class-wide regressions.
3. **Current use cases don't need it.** Every Phase-1 planned service page can
   show stacked sections with a jump-link toc. If a specific later page benefits
   from panel-hiding (e.g. 15-tab dense admin UI), we will enhance then.

v1 of Tabs will add an inline `<script>` that:

- Progressively enhances `<nav>` into `role="tablist"`
- Attaches `role="tab"` + `aria-selected` + `tabindex` management
- Hides non-selected panels with CSS class applied from JS
- Handles Left/Right arrow-key navigation
- Leaves the no-JS rendering intact as the fallback (hides via
  `@media (scripting: enabled)` — or just by adding a class to `<html>` and
  using a `.gh-tabs__panels > section[hidden]` selector)

## Design-system state after PR 6b.3

### Tier-2 complete (7 of 7)

- ✅ Breadcrumb (PR 6b)
- ✅ Card (PR 6b)
- ✅ Notification banner (PR 6b)
- ✅ Pagination (PR 6b.2)
- ✅ Accordion (PR 6b.2)
- ✅ Responsive table (PR 6b.3)
- ✅ Tabs (PR 6b.3)

### Overall: 20 of 25 GH-DS components shipped

Tier-3 queue (6 remaining):

- Step indicator
- Summary list / check-your-answers
- Confirmation template
- Search
- Cookie banner
- Most-requested band

## Your next step — commit

```bash
git add -A
git commit -m "feat(gh-ds): ship Table + Tabs — Tier-2 complete

- packages/gh-ds/src/components/Table/Table.astro — required caption +
  horizontal-scroll wrapper with focusable role=region
- packages/gh-ds/src/components/Tabs/Tabs.astro — progressive-enhancement
  baseline (jump-link nav over stacked sections, no JS)
- apps/portal /internal/table/ + /internal/tabs/ galleries with Twi fixtures
- axe 0 violations on 14 built pages; / weight unchanged at 28.1 KB

Closes Tier-2 per .claude/CLAUDE.md §5 Weeks 3–6. Overall 20 of 25
components shipped. See also: docs/doctrine/pr-6b-3-handoff.md."
```

## Next phase — Week 7 begins

Tier-2 is closed. The roadmap now opens to `.claude/CLAUDE.md §5` Weeks 7–10:
**OHCS reference implementation**.

**6a — Keystatic + Astro content collections.** CMS wiring. Schema for ministry
pages. First page (OHCS `About`) in Keystatic.

**6c — `apps/ministries/` scaffold.** First ministry-site skeleton as its own
Astro app, consuming `@gh/gh-ds` wholesale.

**7a — Tier-3 catchup.** Ship the six remaining Tier-3 components before OHCS
pages are authored. Two of them (Search, Most-requested band) are already
partially implemented inline in `apps/portal/src/pages/index.astro` and should
move to `@gh/gh-ds`. The other four (Step indicator, Summary list, Confirmation
template, Cookie banner) are new. Unblocks service-flow pages.

Recommendation: **7a (Tier-3 catchup)** first — closes the design system
entirely, then **6a** wires the CMS, then **6c** builds OHCS on top. Clean
sequence, everything the OHCS pages will consume is in place before authoring
starts.

Say "PR 7a" to proceed, or propose another target.
