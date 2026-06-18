import { basename, sep } from 'node:path';
import { DOC_TYPES, MULTI_INSTANCE_TYPES } from '../config/doc-types.mjs';
import {
  okfDescriptionForDocument,
  okfTagsForDocType,
  okfTypeForDocType,
} from '../config/okf-types.mjs';

const FRONTMATTER_RE = /^---\r?\n/;

function parseScalar(raw) {
  const value = String(raw ?? '').trim();
  if (value === '') return '';
  if (value === 'null') return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map(part => parseScalar(part));
  }
  return value;
}

function parseYamlSubset(raw) {
  const data = {};
  const lines = raw.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) {
      i += 1;
      continue;
    }
    if (/^\s/.test(line)) {
      throw new Error(`unexpected indented line: ${line}`);
    }
    const m = line.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/);
    if (!m) throw new Error(`unsupported YAML line: ${line}`);

    const key = m[1];
    const inlineValue = m[2] ?? '';
    if (inlineValue.trim() !== '') {
      data[key] = parseScalar(inlineValue);
      i += 1;
      continue;
    }

    const block = [];
    i += 1;
    while (i < lines.length && (lines[i].startsWith('  ') || !lines[i].trim())) {
      if (lines[i].trim()) block.push(lines[i]);
      i += 1;
    }

    if (block.length === 0) {
      data[key] = {};
      continue;
    }

    if (block.every(item => item.trim().startsWith('- '))) {
      data[key] = block.map(item => parseScalar(item.trim().slice(2)));
      continue;
    }

    const obj = {};
    for (const item of block) {
      const nested = item.match(/^  ([A-Za-z0-9_-]+):(?:\s*(.*))?$/);
      if (!nested) throw new Error(`unsupported nested YAML line: ${item}`);
      obj[nested[1]] = parseScalar(nested[2] ?? '');
    }
    data[key] = obj;
  }

  return data;
}

function quoteYamlString(value) {
  const text = String(value);
  if (text === '') return '""';
  if (/^[A-Za-z0-9_./@+-]+$/.test(text)) return text;
  return JSON.stringify(text);
}

function formatYamlValue(value) {
  if (value === null) return 'null';
  if (value === true) return 'true';
  if (value === false) return 'false';
  if (typeof value === 'number') return String(value);
  return quoteYamlString(value);
}

function orderedKeys(data) {
  const preferred = ['type', 'title', 'description', 'resource', 'tags', 'timestamp', 'arckit'];
  const seen = new Set(preferred);
  return [
    ...preferred.filter(key => Object.prototype.hasOwnProperty.call(data, key)),
    ...Object.keys(data).filter(key => !seen.has(key)).sort(),
  ];
}

export function buildOkfFrontmatter(fields = {}) {
  const lines = [];
  for (const key of orderedKeys(fields)) {
    const value = fields[key];
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) lines.push(`  - ${formatYamlValue(item)}`);
    } else if (value && typeof value === 'object') {
      lines.push(`${key}:`);
      for (const nestedKey of Object.keys(value).sort()) {
        lines.push(`  ${nestedKey}: ${formatYamlValue(value[nestedKey])}`);
      }
    } else {
      lines.push(`${key}: ${formatYamlValue(value)}`);
    }
  }
  return `${lines.join('\n')}\n`;
}

export function parseFrontmatter(content) {
  if (!FRONTMATTER_RE.test(content)) {
    return { hasFrontmatter: false, raw: null, data: {}, body: content, error: null };
  }

  const lines = content.split(/\r?\n/);
  let close = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === '---') {
      close = i;
      break;
    }
  }
  if (close === -1) {
    return { hasFrontmatter: false, raw: null, data: {}, body: content, error: 'unterminated frontmatter' };
  }

  const raw = lines.slice(1, close).join('\n');
  const body = lines.slice(close + 1).join('\n');
  try {
    return {
      hasFrontmatter: true,
      raw,
      data: parseYamlSubset(raw),
      body,
      error: null,
    };
  } catch (error) {
    return {
      hasFrontmatter: true,
      raw,
      data: {},
      body: content,
      error: error.message,
    };
  }
}

