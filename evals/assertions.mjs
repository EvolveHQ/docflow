// Deterministic assertion helpers for behavioural evals (ADR 0012).
// No network, no model — these inspect a repository's state after a skill
// has run. Each assert* throws an Error on failure and returns nothing on
// success. CRLF-tolerant so the same checks pass on Windows checkouts.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
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

// A recorded command actually runs in the repo and exits 0. A scaffolded
// repo's verify gate has to be runnable THERE — a gate naming a script the
// scaffolded repo does not contain records a string nobody can execute.
export function assertCommandSucceeds(root, command) {
  try {
    execSync(command, { cwd: root, stdio: 'pipe' });
  } catch (e) {
    const out = [e.stdout, e.stderr]
      .map((b) => (b ? b.toString().trim() : ''))
      .filter(Boolean)
      .join(' / ');
    throw new Error(
      `"${command}" failed in ${root} (exit ${e.status})${out ? ': ' + out : ''}`,
    );
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

function assertSectionOrder(body, file, technology) {
  const sections = ['Context', ...(technology
    ? ['Decision', 'Rationale', 'Consequences']
    : ['Capability statement', 'User stories / scenarios']),
    'Acceptance criteria', 'Out of scope', 'Open questions', 'References',
    'Revision History', 'Approvals'];
  const headings = [...body.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
  let previous = -1;
  for (const section of sections) {
    const position = headings.indexOf(section);
    if (position <= previous) throw new Error(`${file}: missing or out-of-order section ${section}`);
    previous = position;
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
    assertSectionOrder(body, adr.file, expectTech);
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
    assertSectionOrder(read(root, `adr/${adr.file}`), adr.file, shape === 'technology');
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

// ── Glossary structure ──────────────────────────────────────────────
//
// Canonical shape: an optional H1 heading and optional introductory prose,
// then exactly one two-column Markdown table whose header is
// `Term | Definition`, every entry its own row. Terms are never recorded as
// headings, bullets or paragraphs, and there is never a second table. This
// is a bounded line reader, not a general Markdown parser.

const stripGlossaryBlocks = (text) => text
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/```[\s\S]*?```/g, '')
  .replace(/~~~[\s\S]*?~~~/g, '');

const isTableLine = (line) => /^\s*\|.*\|\s*$/.test(line);
const isBulletLine = (line) => /^\s*(?:[-*+]|\d+\.)\s+\S/.test(line);
const isHeadingLine = (line) => /^#{1,6}\s+\S/.test(line);
const splitGlossaryRow = (line) =>
  line.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/);
const isDelimiterRow = (cells) =>
  cells.length === 2 && cells.every((c) => /^:?-+:?$/.test(c));

// The visible term behind a preserved cell. Migration anchors are
// presentation, not identity, so `<a id="alpha"></a>Alpha` and `Alpha`
// name the same term and collide.
const visibleTerm = (cell) => cell
  .replace(/<a\s+id="[^"]+"\s*><\/a>/g, '')
  .replace(/[`*_~]/g, '')
  .trim();

// Classify a glossary's entry structure without rewriting it. Returns
// issues as a set of shape names; `canonical` is true only for the single
// optional-heading/prose + one `Term | Definition`-table form, with a
// well-formed contiguous table.
export function classifyGlossary(text) {
  const clean = stripGlossaryBlocks(text.replace(/\r\n/g, '\n'));
  const lines = clean.split('\n');
  const issues = new Set();

  // Maximal contiguous runs of table lines. Any other line — including a
  // blank line — breaks a run, so a table split by a blank line registers
  // as two tables rather than one.
  const tables = [];
  let current = null;
  for (const line of lines) {
    if (isTableLine(line)) {
      if (!current) { current = []; tables.push(current); }
      current.push(line);
    } else {
      current = null;
    }
  }

  // Heading shape: at most one H1, no other heading level, and it must be
  // the first non-empty content. A heading after the table is an entry
  // outside the table, not a title.
  const content = lines.filter((l) => l.trim());
  const headings = content.filter(isHeadingLine);
  const firstIsTopH1 = isHeadingLine(content[0] || '') && /^#\s+/.test(content[0]);
  if (headings.length > 1 || (headings.length === 1 && !firstIsTopH1)
      || headings.some((h) => !/^#\s+/.test(h))) {
    issues.add('headings');
  }

  if (tables.length > 1) issues.add('multiple-tables');
  if (content.some(isBulletLine)) issues.add('bullets');

  // Optional introductory prose is allowed before the table; prose with no
  // table, or prose after the table, is an entry outside the shape.
  const tableLineCount = tables.reduce((n, t) => n + t.length, 0);
  const proseLines = content.filter((l) => !isTableLine(l) && !isHeadingLine(l) && !isBulletLine(l));
  if (proseLines.length && tableLineCount === 0) issues.add('prose');
  const lastTable = content.map(isTableLine).lastIndexOf(true);
  if (lastTable !== -1
      && content.slice(lastTable + 1).some((l) => !isHeadingLine(l) && !isBulletLine(l))) {
    issues.add('prose');
  }

  const entries = [], duplicates = [];
  let emptyRow = false;
  if (tables.length) {
    const rows = tables[0];
    // Header, then a delimiter row, then data rows: every row splits into
    // exactly two cells. A missing delimiter, a three-cell row or a
    // malformed header is a structural failure, never canonical.
    const split = rows.map(splitGlossaryRow);
    const header = (split[0] || []).map((c) => c.trim().toLowerCase());
    if (!(header.length === 2 && header[0] === 'term' && header[1] === 'definition')) {
      issues.add('header');
    }
    if (!isDelimiterRow((split[1] || []).map((c) => c.trim()))) issues.add('delimiter');
    if (split.some((cells) => cells.length !== 2)) issues.add('row-arity');
    const seen = new Set();
    for (let i = 2; i < rows.length; i += 1) {
      const cells = split[i];
      if (cells.length !== 2) { emptyRow = true; continue; }
      const term = cells[0].trim();
      const definition = cells[1].trim();
      if (!term || !definition) { emptyRow = true; continue; }
      entries.push({ term, definition });
      const key = visibleTerm(term).toLowerCase();
      if (seen.has(key)) duplicates.push(visibleTerm(term));
      seen.add(key);
    }
  }
  if (emptyRow) issues.add('empty-row');

  return {
    present: true,
    canonical: issues.size === 0 && tables.length === 1,
    issues: [...issues],
    tables: tables.length,
    entries,
    duplicates,
  };
}

// Read and classify a glossary. An absent file is valid and canonical-by-
// omission; it must never be created to satisfy a check.
export function glossaryShape(root, file = 'GLOSSARY.md') {
  if (!existsSync(join(root, file))) {
    return { present: false, canonical: true, issues: [], tables: 0, entries: [], duplicates: [] };
  }
  return classifyGlossary(read(root, file));
}

// Absence passes; a present file must be the single canonical table with no
// duplicate terms. Duplicates are flagged for user resolution, never merged.
export function assertCanonicalGlossary(root, file = 'GLOSSARY.md') {
  const shape = glossaryShape(root, file);
  if (!shape.present) return shape;
  if (!shape.canonical) {
    throw new Error(
      `${file}: non-canonical glossary structure (${shape.issues.join(', ') || 'not a single Term | Definition table'})`,
    );
  }
  if (shape.duplicates.length) {
    throw new Error(`${file}: duplicate terms need resolution: ${[...new Set(shape.duplicates)].join(', ')}`);
  }
  return shape;
}

// The heading anchors a glossary exposes to incoming links: the GitHub-style
// slug of every heading below the optional H1 title, kept verbatim rather than
// recomputed, so a migration can preserve the targets other files link to.
const slugifyHeading = (text) => text.toLowerCase()
  .replace(/[`*_~[\]#!]/g, '')
  .replace(/[^a-z0-9\s-]/g, '')
  .trim()
  .replace(/\s+/g, '-');

export function glossaryHeadingAnchors(text) {
  const clean = stripGlossaryBlocks(text.replace(/\r\n/g, '\n'));
  const content = clean.split('\n').filter((l) => l.trim());
  const headings = content
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => isHeadingLine(line));
  const anchors = [];
  headings.forEach(({ line, index }, i) => {
    const level = line.match(/^(#+)/)[1].length;
    const slug = slugifyHeading(line.replace(/^#+\s+/, ''));
    const isFirst = index === 0 && i === 0;
    // The optional document title is the first heading, an H1 at the very
    // top, only when it is the explicit canonical `# Glossary` title.
    // A following heading says nothing about whether the first H1 is a term.
    // Preserve all other first-heading targets, including ambiguous titles.
    if (isFirst && level === 1 && slug === 'glossary') return;
    anchors.push(slug);
  });
  return anchors;
}

// Bounded migration form: explicit anchors lead the term cell. Do not count
// examples inside inline code, comments, fences, definitions or other prose
// as live row targets. Other forms need an explicit fixture contract.
function explicitAnchors(text) {
  return classifyGlossary(text).entries.flatMap(({ term }) => {
    const prefix = term.match(/^(?:<a\s+id="[^"]+"\s*><\/a>\s*)+/)?.[0] || '';
    return [...prefix.matchAll(/<a\s+id="([^"]+)"\s*><\/a>/g)].map((m) => m[1]);
  });
}

// A migration is lossless only if every heading anchor the original glossary
// exposed still resolves in the result — by an explicit anchor or a retained
// heading. Dropping the heading while keeping only the link text is a loss.
export function assertGlossaryAnchorsPreserved(before, after) {
  const wanted = [...new Set(glossaryHeadingAnchors(before))];
  const retained = new Set([...explicitAnchors(after), ...glossaryHeadingAnchors(after)]);
  const missing = wanted.filter((anchor) => !retained.has(anchor));
  if (missing.length) {
    throw new Error(`glossary migration dropped heading anchors: ${missing.join(', ')}`);
  }
}

// The glossary rule a repository actually records in CONVENTIONS.md. The
// presence of a §Glossary section is not adoption of the canonical table
// shape: it can record an older or unrelated glossary convention. Only a
// section that names the two-column `Term` / `Definition` table counts as
// canonical.
export function glossaryDeclaredRule(conventionsText) {
  const clean = stripGlossaryBlocks(conventionsText.replace(/\r\n/g, '\n'));
  const section = clean.match(/^##\s+Glossary\s*$([\s\S]*?)(?=^##\s|$(?![\s\S]))/m);
  if (!section) return { declared: false, canonical: false, text: null };
  const body = section[1];
  const canonical = /two-column/i.test(body) && /Term/.test(body) && /Definition/.test(body);
  return { declared: true, canonical, text: body.trim() };
}

// How a repository relates to the canonical glossary shape. A non-canonical
// file under an older declared rule is not drift against the canonical table
// the repo never adopted: the rule and the file migrate together under one
// separate consent.
export function classifyGlossaryAdoption(conventionsText, glossaryText) {
  const shape = classifyGlossary(glossaryText);
  const rule = glossaryDeclaredRule(conventionsText);
  if (shape.present && shape.duplicates.length) {
    return { status: 'duplicate', shape, rule, duplicates: shape.duplicates };
  }
  if (shape.canonical) return { status: 'canonical', shape, rule };
  if (!rule.declared) return { status: 'migration-available', shape, rule };
  if (rule.canonical) return { status: 'drift', shape, rule };
  return { status: 'rule-migration-available', shape, rule };
}

// An ordered, complete comparison of a migrated glossary against an explicit
// expected mapping: every term and definition must match verbatim and in
// order. The complete approved artifact also fixes every prose word and its
// position, including title, links, code and anchors. There is deliberately no
// fragment whitelist or semantic Markdown equivalence: only CRLF/LF transport
// differences are allowed. Callers must supply the exact artifact to the host.
export function assertGlossaryLossless(afterText, expected) {
  const shape = classifyGlossary(afterText);
  if (!shape.canonical) {
    throw new Error(`migrated glossary is not canonical: ${shape.issues.join(', ') || 'no single table'}`);
  }
  if (shape.duplicates.length) {
    throw new Error(`migrated glossary repeats terms: ${[...new Set(shape.duplicates)].join(', ')}`);
  }
  if (shape.entries.length !== expected.entries.length) {
    throw new Error(
      `migrated glossary has ${shape.entries.length} entries, expected ${expected.entries.length}`,
    );
  }
  shape.entries.forEach((entry, i) => {
    const want = expected.entries[i];
    if (entry.term !== want.term || entry.definition !== want.definition) {
      throw new Error(
        `entry ${i + 1} changed: got ${JSON.stringify(entry)}, expected ${JSON.stringify(want)}`,
      );
    }
  });
  if (typeof expected.artifact !== 'string') {
    throw new Error('lossless check requires a complete expected artifact');
  }
  if (afterText.replace(/\r\n/g, '\n') !== expected.artifact.replace(/\r\n/g, '\n')) {
    throw new Error('glossary differs from complete approved artifact (prose, structure or content)');
  }
  return shape;
}
