// Deterministic assertion helpers for behavioural evals (ADR 0012).
// No network, no model — these inspect a repository's state after a skill
// has run. Each assert* throws an Error on failure and returns nothing on
// success. CRLF-tolerant so the same checks pass on Windows checkouts.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const read = (root, rel) =>
  readFileSync(join(root, rel), 'utf8').replace(/\r\n/g, '\n');

// List catalogue ADRs (excludes the 0000 template), sorted by number.
export function listAdrs(root) {
  const dir = join(root, 'adr');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /^\d{4}-.+\.md$/.test(f) && f !== '0000-template.md')
    .map((f) => ({ num: Number(f.slice(0, 4)), file: f }))
    .sort((a, b) => a.num - b.num);
}

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  const fields = {};
  if (m) {
    for (const line of m[1].split('\n')) {
      const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (kv) fields[kv[1]] = kv[2].trim();
    }
  }
  return fields;
}

// Every listed path exists under root.
export function assertTree(root, paths) {
  const missing = paths.filter((p) => !existsSync(join(root, p)));
  if (missing.length) {
    throw new Error(`expected paths missing: ${missing.join(', ')}`);
  }
}

// None of the listed paths exists under root (e.g. layers a profile
// promises to leave off).
export function assertAbsent(root, paths) {
  const present = paths.filter((p) => existsSync(join(root, p)));
  if (present.length) {
    throw new Error(`paths expected absent but present: ${present.join(', ')}`);
  }
}

// A file under root contains the given substring (CRLF-tolerant).
export function assertFileContains(root, rel, substring) {
  if (!existsSync(join(root, rel))) throw new Error(`${rel} missing`);
  if (!read(root, rel).includes(substring)) {
    throw new Error(`${rel} does not contain "${substring}"`);
  }
}

// ADR numbers are contiguous from 0001 with no gaps or duplicates.
export function assertContiguousAdrs(root) {
  const adrs = listAdrs(root);
  adrs.forEach((adr, i) => {
    if (adr.num !== i + 1) {
      throw new Error(
        `ADR numbering not contiguous at position ${i + 1}: got ${adr.file}`,
      );
    }
  });
  return adrs;
}

// Every catalogue ADR appears as a row in INDEX.md.
export function assertIndexSync(root) {
  if (!existsSync(join(root, 'INDEX.md'))) throw new Error('INDEX.md missing');
  const index = read(root, 'INDEX.md');
  for (const adr of listAdrs(root)) {
    if (!index.includes(adr.file)) {
      throw new Error(`INDEX.md missing row for adr/${adr.file}`);
    }
  }
}

// A specific ADR has the expected status in its frontmatter.
export function assertAdrStatus(root, num, expected) {
  const padded = String(num).padStart(4, '0');
  const adr = listAdrs(root).find((a) => a.num === Number(num));
  if (!adr) throw new Error(`ADR ${padded} not found`);
  const status = frontmatter(read(root, `adr/${adr.file}`)).status;
  if (status !== expected) {
    throw new Error(`ADR ${padded} status "${status}", expected "${expected}"`);
  }
}

// A file under root does NOT contain the given substring — for retired
// phrasing ("where practical") and overclaims that must stay gone.
export function assertFileLacks(root, rel, substring) {
  if (!existsSync(join(root, rel))) throw new Error(`${rel} missing`);
  if (read(root, rel).includes(substring)) {
    throw new Error(`${rel} still contains "${substring}"`);
  }
}

// Parse the flat-YAML capability manifest (docflow.yml).
export function parseManifest(root, rel = 'docflow.yml') {
  if (!existsSync(join(root, rel))) throw new Error(`${rel} missing`);
  const fields = {};
  for (const line of read(root, rel).split('\n')) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*?)\s*(?:#.*)?$/);
    if (kv) fields[kv[1]] = kv[2].trim();
  }
  return fields;
}

// The manifest declares the expected shape (schema/model/layers subset).
export function assertManifest(root, { schema = '1', model, layers = [] } = {}) {
  const m = parseManifest(root);
  if (Number(m.schema) !== Number(schema)) {
    throw new Error(`manifest schema "${m.schema}", expected ${schema}`);
  }
  if (model && m.model !== model) {
    throw new Error(`manifest model "${m.model}", expected "${model}"`);
  }
  const have = m.layers?.match(/[a-z]+/g) ?? [];
  const missing = layers.filter((l) => !have.includes(l));
  if (missing.length) {
    throw new Error(`manifest layers missing: ${missing.join(', ')} (have: ${have.join(', ') || 'none'})`);
  }
}

