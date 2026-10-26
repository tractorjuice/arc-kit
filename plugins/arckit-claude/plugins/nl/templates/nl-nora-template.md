# NORA Conformance Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit-nl:nl-nora`
>
> ⚠️ **Community-contributed** — not yet validated by NORA Beheer, VNG Realisatie or a Dutch government architecture board. NORA and GEMMA text is quoted verbatim from the extracts named in Section 1; verify it against [noraonline.nl](https://www.noraonline.nl) and [gemmaonline.nl](https://www.gemmaonline.nl) before relying on this assessment.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit-nl:nl-nora` | [PENDING] | [PENDING] |

## Executive Summary

**Assessment scope**: [Service / system / programme assessed]

**NORA source**: [Extract filename], source version [the extract's `version=` value] — 17 architectuurprincipes (NAP01–NAP17)

**GEMMA source**: [Extract filename and source version — or "GEMMA mode off: (reason)"]

**NORA posture**: [N] conformant · [N] partially conformant · [N] not conformant · [N] not applicable · [N] undetermined (of 17 NAPs)

**GEMMA posture** *(GEMMA mode only)*: [N] conformant · [N] partially conformant · [N] not conformant · [N] not applicable · [N] undetermined (of [N] GAPs)

**Kernwaarden at risk**: [Kernwaarden whose kwaliteitsdoelen are realised by one or more principles that are Not conformant or Undetermined, or "None"]

**Key findings**:

- [Finding 1]
- [Finding 2]
- [Finding 3]

> NORA and GEMMA are afsprakenstelsels, not legislation. "Not conformant" means the service does not yet follow the agreed principle; it is not a finding of illegality. A justified deviation is recorded in Section 7 and an ADR, not hidden.

---

## 1. Scope and Source

| Element | Value |
|---------|-------|
| Service / system in scope | [Description] |
| Providing organisation and bestuurslaag | [e.g. Gemeente / Provincie / Waterschap / Rijk / ZBO] |
| Service type | [Citizen-facing / business-facing / internal / chain (keten) service] |
| NORA source document | [Path to extract in `projects/000-global/external/`] |
| NORA source version | [The extract's `version=` value, and the latest revision date in its header] |
| Principle set applied | NORA architectuurprincipes NAP01–NAP17 (*Status actualiteit = Actueel*). Retired basisprincipes (BP) and afgeleide principes (AP) are not assessed. |
| GEMMA mode | [On — gemeente, GEMMA principles extract present / Off — (reason)] |
| GEMMA source document | [Path to GEMMA principles extract and its source version, or "—"] |
| GEMMA implicatie numbering | [GEMMA implicaties carry no IDs; `GAPnn.i` numbers are assigned by this assessment in extract order / "—"] |
| Other domain or sector architecture | [Name, not assessed here / None identified] |

### Source limitations

[Data notes carried over from the extract that affect this assessment — e.g. a kernwaarde referencing a kwaliteitsdoel that does not resolve. Write "None" if the extract reports none.]

---

## 2. Conformance Overview

| NAP | Principe | Conformance | Implicaties (impl. / partial / not / n.a. / unknown) | Highest-priority gap |
|-----|----------|-------------|-------------------------------------------------------|----------------------|
| NAP01 | [Title from extract] | [Conformant / Partially conformant / Not conformant / Not applicable / Undetermined] | [n / n / n / n / n] | [Gap or —] |
| … | … | … | … | … |
| NAP17 | [Title from extract] | [Status] | [n / n / n / n / n] | [Gap or —] |

**Conformance rule** — Apply the rules in this order; the first that matches decides:

1. **Not applicable** — every implicatie is Not applicable, each with a written justification.
2. **Conformant** — every applicable implicatie is Implemented.
3. **Undetermined** — more than half of the applicable implicaties are Unknown.
4. **Not conformant** — no applicable implicatie is Implemented or Partial.
5. **Partially conformant** — any other combination.

---

## 3. Assessment per Architectuurprincipe

<!-- Repeat this block for each of NAP01–NAP17, in ID order. -->

### NAP[NN] — [Title from extract]

> **Stelling** (verbatim, NORA): "[Stelling exactly as in the extract]" [CITATION-ID]

| Element | Value |
|---------|-------|
| Realiseert kwaliteitsdoelen | [KD IDs and names from the extract] |
| Applicability | [Applicable / Not applicable — justification] |
| Conformance | [Status per the rule in Section 2] |

| Implicatie | Laag | Status | Evidence | Gap |
|------------|------|--------|----------|-----|
| [IMP ID] [Title from extract] | [Layer number(s)] | [Implemented / Partial / Not implemented / Not applicable / Unknown] | [Artefact reference, e.g. ARC-001-REQ FR-012, or "No evidence found"] | [Gap or —] |

**Assessment**: [ArcKit's own analysis in English — how the service does or does not follow this principle, drawing on the evidence above. Do not paraphrase or translate the NORA text.]

#### GEMMA supplement — GAP[NN] [Title from GEMMA extract] *(GEMMA mode only)*

| Element | Value |
|---------|-------|
| Matched by | [Title / NORA-principe link — or "No matching GAP found"] |
| GEMMA conformance | [Status per the rule in Section 2, from the GEMMA implicaties only] |

> **GEMMA-toelichting** (verbatim): "[Text exactly as in the GEMMA extract, or omit if none]" [CITATION-ID]

| GEMMA implicatie | Text (verbatim) | Status | Evidence | Gap |
|------------------|-----------------|--------|----------|-----|
| GAP[NN].1 | [Implicatie exactly as in the GEMMA extract] | [Status] | [Evidence] | [Gap or —] |

---

## 3b. GEMMA's Own Principles *(GEMMA mode only)*

<!-- Repeat for each GEMMA principle whose Bron is GEMMA (GAP18 onwards), in ID order. When GEMMA mode is off, replace this section's body with "GEMMA mode off — not assessed (reason)". -->

### GAP[NN] — [Title from GEMMA extract]

> **Stelling** (verbatim, GEMMA): "[Stelling exactly as in the extract]" [CITATION-ID]

| Element | Value |
|---------|-------|
| Realiseert kwaliteitsdoelen | [As stated in the GEMMA extract] |
| Applicability | [Applicable / Not applicable — justification] |
| GEMMA conformance | [Status per the rule in Section 2] |

| GEMMA implicatie | Text (verbatim) | Status | Evidence | Gap |
|------------------|-----------------|--------|----------|-----|
| GAP[NN].1 | [Implicatie exactly as in the GEMMA extract] | [Status] | [Evidence] | [Gap or —] |

**Assessment**: [ArcKit's own analysis in English.]

---

## 4. View per Vijflaagsmodel Layer

| Laag | Applicable implicaties | Implemented | Partial | Not implemented | Unknown | Main gap |
|------|------------------------|-------------|---------|-----------------|---------|----------|
| 1 Grondslagenlaag | [n] | [n] | [n] | [n] | [n] | [Gap or —] |
| 2 Organisatorische laag | [n] | [n] | [n] | [n] | [n] | [Gap or —] |
| 3 Informatielaag | [n] | [n] | [n] | [n] | [n] | [Gap or —] |
| 4 Applicatielaag | [n] | [n] | [n] | [n] | [n] | [Gap or —] |
| 5 IT-Infrastructuurlaag | [n] | [n] | [n] | [n] | [n] | [Gap or —] |

> An implicatie tagged with several layers is counted in each. Count each implicatie once per layer even when it appears under more than one NAP.

---

## 5. Roll-up to Kwaliteitsdoelen and Kernwaarden

### Kwaliteitsdoelen

| Kwaliteitsdoel | Realised by | NAPs conformant / partial / not / undetermined | Status |
|----------------|-------------|-----------------------------------------------|--------|
| [KD ID] [Name] | [NAP IDs, from the extract's Realiseert relations] | [n / n / n / n] | [At risk / On track / Not applicable] |

A kwaliteitsdoel is *At risk* when any realising NAP is Not conformant or Undetermined. A kernwaarde is *At risk* when any kwaliteitsdoel its **Motiveert** line names is At risk.

### Kernwaarden

| Kernwaarde | Motiveert (kwaliteitsdoelen) | Kwaliteitsdoelen at risk | Status |
|------------|------------------------------|--------------------------|--------|
| [KWD ID] [Name] | [KD IDs, from the extract's Motiveert relations] | [KD IDs or —] | [At risk / On track] |

### GEMMA roll-up *(GEMMA mode only)*

| Kwaliteitsdoel / Kernwaarde | Kind | Realised by / influenced by (GEMMA extract) | GAP conformance | Status | Only in GEMMA? |
|-----------------------------|------|----------------------------------------------|-----------------|--------|----------------|
| [Name] | [Kwaliteitsdoel / Kernwaarde] | [GAP IDs / kwaliteitsdoelen] | [n / n / n / n] | [At risk / On track] | [Yes / No] |

> Roll-ups follow the relations stated in the extracts only. A relation an extract lists under *Data notes* as unresolved is not counted.

---

## 6. Gaps and Actions

| # | Principle (NAP/GAP) | Implicatie | Gap | Priority | Action | Owner | Target Date |
|---|-----|------------|-----|----------|--------|-------|-------------|
| 1 | [NAP or GAP ID] | [IMP ID or GAPnn.i] | [Gap description] | 🔴 High | [Action] | [Role] | [Date] |
| 2 | [NAP or GAP ID] | [IMP ID or GAPnn.i] | [Gap description] | 🟠 Medium | [Action] | [Role] | [Date] |
| 3 | [NAP or GAP ID] | [IMP ID or GAPnn.i] | [Gap description] | 🟡 Low | [Action] | [Role] | [Date] |

---

## 7. Deviations

Deliberate, justified departures from a NAP or GAP ("pas toe of leg uit"). Each deviation needs a decision record.

| Principle (NAP/GAP) | Implicatie | Deviation | Justification | Decision record |
|-----|------------|-----------|---------------|-----------------|
| [NAP or GAP ID] | [IMP ID, GAPnn.i or "whole principle"] | [What is done differently] | [Why] | [ARC-xxx-ADR-nnn, or "ADR required — run /arckit:adr"] |

**Next steps**: Run `/arckit:adr` for each deviation without a decision record. For gemeenten, run `/arckit-nl:nl-gemma` to map the service's applications onto GEMMA. Run `/arckit-nl:nl-bio` where gaps under NAP13 or NAP14 concern information security. Run `/arckit:risk` to carry open gaps into the risk register.

---

## 8. External References

> This section provides traceability from generated content back to source documents.
> Follow citation instructions in the project's citation reference guide.

### Document Register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| [DOC_ID] | [nora-principes.md] | External document | projects/000-global/external/ | NORA architectuurprincipes extract — NORA Online, source version [version]. NORA © Staat der Nederlanden, CC BY-ND 3.0 NL |
| [DOC_ID] | [gemma-principes.md] *(GEMMA mode only)* | External document | projects/000-global/external/ | GEMMA architectuurprincipes extract — [source version]. GEMMA © VNG Realisatie, EUPL; NORA-derived text CC BY-ND 3.0 NL |
| WEB-1 | <https://www.noraonline.nl> | Web URL | noraonline.nl | NORA — Nederlandse Overheid Referentie Architectuur (source of the extract; not fetched during this assessment) |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| [DOC_ID-C1] | [DOC_ID] | [NAP ID — Stelling] | Principle | [Verbatim stelling] |

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| — | — | — |

---

**Generated by**: ArcKit `/arckit-nl:nl-nora` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
