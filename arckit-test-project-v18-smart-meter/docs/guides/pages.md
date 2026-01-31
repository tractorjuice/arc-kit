# GitHub Pages Generator Playbook

`/arckit.pages` generates a GitHub Pages documentation site that displays all project documents with Mermaid diagram support.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Repository structure | Scans for all ArcKit artifacts |
| `projects/000-global/` | Global documents (principles) |
| `projects/*/` | All project documents |

---

## Command

```bash
/arckit.pages Generate documentation site for this repository
```

Output:
- `docs/index.html` - Main documentation site
- `docs/manifest.json` - Document index

---

## Generated Site Features

| Feature | Description |
|---------|-------------|
| Sidebar Navigation | Collapsible tree of all projects and documents |
| Markdown Rendering | Full GitHub-flavored markdown support |
| Mermaid Diagrams | Auto-rendered diagram visualizations |
| GOV.UK Styling | Professional government design system |
| Mobile Responsive | Works on all screen sizes |
| Document Caching | Fast navigation between documents |

---

## Document Categories

| Category | Artifacts Included |
|----------|-------------------|
| Discovery | Requirements, Stakeholder Drivers, Research |
| Planning | SOBC, Project Plan, Roadmap, Backlog |
| Architecture | Principles, HLD, DLD, Data Model, Wardley Map |
| Governance | Risk Register, Traceability Matrix |
| Compliance | TCoP, Secure by Design, AI Playbook, ATRS, DPIA |
| Operations | ServiceNow, DevOps, MLOps, FinOps |
| Procurement | SoW, Evaluation Criteria, Vendor Documents |
| Diagrams | All architecture diagrams (Mermaid) |
| Decisions | Architecture Decision Records |

---

## Manifest Structure

```json
{
  "generated": "2026-01-22T10:30:00Z",
  "repository": {
    "owner": "org-name",
    "name": "repo-name",
    "branch": "main"
  },
  "global": [...],
  "projects": [
    {
      "id": "001-project-name",
      "name": "Project Name",
      "documents": [...],
      "diagrams": [...],
      "decisions": [...],
      "vendors": [...]
    }
  ]
}
```

---

## Enabling GitHub Pages

| Step | Action |
|------|--------|
| 1 | Go to repository Settings |
| 2 | Navigate to Pages section |
| 3 | Set Source to "Deploy from a branch" |
| 4 | Set Branch to `main` and folder to `/docs` |
| 5 | Save |

Site available at: `https://{owner}.github.io/{repo}/`

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Document requirements and stakeholders | `/arckit.requirements`, `/arckit.stakeholders` |
| Design | Create architecture artifacts | `/arckit.hld-review`, `/arckit.diagram` |
| Compliance | Assess against standards | `/arckit.tcop`, `/arckit.secure` |
| Publish | Generate documentation site | `/arckit.pages` |

---

## Mermaid Diagram Support

The generated site automatically renders Mermaid diagrams:

```markdown
```mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[End]
```
```

Supported diagram types:
- Flowcharts
- Sequence diagrams
- C4 diagrams (Context, Container, Component)
- Class diagrams
- State diagrams
- Entity relationship diagrams
- Gantt charts

---

## Technical Stack

| Component | Library | Version |
|-----------|---------|---------|
| Styling | GOV.UK Frontend | 5.13.0 |
| Markdown | marked.js | 15.0.6 |
| Diagrams | mermaid.js | 11.4.1 |

All libraries loaded from CDN for easy updates.

---

## URL Routing

Documents use hash-based routing:

```
https://org.github.io/repo/#projects/001-name/ARC-001-REQ-v1.0.md
```

Benefits:
- Shareable links to specific documents
- Browser back/forward navigation works
- No server-side configuration needed

---

## Review Checklist

- All project folders discovered and indexed.
- Global documents (principles) included.
- Mermaid diagrams render correctly.
- Navigation tree matches repository structure.
- Mobile layout tested.
- GitHub Pages enabled in repository settings.
- Site accessible at expected URL.

---

## Key Principles

1. **Single Source of Truth**: Documents fetched directly from repository.
2. **Auto-Discovery**: Scans for known ArcKit artifact patterns.
3. **Lazy Loading**: Documents fetched on demand for performance.
4. **Offline-Capable**: Once loaded, documents cached in memory.
5. **Accessible**: GOV.UK design system ensures accessibility.
