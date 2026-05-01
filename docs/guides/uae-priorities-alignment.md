# UAE National Priorities Alignment Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.uae-priorities-alignment` generates a National Priorities Alignment Statement under the UAE Federal Government Guide to Aligning Digital Government Projects with National Priorities. Captures reuse-vs-build justification, capability-reuse register (UAE Pass, FedNet, etc.), and strategy alignment to NIS 2031 / AI 2031 / Digital Economy Strategy / We the UAE 2031.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Project scope and outcomes |
| SOBC (`ARC-<id>-SOBC-v*.md`) | Strategic case and benefits |
| ADRs (`ARC-<id>-ADR-*.md`) | Material decisions to date |
| Prior UAE artefacts (CLAS, PDPL, IAS, CRES, UPASS, ZBUR, DREC, DSHR if present) | Reuse and compliance posture inputs |

---

## Command

```bash
/arckit.uae-priorities-alignment <project ID or service name>
```

Output: `projects/<id>/ARC-<id>-NPRA-v1.0.md`

---

## Statement Structure

| Section | Contents |
|---------|----------|
| Strategic Alignment Matrix | Project → NIS 2031 / AI 2031 / Digital Economy Strategy / We the UAE 2031 |
| Reuse-vs-Build Justification | Per major capability, reuse path considered and chosen rationale |
| Capability Reuse Register | UAE Pass, FedNet, federal registers, shared services in use |
| Resource-Efficiency Calculation | Cost / time / FTE saved through reuse vs build |
| Feasibility & Pilot Plan | Phased delivery and decision points |
| External References | Federal Government Guide citations |

---

## Federal Capability Register (typical reuse candidates)

| Capability | Owner | Use case |
|------------|-------|----------|
| UAE Pass | TDRA | Identity / authentication / e-signature |
| FedNet | TDRA | Federal connectivity |
| Federal data registers | Various ministries | Authoritative source for citizen / business data |
| Sovereign cloud (Core42 / Azure UAE / FedNet) | Various | Hosting |
| Shared service platforms | Various | Common government services |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Foundations | Compliance and design baseline | `/arckit.uae-pdpl`, `/arckit.uae-classification`, `/arckit.uae-ias` |
| Alignment | National-priorities statement | `/arckit.uae-priorities-alignment` |
| Business case | Reuse + alignment into SOBC | `/arckit.sobc` |
| Reuse design | Detail UAE Pass integration | `/arckit.uae-uaepass` |

---

## Review Checklist

- Strategic alignment matrix references all four national strategies.
- Reuse considered for every major capability before "build" is chosen.
- Capability Reuse Register lists each federal capability used (or explicitly considered and rejected).
- Resource-efficiency calculation is quantitative.
- Pilot / phased plan has named gates and approvals.
- Reuse outputs feed UAE Pass integration design and SOBC.

---

## Key Notes

- **Reuse default**: Federal Government Guide expects "reuse first, build last" — every "build" decision needs documented justification.
- **Run late**: This artefact synthesises the UAE-specific stack — run after the upstream UAE commands so it can cite their outputs.
- **SOBC integration**: Output is designed to flow directly into the Strategic Outline Business Case via `/arckit.sobc`.
- **Community-contributed**: Output should be reviewed by qualified federal strategy / compliance counsel before reliance.
