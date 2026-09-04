// Deterministic assertion helpers for behavioural evals (ADR 0012).
// No network, no model — these inspect a repository's state after a skill
// has run. Each assert* throws an Error on failure and returns nothing on
// success. CRLF-tolerant so the same checks pass on Windows checkouts.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const read = (root, rel) =>
  readFileSync(join(root, rel), 'utf8').replace(/\r\n/g, '\n');

// List catalogue ADRs, sorted by number. Templates are not decisions:
// both 0000- files are excluded, and so is a template numbered at a
// legacy range boundary (e.g. adr/0100-template.md).
export function listAdrs(root) {
  const dir = join(root, 'adr');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /^\d{4}-.+\.md$/.test(f))
    .filter((f) => !f.startsWith('0000-') && !/^\d{4}-template\.md$/.test(f))
    .map((f) => ({ num: Number(f.slice(0, 4)), file: f }))
    .sort((a, b) => a.num - b.num);
}

// Template files numbered other than 0000 — the legacy boundary template.
export function listBoundaryTemplates(root) {
  const dir = join(root, 'adr');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /^\d{4}-template\.md$/.test(f) && !f.startsWith('0000-'));
}

// Every text-like file under root, relative to it (skips .git).
function walk(root, rel = '') {
  const out = [];
  const dir = rel ? join(root, rel) : root;
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const child = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...walk(root, child));
    else if (entry.name.endsWith('.md')) out.push(child);
  }
  return out;
}

// The declared shape of an ADR: its `shape:` field, or null when absent.
export function adrShape(root, file) {
  return frontmatter(read(root, `adr/${file}`)).shape || null;
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

// The catalogue is on the LEGACY RANGE ENCODING: shape carried by the
// number, not by a field. `cutoff` is the first technology number;
// `shapeExceptions` names ADR numbers below it that are technology-shaped
// anyway (the seed record the range encoding forces an exception for).
export function assertLegacyRange(root, { cutoff, shapeExceptions = [] }) {
  const conventions = read(root, 'CONVENTIONS.md');
  const boundary = String(cutoff).padStart(4, '0');
  if (!conventions.includes(boundary)) {
    throw new Error(`CONVENTIONS.md records no cutoff at ${boundary}`);
  }
  const templates = listBoundaryTemplates(root);
  if (!templates.length) {
    throw new Error('no boundary-numbered template — not a legacy catalogue');
  }
  const adrs = listAdrs(root);
  if (!adrs.length) throw new Error('no ADRs in the fixture');
  for (const adr of adrs) {
    if (adrShape(root, adr.file)) {
      throw new Error(`${adr.file} carries a shape: field — not legacy`);
    }
    const body = read(root, `adr/${adr.file}`);
    const isTechBody = body.includes('\n## Decision\n');
    const expectTech = adr.num >= cutoff || shapeExceptions.includes(adr.num);
    if (isTechBody !== expectTech) {
      throw new Error(
        `${adr.file}: sections are ${isTechBody ? 'technology' : 'capability'}` +
        `-shaped, but the range says ${expectTech ? 'technology' : 'capability'}`,
      );
    }
  }
  // Contiguous WITHIN each block; the gap at the cutoff is expected.
  for (const block of [adrs.filter((a) => a.num < cutoff),
                       adrs.filter((a) => a.num >= cutoff)]) {
    block.forEach((adr, i) => {
      if (adr.num !== block[0].num + i) {
        throw new Error(`legacy block not contiguous at ${adr.file}`);
      }
    });
  }
  if (/\|\s*Shape\s*\|/.test(read(root, 'INDEX.md'))) {
    throw new Error('INDEX.md carries a Shape column — not legacy');
  }
  return adrs;
}

// The catalogue has been MIGRATED onto the declared field. `map` is the
// old-to-new number map the migration was confirmed against.
export function assertMigratedToDeclaredShape(root, { map }) {
  const boundary = listBoundaryTemplates(root);
  if (boundary.length) {
    throw new Error(`boundary template not retired: ${boundary.join(', ')}`);
  }
  assertTree(root, ['adr/0000-template.md', 'adr/0000-template-technology.md']);
  const adrs = assertContiguousAdrs(root);
  for (const adr of adrs) {
    const shape = adrShape(root, adr.file);
    if (shape !== 'capability' && shape !== 'technology') {
      throw new Error(`${adr.file}: shape: is "${shape}" — expected capability or technology`);
    }
  }
  for (const [oldNum, newNum] of Object.entries(map)) {
    const moved = adrs.find((a) => a.num === Number(newNum));
    if (!moved) throw new Error(`no ADR at the migrated number ${newNum}`);
    if (adrShape(root, moved.file) !== 'technology') {
      throw new Error(`${moved.file}: a moved ADR must be shape: technology`);
    }
    if (adrs.some((a) => a.num === Number(oldNum))) {
      throw new Error(`ADR ${oldNum} still present at its old number`);
    }
  }
  assertIndexSync(root);
  if (!/\|\s*Shape\s*\|/.test(read(root, 'INDEX.md'))) {
    throw new Error('INDEX.md has no Shape column after migration');
  }
  const conventions = read(root, 'CONVENTIONS.md');
  if (!conventions.includes('shape:')) {
    throw new Error('CONVENTIONS.md §ADR Shapes does not describe the field');
  }
  if (/recorded exception/i.test(conventions)) {
    throw new Error('CONVENTIONS.md still carries the seed exception clause');
  }
  return adrs;
}

// No file still references a renumbered ADR — except plan/done/ footers
// and git history, which the migration deliberately leaves as history.
export function assertReferencesRewritten(root, { map }) {
  const stale = [];
  for (const rel of walk(root)) {
    if (rel.startsWith('plan/done/')) continue;
    if (rel === 'README.md') continue; // the fixture's own notes
    const text = read(root, rel);
    for (const oldNum of Object.keys(map)) {
      const padded = String(oldNum).padStart(4, '0');
      if (new RegExp(`\\b${padded}\\b`).test(text)) stale.push(`${rel} -> ${padded}`);
    }
  }
  if (stale.length) {
    throw new Error(`stale references to renumbered ADRs: ${stale.join(', ')}`);
  }
}

// plan/done/ footers still name the OLD numbers they were written with:
// shipped entries are history, and history is not rewritten. `numbers` is
// the set of pre-migration numbers those footers actually cited.
export function assertHistoryPreserved(root, { numbers }) {
  const dir = join(root, 'plan/done');
  const done = existsSync(dir) ? readdirSync(dir) : [];
  const text = done.map((f) => read(root, `plan/done/${f}`)).join('\n');
  for (const num of numbers) {
    const padded = String(num).padStart(4, '0');
    if (!text.includes(padded)) {
      throw new Error(
        `plan/done/ no longer names the old number ${padded} — history was rewritten`,
      );
    }
  }
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
