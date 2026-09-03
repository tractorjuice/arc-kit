# Interview Pattern

How an ArcKit command asks the user for what it cannot infer. It applies to every command that asks a question before writing an artefact; each such command points here from its **Gathering rules**.

The pattern is one message, prefilled, with defaults that stand in for answers. It follows the scaffold interview in Anthropic's `commerce-agents` reference: ask everything at once, say what you inferred, treat a skipped question as its default and record the default as an assumption.

## 1. Prefill before asking

Read the arguments and the project context first. A question is **not asked** when its answer is already in:

- the command's arguments (`$ARGUMENTS`), including a flag or a phrase that settles it;
- an upstream artefact the command reads (a stakeholder analysis fixes the audience, a requirements document fixes the scope, a business case fixes the option count);
- plugin user configuration or the artefact's regime (`organisation_name`, `default_classification`, `governance_framework`, the classification ladder `_partials/RENDERING.md` resolves). Never ask about these; they are decided elsewhere.

Say what you inferred and from where, in one line per inference, so the user can correct it.

## 2. Ask everything in one call

Ask every remaining question in a **single** call of the question tool (Claude Code's `AskUserQuestion`, up to four questions per call). There is no second round. If a command has more questions than the tool allows, the ones that change the artefact's structure come first and the rest take their defaults.

A single-select question offers its options with exactly one marked **(Recommended)**; that option is the default. A multi-select question marks at most one, and marks none when the default selection is empty (an "additional outputs" question, say). The question's header names what it decides (`Options`, `Appraisal`, `Scope`, `Phase`, `Risk appetite`), because the build harness keys its own defaults on that header.

## 3. A skipped question takes its default

An answer the user does not give, a question the tool could not ask, or a round the user dismisses, resolves to the **(Recommended)** option. Do not re-ask. Do not stop.

Then say so. The closing summary carries an **Assumptions** line listing every default taken, in the form *"Appraisal depth: strategic estimates (default; not asked)"*, so the user can re-run with a flag or edit the artefact. Where the template has an Assumptions or Constraints section, the same lines go there too.

## 4. Non-interactive runs never block

The question tool is absent in headless runs (`claude -p`, the eval suite), inside build-harness subagents, and on runtimes that have no equivalent. In every such case take the default for every question, continue, and list the defaults as assumptions. The build harness (`skills/arckit-build/SKILL.md`) restates this for its workers with a defaults table keyed on question header; that table wins where it names a header.

## 5. What this is not

- Not a prerequisite check. A missing upstream artefact is a warning and a suggestion to run its command, not a question.
- Not a request for documents. "Do you have any RFP or org chart I could read?" is an offer the user can take up by placing files under `external/` and re-running; it is stated once in the summary and never blocks the write.
- Not a place for scale, cost or model questions. Those are configuration.
