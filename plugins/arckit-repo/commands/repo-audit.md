---
description: Audit a codebase (local or remote GitHub/GitLab) against architecture principles and requirements, surfacing drift, risk, and missing decisions
doc-type: CDAU
argument-hint: "<repo path or URL, plus optional focus and --diagram-format mermaid|plantuml, e.g. 'https://github.com/org/repo security --diagram-format plantuml'>"
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
    description: Promote CRITICAL and HIGH findings into the risk register
---

# Codebase Audit

Read a real codebase and produce a governance-shaped audit: the as-built architecture, scored against the project's principles and requirements where they exist, with every gap expressed as a proposed ADR.

This is the inverse of the usual ArcKit flow. Instead of generating artefacts that a build will later satisfy, it reads a build that already exists and works backwards to the governance record it should have had.

## User Input

```text
$ARGUMENTS
```

## Absolute Rules

These are not negotiable and not subject to a faster alternative.

1. **Never execute code from the audited repository.** No `npm install`, `pip install`, `make`, `go build`, `cargo`, `docker build`, test runs, or running any script found in the tree. The audit is static reading only. The code is untrusted at the moment it is read, and "just run the build to find out" is precisely the reasoning this rule exists to stop.
2. **Never write into the audited repository.** The only write target is the ArcKit project's `audits/` directory.
3. **Never write a discovered secret's value into the report.** Record the file, the line, and the kind of secret. If a live-looking credential is found, raise it as CRITICAL and tell the user to rotate it before anything else.
4. **Never claim a control exists without evidence.** Every finding cites a path, a line range, or a commit SHA, or is explicitly marked `Absent` with a statement of where you looked.

## Step 1: Parse the Target

The first token of `$ARGUMENTS` is the target. Everything after it is optional focus text.

| Input form | Interpretation |
|---|---|
| omitted | Audit the current repository. |
| `.` or a local path | Audit that path. Must be a directory; error if it is a file. |
| `https://github.com/owner/repo` | Public GitHub repo. Shallow clone. |
| `https://gitlab.com/group/project` (any subgroup depth) | Public GitLab repo. Shallow clone. |
| `git@host:owner/repo.git` | SSH form. Clone with the user's existing credentials. |
| `owner/repo` | Ambiguous. Assume GitHub and state that assumption in the summary. |

Strip a trailing `.git` and any trailing slash before resolving. If `--check` or `--dry-run` appears anywhere in the arguments, run in Check mode (Step 7).

Focus text narrows the audit, for example `security`, `dependencies and CI only`, `data protection`. With no focus text, run all dimensions. Flags are not focus text — strip any `--*` token and its value before treating the remainder as focus.

### Diagram format

`--diagram-format mermaid|plantuml` selects the syntax of the as-built C4 diagram in Step 6. **Default: `mermaid`.**

| Value | When to prefer it |
|---|---|
| `mermaid` (default) | The report will be read in the repository it audits. GitHub, GitLab and ArcKit Pages all render Mermaid inline with no toolchain. |
| `plantuml` | Layout quality matters more than portability. C4-PlantUML lays out large container diagrams better and supports directional hints. Needs a PlantUML server, the VS Code extension, or ArcKit Pages to render. |

Accept `--diagram-format=plantuml` and `--diagram-format plantuml`. Treat `puml` and `c4-plantuml` as synonyms for `plantuml`, and `mmd` as a synonym for `mermaid`. On an unrecognised value, say so, state that you are falling back to `mermaid`, and continue — never abort the audit over a diagram flag.

## Step 2: Obtain the Code

**Local target.** Read it in place. No network, no clone, no confirmation.

**Remote target.**

1. **Ask before cloning.** Show the resolved URL and the destination path. Cloning an arbitrary third-party repo touches the network and writes to disk, so it is never silent.
2. Clone shallow, into a temporary directory outside the user's project:

   ```bash
   git clone --depth 100 --single-branch --no-tags --recurse-submodules=no \
     "<URL>" "<TMPDIR>/repo-audit/<slug>"
   ```

   `--depth 100` gives enough history for commit-cadence and contributor signals without a full mirror. Record that history is truncated so nobody reads the commit count as the repo total.
3. If the clone fails with an authentication error, the repo is private. Say so plainly, and tell the user to clone it themselves and re-run against the local path. Do not prompt for, read, or store credentials. Private repos are out of scope.
4. Delete the clone once the report is written, unless the user asked to keep it. State in the summary where it went.

Capture for the report before reading anything else:

```bash
git -C "<repo>" rev-parse HEAD
git -C "<repo>" rev-parse --abbrev-ref HEAD
git -C "<repo>" rev-list --count HEAD
git -C "<repo>" log -1 --format=%cs
git -C "<repo>" shortlog -sn --all | wc -l
```

