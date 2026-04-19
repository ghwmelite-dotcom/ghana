/**
 * Ghana Design System — spacing and radius tokens.
 *
 * Base-8 spacing scale. Every component must compose only from these values;
 * never use arbitrary px. Keeps rhythm consistent across 25 components and
 * 21 ministry sub-sites.
 */

export const spacing = {
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  32: '8rem', // 128px
} as const;

export const radius = {
  none: '0',
  sm: '0.125rem', // 2px — inputs, chips
  md: '0.25rem', // 4px — buttons, cards
  lg: '0.5rem', // 8px — panels
  xl: '1rem', // 16px — hero surfaces
  full: '9999px',
} as const;

export const borderWidth = {
  none: '0',
  hairline: '1px',
  default: '2px', // GOV.UK Frontend convention — stronger than hairline
  focus: '3px', // focus rings use 3px + outline-offset 2px
} as const;

export const shadow = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 2px 8px rgba(0, 0, 0, 0.08)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.10)',
} as const;

export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radius;
export type BorderWidthToken = keyof typeof borderWidth;
export type ShadowToken = keyof typeof shadow;
