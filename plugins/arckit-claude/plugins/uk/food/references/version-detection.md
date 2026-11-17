# Version Detection

How an ArcKit command picks the version of a single-instance artefact before it writes it. A single-instance doc-type has one document per project, versioned in its filename (`ARC-001-RISK-v1.1.md`), unlike a multi-instance type that is numbered (`ARC-001-ADR-003-v1.0.md`). Every command that writes a single-instance type follows this before it builds the Document ID. The command names its file pattern and, where it has them, its own reasons for a major increment.

Re-running a command never replaces an earlier version. The earlier file, its Revision History and anything approved against it stay as they are.

## 1. Look for an existing version

List `ARC-{PROJECT_ID}-{TYPE}-v*.md` in the directory the command writes to: the project directory, or the subdirectory the command names. Take the highest version by number, not by name: v1.10 is later than v1.9.

## 2. No existing file: version 1.0

Use `VERSION="1.0"`.

## 3. Existing file: pick the next version

Read the latest version to understand its scope, then compare it with the current inputs.

- **Minor increment** (1.0 → 1.1, 1.9 → 1.10): the scope is unchanged. Refreshed content, updated details, corrections, new evidence for the same questions.
- **Major increment** (1.0 → 2.0, 1.4 → 2.0): the scope has materially changed. Sections or categories added or removed, a different option or approach chosen, a re-assessment against a new baseline, or any change that would need the document approving again. The command's own triggers, where it lists them, take precedence.

When it is unclear which applies, take the minor increment and say so in the summary.

Never write a version number that already exists, even when the content is unchanged.

## 4. Carry the version everywhere

Use the version in the Document ID, the filename, the Document Control **Version** field and the Revision History. Any companion file the command writes alongside the document (a `.json` or `.csv` export) takes the same version.

For 1.1 and later:

- Keep the earlier Revision History rows and add one row for this version: date, author, and one line on what changed and why.
- Carry forward the Document Control fields a person set (Owner, Classification, Distribution, Review Cycle) unless the inputs change them.
- Set **Status** back to DRAFT and **Approved By** to PENDING. The new version has not been approved, whatever the previous one's status was.

## 5. Say what happened

The closing summary names the version written and, from 1.1 on, the version it supersedes and why (for example *"v1.1, superseding v1.0: risk scores refreshed after the supplier change"*).
