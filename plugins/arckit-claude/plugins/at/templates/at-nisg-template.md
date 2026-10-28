# Austrian NISG 2026 (NIS2 Transposition) Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit-at:at-nisg`
>
> ⚠️ **Community-contributed** — review before relying on output. The **NISG 2026 (BGBl. I Nr. 94/2025)** is a standalone act that replaced the NISG 2018; it has been in force since **1 October 2026 (§51)**, with registration due within three months (§29 Abs. 3): by 1 January 2027, moved to 4 January 2027 by §33 Abs. 2 AVG, according to the Bundesamt für Cybersicherheit's registration page (its FAQ says 31 December 2026). Paragraph (§) references in this template have been checked against the enacted text (BGBl. I Nr. 94/2025). The first implementing ordinance, the **NISV 2026 (BGBl. II Nr. 290/2026)**, has applied since the end of 1 October 2026; further ordinances (for example on independent bodies under §7 Abs. 6) may follow, so items marked `[NEEDS VERIFICATION]` — chiefly ordinance-dependent detail — must still be confirmed before external reliance.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit-at:at-nisg` | [PENDING] | [PENDING] |

## Executive Summary

| Pillar | Status | Critical Gaps |
|--------|--------|--------------|
| Austrian Scoping | [Essential / Important / Out of scope] | [Count] |
| Governance | [Compliant / Partial / Gap] | [Count] |
| Risk Management | [Compliant / Partial / Gap] | [Count] |
| Incident Reporting (CSIRT) | [Compliant / Partial / Gap] | [Count] |
| Supply Chain | [Compliant / Partial / Gap] | [Count] |
| Business Continuity | [Compliant / Partial / Gap] | [Count] |

---

## 1. Austrian Scope and Designation

### 1.1 Sector Classification

> The **Cybersicherheitsbehörde** (§3a) is the competent authority for every sector; no sectoral regulator supervises NIS compliance. The last column gives the responsible CSIRT (§8) and any overlap the Act provides for (§20 cooperation, §24 Abs. 7 DORA, §27 equivalent sector acts).

| NIS2 Annex | Sector / Sub-sector | Applicable | Responsible CSIRT / overlap |
|------------|---------------------|-----------|------------------------------------------------|
| I | Energy (Electricity) | ☐ | National CSIRT |
| I | Energy (Gas / Oil / Hydrogen) | ☐ | National CSIRT |
| I | Transport (Air / Rail / Water / Road) | ☐ | National CSIRT; air: cooperation with the aviation-security authorities (§20 Abs. 2 Z 2) |
| I | Banking / Financial Market | ☐ | DORA takes precedence (§24 Abs. 7); registration still required |
| I | Health | ☐ | HealthCERT |
| I | Drinking Water / Wastewater | ☐ | National CSIRT |
| I | Digital Infrastructure / ICT | ☐ | National CSIRT; telecoms regulator (§194 TKG 2021) and KommAustria informed before supervisory measures (§20 Abs. 9); trust services: §12 SVG supervisory body (§20 Abs. 8) |
| I | Public Administration | ☐ | GovCERT (§8 Abs. 4); federal bodies Essential, Land bodies Important (§24 Abs. 1–5) |
| I | Space | ☐ | National CSIRT |
| II | Postal / Courier / Waste / Chemicals / Food | ☐ | National CSIRT |
| II | Manufacturing / Digital providers / Research | ☐ | National CSIRT |

### 1.2 Designation

| Item | Value |
|------|-------|
| Entity Designation | [Essential / Important / Out of scope] |
| Previous NISG 2018 status | [Betreiber wesentlicher Dienste / None] — BwD Bescheide became void on 1 Oct 2026 (§51 Abs. 5) |
| Main establishment | [AT / other EU MS] |
| Cross-border operations | [List MS] |
| Size threshold result | [≥250 emp / 50–250 / <50 / micro] |

---

## 2. Governance (NIS2 Art. 20 → §31)

| Obligation | Status | Evidence / Gap |
|-----------|--------|----------------|
| Geschäftsleitung approves security measures (§31) | [Yes / Partial / No] | |
| Management body responsibility acknowledged (NIS2 Art. 20 → §31) | [Yes / Partial / No] | |
| Management body cyber training completed (§31) | [Yes / Partial / No] | |
| Responsibility mapped (CISO / Sicherheitsbeauftragter) | [Yes / Partial / No] | |

---

## 3. Risk Management Measures (NIS2 Art. 21 → §32)

| # | Measure | Status | Gap | Proportionality Note |
|---|---------|--------|-----|----------------------|
| 1 | Risk analysis policy | | | |
| 2 | Incident handling | | | |
| 3 | Business continuity / BCM | | | |
| 4 | Supply chain security | | | |
| 5 | Secure acquisition / development / maintenance | | | |
| 6 | Policies to assess effectiveness | | | |
| 7 | Cyber hygiene + training | | | |
| 8 | Cryptography policy | | | |
| 9 | HR security + access control | | | |
| 10 | MFA + secure communications | | | |

