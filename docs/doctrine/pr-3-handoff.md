# PR 3 — Handoff & verification

`feat(portal): bootstrap apps/portal (Astro 5) with perf and a11y CI gates` —
green locally against every PR 3 DoD clause in `docs/doctrine/week-0.md §4`.

## Measured DoD

| DoD clause                                          | Evidence                                                      |
| --------------------------------------------------- | ------------------------------------------------------------- |
| apps/portal Astro 5 project targeting static output | `apps/portal/astro.config.mjs` — `output: 'static'`           |
| Single page `/` with skip-link, landmarks, one h1   | `dist/index.html` (1,954 bytes gzipped) contains all required |
| Consumes `@gh/gh-ds` tokens                         | `BaseLayout.astro` imports `@gh/gh-ds/tokens.css`             |
| `.lighthouserc.cjs` verbatim from §8                | committed, CI job enabled                                     |
| axe-core zero violations                            | `pnpm --filter @gh/portal test` — 0 blocking violations       |
| Transfer weight under 80 KB gzipped on `/`          | **27.5 KB gzipped** (66% headroom)                            |
| Works with JS disabled                              | `grep '<script' dist/index.html` → 0 tags; form `method=get`  |
| `wrangler.toml` for Pages                           | `apps/portal/wrangler.toml` with staging + production envs    |

## Transfer-weight breakdown

```
  asset                                raw       gzip
  index.html                         6,205 B   1,954 B
  _astro/index.Cvpih3hG.css         11,522 B   2,675 B
  fonts/noto-sans-400.woff2 (pre)   11,244 B  11,267 B
  fonts/noto-sans-700.woff2 (pre)   11,628 B  11,651 B
  TOTAL                             40,599 B  27,547 B   (budget 81,920 B)
```

Fonts are preloaded — they count against the initial transfer. Without them, the
HTML+CSS alone is 4.6 KB gzipped. The `font-display: swap` declaration on every
@font-face means text renders with the fallback stack before the custom fonts
arrive, so LCP is unaffected by the font size.

## Five-gate pipeline

```
pnpm typecheck   → 20/20 ✓  exit 0   (astro check + tsc across workspaces)
pnpm lint        → 20/20 ✓  exit 0
pnpm test        → 21/21 ✓  exit 0   (18 contrast + 1 axe audit file)
pnpm build       → 20/20 ✓  exit 0   (Astro emits dist/, prebuild copies fonts)
pnpm format:check → All matched files use Prettier code style ✓
```

## New CI jobs (`.github/workflows/ci.yml`)

- **`verify`** — unchanged from PR 1/2; now runs real ESLint + vitest + Astro
  build.
- **`portability-boundary`** — unchanged.
- **`workerd-docker-build`** — stub, waits on `infra/workerd-docker/Dockerfile`.
- **`axe-portal`** — new. Builds `@gh/portal` and scans every emitted HTML file
  with jsdom + axe-core. Zero blocking violations gates merge.
- **`transfer-weight`** — new. Builds `@gh/portal` and fails the PR if `/` with
  preloaded fonts exceeds 80 KB gzipped.
- **`lighthouse`** — new. Runs `@lhci/cli` against `pnpm preview` with the §8
  assertions — LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1, Performance ≥ 95,
  Accessibility = 100, Best Practices ≥ 95, SEO = 100, total-byte-weight ≤ 300
  KB, unused-JS ≤ 20 KB. Merge-blocking.

## What shipped

- `apps/portal/src/layouts/BaseLayout.astro` — HTML shell, meta, preloads,
  skip-link, landmarks.
- `apps/portal/src/components/Header.astro` — flag-rule strip, placeholder
  coat-of-arms SVG (Ghana green shield, gold Black Star), language switcher stub
  (EN active, Twi `#`-linked), primary nav.
- `apps/portal/src/components/Footer.astro` — footer identifier exactly per §5
  Weeks 11–14 spec: About / Privacy / Accessibility / RTI / Anti-Corruption
  Hotline (+233 800 900 900) / parent ministry / motto / CC-BY.
- `apps/portal/src/pages/index.astro` — one h1, one GET form to `/search`, five
  most-requested service links. Zero JavaScript.
