# Canada Security of Information Act Handling Plan

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit.ca-soia`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Classification line MUST be: -->
<!-- | Classification | UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET | -->
<!-- This artefact will frequently itself warrant a SECRET or higher classification. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit.ca-soia` | [PENDING] | [PENDING] |

## Executive Summary

[Two to three paragraphs describing the system, the SOI scope (count of assets meeting the *Security of Information Act* s.8 definition), the highest classification handled, the compartment count, the dominant transmission channels, the breach-response posture, and the personnel-reliability envelope. Note any open items — pending CSIS or RCMP MOUs, unresolved compartment indoctrination backlogs, or unsettled CSIS Act amendments under Bill C-26 / C-70.]

## SOI Inventory

> Every dataset, document, or artefact meeting the *Security of Information Act* s.8 definition of Special Operational Information. SOI is a statutory category — material qualifies by meeting s.8, not by departmental designation.

| Asset | SOIA s.8 Category | Originator | Stewardship |
|-------|-------------------|------------|-------------|
| [Asset 1 — e.g. raw intelligence reporting] | [s.8 category — e.g. information about intelligence-gathering targets / methods / sources / identities] | [originator — e.g. CSIS, CSE, foreign liaison partner, departmental analyst] | [steward role — e.g. departmental security officer, programme lead] |
| [Asset 2 — e.g. source-protective material] | [s.8 category] | [originator] | [steward] |
| [Asset 3 — e.g. foreign-government-shared product] | [s.8 category — flag Third-Party Rule] | [originator — name the foreign service] | [steward] |
| [Asset 4 — e.g. methods and techniques documentation] | [s.8 category] | [originator] | [steward] |
| [Asset 5 — e.g. identities subject to s.8 protection] | [s.8 category] | [originator] | [steward] |

**SOI scoping rationale**: [one paragraph anchoring each asset class to the s.8 definition — explicitly distinguish SOI from material that is merely classified at SECRET / TOP SECRET but does not meet s.8.]

## Marking Matrix

> Per asset, the classification level, applicable caveats, and any compartments. Foreign-shared product carries originator caveats — the Third-Party Rule applies and redistribution requires originator consent.

| Asset | Classification | Caveats | Compartments | Releasability |
|-------|----------------|---------|--------------|----------------|
| [Asset 1] | [UNCLASSIFIED / Protected A–C / CONFIDENTIAL / SECRET / TOP SECRET] | [CEO / NOFORN / FVEY / specific releasability tags — list all that apply] | [compartment 1, compartment 2 — or N/A] | [Releasable to: list of countries / partners / N/A] |
| [Asset 2] | [classification] | [caveats] | [compartments] | [releasability] |
| [Asset 3 — foreign-shared] | [classification] | [originator caveat — Third-Party Rule applies] | [compartments] | [originator-controlled — redistribution requires consent] |
| [Asset 4] | [classification] | [caveats] | [compartments] | [releasability] |
| [Asset 5] | [classification] | [caveats] | [compartments] | [releasability] |

**Caveat legend**: CEO = Canadian Eyes Only; NOFORN = No Foreign Nationals; FVEY = Five Eyes (releasable to AUS / CAN / GBR / NZL / USA); originator caveats override departmental defaults.

## Handling Rules

> Sub-tables for at-rest, in-transit, and in-use rules per classification level. Encryption must be CMVP / FIPS 140-3-validated per the corresponding ITSG-33 SoA.

### At Rest

