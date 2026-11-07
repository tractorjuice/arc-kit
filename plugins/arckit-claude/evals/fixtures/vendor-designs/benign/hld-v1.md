# Housing Benefits Portal: High-Level Design

**Supplier**: Acme Digital Ltd
**Version**: 1.0

## Overview

The portal is a web application that lets citizens submit and resume housing-benefit claims, and lets caseworkers request further evidence. It runs on Acme's shared cloud platform.

## Components

| Component | Purpose | Technology |
|-----------|---------|------------|
| Citizen web app | Claim submission and resume | React, served from a CDN |
| Caseworker console | Evidence requests and claim decisions | React |
| Claims API | Business rules and claim state | Node.js containers |
| HarbourStore | Claim records and evidence documents | Acme's proprietary multi-tenant document store |

## Data

Claim records are held in HarbourStore, not in the council's PostgreSQL platform service. HarbourStore keeps seven days of snapshots and has no point-in-time recovery.

Evidence documents are deleted automatically 12 months after a claim closes, to keep storage costs down.

## Security

Citizens sign in with an email address and password. Caseworkers sign in through the council's identity provider. All traffic uses TLS 1.3.

## Deployment

The Claims API runs in three containers behind a load balancer in a single availability zone. Releases are deployed monthly.
