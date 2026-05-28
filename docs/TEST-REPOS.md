# Test Repositories

ArcKit maintains public test repos on GitHub (pattern: `arckit-test-project-v*`). Some early version numbers have been retired.

| Version | Name | Description |
|---------|------|-------------|
| v1 | m365 | Microsoft 365 migration |
| v2 | hmrc-chatbot | HMRC chatbot |
| v3 | windows11 | Windows 11 deployment |
| v6 | patent-system | Patent system modernization |
| v7 | nhs-appointment | NHS appointment booking |
| v8 | ons-data-platform | ONS data platform |
| v9 | cabinet-office-genai | Cabinet Office GenAI |
| v10 | training-marketplace | UK Government Training Marketplace |
| v11 | national-highways-data | National Highways data architecture |
| v13 | plymouth-research | Plymouth restaurant web scraping |
| v14 | scottish-courts | Scottish Courts and Tribunals Service GenAI strategy |
| v16 | doctors-appointment | Doctors Online Appointment System |
| v17 | fuel-prices | UK Government Fuel Price Transparency Service |
| v18 | smart-meter | UK Smart Meter Data Consumer Mobile App |
| v19 | gov-api-aggregator | UK Government API Aggregator |
| v21 | criminal-courts | Independent Review of the Criminal Courts - Technology & AI |
| v22 | genai-playbook | UK Government GenAI Playbook |
| v45 | nsi-rainbow | NS&I Digital Modernisation Programme (Project Rainbow) |
| v46 | gds-local | GDS Local |
| v46 | sdg | ArcKit SDG Mono-Repo: 17 UN SDGs, 78 UK Government technology projects |
| v47 | dft-transforming-city-regions | DfT Transforming City Regions funding system |
| v50 | post-office-horizon | Post Office Horizon |
| v51 | prs-database | UK PRS Database under Renters' Rights Act 2025 |
| v52 | uae-caio-playbook | UAE CAIO Playbook for the 24-month agentic AI mandate |

## Plugin-Based Setup (since 2026-02-07)

All test repos now use the arckit plugin via the marketplace instead of synced files. Each repo has a `.claude/settings.json` that auto-enables the plugin:

```json
{
  "extraKnownMarketplaces": {
    "arc-kit": {
      "source": {
        "source": "github",
        "repo": "tractorjuice/arc-kit"
      }
    }
  },
  "enabledPlugins": {
    "arckit@arc-kit": true
  }
}
```

**What the plugin provides** (no longer synced to test repos):

- Commands, agents, templates, scripts, MCP servers (AWS Knowledge + Microsoft Learn)

**What stays in test repos** (repo-specific content):

- `projects/` (generated architecture artifacts)
- `docs/` (including `index.html`, `README.md`, `guides/`, `manifest.json`)
- `README.md`, `CLAUDE.md` (repo-specific)
- `.devcontainer/`, `CHANGELOG.md`, `VERSION`

**Note**: Plugin requires a Claude Code restart after first opening a repo to resolve the marketplace. Plugin updates are picked up automatically from the marketplace repo — no file syncing needed. After updating `pages-template.html` in the plugin, re-run `/arckit:pages` in each repo that has a `docs/index.html` to regenerate it.
