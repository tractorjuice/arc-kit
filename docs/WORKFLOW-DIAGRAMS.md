# ArcKit Workflow Diagrams

This document contains Mermaid diagrams for the five ArcKit workflow paths, the Wardley Mapping suite, two community overlays and government code discovery.

Diagrams 1-6 and the Common Variations are drawn from [DEPENDENCY-MATRIX.md](DEPENDENCY-MATRIX.md), which takes each dependency from the inputs the command file lists. An arrow points from a document to a command that reads it.

**Legend**:

- **Blue boxes** = Foundation commands (Tier 0-1)
- **Green boxes** = Core workflow (Tier 2-7)
- **Orange boxes** = Design reviews & implementation (Tier 8-10)
- **Purple boxes** = Operations & quality (Tier 11-12)
- **Red boxes** = Compliance (Tier 13)
- **Gold boxes** = Project Story & Reporting (Tier 14)
- **Solid arrows (-->)** = the command needs that document (mandatory input)
- **Dotted arrows (-.->)** = the command works better with it (recommended input)

To keep the diagrams readable:

- Optional inputs aren't drawn.
- An arrow is left out when a longer route already connects the same two commands.
- Almost every command from Tier 5 on also reads principles and requirements, and many read stakeholders, risk and the SOBC. Those arrows are drawn only where a command reads nothing else in the diagram.
- Arrows only point forward. A command that also reads a later document when it exists, such as plan reading the requirements, can be re-run once that document is written.

---

## 1. Standard Project Path (Non-AI, Non-Government)

For private sector and non-UK government projects without AI components.

```mermaid
graph TD
    %% Tier 0
    principles[principles]
    plan[plan]
    %% Tier 1
    stakeholders[stakeholders]
    %% Tier 2
    risk[risk]
    %% Tier 3
    sobc[sobc]
    %% Tier 4
    requirements[requirements]
    %% Tier 5
    platform_design[platform-design]
    roadmap[roadmap]
    strategy[strategy]
    framework[framework]
    %% Tier 6
    data_model[data-model]
    dpia[dpia]
    research[research]
    datascout[datascout]
    wardley[wardley]
    diagram[diagram]
    adr[adr]
    data_mesh_contract[data-mesh-contract]
    %% Tier 7
    sow[sow]
    evaluate[evaluate]
    %% Tier 8
    hld_review[hld-review]
    dld_review[dld-review]
    %% Tier 9
    backlog[backlog]
    %% Tier 10
    trello[trello]
    %% Tier 11
    servicenow[servicenow]
    devops[devops]
    finops[finops]
    operationalize[operationalize]
    traceability[traceability]
    %% Tier 12
    analyze[analyze]
    %% Tier 13
    principles_compliance[principles-compliance]
    conformance[conformance]
    %% Tier 14
    story[story]

    principles -.-> plan
    principles -.-> stakeholders
    stakeholders --> risk
    stakeholders --> sobc
    risk -.-> sobc
    stakeholders --> requirements
    sobc -.-> requirements
    wardley -.-> platform_design
    wardley -.-> roadmap
    roadmap -.-> strategy
    strategy -.-> framework
    data_model -.-> framework
    requirements --> data_model
    data_model --> dpia
    requirements --> research
    data_model -.-> datascout
    research -.-> wardley
    requirements -.-> diagram
    requirements --> adr
    data_model -.-> data_mesh_contract
    research -.-> sow
    sow -.-> evaluate
    diagram -.-> hld_review
    sow -.-> hld_review
    data_model -.-> dld_review
    hld_review --> dld_review
    dld_review -.-> backlog
    backlog --> trello
    data_model -.-> servicenow
    diagram --> servicenow
    research -.-> devops
    diagram -.-> devops
    devops -.-> finops
    diagram --> operationalize
    servicenow -.-> operationalize
    adr -.-> traceability
    dld_review -.-> traceability
    data_model -.-> analyze
    traceability -.-> principles_compliance
    adr --> conformance
    devops -.-> conformance
    principles_compliance -.-> conformance
    roadmap -.-> story
    dpia -.-> story
    evaluate -.-> story
    backlog -.-> story
    servicenow -.-> story
    devops -.-> story
    traceability -.-> story
    analyze -.-> story

    style principles fill:#87CEEB
    style plan fill:#87CEEB
    style stakeholders fill:#87CEEB
    style risk fill:#90EE90
    style sobc fill:#90EE90
    style requirements fill:#90EE90
    style platform_design fill:#90EE90
    style roadmap fill:#90EE90
    style strategy fill:#90EE90
    style framework fill:#90EE90
    style data_model fill:#90EE90
    style dpia fill:#90EE90
    style research fill:#90EE90
    style datascout fill:#90EE90
    style wardley fill:#90EE90
    style diagram fill:#90EE90
    style adr fill:#90EE90
    style data_mesh_contract fill:#90EE90
    style sow fill:#90EE90
    style evaluate fill:#90EE90
    style hld_review fill:#FFA500
    style dld_review fill:#FFA500
    style backlog fill:#FFA500
    style trello fill:#FFA500
    style servicenow fill:#9370DB
    style devops fill:#9370DB
    style finops fill:#9370DB
    style operationalize fill:#9370DB
    style traceability fill:#9370DB
    style analyze fill:#9370DB
    style principles_compliance fill:#FF6B6B
    style conformance fill:#FF6B6B
    style story fill:#FFD700
```

**Duration**: 4-8 months
**Key Milestones**: SOBC Approval → Strategy/Requirements Sign-off → DPIA Complete → ADR Approved → Sprint 1 → Go Live

---

## 2. UK Government Project Path

For UK Government civilian departments (non-AI projects).

