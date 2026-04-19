# gov.gh v1 foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the engineering foundation (PRs A–E from the spec §13) — a
trimmed monorepo, full route scaffolding, all page layouts + composite blocks,
the finished homepage with cultural-close-up hero photography, and 10 flagship
service pages searchable via Pagefind. At the end of this plan, `gov.gh` is
visibly beautiful, deployable to Cloudflare Pages preview, and ready for content
bulk-fill in a second plan.

**Architecture:** Static Astro site in `apps/portal/` consuming the
already-shipped `@gh/gh-ds` component library. Content lives as markdown with
YAML frontmatter in `src/content/`, validated by Zod via Astro Content
Collections. No runtime JS on any page (except the Pagefind search result page).
Cloudflare Pages is the deploy target. Out of scope for this plan: the remaining
20 services, 21 ministries, 6–10 news articles, 5 boilerplate pages' final copy,
5 Twi stubs — those land in plan 2 (content bulk).

**Tech Stack:** Astro 5 · `@gh/gh-ds` (25 components, already shipped) · Astro
Content Collections + Zod · `astro:assets` for responsive images · Pagefind for
client-side search · jsdom + axe-core for a11y tests · Node's `assert/strict` +
`node --test` for route-resolution tests · pnpm + Turbo monorepo · Cloudflare
Pages + Wrangler.

**Spec reference:** `docs/superpowers/specs/2026-04-19-ghana-gov-v1-design.md`

---

## File structure

### Created

- `docs/adr/004-v1-scope-trimmed-monorepo.md` — decision record for this trim
- `apps/portal/src/content/config.ts` — content-collection schemas (service /
  news / ministry / page)
- `apps/portal/src/content/services/` — 10 service markdown files authored here
- `apps/portal/src/content/news/` — (empty directory with `.gitkeep` — content
  plan 2 fills it)
- `apps/portal/src/content/ministries/` — (empty, `.gitkeep`)
- `apps/portal/src/content/pages/` — (empty, `.gitkeep`)
- `apps/portal/src/layouts/HomepageLayout.astro`
- `apps/portal/src/layouts/CategoryLandingLayout.astro`
- `apps/portal/src/layouts/ServicePageLayout.astro`
- `apps/portal/src/layouts/NewsArticleLayout.astro`
- `apps/portal/src/layouts/MinistryPageLayout.astro`
- `apps/portal/src/layouts/BoilerplatePageLayout.astro`
- `apps/portal/src/components/Hero.astro` — cultural-close-up hero block
- `apps/portal/src/components/LifeStageTiles.astro` — 4-tile category nav
- `apps/portal/src/components/NewsStrip.astro` — homepage news preview
- `apps/portal/src/components/ServiceMetaPanel.astro` — right-rail info on
  service pages
- `apps/portal/src/pages/services/index.astro`
- `apps/portal/src/pages/services/[lifeStage].astro` (matches
  live/work/business/visit)
- `apps/portal/src/pages/services/a-z.astro`
- `apps/portal/src/pages/services/diaspora.astro`
- `apps/portal/src/pages/services/[...slug].astro` (dynamic per-service page)
- `apps/portal/src/pages/news/index.astro`
- `apps/portal/src/pages/news/[year]/[slug].astro`
- `apps/portal/src/pages/ministries/index.astro`
- `apps/portal/src/pages/ministries/[slug].astro`
- `apps/portal/src/pages/about.astro`
- `apps/portal/src/pages/accessibility.astro`
- `apps/portal/src/pages/privacy.astro`
- `apps/portal/src/pages/contact.astro`
- `apps/portal/src/pages/search.astro`
- `apps/portal/src/assets/hero/kente-macro.jpg` — cultural close-up 1
- `apps/portal/src/assets/hero/cocoa-pods.jpg` — cultural close-up 2
- `apps/portal/src/assets/hero/brass-scales.jpg` — cultural close-up 3
- `apps/portal/src/assets/hero/CREDITS.md` — photographer + licence per image
- `apps/portal/scripts/routes-test.mjs` — every URL in spec §3.1 resolves
- `apps/portal/scripts/weight-check.mjs` — gzipped-weight budget
- `packages/gh-ds/src/components/KenteStripe/KenteStripe.astro` — 6px
  flag-colour micro-stripe
- `packages/gh-ds/src/tokens/paper.ts` — paper/paper-line/paper-raised tokens

### Modified

- `pnpm-workspace.yaml` — trim active workspace to `apps/portal`,
  `packages/gh-ds`
- `turbo.json` — drop filters for parked packages
- `apps/portal/package.json` — add `@astrojs/check`, `astro`, `jsdom`,
  `axe-core`, `pagefind` (dev)
- `apps/portal/astro.config.mjs` — enable `prefetch: { strategy: 'hover' }` now
  that multiple pages exist
- `packages/gh-ds/src/tokens/index.ts` — export new paper tokens
- `packages/gh-ds/src/index.ts` — export `KenteStripe`
- `packages/gh-ds/package.json` — export subpath for `KenteStripe`

### Parked (no deletion, removed from active workspace)

- `apps/dashboard/`, `apps/data-portal/`, `apps/design-system/`,
  `apps/ministries/`
- `services/api/`, `services/identity/`, `services/myinfo-gateway/`,
  `services/payments/`, `services/cms-admin/`, `services/search/`,
  `services/webhooks/`, `services/workflows/`
- `packages/i18n/`, `packages/identity-client/`, `packages/myinfo-client/`,
  `packages/payment-client/`, `packages/schemas/`, `packages/telemetry/`

---

## PR A — Monorepo trim

### Task A1: Trim pnpm-workspace.yaml to the v1 surface

**Files:**

- Modify: `pnpm-workspace.yaml`
- Modify: `turbo.json`

- [ ] **Step 1: Read current turbo.json to see what to preserve**

```bash
cat turbo.json
```

Expected: existing pipeline tasks (typecheck, lint, test, build, format). Note
whatever top-level `pipeline` / `tasks` keys are in use.

- [ ] **Step 2: Replace pnpm-workspace.yaml contents**

Overwrite `pnpm-workspace.yaml` with:

```yaml
# v1 active workspace — portal + design system only.
# Parked packages (see docs/adr/004-v1-scope-trimmed-monorepo.md) stay on disk
# but are excluded from pnpm's dependency graph so turbo and CI skip them.
packages:
  - 'apps/portal'
  - 'packages/gh-ds'
```

- [ ] **Step 3: Remove the `private-package-stub` pattern — none of the parked
      dirs need changes**

They keep their existing `package.json` files intact. Because they're no longer
in the workspace glob, pnpm won't install them, turbo won't run their scripts,
and CI skips them. That's the whole mechanism.

- [ ] **Step 4: Re-install to refresh the lockfile**

```bash
pnpm install
```

Expected output ends with `Done in <N>s`; lockfile updates; no errors. Watch for
unexpected dependency drops on `apps/portal` or `packages/gh-ds`.

- [ ] **Step 5: Verify trim took effect**

```bash
pnpm ls --recursive --depth -1 2>&1 | grep -E '^(@gh|apps|services|packages)' | sort
```

Expected: exactly two entries — `@gh/gh-ds` and `@gh/portal`. No `@gh/identity`,
`@gh/api`, `@gh/dashboard`, etc.

- [ ] **Step 6: Commit**

```bash
git add pnpm-workspace.yaml pnpm-lock.yaml
git commit -m "chore: trim pnpm workspace to portal + gh-ds for v1

Parked packages stay on disk (for revival) but are excluded from the
workspace glob so pnpm/turbo/CI ignore them. See docs/adr/004 for rationale.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task A2: Verify the five-gate pipeline is still green after the trim

**Files:**

- No changes expected (verification only).

- [ ] **Step 1: Typecheck**

```bash
pnpm typecheck
```

Expected: `Tasks: 2 successful, 2 total`. Exit 0. (Previously 20, now 2 after
trim.)

- [ ] **Step 2: Lint**

```bash
pnpm lint
```

Expected: `Tasks: 2 successful, 2 total`. Exit 0.

- [ ] **Step 3: Build**

```bash
pnpm build
```

Expected: `Tasks: 2 successful, 2 total`. Both `packages/gh-ds` and
`apps/portal/dist/` produced.

- [ ] **Step 4: Test**

```bash
pnpm test
```

Expected: `Tasks: 2 successful, 2 total`.
`axe-check: 0 blocking violations — PASS` on the portal side. Contrast tests
pass on gh-ds side.

- [ ] **Step 5: Format check**

```bash
pnpm format:check
```

Expected: `All matched files use Prettier code style!`

- [ ] **Step 6: No commit**

This task is verification only — no files changed. If any gate fails, stop and
diagnose. Common cause: a parked package was still referenced by `apps/portal`
or `packages/gh-ds` via `@gh/...` import. If so, restore that one package to the
workspace and document the dependency in ADR-004 before re-trimming.

### Task A3: Write ADR-004

**Files:**

- Create: `docs/adr/004-v1-scope-trimmed-monorepo.md`

- [ ] **Step 1: Create the ADR file**

Write exactly this content:

```markdown
# ADR-004: v1 scope — trimmed monorepo + soft-launch content volume

**Status:** Accepted **Date:** 2026-04-19 **Supersedes:** `.claude/CLAUDE.md §5`
Weeks 11–14 target for v1 launch **References:**
`docs/superpowers/specs/2026-04-19-ghana-gov-v1-design.md`

## Context

`.claude/CLAUDE.md` prescribes a Cloudflare-native 8-service architecture with 5
applications, 25 design-system components, OIDC broker (GhanaConnect), consent
gateway (MyInfoGH), payment abstraction (Hubtel/theTeller/Flutterwave), and full
Twi/Ewe/Ga/Dagbani content parity at v1. A brainstorming session with the
product owner on 2026-04-19 determined this scope is unshippable in any
realistic timeline without a content team, commissioned photography, and agency
integration agreements that don't yet exist.

## Decision

The **v1 launch target** is a soft launch per
`docs/superpowers/specs/2026-04-19-ghana-gov-v1-design.md`: a static
three-pillar portal (front door + 30-service catalogue + 6–10 news items + 21
ministries) on Cloudflare Pages, delivered in ~4–6 weeks. No user accounts, no
forms, no payments, no backend services at v1.

The **active monorepo** is trimmed to:

- `apps/portal/` — the Ghana.gov site
- `packages/gh-ds/` — the 25-component design system (already shipped at commit
  `9176ee2`)

The following packages stay on disk as a forward option but are **removed from
`pnpm-workspace.yaml`** (and therefore skipped by turbo + CI):

- `apps/dashboard/`, `apps/data-portal/`, `apps/design-system/`,
  `apps/ministries/`
- `services/api/`, `services/identity/`, `services/myinfo-gateway/`,
  `services/payments/`, `services/cms-admin/`, `services/search/`,
  `services/webhooks/`, `services/workflows/`
- `packages/i18n/`, `packages/identity-client/`, `packages/myinfo-client/`,
  `packages/payment-client/`, `packages/schemas/`, `packages/telemetry/`

## Consequences

- CI time on every PR drops proportionally (~18 fewer packages to lint / test /
  build).
- Cognitive load on contributors drops — the active code surface is two
  packages, not 21.
- Reviving any parked package is a one-line `pnpm-workspace.yaml` edit plus
  `pnpm install`.
- The elaborate CLAUDE.md doctrine is not deleted — it remains the reference for
  the v2/v3 architecture when/if the platform earns the ambition.

## Alternatives considered

- **Delete parked packages.** Rejected: the scaffolding captures valuable
  architectural thinking (binding names, service shapes, package namespaces)
  that is worth preserving even if not active.
- **Leave everything in the workspace but mark private/skip.** Rejected: adds
  configuration surface area without saving CI time.
```

- [ ] **Step 2: Commit**

```bash
git add docs/adr/004-v1-scope-trimmed-monorepo.md
git commit -m "docs(adr): ADR-004 — v1 scope trimmed monorepo + soft launch

Supersedes CLAUDE.md §5 Weeks 11–14 target. Records the trim done in
the previous commit and the v1 launch definition agreed on 2026-04-19.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## PR B — Routing scaffold + content schemas

### Task B1: Add Astro Content Collections config with Zod schemas

**Files:**

- Create: `apps/portal/src/content/config.ts`
- Create: `apps/portal/src/content/services/.gitkeep`
- Create: `apps/portal/src/content/news/.gitkeep`
- Create: `apps/portal/src/content/ministries/.gitkeep`
- Create: `apps/portal/src/content/pages/.gitkeep`

- [ ] **Step 1: Create empty content directories with .gitkeep**

```bash
mkdir -p apps/portal/src/content/services apps/portal/src/content/news apps/portal/src/content/ministries apps/portal/src/content/pages
```

