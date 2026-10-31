"""The arc42 recipe must make each worker's required source artefacts available."""

from pathlib import Path

import yaml


REPO_ROOT = Path(__file__).resolve().parents[2]
RECIPE = REPO_ROOT / "plugins/arckit-arc42/recipes/arc42-full.yaml"


def test_security_worker_receives_all_mandatory_artifact_types():
    """A transitive dependency orders a worker but does not grant it read access."""
    recipe = yaml.safe_load(RECIPE.read_text(encoding="utf-8"))
    targets = {target["id"]: target for target in recipe["targets"]}
    security = next(
        target for target in targets.values() if target["skill"] == "arckit:secure"
    )
    direct_input_types = {
        targets[dependency]["output"]["type"] for dependency in security["deps"]
    }

    # /arckit:secure requires both in its "MANDATORY" source artefact section.
    mandatory_types = {"REQ", "PRIN"}
    assert mandatory_types <= direct_input_types, (
        "The security worker may read only its direct dependency outputs; "
        f"missing mandatory artefacts: {sorted(mandatory_types - direct_input_types)}"
    )
