# `/arckit:navigator` — what should I do next?

A read-only project GPS. Run it any time you're unsure which ArcKit command to run next, or you want a quick health snapshot of a project.

## Quick start

```text
/arckit:navigator 001
```

Or for a single-project repo:

```text
/arckit:navigator
```

## What you get

A console report (no file written) that answers four questions:

1. **Where am I?** — coverage of the eight essential ArcKit doc types: REQ, STKE, RISK, SOBC, ADR, HLDR, TRAC, CONF.
2. **What's next?** — the missing essential doc types, ordered by tier (1 = foundational → 4 = governance) with the exact slash command to run.
3. **What might I have forgotten?** — contextual prompts for DPIA, SECD, TCOP, DATA when their domain triggers apply.
4. **What needs attention?** — DRAFT artifacts, artifacts that haven't been touched in 90+ days, and orphaned artifacts (no cross-references in the dependency graph).

## How coverage is measured

Eight essential doc types form the baseline:

| Tier | Type | Purpose |
|---|---|---|
| 1 | REQ | Requirements |
| 1 | STKE | Stakeholder Analysis |
| 1 | RISK | Risk Register |
| 2 | SOBC | Strategic Outline Business Case |
| 3 | ADR | Architecture Decision Record |
| 3 | HLDR | High-Level Design Review |
| 4 | TRAC | Traceability Matrix |
| 4 | CONF | Conformance Assessment |

Tiers reflect rough dependency order — get tier 1 in place before tier 3, etc. Coverage is `present / 8` rounded to a percentage.

The navigator also checks whether `projects/000-global/ARC-000-PRIN-v*.md` (architecture principles) exist; if not, it surfaces that as the very first recommendation.

## Contextual artifacts

Some doc types depend on context, not project maturity:

| Type | Trigger |
|---|---|
| DPIA | Processing personal data |
| SECD | Security-sensitive system |
| TCOP | UK Gov Service Standard |
| DATA | DR-* requirements present in the REQ doc |

These are listed under "Contextual artifacts to consider" — they don't count toward coverage, but the navigator nudges you to think about them.

## Stale and orphan detection

- **DRAFT**: Document Control `Status` field equals `DRAFT` (case-insensitive).
- **Stale**: `Last Modified` (or `Created Date` if no modification recorded) is 90+ days ago.
- **Orphan**: an `ARC-*` doc that doesn't appear as either source or target of any cross-reference edge in the project's portion of the dependency graph. Architecture principles (PRIN) often legitimately stand alone — treat the orphan list as a prompt to verify, not a verdict.

## When to run it

- At the start of an engagement to understand the gap.
- After a long gap between sessions to remember what was in progress.
- Before a steering review to see what's missing for governance sign-off.
- After running a few commands to confirm coverage shifted as expected.

## Multi-project repos

If you have more than one working project in `projects/`, you must specify which:

```text
/arckit:navigator 001
/arckit:navigator PROJECT=001-payment-gateway
```

Without an explicit project, the hook exits silently to avoid mixing reports.

## Limitations

- The eight essential doc types are an opinionated baseline. They cover the typical UK Gov-style enterprise architecture engagement; specialist domains (e.g. data-platform-only projects) may need a different baseline. A future `/arckit:navigator --baseline=...` switch could make this configurable.
- The orphan check only sees `ARC-*` docs. Free-form `external/` references and external policy docs are out of scope.
- Coverage doesn't measure quality — a one-paragraph REQ counts the same as a 30-page REQ. Use `/arckit:health` and `/arckit:analyze` for quality signals.