```mermaid
graph TD
    %% Tier 0
    principles[principles]
    plan[plan]
    %% Tier 1
    stakeholders[stakeholders]
    %% Tier 2
    risk[risk]
    %% Tier 3
    sobc[sobc]
    %% Tier 4
    requirements[requirements]
    %% Tier 5
    platform_design[platform-design]
    roadmap[roadmap]
    strategy[strategy]
    %% Tier 6
    data_model[data-model]
    dpia[dpia]
    research[research]
    datascout[datascout]
    wardley[wardley]
    diagram[diagram]
    adr[adr]
    data_mesh_contract[data-mesh-contract]
    %% Tier 7
    sow[sow]
    gcloud_search[gcloud-search]
    gcloud_clarify[gcloud-clarify]
    evaluate[evaluate]
    %% Tier 8
    hld_review[hld-review]
    dld_review[dld-review]
    %% Tier 9
    backlog[backlog]
    %% Tier 10
    trello[trello]
    %% Tier 11
    servicenow[servicenow]
    devops[devops]
    finops[finops]
    operationalize[operationalize]
    traceability[traceability]
    %% Tier 12
    analyze[analyze]
    %% Tier 13
    principles_compliance[principles-compliance]
    conformance[conformance]
    service_assessment[service-assessment]
    tcop[tcop]
    secure[secure]
    %% Tier 14
    story[story]

    principles -.-> plan
    principles -.-> stakeholders
    stakeholders --> risk
    stakeholders --> sobc
    risk -.-> sobc
    stakeholders --> requirements
    sobc -.-> requirements
    wardley -.-> platform_design
    wardley -.-> roadmap
    roadmap -.-> strategy
    requirements --> data_model
    data_model --> dpia
    requirements --> research
    data_model -.-> datascout
    research -.-> wardley
    requirements -.-> diagram
    requirements --> adr
    data_model -.-> data_mesh_contract
    research -.-> sow
    requirements --> gcloud_search
    gcloud_search --> gcloud_clarify
    sow -.-> evaluate
    gcloud_search -.-> evaluate
    diagram -.-> hld_review
    sow -.-> hld_review
    data_model -.-> dld_review
    hld_review --> dld_review
    dld_review -.-> backlog
    backlog --> trello
    data_model -.-> servicenow
    diagram --> servicenow
    research -.-> devops
    diagram -.-> devops
    devops -.-> finops
    diagram --> operationalize
    servicenow -.-> operationalize
    adr -.-> traceability
    dld_review -.-> traceability
    data_model -.-> analyze
    traceability -.-> principles_compliance
    tcop -.-> principles_compliance
    secure -.-> principles_compliance
    adr --> conformance
    devops -.-> conformance
    principles_compliance -.-> conformance
    devops -.-> service_assessment
    traceability -.-> service_assessment
    secure -.-> service_assessment
    diagram -.-> tcop
    dpia -.-> secure
    diagram -.-> secure
    roadmap -.-> story
    evaluate -.-> story
    backlog -.-> story
    servicenow -.-> story
    analyze -.-> story
    service_assessment -.-> story
    tcop -.-> story

    style principles fill:#87CEEB
    style plan fill:#87CEEB
    style stakeholders fill:#87CEEB
    style risk fill:#90EE90
    style sobc fill:#90EE90
    style requirements fill:#90EE90
    style platform_design fill:#90EE90
    style roadmap fill:#90EE90
    style strategy fill:#90EE90
    style data_model fill:#90EE90
    style dpia fill:#90EE90
    style research fill:#90EE90
    style datascout fill:#90EE90
    style wardley fill:#90EE90
    style diagram fill:#90EE90
    style adr fill:#90EE90
    style data_mesh_contract fill:#90EE90
    style sow fill:#90EE90
    style gcloud_search fill:#90EE90
    style gcloud_clarify fill:#90EE90
    style evaluate fill:#90EE90
    style hld_review fill:#FFA500
    style dld_review fill:#FFA500
    style backlog fill:#FFA500
    style trello fill:#FFA500
    style servicenow fill:#9370DB
    style devops fill:#9370DB
    style finops fill:#9370DB
    style operationalize fill:#9370DB
    style traceability fill:#9370DB
    style analyze fill:#9370DB
    style principles_compliance fill:#FF6B6B
    style conformance fill:#FF6B6B
    style service_assessment fill:#FF6B6B
    style tcop fill:#FF6B6B
    style secure fill:#FF6B6B
    style story fill:#FFD700
```

**Duration**: 6-12 months
**Key Milestones**: SOBC Approval → Strategy/Requirements Sign-off → DPIA Complete → G-Cloud Clarifications → Service Assessment → Go Live

---

## 3. UK Government AI Project Path

For UK Government projects with AI/ML components.

