# PR 2 — Handoff & verification

`feat(gh-ds): publish v0 design tokens with flag colours and Noto Sans` — green
locally against every PR 2 DoD clause in `docs/doctrine/week-0.md §4`.

## Measured DoD

| DoD clause                                       | Evidence                                                                |
| ------------------------------------------------ | ----------------------------------------------------------------------- |
| `pnpm --filter @gh/gh-ds test` green             | 18 tests, 1 file, 0 failures (vitest)                                   |
| Contrast report published                        | `packages/gh-ds/CONTRAST-REPORT.md` — 9 text tokens, 1 UI, 2 composites |
| Total CSS under 4 KB gzipped                     | `dist/tokens.css` — 1,412 bytes gzipped (budget 4,096)                  |
| Every WOFF2 subset under 30 KB                   | max 19,432 bytes (`jetbrains-mono-700.woff2`)                           |
| Every Ghanaian glyph present in each Noto/Inter  | fontkit verification: 10/10 per weight — ɛ ɔ ŋ ɖ ƒ ɣ ʋ ₵ À é            |
| Every Ghanaian glyph present in each Mono weight | fontkit verification: 4/4 per weight — À é € £ (mono excludes IPA)      |

## Five-gate pipeline

```
pnpm typecheck   → 21/21 ✓  exit 0
pnpm lint        → 21/21 ✓  exit 0   (real ESLint on @gh/gh-ds)
pnpm test        → 18/18 tests in @gh/gh-ds  exit 0
pnpm build       → 21/21 ✓  exit 0   (tokens.css emitted, 1412 B gzipped)
pnpm format:check → All matched files use Prettier code style ✓
```

## What shipped

- `packages/gh-ds/src/tokens/` — colour, semantic, typography, spacing. Strict
  TypeScript, frozen values per `.claude/CLAUDE.md §6.1` and §6.2.
- `packages/gh-ds/src/contrast.ts` — WCAG 2.2 relative-luminance + ratio math,
  zero third-party deps.
- `packages/gh-ds/src/contrast.test.ts` — 18 tests: text-on-surface (4.5:1),
  UI-adjacent (3:1), composite checks (warning, focus ring), pinned dark-mode
  gap that will break when a future PR adds a dark-mode token set.
- `packages/gh-ds/scripts/build-css.mjs` — emits `dist/tokens.css`. Hard-fails
  if > 4 KB gzipped.
- `packages/gh-ds/scripts/contrast-report.mjs` — regenerates
  `CONTRAST-REPORT.md` from current tokens.
- `packages/gh-ds/scripts/fetch-fonts.mjs` — Google Fonts CSS2 `text=`
  download + subset-font + fontkit glyph verification. Hard-fails if any WOFF2 >
  30 KB or if any required glyph is missing.
- `packages/gh-ds/fonts/` — seven WOFF2 subsets, `OFL.txt`, `README.md`.
- `packages/gh-ds/README.md` — quick-start, palette/type reference, scripts.
- Root devDependencies added: `@typescript-eslint/parser`,
  `@typescript-eslint/eslint-plugin`, `eslint`, `eslint-config-prettier` so lint
  actually runs across the monorepo now (not just a noop stub).

## Patches applied during verification

- `.prettierrc` — removed `prettier-plugin-astro` (returns in PR 3).
- Added `.prettierignore` — covers `.archive/`, `pnpm-lock.yaml`, build outputs.
- `packages/gh-ds/scripts/fetch-fonts.mjs` — two iterations:
  1. Discovered Google Fonts CSS2 was returning default unicode-range subsets
     that omitted IPA Extensions (ɛ ɔ ɣ ʋ). Switched to the `text=` parameter
     forcing Google to return a single WOFF2 containing exactly the glyphs we
     request.
  2. The `text=` endpoint serves URLs as `.../font?kit=...` (no `.woff2`
     extension). Relaxed the regex to match the `format('woff2')` CSS hint
     instead of a `.woff2` suffix.
- `packages/gh-ds/package.json` lint script — rewritten from quoted glob to
  `eslint --ext .ts,.mjs src scripts` because Windows bash doesn't strip single
  quotes, causing ESLint to see the literal `'src/**/*.ts'` string.

## Your next step — commit

```bash
git add -A
git status
git commit -m "feat(gh-ds): publish v0 design tokens with flag colours and Noto Sans

- packages/gh-ds with colour/semantic/typography/spacing tokens
- WCAG 2.2 contrast checker + 18 vitest assertions gating every token
- dist/tokens.css generator (1.4 KB gzipped — budget 4 KB)
- Google Fonts text= fetch + subset pipeline with fontkit glyph verification
- 7 WOFF2 files under 19 KB each, every Ghanaian glyph confirmed present
- CONTRAST-REPORT.md regenerated on every token change
- root devDeps for ESLint + TypeScript ESLint plugins so lint is real not noop

Closes: Week 0–2 PR 2 per docs/doctrine/week-0.md §4.
See also: docs/doctrine/pr-2-handoff.md."
```

## Next PR

**PR 3 —
`feat(portal): bootstrap apps/portal (Astro 5) with perf and a11y CI gates`**
per `docs/doctrine/week-0.md §4`. First Astro project, first Lighthouse CI gate,
first axe-core run, first `/` page served from `@gh/gh-ds/tokens.css`.