| Classification | Storage Approval | Encryption Standard | Access Logging | Physical Storage Requirement |
|----------------|------------------|----------------------|----------------|--------------------------------|
| Protected B | [TBS-approved storage system] | [AES-256 via active CMVP module] | [logged + monthly review] | [secure facility, locked cabinet outside hours] |
| Protected C / CONFIDENTIAL | [approved system + departmental security officer sign-off] | [active CMVP module + key custody under two-person rule for keys above SECRET] | [logged + weekly review] | [Zone 3 facility per RCMP G1-026] |
| SECRET | [SECRET-approved enclave only — XNet / departmental SECRET storage] | [SECRET-approved CMVP module + segregated key management] | [logged + weekly review + flagged anomalies] | [Zone 4 facility, alarmed container, signed-out access] |
| TOP SECRET | [TOP SECRET-approved system only — Mandrake or equivalent SCIF storage] | [TOP SECRET-approved CMVP module + dedicated key infrastructure] | [logged + daily review + indoctrinated reviewer] | [SCIF — RCMP G1-026 Zone 5 equivalent or higher] |

### In Transit

| Classification | Allowed Channels | Encryption | Prohibitions |
|----------------|-------------------|------------|----------------|
| Protected B | [departmental network + approved cloud per residency policy] | [TLS via active CMVP module] | [no public Wi-Fi, no consumer messaging] |
| Protected C / CONFIDENTIAL | [departmental network + designated dark fibre + approved courier] | [SECRET-grade in transit even at CONFIDENTIAL] | [no internet egress without TBS-approved gateway] |
| SECRET | [XNet / IRRINET / designated dark fibre / approved courier in two-envelope handling] | [SECRET-approved CMVP module] | [no allied-shared infrastructure for CEO / NOFORN material] |
| TOP SECRET | [Mandrake / SCIF-to-SCIF dedicated channel / cleared-courier double-cover] | [TOP SECRET-approved CMVP module + dedicated key infrastructure] | [no transmission outside cleared facilities; no shared-tenant cloud regardless of encryption] |

### In Use

| Classification | Screen Viewing | Printing | Removable Media | Clean-Desk |
|----------------|------------------|------------|-------------------|---------------|
| Protected B | [privacy filter + screen lock on absence] | [approved network printer + collected immediately] | [approved encrypted USB only — logged] | [enforced overnight; sweep at shift end] |
| Protected C / CONFIDENTIAL | [privacy filter + visitor screening + screen lock under 2 minutes] | [SECRET-grade printer + signed log] | [approved encrypted USB + two-person sign-out] | [enforced; departmental security officer spot-check weekly] |
| SECRET | [SECRET-approved workstation in cleared area only] | [SECRET printer in cleared area + collected immediately + log] | [no USB; courier-only between SECRET enclaves] | [enforced; alarm on uncovered material] |
| TOP SECRET | [SCIF-only viewing on TOP SECRET-approved terminal] | [SCIF-only print + indoctrinated witness for collection] | [no removable media; transfer is SCIF-to-SCIF only] | [SCIF clean-desk drill on every exit] |

## Transmission Channel Matrix

> True matrix of allowed channels per categorisation. Cell value = `Allowed` / `Not Allowed` / `Allowed with named caveat handling`.

| Channel | UNCLASSIFIED | Protected B | CONFIDENTIAL | SECRET | TOP SECRET |
|---------|----------------|----------------|----------------|----------------|----------------|
| Departmental email (TLS) | Allowed | Allowed | Not Allowed | Not Allowed | Not Allowed |
| Public internet (TLS to TBS-approved gateway) | Allowed | Allowed (per cloud residency) | Not Allowed | Not Allowed | Not Allowed |
| Departmental SECRET network (XNet / IRRINET) | Allowed | Allowed | Allowed | Allowed (CEO and NOFORN restrictions apply at the trunk) | Not Allowed |
| Designated dark fibre between cleared facilities | Allowed | Allowed | Allowed | Allowed | Not Allowed |
| Approved courier in two-envelope handling | Allowed | Allowed | Allowed | Allowed | Allowed (with cleared-courier double-cover) |
| Mandrake / dedicated TOP SECRET channel | Allowed | Allowed | Allowed | Allowed | Allowed |
| SCIF-to-SCIF physical transfer | Allowed | Allowed | Allowed | Allowed | Allowed |
| Allied-shared infrastructure (FVEY trunks) | Allowed | Allowed | Allowed | Allowed (NOT for CEO or NOFORN) | Not Allowed |
| Consumer messaging (SMS / WhatsApp / Signal) | Not Allowed | Not Allowed | Not Allowed | Not Allowed | Not Allowed |

