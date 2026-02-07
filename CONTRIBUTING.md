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

1. **Create the command file** in `arckit-plugin/commands/`:
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

5. **Update documentation**:
   - Update `CHANGELOG.md`
   - Add to `README.md` if major feature

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

```
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
```
feat(commands): add /arckit.security-review command

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
   /arckit.your-command Test description

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
   - Test `/arckit.analyze` detects relevant gaps

## UK Government Standards Compliance

All contributions must align with:

- **GDS Service Manual**: Agile delivery phases (Discovery → Alpha → Beta → Live)
- **Technology Code of Practice (TCoP)**: 14 points for technology projects
- **Secure by Design**: Security principles and patterns
- **GDS Service Standard**: 14 points for government services
- **Digital Marketplace**: DOS and G-Cloud procurement frameworks

## Command Naming Conventions

- Use lowercase with hyphens: `/arckit.data-model`
- Be descriptive but concise
- Use verbs for actions: `/arckit.analyze`, `/arckit.review`
- Use nouns for artifacts: `/arckit.requirements`, `/arckit.runbook`
- Group related commands: `/arckit.hld-review`, `/arckit.lld-review`

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
