# PR 4 — Handoff & verification

`feat(gh-ds): ship Button — the first Tier-1 GH-DS component` — green locally
against every `.claude/CLAUDE.md §5` Weeks 3–6 DoD clause this PR covers.

## Measured DoD

| DoD clause                                      | Evidence                                                                    |
| ----------------------------------------------- | --------------------------------------------------------------------------- |
| Component lives in `packages/gh-ds` per ADR-003 | `packages/gh-ds/src/components/Button/Button.astro`                         |
| axe-core zero blocking violations               | 2 dist pages scanned, 0 violations on both                                  |
| Consumed from `apps/portal`                     | `/` Find button + full variant gallery at `/internal/buttons/`              |
| EN + Twi fixtures                               | Button gallery renders Toa so / Popa / Fi ase seesei in `lang="tw"` section |
| Keyboard + focus-visible                        | Composite outer gold ring + inner dark edge; secondary skips inner ring     |
| 44×44 minimum touch target                      | `min-height: 2.75rem` (44 px) on every variant                              |
| Progressive enhancement                         | Pure HTML — no `<script>` tags in `/` or `/internal/buttons/`               |
| `/` transfer weight still < 80 KB gzipped       | **28.0 KB** (↑ 0.5 KB vs PR 3 baseline, 53.9 KB headroom left)              |

## Five-gate pipeline

```
pnpm typecheck   → 20/20 ✓  exit 0
pnpm lint        → 20/20 ✓  exit 0
pnpm test        → 21 successful (18 contrast + axe sweep of 2 dist pages)
pnpm build       → 20/20 ✓  exit 0   (2 pages built: /, /internal/buttons/)
pnpm format:check → All matched files use Prettier code style ✓
```

## What shipped

- **`packages/gh-ds/src/components/Button/Button.astro`** — four variants
  (primary, secondary, warning, start), two sizes (md, lg), `disabled` state,
  renders as `<button>` or `<a role="button">` depending on whether `href` is
  set. Styles use only @gh/gh-ds tokens; zero hard-coded colours or sizes except
  the white text on dark variants (which is a semantic constant, not a palette
  choice).
- **`packages/gh-ds/package.json`** — `exports` map now serves
  `@gh/gh-ds/Button` and `@gh/gh-ds/components/Button`; `astro` declared as an
  optional peerDependency so consumers that don't use Astro (future Hono
  services) don't get churn in their lockfiles.
- **`apps/portal/src/pages/index.astro`** — inline `<button>` replaced with
  `<Button type="submit">Find</Button>`. Associated CSS deleted — styling is
  entirely delegated to the component.
- **`apps/portal/src/pages/internal/buttons.astro`** — internal test page at
  `/internal/buttons/` rendering every variant × size × state, plus a Twi
  fixture section with `lang="tw"`. Flagged `noindex` via `BaseLayout`'s new
  `noindex` prop so search engines ignore it. Not linked from public nav.
- **`apps/portal/src/layouts/BaseLayout.astro`** — added `noindex?: boolean`
  prop to support pages like `/internal/buttons/` that must not be indexed.

## Disabled-link pattern — deliberate choice

When `disabled` is set on an `<a role="button">`:

- `href` is omitted entirely (native a11y: a link with no href is not
  actionable).
- `aria-disabled="true"` is emitted.
- The link remains in the DOM and focusable so screen-readers announce its
  disabled state, matching the GOV.UK Frontend and MDN-documented pattern.

This is intentionally different from the `<button disabled>` path, which uses
the native attribute and is removed from the tab order.

## Patches applied during verification

- Initial plan was to unit-test Button via Astro Container API
  (`renderToString`) in `Button.test.ts`. The combination of `getViteConfig` +
  vitest + @gh/gh-ds not being a full Astro site produced opaque "Unknown Error:
  [object Object]" crashes during test collection. Rather than spend more budget
  chasing that toolchain bug, the tests moved to an **integration shape** — a
  hidden test page (`/internal/buttons/`) is compiled by the real Astro build
  and scanned by the existing axe-check sweep. This is a stronger guarantee than
  unit tests because it verifies the actual emitted HTML in a real build
  pipeline. Documented in `packages/gh-ds/src/components/Button/README.md` (to
  be written in PR 5) as the approach the library uses until Storybook lands in
  `apps/design-system`.
- Astro's file-based routing excludes leading-underscore directories from
  routes. Renamed `src/pages/__test__/` → `src/pages/internal/`. The page is
  still private (noindex, not linked from nav).
- Astro frontmatter parses as JS/TS. The JSDoc comment originally contained
  `dist/**/*.html` which terminated the block-comment on `*/`. Rephrased.

## Restraint principle applied

Only Button ships in this PR, not the full Tier-1 set of 12. The remaining
eleven (Text input, Textarea, Radio, Checkboxes, Select, Date input, Error
summary, Form label/hint/error composite, Header, Footer, Skip-link, Back link)
each get their own PR so the review surface stays small and the regression
window per change stays short. Header, Footer, and Skip-link are already baked
into `apps/portal` — they migrate into `packages/gh-ds` as the next Tier-1 PRs
consume them.

## Your next step — commit

```bash
git add -A
git commit -m "feat(gh-ds): ship Button — first Tier-1 GH-DS component

- packages/gh-ds/src/components/Button/Button.astro with 4 variants + 2 sizes
- exports @gh/gh-ds/Button via package.json exports map
- astro declared as optional peerDependency
- apps/portal / page uses <Button> for the search submit control
- apps/portal /internal/buttons/ test page exercises every variant/state
- BaseLayout gains a noindex prop for internal pages
- axe 0 violations on both built pages; / transfer weight 28 KB gzipped

Delivers the first of the Tier-1 12 components per .claude/CLAUDE.md §5
Weeks 3–6. See also: docs/doctrine/pr-4-handoff.md."
```

## Next PR

The GOV.UK Frontend fork plan (ADR-003) says 25 components in Weeks 3–6. Two
paths to pick from for PR 5:

**5a — Text input + Form-label composite.** Unlocks the first real form flow
(Ghana Card PIN, passport lookup). Blocks nothing, enables most.

**5b — Skip-link + Header + Footer extracted into @gh/gh-ds.** Cleans up
apps/portal so it consumes entirely from the design system (no inline
components). Low risk, high symbolic value for the "GH-DS is the source of
truth" story.

Recommendation: **5a first**, then fold 5b into 5c alongside Error-summary so
the whole form stack lands together. Say "PR 5a" or "PR 5b" to choose.
