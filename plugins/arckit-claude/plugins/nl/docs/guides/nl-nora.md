# NORA Conformance Assessment Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit-nl:nl-nora` assesses how a Dutch government service conforms to the NORA architectuurprincipes (Nederlandse Overheid Referentie Architectuur), NAP01–NAP17. NORA is the interbestuurlijk afsprakenstelsel for the architecture of Dutch government service delivery, maintained by NORA Beheer (ICTU) and the NORA Gebruikersraad. Each principle is assessed per implicatie and per layer of the NORA Vijflaagsmodel, then rolled up to kwaliteitsdoelen and kernwaarden. For a gemeente the command adds the GEMMA supplement: the GEMMA-toelichting and municipal implicaties of each counterpart principle (GAP01–GAP17) and GEMMA's own principles (GAP18 onwards), reported beside the NORA result and never merged into it. The command applies to every bestuurslaag, not only central government.

See also: [Netherlands overlay guide](nl-overlay.md) · [GEMMA alignment guide](nl-gemma.md)

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| NORA extract (`projects/000-global/external/nora-principes.md`) | **Mandatory.** The principles, implicaties, kwaliteitsdoelen and kernwaarden, built by the overlay's `nl-references.py` from NORA Online. Without it the command stops and writes nothing. |
| GEMMA principles extract (`projects/000-global/external/gemma-principes.md`) | **For gemeenten.** Turns on GEMMA mode. Built by the same script from the GEMMA Archi-repository. |
| Requirements (`ARC-<id>-REQ-v1.0.md`) | **Mandatory.** Service description, NFRs, integration and data requirements: the main evidence for the implicaties. Without it most implicaties end up Unknown, and the command warns. |
| Architecture principles (`ARC-000-PRIN-v1.0.md`) | **Recommended.** Whether NORA or GEMMA is already adopted, and organisation principles that implement or deviate from a NAP |
| Stakeholder analysis (`ARC-<id>-STKE-v1.0.md`) | **Recommended.** Providing organisation, bestuurslaag, afnemers and chain partners |
| Data model (`ARC-<id>-DATA-v1.0.md`) | **Recommended.** Basisregistraties, data sources, metadata and retention: evidence for NAP10, NAP11 and NAP12 |
| ADRs (`decisions/ARC-<id>-ADR-*.md`) | **Recommended.** Decisions that implement a principle or deliberately deviate from it |
| BIO2 assessment (`ARC-<id>-BIO2-v1.0.md`), Secure by Design | **Recommended.** Security evidence for NAP13 and NAP14 |
| GEMMA mapping (`ARC-<id>-GEMMA-v1.0.md`) | **Recommended.** Which referentiecomponenten the service's applications fill and which standards they support: evidence for NAP07, NAP08 and NAP12 |
| Diagrams, risk register, TBB, RBCLOUD | **Optional.** Read when present |

---

## Command

```bash
/arckit-nl:nl-nora <project ID or service description>
```

In Claude Code the overlay installs as its own plugin, `arckit-nl`, so the command is `/arckit-nl:nl-nora`.

Example: `/arckit-nl:nl-nora NORA and GEMMA conformance for 002, the zaakgericht werken platform of the gemeente`

Output: `projects/<id>/ARC-<id>-NORA-v1.0.md`. A re-run writes the next version beside the earlier one.

