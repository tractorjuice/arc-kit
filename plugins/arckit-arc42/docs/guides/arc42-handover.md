# arc42 SDD Handover Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:arc42-handover` hands a governed architecture over to a Specification Driven Development (SDD) tool that builds the solution. [Spec Kit](https://github.com/github/spec-kit) is the first target. The command reads the arc42 description and the artefacts behind it and writes a handover pack: a constitution, one feature brief per epic, and the architecture each plan must follow. Every carried requirement, decision and principle is tagged with its ArcKit ID, so traceability survives the handover and `/arckit:traceability` can read it back from the delivered specs. ArcKit's role stays governance: it supplies inputs and checks the evidence; the SDD tool builds. The command is part of the `arckit-arc42` overlay, which needs the core `arckit` plugin.

---

## When to Use

| Use when any of these apply | Do not use when |
|-----------------------------|-----------------|
| A delivery team will build the system with Spec Kit or a similar SDD tool | There is no arc42 description yet: run `/arckit:arc42` first |
| You want requirement IDs and ADR numbers to survive into specs, plans and tasks | You want ArcKit to generate code; it doesn't |
| You need to check delivered work against the governance decisions afterwards | The architecture is still being decided; hand over once the key ADRs are accepted |

---

## Inputs

An existing project with an arc42 description (`ARC42`) and a requirements document (`REQ`) is required. The command never creates projects and never targets `000-global`.

| Artefact | Use |
|----------|-----|
| arc42 description (`ARC-<id>-ARC42-v*.md`) | Constraints, solution strategy, building blocks, deployment and concepts |
| Requirements | Requirement IDs, priorities and acceptance criteria for each feature |
| Architecture principles | The constitution's principles |
| ADRs | The decisions every plan must follow |
| Backlog (`ARC-<id>-BKLG-v*.md`) | The epics that become feature briefs |
| Data model, quality scenarios, crosscutting concepts | Entities, success criteria and conventions |
| Stakeholders, diagrams, Secure by Design, risks, technical debt, glossary | Users, building blocks, constraints and debt not to add to |

If a source is newer than the version the arc42 description recorded, the pack uses the newer source and lists "arc42 description is older than its sources" in its Gap Register.

Name epic IDs in the arguments to brief only those epics. The command asks no questions, so it also runs unattended.

---

## Command

```text
/arckit:arc42-handover <project ID or name> [EPIC-NNN ...]
```

Output: `projects/<id>-<name>/ARC-<id>-SDDH-v1.0.md`. A re-run writes the next version beside the earlier one and keeps feature numbers stable, so the delivery team's Spec Kit features still match.

---

## The Traceability Tags

The tags are the contract between ArcKit and the delivery team:

- Every feature declares the ArcKit project it delivers with one ownership tag, `[ArcKit Project 001]`, at the top of its Specify Input; Spec Kit copies that line into the spec. Requirement IDs repeat across projects, so traceability credits a feature only when it carries this project's ownership tag and no other project's.
- Every carried item is tagged `[ArcKit <ID>]`: `[ArcKit FR-012]`, `[ArcKit NFR-P-001]`, `[ArcKit ADR-003]`, `[ArcKit EPIC-002]`, `[ArcKit Principle 4]`. Several IDs can share one tag: `[ArcKit FR-012, FR-013]`.
- Spec Kit numbers each feature's own requirements `FR-001` and success criteria `SC-001`. Those local IDs are not ArcKit IDs. Keep both: Spec Kit's ID first and the ArcKit tag after the statement, as in `- **FR-001**: System MUST let a resident cancel a booking [ArcKit FR-012]`.
- Keep the tags, including the ownership tag, in `spec.md`, `plan.md` and `tasks.md`. `/arckit:traceability` reads them back.

---

## Handing Over in Spec Kit

| Step | Spec Kit step | Input from the pack |
|------|------------------|---------------------|
| 1 | `speckit.constitution` | Constitution Input |
| 2 | `speckit.specify`, one feature at a time | The feature's Specify Input |
| 3 | `speckit.clarify` | The `[NEEDS CLARIFICATION]` markers the brief carries |
| 4 | `speckit.plan` | The feature's Plan Input plus the Shared Plan Context |
| 5 | `speckit.tasks`, `speckit.implement`, `speckit.converge` | — |

The steps are Spec Kit's logical names. How you invoke one depends on your Spec Kit integration, as Spec Kit's [command invocation](https://github.github.io/spec-kit/integrations/cli.html#command-invocation) guidance describes; use the form exposed by your installed integration:

| Integration | `speckit.specify` is invoked as |
|-------------|---------------------------------|
| GitHub Copilot, default skills mode | `/speckit-specify` |
| Codex, Command Code and ZCode skills | `$speckit-specify` |
| Kimi skills | `/skill:speckit-specify` |
| Integrations using slash-command notation | `/speckit.specify` |

The pack carries this table too. Its inputs are plain text and work with any of these forms, and with other SDD tools that take a constitution, a feature description and a plan.

Where the sources leave something open, the brief writes Spec Kit's own `[NEEDS CLARIFICATION: ...]` marker, so `speckit.clarify` raises it with the team instead of the pack guessing.

---

## Bringing Evidence Back

1. `/arckit:traceability` reads the `[ArcKit ...]` tags in `specs/` and traces each requirement to the features this project owns and their tasks, with tagged task progress. Pass `SPECS=<path>` when the delivery repository is elsewhere. A feature with no ownership tag, or with tags for more than one project, is listed as a gap instead of being counted.
2. `/arckit:conformance` checks each `specs/*/plan.md` and the constitution against the ADRs and principles.
3. `/arckit:repo-audit` audits the delivered code.
4. Record decisions taken during delivery with `/arckit:adr`, then re-run `/arckit:arc42` and `/arckit:arc42-handover`.

`/arckit:health` flags the pack and the arc42 description as `STALE-VIEW` once their sources move on.

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| How to Use This Pack | The Spec Kit steps and which section feeds each |
| Traceability Tags | The tag convention for the delivery team |
| Constitution Input | Principles, constraints and conventions, each tagged with its source |
| Shared Plan Context | Accepted decisions, building blocks, deployment and quality targets |
| Feature Briefs | Per epic: Specify Input, Requirements Carried, Success Criteria Candidates, Plan Input, Debt to Avoid |
| Evidence Loop | How delivery evidence returns to ArcKit |
| Gap Register, Source Artefacts, Assumptions | What is missing, what was read, and the defaults taken |

---

## Review Checklist

- Every Specify Input starts with this project's ownership tag, `[ArcKit Project NNN]`.
- Every requirement in a feature brief carries its ArcKit tag, with its ID exactly as REQ writes it.
- Every constitution rule cites a principle, constraint or decided concept.
- The Shared Plan Context lists accepted ADRs only, with Proposed ones marked not yet decided.
- Open questions are `[NEEDS CLARIFICATION]` markers, not assumptions.

---

## Next Steps

- `/arckit:backlog` - Plan epics so each feature brief follows one.
- `/arckit:traceability` - After delivery, trace requirements through the specs and tasks.
- `/arckit:conformance` - After delivery, check the plans against the ADRs and principles.
- `/arckit:arc42` - Refresh the arc42 description when decisions change, then regenerate the pack.
