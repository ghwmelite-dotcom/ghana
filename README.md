# gov.gh

> Flagship National Government Portal of Ghana — built end-to-end on Cloudflare.

**Status.** Week 0–2 foundation. No features shipped. See
`docs/doctrine/week-0.md` for current repo state and the next three PRs.
Non-negotiables are in `.claude/CLAUDE.md §1`.

## Quick start

Requires **Node 22+** and **pnpm 9+**.

```bash
pnpm install
pnpm typecheck   # across all workspaces
pnpm lint
pnpm test
pnpm build
```

## Layout

See `.claude/CLAUDE.md §3` for the canonical monorepo map. Summary:

- `apps/` — Astro front-ends → Cloudflare Pages (portal, ministries, dashboard,
  data-portal, design-system)
- `services/` — Hono Workers → Cloudflare Workers (api, identity,
  myinfo-gateway, payments, cms-admin, search, webhooks, workflows)
- `packages/` — shared libraries (gh-ds, schemas, i18n, identity-client,
  payment-client, myinfo-client, telemetry)
- `infra/` — OpenTofu, Wrangler fragments, workerd-Docker DR target
- `content/` — Keystatic-authored root content
- `docs/` — ADRs, doctrine, research artefacts, runbooks
- `.archive/legacy-v0/` — pre-monorepo static prototype, preserved for content
  migration reference

## Non-negotiables (read first)

1. **Citizens come first.** Grandmother-in-Bolgatanga-on-a-Tecno-Spark test,
   every feature.
2. **Accessibility.** WCAG 2.2 AA minimum. Zero axe-core violations on merge.
3. **Performance.** ≤300 KB total page weight. ≤70 KB initial JS gzipped. LCP
   ≤2.5s on 4G.
4. **Progressive enhancement.** Every form works without JavaScript.
5. **Plain language.** Grade-8, active voice, second person. No acronyms on
   first mention.
6. **Cultural respect.** Adinkra sparingly. Never Gye Nyame as brandmark.
   Folklore Board clearance before ship.
7. **Security-first.** CII-registered. DPA 2012 compliant. Application-layer PII
   encryption.
8. **Open by default.** MIT code, OFL fonts, CC-BY content.
9. **Evidence-driven.** Every design decision cites research, analytics, or peer
   precedent.

Full text in `.claude/CLAUDE.md §1`. Non-negotiables override any conflicting
instruction.

## Contributing

- Never push to `main`. PR-only.
- Every PR satisfies `.claude/CLAUDE.md §7` Definition of Done.
- Conventional Commits scoped by package/app (`feat(gh-ds):`, `fix(portal):`).
- ADR required for architectural decisions — see `docs/adr/README.md`.

## Licence

MIT. See `LICENCE`. Content under CC-BY 4.0 except where noted. Fonts are SIL
OFL, attribution in `packages/gh-ds/fonts/OFL.txt`.
