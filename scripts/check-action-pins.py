#!/usr/bin/env python3
"""Assert every GitHub Action in .github/workflows/ is pinned to a full commit SHA.

A `uses: owner/repo@v4` reference resolves whatever that tag points at *when the
workflow runs*. Tags are mutable: whoever controls the action repository can
repoint one at new code, and every downstream workflow picks it up silently on
the next run. Actions here run with `contents: write` and, in the release
workflow, with `id-token: write` for PyPI trusted publishing, so a repointed tag
is an arbitrary-code-execution path into a job holding publish credentials.

`pypa/gh-action-pypi-publish@release/v1` was worse still: a moving *branch*,
which advances on every release of that action with no version boundary at all.

A 40-hex SHA is immutable. The trailing `# vN` comment records the human-readable
version the SHA corresponds to, so a reader can tell at a glance what is pinned
and Dependabot can still propose upgrades.

Exit 0 on success, 1 on any violation.
"""

import pathlib
import re
import sys

WORKFLOWS = pathlib.Path(__file__).resolve().parent.parent / ".github" / "workflows"

USES = re.compile(r"^\s*(?:-\s*)?uses:\s*(?P<ref>\S+)(?:\s+#\s*(?P<comment>.*))?$")
SHA = re.compile(r"^[0-9a-f]{40}$")
# Local (./path) and container (docker://) references have no upstream tag to pin.
EXEMPT_PREFIXES = ("./", ".\\", "docker://")


def main():
    if not WORKFLOWS.is_dir():
        print(f"No workflows directory at {WORKFLOWS}")
        return 0

    errors = []
    checked = 0

    for workflow in sorted(WORKFLOWS.glob("*.y*ml")):
        for lineno, line in enumerate(workflow.read_text().splitlines(), 1):
            match = USES.match(line)
            if not match:
                continue
            ref = match.group("ref")
            if ref.startswith(EXEMPT_PREFIXES):
                continue

            checked += 1
            where = f"{workflow.name}:{lineno}"

            if "@" not in ref:
                errors.append(f"{where}: `{ref}` has no version reference at all")
                continue

            action, _, version = ref.rpartition("@")
            if not SHA.match(version):
                kind = "branch" if "/" in version else "tag"
                errors.append(
                    f"{where}: `{action}` is pinned to the mutable {kind} `{version}`. "
                    f"Pin to a full 40-character commit SHA with a trailing `# {version}` comment."
                )
                continue

            if not match.group("comment"):
                errors.append(
                    f"{where}: `{action}` is SHA-pinned but has no `# <version>` comment, "
                    f"so a reader cannot tell what version it is or when it went stale."
                )

    if errors:
        print("GitHub Action pin check FAILED:\n")
        for err in errors:
            print(f"  - {err}")
        print(f"\n{len(errors)} problem(s) found across {checked} action reference(s).")
        return 1

    print(f"Action pin check passed ({checked} action reference(s), all SHA-pinned).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
