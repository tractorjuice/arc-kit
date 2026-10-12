# US Privacy Impact Assessment (E-Gov §208)

> **Overlay**: USA Federal Civilian Community Overlay | **ArcKit Version**: [VERSION]

`/arckit:us-privacy-pia` produces a federal Privacy Impact Assessment under §208 of the E-Government Act of 2002 and OMB M-03-22. It scopes the personal information lifecycle, applies the Fair Information Practice Principles (FIPPs), captures the Privacy Act of 1974 system-of-records analysis (SORN trigger / coverage / amendment), aligns with NIST SP 800-122 PII handling guidance, and surfaces the AI-specific notice obligations introduced by OMB M-24-10.

The PIA is **mandatory** when an agency develops or procures information technology that collects, maintains, or disseminates personally identifiable information, or when it initiates a new electronic collection of PII from 10 or more members of the public. It is the artefact that the agency SAOP signs and that is published for public consumption — a missing or incomplete PIA is a Senior Agency Official for Privacy finding.

The doc-type code is **`USPIA`** because the plain `PIA` code is taken by the Canadian overlay (`ca-pia`).

Reviewed by the SAOP, the System Owner, the agency Privacy Office, General Counsel where SORN triggers are uncertain, and the agency Chief AI Officer where AI is in scope.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Service description, data requirements (DR-*) |
| Data Model (`ARC-<id>-DMOD-v1.0.md`) | Entities carrying PII, relationships, retention |
| Stakeholders (`ARC-<id>-STKE-v1.0.md`) | Subject populations, partner agencies, processors |
| Architecture Principles (`ARC-<id>-PRIN-v1.0.md`) | Privacy-by-design posture |

---

## Output

- **Doc-type**: `USPIA`
- **Filename**: `ARC-<PID>-USPIA-v1.0.md` (project root, single-instance)

---

## Process Overview

1. Confirm PIA trigger per E-Gov §208 (new IT with PII; new electronic collection from ≥10 members of the public).
2. Build the PII inventory — types, sources, uses, recipients, retention, disposal.
3. Apply the FIPPs to the system's data flows.
4. Run the Privacy Act SORN analysis — does the system constitute a System of Records? Existing SORN? New / amended SORN required?
5. Where AI is in scope, layer the M-24-10 AI-specific notice obligations.
6. Route for SAOP signature and public publication.

---

## Regulatory Anchors

- **E-Government Act of 2002 §208** — <https://www.justice.gov/opcl/e-government-act-2002>
- **OMB M-03-22** — <https://www.whitehouse.gov/wp-content/uploads/2017/11/203-M-03-22-OMB-Guidance-for-Implementing-the-Privacy-Provisions-of-the-E-Government-Act-of-2002-1.pdf>
- **Privacy Act of 1974 (5 U.S.C. §552a)** — <https://www.justice.gov/opcl/privacy-act-1974>
- **NIST SP 800-122** — <https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-122.pdf>

---

## Example Usage

```bash
/arckit:us-privacy-pia 001-citizen-benefits-portal
```

---

## Common Pitfalls

- **Missing SORN trigger when adding a new System of Records.** If you can retrieve a record by an individual identifier, you have a System of Records — and the Privacy Act requires a SORN. Treat new SoR creation as a delivery gate.
- **Failing to publish the PIA.** The PIA is a public document under §208. Internal-only retention is non-compliance.
- **Ignoring AI-specific notice obligations.** M-24-10 layers additional notice on top of FIPPs notice where AI is involved — these are not interchangeable.
- **Confusing PIA with PTA.** A Privacy Threshold Analysis is a screen; the PIA is the substantive assessment. Stopping at the PTA when the PIA is required is a common shortcut that fails on review.

---

## Handoffs

- **`us-icam`** — IAL choice and federation attributes feed PII inventory
- **`us-ai-impact`** — AI notice obligations carry across both artefacts
- **`data-model`** — PIA PII inventory must reconcile with the data model
