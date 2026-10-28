#!/usr/bin/env python3
"""Freeze the original GOV.UK legacy definition and scoring tables from local HTML.

No network access. Supply saved primary publications explicitly; a changed public
version or missing table fails instead of silently changing a frozen framework.
"""
from __future__ import annotations
import argparse
from datetime import date
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
CORE = ROOT / 'plugins/arckit-claude'
BASE = 'https://www.gov.uk/government/publications/guidance-on-the-legacy-it-risk-assessment-framework/'
VERSION = '2026-08-17'
ATTRIBUTION = 'Contains public sector information licensed under the Open Government Licence v3.0.'
LICENCE = 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/'


def clean(text):
    return re.sub(r'\s+', ' ', text).strip()


class Publication(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.depth = 0
        self.public_date = None
        self.blocks = []
        self.tokens = []
        self.tag = None
        self.buffer = []
        self.heading = None
        self.table = None
        self.row = None
        self.cell = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'meta' and attrs.get('name') == 'govuk:public-updated-at':
            self.public_date = attrs.get('content', '')[:10]
        if not self.depth:
            if tag == 'div' and 'govspeak' in attrs.get('class', '').split():
                self.depth = 1
            return
        if tag == 'div':
            self.depth += 1
        if tag == 'table':
            self.table = []
        elif self.table is not None:
            if tag == 'tr':
                self.row = []
            elif tag in {'td', 'th'}:
                self.cell = []
            elif tag == 'br' and self.cell is not None:
                self.cell.append(' ')
        elif tag in {'h2', 'h3', 'h4', 'p', 'li'} and self.tag is None:
            self.tag, self.buffer, self.heading = tag, [], attrs.get('id')
        elif tag == 'br' and self.tag:
            self.buffer.append(' ')

    def handle_data(self, text):
        if not self.depth:
            return
        self.tokens.append(text)
        if self.cell is not None:
            self.cell.append(text)
        elif self.tag:
            self.buffer.append(text)

    def handle_endtag(self, tag):
        if not self.depth:
            return
        if tag == 'div':
            self.depth -= 1
            if not self.depth:
                return
        if self.table is not None:
            if tag in {'td', 'th'} and self.cell is not None:
                self.row.append(clean(''.join(self.cell)))
                self.cell = None
            elif tag == 'tr' and self.row is not None:
                self.table.append(self.row)
                self.row = None
            elif tag == 'table':
                self.blocks.append({'kind': 'table', 'rows': self.table})
                self.table = None
        elif tag == self.tag:
            text = clean(''.join(self.buffer))
            if text:
                self.blocks.append({'kind': tag, 'text': text, 'id': self.heading})
            self.tag, self.buffer, self.heading = None, [], None


def parse(path):
    raw = path.read_bytes()
    publication = Publication()
    publication.feed(raw.decode('utf-8'))
    if publication.public_date != VERSION:
        raise ValueError(f'{path}: expected public version {VERSION}, got {publication.public_date}')
    if not publication.blocks or publication.depth:
        raise ValueError(f'{path}: incomplete GOV.UK publication body')
    original = re.sub(r'\s+', '', ''.join(publication.tokens))
    captured = ''.join(''.join(''.join(row) for row in b['rows']) if b['kind']=='table' else b['text'] for b in publication.blocks)
    if original != re.sub(r'\s+', '', captured):
        raise ValueError(f'{path}: extraction would omit publication text')
    return publication, hashlib.sha256(raw).hexdigest()


def section(publication, heading):
    selected = False
    content = []
    for block in publication.blocks:
        if block['kind'] in {'h2', 'h3', 'h4'}:
            if selected:
                break
            selected = block.get('id') == heading
        elif selected and 'text' in block:
            content.append(block['text'])
    if not selected:
        raise ValueError(f'Missing source section {heading}')
    return content


def source(slug, digest, retrieved):
    return {'url': BASE + slug, 'publicUpdated': VERSION, 'retrievedDate': retrieved,
            'sourceHtmlSha256': digest, 'licence': LICENCE, 'attribution': ATTRIBUTION,
            'normalisation': 'HTML markup removed; whitespace normalised. Rubric wording and numeric anchors retained.'}


def rubric(pub, digest, retrieved):
    tables = [b['rows'] for b in pub.blocks if b['kind'] == 'table']
    if len(tables) != 2:
        raise ValueError('Expected exactly two published scoring tables')
    result = {'formatVersion': '1.0', 'modelId': 'published-2026-08-17',
              'source': source('guidance-on-the-legacy-it-risk-assessment-framework', digest, retrieved),
              'status': 'Published numerical prioritisation model; under review following the updated definition. Not a revised classification model.',
              'assessmentHorizonYears': 3, 'redThreshold': 16, 'maximumRisk': 30,
              'formula': {'likelihood': '(mean(L1..L7) + max(L1..L7)) / 2',
                          'impact': '(mean(C1..C6) + max(C1..C6)) / 2',
                          'risk': 'likelihood * impact; compare unrounded risk >= 16'},
              'likelihood': [], 'impact': []}
    for table, prefix, ncriteria, nlevels, group in [(tables[0], 'L', 7, 6, 'likelihood'), (tables[1], 'C', 6, 5, 'impact')]:
        if len(table) != nlevels + 1 or any(len(row) != ncriteria + 2 for row in table):
            raise ValueError(f'Incomplete {group} table')
        if [int(row[0]) for row in table[1:]] != list(range(nlevels, 0, -1)):
            raise ValueError(f'Unexpected {group} levels')
        for i in range(ncriteria):
            identifier = f'{prefix}{i + 1}'
            title = table[0][i + 2]
            if not title.startswith(identifier + ' '):
                raise ValueError(f'Unexpected criterion header: {title}')
            heading = next(b['id'] for b in pub.blocks if b['kind'] == 'h3' and b['text'].startswith(identifier + ' '))
            levels = [{'score': int(row[0]), 'degree': row[1], 'anchor': row[i + 2]} for row in table[1:]]
            if not all(level['anchor'] for level in levels):
                raise ValueError(f'Empty anchor in {identifier}')
            result[group].append({'id': identifier, 'name': title[len(identifier) + 1:],
                                  'description': ' '.join(section(pub, heading)), 'levels': levels})
    result['workedExample'] = {'likelihoodInputs': [5, 5, 5, 5, 6, 6, 6], 'impactInputs': [5, 5, 2, 5, 5, 4],
                              'displayRisk': '26.67', 'sourceSection': '#example-scoring-of-a-legacy-it-asset'}
    result['interpretationNotes'] = [
        'These are original criterion-specific anchors, including financial and resource-hour examples; do not interpolate or repair gaps in the published bands.',
        'The older numeric threshold for calling an asset legacy does not determine classification under the updated definition.',
        'Older register/submission instructions in the source snapshot are historical; current reporting arrangements require confirmation.',
        'Bundled rubric availability is independent of evidence about a project system. Missing system evidence still leaves a score unknown.'
    ]
    return result


def definition(pub, digest, retrieved):
    headings = [b for b in pub.blocks if b['kind'] == 'h3']
    tables = [b['rows'] for b in pub.blocks if b['kind'] == 'table']
    if len(headings) != 7 or len(tables) != 1 or len(tables[0]) != 4:
        raise ValueError('Incomplete updated definition')
    criteria = []
    for i, heading in enumerate(headings, 1):
        if not heading['text'].startswith(f'{i}. '):
            raise ValueError('Unexpected definition criterion order')
        criteria.append({'id': f'D{i}', 'name': heading['text'].split('. ', 1)[1],
                         'description': ' '.join(section(pub, heading['id']))})
    return {'formatVersion': '1.0', 'modelId': 'uk-definition-2026-08-17',
            'source': source('updated-definition-of-legacy-it', digest, retrieved),
            'definition': section(pub, 'what-is-legacy-it'), 'criteria': criteria,
            'outcomes': [{'outcome': row[0], 'definition': row[1]} for row in tables[0][1:]],
            'determinationAndThresholdText': section(pub, 'howislegacy-statusdetermined') + section(pub, 'whataretheoutcomes'),
            'localPolicyNote': 'This publication does not provide a complete quantitative threshold catalogue. Owner rules and draft ArcKit proposals remain separate.'}


def archive(pub, title, source_url, note):
    lines = [f'# {title} — frozen source snapshot', '', f'Source: [{title}]({source_url}). Public version: {VERSION}.', '',
             ATTRIBUTION, f'Licence: [Open Government Licence v3.0]({LICENCE}).', '',
             f'**ArcKit interpretation boundary:** {note}', '',
             'The source text below is retained with HTML removed and whitespace normalised. It is not a new ArcKit policy.', '']
    esc = lambda text: text.replace('&', '&amp;').replace('|', '&#124;').replace('<', '&lt;').replace('>', '&gt;')
    for block in pub.blocks:
        if block['kind'] == 'table':
            rows = block['rows']
            lines.append('| ' + ' | '.join(map(esc, rows[0])) + ' |')
            lines.append('|' + '---|' * len(rows[0]))
            lines.extend('| ' + ' | '.join(map(esc, row)) + ' |' for row in rows[1:])
        else:
            prefix = '#' * int(block['kind'][1:]) + ' ' if block['kind'].startswith('h') else '- ' if block['kind'] == 'li' else ''
            lines.append(prefix + esc(block['text']))
        lines.append('')
    return '\n'.join(lines).rstrip() + '\n'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--risk-html', type=Path, required=True)
    parser.add_argument('--definition-html', type=Path, required=True)
    parser.add_argument('--retrieved-date', default=date.today().isoformat())
    args = parser.parse_args()
    date.fromisoformat(args.retrieved_date)
    risk, rhash = parse(args.risk_html)
    defined, dhash = parse(args.definition_html)
    products = {
        'legacy-risk-rubric-2026-08-17.json': rubric(risk, rhash, args.retrieved_date),
        'legacy-definition-2026-08-17.json': definition(defined, dhash, args.retrieved_date),
    }
    for name, data in products.items():
        (CORE / 'data' / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    (CORE / 'references/legacy-risk-framework-2026-08-17.md').write_text(archive(risk, 'Guidance on the Legacy IT Risk Assessment Framework', BASE + 'guidance-on-the-legacy-it-risk-assessment-framework', 'Use the scoring tables as the separately versioned published numerical model. Its old age-based classification and numeric legacy threshold are superseded by the updated definition. Its register/submission instructions are historical and must not be presented as current obligations.'), encoding='utf-8')
    (CORE / 'references/legacy-definition-2026-08-17.md').write_text(archive(defined, 'Updated Definition of Legacy IT', BASE + 'updated-definition-of-legacy-it', 'Use these seven classification criteria and outcomes with documented owner thresholds. ArcKit draft thresholds are proposals, not government policy.'), encoding='utf-8')
    catalogue_path = CORE / 'data/legacy-frameworks-1.0.json'
    catalogue = json.loads(catalogue_path.read_text())
    catalogue['offlineAssets'] = {key: {'path': name, 'sha256': hashlib.sha256((CORE / 'data' / name).read_bytes()).hexdigest()}
                                  for key, name in [('riskRubric', 'legacy-risk-rubric-2026-08-17.json'), ('definition', 'legacy-definition-2026-08-17.json')]}
    catalogue['rubricInstruction'] = 'Use the bundled riskRubric original criterion-specific tables offline. Network access is only for optional source refresh. Do not infer scores from D1-D7 outcomes; missing system evidence still leaves an input unknown.'
    catalogue_path.write_text(json.dumps(catalogue, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('Bundled 42 likelihood anchors, 30 impact anchors, seven definition criteria and three outcomes.')


if __name__ == '__main__':
    main()
