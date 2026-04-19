# French Public Procurement Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.fr-marche-public` generates French public procurement documentation aligned with the Code de la commande publique, UGAP framework agreements, DINUM digital standards, and ANSSI-qualified provider requirements.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Technical and functional requirements |
| Stakeholder analysis | Contracting authority and key stakeholders |
| Research (`ARC-<id>-RES-v*.md`) | Market analysis and vendor landscape |

---

## Command

```bash
/arckit.fr-marche-public Generate procurement file for <project, estimated value, procedure type>
```

Output: `projects/<id>/ARC-<id>-MARPUB-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Procurement Strategy | Procedure type, thresholds, UGAP availability |
| Règlement de la Consultation (RC) | Submission rules, evaluation criteria, deadlines |
| Cahier des Charges Techniques (CCTP) | Technical specifications from requirements |
| Cahier des Clauses Administratives (CCAP) | Contract terms, SLAs, penalties |
| Digital State Doctrine | DINUM obligations, RGAA, RGI, SILL, SecNumCloud |
| Durabilité | Sustainable procurement clauses (environmental and social) |
| ANSSI-Qualified Providers | PASSI/PRIS/PDIS/PDCS requirements for cybersecurity services |
| Evaluation Framework | Technical, financial, quality criteria with weightings |

---

## Procedure Thresholds (2024)

| Threshold | Procedure |
|-----------|-----------|
| < €40,000 HT | Gré à gré (direct award) |
| €40,000 – €215,000 HT (services) | MAPA (Marché à Procédure Adaptée) |
| > €215,000 HT (services) | Appel d'Offres Ouvert / Restreint |
| > €5.38M HT (works) | Procédure formalisée |

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
| Discovery | Requirements and market | `/arckit.requirements`, `/arckit.research` |
| Assessment | Procurement strategy | `/arckit.fr-marche-public` |
| Data | GDPR/data sharing clauses | `/arckit.eu-rgpd`, `/arckit.eu-data-act` |
| Security | SecNumCloud procurement clause | `/arckit.fr-secnumcloud` |

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
