# PR 5a — Handoff & verification

`feat(gh-ds): ship TextInput with label/hint/error composite` — green locally
against every `.claude/CLAUDE.md §5` Weeks 3–6 DoD clause this PR covers.

## Measured DoD

| DoD clause                                      | Evidence                                                                     |
| ----------------------------------------------- | ---------------------------------------------------------------------------- |
| Component in `packages/gh-ds` per ADR-003       | `packages/gh-ds/src/components/TextInput/TextInput.astro`                    |
| Form label/hint/error composite (Tier 1 bullet) | Label + hint + error + input rendered by a single component                  |
| axe-core zero blocking violations               | 3 dist pages scanned (`/`, `/internal/buttons/`, `/internal/text-input/`)    |
| Consumed from apps/portal                       | Full gallery at `/internal/text-input/` with 14 input instances              |
| EN + Twi fixtures                               | `/internal/text-input/` Twi section (`lang="tw"`) — "Wo din", "Mmoaakuo din" |
| 44 px minimum touch target                      | `min-height: 2.75rem` on `.gh-input`                                         |
| Colour never the only error indicator           | Red border + bold "Error:" prefix announced to screen readers                |
| Progressive enhancement                         | `<form method="post" novalidate>` — works without JavaScript                 |
| `/` transfer weight still < 80 KB gzipped       | **28.0 KB** (unchanged — TextInput does not load on `/`)                     |

## Five-gate pipeline

```
pnpm typecheck   → 20/20 ✓  exit 0
pnpm lint        → 20/20 ✓  exit 0
pnpm test        → 21 successful (18 contrast + axe sweep of 3 dist pages)
pnpm build       → 20/20 ✓  exit 0   (3 pages built: /, /internal/buttons/, /internal/text-input/)
pnpm format:check → All matched files use Prettier code style ✓
```

## What shipped

- **`packages/gh-ds/src/components/TextInput/TextInput.astro`** — single
  component implementing the whole label + hint + error + input composite. Props
  cover every native input affordance that matters for a gov form: `name`,
  `label`, `type` (text / email / tel / url / search / password / number),
  `hint`, `error`, `value`, `placeholder`, `required`, `disabled`, `readonly`,
  `autocomplete`, `spellcheck`, `autocapitalize`, `inputmode`, `pattern`,
  `minlength`, `maxlength`, `width` (GOV.UK-scale: full, 30, 20, 10, 5, 4, 3,
  2). Forwards every relevant ARIA attribute automatically (`aria-describedby`
  wiring, `aria-invalid`, `aria-required`).
- **`packages/gh-ds/package.json`** — `@gh/gh-ds/TextInput` added to the exports
  map.
- **`apps/portal/src/pages/internal/text-input.astro`** — gallery at
  `/internal/text-input/` exercising every state: basic, required with hint,
  error state, width modifiers for D/M/Y + postcode + address, input types,
  disabled, Twi fixtures. Noindex via BaseLayout.

## Accessibility decisions

- **Labels are always above the input**, never as placeholders. WCAG 3.3.2
  (Labels or Instructions) and §1 non-negotiable.
- **Hints are rendered before the input** (not after). Screen readers announce
  hints through `aria-describedby` when focus reaches the input, and the visual
  order matches what sighted users scan in reading order.
- **Error messages carry `role="alert"`** so assistive tech announces them on
  mount or change without requiring focus movement. The word "Error:" is
  prepended in a visually-hidden span so the assistive-tech announcement makes
  sense even when colour is dropped (WCAG 1.4.1).
- **Error-state visual cue** is a red left-border on the whole group plus a red
  input border — the GOV.UK Frontend pattern, chosen because the group border
  remains visible while sighted users are scrolling long forms with many errors.
- **Focus ring** is the same composite pattern as Button — outer gold ring
  - inner dark edge — so focus style is consistent across every form control the
    design system will ship.

## Design-system state after PR 5a

Tier-1 foundation list from `.claude/CLAUDE.md §5`:

- ✅ Button (PR 4)
- ✅ Text input (PR 5a — this one)
- ✅ Form label/hint/error composite (PR 5a — this one, shipped as part of
  TextInput)
- ⬜ Textarea — next
- ⬜ Radio
- ⬜ Checkboxes
- ⬜ Select
- ⬜ Date input (D/M/Y)
- ⬜ Error summary
- ⬜ Header (still inline in apps/portal)
- ⬜ Footer (still inline in apps/portal)
- ⬜ Skip-link (still inline in apps/portal)
- ⬜ Back link (Sankofa)

**3 of 13 shipped.** Header/Footer/Skip-link exist but haven't been extracted
into `@gh/gh-ds` yet.

## Known follow-ups

- `packages/gh-ds/src/components/TextInput/README.md` — component doc, due
  before Tier-1 wraps (PR 5x).
- `packages/gh-ds/src/components/Button/README.md` — same, still outstanding
  from PR 4.
- A shared `FormGroup` abstraction factored out of TextInput once Textarea and
  Select land. Duplication is tiny today so no premature extraction.
- Dev-env note: Vitest + Astro Container API integration is still the open
  question from PR 4. Addressed next time with either a pre-compile step via
  `@astrojs/compiler` or a Storybook+interaction-tests setup in
  `apps/design-system/`.

## Your next step — commit

```bash
git add -A
git commit -m "feat(gh-ds): ship TextInput with label/hint/error composite

- packages/gh-ds/src/components/TextInput/TextInput.astro with full prop set
- exports @gh/gh-ds/TextInput via package.json exports map
- apps/portal /internal/text-input/ gallery covers every state + Twi fixture
- axe 0 violations on 3 built pages; / transfer weight unchanged at 28 KB

Delivers Tier-1 Text input + Form label/hint/error composite per
.claude/CLAUDE.md §5 Weeks 3–6. See also: docs/doctrine/pr-5a-handoff.md."
```

## Next PR

Options from the Tier-1 list:

**5b — Textarea.** Natural follow-up; minimal new surface area since it reuses
the same label/hint/error pattern. Unlocks multi-line free-text (e.g. complaint
descriptions, appeal narratives).

**5c — Error summary.** The banner at the top of a page that lists every field
error and jumps to each on click (`<a href="#field-id">`). Unlocks real
form-submit UX — without this, users have to scroll to find each error
individually.

**5d — Radio + Checkboxes as a paired PR.** Both share `<fieldset><legend>`
wrapping and axe gates. Unlocks yes/no and multi-choice form steps.

Recommendation: **5c (Error summary)** next — it pairs with TextInput to
complete the minimum viable form flow (submit → find errors → correct →
resubmit). Then **5d** for choice fields. Textarea can slot in anywhere.

Say "PR 5c" to proceed, or name another.
