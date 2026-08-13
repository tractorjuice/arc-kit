# Austrian Accessibility Assessment (BaFG / WZG)

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:at-barrierefreiheit`
>
> ⚠️ **Community-contributed** — not yet validated against current BaFG / WZG text. Verify all citations against RIS before relying on output. Paragraph references marked `[NEEDS VERIFICATION]` are drawn from secondary sources and require confirmation by an Austrian accessibility practitioner.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:at-barrierefreiheit` | [PENDING] | [PENDING] |

## Executive Summary

| # | Area | Status | Key Findings |
|---|------|--------|-------------|
| 1 | Applicability (BaFG / WZG) | [BaFG / WZG / Both / Neither / Exempt] | [Summary] |
| 2 | EN 301 549 Conformance | [Vollständig / Teilweise / Nicht konform] | [Summary] |
| 3 | Barrierefreiheitserklärung (WZG) | [Published / Outdated / Missing / N/A] | [Summary] |
| 4 | Product and Service Requirements (BaFG) | [Compliant / Partial / Gap / N/A] | [Summary] |
| 5 | Market Surveillance and Monitoring | [Low / Medium / High exposure] | [Summary] |
| 6 | Remediation Roadmap | [Agreed / Draft / Absent] | [Summary] |

---

## 1. Applicability Determination

### 1.1 Entity and Surface Inventory

| Surface | Type | Public-facing | Users |
|---------|------|---------------|-------|
| | [Website / Mobile app / Terminal / Product / Document / E-book] | [Yes / No] | [Consumers / Citizens / Staff] |

### 1.2 WZG (Public Sector) — Directive (EU) 2016/2102

| Test | Answer | Basis |
|------|--------|-------|
| Federal public body, body governed by public law, or predominantly publicly funded? | [Yes / No] | |
| Surface is a website or mobile application? | [Yes / No] | |
| **Land-level or municipal body?** (federal WZG does not apply — assess under the Landesgesetz) | [Yes / No] | `[NEEDS VERIFICATION: name the applicable Landesgesetz]` |
| **WZG applies** | **[Yes / No]** | |

### 1.3 BaFG (Products and Services) — Directive (EU) 2019/882

| Test | Answer | Basis |
|------|--------|-------|
| Economic actor: manufacturer / importer / distributor / service provider? | [Yes / No — which role] | |
| Product in Annex scope? (computer hardware and OS, self-service terminals, consumer terminal equipment, AV media terminals, e-readers) | [Yes / No / N/A] | |
| Service in Annex scope? (electronic communications, AV media services, passenger transport elements, consumer banking, e-books, e-commerce) | [Yes / No / N/A] | |
| **BaFG applies** | **[Yes / No]** | |

### 1.4 Microenterprise Exemption — services only

> The exemption at § 6 BaFG covers Kleinstunternehmen **offering or providing services** `[NEEDS VERIFICATION: § 6]`. It does **not** exempt products. A nine-person importer of self-service terminals is fully in scope.

| Criterion (§ 3 Z 19 `[NEEDS VERIFICATION]`) | Value | Met |
|---|---|---|
| Fewer than 10 persons employed | [N] | [Yes / No] |
| Annual turnover at most EUR 2M **OR** balance-sheet total at most EUR 2M | [EUR] | [Yes / No] |
| **Exemption available** (services only) | | **[Yes / No]** |

**Evidence retained**: [Source and date of the headcount and financial figures]

> The Sozialministeriumservice can require an entity claiming this exemption to produce the supporting evidence on request. An exemption asserted without evidence on file is a gap, not a pass.

---

## 2. Standard and Conformance Mapping

> **Binding version.** Both tracks route through EN 301 549 as the harmonised standard giving a presumption of conformity, and the version that binds is the one cited in the *Official Journal*: **v3.2.1**, which normatively references **WCAG 2.1 Level AA**. Draft v4.1.0 went to public review in November 2025; final v4.1.1, expected to carry WCAG 2.2 AA, is anticipated to be OJ-cited around October 2026 `[NEEDS VERIFICATION]`. Assess against 2.1 AA. Record any use of 2.2 AA as a deliberate forward-looking decision, not the legal floor.

**Assessed against**: EN 301 549 [v3.2.1] → WCAG [2.1] Level AA
**Forward-looking target adopted**: [None / WCAG 2.2 AA — rationale]

### 2.1 Test Method

| Method | Used | Scope | Date | Performed by |
|--------|------|-------|------|--------------|
| Automated tooling | [Yes / No] | | | |
| Manual expert review | [Yes / No] | | | |
| Assistive-technology testing with users | [Yes / No] | | | |

> Automated scanning alone is not conformance evidence. A statement resting on a tool report is a finding.

### 2.2 WCAG 2.1 AA Criterion Status

| Criterion | Level | Status | Surface | Evidence | Date |
|-----------|-------|--------|---------|----------|------|
| 1.1.1 Non-text Content | A | [Supports / Partially / Does Not Support / N/A] | | | |
| 1.3.1 Info and Relationships | A | | | | |
| 1.4.3 Contrast (Minimum) | AA | | | | |
| 2.1.1 Keyboard | A | | | | |
| 2.4.7 Focus Visible | AA | | | | |
| 4.1.2 Name, Role, Value | A | | | | |
| [Add remaining applicable criteria] | | | | | |

