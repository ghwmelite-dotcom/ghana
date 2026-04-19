# PR 1 — Handoff & verification

Monorepo foundation scaffolded per `docs/doctrine/week-0.md §4` PR 1. 58 files
in the repo, 20 workspaces stubbed, 3 ADRs committed, CI workflow declared.

## What you need to do next

### 1. Baseline the repo (≤ 5 min)

```bash
cd "C:/Users/USER/OneDrive - Smart Workplace/Desktop/Projects/ghana.gov"

# Verify pnpm ≥ 9 and Node ≥ 22 are on PATH
node --version      # expect v22.x
pnpm --version      # expect 9.x — if missing: corepack enable && corepack prepare pnpm@9.15.0 --activate

pnpm install --frozen-lockfile=false   # first run generates pnpm-lock.yaml
```

Expected: ~2 minutes. `node_modules/` populated, `pnpm-lock.yaml` written at
root.

### 2. Run the Turbo pipeline (≤ 30 s — stubs only)

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Expected output for each: `20 packages ran successfully` (Turbo caches after the
first run). Every workspace currently has a `"echo '... no ... yet' && exit 0"`
stub so the pipeline is green by design. Real typecheck/lint/test land in PR 2
(`@gh/gh-ds`) and PR 3 (`@gh/portal`).

### 3. First commit

```bash
git add -A
git status            # review what's staged — expect 58 tracked files plus legacy archive
git commit -m "chore: initialise monorepo foundation and archive legacy v0

- git init on main
- move static prototype to .archive/legacy-v0/
- delete index_original.html
- scaffold apps/ services/ packages/ infra/ content/ docs/ .claude/
- root configs: package.json, pnpm-workspace.yaml, turbo.json, tsconfig.base.json,
  .editorconfig, .prettierrc, .eslintrc.cjs, .gitignore, .nvmrc, README.md
- 20 workspace stubs with noop scripts for pnpm-workspaces resolution
- .claude/CLAUDE.md — canonical project spec
- ADR-001 (stack), ADR-002 (Cloudflare-native doctrine), ADR-003 (GH-DS forks GOV.UK Frontend)
- .github/workflows/ci.yml — verify + portability-boundary + workerd-Docker stubs

Closes: Week 0–2 PR 1 per docs/doctrine/week-0.md §4."
```

### 4. Create the GitHub repo and push

```bash
# create remote first:
gh repo create ghwmelite-dotcom/gov-gh --private --source=. --remote=origin --push
# or manually:
#   git remote add origin git@github.com:ghwmelite-dotcom/gov-gh.git
#   git push -u origin main
```

### 5. Watch CI

CI runs the `verify` job (install → typecheck → lint → test → build →
format:check) and the `portability-boundary` job (grep for `cloudflare:*`
outside `services/`). Both should be green on the first push.
`workerd-docker-build` currently passes with a warning stub — real build lands
with `infra/workerd-docker/Dockerfile` in a later PR. `lighthouse` is disabled
until `apps/portal/` renders its first page in PR 3.

## DoD audit — `docs/doctrine/week-0.md §4` PR 1

- [x] `git init` ran. Default branch `main`.
- [x] All current root files moved into `.archive/legacy-v0/`.
      `index_original.html` deleted.
- [x] `apps/`, `services/`, `packages/`, `infra/`, `content/`, `docs/`,
      `.claude/` scaffolded per §3.
- [x] `pnpm-workspace.yaml`, root `package.json` with
      `packageManager: pnpm@9.15.0`, `turbo.json`, `tsconfig.base.json` strict
      mode, `.editorconfig`, `.prettierrc`, `.eslintrc.cjs`, `.gitignore`,
      `.nvmrc`, `README.md`.
- [x] `docs/adr/README.md` with ADR template.
- [x] ADR-001, ADR-002, ADR-003 committed.
- [x] CI workflow at `.github/workflows/ci.yml` runs
      `pnpm install --frozen-lockfile && pnpm typecheck && pnpm lint && pnpm test && pnpm build && pnpm format:check`.
- [ ] **Your verification:** typecheck/lint/test/build run green locally after
      `pnpm install`.
- [ ] **Your verification:** `.archive/legacy-v0/index.html` renders identically
      to the old `index.html` (open in browser).

## Next PR

Once you confirm CI green on first push, open **PR 2 —
`feat(gh-ds): publish v0 design tokens with flag colours and Noto Sans`** per
`docs/doctrine/week-0.md §4`. That PR is self-contained and satisfies the GH-DS
v1 tokens bullet from `.claude/CLAUDE.md §5` Weeks 0–2.

## External blockers to start now (process, not engineering)

Per `docs/doctrine/week-0.md §6` — start these clocks today so Week 3+ is
unblocked:

1. **CSA CII registration** (Act 1038) — 4–6 week lead time.
2. **DPC controller registration** (Act 843) — parallel timeline.
3. **NIA IVSP merchant key** request with NIA Digital Services — GhanaConnect's
   primary IdP is stubbed until this arrives.
