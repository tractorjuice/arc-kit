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
  - Note: Procurement market intelligence from the UK Tenders MCP — award-value benchmarks, top suppliers, incumbency/concentration across more than 700k UK contracting processes (October 2026)
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
| `/arckit:ca-itsg-33` | — | ca-pia, fr-dr, requirements | ca-soia, principles |
| `/arckit:ca-soia` | — | — | ca-fitaa, ca-itsg-33, principles, requirements |
| `/arckit:ca-cloud-residency` | — | ca-pia, requirements | ca-itsg-33, principles |
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
| `/arckit:au-energy-compliance` | — | requirements, stakeholders | adr, au-aescsf, au-ot-security, au-pia, au-soci-cirmp, data-model, dfd, diagram, principles, risk, servicenow, traceability |

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
| `/arckit:oaa-adm-lite` | — | adm-preliminary, principles, requirements, stakeholders | — |
| `/arckit:product-architecture` | — | business-capability-map, oaa-adm-lite, principles, requirements, stakeholders | — |
| `/arckit:agile-strategy` | — | business-capability-map, oaa-adm-lite, principles, product-architecture, requirements, stakeholders, transition-architecture | — |
| `/arckit:agile-security` | — | agile-strategy, oaa-adm-lite, principles, product-architecture, requirements | — |
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

The history of this matrix, and the dependencies between community overlay commands, are in [docs/DEPENDENCY-MATRIX.md](https://github.com/tractorjuice/arc-kit/blob/main/docs/DEPENDENCY-MATRIX.md#changelog) in the ArcKit repository.