### 2.3 Non-Web Clauses (where hardware, terminals, documents or e-books are in scope)

| EN 301 549 Clause | Applies | Status | Notes |
|---|---|---|---|
| Clause 5 — Generic requirements | [Yes / No] | | |
| Clause 8 — Hardware | [Yes / No] | | |
| Clause 10 — Non-web documents | [Yes / No] | | |
| Clause 11 — Software | [Yes / No] | | |

---

## 3. Barrierefreiheitserklärung (WZG track)

*Complete only where the WZG applies. Otherwise mark N/A and state why.*

**Applies**: [Yes / No — reason]

| Required element | Present | Assessment |
|---|---|---|
| Conformance status in statutory wording (vollständig / teilweise / nicht konform) | [Yes / No] | |
| Non-accessible content — **incompatible** with the requirements | [Yes / No] | |
| Non-accessible content — **disproportionate burden**, with the justifying assessment | [Yes / No / N/A] | |
| Non-accessible content — **outside the scope** of the legislation | [Yes / No / N/A] | |
| Preparation method (self-assessment / third-party) and date | [Yes / No] | |
| Feedback mechanism with a working contact and response commitment | [Yes / No] | |
| Enforcement pointer to the FFG | [Yes / No] | |

**Statement URL**: [URL or "not published"]
**Last reviewed**: [YYYY-MM-DD]

> The most common failure is a statement that recites conformance without listing known non-conformances. It is visible to any auditor who runs a scan against it.

---

## 4. Product and Service Requirements (BaFG track)

*Complete only where the BaFG applies. Otherwise mark N/A and state why.*

**Applies**: [Yes / No — reason]

### 4.1 Requirements Mapping

| In-scope product / service | Applicable requirements | Status | Gap |
|---|---|---|---|
| | | [Compliant / Partial / Gap] | |

### 4.2 Information Obligations

| Obligation | Met | Notes |
|---|---|---|
| Accessible instructions and product information | [Yes / No / N/A] | |
| Published description of how the service meets the accessibility requirements | [Yes / No / N/A] | |
| Supporting documentation retained | [Yes / No] | |

### 4.3 Conformity Assessment Route

> **Products** take an EU declaration of conformity and **CE marking**; the internal production-control route applies where the harmonised standard is used. **Services** take no CE marking — the obligation is the published description plus retained documentation. Do not apply CE marking to a service.

| Item | Type | Route | Declaration drawn up | CE marking |
|---|---|---|---|---|
| | [Product / Service] | | [Yes / No] | [Yes / N/A — service] |

### 4.4 Statutory Defences

| Defence | Claimed | Documented assessment on file | Last re-assessed |
|---|---|---|---|
| Disproportionate burden (unverhältnismäßige Belastung) | [Yes / No] | [Yes / No] | [YYYY-MM-DD] |
| Fundamental alteration | [Yes / No] | [Yes / No] | [YYYY-MM-DD] |

> An undocumented claim is not a defence. Both require a retained assessment, re-done when the product or service changes and periodically thereafter.

### 4.5 Out of Scope Here

- **Emergency communications (Notrufe)** are transposed through the **TKG 2021**, not the BaFG. Assess separately; do not evaluate them under this act.

---

## 5. Market Surveillance, Monitoring and Exposure

| Track | Authority | Powers | Financial exposure |
|---|---|---|---|
| BaFG | Sozialministeriumservice (SMS) `[NEEDS VERIFICATION: § 21]` | Proactive monitoring, remediation orders, withdrawal of a product or prohibition of a service in serious cases | Administrative penalties up to **EUR 80,000** `[NEEDS VERIFICATION: § 36 and tier structure]`, tiered by severity and lower for SMEs and microenterprises |
| WZG | FFG (Österreichische Forschungsförderungsgesellschaft) | Monitoring and complaints handling; triennial reporting to the European Commission | **No administrative fine regime** — finding, complaint and publication |

**Assessed exposure**: [Range against the specific conduct, per applicable track]

> Where both tracks apply, keep the exposures separate. Different authorities, different powers, different surfaces. Never carry the BaFG ceiling into a public-sector WZG assessment.

---

## 6. Gap Analysis and Remediation Roadmap

| # | Surface | Criterion / requirement | Track | Severity | User impact | Owner | Target date | NFR-UX ref |
|---|---------|------------------------|-------|----------|-------------|-------|-------------|-----------|
| 1 | | | [BaFG / WZG] | 🔴 / 🟠 / 🟡 | | | | NFR-UX-xxx |

**Prioritisation basis**: user impact first, enforcement exposure second. A blocked login path outranks a decorative contrast failure regardless of track.

**Procurement handoff**: [Items whose remediation will be tendered — carry the conformance target into `/arckit:at-bvergg`]

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

**Generated by**: ArcKit `/arckit:at-barrierefreiheit` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
