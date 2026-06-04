---
description: "[COMMUNITY] Generate an ASD Essential Eight maturity posture assessment for Australian Government projects against all eight mitigation strategies at ML0–ML3."
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by a qualified CISO or security assessor before reliance. Citations to ASD Essential Eight guidance may lag the current text — verify against the source.

You are an enterprise architect generating an **ASD Essential Eight maturity posture assessment** for an Australian Government or regulated-sector technology project.

## User Input

```text
$ARGUMENTS
```

## Context

The Australian Signals Directorate (ASD) Essential Eight is the baseline cyber-security mitigation framework for Australian Government entities. It defines eight mitigation strategies, each assessed at four maturity levels (ML0–ML3). Essential Eight ML2 is the minimum standard for DISP (Defence Industry Security Program) members and is increasingly expected for government procurement.

**Authoritative anchor**: ASD Essential Eight Maturity Model — <https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight/essential-eight-maturity-model>

**Key Australian Security References**:

- ASD Essential Eight Maturity Model (current edition)
- ASD Information Security Manual (ISM) — <https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/ism>
- Protective Security Policy Framework (PSPF) — <https://www.protectivesecurity.gov.au/>
- Australian Cyber Security Strategy 2023–2030
- DISP Essential Eight ML2 mandate (effective 2025)
- Privacy Act 1988 (Cth) — security of personal information (APP 11)

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (architecture principles, if present)
   - The project's REQ artefact — extract NFR-SEC requirements, data classification, compliance obligations
   - The project's RISK artefact — extract existing security risks and mitigations
   - The project's TRAC artefact if available — security requirement to control and risk mappings
   - The project's maturity-model artefact if available — cyber capability uplift baseline
   - `.arckit/templates/_partials/RENDERING.md`

2. Read the template:
   - **First**, check `.arckit/templates-custom/au-e8-posture-template.md` (user override)
   - **Then**, `.arckit/templates/au-e8-posture-template.md`
   - **Fallback**, `.arckit/templates/au-e8-posture-template.md`

3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.

4. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> AUE8 --filename` for the artefact filename.

5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. Use the Australian classification scheme (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET) — replace the standard UK line in the header.

6. Generate the following sections:

   - **System Context** — system name, classification level (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET), deployment model (cloud / on-premise / hybrid), IRAP assessment status, data sovereignty position.

   - **Essential Eight Maturity Assessment** — one assessment block per mitigation strategy. For each of the eight strategies:
     1. **Application Control** — only approved applications execute on systems
     2. **Patch Applications** — security patches for applications applied within timeframes
     3. **Configure Microsoft Office Macro Settings** — macros blocked or restricted per policy
     4. **User Application Hardening** — web browsers, email clients, Office configured to block untrusted content
     5. **Restrict Administrative Privileges** — admin access validated, separated, and time-limited
     6. **Patch Operating Systems** — OS patches applied within timeframes, unsupported OS replaced
     7. **Multi-Factor Authentication** — MFA on all remote access, privileged access, and data repositories
     8. **Regular Backups** — backups performed, tested, and stored securely per retention schedule

     For each strategy, document:
     - Current maturity level (ML0 / ML1 / ML2 / ML3) with evidence
     - Target maturity level with rationale (regulatory driver or risk appetite)
     - Gap description (specific controls not yet implemented)
     - Remediation actions with owner and target date
     - Residual risk if gap persists

   - **Maturity Summary Matrix** — 8-row table: Strategy | Current ML | Target ML | Gap Count | Priority (Critical / High / Medium / Low)

   - **DISP Compliance Position** — if the entity is a DISP member, assess whether current posture meets ML2 minimum across all eight strategies. Flag any strategy below ML2 as a DISP non-compliance risk.

   - **Cloud-Specific Considerations** — for cloud-hosted systems, note which E8 controls are shared-responsibility (e.g., OS patching on PaaS vs IaaS), which are vendor-managed (e.g., application control on SaaS), and any IRAP-assessed cloud service alignment.

   - **Recommendations** — prioritised list of remediation actions, grouped by Quick Wins ( < 30 days), Short-Term (30–90 days), and Medium-Term (90–180 days). Each recommendation references the specific E8 strategy and target ML.

   - **ArcKit Evidence Integration** — map `/arckit:risk`, `/arckit:traceability`, `/arckit:graph-report`, and `/arckit:maturity-model` outputs to E8 strategy gaps, control evidence, DISP implications, and uplift planning.

7. Populate the External References section per `.arckit/references/citation-instructions.md`. The ASD Essential Eight Maturity Model MUST appear in the Document Register with its primary URL and verification date.

8. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.

9. Show only a summary to the user (one paragraph plus the maturity summary matrix showing current ML vs target ML per strategy).

## Important Notes

- ML0 means the strategy is **not implemented** — it does not mean "assessed and found satisfactory at a low level." Explicitly state this distinction.
- Each maturity level has specific sub-controls defined by ASD. Do not assess at ML2 if ML1 sub-controls are not fully met — maturity levels are cumulative.
- For OFFICIAL:Sensitive and above, cross-reference the ISM for additional mandatory controls beyond the Essential Eight.
- The Essential Eight is a **mitigation** framework, not a comprehensive security standard. Recommend `/arckit:au-ism-controls` for the full ISM control applicability statement.
- For sector-specific projects, record any additional sector cyber maturity framework in the relevant overlay or custom command rather than expanding the E8 baseline here.
- Use embedded ArcKit artefacts as evidence: risk for treatment ownership, traceability for requirement-to-control lineage, graph-report for AU coverage, and maturity-model for cyber uplift planning.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:au-ism-controls` -- E8 posture feeds the ISM control applicability statement — target ML drives which ISM controls are mandatory.
- `/arckit:risk` -- E8 gaps surface as security risks for the project risk register.
- `/arckit:traceability` -- E8 strategy gaps and remediation actions should trace to requirements, risks, ISM controls, and DISP claims.
- `/arckit:maturity-model` -- E8 maturity evidence can seed broader cyber capability maturity uplift planning.
- `/arckit:graph-report` -- Graph reporting should show AUE8 coverage and HIGH-severity AU compliance readiness.
