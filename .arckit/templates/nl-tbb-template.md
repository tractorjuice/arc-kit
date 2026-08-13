# Te Beschermen Belangen / VIRBI 2025 Rubricering Determination

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
> Information marked at Stg. GEHEIM (or another Stg. level) implies the corresponding TBB category. A process or system determined to be **TBB 2 does NOT imply it holds Stg. GEHEIM data** — the TBB category describes the sensitivity of the belang (interest) at stake, not a classification level automatically present in the system.
>
> The rubricering in section 4 is therefore an **indicative proposal about the process** (derived from the highest of the three BIV scores, which may be availability or integrity rather than confidentiality), awaiting the rubriceringsautoriteit. It does not mark any document, does not retroactively classify existing information, and must never be quoted downstream as a determined classification.

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

## 4. Indicative VIRBI 2025 Rubricering (voorstel)

| TBB category | Impact | Indicative VIRBI 2025 rubricering |
|--------------|--------|-----------------------------------|
| TBB 1 | Zeer hoog | Stg. ZEER GEHEIM |
| TBB 2 | Hoog | Stg. GEHEIM |
| TBB 3 | Midden | Stg. CONFIDENTIEEL |
| TBB 4 | Laag | Departementaal VERTROUWELIJK or ongerubriceerd met merking |

**Indicatieve rubricering (voorstel)**: [Stg. ZEER GEHEIM / Stg. GEHEIM / Stg. CONFIDENTIEEL / Departementaal VERTROUWELIJK / Ongerubriceerd met merking]

**Existing rubricering carried by the information in scope**: [Marking already applied, or "None recorded"]

**Confirmed by rubriceringsautoriteit / BVA**: [PENDING — name, role, date]

> This value is a **proposal about the process**, derived from the highest BIV score. It is not a determination, and it does not mark any document. Only the rubriceringsautoriteit can apply a rubricering. Where the information in scope already carries a marking, that marking governs and any divergence from the indicative value is referred, not overwritten.

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
