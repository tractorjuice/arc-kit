# UAE Sovereign Cloud Residency Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.uae-cloud-residency` assesses sovereign cloud residency under the UAE National Cloud Security Policy v2. Validates per-classification residency, names approved CSP options, and captures the shared-responsibility matrix and exit / portability plan.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Smart Data Classification Register (`ARC-<id>-CLAS-v*.md`) | **Required** — drives residency rules per dataset |
| Architecture (`ARC-<id>-ARCH-v1.0.md`) | Workload topology and components |
| IAS Statement of Applicability (`ARC-<id>-IAS-v*.md`) | T-family technical controls constrain CSP choice |

> **Run after**: `/arckit.uae-classification` — the command halts if the classification register is missing.

---

## Command

```bash
/arckit.uae-cloud-residency <project ID or service name>
```

Output: `projects/<id>/ARC-<id>-CRES-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Scope | Workloads in scope, CII status, classification levels involved |
| Per-Dataset Residency Assessment | Required vs actual residency, gap, derogation if any |
| CSP Due-Diligence Pack | Approved options compared against requirements |
| Shared-Responsibility Matrix | Customer / CSP responsibility per IAS control |
| Exit and Portability Plan | Lock-in mitigations, data egress, rebuild plan |
| External References | National Cloud Security Policy v2 citations |

---

## Approved CSP Options

| Provider | Region(s) | Sovereign posture |
|----------|-----------|-------------------|
| Core42 / G42 Sovereign | UAE | Federal sovereign cloud |
| Microsoft Azure | UAE North, UAE Central | Hyperscaler with UAE residency |
| TDRA FedNet | UAE | Federal government network |
| e& Sovereign Launchpad on AWS | UAE | Sovereign overlay on AWS |

> AWS me-south-1 acceptability under the Cloud Security Policy is flagged as `[NEEDS VERIFICATION]` in the overlay maintenance log — confirm before relying on AWS-only options.

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Classification | Smart Data ladder per dataset | `/arckit.uae-classification` |
| Residency | CSP / region selection + SR matrix | `/arckit.uae-cloud-residency` |
| Decisions | Capture CSP and region as ADRs | `/arckit.adr` |
| Security | Reconcile T-family gaps | `/arckit.uae-ias`, `/arckit.risk` |

---

## Review Checklist

- Smart Data Classification Register exists and was the input.
- Every Confidential-and-above dataset has UAE-resident hosting.
- Derogations (if any) cite the National Cloud Security Policy clause.
- Shared-responsibility matrix mapped to IAS controls (no orphans).
- Exit / portability plan covers data extraction format and timeline.
- Material decisions (CSP, region, derogations) captured as ADRs.

---

## Key Notes

- **Hard prerequisite**: This command halts without `ARC-<id>-CLAS-v*.md`. Run `/arckit.uae-classification` first.
- **CII workloads**: Tighter residency rules apply — confirm with the Cybersecurity Council.
- **Decision capture**: CSP and region selection are architecturally significant — produce ADRs via `/arckit.adr`.
- **Community-contributed**: Output should be reviewed by qualified federal compliance counsel before reliance.
