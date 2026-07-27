# Runbook: Cloudflare Pages account migration — `ghana-gov`

**Date executed:** 2026-07-27
**Executed by:** automated session (Kimi Code CLI) on behalf of repo owner
**Result:** ✅ `ghana-gov` moved from `ghwmelite@gmail.com`'s account to
`ohcsghana.main@gmail.com`'s account. https://ghana-gov.pages.dev/ serves
HTTP 200 from the new account.

## Accounts

| Role | Email | Account ID |
| ---- | ----- | ---------- |
| Old (source) | ghwmelite@gmail.com | `ea2eb3a9813660dfca2a60e594858538` |
| New (target) | ohcsghana.main@gmail.com | `f4f236a6cd8fbddf397c6e9de17d8113` |

The local wrangler OAuth login (`ohcsghana.main@gmail.com`) is a member of
both accounts, which is what made the migration scriptable from one machine.

## What was done

Cloudflare Pages has **no native cross-account transfer**. A project is
moved by recreating it in the target account and deleting it in the source.
Because `*.pages.dev` subdomains are globally unique, the old project must be
deleted before the same name can be claimed in the new account — this means a
short (seconds-to-minutes) window where the URL 404s.

1. **Captured old project config** (REST API, old account):
   - Source: GitHub `ghwmelite-dotcom/ghana`, production branch `main`,
     PR comments on, preview deployments for all branches.
   - Build: `pnpm install && pnpm --filter @gh/portal build`, output
     `apps/portal/dist`, Node 22, compatibility date `2026-01-19`.
   - Last old-account deployment: 2026-04-19.
2. **Deleted** `ghana-gov` in the old account:
   `DELETE /accounts/ea2eb3a9…/pages/projects/ghana-gov`
3. **Recreated** `ghana-gov` in the new account (direct-upload type):
   `POST /accounts/f4f236a6…/pages/projects {"name":"ghana-gov","production_branch":"main"}`
   → subdomain `ghana-gov.pages.dev` reassigned to the new account.
4. **Deployed current `main`** (newer than the April deployment):
   `pnpm install && pnpm --filter @gh/portal build`, then
   `wrangler pages deploy apps/portal/dist --project-name ghana-gov --branch main`
   → production deployment `a0c6917b.ghana-gov.pages.dev`.
5. **Verified:** project present only in new account;
   `curl https://ghana-gov.pages.dev/` → 200 with current content.

## ⚠️ One manual step remains — reconnect GitHub auto-deploy

The new project is **direct-upload**; pushes to `main` do **not** auto-build
yet. Git-connected projects require the Cloudflare–GitHub OAuth link, which
can only be established interactively:

1. Log in to dash.cloudflare.com as **ohcsghana.main@gmail.com**.
2. **Workers & Pages → ghana-gov → Settings → Builds & deployments →
   Connect to Git.**
3. Authorize the Cloudflare Pages GitHub App on `ghwmelite-dotcom/ghana`
   (or wherever the repo lives at that point).
4. Configure: production branch `main`; build command
   `pnpm install && pnpm --filter @gh/portal build`; output dir
   `apps/portal/dist`; env var `NODE_VERSION=22`.

Until then, deploy manually per "Redeploying" below.

## Redeploying (direct upload)

```bash
pnpm install && pnpm --filter @gh/portal build
CLOUDFLARE_ACCOUNT_ID=f4f236a6cd8fbddf397c6e9de17d8113 \
  npx wrangler pages deploy apps/portal/dist --project-name ghana-gov --branch main
```

## Known wrangler quirk (Windows, OAuth login, v4.114)

- `wrangler pages deploy` **honours** `CLOUDFLARE_ACCOUNT_ID` — proven: the
  deployment landed in the new account.
- `wrangler pages project list` / `project create` **ignore** it and pinned to
  the default (old) account; worse, `list` printed the old account's projects
  even with the new account ID exported. For project management, use the REST
  API with the OAuth token from
  `%APPDATA%/xdg.config/.wrangler/config/default.toml` and always verify
  state with `GET /accounts/{id}/pages/projects/{name}` rather than trusting
  the CLI's list output.

## Rollback

If the move must be reversed: recreate `ghana-gov` in the old account
(`POST /accounts/ea2eb3a9…/pages/projects`) after deleting it in the new one,
then redeploy `apps/portal/dist`. Deployment history from before 2026-07-27
is not recoverable — Cloudflare does not export it.
