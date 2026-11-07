<!-- Suggested slug: 2026-10-XX-arckit-in-claude-plugin-directory -->
# ArcKit Is Now in the Claude Plugin Directory

**ArcKit is now in the Claude plugin directory. From [DATE] you can find it and install it from inside Claude, without adding a marketplace first. The core plugin has 76 commands for strategy, architecture, delivery and assurance, it sits alongside the jurisdictional, sector and tooling plugins already listed, and it approves nothing on your behalf.**

*Mark Craddock · medium.com/arckit*

---

## What changes for you

Until now you had to know ArcKit existed: you added our marketplace by name, then picked your plugins. That still works.

Now you can search the directory for ArcKit, install the core plugin, and run `/arckit:start` to be walked through your first project. If you work in a particular country or sector, add the matching overlay from the same place. Install the core plugin first, because each overlay builds on it.

Each listed plugin has also been through the directory's review. That's one more thing to point to if you have to justify a new tool to a security or architecture board.

## Nothing runs without your say-so

From version 6.17.2, nothing in ArcKit approves an action on your behalf. Each command says up front what it needs. The only things it pre-approves are reading ArcKit's own templates and reference material and running ArcKit's own scripts, and Claude Code's permission system applies those rules only while that command is running. If a script call is chained to anything else, you're asked. Research services are never pre-approved: Claude Code asks the first time, and you decide whether to trust a service for good.

You may see a prompt the first time a command reaches a research service, and none for ArcKit's own templates. In return you get a simple answer to a question assurance reviewers often ask: what can this tool do without asking? It's short, and it's written down in ArcKit's enforcement statement, which separates what the tool checks in code from what it only asks of the AI.

## What ArcKit is, if you're new

ArcKit turns architecture governance into commands you run inside your AI coding assistant. It writes requirements, stakeholder analyses, risk registers, business cases, architecture decisions, Wardley Maps, data protection impact assessments, and assessment packs for the Technology Code of Practice, the Service Standard and Secure by Design. Each document follows a template, cites its sources and records how it was made. They link together, so you can trace a requirement from the stakeholder who asked for it to the design that meets it.

Everything it writes is a draft for qualified people to review and approve. The documents live in your repository, next to the work, where your normal review process can see them.

ArcKit is free and MIT licensed. It runs most fully in Claude Code, and it also works in other assistants, including GitHub Copilot, Codex, Gemini and OpenCode.

## How to install

Find ArcKit in the Claude plugin directory and install the core plugin.

If you prefer the marketplace, or already use it, nothing changes. In Claude Code, run:

`/plugin marketplace add tractorjuice/arckit-claude`

Then install the core plugin and any overlays you need from the Discover tab. If you already have ArcKit, update to 6.17.2 or later to get the permission changes above.

## Thank you

Thank you to everyone who has filed issues, sent fixes and written overlays for their own countries and sectors. Special thanks to @johnfelipe, whose careful risk review shaped the security fixes in this release, including one that removed a check approving its own work.

---

*ArcKit is MIT licensed and maintained at [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit). Current release: v6.17.2.*

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** - real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** - announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** - code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
