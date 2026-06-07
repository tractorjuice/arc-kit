---
hazards:
  - id: D-HAZ-001
    description: "Inadequate clinician training leading to misuse of the product"
    cause: "Training scheduled too far ahead of go-live; clinicians joining post go-live miss formal training; high churn in agency / locum cover; super-user model not embedded"
    effect: "Clinicians use the product incorrectly, with patient safety, data quality, and workflow consequences"
    severity: 3
    likelihood: 2
    risk: high
    controls:
      - DC001
      - DC002
    residual-severity: 3
    residual-likelihood: 4
    residual-risk: medium
    status: open
    cso-reviewed: false
    date-raised: "[YYYY-MM-DD]"
    date-closed:
  - id: D-HAZ-002
    description: "Workflow integration gap — clinical task falls between this product and another system"
    cause: "Workflow mapping missed an edge case; handover-of-care point unclear; ambiguous ownership of a clinical action"
    effect: "Clinical action delayed or not performed; risk of duplicate action by multiple clinicians each assuming the other will act"
    severity: 2
    likelihood: 3
    risk: high
    controls:
      - DC003
      - DC004
    residual-severity: 2
    residual-likelihood: 4
    residual-risk: medium
    status: open
    cso-reviewed: false
    date-raised: "[YYYY-MM-DD]"
    date-closed:
  - id: D-HAZ-003
    description: "Integration failure with another local system (interface engine outage, HL7 / FHIR message loss)"
    cause: "Interface engine outage; message validation rejection; partner system maintenance window; certificate expiry"
    effect: "Clinical data not propagated where expected (orders not actioned, results not visible, alerts not triggered)"
    severity: 2
    likelihood: 3
    risk: high
    controls:
      - DC005
      - DC006
    residual-severity: 2
    residual-likelihood: 4
    residual-risk: medium
    status: open
    cso-reviewed: false
    date-raised: "[YYYY-MM-DD]"
    date-closed:
  - id: D-HAZ-004
    description: "Business-continuity failure when the product is unavailable (planned or unplanned)"
    cause: "Cloud provider outage; deployment downtime; failed change; cyber incident; network outage"
    effect: "Clinicians cannot perform clinical workflow; if no manual fallback, patient care delayed or compromised"
    severity: 2
    likelihood: 3
    risk: high
    controls:
      - DC007
      - DC008
    residual-severity: 2
    residual-likelihood: 4
    residual-risk: medium
    status: open
    cso-reviewed: false
    date-raised: "[YYYY-MM-DD]"
    date-closed:
  - id: D-HAZ-005
    description: "Confusion during parallel running with a legacy system"
    cause: "Two systems show different clinical data; clinicians unclear which is authoritative; data entered into legacy not reflected in new system or vice versa"
    effect: "Clinical decisions made against an incomplete or out-of-date view"
    severity: 2
    likelihood: 3
    risk: high
    controls:
      - DC009
    residual-severity: 2
    residual-likelihood: 4
    residual-risk: medium
    status: open
    cso-reviewed: false
    date-raised: "[YYYY-MM-DD]"
    date-closed:
  - id: D-HAZ-006
    description: "Data migration error — legacy records not faithfully transferred to the new product"
    cause: "Source-target field mapping incomplete; truncation; encoding mismatch; coded data not back-mapped where target uses different vocabulary"
    effect: "Historical clinical data lost or distorted; clinicians act without full clinical history"
    severity: 2
    likelihood: 3
    risk: high
    controls:
      - DC010
    residual-severity: 2
    residual-likelihood: 5
    residual-risk: low
    status: open
    cso-reviewed: false
    date-raised: "[YYYY-MM-DD]"
    date-closed:
  - id: D-HAZ-007
    description: "Local configuration error (e.g. wrong drug formulary, wrong age-band thresholds, wrong reference ranges)"
    cause: "Configuration imported from a different organisation without local verification; reference data updated upstream not propagated; defect in the configuration UI"
    effect: "Clinical decision support gives wrong recommendation; alerts mis-fire or miss-fire"
    severity: 2
    likelihood: 3
    risk: high
    controls:
      - DC011
      - DC012
    residual-severity: 2
    residual-likelihood: 5
    residual-risk: low
    status: open
    cso-reviewed: false
    date-raised: "[YYYY-MM-DD]"
    date-closed:
  - id: D-HAZ-008
    description: "Local terminology / coding mismatch (e.g. local SNOMED subset diverges from product expectations)"
    cause: "Local SNOMED subset not aligned with product's expected subset; legacy local codes used; dm+d updates not synced"
    effect: "Clinical concepts mis-interpreted by the product (e.g. allergy not recognised); decision support fails silently"
    severity: 2
    likelihood: 3
    risk: high
    controls:
      - DC013
    residual-severity: 2
    residual-likelihood: 5
    residual-risk: low
    status: open
    cso-reviewed: false
    date-raised: "[YYYY-MM-DD]"
    date-closed:
  - id: D-HAZ-009
    description: "Authorisation / role-mapping error (local RBAC misaligned with intended product RBAC)"
    cause: "Local roles do not map cleanly to product roles; local administrator over-provisions for convenience; role review not embedded"
    effect: "Confidentiality breach or, conversely, clinical action blocked when it should be allowed"
    severity: 3
    likelihood: 3
    risk: medium
    controls:
      - DC014
    residual-severity: 3
    residual-likelihood: 5
    residual-risk: low
    status: open
    cso-reviewed: false
    date-raised: "[YYYY-MM-DD]"
    date-closed:
  - id: D-HAZ-010
    description: "Failure to capture and act on local incidents involving the product"
    cause: "No clear local reporting route into Datix or equivalent; clinical staff unaware that product incidents should be reported; no escalation path to the manufacturer"
    effect: "Recurring safety issues not surfaced, not addressed, and not fed back to the manufacturer; latent failure to learn"
    severity: 3
    likelihood: 3
    risk: medium
    controls:
      - DC015
      - DC016
    residual-severity: 3
    residual-likelihood: 5
    residual-risk: low
    status: open
    cso-reviewed: false
    date-raised: "[YYYY-MM-DD]"
    date-closed:

