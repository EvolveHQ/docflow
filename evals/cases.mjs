// Eval case definitions (ADR 0012). Each case names a skill, optional
// scripted inputs, and a deterministic `assert(repo)` over the resulting
// state. This suite is deterministic and hostless.
//
// The six agent-dependent cases that used to report SKIPPED here are retired
// to the opt-in native-host qualification harness (ADR 0062):
// evals/hosts/qualify.mjs now owns bootstrap full/express, new-plan,
// ship-item and the two audit migrations as `skill` cases, and the authority
// matrix, mandate, recovery and scope assertions as `product` cases.

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { assertStatusReports } from './reporting.mjs';
import { assertClaimAcquisition } from './claim-race.mjs';
import { assertClaimCleanupContract } from './claim-cleanup.mjs';
import {
  assertTree, assertContiguousAdrs, assertIndexSync, assertAdrStatus,
  assertPlanShipped, assertAbsent, assertFileContains, assertCommandSucceeds,
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

// A verify gate the SCAFFOLDED repo can run: node built-ins only, exit 0
// on a sane bootstrapped tree. The bootstrap case copies it in as
// tools/verify.mjs before invoking the skill and records
// `node tools/verify.mjs` as the Q8 answer.
const gateFixture = join(evalsDir, 'fixtures/scratch-gate/verify.mjs');
const LEGACY_CUTOFF = 100;
const LEGACY_MAP = { '0101': '0004', '0102': '0005' };
const LEGACY_DONE_NUMBERS = ['0101'];

export const cases = [
  {
    name: 'repository producer: source renders and native compatibility',
    skill: null,
    agentDependent: false,
    assert() {
      const result = spawnSync(process.execPath, ['--test', join(evalsDir, 'repository-producer.test.mjs')], { encoding: 'utf8', timeout: 120000 });
      assert.equal(result.status, 0, result.error?.message || result.stdout + result.stderr);
    },
  },
  {
    name: 'workspace history: local objects and environment isolation',
    skill: null,
    agentDependent: false,
    assert() {
      const result = spawnSync(process.execPath, ['--test', join(evalsDir, 'workspace-history.test.mjs')], { encoding: 'utf8', timeout: 120000 });
      assert.equal(result.status, 0, result.error?.message || result.stdout + result.stderr);
    },
  },
  {
    name: 'workspace skills: packaged discovery and declarative contracts',
    skill: null,
    agentDependent: false,
    assert() {
      const result = spawnSync(process.execPath, ['--test', join(evalsDir, 'workspace-skills.test.mjs')], { encoding: 'utf8', timeout: 120000 });
      assert.equal(result.status, 0, result.error?.message || result.stdout + result.stderr);
    },
  },
  {
    name: 'workspace: real validator, adverse inputs and portable assets',
    skill: null,
    agentDependent: false,
    assert() {
      const result = spawnSync(process.execPath, ['--test', join(evalsDir, 'workspace.test.mjs')], { encoding: 'utf8', timeout: 120000 });
      assert.equal(result.status, 0, result.error?.message || result.stdout + result.stderr);
    },
  },
  {
    name: 'workspace contract r2: external sources, remote members, revisions, documents, imports',
    skill: null,
    agentDependent: false,
    assert() {
      const result = spawnSync(process.execPath, ['--test', join(evalsDir, 'workspace-contract-r2.test.mjs')], { encoding: 'utf8', timeout: 120000 });
      assert.equal(result.status, 0, result.error?.message || result.stdout + result.stderr);
    },
  },
  {
    name: 'reports: missing blocks and invalid overall verdicts fail',
    skill: null,
    agentDependent: false,
    assert() {
      const valid = '## Status at a glance\n\n- **This run:** gate exit 0.\n- **Overall:** partially verified.\n- **Yet to do:** integration.\n';
      assertStatusReports(valid);
      assert.throws(() => assertStatusReports('Everything passed'));
      assert.throws(() => assertStatusReports(valid, 3));
      assert.throws(() => assertStatusReports(valid.replace('partially verified', 'pass')));
      assert.throws(() => assertStatusReports(valid.replace('Yet to do:', 'Later:')));
    },
  },
  {
    name: 'claims: prompts preserve the verified cleanup source',
    skill: null,
    agentDependent: false,
    assert: assertClaimCleanupContract,
  },
  {
    name: 'claims: create-only push excludes same-tip, descendant and concurrent claimants',
    skill: null,
    agentDependent: false,
    assert: assertClaimAcquisition,
  },
  {
    name: 'self-check: legacy coordination fixture retains migration evidence',
    skill: null,
    agentDependent: false,
    repo: join(evalsDir, 'fixtures/legacy-coordination'),
    assert(repo) {
      assertTree(repo, ['.docflow/_agent/WORKLOG.md', '.docflow/_agent/HANDOFF.md',
        '.docflow/_agent/LOCKS.md', '.docflow/plan/todo/0001-example.md']);
      assertFileContains(repo, '.docflow/_agent/IN_FLIGHT.md', 'claim/0001-example');
      assertFileContains(repo, '.docflow/_agent/IN_FLIGHT.md', 'claim/0002-abandoned');
      assertFileContains(repo, '.docflow/_agent/IN_FLIGHT.md', 'Awaiting fixture data');
      assertFileContains(repo, '.docflow/_agent/CURRENT_FOCUS.md', 'Queue empty');
      assertFileContains(repo, '.gitattributes', 'merge=union');
      assertFileContains(repo, '.gitignore', '.docflow/_agent/CURRENT_FOCUS.md');
      assertCommandSucceeds(repo, 'node tools/verify.mjs');
    },
  },
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
        'scripts/verify.mjs',
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
];
