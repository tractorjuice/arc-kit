# Te Beschermen Belangen (TBB) Category Determination

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:nl-tbb`
>
> ⚠️ **Community-contributed** — not yet validated against current Rijksoverheid / EU regulatory text. Verify all citations before relying on output.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:nl-tbb` | [PENDING] | [PENDING] |

## Critical Notice — One-Way Inference

> ⚠️ **The inference between Stg. classification and TBB category runs one way only.**
>
> The systematiek states both halves itself, immediately beneath Tabel B (§3.1):
>
> *"Let wel, wanneer een te beschermen belang ingedeeld is in categorie TBB 2, hoeft dit niet te betekenen dat het proces of informatiesysteem gegevens verwerkt of bevat op het niveau van STG GEHEIM. […] Andersom geldt dit echter wel. Indien een proces of informatiesysteem gegevens verwerkt of bevat op het niveau van STG GEHEIM, dan is automatisch sprake van indeling in categorie TBB 2."*
>
> Information marked at Stg. GEHEIM (or another Stg. level) therefore implies the corresponding TBB category. A process or system determined to be **TBB 2 does NOT imply it holds Stg. GEHEIM data** — the TBB category describes the sensitivity of the belang (interest) at stake, not a classification level automatically present in the system.
>
> **This document therefore produces no rubricering.** Section 4 records the marking the information already carries, if any, and applies it as a floor on the category. The category is set by the highest of the three BIV scores, which may be availability or integrity rather than confidentiality — and §2.1 notes that for VIRBI purposes *"kijken we slechts/vooral naar Vertrouwelijkheid"*. Nothing here marks a document, retroactively classifies existing information, or may be quoted downstream as a determined classification.

## Scope Statement

| Element | Value |
|---------|-------|
| System / dataset assessed | [System name and description] |
| Assessor | [Name and role] |
| TBB systematiek version applied | Gereedschap: Te Beschermen Belangen, v1.0, 6 June 2026 (Toolkit VIRBI 2025) |
| Legal basis | Besluit BVA-stelsel Rijksdienst 2021 (BWBR0044617) |

---

## 1. Kernbelangen Relevance Assessment

Assess the relevance of each of the five kernbelangen to the information or process in scope.

| Kernbelang | Relevant | Rationale |
|-----------|----------|-----------|
| Democratische rechtsorde | [Yes / No] | [Rationale] |
| Internationale betrekkingen | [Yes / No] | [Rationale] |
| Veiligheid | [Yes / No] | [Rationale] |
| Gevoelige beleidszaken | [Yes / No] | [Rationale] |
| Betrouwbare dienstverlening | [Yes / No] | [Rationale] |

## 2. BIV Scoring

Score each property independently. Do not average — the highest of the three drives the TBB category (Section 3).

### 2.1 Beschikbaarheid (Availability)

| Score | Zeer Hoog | Hoog | Midden | Laag |
|-------|-----------|------|--------|------|
| Selected | [☐] | [☐] | [☐] | [☐] |

**Rationale**: [Impact of loss of availability]

### 2.2 Integriteit (Integrity)

| Score | Zeer Hoog | Hoog | Midden | Laag |
|-------|-----------|------|--------|------|
| Selected | [☐] | [☐] | [☐] | [☐] |

**Rationale**: [Impact of loss of integrity]

### 2.3 Vertrouwelijkheid (Confidentiality)

| Score | Zeer Hoog | Hoog | Midden | Laag |
|-------|-----------|------|--------|------|
| Selected | [☐] | [☐] | [☐] | [☐] |

**Rationale**: [Impact of loss of confidentiality]

## 3. TBB Category Determination

| Property | Score |
|----------|-------|
| Beschikbaarheid | [Zeer Hoog / Hoog / Midden / Laag] |
| Integriteit | [Zeer Hoog / Hoog / Midden / Laag] |
| Vertrouwelijkheid | [Zeer Hoog / Hoog / Midden / Laag] |
| **Highest score (drives TBB category)** | **[Zeer Hoog / Hoog / Midden / Laag]** |

**TBB category**: **[TBB 1 / TBB 2 / TBB 3 / TBB 4]**

## 4. Existing Rubricering as a Floor on the Category

**Existing rubricering carried by the information in scope**: [Marking already applied, or "None recorded"]

Where a marking is recorded, the systematiek's valid direction applies it as a floor (§3.1 — *"Andersom geldt dit echter wel. Indien een proces of informatiesysteem gegevens verwerkt of bevat op het niveau van STG GEHEIM, dan is automatisch sprake van indeling in categorie TBB 2."*):

| Existing marking on the information | Floor: category is **at least this sensitive** |
|-------------------------------------|-----------------------------------------------|
| Stg. ZEER GEHEIM | TBB 1 |
| Stg. GEHEIM | TBB 2 |
| Stg. CONFIDENTIEEL | TBB 3 |
| Departementaal VERTROUWELIJK / ongerubriceerd met merking | TBB 4 |
| None recorded | no floor — the BIV-derived category stands |

> **TBB 1 is the most sensitive category and TBB 4 the least** — a lower number means higher sensitivity. The final category is the **more sensitive** of the two bounds below, which is the one with the lower number. The floor can only raise sensitivity; it never lowers it.

**Category from BIV scoring (§3)**: [TBB 1 / TBB 2 / TBB 3 / TBB 4]

**Floor from existing marking**: [TBB 1 / TBB 2 / TBB 3 / TBB 4, or "None — no marking recorded"]

**Final TBB category**: **[TBB 1 / TBB 2 / TBB 3 / TBB 4]** — bound that applied: [highest BIV score / floor from existing marking]

**Reviewed by departmental security authority (beveiligingsautoriteit / BVA)**: [PENDING — name, role, date]

> **This determination produces no rubricering.** The systematiek takes the rubricering as an *input* to the categorisation (§2.1) and states the reverse inference does not hold (§3.1: *"wanneer een te beschermen belang ingedeeld is in categorie TBB 2, hoeft dit niet te betekenen dat het proces of informatiesysteem gegevens verwerkt of bevat op het niveau van STG GEHEIM"*). Where the information carries no marking, none is inferred here. Marking is an act of the departmental security authority under the Besluit BVA-stelsel Rijksdienst 2021, not an output of the TBB systematiek.

> VIRBI 2025 (BWBR0051482, in force 9 September 2025) replaced and repealed VIRBI 2013 on that date. Any prior assessment or source material still citing VIRBI 2013 is stale and must be re-verified.

## 5. Downstream Implications

| Implication | Applies |
|-------------|---------|
| Public cloud prohibited under clause 5.2 (TBB 1–3 or staatsgeheim gerubriceerd) | [Yes / No] |
| Feeds `/arckit:nl-cloud` clause 5.2 eligibility check | [Yes — reference this document] |
| Feeds `/arckit:nl-bio` control prioritisation | [Yes — reference this document] |

**Next steps**: Run `/arckit:nl-cloud` if cloud hosting is under consideration for this system. Run `/arckit:risk` to reflect the determined category in the risk register.

---

**Generated by**: ArcKit `/arckit:nl-tbb` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
