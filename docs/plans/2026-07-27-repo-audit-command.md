# `/arckit:repo-audit` Command Specification

> **Status:** design spec, not yet approved for implementation. Resolves issue [#616](https://github.com/tractorjuice/arc-kit/issues/616) ("audit with codebase in github and/or gitlab").

**Goal:** Let ArcKit read a real codebase (local checkout or public GitHub/GitLab repo) and produce a governance-shaped audit: the as-built architecture, scored against the project's principles and requirements where they exist, with every gap expressed as a proposed ADR.

**Architecture:** New command `/arckit:repo-audit` in the existing `arckit-repo` plugin, reusing the discovery, source-grounding, and secret-safety rules already proven in `/arckit:repo-docs`. New doc-type `CDAU`, multi-instance, written to `projects/{P}-{NAME}/audits/`.

**Tech stack:** Markdown command prompt with YAML frontmatter, a new template in both template trees, `doc-types.mjs` plus the bash helper for ID generation, `scripts/converter.py` for the seven non-Claude extensions.

## Why this is not already covered

Issue #616 was filed on 2026-06-26 and answered with a 7-point plan on 2026-06-29. The `arckit-repo` plugin did not exist then. It does now, which changes the shape of the work: roughly half of the original plan is already shipped, and the remaining half was never specified in enough detail to build.

| Existing command | Reads source? | Produces judgement? | Why it does not close #616 |
|---|---|---|---|
| `/arckit:repo-docs` | Yes | No | Descriptive wiki into `docs/repository/`. Current checkout only, no clone path, no GitLab. |
| `/arckit:conformance` | No | Yes | Reads ADR/PRIN/HLD/DLD only. Hard-errors without PRIN plus one accepted ADR, which is exactly what an unaudited repo lacks. |
| `/arckit:analyze` | No | Yes | Artefact-only governance quality analysis. |
| `/arckit:gov-reuse` | Partly | Yes | External repos, but UK-gov-only via govreposcrape, scored for reuse candidacy not architecture conformance. |

Both halves of the pipeline exist. The bridge from source code to governance judgement does not. That bridge is the whole of this spec.

The requester's own example makes the target output unambiguous: they audited a codebase against "19 principles, 71 requirements and 9 blocking decisions" and expressed the findings as missing ADRs (`C-2: secrets vault has no ADR`, `C-7: per-entity ADRs do not exist`, `C-9: adapter pattern undocumented`). That is ArcKit run backwards, and it is the differentiator over a `repo-docs` run with a gaps section bolted on.

## Command contract

```yaml
---
description: Audit a codebase (local or remote GitHub/GitLab) against architecture principles and requirements, surfacing drift, risk, and missing decisions
argument-hint: "<repo path or URL, plus optional focus, e.g. 'https://github.com/org/repo security'"
effort: max
keep-coding-instructions: true
handoffs:
  - command: adr
    description: Record the blocking decisions the audit surfaced
    condition: audit produced one or more proposed ADRs
  - command: conformance
    description: Re-check decided-vs-designed conformance once ADRs exist
  - command: requirements
    description: Seed a requirements set from the as-built capabilities
    condition: cold mode, no existing REQ artefact
  - command: risk
    description: Promote audit findings rated HIGH or CRITICAL into the risk register
---
```

**Plain command, not an agent.** The agent-delegation rule in `CLAUDE.md` triggers on heavy *web* research (more than 10 WebSearch/WebFetch calls). This command reads files, mostly locally. It follows `/arckit:repo-docs`, which is a plain command at `effort: max`. Revisit only if remote-API reading (see "Rejected alternatives") is ever adopted.

### Argument parsing

The first token is the target. Everything after it is optional focus text.

| Input form | Interpretation |
|---|---|
| omitted | Audit the current repository (the working tree ArcKit itself is running in). |
| `.` or a local path | Audit that path. Must be a directory. |
| `https://github.com/owner/repo` | Public GitHub repo. Shallow clone. |
| `https://gitlab.com/group/project` (any depth of subgroup) | Public GitLab repo. Shallow clone. |
| `git@host:owner/repo.git` | SSH form. Accepted, clone attempted with the user's existing credentials. |
| `owner/repo` | Ambiguous. Assume GitHub, state the assumption in the summary. |

Focus text is free-form and narrows the audit, for example `security`, `dependencies and CI only`, `data protection`. Absent focus text, run all dimensions.

## Repository access

This is the decision the original plan left open, and it drives everything else.

**Local checkout first.** If the target resolves to a directory on disk, read it in place. No network, no clone, no confirmation needed.

**Remote via shallow clone.** For a URL target:

1. Confirm with the user before cloning. Show the resolved URL, the destination path, and the approximate size if `gh`/`glab` can report it. Cloning an arbitrary third-party repo writes to disk and touches the network, so it is not a silent action.
2. Clone into the session scratch directory, never into the user's project:

   ```bash
   git clone --depth 100 --single-branch --no-tags --recurse-submodules=no \
     "$URL" "$SCRATCH/repo-audit/$SLUG"
   ```

   `--depth 100` is deliberate: it gives enough history for commit-cadence and contributor signals without pulling a full mirror. Record in the report that history is truncated so nobody reads "100 commits" as the repo total.
3. Read the clone. Delete it after the report is written unless the user asked to keep it.
4. Private repos are out of scope for v1. If the clone fails with an auth error, say so plainly and offer the local-checkout path instead. Do not prompt for or store credentials.

**Never execute anything from the audited repository.** No `npm install`, no `pip install`, no build, no test run, no `make`, no running scripts found in the tree. The audit is static reading only. This is a hard rule, not a performance choice: the whole point of the command is that the code is untrusted at the moment it is read.

### Tooling assumptions

| Tool | Required? | Fallback |
|---|---|---|
| `git` | Yes | None. Error out. |
| `rg` | No | `find`, matching `repo-docs`. |
| `gh` | No | Used only for repo metadata (stars, topics, licence, open issue count) when present and authenticated. Skip the metadata section otherwise. |
| `glab` | No | Not assumable. GitLab metadata is skipped in v1; the clone is the only GitLab dependency. |

## Operating modes

Mode is inferred, never a flag.

| Mode | Trigger | Behaviour |
|---|---|---|
| **Conformance** | An ArcKit project exists and has a `PRIN` and/or `REQ` artefact | Audit the codebase *against* those artefacts. Score each principle and each requirement as Met / Partial / Not met / Not evidenced. This is the mode issue #616 actually demonstrates. |
| **Cold** | No ArcKit project, or no `PRIN`/`REQ` | Standalone as-built architecture audit. No scoring against artefacts that do not exist. Emit a seed capability list suitable for `/arckit:requirements`, and propose the principles the codebase appears to assume. |
| **Check** | `--check` or `--dry-run` anywhere in the arguments | Report what would be audited and which artefacts would be scored against. Write nothing. |

If a project exists but has only `PRIN` and no `REQ` (or the reverse), score against what is there and mark the missing half as not assessed. Do not hard-error the way `/arckit:conformance` does. A repo audit is often the first thing a user runs, so blocking on prerequisites defeats the purpose.

### Project resolution

Reuse `scripts/bash/create-project.sh --json` and `list-projects.sh` as every other artefact-producing command does. If more than one project exists and the argument does not name one, ask which project the audit belongs to rather than guessing.

## Audit dimensions

Run all of these unless focus text narrows the set. Each finding must cite a repo-relative path, a line range, or a commit SHA. Uncited findings are cut before the report is written.

1. **Structure and stack.** Top-level layout, languages by share, build tooling, monorepo vs single service, framework versions.
2. **As-built architecture.** Components and their boundaries, data stores, external service dependencies, sync vs async integration, deployment topology inferred from IaC.
3. **Infrastructure as code.** Presence and coverage of CDK/Terraform/Bicep/CloudFormation, what is provisioned by hand, environment parity.
4. **Security posture.** Secrets handling (manager vs env vars vs hardcoded), authn/authz approach, input validation at trust boundaries, dependency vulnerability signals from lockfiles, transport security. Report the *approach*, never a secret value.
5. **Data.** Stores, schemas, PII presence and handling, retention signals, backup and restore evidence.
6. **Operability.** Logging, metrics, tracing, health checks, alerting configuration, runbook presence.
7. **Resilience.** Retry and timeout handling, idempotency, circuit breaking, RTO/RPO evidence, single points of failure.
8. **Delivery.** CI/CD configuration, test presence and shape (unit vs integration vs none), branch protection signals, release process.
9. **Documentation and decision record.** README quality, ADR presence, architecture docs, onboarding path.
10. **AI and ML specifics**, only when the repo contains LLM/ML code. Model and provider coupling, prompt management, evaluation harness, guardrails, cost controls, data flow to third-party inference. The issue's own example is exactly this shape (OpenAI, Pinecone, Amazon Lex), and it is where `arckit-agent-architecture` overlay commands are the natural handoff.

## Report schema

This is the artefact the issue's own comment said had to be defined before coding.

- **Doc type:** `CDAU`, display name `Codebase Audit`, category `Governance`, no `regime`, no `severity`. Registered in `plugins/arckit-claude/config/doc-types.mjs`.
- **Multi-instance:** yes. A project may audit several repositories. Add `CDAU` to `MULTI_INSTANCE_TYPES` in `doc-types.mjs` **and** to the parallel bash list in `scripts/bash/generate-document-id.sh`.
- **Subdirectory:** `audits`. New entry in `SUBDIR_MAP`. Deliberately not `research/`, because this is a governance assessment of code we control or intend to adopt, not market discovery.
- **Filename:** `ARC-{PID}-CDAU-{NNN}-v{X.Y}.md`, generated via `generate-document-id.sh CDAU {PID} --next-num projects/{P}-{NAME}/audits`.
- **Code choice:** `REPO` is already taken by the TOGAF ADM overlay (Architecture Repository), `ANAL` by `/arckit:analyze`, `CONF` by `/arckit:conformance`. `CDAU` is free against all 178 registered codes.

### Document sections

1. **Document Control** and **Revision History**, per the standard in `CLAUDE.md`.
2. **Audit Scope.** Target repo, resolved URL or path, commit SHA audited, clone depth, date, mode (conformance or cold), dimensions covered, dimensions skipped and why.
3. **Executive Summary.** At most 10 lines. Overall posture, the single biggest risk, the count of blocking decisions.
4. **Repository Profile.** Structure, languages, commit and contributor signals, licence, dependency manifests. Facts only.
5. **As-Built Architecture.** Narrative plus one Mermaid C4 container diagram. Every component annotated with the source path that evidences it.
6. **Strengths.** Evidenced, cited, and specific. No filler.
7. **Findings.** The core table. One row per finding:

   | Field | Notes |
   |---|---|
   | ID | `F-001` ascending |
   | Dimension | One of the 10 above |
   | Severity | CRITICAL / HIGH / MEDIUM / LOW |
   | Finding | One sentence |
   | Evidence | Repo-relative path, line range, or commit SHA |
   | Confidence | Verified (read the code) / Inferred (structural signal) / Absent (expected artefact not found) |
   | Recommendation | One action |

   The Confidence column is load-bearing. "Absent" findings ("no retry logic anywhere in the integration layer") are the most common and the easiest to get wrong, so they must be visually distinct from findings where the code was actually read.

8. **Principles Conformance**, conformance mode only. One row per `PRIN` principle: ID, statement, verdict (Met / Partial / Not met / Not evidenced), evidence, gap.
9. **Requirements Coverage**, conformance mode only. One row per `REQ` requirement: ID, verdict, implementing component, evidence, gap. Absent requirements matter more than met ones, so sort not-met first.
10. **Blocking Decisions.** The differentiator, and the section that mirrors the requester's `C-1` through `C-9`. Each entry is a decision the codebase implies but never records, formatted as a ready-to-file ADR stub: decision needed, context found in the repo, options visible from the code, why it blocks, suggested ADR title. Hands directly to `/arckit:adr`.
11. **Recommended Next Actions.** Ordered, each naming the ArcKit command that does it.
12. **Limitations.** Truncated history, unread paths, private submodules skipped, generated code excluded, anything the audit could not see. Never let the report read as more complete than it is.
13. **Standard Footer**, per `CLAUDE.md`. Build Provenance is appended automatically by `provenance-stamp.mjs`.

### Severity rubric

Fix the rubric in the template so two runs over the same repo agree.

- **CRITICAL:** exploitable now, or data loss with no recovery path. Hardcoded live credential, no auth on a public write endpoint, no backups of the system of record.
- **HIGH:** no exploit today but no control either. Secrets in plaintext env vars, no dependency pinning, no tests on the payment path, no defined RTO/RPO.
- **MEDIUM:** works but will not scale or is undocumented in a way that blocks handover.
- **LOW:** hygiene.

## Safety rules

Inherit every rule from `/arckit:repo-docs` and add four:

- Never execute code from the audited repository (restated here because it is the rule most likely to be rationalised away when a build would answer a question faster).
- Never write the value of a discovered secret into the report. Record the file, the line, and the *kind* of secret. If a live-looking credential is found, say so at CRITICAL and tell the user to rotate it before anything else.
- Never write into the audited repo. The only write target is the ArcKit project's `audits/` directory.
- Delete the scratch clone when finished, unless asked to keep it. State in the summary where it went.

## Files to create or change

**New:**

- `plugins/arckit-repo/commands/repo-audit.md`
- `plugins/arckit-claude/templates/codebase-audit-template.md`
- `.arckit/templates/codebase-audit-template.md` (byte-identical to the above)
- `docs/guides/repo-audit.md`, then `python3 scripts/check-guide-parity.py --sync` to produce the plugin copy. Never hand-edit the plugin copy.

**Modified:**

- `plugins/arckit-claude/config/doc-types.mjs` (`DOC_TYPES`, `MULTI_INSTANCE_TYPES`, `SUBDIR_MAP`)
- `scripts/bash/generate-document-id.sh` (`MULTI_INSTANCE_TYPES`)
- `plugins/arckit-claude/commands/pages.md` (the dual-registration allow-list called out at the top of `doc-types.mjs`; without it the artefact is silently absent from the dashboard sidebar)
- `plugins/arckit-repo/README.md`, `plugins/arckit-repo/CHANGELOG.md`
- `.claude-plugin/marketplace.json` and `plugins/arckit-claude/.claude-plugin/marketplace.json` (the `arckit-repo` description names its commands)
- `docs/DEPENDENCY-MATRIX.md`
- `README.md`, `docs/index.html`, `docs/commands.html` (command counts and a command entry)
- Both `CHANGELOG.md` files

Then run `python scripts/converter.py` so the command reaches all seven generated extension formats.

The `.claude/skills/new-command-docs/` skill carries the exact grep patterns and line numbers for the count updates. Use it rather than hand-hunting.

### Pre-existing defect this work touches

`MULTI_INSTANCE_TYPES` has already drifted between the two registries. `doc-types.mjs` lists 19 types; `scripts/bash/generate-document-id.sh` lists 18 and is missing `GRNT`. The comment in `doc-types.mjs` claims the bash list has 10 entries, which was true a long time ago. Adding `CDAU` means touching both lists anyway, so fix `GRNT` and correct the stale comment in the same change. Consider a CI guard that diffs the two lists; there is currently nothing preventing the next drift.

## Implementation tasks

1. Register `CDAU` across `doc-types.mjs`, the bash helper, and `pages.md`. Fix the `GRNT` drift. Verify `generate-document-id.sh CDAU 001 --next-num <dir>` returns `ARC-001-CDAU-001-v1.0`.
2. Write the template in both template trees, with the severity rubric and all 13 sections.
3. Write the command prompt: argument parsing, mode inference, clone flow with confirmation, discovery, the 10 dimensions, and Write-tool output (never inline, given the 32K output cap).
4. Add the guide, sync it, and confirm `check-guide-parity.py` passes clean.
5. Run the converter and confirm the command appears in all seven extension formats with Claude-only frontmatter stripped.
6. Tests in `tests/repo_audit/`: target parsing for every input form in the table above, mode inference against fixture projects (PRIN only, REQ only, both, neither), doc ID generation and sequencing, and the failure paths (missing `git`, clone auth failure, target is a file not a directory, empty repository).
7. Docs and counts per the `new-command-docs` checklist.
8. End-to-end on a real public repo plus a real ArcKit test project, in both modes.

## Rejected alternatives

**Reading remote repos through the GitHub/GitLab APIs instead of cloning.** Gives file listings cheaply but content only one file per request, burns rate limit fast, and makes the dependency-manifest and CI-config reading in dimensions 3, 4, and 8 impractical. A shallow clone is one operation and then everything is local. Revisit only if clone is unavailable in some sandboxed deployment.

**Extending `/arckit:repo-docs` with an `--audit` flag.** The two commands share discovery but nothing else: different output tree, different doc-type, different prerequisites, different handoffs, and `repo-docs` deliberately never judges. Overloading it would make both prompts worse.

**Putting the command in core `arckit`.** `arckit-repo` exists precisely for this, is already `defaultEnabled: false`, and already depends on core. Core stays jurisdiction-neutral and does not grow a network-cloning command.

**Private repo support in v1.** Needs credential handling ArcKit does not currently do anywhere. Local checkout covers the private case adequately: the user clones, then points the command at the path.

## Explicit non-goals

- Running, building, or testing the audited code.
- Fixing anything in the audited repo.
- Replacing `/arckit:conformance`, which stays artefact-to-artefact.
- Replacing `/arckit:gov-reuse`, which stays UK-gov reuse discovery.
- Vendoring any external audit or SAST tool.
- Language-specific deep static analysis. This is architecture-level audit, and it should say so rather than pretend to be a linter.

## Decisions taken

Settled by the maintainer on 2026-07-27. Recorded here so the implementation does not reopen them.

1. **Doc-type code is `CDAU`.** Chosen over `CBAU` and `SRCA`. Verified free against all 178 registered codes; nearest neighbours are `CACR`, `CHRT`, `CLAS`.
2. **`audits/` is a new subdirectory**, not a reuse of `research/`. It costs one `SUBDIR_MAP` entry and one more directory in the project scaffold, and it keeps a governance assessment of code out of the market-discovery tree.

## Open questions for the maintainer

1. **Should `CDAU` carry `severity: 'HIGH'`?** That would make it count toward the Compliance Readiness scorecard in `/arckit:graph-report`. Recommendation: no. The audit is situational, and projects with no external codebase should not be penalised for lacking one.
2. **Confirm the reply to @johnfelipe.** They approved the original 7-point plan and have been waiting since 2026-07-08. This spec narrows that plan (local-first, public repos only, no GitLab metadata in v1) and should be summarised on the issue before implementation starts.
