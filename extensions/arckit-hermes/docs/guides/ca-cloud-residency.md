# Canada Sovereign Cloud Residency Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:ca-cloud-residency` generates a sovereign cloud residency assessment for a Canadian federal information system. The artefact reconciles the system-level Protected categorisation with the *Government of Canada Cloud Adoption Strategy* and the TBS *Direction on the Secure Use of Commercial Cloud Services*, then produces a sovereign-options matrix across AWS Canada, Azure Canada, and Google Cloud Canada. It records the foreign-government access exposure (US CLOUD Act, FISA-702 / EO-12333 reach for US-incorporated CSPs), captures the SSC cloud-brokering inheritance picture, and documents the exit and portability plan with a published dry-run cadence.

The Protected B threshold is the load-bearing line in this artefact. At Protected B and above the *Direction on the Secure Use of Commercial Cloud Services* tightens the residency envelope, and the choice of region, sub-processor inventory, encryption-key custody, and identity trust root all become assurance-relevant. The assessment is rationale-driven: every sovereign-option choice and every CLOUD-Act risk acceptance must be named, justified, and approved — sovereignty is a posture, not a checkbox.

This command does not replace the formal cloud authorisation packages (CSP-level CSEAP submission, departmental ATO, SSC inheritance memos). It produces the residency-decision artefact that sits alongside those packages: the document that captures *why this region, this CSP, this exit plan, this CLOUD-Act risk acceptance*, anchored to the categorisation and the data-class drivers. Reviewers — security authority, departmental privacy office, ATIP coordinator, CIO branch — read it to understand the residency choices before they read the SoA or the PIA.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | NFR-AVL availability targets, NFR-LOC residency requirements, NFR-SEC data-handling expectations |
| ITSG-33 SoA (`ARC-<id>-ITSG-v1.0.md`) | System-level categorisation and chosen control profile (PBMM-Cloud, Secret-High) — drives the residency envelope |
| Data requirements (`ARC-<id>-DR-v1.0.md`) | Per-element sensitivity, including any Indigenous-data or personal-information flags |

---

## Command

```bash
/arckit:ca-cloud-residency <project ID or service description>
```

