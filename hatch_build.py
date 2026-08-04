"""Hatchling build hook: regenerate the non-Claude extension trees.

`plugins/arckit-claude/` is the single source of truth; the extension formats
under `extensions/` are produced by `scripts/converter.py` and are gitignored
(see CLAUDE.md, "Generated extension formats are not tracked"). Wheels built
from a working tree where the converter had been run were therefore complete,
but a wheel built straight from a git checkout — which is what
`pip install git+https://github.com/tractorjuice/arc-kit.git` does, and what
the README documents — contained only the tracked README/VERSION/docs of each
extension. `arckit init --ai copilot` then scaffolded a project with no
prompts, no agents and no copilot-instructions.md (#730).

So: run the converter before the wheel is assembled, then refuse to package a
tree that is still hollow. Set ARCKIT_SKIP_CONVERTER=1 to skip the regeneration
step (the completeness check still runs) when iterating locally.
"""

import os
import subprocess
import sys
from pathlib import Path

try:
    from hatchling.builders.hooks.plugin.interface import BuildHookInterface
except ImportError:  # pragma: no cover - only the build backend needs hatchling
    # `missing_assets` is pure logic and is exercised by the test suite, which
    # installs the package with build isolation and so has no hatchling.
    BuildHookInterface = object

# One entry per `extensions/*` directory mapped into shared-data by
# pyproject.toml, listing converter output that must be present for that
# extension to be usable. Not exhaustive per extension — enough that a hollow
# tree cannot pass. tests/cli/test_build_hook.py asserts the keys stay in step
# with pyproject.
REQUIRED_ASSETS = {
    "extensions/arckit-codex": [
        "skills",
        "agents",
        "templates",
        "references",
        "schemas",
        "config.toml",
    ],
    "extensions/arckit-opencode": [
        "commands",
        "agents",
        "templates",
    ],
    "extensions/arckit-copilot": [
        "prompts",
        "agents",
        "templates",
        "copilot-instructions.md",
    ],
    "extensions/arckit-vibe": [
        "agents",
        "skills",
        "templates",
    ],
}


def missing_assets(root):
    """Return the required assets absent from `root`, as repo-relative paths.

    A directory that exists but holds no files counts as missing: the converter
    creates its output directories up front, so "exists" alone would let a
    half-finished run through.
    """
    root = Path(root)
    missing = []

    for extension, entries in REQUIRED_ASSETS.items():
        for entry in entries:
            target = root / extension / entry
            if target.is_dir():
                if not any(child.is_file() for child in target.rglob("*")):
                    missing.append(f"{extension}/{entry} (empty)")
            elif not target.is_file():
                missing.append(f"{extension}/{entry}")

    return missing


def run_converter(root):
    """Run scripts/converter.py, which resolves its paths relative to cwd."""
    converter = Path(root) / "scripts" / "converter.py"
    if not converter.is_file():
        return False

    subprocess.run(
        [sys.executable, str(converter)],
        cwd=str(root),
        check=True,
        stdout=subprocess.DEVNULL,
    )
    return True


class ArcKitBuildHook(BuildHookInterface):
    PLUGIN_NAME = "arckit-extensions"

    def initialize(self, version, build_data):
        root = Path(self.root)

        if missing_assets(root) and not os.environ.get("ARCKIT_SKIP_CONVERTER"):
            self.app.display_info("Regenerating extension formats (converter.py)...")
            if not run_converter(root):
                raise RuntimeError(
                    "scripts/converter.py is missing, so the generated extension "
                    "formats cannot be rebuilt. Build from a full checkout of "
                    "the repository."
                )

        still_missing = missing_assets(root)
        if still_missing:
            raise RuntimeError(
                "Refusing to build: converter output is missing, which would "
                "ship an ArcKit package whose extensions contain no commands "
                "(#730). Run `python scripts/converter.py` and rebuild.\n  "
                + "\n  ".join(still_missing)
            )
