#!/usr/bin/env node
// Evidence executor (ADR 0035) — the ship-item Step 2b tool. Writes
// bound evidence records for one AC-bearing record from a spec file,
// replacing the per-ship scratch scripts that duplicated this logic.
//
// Usage: node scripts/evidence.mjs <spec.json>
//   spec.json: {
//     "slug": "0042-example",          // record under adr/
//     "sourceSha": "abc1234",          // the commit the run verifies
//     "date": "YYYY-MM-DD",
//     "gateAcs": [2, 6],               // ACs evidenced by the gate run
//     "manual": {                       // operator-attested ACs
//       "1": "scope text …", "3": "scope text …"
//     },
//     "manualVerifier": "human: Name", // REQUIRED if manual non-empty;
//                                       // must not be the implementer
//     "manualNote": "batch attestation …"  // optional body preamble
//   }
//
// Digest logic mirrors scripts/verify.mjs check G. Drift between the
// two is fail-safe: check G recomputes digests on every run, so a
// mismatch surfaces as a gate FAIL at the next verify — the gate wins.

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => readFileSync(join(root, rel), 'utf8').replace(/\r\n/g, '\n');
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

const specPath = process.argv[2];
if (!specPath) {
  console.error('usage: node scripts/evidence.mjs <spec.json>');
  process.exit(2);
}
const spec = JSON.parse(readFileSync(specPath, 'utf8'));
const { slug, sourceSha, date } = spec;
const gateAcs = new Set(spec.gateAcs ?? []);
const manual = spec.manual ?? {};
if (!slug || !sourceSha || !date) {
  console.error('spec.json needs slug, sourceSha, date');
  process.exit(2);
}
if (Object.keys(manual).length && !spec.manualVerifier) {
  console.error('manual ACs present but no manualVerifier named — refusing (attestation required, verifier != implementer)');
  process.exit(2);
}

const body = read(`adr/${slug}.md`).match(/^---\n[\s\S]*?\n---\n?([\s\S]*)$/)?.[1];
if (!body) { console.error(`adr/${slug}.md: no frontmatter/body`); process.exit(1); }
const criteria = criteriaOf(body);

// Every criterion must be covered by exactly one route.
const covered = new Set([...gateAcs, ...Object.keys(manual).map(Number)]);
const missing = criteria.map((_, i) => i + 1).filter((n) => !covered.has(n));
if (missing.length) {
  console.error(`uncovered criteria (stay unevidenced, record will not reach Implemented): AC${missing.join(', AC')}`);
}

// Gate transcript for gate-check records.
let gateOut, gateExit = 0;
try {
  gateOut = execSync('node scripts/verify.mjs', { cwd: root, encoding: 'utf8' });
} catch (e) { gateOut = String(e.stdout ?? ''); gateExit = e.status ?? 1; }
const gateDigest = digest(gateOut);

const dir = join(root, 'evidence', slug);
mkdirSync(dir, { recursive: true });
const nextSeq = (n) => {
  const existing = existsSync(dir)
    ? readdirSync(dir).map((f) => f.match(new RegExp(`^AC${n}-(\\d{3})\\.md$`))?.[1]).filter(Boolean)
    : [];
  return String(Math.max(0, ...existing.map(Number)) + 1).padStart(3, '0');
};

for (const n of [...covered].sort((a, b) => a - b)) {
  if (!criteria[n - 1]) { console.error(`AC${n}: no such criterion — skipped`); continue; }
  const isGate = gateAcs.has(n);
  const file = `AC${n}-${nextSeq(n)}.md`;
  writeFileSync(join(dir, file), [
    '---',
    `ac: ${slug}#AC${n}`,
    `ac-digest: ${digest(criteria[n - 1])}`,
    `method: ${isGate ? 'gate-check' : 'manual'}`,
    `command: ${isGate ? 'node scripts/verify.mjs' : 'n/a (manual attestation)'}`,
    `source-sha: ${sourceSha}`,
    `exit-code: ${isGate ? gateExit : 0}`,
    `output-digest: ${isGate ? gateDigest : 'n/a (manual attestation)'}`,
    `verifier: ${isGate ? 'gate@ship-item' : spec.manualVerifier}`,
    `date: ${date}`,
    'supersedes:',
    '---',
    '',
    isGate
      ? `Static gate run at ship time (exit ${gateExit}).`
      : `Attested by ${spec.manualVerifier.replace(/^human:\s*/, '')} (not the implementer) on ${date}${spec.manualNote ? `, ${spec.manualNote}` : ''}. Scope: ${manual[n]}`,
    '',
  ].join('\n'));
  console.log(`${file}  ${isGate ? 'gate-check' : 'manual'}`);
}
console.log(`gate exit ${gateExit}`);
