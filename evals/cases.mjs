// Eval case definitions (ADR 0012). Each case names a skill, optional
// scripted inputs, and a deterministic `assert(repo)` over the resulting
// state. Cases marked agentDependent require the (not-yet-configured)
// runner and will report SKIPPED until runAgent() is implemented.

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  assertTree, assertContiguousAdrs, assertIndexSync, assertAdrStatus,
  assertPlanShipped, assertAbsent, assertFileContains, assertFileLacks,
  assertManifest, assertEvidenceBacked, assertConstraints,
} from './assertions.mjs';
import { assertGateFails, assertGateGreen } from './mutations.mjs';

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
    // ── Record contract (S0) ──
    name: 'self-check: capability manifest declares the repo shape',
    skill: null,
    agentDependent: false,
    repo: repoRoot,
    assert(repo) {
      assertManifest(repo, {
        schema: 1, model: 'capability-first',
        layers: ['plan', 'agent', 'constraints'],
      });
      assertFileContains(repo, 'CONVENTIONS.md', '## Trust Posture');
      assertFileContains(repo, 'plugins/docflow/skills/bootstrap/templates/CONVENTIONS.md', '## Trust Posture');
      assertFileContains(repo, 'USAGE.md', 'Trust posture and hardening');
    },
  },
  {
    // ── Evidence (S1) ──
    name: 'self-check: evidenced ADRs are backed — digests match, results valid',
    skill: null,
    agentDependent: false,
    repo: repoRoot,
    assert(repo) {
      assertEvidenceBacked(repo, '0035-per-criterion-evidence');
      assertEvidenceBacked(repo, '0036-enumerated-constraints');
      assertEvidenceBacked(repo, '0037-recorded-abandonment');
    },
  },
  {
    name: 'self-check: Verify: method rule installed, escape hatch retired',
    skill: null,
    agentDependent: false,
    repo: repoRoot,
    assert(repo) {
      assertFileContains(repo, 'CONVENTIONS.md', '## Verification Evidence');
      assertFileContains(repo, 'plugins/docflow/skills/bootstrap/templates/CONVENTIONS.md', '## Verification Evidence');
      assertFileContains(repo, 'plugins/docflow/skills/bootstrap/templates/adr-capability.md', 'Verify: <command | gate-check | manual>');
      assertFileLacks(repo, 'plugins/docflow/skills/bootstrap/SKILL.md', 'where practical');
      assertFileLacks(repo, 'plugins/docflow/skills/bootstrap/templates/AGENTS.md', 'where practical');
    },
  },
  {
    // ── Constraints (S2) ──
    name: 'self-check: CON-1..6 valid, decision-gated, template shipped',
    skill: null,
    agentDependent: false,
    repo: repoRoot,
    assert(repo) {
      assertConstraints(repo, ['CON-1', 'CON-2', 'CON-3', 'CON-4', 'CON-5', 'CON-6']);
      assertTree(repo, ['plugins/docflow/skills/bootstrap/templates/CONSTRAINTS.md']);
      assertFileContains(repo, 'AGENTS.md', 'Load `CONSTRAINTS.md` before any task');
      assertFileContains(repo, 'plugins/docflow/skills/add-convention/SKILL.md', 'CONSTRAINTS.md');
    },
  },
  {
    // ── Abandonment (S3) ──
    name: 'self-check: Withdrawn + dropped documented; supersession fires on Acceptance',
    skill: null,
    agentDependent: false,
    repo: repoRoot,
    assert(repo) {
      assertFileContains(repo, 'CONVENTIONS.md', 'Withdrawn');
      assertFileContains(repo, 'plugins/docflow/skills/bootstrap/templates/CONVENTIONS.md', 'Withdrawn');
      assertFileContains(repo, 'plan/README.md', 'plan/dropped');
      assertFileContains(repo, 'plugins/docflow/skills/bootstrap/templates/plan-README.md', 'plan/dropped');
      assertFileContains(repo, 'plugins/docflow/skills/new-adr/SKILL.md', 'supersession takes effect when');
      assertFileContains(repo, 'scripts/verify.mjs', "'Withdrawn'");
    },
  },
  {
    // ── Mutation suite: the gate rejects what it must reject. Each of
    // these was run by hand at its slice's ship; now repeatable. Cut
    // from committed HEAD — the live tree is never touched. ──
    name: 'mutation: pristine fixture passes the gate (baseline)',
    skill: null,
    agentDependent: false,
    repo: repoRoot,
    assert(repo) { assertGateGreen(repo); },
  },
  {
    name: 'mutation: editing an evidenced criterion FAILs the gate (digest binding)',
    skill: null,
    agentDependent: false,
    repo: repoRoot,
    assert(repo) {
      assertGateFails(repo, (fix) => fix.replace(
        'adr/0035-per-criterion-evidence.md',
        'No per-record markers.', 'No per-record markers at all.',
      ), /digest no longer matches/);
    },
  },
  {
    name: 'mutation: illegal manifest model FAILs the gate',
    skill: null,
    agentDependent: false,
    repo: repoRoot,
    assert(repo) {
      assertGateFails(repo, (fix) => fix.replace(
        'docflow.yml', 'model: capability-first', 'model: vibes',
      ), /illegal model/);
    },
  },
  {
    name: 'mutation: setting the reserved autonomy field FAILs the gate',
    skill: null,
    agentDependent: false,
    repo: repoRoot,
    assert(repo) {
      assertGateFails(repo, (fix) => fix.write(
        'docflow.yml', fix.read('docflow.yml') + 'autonomy: L3\n',
      ), /reserved/);
    },
  },
  {
    name: 'mutation: illegal constraint source FAILs the gate',
    skill: null,
    agentDependent: false,
    repo: repoRoot,
    assert(repo) {
      assertGateFails(repo, (fix) => fix.replace(
        'CONSTRAINTS.md', '- source: chosen', '- source: vibes',
      ), /source "vibes"/);
    },
  },
  {
    name: 'mutation: duplicate constraint id FAILs the gate',
    skill: null,
    agentDependent: false,
    repo: repoRoot,
    assert(repo) {
      assertGateFails(repo, (fix) => fix.replace(
        'CONSTRAINTS.md', '## CON-6 r1', '## CON-1 r1',
      ), /duplicate id/);
    },
  },
  {
    name: 'mutation: malformed dropped item FAILs the gate',
    skill: null,
    agentDependent: false,
    repo: repoRoot,
    assert(repo) {
      assertGateFails(repo, (fix) => {
        fix.mkdir('plan/dropped');
        fix.write('plan/dropped/2026-01-01-badname.md', 'no footer\n');
      }, /number must be kept|no Dropped footer/);
    },
  },
  {
    name: 'mutation: orphan evidence directory FAILs the gate',
    skill: null,
    agentDependent: false,
    repo: repoRoot,
    assert(repo) {
      assertGateFails(repo, (fix) => {
        fix.mkdir('evidence/9999-bogus');
        fix.write('evidence/9999-bogus/AC1-001.md', '---\nac: x\n---\n');
      }, /no catalogue ADR/);
    },
  },
  {
    // ── Spec-class machinery (dormant): fixtures write a spec into the
    // pristine copy, since this repo carries none. ──
    name: 'mutation: a valid Draft spec passes the gate (positive)',
    skill: null,
    agentDependent: false,
    repo: repoRoot,
    assert(repo) {
      assertGateGreen(repo, (fix) => {
        fix.mkdir('spec');
        fix.write('spec/eval-fixture.md', [
          '---', 'id: eval-fixture', 'status: Draft', 'decided-by: []',
          'constrained-by: []', 'retired-from:', '---', '',
          '# Eval fixture', '', '## Acceptance criteria', '',
          '1. Placeholder criterion.', '   Verify: manual', '',
        ].join('\n'));
        fix.write('INDEX.md', fix.read('INDEX.md') +
          '\n## Specs\n\n| Spec | Title | Status |\n|---|---|---|\n' +
          '| [eval-fixture](spec/eval-fixture.md) | Eval fixture | Draft |\n');
      });
    },
  },
  {
    name: 'mutation: an Agreed spec missing a Verify: method FAILs the gate',
    skill: null,
    agentDependent: false,
    repo: repoRoot,
    assert(repo) {
      assertGateFails(repo, (fix) => {
        fix.mkdir('spec');
        fix.write('spec/eval-fixture.md', [
          '---', 'id: eval-fixture', 'status: Agreed', 'decided-by: []',
          'constrained-by: []', 'retired-from:', '---', '',
          '# Eval fixture', '', '## Acceptance criteria', '',
          '1. Criterion with no method named.', '',
        ].join('\n'));
        fix.write('INDEX.md', fix.read('INDEX.md') +
          '\n## Specs\n\n| Spec | Title | Status |\n|---|---|---|\n' +
          '| [eval-fixture](spec/eval-fixture.md) | Eval fixture | Agreed |\n');
      }, /no Verify: method/);
    },
  },
  {
    name: 'mutation: an Implemented spec with mismatched evidence FAILs the gate',
    skill: null,
    agentDependent: false,
    repo: repoRoot,
    assert(repo) {
      assertGateFails(repo, (fix) => {
        fix.mkdir('spec');
        fix.write('spec/eval-fixture.md', [
          '---', 'id: eval-fixture', 'status: Implemented', 'decided-by: []',
          'constrained-by: []', 'retired-from:', '---', '',
          '# Eval fixture', '', '## Acceptance criteria', '',
          '1. Placeholder criterion.', '   Verify: manual', '',
        ].join('\n'));
        fix.write('INDEX.md', fix.read('INDEX.md') +
          '\n## Specs\n\n| Spec | Title | Status |\n|---|---|---|\n' +
          '| [eval-fixture](spec/eval-fixture.md) | Eval fixture | Implemented |\n');
        fix.mkdir('evidence/eval-fixture');
        fix.write('evidence/eval-fixture/AC1-001.md', [
          '---', 'ac: eval-fixture#AC1',
          'ac-digest: 0000000000000000000000000000000000000000000000000000000000000000',
          'method: manual', 'source-sha: 0000000', 'exit-code: 0',
          'verifier: human: Eval Fixture', 'date: 2026-01-01', '---', '',
        ].join('\n'));
      }, /digest no longer matches/);
    },
  },
  {
    name: 'mutation: Withdrawn is accepted end-to-end (positive)',
    skill: null,
    agentDependent: false,
    repo: repoRoot,
    assert(repo) {
      // Flip a pre-evidence ADR to Withdrawn in both the file and its
      // INDEX row: the gate (status validity + INDEX fidelity) stays
      // green, proving the state is fully supported.
      assertGateGreen(repo, (fix) => {
        fix.replace('adr/0030-domain-grouping.md', 'status: Implemented', 'status: Withdrawn');
        fix.replace('INDEX.md',
          '| Domain grouping — navigate the catalogue by area | Implemented |',
          '| Domain grouping — navigate the catalogue by area | Withdrawn |');
      });
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
        'docflow.yml',
      ]);
      assertManifest(repo, { schema: 1, model: 'capability-first', layers: ['plan', 'agent'] });
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
        '.docflow/docflow.yml',
      ]);
      // Optional layers stay off in the express profile — and the
      // record model stays capability-first: no spec artefacts.
      assertAbsent(repo, [
        '.docflow/plan', 'plan', '_agent', '.docflow/GLOSSARY.md',
        'GLOSSARY.md', '.docflow/CONSTRAINTS.md', 'CONSTRAINTS.md',
        '.docflow/domains', 'domains', '.docflow/spec', 'spec',
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
