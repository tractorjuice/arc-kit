# French GDPR / CNIL Compliance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.fr-rgpd` generates a French CNIL-specific GDPR layer assessment supplementing `/arckit.eu-rgpd`. It covers CNIL délibérations, health data (HDS), cookie rules, age 15 for minors, and CNIL enforcement patterns.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Processing activities, data flows |
| EU GDPR assessment (`ARC-<id>-RGPD-v*.md`) | Base GDPR compliance (run first) |
| Data model (`ARC-<id>-DATA-v1.0.md`) | Personal data categories |

---

## Command

```bash
/arckit.fr-rgpd Assess CNIL compliance for <project or processing activity>
```

Output: `projects/<id>/ARC-<id>-CNIL-v1.0.md`

> **Run after**: `/arckit.eu-rgpd` — this command adds the French layer on top.

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| CNIL Référentiels | Applicable sector référentiels (health, HR, CCTV, etc.) |
| Cookie Compliance | Délibération 2020-091, opt-in consent, analytics exemptions |
| Health Data (HDS) | HDS certification requirement for health data hosting |
| Minors | Age 15 threshold, parental consent mechanisms |
| Sensitive Data | Biometric processing (CNIL authorisation required) |
| CNIL Prior Consultation | When to notify CNIL before processing |
| DPO Registration | CNIL DPO registration obligations |
| Enforcement Patterns | Recent CNIL sanctions and priority areas |
| Gap Analysis | French-specific gaps beyond EU GDPR baseline |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| EU baseline | GDPR compliance | `/arckit.eu-rgpd` |
| French layer | CNIL-specific assessment | `/arckit.fr-rgpd` |
| High-risk | DPIA for high-risk processing | `/arckit.dpia` |

---

## Review Checklist

- EU GDPR assessment (`ARC-<id>-RGPD-v*.md`) completed first.
- CNIL référentiel applicable to the sector identified.
- Cookie consent mechanism compliant with Délibération 2020-091.
- Health data: HDS certification required for health data hosting in France.
- Age verification mechanism for services targeting minors (age 15 threshold in France).
- Biometric processing: CNIL authorisation or applicable exemption identified.
- DPO registered with CNIL if obligatory.
- CNIL prior consultation assessed for high-risk residual processing.

---

## Key Notes

- **HDS (Hébergeur de Données de Santé)**: Any hosting of personal health data in France requires HDS certification — stricter than GDPR alone.
- **Age 15**: France chose 15 as the digital consent age (GDPR allows 13–16) — platforms must verify age for minor users.
- **Biometric data**: CNIL requires authorisation for most biometric processing (workplace access control is a common case).
- **Scope**: Supplements `/arckit.eu-rgpd`. Do not run in isolation — EU GDPR baseline must be established first.
