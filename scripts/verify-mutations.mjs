// Exercise new gate boundaries in a disposable copy; never alter this checkout.
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const source = join(dirname(fileURLToPath(import.meta.url)), '..');
const scratch = mkdtempSync(join(tmpdir(), 'docflow-gate-'));
let count = 0;
try {
  cpSync(source, scratch, { recursive: true,
    filter: p => !['.git', 'node_modules'].includes(basename(p)) });
  function gate() {
    const r = spawnSync(process.execPath, ['scripts/verify.mjs'], {cwd: scratch, encoding:'utf8'});
    if (r.error) throw r.error;
    return r;
  }
  if (gate().status !== 0) throw Error('Unmutated gate must pass');
  function mutate(rel, update, expected, create = false) {
    const path = join(scratch, rel);
    const original = create ? null : readFileSync(path, 'utf8');
    try {
      writeFileSync(path, update(original));
      const result = gate();
      if (result.status !== 1 || !result.stderr.includes(expected)) {
        throw Error(`Mutation not rejected: ${rel}; ${result.stderr}`);
      }
      count++;
    } finally {
      if (create) rmSync(path); else writeFileSync(path, original);
    }
  }
  const skill = 'plugins/docflow/skills/audit/SKILL.md';
  for (const token of ['AskUserQuestion','isolation: worktree','/schedule','Workflow(', 'ultracode','$bootstrap']) {
    mutate(skill, s => s + '\n' + token + '\n', 'host-specific token');
  }
  const sidecar = 'plugins/docflow/skills/audit/agents/openai.yaml';
  mutate(sidecar, s => s + '\n# adr/0001-adr-driven-workflow\n', 'references real catalogue ADR');
  mutate(sidecar, s => s.replace('docflow: audit','docflow: unrelated'), 'display name');
  mutate(skill, s => s.replace('**Yet to do:**','**Later:**'), 'closing-report contract');
  mutate(skill, s => s.replace('Routine progress messages need no block.', 'Different rule.'), 'closing-report contract differs');
  for (const ext of ['sh','mjs','py','ps1']) {
    mutate(`plugins/docflow/skills/audit/execute.${ext}`, () => 'run()', 'declarative text only', true);
  }
  mutate(sidecar, s => '#!/usr/bin/env python\n'+s, 'declarative text only');
  if (gate().status !== 0) throw Error('Restored gate must pass');
  console.log(`verify mutations: OK (${count} rejected mutations)`);
} finally { rmSync(scratch, {recursive:true, force:true}); }
