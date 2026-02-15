# HTML Patterns for docs/index.html

## Command Card Template

Each command in `docs/index.html` is a `<tr>` element within the commands table. Insert the new card in the appropriate category section, identified by HTML comments like `<!-- Requirements & Data -->`.

### Full Template

```html
<tr data-status="{STATUS}" data-category="{CATEGORY}">
    <td><code>/arckit.{name}</code></td>
    <td class="description">{Description of the command}</td>
    <td>{Category Display Name}</td>
    <td class="examples">
        <a href="https://tractorjuice.github.io/arckit-test-project-v{N}-{repo}/#projects/{project-path}/{FILENAME}" title="{Short Title}">{label}</a>
    </td>
    <td><span class="app-status-tag app-status-{STATUS}">{Status Display}</span></td>
</tr>
```

### Minimal Template (No Examples Yet)

For newly added commands that don't have test project examples yet:

```html
<tr data-status="{STATUS}" data-category="{CATEGORY}">
    <td><code>/arckit.{name}</code></td>
    <td class="description">{Description of the command}</td>
    <td>{Category Display Name}</td>
    <td class="examples">
    </td>
    <td><span class="app-status-tag app-status-{STATUS}">{Status Display}</span></td>
</tr>
```

## Field Reference

### data-status Values

| Value | CSS Class | Display Text | Usage |
|-------|-----------|-------------|-------|
| `live` | `app-status-live` | `Live` | Production-ready commands |
| `beta` | `app-status-beta` | `Beta` | Feature-complete but limited testing |
| `alpha` | `app-status-alpha` | `Alpha` | Early stage |
| `experimental` | `app-status-experimental` | `Experimental` | Proof of concept |

### data-category Values

| Value | Display Name | Commands |
|-------|-------------|----------|
| `foundation` | Foundation | init, plan, principles |
| `strategic` | Strategic Context | stakeholders, risk, sobc |
| `requirements` | Requirements & Data | requirements, data-model, data-mesh-contract, dpia |
| `research` | Research & Strategy | research, wardley, roadmap, strategy, adr |
| `cloud-mcp` | Cloud Research (MCP) | azure-research, aws-research, gcp-research |
| `data-discovery` | Data Source Discovery | datascout |
| `procurement` | Procurement | sow, dos, gcloud-search, gcloud-clarify, evaluate |
| `design` | Design & Architecture | diagram, hld-review, dld-review, platform-design |
| `operations` | Implementation | backlog, trello, servicenow, devops, mlops, finops, operationalize |
| `governance` | Quality & Governance | traceability, analyze, principles-compliance, service-assessment |
| `ukgov` | UK Government | tcop, ai-playbook, atrs, secure |
| `mod` | UK MOD | mod-secure, jsp-936 |
| `publishing` | Documentation & Publishing | story, pages, customize |

### Example Links Format

Example links in the `<td class="examples">` cell reference test project GitHub Pages sites:

```html
<a href="https://tractorjuice.github.io/arckit-test-project-v{N}-{repo-name}/#projects/{project-dir}/{FILENAME}" title="{Short Title}">{label}</a>
```

- **{N}**: Test project version number (1-45)
- **{repo-name}**: Repository slug (e.g., `m365`, `hmrc-chatbot`, `windows11`)
- **{project-dir}**: Project directory (e.g., `001-exchange-online-migration`)
- **{FILENAME}**: Document filename (e.g., `ARC-001-REQ-v1.0.md`)
- **{Short Title}**: Hover tooltip text (e.g., `M365`, `HMRC`, `Windows 11 Migration`)
- **{label}**: Display text (e.g., `v1`, `v2`, `v3/001` for multi-project repos)

For multi-project repos, the label includes the project number: `v3/001`, `v3/002`.

### Inserting a Card

1. Find the category comment: `<!-- {Category Name} -->`
2. Insert the `<tr>` block after the comment or after the last `</tr>` in that category
3. Maintain consistent indentation (20 spaces for `<tr>`, 24 spaces for child elements)

### Complete Example

A real command card from the codebase (requirements):

```html
<tr data-status="live" data-category="requirements">
    <td><code>/arckit.requirements</code></td>
    <td class="description">Create comprehensive business and technical requirements</td>
    <td>Requirements & Data</td>
    <td class="examples">
        <a href="https://tractorjuice.github.io/arckit-test-project-v1-m365/#projects/001-exchange-online-migration/ARC-001-REQ-v1.0.md" title="M365">v1</a>
        <a href="https://tractorjuice.github.io/arckit-test-project-v2-hmrc-chatbot/#projects/001-hmrc-chatbot/ARC-001-REQ-v1.0.md" title="HMRC">v2</a>
    </td>
    <td><span class="app-status-tag app-status-live">Live</span></td>
</tr>
```
