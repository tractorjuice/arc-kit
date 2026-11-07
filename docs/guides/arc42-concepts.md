# arc42 Crosscutting Concepts Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:arc42-concepts` documents a system's crosscutting concepts: the rules, patterns and conventions that apply across many building blocks, such as the domain model, persistence, security, error handling and logging. arc42 section 8 holds them. For each concept the command records whether the architecture has decided it, which ADRs or designs say so, and which building blocks it applies to. Where nothing has decided a concept, it says so and lists the options for an ADR to choose between; it never presents an option as a decision. The command is part of the `arckit-arc42` overlay, which needs the core `arckit` plugin.

---

## When to Use

| Use when any of these apply | Do not use when |
|-----------------------------|-----------------|
| The arc42 description's section 8 is thin or a gap | The project has neither requirements nor ADRs: there is nothing to trace concepts to |
| Developers need one place that states the conventions every component follows | You want a concept decided; use `/arckit:adr`, then re-run this command |
| You want to find the concepts the architecture has never decided | You need a security assessment; use `/arckit:secure` |

---

## Inputs

An existing project with a requirements document or at least one ADR is required. The command never creates projects and never targets `000-global`.

| Artefact | Use |
|----------|-----|
| ADRs (`decisions/`) | The decisions that settle concepts |
| Data model (`ARC-<id>-DATA-v*.md`) | Domain model, persistence and data protection |
| Secure by Design (`ARC-<id>-SECD-v*.md`) | The security concept |
| Architecture principles (`ARC-000-PRIN-v*.md`) | Mandatory conventions |
| HLD and DLD reviews, vendor HLD and DLD | Concepts as designed, and reviewers' findings on them |
| Diagrams, DevOps strategy, operational readiness, platform design | Building blocks, and build, deployment and operational concepts |
| Quality scenarios (`ARC-<id>-QUAL-v*.md`) | The targets a concept has to meet |
| Codebase audit (`audits/`) | Whether the code follows each concept |

It asks no questions, so it also runs unattended. Defaults are listed under Assumptions.

---

## Command

```text
/arckit:arc42-concepts <project ID or name>
```

Output: `projects/<id>-<name>/ARC-<id>-CONC-v1.0.md`. A re-run writes the next version beside the earlier one.

---

## How Concepts Are Assessed

The template's catalogue groups 20 concepts: domain and data, security, robustness, communication, operations, development, and user-facing concepts. Each gets exactly one status:

| Status | Meaning |
|--------|---------|
| Decided | An accepted ADR, a reviewed design or a mandatory principle settles it; the source is cited |
| Partially decided | Part is settled and part is open, or two sources disagree |
| Open | The system needs it, but no source settles it |
| Not applicable | A source shows the system does not need it |
| Not assessed | No source says whether the system needs it |

- **Decided concepts** give the rules every building block follows, which building blocks they apply to, the sources, and, where a codebase audit exists, whether the code follows them.
- **Open concepts** say why they are needed and list two or three candidate approaches labelled "Proposed — not decided", with the `/arckit:adr` command that would decide them.
- **System-specific concepts** a source settles, such as multi-tenancy or offline working, are added beside the catalogue.

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Coverage Summary | The number of concepts per status |
| Concept Overview | Every catalogue concept with its status, scope and sources |
| Concept Details | Rules and sources for decided concepts; options and next step for open ones |
| System-Specific Concepts | Concepts outside the catalogue |
| Gap Register, Source Artefacts, Assumptions | What is missing, what was read, and the defaults taken |

---

## Review Checklist

- Every Decided concept cites the ADR, design or principle that settles it.
- No concept is Decided on the strength of a proposal, common practice or vendor default.
- Every Open concept has an ADR next step.
- Not applicable concepts cite the source that shows they are not needed.

---

## Next Steps

- `/arckit:adr` - Decide each Open concept.
- `/arckit:data-model` - Document the domain model and persistence if no data model exists.
- `/arckit:secure` - Assess the security concept if no Secure by Design assessment exists.
- `/arckit:arc42` - Re-assemble the arc42 description so section 8 cites this document.
