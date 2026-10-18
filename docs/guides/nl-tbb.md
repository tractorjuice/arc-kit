# Te Beschermen Belangen (TBB) Determination Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:nl-tbb` determines the Te Beschermen Belangen (TBB) category for a system or dataset using the TBB systematiek ("Gereedschap: Te Beschermen Belangen", v1.0, 6 June 2026, part of the Toolkit VIRBI 2025), whose legal basis is the Besluit BVA-stelsel Rijksdienst 2021 (BWBR0044617). It assesses the five kernbelangen, scores Beschikbaarheid, Integriteit and Vertrouwelijkheid independently, sets the category from the highest of the three scores, and applies any rubricering the information already carries as a floor on that category. The command produces no rubricering. `/arckit:nl-cloud` and `/arckit:nl-bio` consume the category and BIV scores instead of re-deriving them.

See also: [Netherlands overlay guide](nl-overlay.md)

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | **Mandatory.** System description, data types processed, sensitivity indicators, security NFRs (NFR-SEC-xxx). The command warns if it is missing. |
| Data model (`ARC-<id>-DATA-v1.0.md`) | **Recommended.** Data assets, existing classification markers, data flows |
| Risk register (`ARC-<id>-RISK-v1.0.md`) | **Recommended.** Existing risks tied to information sensitivity |
| Global principles (`ARC-000-PRIN-v1.0.md`) | **Optional.** Any existing information classification policy |
| External documents (`external/`) | Prior classification decisions, existing Stg.-marked material, correspondence referencing VIRBI |
| Global policies (`000-global/policies/`) | Information classification policy |

Any source that still cites VIRBI 2013 is flagged as stale: VIRBI 2025 (BWBR0051482) replaced and repealed it on 9 September 2025.

---

## Command

```bash
/arckit:nl-tbb <project ID or dataset/system description>
```

In Claude Code the overlay installs as its own plugin, `arckit-nl`, so the command is `/arckit-nl:nl-tbb`.

Example: `/arckit:nl-tbb TBB determination for 001, citizen-facing benefits platform processing large-scale personal data, no prior classification on record`

Output: `projects/<id>/ARC-<id>-TBB-v1.0.md`

---

## How the Category Is Set

| Highest BIV score | TBB category |
|-------------------|--------------|
| Zeer Hoog | TBB 1 |
| Hoog | TBB 2 |
| Midden | TBB 3 |
| Laag | TBB 4 |

- The highest of the three scores sets the category. Scores are never averaged, and Vertrouwelijkheid alone does not decide it if another property scored higher.
- TBB 1 is the most sensitive category and TBB 4 the least. A lower number means higher sensitivity.
- An existing marking sets a floor: Stg. ZEER GEHEIM gives TBB 1, Stg. GEHEIM gives TBB 2, Stg. CONFIDENTIEEL gives TBB 3, and Departementaal VERTROUWELIJK / ongerubriceerd met merking gives TBB 4. Only the Stg. GEHEIM to TBB 2 row is stated outright in §3.1 of the systematiek; the other rows extend the same direction.
- The final category is the more sensitive (lower-numbered) of the BIV-derived category and the floor. The floor can raise sensitivity but never lower it.
- Where the information carries no marking, the document records "None recorded" and does not infer one.

Worked example from the command: BIV scoring gives TBB 4 but the information carries Stg. CONFIDENTIEEL. The floor is TBB 3, so the final category is TBB 3, which triggers the clause 5.2 public-cloud prohibition that TBB 4 does not.

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Document Control | Standard fields, with the VIRBI 2025 classification ladder (Ongerubriceerd to Stg. ZEER GEHEIM) |
| Critical Notice — One-Way Inference | Quoted §3.1 text: Stg. GEHEIM implies TBB 2, but TBB 2 does not imply Stg. GEHEIM |
| Scope Statement | System or dataset, assessor, systematiek version, legal basis |
| 1. Kernbelangen Relevance Assessment | Democratische rechtsorde, Internationale betrekkingen, Veiligheid, Gevoelige beleidszaken, Betrouwbare dienstverlening, each marked relevant or not with a rationale |
| 2. BIV Scoring | Beschikbaarheid, Integriteit and Vertrouwelijkheid, each scored Zeer Hoog / Hoog / Midden / Laag with a rationale |
| 3. TBB Category Determination | Score table, highest score, BIV-derived category |
| 4. Existing Rubricering as a Floor on the Category | Marking already carried, floor, final category, bound that applied, departmental security authority sign-off |
| 5. Downstream Implications | Whether clause 5.2 prohibits public cloud; references for `nl-cloud` and `nl-bio` |
| 6. External References | Document Register with VIRBI 2025 and its verification date, citations |

---

## Review Checklist

- The three BIV properties are scored independently, and the derivation of the category from the highest score is shown.
- The one-way inference warning is prominent and is not reversed anywhere in the document.
- No rubricering is derived from the category. An existing marking appears only as a recorded input and a floor.
- Where a marking exists, both bounds are shown, the applied bound is named, and the final category is the lower-numbered one.
- The sign-off line for the departmental security authority (beveiligingsautoriteit / BVA) is completed. Determining a rubricering is reserved to that authority under the Besluit BVA-stelsel Rijksdienst 2021.
- VIRBI 2013 references in source material are flagged as superseded.
- Qualified counsel and the departmental security officer review the output before anyone relies on it.

---

## Next Steps

- `/arckit:nl-cloud` — feed the category into the clause 5.2 cloud eligibility check, when cloud hosting is under consideration.
- `/arckit:nl-bio` — use the BIV scores to prioritise the BIO2 control assessment, if that assessment has not yet used them.
- `/arckit:risk` — reflect the category and any Stg. classification implications in the risk register.