export function stripFrontmatter(content) {
  const parsed = parseFrontmatter(content);
  if (parsed.hasFrontmatter && !parsed.error) return parsed.body;
  return content;
}

function mergeObjects(base = {}, updates = {}) {
  const merged = { ...base };
  for (const [key, value] of Object.entries(updates)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      base[key] &&
      typeof base[key] === 'object' &&
      !Array.isArray(base[key])
    ) {
      merged[key] = mergeObjects(base[key], value);
    } else {
      merged[key] = value;
    }
  }
  return merged;
}

export function mergeOkfFrontmatter(content, fields = {}) {
  const parsed = parseFrontmatter(content);
  if (parsed.error) return content;

  const data = mergeObjects(parsed.data, fields);
  const body = parsed.hasFrontmatter ? parsed.body : content;
  return `---\n${buildOkfFrontmatter(data)}---\n${body}`;
}

export function extractFirstHeading(content) {
  const body = stripFrontmatter(content);
  for (const line of body.split(/\r?\n/)) {
    const match = line.match(/^#\s+(.+)/);
    if (match) return match[1].trim();
  }
  return null;
}

export function extractDocTypeFromFilename(filename) {
  const match = basename(filename).match(/^ARC-\d{3}-(.+)-v\d+(?:\.\d+)?\.md$/);
  if (!match) return null;
  const rest = match[1];

  const compoundCodes = Object.keys(DOC_TYPES)
    .filter(code => code.includes('-'))
    .sort((a, b) => b.length - a.length);
  for (const code of compoundCodes) {
    if (rest === code || rest.startsWith(`${code}-`)) return code;
  }

  const strippedSequence = rest.replace(/-\d{3}$/, '');
  if (DOC_TYPES[strippedSequence]) return strippedSequence;
  if (DOC_TYPES[rest]) return rest;

  const firstSegment = rest.split('-')[0];
  if (MULTI_INSTANCE_TYPES.has(firstSegment) || DOC_TYPES[firstSegment]) return firstSegment;
  return strippedSequence || firstSegment || null;
}

export function extractArcMetadataFromPath(filePath) {
  const filename = basename(filePath);
  const match = filename.match(/^(ARC-(\d{3})-.+-v(\d+(?:\.\d+)?))\.md$/);
  if (!match) return null;

  const normalized = String(filePath).replaceAll('\\', sep);
  const parts = normalized.split(/[\\/]/);
  const projectsIndex = parts.lastIndexOf('projects');
  const project = projectsIndex >= 0 ? parts[projectsIndex + 1] : null;
  const docType = extractDocTypeFromFilename(filename);
  const meta = DOC_TYPES[docType] || null;

  return {
    documentId: match[1],
    projectNumber: match[2],
    version: match[3],
    docType,
    project,
    category: meta?.category || null,
    type: okfTypeForDocType(docType, meta),
    tags: okfTagsForDocType(docType, meta),
  };
}

export function buildOkfFieldsForArcArtifact({ filePath, content, resource, timestamp } = {}) {
  const arc = extractArcMetadataFromPath(filePath);
  if (!arc) return null;

  const title = extractFirstHeading(content || '') || arc.type;
  const fields = {
    type: arc.type,
    title,
    description: okfDescriptionForDocument({
      title,
      documentId: arc.documentId,
      category: arc.category,
    }),
    resource: resource || filePath,
    tags: arc.tags,
    timestamp: timestamp || new Date().toISOString(),
    arckit: {
      document_id: arc.documentId,
      doc_type: arc.docType,
      project: arc.project,
      category: arc.category,
      version: arc.version,
      source_path: resource || filePath,
    },
  };

  return fields;
}

