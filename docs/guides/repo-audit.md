# Codebase Audit Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit:repo-audit` reads a real codebase and produces a governance-shaped audit: the as-built architecture, scored against your architecture principles and requirements where they exist, with every gap expressed as a proposed ADR.

It is the inverse of the usual ArcKit flow. Most commands generate artefacts that a build will later satisfy. This one reads a build that already exists and works backwards to the governance record it should have had.

The command ships in the optional `arckit-repo` plugin.

---

## Quick Start

Install the optional repository plugin alongside the ArcKit core plugin:

```bash
claude plugin install arckit-repo
```

Audit the repository you are working in:

```text
/arckit:repo-audit
```

Audit a public repository elsewhere:

```text
/arckit:repo-audit https://github.com/org/service
```

Narrow the audit to what you care about:

```text
/arckit:repo-audit https://github.com/org/service security and resilience
```

See what would happen without writing or cloning anything:

```text
/arckit:repo-audit https://gitlab.com/group/project --check
```

---

## Two Modes, Inferred Automatically

You never pass a mode flag. The command works out which one applies.

**Conformance mode** runs when the project has a `PRIN` (architecture principles) or `REQ` (requirements) artefact. The audit scores the codebase *against* them: each principle and each requirement gets a verdict of Met, Partial, Not met, or Not evidenced, with the source path that justifies it. This is the mode that answers "does what we built match what we said we would build".

**Cold mode** runs when there is no project, or no principles and no requirements. You get a standalone as-built architecture audit plus a seed capability list you can feed into `/arckit:requirements`.

If only one of the two artefacts exists, the audit scores against it and marks the other as not assessed. Unlike `/arckit:conformance`, it does not refuse to run when prerequisites are thin, because auditing an inherited codebase is often the first thing you do on a project.

---

## What It Will Not Do

Three limits are deliberate and worth knowing before you rely on the output.

**It never executes anything from the audited repository.** No install, no build, no test run, no scripts from the tree. The audit is static reading only, because the code is untrusted at the point it is read. That means runtime behaviour, real performance, and live configuration are outside its reach, and the report says so.

**It never writes a secret's value into the report.** If it finds a live-looking credential it raises a CRITICAL finding naming the file and the kind of secret, and tells you to rotate it. The value itself never lands in an artefact you might later publish.

**It does not do private repositories.** A remote target is cloned shallow and public-only. For a private repo, clone it yourself and point the command at the local path, which works identically and keeps your credentials out of the tool entirely.

---

## Output

The audit is written to `projects/{PID}-{name}/audits/ARC-{PID}-CDAU-{NNN}-v1.0.md`.

`CDAU` is multi-instance, so one project can hold audits of several repositories, and re-auditing after a change produces a new numbered artefact rather than overwriting the last one.

The report has eleven sections. Three are worth calling out:

**Findings** carry a severity (CRITICAL, HIGH, MEDIUM, LOW) and, more usefully, a confidence: Verified means the code was read, Inferred means a structural signal only, and Absent means an expected control was not found anywhere in scope. Absent findings are the most common in a real audit and the easiest to get wrong, so they are marked distinctly rather than blended in with things that were actually confirmed.

**Blocking Decisions** is what makes this more than a repository summary. Every decision the codebase implies but never records becomes a numbered entry with the context found in the repo, the options visible from the code, and a suggested ADR title. Each one is ready to file with `/arckit:adr`.

**Limitations** states what the audit could not see: truncated history, unread paths, skipped submodules, excluded generated code. Read it before treating the report as complete.

---

## How It Works

1. Parses the target from your arguments, or defaults to the current repository.
2. For a remote target, asks before cloning, then clones shallow (`--depth 100`) into a temporary directory outside your project. The clone is deleted afterwards.
3. Resolves which ArcKit project the audit belongs to, asking if there is more than one candidate.
4. Discovers targeted files: manifests, CI config, IaC, entrypoints, boundary code, tests. It excludes vendored and generated directories, and never opens credential files.
5. Runs ten audit dimensions, or the subset your focus text names.
6. Writes the artefact and reports only a summary to you.

---

## Relationship to Other Commands

| Command | What it does | How it differs |
|---------|--------------|----------------|
| `/arckit:repo-docs` | Documents a repository | Describes. This command judges. |
| `/arckit:conformance` | Decided-vs-designed conformance | Reads ArcKit artefacts only, never source code. |
| `/arckit:analyze` | Governance quality across artefacts | Artefact-only. No codebase involved. |
| `/arckit:gov-reuse` | Finds reusable UK government code | Scores external repos for reuse candidacy, not architecture conformance. |

A natural sequence for an inherited codebase: `/arckit:repo-audit` to find out what you have, `/arckit:adr` to record the decisions it surfaced, `/arckit:risk` to promote the CRITICAL and HIGH findings, then `/arckit:conformance` once there are ADRs to conform to.

---

## Review Checklist

Before you circulate an audit:

- Check the Limitations section against your expectations. If a dimension you cared about was skipped, re-run with focus text naming it.
- Spot-check two or three Verified findings against the cited paths. Confidence markers are only useful if they are accurate.
- Treat Absent findings as prompts, not conclusions. "No retry logic found" is a place to look, not proof none exists.
- Confirm the audited commit SHA is the one you meant. The report is point-in-time.

---

## References

| Reference | Purpose |
|-----------|---------|
| `docs/guides/repo-docs.md` | The companion documentation command |
| `docs/guides/conformance.md` | Artefact-level conformance assessment |
| `docs/guides/adr.md` | Recording the decisions this audit surfaces |
