# Canada Sovereign Cloud Residency Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:ca-cloud-residency`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Classification line MUST be: -->
<!-- | Classification | UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET | -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:ca-cloud-residency` | [PENDING] | [PENDING] |

## Executive Summary

[Two to three paragraphs describing the system, the system-level categorisation (UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET), the residency expectation at rest / in transit / in processing, the sovereign cloud option recommended (AWS Canada / Azure Canada / Google Cloud Canada / SSC-brokered / hybrid), the CLOUD-Act exposure posture and the named risk acceptance, the exit-portability cadence, and any pending Protected B authorisations or sub-processor flags. Note any conditions imposed by the security authority on go-live.]

## Workload Categorisation

> Pull the system-level categorisation from `ARC-<id>-ITSG-*.md` if present. Otherwise, score Confidentiality (C), Integrity (I), and Availability (A) per the TBS *Standard on Security Categorization* injury-based matrix and aggregate to a system-level categorisation using the high-water mark.

| Asset | Confidentiality (L/M/H) | Integrity (L/M/H) | Availability (L/M/H) | Aggregate (L/M/H) | Protected Level |
|-------|--------------------------|-------------------|----------------------|---------------------|-----------------|
| [Asset 1 — e.g. citizen application records] | [score + injury rationale] | [score + injury rationale] | [score + injury rationale] | [aggregate] | [UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET] |
| [Asset 2 — e.g. analytic data lake] | [score] | [score] | [score] | [aggregate] | [level] |
| [Asset 3 — e.g. cryptographic key material] | [score] | [score] | [score] | [aggregate] | [level] |

**System-level categorisation**: [high-water mark across the inventory] — [one-paragraph rationale, with a pointer to the ITSG SoA if it has been generated]

## Residency Requirement Statement

> Capture residency for data at rest, in transit, and in processing. Note backup and DR location requirements. Surface policy-derived constraints (Privacy Act §8, lawful-authority drivers) and data-class-derived constraints (Indigenous data per `ca-ocap`, Cabinet confidence, classified material).

| Requirement | Source | Constraint | Notes |
|-------------|--------|------------|-------|
| Data at rest in Canada | [TBS Direction § / `NFR-LOC-*` / `DR-*` / `PIA-*`] | [In-Canada region only / Encrypted at rest with BYOK / HYOK] | [exception envelope, if any] |
| Data in transit through Canadian network paths | [Source] | [No transit through foreign network points-of-presence / TLS 1.3+ end-to-end] | [interconnect plan reference] |
| Data in processing on Canadian compute | [Source] | [In-region compute only / no cross-border managed-service backhaul] | [list any managed services flagged for backhaul] |
| Backup residency | [Source] | [In-Canada / cross-region within Canada / out-of-country prohibited] | [backup window and recovery point] |
| Disaster recovery location | [Source] | [Secondary Canadian region required / hot-warm-cold posture] | [RTO / RPO from REQ NFR-AVL] |
| Indigenous-data handling (if applicable) | [`ca-ocap` / DR-* / Crown-Indigenous policy] | [OCAP principles applied; processing rights restricted] | [data-sovereignty rights holder named] |
| Personal-information residency | [PIA / Privacy Act §8 / DR-*] | [Privacy Act §8 routine use cited; cross-border transfer disclosed in PIA] | [routine-use reference] |

## Sovereign Cloud Options Matrix

> For each option, name the region(s), the current Protected B authorisation status with verification date, the foreign-government access exposure, the cost band relative to the cheapest in-Canada option, and any managed-services availability gaps.

| Provider | Region | Protected B Authorisation Status (as of [YYYY-MM-DD]) | CLOUD-Act / Foreign-Access Exposure | Cost Band | Managed-Services Gaps |
|----------|--------|-------------------------------------------------------|--------------------------------------|-----------|------------------------|
| AWS Canada | Central — Montréal (`ca-central-1`) | [Authorised / Conditional / Pending — verification date] | US-incorporated CSP — US CLOUD Act applies; FISA-702 / EO-12333 reach for US-collected metadata | [$ / $$ / $$$ relative to cheapest] | [services available in US regions but absent from `ca-central-1`] |
| AWS Canada | West — Calgary (`ca-west-1`) | [GA / Limited GA / Pending — verification date; federal authorisation scope to confirm] | Same CLOUD-Act posture as `ca-central-1` | [band] | [services lagging `ca-central-1`] |
| Azure Canada | Canada Central — Toronto | [status — verification date] | US-incorporated CSP — CLOUD Act applies; entity-level legal process risk | [band] | [services lagging US regions] |
| Azure Canada | Canada East — Quebec City | [status — verification date] | Same CLOUD-Act posture as Canada Central | [band] | [services lagging Canada Central] |
| Google Cloud Canada | Montréal (`northamerica-northeast1`) | [status — verification date] | US-incorporated CSP — CLOUD Act applies | [band] | [services lagging GCP US regions] |
| Google Cloud Canada | Toronto (`northamerica-northeast2`) | [status — verification date] | Same CLOUD-Act posture as Montréal | [band] | [services lagging Montréal] |
| SSC-brokered | Multi-CSP under SSC vehicles (e.g. `EN578-191593/H/ZF` and successors) | [Inherited authorisation envelope where SSC has issued the broker-level ATO] | Inherited from underlying CSP; CLOUD Act exposure unchanged | [band] | [scope limited to brokered services on the published catalogue] |

**Recommended option**: [Provider + Region] — [one-paragraph rationale tying the recommendation to the categorisation, the residency requirement statement, the CLOUD-Act risk acceptance, and the cost band]. **Named risk accepter** for residual CLOUD-Act exposure: [role + name + ADR reference].

## GC Cloud Brokering Service Path

> SSC brokering scaffolds the departmental authorisation but does not transfer the departmental ATO obligation. Capture the steps and the role split.

| Step | SSC Role | Departmental Role | Artefact |
|------|----------|-------------------|----------|
| Service intake and eligibility | [SSC brokering team confirms vehicle coverage and CSP availability] | [Departmental architect submits intake] | [Intake form / SSC reference number] |
| Inheritance assessment | [SSC publishes the inherited ATO components and the residual scope] | [Departmental security authority confirms the inherited boundary] | [Inheritance memo] |
| Departmental authorisation | [SSC supports evidence requests] | [Departmental Authorising Official issues the system ATO over the inherited components] | [Departmental ATO letter] |
| Operate and re-authorise | [SSC re-publishes inherited components on its cycle] | [Departmental security authority operates the system within the inherited envelope and re-authorises on the published cycle] | [Continuous monitoring + re-authorisation memo] |

## Foreign Subprocessor Analysis

> Cloud Service Provider supply-chain residency. Walk the published sub-processor lists and flag any whose primary jurisdiction sits outside Canada.

| CSP | Service | Sub-processor | Jurisdiction | Notes |
|-----|---------|---------------|--------------|-------|
| [CSP 1] | [Service — e.g. observability, ML inference, CDN] | [Sub-processor entity] | [Country / state of incorporation] | [Material exposure — data plane / control plane / metadata only] |
| [CSP 2] | [Service] | [Sub-processor] | [Jurisdiction] | [Notes] |
| [CSP 3] | [Service] | [Sub-processor] | [Jurisdiction] | [Notes] |
| [CSP 4] | [Service — bundled third party] | [Sub-processor] | [Jurisdiction] | [Notes] |

## Exit / Portability Plan

> Numbered runbook plus a per-asset table. The plan must be rehearsed on a published cadence — exit on paper is not exit.

1. **Trigger inventory** — list the events that initiate exit (categorisation upgrade, supplier flag, contract termination, sovereignty-policy change).
2. **Bulk export** — name the export tooling per workload, the staging location (in-Canada object storage, departmental SAN), and the transfer window.
3. **State replication** — describe how warm state (databases, queues, in-flight workflows) is replicated to the destination during cutover.
4. **Format portability** — confirm the stored formats are portable (Parquet / ORC / Avro for analytics; OCI for containers; standard SQL dumps for relational state) and flag any proprietary lakehouse or managed-service formats that need transformation.
5. **Identity and IAM cutover** — re-root the trust chain to the destination IdP; revoke source-tenant credentials.
6. **Operational-runbook rebuild** — identify runbooks coupled to source-CSP-specific tooling and rebuild them on the destination.
7. **Dry-run cadence** — schedule and rehearse the exit at least annually; capture the actual time-to-exit and update the budget.

| Exit Asset | Format | Tooling | Dry-run Cadence |
|------------|--------|---------|------------------|
| [Application database] | [Postgres dump / Parquet snapshot] | [Tool — e.g. AWS DMS / Azure DMS / native pg_dump] | [Annual / Semi-annual] |
| [Analytics lake] | [Parquet / ORC] | [Spark export job / Glue / Synapse export] | [Cadence] |
| [Container images] | [OCI tarball] | [skopeo / oras / native registry export] | [Cadence] |
| [Object storage] | [Native objects + manifest] | [aws s3 sync / azcopy / gsutil] | [Cadence] |
| [IAM / identity] | [SCIM export + IdP claim mapping doc] | [SCIM bridge / IdP export] | [Cadence] |

## Cross-Border Transfer Analysis

> Where federal data crosses the border, document the transfer, cite the lawful authority, and note CLOUD-Act exposure even for workloads operationally hosted in Canada.

| Transfer | Direction | Authority Cited | Justification |
|----------|-----------|-----------------|---------------|
| [Transfer 1 — e.g. CDN egress to US edge POP] | [Outbound to US] | [Privacy Act §8 routine use ref / contractual TIA] | [Operational rationale + residual exposure note] |
| [Transfer 2 — e.g. observability backhaul] | [Outbound to US managed observability] | [Authority] | [Justification + mitigation, e.g. data minimisation, hashing] |
| [Transfer 3 — e.g. foreign administrative access (CSP support staff)] | [Logical access from foreign jurisdiction] | [Authority — SSC contract clause / TBS Direction] | [Just-in-time access + audit + key-custody mitigations] |
| [Transfer 4 — CLOUD-Act-driven exposure, in-Canada operation] | [Latent legal exposure even with no operational outbound] | [Documented acceptance — named accepter] | [Risk acceptance rationale and ADR reference] |

## Operational Topology

| Region | Availability Zone(s) | Network Path | Encryption-in-Transit | Peering / Interconnect |
|--------|----------------------|--------------|-----------------------|------------------------|
| [Primary — e.g. `ca-central-1`] | [AZs in scope] | [Private link / transit gateway / VPN] | [TLS 1.3 / mTLS / IPsec / MACsec where applicable] | [Direct Connect / ExpressRoute / Cloud Interconnect — bandwidth + redundancy] |
| [Secondary — e.g. `ca-west-1` or Canada East] | [AZs] | [Path] | [Posture] | [Interconnect — DR-only / active-active] |
| [Edge / CDN] | [N/A or named PoPs] | [Path] | [Posture] | [Peering] |
| [Backup / DR target] | [Cross-region within Canada AZ list] | [Replication path — async / sync / snapshot ship] | [Posture] | [Dedicated link or public path] |

**Encryption key custody**: [BYOK / HYOK / external key store / CSP-managed]. **Key store location**: [In-Canada HSM / cloud-native KMS / on-premises HSM with cloud bridge]. **Identity trust root**: [In-Canada IdP / federated to a foreign tenant — flag if foreign]. **Privileged-access provenance**: [Just-in-time access only / no foreign-jurisdiction administrative access / break-glass procedure documented].

## Shared Responsibility Matrix

> Capture which residency control sits with the CSP, with SSC under brokering, and with the department. The matrix is the single source of truth for "who answers to TBS for this control" — overlap is acceptable, gaps are findings.

| Control Area | CSP Responsibility | SSC Responsibility (if brokered) | Departmental Responsibility |
|--------------|--------------------|-----------------------------------|------------------------------|
| Physical region location | [In-Canada region operation] | [Vehicle scope confirmation] | [Region selection in deployment IaC] |
| Encryption at rest | [Native KMS availability] | [Inherited KMS configuration baseline] | [BYOK / HYOK rotation, key custody, deletion] |
| Encryption in transit | [TLS termination at CSP boundary] | [N/A or shared baseline] | [End-to-end TLS, mTLS between services] |
| Sub-processor management | [CSP publishes sub-processor list and notice cadence] | [SSC tracks broker-scoped sub-processors] | [Departmental review against PIA and DPIA] |
| Foreign administrative access | [CSP support staff access controls] | [SSC contractual clauses] | [Just-in-time approval, audit, and review] |
| Cross-border transfer logging | [CSP region selection and routing] | [Broker-level auditing] | [Privacy Act §8 routine-use register] |

## Open Items

| ID | Description | Owner | Due Date | Status |
|----|-------------|-------|----------|--------|
| OI-1 | [Outstanding sovereign-cloud option choice / pending Protected B authorisation / unresolved sub-processor flag / exit dry-run schedule / authorisation condition] | [Role] | [YYYY-MM-DD] | [Open / In Progress / Closed] |
| OI-2 | [item] | [owner] | [date] | [status] |

## External References

### Document Register

| Doc ID | Title | URL | Verified date |
|--------|-------|-----|---------------|
| CA-TBS-CLOUD | TBS Direction on the Secure Use of Commercial Cloud Services | <https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=32600> | [YYYY-MM-DD] |
| CA-GC-CAS | Government of Canada Cloud Adoption Strategy | <https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/cloud-services.html> | [YYYY-MM-DD] |
| CA-ITSP-50-103 | CSE ITSP.50.103 Guidance on Security Categorization of Cloud-Based Services | <https://cyber.gc.ca/en/guidance/itsp50103-guidance-security-categorization-cloud-based-services> | [YYYY-MM-DD] |
| CA-SSC-BROKER | SSC Cloud Brokering Service | <https://www.canada.ca/en/shared-services/services/it-modernization/cloud-services.html> | [YYYY-MM-DD] |
| CA-PRIV-ACT | Privacy Act (R.S.C., 1985, c. P-21) — §8 routine uses | <https://laws-lois.justice.gc.ca/eng/acts/p-21/> | [YYYY-MM-DD] |

### Citations

| Citation | Doc ID | Section | Used in |
|----------|--------|---------|---------|
| [TBS-CLOUD-1] | CA-TBS-CLOUD | Residency expectations at Protected B and above | Residency Requirement Statement |
| [TBS-CLOUD-2] | CA-TBS-CLOUD | CSP risk-management and assurance posture | Sovereign Cloud Options Matrix |
| [GC-CAS-1] | CA-GC-CAS | Cloud-first / public-cloud-by-default posture and exceptions | Workload Categorisation |
| [ITSP-50-103-1] | CA-ITSP-50-103 | Categorisation of cloud-based services and inheritance | Workload Categorisation |
| [SSC-BROKER-1] | CA-SSC-BROKER | Cloud brokering steps and inherited ATO components | GC Cloud Brokering Service Path |
| [PRIV-ACT-1] | CA-PRIV-ACT | Privacy Act §8 routine-use authority for cross-border transfers | Cross-Border Transfer Analysis |

### Unreferenced Documents

[List any documents read during generation but not cited, or "None".]
