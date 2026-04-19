# PR 7a — Handoff & verification

`feat(gh-ds): ship the service-flow triplet — StepIndicator + SummaryList + ConfirmationPanel`
— green locally against every `.claude/CLAUDE.md §5` DoD clause.

## Measured DoD

| DoD clause                                         | Evidence                                                                |
| -------------------------------------------------- | ----------------------------------------------------------------------- |
| Three Tier-3 components in `packages/gh-ds`        | `StepIndicator`, `SummaryList`, `ConfirmationPanel`                     |
| axe-core zero blocking violations                  | 15 dist pages scanned, 0 on each                                        |
| Consumed from apps/portal                          | `/internal/service-flow/` — 4 sections cover all three components       |
| EN + Twi fixtures                                  | "Adwuma no dwumadie" steps + "Sesa" change actions + "Wo adwuma no akɔ" |
| StepIndicator statuses                             | completed (linked back), current (aria-current="step"), upcoming        |
| SummaryList SR-correct change actions              | Visually-hidden suffix gives "Change full name" not just "Change"       |
| ConfirmationPanel uses `role="status"` not `alert` | Good news, not urgency — rationale in component frontmatter             |
| Progressive enhancement                            | No JavaScript; native anchor + list + dl/dt/dd semantics                |
| `/` weight still < 80 KB gzipped                   | **28.1 KB unchanged** (service-flow components do not load on `/`)      |

## Five-gate pipeline

```
pnpm typecheck   → 20/20 ✓  exit 0
pnpm lint        → 20/20 ✓  exit 0
pnpm test        → 21 successful (18 contrast + axe sweep of 15 dist pages)
pnpm build       → 20/20 ✓  exit 0
pnpm format:check → All matched files use Prettier code style ✓
```

## What shipped

- **`packages/gh-ds/src/components/StepIndicator/StepIndicator.astro`** —
  `<nav>` + `<ol>` progress indicator. Steps have status (`completed` /
  `current` / `upcoming`); completed steps optionally link back via `href`.
  Numeric badges styled per status. Current step carries `aria-current="step"`.
  Landmark warning documented in the frontmatter (pattern from
  NotificationBanner / Pagination).
- **`packages/gh-ds/src/components/SummaryList/SummaryList.astro`** — `<dl>`
  with per-row `<dt>` / `<dd>` / change-action `<dd>`. Action links include a
  visually-hidden suffix so screen readers announce full context ("Change full
  name") rather than a generic "Change". Stacks on narrow viewports.
- **`packages/gh-ds/src/components/ConfirmationPanel/ConfirmationPanel.astro`**
  — bright green success banner with a prominent monospace reference number.
  `role="status"` announces to SR without the urgency implied by `role="alert"`.
  Page authors render their own "What happens next" heading and copy after the
  component.
- **`packages/gh-ds/package.json`** — three new exports.
- **`apps/portal/src/pages/internal/service-flow.astro`** — gallery with four
  sections demonstrating step progression, an "accept and send" summary list, a
  confirmation panel with follow-up copy, and a full Twi-fixture flow.

## Third axe catch of the Tier-2/3 sprint — same class

Same `landmark-unique` story. Two StepIndicators on one page collided on the
default "Progress" label. Pattern now firmly established:

> Every landmark-bearing component (`<nav>`, `<aside>`, explicit
> `role="region|alert|status"`) must accept a `label` / `ariaLabel` / `id` prop,
> include a "Multiple on one page" note in its frontmatter, and gallery pages
> must pass unique values. StepIndicator, Pagination, and NotificationBanner all
> carry the note now. SummaryList and ConfirmationPanel do not have this concern
> (no landmarks).

Carry-forward: a future housekeeping PR should audit the three existing
components (NotificationBanner, Pagination, StepIndicator) and either (a) remove
the default labels so authors must provide one, or (b) adopt an auto-ID scheme.
For now, the docstring warning is the forcing function.

## Design-system state after PR 7a

- ✅ 13 Tier-1 components
- ✅ 7 Tier-2 components
- ✅ 3 of 6 Tier-3 components (PR 7a)
- ⬜ 3 Tier-3 remaining — Search, Cookie banner, Most-requested band

**23 of 25 GH-DS components shipped.**

## Your next step — commit

```bash
git add -A
git commit -m "feat(gh-ds): ship service-flow triplet — StepIndicator + SummaryList + ConfirmationPanel

- packages/gh-ds/src/components/StepIndicator/StepIndicator.astro
- packages/gh-ds/src/components/SummaryList/SummaryList.astro
- packages/gh-ds/src/components/ConfirmationPanel/ConfirmationPanel.astro
- aria-current=step on the current step; completed steps link back
- summary-list change actions include hidden text for SR context
- confirmation panel uses role=status (not alert) — good news not urgency
- exports all three via package.json exports map
- apps/portal /internal/service-flow/ gallery with Twi fixture
- axe 0 violations on 15 built pages; / weight unchanged at 28.1 KB

Delivers 3 of 6 Tier-3 components per .claude/CLAUDE.md §5.
See also: docs/doctrine/pr-7a-handoff.md."
```

## Next PR — closes the design system

**PR 7b — Search + Cookie banner + Most-requested band.** The final three Tier-3
components. Search + Most-requested band are already partially inline in
`apps/portal/src/pages/index.astro` — this PR extracts + formalises them and
adds CookieBanner.

Cookie banner has a small nuance: without JavaScript, a persistent "accept /
reject" choice needs server-side cookie-setting. For the Phase-1 static-first
posture, two approaches:

1. Ship CookieBanner as SSR-rendered banner + a tiny `<script type="module">`
   island that sets a cookie and hides itself — the enhancement path. Without
   JS, the banner stays visible on every page; users still see the disclosure.
2. Ship only the banner markup and add the JS enhancement later when Cloudflare
   Workers or Pages Functions can set the cookie.

I'll go with (2) for PR 7b so the PR stays static-only — the banner's purpose
(disclosure) is fulfilled by visibility alone.

After PR 7b, the design system closes at **25/25 components**, and Week 3–6 is
fully complete. The next milestone becomes `.claude/CLAUDE.md §5` Weeks 7–10
(OHCS reference implementation).

Say "PR 7b" to proceed.
