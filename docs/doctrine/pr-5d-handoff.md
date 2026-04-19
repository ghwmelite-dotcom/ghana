# PR 5d — Handoff & verification

`feat(gh-ds): ship RadioGroup + CheckboxGroup — the choice-field pair` — green
locally against every `.claude/CLAUDE.md §5` Weeks 3–6 DoD clause.

## Measured DoD

| DoD clause                                     | Evidence                                                                 |
| ---------------------------------------------- | ------------------------------------------------------------------------ |
| Two components in `packages/gh-ds` per ADR-003 | `RadioGroup/RadioGroup.astro` + `CheckboxGroup/CheckboxGroup.astro`      |
| axe-core zero blocking violations              | 5 dist pages scanned, 0 violations on each                               |
| Consumed from apps/portal                      | Gallery at `/internal/choices/` — 10 sections covering both components   |
| EN + Twi fixtures                              | "Kasa bɛn na wote?" + "Dwuma bɛn na wopɛ sɛ woyɛ?" in `lang="tw"` block  |
| `<fieldset>` + visible `<legend>`              | Both components wrap every group, legend named by `aria-labelledby` path |
| 44×44 touch target                             | 2.75rem min-height on every option row; full-row click                   |
| Colour never the only error indicator          | Visually-hidden "Error:" prefix + red left-border on group               |
| Progressive enhancement                        | Pure native inputs; no JavaScript in any built page                      |
| `/` transfer weight still < 80 KB gzipped      | **28.0 KB unchanged** (components do not load on `/`)                    |

## Five-gate pipeline

```
pnpm typecheck   → 20/20 ✓  exit 0
pnpm lint        → 20/20 ✓  exit 0
pnpm test        → 21 successful (18 contrast + axe sweep of 5 dist pages)
pnpm build       → 20/20 ✓  exit 0   (5 pages built)
pnpm format:check → All matched files use Prettier code style ✓
```

## What shipped

- **`packages/gh-ds/src/components/RadioGroup/RadioGroup.astro`** — fieldset
  with visible legend, group-level hint + error, and an `options` array of
  `{ value, label, hint?, disabled? }`. Supports `value` for preselection,
  `orientation='inline'` for binary Yes/No, and `required`. Custom-drawn circle
  via `label::before` + filled dot via `label::after`. Native input is visually
  hidden but kept focusable and in the accessibility tree.
- **`packages/gh-ds/src/components/CheckboxGroup/CheckboxGroup.astro`** — mirror
  of RadioGroup with multi-select semantics. `value` is a string array. Two
  additional props for the common accept-terms pattern:
  - `nameIsArray={false}` — emits `name="terms"` rather than `name="terms[]"`
  - `legendHidden` — visually hides the legend when the single option label
    already carries the full statement. Legend still read by screen readers.
- **`packages/gh-ds/package.json`** — `@gh/gh-ds/RadioGroup` and
  `@gh/gh-ds/CheckboxGroup` added to the exports map.
- **`apps/portal/src/pages/internal/choices.astro`** — gallery at
  `/internal/choices/` with ten sections: radio inline binary, long-list
  preselected, per-option hints, error state, disabled option; checkbox
  multi-select with preselection, inline binary, single accept-terms, error
  state; Twi fixture covering both.

## Accessibility notes

- **Required indicator on legend**, not on individual options. WCAG 3.3.2 says
  the required-ness of a group belongs to the group, and repeating it per option
  adds noise for screen-reader users.
- **`required` attribute on the first radio only**. Browsers use that as the
  group-required signal for native validation. Putting it on every option is
  redundant and creates inconsistent error messages across browsers.
- **`required` attribute on single checkboxes only**. For multi-select checkbox
  groups, HTML has no native "at least one" validation — that is a server-side
  concern, and the group-level error message replaces the per-option required
  marker.
- **Custom controls, not native appearance**. The native `<input>` stays in the
  DOM (opacity 0, positioned over the label) so screen readers and keyboard
  users interact with the real control. Only the visual chrome is custom. This
  avoids the common anti-pattern where a `<div role="radio">` reinvents the
  focus and selection semantics.

## Design-system state after PR 5d

Tier-1 foundation list:

- ✅ Button (PR 4)
- ✅ Text input (PR 5a)
- ✅ Form label/hint/error composite (PR 5a)
- ✅ Error summary (PR 5c)
- ✅ Radio (PR 5d — this)
- ✅ Checkboxes (PR 5d — this)
- ⬜ Textarea
- ⬜ Select
- ⬜ Date input (D/M/Y)
- ⬜ Header (still inline in apps/portal)
- ⬜ Footer (still inline in apps/portal)
- ⬜ Skip-link (still inline in apps/portal)
- ⬜ Back link (Sankofa)

**6 of 13 Tier-1 components shipped. Over halfway.**

## Your next step — commit

```bash
git add -A
git commit -m "feat(gh-ds): ship RadioGroup + CheckboxGroup

- packages/gh-ds/src/components/RadioGroup/RadioGroup.astro
- packages/gh-ds/src/components/CheckboxGroup/CheckboxGroup.astro
- fieldset + legend + group-level hint/error; 44px touch targets
- custom visual chrome over native inputs (no role=radio anti-pattern)
- RadioGroup.orientation inline|vertical; CheckboxGroup same
- CheckboxGroup.nameIsArray + legendHidden for accept-terms pattern
- exports @gh/gh-ds/RadioGroup + /CheckboxGroup via exports map
- apps/portal /internal/choices/ gallery: 10 sections both components
- axe 0 violations on 5 built pages; / weight unchanged at 28 KB

Delivers Tier-1 Radio + Checkboxes per .claude/CLAUDE.md §5 Weeks 3–6.
See also: docs/doctrine/pr-5d-handoff.md."
```

## Next PR

Remaining Tier-1 form controls: **Textarea**, **Select**, **Date input
(D/M/Y)**.

**5e — Textarea.** Smallest remaining control. Same props as TextInput plus
`rows`. Unlocks complaint narratives and appeal text boxes.

**5f — Select + Date input.** Two components. Select reuses the label/hint/error
pattern. Date input is a composite of three TextInputs (day/month/year) with
grouped validation — the most involved remaining Tier-1 piece.

**5g — Header + Footer + Skip-link + Back link** extracted from apps/portal into
`packages/gh-ds`. No new UI design — just moves the existing Header, Footer, and
skip-link styles from the portal app into the design system so any future
ministry site consumes them consistently. Unblocks the "25 components in
design.gov.gh Storybook" deliverable at Phase 1 close.

Recommendation: **5e (Textarea)** next — smallest surface, completes the
text-entry family. Then **5f** for the remaining compound fields. **5g** slots
in whenever you want the layout components centralised.

Say "PR 5e" to proceed.