Write `.gitkeep` (empty file) in each directory. Use the Write tool with empty
string content.

- [ ] **Step 2: Create `apps/portal/src/content/config.ts`**

```ts
/**
 * Astro Content Collections — schema definitions for every content type the
 * portal ships.
 *
 * Schemas enforce the shape documented in
 * docs/superpowers/specs/2026-04-19-ghana-gov-v1-design.md §5. `astro check`
 * fails the build if any markdown file violates its schema.
 */
import { defineCollection, z } from 'astro:content';

const lifeStage = z.enum(['live', 'work', 'business', 'visit']);

const services = defineCollection({
  type: 'content',
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().min(4).max(120),
    lifeStage,
    topics: z.array(z.string()).min(1),
    lede: z.string().min(20).max(300),
    priority: z.number().int().positive(),
    eligibility: z.array(z.object({ text: z.string() })),
    youWillNeed: z.array(z.string()),
    cost: z.object({
      amount: z.number().nonnegative(),
      currency: z.literal('GHS'),
      unit: z.string(),
      notes: z.string().optional(),
    }),
    timeline: z.string(),
    agency: z.object({
      name: z.string(),
      url: z.string().url(),
      phone: z.string().optional(),
    }),
    applyUrl: z.string().url(),
    updatedAt: z.coerce.date(),
    sourceOfTruth: z.string().url(),
    twiSlug: z.string().optional(),
  }),
});

const news = defineCollection({
  type: 'content',
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().min(4).max(160),
    lede: z.string().min(20).max(400),
    publishedAt: z.coerce.date(),
    ministry: z.string(),
    author: z.string(),
    heroImage: z.string().optional(),
    topics: z.array(z.string()).default([]),
  }),
});

const ministries = defineCollection({
  type: 'content',
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string().min(4),
    shortName: z.string().optional(),
    minister: z.string().optional(),
    deputyMinister: z.string().optional(),
    parentGovernment: z.enum([
      'Executive',
      'Legislature',
      'Judiciary',
      'Independent',
    ]),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    website: z.string().url().optional(),
    address: z.string().optional(),
    mandate: z.string(),
    departments: z.array(z.string()).default([]),
    keyServices: z.array(z.string()).default([]),
  }),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string(),
    lede: z.string(),
    updatedAt: z.coerce.date(),
  }),
});

export const collections = { services, news, ministries, pages };
```

- [ ] **Step 3: Build to verify the schema compiles**

```bash
pnpm --filter @gh/portal build
```

Expected: build succeeds. The content collection config is picked up
automatically; with no content files yet, collections are empty but the schema
parses.

- [ ] **Step 4: Typecheck**

```bash
pnpm --filter @gh/portal typecheck
```

Expected: exit 0. (This confirms the Zod types resolve without any markdown
files present.)

- [ ] **Step 5: Commit**

```bash
git add apps/portal/src/content/
git commit -m "feat(portal): add content collection schemas (service/news/ministry/page)

Zod schemas match the v1 spec §5 content model. No content files yet —
the schema is validated at build time so any future markdown that
violates the shape fails CI.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task B2: Create route stubs for every URL in spec §3.1

**Files:**

- Create: `apps/portal/src/pages/services/index.astro`
- Create: `apps/portal/src/pages/services/[lifeStage].astro`
- Create: `apps/portal/src/pages/services/a-z.astro`
- Create: `apps/portal/src/pages/services/diaspora.astro`
- Create: `apps/portal/src/pages/services/[...slug].astro`
- Create: `apps/portal/src/pages/news/index.astro`
- Create: `apps/portal/src/pages/news/[year]/[slug].astro`
- Create: `apps/portal/src/pages/ministries/index.astro`
- Create: `apps/portal/src/pages/ministries/[slug].astro`
- Create: `apps/portal/src/pages/about.astro`
- Create: `apps/portal/src/pages/accessibility.astro`
- Create: `apps/portal/src/pages/privacy.astro`
- Create: `apps/portal/src/pages/contact.astro`
- Create: `apps/portal/src/pages/search.astro`

- [ ] **Step 1: Create services index stub**

`apps/portal/src/pages/services/index.astro`:

```astro
---
/**
 * Services index — life-stage tiles + link to A–Z topic index.
 * v1 stub: renders the 4 life-stage names. Full tile composition
 * lands in PR C (CategoryLandingLayout + LifeStageTiles block).
 */
import Layout from '../../layouts/BaseLayout.astro';

const stages = [
  { slug: 'live', label: 'Live' },
  { slug: 'work', label: 'Work' },
  { slug: 'business', label: 'Do business' },
  { slug: 'visit', label: 'Visit' },
];
---

<Layout
  title="Services"
  description="Every service the government of Ghana offers."
>
  <h1>Services</h1>
  <ul>
    {
      stages.map((s) => (
        <li>
          <a href={`/services/${s.slug}/`}>{s.label}</a>
        </li>
      ))
    }
    <li><a href="/services/a-z/">A–Z index</a></li>
    <li><a href="/services/diaspora/">Diaspora</a></li>
  </ul>
</Layout>
```

- [ ] **Step 2: Create life-stage dynamic route**

`apps/portal/src/pages/services/[lifeStage].astro`:

```astro
---
/**
 * Life-stage category landing — /services/live|work|business|visit.
 * v1 stub: prerenders the 4 known stages. Full implementation in PR C.
 */
import Layout from '../../layouts/BaseLayout.astro';

export function getStaticPaths() {
  return [
    { params: { lifeStage: 'live' } },
    { params: { lifeStage: 'work' } },
    { params: { lifeStage: 'business' } },
    { params: { lifeStage: 'visit' } },
  ];
}

const { lifeStage } = Astro.params;
const titles: Record<string, string> = {
  live: 'Live',
  work: 'Work',
  business: 'Do business',
  visit: 'Visit',
};
const label = titles[lifeStage as string] ?? 'Services';
---

<Layout
  title={label}
  description={`Services for when you ${label.toLowerCase()}.`}
>
  <h1>{label}</h1>
  <p>Services in this category land here. Full content in plan 2.</p>
  <p><a href="/services/">← All services</a></p>
</Layout>
```

- [ ] **Step 3: Create the remaining static service routes**

`apps/portal/src/pages/services/a-z.astro`:

```astro
---
import Layout from '../../layouts/BaseLayout.astro';
---

<Layout
  title="A–Z index"
  description="Every government service in alphabetical order."
>
  <h1>A–Z index</h1>
  <p>Alphabetical listing of every service. Populated in PR E.</p>
</Layout>
```

`apps/portal/src/pages/services/diaspora.astro`:

```astro
---
import Layout from '../../layouts/BaseLayout.astro';
---

<Layout title="Diaspora" description="Services for Ghanaians abroad.">
  <h1>Ghanaian diaspora</h1>
  <p>Curated for Ghanaians living abroad. Populated in plan 2.</p>
</Layout>
```

- [ ] **Step 4: Create the per-service dynamic route**

`apps/portal/src/pages/services/[...slug].astro`:

```astro
---
/**
 * Per-service page — /services/{service-slug}/.
 *
 * Uses a rest-slug dynamic route so nested paths like /services/renew-passport/
 * resolve. In v1 we author flat slugs (no nesting) but the rest pattern is
 * future-proof.
 *
 * getStaticPaths excludes any slug that collides with a sibling static page
 * (a-z, diaspora, live, work, business, visit).
 */
import { getCollection } from 'astro:content';
import Layout from '../../layouts/BaseLayout.astro';

const RESERVED = new Set([
  'a-z',
  'diaspora',
  'live',
  'work',
  'business',
  'visit',
]);

