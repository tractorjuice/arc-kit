---
description: "[COMMUNITY] Generate a Canada sovereign cloud residency assessment — GC Cloud Adoption Strategy alignment, Direction on the Secure Use of Commercial Cloud Services, residency at Protected B+, sovereign options matrix (AWS Canada, Azure Canada Central/East, GCP Canada), CLOUD Act foreign-access analysis, exit and portability plan."
argument-hint: "<project ID or service name>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: adr
    description: Sovereign cloud option choices and CLOUD-Act risk acceptance warrant Architecture Decision Records.
  - command: ca-itsg-33
    description: Cloud control-profile selection (PBMM-Cloud, Secret-High) is grounded in the ITSG-33 categorisation.
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline.
> Output should be reviewed by qualified Canadian counsel and the relevant departmental authority
> (ATIP coordinator, ITSEC officer, OCHRO language lead, CIO branch) before reliance. Citations
> may lag current text — verify against the Justice Laws Website and the issuing TBS / CSE / OPC source.

## User Request

```text
$ARGUMENTS
```

You are an enterprise architect generating a Canada sovereign cloud residency assessment for a federal information system.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ artefact, with particular attention to NFR-AVL availability, NFR-LOC residency, and NFR-SEC data-handling requirements
   - The project's ITSG artefact (`ARC-<id>-ITSG-*.md`) for the categorisation and control profile, if present
   - The project's DR artefact for per-element sensitivity, including any Indigenous-data flags from `ca-ocap`
   - The project's PIA artefact (`ARC-<id>-PIA-*.md`) for personal-information residency drivers
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/ca-cloud-residency-template.md` (user override)
   - **Then**, `.arckit/templates/ca-cloud-residency-template.md`
   - **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/ca-cloud-residency-template.md`
3. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> CACR --filename` for the artefact filename.
4. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. Use the Canadian classification scheme (UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET) — replace the standard UK line in the header.
5. Generate the following sections (the template provides skeletons for each):
   - **Workload Categorisation** — pull the system-level categorisation and the C / I / A scores from `ca-itsg-33` if that artefact is present. Otherwise, perform the categorisation here using the TBS *Standard on Security Categorization* injury-based matrix and state the resulting Protected level. The categorisation drives every downstream choice; do not skip the working.
   - **Residency Requirement Statement** — state residency expectations for data at rest, in transit, and in processing. Capture backup and disaster-recovery location requirements. Note any policy-derived constraints (Privacy Act §8 routine-uses, lawful-authority drivers) and any data-class-derived constraints (Indigenous data per `ca-ocap`, Cabinet-confidence material, classified information). Where a managed service routes processing through a foreign region, treat that as a residency event.
   - **Sovereign Cloud Options Matrix** — for each option below, name the in-region offering, the current Protected B authorisation status (with verification date), the foreign-government access exposure (US CLOUD Act for US-incorporated CSPs; EO-12333 / FISA-702 reach for the same), the cost band relative to the cheapest in-Canada option, and any material managed-services availability gaps relative to the same provider's US regions:
     - **AWS Canada** — Central (Montréal, `ca-central-1`); West (Calgary, `ca-west-1`) once the region is GA and the federal authorisation is in scope
     - **Azure Canada** — Canada Central (Toronto); Canada East (Quebec City)
     - **Google Cloud Canada** — Montréal (`northamerica-northeast1`); Toronto (`northamerica-northeast2`)
   - **GC Cloud Brokering Service Path** — capture the Shared Services Canada cloud-brokering option, the active supplier arrangements (e.g. `EN578-191593/H/ZF` and successor vehicles), the inheritance of SSC-issued ATO components, and the residual departmental authorisation responsibilities. SSC brokering does not transfer the departmental ATO obligation — it scaffolds it.
   - **Foreign Subprocessor Analysis** — Cloud Service Provider supply-chain residency: hyperscaler hardware origin, third-party services bundled into managed offerings (data analytics, ML, observability, edge), and the named sub-processor lists each CSP publishes. Identify any sub-processor whose primary jurisdiction sits outside Canada and document the exposure.
   - **Exit / Portability Plan** — bulk-export plan per workload, state-replication strategy, data-format portability (e.g. Parquet / ORC / Avro for analytics; OCI for containers; standard SQL dumps for relational state), and a proven exit dry-run cadence (annual minimum). Include a budget for egress fees and runbook-rebuild effort — exit is not free.
   - **Cross-Border Transfer Analysis** — where federal data crosses the border (CDN egress, analytics tooling backhauled to a US region, foreign support staff with administrative access), document the transfer, cite the lawful authority (Privacy Act §8 routine use, contractual TIA with the supplier, departmental data-sharing instrument), and note CLOUD-Act-driven retention of US-incorporated CSP exposure even for in-Canada-region workloads.
   - **Operational Topology** — regions, availability zones, network paths (private link, transit gateway, peering), dedicated interconnects (Direct Connect / ExpressRoute / Cloud Interconnect), encryption-in-transit posture between zones, and the BYOK / HYOK / external-key-store custody decision per workload.
   - **Open Items** — outstanding sovereign-cloud option choices, pending Protected B authorisations on the candidate provider, unresolved sub-processor flags, exit-dry-run schedule, and any condition the security authority has placed on go-live.
6. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The TBS *Direction on the Secure Use of Commercial Cloud Services*, the *Government of Canada Cloud Adoption Strategy*, CSE *ITSP.50.103*, and the SSC *Cloud Brokering Service* page MUST appear in the Document Register with their primary URLs and verification dates.
7. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
8. Show only a summary to the user (one paragraph plus the system-level categorisation, the chosen sovereign cloud option, the CLOUD-Act exposure posture, and any open Protected B authorisation or sub-processor flags).

## Authoritative anchor

Treasury Board of Canada Secretariat *Direction on the Secure Use of Commercial Cloud Services* (current version); *Government of Canada Cloud Adoption Strategy* (CIO branch); CSE *ITSP.50.103 Guidance on Security Categorization of Cloud-Based Services* and related ITSP cloud guidance; SSC Cloud Brokering Service. Authority: TBS CIO Branch; SSC; CSE / Cyber Centre. URLs: <https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=32600> (Direction); <https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/cloud-services.html>.

## Important notes

- **Region of incorporation matters as much as region of operation.** A US-incorporated CSP with Canadian regions still attracts CLOUD Act exposure for the data it processes; document the legal-conflict acceptance and identify the named approver. In-region storage does not neutralise extraterritorial reach.
- **Sovereignty is a posture, not a checkbox.** Sovereign-cloud claims must be tested against managed-service dependencies, encryption-key custody (BYOK / HYOK / external key store), and the identity / IAM trust roots — a workload that authenticates against a foreign-hosted IdP is not residency-clean even if the data sits in Canada.
- **Exit is not free.** Bulk-egress fees, format-portability gaps (proprietary lakehouse formats, vendor-specific managed services), and operational-runbook coupling all create real exit cost. Budget for an exit dry-run on a published cadence so the plan is rehearsed, not aspirational.
- **Categorisation upgrades trigger residency review.** Moving from Protected B to Protected C or SECRET reshapes the eligible region set and may force a different CSP entirely; treat any pending categorisation work as a blocker on residency choices, not a parallel track.
