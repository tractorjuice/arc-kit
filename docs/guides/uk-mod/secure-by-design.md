# MOD Secure by Design Guide

`/arckit.mod-secure` documents MOD-specific Secure by Design requirements, covering JSP 440, JSP 604, HMG SPF, and Defence Cyber Protection Partnership obligations.

---

## Command

```bash
/arckit.mod-secure Assess MOD Secure by Design for <programme>
```

Output: `projects/<id>/ARC-<id>-MSBD-v1.0.md`.

---

## Focus Areas

| Theme | Questions | Evidence |
|-------|-----------|----------|
| Classification & threat context | What classification? Who are the adversaries? | Statement of Sensitivity, threat assessment |
| Governance & accreditation | Which accreditation authority? Timescales for Interim/Full ATO? | SRMO, RMADS, accreditation plan |
| Identity & access | Clearances, PKI/MFA, privileged access control | Access matrix, vetting records, PAM tooling |
| Protective monitoring | SIEM coverage, integration with MOD SOC, log retention | Monitoring architecture, runbooks |
| Supply chain | DCPP level, supplier assurance, contractual clauses | Procurement docs, vendor assessments |
| Secure development & testing | SDLC controls, ITHC, secure coding | Test results, change control, penetration tests |
| Operational readiness | Incident response, continuity, DR for classified data | `/arckit.servicenow`, resilience plans |

---

## Accreditation Snapshot

| Stage | Artefact | Owner |
|-------|----------|-------|
| Risk assessment | SRMO / RMADS | Accreditor & Security Lead |
| Interim ATO | Limited deployment approval (6–12 months) | Accreditor |
| Full ATO | Operational approval (up to 3 years) | Accreditation Authority |
| Re-assessment | Triggered by change / expiry | Programme Security Board |

Document residual risks, treatments, and expiry dates to avoid surprises.

---

## Cadence

| Stage | Frequency |
|-------|-----------|
| Discovery / Early design | Establish classification, threat model, initial controls |
| Main gate / Beta | Update SRMO, protective monitoring, supplier assurance |
| Live | Quarterly security reviews; re-assess on change/retrain events |

Keep `/arckit.jsp-936` aligned for AI systems and ensure MOD security outputs feed procurement, design reviews, and operations.
