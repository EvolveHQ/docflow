#!/usr/bin/env node
// Fixture-local verify gate for the bootstrap behavioural eval.
//
// The bootstrap case scaffolds a fresh scratch repo, and Q8 has to be
// answered with a command that ACTUALLY RUNS THERE. Pointing it at this
// checkout's `scripts/verify.mjs` would record a gate the scaffolded repo
// cannot execute (MODULE_NOT_FOUND, exit 1), so the case copies this file
// into the scratch repo as `tools/verify.mjs` BEFORE invoking bootstrap and
// records `node tools/verify.mjs` as the gate.
//
// Node built-ins only, no dependencies, no network. Run from the repo root:
// exit 0 on a sane bootstrapped tree, exit 1 with one line per problem.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const problems = [];
const has = (rel) => existsSync(join(root, rel));
const read = (rel) => readFileSync(join(root, rel), 'utf8');

for (const rel of ['AGENTS.md', 'CONVENTIONS.md', 'INDEX.md', 'adr']) {
  if (!has(rel)) problems.push(`${rel} missing`);
}

if (has('adr')) {
  const adrs = readdirSync(join(root, 'adr'))
    .filter((f) => /^\d{4}-.+\.md$/.test(f) && !f.startsWith('0000-'))
    .sort();
  const hasIndex = has('INDEX.md');
  const index = hasIndex ? read('INDEX.md') : '';
  for (const file of adrs) {
    const body = read(join('adr', file));
    for (const field of ['adr:', 'title:', 'status:']) {
      if (!body.includes(field)) {
        problems.push(`adr/${file}: metadata block has no ${field}`);
      }
    }
    // An INDEX.md that exists but is empty is still a missing row, not a
    // reason to skip the check; only an absent file gets the diagnostic above.
    if (hasIndex && !index.includes(file.slice(0, 4))) {
      problems.push(`INDEX.md has no row for adr/${file}`);
    }
  }
}

if (problems.length) {
  for (const p of problems) console.error(`verify: ${p}`);
  process.exit(1);
}
console.log('verify: OK (fixture gate)');
