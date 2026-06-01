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
