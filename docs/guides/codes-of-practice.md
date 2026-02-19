# UK Government Codes of Practice — ArcKit Reference Guide

This guide maps HM Treasury and Cabinet Office codes of practice to ArcKit commands and artefacts. These publications — informally known as the "Rainbow of Books" — set expectations for evaluation, analytical quality, knowledge asset management, and commercial procurement across government.

---

## The Rainbow of Books

| Book | Publisher | Purpose | ArcKit Coverage |
|------|-----------|---------|-----------------|
| **Green Book** | HM Treasury | Appraisal and evaluation of policies, programmes, and projects | `/arckit:sobc` (5-case model), `/arckit:finops` |
| **Orange Book** | HM Treasury | Risk management principles and concepts | `/arckit:risk` (risk register) |
| **Magenta Book** | HM Treasury | Evaluation design — scoping, designing, and conducting evaluations | `/arckit:sobc` (benefits realisation), `/arckit:plan` |
| **AQuA Book** | HM Treasury / Analysis Function | Analytical quality assurance — producing robust analysis | `/arckit:analyze`, `/arckit:data-model` |
| **Rose Book** | GOTT | Knowledge asset management — identifying, protecting, and exploiting IP | `/arckit:strategy`, `/arckit:principles`, `/arckit:data-model` |

### Commercial Playbooks

| Playbook | Publisher | Purpose | ArcKit Coverage |
|----------|-----------|---------|-----------------|
| **Sourcing Playbook** | Cabinet Office | Procurement strategy, market assessment, should-cost modelling | `/arckit:dos`, `/arckit:sow`, `/arckit:evaluate` |
| **Consultancy Playbook** | Cabinet Office | When to use consultants, knowledge transfer, value for money | `/arckit:sow`, `/arckit:research` |
| **DDaT Playbook** | Cabinet Office | Digital procurement policy reforms, open standards, interoperability | `/arckit:dos`, `/arckit:tcop` |

---

## Magenta Book — Evaluation Design

