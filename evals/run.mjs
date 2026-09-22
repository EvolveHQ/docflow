#!/usr/bin/env node
// Behavioural eval runner (ADR 0012) — SCAFFOLD entry point.
// Runs every eval case and prints a result table. Agent-dependent cases
// report SKIPPED until a headless runner is wired into evals/harness.mjs.
// Exit non-zero only on a real FAIL, so this can gate a release once the
// runner exists without failing today on SKIPPED cases.

import { cases } from './cases.mjs';
import { runCase } from './harness.mjs';

// Opt-in native-host tier (ADR 0062). The static gate stays fast and hostless;
// `node evals/run.mjs --qualify [qualify args]` runs the executable host matrix.
if (process.argv.includes('--qualify')) {
  const { spawnSync } = await import('node:child_process');
  const passthrough = process.argv.slice(2).filter((a) => a !== '--qualify');
  const qualify = new URL('./hosts/qualify.mjs', import.meta.url).pathname;
  const r = spawnSync(process.execPath, [qualify, ...passthrough], { stdio: 'inherit' });
  process.exit(r.status ?? 1);
}

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
console.log(
  'This deterministic suite is hostless. Native host qualification ' +
  '(discovery, install byte-match, authority matrix, mandate, recovery, ' +
  'scope, dispatch, sync and the bootstrap/new-plan/ship regressions) runs ' +
  'as the opt-in tier: `node evals/run.mjs --qualify` (ADR 0062).',
);
process.exit(fail ? 1 : 0);
