---
description: "[COMMUNITY] Assess sovereign cloud residency under the UAE National Cloud Security Policy v2. Validates per-classification residency, names approved CSP options (Core42 / G42 sovereign / Microsoft UAE North + Central, TDRA FedNet, e& Sovereign Launchpad on AWS), and captures shared-responsibility matrix and exit/portability plan."
doc-type: CRES
argument-hint: "<project ID or service name>"
effort: high
handoffs:
  - command: uae-classification
    description: This command depends on the Smart Data Classification Register — run uae-classification first if it does not yet exist.
    condition: "No CLAS artefact present in the project"
  - command: adr
    description: Capture each material residency decision (chosen CSP, region, derogations) as a formal ADR.
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
  - Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs *)
  - Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" *)
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / federal compliance counsel before reliance. Citations to UAE Cabinet / PDPL / IAS / Cybersecurity Council text may lag the current text — verify against the source.

## User Request

```text
$ARGUMENTS
```

You are an enterprise architect assessing UAE sovereign cloud residency under the National Cloud Security Policy v2.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's Smart Data Classification Register (`ARC-<project-id>-CLAS-v*.md`). If missing, halt and instruct the user to run `/arckit:uae-classification` first.
   - The project's REQ, DIAG (architecture diagrams) and IAS artefacts (if present)
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/uae-cloud-residency-template.md` (user override)
   - **Then**, `.arckit/templates/uae-cloud-residency-template.md`
   - **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/uae-cloud-residency-template.md`
3. Use `node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs <PROJECT_ID> CRES {VERSION} --filename` for the artefact filename. Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.
4. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`.
5. Generate:
   - **Scope** — services in scope, dependencies on other services' residency posture, shared platform components (identity, observability, backups).
   - **Per-Dataset Residency Assessment** — for each Dataset ID from the CLAS register, map Smart Data class → policy level → Required tier → Chosen CSP → Region → Compliance check. The policy sets its own four levels (Appendix 6.7: Open, Confidential/Restricted, Secret and Top Secret) and leaves the consumer to map its scheme onto them, so record the mapping per dataset: Open maps to Open; Confidential to Confidential/Restricted; Sensitive to the level above Confidential/Restricted where the dataset holds sensitive personal or health data (the policy places medical history and biometric data there) or its disclosure could cause significant harm at national, Emirate or sectoral level, and otherwise to Confidential/Restricted; Secret sits above Confidential/Restricted. The tier then follows from the policy level:
     - **Open** — Baseline Secure Cloud Requirements only. The policy sets no UAE-location requirement for Open data, but the location must be known and the CSP must operate in an acceptable legal jurisdiction (§2.4.1.1–2.4.1.3).
     - **Confidential/Restricted** — Partial Sovereign Cloud or Sovereign Cloud (§2.4.1.4): consumer data stored within the UAE (§3.4.1.1), encryption keys and their backups generated, stored and managed in the UAE (§3.3.2.5), and redundancy within the UAE (§3.9.1.4).
     - **Above Confidential/Restricted** — Sovereign Cloud only (§2.4.1.5): in addition, all processing and all metadata within the UAE (§3.4.1.4–3.4.1.5), UAE-based HSMs (§3.3.2.6), and no access to the environment from outside the UAE (§3.6.6.2).
   - **CSP Due-Diligence Pack** — for each candidate CSP (Core42 / G42 sovereign cloud, Microsoft UAE North and UAE Central, TDRA FedNet, e& Sovereign Launchpad on AWS), record certification posture (DESC for Dubai entities, CSC accreditation), regional footprint, the CSP's published list of services that meet the Partial Sovereign or Sovereign Cloud Requirements (§3.4.1.2, §3.4.1.6), and any documented limitations.
   - **Shared-Responsibility Matrix** — per chosen CSP, division of security responsibilities across infrastructure, platform, application, data, identity, and operational layers.
   - **Exit and Portability Plan** — data egress strategy, format portability, identity migration, key custody on exit, contingency residency on regulatory change.
6. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The National Cloud Security Policy, Version 2.0 (September 2025), MUST appear in the Document Register with its primary URL and the verification date, and each residency finding cites the clause it rests on.
7. Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **CRES** per-type checks pass. Fix any failures before proceeding.
8. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
9. Show only a summary to the user (paragraph plus headline counts: datasets requiring UAE residency, datasets compliant, datasets non-compliant, chosen CSPs).

## Authoritative anchor

UAE National Cloud Security Policy, Version 2.0 (September 2025), issued by the UAE Cyber Security Council and approved by the UAE Cabinet. Primary URL (CSC policy page): <https://csc.gov.ae/en/w/national-cloud-security-policy>; PDF: <https://csc.gov.ae/documents/38662/1042755/National+Cloud+Security+Policy_V2.0.pdf/ee6897fa-943b-8874-d23b-c0ec1608c90f>. The UAE Legislation Platform lists it with an issued date of 17 September 2025 and the Cyber Security Council as lead entity: <https://uaelegislation.gov.ae/en/policy/details/national-cloud-security-policy>

## Important notes

- Every dataset above Open MUST be stored in the UAE, on a Partial Sovereign or Sovereign Cloud for Confidential/Restricted data and on a Sovereign Cloud for data above it (§2.4.1.4–2.4.1.5). Flag any non-compliant dataset as a critical gap and recommend either re-classification (with rationale) or migration. Only the Cyber Security Council can grant an exception to the policy (§1.4); record any exception with its approval reference.
- AWS `me-south-1` is the Middle East (Bahrain) Region, so it is not UAE-resident. AWS's UAE Region is `me-central-1`, Middle East (UAE), open since August 2022. Record the AWS Region per dataset; do not treat an AWS workload as UAE-resident unless it runs in `me-central-1` or another UAE location. Only an Open dataset may be stored in a non-UAE Region, because the policy sets no UAE-location requirement for Open data.
- DESC accreditation is Dubai-specific; federal entities may rely on CSC accreditation. Both should be recorded where applicable.
- Each material residency decision (chosen CSP, region, derogation) should be captured as a formal ADR — see the `adr` handoff.
