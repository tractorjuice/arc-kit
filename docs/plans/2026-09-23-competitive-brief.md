# ArcKit Competitive Brief: "Show Your Working", Q4 2026

> **Status:** draft for maintainer review. Built with the marketing plugin's competitive-brief method to test the messages in section 3 of `docs/plans/2026-09-22-marketing-strategy-q4.md`.
> **Research date:** 23 September 2026. Web sources, the Digital Marketplace (G-Cloud 15) and the UK Tenders MCP (Contracts Finder and Find a Tender, current to 21 September 2026). Treat vendor claims as the vendors' own words. Anything marked *unverified* could not be confirmed from a primary source.
> **Scope:** EA platforms (SAP LeanIX, Ardoq, Bizzdesign, Sparx EA, Orbus, Avolution ABACUS, Archi), AI-native spec tools (GitHub Spec Kit and the open-source Claude skills around it), generic AI used ad hoc (Microsoft 365 Copilot, ChatGPT Enterprise), and UK consultancies.

---

## 1. Executive Summary

In 2026 every major EA platform relaunched as "AI-first". Ardoq launched an "AI-First Enterprise Architecture Platform" on 28 May ([Ardoq](https://www.ardoq.com/news/ai-first-enterprise-architecture-platform)). SAP LeanIX now ships an EA AI Assistant, an AI Agent Hub and an MCP server ([LeanIX](https://www.leanix.net/en/blog/sap-leanix-2026-building-on-momentum)). Sparx has Kernaro AI and a free MCP server ([Sparx Japan](https://www.sparxsystems.jp/en/MCP/)). ArcKit's README still says none of them are "AI-Assisted", and that is now false. But all of their AI works on the **inventory**: what applications exist, what depends on what. None of them claims to produce the **assessment evidence** a UK architect has to take to a spend control, a service assessment, a TCoP review or a Secure by Design gate. That space is still open, and ArcKit is the only product in it.

**Biggest opportunity:** "Show your working" is unclaimed. It lines up exactly with what government is now asking of AI. GDS's Responsible AI Advisory Panel says "how hard it is to test and evaluate the outputs of large language models" ([GDS blog, 18 June 2026](https://gds.blog.gov.uk/2026/06/18/update-from-the-gds-responsible-ai-advisory-panel/)). The AI Playbook requires "meaningful human control at the right stage" and "the right assurance in place" ([GOV.UK](https://gov.uk/government/publications/ai-playbook-for-the-uk-government/artificial-intelligence-playbook-for-the-uk-government-html)). ArcKit's citation markers, provenance stamping and public `ENFORCEMENT.md` answer that question directly. No competitor can say the same.

**Biggest threat:** the real competitor is not an EA vendor. It is an architect asking Microsoft 365 Copilot or ChatGPT for "a TCoP assessment" with no template. HMRC is moving from 32,000 to 50,000 Copilot licences ([Think Digital Partners](https://www.thinkdigitalpartners.com/news/2025/10/20/hmrc-launches-largest-government-copilot-rollout/)), and MoJ has given ChatGPT Enterprise to 2,500 staff ([The Register](https://www.theregister.com/2025/10/24/ministry_of_justice_chatgpt/)). Those tools are already approved and already paid for. Two lines of the current core message are also exposed: "the AI assistant you already use" (ArcKit does not run in Microsoft 365 Copilot chat, which is the assistant most civil servants have) and "never leaves your repository" (prompts do go to the model provider). A security reviewer will spot both. Section 7 has the fixes.

---

## 2. The Market in One Picture

### Positioning map

Axis X: **what the AI is grounded in**. Left is the organisation's live architecture inventory. Right is the governance frameworks the evidence is judged against.
Axis Y: **the cost of starting**. Top means a procurement exercise and a platform rollout. Bottom means nothing new to buy.

```text
                        New procurement / platform rollout
                                      |
      SAP LeanIX   Ardoq              |           UK consultancies
      Bizzdesign (Horizzon/Alfabet/   |           (Reply, Mastek, KPMG...)
      Hopex)   Orbus   ABACUS         |           £895–£1,862/day on G-Cloud 15
                                      |
  Inventory ------------------------- + -------------------------- Assessment
  (what exists)                       |                             evidence
                                      |                             (why it passes)
      Sparx EA (per-seat licence)     |
      Archi + MCP plugins (free)      |           ArcKit  <-- alone in this quadrant
      Spec Kit + extensions (free,    |
      code-focused)                   |           DIY: M365 Copilot / ChatGPT
                                      |           (free at the point of use,
                                      |           no templates, no traceability)
                        Nothing new to buy
```

The bottom-right quadrant is where ArcKit sits. Its only other occupant is DIY prompting, which has no structure. The campaign should hold that quadrant and not drift up and left into "AI-powered EA platform", where five funded vendors and Gartner Magic Quadrant Leaders already fight.

### Where UK public money actually goes on EA tools

Recent award notices (UK Tenders MCP; verify on the official notice before quoting):

| Buyer | What | Supplier | Value | Notice |
|---|---|---|---:|---|
| Companies House | EA modelling tool | Phoenix Software (reseller, tool not named) | £429,321 | [Contracts Finder](https://www.contractsfinder.service.gov.uk/Notice/25832ef4-0195-4374-95fa-f9a193111fe6) (Sep 2026) |
| UK SBS (for UKRI) | EA tool licences, G-Cloud 14 | Bruhati Solutions (Bizzdesign/Ardoq reseller) | £299,800 | [Contracts Finder](https://www.contractsfinder.service.gov.uk/Notice/95f49239-aa1a-4d60-b636-63882869b3ef) |
| UK SBS | EA tool, G-Cloud 13 (varied 2026) | Ardoq UK | £371,217.85 | [Contracts Finder](https://www.contractsfinder.service.gov.uk/Notice/469a7f78-97c5-4fa5-9b53-5586b6a79a88) |
| Ofgem | "AI-powered" EA and transformation platform | Bizzdesign UK | £304,824 | [Contracts Finder](https://www.contractsfinder.service.gov.uk/Notice/422c5cbb-30ba-4f3f-a690-5be9500534c5) |
| FCA | EA software services | Bizzdesign UK | £135,672 | [Contracts Finder](https://www.contractsfinder.service.gov.uk/Notice/3d072792-0d3c-4d36-b657-1102c0176680) |
| Sheffield City Council | TOGAF toolset and repository | Bizzdesign UK | £81,610 | [Contracts Finder](https://www.contractsfinder.service.gov.uk/Notice/fd727c83-50d4-4189-af76-1deec9944c38) |
| NHS Property Services | EA tool, G-Cloud 14 direct award | Bizzdesign UK | £78,420 | [Contracts Finder](https://www.contractsfinder.service.gov.uk/Notice/c3254337-779e-40e9-8e32-4f1c19696eb1) |
| Maritime and Coastguard Agency | EA tool renewal | Bizzdesign UK | £78,150 | [Contracts Finder](https://www.contractsfinder.service.gov.uk/Notice/bb7f53a4-711b-45da-a585-6a807e13ff7a) |
| Home Office | EA SaaS tool RFI (market engagement only) | — | — | [Find a Tender](https://www.find-tender.service.gov.uk/Notice/073068-2026) (Jul 2026) |
| NICE | EA consultancy to set up a central architecture function | Aire Logic | £98,070 | [Contracts Finder](https://www.contractsfinder.service.gov.uk/Notice/deec1993-5c19-4e65-a887-ad9d7e19124a) |
| Sport England | EA discovery, roadmap and governance model | Investigo | £199,625 | [Contracts Finder](https://www.contractsfinder.service.gov.uk/Notice/0f6ef8ec-4b7b-4b69-b308-e2ca2154d59d) |

**What this tells the campaign:** buying an EA tool is an £80k–£430k decision taken by a department, not by an individual architect, and Bizzdesign wins most of the visible UK public-sector awards. ArcKit cannot and should not compete for that line item. It can be the thing an architect uses **on top of** whatever the department bought, with no procurement at all. The Home Office RFI asks specifically about "security and data-handling approaches", which confirms that data handling is the first question any AI-adjacent architecture tool will face.

---

## 3. Competitor Profiles

### 3.1 SAP LeanIX

| | |
|---|---|
| **Positioning** | "Transform IT complexity into sustainable advantage". Now framed as "the governance backbone of SAP's Autonomous Enterprise" ([LeanIX 2026](https://www.leanix.net/en/blog/sap-leanix-2026-building-on-momentum); [SAP News, Sep 2026](https://news.sap.com/2026/09/autonomous-enterprise-business-transformation-management-solutions-sap-ai-agents-work-at-scale/)) |
| **Target buyer** | Head of EA / CIO in large enterprises, especially SAP estates. Application portfolio management and rationalisation |
| **AI story** | EA AI Assistant made of three agents that read PDFs and Confluence and update fact sheets. AI Agent Hub to inventory and govern AI agents and MCP servers. An MCP server for LeanIX data. An "enterprise knowledge repository" that stores approved principles and standards "that agents reason over" ([LeanIX EA assistant](https://www.leanix.net/en/blog/ea-ai-assistant); [LeanIX roadmap](https://roadmap.leanix.net/c/662-ai-agent-hub)) |
| **Pricing** | Quote-based, priced per application ([G-Cloud 15 listing via NTT Data](https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud/services/859243949047225)). Vendr reports a median contract of $58,456 a year ([Vendr](https://www.vendr.com/marketplace/leanix); third-party benchmark, US-centric) |
| **Procurement** | G-Cloud 15, through resellers and partners (NTT Data, Seren Delta "LeanIX as a Service") ([Digital Marketplace search](https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud/search?q=leanix)). LeanIX has announced G-Cloud availability itself ([LeanIX](https://www.leanix.net/en/company/press/sap-leanix-now-available-through-uk-government-g-cloud)) |
| **UK public sector** | UKHSA case study with partner CloudKubed ([LeanIX](https://www.leanix.net/en/download/case-study-cloudkubed-ukhsa)) |
| **Strong vs ArcKit** | Gartner MQ Leader five years running. Live, maintained inventory. SAP ecosystem pull. Governs AI agents themselves, a question departments are starting to ask |
| **Weak vs ArcKit** | Nothing on TCoP, Service Standard, Secure by Design, Green Book or Orange Book. AI updates fact sheets rather than writing a business case or a DPIA. Price and procurement put it out of reach of a single team |

### 3.2 Ardoq

| | |
|---|---|
| **Positioning** | "AI-first Enterprise Architecture platform that turns fragmented data into decision intelligence". Claims "the only place that holds every connection between every application, capability, and dependency" ([Ardoq, 28 May 2026](https://www.ardoq.com/news/ai-first-enterprise-architecture-platform)) |
| **Messaging themes** | Automates "an estimated 40% of routine EA work". Agents "reason on live architecture data, not internet training data". Customer ROI (Tenneco, "292% ROI"). Five-time Gartner MQ Leader ([Business Wire](https://www.businesswire.com/news/home/20260528712753/en/Ardoq-Launches-AI-First-Enterprise-Architecture-Platform)) |
| **AI features** | Omnipresent AI Assistant (GA), AI Import Builder (GA), Custom Agents (open beta), MCP SSO, AI Semantic Search, Data Ingestion Agent ([Ardoq](https://www.ardoq.com/news/ai-first-enterprise-architecture-platform); [Ardoq spring 2026](https://www.ardoq.com/blog/new-agentic-ai-workforce-spring-2026)) |
| **Pricing** | Not published. The G-Cloud 15 listing offers a free trial, a two-week proof of value and tiered discounts of 0–35% by contract value ([G-Cloud 15](https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud/services/223908848280099)) |
| **Procurement** | G-Cloud 15, direct (Ardoq UK Limited) and through Bruhati ([search](https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud/search?q=ardoq)). Data is stored in the EEA and there is no government security clearance listed ([G-Cloud 15](https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud/services/223908848280099)) |
| **UK public sector** | HMCTS case study, BT Public Sector partnership page, UK SBS award ([Ardoq public sector](https://www.ardoq.com/blog/public-sector-technology); [Ardoq/BT](https://www.ardoq.com/industry/bt-public-sector-uk)) |
| **Strong vs ArcKit** | The clearest AI message in the category. Named ROI figures. Uses the same "grounded, not hallucinated" argument ArcKit wants to make. Custom Agents could in principle be pointed at TCoP |
| **Weak vs ArcKit** | Grounded in the *customer's* data, so it has no built-in knowledge of UK assessment frameworks. It is a SaaS repository, so evidence lives in Ardoq and not with the project's code and ADRs. The "40%" and "292%" figures are vendor claims, not independent measurements |

### 3.3 Bizzdesign (Horizzon, Alfabet, Hopex, Unify)

| | |
|---|---|
| **Positioning** | "Enterprise Transformation That Flows". After merging with MEGA and Alfabet it reports €110m revenue, 2,000+ organisations and 600+ staff ([Bizzdesign](https://bizzdesign.com/press-releases/bizzdesign-enters-2026-strengthened-market-position-and-ai-driven-vision-enterprise); [merger FAQ](https://bizzdesign.com/common-questions-bizzdesign-merger-enterprise-transformation/)) |
| **Target buyer** | ArchiMate/TOGAF practices. EA, strategic portfolio management and GRC in one suite |
| **AI story** | "AI-powered Enterprise Transformation Suite". Reviewers say the AI "only provides a summary of information that is already in" Horizzon and is "not always accurate" ([PeerSpot](https://www.peerspot.com/products/bizzdesign-horizzon-reviews), user review). The G-Cloud 15 Horizzon listing makes no AI claims ([G-Cloud 15](https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud/services/357143140468321)) |
| **Pricing** | Not published. Free trial. UK awards run from £78k to £305k (table in section 2) |
| **Procurement** | G-Cloud 15 direct for all four products, plus Bruhati ([search](https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud/search?q=bizzdesign)). Supplier holds SC clearance, ISO 27001 and Cyber Essentials Plus |
| **UK public sector** | **The strongest of any EA vendor.** Visible awards at Ofgem, FCA, NHS Property Services, MCA and Sheffield City Council |
| **Strong vs ArcKit** | Incumbent across UK public bodies. Security credentials in the listing. ArchiMate depth. GRC module |
| **Weak vs ArcKit** | Its AI is the weakest of the leaders on the evidence available. No UK assessment templates. Heavy tool with a steep learning curve |

### 3.4 Sparx Systems Enterprise Architect (and Archi)

| | |
|---|---|
| **Positioning** | Modelling workhorse (UML, SysML, ArchiMate). Perpetual per-seat licences |
| **AI story** | Kernaro AI turns "complex EA models into clear, conversational insights" ([Sparx search result](https://kernaro.sparxsystems.com/); page returned 403, so this is *unverified beyond the search snippet*). An AI Assist add-in. A free MCP server, reported as incompatible with EA 17.2 ([Sparx Japan MCP](https://www.sparxsystems.jp/en/MCP/)). Community MCP servers exist ([mm6502](https://github.com/mm6502/enterprise-architect-mcp)) |
| **Pricing** | About $229–$750 per licence depending on edition, as reported by third parties ([TrustRadius](https://www.trustradius.com/products/sparx-systems-enterprise-architect/pricing); [Sparx shop](https://sparxsystems.com/products/ea/shop/)) |
| **Procurement** | G-Cloud 15 through resellers (Maiar, Pancontext) ([search](https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud/search?q=sparx+enterprise+architect)). Widely used by defence and consultancies (Envitia, Civica and AtkinsRéalis listings name it) |
| **Archi** | Free, open source, "probably the most popular ArchiMate modelling tool", about 6,000 downloads a month ([Archi](https://www.archimatetool.com/)). Community MCP plugins now let any AI assistant read and edit Archi models ([jgs-archi-mcp](https://github.com/jgsystemsconsulting/jgs-archi-mcp)) |
| **Strong vs ArcKit** | Cheap or free, already installed, modelling rigour, MCP means an assistant can reach the model |
| **Weak vs ArcKit** | They are modelling tools, not governance-document tools. No templates for TCoP, DPIA or SOBC |
| **Implication** | Sparx and Archi users are **allies, not rivals**. An architect with Archi plus ArcKit gets models plus evidence. Worth a "use ArcKit with Archi" article |

### 3.5 Orbus (OrbusInfinity, formerly iServer365) and Avolution ABACUS

| | Orbus | Avolution ABACUS |
|---|---|---|
| **Positioning** | EA, portfolio, process and GRC "embedded in Microsoft 365" ([Orbus](https://www.orbussoftware.com/iServer365)) | "Move from static documentation to dynamic, automated, and outcome-linked architecture" ([Avolution](https://www.avolutionsoftware.com/our-resources/gartner-hype-cycle-for-enterprise-architecture-2026/)) |
| **AI story** | "AI tools that accelerate the impact of every architect". No named copilot product found (*unverified*) | AI governance: maps AI initiatives to the EU AI Act, NIST AI RMF and DORA "with automated compliance scoring" ([Avolution AI governance](https://www.avolutionsoftware.com/abacus/ai-governance/)). Named a sample vendor for "Automated EA Governance" in Gartner's 2026 Hype Cycle |
| **Procurement** | Was on G-Cloud 14 ([service definition PDF](https://assets.applytosupply.digitalmarketplace.service.gov.uk/g-cloud-14/documents/700320/120212484439070-service-definition-document-2024-05-06-1900.pdf)). No direct G-Cloud 15 listing found. Consultancies list Orbus skills (*unverified whether Orbus relisted*) | G-Cloud 15, direct (Avolution UK) and through Insight Direct ([search](https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud/search?q=avolution+abacus)) |
| **UK public sector** | House of Commons named as a customer ([CB Insights](https://www.cbinsights.com/company/orbus-software/customers); third-party, *unverified by Orbus*) | No named UK public-sector customer found (*unverified*) |
| **Watch** | Microsoft 365 alignment: the same "use what you already have" argument ArcKit makes | "Automated EA governance" is the closest wording to ArcKit's category. It is framed around EU and US AI regulation, not UK assessment |

### 3.6 GitHub Spec Kit and the open-source AI-skill ecosystem

| | |
|---|---|
| **Positioning** | "Toolkit to help you get started with Spec-Driven Development". MIT. 138.4k stars and 12.4k forks as of today ([GitHub](https://github.com/github/spec-kit)). 30+ agent integrations ([MarkTechPost](https://www.marktechpost.com/2026/05/08/meet-github-spec-kit-an-open-source-toolkit-for-spec-driven-development-with-ai-coding-agents/)) |
| **Relationship** | ArcKit started out inspired by Spec Kit and is listed in its show-and-tell ([Discussion #887](https://github.com/github/spec-kit/discussions/887)). Spec Kit is aimed at developers and ends in code. ArcKit is aimed at architects and ends in governance evidence |
| **New in 2026** | A community extension catalogue with **Architecture Governance**, **Architecture Guard**, **Architecture Workflow**, **Security Review**, **adrkit** (ADRs) and quality-gate extensions. None mention UK government, DPIA or procurement ([catalogue](https://speckit-community.github.io/extensions/all-extensions); [adrkit](https://adrkit.dev/)). The maintainers "do not review, audit, endorse, or support the extension code" ([Spec Kit docs](https://github.github.io/spec-kit/community/extensions.html)) |
| **Adjacent** | Generic EA skills for Claude Code: TOGAF/ArchiMate/C4/arc42 ([gauravs19](https://github.com/gauravs19/enterprise-architecture-skill)), "world-class Enterprise Architect" skill ([rafalr100](https://github.com/rafalr100/enterprise-architect-skill)), ArchiMate/C4 plugin ([kristjanakkermann](https://github.com/kristjanakkermann/archimate-c4-plugin)) |
| **Strong vs ArcKit** | Brand (GitHub), about 60 times ArcKit's star count, the default mental model for "structured AI in the repo". Anyone could publish a "UK gov" extension in a weekend |
| **Weak vs ArcKit** | Code-centric. Extensions are unaudited and single-purpose. No traceability chain across stakeholders, requirements, design and stories. No UK framework content |
| **Implication** | "AI for enterprise architecture" as a generic promise is becoming a commodity. ArcKit's defensible ground is the UK assessment depth, the enforcement hooks, and 75 commands that connect to each other. Lead with those, not with "AI for EA" |

### 3.7 Generic AI, used ad hoc (the "do nothing" alternative)

| | |
|---|---|
| **What it is** | An architect opens Microsoft 365 Copilot or ChatGPT Enterprise and asks for "a TCoP assessment for our case management system" |
| **Footprint** | Cross-government Copilot pilot with 20,000 staff in 12 departments. HMRC rolling out 32,000 licences, rising to 50,000 in 2026. DBT published an evaluation ([Think Digital Partners](https://www.thinkdigitalpartners.com/news/2025/10/20/hmrc-launches-largest-government-copilot-rollout/); [DBT evaluation](https://digitaltrade.blog.gov.uk/2025/09/25/discover-dbts-m365-copilot-evaluation-report/)). MoJ has 2,500 ChatGPT Enterprise seats with UK data residency ([The Register](https://www.theregister.com/2025/10/24/ministry_of_justice_chatgpt/); [OpenAI](https://openai.com/index/the-next-chapter-for-uk-sovereign-ai/)) |
| **Price** | Already paid for. M365 Copilot is about £16.10 per user per month on annual commitment, as reported by a third party ([ExpertSure](https://www.expertsure.com/uk/ai-tools/microsoft-copilot-review/); *unverified against Microsoft's price list*). GitHub Copilot Business is $19 per user per month ([gptprompts.ai](https://gptprompts.ai/copilot-pricing); *third-party*) |
| **Messaging (implicit)** | "You already have it. It's approved. You did the training" (the 90-minute Copilot course plus "AI for All") |
| **Strong vs ArcKit** | Zero adoption friction. Security and information governance already cleared. Works in Word and Teams, where the documents are reviewed. Good enough for a first draft |
| **Weak vs ArcKit** | No template, so every output has a different structure. No citations back to the project's own requirements. No traceability between documents. No provenance record of what the model produced versus what a human edited. Output varies from person to person. That is exactly what GDS says is hard to evaluate. 17% of pilot users reported no time saving at all ([Think Digital Partners](https://www.thinkdigitalpartners.com/news/2025/10/20/hmrc-launches-largest-government-copilot-rollout/)) |
| **Critical nuance** | ArcKit runs in **GitHub** Copilot (prompt files in VS Code), not in **Microsoft 365** Copilot chat. Most civil servants who "have Copilot" have the Microsoft 365 one. The phrase "the AI assistant you already use" is only true for architects who have a coding assistant |

### 3.8 UK consultancies producing governance documents by hand

| | |
|---|---|
| **What they sell** | Architecture services and governance artefacts on G-Cloud 15 and DOS7. DOS7 went live on 30 January 2026 and merged DOS6 with Digital Specialists and Programmes ([GCA RM6263](https://www.gca.gov.uk/agreements/RM6263); [PublicTechnology](https://www.publictechnology.net/2026/02/09/business-and-industry/digital-outcomes-6-given-final-three-months-to-facilitate-a-seamless-crossover-to-new-framework/)) |
| **Price anchors** | Mastek "TOGAF Compliant EA Artefact Delivery", with "audit-ready documentation": £1,411–£1,862 a day UK, £551–£643 offshore ([G-Cloud 15](https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud/services/889136647878157)). Reply "Agentic Enterprise Architecture Function Establishment", with "embedded assurance and compliance agents": £895–£1,295 a day ([G-Cloud 15](https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud/services/978063163737974)). Large awards: KPMG £8.1m for MOD architecture and design baseline ([FTS](https://www.find-tender.service.gov.uk/Notice/061979-2026)) |
| **Messaging** | "Audit-ready", "TOGAF compliance assurance", "architect oversight". Consultancies are now selling **AI-augmented** EA themselves (Reply) |
| **Strong vs ArcKit** | Accountability (a named supplier signs the work). Security clearance. Relationships. They know the assessors |
| **Weak vs ArcKit** | Cost. Method is opaque: the client gets a document, not the reasoning. Knowledge leaves when the contract ends. Neither the Reply nor the Mastek listing mentions TCoP or the Service Standard |
| **Implication** | Consultancies are both the competitor and the channel. The secondary audience in the strategy is right. Pitch ArcKit as the way a supplier **shows its working to the client**, and leaves a repository behind at handover |

---

## 4. Messaging Comparison Matrix

| Dimension | ArcKit (current draft) | SAP LeanIX | Ardoq | Bizzdesign | Spec Kit | DIY Copilot/ChatGPT | Consultancies |
|---|---|---|---|---|---|---|---|
| **Headline** | "Show your working" | "Transform IT complexity into sustainable advantage" | "AI-first EA platform… decision intelligence" | "Enterprise Transformation That Flows" | "Spec-Driven Development" | (implicit) "You already have it" | "Audit-ready", "architect oversight" |
| **Target buyer** | UK public-sector lead/principal/EA | CIO, head of EA, SAP estates | Head of EA, transformation office | EA practice (ArchiMate) | Developers | Every civil servant | SRO, programme director |
| **Villain** | Documentation load, and AI you can't defend | IT complexity, spreading AI agents | Fragmented data | Silos between strategy and change | Vibe coding | Admin drudgery | Risk of failing assessment |
| **Hero** | The architect | The EA team as orchestrator | The platform's agents | The suite | The spec | The user | The consultant |
| **AI grounded in** | Frameworks + project artefacts, with citations | Inventory + knowledge repository | "Live architecture data" | Repository content | The spec | General training data + tenant documents | Consultant judgement |
| **Proof style** | Open repos, ENFORCEMENT.md, release cadence | Gartner MQ, G2 badges | Gartner MQ, ROI %, named logos | Gartner, Forrester, revenue scale | Stars, contributor count | Government pilot data | Framework listings, case studies |
| **Price signal** | Free, MIT | ~$58k/yr median (Vendr) | Not published | £78k–£305k UK awards | Free, MIT | Already paid | £895–£1,862/day |
| **Tone** | Plain, practitioner | Corporate, SAP-strategic | Confident, ROI-led | Corporate, analyst-led | Developer-casual | — | Assurance-led |

**Read-across:**

1. **Every vendor now claims its AI is "grounded".** Ardoq says so outright. ArcKit's differentiator is not grounding. It is **what** the AI is grounded in (UK assessment frameworks plus the project's own artefacts) and **showing it** (a citation on every claim and a provenance block on every file).
2. **Nobody puts the architect in the hero role and gives them something to prove.** Vendors make the platform the hero. "Show your working" makes the architect the hero in front of the assessor. Keep that.
3. **Nobody publishes their limits.** No vendor publishes an equivalent of `ENFORCEMENT.md`, which says what is enforced in code and what is only asked of the model. That is the single most distinctive proof point ArcKit has. It is under-used in the current messages.

---

## 5. Content Gap Analysis

| Topic / format | ArcKit | EA vendors | Spec Kit | DIY | Gap / action |
|---|---|---|---|---|---|
| UK assessment frameworks (TCoP, Service Standard, SbD, Green/Orange Book) | Deep (commands, templates, guides) | None found | None | Prompt lists on blogs | **ArcKit owns this. Amplify it** |
| "How to evaluate AI output" / AI Playbook alignment | `ENFORCEMENT.md`, evals (maintainer-facing) | Generic "trustworthy AI" pieces | None | GDS panel blog | **Gap nobody fills.** Write the plain-English piece (already planned for week 8. Bring it forward) |
| ROI and time-saved numbers | None (no telemetry) | Ardoq "40%", "292%" | "60–80% fewer rework cycles" (community-reported) | DBT and cross-government pilot data | **ArcKit's weakest point.** Get opt-in, stopwatch-timed numbers from pilot workshops |
| Named UK public-sector case studies | None | Ardoq (HMCTS), LeanIX (UKHSA) | n/a | Government pilot reports | The campaign's main goal. It is right |
| Analyst recognition | None | Gartner MQ, Forrester, Constellation | n/a | n/a | Don't chase. Use the GDS/AI Playbook alignment as the "authority" instead |
| Side-by-side "same prompt, with and without" | None | None | None | n/a | **New piece: the strongest content against DIY** |
| Working with existing EA tools | README says they aren't AI-assisted (outdated) | Each says it is the single source of truth | n/a | n/a | New piece: "ArcKit alongside Bizzdesign/Archi/LeanIX" |
| Webinars / live demos | Office hours planned | Heavy (monthly) | Community streams | n/a | Parity once office hours start |
| Public example outputs | 22 public test repos | Demo tenants behind a form | Sample specs | n/a | **ArcKit advantage.** Link a real artefact from every post |

**SEO and search observations (not tool-measured, based on search results seen today):** "enterprise architecture tools 2026" returns vendor and listicle pages (Catio, Superblocks, Gartner Peer Insights). ArcKit does not appear. "TCoP assessment template" and "Service Standard assessment preparation" are the terms ArcKit can realistically rank for. The week-5 article *"What an assessor actually asks for"* targets the right intent.

---

## 6. Opportunities and Threats

### Opportunities (positioning gaps nobody has claimed)

1. **"Assessment evidence" as a category.** Vendors sell inventory, consultancies sell hours, and DIY produces drafts. Nobody sells the defensible evidence pack. Claim it in plain words: *governance evidence*, not *EA tool*.
2. **"Show your working" as the answer to government's AI-assurance question.** The GDS panel and the AI Playbook (principles 4 and 10) are asking how AI output can be checked. ArcKit's citations, provenance and published limits answer that. Anchoring on the Playbook borrows its authority without claiming endorsement.
3. **Complement, don't replace.** Bizzdesign holds most of the UK public-sector estate. Position ArcKit as working **alongside** the department's EA repository: the repository records what exists, and ArcKit makes the case for the change. This removes the "we already bought Bizzdesign" objection and lets architects adopt without asking anyone.
4. **Transparency of limits.** No vendor publishes what its AI cannot enforce. `ENFORCEMENT.md` is a trust asset for the security-minded buyer. Make it a headline proof point, not a footnote.
5. **Suppliers as the channel.** Reply and Mastek sell AI-augmented and "audit-ready" artefacts at £895–£1,862 a day. Suppliers who use ArcKit can show their client the working (citations, traceability) and leave a git repository behind. That is a differentiator *for them*, and it gives ArcKit the fast case studies the strategy needs.
6. **Open-source pedigree next to Spec Kit.** ArcKit is to architecture governance what Spec Kit is to code. Say it once, credit the lineage, and publish a Spec Kit extension or bridge so ArcKit shows up in the catalogue where developers look (strategic, not Q4).

### Threats

1. **Outdated claims undermine credibility.** The README comparison table marks LeanIX, Ardoq and Sparx as not "AI-Assisted". Any architect who has seen Ardoq's May launch will stop reading there. **Fix before the campaign launches.**
2. **"Never leaves your repository" is an overclaim.** ArcKit collects no telemetry, but prompt content goes to whichever model provider the assistant uses (Anthropic, OpenAI, Microsoft, Google). A departmental security reviewer or the Home Office-style "data-handling" question will catch this straight away, and a single challenge on LinkedIn would undercut the whole "AI you can defend" theme.
3. **"The AI assistant you already use" misfires for most civil servants.** Their assistant is Microsoft 365 Copilot chat, where ArcKit does not run. The claim is true for the growing minority with GitHub Copilot, Claude Code or Codex. Overclaiming here invites the reply "I tried, it's not in my Copilot".
4. **Generic EA skills commoditise "AI for EA".** Free Claude and Spec Kit skills for TOGAF, ArchiMate and ADRs are multiplying. Anything ArcKit says that a generic skill could also say (for example "generate ADRs with AI") is not a differentiator.
5. **Vendors could template UK frameworks.** Ardoq Custom Agents or LeanIX's knowledge repository could hold TCoP and Service Standard content. Bizzdesign has the UK installed base to do it. Nothing announced (*no evidence found*), but ArcKit's lead is content and connected workflow, not technology. Keep shipping.
6. **Consultancies selling "agentic EA".** Reply's listing uses the language ArcKit would use ("embedded assurance and compliance agents") with a named, cleared supplier behind it. For a risk-averse SRO, that beats a free tool with no named adopters. That is the campaign's reason for existing.
7. **"Assessor-ready" is unproven.** No assessor has said so publicly. Until a case study says it, the phrase is a claim a sceptical assessor could reject.

---

## 7. Recommended Messaging Changes

### 7.1 Core message

**Current:**
> Show your working. ArcKit turns the AI assistant you already use into an architecture governance harness that produces assessor-ready evidence, keeps it traceable, and never leaves your repository.

**Recommended:**
> **Show your working.** ArcKit gives your AI coding assistant the UK templates, traceability and checks to produce governance evidence you can defend in a review, with every claim cited and every artefact kept in your own repository.

What changed and why:

| Change | Reason |
|---|---|
| "the AI assistant you already use" → "your AI coding assistant" | Accurate for GitHub Copilot, Claude Code, Codex and Gemini. Avoids the Microsoft 365 Copilot misfire (threat 3) |
| "assessor-ready" → "evidence you can defend in a review" | Doesn't claim to speak for assessors (threat 7). Keeps the defensibility promise, which is the one competitors can't match |
| "never leaves your repository" → "every artefact kept in your own repository" | True as stated. Separates the artefacts (which stay in git) from the prompt traffic (governed by the assistant's own terms) (threat 2) |
| Adds "UK templates" and "every claim cited" | Names both differentiators against DIY and against the vendors in the core line |

### 7.2 Supporting messages

| # | Current | Recommended | Change |
|---|---|---|---|
| 1 | Speaks the assessor's language | **Built on the frameworks you're assessed against.** TCoP, Service Standard, NCSC CAF, Secure by Design, Green and Orange Book, G-Cloud and DOS7, as templates and commands. The major EA platforms don't ship these | Keep. Soften "assessor's language" to "frameworks you're assessed against". Update DOS to DOS7. Add the contrast with the EA platforms |
| 2 | AI you can defend in a review | **Same AI, with its working shown.** A plain Copilot or ChatGPT prompt gives you a draft. ArcKit gives you a draft with a citation on every claim, a provenance record, a traceability chain, and a public list of which rules are enforced in code and which aren't | **Promote to lead supporting message.** Aim it squarely at the DIY alternative. Anchor it to AI Playbook principles 4 and 10 (cite, don't claim endorsement) |
| 3 | No procurement, no telemetry, no lock-in | **Nothing new to buy, nothing sent to us.** Free and MIT licensed. If your department already allows GitHub Copilot, Claude Code, Codex or Gemini, there is nothing to procure. ArcKit collects no telemetry. What the model sees is covered by the assistant your department already approved | Makes the procurement claim conditional and true. Separates "sent to ArcKit" (nothing) from "sent to the model" (the approved assistant's terms). Put this wording verbatim in the landing-page FAQ |
| 4 | Built in the open, with public servants | **Built in the open, and shown in the open.** 22 public test repositories you can read before you install anything, 100+ releases, overlays contributed by practitioners | Lead with the *public outputs* (the working, literally), which the vendors keep behind demo forms. Keep "with public servants" only once named adopters confirm it |
| 5 | *(new)* | **Works alongside your EA repository.** Bizzdesign, LeanIX, Ardoq or Archi record what you have. ArcKit makes the case for what you change: the business case, the risk register, the TCoP review, the ADR | Defuses the incumbent objection. Invites architects in departments that already bought a platform |

### 7.3 Channel notes

- **LinkedIn "One artefact, 20 minutes" series:** keep, but show the *before* (a plain Copilot answer to the same prompt) next to the ArcKit output. The contrast carries message 2 without naming a vendor.
- **Never name a vendor negatively in public posts.** Save the comparisons for the battlecards and the FAQ. Public posts compare against "a blank prompt".
- **"20 minutes" claims:** only use a time you measured on a public test repo, and say which one. Pilot workshops should record opt-in, stopwatch-timed tasks so Q1 has a real number to set against Ardoq's "40%".

---

## 8. Battlecards

### 8.1 Generic AI (Microsoft 365 Copilot / ChatGPT Enterprise), the main competitor

| | |
|---|---|
| **Their claim (implicit)** | "We already have Copilot. I can just ask it for a TCoP assessment." |
| **Our response** | "You can, and you'll get a draft. What you won't get is a structure the assessor recognises, a citation back to your own requirements, a link to your risk register, or a record of what the AI wrote versus what you changed. ArcKit is the same kind of model, with its working shown." |
| **Proof point** | Put a plain-prompt TCoP output next to an ArcKit TCoP artefact from a public test repo (citations, traceability IDs, provenance block). `ENFORCEMENT.md` for what is enforced in code. GDS's own panel: LLM outputs are hard "to test and evaluate" ([GDS](https://gds.blog.gov.uk/2026/06/18/update-from-the-gds-responsible-ai-advisory-panel/)) |
| **Landmine to set** | "When an assessor asks where a statement in your document came from, how do you answer today?" |
| **Landmine to defuse** | "ArcKit doesn't run in my Copilot." Answer: "Right, it runs in GitHub Copilot in VS Code and in Claude Code, Codex and Gemini. If none of those is approved yet, the public test repos show the outputs, and office hours cover the approval conversation." |
| **We win when** | The team faces a formal gate (spend control, service assessment, SbD) and needs consistency across documents |
| **We lose when** | Only Microsoft 365 Copilot is approved and no one on the team uses a code editor |

### 8.2 Bizzdesign (the UK public-sector incumbent)

| | |
|---|---|
| **Their claim** | "Enterprise Transformation That Flows": one suite for EA, portfolio and GRC, used across UK public bodies |
| **Our response** | "Keep it. Bizzdesign is where your landscape lives. ArcKit is where you build the case for changing it, in the formats your spend-control and service assessors expect, versioned alongside your project." |
| **Proof point** | ArcKit commands for SOBC, TCoP, Service Standard, SbD and DPIA. No equivalent templates in the Horizzon G-Cloud 15 listing ([G-Cloud 15](https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud/services/357143140468321)) |
| **Landmine to set** | "Does your EA tool produce the business case and the TCoP review, or do those still get written in Word?" |
| **Landmine to defuse** | "Bizzdesign has SC clearance and ISO 27001, what do you have?" Answer: "ArcKit is software you run, not a service we host. There is no ArcKit service holding your data. Your artefacts sit in your repo, under your controls." |

### 8.3 Ardoq

| | |
|---|---|
| **Their claim** | "AI-first EA platform". Agents "reason on live architecture data, not internet training data". "40% of routine EA work" automated |
| **Our response** | "Ardoq's AI knows your landscape. ArcKit's knows the frameworks you're assessed against, and it cites the project's own artefacts for every claim. Different jobs. And with ArcKit, the evidence stays in your git repo, not in a SaaS tenant hosted in the EEA." |
| **Proof point** | Citation markers and provenance blocks in any public test repo. Ardoq's G-Cloud 15 listing gives data location as the EEA ([G-Cloud 15](https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud/services/223908848280099)) |
| **Landmine to set** | "Where does the AI's output live, and can you diff it against last month's version?" |
| **Landmine to defuse** | "Ardoq has ROI numbers, you have none." Answer: "True. We don't track users, by design. Our pilot teams are timing real tasks this quarter, and every output is public for you to judge now." |

### 8.4 SAP LeanIX

| | |
|---|---|
| **Their claim** | Governance backbone for the autonomous enterprise. AI Agent Hub, EA AI Assistant, MCP server |
| **Our response** | "LeanIX governs your application and agent portfolio. ArcKit produces the governance documents for a single change: requirements, risks, the business case, the assessments. It's free, so it doesn't need to replace anything." |
| **Proof point** | Vendr median of about $58k a year (third-party) against £0. 75 commands mapped to UK frameworks |
| **Landmine to set** | "How long from 'we need a SOBC' to a draft the SRO can read?" |

### 8.5 Sparx EA and Archi (modelling tools)

| | |
|---|---|
| **Their claim** | Rigorous modelling (ArchiMate, UML). Now reachable by AI through MCP |
| **Our response** | "Use both. Model in Sparx or Archi. Write the evidence with ArcKit. The Wardley suite and diagrams-as-code cover what the modelling tools don't." |
| **Proof point** | ArcKit Mermaid/PlantUML C4 output, the Wardley suite, and the community Archi MCP plugins ([jgs-archi-mcp](https://github.com/jgsystemsconsulting/jgs-archi-mcp)) |
| **Action** | Treat these users as a recruitment pool, not as a rival camp |

### 8.6 GitHub Spec Kit (and generic EA skills)

| | |
|---|---|
| **Their claim** | Spec-driven development, 138k stars, 30+ agents, and a catalogue with "Architecture Governance" and "Architecture Guard" extensions |
| **Our response** | "Spec Kit governs the code. ArcKit governs the decision to build it, and the evidence that it was the right decision. Same open-source approach, same assistants, different stage of the lifecycle." |
| **Proof point** | ArcKit's traceability chain (stakeholders → requirements → design → stories), 75 connected commands, and UK framework content absent from the Spec Kit catalogue ([catalogue](https://speckit-community.github.io/extensions/all-extensions)) |
| **Landmine to defuse** | "Can't I just install a Spec Kit governance extension?" Answer: "For code-level guardrails, yes. None of them produce a SOBC, a DPIA or a TCoP review, and the catalogue says the extensions are unaudited." |

### 8.7 UK consultancies

| | |
|---|---|
| **Their claim** | "Audit-ready", "TOGAF compliance assurance", and now "agentic EA" with architect oversight, at £895–£1,862 a day |
| **Our response (to buyers)** | "Keep your supplier's judgement. Ask them to show their working. Artefacts with citations and traceability, handed over as a repository you keep." |
| **Our response (to suppliers)** | "ArcKit lets you show the client how you reached each conclusion, and leave a repository behind at handover. That is a differentiator in your next G-Cloud or DOS7 bid." |
| **Proof point** | `arckit-uk-gcloud` overlay, `arckit-fde` plugin, and the G-Cloud 15 day rates above ([Mastek](https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud/services/889136647878157); [Reply](https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud/services/978063163737974)) |
| **Landmine to set (for buyers)** | "At the end of the contract, what do you get: a PDF, or the working behind it?" |

---

## 9. Recommended Actions

### Quick wins (prep week, before any public ask)

1. **Fix the README comparison table.** Replace "AI-Assisted ✅/❌" with rows that are true and still differentiate: "UK assessment templates (TCoP, Service Standard, SbD, Green Book)", "Artefacts versioned in your git repo", "Citations and provenance on AI output", "Cost to start". Credit the vendors' AI where it exists. (Checked: `docs/index.html` does not repeat the table.)
2. **Adopt the rewritten core message and message 3 wording** (section 7) in the launch article and landing page. Add a landing-page FAQ entry, *"Does my data leave my machine?"*, that answers honestly: nothing goes to ArcKit, and prompts go to the model provider under your department's approved terms.
3. **Say which Copilot.** Everywhere the campaign says Copilot, write "GitHub Copilot".

### Strategic moves (during the quarter)

4. **Make the side-by-side the campaign's anchor asset.** One public test repo, one task (for example a TCoP review): the plain-prompt output next to the ArcKit output, annotated. Use it in the launch article, office hours #1 and the first LinkedIn post. It turns "show your working" from a slogan into something the reader can see.
5. **Bring the "AI you can defend" article forward from week 8 to week 3,** and frame it around the AI Playbook's principles 4 and 10 and the GDS panel's evaluation challenge. It is the piece no competitor can write.
6. **Add a "works alongside your EA tool" page and article** (Bizzdesign, LeanIX, Ardoq, Archi). It widens the audience to departments that already bought a platform, which on the award evidence is most of them.
7. **Measure time on task in the pilot workshops** (opt-in, stopwatch, public test repo). ArcKit needs one honest number to set against Ardoq's "40%" without breaking the no-telemetry promise.
8. **Supplier outreach script:** lead with "show your client your working" and the handover repository, not with cost saving. A supplier will not promote a tool that shrinks its day-rate hours.
9. **Monitor quarterly:** Ardoq Custom Agents and the LeanIX knowledge repository (for UK framework content), the Spec Kit catalogue (for a UK-government extension), Bizzdesign's AI releases, and the outcome of the Home Office EA-tool RFI.

---

## 10. Sources Not Verified or Worth Re-checking

- Kernaro AI description (Sparx page returned 403. Search snippet only).
- Orbus: no direct G-Cloud 15 listing found. The G-Cloud 14 listing is confirmed. The House of Commons customer claim is from CB Insights, not Orbus.
- Microsoft 365 Copilot UK price (£16.10) and GitHub Copilot Business ($19) are from third-party pricing pages.
- LeanIX median contract value is Vendr's benchmark (mostly US data).
- Ardoq's "40%" and "292% ROI" and Spec Kit's "60–80% fewer rework cycles" are vendor or community claims, not independent measurements.
- Sparx per-licence prices vary across third-party sites ($229–$750). Check the Sparx shop before quoting.
- Award values come from the UK Tenders MCP mirror of Contracts Finder and Find a Tender. Verify on the official notice before quoting publicly.

---

*Brief built with the marketing plugin's `competitive-brief` skill on 23 September 2026. Next full refresh: January 2027, alongside the campaign report. Refresh sooner if an EA vendor announces UK assessment templates.*
