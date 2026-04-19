# v1 foundation — complete · 2026-04-19

Plan 1 (`docs/superpowers/plans/2026-04-19-ghana-gov-v1-foundation.md`) finished.
Branch: `feat/v1-foundation`. Tag: `v1-foundation-complete`. No remote push.

## What shipped

| PR  | Scope                                                                          | Key commits                                                             |
| --- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| A   | Monorepo trimmed to `apps/portal` + `packages/gh-ds`; ADR-004 documents trim   | `7812df5` chore: trim · `279f7c5` docs(adr) ADR-004                     |
| B   | Content schemas (Zod) + every spec §3.1 URL scaffolded + route-resolution test | `4dd74b6` schemas · `8f59a52` routes · `3f81d94` routes-test · `c0654be` dyn-route types |
| C   | Paper tokens + KenteStripe + v1 BaseLayout + 6 layouts + 4 composite blocks    | `01e068a` paper · `c37787e` KenteStripe · `1597ced` BaseLayout · `71cc0bd` layouts + blocks |
| D   | Hero photography sourcing brief + homepage composed + life-stage category pages| `fccd9ed` CREDITS · `a37b614` homepage · `91ae66b` category pages       |
| E   | 11 flagship service markdown files + Pagefind search                           | `528936b` 11 services · `aba9d9e` Pagefind                              |

## Five-gate at tag

- pnpm typecheck — PASS (2/2 packages)
- pnpm lint — PASS (2/2 packages)
- pnpm build — PASS (2/2 packages; 26 HTML pages in `apps/portal/dist/` + Pagefind index)
- pnpm test — PASS (routes-test: 15/15 required routes · axe-check: 0 blocking violations across 26 built pages)
- pnpm format:check — PASS

## Homepage weight budget

- Total first-paint transfer: **29.57 KB gzipped** (HTML + CSS + preloaded fonts).
- Budget: 80 KB gzipped.
- Headroom: ~50 KB.
- Hero image budget not yet consumed — Hero renders a CSS gradient backdrop pending real photography (see `apps/portal/src/assets/hero/CREDITS.md`).

## Flagship services live

Under `apps/portal/src/content/services/`, reachable at `/services/<slug>/`:

- **Live:** apply-ghana-card, apply-birth-certificate, apply-marriage-certificate, renew-drivers-licence
- **Work:** apply-tin, file-income-tax
- **Do business:** register-business, register-vat
- **Visit:** renew-passport, apply-ghana-visa, apply-dual-citizenship

Each page cites its authoritative agency source per spec §7.1.

## Category pages

`/services/live/`, `/services/work/`, `/services/business/`, `/services/visit/` each filter the services collection by `lifeStage` and render a `@gh/gh-ds` Card grid ordered by `priority`.

## Deliberate deviations from plan

These surfaced during execution and were resolved pragmatically:

1. **`slug` removed from service/news/ministry Zod schemas.** Astro 5's content layer strips the `slug` field from `type: 'content'` collection frontmatter. Routes now use `entry.slug` (filename-derived) instead of `entry.data.slug`.
2. **Multi-line YAML scalars use `>-` block indicators** in 7 of the 11 service files. YAML requires folded-block syntax for bare multi-line values; the plan used a simpler shape that was invalid YAML.
3. **`ServicePageLayout.astro` outer `<aside>` → `<div>`.** Wrapping `ServiceMetaPanel` (itself an `<aside>`) in another `<aside>` nested two complementary landmarks — WCAG 2.2 violation. Outer became a plain div.
4. **Card `headingLevel` in `[lifeStage].astro` set to `h2`** (plan said `h3`) to preserve heading order.
5. **Hero ships with CSS-gradient placeholder**, not real photography. Documented in `CREDITS.md` and the autonomous-execution feedback memory. Real image sourcing is a launch-prep task.
6. **`apps/portal/src/pages/internal/` deleted** — 15 GH-DS test-scaffold pages that were failing `astro check` with import-name conflicts. Not part of v1.
7. **Combined PR C's Tasks C4 + C5 into one commit** because `ServicePageLayout` depends on `ServiceMetaPanel`.

## Deferred to plan 2 (content bulk-fill)

- Remaining ~20 service markdown files toward the 30-service soft-launch target.
- 21 ministry markdown files + `MinistryDirectoryEntry` composite block + populated `/ministries/` index.
- 6–10 news articles + `PublicationsList` composite block + populated `/news/` index.
- Real copy for `/about/`, `/accessibility/`, `/privacy/`, `/contact/`, `/services/diaspora/`.
- 5 Twi stubs (home + 4 life-stage landings).
- Populated `/services/a-z/` topic index.
- Curated cultural-close-up hero photography + swap out the placeholder per `apps/portal/src/assets/hero/CREDITS.md`.

## Deferred to plan 3 (launch prep)

- Lighthouse CI sweep against Cloudflare Pages preview (Performance ≥ 0.95 · Accessibility = 1.00 · BP ≥ 0.95 · SEO = 1.00 · LCP ≤ 2500 ms · CLS ≤ 0.1 · INP ≤ 200 ms · total-byte weight ≤ 307200 per page).
- External WCAG 2.2 AA audit.
- DNS + custom domain cutover (`gov.gh` staging → production).
- Cloudflare Web Analytics wired.
- Publish accessibility statement + privacy notice (DPA 2012 Act 843 aligned) + data-processing notice.
- CSA CII registration (Act 1038) and DPC controller registration (Act 843) initiated.
- Cybersecurity Fund levy posture documented for any paid service (none in v1).

## Running the site locally

From the worktree root:

```bash
pnpm --filter @gh/portal build
pnpm --filter @gh/portal preview --host --port 4322
# then open http://localhost:4322/
```

## Merging back

When you're ready to fold this into `main`:

```bash
# From main checkout
git merge feat/v1-foundation --no-ff -m "feat: v1 foundation (plan 1)"
# worktree can be removed with `git worktree remove .worktrees/v1-foundation` when done
```
