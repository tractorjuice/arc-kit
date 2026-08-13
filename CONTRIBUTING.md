# Contributing to ArcKit

Thank you for your interest in contributing to ArcKit! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/YOUR-USERNAME/arc-kit.git
   cd arc-kit
   ```

3. **Create a branch** for your changes:

   ```bash
   git checkout -b feature/your-feature-name
   ```

## Types of Contributions

### 1. Bug Reports

If you find a bug, please create an issue with:

- Clear title describing the problem
- Steps to reproduce
- Expected vs actual behaviour
- Your environment (OS, Claude Code version, etc.)
- Any error messages or logs

### 2. Feature Requests

For new features:

- Explain the use case and problem it solves
- Describe the proposed solution
- Consider UK Government standards compliance
- Discuss alternatives you've considered

### 3. Documentation Improvements

Documentation contributions are highly valued:

- Fix typos or clarify existing guides
- Add examples or use cases
- Improve command descriptions
- Expand troubleshooting sections

### 4. New Commands

To add a new ArcKit command:

1. **Create the command file** in `plugins/arckit-claude/commands/`:

   ```markdown
   ---
   description: Brief description of what the command does
   ---

   Detailed prompt text following ArcKit patterns...
   ```

2. **Follow ArcKit patterns**:
   - Use UK Government standards (GDS, TCoP, Secure by Design)
   - Include comprehensive sections
   - Provide examples and templates
   - Add traceability to other artifacts

3. **Create command guide** in `docs/guides/`:
   - Explain when to use the command
   - Show integration with other commands
   - Document common gaps and fixes
   - Include real-world examples

4. **Multi-AI support**:
   - Run `python scripts/converter.py` to generate Gemini TOML and Codex Markdown from the plugin command

5. **Update documentation** — six files, not one:
   - `CHANGELOG.md` — an entry under `## [Unreleased]`.
   - `README.md` — a bullet in the relevant command table or overlay section. Not optional for an overlay command: those section headers carry counts (`The 21 commands below …`) that go stale the moment you add one.
   - `docs/index.html` — the published site. Overlay commands appear both in a jurisdiction card's instrument list and in the community-overlay paragraph, each enumerating instruments by name.
   - `docs/DEPENDENCY-MATRIX.md` — a dependency entry alongside the command's siblings, and its place in that overlay's flow block.
   - `docs/commands.html` — a `<tr>` in the command table. A new **overlay** also needs an `<option>` in both the category and jurisdiction filters, or its `docs/index.html` jurisdiction card links to a filter that returns an empty table.
   - `docs/llms.txt` — the llmstxt.org index for arckit.org, hand-curated (the generator in `sync-guides.mjs` only overwrites files carrying its marker, and this one deliberately does not). `scripts/check-llms-txt.py` fails CI if a command is missing or a link 404s.

   All but the first two were previously documented only in `CLAUDE.md`, which contributors do not read, so PRs kept arriving without them. That was our omission, not the contributors'.

6. **Watch the counts.** A new overlay command changes a stated number in **five** places: the overlay's `README.md` (`N slash commands`), its `.claude-plugin/plugin.json` description, **both** marketplace manifests, and the root `README.md` section header. Grep for the old number before pushing — nothing checks these.

### 5. Code Improvements

For scripts or tools:

- Follow existing code style
- Add comments explaining complex logic
- Test thoroughly before submitting
- Update relevant documentation

## Coding Standards

### Command Structure

All ArcKit commands should follow this structure:

```markdown
---
description: One-line description (imperative mood)
---

# [Command Name]

## Purpose

Explain what this command generates and why it's needed.

## When to Run

Describe the GDS Agile Delivery phase and prerequisites.

## What It Generates

List the artifacts created.

## Template Structure

Detail the sections included in the output.

## Integration with Other Commands

Explain how this command relates to other ArcKit artifacts.

## Example

Provide a real-world example scenario.
```

### Documentation Style

