# USA Federal Civilian Overlay — Maintenance & Citation Register

> **Overlay Origin**: Community-contributed | **Domain co-maintainer**: [recruiting — open call] | **ArcKit Version**: [VERSION]

## Purpose

The USA Federal Civilian Overlay adds 10 community-contributed commands that ground architecture artefacts in the federal civilian regulatory stack — FIPS 199 categorization, NIST SP 800-53 Rev 5 tailoring, FedRAMP authorization (SSP + RAR), CISA Zero Trust Maturity Model v2.0, ICAM under M-19-17, the NIST AI RMF + OMB M-25-21 (AI use) and M-25-22 (AI acquisition), the E-Government Act §208 PIA, and EO 14028 secure-software evidence + SBOM under OMB M-26-05.

The target audience is federal civilian agencies building or procuring information systems, and the vendors who serve them (FedRAMP-pursuing CSPs, system integrators, AI / ML providers). The overlay is positioned for agency System Owners, ISSOs, Authorizing Officials, CAIOs, SAOPs, and the architects supporting them.

The overlay is shipped as **`[COMMUNITY]`** tier rather than official baseline. Federal civilian statutory currency moves faster than a single maintainer can verify with confidence — EO 14110 was issued in October 2023 and revoked in January 2025; in April 2025 M-25-21 and M-25-22 replaced the 2024 AI use and acquisition memos (M-24-10 and M-24-18); OMB M-24-15 replaced the JAB with the FedRAMP Board in July 2024; FedRAMP Rev 5 completed transition in 2024, and the Consolidated Rules for 2026 make Rev 5 a legacy certification type. A community tier signals: "the regulatory anchors here are the ones the maintainer has verified on the date stamped in the citation register; you must re-verify before relying on them for go-live decisions."

---

## When to Use the Overlay

- The contracting authority is a **federal civilian agency** (department, independent agency, executive branch entity outside DoD / IC).
- The system handles federal data under **FISMA boundary** (44 U.S.C. §3551 et seq.).
- An **AI use case** is in scope under **OMB M-25-21** (use and governance of AI) or **M-25-22** (acquisition of AI).
- The vendor is **pursuing a FedRAMP Certification** (Rev 5 Class B, C or D, which carry the LI-SaaS / Low, Moderate and High baselines, or FedRAMP 20x) for federal customer adoption.
- The agency **Chief AI Officer** or **SAOP** needs artefacts for the agency AI use-case inventory (published at `[agency.gov]/ai`) or for the §208 PIA register.

---

## Out of Scope

- **Federal defense (DoD, IC).** CMMC, RMF for DoD IT, DISA-STIGs, JSIG, NIST SP 800-171 for CUI in non-federal systems — covered by a future `arckit-us-dod` overlay, not this one.
- **State governments.** StateRAMP, TX-RAMP, AZ-RAMP, CJIS Security Policy — sibling state overlays where they exist.
- **Sector-specific regimes.** HIPAA (HHS / HIPAA-covered entities), GLBA (financial), SOX (publicly traded), PCI-DSS (payment card) — these layer on top and need their own assessments.
- **Section 508 accessibility.** Deferred to v5.2. Until then, use agency-specific Section 508 guidance and the GSA accessibility resources directly.

---

## Citation Register

Every regulatory anchor used across the overlay's commands, with verification timestamps. Verification is repeated quarterly — next scheduled review **2026-08-23**.