controls:
  - id: DC001
    description: "Training plan published before go-live; mandatory completion gate before clinician account activation; competence assessment built into onboarding."
  - id: DC002
    description: "Super-user model embedded per ward/team; super-users have additional time-allocation for floor support; refresh training on each major release."
  - id: DC003
    description: "Workflow mapping signed off by clinical leads in each affected service before deployment; explicit handover-of-care responsibility statements per workflow step."
  - id: DC004
    description: "Daily safety huddle during pilot and first 30 days of full rollout to surface and resolve workflow gaps quickly."
  - id: DC005
    description: "Interface monitoring with alerting on message-rate drop / error spike; on-call procedure for interface engine failure; documented fallback for clinical-priority interfaces."
  - id: DC006
    description: "Message replay capability for transient failures; reconciliation reports for batch-processed clinical data."
  - id: DC007
    description: "Manual fallback workflow documented per clinical service; printed quick-reference cards held at clinical bases; tested at deployment and refreshed annually."
  - id: DC008
    description: "Business continuity drill before go-live and at agreed cadence thereafter; outcomes reviewed by CSO."
  - id: DC009
    description: "Single source of truth declared per data class during parallel running, with prominent UI signalling in both systems; minimal parallel-running window; explicit cut-over date communicated."
  - id: DC010
    description: "Data migration validation: sample-based clinical review of migrated records; reconciliation of record counts and key fields; rollback plan defined if validation fails."
  - id: DC011
    description: "Local configuration sign-off by clinical lead AND CSO; configuration changes peer-reviewed; release-notes review at each product version uplift."
  - id: DC012
    description: "Reference data (formularies, age bands, reference ranges) sourced from authoritative upstream where possible (dm+d, NHS BSA, etc.) with automated freshness monitoring."
  - id: DC013
    description: "Local SNOMED / coding subset verified against product's expected subset before go-live; gap analysis documented; on-going monitoring of SNOMED release impact."
  - id: DC014
    description: "Local role-to-product-role mapping reviewed by deploying-organisation IG lead and CSO; quarterly RBAC review embedded; break-glass usage audited."
  - id: DC015
    description: "Local incident reporting route documented and communicated; product-specific Datix category created; routine review of Datix entries tagged to this product."
  - id: DC016
    description: "Escalation path to the manufacturer documented (vendor contact, response SLA, vigilance reporting trigger if the product is a medical device)."
---

