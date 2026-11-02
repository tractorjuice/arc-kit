# ArcKit — UK Legacy IT Assessment Overlay

One optional command for assessing existing project systems and dependencies, keeping
updated-definition classification separate from the published numerical risk model,
and turning findings into owned remediation actions.

## Install and run

Requires the `arckit` core plugin. Install both from the ArcKit marketplace:

```bash
claude plugin install arckit arckit-uk-legacy
```

In Claude Code:

```text
/arckit-uk-legacy:uk-legacy-assessment 001
/arckit-uk-legacy:uk-legacy-assessment 001 systems "Payments, Reporting"
/arckit-uk-legacy:uk-legacy-assessment 001 risk-model none
```

The seven generated extension targets include the command in their merged ArcKit
namespace: Codex `$arckit-uk-legacy-assessment`, Gemini/OpenCode `/arckit-uk-legacy:uk-legacy-assessment`,
and Copilot `/arckit-uk-legacy-assessment`. See the [guide](docs/guides/legacy-assessment.md)
for other targets, source versions, evidence requirements and examples.

## Outputs and evidence

Versioned Markdown and JSON assessments, a finding-linked action plan, and verified
headline/component SVG companions. Missing evidence stays unknown, draft policy stays
provisional, and supplied risk acceptance does not silently remediate a finding.
Owner approval needs documentary evidence. Assessments do not submit data to government.

The framework catalogue, full scoring rubric, updated definition and dated source
snapshots live in this overlay. They include attribution and integrity checks and
support disconnected assessments. Check for a revised framework before release;
current reporting arrangements remain subject to confirmation.

## Offline deterministic helper

```bash
node scripts/legacy-assessment.mjs --input assessment.json --json
```

Requires Node.js. The helper validates data and reproduces calculations without network
access or editing its input. The converter ships the declared runtime assets to every
generated extension. Existing CLI scaffold modes copy the merged helpers, schemas and
reference data. No new CLI subcommand is introduced.

## Data

The helper sends no data, has no network calls, and adds no telemetry. This overlay has
no hooks or MCP servers. The host assistant handles assessment evidence according to
its own configuration. The required core plugin has its own documented behaviour; see
[ArcKit privacy information](https://arckit.org/privacy.html).

## Development status

Community-contributed early draft. The structured JSON, frozen source bundle and
regression fixtures provide a reviewable foundation. Charts and validation safeguards
remain part of this draft; they do not replace assessor judgement or evidence review.