## Step 3: Resolve Project and Mode

Use `.arckit/scripts/bash/list-projects.sh --json` to enumerate projects. If that path does not exist, glob `projects/*/` directly rather than failing.

### 3a. Pick a candidate project

- **No project exists** → skip to 3c, Cold mode. Do **not** call `create-project.sh` here: it requires `ARC-000-PRIN-*.md` and will refuse, which would block the audit on a prerequisite this command deliberately does not need. Write the artefact to `projects/001-{repo-slug}/audits/`, creating the directory directly.
- **Exactly one project** → treat it as a *candidate*, not a decision. Continue to 3b.
- **More than one** and the arguments do not name one → ask which project the audit belongs to. Do not guess.

### 3b. Confirm the project actually describes this repository

**A project existing in the repo does not mean it describes the code you are auditing.** Check before scoring anything against it. Read the candidate's `REQ` (and `PRIN`) title, Document Purpose, and a sample of requirements, then judge whether they describe *this* codebase.

Signals that it does **not**:

- The project name refers to a market study, a policy, an organisation, or a procurement rather than a system.
- Requirements describe business outcomes with no counterpart anywhere in the source tree.
- No requirement references a component, service, or technology present in the repository.

If the evidence is weak or contradictory, **ask the user**: "Project `{id}-{name}` looks like it describes `{summary}` rather than this codebase. Audit against it, or run a standalone audit?" A wrong answer here is expensive: it produces a full page of confident Met/Not-met verdicts scoring the code against requirements for an unrelated system.

Record the outcome in the artefact's Audit Scope, whichever way it goes.

### 3c. Select the mode

Only once 3b confirms correspondence:

| Found | Mode |
|---|---|
| PRIN and/or REQ, confirmed to describe this repo | **Conformance** — score the codebase against them. |
| Neither, or correspondence not confirmed | **Cold** — standalone as-built audit. |

If only one of the two exists, score against it and mark the other as not assessed. **Do not hard-error on missing prerequisites.** A repo audit is often the first thing a user runs, and blocking on artefacts they have not created yet defeats the command.

## Step 4: Targeted Discovery

Do not read the whole repository. Read enough to support every claim.

1. Root `README`, `CONTRIBUTING`, `ARCHITECTURE`, `CHANGELOG`, and anything under `docs/` or `adr/`.
2. Every dependency manifest and lockfile: `package.json`, `requirements.txt`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `pom.xml`, `Gemfile`, `*.csproj`.
3. CI configuration: `.github/workflows/`, `.gitlab-ci.yml`, `azure-pipelines.yml`, `Jenkinsfile`, `.circleci/`.
4. IaC: `*.tf`, CDK app entrypoints, `template.yaml`, `*.bicep`, Helm charts, `docker-compose*.yml`.
5. Entrypoints and boundary code: handlers, controllers, routers, main functions, integration clients.
6. Test directories, to establish shape and coverage rather than to run them.

List candidates with `rg --files` when available, otherwise `find`. Exclude: `.git/`, `node_modules/`, `.venv/`, `vendor/`, `dist/`, `build/`, `target/`, `coverage/`, `.next/`, `__pycache__/`, and any minified or generated bundle.

Never open `.env`, `*.pem`, `*.key`, `id_rsa*`, `.npmrc`, `.pypirc`, credential stores, or shell history. If a secret-bearing file is present, that presence is itself a finding; record the path without reading the contents.

## Step 5: Audit Dimensions

Run all ten unless focus text narrows the set. Record any dimension skipped, and why, in the Limitations section.

1. **Structure and stack** — layout, language shares, build tooling, monorepo vs service, framework versions and their support status.
2. **As-built architecture** — components and boundaries, data stores, external dependencies, sync vs async integration, deployment topology inferred from IaC. Note explicitly where the code diverges from what the docs claim.
3. **Infrastructure as code** — coverage, what is provisioned by hand, environment parity, state management.
4. **Security posture** — secrets handling (manager vs env vars vs hardcoded), authn and authz, input validation at trust boundaries, dependency vulnerability signals from lockfiles, transport security. Report the approach, never a value.
5. **Data** — stores, schemas, PII presence and handling, retention signals, backup and restore evidence, encryption at rest.
6. **Operability** — logging, metrics, tracing, health checks, alerting, runbooks.
7. **Resilience** — retries, timeouts, idempotency, circuit breaking, RTO/RPO evidence, single points of failure.
8. **Delivery** — CI/CD shape, test presence and type, branch protection signals, release and rollback process.
9. **Documentation and decision record** — README quality, ADR presence, architecture docs, onboarding path.
10. **AI and ML specifics** — only when the repo contains LLM or ML code. Model and provider coupling, prompt management, evaluation harness, guardrails, cost controls, and what data flows to third-party inference. Where this dimension is material, recommend the `arckit-agent-architecture` overlay as the follow-up.