| Anchor | URL | Verified | Last Checked | Notes |
|---|---|---|---|---|
| FIPS Publication 199 | <https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.199.pdf> | 2026-05-23 | 2026-05-23 | Stable since 2004; CIA + impact-level definitions |
| NIST SP 800-60 Vol 2 Rev 1 | <https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-60v2r1.pdf> | 2026-05-23 | 2026-05-23 | Information-type catalogue |
| NIST SP 800-53 Rev 5 | <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf> | 2026-05-23 | 2026-05-23 | Active baseline; Rev 5 transition complete |
| NIST SP 800-53B | <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53B.pdf> | 2026-05-23 | 2026-05-23 | Control baselines (Low / Moderate / High / Privacy) |
| NIST SP 800-37 Rev 2 | <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-37r2.pdf> | 2026-05-23 | 2026-05-23 | RMF for Information Systems and Organizations |
| NIST SP 800-63-3 (A / B / C) | <https://pages.nist.gov/800-63-3/> | 2026-05-23 | 2026-05-23 | Digital Identity Guidelines; IAL / AAL / FAL |
| NIST SP 800-207 | <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-207.pdf> | 2026-05-23 | 2026-05-23 | Zero Trust Architecture |
| NIST SP 800-218 (SSDF) | <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf> | 2026-05-23 | 2026-10-28 | Secure Software Development Framework v1.1; v1.2 (SP 800-218 Rev. 1) is an initial public draft of 17 December 2025, not final |
| NIST SP 800-122 (PII Protection) | <https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-122.pdf> | 2026-05-23 | 2026-05-23 | Guide to Protecting the Confidentiality of PII |
| NIST AI RMF 1.0 | <https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf> | 2026-05-23 | 2026-05-23 | Four functions: Govern, Map, Measure, Manage |
| NIST AI 600-1 (Generative AI Profile) | <https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf> | 2026-05-23 | 2026-05-23 | GenAI cross-cutting risks |
| FIPS 201-3 | <https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.201-3.pdf> | 2026-05-23 | 2026-05-23 | PIV for federal employees and contractors |
| FedRAMP Rev 5 Baselines | <https://www.fedramp.gov/2026/reference/controls/> | 2026-10-28 | 2026-10-28 | Full Rev5 Control Reference: baseline applicability per control as Class B (LI-SaaS / Low), C (Moderate), D (High). The old `/rev5/baselines/` page returns 404; the legacy baseline workbook is on <https://www.fedramp.gov/legacy/> |
| FedRAMP SSP Template Rev 5 | <https://www.fedramp.gov/legacy/> | 2026-10-27 | 2026-10-27 | Legacy since 23 June 2026; the old documents-templates page is gone |
| FedRAMP RAR Template | <https://www.fedramp.gov/legacy/> | 2026-10-27 | 2026-10-27 | Moderate v2.1 (May 2024) and High; legacy since 23 June 2026; FedRAMP Ready retired 28 July 2026 |
| FedRAMP Consolidated Rules for 2026 | <https://www.fedramp.gov/2026/> | 2026-10-27 | 2026-10-27 | Certification type (Rev 5 / 20x), path (Agency / Program) and class (A–D); mandatory from 1 January 2027 |
| OMB M-24-15 (Modernizing FedRAMP) | <https://www.whitehouse.gov/wp-content/uploads/2024/07/M-24-15-Modernizing-the-Federal-Risk-and-Authorization-Management-Program.pdf> | 2026-10-27 | 2026-10-27 | Rescinded the 2011 FedRAMP memo; PMO + FedRAMP Board; agency and program authorizations; JAB P-ATOs re-designated |
| FedRAMP Minimum Assessment Scope (MAS) | <https://www.fedramp.gov/2026/providers/rev5/rules/minimum-assessment-scope/> | 2026-10-28 | 2026-10-28 | Replaces the Authorization Boundary Guidance, whose PDF returns 404 (FedRAMP RFC-0005: MAS "was formerly referred to as the FedRAMP Boundary Policy / Boundary Guidance"); optional for Rev 5 from 4 July 2026, required from 1 January 2027 |
| CISA ZTMM v2.0 | <https://www.cisa.gov/zero-trust-maturity-model> | 2026-05-23 | 2026-05-23 | 5 pillars + 3 cross-cuts, 4 stages |
| CISA Secure Software Development Attestation Form | <https://www.cisa.gov/resources-tools/resources/secure-software-development-attestation-form> | 2026-10-28 | 2026-10-28 | Agency choice under OMB M-26-05; the older `/secure-software-attestation-form` page is marked archived |
| CISA 2026 Minimum Elements for an SBOM | <https://www.cisa.gov/resources-tools/resources/2026-minimum-elements-software-bill-materials-sbom> | 2026-10-28 | 2026-10-28 | 29 July 2026; updates and replaces the NTIA Minimum Elements (2021): 17 data fields, 6 practices and processes |
| OMB M-03-22 (E-Gov PIA guidance) | <https://www.whitehouse.gov/wp-content/uploads/2017/11/203-M-03-22-OMB-Guidance-for-Implementing-the-Privacy-Provisions-of-the-E-Government-Act-of-2002-1.pdf> | 2026-05-23 | 2026-05-23 | Implementing guidance for §208 |
| OMB M-19-17 (ICAM) | <https://www.whitehouse.gov/wp-content/uploads/2019/05/M-19-17.pdf> | 2026-05-23 | 2026-05-23 | ICAM policy for federal agencies |
| OMB M-22-09 (Federal Zero Trust) | <https://www.whitehouse.gov/wp-content/uploads/2022/01/M-22-09.pdf> | 2026-05-23 | 2026-05-23 | Federal zero-trust strategy |
| OMB M-22-18 (Secure Software / SBOM) | <https://bidenwhitehouse.archives.gov/wp-content/uploads/2022/09/M-22-18.pdf> | 2026-10-28 | 2026-10-28 | Rescinded by M-26-05 on 23 January 2026; archived copy (the whitehouse.gov PDF returns 404) |
| OMB M-23-16 (M-22-18 Update) | <https://bidenwhitehouse.archives.gov/wp-content/uploads/2023/06/M-23-16-Update-to-M-22-18-Enhancing-Software-Security.pdf> | 2026-10-28 | 2026-10-28 | Rescinded by M-26-05 on 23 January 2026; archived copy |
| OMB M-26-05 (Risk-based Software and Hardware Security) | <https://www.whitehouse.gov/wp-content/uploads/2026/01/M-26-05-Adopting-a-Risk-based-Approach-to-Software-and-Hardware-Security.pdf> | 2026-10-28 | 2026-10-28 | Active; complete software and hardware inventory and risk-based assurance policies required; attestation form and SBOM-on-request contract terms are agency choices |
| OMB M-25-21 (Agency Use of AI) | <https://www.whitehouse.gov/wp-content/uploads/2025/02/M-25-21-Accelerating-Federal-Use-of-AI-through-Innovation-Governance-and-Public-Trust.pdf> | 2026-10-27 | 2026-10-27 | Active; rescinded and replaced M-24-10 on 3 April 2025; high-impact AI and seven minimum practices |
| OMB M-25-22 (AI Acquisition) | <https://www.whitehouse.gov/wp-content/uploads/2025/02/M-25-22-Driving-Efficient-Acquisition-of-Artificial-Intelligence-in-Government.pdf> | 2026-10-27 | 2026-10-27 | Active; rescinded and replaced M-24-18 on 3 April 2025; AI contract terms |
| OMB M-26-04 (Unbiased AI Principles) | <https://www.whitehouse.gov/wp-content/uploads/2025/12/M-26-04-Increasing-Public-Trust-in-Artificial-Intelligence-Through-Unbiased-AI-Principles-1.pdf> | 2026-10-27 | 2026-10-27 | LLM contract terms from 11 December 2025; complements M-25-22; sunsets after two years |
| EO 14028 (Improving the Nation's Cybersecurity) | <https://www.federalregister.gov/documents/2021/05/17/2021-10460/improving-the-nations-cybersecurity> | 2026-05-23 | 2026-05-23 | Secure-software supply chain anchor |
| E-Government Act 2002 §208 | <https://www.justice.gov/opcl/e-government-act-2002> | 2026-05-23 | 2026-05-23 | PIA statutory authority |
| Privacy Act of 1974 (5 U.S.C. §552a) | <https://www.justice.gov/opcl/privacy-act-1974> | 2026-05-23 | 2026-05-23 | SoR / SORN statutory authority |
| FISMA Modernization Act of 2014 | <https://www.congress.gov/bill/113th-congress/senate-bill/2521> | 2026-05-23 | 2026-05-23 | 44 U.S.C. §3551 et seq. |
| login.gov developer documentation | <https://developers.login.gov/> | 2026-05-23 | 2026-05-23 | GSA shared identity service for the public |

---

## Quarterly Review Cadence

The citation register above is re-verified every quarter. **Next scheduled review: 2026-08-23.** The maintainer walks each URL in turn; if a URL 404s or the document has been superseded, the row is updated and the Notes column records the move (including a wayback-machine snapshot URL — `https://web.archive.org/web/<timestamp>/<original-url>` — where the original is gone). Material changes to a regulatory anchor (revision, supersession, revocation) trigger a corresponding update to the affected `us-*` command files within 14 days, plus a CHANGELOG entry.

---

## Known Limitations

- **Section 508 accessibility is not covered.** Deferred to ArcKit v5.2; until then, use the GSA Section 508 resources and agency-specific accessibility guidance directly.
- **Classified-system architecture is not covered.** The overlay focuses on civilian unclassified information; classified-system architecture sits with the future `arckit-us-dod` overlay. Since #746 the artefacts themselves do carry a US marking ladder — `_partials/document-control-us.md` offers UNCLASSIFIED / CUI / CONFIDENTIAL / SECRET / TOP SECRET so a Document Control header can record how the document is marked — but the overlay produces no CUI categorisation and no category or limited-dissemination markings (`CUI//SP-PRIV`, `CUI//NOFORN`). Those follow 32 CFR Part 2002 and the NARA CUI Registry, and belong in `Distribution`.
- **State-level regimes are not covered.** StateRAMP, TX-RAMP, AZ-RAMP, CJIS Security Policy — sibling overlays where they exist; sector-specific overlays where they don't.
- **Sector-specific regimes are not covered.** HIPAA, GLBA, SOX, PCI-DSS layer on top; if any apply, treat them as additional artefacts, not as parts of this overlay.
- **No live A&A test against a real FedRAMP package.** The templates are based on the published FedRAMP SSP and RAR template structures; they have not been put in front of a 3PAO or the FedRAMP PMO for a real authorization decision. Treat as a strong starting point, not a guaranteed-pass package.

---

## Statutory Currency Anchor

- **EO 14110 was revoked in January 2025.** The anchors for federal AI governance are **OMB M-25-21** (agency use of AI), which rescinded and replaced M-24-10 on 3 April 2025, and **OMB M-25-22** (AI acquisition), which replaced M-24-18 the same day, plus **OMB M-26-04** for large language model procurement. M-25-21 replaced "rights-impacting" and "safety-impacting" AI with "high-impact" AI. Checked on 27 October 2026: no later OMB memo or executive order has amended either memo. EO 14434 (29 September 2026) changes federal terminology from "AI" to "Super Intelligence" but not the requirements.
- **The JAB no longer exists.** OMB M-24-15 (25 July 2024) rescinded the 2011 memo that created it; FedRAMP is now the GSA PMO and the FedRAMP Board, and existing JAB P-ATOs were re-designated. Under the FedRAMP Consolidated Rules for 2026, a certification has a type (Rev 5 or 20x), a path (Agency, where a sponsoring agency authorises first, or Program, where FedRAMP certifies directly) and a class (A–D).
- **FedRAMP completed the Rev 5 transition in 2024.** Rev 4 is retired for new authorisations; the overlay anchors on Rev 5 throughout.
- **OMB M-26-05 (23 January 2026) rescinded M-22-18 and M-23-16.** Agencies must keep a complete inventory of software and hardware and set software and hardware assurance policies that match their risk; using the CISA Secure Software Development Attestation Form, and contract terms requiring an SBOM on request, are each the agency's choice. The FAR Council withdrew FAR Case 2023-002 (Supply Chain Software Security) on 6 March 2026. EO 14028 §4 itself has not been amended: EO 14306 (June 2025) amended EO 14144, removing its plan to have CISA collect and validate attestations.

If any of these change materially before the next quarterly review, the maintainer will issue an out-of-band CHANGELOG update.

---

## Domain Co-maintainer — Open Call

The overlay is currently solo-maintained. For reference, the Australian overlay maintainer is [@royster70](https://github.com/royster70) and the Canadian overlay is anonymous-community. The USA overlay is seeking a federal-civilian SME co-maintainer — backgrounds welcome from agency CISO offices, Senior Agency Officials for Privacy (SAOPs), FedRAMP PMO / 3PAO practitioners, agency Chief AI Officers, or federal architecture leads with direct ATO experience.

If you have relevant federal-civilian architecture experience and are interested in co-maintaining, [open an issue](https://github.com/tractorjuice/arc-kit/issues) or DM [@tractorjuice](https://github.com/tractorjuice).

Co-maintainer recruitment is a precondition for re-evaluating the overlay for official-baseline promotion.

---

## Changelog Reference

Per-release changes are recorded in [`plugins/arckit-us/CHANGELOG.md`](../../plugins/arckit-us/CHANGELOG.md). Citation-register verifications are also reflected there with the quarterly date and the rows touched.
