# TOGAF Gap Analysis Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:gap-analysis` compares current and target architecture states, scores gaps, maps them to workstreams, and prepares the evidence base for TOGAF ADM Phase E and migration planning.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Business capability map (`ARC-<id>-BPCM-v1.0.md`) | Mandatory baseline for capability gaps |
| Architecture principles (`ARC-000-PRIN-v1.0.md`) | Compliance and principle-alignment checks |
| Architecture strategy (`ARC-<id>-STRAT-v1.0.md`) | Target state and investment priorities |
| Application inventory (`ARC-<id>-APP-v1.0.md`) | Current application coverage |
| Application rationalisation (`ARC-<id>-APPR-v1.0.md`) | Target portfolio decisions |
| Existing assessments or migration plans | Evidence for baseline and target states |

---

## Command

```bash
/arckit:gap-analysis <project ID or gap-analysis scope>
```

Output: `projects/<id>/ARC-<id>-GAPA-v1.0.md`

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Capability Gap Matrix | Current state, target state, gap, severity |
| Gap Heatmap | Priority view by impact and urgency |
| Workstream Mapping | Gaps grouped into delivery workstreams |
| Gap-to-Risk Mapping | Relationship between gaps and project or enterprise risks |
| Assumptions and Constraints | Evidence gaps and known limits |
| Traceability | Capability, principle, strategy, application, and risk links |

---

## Severity Guidance

| Severity | Meaning |
|----------|---------|
| Critical | Blocks target outcomes or creates unacceptable risk |
| High | Materially weakens a priority capability or compliance position |
| Medium | Requires planned remediation but does not block delivery |
| Low | Improvement opportunity or documentation gap |

---

## Review Checklist

- Gaps are stated as differences between current and target states.
- Severity ratings include rationale and evidence.
- Every high or critical gap has an owner or proposed workstream.
- Gap-to-risk mapping includes existing risk identifiers where available.
- Assumptions are visible rather than hidden in the analysis.

---

## Related Commands

- `/arckit:transition-architecture` - Turn gaps into migration waves.
- `/arckit:architecture-board` - Present prioritised gaps for governance.
- `/arckit:architecture-change` - Reassess gaps after approved changes.
