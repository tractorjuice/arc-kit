# Test Repositories

ArcKit maintains 43 public test repos on GitHub (pattern: `arckit-test-project-v*`, range v0–v48). Only public repos are listed below; v0/v4/v5/v13/v15/v20 are private and v12 was retired.

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
| v14 | scottish-courts | Scottish Courts and Tribunals Service GenAI strategy |
| v16 | doctors-appointment | Doctors Online Appointment System |
| v17 | fuel-prices | UK Government Fuel Price Transparency Service |
| v18 | smart-meter | UK Smart Meter Data Consumer Mobile App |
| v19 | gov-api-aggregator | UK Government API Aggregator |
| v21 | criminal-courts | Independent Review of the Criminal Courts - Technology & AI |
| v22 | genai-playbook | UK Government GenAI Playbook |
| v23 | ccs-procurement-ai | CCS AI Procurement Intelligence Platform |
| v24 | cabinet-office-ai | Cabinet Office Cross-Government AI Governance Framework |
| v25 | dbt-trade-ai | DBT International Trade AI Analytics Platform |
| v26 | dfe-education-ai | DfE AI in Education Governance & Standards |
| v27 | defra-environment-ai | DEFRA Environmental AI & Ecological Data Platform |
| v28 | desnz-energy-ai | DESNZ Energy Grid AI & Net Zero Modelling |
| v29 | dhsc-health-ai | DHSC Health & Social Care AI Governance Framework |
| v30 | dluhc-planning-ai | DLUHC Planning & Housing Data Intelligence |
| v31 | dsit-responsible-ai | DSIT Responsible AI & Innovation Standards Framework |
| v32 | dft-transport-ai | DfT Transport Network AI & Journey Intelligence |
| v33 | dwp-benefits-ai | DWP Benefits Processing AI & Employment Intelligence |
| v34 | fcdo-diplomatic-ai | FCDO Diplomatic Intelligence & Consular AI Platform |
| v35 | gld-legal-ai | GLD Legal AI & Litigation Intelligence Platform |
| v36 | hmlr-land-ai | HMLR Land Registration AI & Property Intelligence |
| v37 | hmrc-tax-ai | HMRC Tax Compliance AI & Revenue Intelligence |
| v38 | hmt-fiscal-ai | HMT Fiscal Modelling AI & Economic Intelligence |
| v39 | home-office-borders-ai | Home Office Borders, Immigration & Security AI |
| v40 | mod-defence-ai | MoD Defence AI Strategy & Operational Assurance |
| v41 | moj-justice-ai | MoJ Justice System AI & Court Innovation |
| v42 | no10-ds-policy-ai | No.10 Data Science Data-Driven Policy Intelligence Platform |
| v43 | iai-gov-ai-products | i.AI Government AI Products & Delivery Platform |
| v44 | australian-gov | Australian Government — Architecture Governance (non-UK proof-of-concept) |
| v45 | nsi-rainbow | NS&I Digital Modernisation Programme (Project Rainbow) |
| v46 | gds-local | GDS Local |
| v46 | sdg | ArcKit SDG Mono-Repo: 17 UN SDGs, 78 UK Government technology projects |
| v47 | dft-transforming-city-regions | DfT Transforming City Regions funding system |
| v48 | arckit-as-a-service | ArcKit as a Service for UK Government |

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
