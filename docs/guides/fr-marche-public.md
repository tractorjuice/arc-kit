# French Public Procurement Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:fr-marche-public` generates French public procurement documentation aligned with the Code de la commande publique, UGAP framework agreements, DINUM digital standards, and ANSSI-qualified provider requirements.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Technical and functional requirements |
| Stakeholder analysis | Contracting authority and key stakeholders |
| Research (`research/ARC-<id>-RSCH-*-v*.md`) | Market analysis and vendor landscape |

---

## Command

```bash
/arckit:fr-marche-public Generate procurement file for <project, estimated value, procedure type>
```

Output: `projects/<id>/ARC-<id>-MARPUB-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| 1. Threshold Analysis and Recommended Procedure | Estimated value, threshold, procedure, BOAMP/JOUE publication, consultation period, State cloud doctrine |
| 2. Requirements Statement | Subject of the contract, functional and technical requirements (the basis for the CCTP), sovereignty and security requirements |
| 3. Award Criteria | Weighting (technical value, environmental characteristics, price, execution conditions), technical scoring grid, and the environmental and social requirements of the Code de la commande publique |
| 4. Security and Sovereignty Clauses | Security annex, data localisation, reversibility, open source, GDPR/DPA |
| 5. UGAP Catalogue | Framework agreements available for call-off |
| 6. Indicative Timeline | Gantt chart from drafting to contract signature |
| 7. ANSSI-Qualified Security Provider Selection | ANSSI qualification requirements for cybersecurity services (see below) |
| 8. Digital State Doctrine Compliance | DINUM checklist (cloud, RGI, RGAA, RGESN, open source, GDPR), PSSIE and RGS target level |

---

## Procedure Thresholds (2026–2027)

| Threshold | Procedure |
|-----------|-----------|
| < €60,000 HT (supplies/services) or < €100,000 HT (works) | No publicity or competition required (CCP R2122-8) |
| From €60,000 / €100,000 HT to below the formal-procedure threshold | MAPA (Marché à Procédure Adaptée) |
| ≥ €140,000 HT (supplies/services, central government authorities such as the State and its public bodies other than EPIC) | Procédure formalisée (e.g. Appel d'Offres Ouvert / Restreint) |
| ≥ €216,000 HT (supplies/services, other contracting authorities such as local authorities) | Procédure formalisée |
| ≥ €5,404,000 HT (works) | Procédure formalisée |

The formal-procedure thresholds are the 2026–2027 EU thresholds (Commission Delegated Regulation (EU) 2025/2152), set out in the avis of 13 January 2026 that forms annex 2 of the Code de la commande publique. Utilities (entités adjudicatrices) use €432,000 HT for supplies and services. The €60,000 / €100,000 thresholds come from décret n° 2025-1386 (works from 1 January 2026, supplies and services from 1 April 2026).

---

## Environmental Award Criterion

Since August 2026, at least one award criterion must take account of the environmental characteristics of the offer (CCP L2152-7, from loi n° 2021-1104 Climat et Résilience, art. 35), and a single price-only criterion is no longer allowed (R2152-7). Execution conditions must also take environmental considerations into account (L2112-2). The rules apply to procurements whose consultation is launched, or whose contract notice is sent for publication, from 21 August 2026 (R2152-7, décret n° 2022-767) and 22 August 2026 (the amended L2152-7, as shown on Légifrance). The command's suggested weighting gives environmental characteristics 10%.

---

## ANSSI-Qualified Security Providers

| Qualification | Scope | When to Require |
|--------------|-------|----------------|
| PASSI | Penetration testing, security audits | IS audit or pentest |
| PRIS | Incident response, forensics | IR retainer or OIV/OSE obligation |
| PDIS | SOC, threat detection, SIEM | Managed detection services |
| PACS | Security consulting: homologation support, risk management, secure architecture, cyber-crisis preparation | Consulting for homologation, risk analysis or crisis preparation |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Requirements and market | `/arckit:requirements`, `/arckit:research` |
| Assessment | Procurement strategy | `/arckit:fr-marche-public` |
| Data | GDPR/data sharing clauses | `/arckit:eu-rgpd`, `/arckit:eu-data-act` |
| Security | SecNumCloud procurement clause | `/arckit:fr-secnumcloud` |

---

## Review Checklist

- Procedure type and threshold correctly identified.
- UGAP framework availability checked before full tender.
- Publicity matches the value: free below €90,000 HT, BOAMP or a legal-notices journal (JAL) from €90,000 HT, BOAMP and JOUE at or above the formal-procedure thresholds.
- CCTP derived from ARC-*-REQ requirements with traceability.
- DINUM digital obligations included (RGAA, RGI, SILL, doctrine cloud).
- At least one environmental award criterion (CCP L2152-7) and an environmental execution condition (L2112-2) included; for contracts at or above the formal-procedure thresholds, a social or employment execution condition, or the reason for leaving it out recorded (L2112-2-1).
- ANSSI qualification required for cybersecurity services (PACS / PASSI / PRIS / PDIS).
- SecNumCloud required if sensitive data hosted by provider.

---

## Key Notes

- **UGAP** is a French central purchasing body — framework agreements allow call-off without a full tender.
- **BOAMP** is the French procurement notices bulletin. From €90,000 HT a MAPA notice goes in the BOAMP or a JAL; at or above the EU thresholds, the State, its public bodies other than EPIC and local authorities publish in both the BOAMP and the JOUE/TED.
- **ANSSI qualifications expire** — verify current validity in tender evaluation, not just at contract award.
