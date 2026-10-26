---
description: "[COMMUNITY] Generate a UAE Smart Data Classification Register for a project, mapping every dataset to one of the four Smart Data Framework classes (Open / Confidential / Sensitive / Secret) with handling rules and declassification schedule. Anchored on the UAE Smart Data Framework."
doc-type: CLAS
argument-hint: "<project ID or service name>"
effort: high
handoffs:
  - command: data-model
    description: The classification register feeds the data model entity-by-entity sensitivity tags.
  - command: uae-cloud-residency
    description: Residency obligations follow from the classification level (Confidential and above require UAE-resident sovereign cloud).
  - command: uae-data-sharing
    description: Data sharing agreements depend on per-dataset classification.
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
  - Bash(bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh" *)
  - Bash(${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs *)
  - Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" *)
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / federal compliance counsel before reliance. Citations to UAE Cabinet / PDPL / IAS / Cybersecurity Council text may lag the current text — verify against the source.

## User Request

```text
$ARGUMENTS
```

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
3. Use `bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh --json --name "<project-name>"` if the project does not yet exist; otherwise locate it.
4. Use `node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs <PROJECT_ID> CLAS {VERSION} --filename` for the artefact filename. Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.
5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. For UAE Federal entities the UAE block (Federal Entity, Cabinet Instrument, Sovereign Cloud Region, AI Autonomy Tier) MUST appear.
6. For each dataset the project handles, assign one of the four Smart Data Framework classes — Open, Confidential, Sensitive or Secret — with explicit handling, storage, and declassification rules. Apply the framework's criteria:
   - Classify the dataset on its most sensitive item (Part 1, standard DC1.1).
   - **Open** is the default for non-personal data; any other class needs a documented rationale (Part 2, Guidance Note 5.1).
   - **Confidential** is the default for non-sensitive personal data (name, date of birth, address), and also covers internal government data such as meeting minutes, correspondence and financial reports.
   - **Sensitive** is the default for sensitive personal data (health, biometric, genetic, criminal record and the other categories the guidance note lists), and for data whose disclosure may cause limited damage to government bodies, companies or individuals.
   - **Secret** is for data whose disclosure may cause significant damage to the supreme interests of the UAE and very high damage to government bodies, companies or individuals. Secret data is not published or exchanged digitally on the electronic platform (Part 1, standard DC2).
7. Cross-reference each dataset to:
   - Upstream BR / DR requirements that drove its capture
   - Downstream INT requirements that consume it
   - The applicable PDPL lawful basis (if personal data is in scope — see `/arckit-uae:uae-pdpl`)
8. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The UAE Smart Data Framework (Part 1: Smart Data Principles and Standards, and Part 2: Smart Data Implementation Guide) MUST appear in the Document Register with its primary URL and the verification date.
9. Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **CLAS** per-type checks pass. Fix any failures before proceeding.
10. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
11. Show only a summary to the user (one paragraph plus a short list of datasets and their proposed classifications).

## Authoritative anchor

UAE Smart Data Framework — Part 1: Smart Data Principles and Standards, v2.0 (February 2019), Data Classification Standard DC1 and DC2; Part 2: Smart Data Implementation Guide, v2.0 (March 2019), Guidance Note 5.1 *Classifying data*. Both documents are published on the UAE Government portal. Primary URL: <https://u.ae/en/about-the-uae/digital-uae/data/data-operability>

This citation MUST be present in the artefact's External References section.

## Important notes

- Do NOT use UK Government classifications (PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET) in this artefact — the UAE Smart Data Framework classes are the authoritative scheme for UAE Federal entities.
- The framework has four classes. "Shared" and "Closed" are exchange modes in the framework, not classes, and there is no "Top Secret" class. If an earlier version of this register uses the overlay's former five-rung ladder, re-classify each dataset against the four classes rather than carrying the old label forward (former `Shared` is usually `Confidential`, former `Top Secret` is `Secret`, and a former `Confidential` dataset may now be `Sensitive`), and record the change in the Revision History.
- Confidential, Sensitive and Secret datasets carry residency obligations under the National Cloud Security Policy v2 — flag these for `/arckit-uae:uae-cloud-residency`.
- Personal data datasets must be mapped to a PDPL lawful basis — if `/arckit-uae:uae-pdpl` has not yet been run, recommend it as a follow-up.
