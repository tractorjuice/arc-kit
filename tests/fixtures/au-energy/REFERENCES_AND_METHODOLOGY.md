# Synthetic Test Data — References & Methodology

**Project:** ArcKit `au-energy` recipe validation (energy-sector overlay: AESCSF, SOCI/CIRMP, AER ring-fencing)
**Fixtures:** A — *Eastland Energy Networks* (composite DNSP, applicable case); B — *Voltiq Analytics* (composite supplier, non-SOCI / negative case)
**Author:** Synthetic fixture authors
**Created:** May 2026

This document explains **how the synthetic test data was created**, lists **every public source used**, maps **each source to the fixture content it informed** (provenance), and records the **validation performed**. It is intended to make the test data fully citable and auditable.

---

## 1. Purpose

The `au-energy` recipe (`arckit-au/recipes/au-energy.yaml`) shipped two community commands — `au-aescsf` and `au-soci-cirmp` — that are mechanically clean but were **not validated end-to-end** because the existing federal test fixture (MBB Group) is an advisory firm, not an energy market participant or SOCI-designated critical-asset operator. The recipe YAML explicitly states that *"validation against an [energy-sector / SOCI] test fixture is required before merge."*

These fixtures provide that test data: an energy-sector entity that **triggers** the energy regulatory paths (Fixture A) and a supplier that **deliberately does not** trigger SOCI (Fixture B), so the recipe's applicability logic can be validated in both directions.

---

## 2. Methodology — Forrester-TEI "Composite Organisation", adapted

The fixtures are built using the **Forrester Total Economic Impact™ (TEI) "composite organisation" method**, adapted from economic-impact modelling to compliance-fixture construction.

In Forrester's method, a composite is *"crafted from the characteristics of four to six organisations"* into a single **realistic, representative** entity — explicitly **not a statistical average and not a real organisation**. We apply the same principle:

1. **Choose the archetype.** Fixture A = a mid-size Victorian electricity DNSP; Fixture B = an energy DER/analytics SaaS + advisory supplier.
2. **Gather public characteristics.** Draw structure, scale, current-state systems and major-program patterns from *publicly available* AER regulatory proposals and expenditure reviews, AEMO public program materials, and open standards/data projects (see §4).
3. **Aggregate into one representative entity.** Combine those characteristics into a single coherent organisation — not a copy of any one network, and not an average.
4. **Seed realistic gaps deliberately.** Insert credible, representative weaknesses (anti-patterns, thin CIRMP chapters, ring-fencing information-flow risks) so the recipe has genuine findings to surface. These are typical of a real mid-transition DNSP, not invented to flatter the tool.
5. **Label everything synthetic.** Every document carries a synthetic-composite disclaimer; all names, ABNs, figures and findings are illustrative.
6. **Use no confidential or client data.** Only public sources are used. The composite is **not** based on, and must not be attributed to, any real network, any named individual, or any real advisor's past clients.

> **Composite ≠ real.** Eastland Energy Networks and Voltiq Analytics do not exist. Real third-party standards, programs and open-source projects are cited only as the public backdrop an entity of each archetype would operate within.

---

## 3. Confidentiality & Ethics Statement

- **Public sources only.** No proprietary, client, employer, or otherwise confidential information was used to construct either fixture.
- **No real-entity modelling.** The composites are not modelled on any single real DNSP or supplier. Real network names (e.g. those appearing in the AER references below) are cited **only** as public regulatory documents that illustrate sector-wide patterns — never as the subject of the fixture.
- **No client data.** Real advisor or client histories are explicitly excluded as a basis for the fixtures.
- **Synthetic labelling.** Each fixture file carries a prominent "SYNTHETIC COMPOSITE — TEST FIXTURE ONLY" notice.

---

## 4. Full Reference List

All URLs were accessed in May 2026.

### A. Methodology

1. Forrester — *Total Economic Impact™ (TEI) methodology* — https://www.forrester.com/policies/tei/
2. Forrester — *Channeling Main Character Energy: Your Guide To The TEI Composite Organization* — https://www.forrester.com/blogs/guide-tei-composite-organization/

### B. AESCSF (AEMO)