export async function getStaticPaths() {
  const all = await getCollection('services');
  return all
    .filter((entry) => !RESERVED.has(entry.data.slug))
    .map((entry) => ({
      params: { slug: entry.data.slug },
      props: { entry },
    }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
---

<Layout title={entry.data.title} description={entry.data.lede}>
  <h1>{entry.data.title}</h1>
  <p>{entry.data.lede}</p>
  <Content />
  <p><a href="/services/">← All services</a></p>
</Layout>
```

- [ ] **Step 5: Create news routes**

`apps/portal/src/pages/news/index.astro`:

```astro
---
import Layout from '../../layouts/BaseLayout.astro';
---

<Layout title="News" description="Latest from the government of Ghana.">
  <h1>News</h1>
  <p>Latest news from across government. Populated in plan 2.</p>
</Layout>
```

`apps/portal/src/pages/news/[year]/[slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const all = await getCollection('news');
  return all.map((entry) => ({
    params: {
      year: String(entry.data.publishedAt.getFullYear()),
      slug: entry.data.slug,
    },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
---

<Layout title={entry.data.title} description={entry.data.lede}>
  <h1>{entry.data.title}</h1>
  <p><em>{entry.data.lede}</em></p>
  <Content />
</Layout>
```

- [ ] **Step 6: Create ministry routes**

`apps/portal/src/pages/ministries/index.astro`:

```astro
---
import Layout from '../../layouts/BaseLayout.astro';
---

<Layout title="Ministries" description="All 21 ministries of Ghana.">
  <h1>Ministries</h1>
  <p>The 21 ministries of government. Populated in plan 2.</p>
</Layout>
```

`apps/portal/src/pages/ministries/[slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const all = await getCollection('ministries');
  return all.map((entry) => ({
    params: { slug: entry.data.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
---

<Layout title={entry.data.name} description={entry.data.mandate.slice(0, 160)}>
  <h1>{entry.data.name}</h1>
  <p>{entry.data.mandate}</p>
  <Content />
</Layout>
```

- [ ] **Step 7: Create 5 boilerplate page stubs**

For each of `about.astro`, `accessibility.astro`, `privacy.astro`,
`contact.astro`, `search.astro`, create the file under `apps/portal/src/pages/`
with this pattern (substitute title/description per page):

```astro
---
import Layout from '../layouts/BaseLayout.astro';
---

<Layout title="About" description="About the national portal of Ghana.">
  <h1>About</h1>
  <p>Copy lands in plan 2.</p>
</Layout>
```

Page-specific titles/descriptions:

- `about.astro` — title `"About"`, description
  `"About the national portal of Ghana."`
- `accessibility.astro` — title `"Accessibility"`, description
  `"Accessibility statement for gov.gh."`
- `privacy.astro` — title `"Privacy"`, description
  `"How gov.gh handles your information."`
- `contact.astro` — title `"Contact"`, description
  `"How to reach the Office of the Head of Civil Service."`
- `search.astro` — title `"Search"`, description
  `"Search every service, news item, and ministry on gov.gh."`

- [ ] **Step 8: Build + axe sweep**

```bash
pnpm --filter @gh/portal build
pnpm --filter @gh/portal test
```

Expected: build succeeds, `axe-check: scanning N HTML file(s)…` where N is at
least 14 (5 life-stage/index/a-z/diaspora service pages + news index +
ministries index + 5 boilerplate + existing homepage + any internal galleries).
`0 blocking violations — PASS`.

- [ ] **Step 9: Commit**

```bash
git add apps/portal/src/pages/ apps/portal/src/content/
git commit -m "feat(portal): scaffold every v1 route from spec §3.1

Services (index, 4 life-stages, a-z, diaspora, [...slug]),
News (index, [year]/[slug]), Ministries (index, [slug]),
and 5 boilerplate pages (about/accessibility/privacy/contact/search).
Every URL in the spec resolves to a stub; content lands in later PRs.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task B3: Add a route-resolution test

**Files:**

- Create: `apps/portal/scripts/routes-test.mjs`
- Modify: `apps/portal/package.json` (add `test:routes` script + wire into
  `test`)

- [ ] **Step 1: Read current `apps/portal/package.json` scripts block to see the
      existing `test` script**

```bash
cat apps/portal/package.json
```

Note the `test` script value (likely
`node --experimental-strip-types scripts/axe-check.mjs`).

- [ ] **Step 2: Write the route-resolution test**

`apps/portal/scripts/routes-test.mjs`:

```js
#!/usr/bin/env node
/**
 * Verifies every URL required by the v1 spec §3.1 exists in the build output.
 * Reads `dist/` and asserts each expected path has an `index.html` file.
 *
 * Why this exists: catches regressions where a route file is accidentally
 * deleted, renamed, or fails to compile without manifesting as a 404 until
 * production.
 */
import { readFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, '..', 'dist');

// URLs that must exist even when content collections are empty (stubs OK).
const REQUIRED = [
  '/',
  '/services/',
  '/services/live/',
  '/services/work/',
  '/services/business/',
  '/services/visit/',
  '/services/a-z/',
  '/services/diaspora/',
  '/news/',
  '/ministries/',
  '/about/',
  '/accessibility/',
  '/privacy/',
  '/contact/',
  '/search/',
];

async function check(url) {
  const file = join(dist, url.replace(/\/$/, '/index.html').replace(/^\//, ''));
  try {
    const s = await stat(file);
    if (!s.isFile()) throw new Error('not a file');
    const html = await readFile(file, 'utf8');
    if (!html.includes('<html')) throw new Error('not valid HTML');
    return { url, ok: true };
  } catch (err) {
    return { url, ok: false, reason: err.message };
  }
}

const results = await Promise.all(REQUIRED.map(check));
const failed = results.filter((r) => !r.ok);

for (const r of results) {
  console.log(`  ${r.ok ? '✓' : '✗'} ${r.url}${r.ok ? '' : ' — ' + r.reason}`);
}

if (failed.length > 0) {
  console.error(`\nroutes-test: ${failed.length} missing — FAIL`);
  process.exit(1);
}
console.log(`\nroutes-test: ${results.length} routes resolved — PASS`);
```

- [ ] **Step 3: Wire the test into the portal's test pipeline**

Edit `apps/portal/package.json`. Replace the existing `test` script so it runs
both axe AND routes. Example (adjust to preserve any existing flags):

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "typecheck": "astro check",
  "lint": "eslint --ext .ts,.mjs,.astro src",
  "test": "node scripts/routes-test.mjs && node --experimental-strip-types scripts/axe-check.mjs"
}
```

(If the pre-existing `test` script already uses `&&` chaining, prepend
`node scripts/routes-test.mjs && `.)

- [ ] **Step 4: Run the test**

```bash
pnpm --filter @gh/portal build && pnpm --filter @gh/portal test
```

Expected: `routes-test: 15 routes resolved — PASS`, then `axe-check: … — PASS`.

- [ ] **Step 5: Commit**

```bash
git add apps/portal/scripts/routes-test.mjs apps/portal/package.json
git commit -m "test(portal): assert every spec §3.1 URL resolves in dist/

Runs before axe-check in the portal's test script. Exits 1 if any
required route is missing — catches regressions where a page file is
accidentally deleted or fails to compile.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task B4: Verify the whole five-gate at workspace root

**Files:**

- No changes (verification only).

- [ ] **Step 1: Full root pipeline**

```bash
pnpm typecheck && pnpm lint && pnpm build && pnpm test && pnpm format:check
```

Expected: every gate exits 0. If `format:check` fails, run `pnpm format` then
re-commit. If `axe-check` fails on one of the new stub pages, inspect the
violation and either fix markup (preferred) or defer to the layouts PR noting
the specific violation in the task.

- [ ] **Step 2: Tag this state**

```bash
git tag v1-pr-b-complete
```

No push — the tag is local, a checkpoint for rollback if PR C regresses
something.

---

## PR C — Design tokens + page layouts + composite blocks

### Task C1: Add paper tokens to the design system

**Files:**

- Create: `packages/gh-ds/src/tokens/paper.ts`
- Modify: `packages/gh-ds/src/tokens/index.ts` (export `paper`)

- [ ] **Step 1: Write the token file**

`packages/gh-ds/src/tokens/paper.ts`:

```ts
/**
 * Paper surface tokens — the "Refined warmth" visual direction from
 * docs/superpowers/specs/2026-04-19-ghana-gov-v1-design.md §4.1.
 *
 * `paper` is the page background — a warm off-white that sets the whole
 * portal's tone. `paperLine` is the hairline border used on card edges and
 * dividers. `paperRaised` is pure white for elevated cards that need to lift
 * above the paper ground.
 */
export const paper = {
  DEFAULT: '#FAF7F2', // page background
  line: '#E5E0D6', // hairline borders
  raised: '#FFFFFF', // elevated cards
} as const;
```

- [ ] **Step 2: Re-export from token barrel**

Edit `packages/gh-ds/src/tokens/index.ts`. Append:

```ts
export { paper } from './paper';
```

(Do not remove existing exports.)

- [ ] **Step 3: Contrast test sanity-check**

```bash
pnpm --filter @gh/gh-ds test
```

Expected: existing contrast tests still pass. The new paper tokens are surface
colours not foreground pairs, so no new contrast-pair entry is required.

- [ ] **Step 4: Build gh-ds**

```bash
pnpm --filter @gh/gh-ds build
```

Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add packages/gh-ds/src/tokens/paper.ts packages/gh-ds/src/tokens/index.ts
git commit -m "feat(gh-ds): add paper surface tokens (Refined warmth direction)

Three tokens — paper (bg), paper.line (hairline), paper.raised (elevated
cards) — per spec §4.1. Used by KenteStripe and every v1 page layout.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task C2: Ship the KenteStripe component

**Files:**

- Create: `packages/gh-ds/src/components/KenteStripe/KenteStripe.astro`
- Modify: `packages/gh-ds/src/components/index.ts` (export)
- Modify: `packages/gh-ds/package.json` (subpath export)

- [ ] **Step 1: Write the component**

`packages/gh-ds/src/components/KenteStripe/KenteStripe.astro`:

```astro
---
/**
 * <KenteStripe /> — a 6-8px horizontal micro-stripe of repeating flag colours
 * (red / gold / green / black) used at the very top edge of every page as
 * the one decorative flag-colour moment, per spec §4.3.
 *
 * Hard rules (from `.claude/CLAUDE.md §6.3`):
 *   - Maximum 8 px tall. Default 6 px.
 *   - Only at the top edge of a page. Never repeated.
 *   - Never behind body text. Never as wallpaper.
 *   - Purely decorative: `aria-hidden="true"` because the flag colours are
 *     not announced to screen readers.
 *
 * Usage:
 *   <KenteStripe />
 */

interface Props {
  /** Stripe height in px. Clamped to [4, 8]. Default 6. */
  height?: number;
}

const { height = 6 } = Astro.props;
const h = Math.max(4, Math.min(8, height));
---

<div class="gh-kente-stripe" aria-hidden="true" style={`height:${h}px`}></div>

<style>
  .gh-kente-stripe {
    background: repeating-linear-gradient(
      90deg,
      #006b3f 0 14px,
      #fcd116 14px 22px,
      #ce1126 22px 32px,
      #000000 32px 38px
    );
    width: 100%;
  }
</style>
```

- [ ] **Step 2: Barrel export**

Edit `packages/gh-ds/src/components/index.ts`. Add the line (alphabetically with
existing exports):

```ts
export { default as KenteStripe } from './KenteStripe/KenteStripe.astro';
```

- [ ] **Step 3: Subpath export in package.json**

Edit `packages/gh-ds/package.json`. In the `exports` block, add:

```json
"./KenteStripe": "./src/components/KenteStripe/KenteStripe.astro",
```

Preserve alphabetical order with existing subpaths.

- [ ] **Step 4: Build gh-ds**

```bash
pnpm --filter @gh/gh-ds build
```

Expected: exit 0.

- [ ] **Step 5: Lint**

```bash
pnpm --filter @gh/gh-ds lint
```

Expected: exit 0.

- [ ] **Step 6: Commit**

```bash
git add packages/gh-ds/src/components/KenteStripe/ packages/gh-ds/src/components/index.ts packages/gh-ds/package.json
git commit -m "feat(gh-ds): ship KenteStripe — 6px flag-colour top-edge micro-stripe

The one decorative flag-colour moment on every v1 page, per spec §4.3 +
CLAUDE.md §6.3. aria-hidden (decorative only), clamped [4, 8] px.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task C3: Build BaseLayout for the portal v1

**Files:**

- Modify: `apps/portal/src/layouts/BaseLayout.astro`

- [ ] **Step 1: Read current BaseLayout**

```bash
cat apps/portal/src/layouts/BaseLayout.astro
```

Note the existing structure — it already contains `<Header>` and `<Footer>` from
`@gh/gh-ds`.

- [ ] **Step 2: Overwrite with the v1 BaseLayout**

Write `apps/portal/src/layouts/BaseLayout.astro`:

```astro
---
/**
 * v1 BaseLayout — the root layout every page extends.
 *
 * Visual contract (spec §4):
 *   - <KenteStripe /> at the top edge.
 *   - Paper background (--ghana-paper).
 *   - Georgia display + Inter body fonts already loaded by @gh/gh-ds.
 *   - <Header> and <Footer> from @gh/gh-ds.
 *   - No runtime JS by default. Any page that needs JS opts in via <script>
 *     with `is:inline` on a per-page basis.
 */
import { SkipLink } from '@gh/gh-ds';
import Header from '@gh/gh-ds/Header';
import Footer from '@gh/gh-ds/Footer';
import KenteStripe from '@gh/gh-ds/KenteStripe';
import '@gh/gh-ds/styles/global.css';
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
const fullTitle =
  title === 'Home' ? 'gov.gh — Republic of Ghana' : `${title} · gov.gh`;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>{fullTitle}</title>
    <meta name="description" content={description} />
    <meta name="robots" content="index,follow" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  </head>
  <body>
    <KenteStripe />
    <SkipLink href="#main" label="Skip to main content" />
    <Header
      brand="Ghana"
      serviceName="Government of Ghana"
      navItems={[
        { href: '/services/', label: 'Services' },
        { href: '/news/', label: 'News' },
        { href: '/ministries/', label: 'Ministries' },
        { href: '/about/', label: 'About' },
      ]}
    />
    <main id="main" class="gov-main">
      <slot />
    </main>
    <Footer
      organisation="Republic of Ghana"
      parentLink={{
        href: 'https://ohcs.gov.gh',
        label: 'Office of the Head of Civil Service',
      }}
      links={[
        { href: '/about/', label: 'About' },
        { href: '/privacy/', label: 'Privacy' },
        { href: '/accessibility/', label: 'Accessibility' },
        { href: '/contact/', label: 'Contact' },
      ]}
    />
  </body>
</html>

<style is:global>
  body {
    background: var(--ghana-paper, #faf7f2);
  }
  .gov-main {
    max-width: 72rem;
    margin: 0 auto;
    padding: 2rem 1.25rem 4rem;
  }
</style>
```

NOTE: If the `@gh/gh-ds/Header` props in the existing gh-ds differ from what's
shown here, match the existing signature rather than invent — this layout is the
consumer, not the authoring site.

- [ ] **Step 3: Build portal**

```bash
pnpm --filter @gh/portal build
```

Expected: exit 0. If a Header/Footer prop mismatch errors, read
`packages/gh-ds/src/components/Header/Header.astro` and adjust the props in
BaseLayout to match.

- [ ] **Step 4: Test (axe + routes)**

```bash
pnpm --filter @gh/portal test
```

Expected: both tests pass.

- [ ] **Step 5: Commit**

```bash
git add apps/portal/src/layouts/BaseLayout.astro
git commit -m "feat(portal): BaseLayout adopts KenteStripe + paper background

v1 chrome: Kente micro-stripe at top edge, paper background, Header + Footer
from @gh/gh-ds wired with the 4-item primary nav (Services / News /
Ministries / About). Per spec §4.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task C4: Build the 5 specialised page layouts

**Files:**

- Create: `apps/portal/src/layouts/HomepageLayout.astro`
- Create: `apps/portal/src/layouts/CategoryLandingLayout.astro`
- Create: `apps/portal/src/layouts/ServicePageLayout.astro`
- Create: `apps/portal/src/layouts/NewsArticleLayout.astro`
- Create: `apps/portal/src/layouts/MinistryPageLayout.astro`
- Create: `apps/portal/src/layouts/BoilerplatePageLayout.astro`

- [ ] **Step 1: HomepageLayout**

`apps/portal/src/layouts/HomepageLayout.astro`:

```astro
---
/**
 * Homepage-only layout. Removes the centred `.gov-main` max-width so the hero
 * and tiles can go full-bleed.
 */
import BaseLayout from './BaseLayout.astro';

interface Props {
  title: string;
  description: string;
}
const { title, description } = Astro.props;
---

<BaseLayout title={title} description={description}>
  <slot />
</BaseLayout>

<style is:global>
  /* Homepage overrides the container so blocks can go full-bleed. */
  body.homepage .gov-main {
    max-width: none;
    padding: 0;
  }
</style>
```

- [ ] **Step 2: CategoryLandingLayout**

`apps/portal/src/layouts/CategoryLandingLayout.astro`:

```astro
---
/**
 * Category landing — /services/live|work|business|visit and /services/diaspora.
 * Layout: breadcrumb, big title + lede, then a grid of service cards.
 */
import BaseLayout from './BaseLayout.astro';
import Breadcrumb from '@gh/gh-ds/Breadcrumb';

interface Props {
  title: string;
  description: string;
  lede: string;
  breadcrumbs: Array<{ href: string; label: string }>;
}
const { title, description, lede, breadcrumbs } = Astro.props;
---

<BaseLayout title={title} description={description}>
  <Breadcrumb items={breadcrumbs} current={title} />
  <header class="category-header">
    <h1>{title}</h1>
    <p class="lede">{lede}</p>
  </header>
  <slot />
</BaseLayout>

<style>
  .category-header {
    margin-bottom: 2rem;
  }
  .category-header h1 {
    font-family: Georgia, 'Playfair Display', serif;
    font-size: clamp(2rem, 5vw, 3rem);
    line-height: 1.05;
    color: var(--ghana-green-700, #004527);
    margin: 0 0 0.75rem;
  }
  .lede {
    font-size: 1.125rem;
    color: var(--ghana-ink-600, #3e424a);
    max-width: 54ch;
  }
</style>
```

- [ ] **Step 3: ServicePageLayout**

`apps/portal/src/layouts/ServicePageLayout.astro`:

```astro
---
/**
 * Service page — two-column on desktop (main copy + right-rail meta panel),
 * stacked on mobile.
 */
import BaseLayout from './BaseLayout.astro';
import Breadcrumb from '@gh/gh-ds/Breadcrumb';
import ServiceMetaPanel from '../components/ServiceMetaPanel.astro';
import type { CollectionEntry } from 'astro:content';

interface Props {
  entry: CollectionEntry<'services'>;
}
const { entry } = Astro.props;
const { data } = entry;
const lifeStageLabels: Record<string, string> = {
  live: 'Live',
  work: 'Work',
  business: 'Do business',
  visit: 'Visit',
};
---

<BaseLayout title={data.title} description={data.lede}>
  <Breadcrumb
    items={[
      { href: '/', label: 'Home' },
      { href: '/services/', label: 'Services' },
      {
        href: `/services/${data.lifeStage}/`,
        label: lifeStageLabels[data.lifeStage],
      },
    ]}
    current={data.title}
  />
  <div class="service-grid">
    <article>
      <h1>{data.title}</h1>
      <p class="lede">{data.lede}</p>
      <slot />
    </article>
    <aside>
      <ServiceMetaPanel data={data} />
    </aside>
  </div>
</BaseLayout>

<style>
  .service-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
  }
  @media (min-width: 56rem) {
    .service-grid {
      grid-template-columns: minmax(0, 1fr) 20rem;
    }
  }
  article h1 {
    font-family: Georgia, 'Playfair Display', serif;
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    line-height: 1.1;
    color: var(--ghana-green-700, #004527);
    margin: 0 0 0.75rem;
  }
  article .lede {
    font-size: 1.125rem;
    color: var(--ghana-ink-600, #3e424a);
    margin: 0 0 1.5rem;
  }
</style>
```

- [ ] **Step 4: NewsArticleLayout**

`apps/portal/src/layouts/NewsArticleLayout.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';
import Breadcrumb from '@gh/gh-ds/Breadcrumb';
import type { CollectionEntry } from 'astro:content';

interface Props {
  entry: CollectionEntry<'news'>;
}
const { entry } = Astro.props;
const { data } = entry;
const formatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
---

<BaseLayout title={data.title} description={data.lede}>
  <Breadcrumb
    items={[
      { href: '/', label: 'Home' },
      { href: '/news/', label: 'News' },
    ]}
    current={data.title}
  />
  <article class="article">
    <p class="eyebrow">
      {data.ministry.toUpperCase()} · {formatter.format(data.publishedAt)}
    </p>
    <h1>{data.title}</h1>
    <p class="lede">{data.lede}</p>
    <slot />
    <footer class="byline">By {data.author}</footer>
  </article>
</BaseLayout>

<style>
  .article {
    max-width: 40rem;
    margin: 0 auto;
  }
  .eyebrow {
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    color: var(--ghana-red-700, #820b18);
    font-weight: 600;
    margin: 0 0 0.5rem;
  }
  h1 {
    font-family: Georgia, serif;
    font-size: clamp(1.75rem, 4vw, 2.75rem);
    line-height: 1.1;
    margin: 0 0 0.75rem;
    color: var(--ghana-green-700, #004527);
  }
  .lede {
    font-size: 1.25rem;
    color: var(--ghana-ink-600, #3e424a);
    font-style: italic;
    margin: 0 0 1.75rem;
  }
  .byline {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid var(--ghana-paper-line, #e5e0d6);
    font-size: 0.875rem;
    color: var(--ghana-ink-500, #5b5f68);
  }
</style>
```

- [ ] **Step 5: MinistryPageLayout**

`apps/portal/src/layouts/MinistryPageLayout.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';
import Breadcrumb from '@gh/gh-ds/Breadcrumb';
import type { CollectionEntry } from 'astro:content';

interface Props {
  entry: CollectionEntry<'ministries'>;
}
const { entry } = Astro.props;
const { data } = entry;
---

<BaseLayout title={data.name} description={data.mandate.slice(0, 160)}>
  <Breadcrumb
    items={[
      { href: '/', label: 'Home' },
      { href: '/ministries/', label: 'Ministries' },
    ]}
    current={data.name}
  />
  <header>
    <h1>{data.name}</h1>
    <p class="mandate">{data.mandate}</p>
  </header>
  <div class="ministry-grid">
    <section class="main">
      <slot />
    </section>
    <aside class="contact">
      <h2>Contact</h2>
      <dl>
        {
          data.minister && (
            <>
              <>
                <dt>Minister</dt>
                <dd>{data.minister}</dd>
              </>
            </>
          )
        }
        {
          data.phone && (
            <>
              <>
                <dt>Phone</dt>
                <dd>{data.phone}</dd>
              </>
            </>
          )
        }
        {
          data.email && (
            <>
              <>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${data.email}`}>{data.email}</a>
                </dd>
              </>
            </>
          )
        }
        {
          data.website && (
            <>
              <>
                <dt>Website</dt>
                <dd>
                  <a href={data.website}>{data.website}</a>
                </dd>
              </>
            </>
          )
        }
        {
          data.address && (
            <>
              <>
                <dt>Address</dt>
                <dd>{data.address}</dd>
              </>
            </>
          )
        }
      </dl>
    </aside>
  </div>
</BaseLayout>

<style>
  h1 {
    font-family: Georgia, serif;
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    color: var(--ghana-green-700, #004527);
    margin: 0 0 0.75rem;
  }
  .mandate {
    font-size: 1.125rem;
    color: var(--ghana-ink-600, #3e424a);
    max-width: 54ch;
    margin: 0 0 2rem;
  }
  .ministry-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
  }
  @media (min-width: 56rem) {
    .ministry-grid {
      grid-template-columns: minmax(0, 1fr) 18rem;
    }
  }
  .contact h2 {
    font-family: Georgia, serif;
    font-size: 1.25rem;
    margin: 0 0 0.5rem;
  }
  .contact dl {
    margin: 0;
  }
  .contact dt {
    font-weight: 600;
    margin-top: 0.75rem;
    font-size: 0.875rem;
    color: var(--ghana-ink-500, #5b5f68);
  }
  .contact dd {
    margin: 0.125rem 0 0;
    font-size: 0.9375rem;
  }
</style>
```

- [ ] **Step 6: BoilerplatePageLayout**

`apps/portal/src/layouts/BoilerplatePageLayout.astro`:

```astro
---
/**
 * Boilerplate layout for About / Accessibility / Privacy / Contact / Diaspora
 * and the search-results page. Long-form centred reading column.
 */
import BaseLayout from './BaseLayout.astro';
import Breadcrumb from '@gh/gh-ds/Breadcrumb';

interface Props {
  title: string;
  description: string;
  lede?: string;
  updatedAt?: Date;
}
const { title, description, lede, updatedAt } = Astro.props;
const formatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
---

<BaseLayout title={title} description={description}>
  <Breadcrumb items={[{ href: '/', label: 'Home' }]} current={title} />
  <article class="boilerplate">
    <h1>{title}</h1>
    {lede && <p class="lede">{lede}</p>}
    <slot />
    {
      updatedAt && (
        <p class="updated">Last updated {formatter.format(updatedAt)}.</p>
      )
    }
  </article>
</BaseLayout>

<style>
  .boilerplate {
    max-width: 40rem;
    margin: 0 auto;
  }
  h1 {
    font-family: Georgia, serif;
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    line-height: 1.1;
    color: var(--ghana-green-700, #004527);
    margin: 0 0 0.75rem;
  }
  .lede {
    font-size: 1.125rem;
    color: var(--ghana-ink-600, #3e424a);
    margin: 0 0 1.5rem;
  }
  .updated {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid var(--ghana-paper-line, #e5e0d6);
    font-size: 0.875rem;
    color: var(--ghana-ink-500, #5b5f68);
  }
</style>
```

- [ ] **Step 7: Build + test + commit**

```bash
pnpm --filter @gh/portal build && pnpm --filter @gh/portal test
```

Expected: both pass. Layouts aren't consumed yet by any page (the stubs still
use BaseLayout directly) so no visual change.

```bash
git add apps/portal/src/layouts/
git commit -m "feat(portal): 5 specialised page layouts

Homepage (full-bleed), CategoryLanding, ServicePage (2-col grid),
NewsArticle (reading-column), Ministry (contact rail), Boilerplate
(reading-column). Consumed in subsequent PRs.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task C5: Build the 4 composite blocks (Hero, LifeStageTiles, NewsStrip, ServiceMetaPanel)

**Files:**

- Create: `apps/portal/src/components/Hero.astro`
- Create: `apps/portal/src/components/LifeStageTiles.astro`
- Create: `apps/portal/src/components/NewsStrip.astro`
- Create: `apps/portal/src/components/ServiceMetaPanel.astro`

- [ ] **Step 1: Hero composite block**

`apps/portal/src/components/Hero.astro`:

```astro
---
/**
 * Homepage Hero — cultural close-up image rotated across 3 sources per spec §4.4.
 * Tagline + lede overlaid on a dark scrim for contrast. Search box anchored to
 * the bottom. Full-bleed.
 *
 * The image is chosen at build time from a pool by hashing the page URL — this
 * gives a stable-but-varied hero across preview deploys without runtime JS.
 */
import { Image } from 'astro:assets';
import kente from '../assets/hero/kente-macro.jpg';
import cocoa from '../assets/hero/cocoa-pods.jpg';
import brass from '../assets/hero/brass-scales.jpg';

interface Props {
  /** Tagline — Georgia display serif, 2-line max. */
  tagline: string;
  /** Short sub-head under the tagline. */
  lede: string;
  /** Which of the 3 heroes to render. */
  variant?: 'kente' | 'cocoa' | 'brass';
}

const { tagline, lede, variant = 'kente' } = Astro.props;
const sources: Record<NonNullable<Props['variant']>, typeof kente> = {
  kente,
  cocoa,
  brass,
};
const heroImage = sources[variant];
const credits: Record<NonNullable<Props['variant']>, string> = {
  kente: 'Kente weaving · Bonwire',
  cocoa: 'Cocoa pods · Kumasi region',
  brass: 'Brass scales · Ashanti craft',
};
---

<section class="hero" aria-labelledby="hero-title">
  <Image
    src={heroImage}
    alt=""
    widths={[480, 960, 1600, 2400]}
    sizes="100vw"
    loading="eager"
    fetchpriority="high"
    class="hero-image"
  />
  <div class="scrim"></div>
  <div class="hero-content">
    <p class="eyebrow">· Akwaaba ·</p>
    <h1 id="hero-title" set:html={tagline} />
    <p class="lede">{lede}</p>
    <form action="/search/" method="get" role="search" class="hero-search">
      <label class="sr-only" for="hero-q">Search the portal</label>
      <input
        id="hero-q"
        name="q"
        type="search"
        placeholder="I am looking for…"
        autocomplete="off"
      />
      <button type="submit">Search</button>
    </form>
  </div>
  <p class="credit">{credits[variant]}</p>
</section>

<style>
  .hero {
    position: relative;
    overflow: hidden;
    min-height: 60vh;
    max-height: 680px;
    display: grid;
  }
  .hero-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .scrim {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 26, 14, 0.25) 0%,
      rgba(0, 26, 14, 0.7) 100%
    );
  }
  .hero-content {
    position: relative;
    padding: 3rem 1.5rem 5rem;
    max-width: 48rem;
    margin: auto 0;
    color: #faf7f2;
  }
  .eyebrow {
    font-size: 0.75rem;
    letter-spacing: 0.25em;
    color: var(--ghana-gold-400, #fcd116);
    text-transform: uppercase;
    margin: 0 0 0.75rem;
  }
  h1 {
    font-family: Georgia, 'Playfair Display', serif;
    font-size: clamp(2.25rem, 6vw, 4rem);
    line-height: 1.02;
    font-weight: 600;
    margin: 0 0 1rem;
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  }
  .lede {
    font-size: clamp(1rem, 1.4vw, 1.25rem);
    max-width: 36ch;
    margin: 0 0 2rem;
    opacity: 0.92;
  }
  .hero-search {
    display: flex;
    gap: 0;
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    max-width: 32rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  }
  .hero-search input {
    flex: 1;
    border: 0;
    padding: 0.875rem 1rem;
    font: inherit;
    color: var(--ghana-ink-700, #2b2e34);
    background: transparent;
  }
  .hero-search input:focus {
    outline: 3px solid var(--ghana-gold-400, #fcd116);
    outline-offset: -3px;
  }
  .hero-search button {
    border: 0;
    background: var(--ghana-green-600, #005a35);
    color: #fff;
    padding: 0 1.25rem;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
    min-width: 44px;
  }
  .hero-search button:hover {
    background: var(--ghana-green-700, #004527);
  }
  .credit {
    position: absolute;
    bottom: 0.5rem;
    right: 0.75rem;
    font-size: 0.625rem;
    color: rgba(255, 255, 255, 0.65);
    margin: 0;
    letter-spacing: 0.05em;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
```

- [ ] **Step 2: LifeStageTiles composite**

`apps/portal/src/components/LifeStageTiles.astro`:

```astro
---
/**
 * 4 life-stage tiles as the primary category nav on the homepage and on
 * `/services/`. Each tile links to its category landing; compact icon + label
 * + short descriptor.
 */
interface Tile {
  href: string;
  label: string;
  descriptor: string;
  colour: 'green' | 'red' | 'gold' | 'black';
  emoji: string;
}

const tiles: ReadonlyArray<Tile> = [
  {
    href: '/services/live/',
    label: 'Live',
    descriptor: 'ID · health · housing · family',
    colour: 'green',
    emoji: '👤',
  },
  {
    href: '/services/work/',
    label: 'Work',
    descriptor: 'tax · jobs · pensions',
    colour: 'red',
    emoji: '💼',
  },
  {
    href: '/services/business/',
    label: 'Do business',
    descriptor: 'register · licences · trade',
    colour: 'gold',
    emoji: '🏢',
  },
  {
    href: '/services/visit/',
    label: 'Visit',
    descriptor: 'visa · tourism · diaspora',
    colour: 'black',
    emoji: '✈',
  },
];
---

<section aria-labelledby="life-stage-heading" class="life-stage-tiles">
  <h2 id="life-stage-heading" class="sr-only">Browse by life stage</h2>
  <div class="grid">
    {
      tiles.map((tile) => (
        <a href={tile.href} class={`tile tile--${tile.colour}`}>
          <span class="icon" aria-hidden="true">
            {tile.emoji}
          </span>
          <span class="label">{tile.label}</span>
          <span class="descriptor">{tile.descriptor}</span>
        </a>
      ))
    }
  </div>
</section>

<style>
  .life-stage-tiles {
    padding: 2.5rem 1.25rem;
    max-width: 72rem;
    margin: 0 auto;
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  @media (min-width: 40rem) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (min-width: 64rem) {
    .grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  .tile {
    display: block;
    background: var(--ghana-paper-raised, #fff);
    border: 1px solid var(--ghana-paper-line, #e5e0d6);
    border-radius: 3px;
    padding: 1.25rem 1rem;
    text-decoration: none;
    color: var(--ghana-ink-700, #2b2e34);
    min-height: 44px;
    transition:
      transform 150ms ease-out,
      box-shadow 150ms ease-out;
  }
  @media (prefers-reduced-motion: reduce) {
    .tile {
      transition: none;
    }
  }
  .tile:hover,
  .tile:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  }
  .tile:focus-visible {
    outline: 3px solid var(--ghana-gold-400, #fcd116);
    outline-offset: 2px;
  }
  .tile--green {
    border-left: 4px solid var(--ghana-green-600, #005a35);
  }
  .tile--red {
    border-left: 4px solid var(--ghana-red-700, #820b18);
  }
  .tile--gold {
    border-left: 4px solid var(--ghana-gold-500, #e0b912);
  }
  .tile--black {
    border-left: 4px solid #000;
  }
  .icon {
    display: block;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  .label {
    display: block;
    font-family: Georgia, serif;
    font-weight: 600;
    font-size: 1.125rem;
    margin-bottom: 0.25rem;
  }
  .descriptor {
    display: block;
    font-size: 0.8125rem;
    color: var(--ghana-ink-500, #5b5f68);
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
```

- [ ] **Step 3: NewsStrip composite**

`apps/portal/src/components/NewsStrip.astro`:

```astro
---
/**
 * Homepage news preview — shows up to `limit` most-recent news entries. Falls
 * back gracefully to a placeholder if the news collection is empty (plan 2
 * hasn't authored any yet).
 */
import { getCollection } from 'astro:content';

interface Props {
  limit?: number;
}
const { limit = 4 } = Astro.props;
const news = (await getCollection('news'))
  .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())
  .slice(0, limit);

const formatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
---

<section aria-labelledby="news-strip-heading" class="news-strip">
  <div class="heading-row">
    <h2 id="news-strip-heading">Latest from government</h2>
    <a href="/news/" class="all">All news →</a>
  </div>
  {
    news.length === 0 ? (
      <p class="empty">News articles land here as they're published.</p>
    ) : (
      <ul class="grid">
        {news.map((n) => (
          <li>
            <a
              href={`/news/${n.data.publishedAt.getFullYear()}/${n.data.slug}/`}
              class="card"
            >
              <p class="eyebrow">
                {n.data.ministry.toUpperCase()} ·{' '}
                {formatter.format(n.data.publishedAt)}
              </p>
              <h3>{n.data.title}</h3>
              <p class="lede">{n.data.lede}</p>
            </a>
          </li>
        ))}
      </ul>
    )
  }
</section>

<style>
  .news-strip {
    padding: 2.5rem 1.25rem;
    max-width: 72rem;
    margin: 0 auto;
  }
  .heading-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 1rem;
  }
  h2 {
    font-family: Georgia, serif;
    font-size: 1.5rem;
    margin: 0;
    color: var(--ghana-green-700, #004527);
  }
  .all {
    color: var(--ghana-green-700, #004527);
    text-decoration: none;
    font-size: 0.875rem;
  }
  .all:hover {
    text-decoration: underline;
  }
  .grid {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  @media (min-width: 48rem) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  .card {
    display: block;
    background: var(--ghana-paper-raised, #fff);
    border: 1px solid var(--ghana-paper-line, #e5e0d6);
    border-radius: 3px;
    padding: 1rem;
    text-decoration: none;
    color: inherit;
    height: 100%;
  }
  .card:hover {
    border-color: var(--ghana-green-600, #005a35);
  }
  .eyebrow {
    font-size: 0.6875rem;
    letter-spacing: 0.1em;
    color: var(--ghana-red-700, #820b18);
    margin: 0 0 0.5rem;
  }
  h3 {
    font-family: Georgia, serif;
    font-size: 1rem;
    line-height: 1.25;
    margin: 0 0 0.375rem;
  }
  .lede {
    font-size: 0.8125rem;
    color: var(--ghana-ink-500, #5b5f68);
    margin: 0;
    line-height: 1.4;
  }
  .empty {
    padding: 1.5rem;
    text-align: center;
    color: var(--ghana-ink-500, #5b5f68);
    background: var(--ghana-paper-raised, #fff);
    border: 1px dashed var(--ghana-paper-line, #e5e0d6);
    border-radius: 3px;
  }
</style>
```

- [ ] **Step 4: ServiceMetaPanel composite**

`apps/portal/src/components/ServiceMetaPanel.astro`:

```astro
---
/**
 * Right-rail panel on every service page. Presents cost / timeline / agency /
 * apply-URL in a dense, scannable format — the "key facts" summary citizens
 * often want without reading the full page.
 */
import type { CollectionEntry } from 'astro:content';

interface Props {
  data: CollectionEntry<'services'>['data'];
}
const { data } = Astro.props;
const cost = new Intl.NumberFormat('en-GH', {
  style: 'currency',
  currency: data.cost.currency,
}).format(data.cost.amount);
---

<aside class="meta-panel" aria-labelledby="service-meta-heading">
  <h2 id="service-meta-heading" class="sr-only">Service details</h2>
  <dl>
    <dt>Cost</dt>
    <dd>
      {cost}
      <span class="unit">({data.cost.unit})</span>{
        data.cost.notes && <p class="notes">{data.cost.notes}</p>
      }
    </dd>
    <dt>Timeline</dt>
    <dd>{data.timeline}</dd>
    <dt>Agency</dt>
    <dd>
      <a href={data.agency.url}>{data.agency.name}</a>
      {data.agency.phone && <p class="phone">{data.agency.phone}</p>}
    </dd>
  </dl>
  <a href={data.applyUrl} class="apply">Apply on the official site →</a>
  <p class="source">
    Official source: <a href={data.sourceOfTruth}
      >{new URL(data.sourceOfTruth).hostname}</a>
  </p>
</aside>

<style>
  .meta-panel {
    background: var(--ghana-paper-raised, #fff);
    border: 1px solid var(--ghana-paper-line, #e5e0d6);
    border-radius: 3px;
    padding: 1.25rem;
    font-size: 0.875rem;
  }
  dl {
    margin: 0;
  }
  dt {
    font-weight: 600;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--ghana-ink-500, #5b5f68);
    margin-top: 0.75rem;
  }
  dt:first-of-type {
    margin-top: 0;
  }
  dd {
    margin: 0.25rem 0 0;
  }
  .unit,
  .phone,
  .notes {
    display: block;
    font-size: 0.75rem;
    color: var(--ghana-ink-500, #5b5f68);
    margin-top: 0.125rem;
  }
  .apply {
    display: block;
    margin-top: 1.25rem;
    padding: 0.625rem 1rem;
    background: var(--ghana-green-600, #005a35);
    color: #fff;
    text-decoration: none;
    text-align: center;
    border-radius: 3px;
    font-weight: 600;
    min-height: 44px;
  }
  .apply:hover {
    background: var(--ghana-green-700, #004527);
  }
  .source {
    margin-top: 1rem;
    font-size: 0.6875rem;
    color: var(--ghana-ink-500, #5b5f68);
  }
  .source a {
    color: inherit;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
```

- [ ] **Step 5: Patch Hero.astro to a placeholder until D1 lands images**

The `Hero` block you just wrote imports three image files that don't exist yet.
To keep the build green between PR C and PR D, swap the imports + `<Image>` for
a solid-colour placeholder now, and restore in Task D2.

Edit `apps/portal/src/components/Hero.astro`. At the top of the frontmatter,
replace:

```astro
import {Image} from 'astro:assets'; import kente from
'../assets/hero/kente-macro.jpg'; import cocoa from
'../assets/hero/cocoa-pods.jpg'; import brass from
'../assets/hero/brass-scales.jpg';
```

with:

```astro
// TODO(D2): restore astro:assets imports once hero images land in PR D1. //
import { Image } from 'astro:assets'; // import kente from
'../assets/hero/kente-macro.jpg'; // import cocoa from
'../assets/hero/cocoa-pods.jpg'; // import brass from
'../assets/hero/brass-scales.jpg';
```

In the same frontmatter, remove the `sources` record and `heroImage` variable —
nothing references them in the placeholder path. Leave `credits` in place since
Task D2 restores it.

In the template block, replace the `<Image>` element:

```astro
<Image
  src={heroImage}
  alt=""
  widths={[480, 960, 1600, 2400]}
  sizes="100vw"
  loading="eager"
  fetchpriority="high"
  class="hero-image"
/>
```

with a solid-colour placeholder:

```astro
<div class="hero-image hero-image--placeholder" aria-hidden="true"></div>
```

And append this rule to the `<style>` block:

```css
.hero-image--placeholder {
  background: linear-gradient(135deg, #2b2e34 0%, #004527 60%, #001a0e 100%);
}
```

Now build:

```bash
pnpm --filter @gh/portal build && pnpm --filter @gh/portal test
```

Expected: both pass. The homepage is not yet consumed — this compile-only check
verifies Hero syntax.

- [ ] **Step 6: Commit**

```bash
git add apps/portal/src/components/
git commit -m "feat(portal): 4 composite blocks (Hero, LifeStageTiles, NewsStrip, ServiceMetaPanel)

Hero placeholder currently renders a solid-colour backdrop pending image
sourcing in PR D. Every block is axe-clean against its intended layout
and respects prefers-reduced-motion.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## PR D — Homepage + hero pipeline

### Task D1: Source and license 3 cultural close-up images

**Files:**

- Create: `apps/portal/src/assets/hero/kente-macro.jpg` (~2400 × 1350 px, ≤ 400
  KB JPEG source)
- Create: `apps/portal/src/assets/hero/cocoa-pods.jpg`
- Create: `apps/portal/src/assets/hero/brass-scales.jpg`
- Create: `apps/portal/src/assets/hero/CREDITS.md`

This task is the one human-in-the-loop step. Can't be automated. Operator does
steps 1–3; the rest of the plan resumes in Task D2.

- [ ] **Step 1: Source 3 images from Unsplash or Pexels**

Search terms to try on unsplash.com (in order of likely quality):

- `"kente"` → pick a close-up of woven kente cloth showing the yellow/green/red
  weave clearly. No people in frame.
- `"cocoa pods ghana"` → raw cocoa pods on the tree or harvested in a wooden
  tray. Warm tones.
- `"brass weights akan"` or `"goldweights"` → Akan brass scales / goldweights.
  If nothing comparable, fallback to `"calabash"` or `"talking drum close-up"`.

Criteria (reject anything that fails):

- Licence is permissive (Unsplash licence / Pexels licence are both fine; CC-BY
  acceptable if credit is possible in CREDITS.md).
- Resolution ≥ 2400 × 1350 (original; can downscale).
- No identifiable faces.
- Warm, natural, editorial colour — no saturated tourist-brochure treatment.

- [ ] **Step 2: Save to `apps/portal/src/assets/hero/` with the exact
      filenames**

Target ≤ 400 KB per source JPEG. If a download is larger, compress via
`squoosh-cli` or similar before committing (astro:assets will produce responsive
sizes, but keeping the source reasonable helps the repo).

- [ ] **Step 3: Write CREDITS.md**

`apps/portal/src/assets/hero/CREDITS.md`:

```markdown
# Hero photography credits

Every hero image on gov.gh is licensed for reuse and credited here. If you are
the photographer and wish a correction or removal, contact the site maintainer.

## kente-macro.jpg

- **Photographer:** [Name]
- **Source URL:** [Direct Unsplash/Pexels URL]
- **Licence:** [Unsplash Licence | Pexels Licence | CC-BY-4.0 | Public Domain]
- **Captured:** [Location, date if available]

## cocoa-pods.jpg

- **Photographer:** [Name]
- **Source URL:** [URL]
- **Licence:** [Licence]

## brass-scales.jpg

- **Photographer:** [Name]
- **Source URL:** [URL]
- **Licence:** [Licence]
```

(Fill the bracketed fields; no placeholders should remain at commit time.)

- [ ] **Step 4: Commit**

```bash
git add apps/portal/src/assets/hero/
git commit -m "assets(portal): 3 cultural close-up hero images + credits

Kente macro / cocoa pods / brass scales. All licensed for reuse.
Source URLs + photographer credits in CREDITS.md.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task D2: Restore the Hero image imports and build the homepage

**Files:**

- Modify: `apps/portal/src/components/Hero.astro` (uncomment image imports)
- Modify: `apps/portal/src/pages/index.astro` (adopt HomepageLayout + blocks)

- [ ] **Step 1: Restore image imports in Hero.astro**

Edit `apps/portal/src/components/Hero.astro`. Remove the `// TODO(D1)`
placeholder and restore the original import + `<Image>` usage from Task C5
Step 1. The `apps/portal/src/assets/hero/*.jpg` paths now resolve.

- [ ] **Step 2: Read current homepage to preserve anything worth keeping**

```bash
cat apps/portal/src/pages/index.astro
```

The existing PR 7b homepage uses `<Search>` and `<MostRequestedBand>` inline. We
replace this wholesale with the composed homepage.

- [ ] **Step 3: Overwrite `apps/portal/src/pages/index.astro`**

```astro
---
import HomepageLayout from '../layouts/HomepageLayout.astro';
import Hero from '../components/Hero.astro';
import LifeStageTiles from '../components/LifeStageTiles.astro';
import NewsStrip from '../components/NewsStrip.astro';
import MostRequestedBand from '@gh/gh-ds/MostRequestedBand';

const mostRequested = [
  { label: 'Renew your passport', href: '/services/renew-passport/' },
  { label: 'Apply for a Ghana Card', href: '/services/apply-ghana-card/' },
  { label: 'File your income tax return', href: '/services/file-income-tax/' },
  { label: 'Register a business', href: '/services/register-business/' },
  {
    label: "Renew your driver's licence",
    href: '/services/renew-drivers-licence/',
  },
  {
    label: 'Apply for a birth certificate',
    href: '/services/apply-birth-certificate/',
  },
  { label: 'Apply for a Ghana visa', href: '/services/apply-ghana-visa/' },
  { label: 'Register for VAT', href: '/services/register-vat/' },
];
---

<HomepageLayout
  title="Home"
  description="The national portal of the Republic of Ghana. Every service, every ministry, every announcement — in one place."
>
  <Hero
    tagline="One government.<br/>One people.<br/>One Ghana."
    lede="Every service the government offers, every announcement it makes — in one place."
    variant="kente"
  />
  <LifeStageTiles />
  <MostRequestedBand
    id="home-most-requested"
    title="Most requested"
    headingLevel="h2"
    items={mostRequested}
  />
  <NewsStrip limit={4} />
</HomepageLayout>

<script>
  // HomepageLayout CSS keys off body.homepage — apply the class client-side
  // on the home route only. Non-JS users still see a readable homepage; the
  // max-width rule is a visual enhancement only.
  document.body.classList.add('homepage');
</script>
```

- [ ] **Step 4: Add a Hero variant rotation — optional v1.1, not v1**

Leave as `variant="kente"` for v1. Task D2 does not implement rotation;
build-time rotation is a v1.1 follow-up documented in spec §11.

- [ ] **Step 5: Build**

```bash
pnpm --filter @gh/portal build
```

Expected: exit 0. Built `dist/index.html` should include a `<picture>` element
with `srcset` for the 480/960/1600/2400 widths.

- [ ] **Step 6: Verify homepage weight budget**

```bash
node apps/portal/scripts/measure-weight.mjs
```

Expected: homepage transfer (HTML + CSS + inline critical JS, excluding
lazy-loaded images) ≤ 100 KB gzipped. The hero image itself is a separate budget
— verify responsive selection serves the 480w variant on mobile.

- [ ] **Step 7: Run full test**

```bash
pnpm --filter @gh/portal test
```

Expected: `routes-test: … — PASS` then `axe-check: 0 blocking violations — PASS`
across all dist pages.

- [ ] **Step 8: Visual sanity check (manual, operator)**

```bash
pnpm --filter @gh/portal preview --host --port 4322
```

Open `http://localhost:4322/` in a browser. Confirm:

- Kente micro-stripe at very top edge.
- Hero image renders full-bleed.
- Tagline is crisp and readable over the scrim.
- Search box has a yellow focus ring on keyboard focus.
- Tiles animate with a subtle lift on hover.
- `prefers-reduced-motion: reduce` disables tile animations (test via browser
  DevTools emulation).

Kill the server with Ctrl-C when done.

- [ ] **Step 9: Commit**

```bash
git add apps/portal/src/components/Hero.astro apps/portal/src/pages/index.astro
git commit -m "feat(portal): homepage assembled — Hero + LifeStageTiles + MostRequested + NewsStrip

Cultural-close-up Hero renders the Kente macro by default, with scrim
overlay + tagline + search. 4 life-stage tiles, 8-link Most Requested
band (from @gh/gh-ds), and NewsStrip (gracefully empty until plan 2).
All blocks axe-clean; homepage weight under budget.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task D3: Category landing pages use CategoryLandingLayout

**Files:**

- Modify: `apps/portal/src/pages/services/[lifeStage].astro`

- [ ] **Step 1: Rewrite the life-stage page to use the real layout and render
      the services in that stage**

```astro
---
import { getCollection } from 'astro:content';
import CategoryLandingLayout from '../../layouts/CategoryLandingLayout.astro';
import Card from '@gh/gh-ds/Card';

export function getStaticPaths() {
  return [
    { params: { lifeStage: 'live' } },
    { params: { lifeStage: 'work' } },
    { params: { lifeStage: 'business' } },
    { params: { lifeStage: 'visit' } },
  ];
}

const { lifeStage } = Astro.params;
const titles: Record<string, string> = {
  live: 'Live',
  work: 'Work',
  business: 'Do business',
  visit: 'Visit',
};
const ledes: Record<string, string> = {
  live: 'Services for everyday life — identity, health, housing, family.',
  work: 'Services for work — tax, jobs, pensions, professional licensing.',
  business: 'Services for running a business — registration, licences, trade.',
  visit: 'Services for visitors and diaspora — visa, passports, tourism.',
};
const label = titles[lifeStage as string] ?? 'Services';

const servicesInStage = (
  await getCollection('services', ({ data }) => data.lifeStage === lifeStage)
).sort((a, b) => a.data.priority - b.data.priority);
---

<CategoryLandingLayout
  title={label}
  description={ledes[lifeStage as string]}
  lede={ledes[lifeStage as string]}
  breadcrumbs={[
    { href: '/', label: 'Home' },
    { href: '/services/', label: 'Services' },
  ]}
>
  {
    servicesInStage.length === 0 ? (
      <p>Services in this category are being authored. Check back soon.</p>
    ) : (
      <ul class="service-grid">
        {servicesInStage.map((s) => (
          <li>
            <Card
              title={s.data.title}
              description={s.data.lede}
              href={`/services/${s.data.slug}/`}
              headingLevel="h3"
            />
          </li>
        ))}
      </ul>
    )
  }
</CategoryLandingLayout>

<style>
  .service-grid {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  @media (min-width: 48rem) {
    .service-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
```

- [ ] **Step 2: Build + test**

```bash
pnpm --filter @gh/portal build && pnpm --filter @gh/portal test
```

Expected: both pass. Category pages render empty states gracefully (no service
content authored yet).

- [ ] **Step 3: Commit**

```bash
git add apps/portal/src/pages/services/[lifeStage].astro
git commit -m "feat(portal): life-stage category pages use CategoryLandingLayout

Each of /services/live|work|business|visit filters the services collection
by lifeStage and renders a grid of @gh/gh-ds Cards. Empty state is a
polite placeholder until PR E authors the first 10 services.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## PR E — 10 flagship services + Pagefind search

### Task E1: Author 10 flagship service markdown files

**Files:**

- Create: `apps/portal/src/content/services/apply-ghana-card.md`
- Create: `apps/portal/src/content/services/apply-birth-certificate.md`
- Create: `apps/portal/src/content/services/apply-marriage-certificate.md`
- Create: `apps/portal/src/content/services/renew-drivers-licence.md`
- Create: `apps/portal/src/content/services/apply-tin.md`
- Create: `apps/portal/src/content/services/file-income-tax.md`
- Create: `apps/portal/src/content/services/register-business.md`
- Create: `apps/portal/src/content/services/register-vat.md`
- Create: `apps/portal/src/content/services/renew-passport.md`
- Create: `apps/portal/src/content/services/apply-dual-citizenship.md`

For each file, write the full frontmatter per the schema + a short body with a
"Before you apply" and "Step by step" section. Frontmatter fields must all be
present and valid — Zod fails the build if anything is missing.

The 10 service files:

- [ ] **Step 1: `apply-ghana-card.md`**

```markdown
---
slug: apply-ghana-card
title: Apply for a Ghana Card
lifeStage: live
topics: [identity, ghana-card, nia]
lede:
  The Ghana Card is the national ID and your legal Taxpayer Identification
  Number. Apply at any NIA registration centre.
priority: 1
eligibility:
  - text: You are a Ghanaian citizen or a legal resident 6 years or older.
  - text: You have not previously been issued a Ghana Card.
youWillNeed:
  - Proof of citizenship (birth certificate or naturalisation certificate)
  - Two passport-sized photographs (for manual backup only; biometrics are
    captured on-site)
  - Supporting documents for residency (if non-citizen)
cost:
  amount: 0
  currency: GHS
  unit: first issuance
  notes: Replacement cards cost GH₵ 30. Rush service is GH₵ 40.
timeline: Instant issuance at major centres; up to 2 weeks elsewhere.
agency:
  name: National Identification Authority
  url: https://nia.gov.gh
  phone: +233 30 277 3838
applyUrl: https://nia.gov.gh/registration-centres
updatedAt: 2026-04-19
sourceOfTruth: https://nia.gov.gh
---

## Before you apply

Locate your nearest registration centre on the NIA map. Many centres issue the
card on the same day; some require a return visit for collection.

## Step by step

1. Visit an NIA registration centre with your supporting documents.
2. Your biometrics (photograph, fingerprints, iris scan) are captured on-site.
3. You receive a registration receipt with your application reference number.
4. Collect your Ghana Card when notified by SMS or at the stated pickup window.

## After you apply

Your Ghana Card PIN is your legal TIN for tax purposes. Use the same number when
filing tax returns, opening bank accounts, or registering a SIM.
```

- [ ] **Step 2: `apply-birth-certificate.md`**

```markdown
---
slug: apply-birth-certificate
title: Apply for a birth certificate
lifeStage: live
topics: [birth-certificate, identity, bdr]
lede:
  Register a new birth or request a certified copy of an existing record.
  Certificates are issued by the Births and Deaths Registry.
priority: 2
eligibility:
  - text:
      You are registering a birth that occurred in Ghana within the past 12
      months (no fee), or applying for a certified copy of an earlier record.
youWillNeed:
  - Proof of the child's name, sex, date and place of birth
  - Names and national IDs of the parents
  - Where the birth occurred in a facility, the facility's birth notification
cost:
  amount: 30
  currency: GHS
  unit: certified copy
  notes:
    Registration within 12 months of the birth is free. Late registration and
    certified copies carry fees.
timeline:
  Same-day issuance at many district offices; up to 2 weeks for certified copies
  by post.
agency:
  name: Births and Deaths Registry
  url: https://bdr.gov.gh
  phone: +233 30 266 4564
applyUrl: https://bdr.gov.gh/birth
updatedAt: 2026-04-19
sourceOfTruth: https://bdr.gov.gh
---

## Before you apply

Confirm the registration district for the place of birth. For a Ghanaian born
abroad, contact the nearest Ghanaian mission.

## Step by step

1. Visit your registration district office with the required documents.
2. Complete and sign the prescribed form.
3. Pay the applicable fee.
4. Receive the birth certificate on the day, or by post within 2 weeks for
   remote districts.
```

- [ ] **Step 3: `apply-marriage-certificate.md`**

```markdown
---
slug: apply-marriage-certificate
title: Apply for a marriage certificate
lifeStage: live
topics: [marriage, civil-registration, bdr]
lede:
  Register a marriage under the Marriage Act and request a certified copy.
  Customary and religious marriages can also be registered for legal
  recognition.
priority: 3
eligibility:
  - text:
      Both partners are at least 18 years of age and consent to the marriage.
  - text: Neither partner is currently married to someone else.
youWillNeed:
  - Valid ID for each partner (Ghana Card or passport)
  - Notice of intention to marry, posted 21 days in advance
  - Marriage certificate from the ceremony (for customary / religious
    registration)
cost:
  amount: 200
  currency: GHS
  unit: civil marriage ceremony and certificate
  notes: Fees vary for customary-marriage registration and certified copies.
timeline: 21-day notice period, then same-day ceremony and certificate issuance.
agency:
  name: Registrar-General's Department
  url: https://rgd.gov.gh
  phone: +233 30 266 6081
applyUrl: https://rgd.gov.gh/marriage
updatedAt: 2026-04-19
sourceOfTruth: https://rgd.gov.gh
---

## Before you apply

Decide whether you are registering a civil marriage (Ordinance), a customary
marriage, or a religious marriage. Each has a distinct path.

## Step by step

1. File a notice of intention to marry at the Registrar's office 21 days before
   the ceremony.
2. Return on the scheduled day for the civil ceremony.
3. Receive the marriage certificate.
```

- [ ] **Step 4: `renew-drivers-licence.md`**

```markdown
---
slug: renew-drivers-licence
title: Renew your driver's licence
lifeStage: live
topics: [driving, dvla, identity]
lede:
  Renew your Ghanaian driver's licence online or at any DVLA office. Expired
  licences beyond 6 months require a fresh driving test.
priority: 4
eligibility:
  - text: Your existing licence expired within the past 6 months.
  - text: You are a holder of the same licence class you wish to renew.
youWillNeed:
  - Your current (or recently expired) driver's licence
  - Ghana Card
  - Eye-test certificate from an approved optician
cost:
  amount: 180
  currency: GHS
  unit: 5-year renewal
  notes: Additional classes (commercial, heavy goods) carry separate fees.
timeline: ~10 working days from payment to card collection.
agency:
  name: Driver and Vehicle Licensing Authority
  url: https://dvla.gov.gh
  phone: +233 30 268 6051
applyUrl: https://dvla.gov.gh/renew
updatedAt: 2026-04-19
sourceOfTruth: https://dvla.gov.gh
---

## Before you apply

Obtain a current eye-test certificate before visiting DVLA.

## Step by step

1. Log in to the DVLA online portal or visit a DVLA office.
2. Submit your renewal details and upload the eye-test certificate.
3. Pay the fee.
4. Collect the new card on the stated pickup date.
```

- [ ] **Step 5: `apply-tin.md`**

```markdown
---
slug: apply-tin
title: Apply for a Taxpayer Identification Number
lifeStage: work
topics: [tax, tin, gra]
lede:
  Your Ghana Card PIN is your TIN for all individual tax purposes. Businesses
  and entities apply for a separate TIN through GRA.
priority: 1
eligibility:
  - text:
      You are an individual with a Ghana Card — your PIN is already your TIN. No
      separate application required.
  - text:
      You are a business, partnership, or other entity — apply through GRA's
      business-TIN channel.
youWillNeed:
  - Entity-registration details (for businesses)
  - Authorised signatory Ghana Card
  - Certificate of incorporation or registration
cost:
  amount: 0
  currency: GHS
  unit: first issuance
timeline:
  Individual — no wait (use your Ghana Card PIN). Business TIN — 3-5 working
  days.
agency:
  name: Ghana Revenue Authority
  url: https://gra.gov.gh
  phone: +233 80 090 0110
applyUrl: https://gra.gov.gh/tin
updatedAt: 2026-04-19
sourceOfTruth: https://gra.gov.gh
---

## Before you apply

If you're an individual, you already have a TIN — your Ghana Card PIN. Check
your card; no separate registration is needed.

## Step by step (for businesses)

1. Register the business with the Registrar-General's Department first.
2. Submit the business TIN application through the GRA portal with the
   registration documents.
3. Receive the TIN by email.
```

- [ ] **Step 6: `file-income-tax.md`**

```markdown
---
slug: file-income-tax
title: File your personal income tax return
lifeStage: work
topics: [tax, paye, gra]
lede:
  Individuals with income from any source file an annual return with GRA. Most
  employees have PAYE deducted monthly and only need to file if they have
  additional income.
priority: 2
eligibility:
  - text: You earned income during the tax year (1 January to 31 December).
  - text:
      Your employer has not deducted the full tax liability at source (e.g. you
      have multiple income streams).
youWillNeed:
  - Ghana Card (your PIN is your TIN)
  - Employer PAYE summary (P7)
  - Records of any additional income
  - Receipts for allowable deductions
cost:
  amount: 0
  currency: GHS
  unit: filing
  notes: Filing is free. Tax due is paid separately.
timeline: Return must be filed by 30 April following the tax year-end.
agency:
  name: Ghana Revenue Authority
  url: https://gra.gov.gh
  phone: +233 80 090 0110
applyUrl: https://taxpayersportal.com
updatedAt: 2026-04-19
sourceOfTruth: https://gra.gov.gh
---

## Before you apply

Gather your P7 from your employer and records of any other income. Confirm the
filing deadline (30 April).

## Step by step

1. Log in to the Taxpayers Portal with your Ghana Card PIN.
2. Select the relevant tax year and complete the return.
3. Submit and pay any balance due.
```

- [ ] **Step 7: `register-business.md`**

```markdown
---
slug: register-business
title: Register a business
lifeStage: business
topics: [business-registration, rgd, ors]
lede:
  Register a sole proprietorship, partnership, or limited company through the
  Office of the Registrar of Companies' online service.
priority: 1
eligibility:
  - text: You are 18 years or older.
  - text: You have a Ghana Card.
  - text: You have proposed business names and a registered address.
youWillNeed:
  - Ghana Card (for every director/partner)
  - Proposed business name (have 2-3 alternatives)
  - Registered business address
  - Description of business activities
  - Stated capital (for companies)
cost:
  amount: 60
  currency: GHS
  unit: sole proprietorship
  notes:
    Limited company registration is GH₵ 200 plus 0.5% of stated capital.
    Partnership is GH₵ 90.
timeline: Online registrations typically issued within 48 hours.
agency:
  name: Office of the Registrar of Companies
  url: https://orc.gov.gh
  phone: +233 30 266 6081
applyUrl: https://orc.gov.gh/register
updatedAt: 2026-04-19
sourceOfTruth: https://orc.gov.gh
---

## Before you apply

Decide your business structure (sole proprietor / partnership / limited company)
— each carries different liability and tax implications.

## Step by step

1. Conduct a name search on the ORC portal.
2. Complete the online registration form and upload supporting documents.
3. Pay the fee.
4. Receive the certificate of registration by email.
```

- [ ] **Step 8: `register-vat.md`**

```markdown
---
slug: register-vat
title: Register for VAT
lifeStage: business
topics: [tax, vat, gra]
lede:
  Businesses with annual taxable turnover exceeding the VAT threshold must
  register for VAT with GRA. Voluntary registration below the threshold is also
  permitted.
priority: 2
eligibility:
  - text: Your annual taxable turnover exceeds GH₵ 500,000.
  - text:
      Your business is registered with the Office of the Registrar of Companies.
youWillNeed:
  - Business TIN
  - Certificate of business registration
  - Records evidencing annual turnover
  - Tax Clearance Certificate
cost:
  amount: 0
  currency: GHS
  unit: registration
timeline: ~5 working days to receive a VAT Certificate.
agency:
  name: Ghana Revenue Authority
  url: https://gra.gov.gh
  phone: +233 80 090 0110
applyUrl: https://gra.gov.gh/vat
updatedAt: 2026-04-19
sourceOfTruth: https://gra.gov.gh
---

## Before you apply

Confirm your annual taxable turnover. Businesses below the threshold may
register voluntarily; doing so is often advantageous for input-tax recovery.

## Step by step

1. Log in to the GRA portal.
2. Complete the VAT-registration form.
3. Upload the supporting documents.
4. Receive the VAT Certificate by email.
```

- [ ] **Step 9: `renew-passport.md`**

```markdown
---
slug: renew-passport
title: Renew your Ghanaian passport
lifeStage: visit
topics: [passport, travel, identity]
lede:
  Renew your passport online through the Ghana Immigration Service portal, or at
  any passport office nationwide. Standard processing is about 7 working days.
priority: 1
eligibility:
  - text: You already hold a valid or recently-expired Ghanaian passport.
  - text: You are 18 years or older (guardians apply for minors under 18).
youWillNeed:
  - Ghana Card (original)
  - Two passport photographs (35mm × 45mm, white background)
  - Your old passport (all pages)
  - Fee-payment receipt
cost:
  amount: 100
  currency: GHS
  unit: 32-page standard
  notes:
    64-page executive is GH₵ 150. Express 24-hour service is GH₵ 600 with
    additional requirements.
timeline: ~7 working days standard; 24 hours express.
agency:
  name: Ghana Immigration Service
  url: https://passports.gov.gh
  phone: +233 30 266 6301
applyUrl: https://passports.gov.gh/apply
updatedAt: 2026-04-19
sourceOfTruth: https://passports.gov.gh
---

## Before you apply

Ensure your Ghana Card is current. Take the two passport photographs at an
approved studio to the Ghana Immigration Service specifications.

## Step by step

1. Apply online at passports.gov.gh or visit any passport office.
2. Pay the fee through any MoMo wallet or bank.
3. Attend the biometric-capture appointment.
4. Collect your passport when notified (~7 working days).

## After you apply

Your new passport is machine-readable and ECOWAS-compatible. Check the biodata
page carefully before leaving the passport office.
```

- [ ] **Step 10: `apply-ghana-visa.md`**

```markdown
---
slug: apply-ghana-visa
title: Apply for a Ghana visa
lifeStage: visit
topics: [visa, travel, immigration]
lede:
  Non-Ghanaian visitors apply for a visa through the Ghana Immigration Service
  e-visa portal, the nearest Ghanaian embassy, or on arrival at Kotoka
  International Airport depending on nationality.
priority: 2
eligibility:
  - text: You are a non-Ghanaian citizen intending to visit Ghana.
  - text:
      Your nationality is one of those eligible for e-visa or visa-on-arrival,
      OR an embassy application applies.
youWillNeed:
  - A passport valid for at least 6 months beyond the intended stay
  - Proof of return travel
  - Proof of accommodation in Ghana
  - Yellow-fever vaccination certificate
  - Recent passport-size photograph (digital upload for e-visa)
cost:
  amount: 100
  currency: GHS
  unit: single-entry tourist visa
  notes:
    Multiple-entry and business visas carry higher fees; ECOWAS citizens enter
    visa-free.
timeline: E-visa issued within 3 working days; embassy processing varies.
agency:
  name: Ghana Immigration Service
  url: https://gis.gov.gh
  phone: +233 30 222 4445
applyUrl: https://evisa.gis.gov.gh
updatedAt: 2026-04-19
sourceOfTruth: https://gis.gov.gh
---

## Before you apply

Confirm whether your nationality is eligible for the e-visa (most are) or
requires embassy application. ECOWAS citizens enter visa-free.

## Step by step

1. Visit evisa.gis.gov.gh and create an account.
2. Complete the application and upload supporting documents.
3. Pay the fee online.
4. Receive the e-visa by email within 3 working days.
5. Present the printed e-visa at Kotoka International Airport on arrival.
```

- [ ] **Step 11: `apply-dual-citizenship.md`**

```markdown
---
slug: apply-dual-citizenship
title: Apply for Ghanaian dual citizenship
lifeStage: visit
topics: [citizenship, diaspora, nia]
lede:
  Ghanaians who hold another nationality can apply to be recognised as dual
  citizens. Dual citizens retain most rights but certain public offices are
  restricted.
priority: 3
eligibility:
  - text: You are a Ghanaian by birth or descent.
  - text: You hold citizenship of another country.
  - text: You have not renounced Ghanaian citizenship.
youWillNeed:
  - Your Ghanaian passport or Ghana Card
  - Your foreign passport
  - Birth certificate (if applying by descent)
  - Two passport-sized photographs
  - Completed application form
cost:
  amount: 200
  currency: GHS
  unit: Ghana-resident application
  notes:
    Applications filed at Ghanaian missions abroad are priced locally (typically
    US$ 200).
timeline: ~8 weeks for processing.
agency:
  name: Ministry of the Interior
  url: https://mint.gov.gh
  phone: +233 30 268 4544
applyUrl: https://mint.gov.gh/dual-citizenship
updatedAt: 2026-04-19
sourceOfTruth: https://mint.gov.gh
---

## Before you apply

If you live abroad, file at your nearest Ghanaian mission rather than travelling
to Accra. Bring originals for verification.

## Step by step

1. Obtain and complete the dual-citizenship application form.
2. Submit the form with supporting documents to the Ministry of the Interior or
   your nearest Ghanaian mission.
3. Pay the fee.
4. Attend any interview as requested.
5. Collect the Dual Citizenship Certificate.

## After you apply

Dual citizens may hold any public office except: President, Vice-President,
Speaker of Parliament, Chief Justice, Chief of Defence Staff, IGP, Commissioner
of CHRAJ, Auditor-General, Ambassador or High Commissioner, or Secretary to the
Cabinet.
```

- [ ] **Step 12: Build verifies schema compliance for all 10 files**

```bash
pnpm --filter @gh/portal build
```

Expected: `10 services` recognised by the content collection, build produces 10
new pages under `/services/{slug}/`, exit 0. If Zod rejects any file, fix the
frontmatter and retry.

- [ ] **Step 13: Adopt ServicePageLayout in the service route**

Rewrite `apps/portal/src/pages/services/[...slug].astro` to use
`ServicePageLayout`:

```astro
---
import { getCollection } from 'astro:content';
import ServicePageLayout from '../../layouts/ServicePageLayout.astro';

const RESERVED = new Set([
  'a-z',
  'diaspora',
  'live',
  'work',
  'business',
  'visit',
]);

export async function getStaticPaths() {
  const all = await getCollection('services');
  return all
    .filter((entry) => !RESERVED.has(entry.data.slug))
    .map((entry) => ({
      params: { slug: entry.data.slug },
      props: { entry },
    }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
---

<ServicePageLayout entry={entry}>
  <Content />
</ServicePageLayout>
```

- [ ] **Step 14: Run five-gate**

```bash
pnpm --filter @gh/portal build && pnpm --filter @gh/portal test
```

Expected: build produces 10 service pages; axe passes on all of them.

- [ ] **Step 15: Commit**

```bash
git add apps/portal/src/content/services/ apps/portal/src/pages/services/[...slug].astro
git commit -m "feat(portal): ship 10 flagship service pages

live — apply-ghana-card, apply-birth-certificate, apply-marriage-certificate,
       renew-drivers-licence
work — apply-tin, file-income-tax
business — register-business, register-vat
visit — renew-passport, apply-ghana-visa, apply-dual-citizenship

Adopts ServicePageLayout (2-col grid + ServiceMetaPanel). Each page
cites its authoritative source per spec §7.1. All axe-clean.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task E2: Integrate Pagefind for client-side search

**Files:**

- Modify: `apps/portal/package.json` (add `pagefind` devDependency + postbuild
  script)
- Modify: `apps/portal/src/pages/search.astro` (render Pagefind UI)

- [ ] **Step 1: Install Pagefind**

```bash
pnpm --filter @gh/portal add -D pagefind
```

Expected: `pagefind` added under devDependencies in `apps/portal/package.json`.
Lockfile updates.

- [ ] **Step 2: Wire Pagefind into the build script**

Edit `apps/portal/package.json`. Change the `build` script to:

```json
"build": "astro build && pagefind --site dist"
```

(The `pagefind` CLI reads `dist/`, indexes every HTML file, and writes
`dist/pagefind/` with index shards + a tiny JS loader.)

- [ ] **Step 3: Rewrite `apps/portal/src/pages/search.astro`**

```astro
---
import BoilerplatePageLayout from '../layouts/BoilerplatePageLayout.astro';
---

<BoilerplatePageLayout
  title="Search"
  description="Search every service, news item, and ministry on gov.gh."
  lede="Type what you're looking for — services, ministries, or news."
>
  <div id="search" class="search-container"></div>
  <noscript>
    <p class="noscript-fallback">
      Search requires JavaScript. You can browse the
      <a href="/services/a-z/">A–Z services index</a> or the
      <a href="/ministries/">ministries directory</a> instead.
    </p>
  </noscript>

  <link href="/pagefind/pagefind-ui.css" rel="stylesheet" />
  <script src="/pagefind/pagefind-ui.js" is:inline></script>
  <script is:inline>
    window.addEventListener('DOMContentLoaded', () => {
      if (typeof PagefindUI === 'undefined') return;
      new PagefindUI({
        element: '#search',
        showImages: false,
        resetStyles: false,
      });
    });
  </script>
</BoilerplatePageLayout>

<style>
  .search-container {
    min-height: 10rem;
    margin-top: 1rem;
  }
  .noscript-fallback {
    padding: 1rem;
    background: var(--ghana-paper-raised, #fff);
    border: 1px solid var(--ghana-paper-line, #e5e0d6);
    border-radius: 3px;
  }
  /* Tint Pagefind's default UI to match our palette. */
  :global(.pagefind-ui__search-input:focus) {
    outline: 3px solid var(--ghana-gold-400, #fcd116);
  }
  :global(.pagefind-ui__result-link) {
    color: var(--ghana-green-700, #004527);
  }
</style>
```

- [ ] **Step 4: Build**

```bash
pnpm --filter @gh/portal build
```

Expected: `astro build` runs, then `pagefind --site dist` produces
`dist/pagefind/` with `pagefind.js`, `pagefind-ui.css`, `pagefind-ui.js`, and
index shards. Exit 0.

- [ ] **Step 5: Manual smoke test**

```bash
pnpm --filter @gh/portal preview --host --port 4322
```

Open `http://localhost:4322/search/?q=passport`. Confirm:

- Search box renders.
- Typing "passport" returns the `Renew your Ghanaian passport` service page.
- Clicking the result navigates to `/services/renew-passport/`.
- Disabling JavaScript in DevTools shows the `<noscript>` fallback with working
  links.

Kill the preview server.

- [ ] **Step 6: Update the route test to include `/search/`**

Already in `REQUIRED` array. Confirm by running:

```bash
pnpm --filter @gh/portal test
```

Expected: `routes-test: 15 routes resolved — PASS`,
`axe-check: 0 blocking violations — PASS`.

- [ ] **Step 7: Commit**

```bash
git add apps/portal/package.json apps/portal/src/pages/search.astro pnpm-lock.yaml
git commit -m "feat(portal): Pagefind client-side search over all built pages

postbuild runs pagefind --site dist to index every HTML file; /search/ loads
pagefind-ui.js and renders an in-page search experience. <noscript> fallback
points users to the A–Z services index when JS is off.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task E3: Final verification — deploy preview + gate sweep

**Files:**

- No changes (verification only).

- [ ] **Step 1: Full workspace root five-gate**

```bash
pnpm typecheck && pnpm lint && pnpm build && pnpm test && pnpm format:check
```

Expected: every gate exits 0.

- [ ] **Step 2: Lighthouse against the preview build**

```bash
pnpm --filter @gh/portal preview --host --port 4322 &
sleep 3
npx @lhci/cli autorun --collect.url=http://localhost:4322/ --collect.url=http://localhost:4322/services/ --collect.url=http://localhost:4322/services/live/ --collect.url=http://localhost:4322/services/renew-passport/
kill %1
```

Expected thresholds (every URL): Performance ≥ 0.95, Accessibility = 1.00, Best
Practices ≥ 0.95, SEO = 1.00. LCP ≤ 2500 ms, CLS ≤ 0.1, INP ≤ 200 ms. Total-byte
weight ≤ 307200 bytes per page.

If any page fails a threshold, add a task to the plan and fix before tagging.

- [ ] **Step 3: Tag and annotate**

```bash
git tag v1-foundation-complete -m "v1 foundation: PRs A–E shipped.

Monorepo trimmed. All v1 routes resolve. 10 flagship services live.
Pagefind search live. Ready for content bulk-fill (plan 2) and
deploy-preview hand-off."
```

- [ ] **Step 4: Write the handoff doc**

Create `docs/doctrine/v1-foundation-complete.md` with this template, filling the
bracketed values from the commit log and the Lighthouse run in Step 2:

```markdown
# v1 foundation — complete · [DATE]

Plan 1 (`docs/superpowers/plans/2026-04-19-ghana-gov-v1-foundation.md`)
finished. Tag: `v1-foundation-complete`. No remote push.

## What shipped

| PR  | Scope                                                    | Commit |
| --- | -------------------------------------------------------- | ------ |
| A   | Monorepo trim + ADR-004                                  | [SHA]  |
| B   | Routing scaffold + content schemas + route-test          | [SHA]  |
| C   | Paper tokens, KenteStripe, 6 layouts, 4 composite blocks | [SHA]  |
| D   | 3 hero images + homepage + category pages                | [SHA]  |
| E   | 10 flagship services + Pagefind search                   | [SHA]  |

## Five-gate at tag

- pnpm typecheck — 2/2 ✓
- pnpm lint — 2/2 ✓
- pnpm build — 2/2 ✓
- pnpm test — routes-test + axe-check, both PASS
- pnpm format:check — PASS

## Lighthouse scores (mobile preset)

| Route                       | Perf | A11y | BP  | SEO | LCP   | CLS |
| --------------------------- | ---- | ---- | --- | --- | ----- | --- |
| `/`                         | [#]  | [#]  | [#] | [#] | [Nms] | [#] |
| `/services/`                | [#]  | [#]  | [#] | [#] | [Nms] | [#] |
| `/services/live/`           | [#]  | [#]  | [#] | [#] | [Nms] | [#] |
| `/services/renew-passport/` | [#]  | [#]  | [#] | [#] | [Nms] | [#] |

## Deferred to plan 2 (content bulk-fill)

- Remaining 20 service markdown files
- 21 ministry markdown files + MinistryDirectoryEntry composite block +
  populated ministries index
- 6–10 news articles + populated `/news/`
- PublicationsList composite block + homepage/boilerplate integration
- Real copy for about / accessibility / privacy / contact / diaspora
- 5 Twi stubs (home + 4 life-stage landings)
- Populated `/services/a-z/` index

## Deferred to plan 3 (launch prep)

- External WCAG 2.2 AA audit
- DNS + custom domain cutover
- Cloudflare Web Analytics wired
- Publish accessibility + privacy + data-processing statements
- CSA CII registration, DPC controller registration
- Cybersecurity Fund levy configuration
```

- [ ] **Step 5: Commit the handoff doc**

```bash
git add docs/doctrine/v1-foundation-complete.md
git commit -m "docs(doctrine): v1 foundation complete — handoff notes"
```

- [ ] **Step 6: No push**

Do not push to the remote. The user reviews locally and initiates deploy.
Foundation plan is complete.

---

## What's next (not this plan)

- **Plan 2 — Content bulk-fill:** author remaining 20 services; author 21
  ministry pages; author 6–10 news articles; fill the 5 boilerplate pages (about
  / accessibility / privacy / contact / diaspora) with real copy; add 5 Twi
  stubs.
- **Plan 3 — Launch prep:** external a11y audit; DNS + custom domain; Cloudflare
  Web Analytics wiring; accessibility + privacy statement publication; external
  comms.
