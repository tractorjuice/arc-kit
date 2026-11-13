# Housing Benefits Portal: Detailed Design

**Supplier**: Acme Digital Ltd
**Version**: 1.0
**Builds on**: HLD version 2.0 (`hld-v2.md`), approved with conditions in ARC-001-HLDR-v1.0

## 1. Components

| Component | Runtime | Instances | Notes |
|-----------|---------|-----------|-------|
| Citizen web app | Node.js 22, Express | 3 to 12, autoscaled on CPU | GOV.UK Frontend 5 |
| Caseworker console | Node.js 22, Express | 2 to 6 | GOV.UK Frontend 5 |
| Claims API | Node.js 22, Fastify | 3 to 12 | Sole owner of claim tables |
| Evidence service | Node.js 22 | 2 to 6 | See section 4 |
| Draft cache | Redis 7, single node | 1 | Holds in-progress claim drafts for 30 days so citizens can resume quickly |
| Ledger verifier | Node.js 22, scheduled job | 1 run per hour | See section 3 |

All containers run in the council's Kubernetes platform across three availability zones.

## 2. Claims API

Versioned REST API, published as OpenAPI 3.1 at `/v1/openapi.json`.

| Method and path | Purpose | Caller |
|-----------------|---------|--------|
| `POST /v1/claims` | Start a claim | Citizen web app, caseworker console |
| `PUT /v1/claims/{id}/sections/{section}` | Save a section | Citizen web app, caseworker console |
| `POST /v1/claims/{id}/submit` | Submit a complete claim | Citizen web app, caseworker console |
| `POST /v1/claims/{id}/evidence-requests` | Request further evidence | Caseworker console |
| `POST /v1/claims/{id}/decision` | Record a decision with its rule version | Caseworker console |

Each saved section is written to the draft cache first, then to PostgreSQL when the citizen presses "Save and continue". Requests are authenticated with a signed token from GOV.UK One Login (citizens) or the council identity provider (staff), and calls between services use mutual TLS.

## 3. Data model and ClaimLedger

PostgreSQL tables: `claim`, `claim_section`, `evidence_document`, `evidence_request`, `decision`, `rule_version`, and `ledger_entry`.

`ledger_entry` holds one row per change, calculation or decision: the claim ID, the actor, the action, a timestamp, the rule version and the SHA-256 hash of the previous entry. The ledger verifier recomputes the chain every hour and raises a security alert if any hash fails to match. Only the Claims API service account can insert ledger rows; no account can update or delete them. Caseworkers can read the ledger for their own claims, and auditors can read all of it through a read-only role.

Rule versions are kept for as long as any decision that used them.

## 4. Evidence handling

1. The citizen uploads a document through the citizen web app.
2. The Evidence service writes the file to the `evidence-volume` persistent volume in the cluster and records it in `evidence_document`.
3. The work queue triggers a malware scan. A clean file is marked available and the claim moves to the next step.
4. A nightly sync job copies the day's files from `evidence-volume` to council object storage under object lock, then deletes them from the volume.

## 5. Security implementation

- Roles: `citizen`, `caseworker`, `team-leader`, `payments-officer`, `auditor`. A user can't hold both `caseworker` and `payments-officer`.
- Secrets come from the council's secrets vault through the Kubernetes CSI driver.
- PostgreSQL and object storage are encrypted with council-managed keys.
- Every sign-in, authorisation decision and claimant-record read is logged to the council's security monitoring.

## 6. Testing

- Unit and integration tests run on every commit, with a coverage threshold of 80%.
- Automated accessibility tests (axe) run on every page in CI, and manual screen reader tests run each sprint.
- A load test at 500 concurrent users runs before each major release.
- Fault injection in pre-production removes one availability zone and the PostgreSQL primary.

## 7. Deployment and operations

- Terraform modules for every resource, applied through the council's pipeline.
- Blue-green deployment with automatic rollback if the error rate exceeds 1% for 5 minutes.
- OpenTelemetry traces, metrics and logs to the council's monitoring platform. Alerts for error rate, latency, queue depth, claims at day 10, and ledger verification failures, each with a runbook.
- PostgreSQL point-in-time recovery is restored to a test environment every six months.