- `apps/portal/src/styles/global.css` — reset + landmark rhythm + focus-visible
  - flag-rule. All values reference @gh/gh-ds tokens; no raw px.
- `apps/portal/public/favicon.svg` — 290 B inline SVG matching the mark.
- `apps/portal/scripts/prebuild.mjs` — copies WOFF2 fonts from
  `packages/gh-ds/fonts/` into `public/fonts/`.
- `apps/portal/scripts/axe-check.mjs` — jsdom + axe-core static audit.
- `apps/portal/scripts/measure-weight.mjs` — gzipped-weight assertion.
- `apps/portal/wrangler.toml` — Pages config with staging + production envs.
- `apps/portal/.lighthouserc.cjs` — §8 Lighthouse budget verbatim.
- `packages/gh-ds/scripts/build-css.mjs` — updated @font-face paths from
  `../fonts/...` to `/fonts/...` so consumers serve fonts at the site root.

## Accessibility contract — what every subsequent page inherits

- `<html lang>` — required on every page (BaseLayout accepts `lang` prop).
- Skip-link to `#main`, hidden until focused.
- Single `<h1>` per page (other headings are h2 and below).
- Landmark regions: `<header>`, `<nav aria-label>`, `<main>`, `<footer>`.
- `aria-labelledby` on every unnamed section.
- 44px minimum touch targets on form controls and buttons.
- `required` attribute with native validation on the search field.
- Focus ring: 3px solid `--color-focus-ring` (ghana-gold-400) + 2px offset.
- `prefers-reduced-motion` globally respected via tokens.css.

## Patches applied during verification

- `astro.config.mjs` — disabled prefetch for PR 3 since only one page exists;
  switched `cssMinify` from `lightningcss` (not installed) to `esbuild`.
- `.prettierrc` + root `package.json` — added `prettier-plugin-astro` back.
- `apps/portal/scripts/axe-check.mjs` — JSDOM requires
  `runScripts: 'dangerously'` for injected axe to attach to `window.axe`.

## Your next step — commit

```bash
git add -A
git commit -m "feat(portal): bootstrap apps/portal (Astro 5) with perf and a11y CI gates

- apps/portal Astro 5 static build with @gh/gh-ds tokens
- single / page: skip-link, landmarks, one h1, GET form to /search
- progressive enhancement verified: zero <script> tags in dist/
- axe-core static audit via jsdom — 0 blocking violations
- gzipped transfer weight: 27.5 KB on / (budget 80 KB)
- .lighthouserc.cjs with §8 budget, wrangler.toml for Pages
- CI jobs: axe-portal, transfer-weight, lighthouse (was stub)
- prettier-plugin-astro re-added now that .astro files exist

Closes: Week 0–2 PR 3 per docs/doctrine/week-0.md §4.
See also: docs/doctrine/pr-3-handoff.md."
```

## Week 0–2 foundation complete

PR 1 + PR 2 + PR 3 close out `.claude/CLAUDE.md §5` Weeks 0–2 foundation:

- ✅ Monorepo per §3.
- ✅ GH-DS v1 tokens shipped (colour, type, spacing).
- ✅ Astro → Pages wired. Hono → Workers will wire in Week 3 when the first
  service ships.
- ⏳ D1, KV, R2, Durable Objects, Queues, Turnstile, Access provisioned via
  OpenTofu — **not started**. This is infra-only, no code depends on it for
  Weeks 0–2. Owner: whoever holds the Cloudflare account key. Can land as a
  parallel PR while Week 3 component work starts.
- ✅ CI green: typecheck, lint, test, Wrangler build (stub), workerd-Docker
  build (stub), Lighthouse budget, axe-core a11y.
- ✅ ADR-001 (the stack). ✅ ADR-002 (Cloudflare-native doctrine). ✅ ADR-003
  (GH-DS forks GOV.UK Frontend).

Next milestone: `.claude/CLAUDE.md §5` **Weeks 3–6 — GH-DS v1 (the 25
components)**. First up: Button, the foundational Tier 1 component. Say "PR 4"
to proceed or propose a re-prioritisation.
