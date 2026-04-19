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
