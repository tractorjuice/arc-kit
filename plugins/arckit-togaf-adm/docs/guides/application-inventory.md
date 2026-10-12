# Application Inventory Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:application-inventory` creates a portfolio catalogue of existing applications, including lifecycle state, ownership, technology stack, dependencies, strategic fit, and capability support. It is the foundation for application rationalisation and Phase C application architecture decisions.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| ADM preliminary (`ARC-<id>-ADMP-v1.0.md`) | Mandatory scope boundary for the inventory |
| Business capability map (`ARC-<id>-BPCM-v1.0.md`) | Capability-to-application mapping |
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Migration, integration, and application requirements |
| Global principles (`ARC-000-PRIN-v1.0.md`) | Technology and portfolio principles |
| External catalogues or CMDB exports | Existing application register, ownership, cost, vendor, lifecycle data |

---

## Command

```bash
/arckit:application-inventory <project ID or application scope>
```

Output: `projects/<id>/ARC-<id>-APP-v1.0.md`

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Application Register | Application name, owner, status, business criticality |
| Strategic Fit Matrix | Fit against business value and technical health |
| Technology Landscape | Stack, platform, hosting, integration patterns |
| Dependencies | Upstream, downstream, data, vendor, and operational dependencies |
| Capability Mapping | Which business capabilities each application supports |
| Lifecycle | Maintain, enhance, replace, retire, or unknown lifecycle state |
| Risk Register | Portfolio risks and evidence gaps |
| Recommendations | Follow-up actions for rationalisation and transition planning |

---

## Workflow

| Step | Command | Result |
|------|---------|--------|
| 1 | `/arckit:adm-preliminary` | Defines inventory scope |
| 2 | `/arckit:business-capability-map` | Provides capability context |
| 3 | `/arckit:application-inventory` | Creates the application portfolio baseline |
| 4 | `/arckit:application-rationalization` | Makes keep, merge, replace, retire decisions |

---

## Review Checklist

- Every in-scope application has an owner or an explicit ownership gap.
- Business criticality, lifecycle, and strategic fit are recorded.
- Dependencies are captured both technically and operationally.
- Capability coverage is mapped without inventing unsupported links.
- Missing CMDB, cost, or vendor evidence is called out as an assumption.

---

## Related Commands

- `/arckit:application-rationalization` - Decide portfolio actions.
- `/arckit:gap-analysis` - Identify capability and application gaps.
- `/arckit:transition-architecture` - Plan migration waves.