3. AEMO — *Australian Energy Sector Cyber Security Framework (AESCSF)* program — https://aemo.com.au/initiatives/major-programs/cyber-security/australian-energy-sector-cyber-security-framework-aescsf
4. AEMO — *AESCSF 2025 Overview* — https://www.aemo.com.au/-/media/files/initiatives/cyber-security/aescsf/guidance-materials/aescsf-2025-overview.pdf
5. AEMO — *AESCSF 2025 Domain Walk-through* — https://www.aemo.com.au/-/media/files/initiatives/cyber-security/aescsf/guidance-materials/aescsf-2025-domain-walk-through.pdf
6. AEMO — *AESCSF v2 Quick Reference Guide (2023)* — https://www.aemo.com.au/-/media/files/initiatives/cyber-security/aescsf/2023/aescsf-v2-quick-reference-guide-10.pdf
7. AEMO — *AESCSF guidance for low-criticality organisations* (Criticality Assessment Tool context) — https://www.aemo.com.au/-/media/files/initiatives/cyber-security/aescsf/aescsf-guidance-material-for-low-criticality-organisations.pdf

### C. SOCI Act / CIRMP / CISC

8. *Security of Critical Infrastructure Act 2018* (compilation) — https://www.legislation.gov.au/Details/C2025C00001
9. Cyber and Infrastructure Security Centre (CISC) — https://www.cisc.gov.au/
10. CISC — *Guidance for the Critical Infrastructure Risk Management Program* — https://www.cisc.gov.au/resources-subsite/Documents/guidance-for-the-critical-infrastructure-risk-management-program.pdf
11. CISC — *Critical infrastructure legislative information and reforms* — https://www.cisc.gov.au/legislative-information-and-reforms/critical-infrastructure
12. King & Wood Mallesons — *First CIRMP annual reports under the SOCI Act* (board-attestation & timing) — https://www.kwm.com/global/en/insights/latest-thinking/first-cirmp-annual-reports-under-the-soci-act.html
13. Clayton Utz — *Inaugural critical infrastructure annual risk reviews due* — https://www.claytonutz.com/insights/2024/september/risky-business-inaugural-critical-infrastructure-annual-risk-reviews-due
14. MinterEllison — *SOCI risk management program requirements now in effect* — https://www.minterellison.com/articles/soci-risk-management-program-requirements-now-in-effect

### D. AER economic regulation, ring-fencing & DNSP regulatory submissions

15. AER — *Ring-fencing Guideline (electricity distribution)* — https://www.aer.gov.au/networks-pipelines/guidelines-schemes-models-reviews/ring-fencing-guideline-electricity-distribution
16. AER — *Electricity Distribution Service Classification Guideline* (Aug 2022) — https://www.aer.gov.au/system/files/AER%20-%20Service%20classification%20guideline%20-%20August%202022_0.pdf
17. AER / EMCa — *Review of proposed expenditure on cyber security — AusNet 2026–31* (cyber expenditure, E8 + CIRMP references) — https://www.aer.gov.au/system/files/2025-09/EMCa%20-%20Review%20of%20proposed%20expenditure%20on%20cyber%20security%20-%20AusNet%202026-31%20regulatory%20proposal%20-%20August%202025.pdf
18. AER / EMCa — *Review of aspects of proposed expenditure on ICT and CER — CitiPower, Powercor and United Energy 2026–31* — https://www.aer.gov.au/system/files/2025-09/EMCa%20%20-%20Review%20of%20aspects%20of%20proposed%20expenditure%20on%20ICT%20and%20CER%20-%20CitiPower,%20Powercor%20and%20United%20Energy%202026-31%20regulatory%20proposals%20-%20August%202025.pdf
19. AER / EMCa — *Review of proposed expenditure on ICT and CER — Jemena 2026–31* — https://www.aer.gov.au/system/files/2025-09/EMCa%20-%20Review%20of%20proposed%20expenditure%20on%20ICT%20and%20CER%20-%20Jemena%202026-31%20regulatory%20proposal%20-%20August%202025_0.pdf
20. AER / CCP32 — *Submission — United Energy electricity distribution proposal 2026–31* (ICT/dynamic-tariff context) — https://www.aer.gov.au/system/files/2025-05/CCP32%20-%20Submission%20-%20United%20Energy%20electricity%20distribution%20proposal%202026-31%20-%20May%202025.pdf
21. Essential Energy — *Regulatory Proposal* (DNSP proposal example) — https://www.essentialenergy.com.au/about-us/customer-and-regulatory-information/regulatory-proposal
22. AER — *VEBM (Victorian Emergency Backstop Mechanism) cost pass-through application* — https://www.aer.gov.au/system/files/2024-02/ASD%20-%20VEBM%20Cost%20pass%20through%20application%20-%20PUBLIC%20-%202%20February%202024.pdf
23. IEEFA — *Reforming the economic regulation of Australian electricity distribution networks* — https://ieefa.org/resources/reforming-economic-regulation-australian-electricity-distribution-networks

