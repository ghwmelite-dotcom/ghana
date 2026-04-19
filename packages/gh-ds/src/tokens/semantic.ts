/**
 * Ghana Design System — semantic token mapping.
 *
 * Source: `.claude/CLAUDE.md §6.1`.
 *
 * Semantic tokens are the only ones components should consume. Primitive
 * colour steps are indirectly referenced through these. This indirection lets
 * us change branding (e.g. a future Christmas inverse theme, or a dark mode)
 * without touching component code.
 *
 * `info` is the only non-flag hue, sourced from GOV.UK's blue for parity with
 * the ADR-003 upstream. All others resolve to scales in `./colour.ts`.
 */

import { colourFlat } from './colour.ts';

/**
 * Default light-mode semantic tokens.
 *
 * Background assumption: `ghana-ink.50` (#F7F7F8). All text-on-surface
 * contrast is measured against that. A dark-mode variant is a separate
 * concern; see `CONTRAST-REPORT.md` §"Dark mode follow-up".
 */
export const semantic = {
  'action-primary': colourFlat['ghana-green-600']!,
  'action-primary-hover': colourFlat['ghana-green-700']!,
  'action-danger': colourFlat['ghana-red-700']!,
  link: colourFlat['ghana-green-700']!,
  'link-visited': colourFlat['ghana-green-900']!,
  'focus-ring': colourFlat['ghana-gold-400']!,
  success: colourFlat['ghana-green-600']!,
  'warning-bg': colourFlat['ghana-gold-50']!,
  'warning-text': colourFlat['ghana-ink-900']!,
  error: colourFlat['ghana-red-700']!,
  info: '#1D70B8',
  surface: colourFlat['ghana-ink-50']!,
  'surface-raised': '#FFFFFF',
  'text-default': colourFlat['ghana-ink-900']!,
  'text-secondary': colourFlat['ghana-ink-600']!,
  'text-muted': colourFlat['ghana-ink-500']!,
  // `border-default` intentionally does not meet 3:1 against surface — it marks
  // form-control edges where the full component (label, hint, focus ring) is
  // what conveys identity, per the GOV.UK Frontend pattern and WCAG 2.2
  // composite-component allowance. See CONTRAST-REPORT.md §"Known exemptions".
  'border-default': '#B1B4B6',
  'border-strong': colourFlat['ghana-ink-500']!,
} as const;

export type SemanticToken = keyof typeof semantic;

/**
 * Tokens whose usage is *text on surface* — must meet WCAG 2.2 AA 4.5:1.
 */
export const textOnSurfaceTokens: ReadonlyArray<SemanticToken> = [
  'action-primary',
  'action-danger',
  'link',
  'link-visited',
  'success',
  'error',
  'info',
  'text-default',
  'text-secondary',
];

/**
 * Tokens whose usage is *non-text UI component adjacent to surface* — must
 * meet WCAG 2.2 AA 3:1 per SC 1.4.11. Only `border-strong` is strict here;
 * `focus-ring` is tested against its intended adjacent component
 * (action-primary) via a dedicated test, and `border-default` is exempted
 * per the GOV.UK composite-component pattern.
 */
export const uiAdjacentTokens: ReadonlyArray<SemanticToken> = ['border-strong'];
