# ArcKit Command Dependency Structure Matrix (DSM)

This matrix shows which commands depend on outputs from other commands.

**Legend:**

- **M** = MANDATORY dependency (command will fail without it)
- **R** = RECOMMENDED dependency (command works better with it)
- **O** = OPTIONAL dependency (command can use if available)
- **Empty** = No dependency

**Reading the Matrix:**

- **Rows** = Commands that produce outputs
- **Columns** = Commands that consume those outputs
- Example: If row "principles" has "R" in column "stakeholders", it means stakeholders RECOMMENDS having principles first

---

## Dependency Structure Matrix

Rows and columns cover the 63 core commands that read, or are read by, another command; the last two rows are the vendor designs ArcKit reviews but does not write. Levels come from the MANDATORY, RECOMMENDED and OPTIONAL inputs each command file lists. Where a command only says it reads something "if available", it is shown as O.

| PRODUCES → | plan | principles | stakeholders | risk | sobc | requirements | platform-design | roadmap | strategy | framework | glossary | data-model | archify | dpia | research | azure-research | aws-research | gcp-research | datascout | grants | gov-reuse | gov-code-search | gov-landscape | dfd | wardley.value-chain | wardley | wardley.doctrine | wardley.gameplay | wardley.climate | diagram | adr | data-mesh-contract | sow | dos | gcloud-search | gcloud-clarify | evaluate | score | tenders | competitors | hld-review | dld-review | backlog | trello | servicenow | devops | mlops | finops | operationalize | traceability | analyze | principles-compliance | conformance | maturity-model | service-assessment | tcop | ai-playbook | atrs | secure | mod-secure | jsp-936 | story | presentation |
|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|
| **plan** | - |  |  |  | O | O |  |  |  |  |  |  | O |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | R |  |  |  |  |  |  | R | R |
| **principles** | R | - | R | R | R | R | M | M | M | M | O | R | O | R | R | R | R | R | M | R | R | O | O | O | O | M | M | O | O | R | M | M | M | M | R | R | M |  | O | O | M | M | R |  | R | M | R | R | R |  | R | M | M | R | M | M | M | M | M | M | M | M | M |
| **stakeholders** | R |  | - | M | M | M | R | R | M | R | O | R |  | R | R | R | R | R | R | R | R |  |  |  | R | R | R |  | O |  | O | R | R | R |  |  | O |  |  |  |  |  | R |  |  |  |  | O | O |  | R | O |  | O | R | R | O |  |  |  |  | R | R |
| **risk** | R |  |  | - | R | R | O | R | O |  | O |  |  | O |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | R |  | O | O |  |  |  |  |  |  | R | R | R |  |  | O |  |  | R |  | R | O | R | O | R | R | R |  | R | R | R | R | R |
| **sobc** | R |  |  | O | - | R | O | O | R |  | O | O |  |  | R | R | R | R |  | R |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | R |  |  |  |  | O |  |  | R |  |  |  | R |  |  |  |  |  |  | R | R |
| **requirements** | R |  | R | R | O | - | M | M |  | M | R | M | O | R | M | M | M | M | M | M | M | O | O | O | M | M | O |  | R | R | M | R | M | M | M | M | M |  | O | O | M | M | M |  | M | M | M | M | M | M | M | R | R | O | M | M | M | M | M | M | M | R | R |
| **platform-design** |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **roadmap** |  |  |  |  |  |  |  | - | R |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | R | R |
| **strategy** |  |  |  |  |  |  |  |  | - | R | O |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  |  |  | R |
| **framework** |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **glossary** |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **data-model** |  |  |  |  |  |  | O |  |  | R | R | - | O | M |  |  |  |  | R |  |  |  |  | O |  | O |  |  |  |  |  | R |  |  |  |  |  |  |  |  |  | R |  |  | R | O | R |  | O |  | R | R |  | O | R |  | R | O |  |  | O | R |  |
| **archify** |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **dpia** |  |  |  | O |  |  |  |  |  |  |  |  | O | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  | O |  |  |  |  |  |  |  |  |  |  |  | R | O | O | O | R |  |  | R | R |
| **research** |  |  |  |  |  |  |  |  |  | R | O | O |  |  | - |  |  |  | O |  |  |  |  |  |  | R |  | O | R |  | O |  | R | R |  | O | R |  |  |  |  |  |  |  |  | R | O | O |  |  |  |  |  |  | O | O |  |  |  |  |  | R | R |
| **azure-research** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  | R |  | O | R |  | O |  | R | R |  |  | R |  |  |  |  |  |  |  |  | R | O | O |  |  |  |  |  |  | O | O |  |  |  |  |  | R | R |
| **aws-research** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  | R |  | O | R |  | O |  | R | R |  |  | R |  |  |  |  |  |  |  |  | R | O | O |  |  |  |  |  |  | O | O |  |  |  |  |  | R | R |
| **gcp-research** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  | O |  | R | R |  |  | R |  |  |  |  |  |  |  |  | R | O | O |  |  |  |  |  |  | O | O |  |  |  |  |  | R | R |
| **datascout** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **grants** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **gov-reuse** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **gov-code-search** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **gov-landscape** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **dfd** |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **wardley.value-chain** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - | R |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **wardley** |  |  |  |  |  |  | R | R | R |  |  |  | O |  |  |  |  |  |  |  |  |  |  |  |  | - | R | M | M | O | O |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  | R | R |
| **wardley.doctrine** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O | - | R | O |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **wardley.gameplay** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **wardley.climate** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  | R | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **diagram** |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  | R |  |  |  | M | R |  | R | M |  |  |  |  |  | R | R |  |  | R | O | O | R | R |
| **adr** |  |  |  |  |  |  |  |  |  |  | O |  | O |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | R |  |  | M |  |  |  |  |  |  |  |  |  | O |
| **data-mesh-contract** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **sow** |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - | O |  |  | R |  |  |  | R |  |  |  |  |  |  |  |  |  | O |  |  |  | O |  |  |  |  |  |  | R | R |
| **dos** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  | R |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | R | R |
| **gcloud-search** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - | M | R |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **gcloud-clarify** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **evaluate** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - | M |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  | O |  |  |  |  |  |  | R |  |
| **score** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **tenders** |  |  |  | O | O |  |  |  |  |  |  |  |  |  | R |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **competitors** |  |  |  | O |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **hld-review** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - | M | R |  |  |  |  |  |  | R |  |  | R |  | R |  |  | O |  |  |  | R | R |
| **dld-review** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - | R |  |  |  |  |  |  | R |  |  | R |  | R |  |  | O |  |  |  | R | R |
| **backlog** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - | M |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | R |  |
| **trello** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **servicenow** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  | R |  |  | O |  |  |  |  |  |  |  |  |  | R |  |
| **devops** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  | R | O |  |  |  | R |  | R |  |  |  |  |  |  | R | R |
| **mlops** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **finops** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **operationalize** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| **traceability** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  | O | - | O | R | R |  | R |  |  |  |  |  |  | R |  |
| **analyze** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  | O |  |  |  |  |  |  | R |  |
| **principles-compliance** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - | R |  |  |  |  |  |  |  |  |  |  |
| **conformance** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |
| **maturity-model** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |
| **service-assessment** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  | R |  |
| **tcop** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  | O |  |  |  |  |  |  |  |  |  |  | O |  |  |  | O | O |  |  |  |  | O | R |  |  | O | - |  | O | O |  |  | R | R |
| **ai-playbook** |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  | O |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | R |  |  |  | O | O |  |  | O | O | - | R | O |  | R | R | R |
| **atrs** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  | O | O |  |  | O |  |  | - | O |  |  | R | R |
| **secure** |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  |  |  |  | R |  |  | R |  |  |  | - | R |  | R | R |
| **mod-secure** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O | O |  |  |  |  |  |  |  | - | O | R | R |
| **jsp-936** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  |  |  |  |  |  |  |  | - | R |  |
| **story** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |
| **presentation** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |
| **HLD (external)** |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  | R | R | R |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  |  |  |  |  | M |  | R |  | R |  |  |  |  | R | O | R | R |  |  |  |  |  |  |  |  |  |  |
| **DLD (external)** |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  |  |  |  |  |  | M | R |  | R |  |  |  |  | R | O | R | R |  |  |  |  |  |  |  |  |  |  |

## Command Groups by Dependency Level

### Tier 0: Foundation (No Mandatory Dependencies)

These commands can run first:

- **start** - Onboarding and navigation (console-only diagnostic, no file output; recommends `init` and `principles`)
- **plan** - Project planning and timeline (reads stakeholders, requirements, principles, sobc and risk (R), if they exist)
- **principles** - Architecture principles (reads no earlier ArcKit documents)

### Tier 1: Strategic Context (Depends on Foundation)

- **stakeholders** → Depends on: principles (R), requirements (R)

### Tier 2: Risk Assessment (Depends on Stakeholders)

- **risk** → Depends on: stakeholders (M), principles (R), requirements (R), sobc (O), dpia (O), tenders (O), competitors (O)

### Tier 3: Business Justification

- **sobc** → Depends on: stakeholders (M), principles (R), risk (R), plan (O), requirements (O), tenders (O)

### Tier 4: Requirements Definition

- **requirements** → Depends on: stakeholders (M), principles (R), risk (R), sobc (R), plan (O)

### Tier 5: Strategic Planning (Platform Strategy, Roadmaps & Strategy Synthesis)

- **platform-design** → Depends on: principles (M), requirements (M), stakeholders (R), wardley (R), risk (O), sobc (O), data-model (O)
  - Note: Designs multi-sided platform strategy using Platform Design Toolkit (PDT) methodology
  - Best run after requirements when designing ecosystem-based platforms (Government as a Platform, marketplaces, data platforms)
  - Needs principles and requirements; stakeholders and wardley are recommended for better auto-population
- **roadmap** → Depends on: principles (M), requirements (M), stakeholders (R), risk (R), wardley (R), sobc (O)
  - Note: Creates strategic architecture roadmap with multi-year timeline and capability evolution
  - Requires principles and requirements; stakeholders, risk and wardley provide strategic context
- **strategy** → Depends on: principles (M), stakeholders (M), sobc (R), roadmap (R), wardley (R), risk (O)
  - Note: Synthesises strategic artifacts into executive-level Architecture Strategy document
  - Requires both principles AND stakeholders as mandatory inputs (unique among ArcKit commands)
  - Best run after creating principles, stakeholders, wardley, roadmap, and sobc for comprehensive strategy
- **framework** → Depends on: principles (M), requirements (M), stakeholders (R), strategy (R), data-model (R), research (R)
  - Note: Transforms architecture artifacts into a structured, reusable framework with principles, patterns, and implementation guidance
  - Agent-delegating command (runs autonomously via arckit-framework agent)
  - Best run after strategy and requirements when sufficient artifacts exist for framework synthesis
- **glossary** → Depends on: requirements (R), data-model (R), principles (O), stakeholders (O), risk (O), sobc (O), strategy (O), research (O), adr (O)
  - Note: Generates comprehensive project glossary; accepts all available artifacts as term sources
  - Can run at any point once requirements exist; richer with more artifacts available

### Tier 6: Detailed Design (Depends on Requirements)

Most commands in this tier require or strongly recommend ARC-*-REQ-*.md:

- **data-model** → Depends on: requirements (M), principles (R), stakeholders (R), sobc (O), research (O)
- **archify** → Depends on: plan (O), principles (O), requirements (O), data-model (O), dpia (O), dfd (O), wardley (O), diagram (O), adr (O), sow (O), vendor HLD (O), vendor DLD (O)
  - Note: wardley is the input for `wardley` renders. Renders existing artefacts as interactive HTML and adds no new analysis. It writes the same DIAG doc-type as diagram, so commands that read diagrams may read its output too; the matrix records those reads under diagram.
- **dpia** → Depends on: data-model (M), principles (R), stakeholders (R), requirements (R), risk (O), ai-playbook (O), secure (O)
- **research** → Depends on: requirements (M), principles (R), stakeholders (R), sobc (R), tenders (R)
  - Note: Also spawns `vendors/{slug}-profile.md` and `tech-notes/{slug}.md` for reusable knowledge (use `--no-spawn` to skip)
- **azure-research** → Depends on: requirements (M), principles (R), stakeholders (R), sobc (R), vendor HLD (R), MCP Server (External)
  - Note: Requires Microsoft Learn MCP server to be installed for authoritative Azure documentation
- **aws-research** → Depends on: requirements (M), principles (R), stakeholders (R), sobc (R), vendor HLD (R), MCP Server (External)
  - Note: Requires AWS Knowledge MCP server to be installed for authoritative AWS documentation
- **gcp-research** → Depends on: requirements (M), principles (R), stakeholders (R), sobc (R), vendor HLD (R), MCP Server (External)
  - Note: Requires Google Developer Knowledge MCP server (with API key) for authoritative Google Cloud documentation
- **datascout** → Depends on: principles (M), requirements (M), stakeholders (R), data-model (R), research (O)
  - Note: Discovers external data sources (APIs, datasets, open data portals) to fulfil project data requirements
  - Bidirectional with data-model: data-model is a recommended input, and datascout recommends data-model updates as output
