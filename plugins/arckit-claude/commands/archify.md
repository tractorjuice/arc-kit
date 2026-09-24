---
description: Render governed artefacts as interactive, self-contained HTML diagrams via Archify, or Wardley Maps via ArcKit's built-in renderer
doc-type: DIAG
argument-hint: "<diagram type and subject, e.g. 'architecture booking platform', 'wardley 001', 'sequence login'>"
effort: high
handoffs:
  - command: diagram
    description: Produce the Mermaid/PlantUML companion for the same subject
  - command: pages
    description: Publish the delivered HTML into the documentation site
  - command: hld-review
    description: Review the High Level Design the diagram depicts
  - command: wardley
    description: Create or update the Wardley Map this command renders
    condition: "Wardley render requested but no WARD artefact exists"
---

# ArcKit: Interactive Diagram Rendering

You render ArcKit's governed artefacts as **interactive, self-contained HTML** — a single file with inline SVG, dark/light themes, pan/zoom and dependency tracing, that opens offline with no external requests.

Two engines sit behind this one command:

| Requested type | Engine | Availability |
|---|---|---|
| `architecture`, `workflow`, `sequence`, `dataflow`, `lifecycle` | **Archify** (third party, MIT) | Only when the user has installed it |
| `wardley` | **ArcKit's own renderer** (`scripts/owm-to-html.mjs`) | Always — ships with the plugin |

**ArcKit does not bundle Archify.** It is an independently maintained skill
(<https://github.com/tt-a1i/archify>, MIT, by tt-a1i). This command detects it,
uses it when present, and degrades honestly when it is not. Never claim a
diagram was rendered by Archify unless its CLI actually exited zero.

## User Input

```text
$ARGUMENTS
```

## Step 1: Route on the requested type

Parse `$ARGUMENTS` for a diagram type and a subject.

- If the type is `wardley` (or the subject names a WARD artefact / Wardley Map), go to **Step 5**. Archify is not involved and not required.
- Otherwise continue to Step 2.
- If no type is given, infer one from the subject and say what you inferred. Default to `architecture`.

## Step 2: Detect Archify

Run the bundled detector:

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/archify-detect.mjs --json
```

It searches `$ARCKIT_ARCHIFY_HOME`, then project-local skill directories, then
each runtime's global skill directory. Exit code 0 means found, 1 means absent.

**If `found` is false**, stop and tell the user plainly:

```text
Archify is not installed, so I can't render an interactive {type} diagram.

Install it (one-off, ~7.5MB, MIT licensed, third party):
  npx skills add tt-a1i/archify -g

Or point ArcKit at an existing checkout:
  export ARCKIT_ARCHIFY_HOME=/path/to/archify

In the meantime I can run /arckit:diagram to produce the Mermaid or
PlantUML C4 version of the same diagram, which needs no extra install.
```

Then offer to run `/arckit:diagram` instead. **Do not** attempt to install
Archify yourself, and do not fabricate an interactive artefact by hand — a
hand-written HTML file is not an Archify render and must never be presented as
one.

**If `found` is true**, note `root`, `version` and `cli` from the JSON and
continue. Confirm the requested type appears in the reported `types` array.

## Step 3: Gather the governed source material

> **Note**: The ArcKit Project Context hook has already detected projects, artefacts, external documents and global policies. Use that context — do not scan directories manually.

Read what the requested type needs, and use the artefacts as the **facts of
record**. The diagram must depict what ArcKit's artefacts actually say, not a
plausible generic architecture.

| Type | Read | Extract |
|---|---|---|
| `architecture` | Vendor HLD, **DIAG**, **REQ**, **PRIN** | Containers, technology choices, boundaries, external systems |
| `workflow` | **SOW**, **PLAN**, **PROC**, delivery artefacts | Stages, approval gates, decision points, owners |
| `sequence` | Vendor DLD, **INT** requirements, API contracts | Participants, ordered messages, returns, async hops |
| `dataflow` | **DFD**, **DM** (data model), **DPIA** | Sources, transformations, stores, consumers, PII flows |
| `lifecycle` | **REQ** (status fields), **DM**, ADRs | States, transitions, retries, terminal and failure states |

Also read any **external documents** in `external/` and enterprise standards in
`projects/000-global/external/`. When a diagram element comes from an external
source, follow `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md` and
record the citation in the governed artefact you write in Step 7 — the HTML
itself carries no citation markers.

If there is nothing to depict, say so and stop. Do not invent an architecture.

## Step 4: Author, validate and deliver through Archify

Follow Archify's own authoring contract; it is the authority on its schema, not
this command. Read `<root>/schemas/<type>.schema.json`, `<root>/schemas/common.schema.json`
and one matching example under `<root>/examples/` before writing anything.

1. **Write the candidate first.** Save the IR to
   `projects/{project-dir}/diagrams/.archify/ARC-{PROJECT_ID}-DIAG-{NUM}.{type}.json`.
   Use the Write tool. Start with one clear main path, at most 12 primary
   nodes, automatic routes, and `meta.quality_profile: "showcase"`.

2. **Validate:**

   ```bash
   node <cli> validate <type> <candidate.json> --quality showcase --json
   ```

   A showcase pass reports **9 artefact checks, 0 errors, 0 warnings**. A
   receipt showing only 4 checks is basic validation, not showcase acceptance.

3. **Repair from the diagnostics, not by guessing.** Each diagnostic names a
   `subject`, `evidence` and often a literal suggested fix (`labelAt [615, 322]`).
   Apply the diagnosed change only. Continue while the error count reaches a new
   minimum; if two consecutive rounds do not improve it, stop and report the
   remaining diagnostics truthfully rather than deleting semantic labels to
   force a pass.

4. **Deliver once, as final acceptance:**

   ```bash
   node <cli> deliver <type> <candidate.json> projects/{project-dir}/diagrams/ARC-{PROJECT_ID}-DIAG-{NUM}.html --quality showcase --json
   ```

   A non-zero exit is never success. Record the returned `artifact.sha256` and
   `validation.checksPassed` — they go in the governed artefact.

Then go to **Step 6**.

## Step 5: Render a Wardley Map (no Archify required)

ArcKit renders Wardley Maps itself, because Archify has no Wardley diagram type
and a Wardley Map's continuous evolution/value-chain plane does not fit its
node-graph IR.

1. Locate the source. Prefer an existing WARD artefact in
   `projects/{project-dir}/wardley-maps/`. Extract the OnlineWardleyMaps code
   block (the ```` ```wardley ```` fence) into a temp file:

   ```bash
   cat > /tmp/arckit-wardley-render.owm <<'OWM'
   {the OWM block, verbatim}
   OWM
   ```

   If no WARD artefact exists, stop and offer `/arckit:wardley` to create one.
   Do not invent a map.

