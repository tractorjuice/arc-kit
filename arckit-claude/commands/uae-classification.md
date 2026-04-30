---
description: "Generate a UAE Smart Data Classification Register for a project, mapping every dataset to Open / Shared / Confidential / Secret / Top Secret with handling rules and declassification schedule. Anchored on the UAE Smart Data Framework."
argument-hint: "<project ID or service name>"
effort: high
handoffs:
  - command: data-model
    description: The classification register feeds the data model entity-by-entity sensitivity tags.
  - command: uae-cloud-residency
    description: Residency obligations follow from the classification level (Confidential and above require UAE-resident sovereign cloud).
  - command: uae-data-sharing
    description: Data sharing agreements depend on per-dataset classification.
---

You are an enterprise architect generating a UAE Smart Data Classification Register for a UAE federal entity.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's existing artefacts under `projects/<project-id>/`
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` (Document Control resolution rules)
2. Read the template:
   - **First**, check `.arckit/templates-custom/uae-classification-template.md` (user override)
   - **Then**, `.arckit/templates/uae-classification-template.md`
   - **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/uae-classification-template.md`
3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.
4. Use `scripts/bash/generate-document-id.sh CLAS --filename` for the artefact filename.
5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md` based on the user's plugin userConfig (`governance_framework` and `classification_scheme`). For UAE Federal entities the UAE block (Federal Entity, Cabinet Instrument, Sovereign Cloud Region, AI Autonomy Tier) MUST appear.
6. For each dataset the project handles, propose a Smart Data classification level (Open, Shared, Confidential, Secret, Top Secret) with explicit handling, storage, and declassification rules. Cite the UAE Smart Data Classifications publication where the level definitions are stated.
7. Cross-reference each dataset to:
   - Upstream BR / DR requirements that drove its capture
   - Downstream INT requirements that consume it
   - The applicable PDPL lawful basis (if personal data is in scope — see `/arckit.uae-pdpl`)
8. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The UAE Smart Data Classifications publication MUST appear in the Document Register with its primary URL and the verification date.
9. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
10. Show only a summary to the user (one paragraph plus a short list of datasets and their proposed classifications).

## Authoritative anchor

UAE Smart Data Classifications (TDRA / Cabinet Smart Data initiative). Primary URL: <https://u.ae/en/about-the-uae/digital-uae/data/data-operability>

This citation MUST be present in the artefact's External References section.

## Important notes

- Do NOT use UK Government classifications (PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET) in this artefact — the UAE Smart Data ladder is the authoritative scheme for UAE Federal entities.
- Confidential, Secret and Top Secret datasets carry residency obligations under the National Cloud Security Policy v2 — flag these for `/arckit.uae-cloud-residency`.
- Personal data datasets must be mapped to a PDPL lawful basis — if `/arckit.uae-pdpl` has not yet been run, recommend it as a follow-up.
