# Architecture Repository Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:architecture-repository` creates a reusable architecture knowledge store. It synthesises principles, ADRs, diagrams, lessons, standards, patterns, reference architectures, and building blocks across projects.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Global architecture principles (`ARC-000-PRIN-v1.0.md`) | Mandatory standards and decision foundation |
| ADRs (`ARC-<id>-ADR-*.md`) | Decisions, alternatives, consequences, reusable patterns |
| Diagrams (`ARC-<id>-DIAG-*.md`) | Reference architecture and integration patterns |
| Project stories (`ARC-<id>-STORY-v1.0.md`) | Lessons learned and delivery outcomes |
| Analysis reports (`ARC-<id>-ANAL-v1.0.md`) | Findings and reusable technical observations |
| TOGAF artefacts (`BPCM`, `GAPA`, `TRANS`, `APP`, `BORD`, `ACHG`) | Capability, gap, transition, portfolio, and governance knowledge |

---

## Command

```bash
/arckit:architecture-repository <optional project ID or global scope>
```

Output: `projects/<id>/ARC-<id>-REPO-v1.0.md`

For an enterprise-wide repository, use project `000` or the repository's chosen global project convention.

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Standards Register | Principles, approved standards, governance rules |
| Patterns Library | Reusable architecture, integration, data, and governance patterns |
| Reference Architectures | Canonical diagrams and implementation shapes |
| Lessons Learned | What worked, failed, or should change next time |
| Reusable Building Blocks | Components, services, templates, and reusable decisions |
| Search Index | Keywords, tags, source artefacts, and retrieval notes |
| Traceability | Source documents and repository entries |

---

## Review Checklist

- Repository entries come from real artefacts, not aspirational descriptions.
- Each pattern has applicability, constraints, and source evidence.
- Standards distinguish mandatory controls from recommendations.
- Lessons learned include context, not only conclusions.
- Search tags are useful for future `/arckit:research`, `/arckit:search`, or board work.

---

## Related Commands

- `/arckit:adm-preliminary` - Reuse repository standards in new ADM cycles.
- `/arckit:adr` - Feed decisions into the repository.
- `/arckit:search` - Find reusable knowledge across project artefacts.
