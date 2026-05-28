# ArcKit Business Plan

**Prepared:** 29 April 2026
**Repository:** [tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
**Founder/Maintainer:** Mark Craddock
**Current licence:** MIT (open source)
**Current stage:** Pre-revenue, post-traction
**Companion document:** [INVESTOR-REPORT.md](./INVESTOR-REPORT.md)

---

## 1. Executive Summary

ArcKit is The Enterprise Architecture Governance Harness — an open-source, AI-assisted toolkit covering strategy, architecture, delivery, and assurance. In ~6.5 months it has reached 1,702 GitHub stars, 201 forks, 100+ releases, and 358+ pull requests, with reported usage across the UK Government and NHS. It distributes 68 slash commands, 10 autonomous research agents and 70+ templates across six AI assistant ecosystems (Claude Code, Codex CLI, Gemini CLI, OpenCode CLI, GitHub Copilot, plus a Python CLI), reaching architects wherever they already work.

The commercial thesis is straightforward. ArcKit converts hours of architecture document drafting (requirements, business cases, risk registers, ADRs, Wardley Maps, RFP packs) into minutes of template-driven, audit-ready output that maps directly to HM Treasury Green/Orange Book, GDS Service Standard, NCSC CAF, the Technology Code of Practice, and G-Cloud/DOS procurement frameworks. The same workload is currently sold by Big 4 and tier-2 strategy houses at consulting margins. ArcKit makes that spend contestable.

This plan proposes a **per-organisation team licensing** model layered over a permanently-free open-source core, with steady-state ARR potential of £20–50 million over three to five years. A defensible central case for present-day enterprise value is **£20 million (financial investor) to £80 million (strategic acquirer)**, with a contested strategic auction capable of reaching £150 million+. The optimal path, given current market conditions, is to optimise for strategic visibility and a 18–36-month strategic exit.

---

## 2. Company & Product

### 2.1 What ArcKit is

ArcKit is a **template-driven, AI-native architecture governance toolchain**. Architects invoke slash commands inside their AI coding assistant; the toolkit reads project context, calls research agents (AWS, Azure, GCP, government code reuse, grants, market research), writes versioned, audit-traceable architecture artifacts, and maintains a forward chain of traceability from stakeholders → goals → requirements → data model → components → user stories.

### 2.2 Product surface today

| Asset | Count |
|---|---|
| Slash commands | 68 (officially maintained baseline) |
| Autonomous research agents | 10 |
| Document templates | 70+ |
| Command guides | 110+ |
| Bundled MCP servers | 5 (AWS Knowledge, Microsoft Learn, Google Developer Knowledge, Data Commons, govreposcrape) |
| Distribution formats | 6 (Claude plugin, Python CLI, Gemini extension, Codex extension, OpenCode extension, Copilot prompts) |
| Test/reference projects | 22 (NHS, HMRC, MOD, ONS, Cabinet Office, DSTL, Scottish Courts, etc.) |
| Compliance overlays | UK Gov default, EU AI Act, French CNIL, Australian Gov |

### 2.3 Defensible product moats

- **Multi-platform reach.** A single source command set is converted via `scripts/converter.py` to all six AI ecosystems. Adding the next AI assistant is a config entry, not a rewrite.
- **UK public-sector specialism.** Built-in mappings to GDS/TCoP/NCSC/Orange/Green Book/G-Cloud/DOS that competitors have not codified.
- **Citation traceability.** External documents are cited inline with `[DOC_ID-CN]` markers and an auto-maintained References register — a hard requirement for audit, and unusual in AI-generated architecture content.
- **Governance discipline as code.** Document Control headers, revision history, classification, review cycles, ADR/diagram numbering and stale-artifact monitoring are enforced in the toolchain rather than the user's discipline.

---

## 3. Market & Opportunity

The commercial market builds in three layers, all of which are reachable from the current product surface.

### 3.1 UK public sector (beachhead)

Approximately 1,500 reachable entities: ~25 main central government departments, ~600 arms-length bodies, ~400 local authorities, ~80 NHS trusts, plus regulators, agencies, and devolved-nation equivalents.

- 10% capture over 5 years × £30k average contract value = **£4.5m steady-state ARR**.
- Reference customers already exist informally (NHS, HMRC, MOD, ONS, Cabinet Office, DSTL, Scottish Courts) per third-party press coverage; converting to named, paying references is the immediate go-to-market priority.

### 3.2 International public sector

Australia, Canada, New Zealand, Ireland, and EU member states have analogous architectural governance needs and procurement structures. Anglophone first; EU follows with the French and Austrian regulatory overlays already in the codebase.

- Conservative TAM estimate: 4× UK public sector = **£18m ARR**.

### 3.3 Private-sector enterprise

The FTSE 350, Eurostoxx 600, and Forbes Global 1000 collectively represent ~1,500 enterprises with material architecture functions, of which ~500 carry governance overhead heavy enough to justify the tool. Banks, insurers, telcos, utilities, defence, large pharma and consumer goods all qualify.

- 10% capture × £50k ACV = **£25m ARR**.

### 3.4 Total addressable opportunity

**£20m–£50m steady-state ARR** over three to five years; midpoint £35m used as the planning anchor for valuation maths (§9).

---

## 4. Business Model

### 4.1 Open core + per-organisation licensing

The MIT-licensed core stays free. Commercial value is captured at the **organisation** level, matching Vanta and Drata, the two closest comparables.

| Tier | Customer profile | ACV |
|---|---|---|
| Small | <250 staff, single architecture function | £5,000 |
| Mid | 250–2,500 staff, multi-team architecture function | £15,000 |
| Large | 2,500+ staff, multi-business-unit | £50,000 |
| Central government dept | Portfolio of programmes | £100,000+ |

**Blended target ACV: £15,000–£25,000.**

### 4.2 What sits behind the paywall

- Hosted ArcKit Cloud (multi-tenant SaaS with project-level RBAC, SSO, audit log)
- Organisation-level governance overlay packs (UK Gov+, EU AI Act+, FedRAMP, Australian Gov+, sector-specific)
- Shared template library, custom template versioning, change approval workflows
- Cross-project portfolio dashboards and stale-artifact compliance monitoring at scale
- Enterprise support, SLA, training, custom MCP connectors

### 4.3 What stays free forever

- The 68 baseline slash commands, agents, and templates
- All six client distributions (plugin, extensions, CLI)
- Self-hosted single-user usage
- Community templates and overlays

This split mirrors the Confluence/Notion/GitLab pattern and is the lowest-friction conversion path given the existing community.

---

## 5. Go-to-Market

### 5.1 Phased GTM

**Phase 1 (Months 0–6) — Convert references.**
Convert the named informal users (NHS, HMRC, MOD, ONS, Cabinet Office, DSTL, Scottish Courts) into formal pilot customers with publishable case studies. Five named references unlock the entire UK public sector procurement motion.

**Phase 2 (Months 6–18) — UK public sector land-and-expand.**
G-Cloud / DOS framework listings; bid against the consulting alternative on cost and traceability; standardise on per-organisation pricing bands. Target: 25 paying public-sector organisations, ~£500k–£750k ARR.

**Phase 3 (Months 12–24) — International public sector.**
Australia and EU first, leveraging in-codebase overlays. Channel via local SI partners rather than direct sales. Target: 50 international public-sector logos.

**Phase 4 (Months 18–36) — Private-sector enterprise.**
Bottom-up developer/architect adoption already exists via the open-source channel; layer enterprise sales onto the inbound pipeline rather than building outbound from scratch. Target: 100 paying enterprises by month 36.

### 5.2 Marketing and visibility

The investor report identifies the visibility lever as load-bearing for a strategic exit. The maintenance plan continues:

- Weekly Medium publication (medium.com/arckit) and arckit.org content cadence
- Pursue a second GitHub trending appearance and category awards
- Convert the four-article investor essay arc (deliverable / visual wrap / £25k weekly cost / pricing) into a credible analyst narrative
- Mintlify-hosted product documentation moves from trial to production

### 5.3 Sales motion

- Year 1: founder-led, two part-time enterprise sellers
- Year 2: head of sales + 4 AEs, 2 SEs
- Year 3: full GTM team, 12 quota-carrying

---

## 6. Competition

| Competitor type | Examples | ArcKit position |
|---|---|---|
| Big 4 / strategy houses | Deloitte, EY, KPMG, PwC, Accenture, Capgemini | ArcKit displaces the deliverable. They are the disruption target, and a defensive acquirer category. |
| Governance/compliance SaaS | Vanta, Drata, OneTrust, Hyperproof | Adjacent product surfaces; ArcKit covers the architecture and procurement-readiness layer they don't. Natural product-extension acquirer category. |
| EA tooling incumbents | LeanIX (SAP), Ardoq, Sparx EA, BiZZdesign | Closed, repository-centric, non-AI-native. ArcKit is faster to value, AI-native, and ships free. |
| AI coding assistant native templates | GitHub Spec Kit, Cursor rules | Adjacent persona (developers, not architects); ArcKit explicitly cites Spec Kit as inspiration but covers a different lifecycle stage. |

The defensible differentiation is the **combination** of AI-native workflow, multi-assistant reach, codified UK public-sector compliance, and citation-grade traceability. No competitor today combines all four.

---

## 7. Operations & Team

### 7.1 Today

- Founder/maintainer: Mark Craddock
- Commit history shows 2 unique authors in the local clone — concentration risk explicitly flagged in §10
- 358+ inbound pull requests is the strongest available signal of latent contributor capacity

### 7.2 12-month commercial team build-out

| Role | Rationale |
|---|---|
| Head of Product | Translate community feedback into a roadmap that funds the commercial product without breaking the OSS core |
| Head of Sales | Owns the public-sector beachhead and frameworks listings |
| Head of Customer Success | Onboarding and renewal; renewal rate is the key SaaS metric for valuation |
| Backstop technical lead | Eliminates the single-founder discount factor for any future buyer |
| 2 senior engineers | Fund commercial features (RBAC, SSO, audit log, multi-tenant hosting) |
| Developer Advocate | Sustain community contribution velocity at commercial scale |

Total Year-1 team: founder + 7 hires.

### 7.3 24-month operating costs

| Line | Year 1 | Year 2 |
|---|---|---|
| Commercial team (7 hires) | £900k | £1.4m |
| Engineering (2 hires + founder) | £350k | £500k |
| GTM (events, marketing, content) | £150k | £300k |
| Hosted infrastructure | £100k | £250k |
| Legal, compliance, governance | £80k | £150k |
| **Total** | **~£1.6m** | **~£2.6m** |

---

## 8. Funding Plan

### 8.1 Seed round (immediate)

- **Raise:** £2.5m
- **Valuation:** £15–20m post-money (matches the financial-investor present-value floor in §9)
- **Use of funds:**
  - 60% commercial team build-out (Head of Sales, Head of CS, Head of Product, backstop tech lead)
  - 20% engineering (multi-tenant hosting, RBAC, SSO, audit log)
  - 15% GTM (G-Cloud listing, marketing, events)
  - 5% legal, governance, OSS-to-commercial transition counsel

### 8.2 Series A (Month 18–24, conditional)

- **Raise:** £8–12m
- **Trigger:** £1m+ ARR, 30+ paying organisations, two named central-government references
- **Use of funds:** International expansion (AUS, EU), private-sector enterprise sales, second-tier hosting investment

### 8.3 Capital efficiency note

ArcKit's category does not require venture capital to produce eight-figure exit values. A bootstrapped or founder-friendly strategic exit on the £30–80m range is achievable without a Series A if the team chooses speed over scale.

---

## 9. Financial Projections & Valuation

### 9.1 ARR ramp (planning case)

| Year | Paying orgs | Blended ACV | ARR |
|---|---|---|---|
| Year 1 | 25 | £20k | £0.5m |
| Year 2 | 100 | £22k | £2.2m |
| Year 3 | 350 | £25k | £8.8m |
| Year 4 | 800 | £27k | £21.6m |
| Year 5 | 1,400 | £25k | £35m |

### 9.2 Mature valuation (Year 5 anchor)

Applying the 8–15× ARR multiple range for governance/compliance SaaS in current market conditions:

- Conservative: £35m × 8 = **£280m**
- Central: £35m × 11 = **£385m**
- Stretch: £35m × 15 = **£525m**

### 9.3 Present-day valuation

Stacking standard pre-revenue discounts on the £400m mature midpoint (60% execution × 25% founder × 40% pre-revenue) lands a present-value range of **£15–40m**, central estimate **£20m** for a financial investor.

### 9.4 Strategic premium

Applying the 50–100% strategic premium range to the £20m financial floor lands a strategic-acquirer range of **£30–150m**, central estimate **£80m** in a normally-competitive process.

---

## 10. Risks & Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Single-founder concentration | High | Backstop tech lead and Head of Product hires in Year 1 |
| Open-source forkability | Medium-high | Trademark "ArcKit", reserve premium overlays/cloud features for commercial product, avoid Redis/Elastic-style licence whiplash |
| Zero current revenue | High | Convert 5 named informal users into paying pilots within 6 months — converts forward projections into evidence |
| OSS↔commercial governance tension | Medium | Public commercial roadmap, contributor licence agreement, transparent boundary between free and paid tiers |
| AI tooling regulatory exposure | Medium | EU AI Act overlay already shipped; track UK and US regimes; build disclosure tooling into the commercial product |
| Bus factor on test repos and community | Medium | Convert top external PR contributors into paid maintainers as Year-2 hires |
| Competitive entry by a governance SaaS vendor | Medium | The defensive moat is UK Gov compliance depth and citation traceability — both compoundable with continued investment |

---

## 11. Exit Strategy

### 11.1 Preferred path: strategic acquisition (18–36 months)

The market conditions identified in the pricing analysis favour a strategic exit:

- Governance/compliance SaaS category is consolidating (OneTrust PE auction is the leading signal)
- Public visibility curve is favourable (GitHub trending, accumulating press)
- Defensive interest from Big 4 is explicit — the published article arc makes the threat unambiguous

**Target buyer categories:**

1. Governance/compliance SaaS (Vanta, Drata, OneTrust, Hyperproof) — best product fit
2. Big 4 / strategy houses (Deloitte, EY, KPMG, PwC, Accenture) — defensive premium
3. Hyperscale cloud / AI tooling (Microsoft, AWS, Google, Anthropic, Salesforce) — ecosystem fit
4. Enterprise tooling consolidators (Atlassian, ServiceNow, IBM) — portfolio fit; IBM's HashiCorp acquisition at ~10× revenue is the precedent

**Target consideration:** £80–150m central case in a contested process.

### 11.2 Alternative path: independent ARR build to £35m+ and PE recap

If the strategic window closes or revenue traction outruns the visibility curve, a 3–5-year hold to £35m ARR followed by a PE recap or IPO at 8–15× lands the asset at **£280–525m EV**. Higher absolute return; longer time horizon; substantially more execution risk.

### 11.3 Decision criteria

Inflection-point review at Month 18:

- If ≥2 inbound strategic conversations have surfaced and ARR ≥£3m: optimise for strategic auction
- If ARR ≥£5m and no strategic interest: optimise for the independent-build path

---

## 12. Headline Numbers

> **£20m financial floor · £80m strategic central · £150m+ strategic stretch · £35m ARR steady-state · 1,702 stars · 68 commands · 10 agents · 6 AI platforms · MIT.**

---

## Sources

See [INVESTOR-REPORT.md §Sources](./INVESTOR-REPORT.md#sources) for the GitHub, Medium, Medevel, PyShine, and spec-kit references that anchor the traction figures, and [`articles/2026-04-28-pricing-arckit-investor.md`](./articles/2026-04-28-pricing-arckit-investor.md) for the comparable-company valuation working that anchors §9.
