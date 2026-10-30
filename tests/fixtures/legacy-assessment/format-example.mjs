/** Independent synthetic format fixture. No source assessment data is used. */
import { readFileSync } from 'node:fs';
export function formatExample() {
  const a = JSON.parse(
    readFileSync(
      new URL('./published-example.input.json', import.meta.url),
      'utf8'
    )
  );
  a.metadata.scope = 'Invented component and headline chart format example';
  a.systems[0].name = 'Synthetic system';
  a.systems[0].id = 'example_system';
  a.systems[0].boundary = 'Invented format demonstration';
  a.systems[0].services = ['Example service'];
  for (const e of a.evidence)
    if (e.systemId === 'payments') e.systemId = 'example_system';
  for (const f of a.findings) f.systemId = 'example_system';
  for (const r of a.riskInputs) r.systemId = 'example_system';
  a.systems[0].components = Array.from({ length: 6 }, (_, i) => ({
    id: `example_${i + 1}`,
    name: `Component ${String.fromCharCode(65 + i)}`,
    version: null
  }));
  const originalFindings = structuredClone(a.findings);
  for (let i = 0; i < 3; i++)
    for (const f of structuredClone(originalFindings)) {
      f.id = `example_${i + 1}_${f.criterionId}`;
      f.componentId = `example_${i + 1}`;
      f.rationale = 'Invented component finding for a rendering regression.';
      if (f.criterionId === 'D1')
        f.outcome = ['Legacy', 'Action-Required', 'Accepted'][i];
      a.findings.push(f);
    }
  const intervals = [
    [2.3, 2.67, 2.9],
    [1.12, 1.17, 1.32],
    [0.42, 0.52, 0.78],
    [0.45, 1.16, 2.55],
    [0.32, 0.78, 1.55]
  ];
  intervals.forEach(([lo, point, hi], index) => {
    a.systems[0].components[index].measurements = Array.from(
      { length: 7 },
      (_, i) => ({
        criterionId: `D${i + 1}`,
        lower: (i === 0 ? lo : 0.1) * 40,
        estimate: (i === 0 ? point : 0.2) * 40,
        upper: (i === 0 ? hi : 0.3) * 40,
        calibration: {
          unit: 'invented burden units',
          baseline: 0,
          actionRequired: 40,
          legacy: 80,
          direction: 'higher-is-worse'
        },
        basis: 'estimated',
        evidenceIds: [],
        rationale:
          'Invented numerical interval and local calibration for a rendering regression; no operational evidence is claimed.'
      })
    );
  });
  for (const v of a.riskInputs[0].inputs) v.value = 4;
  for (const id of ['C1'])
    a.riskInputs[0].inputs.find((v) => v.criterionId === id).value = null;
  a.riskInputs[0].chartAnnotation = {
    suspectedPosition: { likelihood: 4, impact: 4 },
    rationale: 'Invented chart judgement only.'
  };
  return a;
}
