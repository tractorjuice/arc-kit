# ANSSI Security Posture Assessment Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.fr-anssi` assesses compliance with the ANSSI Guide d'hygiène informatique (42 measures across 7 themes) and ANSSI cloud security recommendations. Applicable to all French organisations, public or private.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | IS scope, security requirements |
| Risk register | Security risks and existing controls |
| Architecture diagrams | Network and system topology |

---

## Command

```bash
/arckit.fr-anssi Assess ANSSI hygiene measures for <IS scope or project>
```

Output: `projects/<id>/ARC-<id>-ANSSI-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Theme 1: Administration | Admin account management, privileged access |
| Theme 2: Authentication | Password policy, MFA, account lockout |
| Theme 3: Updates | Patch management, end-of-life components |
| Theme 4: Monitoring | Log collection, SIEM, alert management |
| Theme 5: Backups | Backup policy, offline copies, restoration testing |
| Theme 6: Network | Segmentation, firewall rules, DMZ |
| Theme 7: Workstations | Endpoint protection, removable media, encryption |
| Cloud Section | ANSSI cloud qualification matrix applicability |
| Gap Analysis | Priority matrix (P1 critical / P2 high / P3 medium) |

---

## 42 Measures — 7 Themes

Each theme covers 5–8 measures assessed as: ✅ Compliant · ⚠️ Partial · ❌ Non-compliant · N/A Not applicable.

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | IS scope and security baseline | `/arckit.requirements` |
| Risk | Security risks | `/arckit.risk` |
| Assessment | ANSSI 42 measures | `/arckit.fr-anssi` |
| Cartography | IS mapping | `/arckit.fr-anssi-carto` |
| Risk analysis | EBIOS RM study | `/arckit.fr-ebios` |
| Policy | Security policy (PSSI) | `/arckit.fr-pssi` |

---

## Review Checklist

- All 42 measures assessed across 7 themes.
- Priority gaps flagged (P1 critical requires immediate remediation).
- Cloud section completed if cloud services in scope.
- ANSSI cloud qualification matrix applied (SecNumCloud, C5, CSA STAR, EUCS).
- Gap analysis with remediation timeline produced.
- Assessment classified OFFICIAL-SENSITIVE (ANSSI assessment is sensitive).

---

## Key Notes

- **Scope**: Applicable to any French organisation (public or private) — not limited to OIV/OSE.
- **Cloud qualification**: ANSSI distinguishes SecNumCloud (French sovereign qualification) from other cloud certifications — the guide specifies which qualification level is appropriate for which data sensitivity.
- **ANSSI** = French national cybersecurity agency, analogous to the UK's NCSC.