**Caveat footnotes**:

- CEO and NOFORN material is **not transmissible** over allied-shared infrastructure regardless of encryption level. Routing must keep the material on Canada-only trunks end to end.
- Foreign-shared product follows the originator's transmission caveats. Where the originator's caveat is more restrictive than this matrix, the originator's caveat governs.
- Unencrypted-link transmission is prohibited at all classifications above UNCLASSIFIED.

## Compartment / Need-to-Know Register

> Every compartment, its owner, the access-list size, the audit cadence, and the indoctrination requirement. Compartmentation defaults to deny — every access decision is an explicit need-to-know determination.

| Compartment | Owner | Access-List Size | Audit Cadence | Indoctrination Requirement |
|-------------|-------|--------------------|----------------|------------------------------|
| [Compartment 1] | [role / individual] | [count + last review date] | [audit-log rotation cadence — e.g. weekly review by departmental security officer] | [training module + read-and-sign + briefing] |
| [Compartment 2] | [owner] | [size + last review date] | [cadence] | [indoctrination] |
| [Compartment 3] | [owner] | [size + last review date] | [cadence] | [indoctrination] |
| [Compartment 4] | [owner] | [size + last review date] | [cadence] | [indoctrination] |

**Need-to-know review**: [paragraph describing the cadence at which the access list is rebaselined — typical practice is a quarterly need-to-know review with the access-list owner attesting in writing that every name on the list has a current operational need.]

## Destruction and Sanitisation

> Approved destruction routes per asset class, anchored on CSE *ITSP.40.006 IT Media Sanitization*. Modules off the CMVP active list are findings.

| Asset Class | Method | Approval | Audit Record |
|-------------|--------|----------|----------------|
| Paper Protected B | [cross-cut shredder to CSE-approved standard] | [departmental security officer sign-off] | [destruction log retained 7 years] |
| Paper SECRET / TOP SECRET | [CSE-approved disintegrator + witnessed destruction] | [departmental security officer + indoctrinated witness] | [witnessed destruction certificate retained per departmental retention schedule] |
| Magnetic media (HDD) | [degauss to CSE-approved level + physical destruction per ITSP.40.006] | [ITSEC officer sign-off] | [serial-numbered destruction certificate retained] |
| Solid-state media (SSD / NVMe) | [crypto-erase + physical destruction per ITSP.40.006 — degauss is insufficient] | [ITSEC officer sign-off] | [serial-numbered destruction certificate retained] |
| Optical media | [shred or incineration per ITSP.40.006] | [departmental security officer sign-off] | [destruction log] |
| Cryptographic key material | [zeroise per FIPS 140-3 + key-custody two-person witness] | [crypto custodian + witness] | [key-zeroisation log retained for the lifetime of any data the key protected] |

## CSIS Act §16 / §19 Coordination

