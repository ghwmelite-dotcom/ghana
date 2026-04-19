# Ghana Design System — contrast report

_Generated: 2026-04-18 by `pnpm --filter @gh/gh-ds report:contrast`._ _Source of
truth: `.claude/CLAUDE.md §6.1` and `src/tokens/semantic.ts`._

WCAG 2.2 SC 1.4.3 requires 4.5:1 for normal text. SC 1.4.11 requires 3:1 for
meaning-bearing non-text UI. This report runs every semantic token through the
relative-luminance formula in `src/contrast.ts` and records the measured ratio.

## Text on surface (`ghana-ink-50`) — must meet 4.5:1

| Token            | Foreground | Background | Ratio   | Required | Verdict |
| ---------------- | ---------- | ---------- | ------- | -------- | ------- |
| `action-primary` | `#005A35`  | `#F7F7F8`  | 7.80:1  | 4.5:1    | ✅ pass |
| `action-danger`  | `#820B18`  | `#F7F7F8`  | 9.76:1  | 4.5:1    | ✅ pass |
| `link`           | `#004527`  | `#F7F7F8`  | 10.43:1 | 4.5:1    | ✅ pass |
| `link-visited`   | `#001A0E`  | `#F7F7F8`  | 17.00:1 | 4.5:1    | ✅ pass |
| `success`        | `#005A35`  | `#F7F7F8`  | 7.80:1  | 4.5:1    | ✅ pass |
| `error`          | `#820B18`  | `#F7F7F8`  | 9.76:1  | 4.5:1    | ✅ pass |
| `info`           | `#1D70B8`  | `#F7F7F8`  | 4.83:1  | 4.5:1    | ✅ pass |
| `text-default`   | `#000000`  | `#F7F7F8`  | 19.61:1 | 4.5:1    | ✅ pass |
| `text-secondary` | `#3E424A`  | `#F7F7F8`  | 9.42:1  | 4.5:1    | ✅ pass |

## UI-adjacent tokens on surface — must meet 3:1

| Token           | Foreground | Background | Ratio  | Required | Verdict |
| --------------- | ---------- | ---------- | ------ | -------- | ------- |
| `border-strong` | `#5B5F68`  | `#F7F7F8`  | 5.98:1 | 3:1      | ✅ pass |

## Composite-component checks

| Token          | Foreground | Background | Ratio   | Required | Verdict |
| -------------- | ---------- | ---------- | ------- | -------- | ------- |
| `focus-ring`   | `#FCD116`  | `#005A35`  | 5.68:1  | 3:1      | ✅ pass |
| `warning-text` | `#000000`  | `#FFFBE6`  | 20.19:1 | 4.5:1    | ✅ pass |

## Known exemptions

- **`border-default` (`#B1B4B6` on surface).** Does not meet 3:1 in isolation.
  Permitted under the GOV.UK Frontend composite-component pattern: form-control
  identity is conveyed by the full component (label, hint text, focus ring,
  error state), so the border edge itself is decorative rather than
  meaning-bearing. Matches `govuk-border-colour` behaviour in the audited
  upstream. Any component that renders `border-default` must also render at
  least one 4.5:1-contrast element within the component bounds (label or value
  text).

## Dark-mode follow-up (not yet shipped)

These tokens are intentionally light-mode only. The table below records known
failures for future work — a dark-mode variant must replace each failing row
before dark mode ships.

| Token            | Foreground | Background | Ratio  | Required | Verdict |
| ---------------- | ---------- | ---------- | ------ | -------- | ------- |
| `action-primary` | `#005A35`  | `#000000`  | 2.51:1 | 4.5:1    | ❌ fail |
| `action-danger`  | `#820B18`  | `#000000`  | 2.01:1 | 4.5:1    | ❌ fail |
| `link`           | `#004527`  | `#000000`  | 1.88:1 | 4.5:1    | ❌ fail |
| `link-visited`   | `#001A0E`  | `#000000`  | 1.15:1 | 4.5:1    | ❌ fail |
| `success`        | `#005A35`  | `#000000`  | 2.51:1 | 4.5:1    | ❌ fail |
| `error`          | `#820B18`  | `#000000`  | 2.01:1 | 4.5:1    | ❌ fail |
| `info`           | `#1D70B8`  | `#000000`  | 4.06:1 | 4.5:1    | ❌ fail |
| `text-default`   | `#000000`  | `#000000`  | 1.00:1 | 4.5:1    | ❌ fail |
| `text-secondary` | `#3E424A`  | `#000000`  | 2.08:1 | 4.5:1    | ❌ fail |

## Update policy

- Re-run `pnpm --filter @gh/gh-ds report:contrast` in every PR that touches
  `src/tokens/semantic.ts` or `src/tokens/colour.ts`.
- Every ❌ in the two top tables is a merge blocker.
- Exemptions move into the "Known exemptions" section with a cited reason.
- Dark-mode gaps are tracked here until resolved by a dark-mode token PR.
