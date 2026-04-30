# EBIOS Risk Manager — Risk Analysis Study

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit.fr-ebios`
>
> ⚠️ **Community-contributed** — not yet validated against current ANSSI/CNIL/EU regulatory text. Verify all citations before relying on output.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit.fr-ebios` | [PENDING] | [PENDING] |

## Study Summary

| Workshop | Status | Key Outputs |
|---------|--------|------------|
| Workshop 1 — Study Framing | [Complete / In progress] | Scope, values, feared events |
| Workshop 2 — Risk Sources | [Complete / In progress] | Risk source profiles, target pairs |
| Workshop 3 — Strategic Scenarios | [Complete / In progress] | Attack paths, ecosystem threats |
| Workshop 4 — Operational Scenarios | [Complete / In progress] | Technical attack scenarios |
| Workshop 5 — Risk Treatment | [Complete / In progress] | Security measures, residual risks |

| Overall Risk Level | [Acceptable / Acceptable under conditions / Not acceptable] |
|---|---|
| Residual Risks Accepted | [Pending / Accepted by Homologation Authority] |
| Homologation Recommendation | [Proceed / Proceed with conditions / Do not proceed] |

---

## Workshop 1 — Study Framing (Cadrage de l'étude)

### 1.1 Study Scope

| Element | Description |
|---------|------------|
| System studied | [Name and brief description] |
| Study boundary | [What is included / excluded] |
| Interacting systems | [Connected external systems] |
| Technical architecture summary | [Key components] |
| Deployment environment | [Cloud / On-premise / Hybrid] |

### 1.2 Essential Values (Valeurs métier)

Values are business assets whose protection is the primary objective of the study.

| ID | Value | Description | Owner |
|----|-------|-------------|-------|
| VM-01 | [Value name] | [Description] | [Owner] |
| VM-02 | [Value name] | [Description] | [Owner] |

### 1.3 Feared Events (Événements redoutés)

For each essential value, identify feared events with severity.

| ID | Feared Event | Affected Value | Severity | Justification |
|----|-------------|---------------|---------|--------------|
| ER-01 | [Event description] | VM-01 | 🔴 Critical / 🟠 Major / 🟡 Significant / 🟢 Negligible | [Justification] |

**Severity scale** (ANSSI EBIOS RM): 1 Negligible / 2 Significant / 3 Major / 4 Critical

### 1.4 Security Baseline

| Measure | Reference | Status |
|---------|-----------|--------|
| ANSSI IT hygiene (42 measures) | Guide ANSSI | ☐ |
| RGS v2.0 | ANSSI | ☐ |
| ISO 27001 / 27002 | ISO | ☐ |
| [Sector-specific measures] | [Reference] | ☐ |

---

## Workshop 2 — Risk Sources (Sources de risque)

### 2.1 Risk Source Profiles

A risk source is an entity (human, group, state, etc.) that can cause a feared event.

| ID | Risk Source | Type | Motivation | Capability | Pertinence |
|----|------------|------|-----------|-----------|-----------|
| SR-01 | [e.g. State-sponsored attacker] | [External / Internal] | [Geopolitical, financial, ideological] | [High / Medium / Low] | ☐ Retained / ☐ Excluded |
| SR-02 | [e.g. Organised cybercriminal] | [External] | [Financial] | [High] | ☐ Retained / ☐ Excluded |
| SR-03 | [e.g. Malicious insider] | [Internal] | [Personal, ideological] | [Medium] | ☐ Retained / ☐ Excluded |
| SR-04 | [e.g. Script kiddie / opportunist] | [External] | [Notoriety] | [Low] | ☐ Retained / ☐ Excluded |

### 2.2 Risk Source — Target Pairs

For each retained risk source, identify the most likely target within the system.

| Pair ID | Risk Source | Target | Pertinence |
|---------|------------|--------|-----------|
| CO-01 | SR-01 | [Target in ecosystem or system] | ☐ Retained |
| CO-02 | SR-02 | [Target] | ☐ Retained |

---

## Workshop 3 — Strategic Scenarios (Scénarios stratégiques)

Strategic scenarios describe how a risk source reaches its target via the ecosystem (supply chain, third parties, trusted partners).

### 3.1 Ecosystem Map

| Stakeholder | Role | Trust Level | Dependency |
|------------|------|-------------|-----------|
| [Third-party provider] | [SaaS / Cloud / Integrator] | [High / Medium / Low] | [Critical / Important / Minor] |
| [Partner / interconnected system] | [Description] | [Trust level] | [Dependency] |

### 3.2 Strategic Scenarios