- Use UK English spelling (organisation, analyse, colour)
- Follow GOV.UK content design principles
- Use active voice
- Keep sentences short and clear
- Use bullet points for lists
- Include code examples in fenced blocks

### Commit Messages

Follow conventional commits:

```text
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:

- `feat`: New feature or command
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:

```text
feat(commands): add /arckit:security-review command

docs(guides): improve wardley mapping examples

fix(init): correct template file paths
```

## Pull Request Process

1. **Update documentation** for any changes
2. **Test your changes**:
   - Test with Claude Code
   - Test with Codex CLI (if applicable)
   - Test with Gemini CLI (if applicable)
3. **Update CHANGELOG.md** under "Unreleased" section
4. **Create pull request** with:
   - Clear title following commit message convention
   - Description of changes and motivation
   - Reference any related issues
   - Screenshots for UI changes

5. **Code review**:
   - Address reviewer feedback
   - Keep discussions focused and professional
   - Be patient - maintainers review when available

## Testing

Before submitting:

1. **Test command execution**:

   ```bash
   # Claude Code (requires ArcKit plugin: /plugin marketplace add tractorjuice/arc-kit)
   /arckit:your-command Test description

   # Gemini CLI
   gemini
   /arckit:your-command Test description
   ```

2. **Verify output quality**:
   - Check all sections are present
   - Verify UK Government standards compliance
   - Ensure traceability references are correct
   - Test with different project scenarios

3. **Check integration**:
   - Run related commands before and after
   - Verify traceability matrix includes new artifacts
   - Test `/arckit:analyze` detects relevant gaps

## UK Government Standards Compliance

All contributions must align with:

- **GDS Service Manual**: Agile delivery phases (Discovery → Alpha → Beta → Live)
- **Technology Code of Practice (TCoP)**: 14 points for technology projects
- **Secure by Design**: Security principles and patterns
- **GDS Service Standard**: 14 points for government services
- **Digital Marketplace**: DOS and G-Cloud procurement frameworks

## Adding a new doc-type code (v5.0.0+)

Doc-type codes live in `plugins/arckit-claude/config/doc-types.mjs` regardless of which plugin the emitting command lives in. This keeps `validate-arc-filename.mjs` single-sourced and the collision check in one file.

A new community command that emits a new doc type therefore requires a **two-part PR**:

1. The command in `arckit-{jurisdiction}/commands/{slug}.md` (e.g. `plugins/arckit-uae/commands/uae-newthing.md`).
2. The new code in `plugins/arckit-claude/config/doc-types.mjs` with `regime: 'UAE'` (or `FR`, `CA`, `EU`, `AT`).

Reviewers check that the new code doesn't collide with existing codes — `scripts/check_doctype_collisions.py` catches duplicates automatically in CI.

If the new code is the **first** of its regime, also register the regime in the `REGIMES` array and `REGIME_LABELS` object at the bottom of `doc-types.mjs`. Order convention: officially-maintained first, then community alphabetical.

## Registering a new community overlay

A new `plugins/arckit-<name>/` directory is **not** discovered automatically. Several scripts carry hardcoded plugin lists, and the two below fail **silently** — they report success while producing nothing for your overlay. This is not hypothetical: `arckit-uk-finance` shipped its four commands in **zero** non-Claude extensions from v5.3.0 through v5.6.0 because of the first one.

### 1. `scripts/converter.py` — `PLUGIN_SOURCES`

Add `"plugins/arckit-<name>"` to the list (core `arckit-claude` stays last). Without it the converter generates **no** files for your overlay in any of the seven non-Claude extensions, and still exits 0 with a success summary — nothing looks wrong.

Two plugins are excluded deliberately and must stay out: `arckit-fde` (Claude-only tooling) and `arckit-uk-gcloud` (proprietary — must not leak into the MIT extension repos).

### 2. Both marketplace manifests

There are **two**, they use different source shapes, and both need an entry:

| Manifest | Source shape | Consumed by |
|---|---|---|
| `.claude-plugin/marketplace.json` | flat — `./plugins/arckit-nl` | this repo |
| `plugins/arckit-claude/.claude-plugin/marketplace.json` | nested — `./plugins/nl` | the published `tractorjuice/arckit-claude` marketplace |

`tests/plugin/test_release_process.py` compares both against `EXPECTED_CLAUDE_MARKETPLACE_SOURCES`, so updating one manifest but not the other (or not the test) fails CI. Omitting all three passes silently.

### 3. The rest of the same registration

These belong to the same act and are best done together:

- `scripts/sync-claude-plugin-layout.py` (`PLUGIN_LAYOUT`) and `scripts/push-extensions.sh` (`CLAUDE_PLUGIN_LAYOUT`) — both map `plugins/arckit-<name>` to its nested publish path. Missing here, the overlay never reaches the published marketplace repo.
- `tests/extension_helpers.py`, `tests/codex/test_codex_extension.py`, `tests/paperclip/test_commands_json.py` (`PLUGIN_COMMAND_DIRS`) and `tests/plugin/test_template_consistency.py` (`PLUGIN_SOURCES`).
- `scripts/sync-shared-assets.py` (`SYNC_EXEMPT_PLUGINS`) — every governance overlay must carry the shared `templates/_partials` and `references` assets byte-identical. Only add your plugin to the exempt set if it is tooling rather than governance.

The test lists are what makes step 1 loud instead of silent: `.github/workflows/python-tests.yml` regenerates the extensions and then runs the full suite, so an overlay present in `PLUGIN_COMMAND_DIRS` but absent from `PLUGIN_SOURCES` fails CI. Adding them matters more than it looks.

### Verify before opening the PR

```bash
python scripts/converter.py
find extensions -path '*<prefix>-*' -type f | wc -l   # expect non-zero
python scripts/sync-shared-assets.py --check
python scripts/sync-claude-plugin-layout.py --check
python -m pytest -q
```

See also [Adding a new doc-type code](#adding-a-new-doc-type-code-v500) above — a new overlay is almost always also a new regime.

## Adding a bundled MCP server

When a new command requires an MCP server that does not already ship with ArcKit, follow this checklist:

1. **`.mcp.json` entry** — add the server under `plugins/arckit-claude/.mcp.json`. Omit `alwaysLoad` unless the server is needed on every session start (keep cold-start tool budgets lean; deferred is the default).
2. **`allow-mcp-tools.mjs` prefix** — add the `mcp__<server-name>__` prefix to the `ALLOWED_PREFIXES` array in `plugins/arckit-claude/hooks/allow-mcp-tools.mjs` and update the JSDoc comment's server list.
3. **Reader `tools:` allowlist** — in the reader agent's YAML frontmatter, list only the read-only tools the reader needs. Never include free-form query tools (e.g. SQL endpoints) in the allowlist — they are an uncontrolled prompt-injection surface.
4. **`docs/MCP-CATALOGUE.md` rows** — add a row to the "Servers at a glance" table, a `## <server-name>` section (tool table with "Consumed by ArcKit?" column, allowlist note, consumer list), rows in the "Tool → command cross-reference" table, and update the totals line.
5. **Run `python scripts/converter.py`** — regenerate the Codex / OpenCode / Gemini / Copilot extension formats so the new MCP config propagates to all non-Claude targets.

## Command Naming Conventions

- Use lowercase with hyphens: `/arckit:data-model`
- Be descriptive but concise
- Use verbs for actions: `/arckit:analyze`, `/arckit:review`
- Use nouns for artifacts: `/arckit:requirements`, `/arckit:runbook`
- Group related commands: `/arckit:hld-review`, `/arckit:lld-review`

## Questions?

- **Issues**: https://github.com/tractorjuice/arc-kit/issues
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the maintainer for private inquiries

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Assume good intentions
- Help others learn and grow
- Follow UK Civil Service values where applicable

## License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers the project.

---

Thank you for helping improve ArcKit! Your contributions help UK Government projects deliver better, more compliant solutions.
