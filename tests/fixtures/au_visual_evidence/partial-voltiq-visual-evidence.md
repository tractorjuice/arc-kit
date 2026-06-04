# Partial Visual Evidence Fixture - Voltiq-Style Supplier

> SYNTHETIC COMPOSITE - TEST FIXTURE ONLY.

## Evidence Summary

The supplier is an energy analytics SaaS and advisory provider. It does not operate a SOCI critical asset or OT estate, but it handles client data and provides outputs that may influence customer network operations.

## Known Structure

| Element | Known Detail | Pending Detail |
|---------|--------------|----------------|
| Multi-tenant SaaS | Hosted in Azure Australia regions | `Pending Input`: tenant isolation evidence |
| Client data ingestion | Network constraints and customer DER data via APIs | `Pending Input`: data-volume and classification register |
| DOE calculation service | Outputs consumed by DNSP customers | `Pending Input`: downstream operational decision path |
| Support access | Remote support into customer-adjacent environments | `Pending Input`: access logs and support model |
| Subprocessors | Azure plus sub-SaaS tools | `Pending Input`: fourth-party register |

## Partial Relationship View

- Client APIs send constraint and DER data to the SaaS ingestion layer.
- The SaaS analytics service produces DOE and forecasting outputs for customer teams.
- Support staff access customer tenants through a remote-support process.

## Expected Visual Decision

The evidence is incomplete but structurally useful. A draft context diagram may be created, but unknown owners, data volumes, classifications, and downstream decision paths must be labelled `Pending Input`.