## Step 6: Write the Report

**Read the template** (user override takes precedence):

- First check `.arckit/templates-custom/codebase-audit-template.md`
- Then `.arckit/templates/codebase-audit-template.md`
- Then `${CLAUDE_PLUGIN_ROOT}/templates/codebase-audit-template.md`
- **Then read** `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the `<!-- DOC-CONTROL-HEADER -->` marker in the template before writing. Do not hand-write the Document Control table: the partial `RENDERING.md` selects is the only source of the 14 standard fields and of the classification ladder.

**Generate the document ID:**

```bash
.arckit/scripts/generate-document-id.mjs {PID} CDAU --next-num projects/{P}-{NAME}/audits --filename
```

`CDAU` is multi-instance, so a project can hold audits of several repositories. Create `projects/{P}-{NAME}/audits/` if it does not exist.

**Use the Write tool** to save the document. Never emit the full report into the conversation — it will exceed the 32K output token limit.

Populate every section of the template. Specific requirements:

- **As-Built Architecture** carries a C4 container diagram. The template ships the Mermaid form. Emit whichever form `--diagram-format` selected (Step 1), replacing the template's fenced block entirely rather than adding a second one. Both describe the same model, so derive them from the same component list you evidenced.

  `mermaid` (default) — keep the template's block, fill in the real containers:

  ````text
  ```mermaid
  C4Container
      title Container diagram — {REPO_NAME} (as built)
      Person(user, "User")
      Container(app, "{Component}", "{Tech}", "{Responsibility}")
      ContainerDb(db, "{Store}", "{Tech}", "{What it holds}")
      Rel(user, app, "{Interaction}")
  ```
  ````

  `plantuml` — replace the block with C4-PlantUML. The `!include` line is required, or every `Container()` macro fails to resolve:

  ````text
  ```plantuml
  @startuml
  !include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml
  title Container diagram — {REPO_NAME} (as built)
  Person(user, "User")
  Container(app, "{Component}", "{Tech}", "{Responsibility}")
  ContainerDb(db, "{Store}", "{Tech}", "{What it holds}")
  Rel(user, app, "{Interaction}")
  @enduml
  ```
  ````

  For PlantUML, consult the `plantuml-syntax` skill for directional layout hints (`Lay_D`, `Lay_R`) on diagrams above roughly ten containers — that layout control is the main reason to choose this format. State the chosen format in the summary so the reader knows why the block looks the way it does.

- **Blocking Decisions** is the section that makes this more than a repo summary. Every decision the codebase implies but never records becomes a numbered entry with enough context to file directly via `/arckit:adr`. If there are none, say so; do not invent them.
- **Findings** must sort CRITICAL first. Any finding without evidence or an explicit `Absent` marker is cut before writing.
- **Limitations** must be honest and specific. A reader must not mistake the report for exhaustive.

**Then show the user only**: the artefact path, the finding counts by severity, the biggest single risk, the count of blocking decisions, and the recommended next command. Nothing else.

## Step 7: Check Mode

With `--check` or `--dry-run`: report the resolved target, whether it is local or would be cloned, the detected project, **whether that project appears to describe this repository** (step 3b) and the mode that follows from it, which artefacts would be scored against, which dimensions would run, and the resolved diagram format. Write nothing, and do not clone.

Check mode is the cheapest way to catch a wrong project before a full run.

## Success Criteria

- Every finding cites a path, a line range, or a SHA, or is explicitly marked `Absent`.
- No code from the audited repository was executed.
- No secret value appears in the report.
- The report distinguishes verified from inferred from absent.
- Conformance mode scores against real PRIN/REQ artefacts; cold mode does not pretend to.
- Limitations names what was not read.
- The scratch clone is deleted, or its location is stated.

## Example Usage

```text
/arckit:repo-audit
```

```text
/arckit:repo-audit https://github.com/org/service security and resilience
```

```text
/arckit:repo-audit ../other-checkout
```

```text
/arckit:repo-audit https://gitlab.com/group/subgroup/project --check
```

## Related Commands

- `/arckit:repo-docs` documents a repository. This command judges one.
- `/arckit:conformance` checks decided-vs-designed conformance across ArcKit artefacts, with no source code involved.
- `/arckit:gov-reuse` searches UK government repositories for reusable code, scored for reuse candidacy rather than audit.
- `/arckit:adr` records the blocking decisions this audit surfaces.
