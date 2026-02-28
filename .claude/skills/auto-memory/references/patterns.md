# Auto Memory Patterns & Best Practices

## Writing Style

### MEMORY.md Style

Use terse, scannable formatting:

- **Bold** for key terms and names
- Bullet points over paragraphs
- Pipe-separated inline lists for related items (e.g., `CLI = VERSION + pyproject.toml`)
- Tables for structured reference data
- No full sentences where fragments suffice

Example — good:

```markdown
- **3 test suites**: unit (`tests/unit/`), integration (`tests/integration/`), e2e (`tests/e2e/`)
- Config: `jest.config.ts` (unit/integration) | `playwright.config.ts` (e2e)
```

Example — bad:

```markdown
There are three test suites in the project. Unit tests are located in the tests/unit directory,
integration tests are in tests/integration, and end-to-end tests use Playwright and can be
found in tests/e2e.
```

### Topic File Style

More detail is acceptable, but still prefer:

- Headers for scannable structure
- Code blocks for commands, paths, and configurations
- Tables for multi-column data
- Bullet lists for sequential or related items

## MEMORY.md Structure Patterns

### The Index Pattern

MEMORY.md as a pure index — just facts and pointers:

```markdown
# Project Memory

## Architecture
- **Monorepo**: 3 packages (`api/`, `web/`, `shared/`)
- **Stack**: Node 20, TypeScript 5.3, PostgreSQL 15, Redis 7
- **Deploy**: Docker Compose (dev) | Kubernetes (prod)

## Quick Reference
- **42 API endpoints**, **15 DB migrations**, **3 worker queues**
- Test command: `npm test` (all) | `npm run test:api` (API only)

## Critical Gotchas
- **DO NOT** run migrations in prod without `--dry-run` first
- Redis connection pool max = 10 in dev, 50 in prod (env var `REDIS_POOL_MAX`)

## Topic Files
| File | When to consult |
|------|----------------|
| `api.md` | API routes, middleware, auth flow |
| `database.md` | Schema, migrations, query patterns |
| `deployment.md` | CI/CD, Kubernetes, environment config |
```

### The Gotcha-First Pattern

Lead with critical gotchas when the project has many pitfalls:

```markdown
# Project Memory

## Critical Gotchas (Read First)
- **Never `git push --force` to main** — CI auto-deploys from main
- **`npm install` breaks on Node 18** — must use Node 20+
- **`NEXT_PUBLIC_` prefix required** for client-side env vars

## Architecture
[...]
```

### The Versioned Pattern

For projects with multiple release tracks or versions:

```markdown
## Version Management
- **API v3.2.1** (`api/VERSION`) + **Web v2.8.0** (`web/package.json`)
- Independent release cycles — API weekly, Web biweekly
- 5 files to update on API release (see `release.md`)
```

## Topic File Patterns

### The Checklist Pattern

For processes with multiple steps:

```markdown
# Release Process

## Pre-Release Checklist
1. Run full test suite: `npm test`
2. Update CHANGELOG.md
3. Bump version in 3 files: `VERSION`, `package.json`, `config.ts`
4. Create release branch: `release/vX.Y.Z`
5. Open PR to main

## Post-Release
1. Tag the release: `git tag vX.Y.Z`
2. Push tag: `git push origin vX.Y.Z`
3. Update staging environment
```

### The Decision Log Pattern

For tracking architectural decisions:

```markdown
# Architecture Decisions

## Chose PostgreSQL over MongoDB (2026-01)
- Need: relational data with complex joins
- Rejected: MongoDB (no joins), SQLite (concurrency limits)
- Result: Working well, no regrets

## Switched from REST to GraphQL for internal APIs (2026-02)
- Need: Frontend needed flexible queries, REST was over-fetching
- Kept REST for external/public API
- Result: Reduced API calls by 60%
```

### The Bug Tracker Pattern

For tracking known issues:

```markdown
# Known Issues

## Open
- **#142**: Login fails silently when Redis is down — needs circuit breaker
- **#158**: CSV export truncates at 10K rows — pagination needed

## Fixed
- **#130 FIXED (v3.1.2)**: Race condition in queue worker — added mutex lock
- **#135 FIXED (v3.2.0)**: Memory leak in WebSocket handler — proper cleanup on disconnect
```

## Common Anti-Patterns

### Anti-Pattern: The Diary

Writing memory as a session log:

```markdown
## 2026-02-15
Today we worked on the login page. Found a bug in the auth flow.
Fixed it by adding a null check.

## 2026-02-16
Continued work on auth. Added password reset feature.
```

**Fix**: Extract the durable facts: "Auth flow requires null check on token (fixed 2026-02-15). Password reset: `POST /auth/reset` with email body."

### Anti-Pattern: The CLAUDE.md Clone

Duplicating instructions already in CLAUDE.md:

```markdown
## Build Commands
- `npm install` to install dependencies
- `npm test` to run tests
- `npm run build` to build
```

**Fix**: Only store information that supplements CLAUDE.md — gotchas, patterns discovered during work, things not documented elsewhere.

### Anti-Pattern: The Kitchen Sink

One giant MEMORY.md with everything:

```markdown
# Memory (2,500 lines)
## Architecture
[500 lines of detail]
## Every API endpoint
[800 lines]
## All database tables
[400 lines]
```

**Fix**: Keep MEMORY.md under 200 lines. Move detail to topic files. MEMORY.md is an index, not an encyclopedia.

### Anti-Pattern: Stale Counts

Storing volatile numbers that change frequently:

```markdown
- **127 tests** passing
- **3,421 lines** in main.ts
```

**Fix**: Only store counts that change with deliberate action (e.g., "50 commands" that only changes when a command is added). Avoid counts that drift with every code change.

### Anti-Pattern: Speculative Memory

Saving conclusions from incomplete exploration:

```markdown
## Database
- Probably uses connection pooling (saw a pool config somewhere)
- Auth might use JWT (found a token variable)
```

**Fix**: Verify before saving. Read the actual config, confirm the pattern, then document with certainty.

## Scaling Guidelines

### Small Projects (1-5 files in memory/)

- MEMORY.md + 1-3 topic files
- Topic files for the most complex domains only
- Most knowledge fits in MEMORY.md itself

### Medium Projects (5-10 files in memory/)

- MEMORY.md as pure index
- Dedicated topic files for each major domain
- Cross-reference between topic files where domains interact

### Large Projects (10+ files in memory/)

- MEMORY.md strictly under 200 lines
- Consider grouping related topic files with clear naming:
  - `api-routes.md`, `api-auth.md`, `api-middleware.md`
  - `deploy-kubernetes.md`, `deploy-ci.md`
- Review quarterly for stale entries