| Provision | System Role | Coordination Contact | Artefact |
|-----------|-------------|------------------------|------------|
| CSIS Act §12 (security intelligence collection) | [system role — e.g. consumer of CSIS reporting / N/A] | [departmental CSIS liaison] | [reporting log + handling rules] |
| CSIS Act §16 (foreign intelligence — collection at the request of the Minister of Foreign Affairs or the Minister of National Defence, authorised by the Federal Court) | [system role — e.g. § 16 collection support / consumer of § 16 product / N/A] | [Minister's office contact + CSIS liaison] | [Federal Court authorisation reference + handling rules] |
| CSIS Act §19 (disclosure framework — purposes for which CSIS may disclose information) | [system role — e.g. § 19 disclosure recipient / disclosure-onward conduit / N/A] | [departmental CSIS liaison] | [§ 19 disclosure log + onward-handling rules] |

**Handling notes**: Material collected under § 16 is foreign-intelligence product and follows the Minister's caveats; § 19 disclosures from CSIS to a recipient department carry the originator's onward-handling rules and the Third-Party Rule applies.

## RCMP National Security Programme Liaison

| Trigger | Team | Contact | Artefact |
|---------|------|---------|----------|
| [Suspected criminal disclosure obligations under *Stinchcombe* / *McNeil*] | [INSET — Integrated National Security Enforcement Team] | [INSET liaison contact] | [evidence-handling protocol + disclosure log] |
| [Sensitive criminal investigation touching SOI] | [SI&IS — Sensitive Investigations and Intelligence Services] | [SI&IS liaison contact] | [coordination MOU + handling rules] |
| [Threat to critical infrastructure or persons protected under federal authority] | [Federal Policing — National Security] | [Federal Policing contact] | [coordination protocol + escalation tree] |

## Breach Response Runbook

> Suspected unauthorised disclosure of SOI or other classified material. Initial containment must occur within minutes; forensic completeness follows.

1. **Within minutes — Containment.** Revoke access for the implicated account, isolate the affected system from the network, suspend any session in flight, and quarantine any media that may have been used in the incident.
2. **Within the first hour — Notification.** Departmental security officer notifies the Chief Security Officer, the ITSEC officer, and the CSE incident response team (Cyber Centre). Where SOI is implicated, notify the CSIS liaison; where criminal disclosure is plausible, notify the RCMP NSP liaison.
3. **Within 24 hours — Initial assessment.** Confirm the SOI / classified scope of the suspected disclosure, the recipient (known or unknown), and the route. Open a formal incident file under the departmental security incident management process.
4. **Within 72 hours — Privy Council Office notification (where applicable).** Where Cabinet-level confidence is implicated or the breach has whole-of-government impact, notify the PCO Security and Intelligence Secretariat.
5. **Within 30 days — Investigation report.** Complete the investigation report covering the scope, the route, the affected SOI, the disclosure recipient, the mitigating actions taken, and the recommended residual-risk treatment. File with the authorising official and update the operational risk register.
6. **At closure — Lessons learned and control update.** Update the SoA, the compartment register, and this handling plan with the control changes applied; brief the access list of the affected compartment.

### Escalation Table

| Severity | Trigger | Within | Escalate To |
|----------|---------|--------|--------------|
| S1 — Catastrophic | [TOP SECRET / SOI confirmed disclosed to a hostile recipient] | 1 hour | Chief Security Officer → Deputy Minister → PCO S&I Secretariat |
| S2 — Severe | [SECRET / SOI confirmed disclosed to an unauthorised recipient] | 4 hours | Chief Security Officer → Deputy Minister |
| S3 — Significant | [Suspected unauthorised access to a compartment without confirmed exfiltration] | 24 hours | Departmental security officer → Chief Security Officer |
| S4 — Localised | [Mishandling event without confirmed disclosure] | 72 hours | Departmental security officer |

## Personnel Reliability

| Role | Clearance | Update Cycle | Briefing | Compartment Indoctrination |
|------|-----------|---------------|------------|------------------------------|
| [System Owner] | [TOP SECRET / SECRET / Reliability — per role] | [5 years for TOP SECRET; 10 for SECRET; 5 for Reliability per TBS *Standard on Security Screening*] | [SOIA briefing on appointment + annual refresh] | [compartments held — list] |
| [Security Authority] | [TOP SECRET] | [5 years] | [SOIA + breach-response briefing on appointment + annual refresh] | [compartments held] |
| [Departmental Security Officer] | [TOP SECRET] | [5 years] | [SOIA + CSIS Act § 16 / § 19 briefing + annual refresh] | [compartments held] |
| [Crypto Custodian] | [SECRET or TOP SECRET per key inventory] | [per clearance level] | [crypto-custody briefing + annual refresh] | [compartments held] |
| [Operator / Analyst] | [per task — Reliability through TOP SECRET SCI] | [per clearance level] | [SOIA briefing on appointment + role-specific refresh] | [compartments held] |
| [Cleared Courier] | [SECRET or TOP SECRET per route] | [per clearance level] | [courier protocol briefing + annual refresh] | [N/A — cleared route only] |

**Indoctrination protocol**: Read-and-sign for the compartment briefing; departmental security officer countersigns and the access-list owner adds the name to the compartment register. De-indoctrination at role exit is mandatory and the access-list owner attests in writing.

## Open Items

| ID | Description | Owner | Due Date | Status |
|----|-------------|-------|----------|--------|
| OI-1 | [CSIS Act amendments under Bill C-26 / C-70 still settling — verify against the consolidated Justice Laws text at publication] | [Security Authority] | [YYYY-MM-DD] | [Open / In Progress] |
| OI-2 | [Pending MOU with CSIS or RCMP — name the compartment / route] | [System Owner] | [YYYY-MM-DD] | [Open / In Progress] |
| OI-3 | [Pending compartment indoctrination backlog — name the compartment and the count] | [Departmental Security Officer] | [YYYY-MM-DD] | [Open / In Progress] |
| OI-4 | [Pending CMVP module re-validation for crypto in scope of this plan — list modules drifting toward Historical] | [Crypto Custodian] | [YYYY-MM-DD] | [Open / In Progress] |
| OI-5 | **The artefact itself is likely classified.** Confirm storage, marking, and handling of this SOIA Handling Plan match the rules it describes. | [Departmental Security Officer] | [YYYY-MM-DD] | [Open] |

## External References

### Document Register

| Doc ID | Title | URL | Verified date |
|--------|-------|-----|---------------|
| CA-SOIA | Security of Information Act (R.S.C., 1985, c. O-5) | <https://laws-lois.justice.gc.ca/eng/acts/O-5/> | [YYYY-MM-DD] |
| CA-CSIS-ACT | Canadian Security Intelligence Service Act (R.S.C., 1985, c. C-23) | <https://laws-lois.justice.gc.ca/eng/acts/C-23/> | [YYYY-MM-DD] |
| CA-TBS-SCREEN | TBS Standard on Security Screening | <https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=28115> | [YYYY-MM-DD] |
| CA-ITSP-40-006 | CSE ITSP.40.006 — IT Media Sanitization | <https://cyber.gc.ca/en/guidance/it-media-sanitization-itsp40006> | [YYYY-MM-DD] |
| CA-ITSP-30-031 | CSE ITSP.30.031 v3 — User Authentication Guidance for Information Technology Systems | <https://cyber.gc.ca/en/guidance/user-authentication-guidance-information-technology-systems-itsp30031-v3> | [YYYY-MM-DD] |
| CA-G1-026 | RCMP G1-026 — Guide to the Application of Physical Security Zones | <https://www.rcmp-grc.gc.ca/physec-secmat/pubs/g1-026-eng.htm> | [YYYY-MM-DD] |

### Citations

| Citation | Doc ID | Section | Used in |
|----------|--------|---------|---------|
| [SOIA-1] | CA-SOIA | s.8 — Definition of Special Operational Information | SOI Inventory |
| [SOIA-2] | CA-SOIA | Offences — unauthorised communication of SOI | Breach Response Runbook |
| [CSIS-16] | CA-CSIS-ACT | s.16 — Foreign intelligence collection at Ministerial request | CSIS Act §16 / §19 Coordination |
| [CSIS-19] | CA-CSIS-ACT | s.19 — Disclosure framework | CSIS Act §16 / §19 Coordination |
| [TBS-SCREEN-1] | CA-TBS-SCREEN | Clearance levels and update cycles | Personnel Reliability |
| [ITSP40006-1] | CA-ITSP-40-006 | Media sanitisation lifecycle and methods per media class | Destruction and Sanitisation |
| [ITSP30031-1] | CA-ITSP-30-031 | User authentication assurance levels | Handling Rules — In Use |
| [G1-026-1] | CA-G1-026 | Physical security zones and storage requirements | Handling Rules — At Rest |

### Unreferenced Documents

[List any documents read during generation but not cited, or "None".]
