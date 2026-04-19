# Week 0 — Repo State and Next Three PRs

**Status: uninitialised.** Per CLAUDE.md §10, this document is the first output.
No code ships until you approve the decision in §3 and the three PRs in §4.

_Date: 2026-04-18 · Author: lead engineer agent · Under review by: Ozzy (OHCS
digital lead)._

---

## 1. What is in the repo today (measured, not guessed)

| Artefact                                                                         | Size                | Status vs spec                                                                  |
| -------------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------- |
| `index.html`                                                                     | 126 KB uncompressed | ❌ Single file exceeds 41% of the 300 KB total-page ceiling (§8).               |
| `css/main.css` + `css/variables.css`                                             | 28 KB               | ⚠ Design tokens exist but do not match §6.1 (flag colours) or §6.2 (Noto Sans). |
| `js/main.js` + `js/components.js`                                                | 33 KB               | ⚠ Hand-authored, unbundled, unminified, not tree-shaken.                        |
| `manifest.json` + `sw.js`                                                        | 8 KB                | ✅ PWA shell exists; salvageable shape, wrong colour + icon refs.               |
| `government/`, `services/`, `business/`, `tourism/`, `help/`, `contact.html`     | 8 static HTML files | ✅ Information architecture is a useful reference for content migration.        |
| `index_original.html` (72 KB)                                                    | —                   | 🗑 Dead redesign snapshot. Delete on archive.                                   |
| `README.md`                                                                      | 6 KB                | ⚠ "Sovereign Elegance" framing describes design that §6 replaces.               |
| `.git/`                                                                          | absent              | ❌ Not a git repo yet.                                                          |
| `package.json`, `pnpm-lock.yaml`, `wrangler.toml`, `turbo.json`, `tsconfig.json` | absent              | ❌ No build toolchain.                                                          |
| `docs/adr/*.md`, `docs/doctrine/*.md` (pre-this-file)                            | absent              | ❌ No architectural record.                                                     |
| `apps/`, `services/`, `packages/`, `infra/`                                      | absent              | ❌ Monorepo (§3) not bootstrapped.                                              |

**Bottom line.** Zero of the §5 Week 0–2 foundation exists. What does exist is a
static HTML v0 that cannot pass §8 Lighthouse gates or §9 security gates even in
principle — it has no CSP, no SRI, no Turnstile, no CSRF, no build pipeline, no
tests, no a11y audit, and no i18n scaffold.

---

## 2. Gap to §5 Week 0–2 foundation

Explicit gap against the spec's Week 0–2 checklist:

- [ ] Monorepo per §3 — **not started.**
- [ ] GH-DS v1 tokens (colour + type + spacing) — **contradicted:** existing
      `variables.css` uses a different palette and typographic stack.
- [ ] Astro → Pages; Hono → Workers wired; `staging.gov.gh` — **not started.**
- [ ] D1, KV, R2, Durable Objects, Queues, Turnstile, Access provisioned via
      OpenTofu — **not started.**
- [ ] CI: typecheck, lint, test, Wrangler build, `workerd-docker-build`,
      Lighthouse budget, axe-core — **not started.**
- [ ] ADR-001 (stack), ADR-002 (Cloudflare-native doctrine), ADR-003 (GH-DS
      forks GOV.UK Frontend) — **not written.**

Nothing here is partially done. Every bullet is green-field.

---

## 3. The one decision only you can make

The current static repo holds real information architecture (ministry pages,
service categories) that belongs in the new portal. It also holds a design
direction ("Sovereign Elegance") that §6 overwrites.

**Pick one, then we proceed:**

**A. Clean-room rewrite (recommended).** Move all current files to
`.archive/legacy-v0/` untouched as reference-only. Delete `index_original.html`.
The monorepo at §3 is built green-field. Content editors migrate copy
ministry-by-ministry into Keystatic during Weeks 7–10 (OHCS reference
implementation). _Why recommended:_ enforces §1 non-negotiables from commit
0001, avoids half-migrated hybrid that fails §8 budget forever, preserves old
work as a git artefact in `.archive/`.

**B. Salvage-in-place.** Keep the current static site live at `gov.gh` behind
Cloudflare while the monorepo is built alongside at `next.gov.gh`. Flip DNS when
Week 11–14 passes KPIs. _Why not default:_ doubles the surface area, requires
dual maintenance for 14 weeks, no CI enforcement possible on the legacy side,
and the current site does not meet §1 accessibility or §8 performance — keeping
it "live" means knowingly serving non-compliant software to citizens.

Recommendation: **A**. Flag your call in your next message so PR 1 can reflect
it.

---

## 4. Next three concrete PRs

Each PR is scoped to one sitting, testable in isolation, and satisfies a
specific §7 DoD column.

### PR 1 — `chore: initialise monorepo foundation and archive legacy v0`

- `git init`, add `.gitignore` for `node_modules/`, `.wrangler/`, `.astro/`,
  `dist/`, `.turbo/`, `.env*`.
- Move all current root files (`*.html`, `css/`, `js/`, `assets/`,
  `manifest.json`, `sw.js`, tree directories, `README.md`) into
  `.archive/legacy-v0/`. Delete `index_original.html`.
- Scaffold `apps/`, `services/`, `packages/`, `infra/`, `content/`, `docs/`,
  `.claude/` per §3.