| NISV 2026 requirement | Status | Evidence / Gap |
|-----------------------|--------|----------------|
| Implementing Regulation (EU) 2024/2690 Art. 2 + Annex requirements applied (§2 NISV 2026 extends them to all Anlage 1/2 entity types) | | |
| Risk analysis covers technological, human, ICT-supply-chain and site-related risks (§3 NISV 2026) | | |
| Compensating measures documented and reviewed at least annually where a requirement cannot be met (§4 NISV 2026) | [Yes / No / N/A] | |

A-SIT guidance alignment (sector-agnostic security guidance, commonly referenced by BMI/sectoral authorities): [Summary]

---

## 4. Incident Reporting — Austrian Channel (§34)

| Item | Status | Evidence / Gap |
|------|--------|----------------|
| Reporting to the responsible sector-specific CSIRT — or the national CSIRT if none — established (§34 Abs. 1; CSIRTs per §8) via NIS2-Services on the Unternehmensserviceportal (USP; public administration through the Portalverbund) — GovCERT (public administration), HealthCERT (health), national CSIRT CERT.at (all other sectors); the CSIRT forwards to the Cybersicherheitsbehörde without delay (§34 Abs. 1) | | |
| Registration with the Cybersicherheitsbehörde (§3a) completed (§29 Abs. 3 — by 4 January 2027 at the latest; register by 31 December 2026 to meet the Bundesamt's FAQ date too) | | |
| Incident classification mapped to §35 NISG 2026 and §§5–7 NISV 2026 significance criteria | | |
| 24-hour early warning capability (§34) | | |
| 72-hour notification capability (§34) | | |
| Intermediate (on request) / 1-month final report process (§34) | | |
| Cross-reporting to DSB for personal data breach (Art. 33 GDPR) | | |
| Reporting language / form readiness (German, NIS2-Services; the Bundesamt's PDF report forms as fallback when the portal is unavailable) | | |
| Tabletop exercise in last 12 months | | |

---

## 5. Supply Chain Security

| Control | Status | Evidence / Gap |
|---------|--------|----------------|
| Supplier inventory maintained | | |
| Third-party risk assessment | | |
| Contractual security clauses | | |
| Software supply chain (SBOM / patching) | | |
| ENISA supply chain framework alignment | | |
| Sectoral secondary rules (E-Control Verordnungen / FMA Rundschreiben) | | |
| High-risk vendor treatment (5G / EU toolbox) | | |

---

## 6. Business Continuity and Resilience

| Item | Status | Evidence / Gap |
|------|--------|----------------|
| BCP documented and current | | |
| Backup + restore tested in last 12 months | | |
| Crisis management procedure | | |
| RTO defined | [Value] | |
| RPO defined | [Value] | |
| Alternate site / DR capability | | |

---

## 7. Supervision, Inspections, and Penalties

| Item | Status | Notes |
|------|--------|-------|
| Supervisory posture | [Ex ante (Essential) / Ex post (Important)] | |
| Supervision & enforcement | Cybersicherheitsbehörde — Aufsichtsmaßnahmen (§38), Durchsetzungsmaßnahmen (§39) | |
| Penalty — core duties (§45 Abs. 1) | Essential: up to €10M / 2% turnover (§45 Abs. 2); Important: up to €7M / 1.4% (§45 Abs. 3) — NIS2 Art. 34 minimum-maximum | |
| Penalty — procedural breaches (§45 Abs. 4) | up to €50,000 (up to €100,000 repeat) | |
| Public-administration body? (§46 applies "abweichend von § 45") | [Yes / No] | If Yes, the §45 ceilings above do **not** apply |
| Public-administration consequence (§46 Abs. 2, Verfassungsbestimmung) | Bescheid establishing non-compliance + remediation deadline; **publication** if unremedied once final. No fine. | |
| Ne bis in idem with GDPR (§44 Abs. 7) | No NISG fine where the DSB already fined the same conduct under Art. 58(2)(i) GDPR | |
| Fining authority | Bezirksverwaltungsbehörde (§44 Abs. 1); Cybersicherheitsbehörde notifies suspected breaches (§46 Abs. 1 for public-administration bodies) | |
| Appeal pathway | BVwG | |
| CISO / Sicherheitsbeauftragter designated | [Yes / No] | |

### 7.1 Unabhängige Stellen und unabhängige Prüfer (§7)

| Item | Status | Notes |
|------|--------|-------|
| Selbstdeklaration of implemented measures submitted (§33 Abs. 1 — within 12 months of the registration duty, ~by 30 Sep 2027) | [Yes / No / Planned] | |
| Independent body / auditor (§7) engaged for the Wirksamkeitsnachweis (§33 Abs. 2 — first request earliest 2 years after entry into force, ~Oct 2028) | [Yes / No / Planned] | |
| Essential entity: 2-month response capability for the operative/organisational Nachweis (§33 Abs. 2 second sentence — general window is 2 years, Essential entities only 2 months from the Aufforderung) | [Yes / No / Planned] | |
| Eligibility / accreditation confirmed | [Yes / No] | Until twelve months after the §7 Abs. 6 ordinance enters into force, qualified bodies under §18 Abs. 1 NISG 2018 count as independent bodies (§51 Abs. 7) |
| Scope of assessment | [Full / Partial] | |
| Last assessment date | [YYYY-MM-DD / N/A] | |
| Findings remediated | [Yes / Partial / No] | |

---

## 8. KSÖ and National Cyber Coordination

| Item | Status | Notes |
|------|--------|-------|
| KSÖ membership / participation | [Member / Observer / None] | Voluntary |
| Cybersicherheitsbehörde contact — competent authority (§3a), zentrale Anlaufstelle/EU SPOC (§5) | [Yes / No] | |
| CSIRT operative contact (§8) — CERT.at / GovCERT / HealthCERT | [Yes / No] | |
| Information-sharing MoUs | [List] | |

### 8.1 National coordination structures (§§12–14)

| Item | Status | Notes |
|------|--------|-------|
| Awareness of the Cyber Sicherheit Steuerungsgruppe (CSS, §12) role | [Yes / No] | |
| Awareness of IKDOK (§13) / OpKoord (§14) operative coordination | [Yes / No] | |
| Communication channel to national coordination established | [Established / Gap] | |
| Internal escalation to crisis threshold defined | [Yes / No] | |
| Cross-sector coordination readiness | [Yes / Partial / No] | |

---

## 8b. Austrian NISG 2026 Additions Beyond NIS2 Baseline

> § references map to the enacted NISG 2026 (BGBl. I Nr. 94/2025). Sectors are set out in **Anlagen 1/2**; scope of wesentliche/wichtige Einrichtungen in **§24**. Confirm the exact wording against the official text before external reliance.

| Austrian Addition | NISG 2026 Reference | NIS2 Equivalent | Compliance Status |
|-------------------|---------------------|-----------------|-------------------|
| Bundesamt für Cybersicherheit (single monocratic authority under BMI) | §3a (Aufgaben §4) | Art. 8 competent authority | |
| Zentrale Anlaufstelle / SPOC + Nationales Koordinierungszentrum | §5, §6 | Art. 8(3) SPOC | |
| Unabhängige Stellen und unabhängige Prüfer (accredited assessment bodies) | §7 | No direct equivalent (Art. 32(2) allows, not mandates) | |
| Computer-Notfallteams / CSIRTs — CERT.at (national), GovCERT (public administration), HealthCERT (health) | §§8–11 | Art. 10–11 CSIRTs | |
| National coordination bodies — CSS, IKDOK, OpKoord | §§12–14 | Art. 8/9 (less structured) | |
| Public administration named in the Act, no opt-in: federal bodies Essential, Land bodies (Ämter der Landesregierungen, Bezirkshauptmannschaften, Land bodies with legal personality) Important, Gemeinden outside the sector | §24 Abs. 1 Z 1 lit. d, Abs. 2 Z 2, Abs. 3–6; §1 (Verfassungsbestimmung) | Art. 2(2)(f): central government, and regional level after a risk-based assessment; the Art. 2(5)(a) local-level option is not used | |
| Designation beyond size thresholds on criticality (Größenunabhängige Einstufung by Bescheid) | §26 (grounds in §26 Abs. 3) | Art. 2(2)(b–e) similar but EU-level | |

---

## 9. Gap Analysis and Roadmap

| Domain | Current Maturity | Target | Priority | Owner | Target Date |
|--------|-----------------|--------|----------|-------|-------------|
| Risk analysis | L1–L5 | L1–L5 | 🔴/🟠/🟡 | | |
| Incident handling | L1–L5 | L1–L5 | | | |
| BCM | L1–L5 | L1–L5 | | | |
| Supply chain | L1–L5 | L1–L5 | | | |
| Governance | L1–L5 | L1–L5 | | | |

```mermaid
gantt
title NISG Remediation Roadmap
dateFormat YYYY-MM-DD
section Immediate
Close high-priority gaps :active, a1, 2026-10-01, 90d
section Short-term
Formalise reporting channel :a2, after a1, 90d
section Medium-term
Maturity uplift to target :a3, after a2, 180d
```

---

## External References

### Document Register

| DOC_ID | Source | Description |
|--------|--------|-------------|
| | | |

### Citations

| Citation | Used In | Source |
|----------|---------|--------|
| | | |

---

**Generated by**: ArcKit `/arckit-at:at-nisg` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
