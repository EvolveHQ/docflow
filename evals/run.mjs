#!/usr/bin/env node
// Behavioural eval runner (ADR 0012) — SCAFFOLD entry point.
// Runs every eval case and prints a result table. Agent-dependent cases
// report SKIPPED until a headless runner is wired into evals/harness.mjs.
// Exit non-zero only on a real FAIL, so this can gate a release once the
// runner exists without failing today on SKIPPED cases.

import { cases } from './cases.mjs';
import { runCase } from './harness.mjs';

const results = [];
for (const c of cases) results.push(await runCase(c));

const pad = (s, n) => (s + ' '.repeat(n)).slice(0, n);
console.log('docflow behavioural evals\n');
for (const r of results) {
  const tag = { PASS: 'PASS ', FAIL: 'FAIL ', SKIPPED: 'SKIP ' }[r.status];
  console.log(`  ${tag} ${pad(r.name, 56)}${r.reason ? '— ' + r.reason : ''}`);
}

const pass = results.filter((r) => r.status === 'PASS').length;
const fail = results.filter((r) => r.status === 'FAIL').length;
const skip = results.filter((r) => r.status === 'SKIPPED').length;
console.log(`\n${pass} passed, ${fail} failed, ${skip} skipped`);
if (skip) {
  console.log(
    'SKIPPED cases are behavioural (agent-driven) — run them via the ' +
    'Workflow tool: evals/behavioural.workflow.mjs. The runner is a ' +
    'worktree subagent per case (ADR 0012).',
  );
}
process.exit(fail ? 1 : 0);