- `pnpm-workspace.yaml`, root `package.json` with `"packageManager": "pnpm@9"`,
  `turbo.json` with `typecheck`/`lint`/`test`/`build` pipelines,
  `tsconfig.base.json` strict mode, `.editorconfig`, `.prettierrc`,
  `.eslintrc.cjs` (the GOV.UK eslint-config as base).
- Empty stub `docs/adr/README.md` with ADR-template link.
- Write ADR-001 (the stack: Astro 5 + Hono + D1 + Pages + Workers), ADR-002
  (Cloudflare-native doctrine + workerd-Docker DR), ADR-003 (GH-DS forks GOV.UK
  Frontend).
- CI: single GitHub Actions workflow that runs
  `pnpm install --frozen-lockfile && pnpm typecheck && pnpm lint && pnpm test && pnpm build`.
  Fails on warnings.
- **DoD:** typecheck/lint/test green on empty workspace;
  `.archive/legacy-v0/index.html` renders identically to current `index.html`
  when opened; three ADRs committed.

### PR 2 — `feat(gh-ds): publish v0 design tokens with flag colours and Noto Sans`

- `packages/gh-ds/` with `tokens.css`, `tokens.ts`, a README that cites §6.1 and
  §6.2 verbatim.
- Colour tokens per §6.1 exactly: `ghana-red` / `ghana-gold` / `ghana-green` /
  `ghana-ink` scales, plus `semantic.*` mapping.
- Typography tokens per §6.2: Noto Sans 400/500/700 + Inter 600/700 + JetBrains
  Mono, self-hosted WOFF2 under `packages/gh-ds/fonts/`, subset via
  `glyphhanger` to cover English + Akan + Ewe + Ga + Dagbani + Hausa ranges.
  `font-display: swap`. OFL licence files committed alongside.
- Spacing, radii, and `rem` scale per §6.2.
- Accessibility check: every `action-*`/`link`/`focus-ring`/semantic token
  verified against WCAG 2.2 AA on both `ghana-ink.50` and `ghana-ink.900`
  backgrounds using `@adobe/leonardo-contrast-colors`. Contract: if contrast
  fails, the token is not exported.
- Ships as both CSS custom properties and TypeScript-typed object for
  consumption by Astro + React islands.
- Unit tests for the contrast contract.
- **DoD:** `pnpm --filter @gh/gh-ds test` green, contrast report published to
  `packages/gh-ds/CONTRAST-REPORT.md`, total CSS under 4 KB gzipped, WOFF2
  subsets under 30 KB each.

### PR 3 — `feat(portal): bootstrap apps/portal (Astro 5) with perf and a11y CI gates`

- `apps/portal/` Astro 5 project targeting Cloudflare Pages adapter.
- Single page: `/` — skip-link, header (coat-of-arms placeholder + language
  switcher stub), landmark regions (`<main>`, `<nav>`, `<footer>`), `<h1>` only,
  "I am looking for…" static search form (works without JavaScript; submits
  `GET /search?q=`), footer identifier per §5 Week 11–14 footer spec.
- Consumes `@gh/gh-ds` tokens.
- `.lighthouserc.yml` from §8 committed verbatim. `lhci autorun` runs on CI
  against `pnpm build && pnpm preview`.
- axe-core CI check via `@axe-core/cli` against the built static output. Zero
  violations gates the merge.
- `wrangler.toml` for Pages with a `workerd-docker-build` nightly job stubbed
  (§2.3).
- **DoD:** Lighthouse Mobile ≥95 / A11y = 100 / BP ≥95 / SEO = 100 on preview;
  axe-core zero violations; transfer weight under 80 KB gzipped for `/`; works
  with JS disabled (demonstrate by curl-fetching `/` and showing the form
  submits).

---

## 5. What we are explicitly **not** doing in Week 0–2

- No GhanaConnect code. No MyInfoGH code. No payments code. No ministries pages.
  These are Weeks 3–14.
- No content migration from `.archive/legacy-v0/`. That is a Keystatic task in
  Week 7.
- No Twi translations in PR 2–3. EN-only fixtures are allowed until PR on
  `packages/i18n/` (Week 3).
- No Adinkra or Kente imagery. §6.3 clearance from the National Commission on
  Culture + Folklore Board must precede any symbol use.
- No NIA IVSP integration. Those credentials are blocked; we stub only when Week
  3+ PRs require it.

---

## 6. Blockers to raise with you now

Per §11: I will not freeze on external blockers. I will stub with realistic
fakes and file unblock issues. These three must be unblocked before Week 3
starts, so raise them early:

1. **CSA CII registration paperwork** (Act 1038) — initiate with Cyber Security
   Authority now; the registration lead time is typically 4–6 weeks.
2. **DPC controller registration** (Act 843) — Data Protection Commission
   filing, parallel timeline.
3. **NIA IVSP merchant key for `verifyid.nia.gov.gh/persus`** — without this,
   GhanaConnect's primary IdP is a stub. File the request with NIA Digital
   Services.

These are process items, not engineering. They run in parallel to code.

---

## 7. Waiting on you

Reply with **A** or **B** from §3, and PR 1 opens next. If you want to change PR
2 or PR 3's scope, say so — this is the last moment that reshaping is cheap.

> Ghana first. Always.