- **grants** → Depends on: requirements (M), principles (R), stakeholders (R), sobc (R)
  - Note: Researches UK government grants, charitable funding, and accelerator programmes with eligibility scoring
  - Outputs GRNT funding opportunity register, a source for the business case, plan and risk register (those commands don't read it automatically)
- **gov-reuse** → Depends on: requirements (M), principles (R), stakeholders (R)
  - Note: Searches UK government open-source repositories for code to reuse before building; outputs GOVR
- **gov-code-search** → Depends on: principles (O), requirements (O)
  - Note: Natural-language search across UK government repositories; outputs GCSR
- **gov-landscape** → Depends on: principles (O), requirements (O)
  - Note: Maps what UK government organisations have built in a domain; outputs GLND
- **dfd** → Depends on: principles (O), requirements (O), data-model (O), diagram (O)
  - Note: Can generate DFDs from user description alone; richer output when requirements and data-model exist
  - Multi-instance document type (ARC-*-DFD-{NUM}-v*.md)
- **wardley.value-chain** → Depends on: requirements (M), stakeholders (R), principles (O)
  - Note: Decomposes user needs into value chains for Wardley Mapping; produces WVCH artifacts
  - Multi-instance document type (ARC-*-WVCH-{NUM}-v*.md), stored in wardley-maps/ subdirectory
- **wardley** → Depends on: principles (M), requirements (M), stakeholders (R), research (R), azure-research (R), aws-research (R), wardley.value-chain (R), data-model (O), wardley.doctrine (O), wardley.gameplay (O), wardley.climate (O), tcop (O), ai-playbook (O)
  - Note: Warns if principles or requirements are missing; research, the value chain and the other Wardley documents enrich the map
- **wardley.doctrine** → Depends on: principles (M), stakeholders (R), wardley (R), requirements (O)
  - Note: Assesses organizational doctrine maturity across 4 phases and 40+ principles; produces WDOC artifact
  - Single instance per project (ARC-*-WDOC-v*.md), stored in wardley-maps/ subdirectory
- **wardley.gameplay** → Depends on: wardley (M), wardley.doctrine (R), wardley.climate (R), principles (O), research (O), azure-research (O), aws-research (O)
  - Note: Analyzes strategic plays from 60+ gameplay patterns; produces WGAM artifacts
  - Multi-instance document type (ARC-*-WGAM-{NUM}-v*.md), stored in wardley-maps/ subdirectory
- **wardley.climate** → Depends on: wardley (M), requirements (R), research (R), azure-research (R), aws-research (R), principles (O), stakeholders (O), wardley.doctrine (O)
  - Note: Assesses 32 climatic patterns affecting mapped components; produces WCLM artifacts
  - Multi-instance document type (ARC-*-WCLM-{NUM}-v*.md), stored in wardley-maps/ subdirectory
- **diagram** → Depends on: principles (R), requirements (R), wardley (O), tcop (O), ai-playbook (O), atrs (O), vendor HLD (O), vendor DLD (O)
  - Note: Can generate diagrams from user description alone; richer output when requirements and other artifacts exist
- **adr** → Depends on: principles (M), requirements (M), risk (R), stakeholders (O), research (O), azure-research (O), aws-research (O), gcp-research (O), wardley (O)
  - Note: Architecture Decision Records; warns if principles or requirements are missing
- **data-mesh-contract** → Depends on: principles (M), stakeholders (R), requirements (R), data-model (R)
  - Note: Federated data product contracts for mesh architectures; requires principles for governance standards

### Tier 7: Procurement (Depends on Requirements)

Most procurement commands require ARC-*-REQ-*.md:

- **sow** → Depends on: principles (M), requirements (M), stakeholders (R), research (R), azure-research (R), aws-research (R), gcp-research (R), risk (O)
- **dos** → Depends on: principles (M), requirements (M), stakeholders (R), research (R), azure-research (R), aws-research (R), gcp-research (R), risk (O), sow (O)
- **gcloud-search** → Depends on: requirements (M), principles (R), Digital Marketplace access (External)
  - Note: Stops if the project has no requirements
- **gcloud-clarify** → Depends on: requirements (M), gcloud-search (M), principles (R), research (O)
- **evaluate** → Depends on: principles (M), requirements (M), research (R), azure-research (R), aws-research (R), gcp-research (R), sow (R), dos (R), gcloud-search (R), stakeholders (O), dpia (O)
- **score** → Depends on: evaluate (M), competitors (O)
  - Note: Structured vendor scoring with JSON storage, comparison, and audit trail
  - Integrates with evaluate criteria; scores stored in `projects/{id}/vendors/scores.json`
- **tenders** → Depends on: principles (O), requirements (O)
  - Note: Procurement market intelligence from the UK Tenders MCP — award-value benchmarks, top suppliers, incumbency/concentration across ~677k UK contracting processes
  - Requires the bundled `uk-tenders` MCP server (keyless, deferred, best-effort availability)
  - Outputs TNDR artefact; feeds into sobc (Economic Case benchmarks), risk (concentration risk), research (build-vs-buy market context)
  - Agent-delegating command (reader/orchestrator/writer three-tier split); shares `arckit-tenders-reader` with `/arckit:competitors`
- **competitors** → Depends on: principles (O), requirements (O)
  - Note: Competitor landscape from the UK Tenders MCP — rival suppliers, awarded-value market share, head-to-head comparison, concentration analysis
  - Requires the bundled `uk-tenders` MCP server (keyless, deferred, best-effort availability); shares `arckit-tenders-reader` with `/arckit:tenders`
  - Outputs CMPT artefact; read by risk (supplier-concentration/single-supplier-dependency) and score (Company Experience evidence)
  - Agent-delegating command (reader/orchestrator/writer three-tier split)

### Tier 8: Design Reviews (Depends on Design Documents + Requirements)

- **hld-review** → Depends on: principles (M), requirements (M), vendor HLD (M), risk (R), diagram (R), sow (R), tcop (O)
- **dld-review** → Depends on: principles (M), requirements (M), hld-review (M), vendor DLD (M), risk (R), data-model (R), secure (O)

### Tier 9: Implementation Planning (Depends on Design Reviews)

- **backlog** → Depends on: requirements (M), principles (R), stakeholders (R), risk (R), sobc (R), hld-review (R), dld-review (R), vendor HLD (R), vendor DLD (R), dpia (O)

### Tier 10: Backlog Export (Depends on Backlog)

- **trello** → Depends on: backlog (M) — specifically the JSON export (`ARC-*-BKLG-*.json`)
  - Note: Exports backlog to Trello board with sprint lists, labelled cards, and acceptance criteria checklists
  - Requires `TRELLO_API_KEY` and `TRELLO_TOKEN` environment variables

### Tier 11: Operations (Depends on Architecture)

- **servicenow** → Depends on: requirements (M), diagram (M), principles (R), data-model (R), vendor HLD (R), vendor DLD (R), wardley (O), traceability (O), tcop (O)
- **devops** → Depends on: principles (M), requirements (M), research (R), azure-research (R), aws-research (R), gcp-research (R), diagram (R), risk (O), data-model (O), tcop (O)
- **mlops** → Depends on: requirements (M), principles (R), data-model (R), ai-playbook (R), research (O), azure-research (O), aws-research (O), gcp-research (O), atrs (O), jsp-936 (O) [for AI projects]
- **finops** → Depends on: requirements (M), principles (R), diagram (R), devops (R), stakeholders (O), sobc (O), research (O), azure-research (O), aws-research (O), gcp-research (O)
- **operationalize** → Depends on: requirements (M), diagram (M), principles (R), risk (R), servicenow (R), stakeholders (O), data-model (O), devops (O), traceability (O)
- **traceability** → Depends on: requirements (M), adr (R), hld-review (R), dld-review (R), vendor HLD (R), vendor DLD (R)
  - Note: Hook pre-processing reduces dependency on direct HLD/DLD file reads

### Tier 12: Quality Assurance (Can Run Before or After Compliance)

- **analyze** → Depends on: requirements (M), principles (R), stakeholders (R), risk (R), sobc (R), data-model (R), sow (O), evaluate (O), traceability (O), tcop (O), ai-playbook (O), atrs (O), mod-secure (O), vendor HLD (O), vendor DLD (O)
  - Note: Reads requirements as its main input; every other input is recommended or optional, and analyze reports missing artifacts as gaps

### Tier 13: Compliance Assessment (Depends on Multiple Artifacts)

These assess compliance across the project:

- **principles-compliance** → Depends on: principles (M), requirements (R), data-model (R), traceability (R), tcop (R), secure (R), vendor HLD (R), vendor DLD (R), stakeholders (O), risk (O), servicenow (O), ai-playbook (O), atrs (O), mod-secure (O)
  - Note: All dependencies except principles are RECOMMENDED - better assessment with more artifacts
- **conformance** → Depends on: principles (M), adr (M), risk (R), requirements (R), hld-review (R), dld-review (R), devops (R), traceability (R), principles-compliance (R), vendor HLD (R), vendor DLD (R)
  - Note: Checks decided-vs-designed conformance — ADR decision implementation, cross-decision consistency, architecture drift, technical debt
  - Bridges health (quick metadata scan) and analyze (deep governance) with systematic conformance checking
- **maturity-model** → Depends on: principles (R), stakeholders (O), risk (O), requirements (O), strategy (O), data-model (O)
  - Note: Generates capability maturity model with current-state assessment, target-state definition, and improvement roadmap
  - Can run once principles exist; feeds into roadmap and strategy for improvement planning
- **service-assessment** → Depends on: principles (M), requirements (M), plan (R), stakeholders (R), risk (R), sobc (R), data-model (R), dpia (R), diagram (R), hld-review (R), dld-review (R), devops (R), traceability (R), secure (R), research (O), azure-research (O), aws-research (O), gcp-research (O), wardley (O), sow (O), evaluate (O), analyze (O), tcop (O), ai-playbook (O), atrs (O)
  - Note: Compliance artifacts are optional - service-assessment identifies them as gaps if missing
- **tcop** → Depends on: principles (M), requirements (M), stakeholders (R), risk (R), diagram (R), dpia (O), research (O), azure-research (O), aws-research (O), gcp-research (O), ai-playbook (O)
- **ai-playbook** → Depends on: principles (M), requirements (M), risk (R), data-model (R), stakeholders (O), dpia (O) [if AI system]
- **atrs** → Depends on: principles (M), requirements (M), ai-playbook (R), data-model (O), dpia (O), hld-review (O), dld-review (O), tcop (O) [for AI/algorithmic systems]
- **secure** → Depends on: principles (M), requirements (M), risk (R), dpia (R), diagram (R), tcop (O), ai-playbook (O), atrs (O)
- **mod-secure** → Depends on: principles (M), requirements (M), risk (R), secure (R), diagram (O)
- **jsp-936** → Depends on: principles (M), requirements (M), risk (R), ai-playbook (R), data-model (O), diagram (O), mod-secure (O) [for MOD AI systems]

### Tier 14: Project Story & Reporting (Depends on All Artifacts)

Final reporting commands that create comprehensive project narratives and presentations:

- **story** → Depends on: principles (M), plan (R), stakeholders (R), risk (R), sobc (R), requirements (R), roadmap (R), data-model (R), dpia (R), research (R), azure-research (R), aws-research (R), gcp-research (R), wardley (R), diagram (R), sow (R), dos (R), evaluate (R), hld-review (R), dld-review (R), backlog (R), servicenow (R), devops (R), traceability (R), analyze (R), service-assessment (R), tcop (R), ai-playbook (R), atrs (R), secure (R), mod-secure (R), jsp-936 (R)
  - Note: Requires principles as foundation; recommends multiple artifacts for comprehensive narrative
  - Generates comprehensive historical record with timeline analysis, traceability chains, governance achievements
  - Best run at project milestones or completion when most/all artifacts are complete
- **presentation** → Depends on: principles (M), plan (R), stakeholders (R), risk (R), sobc (R), requirements (R), roadmap (R), strategy (R), dpia (R), research (R), azure-research (R), aws-research (R), gcp-research (R), wardley (R), diagram (R), sow (R), dos (R), hld-review (R), dld-review (R), devops (R), tcop (R), ai-playbook (R), atrs (R), secure (R), mod-secure (R), adr (O)
  - Note: Reads available artifacts and reformats into MARP slide deck for governance boards
  - Supports focus modes: Executive, Technical, Stakeholder, Procurement
  - Can run at any milestone when at least 3 artifacts exist; more artifacts = richer slides

### Tier 15: Documentation Publishing (Utility)

Publishing command that generates the documentation site:

- **pages** → No particular dependency: it indexes and publishes whatever the project holds, so it is not in the matrix
  - Note: more documents = better site
  - Generates GitHub Pages site with Mermaid diagram support
  - Best run when project has substantial documentation to publish

### Meta: Build Harness (orchestrator, not in matrix)

`/arckit:build` is a meta-command that orchestrates parallel execution of every other command listed in this matrix according to a YAML recipe. It produces no artifact of its own — it dispatches subagents that each run one of the per-tier commands above.

- **build** → Depends on: a recipe file (`.arckit/recipes/{name}.yaml` or `${CLAUDE_PLUGIN_ROOT}/skills/arckit-build/recipes/{name}.yaml`)
  - Core recipes: `uk-saas` (the default), `uk-mod-sovereign`, `uk-nhs-clinical-safety` and `uk-fs-payments`; most community overlays ship their own
  - Computes the dependency DAG from the recipe and dispatches one parallel wave at a time
  - **Claude Code only** — depends on parallel `Agent` tool dispatch
  - Excluded from the matrix above because it depends on every other command transitively

---

## Community Overlay Dependencies

Each community overlay and tooling plugin, with what its commands read: ArcKit core documents, documents from the same overlay, and in places another overlay's. Levels come from each command's own prompt, read in full. An input the prompt reads only "if present" is optional unless the prompt also says to note or record the gap when it is missing. Where a UK G-Cloud command reads the service design document for the service's own lot, all five sdd-lot commands are listed; only the one for that lot applies.

Some prompts name codes that are not registered, so they are not shown: `DR` used for data requirements in the Canadian and UAE overlays (DR is the French Diffusion Restreinte doc-type), `ARCH`, `INT`, `USTY`, `JRNY`, `KPI` and `ANALYZE`. `DMOD` is read as the data model.

### ArcKit Canadian Federal Overlay (`arckit-ca`)

| Command | Needs (M) | Recommended (R) | Optional (O) |
|---------|-----------|-----------------|--------------|
| `/arckit:ca-fitaa` | — | — | data-model, principles, requirements, stakeholders |
| `/arckit:ca-pia` | — | — | data-model, principles, requirements, stakeholders |
| `/arckit:ca-atip` | — | — | ca-pia, data-model, principles, requirements |
| `/arckit:ca-aia` | — | data-model, requirements | ca-pia, principles |
| `/arckit:ca-charter` | — | requirements, stakeholders | ca-fitaa, ca-pia, principles |
| `/arckit:ca-itsg-33` | — | ca-pia, data-model, requirements | ca-soia, principles |
| `/arckit:ca-soia` | — | — | ca-fitaa, ca-itsg-33, principles, requirements |
| `/arckit:ca-cloud-residency` | — | ca-pia, data-model, requirements | ca-itsg-33, principles |
| `/arckit:ca-gc-digital-standards` | — | — | ca-aia, principles, requirements, service-assessment |
| `/arckit:ca-ola` | — | — | ca-fitaa, principles, requirements, service-assessment |
| `/arckit:ca-pspc` | — | — | ca-cloud-residency, ca-itsg-33, principles, requirements, sobc |
| `/arckit:ca-ocap` | — | — | ca-pia, data-model, principles, requirements |

### ArcKit UAE Federal Overlay (`arckit-uae`)

| Command | Needs (M) | Recommended (R) | Optional (O) |
|---------|-----------|-----------------|--------------|
| `/arckit:uae-classification` | — | requirements | principles, uae-pdpl |
| `/arckit:uae-pdpl` | — | — | data-model, principles, requirements |
| `/arckit:uae-ias` | — | — | principles, requirements, secure |
| `/arckit:uae-cloud-residency` | uae-classification | — | principles, requirements, uae-ias |
| `/arckit:uae-uaepass` | — | — | principles, requirements, secure |
| `/arckit:uae-zero-bureaucracy` | — | — | principles, requirements |
| `/arckit:uae-digital-records` | — | — | data-model, principles, requirements, uae-classification |
| `/arckit:uae-data-sharing` | — | uae-classification, uae-pdpl | data-model, principles, requirements |
| `/arckit:uae-priorities-alignment` | — | — | adr, principles, requirements, sobc, uae-classification, uae-cloud-residency, uae-data-sharing, uae-digital-records, uae-ias, uae-pdpl, uae-uaepass, uae-zero-bureaucracy |
| `/arckit:uae-ai-charter` | — | — | dpia, principles, requirements |
| `/arckit:uae-ai-autonomy-tier` | — | — | principles, requirements, uae-ai-charter |
| `/arckit:uae-procurement` | — | — | principles, requirements, risk, sobc |

### ArcKit EU Overlay (`arckit-eu`)

| Command | Needs (M) | Recommended (R) | Optional (O) |
|---------|-----------|-----------------|--------------|
| `/arckit:eu-rgpd` | data-model | principles, requirements, stakeholders | risk, secure |
| `/arckit:eu-nis2` | requirements | principles, risk, secure | eu-dora, fr-secnumcloud |
| `/arckit:eu-ai-act` | requirements | data-model, risk, stakeholders | principles, secure |
| `/arckit:eu-dora` | requirements | principles, risk, secure | eu-nis2, fr-secnumcloud |
| `/arckit:eu-cra` | requirements | principles, risk, secure | data-model, eu-nis2 |
| `/arckit:eu-dsa` | requirements | risk, stakeholders | eu-rgpd, principles |
| `/arckit:eu-data-act` | requirements | data-model, risk, secure | eu-rgpd, fr-secnumcloud |
| `/arckit:eu-cloud-sovereignty` | requirements | fr-secnumcloud, principles, risk | eu-nis2, fr-dinum, nl-cloud |

### ArcKit French Public Sector Overlay (`arckit-fr`)

| Command | Needs (M) | Recommended (R) | Optional (O) |
|---------|-----------|-----------------|--------------|
| `/arckit:fr-secnumcloud` | requirements | fr-dinum, principles, risk | fr-marche-public, secure |
| `/arckit:fr-rgpd` | data-model, eu-rgpd | requirements, stakeholders | fr-dinum, secure |
| `/arckit:fr-ebios` | requirements | data-model, fr-dinum, fr-secnumcloud, secure, stakeholders | principles, risk |
| `/arckit:fr-anssi` | requirements | data-model, fr-ebios, fr-pssi, secure | eu-nis2, fr-secnumcloud, principles |
| `/arckit:fr-anssi-carto` | requirements | data-model, fr-anssi, secure, stakeholders | fr-ebios, fr-secnumcloud, principles |
| `/arckit:fr-pssi` | requirements | data-model, fr-anssi, fr-ebios, secure, stakeholders | eu-nis2, fr-anssi-carto, fr-rgpd, principles |
| `/arckit:fr-dr` | requirements | data-model, fr-anssi, secure | fr-ebios, fr-pssi, fr-secnumcloud |
| `/arckit:fr-marche-public` | requirements | fr-dinum, fr-secnumcloud, risk | data-model, principles |
| `/arckit:fr-dinum` | requirements | principles, secure, stakeholders | fr-secnumcloud, risk |
| `/arckit:fr-algorithme-public` | requirements | data-model, eu-rgpd, fr-rgpd, stakeholders | eu-ai-act, principles |
| `/arckit:fr-code-reuse` | requirements | data-model, fr-dinum, stakeholders | fr-marche-public, principles |
| `/arckit:fr-irn` | — | principles, requirements, research, stakeholders | eu-rgpd, fr-anssi, fr-ebios, fr-rgpd, fr-secnumcloud |

### ArcKit Netherlands Public Sector Overlay (`arckit-nl`)

| Command | Needs (M) | Recommended (R) | Optional (O) |
|---------|-----------|-----------------|--------------|
| `/arckit:nl-cloud` | requirements | nl-bio, nl-tbb, principles, risk | dpia, secure |
| `/arckit:nl-tbb` | requirements | data-model, risk | principles |
| `/arckit:nl-bio` | requirements | nl-cloud, nl-tbb, risk, secure | data-model |
| `/arckit:nl-exit` | requirements | nl-cloud, risk | data-model |

### ArcKit Austrian Overlay (`arckit-at`)

| Command | Needs (M) | Recommended (R) | Optional (O) |
|---------|-----------|-----------------|--------------|
| `/arckit:at-barrierefreiheit` | requirements | diagram, stakeholders, vendor HLD | at-bvergg, risk, sobc |
| `/arckit:at-dsgvo` | data-model, eu-rgpd | requirements, stakeholders | risk, secure |
| `/arckit:at-nisg` | requirements | eu-nis2, principles, risk, secure | at-dsgvo, eu-dora |
| `/arckit:at-bvergg` | requirements | at-dsgvo, at-nisg, risk, secure | data-model, principles |

### ArcKit Australian Federal Overlay (`arckit-au`)

| Command | Needs (M) | Recommended (R) | Optional (O) |
|---------|-----------|-----------------|--------------|
| `/arckit:au-e8-posture` | — | requirements, risk | maturity-model, principles, traceability |
| `/arckit:au-pia` | — | data-model, dfd, requirements, stakeholders | au-e8-posture, principles, risk, traceability |
| `/arckit:au-dss` | — | data-model, dfd, diagram, requirements, stakeholders | au-e8-posture, au-pia, maturity-model, principles, risk, servicenow, traceability |
| `/arckit:au-ism-controls` | — | data-model, dfd, diagram, requirements, risk | au-e8-posture, au-ndb-playbook, maturity-model, principles, servicenow, traceability |
| `/arckit:au-ndb-playbook` | — | au-e8-posture, au-ism-controls, au-pia, data-model, dfd, risk | servicenow, traceability |
| `/arckit:au-pspf` | — | au-e8-posture, au-ism-controls, au-pia, data-model, diagram, risk | au-disp-attestation, maturity-model, servicenow, traceability |
| `/arckit:au-ai-assurance` | — | au-pia, data-model, dfd, requirements, risk, traceability | au-e8-posture, au-ism-controls, maturity-model |
| `/arckit:au-disp-attestation` | — | au-e8-posture, au-ism-controls, au-pia, au-pspf, risk | au-ndb-playbook, maturity-model, servicenow, traceability |
| `/arckit:au-ot-security` | — | data-model, dfd, diagram, maturity-model, requirements, risk, servicenow, stakeholders, traceability | au-e8-posture, au-ism-controls, principles |
| `/arckit:au-soci-cirmp` | — | data-model, dfd, diagram, maturity-model, requirements, risk, servicenow, stakeholders, traceability | au-e8-posture, au-ism-controls, au-ndb-playbook, au-ot-security, au-pia, principles |

### ArcKit Australian Energy Sector Overlay (`arckit-au-energy`)

| Command | Needs (M) | Recommended (R) | Optional (O) |
|---------|-----------|-----------------|--------------|
| `/arckit:au-aescsf` | — | requirements, stakeholders | au-e8-posture, au-ism-controls, au-ot-security, au-soci-cirmp, data-model, dfd, diagram, maturity-model, principles, risk, servicenow, traceability |
| `/arckit:au-energy-compliance` | — | requirements, stakeholders | adr, au-aescsf, au-ndb-playbook, au-ot-security, au-pia, au-soci-cirmp, data-model, dfd, diagram, principles, risk, servicenow, traceability |

### ArcKit USA Federal Civilian Overlay (`arckit-us`)

| Command | Needs (M) | Recommended (R) | Optional (O) |
|---------|-----------|-----------------|--------------|
| `/arckit:us-fisma-categorization` | — | requirements | data-model, principles, stakeholders |
| `/arckit:us-nist-800-53` | us-fisma-categorization | adr, requirements | principles |
| `/arckit:us-fedramp-ssp` | us-fisma-categorization, us-nist-800-53 | data-model, diagram, requirements | principles, vendor DLD, vendor HLD |
| `/arckit:us-fedramp-readiness` | us-fedramp-ssp, us-nist-800-53 | us-fisma-categorization | principles |
| `/arckit:us-zero-trust` | — | diagram, vendor DLD, vendor HLD | principles, us-fedramp-ssp, us-nist-800-53 |
| `/arckit:us-icam` | — | requirements, stakeholders, us-fisma-categorization | principles |
| `/arckit:us-ai-rmf` | — | data-model, requirements, stakeholders | principles, us-nist-800-53 |
| `/arckit:us-ai-impact` | — | requirements, stakeholders, us-ai-rmf | principles |
| `/arckit:us-privacy-pia` | — | data-model, requirements, stakeholders | principles, risk, us-icam |
| `/arckit:us-sbom-eo-14028` | — | requirements, us-nist-800-53, vendor DLD, vendor HLD | principles |

### ArcKit UK Financial Services Payments Overlay (`arckit-uk-finance`)

| Command | Needs (M) | Recommended (R) | Optional (O) |
|---------|-----------|-----------------|--------------|
| `/arckit:uk-fs-sca-rts` | — | — | data-model, principles, requirements |
| `/arckit:uk-fs-safeguarding` | — | data-model, requirements | principles |
| `/arckit:uk-fs-consumer-duty` | — | — | principles, requirements, risk, stakeholders |
| `/arckit:uk-fs-ctp-dependency` | — | principles, requirements, risk, uk-fs-safeguarding | — |

### ArcKit UK NHS Clinical Safety Overlay (`arckit-uk-nhs`)

| Command | Needs (M) | Recommended (R) | Optional (O) |
|---------|-----------|-----------------|--------------|
| `/arckit:uk-nhs-dcb0129` | — | data-model, requirements, stakeholders | atrs, dpia, principles, risk |
| `/arckit:uk-nhs-dcb0160` | — | data-model, principles, requirements, stakeholders, uk-nhs-dcb0129 | operationalize |
| `/arckit:uk-nhs-dtac` | — | data-model, principles, requirements, stakeholders | atrs, dld-review, dpia, hld-review, secure, uk-nhs-dcb0129, uk-nhs-dcb0160 |
| `/arckit:uk-mdr-classification` | — | data-model, principles, requirements, stakeholders | secure, uk-nhs-dcb0129 |

### ArcKit FDE Site Generator (`arckit-fde`)

| Command | Needs (M) | Recommended (R) | Optional (O) |
|---------|-----------|-----------------|--------------|
| `/arckit-fde:create` | — | — | — |

### ArcKit Repository Tooling (`arckit-repo`)

| Command | Needs (M) | Recommended (R) | Optional (O) |
|---------|-----------|-----------------|--------------|
| `/arckit-repo:repo-audit` | — | principles, requirements | — |
| `/arckit-repo:repo-docs` | — | — | — |

### ArcKit UK G-Cloud Supplier Bid-Authoring Overlay (`arckit-uk-gcloud`)

| Command | Needs (M) | Recommended (R) | Optional (O) |
|---------|-----------|-----------------|--------------|
| `/arckit:supplier-profile` | — | — | — |
| `/arckit:social-value` | supplier-profile | — | — |
| `/arckit:lot-questions` | sdd-lot1a, sdd-lot1b, sdd-lot2a, sdd-lot2b, sdd-lot3, security, supplier-profile | pricing, service-design, social-value | — |
| `/arckit:service-design` | — | supplier-profile | — |
| `/arckit:sdd-lot1a` | service-design, supplier-profile | — | lot-questions |
| `/arckit:sdd-lot1b` | service-design, supplier-profile | — | lot-questions |
| `/arckit:sdd-lot2a` | service-design, supplier-profile | — | lot-questions |
| `/arckit:sdd-lot2b` | service-design, supplier-profile | — | lot-questions |
| `/arckit:sdd-lot3` | service-design, supplier-profile | pricing | lot-questions |
| `/arckit:declaration` | supplier-profile | lot-questions, service-design, social-value | — |
| `/arckit:pricing` | service-design, supplier-profile | sdd-lot1a, sdd-lot1b, sdd-lot2a, sdd-lot2b, sdd-lot3 | gcloud-competitors, tenders |
| `/arckit:security` | service-design, supplier-profile | lot-questions, sdd-lot1a, sdd-lot1b, sdd-lot2a, sdd-lot2b, sdd-lot3 | — |
| `/arckit:gcloud-competitors` | — | competitors, service-design, tenders | pricing, sdd-lot1a, sdd-lot1b, sdd-lot2a, sdd-lot2b, sdd-lot3, social-value |
| `/arckit:review` | service-design | declaration, lot-questions, pricing, sdd-lot1a, sdd-lot1b, sdd-lot2a, sdd-lot2b, sdd-lot3, security, social-value, supplier-profile | — |
| `/arckit:submission-pack` | declaration, lot-questions, pricing, sdd-lot1a, sdd-lot1b, sdd-lot2a, sdd-lot2b, sdd-lot3, security, service-design, social-value, supplier-profile | review | — |

### ArcKit TOGAF ADM (`arckit-togaf-adm`)

| Command | Needs (M) | Recommended (R) | Optional (O) |
|---------|-----------|-----------------|--------------|
| `/arckit:adm-preliminary` | principles | stakeholders, strategy | — |
| `/arckit:business-capability-map` | adm-preliminary | principles, requirements, stakeholders | application-inventory |
| `/arckit:application-inventory` | adm-preliminary | business-capability-map, principles, requirements | — |
| `/arckit:application-rationalization` | application-inventory | adm-preliminary, adr, business-capability-map, principles, transition-architecture | — |
| `/arckit:gap-analysis` | business-capability-map | principles, strategy | adm-preliminary, risk, stakeholders |
| `/arckit:transition-architecture` | gap-analysis | adr, application-rationalization, roadmap | risk, stakeholders |
| `/arckit:architecture-board` | principles | adm-preliminary, business-capability-map, vendor HLD | — |
| `/arckit:architecture-change` | — | adm-preliminary, architecture-board, business-capability-map, principles, transition-architecture | application-inventory |
| `/arckit:architecture-repository` | principles | adr, diagram, story | application-inventory, architecture-board, architecture-change, business-capability-map, gap-analysis, transition-architecture |

### ArcKit AI Agent Architecture (`arckit-agent-architecture`)

| Command | Needs (M) | Recommended (R) | Optional (O) |
|---------|-----------|-----------------|--------------|
| `/arckit:agent-inventory` | — | adm-preliminary, application-inventory, principles | agent-design, agent-governance, agent-integration, agent-maturity, agent-security |
| `/arckit:agent-design` | agent-inventory, requirements | ai-playbook, principles, risk, stakeholders | hld-review, secure |
| `/arckit:agent-governance` | agent-design, agent-inventory | architecture-board, principles | — |
| `/arckit:agent-integration` | agent-design | agent-governance, agent-inventory | adm-preliminary, agent-security, principles |
| `/arckit:agent-security` | agent-design, agent-inventory | mod-secure, principles, risk, secure | agent-governance, ai-playbook, dpia |
| `/arckit:agent-maturity` | — | agent-design, agent-governance, agent-integration, agent-inventory, agent-security, maturity-model, principles, risk | ai-playbook, architecture-board, hld-review, secure |

### ArcKit Open Agile Architecture (`arckit-oaa`)

| Command | Needs (M) | Recommended (R) | Optional (O) |
|---------|-----------|-----------------|--------------|
| `/arckit:oaa-adm-lite` | — | adm-preliminary, principles | — |
| `/arckit:product-architecture` | — | business-capability-map, oaa-adm-lite, principles | — |
| `/arckit:agile-strategy` | — | business-capability-map, oaa-adm-lite, principles, product-architecture, transition-architecture | — |
| `/arckit:agile-security` | — | agile-strategy, oaa-adm-lite, principles, product-architecture | — |
| `/arckit:agile-governance` | — | agile-security, agile-strategy, oaa-adm-lite, principles, product-architecture | — |

---

## Critical Paths

### Standard Project Path (Non-AI, Non-Government)

```text
plan → principles → stakeholders → risk → sobc → requirements → research → wardley → adr →
sow/evaluate → diagram → hld-review → backlog → servicenow → devops → operationalize →
traceability → principles-compliance → conformance → analyze → story
```

### UK Government Project Path

```text
plan → principles → stakeholders → risk → sobc → requirements → datascout → data-model → research →
wardley → adr → gcloud-search → gcloud-clarify → evaluate → diagram → hld-review → dld-review →
backlog → servicenow → devops → operationalize → traceability →
tcop → secure → principles-compliance → conformance → analyze → service-assessment → story
```

### UK Government Platform Strategy Path

```text
plan → principles → stakeholders → risk → sobc → requirements → platform-design → datascout → data-model → research →
wardley → adr → gcloud-search → evaluate → diagram → hld-review → dld-review → backlog → servicenow →
devops → operationalize → traceability → tcop → secure → principles-compliance →
conformance → analyze → service-assessment → story
```

### UK Government AI Project Path

```text
plan → principles → stakeholders → risk → sobc → requirements → datascout → data-model → research →
wardley → adr → gcloud-search → evaluate → diagram → hld-review → dld-review → backlog → servicenow →
devops → mlops → operationalize → traceability → tcop → ai-playbook → atrs → secure →
principles-compliance → conformance → analyze → service-assessment → story
```

### MOD Defence Project Path

```text
plan → principles → stakeholders → risk → sobc → requirements → datascout → data-model → research →
wardley → adr → dos → evaluate → diagram → hld-review → dld-review → backlog → servicenow →
devops → operationalize → traceability → tcop → mod-secure → principles-compliance →
conformance → analyze → service-assessment → story
```

### MOD Defence AI Project Path

```text
plan → principles → stakeholders → risk → sobc → requirements → datascout → data-model → research →
wardley → adr → dos → evaluate → diagram → hld-review → dld-review → backlog → servicenow →
devops → mlops → operationalize → traceability → tcop → mod-secure → jsp-936 →
principles-compliance → conformance → analyze → service-assessment → story
```

**Note**: analyze and service-assessment can also run earlier in the workflow to identify gaps in missing artifacts (beyond requirements and principles, their inputs are recommended or optional). The story command can be run at any project milestone to create a narrative snapshot, but is most comprehensive when run after all artifacts are complete. The paths above show the complete workflow with story as the final reporting step.

**Platform Design**: The platform-design command is used when designing multi-sided platforms (Government as a Platform, marketplaces, data platforms) and should be inserted after requirements definition but before detailed design. See "UK Government Platform Strategy Path" above.

---

## Artifact Dependencies Summary

### Commands That Are Frequently Consumed (High Fan-In)

**ARC-000-PRIN-v*.md** (from principles) - read by 59 commands:

- plan (R), stakeholders (R), risk (R), sobc (R), requirements (R), platform-design (M), roadmap (M), strategy (M), framework (M), glossary (O), data-model (R), archify (O), dpia (R), research (R), azure-research (R), aws-research (R), gcp-research (R), datascout (M), grants (R), gov-reuse (R), gov-code-search (O), gov-landscape (O), dfd (O), wardley.value-chain (O), wardley (M), wardley.doctrine (M), wardley.gameplay (O), wardley.climate (O), diagram (R), adr (M), data-mesh-contract (M), sow (M), dos (M), gcloud-search (R), gcloud-clarify (R), evaluate (M), tenders (O), competitors (O), hld-review (M), dld-review (M), backlog (R), servicenow (R), devops (M), mlops (R), finops (R), operationalize (R), analyze (R), principles-compliance (M), conformance (M), maturity-model (R), service-assessment (M), tcop (M), ai-playbook (M), atrs (M), secure (M), mod-secure (M), jsp-936 (M), story (M), presentation (M)

**ARC-*-REQ-*.md** (from requirements) - read by 57 commands:

- plan (R), stakeholders (R), risk (R), sobc (O), platform-design (M), roadmap (M), framework (M), glossary (R), data-model (M), archify (O), dpia (R), research (M), azure-research (M), aws-research (M), gcp-research (M), datascout (M), grants (M), gov-reuse (M), gov-code-search (O), gov-landscape (O), dfd (O), wardley.value-chain (M), wardley (M), wardley.doctrine (O), wardley.climate (R), diagram (R), adr (M), data-mesh-contract (R), sow (M), dos (M), gcloud-search (M), gcloud-clarify (M), evaluate (M), tenders (O), competitors (O), hld-review (M), dld-review (M), backlog (M), servicenow (M), devops (M), mlops (M), finops (M), operationalize (M), traceability (M), analyze (M), principles-compliance (R), conformance (R), maturity-model (O), service-assessment (M), tcop (M), ai-playbook (M), atrs (M), secure (M), mod-secure (M), jsp-936 (M), story (R), presentation (R)

**ARC-*-STKE-*.md** (from stakeholders) - read by 38 commands:

- plan (R), risk (M), sobc (M), requirements (M), platform-design (R), roadmap (R), strategy (M), framework (R), glossary (O), data-model (R), dpia (R), research (R), azure-research (R), aws-research (R), gcp-research (R), datascout (R), grants (R), gov-reuse (R), wardley.value-chain (R), wardley (R), wardley.doctrine (R), wardley.climate (O), adr (O), data-mesh-contract (R), sow (R), dos (R), evaluate (O), backlog (R), finops (O), operationalize (O), analyze (R), principles-compliance (O), maturity-model (O), service-assessment (R), tcop (R), ai-playbook (O), story (R), presentation (R)

**ARC-*-RISK-*.md** (from risk) - read by 28 commands:

- plan (R), sobc (R), requirements (R), platform-design (O), roadmap (R), strategy (O), glossary (O), dpia (O), adr (R), sow (O), dos (O), hld-review (R), dld-review (R), backlog (R), devops (O), operationalize (R), analyze (R), principles-compliance (O), conformance (R), maturity-model (O), service-assessment (R), tcop (R), ai-playbook (R), secure (R), mod-secure (R), jsp-936 (R), story (R), presentation (R)

**ARC-*-DATA-*.md** (from data-model) - read by 22 commands:

- platform-design (O), framework (R), glossary (R), archify (O), dpia (M), datascout (R), dfd (O), wardley (O), data-mesh-contract (R), dld-review (R), servicenow (R), devops (O), mlops (R), operationalize (O), analyze (R), principles-compliance (R), maturity-model (O), service-assessment (R), ai-playbook (R), atrs (O), jsp-936 (O), story (R)

**ARC-*-SOBC-*.md** (from sobc) - read by 19 commands:

- plan (R), risk (O), requirements (R), platform-design (O), roadmap (O), strategy (R), glossary (O), data-model (O), research (R), azure-research (R), aws-research (R), gcp-research (R), grants (R), backlog (R), finops (O), analyze (R), service-assessment (R), story (R), presentation (R)

**ARC-*-RSCH-*.md** (from research) - read by 19 commands:

- framework (R), glossary (O), data-model (O), datascout (O), wardley (R), wardley.gameplay (O), wardley.climate (R), adr (O), sow (R), dos (R), gcloud-clarify (O), evaluate (R), devops (R), mlops (O), finops (O), service-assessment (O), tcop (O), story (R), presentation (R)

**HLD** (external vendor document) - read by 12 commands:

- archify (O), azure-research (R), aws-research (R), gcp-research (R), diagram (O), hld-review (M), backlog (R), servicenow (R), traceability (R), analyze (O), principles-compliance (R), conformance (R)

### Commands That Produce Critical Artifacts (High Fan-Out)

- **principles** → read by 59 commands (26 M, 23 R, 10 O)
- **requirements** → read by 57 commands (36 M, 12 R, 9 O)
- **stakeholders** → read by 38 commands (4 M, 25 R, 9 O)
- **risk** → read by 28 commands (0 M, 19 R, 9 O)
- **data-model** → read by 22 commands (1 M, 12 R, 9 O)
- **sobc** → read by 19 commands (0 M, 13 R, 6 O)
- **research** → read by 19 commands (0 M, 9 R, 10 O)
- The vendor HLD (external) → read by 12 commands (1 M, 8 R, 3 O)

---

## Design Notes

1. **ARC-*-REQ-*.md is the central artifact** - Nearly all downstream commands depend on it
2. **ARC-000-PRIN-v*.md is the governance foundation** - All design reviews check against principles
3. **Strategic order matters** - stakeholders → risk → sobc → requirements ensures business justification before technical work
4. **Platform strategy bridges business and technical** - platform-design sits between requirements (business needs) and design (technical architecture), useful for ecosystem-based platforms
5. **Quality gates can run iteratively** - beyond requirements and principles, analyze and service-assessment only recommend or optionally read their inputs, so they can run early (identifying gaps) or late (validating completeness)
6. **Compliance assessments feed quality gates** - analyze can read the tcop, ai-playbook, atrs and mod-secure outputs; service-assessment recommends secure and can read tcop, ai-playbook and atrs
7. **External artifacts** - HLD and DLD are created outside ArcKit but validated by hld-review/dld-review commands

---

## Version

- **ArcKit Version**: 6.18.2
- **Matrix Date**: 2026-10-17
- **Commands Documented**: 76 core commands in the matrix; 120 community overlay and tooling commands in Community Overlay Dependencies
- **Matrix Rows**: 65 (63 commands + 2 external documents)
- **Note**: `/arckit:build`, `/arckit:customize`, `/arckit:export-okf`, `/arckit:graph-report`, `/arckit:health`, `/arckit:impact`, `/arckit:import-okf`, `/arckit:init`, `/arckit:navigator`, `/arckit:pages`, `/arckit:search`, `/arckit:start`, `/arckit:template-builder` are not in the matrix. They need no earlier documents, or they work across whatever the project already holds rather than on particular documents, and no other command reads their output

## Changelog

### 2026-10-17 - Community overlay dependencies

- **Added**: a Community Overlay Dependencies section with one table per overlay and tooling plugin, covering all 120 commands outside core. Each command's prompt and template were read in full to record what it reads and at what level
- **Rule**: an input read only "if present" is optional unless the prompt also says to note or record the gap when it is missing

### 2026-10-17 - Matrix rebuilt from the command files

- **Rebuilt**: the matrix from the MANDATORY, RECOMMENDED and OPTIONAL inputs each core command file lists. It now covers 63 commands, adding archify, wardley.value-chain, wardley.doctrine, wardley.gameplay, wardley.climate, score, tenders and competitors, which were described only in their tier or in this changelog
- **Fixed**: alignment. Every old row had one cell fewer than the header, so its cells sat under the wrong columns
- **Fixed**: levels that no longer matched the command files. For example, requirements needs stakeholders (M), wardley and adr need principles and requirements (M), risk can read the tenders and competitors reports, and principles reads no earlier documents
- **Removed**: pages from the grid. It publishes whatever the project holds rather than depending on particular documents
- **Updated**: every Tier "Depends on" line, the fan-in summary, two design notes, and the critical paths (adr and diagram added, because conformance needs adr and servicenow and operationalize need diagram)
- **Checked**: a second pass read every core command prompt and its template in full. It led to 12 corrections:
  - archify reads wardley only for Wardley renders (R → O)
  - plan reads sobc and risk on the same terms as its other inputs (O → R)
  - stakeholders reads requirements on the same terms as principles (O → R)
  - data-mesh-contract reads requirements when they exist (O → R) and only checks that a DPIA exists, so dpia is no longer an input
  - servicenow can read tcop (O), dpia can read ai-playbook (O), presentation can read adr (O), and atrs can read tcop, hld-review and dld-review (O)
- **Updated**: after the prompts were fixed, gcp-research is read wherever aws-research is, at the same level, in sow, mlops, evaluate, dos, finops, story, service-assessment, adr, tcop and devops
- **Synced**: the copies in `plugins/arckit-claude/docs/` and the codex, copilot and opencode extensions now match this file, apart from this changelog

### 2026-10-07 - UK G-Cloud Supplier Overlay moves to G-Cloud 15 (Community, Proprietary)

The `arckit-uk-gcloud` overlay now targets G-Cloud 15 (RM1557.15), run by the Government Commercial Agency (GCA, formerly CCS), and drops G-Cloud 14. It goes from 11 commands to 15: `/arckit:sdd-lot1` is replaced by `/arckit:sdd-lot1a` and `/arckit:sdd-lot1b`, `/arckit:sdd-lot2` by `/arckit:sdd-lot2a` and `/arckit:sdd-lot2b`, and `/arckit:social-value` and `/arckit:lot-questions` are new. Total community-overlay command count moves up by 4. As before, overlay commands are documented here rather than as DSM grid rows.

**New commands and output doc-types** (regime UK, category Procurement, HIGH severity):

- `/arckit:social-value` → `SOCV` (Social Value Commitments), supplier-wide in `projects/000-global/supplier/`
- `/arckit:lot-questions` → `LOTQ` (G-Cloud Lot Questions), supplier-wide, one Part per lot group bid for
- `/arckit:sdd-lot1a`, `/arckit:sdd-lot1b`, `/arckit:sdd-lot2a`, `/arckit:sdd-lot2b` → `SDD` (one per G-Cloud 15 lot; `sdd-lot3` unchanged in name)
- `/arckit:pricing` → `PRIC`, and for Lot 3 also `RATE` (G-Cloud Lot 3 Rate Card; regime UK, category Procurement), the supplier's one rate card in `projects/000-global/supplier/`, shared by every Lot 3 service. The Lot 3 SDD lists the role levels that deliver the service and copies no rates

**Dependencies**: supplier-profile (SUPP) → social-value (SOCV, M) → service-design (SVCD) → sdd-lot1a / 1b / 2a / 2b / 3 (SDD, M) → pricing (PRIC, R; reads the SDD so the two agree; for Lot 3 also writes RATE) and security (SECA, R) → lot-questions (LOTQ, M; after the SDDs, because the Lot 2a/2b and Lot 3 award criteria repeat each service's SDD and security answers, R) → declaration (DECL, M; summarises SOCV, records the lots bid for) → review (GCRV; checks SUPP, SOCV, LOTQ, DECL, SVCD, SDD, PRIC, SECA and, for Lot 3, RATE) → submission-pack.

**Skills**: `gcloud-framework` (now with the G-Cloud 15 question references), `cloud-security`, `ddat-rate-card` (replaces `sfia-skills`). **Recipe**: `uk-gcloud-submission` adds the SOCV and LOTQ targets, runs LOTQ after the SDD, pricing and security, and defaults to `sdd-lot2b`.

**Typical G-Cloud 15 supplier path**:

```text
supplier-profile → social-value →
service-design → sdd-lot1a | sdd-lot1b | sdd-lot2a | sdd-lot2b | sdd-lot3 →
pricing / security → lot-questions → declaration →
gcloud-competitors (optional) → review → submission-pack
```

### 2026-09-03 - Interactive Diagram Rendering command (#826)

Added `/arckit:archify` (76th core command), taking the core plugin from 75 to 76 commands. Documented here via this changelog rather than as a DSM grid row, following the convention used for recent additions. Tier 6 detailed design.

**Command and output doc-type**:

- `/arckit:archify` → `DIAG` (Architecture Diagrams, category Architecture) — the same doc-type as `/arckit:diagram`, because it renders the same class of artefact in a different format. A `wardley` render updates the existing `WARD` artefact instead of creating a `DIAG`.

**Dependencies**: wardley (M for `wardley` renders — the OWM code block is the render input), diagram (R — the Mermaid/PlantUML companion for the same subject), requirements (R), hld (R — containers and technology choices for `architecture` renders), dfd (O), data-model (O), dld (O — participants and messages for `sequence` renders).

**Consumed by**: nothing. The command produces a rendering of artefacts that already exist and introduces no new analysis, so it is a leaf in the matrix. `/arckit:pages` may publish its output, but does not depend on it.

**Two engines**: `architecture`, `workflow`, `sequence`, `dataflow` and `lifecycle` route to [Archify](https://github.com/tt-a1i/archify) (third party, MIT), which the user installs separately and ArcKit detects at run time — it is deliberately **not vendored**. The `wardley` type routes to ArcKit's own `scripts/owm-to-html.mjs`, which ships with the plugin, because Archify has no Wardley diagram type and a continuous evolution/value-chain plane does not fit its node-graph IR.

**External dependency boundary**: when Archify is absent the command says so and hands off to `/arckit:diagram`; it never fabricates an interactive artefact. Wardley rendering has no external dependency at all, and both engines emit files that make no external requests — suitable for OFFICIAL-SENSITIVE and air-gapped review.

### 2026-08-13 - EU Cloud Sovereignty Framework Command (Community) (#740)

Added `/arckit:eu-cloud-sovereignty` to the `arckit-eu` community overlay, taking it from 7 commands to 8. Like the other overlay commands, it is documented here via this changelog rather than as a DSM grid row (the matrix tracks the official baseline). Tier 13 compliance assessment.

**Command and output doc-type**:

- `/arckit:eu-cloud-sovereignty` → `EUCSF` (EU Cloud Sovereignty Framework Assessment, regime EU, category Compliance, severity HIGH)

**Dependencies**: requirements (M — cloud service type, data sensitivity, sovereignty NFRs, member state), risk (R — existing cloud, supply-chain and foreign-interference risks), fr-secnumcloud (R — security qualification status, which is complementary to sovereignty rather than a substitute), principles (R — cloud strategy and foreign-dependency policy from `000-global`), eu-nis2 (O — Article 21 measures overlapping SOV-7), fr-dinum (O), nl-cloud (O — the Dutch policy position, where one is already recorded).

**Consumed by**: `risk` (R — unmet minimum SEAL levels and sovereignty gaps become risk entries), `nl-cloud` (O), `fr-secnumcloud` (O — where a French qualification is also in scope).

**Scope boundary**: the framework supplies the eight objectives, their weights and the SEAL scale; the **contracting authority** supplies the minimum SEAL per objective in the tender specification. The command records an assessment and does not certify — no provider is named as achieving any SEAL level.

**Typical EU cloud sovereignty path**:

```text
requirements → risk →
eu-cloud-sovereignty (minimum SEAL from tender spec, then evidence per objective) →
risk (gaps) → nl-cloud / fr-secnumcloud (national layer, where applicable)
```

### 2026-08-13 - Austrian Accessibility Command (Community) (#710)

Added `/arckit:at-barrierefreiheit` to the `arckit-at` community overlay, taking it from 3 commands to 4. Like the other overlay commands, it is documented here via this changelog rather than as a DSM grid row (the matrix tracks the official baseline). Tier 13 compliance assessment.

**Command and output doc-type**:

- `/arckit:at-barrierefreiheit` → `ATBFR` (Austrian Accessibility Assessment (BaFG / WZG), regime AT, category Compliance, severity HIGH)

**Dependencies**: requirements (M — NFR-UX targets and the user-facing surface inventory), stakeholders (R — assistive-technology users, consumers versus citizens), diagram / hld (R — the actual surfaces), at-bvergg (O — any accessibility clause already imposed on a supplier), risk (O), sobc (O — headcount and turnover, which drive the BaFG microenterprise exemption).

**Consumed by**: `requirements` (O — conformance gaps become NFR-UX items), `at-bvergg` (O — the conformance target is carried into the Leistungsbeschreibung rather than rediscovered at acceptance), `at-dsgvo` (O — where the feedback mechanism processes personal data).

**Scope boundary**: `/arckit:at-bvergg` covers accessibility as a *procurement clause* (§107 BVergG). This command covers the entity's own products, services, websites and apps. The two are complementary and share the same standard version — EN 301 549 v3.2.1, giving WCAG 2.1 AA.

**Typical Austrian accessibility path**:

```text
requirements → stakeholders →
at-barrierefreiheit (applicability: BaFG / WZG / both) →
requirements (NFR-UX gaps) → at-bvergg (remediation procurement) →
traceability
```

### 2026-06-10 - UK G-Cloud Supplier Bid-Authoring Overlay Commands (Community, Proprietary)

Added 11 community-overlay commands shipping in the new 13th marketplace plugin `arckit-uk-gcloud` — a **proprietary (not MIT), Claude Code only** supplier-side overlay for authoring UK G-Cloud (Digital Marketplace) framework bids. It is the 4th sector-specific overlay (after `arckit-uk-finance`, `arckit-uk-nhs`, `arckit-au-energy`) and **requires the `arckit` core plugin**. Unlike every other overlay it is **not distributed to the non-Claude extension formats** (Codex / Gemini / OpenCode / Copilot). Like the other overlays, these commands are documented here via this changelog rather than as DSM grid rows (the matrix tracks the official baseline). Total community-overlay command count moves to **87** (`arckit-uk-gcloud` adds 11), alongside the official baseline.

**Commands and output doc-types** (all regime UK, category Procurement; SDD / DECL / SECA are HIGH severity):

- `/arckit:supplier-profile` → `SUPP` (Supplier Profile)
- `/arckit:service-design` → `SVCD` (Service Design)
- `/arckit:sdd-lot1` → `SDD` (Service Definition Document — Lot 1 Cloud Hosting)
- `/arckit:sdd-lot2` → `SDD` (Service Definition Document — Lot 2 Cloud Software)
- `/arckit:sdd-lot3` → `SDD` (Service Definition Document — Lot 3 Cloud Support)
- `/arckit:declaration` → `DECL` (Supplier Declaration)
- `/arckit:pricing` → `PRIC` (Pricing Document)
- `/arckit:security` → `SECA` (Security Assertions)
- `/arckit:gcloud-competitors` → `GCMP` (G-Cloud Competitor Benchmark)
- `/arckit:review` → `GCRV` (G-Cloud Submission Review)
- `/arckit:submission-pack` — assembles the final G-Cloud submission pack from the above artefacts

**Dependencies**: all 11 commands depend on the `arckit` core plugin (templates, helper scripts, doc-id generation, hooks). Within the overlay, `/arckit:review` and `/arckit:submission-pack` consume the upstream SUPP / SVCD / SDD / DECL / PRIC / SECA / GCMP artefacts (R). `/arckit:gcloud-competitors` (GCMP) optionally informs `/arckit:service-design` and pricing positioning (O).

**Skills**: `gcloud-framework`, `cloud-security`, `sfia-skills`. **Recipe**: `uk-gcloud-submission` (end-to-end bid assembly). Ported from the standalone gcloud-kit plugin.

### 2026-06-02 - Competitor Landscape command + Assurance wiring (#556)

- **Added**: `/arckit:competitors` command (86th ArcKit command) for competitor landscape analysis from the UK Tenders MCP
- **Updated**: Tier 7 Procurement to include competitors command alongside tenders
- **Dependencies**: requirements (O), tenders (O), research (O) — all optional; command can run standalone with only a supplier name, capability keyword, or CPV scope
- **Consumed by**: risk (O — supplier-concentration/single-supplier-dependency risk), sobc (O — market-context benchmark), research (O — award-evidence grounding), score (O — Company Experience evidence)
- **Doc-type produced**: `CMPT` (Competitor Landscape, regime UK) — previously pre-registered; now live
- **Updated**: Commands Documented count from 85 to 86
- **Assurance wiring**: `risk` now accepts TNDR/CMPT as optional inputs for supplier-concentration risk; `sobc` accepts TNDR/CMPT for Economic Case market-context; `research` accepts TNDR/CMPT for award-evidence grounding; `score` accepts CMPT for Company Experience evidence — all regime-gated handoffs (UK Gov `governance_framework`)
- **Note**: Agent-delegating command (reader/orchestrator/writer three-tier split). Shares `arckit-tenders-reader` with `/arckit:tenders` — same MCP reader, different orchestrator/writer lens (supplier-rivalry vs. market-wide). Fits alongside tenders in the optional-input pattern.

### 2026-06-02 - Procurement Market Intelligence command (#556)

- **Added**: `/arckit:tenders` command (85th ArcKit command) for procurement market intelligence from the UK Tenders MCP
- **Updated**: Tier 7 Procurement to include tenders command
- **Dependencies**: requirements (O), sobc (O), research (O) — all optional; command can run standalone with only a keyword or CPV scope
- **Consumed by**: sobc (O — Economic Case benchmarks), risk (O — concentration risk), research (O — build-vs-buy market context)
- **Doc-type produced**: `TNDR` (Procurement Market Intelligence, regime UK)
- **Updated**: Commands Documented count from 84 to 85
- **Note**: Agent-delegating command (reader/orchestrator/writer three-tier split). Requires bundled `uk-tenders` MCP server (keyless, deferred, best-effort). Not added to the main DSM table because it produces no artifact currently consumed as a MANDATORY input by any other command — fits alongside datascout in the optional-input pattern.

### 2026-04-28 - Graph-aware diagnostic commands (#359)

- **Added**: `/arckit:navigator` — project-level GPS. Read-only diagnostic. No dependencies, no outputs consumed by other commands. Listed in the utility/diagnostic exclusion note above; not added to the matrix proper.
- **Added**: `/arckit:graph-report` — multi-project governance metrics dashboard. Read-only diagnostic. No dependencies, no outputs consumed by other commands. Listed in the utility/diagnostic exclusion note above; not added to the matrix proper.
- **Updated**: Commands Documented count from 82 to 84.
- **Note**: Both commands are backed by the consolidated `graph-inject.mjs` hook (#162) which injects pre-computed graph context for read-only commands. They consume *every* artifact in a project, but transitively via the graph — they don't depend on any specific producing command.

### 2026-03-16 - Wardley Mapping Suite

- **Added**: wardley.value-chain command — Depends on: requirements (M), stakeholders (R). Produces WVCH artifacts
- **Added**: wardley.doctrine command — Depends on: principles (M), wardley (R), stakeholders (R). Produces WDOC artifacts
- **Added**: wardley.gameplay command — Depends on: wardley (M), wardley.climate (R), wardley.doctrine (R). Produces WGAM artifacts
- **Added**: wardley.climate command — Depends on: wardley (M), requirements (R), research (R). Produces WCLM artifacts
- **Updated**: Commands documented from 60 to 64

### 2026-03-13 - Dependency Matrix Audit Fixes

- **Fixed**: data-model row — added principles (R) dependency (command reads principles for data governance standards)
- **Fixed**: adr row — changed risk from (O) to (R) (command reads risk register for decision context)
- **Fixed**: data-mesh-contract tier text — removed spurious diagram (R) dependency (command never reads diagrams)
- **Fixed**: devops row — changed principles from (R) to (M), corrected tier text to show principles (M) and diagram (R)
- **Fixed**: dfd row — changed requirements from (M) to (O) (command can generate DFDs from user description alone)
- **Fixed**: diagram row — changed requirements from (M) to (O) (command can generate diagrams from user description alone)
- **Fixed**: traceability row — changed HLD/DLD from (M) to (R) (hook pre-processing reduces direct file read dependency)
- **Updated**: glossary tier text — added optional dependencies (principles, sobc, research, adr, strategy, risk)
- **Updated**: wardley tier text — added optional dependencies (research, data-model, tcop, ai-playbook)
- **Updated**: ARC-*-REQ-*.md consumption count from 38 to 36 (dfd and diagram changed from M to O)
- **Note**: Audit performed by comparing matrix entries against actual command file implementations

### 2026-03-09 - Added Impact Analysis Command

- **Added**: `/arckit:impact` command (60th ArcKit command) for blast radius analysis and reverse dependency tracing
- **Not in matrix**: Diagnostic command with console-only output — no dependencies and no outputs consumed by other commands
- **Updated**: Commands Documented count from 59 to 60
- **Note**: Uses UserPromptSubmit pre-processing hook (`impact-scan.mjs`) to build a dependency graph with doc-to-doc edges for reverse traversal

### 2026-03-08 - Added Vendor Scoring Command

- **Added**: `/arckit:score` command (59th ArcKit command) for structured vendor scoring with JSON storage, comparison, and audit trail
- **Added**: score row and column to dependency matrix
- **Updated**: Tier 7 Procurement to include score command
- **Dependencies**: evaluate (M), requirements (M)
- **Consumed by**: sow (O), pages (R)
- **Updated**: Commands Documented count from 58 to 59
- **Note**: First command to use structured JSON output instead of Markdown; includes PreToolUse validator hook for scores.json integrity

### 2026-03-08 - Added Project Search Command

- **Added**: `/arckit:search` command (58th ArcKit command) for keyword, type, and requirement ID search across all project artifacts
- **Not in matrix**: Diagnostic/query command with console-only output — no dependencies and no outputs consumed by other commands
- **Updated**: Commands Documented count from 57 to 58
- **Note**: Uses UserPromptSubmit pre-processing hook (`search-scan.mjs`) to index artifacts before search

### 2026-03-08 - Added DFD Command to Matrix

- **Added**: `/arckit:dfd` row and column to dependency matrix
- **Updated**: Tier 6 Detailed Design to include dfd command
- **Dependencies**: requirements (M), data-model (R), principles (O), diagram (O)
- **Consumed by**: traceability (O), analyze (O), story (R), pages (R), presentation (O)
- **Note**: Multi-instance document type (ARC-*-DFD-{NUM}-v*.md); generates Yourdon-DeMarco Data Flow Diagrams
- **Updated**: Matrix Rows from 53 to 54
- **Added**: `/arckit:init` to utility command exclusion note

### 2026-03-06 - Added Framework, Glossary, and Maturity Model Commands

- **Added**: `/arckit:framework` command (55th ArcKit command) for transforming architecture artifacts into a structured, reusable framework
- **Added**: framework row and column to dependency matrix
- **Updated**: Tier 5 Strategic Planning to include framework command
- **Dependencies**: principles (M), requirements (M), stakeholders (R), strategy (R), data-model (R), research (R)
- **Consumed by**: glossary (R), maturity-model (R), story (R), pages (R), presentation (O)
- **Note**: Agent-delegating command using arckit-framework agent for synthesis

- **Added**: `/arckit:glossary` command (56th ArcKit command) for generating comprehensive project glossary
- **Added**: glossary row and column to dependency matrix
- **Updated**: Tier 5 Strategic Planning to include glossary command
- **Dependencies**: requirements (R), data-model (R)
- **Consumed by**: story (R), pages (R), presentation (O)

- **Added**: `/arckit:maturity-model` command (57th ArcKit command) for generating capability maturity model
- **Added**: maturity-model row and column to dependency matrix
- **Updated**: Tier 13 Compliance Assessment to include maturity-model command
- **Dependencies**: principles (R)
- **Consumed by**: roadmap (R), strategy (R), story (R), pages (R), presentation (O)

- **Updated**: Commands Documented count from 54 to 57
- **Updated**: Matrix Rows from 52 to 55

### 2026-03-02 - Added Template Builder Command

- **Added**: `/arckit:template-builder` command (54th ArcKit command) for creating new document templates through interactive interview
- **Not in matrix**: Utility command that generates community-origin templates, guides, and optional shareable bundles — no dependencies and no outputs consumed by other commands
- **Updated**: Commands Documented count from 53 to 54
- **Note**: Introduces three-tier origin model (Official/Custom/Community) for templates and guides

### 2026-02-25 - Added Architecture Conformance Assessment Command

- **Added**: `/arckit:conformance` command (52nd ArcKit command) for systematic decided-vs-designed conformance checking
- **Added**: conformance row and column to dependency matrix
- **Updated**: Tier 13 Compliance Assessment to include conformance command
- **Dependencies**: principles (M), adr (M), requirements (R), hld-review (R), dld-review (R), principles-compliance (R), traceability (R), HLD (R), DLD (R), risk (O), devops (O)
- **Consumed by**: analyze (O), service-assessment (O), story (R), pages (R), presentation (O)
- **Doc ID**: `ARC-{PID}-CONF-v{VERSION}`
- **Note**: Bridges `/arckit:health` (quick metadata scan) and `/arckit:analyze` (deep governance) with 12 conformance checks covering ADR implementation, cross-decision consistency, architecture drift, technical debt, and custom constraint rules

### 2026-02-20 - Added Health Check Command

- **Added**: `/arckit:health` command (51st ArcKit command) for scanning projects for stale research, forgotten ADRs, unresolved conditions, orphaned requirements, missing traceability, and version drift
- **Not in matrix**: Diagnostic command with console-only output — no dependencies and no outputs consumed by other commands
- **Updated**: Commands Documented count from 50 to 51

### 2026-02-20 - Research Knowledge Compounding

- **Updated**: `/arckit:research` now spawns `vendors/{slug}-profile.md` and `tech-notes/{slug}.md` from research findings
- **Note**: New output files are standalone knowledge — not consumed by other commands via the dependency matrix
- **Flag**: `--no-spawn` skips knowledge compounding

### 2026-02-19 - Added Presentation Command

- **Added**: `/arckit:presentation` command (50th ArcKit command) for generating MARP-format slide decks from project artifacts
- **Added**: presentation row and column to dependency matrix
- **Updated**: Tier 14 to include presentation alongside story
- **Dependencies**: All artifacts (R) — reads whatever is available, minimum 3 recommended
- **Consumed by**: pages (R)
- **Note**: Similar to story in consuming all artifacts; output is MARP markdown that renders to PDF/PPTX/HTML

### 2026-02-09 - Added GCP Research Command

- **Added**: `/arckit:gcp-research` command (47th ArcKit command) for Google Cloud-specific technology research using Google Developer Knowledge MCP server
- **Added**: gcp-research row and column to dependency matrix
- **Updated**: Tier 6 Detailed Design to include gcp-research command
- **Dependencies**: requirements (M), data-model (R), stakeholders (R), MCP Server (External)
- **Consumed by**: diagram (R), devops (R), finops (R), adr (R), pages (R)
- **Note**: Requires Google Developer Knowledge MCP server with API key (`GOOGLE_API_KEY`) for authoritative Google Cloud documentation

### 2026-02-05 - Added Template Customization Command

- **Added**: `/arckit:customize` command (46th ArcKit command) for copying templates to `.arckit/templates-custom/`
- **Not in matrix**: Utility command with no dependencies and no outputs consumed by other commands
- **Purpose**: Enables template customization that persists across `arckit init` updates

### 2026-02-05 - Added Architecture Strategy Command

- **Added**: `/arckit:strategy` command (45th ArcKit command) for synthesising strategic artifacts into executive-level Architecture Strategy document
- **Added**: strategy row and column to dependency matrix
- **Updated**: Tier 5 Strategic Planning to include strategy command
- **Dependencies**: principles (M), stakeholders (M), wardley (R), roadmap (R), sobc (R), risk (O)
- **Consumed by**: story (R), pages (R)
- **Note**: Unique among ArcKit commands in requiring TWO mandatory inputs (principles AND stakeholders)
- **Purpose**: Creates single coherent strategic narrative from multiple strategic artifacts for executive stakeholders

### 2026-02-04 - Added Trello Export Command

- **Added**: `/arckit:trello` command (44th ArcKit command) for exporting product backlog to Trello boards
- **Added**: trello row and column to dependency matrix
- **Added**: Tier 10 Backlog Export for trello command
- **Dependencies**: backlog (M) — reads `ARC-*-BKLG-*.json`
- **Consumed by**: None (external Trello board output)
- **Note**: Requires `TRELLO_API_KEY` and `TRELLO_TOKEN` environment variables; uses Trello REST API via curl

### 2026-02-01 - Added Data Source Discovery Command

- **Added**: `/arckit:datascout` command (43rd ArcKit command) for discovering external data sources (APIs, datasets, open data portals, commercial providers)
- **Added**: datascout row and column to dependency matrix
- **Updated**: Tier 6 Detailed Design to include datascout command
- **Dependencies**: requirements (M), data-model (O), stakeholders (R), principles (R)
- **Consumed by**: data-model (R), research (R), adr (R), dpia (O), diagram (O), traceability (R), pages (R)
- **Note**: Bidirectional with data-model; prioritises UK Government open data sources (TCoP Point 10)

### 2026-01-29 - Added AWS Research Command

- **Added**: `/arckit:aws-research` command (42nd ArcKit command) for AWS-specific technology research using AWS Knowledge MCP server
- **Added**: aws-research row and column to dependency matrix
- **Updated**: Tier 6 Detailed Design to include aws-research command
- **Dependencies**: requirements (M), data-model (R), stakeholders (R), MCP Server (External)
- **Consumed by**: diagram (R), devops (R), finops (R), adr (R), pages (R)
- **Note**: Requires AWS Knowledge MCP server for authoritative AWS documentation

### 2026-01-29 - Added Azure Research Command

- **Added**: `/arckit:azure-research` command (41st ArcKit command) for Azure-specific technology research using Microsoft Learn MCP server
- **Added**: azure-research row and column to dependency matrix
- **Updated**: Tier 6 Detailed Design to include azure-research command
- **Dependencies**: requirements (M), data-model (R), stakeholders (R), MCP Server (External)
- **Consumed by**: diagram (R), devops (R), finops (R), adr (R), secure (O), pages (R)
- **Note**: Requires Microsoft Learn MCP server for authoritative Azure documentation

### 2026-01-28 - Added Missing Operations Commands to Matrix

- **Fixed**: Added devops, mlops, finops, operationalize rows and columns to the matrix
- **Updated**: ARC-*-REQ-*.md consumption count from 23 to 27 commands
- **Updated**: ARC-000-PRIN-v*.md consumption count from 15 to 17 commands
- **Note**: These commands were documented in Tier 11 but missing from the actual DSM table

### 2026-01-28 - Standardized Filename Patterns

- **Updated**: All filename references now use Document ID pattern `ARC-{PROJECT_ID}-{TYPE}-v*.md`
- **Updated**: Multi-instance types use `ARC-{PROJECT_ID}-{TYPE}-{NUM}-v*.md` (ADR, DIAG, WARD, DMC)
- **Updated**: Subdirectory references use explicit patterns (`wardley-maps/ARC-*-WARD-*.md`, `diagrams/ARC-*-DIAG-*.md`)
- **Updated**: Vendor submissions use versioned pattern (`hld-v*.md`, `dld-v*.md`)
- **Version**: Bumped to 1.0.0

### 2026-01-22 - Added Pages Command

- **Added**: `/arckit:pages` command (40th ArcKit command) for GitHub Pages documentation site generation with Mermaid diagram support
- **Category**: Documentation & Publishing
- **Dependencies**: None (utility command)

### 2026-01-21 - Added FinOps Command

- **Added**: `/arckit:finops` command (39th ArcKit command) for FinOps strategy with cloud cost management, optimization, governance, and forecasting
- **Updated**: Tier 11 Operations to include finops command
- **Dependencies**: requirements (M), devops (R), diagram (R), principles (R)

### 2026-01-09 - Added DevOps, MLOps, and Operationalize Commands

- **Added**: `/arckit:devops` command (34th ArcKit command) for DevOps strategy with CI/CD pipelines, IaC, container orchestration
- **Added**: `/arckit:mlops` command (35th ArcKit command) for MLOps strategy with model lifecycle, training pipelines, serving, monitoring
- **Added**: `/arckit:operationalize` command (36th ArcKit command) for operational readiness with SRE practices, runbooks, DR/BCP
- **Updated**: Tier 11 Operations to include devops, mlops (AI projects), operationalize commands
- **Updated**: All 6 critical paths to include new commands in operations phase
- **Dependencies**:
  - devops: requirements (M), diagram (R), research (R), principles (R)
  - mlops: requirements (M), data-model (R), ai-playbook (R), research (R)
  - operationalize: requirements (M), servicenow (R), diagram (R), risk (R)

### 2025-01-06 - Added Platform Design Command

- **Added**: `/arckit:platform-design` command (33rd ArcKit command) for multi-sided platform strategy design using Platform Design Toolkit (PDT) methodology
- **Added**: platform-design row and column to dependency matrix
- **Added**: New critical path: "UK Government Platform Strategy Path" showing where platform-design fits
- **Added**: Tier 5 "Strategic Planning (Platform Strategy)" for platform-design placement
- **Updated**: Tier 6 commands to optionally consume platform-design (research R, wardley R, diagram R)
- **Updated**: analyze to consume platform-design (O), principles-compliance (R), service-assessment (O)
- **Dependencies**: principles (M), stakeholders (R), requirements (R), wardley (R), risk (O), sobc (O), data-model (O)
- **Consumed by**: research (R), wardley (R), diagram (R), analyze (M), principles-compliance (R), service-assessment (R)
- **Use case**: Designing Government as a Platform (GaaP) services, data marketplaces, multi-sided platforms

### 2025-11-04 - Added Principles Compliance Command

- **Added**: `/arckit:principles-compliance` command for measuring architecture principles adherence
- **Added**: principles-compliance row and column to dependency matrix
- **Updated**: All critical paths to include principles-compliance assessment
- **Updated**: Tier 13 description to include principles-compliance command
- **Updated**: service-assessment to optionally consume principles-compliance output (O)
- **Dependencies**: principles (M), requirements (R), stakeholders (R), risk (R), data-model (R), HLD (R), DLD (R), hld-review (R), dld-review (R), traceability (R), dpia (R), tcop (R), secure (R), mod-secure (R)

### 2025-11-02 - Critical Fixes + Optional Dependencies

- **Added**: analyze row showing optional dependencies on all artifacts
- **Fixed**: service-assessment compliance dependencies changed from M to O (tcop, ai-playbook, atrs, secure, mod-secure, jsp-936)
- **Fixed**: analyze compliance dependencies changed from M to O (tcop, ai-playbook, atrs, mod-secure)
- **Updated**: Critical paths reordered to show compliance commands before quality gates
- **Updated**: Tier 12 and Tier 13 descriptions to reflect optional dependencies and iterative execution
- **Added**: 23 optional dependencies to complete matrix:
  - plan: principles, stakeholders, risk, sobc, requirements (5)
  - diagram: principles, DLD, tcop, ai-playbook, atrs (5)
  - wardley: principles, tcop, ai-playbook, atrs (4)
  - tcop: diagram, wardley (2)
  - ai-playbook: diagram, wardley, atrs (3)
  - atrs: diagram, wardley (2)
  - secure: diagram (1)
  - mod-secure: diagram (1)
  - jsp-936: data-model, diagram (2)
  - sow: dos, hld-review (2)
  - DLD: diagram (1)
- **Updated Templates**:
  - architecture-diagram-template.md: Added ATRS to Linked Artifacts
  - wardley-map-template.md: Added AI Playbook/ATRS mapping sections for AI systems

### 2026-04-19 - EU and French Government Compliance Commands

Added 18 new commands covering EU regulations and French public sector governance. These are Tier 13 compliance-assessment commands that are largely independent of each other but consume the standard project artifacts (REQ, RISK, DATA, SECD) and cross-reference each other via handoffs.

**New EU commands**:

- `/arckit:eu-rgpd` — GDPR / French CNIL compliance. Depends on: requirements (M), data-model (R), dpia (O). Produces ARC-*-RGPD-*.md
- `/arckit:eu-ai-act` — EU AI Act (Reg 2024/1689) compliance. Depends on: requirements (M), risk (R), data-model (R). Produces ARC-*-AIACT-*.md
- `/arckit:eu-nis2` — NIS2 Directive compliance + French OIV/OSE. Depends on: requirements (M), risk (M), secure (R). Produces ARC-*-NIS2-*.md
- `/arckit:eu-dora` — DORA (Reg 2022/2554) compliance for financial entities. Depends on: requirements (M), risk (M), secure (R). Produces ARC-*-DORA-*.md
- `/arckit:eu-cra` — Cyber Resilience Act (Reg 2024/2847) compliance. Depends on: requirements (M), risk (R), secure (R). Produces ARC-*-CRA-*.md
- `/arckit:eu-dsa` — Digital Services Act (Reg 2022/2065) compliance. Depends on: requirements (M), risk (R). Produces ARC-*-DSA-*.md
- `/arckit:eu-data-act` — EU Data Act (Reg 2023/2854) compliance. Depends on: requirements (M), data-model (R), risk (R). Produces ARC-*-DATAACT-*.md

**New French commands**:

- `/arckit:fr-rgpd` — French GDPR with CNIL specifics. Depends on: requirements (M), data-model (R), eu-rgpd (O). Produces ARC-*-RGPD-*.md (FR variant)
- `/arckit:fr-ebios` — EBIOS Risk Manager (5 workshops). Depends on: requirements (M), risk (M), data-model (R). Produces ARC-*-EBIOS-*.md
- `/arckit:fr-anssi` — ANSSI 42 Cybersecurity Hygiene Measures. Depends on: requirements (M), risk (R). Produces ARC-*-ANSSI-*.md
- `/arckit:fr-anssi-carto` — ANSSI IS Cartography (4 levels). Depends on: requirements (M), data-model (R), diagram (O). Produces ARC-*-CARTO-*.md
- `/arckit:fr-secnumcloud` — SecNumCloud qualification assessment. Depends on: requirements (M), fr-ebios (R), fr-anssi (R). Produces ARC-*-SECNUM-*.md
- `/arckit:fr-dinum` — DINUM digital doctrine (RGI, RGAA, cloud doctrine, SILL). Depends on: requirements (M), principles (R). Produces ARC-*-DINUM-*.md
- `/arckit:fr-marche-public` — French public procurement (Code de la Commande Publique). Depends on: requirements (M), stakeholders (R). Produces ARC-*-MARCHE-*.md
- `/arckit:fr-pssi` — PSSI (IS Security Policy for French public sector). Depends on: requirements (M), fr-ebios (R), fr-anssi (R), fr-anssi-carto (R). Produces ARC-*-PSSI-*.md
- `/arckit:fr-dr` — Diffusion Restreinte document and IS handling. Depends on: requirements (M), fr-anssi (R). Produces ARC-*-DR-*.md
- `/arckit:fr-algorithme-public` — French Public Algorithm Transparency Notice. Depends on: requirements (M), data-model (R). Produces ARC-*-ALGO-*.md
- `/arckit:fr-code-reuse` — French Public Code Reuse Assessment. Depends on: requirements (M), research (R). Produces ARC-*-REUSE-*.md

### Netherlands Public Sector Overlay (arckit-nl) — community-contributed

- `/arckit:nl-tbb` — Te Beschermen Belangen (TBB) category determination; any existing VIRBI 2025 rubricering is a floor on the category, never an output. Depends on: requirements (M), data-model (R), risk (R), principles (O). Produces ARC-*-TBB-*.md
- `/arckit:nl-cloud` — Rijksbreed cloudbeleid 2026 compliance. Depends on: requirements (M), nl-tbb (R), nl-bio (R), principles (R), risk (R), dpia (O), secure (O). Produces ARC-*-RBCLOUD-*.md
- `/arckit:nl-bio` — BIO2 conformance assessment. Depends on: requirements (M), nl-cloud (R), nl-tbb (R), risk (R), secure (R), data-model (O). Produces ARC-*-BIO2-*.md
- `/arckit:nl-exit` — Cloud exit plan (Rijksbreed cloudbeleid clause 3.2). Depends on: requirements (M), nl-cloud (R), risk (R), data-model (O). Produces ARC-*-NLEXIT-*.md

**Key inter-dependencies among NL commands**:

- `nl-tbb` → feeds `nl-cloud` (R) — the TBB category, with any existing marking it records, decides the clause 5.2 public-cloud prohibition; without it `nl-cloud` flags the category as pending
- `nl-cloud` → feeds `nl-exit` (R) — the exit plan is required for material cloud use identified by the assessment
- `nl-cloud` assesses Cbw essential-entity status itself (clause 4.3); it does not read an `eu-nis2` artefact

**Typical Dutch central-government compliance path**:

```text
stakeholders → requirements → risk →
nl-tbb → nl-cloud → nl-exit → nl-bio →
eu-nis2 → eu-data-act
```

**Key inter-dependencies among EU/FR commands**:

- `fr-ebios` → feeds `fr-secnumcloud` (M), `fr-pssi` (R), `fr-anssi` (R)
- `fr-anssi` → feeds `fr-pssi` (R), `fr-secnumcloud` (R), `fr-dr` (R)
- `fr-anssi-carto` → feeds `fr-pssi` (R)
- `eu-rgpd` / `fr-rgpd` → consumed by `fr-algorithme-public` (O) and `eu-ai-act` (O)
- `eu-nis2` → feeds `eu-dora` (O), `eu-cra` (O) when product used by NIS2 entities
- `risk` → feeds all compliance commands (R or M)

**Typical French public sector compliance path**:

```text
requirements → risk → data-model →
fr-ebios → fr-anssi → fr-anssi-carto → fr-secnumcloud → fr-pssi →
eu-rgpd → fr-rgpd → eu-nis2 → fr-dr → fr-algorithme-public →
fr-dinum → fr-marche-public → fr-code-reuse
```

**Typical EU private sector compliance path** (connected product / cloud provider):

```text
requirements → risk → data-model →
eu-rgpd → eu-nis2 → eu-cra → eu-data-act → eu-dsa → eu-ai-act
```

- **Updated**: Commands Documented count from 64 to 82 (86 total; 4 utility commands not in matrix: customize, template-builder, health, search, impact, init, start, score, fr-code-reuse, gov-reuse, gov-code-search, gov-landscape are in matrix)
- **Updated**: Matrix version date to 2026-04-19

### 2026-04-30 - UAE Federal Overlay Commands (Official Baseline)

Added 12 official-baseline commands covering UAE federal regulatory and digital-government instruments. These sit between requirements/data-model and the cross-cutting commands (sobc, wardley, framework). They take the official-tier count from 68 to 80.

**New UAE commands** (anchored on the UAE Cabinet decree of 23 April 2026 and the federal data, identity, AI, and procurement frameworks):

- `/arckit:uae-classification` — UAE Smart Data Classification Register. Depends on: requirements (R), data-model (R). Produces ARC-*-CLAS-*.md
- `/arckit:uae-pdpl` — Federal Decree-Law No. 45 of 2021 (PDPL) compliance assessment. Depends on: requirements (M), data-model (R), risk (R). Produces ARC-*-PDPL-*.md
- `/arckit:uae-ias` — UAE Cybersecurity Council IAS v2 Statement of Applicability. Depends on: requirements (M), risk (R), secure (R). Produces ARC-*-IAS-*.md
- `/arckit:uae-cloud-residency` — National Cloud Security Policy v2 sovereign cloud assessment. Depends on: uae-classification (M), requirements (R). Produces ARC-*-CLDR-*.md
- `/arckit:uae-uaepass` — UAE Pass integration design (OIDC/OAuth, claim mapping, profiles, e-signature). Depends on: requirements (M), integration (R). Produces ARC-*-UPASS-*.md
- `/arckit:uae-zero-bureaucracy` — Service Catalogue review under Code for Government Services. Depends on: requirements (M), user-stories (R), journeys (R). Produces ARC-*-ZBUR-*.md
- `/arckit:uae-digital-records` — Digital Records Plan (source-of-truth register, retention, official-source). Depends on: requirements (M), data-model (R), uae-classification (R). Produces ARC-*-DREC-*.md
- `/arckit:uae-data-sharing` — Data Sharing Agreement under Data Sharing Policy. Depends on: requirements (M), uae-classification (R), uae-pdpl (R). Produces ARC-*-DSHR-*.md
- `/arckit:uae-priorities-alignment` — National Priorities Alignment Statement. Depends on: requirements (M), sobc (R), prior UAE artefacts (O). Produces ARC-*-NPRA-*.md
- `/arckit:uae-ai-charter` — UAE Charter for AI compliance assessment (12 principles). Depends on: requirements (M), risk (R), data-model (R). Produces ARC-*-AICH-*.md
- `/arckit:uae-ai-autonomy-tier` — Three-tier AI autonomy posture. Depends on: requirements (M), uae-ai-charter (R), risk (R). Produces ARC-*-AUTI-*.md
- `/arckit:uae-procurement` — Federal procurement strategy under Decree-Law No. 11 of 2023. Depends on: requirements (M), sobc (R), risk (R). Produces ARC-*-FPRO-*.md

**Key inter-dependencies among UAE commands**:

- `uae-classification` → feeds `uae-cloud-residency` (M), `uae-data-sharing` (R), `uae-digital-records` (R)
- `uae-pdpl` → feeds `uae-data-sharing` (R), `risk` (M)
- `uae-ias` → feeds `risk` (M), `uae-cloud-residency` (R)
- `uae-ai-charter` → feeds `uae-ai-autonomy-tier` (R), `risk` (R)
- `uae-zero-bureaucracy` / `uae-digital-records` / `uae-data-sharing` → feed `uae-priorities-alignment` (R)
- `uae-priorities-alignment` → feeds `sobc` (R)

**Canonical UAE federal pathfinder path**:

```text
principles → requirements → data-model → risk →
uae-classification → uae-pdpl → uae-ias → uae-cloud-residency → uae-uaepass →
uae-zero-bureaucracy → uae-digital-records → uae-data-sharing →
uae-ai-charter → uae-ai-autonomy-tier → uae-priorities-alignment →
uae-procurement → sobc → wardley → framework
```

- **Updated**: Commands Documented count to 94 official-baseline rows (80 baseline + 12 UAE counted in baseline; 21 community commands tracked separately in their own changelog entry above)
- **Updated**: Matrix version date to 2026-04-30

### 2026-05-04 - Canada Federal Overlay Commands (Community)

Added 12 community-overlay commands (`ca-*`) covering federal Canadian regulatory and digital-government instruments. They ship with the `[COMMUNITY]` description prefix and are not part of the officially-maintained baseline. Total command count moves from 104 to 116 (70 official + 46 community).

The 12 commands cover: FITAA (Bill C-70 2024), federal privacy and access (Privacy Act, ATI Act), Treasury Board Directive on Automated Decision-Making, Charter rights design review, ITSG-33 + Standard on Security Categorization, Security of Information Act handling, GC Cloud sovereign residency, GC Digital Standards conformance, Official Languages Act, federal procurement (PSPC + PSAB), and First Nations OCAP® data sovereignty.

**Canonical execution chains**:

```text
Flow 1 — FITAA-class application (registration scheme, scoring, automated triage):
principles → stakeholders → requirements → ca-charter → ca-fitaa → ca-pia → ca-atip → ca-aia (if ADM) → ca-ocap (if Indigenous data)
  → ca-itsg-33 → ca-soia (if classified) → ca-cloud-residency → ca-ola
  → ca-gc-digital-standards → risk → sobc → ca-pspc → adr → framework
```

```text
Flow 2 — generic federal Canadian application:
principles → stakeholders → requirements → ca-pia → ca-atip → ca-aia (if ADM) → ca-ocap (if Indigenous data)
  → ca-itsg-33 → ca-cloud-residency → ca-ola
  → ca-gc-digital-standards → risk → sobc → ca-pspc → adr → framework
```

**Handoff matrix** (extracted from `plugins/arckit-ca/commands/ca-*.md` frontmatter — these are the suggested next commands after each one runs):

| From command | Handoff target | Condition / rationale |
|---|---|---|
| `ca-fitaa` | `ca-charter` | Charter §2 (expression / association) review required for any registration scheme touching protected speech |
| `ca-fitaa` | `ca-pia` | PIA for personal information collected during arrangement registration |
| `ca-fitaa` | `ca-atip` | Reconciles the public-facing register against the protected investigative dataset (severance design for hybrid views) |
| `ca-fitaa` | `ca-aia` | Triggered when registration triage uses automated decision-making, scoring, or risk classification |
| `ca-pia` | `risk` | PIA findings feed privacy and regulatory entries in the risk register |
| `ca-pia` | `ca-atip` | Personal-information disclosure register continues into ATIP reconciliation |
| `ca-pia` | `ca-aia` | Required when ADM touches personal information; AIA inherits the PIA inventory |
| `ca-atip` | `data-model` | Severance rules feed back into data-model classification flags and access controls |
| `ca-atip` | `ca-pia` | PIA personal-information register is the authoritative source for the §4–§8 use/disclosure register |
| `ca-aia` | `risk` | AIA findings — bias, drift, contestability — feed the operational risk register |
| `ca-aia` | `adr` | Material AIA outcomes (vendor selection, autonomy tier, recourse design) warrant ADRs |
| `ca-aia` | `ca-pia` | Personal-information feeding the algorithmic system inherits PIA controls; AIA depth must match PIA depth |
| `ca-charter` | `ca-fitaa` | Charter §2 expression / association analysis is a mandatory companion to FITAA |
| `ca-charter` | `ca-pia` | §8 search-and-seizure analysis grounded in the PIA personal-information categories |
| `ca-charter` | `risk` | Residual Charter risks per right feed the operational risk register |
| `ca-itsg-33` | `ca-cloud-residency` | Categorisation and control profile feed the sovereign cloud residency assessment |
| `ca-itsg-33` | `risk` | Residual security risks and tailoring deviations become risk-register entries |
| `ca-itsg-33` | `adr` | Material control tailoring or compensating-control decisions warrant ADRs |
| `ca-soia` | `ca-itsg-33` | SOIA handling rules sit on top of the ITSG-33 baseline (categorisation is prerequisite) |
| `ca-soia` | `risk` | SOIA-specific residual risks (compartment compromise, suspected unauthorised disclosure) |
| `ca-soia` | `adr` | Compartment design, MOU choices with CSIS / RCMP, and tier-promotion thresholds warrant ADRs |
| `ca-cloud-residency` | `adr` | Sovereign cloud option choices and CLOUD-Act risk acceptance warrant ADRs |
| `ca-cloud-residency` | `ca-itsg-33` | Cloud control-profile selection (PBMM-Cloud, Secret-High) grounded in ITSG-33 categorisation |
| `ca-gc-digital-standards` | `service-assessment` | GC Digital Standards conformance feeds the broader service-assessment evidence base |
| `ca-gc-digital-standards` | `roadmap` | Identified gaps and remediation actions become roadmap milestones |
| `ca-ola` | `ca-gc-digital-standards` | OLA service equivalence is a baseline expectation under the GC Digital Standards scorecard |
| `ca-ola` | `service-assessment` | OLA review feeds the service-assessment evidence base for bilingualism and active offer |
| `ca-pspc` | `evaluate` | PSPC route selection feeds the vendor evaluation framework's scoring rubric |
| `ca-ocap` | `data-model` | OCAP-mapped classifications and access controls feed the data-model stewardship and access policies |
| `ca-ocap` | `ca-pia` | Personal-information processing of Indigenous data inherits PIA controls plus OCAP-derived restrictions |
| `ca-ocap` | `ca-atip` | ATIP severance design must reflect OCAP access and control determinations for Indigenous datasets |

- **Updated**: Total command count from 104 to 116 (70 official + 46 community = 116; community now includes 12 Canada + 12 UAE + 7 EU + 12 FR + 3 Austrian)
- **Updated**: Matrix version date to 2026-05-04

### 2026-05-23 - USA Federal Civilian Overlay Commands (Community)

Added 10 community-overlay commands (`us-*`) covering US federal civilian compliance instruments (FedRAMP authorization, FISMA / NIST 800-53 Rev 5, CISA Zero Trust Maturity Model, OMB M-19-17 ICAM, NIST AI RMF + OMB M-24-10/M-25-21 AI assurance, E-Government Act §208 PIA, EO 14028 SBOM self-attestation). They ship with the `[COMMUNITY]` description prefix and are not part of the officially-maintained baseline. Total command count moves to **135** (71 official + 64 community).

**Statutory currency anchor**: EO 14110 was revoked January 2025; the live AI mandates are OMB M-24-10 + M-25-21. FedRAMP completed the Rev 5 transition in 2024.

**Canonical execution chain (us-federal recipe, 5 waves)**:

```text
Wave 1 (baseline):    principles → requirements → us-fisma-categorization
Wave 2 (controls):    us-fisma-categorization → us-nist-800-53
Wave 3 (posture):     us-nist-800-53 → us-zero-trust → us-icam
Wave 4 (ai):          us-ai-rmf → us-ai-impact → us-privacy-pia
Wave 5 (authorization): us-sbom-eo-14028 → us-fedramp-ssp → us-fedramp-readiness
                      → adr → sobc → risk → framework
```

**Handoff matrix** (extracted from `plugins/arckit-us/commands/us-*.md` frontmatter):

| From command | Handoff target | Condition / rationale |
|---|---|---|
| `us-fisma-categorization` | `us-nist-800-53` | The FIPS 199 high-water mark drives the NIST SP 800-53 Rev 5 baseline (Low / Moderate / High) for control tailoring |
| `us-fisma-categorization` | `us-privacy-pia` | Information types containing PII trigger an E-Government Act §208 PIA; the FIPS 199 inventory seeds the PIA personal-information register |
| `us-fisma-categorization` | `risk` | Categorization rationale and any ambiguous information-type mappings feed the project risk register |
| `us-nist-800-53` | `us-fedramp-ssp` | The tailored control set and implementation statements drop directly into the FedRAMP SSP control-implementation tables |
| `us-nist-800-53` | `us-zero-trust` | Control selections (especially AC, IA, SC families) feed the CISA Zero Trust Maturity Model scoring |
| `us-nist-800-53` | `us-sbom-eo-14028` | Supply-chain controls (SR family) cross-reference the EO 14028 secure-software attestation and SBOM register |
| `us-nist-800-53` | `adr` | Significant tailoring decisions (compensating controls, control inheritance boundaries, parameter values) warrant ADRs |
| `us-fedramp-ssp` | `us-fedramp-readiness` | The SSP is the primary input to the readiness self-assessment (3PAO RAR format); gaps surfaced during SSP authoring populate its gap register |
| `us-fedramp-ssp` | `us-zero-trust` | SSP control implementations seed the CISA Zero Trust Maturity scoring (Identity, Devices, Networks, Apps & Workloads, Data pillars) |
| `us-fedramp-ssp` | `us-icam` | The Types of Users section and IA-family control implementations connect to the ICAM architecture |
| `us-fedramp-readiness` | `service-assessment` | The readiness gap register feeds the broader service-assessment evidence pack |
| `us-fedramp-readiness` | `roadmap` | Remediation actions for FedRAMP gaps drop into the architecture roadmap timeline |
| `us-fedramp-readiness` | `risk` | Open gaps and POA&M items become entries in the project risk register |
| `us-zero-trust` | `us-icam` | Identity-pillar gaps drive the ICAM architecture (IAL/AAL/FAL determination, PIV / login.gov integration) |
| `us-zero-trust` | `us-nist-800-53` | Zero Trust controls map back to specific 800-53 controls (AC, IA, SC, SI families); deficient maturity stages flag controls for re-tailoring |
| `us-zero-trust` | `adr` | Architectural decisions to reach Advanced or Optimal maturity (e.g. micro-segmentation strategy, policy-decision-point selection) warrant ADRs |
| `us-icam` | `us-zero-trust` | ICAM is the foundation of the Zero Trust Identity pillar; IAL/AAL/FAL selections directly score ZTMM Identity functions |
| `us-icam` | `us-privacy-pia` | Identity proofing collects and processes PII (especially IAL2/IAL3); the ICAM data flows feed the PIA personal-information inventory |
| `us-icam` | `adr` | Identity provider selection (PIV vs login.gov vs agency-specific) and federation pattern decisions warrant ADRs |
| `us-ai-rmf` | `us-ai-impact` | Translate AI RMF findings into the M-24-10 rights-impacting / safety-impacting determination and the M-25-21 acquisition controls |
| `us-ai-rmf` | `us-privacy-pia` | AI systems trained on or inferencing over PII require an E-Gov Act §208 PIA; the AI RMF data inventory seeds the PIA |
| `us-ai-rmf` | `risk` | Residual AI risks (confabulation, bias, security, value-chain) flow into the project risk register |
| `us-ai-rmf` | `adr` | Model architecture, hosting, data-governance, and human-oversight decisions made during the RMF process warrant ADRs |
| `us-ai-impact` | `us-ai-rmf` | The minimum-practice gaps surfaced here drive the AI RMF Govern / Map / Measure / Manage uplift backlog |
| `us-ai-impact` | `us-privacy-pia` | Rights-impacting AI systems handling PII require an E-Gov Act §208 PIA |
| `us-ai-impact` | `risk` | Residual M-24-10 risks (especially where minimum practices cannot be met) flow into the risk register |
| `us-privacy-pia` | `us-icam` | PII collected by identity proofing (IAL2/IAL3) and authentication processes is documented in the PIA; the ICAM data flows must reconcile with the PIA inventory |
| `us-privacy-pia` | `us-ai-impact` | AI systems processing PII require both the PIA and the M-24-10 rights-impacting determination; the PIA feeds the AI Impact Assessment |
| `us-privacy-pia` | `data-model` | PII fields and lawful authorities surface as data-model attributes and access-control rules |
| `us-sbom-eo-14028` | `us-nist-800-53` | SR (Supply Chain Risk Management) and SA (System and Services Acquisition) control family implementations must cross-reference the attestation and SBOM |
| `us-sbom-eo-14028` | `adr` | SBOM format choice (CycloneDX vs SPDX), signing strategy (Sigstore, in-toto, SLSA level), and attestation exception requests warrant ADRs |
| `us-sbom-eo-14028` | `risk` | Components with known unmitigated vulnerabilities or attestation exceptions feed the risk register |

- **Updated**: Total command count to 135 (71 official + 64 community; community now includes 12 Canada + 12 UAE + 7 EU + 12 FR + 3 Austrian + 8 Australian + 10 USA)
- **Updated**: Matrix version date to 2026-05-23
