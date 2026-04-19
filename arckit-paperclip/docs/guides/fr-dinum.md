# DINUM Digital Standards Assessment Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.fr-dinum` assesses compliance with French digital administration standards: RGI (interoperability), RGAA (accessibility), RGESN (eco-design), RGS (security), and the DINUM doctrine cloud de l'État. Applicable to French public services.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Digital service type and scope |
| Architecture principles | Technology standards and cloud strategy |
| Data model | Data formats and interoperability requirements |

---

## Command

```bash
/arckit.fr-dinum Assess DINUM digital doctrine compliance for <service description>
```

Output: `projects/<id>/ARC-<id>-DINUM-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| RGI v2 | Interoperability standards (open formats, APIs, protocols) |
| RGAA v4.1 | Accessibility compliance (WCAG 2.1 AA + French extensions) |
| RGESN | Eco-design for digital services (115 criteria) |
| RGS v2 | General security baseline for information systems |
| Doctrine Cloud | Data classification, cloud strategy, SecNumCloud triggers |
| SILL | Recommended open source software stack |
| Code Reuse | Circulaire 2021 obligations (see `/arckit.fr-code-reuse`) |
| Gap Analysis | Priority gaps with regulatory reference |

---

## DINUM Standards Reference

| Standard | Full Name | Scope |
|----------|-----------|-------|
| RGI | Référentiel Général d'Interopérabilité | Interoperability between public services |
| RGAA | Référentiel Général d'Amélioration de l'Accessibilité | Web accessibility (legal obligation) |
| RGESN | Référentiel Général d'Écoconception de Services Numériques | Eco-design for public digital services |
| RGS | Référentiel Général de Sécurité | IS security baseline for public services |
| SILL | Socle Interministériel de Logiciels Libres | Recommended open source software |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Digital service scope | `/arckit.requirements` |
| Assessment | DINUM standards compliance | `/arckit.fr-dinum` |
| Cloud | SecNumCloud if sensitive data | `/arckit.fr-secnumcloud` |
| Code reuse | Public code obligation | `/arckit.fr-code-reuse` |

---

## Review Checklist

- RGI: open standards and interoperable formats used; APIs RESTful with OpenAPI spec.
- RGAA v4.1: accessibility audit planned; legal accessibility statement required.
- RGESN: eco-design 115 criteria assessed for new digital service.
- RGS: security level determined (RGS */** /***); homologation if required.
- Doctrine cloud: data classification performed; SecNumCloud triggered if sensitive.
- SILL: recommended open source stack consulted before procurement.
- Code reuse: Circulaire 2021 obligations assessed (see `/arckit.fr-code-reuse`).

---

## Key Notes

- **DINUM** = Direction Interministérielle du Numérique — the French government digital directorate, analogous in purpose to the UK's GDS.
- **RGAA is legally mandatory** for public administrations, public service delegatees, and organisations receiving public funding (Loi ELAN 2018).
- **RGS ≠ SecNumCloud**: RGS is a security baseline for IS — SecNumCloud is specifically for cloud hosting. Both can apply simultaneously.