```mermaid
graph TD
    %% Tier 0
    principles[principles]
    plan[plan]
    %% Tier 1
    stakeholders[stakeholders]
    %% Tier 2
    risk[risk]
    %% Tier 3
    sobc[sobc]
    %% Tier 4
    requirements[requirements]
    %% Tier 5
    platform_design[platform-design]
    roadmap[roadmap]
    strategy[strategy]
    %% Tier 6
    data_model[data-model]
    dpia[dpia]
    research[research]
    datascout[datascout]
    wardley[wardley]
    diagram[diagram]
    adr[adr]
    data_mesh_contract[data-mesh-contract]
    %% Tier 7
    sow[sow]
    gcloud_search[gcloud-search]
    gcloud_clarify[gcloud-clarify]
    evaluate[evaluate]
    %% Tier 8
    hld_review[hld-review]
    dld_review[dld-review]
    %% Tier 9
    backlog[backlog]
    %% Tier 10
    trello[trello]
    %% Tier 11
    servicenow[servicenow]
    devops[devops]
    mlops[mlops]
    finops[finops]
    operationalize[operationalize]
    traceability[traceability]
    %% Tier 12
    analyze[analyze]
    %% Tier 13
    principles_compliance[principles-compliance]
    conformance[conformance]
    service_assessment[service-assessment]
    tcop[tcop]
    ai_playbook[ai-playbook]
    atrs[atrs]
    secure[secure]
    %% Tier 14
    story[story]

    principles -.-> plan
    principles -.-> stakeholders
    stakeholders --> risk
    stakeholders --> sobc
    risk -.-> sobc
    stakeholders --> requirements
    sobc -.-> requirements
    wardley -.-> platform_design
    wardley -.-> roadmap
    roadmap -.-> strategy
    requirements --> data_model
    data_model --> dpia
    requirements --> research
    data_model -.-> datascout
    research -.-> wardley
    requirements -.-> diagram
    requirements --> adr
    data_model -.-> data_mesh_contract
    research -.-> sow
    requirements --> gcloud_search
    gcloud_search --> gcloud_clarify
    sow -.-> evaluate
    gcloud_search -.-> evaluate
    diagram -.-> hld_review
    sow -.-> hld_review
    data_model -.-> dld_review
    hld_review --> dld_review
    dld_review -.-> backlog
    backlog --> trello
    data_model -.-> servicenow
    diagram --> servicenow
    research -.-> devops
    diagram -.-> devops
    ai_playbook -.-> mlops
    devops -.-> finops
    diagram --> operationalize
    servicenow -.-> operationalize
    adr -.-> traceability
    dld_review -.-> traceability
    data_model -.-> analyze
    traceability -.-> principles_compliance
    tcop -.-> principles_compliance
    secure -.-> principles_compliance
    adr --> conformance
    devops -.-> conformance
    principles_compliance -.-> conformance
    devops -.-> service_assessment
    traceability -.-> service_assessment
    secure -.-> service_assessment
    diagram -.-> tcop
    data_model -.-> ai_playbook
    ai_playbook -.-> atrs
    dpia -.-> secure
    diagram -.-> secure
    roadmap -.-> story
    evaluate -.-> story
    backlog -.-> story
    servicenow -.-> story
    analyze -.-> story
    service_assessment -.-> story
    tcop -.-> story
    atrs -.-> story

    style principles fill:#87CEEB
    style plan fill:#87CEEB
    style stakeholders fill:#87CEEB
    style risk fill:#90EE90
    style sobc fill:#90EE90
    style requirements fill:#90EE90
    style platform_design fill:#90EE90
    style roadmap fill:#90EE90
    style strategy fill:#90EE90
    style data_model fill:#90EE90
    style dpia fill:#90EE90
    style research fill:#90EE90
    style datascout fill:#90EE90
    style wardley fill:#90EE90
    style diagram fill:#90EE90
    style adr fill:#90EE90
    style data_mesh_contract fill:#90EE90
    style sow fill:#90EE90
    style gcloud_search fill:#90EE90
    style gcloud_clarify fill:#90EE90
    style evaluate fill:#90EE90
    style hld_review fill:#FFA500
    style dld_review fill:#FFA500
    style backlog fill:#FFA500
    style trello fill:#FFA500
    style servicenow fill:#9370DB
    style devops fill:#9370DB
    style mlops fill:#9370DB
    style finops fill:#9370DB
    style operationalize fill:#9370DB
    style traceability fill:#9370DB
    style analyze fill:#9370DB
    style principles_compliance fill:#FF6B6B
    style conformance fill:#FF6B6B
    style service_assessment fill:#FF6B6B
    style tcop fill:#FF6B6B
    style ai_playbook fill:#FF6B6B
    style atrs fill:#FF6B6B
    style secure fill:#FF6B6B
    style story fill:#FFD700
```

**Duration**: 9-18 months
**Key Milestones**: SOBC Approval → Strategy/Requirements Sign-off → DPIA Complete → G-Cloud Clarifications → AI Playbook Approval → ATRS Publication → Service Assessment → Go Live

**Critical Gates**:

- AI Playbook compliance required before Beta
- ATRS publication required before Live

---

## 4. MOD Defence Project Path

For Ministry of Defence projects (non-AI).

```mermaid
graph TD
    %% Tier 0
    principles[principles]
    plan[plan]
    %% Tier 1
    stakeholders[stakeholders]
    %% Tier 2
    risk[risk]
    %% Tier 3
    sobc[sobc]
    %% Tier 4
    requirements[requirements]
    %% Tier 5
    platform_design[platform-design]
    roadmap[roadmap]
    strategy[strategy]
    %% Tier 6
    data_model[data-model]
    dpia[dpia]
    research[research]
    datascout[datascout]
    wardley[wardley]
    diagram[diagram]
    adr[adr]
    data_mesh_contract[data-mesh-contract]
    %% Tier 7
    sow[sow]
    dos[dos]
    evaluate[evaluate]
    %% Tier 8
    hld_review[hld-review]
    dld_review[dld-review]
    %% Tier 9
    backlog[backlog]
    %% Tier 10
    trello[trello]
    %% Tier 11
    servicenow[servicenow]
    devops[devops]
    finops[finops]
    operationalize[operationalize]
    traceability[traceability]
    %% Tier 12
    analyze[analyze]
    %% Tier 13
    principles_compliance[principles-compliance]
    conformance[conformance]
    service_assessment[service-assessment]
    tcop[tcop]
    mod_secure[mod-secure]
    %% Tier 14
    story[story]

    principles -.-> plan
    principles -.-> stakeholders
    stakeholders --> risk
    stakeholders --> sobc
    risk -.-> sobc
    stakeholders --> requirements
    sobc -.-> requirements
    wardley -.-> platform_design
    wardley -.-> roadmap
    roadmap -.-> strategy
    requirements --> data_model
    data_model --> dpia
    requirements --> research
    data_model -.-> datascout
    research -.-> wardley
    requirements -.-> diagram
    requirements --> adr
    data_model -.-> data_mesh_contract
    research -.-> sow
    research -.-> dos
    sow -.-> evaluate
    dos -.-> evaluate
    diagram -.-> hld_review
    sow -.-> hld_review
    data_model -.-> dld_review
    hld_review --> dld_review
    dld_review -.-> backlog
    backlog --> trello
    data_model -.-> servicenow
    diagram --> servicenow
    research -.-> devops
    diagram -.-> devops
    devops -.-> finops
    diagram --> operationalize
    servicenow -.-> operationalize
    adr -.-> traceability
    dld_review -.-> traceability
    data_model -.-> analyze
    traceability -.-> principles_compliance
    tcop -.-> principles_compliance
    adr --> conformance
    devops -.-> conformance
    principles_compliance -.-> conformance
    dpia -.-> service_assessment
    devops -.-> service_assessment
    traceability -.-> service_assessment
    diagram -.-> tcop
    requirements --> mod_secure
    roadmap -.-> story
    evaluate -.-> story
    backlog -.-> story
    servicenow -.-> story
    analyze -.-> story
    service_assessment -.-> story
    tcop -.-> story
    mod_secure -.-> story

    style principles fill:#87CEEB
    style plan fill:#87CEEB
    style stakeholders fill:#87CEEB
    style risk fill:#90EE90
    style sobc fill:#90EE90
    style requirements fill:#90EE90
    style platform_design fill:#90EE90
    style roadmap fill:#90EE90
    style strategy fill:#90EE90
    style data_model fill:#90EE90
    style dpia fill:#90EE90
    style research fill:#90EE90
    style datascout fill:#90EE90
    style wardley fill:#90EE90
    style diagram fill:#90EE90
    style adr fill:#90EE90
    style data_mesh_contract fill:#90EE90
    style sow fill:#90EE90
    style dos fill:#90EE90
    style evaluate fill:#90EE90
    style hld_review fill:#FFA500
    style dld_review fill:#FFA500
    style backlog fill:#FFA500
    style trello fill:#FFA500
    style servicenow fill:#9370DB
    style devops fill:#9370DB
    style finops fill:#9370DB
    style operationalize fill:#9370DB
    style traceability fill:#9370DB
    style analyze fill:#9370DB
    style principles_compliance fill:#FF6B6B
    style conformance fill:#FF6B6B
    style service_assessment fill:#FF6B6B
    style tcop fill:#FF6B6B
    style mod_secure fill:#FF6B6B
    style story fill:#FFD700
```

