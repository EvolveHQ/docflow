// Eval case definitions (ADR 0012). Each case names a skill, optional
// scripted inputs, and a deterministic `assert(repo)` over the resulting
// state. Cases marked agentDependent require the (not-yet-configured)
// runner and will report SKIPPED until runAgent() is implemented.

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  assertTree, assertContiguousAdrs, assertIndexSync, assertAdrStatus,
  assertPlanShipped, assertAbsent, assertFileContains,
  assertLegacyRange, assertMigratedToDeclaredShape,
  assertReferencesRewritten, assertHistoryPreserved,
} from './assertions.mjs';

const evalsDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(evalsDir, '..');

// The range-numbered fixture and the migration it is expected to take:
// capability 0001-0003 keep their numbers, technology 0101/0102 move onto
// the end of the sequence in their original order. 0001 is the seed —
// technology-shaped inside the capability range — and does NOT move.
const legacyFixture = join(evalsDir, 'fixtures/legacy-range');
const LEGACY_CUTOFF = 100;
const LEGACY_MAP = { '0101': '0004', '0102': '0005' };
const LEGACY_DONE_NUMBERS = ['0101'];

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
    // Runs NOW. Guards the fixture itself: if it ever stops being a
    // range-numbered catalogue, the migration case below is testing
    // nothing. No agent needed — the fixture is checked-in state.
    name: 'self-check: the legacy-range fixture is still range-numbered',
    skill: null,
    agentDependent: false,
    repo: legacyFixture,
    assert(repo) {
      assertTree(repo, [
        'CONVENTIONS.md', 'AGENTS.md', 'INDEX.md',
        'adr/0000-template.md', 'adr/0100-template.md',
        'adr/0001-record-architecture-decisions.md',
        'adr/0101-markdown-files-in-git.md',
        'domains/platform/README.md', 'plan/todo', 'plan/done',
      ]);
      assertAbsent(repo, ['adr/0000-template-technology.md']);
      // Cutoff recorded, boundary template present, no shape: fields, no
      // Shape column, contiguous within each block, the seed excepted.
      assertLegacyRange(repo, { cutoff: LEGACY_CUTOFF, shapeExceptions: [1] });
      // References run both ways across the boundary.
      assertFileContains(repo, 'adr/0003-queue-driven-implementation.md',
        'adr/0101-markdown-files-in-git.md');
      assertFileContains(repo, 'adr/0101-markdown-files-in-git.md',
        'adr/0002-searchable-decision-catalogue.md');
      assertFileContains(repo, 'plan/todo/0001-verify-script-coverage.md',
        'adr/0102-static-verify-script.md');
    },
  },
  {
    // Detection, the offer, the migration, and the post-migration audit.
    // The subagent works on a COPY of the fixture (see the behavioural
    // workflow); `repo` is that copy's path at assert time.
    name: 'audit: legacy range detected, migration offered and applied',
    skill: 'audit',
    inputs: { fixture: 'evals/fixtures/legacy-range', confirm: 'yes' },
    assert(repo) {
      // AC4/AC5/AC6/AC7: renumbered in order, field on every ADR, boundary
      // template retired, conventions rewritten, INDEX with Shape column.
      assertMigratedToDeclaredShape(repo, { map: LEGACY_MAP });
      // AC5: every in-catalogue reference followed the renumbering...
      assertReferencesRewritten(repo, { map: LEGACY_MAP });
      // ...and plan/done footers did not.
      assertHistoryPreserved(repo, { numbers: LEGACY_DONE_NUMBERS });
      // The seed keeps its number and declares the shape it always had.
      assertFileContains(repo, 'adr/0001-record-architecture-decisions.md',
        'shape: technology');
      assertPlanShipped(repo, 'adopt-the-method');
    },
  },
  {
    // Full depth, single writer, a real verify gate recorded: the
    // coordination directory holds the run prompt and nothing else — no
    // roles list (there is one writer), no lock ledger, and none of the
    // derived files the former scaffold wrote.
    name: 'bootstrap: fresh repo gets the full scaffold',
    skill: 'bootstrap',
    inputs: { /* the 10 assessment answers, scripted */ },
    assert(repo) {
      assertTree(repo, [
        'AGENTS.md', 'CLAUDE.md', 'CONVENTIONS.md', 'INDEX.md',
        'adr/0000-template.md', 'plan/todo', 'plan/done',
        '_agent/prompts/autonomous.md',
      ]);
      assertAbsent(repo, [
        '_agent/ROLES.md', '_agent/LOCKS.md', '_agent/WORKLOG.md',
        '_agent/CURRENT_FOCUS.md', '_agent/IN_FLIGHT.md',
        '_agent/HANDOFF.md',
      ]);
      // The read order lives in AGENTS.md, not a hand-off file.
      assertFileContains(repo, 'AGENTS.md', 'Picking up this repo');
    },
  },
  {
    name: 'bootstrap: express depth scaffolds the fixed minimal profile',
    skill: 'bootstrap',
    inputs: { depth: 'express', name: 'scratch-express', description: 'eval fixture' },
    assert(repo) {
      // Entry points at the root; artefacts under the default root.
      assertTree(repo, [
        'AGENTS.md', 'CLAUDE.md',
        '.docflow/CONVENTIONS.md', '.docflow/INDEX.md',
        '.docflow/adr/0000-template.md',
        '.docflow/adr/0001-record-architecture-decisions.md',
      ]);
      // Optional layers stay off in the express profile.
      assertAbsent(repo, [
        '.docflow/plan', 'plan', '_agent', '.docflow/GLOSSARY.md',
        'GLOSSARY.md', '.docflow/domains', 'domains',
        '.docflow/federation.md', 'federation.md',
      ]);
      assertFileContains(repo, '.docflow/CONVENTIONS.md', 'Assessment depth: express');
      assertFileContains(repo, '.docflow/CONVENTIONS.md', 'fast-forward');
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
