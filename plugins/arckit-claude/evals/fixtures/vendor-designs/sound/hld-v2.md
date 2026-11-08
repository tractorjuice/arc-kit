# Housing Benefits Portal: High-Level Design

**Supplier**: Acme Digital Ltd
**Version**: 2.0 (revised after the council's review of version 1.0)

## Overview

The portal lets citizens submit, save and resume housing-benefit claims online, and lets caseworkers request further evidence and decide claims. Caseworkers make every decision. The portal calculates entitlement to support them but never decides a claim on its own.

People who can't use the online service call or visit the council's contact centre. Contact centre staff complete the same claim in the caseworker console on the citizen's behalf, so the claim follows the same journey, rules and timescales.

## User needs and accessibility

User research with 32 claimants, including 9 who use assistive technology and 6 with limited digital skills, is summarised in the discovery report. The citizen web app uses the GOV.UK Design System and is tested against WCAG 2.2 AA with screen readers, voice control and keyboard-only use, and by an independent auditor before go-live. The council publishes and maintains the accessibility statement.

## Components

| Component | Purpose | Technology |
|-----------|---------|------------|
| Citizen web app | Claim submission, save and resume | Node.js server-rendered pages, GOV.UK Frontend, progressive enhancement |
| Caseworker console | Evidence requests, assisted claims and decisions | Node.js server-rendered pages, GOV.UK Frontend |
| Claims API | Claim state, entitlement calculation and decision recording | Node.js containers, versioned REST API (OpenAPI 3.1) |
| ClaimLedger | Append-only, hash-chained record of every change, calculation and decision, with the rule version used | Table set in the council's PostgreSQL platform service |
| Evidence service | Upload, malware scanning and storage of evidence documents | Node.js containers; council object storage with object lock |
| Work queue | Asynchronous evidence scanning, notifications and payment instructions | Council's managed message queue |
| Notifications | Email and SMS updates to citizens | GOV.UK Notify |

The Claims API is the only component that reads or writes claim records. The two front ends and the Evidence service call it over its published interface, and no component reads another component's tables.

Approved awards go to the council's existing benefits payment system as payment instructions over its published API. The portal holds no bank details after a claim is decided.

## Data

| Data | Store | Classification | Retention |
|------|-------|----------------|-----------|
| Claim records | Council PostgreSQL platform service, with point-in-time recovery (35 days) | OFFICIAL-SENSITIVE | Six years after the claim closes, then deleted by a scheduled job |
| Evidence documents | Council object storage, object lock in compliance mode | OFFICIAL-SENSITIVE | Six years after the claim closes, enforced by lifecycle rules; legal holds suspend deletion |
| ClaimLedger | Council PostgreSQL platform service | OFFICIAL-SENSITIVE | Same as the claim it records |

A claim closes when its final decision is issued and any appeal period has ended. All data is held in the council's UK London region, with encrypted backups in its second UK region. Backup retention follows the council's retention schedule. The Claims API is the single source of truth for claim data; reporting uses a labelled, read-only copy refreshed nightly.

A data protection impact assessment has been completed with the council's Data Protection Officer (DPIA-2026-014). The lawful basis is public task. The portal collects only the data the claim form needs, and subject access and correction requests are handled through the council's existing process.

## Security

- **Citizens** sign in with GOV.UK One Login, with identity confidence medium before a claim is submitted.
- **Caseworkers and administrators** sign in through the council's identity provider with multi-factor authentication. Roles separate creating, approving and paying an award, so no single person can do all three.
- **Service to service** calls use mutual TLS inside segmented network zones. A web application firewall fronts both web apps.
- **Secrets** are held in the council's secrets vault and never in code or configuration files.
- **Encryption** at rest uses council-managed keys for every data store. All traffic uses TLS 1.2 or later, terminated at the load balancer and re-encrypted inside the platform.
- **Logging** records every sign-in, authorisation decision and access to a claimant record, and sends it to the council's security monitoring.
- **Testing**: an independent IT health check before go-live and every year after, weekly vulnerability scans, and critical patches within 14 days.

## Resilience and performance

The service owner has agreed these targets: 99.9% availability in the service's published hours, a recovery time of 4 hours and a recovery point of 15 minutes.

- All containers run across three availability zones behind a load balancer and scale on CPU and queue depth.
- PostgreSQL runs with a standby in a second zone and automatic failover.
- If GOV.UK Notify is unavailable, notifications wait in the work queue and are sent when it recovers.
- If GOV.UK One Login is unavailable, citizens see a service message, and saved claims are kept until they can sign in again.
- Failover and restore are tested every six months, and fault injection runs in pre-production before each major release.

Performance target: 95% of pages load in under 2 seconds with 500 concurrent users. Load tests run before go-live and before each major release.

## Decision timescales

Every claim shows the days since it became complete. Caseworkers' queues are ordered by that age, and team leaders are alerted when a claim reaches day 10, so decisions are issued within the 14-day standard.

## Operations and delivery

- Structured logs, metrics and traces (OpenTelemetry) go to the council's monitoring platform, with alerts and runbooks for each alert.
- All infrastructure is defined in Terraform, version-controlled and deployed through the council's pipeline.
- Every change passes automated unit, integration, accessibility and security tests before release.
- Releases are weekly, using blue-green deployment with automatic rollback.

## Reuse and exit

The design reuses the council's PostgreSQL platform service, object storage, message queue, identity provider and monitoring, and the government's GOV.UK One Login and GOV.UK Notify. The application code is open source under the MIT licence. The council can export every claim, ledger entry and document in open formats (JSON, CSV and the original files) at any time, and the exit plan in schedule 4 covers handover to another supplier.
