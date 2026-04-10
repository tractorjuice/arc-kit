import { renderToString } from '@antv/infographic/ssr';
import { writeFileSync } from 'fs';

const infographics = [
  {
    name: 'arckit-roadmap',
    spec: `
infographic sequence-roadmap-vertical-badge-card
title ArcKit Governance Workflow
data
  lists
    - label Phase 1: Discovery
      desc Plan, Principles, Stakeholders - establish governance foundations and identify who cares about this project
    - label Phase 2: Business Case
      desc Risk (Orange Book), SOBC (Green Book), Requirements (BR/FR/NFR/INT/DR) - justify the investment
    - label Phase 3: Research & Design
      desc DataScout, Research, Wardley Maps, Data Model, Diagrams - explore options and design the solution
    - label Phase 4: Procurement
      desc SOW, G-Cloud/DOS, Evaluate, Score - select vendors and technologies
    - label Phase 5: Implementation
      desc HLD/DLD Reviews, ADRs, Backlog, User Stories - build and review
    - label Phase 6: Operations
      desc ServiceNow, DevOps, MLOps, FinOps, Operationalize - prepare for production
    - label Phase 7: Compliance
      desc TCoP, Secure by Design, ATRS, AI Playbook, Service Assessment - meet governance standards
    - label Phase 8: Reporting
      desc Story, Presentation, Pages Dashboard - communicate and publish
`
  },
  {
    name: 'arckit-platforms',
    spec: `
infographic list-grid-progress-card
title ArcKit Distribution Formats
data
  lists
    - label Claude Code Plugin
      desc Primary platform - 68 commands, 10 agents, 17 hooks, 5 MCP servers
      value 100
    - label Gemini CLI Extension
      desc Full parity - 68 commands, templates, scripts, MCP servers
      value 95
    - label Codex CLI Extension
      desc Skills format - 68 commands as SKILL.md with agent YAML
      value 90
    - label GitHub Copilot
      desc Prompt files - 68 .prompt.md files and 10 custom agents
      value 85
    - label OpenCode CLI
      desc Markdown commands - 68 commands in .opencode format
      value 85
    - label Paperclip Plugin
      desc TypeScript - 72 tools (68 commands + 5 utilities)
      value 70
`
  },
  {
    name: 'arckit-maturity',
    spec: `
infographic list-pyramid-badge-card
title ArcKit Command Tiers
data
  lists
    - label Tier 0-1: Foundation
      desc plan, principles, stakeholders - the governance base that everything builds on
    - label Tier 2-4: Business Case
      desc risk, sobc, requirements - justify the investment with evidence
    - label Tier 5-6: Design & Research
      desc 28 commands including research, data-model, wardley, diagrams, gov-reuse
    - label Tier 7-8: Procurement & Review
      desc sow, evaluate, score, hld-review, dld-review - select and validate
    - label Tier 9-12: Implementation & Ops
      desc backlog, servicenow, devops, mlops, finops, operationalize
    - label Tier 13-15: Compliance & Reporting
      desc tcop, secure, service-assessment, story, presentation, pages
`
  },
  {
    name: 'arckit-evaluate',
    spec: `
infographic compare-swot
title ArcKit Strengths, Weaknesses, Opportunities, Threats
data
  lists
    - label Strengths
      items
        - 68 commands covering full governance lifecycle
        - 7 distribution formats from single source
        - Template-driven consistency with citation traceability
        - Self-improving prompts via autoresearch
    - label Weaknesses
      items
        - UK Government focus may limit non-UK adoption
        - Requires AI coding assistant (not standalone)
        - MCP response content not yet validated for injection
        - 3 hierarchy templates fail in headless SSR
    - label Opportunities
      items
        - Managed agent deployment for CI/CD pipelines
        - Infographic visualizations for presentation-quality output
        - Knowledge graph across community usage
        - Additional AI platforms via config-driven converter
    - label Threats
      items
        - Claude Code API changes may break hooks
        - govreposcrape prompt injection via user-generated READMEs
        - Competing governance tools adopting AI
        - Platform fragmentation across 7 formats
`
  },
  {
    name: 'arckit-stakeholders',
    spec: `
infographic compare-quadrant-quarter-simple-card
title ArcKit Stakeholder Map
data
  lists
    - label High Power, High Interest
      items
        - Enterprise Architects (primary users)
        - UK Government departments (compliance drivers)
        - Project sponsors (governance accountability)
    - label High Power, Low Interest
      items
        - Senior leadership (approval gates)
        - Procurement boards (vendor decisions)
        - Security teams (compliance sign-off)
    - label Low Power, High Interest
      items
        - Development teams (consume requirements/backlogs)
        - Community contributors (features and bug reports)
        - Solution architects (design review participants)
    - label Low Power, Low Interest
      items
        - End users (indirect beneficiaries)
        - Vendor sales teams (respond to SOWs)
        - Training providers (use generated materials)
`
  },
  {
    name: 'arckit-score',
    spec: `
infographic list-grid-circular-progress
title ArcKit Quality Metrics
data
  lists
    - label Commands
      value 68
      desc Slash commands covering full governance lifecycle
    - label Agents
      value 10
      desc Autonomous research agents with context isolation
    - label Hooks
      value 17
      desc Registered event handlers across 7 event types
    - label MCP Servers
      value 5
      desc External knowledge sources including 24500 UK gov repos
    - label Templates
      value 62
      desc Document templates with 14-field Document Control
    - label Test Repos
      value 22
      desc Real-world projects from NHS to MOD to Cabinet Office
`
  }
];

for (const { name, spec } of infographics) {
  try {
    const svg = await renderToString(spec.trim());
    writeFileSync(`docs/book/images/${name}.svg`, svg);
    console.log(`OK: ${name} (${(svg.length / 1024).toFixed(1)}KB)`);
  } catch (err) {
    console.error(`FAIL: ${name} - ${err.message}`);
  }
}
