/**
 * Ghana Design System — colour primitives.
 *
 * Source: `.claude/CLAUDE.md §6.1`. Values are frozen — any change requires
 * a new ADR per `docs/adr/README.md` process rules.
 *
 * The four scales:
 *   ghana-red   — flag red, used for danger and error states only.
 *   ghana-gold  — flag gold, used for focus rings and warnings.
 *   ghana-green — flag green, primary action colour and link colour.
 *   ghana-ink   — neutral greys from ivory to obsidian, for text and surfaces.
 *
 * Rule from §6.1: never encode meaning with red vs green alone. Always pair
 * with icon + text label. Every semantic token is contrast-tested against
 * both `ghana-ink.50` and `ghana-ink.900` backgrounds in `contrast.test.ts`.
 */

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
} as const;

export type ColourScale = keyof typeof colour;
export type ColourStep<S extends ColourScale> = keyof (typeof colour)[S];

/**
 * Flatten scales into a single hex lookup, e.g. `colourFlat['ghana-green-600']`.
 * Useful for CSS generation and contrast testing.
 */
export const colourFlat: Record<string, string> = Object.entries(colour).reduce(
  (acc, [scale, steps]) => {
    for (const [step, hex] of Object.entries(steps)) {
      acc[`${scale}-${step}`] = hex;
    }
    return acc;
  },
  {} as Record<string, string>,
);
