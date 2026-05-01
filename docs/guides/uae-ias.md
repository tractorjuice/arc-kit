# UAE Information Assurance Standard (IAS) Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.uae-ias` generates a UAE IAS Statement of Applicability against the 188 controls — 60 management controls (M1–M6) plus 128 technical controls (T1–T9) — priority-tiered P1 to P4. Anchored on the UAE Cybersecurity Council Information Assurance Standard v2.

Targeted at federal entities and Critical Information Infrastructure (CII) operators.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | System scope and functional context |
| Architecture (`ARC-<id>-ARCH-v1.0.md`) | Components and trust boundaries |
| Security NFRs (`ARC-<id>-NFR-SEC-v1.0.md`) | Security requirements |
| Security design (`ARC-<id>-SECD-v1.0.md`) | Existing controls and posture |

---

## Command

```bash
/arckit.uae-ias <project ID or system description>
```

Output: `projects/<id>/ARC-<id>-IAS-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Scope | System boundary, CII designation status, sector authority |
| Statement of Applicability | All 188 controls with P1–P4 priority and applicability rationale |
| Risk Treatment Plan | Per-gap risk score, treatment option, owner, deadline |
| CII Registration | Cybersecurity Council registration status and obligations |
| External References | UAE Cybersecurity Council IAS v2 citations |

---

## Control Family Reference

| Family | Range | Description |
|--------|-------|-------------|
| Management | M1 | Strategy and Planning |
| Management | M2 | Information Security Risk Management |
| Management | M3 | Awareness and Training |
| Management | M4 | Human Resources Security |
| Management | M5 | Compliance |
| Management | M6 | Performance Evaluation and Improvement |
| Technical | T1 | Asset Management |
| Technical | T2 | Physical and Environmental Security |
| Technical | T3 | Operations Management |
| Technical | T4 | Communications |
| Technical | T5 | Access Control Management |
| Technical | T6 | Third-Party Security |
| Technical | T7 | Information Systems Acquisition, Development & Maintenance |
| Technical | T8 | Information Security Incident Management |
| Technical | T9 | Information Systems Continuity Management |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Architecture | System scope and security NFRs | `/arckit.requirements`, `/arckit.platform-design` |
| IAS | Statement of Applicability + Risk Treatment Plan | `/arckit.uae-ias` |
| Residency | T-family controls into CSP / region choice | `/arckit.uae-cloud-residency` |
| Risk | Surface IAS gaps to project risk register | `/arckit.risk` |

---

## Review Checklist

- All 188 controls present in the Statement of Applicability.
- Each control has Applicable / Not Applicable + rationale (no blank cells).
- Priority tier (P1–P4) assigned per control.
- Gaps have a treatment option (mitigate / transfer / accept / avoid) with named owner.
- CII registration status is explicit (registered / pending / not designated).
- T-family gaps that constrain residency choice flagged for `/arckit.uae-cloud-residency`.

---

## Key Notes

- **CII status**: Designation as Critical Information Infrastructure changes priority profile and obligations. Confirm with the Cybersecurity Council before relying on the SoA.
- **Audit cadence**: IAS expects independent assessment on a defined cycle — capture the next assessment date in Document Control.
- **Run order**: Run after the security architecture is stable; rerun on material architecture changes.
- **Community-contributed**: Output should be reviewed by qualified RSSI / federal compliance counsel before reliance.