Output: `projects/<id>/ARC-<id>-CACR-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Document Control | Canadian classification (UNCLASSIFIED / Protected A–C / CONFIDENTIAL / SECRET / TOP SECRET) |
| Revision History | Version, date, author, changes, approvals |
| Executive Summary | Categorisation, recommended sovereign cloud option, CLOUD-Act exposure posture, exit cadence |
| Workload Categorisation | C / I / A scoring (or pull from ITSG SoA) and the resulting Protected level |
| Residency Requirement Statement | At rest, in transit, in processing; backup and DR location; policy and data-class constraints |
| Sovereign Cloud Options Matrix | AWS Canada, Azure Canada, Google Cloud Canada with regions, Protected B status, CLOUD-Act exposure, cost band, managed-services gaps |
| GC Cloud Brokering Service Path | SSC role, departmental role, inheritance of ATO components |
| Foreign Subprocessor Analysis | CSP supply-chain residency and named sub-processor jurisdictions |
| Exit / Portability Plan | Bulk-export plan, state replication, format portability, dry-run cadence |
| Cross-Border Transfer Analysis | Transfers, lawful authority cited, justification, CLOUD-Act exposure even for in-Canada workloads |
| Operational Topology | Regions, AZs, network paths, encryption-in-transit, peering, key custody |
| Open Items | Pending Protected B authorisations, unresolved sub-processor flags, exit-rehearsal schedule |
| External References | Document Register, Citations, Unreferenced |

The Shared Responsibility Matrix (within Operational Topology) crosswalks every residency-relevant control across CSP / SSC / departmental ownership, so reviewers can see who answers to TBS for which control surface.

---

## When to run

- Pre-deployment cloud strategy — generate the assessment before the cloud target is locked in, not after.
- Categorisation upgrade — any move from Protected A to Protected B, or Protected B to Protected C / SECRET, reshapes the eligible region set; re-run.
- CSP migration — moving between hyperscalers (or onto an SSC-brokered offering) requires a fresh sovereign-options matrix and a refreshed CLOUD-Act risk acceptance.
- ATO renewal — re-run on the published re-authorisation cycle; sub-processor inventories drift continuously and the verification dates expire.
- New managed-service adoption — when a workload picks up a managed observability, ML, or analytics service that brings its own sub-processor reach, re-run the foreign-subprocessor analysis.
- New CSP region or sovereign offering — Canadian cloud supply matures incrementally (e.g. AWS `ca-west-1` Calgary going GA, Azure regional expansions, GCP additional Toronto capacity). Re-run when a candidate region reaches the federal authorisation envelope, in case it changes the recommendation.
- Sub-processor change notice — most CSPs publish sub-processor lists with a notice cadence; treat any addition of a non-Canadian-jurisdiction sub-processor as a trigger for a focused re-assessment of the affected workloads.

---

## Common pitfalls

- **Treating a Canadian region as full sovereignty.** A US-incorporated CSP with `ca-central-1` or Canada Central is still subject to the US CLOUD Act for the data it processes. The region addresses operational residency; it does not neutralise the legal-conflict exposure.
- **Ignoring CLOUD Act on US-incorporated CSPs.** The risk acceptance must be named — recorded in an ADR, signed off by an accountable person, and visible to the authorising official. Silent acceptance fails on inspection.
- **Under-budgeting exit cost.** Bulk-egress fees, format-portability gaps, and operational-runbook coupling all add up. An exit budget that has not been tested by a dry-run is fiction; rehearse annually at minimum.
- **Assuming SSC brokering cancels departmental ATO obligations.** SSC publishes inherited ATO components but the departmental Authorising Official still issues the system ATO. Treat the inherited envelope as scaffolding, not a transfer.
- **Federating identity to a foreign tenant.** A workload whose IAM trust root sits in a foreign-hosted IdP is not residency-clean even if the data is in Canada. The identity plane is a residency surface.
- **Treating sub-processor lists as static.** CSPs update their sub-processor lists on their own cycle. Record the verification date and re-check at ATO renewal.
- **Conflating Canadian region with Canadian sovereign cloud.** AWS Canada, Azure Canada, and Google Cloud Canada are Canadian-region offerings of US-incorporated CSPs, not sovereign clouds in the sense some other jurisdictions use the term. Where a workload requires a sovereignty posture beyond what an in-Canada region of a US CSP can deliver, escalate to the security authority — the eligible-options set narrows materially.
- **Forgetting the backup region.** Disaster-recovery secondaries often quietly land in a foreign region under default cloud-provider patterns. Pin the DR target to a second Canadian region (or an in-Canada AZ topology) and verify the actual replication path against the residency requirement.

---

## Handoffs

- **`adr`** — Sovereign-cloud option choices (which region, which CSP, which encryption-key custody model) and CLOUD-Act risk acceptances are material architectural decisions. Each warrants an ADR with options analysed, the chosen path justified, and the named accepter recorded against the residual risk.
- **`ca-itsg-33`** — The cloud control-profile selection (PBMM-Cloud for the typical federal Protected B cloud-hosted baseline; Secret-High for higher-categorised workloads) is grounded in the ITSG-33 categorisation. Run `ca-itsg-33` before this assessment where possible — the categorisation flows in. Where this assessment is run first to inform a cloud decision, hand the categorisation forward to the SoA and reconcile both artefacts at the same review. Tailoring decisions in the SoA (key-custody parameters, network-segmentation parameters, audit retention) often have direct cloud-residency implications and should be revisited together.

---

## Statutory currency

The TBS *Direction on the Secure Use of Commercial Cloud Services* updates regularly as TBS guidance evolves and as new sovereign-cloud offerings reach federal authorisation. CSE sovereign-cloud guidance moves with regional supply maturity — Protected B authorisations, new Canadian regions (e.g. AWS `ca-west-1`), and new sovereign offerings (e.g. provider-specific sovereign clouds for Canada) all reshape the eligible-options set. Re-verify against the TBS and CSE primary sources at the verification date recorded in the Document Register, and treat any sub-processor list as time-bounded.

The CMVP active-modules list, the CSP-published sub-processor inventories, and the SSC cloud-brokering catalogue all churn on shorter cycles than the TBS Direction. Stamp the verification date against each table cell that reflects an external source, and surface anything that has gone stale at the next review gate. A residency assessment that has not been re-verified in the last review cycle is, for inspection purposes, not current — even if the underlying environment has not changed.
