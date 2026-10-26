# BIO2 Conformance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:nl-bio` produces a BIO2 Conformance Assessment for a Dutch government information system. BIO2 (Baseline Informatiebeveiliging Overheid 2) was established by the OBDO on 23 September 2025, version 1.3 is dated 9 January 2026, and it is built on NEN-EN-ISO/IEC 27001:2023 and NEN-EN-ISO/IEC 27002:2022. The assessment is organised around the four ISO/IEC 27002:2022 control themes (Organisational, People, Physical, Technological), consolidates gaps into one prioritised table, and notes Cbw and Wwke sector applicability. BIO2 does not mandate ISO/IEC 27001 certification, but its overheidsmaatregelen are mandatory where applicable, and the assessment keeps those two questions apart. It is a security-baseline assessment, not a cloud-eligibility one.

See also: [Netherlands overlay guide](nl-overlay.md)

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | **Mandatory.** System description, security NFRs (NFR-SEC-xxx), integration requirements, hosting model. The command warns if it is missing. |
| TBB determination (`ARC-<id>-TBB-v1.0.md`) | **Recommended.** BIV scores to prioritise which control areas matter most |
| Rijksbreed Cloudbeleid assessment (`ARC-<id>-RBCLOUD-v1.0.md`) | **Recommended.** Hosting model, data location and encryption posture already assessed |
| Secure by Design (`ARC-<id>-SECD-v1.0.md`) | **Recommended.** Existing security controls that overlap with BIO2 measures |
| Risk register (`ARC-<id>-RISK-v1.0.md`) | **Recommended.** Existing security risks |
| Data model (`ARC-<id>-DATA-v1.0.md`) | **Optional.** Data assets and classification relevant to control scoping |
| External documents (`external/`) | Prior BIO2 or BIO assessments, ISO 27001 certification scope statements, audit findings |
| Global policies (`000-global/policies/`) | Information security policy, access control policy |

Material that cites the original BIO, BIO1 or an earlier BIO2 version is flagged for re-verification against BIO2 v1.3.

---

## Command

```bash
/arckit:nl-bio <project ID or system description>
```

In Claude Code the overlay installs as its own plugin, `arckit-nl`, so the command is `/arckit-nl:nl-bio`.

Example: `/arckit:nl-bio Assess BIO2 conformance for a ministry shared-services platform, ISO 27001 certification not pursued, BIV scores not yet determined`

Output: `projects/<id>/ARC-<id>-BIO2-v1.0.md`

---

## How Each Control Area Is Assessed

For every control area in scope, under each of the four themes, the command:

1. States the current implementation status.
2. Cites the specific BIO2 overheidsmaatregel only where the user or the project artefacts supplied it.
3. Marks any measure it was not given as `[PENDING — cite from current BIO2 text]`, for the assessor to complete from the official document. It does not invent measure numbers, wording or thresholds.
4. Records a gap where the control is absent, partial or unverified.

For cloud-hosted systems, the Technological theme cross-references `/arckit:nl-cloud` Section 7 (data location and encryption) instead of re-deriving the encryption assessment.

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Executive Summary | Scope, BIO2 version applied, overall conformance (Conformant / Partially conformant / Not conformant), key findings |
| 1. Scope Statement | System or organisational unit, BIV scores from `nl-tbb` if available, base standards, certification note |
| 2. Organisational Controls | Control area, status, overheidsmaatregel reference, gap |
| 3. People Controls | Control area, status, overheidsmaatregel reference, gap |
| 4. Physical Controls | Control area, status, overheidsmaatregel reference, gap |
| 5. Technological Controls | Control area, status, overheidsmaatregel reference, gap; cross-reference to `nl-cloud` Section 7 where cloud-hosted |
| 6. Gap Summary | Every gap with priority (High / Medium / Low), owner and target date |
| 7. Sector Context | Cbw or Wwke scope; Rijksinspectie Digitale Infrastructuur (RDI) as supervisory authority where in scope |
| 8. External References | BIO2 in the Document Register with its verification date, citations |

---

## Review Checklist

- "Not certified" is never reported as non-conformance on its own.
- All four control themes are addressed.
- Every overheidsmaatregel reference comes from the current BIO2 text. Any `[PENDING — cite from current BIO2 text]` placeholder is completed from the official document before reliance.
- BIV scores from `/arckit:nl-tbb` are used to prioritise controls where available.
- Each gap has a priority, an owner and a target date.
- Cbw/Wwke sector applicability is noted. Both acts were approved by the Eerste Kamer on 7 July 2026, are in force from 15 August 2026, and replace the Wbni.
- Qualified counsel and the departmental CISO review the output before anyone relies on it.

---

## Next Steps

- `/arckit:nl-cloud` — feed BIO2 conformance status and control gaps into the cloud data-location and encryption assessment, where the system is or may be cloud-hosted.
- `/arckit:nl-tbb` — determine the TBB category so BIV scores can prioritise the BIO2 controls, if they are not yet available.
- `/arckit:risk` — reflect open BIO2 control gaps in the risk register.