### E. AEMO market & DER programs (IT/OT-convergent project backdrop)

24. AEMO — *Consumer Energy Resources (CER) Data Exchange* — https://www.aemo.com.au/initiatives/major-programs/nem-reform-program/nem-reform-program-initiatives/consumer-energy-resources-data-exchange
25. ARENA — *Enabling Data Exchange for Consumer Energy Resources* (AEMO + AusNet co-design; $1.2m grant) — https://arena.gov.au/news/enabling-data-exchange-for-consumer-energy-resources/
26. AEMO — *Project EDGE* (DER demonstration) — https://www.aemo.com.au/initiatives/major-programs/nem-distributed-energy-resources-der-program/der-demonstrations/project-edge
27. AEMO — *Dynamic Operating Envelopes* (Project EDGE) — https://www.aemo.com.au/initiatives/major-programs/nem-distributed-energy-resources-der-program/der-demonstrations/project-edge/project-edge-reports/dynamic-operating-envelopes
28. AEMO — *Project EDGE Data Specification Part B (Market Participation)* — https://www.aemo.com.au/-/media/files/initiatives/der/2023/project-edge---data-specification-part-b.pdf
29. AEMO — *Flexible Trading Arrangements* — https://www.aemo.com.au/initiatives/major-programs/nem-reform-program/nem-reform-program-initiatives/flexible-trading-arrangements
30. AEMO — *Integrating Price-Responsive Resources into the NEM (IPRR)* — https://www.aemo.com.au/initiatives/major-programs/nem-reform-program/nem-reform-program-initiatives/integrating-price-responsive-resources-into-the-nem
31. AEMO — *How Global Settlement will work* — https://aemo.com.au/en/initiatives/major-programs/nem-five-minute-settlement--program-and-global-settlement/global-settlement/how-gs-will-work
32. AEMO — *Data (NEM)* — MMS/EMMS data model & NEMWeb — https://www.aemo.com.au/energy-systems/electricity/national-electricity-market-nem/data-nem
33. AEMC — *Integrated Distribution System Planning (IDSP)* rule change (Evoenergy submission, ERC0410) — https://www.aemc.gov.au/sites/default/files/2025-07/evoenergy_-_submission_-_consultation_paper_-_integrated_distribution_system_planning_idsp_-_erc0410_-_23_july_2025.pdf

### F. DER standards & open-source / open-data projects (GitHub)

34. CSIP-AUS — *About* (Common Smart Inverter Profile – Australia; on IEEE 2030.5) — https://www.csipaus.org/about
35. ARENA / DEIP — *ISC CSIP-AUS Comms Client Test Procedures* — https://arena.gov.au/assets/2024/11/Distributed-Energy-Integration-Program-%E2%80%93-ISC-CSIP-AUS-Comms-Client-Test-Procedures.pdf
36. ARENA — *EVOLVE: implementation and publishing of operating envelopes* — https://arena.gov.au/assets/2021/04/evolve-on-the-implementation-and-publishing-of-operating-envelopes.pdf
37. GitHub — *longzheng/open-dynamic-export* (CSIP-AUS/SEP2/IEEE 2030.5 dynamic export control) — https://github.com/longzheng/open-dynamic-export
38. GitHub — *epri-dev/IEEE-2030.5-Client* — https://github.com/epri-dev/IEEE-2030.5-Client
39. GitHub — *opennem/nemweb* (download/process AEMO NEMWeb files) — https://github.com/opennem/nemweb
40. GitHub — *opennem/opennem* (OpenElectricity — Australian energy market data platform) — https://github.com/opennem/opennem

