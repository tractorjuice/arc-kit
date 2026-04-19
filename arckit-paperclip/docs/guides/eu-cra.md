# EU Cyber Resilience Act Compliance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.eu-cra` generates a Cyber Resilience Act (Regulation EU 2024/2847) compliance assessment for products with digital elements placed on the EU market. Full obligations apply from **11 December 2027**.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Product description and security requirements |
| Risk register | Security risks, vulnerability risks |
| Secure by Design | Existing security controls |

---

## Command

```bash
/arckit.eu-cra Assess CRA compliance for <product description and classification>
```

Output: `projects/<id>/ARC-<id>-CRA-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Scope and Classification | Default / Important (Class I) / Critical (Class II) |
| Security by Design (Annex I Part I) | 12 security requirements assessed |
| Vulnerability Management (Annex I Part II) | VDP, SBOM, CVE, free updates |
| Reporting Obligations | 24h → 72h → 14-day final report to ENISA + CERT-FR |
| Conformity Assessment | Internal control vs notified body requirement |
| Technical Documentation | CE marking prerequisites |
| French Market Surveillance | ANSSI, DGCCRF, CERT-FR roles |
| Gap Analysis | Gaps with CRA deadline timeline |

---

## Risk Classification (Annex III)

| Class | Examples | Conformity Route |
|-------|---------|-----------------|
| Default | Most products | Internal control (Module A) |
| Important (Class I) | Browsers, VPNs, password managers, firewalls, IDS/IPS | Module A with standards or Module B+C |
| Critical (Class II) | HSMs, smart meters, industrial PLCs, OS | Module B+C or H (notified body required) |

---

## Annex I Part I — 12 Security Requirements

No known exploitable vulnerabilities at placement · Secure-by-default configuration · Authentication and access control · Data confidentiality and integrity · Data minimisation · DoS resistance · Minimal attack surface · Defence in depth · Integrity monitoring · Security audit logging · Signed updates with rollback · End-of-support transparency.

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Product description and market | `/arckit.requirements` |
| Risk | Security and vulnerability risks | `/arckit.risk` |
| Assessment | CRA compliance assessment | `/arckit.eu-cra` |
| Security controls | Implement Annex I requirements | `/arckit.secure` |
| NIS2 | If used by essential entities | `/arckit.eu-nis2` |

---

## Review Checklist

- In-scope determination: product with digital elements, EU market, no sector exclusion (MDR/EASA/automotive).
- Open source scenario assessed (steward lighter obligations vs commercial).
- Risk classification determined with Annex III reference.
- All 12 Annex I Part I security requirements assessed.
- SBOM produced in SPDX or CycloneDX format.
- VDP published with accessible contact mechanism.
- 24h ENISA + CERT-FR reporting capability assessed.
- CE marking and EU Declaration of Conformity plan in place.

---

## Key Notes

- **SBOM is mandatory**, not a best practice — minimum top-level dependencies in machine-readable format.
- **Default passwords are explicitly prohibited** by CRA.
- **ANSSI** is the French CRA market surveillance authority.
- **Open source stewards** (non-commercial foundations) have lighter obligations — document this clearly.
