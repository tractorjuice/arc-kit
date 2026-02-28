# The People Behind ArcKit: How Open Source Contributors Are Shaping Enterprise Architecture Tooling

ArcKit started as a solo project -- a way to bring structure to the messy reality of enterprise architecture governance. Today, it's a toolkit with 53 slash commands, 5 research agents, and support across four AI platforms. That didn't happen alone.

Here's a look at the people who've helped shape ArcKit through code, ideas, bug reports, and feature requests.

---

## The Code Contributors

**@umag (Magistr)** -- 5 contributions, 2 merged PRs

Magistr was one of ArcKit's earliest contributors. When the project only supported Claude Code, they submitted a fix for package distribution (PR #3) that solved how markdown files were bundled into the wheel. Then they went further and built **Gemini CLI support from scratch** (PR #5) -- making ArcKit the multi-platform toolkit it is today. They also filed the first real bug report (#2), flagging that commands weren't installing correctly. Early contributors like this set the tone for a project.

**@DavidROliverBA (David R Oliver)** -- 4 contributions, 4 merged PRs, London

David is a BA Engineering professional and ArcKit's most prolific feature contributor. His merged PRs read like a product roadmap:

- **PR #56**: Security hooks for secret detection and file protection -- the foundation of ArcKit's three-layer security model
- **PR #57**: Enhanced the diagram command with C4 layout science and a validation checklist
- **PR #59**: Vendor profile and tech note generation from research output
- **PR #60**: The `/arckit:health` command for stale artifact detection

He also has an open PR (#58) exploring cross-session memory via MCP. David's contributions consistently push ArcKit toward being a more rigorous, production-ready governance tool.

**@alefbt (Yehuda Korotkin)** -- 3 contributions, 1 merged PR

Yehuda brought ArcKit to its fourth platform. His merged PR #45 added full **OpenCode CLI support** -- commands, guides, templates, and skills. He'd previously submitted an earlier draft (PR #36) that evolved into the final implementation. Adding an entirely new platform integration is no small feat, and it expanded ArcKit's reach to yet another AI coding assistant.

---

## The Feature Requesters and Bug Reporters

Open source isn't just code. The people who file issues, report bugs, and propose ideas shape a project just as much.

**@johnfelipe (Felipe)** -- 40+ issues filed

Felipe is ArcKit's most active community member by a wide margin. Since issue #1 ("Feature request: web UI/UX"), he's filed over 40 issues spanning feature requests, bug reports, and architectural ideas. Highlights include:

- **Architecture conformance checking** (#55) -- which directly influenced the `/arckit:principles-compliance` command
- **PlantUML diagram support** (#78) -- leading to the PlantUML syntax skill
- **Interactive diagrams on web pages** (#66) -- shaping the `/arckit:pages` command
- **Cross-platform issues on Windows/PowerShell** (#86) -- critical real-world testing
- **Architectural algebra for measuring adherence** (#19) -- a research-oriented proposal that's still open and actively discussed
- **Spanish language support** (#4) -- one of the earliest issues, highlighting internationalisation needs

Felipe uses ArcKit in production and his steady stream of bug reports from real projects (PowerShell compatibility, rendering issues, version upgrade paths) has been invaluable for hardening the toolkit.

**@brettderry** -- Issue #49: Charset error when initialising project

A targeted bug report that identified a character encoding issue during project setup. The kind of precise, reproducible report that makes fixes straightforward.

**@elasticdotventures (Brian Horakh)** -- Issue #33: Kroki support, Melbourne

Brian proposed integrating Kroki for diagram rendering -- an alternative to Mermaid that supports multiple diagram syntaxes. A thoughtful suggestion from someone thinking about the broader diagramming ecosystem.

**@anyulled (Anyul Rivas)** -- PR #38: Google Developer Knowledge API, Barcelona

Anyul, a Solutions Architect and Full-Stack Developer from Barcelona, submitted a PR to configure the Google Developer Knowledge API integration. While the PR was closed in favour of a different approach (bundling via the plugin's MCP config), the contribution highlighted demand for GCP research capabilities and informed how ArcKit ships MCP server configuration today.

---

## What the Numbers Tell Us

The community has filed over 45 issues, submitted 10 pull requests (7 merged), and brought in 7 unique contributors. Two of ArcKit's four supported platforms -- Gemini CLI and OpenCode CLI -- were contributed entirely by the community. The security hook system, health checking, and enhanced diagramming all came from external PRs. And dozens of bug reports from real-world usage have driven fixes that benefit everyone.

---

## Contributing to ArcKit

ArcKit welcomes contributions of all kinds -- code, issues, feature ideas, documentation, and testing. The project lives at [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit).

Whether you're an enterprise architect using ArcKit daily like Felipe, a developer adding platform support like Magistr and Yehuda, or an engineer building governance features like David -- there's room for your contribution.

File an issue. Submit a PR. Or just tell us how you're using ArcKit. Every contribution shapes what this toolkit becomes.
