# ADR-001 — Stack: Astro 5 + Hono + D1 + Cloudflare Pages + Workers

**Status.** Accepted

**Date.** 2026-04-18

**Authors.** Ozzy (OHCS digital lead), lead engineer agent

**Reviewers.** TBD — one external reviewer required before code beyond Week 0–2
ships.

## Context

`.claude/CLAUDE.md §1` sets hard constraints: LCP ≤ 2.5s on 4G and ≤ 4s on 3G,
total page weight ≤ 300 KB, initial JS ≤ 70 KB gzipped, Lighthouse mobile ≥ 95,
WCAG 2.2 AA, progressive enhancement (every form works without JS),
grandmother-in- Bolgatanga-on-a-Tecno-Spark as the baseline device.

§2 additionally commits the platform to Cloudflare primitives end-to-end and
requires every Worker-runtime artefact to compile under **workerd** so a DR
target in Docker stays green continuously.

A realistic stack must therefore:

1. Ship zero JavaScript by default, with islands only where interaction is
   required.
2. Produce static output deployable behind Cloudflare's Accra PoP with edge
   caching.
3. Run backend code under workerd (Cloudflare Workers + Pages Functions + Queue
   consumers + Durable Objects + Workflows — one runtime, one mental model).
4. Stay fully open source so the portability clause in §2.3 is honest.
5. Have a production track record on public-sector sites so we are not
   evangelising an unproven tool to the Auditor-General.

## Decision

**Front-ends use Astro 5.** Every site in `apps/` is an Astro project with the
`@astrojs/cloudflare` adapter in static mode unless a specific page needs SSR.
React islands are allowed for interactive surfaces (dashboard forms, multi-step
service flows) but the default ship is zero JavaScript.

**Back-ends use Hono on Cloudflare Workers.** Every service in `services/` is a
Hono app compiled to workerd. Routing is path-based. Shared middleware (auth,
rate limiting, request ID, structured logging) lives in `packages/telemetry` and
is imported by every service.

**Relational data uses D1.** Drizzle ORM is the only query interface. Migrations
are numbered SQL files. Drizzle's Postgres driver is the documented swap target
for the workerd-Docker DR path (§2.3).

**Deployment uses Cloudflare Pages + Workers + OpenTofu.** Every long-lived
resource is declared in `infra/terraform/` and applied by CI; no click-ops.

**TypeScript strict mode everywhere.** `tsconfig.base.json` has `strict`,
`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and
`verbatimModuleSyntax` on. `any` is an error, not a warning.

## Alternatives considered

- **Next.js (App Router) on Vercel or CF Pages.** Rejected. Default client
  runtime cost is incompatible with the 70 KB initial-JS ceiling; App Router's
  streaming RSC model assumes a Node.js serverful runtime that does not map
  cleanly onto workerd. Every "make Next.js work on Cloudflare" thread is a
  symptom.
- **SvelteKit on Cloudflare Pages.** Respected alternative, smaller hello-world
  bundles than Next. Rejected because the Astro islands model maps more cleanly
  onto a content-heavy government portal with a minority of interactive
  surfaces, and because GOV.UK Frontend (ADR-003) targets HTML + progressive JS
  directly, not a reactive framework runtime.
- **Remix / React Router 7 on CF Workers.** Rejected — same JS-first default as
  Next, with less mature CF adapter story than Astro today.
- **11ty (Eleventy) + HTMX.** Respected for the perf floor. Rejected because
  component sharing across five apps, type safety for content schemas, and i18n
  integration are weaker than Astro's built-ins.
- **Express or Fastify on Node under workerd-compat shims.** Rejected. Hono is
  built for workerd, has zero Node.js shim cost, and its middleware ecosystem
  covers auth, CORS, Zod validation, and streaming out of the box.
- **Postgres on Neon or Supabase via HTTP.** Rejected for Phase 1. D1 is the
  spec's mandated primary (§2.1). The workerd-Docker DR path migrates to
  Postgres via Drizzle driver swap when and only if regulation tightens.

## Consequences

### Positive

- Zero-JS-default front-ends give us headroom for icons, fonts, and translations
  under the 300 KB ceiling without fighting a framework.
- One runtime (workerd) across Pages Functions, Workers, Queue consumers,
  Durable Objects, and Workflows — one mental model, one debugging toolchain,
  one set of bindings.
- Astro's content collections + Keystatic give ministry editors a structured
  authoring surface that compiles to static HTML with no server dependency for
  published pages.
- Drizzle's SQLite and Postgres drivers let ADR-002's DR clause be an exercise,
  not a rewrite.

### Negative / costs accepted

- Astro is newer than Next.js in public-sector deployments. Mitigation: we track
  Canada.ca's evaluation of Astro and document our own benchmark in
  `docs/research/stack-evaluation.md` before Week 3 ships.
- Hono's Node.js ecosystem parity is weaker than Express. Mitigation: every
  dependency we pull must work under workerd — CI will enforce this via the
  `workerd-docker-build` nightly.
- D1 is SQLite, so cross-region replication and analytical queries are limited.
  Mitigation: analytical workloads target Workers Analytics Engine
  (`packages/telemetry`), not D1. Large reports run in Workflows with R2-backed
  intermediate state.

### Neutral / follow-up work

- Write `docs/research/stack-evaluation.md` with measured bundle sizes for a
  hello-world page in each rejected alternative. Due before Week 3 PRs.
- Publish `docs/runbooks/adding-a-new-app.md` before `apps/ministries/` begins.
- Evaluate Astro's View Transitions for the multi-step service flows in Weeks
  7–10. ADR-004 if we adopt.

## References

- `.claude/CLAUDE.md §1` — performance and progressive-enhancement
  non-negotiables.
- `.claude/CLAUDE.md §2.2` — edge-first, SQLite-everywhere, zero-egress pattern.
- `.claude/CLAUDE.md §3` — canonical monorepo layout this ADR is sized against.
- GOV.UK Frontend ships as plain HTML + progressive JS; Astro's zero-JS-default
  preserves that discipline while still giving us component composition.
- Canada.ca engineering blog on evaluating static-first frameworks for
  accessibility-first government sites.
- Astro docs — [https://docs.astro.build/](https://docs.astro.build/)
- Hono docs — [https://hono.dev/](https://hono.dev/)
- Drizzle ORM — [https://orm.drizzle.team/](https://orm.drizzle.team/)
