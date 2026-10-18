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
| 3. Award Criteria | Weighting (technical value, price, execution conditions) and technical scoring grid |
| 4. Security and Sovereignty Clauses | Security annex, data localisation, reversibility, open source, GDPR/DPA |
| 5. UGAP Catalogue | Framework agreements available for call-off |
| 6. Indicative Timeline | Gantt chart from drafting to contract signature |
| 7. ANSSI-Qualified Security Provider Selection | ANSSI qualification requirements for cybersecurity services (see below) |
| 8. Digital State Doctrine Compliance | DINUM checklist (cloud, RGI, RGAA, RGESN, open source, GDPR), PSSIE and RGS target level |

---

## Procedure Thresholds (2024)

| Threshold | Procedure |
|-----------|-----------|
| < €40,000 HT | Gré à gré (direct award) |
| €40,000 – €216,000 HT (services) | MAPA (Marché à Procédure Adaptée) |
| > €216,000 HT (services) | Appel d'Offres Ouvert / Restreint |
| > €5,404,000 HT (works) | Procédure formalisée |

---

## ANSSI-Qualified Security Providers

| Qualification | Scope | When to Require |
|--------------|-------|----------------|
| PASSI | Penetration testing, security audits | IS audit or pentest |
| PRIS | Incident response, forensics | IR retainer or OIV/OSE obligation |
| PDIS | SOC, threat detection, SIEM | Managed detection services |
| PDCS | Local authority cybersecurity | Collectivités territoriales |

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
- BOAMP publication planned for notices above €40,000 HT.
- CCTP derived from ARC-*-REQ requirements with traceability.
- DINUM digital obligations included (RGAA, RGI, SILL, doctrine cloud).
- Sustainable procurement clauses (SPASER, environmental, social) included.
- ANSSI qualification required for cybersecurity services (PASSI / PRIS / PDIS).
- SecNumCloud required if sensitive data hosted by provider.

---

## Key Notes

- **UGAP** is a French central purchasing body — framework agreements allow call-off without a full tender.
- **BOAMP** is the mandatory French publication journal. Above EU thresholds, also publish in JOUE/TED.
- **ANSSI qualifications expire** — verify current validity in tender evaluation, not just at contract award.
