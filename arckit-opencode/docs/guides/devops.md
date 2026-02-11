# DevOps Strategy Playbook

`/arckit.devops` creates a comprehensive DevOps strategy covering CI/CD pipelines, Infrastructure as Code, container orchestration, and developer experience.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Deployment, performance, and security NFRs |
| Architecture principles | Technology standards and cloud preferences |
| Research findings | Technology stack decisions |
| Architecture diagrams | Deployment topology |

---

## Command

```bash
/arckit.devops Create DevOps strategy for <initiative>
```

Output: `projects/<id>/ARC-<id>-DEVOPS-v1.0.md`

---

## Strategy Structure

| Section | Contents |
|---------|----------|
| DevOps Overview | Strategic objectives, maturity level (current/target), team structure |
| Source Control | Repository structure, branching strategy, code review, commit conventions |
| CI Pipeline | Build automation, testing strategy, code quality gates, security scanning |
| CD Pipeline | Deployment stages, strategies (blue-green/canary), approval gates, rollback |
| Infrastructure as Code | IaC tool selection, module structure, state management, drift detection |
| Container Strategy | Runtime, base images, registry, image scanning, orchestration |
| Kubernetes/Orchestration | Cluster architecture, namespace strategy, GitOps tooling |
| Environment Management | Dev/staging/prod, provisioning, ephemeral environments |
| Secret Management | Storage, rotation, injection, access control |
| Developer Experience | Local setup, devcontainers, inner loop optimization |
| Observability | Logging, metrics, tracing, dashboards, alerts as code |
| DevSecOps | SAST, DAST, SCA, container scanning, compliance as code |
| Release Management | Versioning, changelog, release notes, hotfix process |
| Platform Engineering | IDP design, self-service portal, golden paths |
| UK Government Compliance | Cloud First (TCoP Point 5), open standards, Secure by Design |
| Metrics & Improvement | DORA metrics, engineering metrics, continuous improvement |

---

## DevOps Maturity Levels

| Level | Characteristics | Deployment Frequency |
|-------|-----------------|---------------------|
| Level 1 | Manual builds, scripted deploys | Monthly |
| Level 2 | CI automation, manual deploys | Weekly |
| Level 3 | CI/CD automation, staging gates | Daily |
| Level 4 | Continuous deployment, feature flags | Multiple/day |
| Level 5 | GitOps, self-healing, platform | On-demand |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Understand requirements, technology constraints | `/arckit.requirements`, `/arckit.principles` |
| Design | Define architecture, select tooling | `/arckit.diagram`, `/arckit.research` |
| Strategy | Create DevOps strategy document | `/arckit.devops` |
| Implementation | Set up pipelines, IaC, containers | `/arckit.backlog` |
| Operations | Monitor, optimize, iterate | `/arckit.operationalize`, `/arckit.finops` |

---

## Review Checklist

- CI/CD pipeline covers all deployable components.
- Security scanning integrated at appropriate stages (SAST, DAST, SCA).
- Environment strategy supports requirements (dev, staging, prod).
- Infrastructure as Code covers all infrastructure (no manual changes).
- Secret management defined with rotation procedures.
- Rollback procedures documented for each deployment type.
- DORA metrics defined with baseline targets.
- UK Government Cloud First policy addressed (if applicable).

---

## Key Principles

1. **Automation First**: Automate everything; manual processes are technical debt.
2. **Security Shift-Left**: Security scanning in CI, not just production.
3. **Infrastructure as Code**: All infrastructure defined in code.
4. **Developer Experience**: Fast feedback loops, self-service where possible.
5. **Observability by Default**: Logging, metrics, tracing from day one.