| ID | Scenario | Risk Source Pair | Attack Path | Gravity | Likelihood | Risk Level |
|----|---------|-----------------|------------|---------|-----------|-----------|
| SS-01 | [e.g. Supply chain compromise via cloud provider] | CO-01 | [Cloud provider → API → Core system] | 🔴 4 | 🟠 3 | 🔴 Critical |
| SS-02 | [e.g. Spear-phishing targeting administrator] | CO-02 | [External → Email → Privileged access] | 🟠 3 | 🔴 4 | 🔴 Critical |

**Risk level** = max(Gravity, Likelihood) or matrix per ANSSI guide.

### 3.3 Ecosystem Threats Summary

| Stakeholder | Identified Threat | Existing Security Measures | Residual Level |
|------------|------------------|--------------------------|---------------|
| [Provider] | [Threat] | [Measures] | [Level] |

---

## Workshop 4 — Operational Scenarios (Scénarios opérationnels)

Operational scenarios break down strategic scenarios into technical attack sequences.

### 4.1 Operational Scenarios

| ID | Scenario | Parent Strategic Scenario | Attack Sequence | Likelihood |
|----|---------|--------------------------|----------------|-----------|
| SO-01 | [Technical scenario description] | SS-01 | [1. Reconnaissance → 2. Initial access → 3. Lateral movement → 4. Impact] | 🟠 Probable |
| SO-02 | [Technical scenario] | SS-02 | [Attack sequence] | 🔴 Very probable |

**Likelihood scale**: 1 Unlikely / 2 Possible / 3 Probable / 4 Very probable

### 4.2 Attack Pattern Mapping (MITRE ATT&CK)

| Operational Scenario | MITRE Tactics | MITRE Techniques |
|--------------------|--------------|-----------------|
| SO-01 | [Initial Access, Execution] | [T1566 Phishing, T1059 Command Scripting] |
| SO-02 | [Credential Access, Lateral Movement] | [T1078, T1021] |

---

## Workshop 5 — Risk Treatment (Traitement du risque)

### 5.1 Risk Treatment Options

For each significant risk (strategic + operational scenarios):

| Risk | Treatment Option | Justification |
|------|-----------------|--------------|
| SS-01 / SO-01 | ☐ Reduce / ☐ Avoid / ☐ Transfer / ☐ Accept | [Rationale] |
| SS-02 / SO-02 | ☐ Reduce / ☐ Avoid / ☐ Transfer / ☐ Accept | [Rationale] |

### 5.2 Security Measures (Mesures de sécurité)

| ID | Security Measure | Addresses Scenario | Type | Owner | Priority | Status |
|----|----------------|------------------|------|-------|---------|--------|
| MS-01 | [e.g. Multi-factor authentication for all admin access] | SO-02 | Technical | [Role] | 🔴 High | ☐ |
| MS-02 | [e.g. Supply chain security clause in cloud contract] | SO-01 | Organisational | [Role] | 🔴 High | ☐ |
| MS-03 | [e.g. Network segmentation for critical systems] | SO-01 | Technical | [Role] | 🟠 Medium | ☐ |

### 5.3 Residual Risk Assessment

After proposed security measures, reassess remaining risks.

| Risk | Initial Level | Residual Level | Accepted? | Acceptance Authority |
|------|-------------|--------------|-----------|---------------------|
| SS-01 | 🔴 Critical | 🟠 Moderate | ☐ | [Autorité d'Homologation] |
| SS-02 | 🔴 Critical | 🟡 Low | ☐ | [Autorité d'Homologation] |

### 5.4 Risk Summary Dashboard

| Level | Count | Risks |
|-------|-------|-------|
| 🔴 Critical residual risks | [N] | [List risk IDs] |
| 🟠 Moderate residual risks | [N] | [List risk IDs] |
| 🟡 Low residual risks | [N] | [List risk IDs] |

### 5.5 Homologation Recommendation

Based on the risk treatment analysis:

- **Total security measures identified**: [N] (Technical: [N], Organisational: [N], Legal: [N])
- **Residual risks submitted for acceptance**: [N]
- **Critical residual risks**: [N]

**Recommendation to Autorité d'Homologation**:

> ☐ **Proceed with homologation** — All risks treated or accepted; residual risks are within acceptable tolerance.
>
> ☐ **Proceed with conditions** — Homologation can proceed if measures MS-[xxx] are implemented before go-live.
>
> ☐ **Do not proceed** — [N] critical residual risks remain unacceptable. Study must be repeated after additional measures.

---

**Generated by**: ArcKit `/arckit.fr-ebios` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