**Duration**: 12-24 months
**Key Milestones**: SOBC Approval → Strategy/Requirements Sign-off → DPIA Complete → DOS Down-select → MOD Secure by Design Approval → Service Assessment → Go Live

**Critical Gates**:

- MOD Secure by Design (JSP 440, IAMM) required before Beta
- Security clearances required for team

---

## 5. MOD Defence AI Project Path

For Ministry of Defence projects with AI/ML components.

```mermaid
graph TD
    %% Tier 0
    principles[principles]
    plan[plan]
    %% Tier 1
    stakeholders[stakeholders]
    %% Tier 2
    risk[risk]
    %% Tier 3
    sobc[sobc]
    %% Tier 4
    requirements[requirements]
    %% Tier 5
    platform_design[platform-design]
    roadmap[roadmap]
    strategy[strategy]
    %% Tier 6
    data_model[data-model]
    dpia[dpia]
    research[research]
    datascout[datascout]
    wardley[wardley]
    diagram[diagram]
    adr[adr]
    data_mesh_contract[data-mesh-contract]
    %% Tier 7
    sow[sow]
    dos[dos]
    evaluate[evaluate]
    %% Tier 8
    hld_review[hld-review]
    dld_review[dld-review]
    %% Tier 9
    backlog[backlog]
    %% Tier 10
    trello[trello]
    %% Tier 11
    servicenow[servicenow]
    devops[devops]
    mlops[mlops]
    finops[finops]
    operationalize[operationalize]
    traceability[traceability]
    %% Tier 12
    analyze[analyze]
    %% Tier 13
    principles_compliance[principles-compliance]
    conformance[conformance]
    service_assessment[service-assessment]
    tcop[tcop]
    mod_secure[mod-secure]
    jsp_936[jsp-936]
    %% Tier 14
    story[story]

    principles -.-> plan
    principles -.-> stakeholders
    stakeholders --> risk
    stakeholders --> sobc
    risk -.-> sobc
    stakeholders --> requirements
    sobc -.-> requirements
    wardley -.-> platform_design
    wardley -.-> roadmap
    roadmap -.-> strategy
    requirements --> data_model
    data_model --> dpia
    requirements --> research
    data_model -.-> datascout
    research -.-> wardley
    requirements -.-> diagram
    requirements --> adr
    data_model -.-> data_mesh_contract
    research -.-> sow
    research -.-> dos
    sow -.-> evaluate
    dos -.-> evaluate
    diagram -.-> hld_review
    sow -.-> hld_review
    data_model -.-> dld_review
    hld_review --> dld_review
    dld_review -.-> backlog
    backlog --> trello
    data_model -.-> servicenow
    diagram --> servicenow
    research -.-> devops
    diagram -.-> devops
    data_model -.-> mlops
    devops -.-> finops
    diagram --> operationalize
    servicenow -.-> operationalize
    adr -.-> traceability
    dld_review -.-> traceability
    data_model -.-> analyze
    traceability -.-> principles_compliance
    tcop -.-> principles_compliance
    adr --> conformance
    devops -.-> conformance
    principles_compliance -.-> conformance
    dpia -.-> service_assessment
    devops -.-> service_assessment
    traceability -.-> service_assessment
    diagram -.-> tcop
    requirements --> mod_secure
    requirements --> jsp_936
    roadmap -.-> story
    evaluate -.-> story
    backlog -.-> story
    servicenow -.-> story
    analyze -.-> story
    service_assessment -.-> story
    tcop -.-> story
    mod_secure -.-> story
    jsp_936 -.-> story

    style principles fill:#87CEEB
    style plan fill:#87CEEB
    style stakeholders fill:#87CEEB
    style risk fill:#90EE90
    style sobc fill:#90EE90
    style requirements fill:#90EE90
    style platform_design fill:#90EE90
    style roadmap fill:#90EE90
    style strategy fill:#90EE90
    style data_model fill:#90EE90
    style dpia fill:#90EE90
    style research fill:#90EE90
    style datascout fill:#90EE90
    style wardley fill:#90EE90
    style diagram fill:#90EE90
    style adr fill:#90EE90
    style data_mesh_contract fill:#90EE90
    style sow fill:#90EE90
    style dos fill:#90EE90
    style evaluate fill:#90EE90
    style hld_review fill:#FFA500
    style dld_review fill:#FFA500
    style backlog fill:#FFA500
    style trello fill:#FFA500
    style servicenow fill:#9370DB
    style devops fill:#9370DB
    style mlops fill:#9370DB
    style finops fill:#9370DB
    style operationalize fill:#9370DB
    style traceability fill:#9370DB
    style analyze fill:#9370DB
    style principles_compliance fill:#FF6B6B
    style conformance fill:#FF6B6B
    style service_assessment fill:#FF6B6B
    style tcop fill:#FF6B6B
    style mod_secure fill:#FF6B6B
    style jsp_936 fill:#FF6B6B
    style story fill:#FFD700
```

