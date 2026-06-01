// Eval case definitions (ADR 0012). Each case names a skill, optional
// scripted inputs, and a deterministic `assert(repo)` over the resulting
// state. Cases marked agentDependent require the (not-yet-configured)
// runner and will report SKIPPED until runAgent() is implemented.

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  assertTree, assertContiguousAdrs, assertIndexSync, assertAdrStatus,
  assertPlanShipped,
} from './assertions.mjs';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

export const cases = [
  {
    // Runs NOW. This repo is a valid bootstrapped fixture, so the
    // deterministic assertion layer is exercised end-to-end without an
    // agent — proving the helpers work before a runner is wired.
    name: 'self-check: docflow repo satisfies its own invariants',
    skill: null,
    agentDependent: false,
    repo: repoRoot,
    assert(repo) {
      assertTree(repo, [
        'AGENTS.md', 'CONVENTIONS.md', 'INDEX.md',
        'adr/0000-template.md', 'plan/todo', 'plan/done',
        '_agent/ROLES.md', 'scripts/verify.mjs',
      ]);
      assertContiguousAdrs(repo);
      assertIndexSync(repo);
    },
  },
  {
    name: 'bootstrap: fresh repo gets the full scaffold',
    skill: 'bootstrap',
    inputs: { /* the 10 assessment answers, scripted */ },
    assert(repo) {
      assertTree(repo, [
        'AGENTS.md', 'CLAUDE.md', 'CONVENTIONS.md', 'INDEX.md',
        'adr/0000-template.md', 'plan/todo', 'plan/done', '_agent/ROLES.md',
      ]);
    },
  },
  {
    name: 'new-adr: next contiguous number, INDEX regenerated',
    skill: 'new-adr',
    inputs: { title: 'Example decision' },
    assert(repo) {
      assertContiguousAdrs(repo);
      assertIndexSync(repo);
    },
  },
  {
    name: 'ship-item: todo→done and owning ADR → Implemented',
    skill: 'ship-item',
    inputs: { item: '0001-example' },
    assert(repo) {
      assertPlanShipped(repo, 'example');
      assertAdrStatus(repo, 1, 'Implemented');
    },
  },
];
