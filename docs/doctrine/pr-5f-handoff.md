# PR 5f — Handoff & verification

`feat(gh-ds): ship Select + DateInput — the last compound form fields` — green
locally against every `.claude/CLAUDE.md §5` Weeks 3–6 DoD clause.

## Measured DoD

| DoD clause                                | Evidence                                                      |
| ----------------------------------------- | ------------------------------------------------------------- |
| Two components in `packages/gh-ds`        | `Select/Select.astro` + `DateInput/DateInput.astro`           |
| axe-core zero blocking violations         | 8 dist pages scanned, 0 violations on each                    |
| Consumed from apps/portal                 | `/internal/select/` (6 sections) + `/internal/date/` (6)      |
| EN + Twi fixtures                         | "Kasa bɛn na wote?" Select + "Wo awoda ne da bɛn?" DateInput  |
| Native select — no custom combobox        | Deliberate — rationale captured in Select.astro frontmatter   |
| Three-input date over `<input type=date>` | Rationale in DateInput.astro: low-end Android picker variance |
| Progressive enhancement                   | No JavaScript anywhere in the dist bundle                     |
| 44×44 min touch target                    | Both components hit 2.75rem min-height                        |
| Colour never the only error indicator     | Red border + visually-hidden "Error:" prefix                  |
| `/` weight still < 80 KB gzipped          | **28.0 KB unchanged**                                         |

## Five-gate pipeline

```
pnpm typecheck   → 20/20 ✓  exit 0
pnpm lint        → 20/20 ✓  exit 0
pnpm test        → 21 successful (18 contrast + axe sweep of 8 dist pages)
pnpm build       → 20/20 ✓  exit 0
pnpm format:check → All matched files use Prettier code style ✓
```

## What shipped

- **`packages/gh-ds/src/components/Select/Select.astro`** — label + hint +
  error + native `<select>`. Props: `name`, `label`, `options` (array of
  `{ value, label, disabled? }`), `value`, `hint`, `error`, `required`,
  `disabled`, `autocomplete`, `width` (GOV.UK scale). Inline-SVG chevron as
  `background-image` (no extra asset). ARIA wired via `aria-describedby`,
  `aria-invalid`, `aria-required`.
- **`packages/gh-ds/src/components/DateInput/DateInput.astro`** — fieldset with
  legend + three narrow text inputs (day / month / year). Emits three form
  fields on submit: `${name}-day`, `${name}-month`, `${name}-year`.
  `autocomplete="bday"` maps to `bday-day / -month / -year` so browsers autofill
  from profile. `value` takes `{ day?, month?, year? }`. Group- level error
  applies a red border to all three inputs; no per-part error messages (would be
  redundant and noisy).
- **`packages/gh-ds/package.json`** — `@gh/gh-ds/Select` and
  `@gh/gh-ds/DateInput` exported.
- **`apps/portal/src/pages/internal/select.astro`** — gallery at
  `/internal/select/` with six sections: basic (16 Ghana regions), hint +
  preselection, required + width modifier, error, disabled, Twi.
- **`apps/portal/src/pages/internal/date.astro`** — gallery at `/internal/date/`
  with six sections: basic, DoB with browser autofill, prefilled, error,
  disabled, Twi.

## Key design decisions (captured in code)

- **No custom combobox.** Native `<select>` is keyboard-accessible,
  screen-reader-friendly, voice-input-friendly, and the mobile picker UX is
  strictly better than anything we could ship. A custom Autocomplete component
  will arrive as Tier-2/3 when 50+ option lists (districts, schools) demand
  type-ahead filtering — not as a replacement for Select.
- **Three-input date over `<input type="date">`.** Low-end Android pickers drop
  frames and vary across OEMs. Day/Month/Year matches how the editorial voice
  writes dates (`DD Month YYYY` per §6.4). Server-side validation is cleaner
  when the three parts are distinct form fields.
- **Group error, not per-part error.** One "Error: enter a valid date" beats
  "Error: day invalid, Error: month invalid" — the user knows which field they
  fumbled by looking at which has the red border.

## Design-system state after PR 5f

- ✅ Button (PR 4)
- ✅ Text input (PR 5a)
- ✅ Form label/hint/error composite (PR 5a)
- ✅ Error summary (PR 5c)
- ✅ Radio (PR 5d)
- ✅ Checkboxes (PR 5d)
- ✅ Textarea (PR 5e)
- ✅ Select (PR 5f — this)
- ✅ Date input (PR 5f — this)
- ⬜ Header (still inline in apps/portal)
- ⬜ Footer (still inline in apps/portal)
- ⬜ Skip-link (still inline in apps/portal)
- ⬜ Back link (Sankofa)

**9 of 13 Tier-1 components shipped. Every form control is now in `@gh/gh-ds`.**
Remaining four are layout pieces (Header, Footer, Skip-link) and the Sankofa
Back link motif.

## Your next step — commit

```bash
git add -A
git commit -m "feat(gh-ds): ship Select + DateInput

- packages/gh-ds/src/components/Select/Select.astro with width modifiers
- packages/gh-ds/src/components/DateInput/DateInput.astro with day/month/year fieldset
- native <select> (no custom combobox), inline-SVG chevron
- DateInput emits 3 form fields; autocomplete=bday maps to bday-day/-month/-year
- group-level error applies red border to all three date parts
- exports both components via package.json exports map
- apps/portal /internal/select/ + /internal/date/ galleries with Twi fixtures
- axe 0 violations on 8 built pages; / weight unchanged at 28 KB

Delivers Tier-1 Select + Date input per .claude/CLAUDE.md §5 Weeks 3–6.
Every form control in the Tier-1 list is now in @gh/gh-ds.
See also: docs/doctrine/pr-5f-handoff.md."
```

## Next PR — the final Tier-1 cleanup

**PR 5g — extract Header + Footer + Skip-link into `@gh/gh-ds`, and add the
Sankofa Back link.**

Scope:

- Move `apps/portal/src/components/Header.astro` →
  `packages/gh-ds/src/components/Header/Header.astro`
- Same for Footer and Skip-link (it is currently inline in `BaseLayout.astro`)
- Add `@gh/gh-ds/BackLink` with the Sankofa motif per §6.3 (requires or captures
  the needed Folklore Board clearance note)
- Update `apps/portal` to consume the extracted components
- Update `apps/portal/src/layouts/BaseLayout.astro` to use `@gh/gh-ds/SkipLink`
  and `@gh/gh-ds/Header` + `@gh/gh-ds/Footer`

This closes out the Tier-1 list and unlocks the Week 7 OHCS reference
implementation (which consumes the design system wholesale).

Say "PR 5g" to proceed. After 5g, Week 3–6 is complete.