**Duration**: 18-36 months
**Key Milestones**: SOBC Approval → Strategy/Requirements Sign-off → DPIA Complete → DOS Down-select → MOD Secure by Design + JSP 936 Approval → Service Assessment → Go Live

**Critical Gates**:

- MOD Secure by Design required before Beta
- JSP 936 AI assurance required before Beta
- Risk classification determines approval pathway:
  - **Critical**: 2PUS/Ministerial approval
  - **Severe/Major**: Defence-Level JROC/IAC approval
  - **Moderate/Minor**: TLB-Level approval

---

## 6. Wardley Mapping Suite

The Wardley Mapping suite provides a focused strategic analysis pipeline. Value chain decomposition feeds into map creation, which then branches into three parallel analysis tracks.

```mermaid
graph TD
    %% Tier 0
    principles[principles]
    %% Tier 1
    stakeholders[stakeholders]
    %% Tier 4
    requirements[requirements]
    %% Tier 5
    roadmap[roadmap]
    strategy[strategy]
    %% Tier 6
    wardley_value_chain[wardley.value-chain]
    wardley[wardley]
    wardley_doctrine[wardley.doctrine]
    wardley_gameplay[wardley.gameplay]
    wardley_climate[wardley.climate]

    principles -.-> stakeholders
    stakeholders --> requirements
    wardley -.-> roadmap
    roadmap -.-> strategy
    requirements --> wardley_value_chain
    wardley_value_chain -.-> wardley
    wardley -.-> wardley_doctrine
    wardley --> wardley_gameplay
    wardley_doctrine -.-> wardley_gameplay
    wardley_climate -.-> wardley_gameplay
    wardley --> wardley_climate

    style principles fill:#87CEEB
    style stakeholders fill:#87CEEB
    style requirements fill:#90EE90
    style roadmap fill:#90EE90
    style strategy fill:#90EE90
    style wardley_value_chain fill:#90EE90
    style wardley fill:#90EE90
    style wardley_doctrine fill:#90EE90
    style wardley_gameplay fill:#90EE90
    style wardley_climate fill:#90EE90
```

Colours follow the tier legend at the top of this page.

**Duration**: 1-3 weeks (within the Alpha phase)

---

## 7. Canada Federal Workflow

> ⚠️ **[COMMUNITY]** Canada Federal Overlay — community-contributed by @tractorjuice, recruiting Canadian federal domain co-maintainer. Output should be reviewed by qualified DOJ counsel, departmental Privacy Officer / ATIP coordinator, and security officer before reliance.

The Canada Federal Overlay ships 12 `ca-*` commands covering FITAA (Bill C-70 2024), Privacy Act PIA, ATIP reconciliation, Algorithmic Impact Assessment, Charter rights, ITSG-33, SOIA classified handling, sovereign cloud residency, GC Digital Standards, Official Languages Act, PSPC procurement, and OCAP® Indigenous data sovereignty. Two canonical execution chains apply depending on whether the system engages FITAA.

Both diagrams show the order the `ca-federal-fitaa` build recipe (`/arckit:build`) runs the commands in: an arrow means the command below runs after the one above. 7b is the same recipe without the FITAA-only commands.

### 7a. FITAA-class application (full overlay)

For systems that fall in scope of the Foreign Influence Transparency and Accountability Act — registration tooling, foreign-principal exposure, public-office-holder interactions — the canonical chain runs all 12 `ca-*` commands.

```mermaid
graph TD
    principles[principles]
    stakeholders[stakeholders]
    requirements[requirements]
    ca_charter[ca-charter]
    ca_pia[ca-pia]
    ca_fitaa[ca-fitaa]
    ca_atip[ca-atip]
    ca_aia[ca-aia]
    ca_ocap[ca-ocap]
    ca_itsg_33[ca-itsg-33]
    ca_soia[ca-soia]
    ca_cloud_residency[ca-cloud-residency]
    ca_ola[ca-ola]
    ca_gc_digital_standards[ca-gc-digital-standards]
    ca_pspc[ca-pspc]
    adr[adr]
    sobc[sobc]
    risk[risk]
    framework[framework]

    principles --> stakeholders
    stakeholders --> requirements
    requirements --> ca_charter
    requirements --> ca_pia
    ca_charter --> ca_fitaa
    ca_atip --> ca_fitaa
    ca_aia --> ca_fitaa
    ca_pia --> ca_atip
    ca_pia --> ca_aia
    ca_pia --> ca_ocap
    ca_pia --> ca_itsg_33
    ca_fitaa --> ca_soia
    ca_itsg_33 --> ca_soia
    ca_itsg_33 --> ca_cloud_residency
    ca_fitaa --> ca_ola
    requirements --> ca_gc_digital_standards
    ca_cloud_residency --> ca_pspc
    ca_ola --> adr
    ca_pspc --> adr
    sobc --> ca_pspc
    risk --> sobc
    ca_fitaa --> risk
    ca_itsg_33 --> risk
    ca_ola --> framework
    ca_gc_digital_standards --> framework
    ca_pspc --> framework

    style principles fill:#90EE90
    style stakeholders fill:#90EE90
    style requirements fill:#90EE90
    style ca_charter fill:#FFD700
    style ca_pia fill:#FFB347
    style ca_fitaa fill:#FF6961
    style ca_atip fill:#FFB347
    style ca_aia fill:#FFD700
    style ca_ocap fill:#9370DB
    style ca_itsg_33 fill:#87CEEB
    style ca_soia fill:#87CEEB
    style ca_cloud_residency fill:#87CEEB
    style ca_ola fill:#FFA07A
    style ca_gc_digital_standards fill:#FFA07A
    style ca_pspc fill:#FFA07A
    style adr fill:#90EE90
    style sobc fill:#90EE90
    style risk fill:#90EE90
    style framework fill:#90EE90
```