// Digest logic — mirrors the static gate's evidence check so evals
// verify independently that Implemented is backed by evidence.
import { createHash } from 'node:crypto';
const normaliseCriterion = (text) => text.replace(/\s+/g, ' ').trim();
const digest = (text) => createHash('sha256').update(text, 'utf8').digest('hex');
function criteriaOf(body) {
  const block = body.split(/^## Acceptance criteria\s*$/m)[1]?.split(/^## /m)[0] ?? '';
  const items = [];
  for (const m of block.matchAll(/^(\d+)\.\s([\s\S]*?)(?=^\d+\.\s|$(?![\s\S]))/gm)) {
    items[Number(m[1]) - 1] = normaliseCriterion(m[2]);
  }
  return items;
}

// Every current criterion of adr/<slug>.md has a current evidence record
// whose digest matches and whose result is valid (exit 0 or attested
// manual with a named human verifier).
export function assertEvidenceBacked(root, slug) {
  const body = read(root, `adr/${slug}.md`).match(/^---\n[\s\S]*?\n---\n?([\s\S]*)$/)?.[1];
  if (!body) throw new Error(`adr/${slug}.md: unreadable`);
  const criteria = criteriaOf(body);
  if (!criteria.length) throw new Error(`adr/${slug}.md: no criteria parsed`);
  const dir = join(root, 'evidence', slug);
  if (!existsSync(dir)) throw new Error(`evidence/${slug}/ missing`);
  const latest = {};
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.md'))) {
    const m = f.match(/^AC(\d+)-(\d{3})\.md$/);
    if (!m) throw new Error(`evidence/${slug}/${f}: bad record name`);
    const n = Number(m[1]);
    if (!latest[n] || Number(m[2]) > latest[n].seq) {
      latest[n] = { seq: Number(m[2]), fields: frontmatter(read(root, `evidence/${slug}/${f}`)), file: f };
    }
  }
  criteria.forEach((text, i) => {
    const rec = latest[i + 1];
    if (!rec) throw new Error(`AC${i + 1}: no evidence record`);
    if (rec.fields['ac-digest'] !== digest(text)) {
      throw new Error(`AC${i + 1}: evidence ${rec.file} digest does not match current text`);
    }
    const manual = rec.fields.verifier?.startsWith('human:');
    if (manual && !/human:\s*\S/.test(rec.fields.verifier)) {
      throw new Error(`AC${i + 1}: manual evidence names no verifier`);
    }
    if (!manual && rec.fields['exit-code'] !== '0') {
      throw new Error(`AC${i + 1}: evidence exit-code ${rec.fields['exit-code']}`);
    }
  });
}

// CONSTRAINTS.md parses and carries the expected ids, all with legal
// fields and resolvable authorising records.
export function assertConstraints(root, expectedIds = []) {
  if (!existsSync(join(root, 'CONSTRAINTS.md'))) throw new Error('CONSTRAINTS.md missing');
  const blocks = read(root, 'CONSTRAINTS.md').split(/^## /m).slice(1);
  const ids = [];
  for (const block of blocks) {
    const hm = block.split('\n', 1)[0].match(/^(CON-\d+) r(\d+) — (.+)$/);
    if (!hm) throw new Error(`bad constraint header: ${block.split('\n', 1)[0]}`);
    ids.push(hm[1]);
    const field = (name) => block.match(new RegExp(`^- ${name}:\\s*(.+)$`, 'm'))?.[1].trim();
    if (!['chosen', 'imposed', 'learned'].includes(field('source'))) {
      throw new Error(`${hm[1]}: illegal source`);
    }
    if (!['Active', 'Removed'].includes(field('state'))) {
      throw new Error(`${hm[1]}: illegal state`);
    }
    const auth = field('authorised-by')?.match(/^adr\/(\d{4}-[a-z0-9-]+)\.md$/);
    if (!auth || !existsSync(join(root, 'adr', `${auth[1]}.md`))) {
      throw new Error(`${hm[1]}: authorised-by does not resolve`);
    }
  }
  const missing = expectedIds.filter((id) => !ids.includes(id));
  if (missing.length) throw new Error(`constraints missing: ${missing.join(', ')}`);
}

// A plan item with the given slug is in plan/done and not in plan/todo.
export function assertPlanShipped(root, slugFragment) {
  const todo = existsSync(join(root, 'plan/todo'))
    ? readdirSync(join(root, 'plan/todo')) : [];
  const done = existsSync(join(root, 'plan/done'))
    ? readdirSync(join(root, 'plan/done')) : [];
  if (todo.some((f) => f.includes(slugFragment))) {
    throw new Error(`plan item "${slugFragment}" still in plan/todo`);
  }
  if (!done.some((f) => f.includes(slugFragment))) {
    throw new Error(`plan item "${slugFragment}" not found in plan/done`);
  }
}