# Deployment Hazard Log — [PRODUCT_NAME] at [DEPLOYING_ORGANISATION]

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:uk-nhs-dcb0160` | **Filename**: `DEPLOYMENT-HAZARD-LOG.md` (DCB0160 deployer)

## Document Control

| Field | Value |
|---|---|
| **Document ID** | `DEPLOYMENT-HAZARD-LOG.md` (Marcus Baw SAFETY.md spec convention) |
| **Document Type** | Deployment Hazard Log (DCB0160 deployer) |
| **Project** | [PROJECT_NAME] (Project [PROJECT_ID]) |
| **Classification** | [OFFICIAL / OFFICIAL-SENSITIVE] |
| **Status** | DRAFT |
| **Version** | [VERSION] |
| **Created Date** | [YYYY-MM-DD] |
| **Last Modified** | [YYYY-MM-DD] |
| **Review Cycle** | Monthly during pilot and first 90 days; quarterly thereafter |
| **Next Review Date** | [YYYY-MM-DD] |
| **Owner** | [DEPLOYING_ORGANISATION_PROJECT_OWNER] |
| **Reviewed By** | [PENDING — deploying-organisation CSO] |
| **Approved By** | [PENDING — deploying-organisation CSO] |
| **Distribution** | [DISTRIBUTION_LIST] |

## Risk scoring scales (DCB0129 / DCB0160 convention)

- **Severity**: `1` Catastrophic | `2` Major | `3` Considerable | `4` Significant | `5` Minor
- **Likelihood**: `1` Very High | `2` High | `3` Medium | `4` Low | `5` Very Low
- **Risk level**: `unacceptable` | `high` | `medium` | `low`
- **Status**: `open` | `mitigated` | `accepted` | `closed`

> ⚠️ DCB0129/0160 inverts the usual Orange Book convention. The numbers above carry the opposite meaning from the project risk register.

---

## Deployment Hazards

*Rendered from the structured YAML at the top of this file. Keep in sync.*

| ID | Description | Sev | Like | Risk | Controls | Residual Risk | Status |
|---|---|---|---|---|---|---|---|
| D-HAZ-001 | Inadequate clinician training | 3 | 2 | HIGH | DC001, DC002 | MEDIUM | Open |
| D-HAZ-002 | Workflow integration gap | 2 | 3 | HIGH | DC003, DC004 | MEDIUM | Open |
| D-HAZ-003 | Integration failure with another local system | 2 | 3 | HIGH | DC005, DC006 | MEDIUM | Open |
| D-HAZ-004 | Business-continuity failure | 2 | 3 | HIGH | DC007, DC008 | MEDIUM | Open |
| D-HAZ-005 | Parallel-running confusion | 2 | 3 | HIGH | DC009 | MEDIUM | Open |
| D-HAZ-006 | Data migration error | 2 | 3 | HIGH | DC010 | LOW | Open |
| D-HAZ-007 | Local configuration error | 2 | 3 | HIGH | DC011, DC012 | LOW | Open |
| D-HAZ-008 | Local terminology / coding mismatch | 2 | 3 | HIGH | DC013 | LOW | Open |
| D-HAZ-009 | RBAC misalignment | 3 | 3 | MEDIUM | DC014 | LOW | Open |
| D-HAZ-010 | Failure to capture / act on local incidents | 3 | 3 | MEDIUM | DC015, DC016 | LOW | Open |

## Controls

| ID | Description |
|---|---|
| DC001 | Training plan + mandatory completion gate + competence assessment |
| DC002 | Super-user model embedded with refresh training on releases |
| DC003 | Workflow sign-off + explicit handover-of-care responsibility |
| DC004 | Daily safety huddle during pilot + first 30 days |
| DC005 | Interface monitoring + on-call + clinical-priority fallback |
| DC006 | Message replay + reconciliation reports |
| DC007 | Manual fallback workflow + printed reference cards, tested |
| DC008 | BC drill before go-live + on cadence, reviewed by CSO |
| DC009 | Source-of-truth declared per data class + UI signalling + minimal parallel window |
| DC010 | Migration validation: sample review + reconciliation + rollback |
| DC011 | Configuration sign-off by clinical lead + CSO; peer review |
| DC012 | Reference data sourced from authoritative upstream with freshness monitoring |
| DC013 | SNOMED / coding subset verified against product expectation |
| DC014 | Local role-to-product-role mapping reviewed by IG + CSO, quarterly review |
| DC015 | Local incident reporting route + product Datix category + routine review |
| DC016 | Escalation path to manufacturer + vigilance trigger if medical device |

---

## Important

The ten hazards above are a **starter set** drawn from common patterns in NHS health IT deployments. They are not a substitute for deployment-specific hazard identification by the deploying organisation's CSO and clinical SMEs. Many real deployments add 10–30 site-specific hazards (e.g. specific clinical service edge cases, specific local integrations, specific patient-population considerations).

---

**Generated by**: ArcKit `/arckit:uk-nhs-dcb0160` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
**Spec lineage**: [Marcus Baw SAFETY.md v2.0.0-draft](https://github.com/pacharanero/SAFETY.md)