**Key:**

- **Green boxes** = Foundation inputs and standard cross-cutting outputs
- **Red box** = FITAA flagship (Bill C-70 2024 foreign-influence registration)
- **Orange boxes** = Privacy stream (Privacy Act PIA, ATIP reconciliation)
- **Gold boxes** = Charter rights and Algorithmic Impact Assessment
- **Purple box** = OCAP® First Nations data sovereignty (only when Indigenous data in scope)
- **Blue boxes** = Security stream (ITSG-33, SOIA, sovereign cloud residency)
- **Salmon boxes** = Service-side compliance and procurement (OLA, GC Digital Standards, PSPC)

### 7b. Generic federal Canadian application (no FITAA exposure)

For federal Canadian digital services that do not engage FITAA, drop `ca-charter` (run only if rights-engaging), `ca-fitaa`, and `ca-soia` (run only if classified leads in scope).

```mermaid
graph TD
    principles[principles]
    stakeholders[stakeholders]
    requirements[requirements]
    ca_pia[ca-pia]
    ca_atip[ca-atip]
    ca_aia[ca-aia]
    ca_ocap[ca-ocap]
    ca_itsg_33[ca-itsg-33]
    ca_cloud_residency[ca-cloud-residency]
    ca_ola[ca-ola]
    ca_gc_digital_standards[ca-gc-digital-standards]
    ca_pspc[ca-pspc]
    adr[adr]
    sobc[sobc]
    risk[risk]
    framework[framework]

    principles --> stakeholders
    stakeholders --> requirements
    requirements --> ca_pia
    ca_pia --> ca_atip
    ca_pia --> ca_aia
    ca_pia --> ca_ocap
    ca_pia --> ca_itsg_33
    ca_itsg_33 --> ca_cloud_residency
    ca_atip --> ca_ola
    ca_aia --> ca_ola
    requirements --> ca_gc_digital_standards
    ca_cloud_residency --> ca_pspc
    ca_ola --> adr
    ca_pspc --> adr
    sobc --> ca_pspc
    risk --> sobc
    ca_atip --> risk
    ca_aia --> risk
    ca_itsg_33 --> risk
    ca_ola --> framework
    ca_gc_digital_standards --> framework
    ca_pspc --> framework

    style principles fill:#90EE90
    style stakeholders fill:#90EE90
    style requirements fill:#90EE90
    style ca_pia fill:#FFB347
    style ca_atip fill:#FFB347
    style ca_aia fill:#FFD700
    style ca_ocap fill:#9370DB
    style ca_itsg_33 fill:#87CEEB
    style ca_cloud_residency fill:#87CEEB
    style ca_ola fill:#FFA07A
    style ca_gc_digital_standards fill:#FFA07A
    style ca_pspc fill:#FFA07A
    style adr fill:#90EE90
    style sobc fill:#90EE90
    style risk fill:#90EE90
    style framework fill:#90EE90
```

**Prerequisites**: Set `governance_framework: Canada Federal` and `classification_scheme: GC Security Categorization` in plugin userConfig before running. Each command's full guide is in [`docs/guides/`](guides/) (`ca-fitaa.md`, `ca-pia.md`, etc.).

**Duration**: 6-10 weeks for a full FITAA-class build (procurement and OLA streams run in parallel with security and privacy). 3-5 weeks for the generic federal path.

---

## 8. UAE Federal Workflow

For UAE federal entities, contracted suppliers, and CII operators, the `uae-federal-ai` build recipe (`/arckit:build`) runs the 12 `uae-*` commands between the standard inputs (principles, requirements, risk) and the cross-cutting outputs (sobc, wardley). The diagram shows that order: an arrow means the command below runs after the one above.

```mermaid
graph TD
    principles[principles]
    requirements[requirements]
    risk[risk]
    uae_classification[uae-classification]
    uae_pdpl[uae-pdpl]
    uae_ias[uae-ias]
    uae_cloud_residency[uae-cloud-residency]
    uae_uaepass[uae-uaepass]
    uae_zero_bureaucracy[uae-zero-bureaucracy]
    uae_digital_records[uae-digital-records]
    uae_data_sharing[uae-data-sharing]
    uae_priorities_alignment[uae-priorities-alignment]
    uae_ai_charter[uae-ai-charter]
    uae_ai_autonomy_tier[uae-ai-autonomy-tier]
    uae_procurement[uae-procurement]
    sobc[sobc]
    wardley[wardley]

    principles --> requirements
    requirements --> risk
    uae_priorities_alignment --> uae_classification
    uae_classification --> uae_pdpl
    risk --> uae_ias
    uae_classification --> uae_cloud_residency
    uae_priorities_alignment --> uae_uaepass
    uae_ias --> uae_zero_bureaucracy
    uae_uaepass --> uae_zero_bureaucracy
    uae_classification --> uae_digital_records
    uae_pdpl --> uae_data_sharing
    requirements --> uae_priorities_alignment
    risk --> uae_ai_charter
    uae_priorities_alignment --> uae_ai_charter
    uae_ai_charter --> uae_ai_autonomy_tier
    risk --> uae_procurement
    uae_priorities_alignment --> uae_procurement
    risk --> sobc
    requirements --> wardley

    style principles fill:#90EE90
    style requirements fill:#90EE90
    style risk fill:#90EE90
    style uae_classification fill:#FFB347
    style uae_pdpl fill:#FFB347
    style uae_ias fill:#FFB347
    style uae_cloud_residency fill:#FFB347
    style uae_uaepass fill:#87CEEB
    style uae_zero_bureaucracy fill:#9370DB
    style uae_digital_records fill:#9370DB
    style uae_data_sharing fill:#9370DB
    style uae_priorities_alignment fill:#9370DB
    style uae_ai_charter fill:#FFD700
    style uae_ai_autonomy_tier fill:#FFD700
    style uae_procurement fill:#FFA07A
    style sobc fill:#90EE90
    style wardley fill:#90EE90
```

