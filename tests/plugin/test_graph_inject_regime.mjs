import assert from 'node:assert';
const { recommendForTest } = await import('../../arckit-claude/hooks/graph-inject.mjs');
process.env.CLAUDE_PLUGIN_OPTION_GOVERNANCE_FRAMEWORK = 'Generic';
assert.ok(!recommendForTest('pentest-report.pdf').includes('uk-secure'), 'neutral: no uk-secure');
process.env.CLAUDE_PLUGIN_OPTION_GOVERNANCE_FRAMEWORK = 'UK Gov';
assert.ok(recommendForTest('pentest-report.pdf').includes('uk-secure'), 'UK Gov: uk-secure');
console.log('ok');