### G. Federal baseline (composed on, per au-federal)

41. ASD — *Essential Eight Maturity Model* — https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight/essential-eight-maturity-model
42. ASD — *Information Security Manual (ISM)* — https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/ism
43. OAIC — *Notifiable Data Breaches scheme* — https://www.oaic.gov.au/privacy/notifiable-data-breaches
44. OAIC — *Australian Privacy Principles* — https://www.oaic.gov.au/privacy/australian-privacy-principles

### H. Asset-inventory schema (added 2026-05-21)

45. IBM — *AssetOpsBench* (industrial asset-ops benchmark; schema basis for the pseudo asset inventory) — repo code Apache-2.0; **dataset licence to verify on HF card** — https://github.com/IBM/AssetOpsBench
46. Patel et al. — *AssetOpsBench: Benchmarking AI Agents for Task Automation in Industrial Asset Operations and Maintenance* (arXiv 2506.03828) — https://arxiv.org/abs/2506.03828
47. IBM Research — *AssetOpsBench dataset (Hugging Face)* — https://huggingface.co/datasets/ibm-research/AssetOpsBench

> **Use note:** AssetOpsBench is used as a **schema/method source only** — its data is not reproduced. `fixture-a-eastland-dnsp/raw_data/OT_pseudo_asset_inventory.md` is our own synthetic inventory generated using their `site→asset→sensors→failure-modes→work-orders` structure, adapted to grid assets.

### I. Reference architectures / public diagrams (added 2026-05-21)

48. SGAM — *Smart Grid Architecture Model* (CEN-CENELEC-ETSI Smart Grid Coordination Group; 5 layers: Business/Function/Information/Communication/Component) — https://link.springer.com/chapter/10.1007/978-3-319-49229-2_3
49. AEMO — *CER Data Exchange Industry Co-Design, Attachment A: High-Level Design* (ARENA) — https://arena.gov.au/assets/2025/08/AEMO-%E2%80%93-CER-Data-Exchange-Industry-Co-Design-Attachment-A-High-Level-Design.pdf
50. AEMO + Energy Networks Australia — *Open Energy Networks: Required Capabilities and Recommended Actions* — https://www.energynetworks.com.au/assets/uploads/open_energy_networks_-_required_capabilities_and_recommended_actions_report_22_july_2019.pdf
51. NIST — *Framework and Roadmap for Smart Grid Interoperability Standards* (Smart Grid Framework) — https://www.nist.gov/programs-projects/smart-grid-national-coordination/smart-grid-framework

> **Use note:** the diagrams in `fixture-a-eastland-dnsp/raw_data/Architecture_Diagrams.md` are our own synthetic Mermaid drawings, using these public reference architectures (plus CSIP-AUS ref 34, CER/DOE refs 24/27) as **structural method** — no proprietary DNSP diagram is reproduced.

### J. ARENA innovation projects — edge cases & sample architectures (added 2026-05-21)

52. ARENA — *Project Symphony* (WA VPP): Final Lessons Learnt / DER Services / Aggregator reports — https://arena.gov.au/knowledge-bank/project-symphony-final-lessons-learnt-report/
53. ARENA — *Project Converge* (ACT): Shaped Operating Envelopes, Final Knowledge Sharing Report — https://arena.gov.au/knowledge-bank/project-converge-act-distributed-energy-resources-pilot-final-knowledge-sharing-report/
54. ARENA — *DER Integration and Automation Project* — https://arena.gov.au/projects/der-integration-and-automation-project/
55. ARENA — *Amber V2G / EV smart charging ("Batteries on Wheels")* — https://arena.gov.au/news/batteries-on-wheels-unlocking-value-for-customers-through-smarter-charging/
56. ANU — *Battery Storage and Grid Integration Program (BSGIP) publications* — https://bsgip.com/research/publications/

> **Use note:** ARENA knowledge-sharing reports are public (typically CC BY — verify per report). Candidate sources for **edge-case archetypes** (VPP/DERMS/EV/V2G/microgrid) and DER architecture method; no edge-case fixture built yet.

---

## 5. Provenance Map — source → fixture content

