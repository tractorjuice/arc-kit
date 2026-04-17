# Community and Contributors

## Core Team

### tractorjuice (950 commits)

The creator and primary maintainer. Built the CLI, plugin, converter, hooks system, agent architecture, autoresearch system, and the vast majority of commands. Maintained an extraordinary release cadence of roughly one release every 1.4 days across 6 months.

## Code Contributors

### @umag / Magistr (5 contributions, 2 merged PRs)

One of ArcKit's earliest contributors. Key contributions:

- **PR #3**: Fixed package distribution -- solved how markdown files were bundled into the wheel
- **PR #5**: Built Gemini CLI support from scratch -- made ArcKit multi-platform
- Filed the first real bug report (#2) about command installation

Magistr's Gemini contribution was transformative -- it established the multi-platform pattern that led to the converter architecture.

### @DavidROliverBA / David R Oliver (11 commits, 4 merged PRs)

A BA Engineering professional and ArcKit's most prolific feature contributor:

- **PR #56**: Security hooks for secret detection and file protection -- foundation of the three-layer security model
- **PR #57**: Enhanced diagram command with C4 layout science and validation checklist
- **PR #59**: Vendor profile and tech note generation from research output
- **PR #60**: The `/arckit.health` command for stale artifact detection
- Open PR #58 exploring cross-session memory via MCP

David's contributions consistently pushed ArcKit toward being a more rigorous, production-ready governance tool.

### @alefbt / Yehuda Korotkin (4 contributions, 1 merged PR)

Brought ArcKit to its fourth platform:

- **PR #45**: Full OpenCode CLI support -- commands, guides, templates, and skills
- Earlier draft (PR #36) that evolved into the final implementation

Adding an entirely new platform integration expanded ArcKit's reach to yet another AI coding assistant.

## Feature Requesters and Bug Reporters

### @johnfelipe / Felipe (40+ issues filed)

ArcKit's most active community member by a wide margin. Since issue #1 ("Feature request: web UI/UX"), highlights include:

- **Architecture conformance checking** (#55) -- influenced `/arckit.principles-compliance`
- **PlantUML diagram support** (#78) -- led to PlantUML syntax skill
- **Interactive diagrams on web pages** (#66) -- shaped `/arckit.pages`
- **Cross-platform issues on Windows/PowerShell** (#86) -- critical real-world testing
- **Architectural algebra** (#19) -- research-oriented proposal still actively discussed
- **Spanish language support** (#4) -- highlighted internationalization needs

Felipe uses ArcKit in production. His bug reports from real projects have been invaluable for hardening the toolkit.

### @brettderry

Targeted bug report (#49) identifying character encoding issue during project setup. Precise, reproducible reports that make fixes straightforward.

### @elasticdotventures / Brian Horakh (Melbourne)

Issue #33: Proposed Kroki integration for diagram rendering -- an alternative to Mermaid supporting multiple diagram syntaxes.

### @anyulled / Anyul Rivas (Barcelona)

PR #38: Google Developer Knowledge API integration. While closed in favour of bundling via plugin MCP config, the contribution highlighted demand for GCP research and informed how ArcKit ships MCP server configuration.

## The Claude Contribution

One commit attributed to "Claude" appears in the git history -- a direct example of AI-assisted development within the project it helps build.

## Community Impact

- 22 test repositories spanning UK Government, NHS, MOD, Cabinet Office, Scottish Courts, and private sector projects
- Articles published on Medium and LinkedIn documenting the journey
- Open-source under MIT license
- GitHub issue forms for structured bug reports, feature requests, and questions (added v4.2.10)
