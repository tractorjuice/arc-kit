import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BOOK = `${__dirname}/ARCKIT-BOOK.md`;
const IMG_DIR = `${__dirname}/images`;
const SRC_DIR = `${IMG_DIR}/src`;

mkdirSync(SRC_DIR, { recursive: true });

const DIAGRAM_NAMES = [
  { slug: 'workflow-standard-path' },
  { slug: 'workflow-uk-gov-path' },
  { slug: 'workflow-decision-tree' },
  { slug: 'workflow-gantt' },
  { slug: 'wardley-suite' },
  { slug: 'wardley-example-nhs' },
  { slug: 'hook-architecture' },
  { slug: 'conversion-pipeline' },
  { slug: 'traceability-chain' },
];

const md = readFileSync(BOOK, 'utf8');
const lines = md.split('\n');

const blocks = [];
let inBlock = false;
let buf = [];
let startLine = 0;
for (let i = 0; i < lines.length; i++) {
  if (!inBlock && lines[i] === '```mermaid') {
    inBlock = true;
    buf = [];
    startLine = i;
  } else if (inBlock && lines[i] === '```') {
    inBlock = false;
    blocks.push({ startLine, endLine: i, source: buf.join('\n') });
  } else if (inBlock) {
    buf.push(lines[i]);
  }
}

if (blocks.length !== DIAGRAM_NAMES.length) {
  throw new Error(`Expected ${DIAGRAM_NAMES.length} mermaid blocks, found ${blocks.length}`);
}

for (let i = 0; i < blocks.length; i++) {
  const { slug } = DIAGRAM_NAMES[i];
  const srcPath = `${SRC_DIR}/${slug}.mmd`;
  writeFileSync(srcPath, blocks[i].source + '\n');
  console.log(`wrote ${srcPath}`);
}

for (const { slug } of DIAGRAM_NAMES) {
  const src = `${SRC_DIR}/${slug}.mmd`;
  const out = `${IMG_DIR}/${slug}.svg`;
  console.log(`rendering ${slug}...`);
  execFileSync('npx', ['mmdc', '-i', src, '-o', out, '-b', 'transparent', '-t', 'default'], { stdio: 'inherit' });
}

console.log(`\nall ${blocks.length} diagrams rendered`);
