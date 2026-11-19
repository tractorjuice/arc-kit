![Tender evaluation in ArcKit v6.20.0: keep a bid's hidden instructions out of the score. Five steps: export each bid to PDF, one folder for each supplier; an AI reader opens one bid, read-only, one supplier at a time; short claims come back, each with its file and location; ArcKit scores the claims while the bid stays with the AI reader; your panel decides, and the scores are a draft. Planted text is reported, with where it is, and every score traces to its source.](https://arckit.org/articles/2026-11-07-arckit-v6-20-a-bid-cant-mark-its-own-homework-hero.png)

# Tender Evaluation with AI: Keep a Bid's Hidden Instructions Out of the Score in ArcKit v6.20.0

**When an AI assistant helps with tender evaluation, a supplier can hide an instruction in a bid for it to follow, a trick known as prompt injection. From ArcKit v6.20.0 a bid no longer reaches the part of ArcKit that scores it. Also new are an arc42 overlay from Chris McKelt, and NORA and GEMMA for Dutch government from @trednets.**

**Before you start:** ArcKit's scores are a draft for your evaluation panel. The panel's own scoring and moderation are the record. If you already use ArcKit, the four things to do before you update come first.

*Mark Craddock*

---

## Before you update

- **Update Claude Code.** ArcKit needs v2.1.319 or later.
- **Check Node.js is installed.** Writing ArcKit artefacts and reading bids now need it on your `PATH`.
- **Export Word bids to PDF.** The AI reader can't open Word documents.
- **Move any existing evaluations.** They now sit in `vendors/_evaluations/<vendor>/`. Before re-scoring a vendor, move its `evaluation.md` and `notes.md` there. Scoring stops for a vendor whose folder still holds them, because they could equally have come with the bid.

## A bid can't mark its own homework

A supplier wants a high score, and hiding an instruction in a proposal is a cheap way to try for one. So I've split reading a bid from scoring it.

In Claude Code, a read-only AI reader now opens one supplier's documents at a time and returns short claims against each criterion. `/arckit:evaluate` and `/arckit:score` work from those claims and never see the bid. You run both commands as before.

- **No claim, no marks.** A criterion the bid doesn't address scores 0.
- **Mandatory qualifications need evidence.** One with no claim fails, and that vendor is left out of the draft recommendation `/arckit:score compare` gives your panel.
- **Every score traces to its source.** The claims are saved with their file and location.
- **A bid that can't be read stays unscored.** You're told which file and why. It never gets a 0.
- **Planted text gets reported, not followed.** The finding says where it is, not what it says.

It isn't bulletproof. Scoring is still a judgement on what a supplier claims, so a bid that fools the AI reader into a false claim can still move a score. I'd check the claims behind any close result. The other assistants can't run a separate reader, so they still read bids in one place.

`/arckit:hld-review`, `/arckit:dld-review`, `/arckit:gcloud-search` and `/arckit:gcloud-clarify` get a lighter version. They treat what a supplier wrote as claims and list anything aimed at the reviewer, but that's an instruction to the model, not a separation, so it's weaker.

## Checks that stop when they can't run

ArcKit checks your artefacts as they're written: secrets, filenames, scores, Wardley maps, backlog totals. If a check hung or crashed, Claude Code carried on without it, which isn't good enough for a governance tool.

Now, writing an ArcKit artefact or reading a bid stops if its check can't run, and the error says why. Your other repositories aren't affected.

## arc42 from what you already have

Chris McKelt has contributed an `arckit-arc42` overlay. `/arckit:arc42` writes all 12 sections of an arc42 description from your existing requirements, decisions, diagrams and risk register, citing each source. A section nothing covers is marked as not yet documented, with the command that would fill it.

Four more commands cover quality scenarios, crosscutting concepts, a technical debt register and a handover pack for Spec Kit. Delivery evidence then comes back: `/arckit:traceability` shows what's been delivered against each requirement, and `/arckit:health` flags a description when the artefacts behind it have moved on.

## NORA and GEMMA for Dutch government

@trednets has added two commands to the Netherlands overlay. `/arckit-nl:nl-nora` assesses a Dutch government service against the NORA principles, adding the GEMMA principles for a gemeente (a municipality). `/arckit-nl:nl-gemma` maps a gemeente's application landscape onto GEMMA's reference components, showing coverage, overlap and gaps.

ArcKit ships no NORA or GEMMA text. The commands build a local copy from the official sources on your machine.

## Thank you

Thanks to Chris McKelt, @chrismckelt, for arc42, the Spec Kit handover and getting Paperclip and Codex projects the files their commands need. Thanks to @trednets for NORA and GEMMA, and @umag for reviewing them. And thanks to Chris Nesbitt-Smith, @chrisns, for making ArcKit's evaluations prove a command really loaded.

## Get it

```bash
# Claude Code
/plugin marketplace add tractorjuice/arckit-claude
claude plugin install arckit

# the optional overlays, each switched on after it's installed
claude plugin install arckit-arc42 --marketplace tractorjuice/arckit-claude
claude plugin enable arckit-arc42
claude plugin install arckit-nl --marketplace tractorjuice/arckit-claude
claude plugin enable arckit-nl
```

Already using ArcKit? Run `claude plugin update arckit@arckit-claude`.

---

*ArcKit is MIT licensed and maintained at [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit). The full list of changes is in the [6.20.0 release notes](https://github.com/tractorjuice/arc-kit/releases/tag/v6.20.0).*

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** - real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** - announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** - code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
