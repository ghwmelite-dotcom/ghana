# Hero photography — credits and sourcing status

Per spec §4.4 the homepage hero rotates across three **cultural close-up**
images: Kente weave macro · cocoa pods · brass scales. Distinctly Ghanaian,
warm, editorial, no identifiable faces.

## v1 status — placeholder backdrop

**The Hero component currently renders a CSS gradient backdrop, not real
photography.** This is a deliberate v1-launch trade-off: real macro photography
needs to be sourced (or commissioned) carefully — mediocre stock would undo
every other design decision (see brainstorming session 2026-04-19,
hero-treatment screen). The placeholder ships dignified; the real image upgrade
is a post-launch task.

## Sourcing brief — when ready to swap

For each filename below, source one image meeting all criteria:

- Resolution **≥ 2400 × 1350 px** (16:9) — astro:assets generates responsive
  variants down to 480w.
- Source JPEG **≤ 400 KB** before optimisation.
- Licence: Unsplash Licence, Pexels Licence, CC-BY-4.0, or public domain.
- **No identifiable faces.**
- Warm natural editorial colour — no saturated tourist-brochure treatment.
- Composition reads at thumbnail size; subject fills the frame.

### `kente-macro.jpg`

Macro shot of woven Kente cloth showing the yellow / green / red colour weave
clearly. Bonwire (Ashanti region) origin preferred. Search terms on Unsplash /
Pexels: `kente`, `kente weaving`, `west african textile macro`.

### `cocoa-pods.jpg`

Raw cocoa pods on the tree or harvested in a wooden tray. Warm tones, natural
sunlight. Search terms: `cocoa pods ghana`, `cacao macro`.

### `brass-scales.jpg`

Akan brass goldweights or trade scales (Ashanti craft). Macro composition.
Search terms: `akan goldweights`, `brass weights west africa`. Acceptable
fallback themes: macro `calabash`, macro `talking drum skin`, macro
`adinkra cloth` (note: Adinkra-symbol clearance from Folklore Board may be
needed for stock featuring named symbols — see CLAUDE.md §6.3).

## Workflow when sourcing

1. Save each file to this directory with the exact filename.
2. Update each section above with photographer name + source URL + licence
   - capture location/date if known.
3. Update `apps/portal/src/components/Hero.astro` per Task D2:
   - Restore the `astro:assets` import + variant `<Image>` block.
   - Remove the `hero__image--placeholder` class and the `--placeholder` CSS
     rule.
4. Run `pnpm --filter @gh/portal build` and verify the responsive `<picture>`
   element generates 480 / 960 / 1600 / 2400 widths.
5. Commit: `assets(portal): swap hero placeholder for sourced macros`.
