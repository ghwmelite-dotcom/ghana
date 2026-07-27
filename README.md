<div align="center">

# 🇬🇭 gov.gh

### The Flagship National Government Portal of the Republic of Ghana

**Every service. Every ministry. Every announcement — in one place.**

[![Live Portal](https://img.shields.io/badge/🌐_Live_Portal-ghana--gov.pages.dev-006B3F?style=for-the-badge)](https://ghana-gov.pages.dev/)
[![CI](https://img.shields.io/github/actions/workflow/status/ghwmelite-dotcom/ghana/ci.yml?branch=main&style=for-the-badge&label=CI)](https://github.com/ghwmelite-dotcom/ghana/actions/workflows/ci.yml)
[![Licence: MIT](https://img.shields.io/badge/Licence-MIT-FCD116?style=for-the-badge)](LICENCE)

[![Accessibility: WCAG 2.2 AA](https://img.shields.io/badge/A11y-WCAG_2.2_AA-CE1126?style=flat-square)](#non-negotiables-read-first)
[![Cloudflare](https://img.shields.io/badge/Built_on-Cloudflare-F6821F?style=flat-square&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Astro](https://img.shields.io/badge/Frontend-Astro_5-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://astro.build/)
[![Hono](https://img.shields.io/badge/API-Hono-E36002?style=flat-square)](https://hono.dev/)
[![pnpm](https://img.shields.io/badge/Monorepo-pnpm_%2B_Turbo-F69220?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io/)

</div>

---

> **Status.** Week 0–2 foundation. No features shipped. See
> `docs/doctrine/week-0.md` for current repo state and the next three PRs.
> Non-negotiables are in `.claude/CLAUDE.md §1`.

## 🌍 Live

| Environment | URL |
| ----------- | --- |
| **Production portal** | **https://ghana-gov.pages.dev/** |
| Repository | https://github.com/ghwmelite-dotcom/ghana |
| CI | https://github.com/ghwmelite-dotcom/ghana/actions |

## 🏛️ Architecture at a glance

Everything runs on the Cloudflare edge — no origin servers, no cold starts,
no single point of failure.

```mermaid
flowchart LR
    Citizen(["🇬🇭 Citizen<br/><i>any device, any network</i>"])

    subgraph CF["☁️ Cloudflare Global Network"]
        subgraph PAGES["Pages — static front-ends (Astro)"]
            PORTAL["portal<br/><i>gov.gh front door</i>"]
            MIN["ministries"]
            DASH["dashboard"]
            DATA["data-portal"]
            DS["design-system"]
        end

        subgraph WORKERS["Workers — APIs (Hono)"]
            API["api"]
            ID["identity"]
            MYINFO["myinfo-gateway"]
            PAY["payments"]
            CMS["cms-admin"]
            SEARCH["search"]
            HOOKS["webhooks"]
            FLOW["workflows"]
        end
    end

    subgraph PKGS["📦 Shared packages"]
        GHDS["gh-ds<br/><i>design system</i>"]
        SCHEMAS["schemas"]
        I18N["i18n"]
        TEL["telemetry"]
        CLIENTS["identity /<br/>payment /<br/>myinfo clients"]
    end

    Citizen -->|HTTPS, nearest PoP| PORTAL
    PORTAL & MIN & DASH & DATA --> API
    API --> ID & MYINFO & PAY & SEARCH
    CMS --> HOOKS --> FLOW
    PAGES -.-> GHDS & I18N
    WORKERS -.-> SCHEMAS & TEL & CLIENTS

    style Citizen fill:#006B3F,color:#fff,stroke:none
    style CF fill:#fff8e1,stroke:#FCD116
    style PAGES fill:#e8f5e9,stroke:#006B3F
    style WORKERS fill:#fdecea,stroke:#CE1126
    style PKGS fill:#f3e5f5,stroke:#6a1b9a
```

## 🚀 Quick start

Requires **Node 22+** and **pnpm 9+**.

```bash
pnpm install
pnpm typecheck   # across all workspaces
pnpm lint
pnpm test
pnpm build
```

## 🗺️ Layout

See `.claude/CLAUDE.md §3` for the canonical monorepo map.

| Directory | Ships to | Contents |
| --------- | -------- | -------- |
| `apps/` | **Cloudflare Pages** | `portal` · `ministries` · `dashboard` · `data-portal` · `design-system` — Astro front-ends |
| `services/` | **Cloudflare Workers** | `api` · `identity` · `myinfo-gateway` · `payments` · `cms-admin` · `search` · `webhooks` · `workflows` — Hono APIs |
| `packages/` | shared libraries | `gh-ds` (design system) · `schemas` · `i18n` · `identity-client` · `payment-client` · `myinfo-client` · `telemetry` |
| `infra/` | IaC | OpenTofu, Wrangler fragments, workerd-Docker DR target |
| `content/` | Keystatic | Root content, authored |
| `docs/` | — | ADRs, doctrine, research artefacts, runbooks |
| `.archive/legacy-v0/` | — | Pre-monorepo static prototype, preserved for content migration reference |

## ⛔ Non-negotiables (read first)

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

## 🤝 Contributing

- Never push to `main`. PR-only.
- Every PR satisfies `.claude/CLAUDE.md §7` Definition of Done.
- Conventional Commits scoped by package/app (`feat(gh-ds):`, `fix(portal):`).
- ADR required for architectural decisions — see `docs/adr/README.md`.

## 📄 Licence

MIT. See `LICENCE`. Content under CC-BY 4.0 except where noted. Fonts are SIL
OFL, attribution in `packages/gh-ds/fonts/OFL.txt`.

---

<div align="center">
<sub>Built with ❤️ for every Ghanaian — from Accra to Bolgatanga, on any device, on any network.</sub>
</div>