2. Render:

   ```bash
   node ${CLAUDE_PLUGIN_ROOT}/scripts/owm-to-html.mjs /tmp/arckit-wardley-render.owm \
     projects/{project-dir}/wardley-maps/ARC-{PROJECT_ID}-WARD-{NUM}-v{VERSION}.html \
     --title "{Map Title}" --json
   ```

   The JSON receipt reports `components`, `links`, `annotations` and any
   `warnings`. **Warnings matter**: a warning naming an unknown component means
   the OWM source has a typo — a dependency pointing at a component that was
   never declared. Fix the WARD artefact's OWM block, do not silence it.

3. The output is self-contained: no network requests, safe for
   OFFICIAL-SENSITIVE work and air-gapped review, and it embeds the OWM source
   so the map round-trips. It does **not** replace the OWM code block in the
   WARD artefact — that block stays canonical.

Then continue to Step 6.

## Step 6: Verify the artefact opens

Confirm the delivered file exists and is non-empty:

```bash
ls -l <output.html> && head -c 120 <output.html>
```

If Archify was used and the user wants browser evidence, `node <cli> visual-check <output.html> --json`
collects it from the exact delivered file. Report its measurements as browser
evidence only — it does not establish perceptual quality, and neither does an
unaided glance at the markup. Keep those claims separate and do not overstate
either.

## Step 7: Write the governed artefact

The HTML is a rendering; the **governed record** is a markdown artefact.

Use `${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs --next-num` for the
sequence number, and write to
`projects/{project-dir}/diagrams/ARC-{PROJECT_ID}-DIAG-{NUM}-v1.0.md`
(Wardley renders live alongside their existing WARD artefact instead — update
that artefact's Document Control `Last Modified` and note the render, rather
than creating a DIAG).

Read the template first — check `.arckit/templates-custom/` for an override,
then fall back to the shipped default:

```bash
cat ${CLAUDE_PLUGIN_ROOT}/templates/architecture-diagram-template.md
```

Populate its Document Control block in full (Document ID, Classification,
Status, Owner, Review Cycle, Next Review Date), then add a **Rendering**
section recording:

- Engine and version (`Archify 2.17.0` / `ArcKit owm-to-html`)
- Source IR or OWM path
- Delivered HTML path
- `artifact.sha256` and checks passed, when Archify delivered it
- Source artefacts the diagram depicts, with citation markers for external ones

## Step 8: Summarise

```text
✅ Interactive Diagram Delivered: {type} — {subject}

📁 HTML:     {output.html}
📁 Source:   {candidate.json or .owm}
📁 Governed: projects/{project}/diagrams/ARC-{PROJECT_ID}-DIAG-{NUM}-v1.0.md

🔧 Engine: {Archify {version} | ArcKit owm-to-html}
✅ Validation: {9/9 checks, 0 errors, 0 warnings | N components, N dependencies}
🔐 SHA-256: {artifact.sha256, when Archify delivered}

🖥️  Open it: open the HTML file directly — it needs no server and makes no
    external requests.

⚠️  {Any unresolved diagnostics or parser warnings, stated plainly}

🎯 Next Steps:
- /arckit:pages — publish the render into the documentation site
- /arckit:diagram — Mermaid/PlantUML companion for the same subject
```

---

**Remember**: Archify is third-party software the user installed, not part of
ArcKit. Attribute it, never vendor it, and never claim its validation passed
when it did not.
