---
description: "[COMMUNITY] Assess sovereign cloud residency under the UAE National Cloud Security Policy v2. Validates per-classification residency, checks candidate CSPs (Core42 / G42 sovereign / Microsoft UAE North + Central, TDRA FedNet, e& Sovereign Launchpad on AWS, du Tech National Hypercloud) against the policy's tiers and minimum certifications, and captures shared-responsibility matrix and exit/portability plan."
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
   - **CSP Due-Diligence Pack** — for each candidate CSP (Core42 / G42 sovereign cloud, Microsoft UAE North and UAE Central, TDRA FedNet, e& Sovereign Launchpad on AWS, du Tech National Hypercloud), record the certifications Appendix 6.6 requires of every cloud service (§3.1.5.1), with the evidence seen and its date: UAE Information Assurance Standard and DESC Information Security Regulation self-assessments; valid ISO/IEC 27001:2022, 27017:2019, 27018:2019 and 22301:2019 certificates; SOC 1 and SOC 2 Type II attestation reports; and CSA STAR 2 certification or attestation. Also record the regional footprint, the CSP's published list of services that meet the Partial Sovereign or Sovereign Cloud Requirements (§3.4.1.2, §3.4.1.6), and any documented limitations.
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
- The policy names no CSPs, keeps no approved-provider list and sets no accreditation scheme: the candidates above are common options, not approved ones. Each CSP keeps its own list of services that meet the Partial Sovereign or Sovereign Cloud Requirements (§3.4.1.2, §3.4.1.6), so check each service used against that list. Appendix 6.6 asks every cloud service for a DESC Information Security Regulation self-assessment as well as a UAE IAS one, whatever the consumer's emirate. Record any further certification a CSP holds as additional evidence, with its scope and source. The Cyber Security Council does certify some offerings against the policy: du announced on 5 May 2026 that the Council had certified du Tech's National Hypercloud for all workloads except those classified Secret and Top Secret (WAM, <https://www.wam.ae/en/article/177h4m4-tech%E2%80%99s-national-hypercloud-receives-uae-cyber>). Secret and Top Secret are the policy's two levels above Confidential/Restricted (Appendix 6.7), so on that account it covers Open and Confidential/Restricted datasets, not the Sovereign Cloud tier. A certification like this does not replace the Appendix 6.6 evidence or the check of each service against the CSP's own list, and its scope should be confirmed from the certificate itself.
- Each material residency decision (chosen CSP, region, derogation) should be captured as a formal ADR — see the `adr` handoff.
