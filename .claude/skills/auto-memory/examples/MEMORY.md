# Project Memory

## Architecture

- **Monorepo**: 3 packages — `api/` (Express), `web/` (Next.js), `shared/` (types + utils)
- **Stack**: Node 20 | TypeScript 5.3 | PostgreSQL 15 | Redis 7
- **Deploy**: Docker Compose (dev) | Kubernetes on AWS EKS (prod)
- **Auth**: JWT with refresh tokens, 15min access / 7d refresh

## Quick Reference

- **42 API endpoints**, **15 DB migrations**, **3 worker queues**
- Test: `npm test` (all) | `npm run test:api` | `npm run test:web` | `npm run test:e2e`
- Build: `npm run build` produces `dist/` in each package
- DB: `npm run migrate` (up) | `npm run migrate:down` (rollback last)

## Critical Gotchas

- **DO NOT** run `migrate` in prod without `--dry-run` first — no automated rollback
- **Redis pool**: max=10 (dev), max=50 (prod) via `REDIS_POOL_MAX` — exceeding causes silent connection drops
- **`NEXT_PUBLIC_` prefix required** for all client-side env vars in `web/`
- **Node 20+ required** — `npm install` fails on Node 18 due to native module incompatibility

## User Preferences

- Always use `pnpm` over `npm` for package management
- Prefer named exports over default exports
- Never auto-commit — always ask first

## Topic Files

| File | When to consult |
|------|----------------|
| `api.md` | API routes, middleware, auth flow, error handling |
| `database.md` | Schema design, migrations, query patterns, indexes |
| `deployment.md` | CI/CD pipeline, Kubernetes config, environment variables |
| `known-issues.md` | Bug tracking, open/fixed issues |
