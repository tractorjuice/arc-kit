# GEMMA Alignment Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit-nl:nl-gemma` maps a gemeente's application landscape onto GEMMA (Gemeentelijke Model Architectuur, VNG Realisatie): the referentiecomponenten its applications fill, the bedrijfsfuncties they support, the standards and data exchange GEMMA expects between them, and where the landscape falls short. The result is a set of roadmap candidates, each traced to a finding. It describes what applications are used for. It never calls a product "GEMMA-compliant" and never recommends products or suppliers; product information belongs in the GEMMA Softwarecatalogus.

See also: [Netherlands overlay guide](nl-overlay.md) · [NORA conformance guide](nl-nora.md)

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| GEMMA referentiecomponenten extract (`projects/000-global/external/gemma-referentiecomponenten.md`) | **Mandatory.** Components, applicatieservices, groups, standards and data exchange, built by the overlay's `nl-references.py` from the GEMMA Archi-repository. Without it the command stops and writes nothing. |
| GEMMA bedrijfsfunctiemodel extract (`gemma-bedrijfsfuncties.md`) | **Optional.** Needed for bedrijfsfunctie coverage (Section 4); without it that section is skipped and the gap noted. |
| GEMMA principles extract (`gemma-principes.md`) | **Optional.** Lets roadmap candidates name the GAP principle they serve. |
| A landscape source | **Mandatory.** In order of strength: an explicit mapping (a GEMMA Softwarecatalogus export, the gemeente's ArchiMate model, an inventory with a GEMMA column), an application inventory (`ARC-<id>-APP`, from `/arckit-togaf-adm:application-inventory` in the TOGAF ADM overlay), other application lists, plates or contract registers in `external/`, or applications named in the input. Without any, the command stops and says which would help. |
| Architecture principles (`ARC-000-PRIN-v1.0.md`) | **Recommended.** Portfolio, standardisation, reuse and cloud principles |
| Requirements (`ARC-<id>-REQ-v1.0.md`) | **Recommended.** Required capabilities and integrations, when the scope is one project |
| Data model, diagrams | **Recommended.** Integrations and data flows, as evidence for data exchange |
| NORA assessment, roadmap, capability map, risk register | **Optional.** Read when present |

---

## Command

```bash
/arckit-nl:nl-gemma <project ID or scope>
```

In Claude Code the overlay installs as its own plugin, `arckit-nl`, so the command is `/arckit-nl:nl-gemma`.

Example: `/arckit-nl:nl-gemma Map the full application landscape of the gemeente for 001, using the ArchiMate extract in 000-global/external`

Output: `projects/<id>/ARC-<id>-GEMMA-v1.0.md`. A re-run writes the next version beside the earlier one.

The command first runs `nl-references.py gemma` to fetch or refresh the extracts. The [overlay guide](nl-overlay.md#nora-and-gemma-reference-material) explains the statuses, offline builds from a downloaded `GEMMA release.xml`, and extracts placed by hand. A `manual` or `offline` status is recorded under *Source limitations*.

---

## How the Landscape Is Mapped

1. **Each application is mapped** to one or more referentiecomponenten, using only names that appear in the extract, with a confidence:
   - **Stated** — a source links the application to the component explicitly; the source is cited.
   - **Inferred** — derived from the application's described purpose and the component's description and applicatieservices; a one-line rationale is given. Most landscapes have no explicit mapping, so most mappings are Inferred, and the summary shows the split.
   - **Unmapped** — no component fits, and none is forced.
2. **Coverage** lists the filled components, with an overlap flag where several applications fill one, and the unfilled components with a relevance judgement: Expected, Possibly not needed, or To be confirmed (the default). Overlap is examined for sector-specific use before it is called a finding.
3. **Bedrijfsfunctie coverage** marks each function in scope Supported, Not supported (a landscape gap), or No GEMMA component (a property of the reference model, not of the landscape).
4. **Standards and data exchange** are evidence-based: a standard is Supported, Not supported or Unknown per application, and a GEMMA data exchange between filled components is Present, Absent or Unknown. Unknown is the default; GEMMA linking a standard to a component says nothing about a product.
5. **Roadmap candidates** follow from the findings: Rationalise, Fill, Standardise, Integrate, or Replace or keep (with an ADR). Each has a priority with a reason and, when the principles extract is present, the GAP principle it serves.

If the organisation is not a gemeente, the mapping says so prominently: GEMMA is the municipal reference model, and the result is then indicative only.

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Executive Summary | Scope, GEMMA source version, mapping split (Stated / Inferred / Unmapped), coverage figures, key findings |
| 1. Scope and Sources | The gemeente and scope, every landscape source with its date, every extract with its source version, *Source limitations* |
| 2. Application Mapping | Each application, its product and supplier as the sources state them, components, confidence and evidence |
| 3. Coverage of Referentiecomponenten | Filled components with overlap flags; unfilled components by group, with relevance judgements |
| 4. Bedrijfsfunctie Coverage | Supported, Not supported and No GEMMA component per group, with the Not supported functions listed |
| 5. Standards | Per filled component, the GEMMA standards and each application's support, with evidence |
| 6. Data Exchange and Buitengemeentelijke Voorzieningen | GEMMA data exchange between filled components, and the voorzieningen the landscape connects to |
| 7. Roadmap Candidates | Each candidate with its type, the finding it traces to, a priority with a reason, and the GAP principle where available |
| 8. External References | Every extract (with the EUPL licence line) and every landscape source in the Document Register |

---

## Review Checklist

- `nl-references.py` ran first, and a `manual` or `offline` status is under *Source limitations* with the script's note and error.
- Every component, applicatieservice, bedrijfsfunctie and standard name matches the extract exactly; none is invented, merged or renamed.
- Every application has a confidence: Stated mappings cite their source, Inferred mappings give a rationale, Unmapped applications are not forced.
- Overlap is checked for sector-specific use before a rationalisation candidate is proposed.
- Unfilled components carry a relevance judgement with a reason.
- Bedrijfsfunctie coverage keeps Not supported (landscape gap) apart from No GEMMA component (reference-model property).
- Standards and data exchange rest on evidence, with Unknown where there is none.
- Every roadmap candidate traces to a finding and has a priority with a reason, and no product or supplier is recommended or called GEMMA-compliant.
- Inferred mappings are validated with the application owners before the mapping is relied on, and the GEMMA text is checked against gemmaonline.nl.

---

## Next Steps

- `/arckit:roadmap` — turn the roadmap candidates into a sequenced architecture roadmap.
- `/arckit-nl:nl-nora` — assess NORA and GEMMA principle conformance; this mapping is evidence for the reuse and standardisation principles.
- `/arckit:adr` — record decisions on overlapping applications, and on unmapped applications that will be kept.
- `/arckit:principles` — reflect GEMMA alignment in the organisation's architecture principles if they do not reference it yet.