**Key:**

- **Green boxes** = Foundation inputs and standard cross-cutting outputs
- **Orange boxes (light)** = UAE federal data and security (classification, PDPL, IAS, cloud residency)
- **Blue boxes** = UAE federal identity (UAE Pass)
- **Purple boxes** = UAE Cabinet instruments (Zero Bureaucracy, Digital Records, Data Sharing, National Priorities Alignment)
- **Gold boxes** = UAE AI governance (Charter, Autonomy Tier)
- **Salmon box** = UAE federal procurement (Decree-Law No. 11 of 2023)

**Prerequisites**: Set `governance_framework: UAE Federal` and `classification_scheme: UAE Smart Data` in plugin userConfig before running. Full overlay guide at [`docs/guides/uae-overlay.md`](guides/uae-overlay.md).

**Duration**: 4-8 weeks for a full federal pathfinder (the AI tier and procurement work runs in parallel with the data and security stream).

---

## 9. Government Code Discovery

For UK Government projects, run these commands during Alpha/Beta to check for reusable code before building from scratch. Uses the govreposcrape MCP server (no API key required).

```mermaid
graph TD
    principles[principles]
    stakeholders[stakeholders]
    requirements[requirements]
    gov_reuse[gov-reuse]
    gov_code_search[gov-code-search]
    gov_landscape[gov-landscape]

    requirements --> gov_reuse
    principles -.-> gov_reuse
    stakeholders -.-> gov_reuse
    requirements -. optional .-> gov_code_search
    requirements -. optional .-> gov_landscape

    style principles fill:#87CEEB
    style stakeholders fill:#87CEEB
    style requirements fill:#90EE90
    style gov_reuse fill:#90EE90
    style gov_code_search fill:#90EE90
    style gov_landscape fill:#90EE90
```

**Key:**

- **Dotted arrows marked optional** = the command reads the requirements if they exist
- No other command reads these reports yet, so carry what they find into research, the ADRs and the Wardley map yourself

**When to use:**

- Run `gov-code-search` first to find relevant existing code
- Run `gov-reuse` after requirements to assess specific reuse opportunities before build-vs-buy
- Run `gov-landscape` to understand the broader government code ecosystem for a domain

**Duration**: 0.5-2 days (before or during research phase)

---

## Command Dependency Legend

### Dependency Types in Diagrams

- **Solid arrows (-->)**: mandatory input in diagrams 1-6 and the Common Variations; "runs after" in the overlay diagrams (7 and 8), which follow their build recipes
- **Dotted arrows (-.->)**: recommended input; marked "optional" where a diagram shows an optional input

### Tier Groupings

| Tier | Phase | Commands |
|------|-------|----------|
| 0 | Foundation | start, plan, principles |
| 1 | Strategic Context | stakeholders |
| 2 | Risk Assessment | risk |
| 3 | Business Justification | sobc |
| 4 | Requirements | requirements |
| 5 | Strategic Planning & Synthesis | platform-design, roadmap, strategy, framework, glossary |
| 6 | Detailed Design | data-model, archify, data-mesh-contract, dpia, research, azure-research*, aws-research*, gcp-research*, datascout, gov-reuse†, gov-code-search†, gov-landscape†, grants, dfd, wardley, wardley.value-chain, wardley.doctrine, wardley.gameplay, wardley.climate, diagram, adr |
| 7 | Procurement | sow, dos, gcloud-search, gcloud-clarify, evaluate, score, tenders, competitors |
| 8 | Design Reviews | hld-review, dld-review |
| 9 | Implementation | backlog |
| 10 | Backlog Export | trello |
| 11-12 | Operations & Quality | servicenow, devops, finops, mlops (AI projects), operationalize, traceability, analyze, principles-compliance |
| 13 | Compliance | conformance, maturity-model, service-assessment, tcop, ai-playbook, atrs, secure, mod-secure, jsp-936 |
| 14 | Reporting | story, presentation |
| 15 | Publishing | pages |

> **\*** `azure-research` and `aws-research` are alternatives to `research` for cloud-specific projects. Each requires its respective MCP server.
> **datascout** discovers external data sources (APIs, datasets, open data portals). It reads the data model; neither data-model nor research reads its report, so carry its findings into them yourself.
> **†** `gov-reuse`, `gov-code-search`, and `gov-landscape` use the govreposcrape MCP server (no API key required) to search 24,500+ UK government repositories.

---

## Alternative View: Gantt Chart Format

For project planning purposes, here's a Gantt chart representation of a typical UK Government AI project. No task starts before a document it needs or recommends, apart from plan, stakeholders and risk, which you can re-run once the requirements exist:

```mermaid
gantt
    title UK Government AI Project Timeline (Typical 12-month project)
    dateFormat YYYY-MM-DD
    section Discovery (8 weeks)
    plan                    :a1, 2026-01-01, 1w
    principles              :a2, after a1, 1w
    stakeholders            :a3, after a2, 2w
    risk                    :a4, after a3, 2w
    sobc                    :a5, after a4, 2w
    section Alpha (12 weeks)
    requirements            :b1, after a5, 3w
    data-model              :b2, after b1, 2w
    datascout               :b2a, after b2, 1w
    ai-playbook             :b2b, after b2, 1w
    research                :b3, after b1, 2w
    wardley                 :b4, after b3, 2w
    adr                     :b4a, after b4, 1w
    diagram                 :b4b, after b4, 1w
    gcloud-search           :b5, after b3, 2w
    evaluate                :b6, after b5, 2w
    section Beta (20 weeks)
    hld-review              :c1, after b6, 2w
    dld-review              :c2, after c1, 2w
    backlog                 :c3, after c2, 1w
    Sprint 1-8              :c4, after c3, 16w
    section Live Prep (14 weeks)
    servicenow              :d1, after c4, 1w
    devops                  :d1a, after d1, 1w
    finops                  :d1b, after d1a, 1w
    mlops                   :d1c, after d1b, 1w
    operationalize          :d1d, after d1c, 1w
    traceability            :d2, after d1d, 1w
    tcop                    :d3, after d2, 1w
    secure                  :d3a, after d3, 1w
    atrs                    :d3b, after d3a, 1w
    analyze                 :d3c, after d3b, 1w
    principles-compliance   :d3d, after d3c, 1w
    conformance             :d3e, after d3d, 1w
    service-assessment      :d4, after d3e, 2w
    section Live
    Go Live                 :milestone, after d4, 0d
```

---

## Workflow Decision Tree

Use this decision tree to determine which workflow path to follow:

```mermaid
graph TD
    START[Start New Project] --> Q1{UK Government Project?}

    Q1 -->|No| Q2{AI/ML Components?}
    Q1 -->|Yes| Q3{MOD/Defence?}

    Q2 -->|No| W1[Standard Project Path]
    Q2 -->|Yes| W2[Standard AI Project Path<br/>Consider UK AI Playbook principles]

    Q3 -->|No| Q4{AI/ML Components?}
    Q3 -->|Yes| Q5{AI/ML Components?}

    Q4 -->|No| W3[UK Government Project Path]
    Q4 -->|Yes| W4[UK Government AI Project Path]

    Q5 -->|No| W5[MOD Defence Project Path]
    Q5 -->|Yes| W6[MOD Defence AI Project Path]

    style START fill:#87CEEB
    style W1 fill:#90EE90
    style W2 fill:#90EE90
    style W3 fill:#FFA500
    style W4 fill:#FF6B6B
    style W5 fill:#9370DB
    style W6 fill:#FF0000,color:#FFF
```

---

## Common Variations

### Fast-Track Path (Existing Architecture)

If architecture principles and governance already established:

```mermaid
graph LR
    %% Tier 4
    requirements[requirements]
    %% Tier 6
    data_model[data-model]
    research[research]
    %% Tier 7
    evaluate[evaluate]
    %% Tier 8
    hld_review[hld-review]
    dld_review[dld-review]
    %% Tier 9
    backlog[backlog]
    %% Tier 10
    trello[trello]

    requirements --> data_model
    requirements --> research
    research -.-> evaluate
    requirements --> hld_review
    data_model -.-> dld_review
    hld_review --> dld_review
    dld_review -.-> backlog
    backlog --> trello

    style requirements fill:#90EE90
    style data_model fill:#90EE90
    style research fill:#90EE90
    style evaluate fill:#90EE90
    style hld_review fill:#FFA500
    style dld_review fill:#FFA500
    style backlog fill:#FFA500
    style trello fill:#FFA500
```

**Duration**: 2-4 months
**Use When**: Enhancement to existing system, clear architecture patterns

### Compliance-Only Path

For auditing existing projects:

```mermaid
graph LR
    %% Tier 0
    principles[principles]
    %% Tier 4
    requirements[requirements]
    %% Tier 6
    adr[adr]
    %% Tier 12
    analyze[analyze]
    %% Tier 13
    principles_compliance[principles-compliance]
    conformance[conformance]
    service_assessment[service-assessment]
    tcop[tcop]
    secure[secure]

    principles -.-> requirements
    requirements --> adr
    requirements --> analyze
    tcop -.-> principles_compliance
    secure -.-> principles_compliance
    adr --> conformance
    principles_compliance -.-> conformance
    secure -.-> service_assessment
    requirements --> tcop
    requirements --> secure

    style principles fill:#87CEEB
    style requirements fill:#90EE90
    style adr fill:#90EE90
    style analyze fill:#9370DB
    style principles_compliance fill:#FF6B6B
    style conformance fill:#FF6B6B
    style service_assessment fill:#FF6B6B
    style tcop fill:#FF6B6B
    style secure fill:#FF6B6B
```

**Duration**: 2-4 weeks
**Use When**: Pre-assessment preparation, audit requirements

---

## Version

- **ArcKit Version**: 6.18.2
- **Document Date**: 2026-10-17
- **Based On**: DEPENDENCY-MATRIX.md (rebuilt 2026-10-17 from the command files) and the `ca-federal-fitaa` and `uae-federal-ai` build recipes
- **Commands Drawn**: 75
- **Key Changes**:
  - Diagrams 1-6 and the Common Variations redrawn from the dependency matrix. The old arrows mostly showed a suggested order: nearly three in four joined commands that don't read each other, or marked an input at the wrong level
  - Arrows now mean a mandatory input (solid) or a recommended input (dotted); the legend explains what is left out
  - Canada and UAE diagrams redrawn from their build recipes; the UAE diagram drops data-model and framework, which the recipe doesn't run
  - Government code discovery shows the commands' real inputs: no other command reads their reports
  - Gantt chart reordered so no task starts before a document it needs or recommends (apart from plan, stakeholders and risk); adds adr and diagram
  - Tier table adds start, archify, grants, tenders and competitors
- **Earlier Changes (1.3.0, 2026-03-16)**:
  - Added Wardley Mapping Suite workflow diagram (wardley.value-chain, wardley.doctrine, wardley.climate, wardley.gameplay)
  - Updated Tier 6 Detailed Design to include 4 new Wardley suite commands
  - Previous: Added conformance node to all 5 workflow paths (between principles-compliance and analyze)
  - Added conformance to Compliance-Only Path and Gantt chart
  - Updated Tier 13 Compliance to include conformance
  - Previous: Added missing style definitions for finops nodes in all workflow diagrams
  - Previous: Updated Tier Groupings table to include all 68 commands across 16 tiers
  - Previous: Added principles-compliance to Operations & Quality tier
