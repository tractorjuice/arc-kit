# arc42 Quality Scenarios Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:arc42-quality` writes a system's quality requirements in the form arc42 section 10 expects: a quality tree that groups the quality goals, and measurable quality scenarios that make each goal testable. It derives everything from the project's requirements and stakeholder analysis. Goals are grouped by the nine dimensions of the [Q42 quality model](https://quality.arc42.org), and any goal without a measurable target is listed as "Target needed" instead of being given an invented one. The command is part of the `arckit-arc42` overlay, which needs the core `arckit` plugin.

The Q42 quality model is by Gernot Starke and licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). ArcKit's quality template, and the command's classification of goals by Q42 dimension, are adapted from it, so they are licensed CC BY-SA 4.0 too; the overlay's `templates/arc42-LICENSE.md` records the attribution and ArcKit's changes. The rest of the command is MIT-licensed. A generated quality document keeps the template's written attribution line but carries none of its licence metadata: your goals, scenarios and targets remain your own content.

---

## When to Use

| Use when any of these apply | Do not use when |
|-----------------------------|-----------------|
| The arc42 description's section 10 is a gap or holds only inferred scenarios | The project has no requirements document yet: run `/arckit:requirements` first |
| Reviewers or a supplier need testable quality targets, not adjectives | You want to change a target: change the requirement in REQ, then re-run |
| You want to see which quality goals still have no measurable target | You need a full test strategy; this command proposes verification approaches but does not plan testing |

---

## Inputs

An existing project with a requirements document (`REQ`) is required. The command never creates projects and never targets `000-global`.

| Artefact | Use |
|----------|-----|
| Requirements (`ARC-<id>-REQ-v*.md`) | Every non-functional requirement and its target; business requirements that state a quality expectation |
| Stakeholder analysis (`ARC-<id>-STKE-v*.md`) | Which qualities each stakeholder cares about, and their priorities |
| ADRs (`decisions/`) | The approaches that address each goal |
| Architecture principles (`ARC-000-PRIN-v*.md`) | Mandatory quality-related principles |
| Diagrams, HLD review | The building blocks a scenario's stimulus reaches |
| Secure by Design, risk register, crosscutting concepts | Security targets, threats to a goal, and the concepts that implement it |

It asks no questions, so it also runs unattended. Defaults (such as a `[PENDING]` owner) are listed under Assumptions.

---

## Command

```text
/arckit:arc42-quality <project ID or name>
```

Output: `projects/<id>-<name>/ARC-<id>-QUAL-v1.0.md`. A re-run writes the next version beside the earlier one.

---

## How the Model Is Built

- **Goals come from sources.** One goal per distinct quality concern stated in REQ, a stakeholder goal or a mandatory principle. A quality no source mentions goes in the Gap Register, not the tree.
- **Each goal gets one Q42 dimension**, chosen by what it constrains: `#reliable`, `#efficient`, `#flexible`, `#maintainable`, `#usable`, `#operable`, `#secure`, `#safe` or `#suitable`.
- **Top quality goals** (three to five) are ranked from stakeholder priorities first and requirement priority second. They are what arc42 section 1.2 summarises.
- **Scenarios only for measurable targets.** Each scenario has a source, stimulus, environment, artefact, response and response measure. The response measure quotes the requirement's target exactly; scenarios are marked "Inferred" because their framing is derived.
- **Approaches and verification.** Each scenario names the ADRs or concepts that address it ("No approach recorded" is a finding) and a verification approach, marked "Proposed" unless a source states it.
- **Trade-offs are reported, not resolved.** Where two goals conflict, both are cited and an ADR is suggested.

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Quality Tree | Goals grouped by Q42 dimension, each pointing to its scenarios |
| Quality Goals | Every goal with its dimension, priority, source and scenarios; the Top quality goals |
| Quality Scenarios | Stimulus, response and the quoted response measure, each marked "Inferred" |
| Goals Without a Measurable Target | What the source says and what is missing |
| Approaches and Verification | ADRs or concepts per scenario, and how each could be verified |
| Dimension Coverage | All nine Q42 dimensions with their goal and scenario counts |
| Trade-offs and Conflicts | Competing goals or disagreeing sources, with a suggested decision |
| Gap Register, Source Artefacts, Assumptions | What is missing, what was read, and the defaults taken |

---

## Review Checklist

- Every goal cites a requirement, stakeholder goal or principle.
- Every response measure matches its requirement's target word for word.
- No goal without a measurable target has been given an estimated one.
- Every scenario has an approach, or appears in the Gap Register.
- The Top quality goals are the ones stakeholders actually ranked highest.

---

## Next Steps

- `/arckit:requirements` - Add measurable targets to the goals marked "Target needed".
- `/arckit:adr` - Record the approach for a scenario no decision addresses.
- `/arckit:arc42-concepts` - Document the crosscutting concepts the scenarios depend on.
- `/arckit:arc42` - Re-assemble the arc42 description so sections 1.2 and 10 cite this model.
