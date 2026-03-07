# Data Platform Path Modifier

## When This Modifier Applies

This is not a standalone path. Apply these additions to whichever base path matches the project sector (standard, UK Government, or Defence).

- Data platform or data lake/lakehouse projects
- Data mesh architecture implementations
- Analytics or business intelligence platforms
- Data marketplace or data sharing initiatives
- Projects with significant data integration requirements
- Open data publishing platforms

## Additional Commands

### Design and Analysis Phase

Add or promote these commands in the base path's Design and Analysis phase:

| Command | Rationale | Insert After |
|---------|-----------|-------------|
| `/prompts:arckit.datascout` | Discover external data sources: APIs, datasets, open data portals, commercial providers | Before data-model |
| `/prompts:arckit.data-model` | Comprehensive data architecture with entity relationships, schemas, governance | After datascout (promote to mandatory if not already) |
| `/prompts:arckit.dpia` | Data Protection Impact Assessment — mandatory if processing personal data | After data-model |
| `/prompts:arckit.data-mesh-contract` | Federated data product contracts for mesh architectures | After data-model |
| `/prompts:arckit.platform-design` | Multi-sided platform strategy using Platform Design Toolkit (PDT) | After requirements, before data-model |

### Cloud-Specific Research

If the data platform targets a specific cloud provider, add the relevant research command:

| Command | When to Use | Rationale |
|---------|-------------|-----------|
| `/prompts:arckit.aws-research` | AWS-hosted data platform | S3, Glue, Athena, Redshift, Lake Formation research via AWS Knowledge MCP |
| `/prompts:arckit.azure-research` | Azure-hosted data platform | ADLS, Synapse, Fabric, Purview research via Microsoft Learn MCP |
| `/prompts:arckit.gcp-research` | GCP-hosted data platform | BigQuery, Dataflow, Dataplex research via Google Developer MCP |

Insert cloud research commands after `/prompts:arckit.research` in the Design and Analysis phase. These require their respective MCP servers to be connected.

## UK Government Data Considerations

For UK Government data projects, these additional factors apply:

- **TCoP Point 10**: Make better use of data — `/prompts:arckit.datascout` prioritizes UK Gov open data sources
- **GDPR/DPA 2018**: DPIA mandatory for personal data processing
- **Open Standards**: Use open data formats where possible
- **Cross-government sharing**: Consider API standards and data sharing agreements

## Key Considerations

- **Data governance**: Establish ownership, quality standards, and access controls early (requirements phase)
- **Data lineage**: Use `/prompts:arckit.traceability` to map data requirements (DR-xxx) through to implementation
- **Schema evolution**: Document versioning strategy in ADRs
- **Data quality**: Define quality metrics and monitoring in `/prompts:arckit.operationalize`
- **Data contracts**: Use `/prompts:arckit.data-mesh-contract` for producer-consumer agreements in mesh architectures

## Recommended Sequence for Data-Heavy Projects

When data is the primary focus, reorder the Design and Analysis phase:

1. `/prompts:arckit.datascout` — discover what data is available
2. `/prompts:arckit.platform-design` — design the platform ecosystem
3. `/prompts:arckit.data-model` — model the data architecture
4. `/prompts:arckit.data-mesh-contract` — define data product contracts
5. `/prompts:arckit.dpia` — assess data protection impact
6. `/prompts:arckit.research` — research technology options for the data platform
7. Cloud research (`aws-research`, `azure-research`, or `gcp-research`)
8. `/prompts:arckit.wardley` — map data component evolution

## Duration Impact

Data platform focus typically adds:

- **1-2 weeks** for datascout and data source evaluation
- **2-3 weeks** for comprehensive data modeling
- **1-2 weeks** for data mesh contracts (if applicable)
- **1 week** for DPIA (if personal data)
- **1-2 weeks** for platform design (if multi-sided platform)