| Fixture content | Primary sources (refs §4) |
|-----------------|---------------------------|
| Composite construction method | 1, 2 |
| DNSP scale, RAB, capex pattern, ICT/cyber expenditure framing | 17, 18, 19, 20, 21, 23 |
| AESCSF 11 domains, MIL-1/2/3, CAT banding, OT overlay, anti-patterns | 3, 4, 5, 6, 7 + `skills/au-aescsf/SKILL.md` |
| SOCI designation, CIRMP 4 hazards, board attestation, 12/72-hr reporting | 8, 9, 10, 11, 12, 13, 14 + `skills/au-soci-cirmp/SKILL.md` |
| AER ring-fencing (regulated/unregulated, information flows) | 15, 16 |
| Major IT/OT-convergent programs (ADMS, DERMS/DOE, CER Data Exchange, FTA, dynamic tariffs, VEBM) | 22, 24, 25, 26, 27, 28, 29, 30, 31, 33 |
| DER comms (CSIP-AUS / IEEE 2030.5), open-source export control, market data (NEMWeb/OpenNEM) | 32, 34, 35, 36, 37, 38, 39, 40 |
| Federal baseline (E8 / ISM / Privacy / NDB) composition | 41, 42, 43, 44 |
| Negative-case (supplier flow-down, sensitive-supplier, multi-tenant SaaS) | 10, 12, 14, 34, 41–44 (applied to a supplier) |
| Pseudo asset data inventory (Eastland OT estate) — schema/method | 45, 46, 47 |
| Architecture & data-flow diagrams (Eastland) — structural method | 48, 49, 50, 51 + 34 (CSIP-AUS), 24/27 (CER/DOE) |
| Key systems & vendor stack (illustrative real products incl. middleware + network segmentation/security) | public vendor product landscape — representative of a DNSP estate, **not** a real network's procurement |
| Edge-case archetypes & DER/VPP architecture method (candidate future fixtures) | 52, 53, 54, 55, 56 |

---

## 6. Validation Log

| Date | Activity | Result |
|------|----------|--------|
| 2026-05-21 | **Composite construction** of Fixtures A & B per §2 | Complete |
| 2026-05-21 | **Synthetic-labelling check** — every fixture file carries the disclaimer | To be confirmed in coverage verification (see README §"Verification") |
| 2026-05-21 | **Confidentiality check** — no client/real-entity data; fictional names | To be confirmed in coverage verification |
| 2026-05-21 | **Coverage mapping** — each AESCSF domain / SOCI hazard / AER trigger has a hook in the fixtures | See README coverage matrix |
| 2026-05-21 | **Pseudo asset inventory added** to Fixture A (AssetOpsBench schema, grid-adapted) + provenance wired (refs 45–47) | Complete — synthetic; AssetOpsBench used as schema only |
| 2026-05-21 | **Architecture & data-flow diagrams added** to Fixture A (SGAM/CER-HLD/CSIP-AUS/OpEN method, refs 48–51); landscape diagram validated via Mermaid renderer | Complete — synthetic; public reference architectures used as method only |
| 2026-05-21 | **Vendor stack + integration middleware (webMethods) + network-segmentation/security systems** added to Fixture A (illustrative real products) | Complete — vendors public/illustrative; composite, not real procurement |
| 2026-05-21 | **ARENA innovation projects registered** as edge-case + architecture sources (VPP/DERMS/EV/V2G/microgrid, refs 52–56) in INTERNATIONAL_DATA_SOURCES.md | Complete — candidates; no edge-case fixture built yet |
| 2026-05-29 | **Synthetic skill compatibility evaluation** — `au-aescsf` and `au-energy-compliance` prompts/templates checked against Fixture A and Fixture B evidence anchors | Complete — see `EVAL_RESULTS.md` and `EVAL_SUMMARY_REPORT.md`; live generated artefact quality remains subject to human review |
| *Pending* | **Reviewer sign-off** — AESCSF-experienced assessor / SOCI compliance reviewer | Deferred until qualified human review of any generated compliance artefacts |

**Status:** Fixtures built, internally coverage-validated, and tested against the new `au-aescsf` and `au-energy-compliance` skill prompts/templates through deterministic fixture-coverage checks. Human reviewer sign-off remains the next step before relying on generated artefacts for external compliance decisions.

---

*Synthetic test data created for ArcKit `au-energy` recipe validation. All sources are public; no confidential or client information was used.*