The [Magenta Book](https://www.gov.uk/government/publications/the-magenta-book) provides guidance on designing and conducting evaluations of government policies and programmes.

### Key Concepts

| Concept | Description | ArcKit Artefact |
|---------|-------------|-----------------|
| **Theory of Change** | Logic model linking inputs → activities → outputs → outcomes → impact | `/arckit:sobc` (Strategic Case, benefits chain) |
| **Proportionality** | Match evaluation effort to spend, risk, and novelty | `/arckit:sobc` (Management Case) |
| **Process evaluation** | Assess how a programme is being implemented | `/arckit:service-assessment` |
| **Impact evaluation** | Assess whether the programme caused observed outcomes | `/arckit:sobc` (benefits realisation) |
| **Value-for-money evaluation** | Assess efficiency and cost-effectiveness | `/arckit:finops`, `/arckit:sobc` (Economic Case) |

### When to Apply

- **Discovery/Alpha**: Define evaluation questions and Theory of Change
- **Beta**: Establish baseline data and process evaluation
- **Live**: Conduct impact and value-for-money evaluations
- **Post-implementation**: Benefits realisation review

---

## AQuA Book — Analytical Quality Assurance

The [AQuA Book](https://www.gov.uk/guidance/the-aqua-book) provides guidance on producing quality analysis for government. It defines an analytical lifecycle and quality assurance roles.

### Analytical Lifecycle

| Stage | Description | ArcKit Artefact |
|-------|-------------|-----------------|
| **Scope** | Define the question and analytical approach | `/arckit:requirements` (analytical requirements) |
| **Design** | Select methods, data sources, assumptions | `/arckit:data-model` (data sources, quality) |
| **Conduct** | Perform the analysis | `/arckit:analyze` |
| **Communicate** | Present findings clearly with caveats | `/arckit:analyze` (output document) |
| **Review** | Independent assurance of the analysis | `/arckit:hld-review` (peer review pattern) |

### QA Roles

| Role | Responsibility |
|------|---------------|
| **Commissioner** | Defines the question and approves the approach |
| **Analyst** | Conducts the analysis and documents methodology |
| **Analytical Assurer** | Independent review of quality and fitness for purpose |

### Verification vs Validation

- **Verification**: Is the analysis error-free? (correct calculations, code, data handling)
- **Validation**: Is the analysis fit for purpose? (answers the right question, appropriate method)

---

## Rose Book — Knowledge Asset Management

The [Rose Book](https://www.gov.uk/government/publications/knowledge-asset-management-in-government) (v2, March 2024) provides guidance on identifying, valuing, and managing knowledge assets in government.

### Five Knowledge Asset Categories

| Category | Examples | ArcKit Touch Point |
|----------|---------|-------------------|
| **Research** | Publications, datasets, methodologies | `/arckit:data-model` (data assets) |
| **Data** | Databases, registers, statistical collections | `/arckit:data-model`, `/arckit:data-mesh-contract` |
| **Content** | Digital services, websites, apps | `/arckit:strategy` (digital assets) |
| **Software** | Code, algorithms, AI models | `/arckit:principles` (open source policy) |
| **IP / Know-how** | Patents, trademarks, trade secrets, expertise | `/arckit:principles` (IP/reuse principles) |

### Knowledge Asset Register

Projects creating significant knowledge assets should maintain a register covering:
- Asset description and category
- Owner and steward
- IP protection status (patent, copyright, open source)
- Valuation approach (market-based, cost-based, income-based)
- Exploitation pathway (licensing, spin-out, open publication, partnership)
- Reuse potential for other government departments

---

## Commercial Playbooks — Procurement

The [Sourcing and Consultancy Playbooks](https://www.gov.uk/government/publications/the-sourcing-and-consultancy-playbooks) set expectations for government procurement.

### Sourcing Playbook Key Actions

| Action | Description | ArcKit Artefact |
|--------|-------------|-----------------|
| **Market assessment** | Understand the supplier landscape and capability | `/arckit:research` (market research) |
| **Should-cost modelling** | Estimate realistic costs before procurement | `/arckit:sobc` (Financial Case) |
| **Outcome-based specs** | Define what, not how — focus on outcomes | `/arckit:dos` (outcome description), `/arckit:sow` |
| **Social value** | Minimum 10% weighting in evaluation | `/arckit:evaluate` (evaluation criteria) |
| **SME access** | Ensure opportunities are accessible to SMEs | `/arckit:dos` (lot structure) |
| **KPIs and contract management** | Define measurable performance indicators | `/arckit:sow` (SLA and acceptance criteria) |

### DDaT Playbook Policy Reforms

| Reform | Description | ArcKit Artefact |
|--------|-------------|-----------------|
| **Open standards** | Use open data and interface standards | `/arckit:principles`, `/arckit:tcop` |
| **Interoperability** | Avoid lock-in, ensure portability | `/arckit:hld-review` |
| **Modular contracting** | Break large programmes into smaller contracts | `/arckit:dos` (lot structure) |
| **User-centred** | Procurement driven by user needs | `/arckit:requirements`, `/arckit:service-assessment` |

---

## Delivery Lifecycle Mapping

| Phase | Applicable Books | Key ArcKit Commands |
|-------|-----------------|---------------------|
| **Strategy & Discovery** | Green Book, Magenta Book (evaluation questions), Sourcing Playbook (market assessment) | `/arckit:sobc`, `/arckit:research`, `/arckit:stakeholders` |
| **Alpha** | AQuA Book (analytical design), Rose Book (asset identification), DDaT Playbook | `/arckit:analyze`, `/arckit:principles`, `/arckit:dos` |
| **Beta** | Magenta Book (baseline data), AQuA Book (QA review), Sourcing Playbook (procurement) | `/arckit:evaluate`, `/arckit:sow`, `/arckit:data-model` |
| **Live** | Magenta Book (impact evaluation), Orange Book (ongoing risk), Commercial Playbooks (contract management) | `/arckit:finops`, `/arckit:risk`, `/arckit:operationalize` |
| **Post-implementation** | Green Book (benefits review), Magenta Book (VfM evaluation), Rose Book (exploitation) | `/arckit:sobc` (benefits realisation), `/arckit:strategy` |

---

## References

- [HM Treasury Green Book](https://www.gov.uk/government/publications/the-green-book-appraisal-and-evaluation-in-central-government)
- [HM Treasury Orange Book](https://www.gov.uk/government/publications/orange-book)
- [HM Treasury Magenta Book](https://www.gov.uk/government/publications/the-magenta-book)
- [AQuA Book](https://www.gov.uk/guidance/the-aqua-book)
- [Rose Book (Knowledge Asset Management)](https://www.gov.uk/government/publications/knowledge-asset-management-in-government)
- [Sourcing and Consultancy Playbooks](https://www.gov.uk/government/publications/the-sourcing-and-consultancy-playbooks)
- [Government Functional Standards](https://www.gov.uk/government/collections/functional-standards)
