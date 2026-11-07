# Now in the Claude Plugin Directory

<!-- markdownlint-disable MD018 MD024 -- hashtag lines are post text; post headings repeat by design -->

A one-day launch kit, ready for the day the core `arckit` plugin is approved in the Claude plugin directory (in review on 6.17.2 since 1 October 2026). Nothing here goes out until the directory shows the core plugin as live.

**On the day, in order:**

1. Confirm the core plugin is live in the directory.
2. Publish the article: move `docs/social/drafts/arckit-in-claude-plugin-directory.md` to `docs/articles/<date>-arckit-in-claude-plugin-directory.md` (force-add it; `docs/articles/` is gitignored), fill in [DATE], add its card to `docs/articles.html` and the home-page strip, render a hero, run `uv run scripts/generate-site-pages.py`.
3. Swap `<slug>` in the posts below for the article's slug, then post the page post with the card, the group version and the Discord note. Suggest the reshare line to the maintainer.

Rules: `SOCIAL.md`. The drafts deliberately give no plugin count (the marketplace, README and CLAUDE.md disagree, and the private `arckit-uk-gcloud` overlay must never be implied as listed), describe the permission change only as what is true from 6.17.2, and say nothing about earlier review outcomes.

Share link: https://arckit.org/share/<slug>.html?utm_campaign=directory-launch&utm_source=linkedin
(Swap <slug> for the final article slug once the share page is generated; use utm_source=discord / linkedin-group for the other channels.)

## 1. ArcKit page post (LinkedIn)

ArcKit is now in the Claude plugin directory.

You can find it and install it from inside Claude, without adding a marketplace first. The core plugin has 76 commands for strategy, architecture, delivery and assurance, and it joins the country, sector and tooling plugins already listed.

We changed how ArcKit behaves to get here. From version 6.17.2, nothing in ArcKit approves an action on your behalf. Each command pre-approves only reading ArcKit's own templates and running its own scripts, through Claude Code's permission rules and only while it runs. Calls to research services are never pre-approved.

So when an assurance reviewer asks what it can do without asking, there's a short answer.

It writes drafts for qualified people to review. It's free and MIT licensed, and the marketplace route still works: /plugin marketplace add tractorjuice/arckit-claude

https://arckit.org/share/<slug>.html?utm_campaign=directory-launch&utm_source=linkedin

#EnterpriseArchitecture #ClaudeCode #DigitalGovernment #OpenSource

## 2. LinkedIn group version (no hashtags)

ArcKit is now in the Claude plugin directory, so you can install it from inside Claude without adding a marketplace first.

To get there we removed every place ArcKit approved its own actions. From 6.17.2, commands pre-approve only ArcKit's own templates and scripts, through Claude Code's permission rules, and research services always ask first.

What does your security or architecture board ask first about an AI tool? I'd like to know what should be on the list beyond "what can it do without asking?"

Write-up: https://arckit.org/share/<slug>.html?utm_campaign=directory-launch&utm_source=linkedin-group

## 3. Discord #announcements

📣 ArcKit is now in the Claude plugin directory. You can install the core plugin from inside Claude, with the overlays listed alongside it.

Update to 6.17.2 or later too. Nothing in ArcKit approves an action for you any more: commands pre-approve only ArcKit's own templates and scripts, and research services always ask first.

Marketplace install still works: `/plugin marketplace add tractorjuice/arckit-claude`

Write-up: <https://arckit.org/share/<slug>.html?utm_campaign=directory-launch&utm_source=discord>

## 4. Reshare line for the maintainer's own profile

Core ArcKit is now in the Claude plugin directory. Getting it there meant making it ask before it acts. Short write-up below.

## Card

```python
("Now in the plugin directory", "Find ArcKit and install it inside Claude", ["The core plugin joins the overlays already listed", "Nothing in ArcKit approves an action for you", "Marketplace install still works as before"])
```
