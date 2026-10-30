"""Cross-check the dependency-free validator with the standard JSON Schema implementation."""
import copy
import json
from pathlib import Path
import subprocess

from jsonschema import Draft202012Validator, FormatChecker, ValidationError
import pytest

ROOT = Path(__file__).resolve().parents[2]
SCHEMA = json.loads((ROOT / 'plugins/arckit-claude/schemas/legacy-assessment-1.0.schema.json').read_text())
BASE = json.loads((ROOT / 'tests/fixtures/legacy-assessment/published-example.input.json').read_text())
VALIDATOR = Draft202012Validator(SCHEMA, format_checker=FormatChecker())


def test_schema_is_valid_and_fixtures_validate_independently():
    Draft202012Validator.check_schema(SCHEMA)
    for path in (ROOT / 'tests/fixtures/legacy-assessment').glob('*.json'):
        if path.name.endswith(('.input.json', '.expected.json')):
            VALIDATOR.validate(json.loads(path.read_text()))


@pytest.mark.parametrize('mutate', [
    lambda a: a.update(schemaVersion='2.0'),
    lambda a: a['metadata'].update(assessmentDate='2026-02-30'),
    lambda a: a['riskInputs'][0]['inputs'][0].update(value=1.5),
    lambda a: a['riskInputs'][0]['inputs'][7].update(value=6),
    lambda a: a['systems'][0].update(boundary='   '),
    lambda a: a['evidence'][0]['approvalFor'][0].update(decision='rejected'),
    lambda a: a['systems'].extend([copy.deepcopy(a['systems'][0])] * 256),
    lambda a: a['riskInputs'][0].update(chartAnnotation={'confidence': 'certain', 'suspectedPosition': None, 'rationale': 'Synthetic invalid confidence'}),
    lambda a: a['systems'][0]['components'][0].update(measurements=[{'criterionId': 'D8'}]),
])
def test_structural_invalid_cases_fail_both_validators(tmp_path, mutate):
    assessment = copy.deepcopy(BASE)
    mutate(assessment)
    with pytest.raises(ValidationError):
        VALIDATOR.validate(assessment)
    path = tmp_path / 'input.json'
    path.write_text(json.dumps(assessment))
    result = subprocess.run(['node', str(ROOT / 'plugins/arckit-claude/scripts/legacy-assessment.mjs'), '--input', str(path), '--json'], capture_output=True, text=True, timeout=5)
    assert result.returncode == 1, result.stderr
    assert result.stdout == ''


def test_component_measurement_example_matches_independent_json_schema():
    script = """import {formatExample} from './tests/fixtures/legacy-assessment/format-example.mjs';
import {assess} from './plugins/arckit-claude/scripts/legacy-assessment.mjs';
console.log(JSON.stringify(assess(formatExample())));"""
    result = subprocess.run(['node', '--input-type=module', '-e', script], cwd=ROOT, capture_output=True, text=True, check=True)
    VALIDATOR.validate(json.loads(result.stdout))
