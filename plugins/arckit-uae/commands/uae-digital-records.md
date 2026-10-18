---
description: "[COMMUNITY] Generate a Digital Records Plan under the UAE Government Services Digital Records Policy. Captures the source-of-truth register per service, retention schedule, and records-as-official-source designation."
doc-type: DREC
argument-hint: "<project ID or service name>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: data-model
    description: Source-of-truth designations refine entity ownership in the data model.
  - command: uae-data-sharing
    description: Records designated as the official source feed downstream data-sharing agreements.
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

You are an enterprise architect generating a Digital Records Plan under the UAE Government Services Digital Records Policy.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ (including its `DR-*` requirements), DATA (data model), DIAG (architecture diagrams) and CLAS (UAE Smart Data Classification Register) artefacts (if present)
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/uae-digital-records-template.md` (user override)
   - **Then**, `.arckit/templates/uae-digital-records-template.md`
   - **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/uae-digital-records-template.md`
3. Use `bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh --json --name "<project-name>"` if the project does not yet exist; otherwise locate it.
4. Use `node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs <PROJECT_ID> DREC {VERSION} --filename` for the artefact filename. Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.
5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`.
6. Generate the following sections:
   - **Source-of-Truth Register** — for every record type the service produces or consumes, designate the authoritative system, the custodian entity, and a stable record identifier scheme.
   - **Retention Schedule** — for every record type, state the retention period, the legal/regulatory basis for that period, the disposal trigger, and the disposal method.
   - **Records-as-Official-Source Designation** — under the Digital Records Policy, digital records (when properly captured, retained, and audit-trailed) are the official source. State which records carry that designation, and what evidence (audit trail, integrity controls, signature) supports it.
   - **Records Lifecycle** — capture, classification (cross-reference to CLAS register), storage, access, retention, disposal. State where each lifecycle stage is implemented in the technology stack.
   - **Audit & Disposal procedures** — the operational procedure for periodic audit (sampling, integrity checks) and the controlled disposal procedure (approver, evidence of disposal).
7. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The 23 April 2026 UAE Cabinet meeting announcement (Government Services Digital Records Policy) MUST appear in the Document Register with its primary URL and the verification date.
8. Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **DREC** per-type checks pass. Fix any failures before proceeding.
9. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
10. Show only a summary to the user (one paragraph plus the count of records under each lifecycle stage and any retention gaps).

## Authoritative anchor

UAE Government Services Digital Records Policy — approved by the UAE Cabinet on 23 April 2026. Primary URL (UAE Cabinet announcement): <https://uaecabinet.ae/en/news/under-directives-of-uae-president-and-in-world-first-mohammed-bin-rashid-reveals-new-uae-government-framework-to-deploy-agentic-ai-across-50-of-government-sectors-operations-within-two-years>. The Dubai Media Office carries the same text: <https://mediaoffice.ae/en/news/2026/april/23-04/mohammed-bin-rashid-chairs-uae-cabinet-meeting>

## Important notes

- Neither announcement names the federal body that owns or administers the policy, and the policy text was not published with them. Do not attribute it to the Ministry of Cabinet Affairs or to the National Library and Archives. Record the administering body in the artefact only when the entity has it in writing (for example, the comprehensive records guide the announcement mentions); otherwise record it as an open item for the entity's records or data office to confirm.
- The Cabinet decision designates digital records as the official source — ensure this is reflected explicitly per record type, not merely as a policy aspiration.
- Retention bases must cite the underlying instrument (federal law, sectoral regulation, internal policy) — do not state retention periods without authority.
- Records designated as the official source must have an integrity control (hash, WORM, signed audit trail) — flag any record type that cannot evidence integrity.
