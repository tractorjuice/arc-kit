"""Tests for the common.sh / common.py parity guard (#766).

`common.sh` and `common.py` each exist twice, once at root and once under
`plugins/arckit-claude/`. Nothing checked they agreed, and they drifted: commit
f8544b4a (#204) fixed `slugify` in one bash copy only, and the three unfixed
copies kept deleting accented characters for five months.

A byte-identity assert, as used for the two `create-project.sh` copies, cannot
work here: `find_repo_root` differs on purpose (the root copy keys on
`.arckit/`, the plugin copy on `projects/`, because marketplace users never run
`arckit init`). The guard therefore compares definition by definition against an
explicit allowlist, so a deliberate difference has to be declared and anything
else fails.

These tests exercise the guard's own logic against synthetic pairs, because a
guard that cannot fail is decoration. They cover the three ways it has to
behave: catch real drift, permit a declared divergence, and reject an allowlist
entry that no longer describes a real difference.
"""

import importlib.util
import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
GUARD = REPO_ROOT / "scripts/check-common-parity.py"


def load_guard():
    spec = importlib.util.spec_from_file_location("check_common_parity", GUARD)
    module = importlib.util.module_from_spec(spec)
    # dataclasses resolves field types through sys.modules[cls.__module__], so a
    # module executed straight off a path has to be registered before exec.
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


guard = load_guard()


# --- bash fixtures -----------------------------------------------------------

BASH_A = """\
#!/usr/bin/env bash
set -euo pipefail

# Find the repository root
find_repo_root() {
    echo "root-copy"
}

# Slugify a string
slugify() {
    echo "shared"
}

# Get templates directory path
get_templates_dir() {
    echo "templates"
}
"""

# Same three functions, allowlisted divergence in find_repo_root, and
# get_templates_dir moved ahead of slugify.
BASH_B = """\
#!/usr/bin/env bash
set -euo pipefail

# Find the repository root (looks for projects/ directory)
find_repo_root() {
    echo "plugin-copy"
}

# Get templates directory path
get_templates_dir() {
    echo "templates"
}

# Slugify a string
slugify() {
    echo "shared"
}
"""


def bash_findings(a: str, b: str, allowed=frozenset({"find_repo_root"})):
    return guard.compare(a, b, language="bash", allowed=set(allowed))


# --- the guard must catch real drift ----------------------------------------


def test_reports_a_function_whose_body_drifted():
    drifted = BASH_B.replace('echo "shared"', 'echo "drifted"')
    findings = bash_findings(BASH_A, drifted)

    assert [f.name for f in findings] == ["slugify"]
    assert findings[0].kind == "differs"


def test_reports_a_function_whose_preceding_comment_drifted():
    """The #204 fix changed the comment above slugify as well as its body, so a
    comment-blind guard would have reported nothing once bodies converged."""
    drifted = BASH_B.replace("# Slugify a string", "# Slugify a string (new)")
    findings = bash_findings(BASH_A, drifted)

    assert [f.name for f in findings] == ["slugify"]


def test_reports_a_function_present_in_only_one_copy():
    findings = bash_findings(BASH_A, BASH_B + '\nextra_fn() {\n    echo "x"\n}\n')

    assert [(f.name, f.kind) for f in findings] == [("extra_fn", "missing")]


def test_reports_drift_outside_any_function():
    findings = bash_findings(BASH_A, BASH_B.replace("set -euo pipefail", "set -eu"))

    assert [f.name for f in findings] == ["<preamble>"]


# --- the guard must permit declared divergence ------------------------------


def test_clean_pair_passes():
    assert bash_findings(BASH_A, BASH_B) == []


def test_ordering_difference_is_not_drift():
    """get_templates_dir sits at a different position in each real copy. That is
    cosmetic, and a diff-based guard would report it forever."""
    assert bash_findings(BASH_A, BASH_B) == []
    assert BASH_A.index("slugify") < BASH_A.index("get_templates_dir")
    assert BASH_B.index("slugify") > BASH_B.index("get_templates_dir")


def test_undeclared_divergence_fails_even_though_it_is_deliberate():
    findings = bash_findings(BASH_A, BASH_B, allowed=frozenset())

    assert [f.name for f in findings] == ["find_repo_root"]


# --- the guard must reject a stale allowlist --------------------------------


def test_allowlist_entry_that_no_longer_diverges_fails():
    """Otherwise the allowlist silently grows into a list of things nobody
    checks, which is how the original drift survived."""
    converged = BASH_B.replace('echo "plugin-copy"', 'echo "root-copy"').replace(
        "# Find the repository root (looks for projects/ directory)",
        "# Find the repository root",
    )
    findings = bash_findings(BASH_A, converged)

    assert [(f.name, f.kind) for f in findings] == [("find_repo_root", "stale-allowlist")]


def test_allowlist_entry_naming_an_unknown_function_fails():
    findings = bash_findings(BASH_A, BASH_B, allowed=frozenset({"find_repo_root", "no_such_fn"}))

    assert [(f.name, f.kind) for f in findings] == [("no_such_fn", "stale-allowlist")]


# --- python parsing ---------------------------------------------------------

PY_A = '''\
"""Common utilities (main repo / CLI version)."""

import re

VALUE = 1


def find_repo_root():
    """Look for .arckit/."""
    return ".arckit"


def slugify(text):
    return text.lower()
'''

PY_B = '''\
"""Common utilities (plugin version)."""

import re

VALUE = 1


def slugify(text):
    return text.lower()


def find_repo_root():
    """Look for projects/."""
    return "projects"
'''


def test_python_pair_with_declared_divergence_passes():
    findings = guard.compare(
        PY_A, PY_B, language="python", allowed={"find_repo_root", "<module docstring>"}
    )
    assert findings == []


def test_python_drift_in_a_shared_function_is_reported():
    drifted = PY_B.replace("return text.lower()", "return text.upper()")
    findings = guard.compare(
        PY_A, drifted, language="python", allowed={"find_repo_root", "<module docstring>"}
    )
    assert [f.name for f in findings] == ["slugify"]


def test_python_drift_in_a_module_constant_is_reported():
    drifted = PY_B.replace("VALUE = 1", "VALUE = 2")
    findings = guard.compare(
        PY_A, drifted, language="python", allowed={"find_repo_root", "<module docstring>"}
    )
    assert [f.name for f in findings] == ["VALUE"]


# --- the real repository ----------------------------------------------------


@pytest.mark.parametrize("pair", guard.PAIRS, ids=lambda p: p.label)
def test_the_shipped_copies_are_in_parity(pair):
    findings = guard.check_pair(pair)
    assert findings == [], guard.format_findings(pair, findings)
