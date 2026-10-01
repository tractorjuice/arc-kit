<!-- Suggested slug: 2026-10-XX-arckit-in-claude-plugin-directory -->
# ArcKit Is Now in the Claude Plugin Directory

**From [DATE], you can find ArcKit in the Claude plugin directory and install it from inside Claude, without adding a marketplace first. The core plugin, with its 76 commands for strategy, architecture, delivery and assurance, now sits alongside the jurisdictional, sector and tooling plugins already listed there. And it approves nothing on your behalf.**

*Mark Craddock · medium.com/arckit*

---

## What changes for you

Until now, installing ArcKit in Claude Code meant knowing where to look. You added our marketplace by name, then picked the plugins you wanted. That still works, but it assumed you had already heard of ArcKit.

Now you can find it the way you find any other plugin. Search the Claude plugin directory for ArcKit, install the core plugin, and start with `/arckit:start` to be walked through your first project. If you work in a particular country or sector, add the matching overlay from the same place. Each overlay builds on the core plugin, so install the core one first.

Being listed also means each plugin has been through the directory's review. For anyone who has to justify a new tool to a security or architecture board, that is one more thing you can point to.

## Nothing runs without your say-so

From version 6.17.2, nothing in ArcKit approves an action on your behalf. Each command says up front what it needs, and the only things it pre-approves are reading ArcKit's own templates and reference material and running ArcKit's own scripts. Those rules are applied by Claude Code's own permission system, only while that command is running. If a script call is chained to anything else, you are asked. Calls to the research services are never pre-approved: Claude Code asks the first time, and you decide whether to trust a service for good.

In practice you may see a prompt the first time a command reaches a research service, and still none for ArcKit's own templates. What you gain is a simpler answer to a question assurance reviewers ask often: what can this tool do without asking? The answer is now short, and it is written down in ArcKit's enforcement statement, which separates what the tool checks in code from what it only asks of the AI.

## What ArcKit is, if you are new

ArcKit turns architecture governance into commands you run inside your AI coding assistant. It writes requirements, stakeholder analyses, risk registers, business cases, architecture decisions, Wardley Maps, data protection impact assessments and assessment packs for the Technology Code of Practice, the Service Standard and Secure by Design. Each document follows a template, cites its sources and records how it was made, and they link together so a requirement can be traced from the stakeholder who asked for it to the design that meets it.

Everything it writes is a draft for qualified people to review and approve. The documents live in your repository, next to the work, where your normal review process can see them.

ArcKit is free and MIT licensed. Claude Code is where it runs most fully, and it also works in other assistants, including GitHub Copilot, Codex, Gemini and OpenCode.

## How to install

The quickest route is to find ArcKit in the Claude plugin directory and install the core plugin.

If you prefer the marketplace, or you already use it, nothing changes. In Claude Code, run:

`/plugin marketplace add tractorjuice/arckit-claude`

Then install the core plugin, and any overlays you need, from the Discover tab. If you already have ArcKit installed, update to 6.17.2 or later to get the permission changes described above.

## Thank you

Thank you to everyone who has filed issues, sent fixes and written overlays for their own countries and sectors. Special thanks to @johnfelipe, whose careful risk review shaped the security fixes in this release, including one that removed a check approving its own work.

---

*ArcKit is MIT licensed and maintained at [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit). Current release: v6.17.2.*

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** - real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** - announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** - code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