The command first runs `nl-references.py` to fetch or refresh the extracts: `nora`, or `all` when the organisation is a gemeente. The [overlay guide](nl-overlay.md#nora-and-gemma-reference-material) explains the statuses, offline builds and extracts placed by hand. A `manual` or `offline` status is recorded under *Source limitations*. The command stops only when there is no NORA extract at all, and then says why.

---

## How Each Principle Is Assessed

1. **The stelling is quoted verbatim**, in Dutch, with a citation. NORA is licensed CC BY-ND 3.0 NL: quotation is allowed, adaptation and translation are not. ArcKit's own analysis follows in English, visibly separate.
2. **Every implicatie the extract lists under the NAP** gets a status (Implemented, Partial, Not implemented, Not applicable with a justification, or Unknown), the evidence and the gap. Absence of evidence is Unknown, never Implemented. An intention in a requirement is at most Partial until a design artefact or decision shows how it is realised.
3. **The NAP's conformance** follows one rule. The rules are applied in this order, and the first that matches decides:
   1. **Not applicable** — every implicatie is Not applicable, each with a written justification.
   2. **Conformant** — every applicable implicatie is Implemented.
   3. **Undetermined** — more than half of the applicable implicaties are Unknown.
   4. **Not conformant** — no applicable implicatie is Implemented or Partial.
   5. **Partially conformant** — any other combination.
4. **In GEMMA mode**, the matching GAP is found by title or by its *NORA-principe* link, never by number alone. Its GEMMA-toelichting is quoted, and its implicaties are assessed as `GAPnn.1`, `GAPnn.2`, … in extract order (GEMMA gives them no IDs, so the assessment numbers them and says so). The GAP gets its own GEMMA conformance with the same rule. It is never merged into the NAP's, so the NAP result stays comparable with assessments outside gemeenten.

The result is a distribution across the 17 principles, not a percentage or a single score.

**GEMMA mode** is on when the providing organisation is a gemeente (or a gemeentelijk samenwerkingsverband) and the GEMMA principles extract is present. The user can turn it on explicitly, for example for a shared service organisation that follows GEMMA.

---

## Roll-up

| View | Rule |
|------|------|
| Vijflaagsmodel (Section 4) | NORA implicatie statuses counted per layer. An implicatie tagged with several layers counts in each; one listed under several NAPs counts once per layer. GEMMA implicaties carry no layer. |
| Kwaliteitsdoelen (Section 5) | *Not applicable* when every realising NAP is Not applicable, *At risk* when any realising NAP is Not conformant or Undetermined, *On track* otherwise |
| Kernwaarden (Section 5) | *At risk* when any kwaliteitsdoel its Motiveert line names is At risk, *On track* otherwise |
| GEMMA roll-up (GEMMA mode) | The same rules over the GEMMA extract's own relations and the GAP conformance; kwaliteitsdoelen and kernwaarden that exist only in GEMMA are flagged |

Only relations stated in the extracts count. A relation an extract lists under *Data notes* as unresolved is left out and named under *Source limitations*.

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Executive Summary | NORA and GEMMA posture as distributions, kernwaarden at risk, key findings |
| 1. Scope and Source | Service, bestuurslaag, extracts with their source versions, GEMMA mode and why, *Source limitations* |
| 2. Conformance Overview | One row per NAP: conformance, implicatie counts, highest-priority gap; the conformance rule |
| 3. Assessment per Architectuurprincipe | Per NAP: the stelling verbatim, implicaties with status, evidence and gap, the assessment, and the GEMMA supplement in GEMMA mode |
| 3b. GEMMA's Own Principles | GAP18 onwards in GEMMA mode, or "GEMMA mode off" |
| 4. View per Vijflaagsmodel Layer | Implicatie statuses per layer and the main gap |
| 5. Roll-up | Kwaliteitsdoelen, kernwaarden, and the GEMMA roll-up |
| 6. Gaps and Actions | Every Partial, Not implemented or Unknown implicatie, prioritised, with an owner and target date (*To be assigned* where none is given) |
| 7. Deviations | Deliberate, justified departures, each with an ADR or "ADR required" |
| 8. External References | Every extract with its version and licence line, and a citation for every quoted stelling |

---

## Review Checklist

- `nl-references.py` ran first, and a `manual` or `offline` status is under *Source limitations* with the script's note and error.
- All 17 NAPs are assessed in ID order; retired basisprincipes (BP) and afgeleide principes (AP) are not.
- Every stelling is quoted verbatim and cited; no NORA text is paraphrased, summarised or translated.
- Every implicatie under each NAP has a status, evidence and gap, and missing evidence is Unknown.
- Each NAP's conformance follows the rule above, and Not applicable always carries a justification.
- In GEMMA mode, every GAP is matched by title or NORA link, its implicaties are numbered `GAPnn.i`, and NAP and GAP conformance stay separate.
- Roll-ups use only extract relations; there is no overall percentage or single score.
- Deviations are separated from gaps and each has an ADR or "ADR required".
- Non-conformance is described as an architecture finding, never as a legal breach: NORA and GEMMA are afsprakenstelsels, not law.
- An enterprise architect who knows NORA (and GEMMA, for gemeenten) reviews the output, and the quoted text is checked against noraonline.nl and gemmaonline.nl, before anyone relies on it.

---

## Next Steps

- `/arckit:adr` — record each deviation listed without an ADR.
- `/arckit-nl:nl-gemma` — for a gemeente, map the service's applications onto the GEMMA referentiecomponenten; the mapping is evidence for NAP07, NAP08 and NAP12 on the next run.
- `/arckit-nl:nl-bio` — assess BIO2 where gaps under NAP13 or NAP14 concern information security.
- `/arckit:principles` — adopt NORA (and GEMMA) in the organisation's own principles if they do not reference them yet.
- `/arckit:risk` — carry the high-priority gaps into the risk register.
