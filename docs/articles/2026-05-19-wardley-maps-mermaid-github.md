# Your Wardley Maps Belong in Git: What Mermaid Support Changes

For most of the last decade, Wardley Maps lived in three places: a whiteboard, a PNG screenshot in a deck, and (if you were lucky) an [OnlineWardleyMaps](https://onlinewardleymaps.com) link buried in a wiki. None of those locations made the map *useful* to a team beyond the workshop it came out of. The map captured a moment of thinking. Then it stopped.

That changes when a map is just text in a markdown file. Mermaid added a `wardley-beta` diagram type, and as of Mermaid 11.15.0 the renderer is stable enough to use in production. GitHub renders it natively in any `.md` file. Claude renders it in the artifacts side panel. That combination quietly resolves the biggest practical problem with Wardley Mapping: keeping the map alive after the meeting.

## What actually changed

Mermaid is the de facto diagram language for technical documentation. Every major tool that renders markdown also renders Mermaid: GitHub, GitLab, Bitbucket, Notion, Obsidian, VS Code, Cursor, Claude Code, and Claude's artifacts panel. Before 11.x, Wardley Maps were not part of that universe. You exported them.

With `wardley-beta`, the diagram is the source. Paste a fenced code block into a README, an ADR, or a pull request description and the map renders inline. No screenshot, no broken link to a third-party site, no question about which version is current.

## Why this matters for strategy work

A few things become possible that were either painful or impossible before.

**Maps go through code review.** When a strategy artefact is text, it can be diffed. A reviewer can see exactly which component moved from Product to Commodity, which dependency was added, which sourcing decision flipped from `build` to `buy`. That conversation used to happen in a Slack thread next to a JPEG. Now it happens in the pull request, with line comments on the lines that changed.

**Maps get versioned alongside the system they describe.** The map of a platform at v2.0 is genuinely different from the map at v3.0. Git already knows how to store that history. When the map is markdown, you get the full audit trail for free: who proposed the move, what the reviewer said, when it was approved, what shipped alongside it.

**Maps appear where the work happens.** A Wardley Map embedded in a service's README is read by engineers writing code. A map embedded in a decision record is read by reviewers approving the decision. A map embedded in a board pack is read by directors who do not have OnlineWardleyMaps bookmarked. The friction to "go look at the strategy map" drops to zero.

**AI assistants can read and write them.** Claude renders the map in the artifacts side panel while you iterate on the surrounding document. You can ask it to add a component, move something further left, flag inertia on a stuck dependency, and watch the diagram update next to the prose. The map is no longer a separate artefact requiring a context switch.

## The practical workflow

In ArcKit, the `/arckit:wardley` command writes both an OnlineWardleyMaps block (for the canonical editor at [create.wardleymaps.ai](https://create.wardleymaps.ai)) and a Mermaid `wardley-beta` block in a collapsible `<details>` section. Two representations, one source. The OWM block stays authoritative for the strategist who wants to drag components around in a GUI. The Mermaid block is what GitHub, Claude, and every other markdown tool actually renders.

The conversion is handled by a bundled script rather than emitted by hand, because the Mermaid grammar has sharp edges around hyphenated names, bare numbers, and keywords that collide with the parser. The script quotes every component name as a string, which keeps the output stable across Mermaid versions. In testing across 147 real-world maps the renderer succeeded on 98 percent. The ArcKit-generated syntax succeeded on 100 percent.

There is also a Stop hook that validates the OWM and Mermaid blocks stay consistent. If a component is added to one and not the other, the hook flags it before the file is saved. The point is that the map cannot silently drift between the two representations.

## What to do this week

If you already have Wardley Maps somewhere in your organisation, pick one that matters and commit it as a markdown file with a `wardley-beta` block. Open a pull request and ask a colleague to review it the way they would review code. Notice what conversations happen in the PR comments that would not have happened in front of a whiteboard.

If you do not yet have Wardley Maps in your documentation, this is a low-friction starting point. The map lives next to the README it describes. There is no new tool to roll out, no SaaS to procure, no export pipeline to maintain. The strategy artefact is just another file in the repository.

The shift here is small in technical terms and large in operational terms. Maps that used to die in a workshop now live in the same place as the code, the ADRs, and the runbooks. That is where strategy was always supposed to be.

## Try it

ArcKit ships the `/arckit:wardley` command and the OWM-to-Mermaid converter. Install the plugin from the marketplace or browse the source at [arckit.org](https://arckit.org).
