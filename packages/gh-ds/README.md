# @gh/gh-ds — Ghana Design System

> Tokens, fonts, and (from Week 3) 25 accessible components for the flagship
> national government portal of Ghana. Forks GOV.UK Frontend. See
> [`docs/adr/003-ghds-forks-govuk-frontend.md`](../../docs/adr/003-ghds-forks-govuk-frontend.md)
> for the architectural reasoning.

## Scope of this package, right now (PR 2)

- ✅ Colour primitives — flag reds, golds, greens, and ink neutrals — per
  `.claude/CLAUDE.md §6.1`.
- ✅ Semantic token mapping for actions, links, focus, status, surfaces, and
  text.
- ✅ Typography tokens — Noto Sans (body + UI), Inter (display), JetBrains Mono
  (code) — per `.claude/CLAUDE.md §6.2`.
- ✅ Spacing, radius, border-width, and shadow tokens.
- ✅ WCAG 2.2 contrast checker with vitest test suite that gates every token.
- ✅ CSS generator that produces `dist/tokens.css` (≤ 4 KB gzipped).
- ✅ Self-hosted WOFF2 font fetch + subset pipeline (≤ 30 KB per weight).
- ⏳ **Not yet:** the 25 components. That is the Week 3–6 scope per
  `.claude/CLAUDE.md §5`.

## Install

```bash
pnpm --filter @gh/gh-ds install
```

## Quick start — consuming tokens

TypeScript consumers import the typed object:

```ts
import { semantic, fontFamily, fontSize, spacing } from '@gh/gh-ds';

const primary = semantic['action-primary']; // "#005A35"
const body = fontFamily.body; // "Noto Sans, system-ui, …"
```

Astro and plain CSS consumers import the custom-property sheet:

```css
@import '@gh/gh-ds/tokens.css';

button {
  background: var(--color-action-primary);
  color: var(--color-text-default);
  font: var(--font-weight-semibold) var(--font-size-base) /
    var(--line-height-body) var(--font-body);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
}

button:focus-visible {
  outline: var(--border-width-focus) solid var(--color-focus-ring);
  outline-offset: 2px;
  box-shadow: inset 0 0 0 1px var(--color-text-default);
}
```

## Scripts

| Command                                   | What it does                                                                |
| ----------------------------------------- | --------------------------------------------------------------------------- |
| `pnpm --filter @gh/gh-ds typecheck`       | `tsc --noEmit` against strict config.                                       |
| `pnpm --filter @gh/gh-ds lint`            | ESLint across `src/` and `scripts/`.                                        |
| `pnpm --filter @gh/gh-ds test`            | Vitest — every semantic token is contrast-verified before it exports.       |
| `pnpm --filter @gh/gh-ds build`           | Emit `dist/tokens.css`. Hard-fails if gzipped size > 4 KB.                  |
| `pnpm --filter @gh/gh-ds fonts`           | Download + subset the three fonts into `fonts/`. Hard-fails if any > 30 KB. |
| `pnpm --filter @gh/gh-ds report:contrast` | Regenerate `CONTRAST-REPORT.md` from current tokens.                        |

## Colour palette (`.claude/CLAUDE.md §6.1` — verbatim)

```ts
export const colour = {
  'ghana-red': {
    50: '#FDECEE',
    500: '#CE1126',
    600: '#A80E1F',
    700: '#820B18',
    900: '#36050A',
  },
  'ghana-gold': {
    50: '#FFFBE6',
    400: '#FCD116',
    500: '#E0B912',
    600: '#B8960C',
    700: '#8A7008',
  },
  'ghana-green': {
    50: '#E6F4EE',
    500: '#006B3F',
    600: '#005A35',
    700: '#004527',
    900: '#001A0E',
  },
  'ghana-ink': {
    50: '#F7F7F8',
    500: '#5B5F68',
    600: '#3E424A',
    700: '#2B2E34',
    900: '#000000',
  },
};
```

**Rule:** never encode meaning with red vs green alone. Always pair with icon +
text label. Test every semantic state against Coblis/Stark before merge.

## Typography (`.claude/CLAUDE.md §6.2` — verbatim)

- **Body & UI:** Noto Sans 400/500/700 — covers `ɛ`, `ɔ`, `ŋ`, `ɖ`, `ƒ`, `ɣ`,
  `ʋ`, hooked Hausa, combining tone marks.
- **Display:** Inter 600/700.
- **Mono:** JetBrains Mono.
- All SIL OFL, self-hosted WOFF2, `font-display: swap`, subset aggressively.
- **Scale (rem, 16px root):**
  `12 / 14 / 16 / 18 / 20 / 24 / 32 / 40 / 48 / 64 px`.
- **Line-height:** `1.2` display, `1.35` headings, `1.5` body.

## Contrast contract

`src/contrast.ts` implements WCAG 2.2 relative-luminance and contrast-ratio
formulas directly — no third-party contrast library in the supply chain.

`src/contrast.test.ts` gates every semantic token:

- **text-on-surface tokens** (`action-primary`, `link`, `error`, `info`,
  `success`, `text-default`, `text-secondary`, etc.) must meet 4.5:1 against
  `ghana-ink-50`.
- **UI-adjacent tokens** (`border-strong`) must meet 3:1.
- **`focus-ring`** is tested specifically against `action-primary` (the most
  common focus target) — 3:1 required. Not tested against surface because the
  focus pattern uses an inner dark edge per GOV.UK Frontend precedent.
- **`warning-text` on `warning-bg`** must meet 4.5:1 as a composite.

Known exemptions and the dark-mode follow-up list live in
[`CONTRAST-REPORT.md`](./CONTRAST-REPORT.md) — regenerated on every token
change.

## Licence

MIT for the TypeScript and build scripts. SIL Open Font Licence 1.1 for the font
binaries in `fonts/` — see [`fonts/OFL.txt`](./fonts/OFL.txt). Upstream GOV.UK
Frontend attribution will land in `NOTICE` when component source is forked in
Week 3.
