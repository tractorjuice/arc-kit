"""Offline references are complete assessment material, not URL placeholders."""
from pathlib import Path
import hashlib
import json
import os
import subprocess

ROOT=Path(__file__).resolve().parents[2]
CORE=ROOT/'plugins/arckit-claude'
CATALOGUE=json.loads((CORE/'data/legacy-frameworks-1.0.json').read_text())


def test_every_original_scoring_anchor_and_definition_is_bundled():
    risk=json.loads((CORE/'data/legacy-risk-rubric-2026-08-17.json').read_text())
    definition=json.loads((CORE/'data/legacy-definition-2026-08-17.json').read_text())
    for group,prefix,count,levels in [('likelihood','L',7,6),('impact','C',6,5)]:
        assert [c['id'] for c in risk[group]]==[f'{prefix}{i}' for i in range(1,count+1)]
        for criterion in risk[group]:
            assert criterion['description']
            assert [l['score'] for l in criterion['levels']]==list(range(levels,0,-1))
            assert all(l['anchor'] for l in criterion['levels'])
    assert sum(len(c['levels']) for g in ['likelihood','impact'] for c in risk[g])==72
    assert risk['assessmentHorizonYears']==3
    assert risk['workedExample']['displayRisk']=='26.67'
    assert '>£50m' in risk['impact'][2]['levels'][0]['anchor']
    assert '<£5m' in risk['impact'][2]['levels'][-1]['anchor']
    assert '>500,000' in risk['impact'][4]['levels'][0]['anchor']
    assert '<100' in risk['impact'][4]['levels'][-1]['anchor']
    assert len(definition['criteria'])==7
    assert [o['outcome'] for o in definition['outcomes']]==['Accepted','Action-Required','Legacy']
    assert any('risk appetite' in t for t in definition['determinationAndThresholdText'])


def test_bundle_integrity_version_and_open_licence():
    for asset in CATALOGUE['offlineAssets'].values():
        raw=(CORE/'data'/asset['path']).read_bytes()
        assert hashlib.sha256(raw).hexdigest()==asset['sha256']
        data=json.loads(raw)
        assert data['source']['publicUpdated']=='2026-08-17'
        assert 'open-government-licence/version/3' in data['source']['licence']
        assert data['source']['attribution'].startswith('Contains public sector information')
    for name in ['legacy-risk-framework-2026-08-17.md','legacy-definition-2026-08-17.md']:
        content=(CORE/'references'/name).read_text()
        assert 'Open Government Licence' in content
        assert 'ArcKit interpretation boundary' in content


def test_calculator_has_no_network_dependency(tmp_path):
    blocker=tmp_path/'deny-network.cjs'
    blocker.write_text("const deny=()=>{throw new Error('NETWORK FORBIDDEN')}; for(const name of ['http','https'])for(const key of ['request','get'])require(name)[key]=deny; const net=require('net');net.connect=net.createConnection=deny;net.Socket.prototype.connect=deny;net.Server.prototype.listen=deny;require('tls').connect=deny;for(const key of ['lookup','resolve','resolve4','resolve6'])require('dns')[key]=deny;global.fetch=deny;")
    env={**os.environ,'NODE_OPTIONS':f'--require {blocker}'}
    result=subprocess.run(['node',str(CORE/'scripts/legacy-assessment.mjs'),'--input',str(ROOT/'tests/fixtures/legacy-assessment/published-example.input.json'),'--json'],env=env,text=True,capture_output=True,timeout=5)
    assert result.returncode==0,result.stderr
    assert json.loads(result.stdout)['results']['systems'][0]['risk']['display']=='26.67'


def test_corrupt_or_missing_bundled_material_is_a_runtime_failure(tmp_path):
    import shutil
    root=tmp_path/'plugin'
    for folder in ['scripts','schemas','data']:
        (root/folder).mkdir(parents=True)
    shutil.copy2(CORE/'scripts/legacy-assessment.mjs',root/'scripts/legacy-assessment.mjs')
    shutil.copy2(CORE/'schemas/legacy-assessment-1.0.schema.json',root/'schemas/legacy-assessment-1.0.schema.json')
    for name in ['legacy-frameworks-1.0.json','legacy-risk-rubric-2026-08-17.json','legacy-definition-2026-08-17.json']:
        shutil.copy2(CORE/'data'/name,root/'data'/name)
    command=['node',str(root/'scripts/legacy-assessment.mjs'),'--input',str(ROOT/'tests/fixtures/legacy-assessment/published-example.input.json'),'--json']
    assert subprocess.run(command,capture_output=True).returncode==0
    rubric=root/'data/legacy-risk-rubric-2026-08-17.json'
    rubric.write_text(rubric.read_text().replace('Already out of support','Still supported'))
    result=subprocess.run(command,capture_output=True,text=True)
    assert result.returncode==2
    assert result.stdout==''
    assert 'integrity' in result.stderr
    rubric.unlink()
    result=subprocess.run(command,capture_output=True,text=True)
    assert result.returncode==2
    assert result.stdout==''


def test_freezer_rejects_changed_versions_and_dropped_publication_text(tmp_path):
    import importlib.util
    spec=importlib.util.spec_from_file_location('legacy_bundle',ROOT/'scripts/bundle-legacy-frameworks.py')
    module=importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    file=tmp_path/'source.html'
    file.write_text('<meta name="govuk:public-updated-at" content="2027-01-01"><div class="govspeak"><p>Changed framework</p></div>')
    import pytest
    with pytest.raises(ValueError,match='expected public version'):
        module.parse(file)
    file.write_text('<meta name="govuk:public-updated-at" content="2026-08-17"><div class="govspeak"><p>Kept text</p>Uncaptured normative text</div>')
    with pytest.raises(ValueError,match='omit publication text'):
        module.parse(file)
