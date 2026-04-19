# Diffusion Restreinte (DR) Handling Assessment Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.fr-dr` assesses Diffusion Restreinte (DR) document and IS handling compliance under II 901/SGDSN/ANSSI. **Scope is explicitly bounded to DR — IGI 1300 (Confidentiel Défense and above) is out of scope for ArcKit.**

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | IS scope and data sensitivity |
| ANSSI assessment | Security baseline for DR-processing IS |
| IS Cartography | System and network scope for DR IS |

---

## Command

```bash
/arckit.fr-dr Assess DR handling compliance for <IS scope and document types>
```

Output: `projects/<id>/ARC-<id>-DR-v1.0.md`

> **Note**: The DR assessment document itself is classified **DIFFUSION RESTREINTE**.

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Scope Statement | DR boundary (explicitly not IGI 1300) |
| DR Asset Inventory | Documents and data classified DR |
| Marking Rules | Correct DR marking on all document formats |
| Access Control | Need-to-know enforcement, personnel habilitation |
| Electronic Storage | Approved storage media and IS requirements |
| Transmission | Approved encryption and transmission channels |
| Physical Handling | Physical document controls, meeting security |
| Destruction | Approved destruction methods by media type |
| IS Homologation | Homologation requirement for DR-processing IS |
| Gap Analysis | Compliance gaps with remediation plan |

---

## DR vs Classified Information

| Level | Governed By | ArcKit Scope |
|-------|-------------|-------------|
| Diffusion Restreinte (DR) | II 901 / SGDSN / ANSSI | ✅ In scope |
| Confidentiel Défense | IGI 1300 | ❌ Out of scope |
| Secret Défense | IGI 1300 | ❌ Out of scope |
| Très Secret Défense | IGI 1300 | ❌ Out of scope |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Foundation | IS security baseline | `/arckit.fr-anssi` |
| Cartography | IS map for DR scope | `/arckit.fr-anssi-carto` |
| DR assessment | DR handling compliance | `/arckit.fr-dr` |
| PSSI | DR section in security policy | `/arckit.fr-pssi` |
| Cloud | SecNumCloud if DR stored in cloud | `/arckit.fr-secnumcloud` |

---

## Review Checklist

- Scope statement explicitly bounding DR (not IGI 1300) included.
- DR asset inventory complete with marking status.
- Approved electronic storage media documented (IS must be homologated for DR).
- Transmission channels compliant (encrypted, approved by ANSSI).
- Destruction methods appropriate for media type.
- Personnel access control based on need-to-know and habilitation.
- IS homologation requirement identified for systems processing DR data.
- Document itself marked DIFFUSION RESTREINTE.

---

## Key Notes

- **DR ≠ Classified**: Diffusion Restreinte is an administrative protection mention — not a defence classification under IGI 1300. It is governed by II 901/SGDSN instructions, not the Code de la défense.
- **IS homologation**: Any IS that processes DR documents must itself be homologated — the EBIOS RM study and cartography are prerequisites.
- **Cloud**: Hosting DR data in cloud requires at minimum a qualified provider (SecNumCloud qualification or equivalent homologated solution).
