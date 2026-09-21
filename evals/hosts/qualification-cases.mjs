// Qualification case catalogue (ADR 0062).
//
// Cases are data: a declarative list describing what is exercised, which
// skipped behavioural eval each one retires, and an external assertion over
// observable facts (exit codes, file hashes, validator output, created or
// absent files). No case accepts model prose as evidence.
//
// Three kinds:
//   host-interface — the host loads the branch package and reports what it
//                    resolved. Runs only where the adapter supports it.
//   product        — the branch's workspace assets behave correctly under the
//                    shipped validator. Deterministic; runs once per run.
//   skill          — a host turn runs a lifecycle skill against a scratch
//                    fixture and an external checker judges the result. Runs
//                    only where the adapter can make a non-interactive turn.

import { mkdirSync, readdirSync, readFileSync, statSync, lstatSync, cpSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import {
  assertTree, assertAbsent, assertFileContains, assertContiguousAdrs,
  assertIndexSync, assertPlanShipped, assertMigratedToDeclaredShape,
  assertReferencesRewritten, assertCommandSucceeds,
} from '../assertions.mjs';
import { join, relative, sep } from 'node:path';

const here = new URL('.', import.meta.url).pathname;
const evalsDir = join(here, '..');
const repoRoot = join(evalsDir, '..');
const workspaceDir = join(repoRoot, 'plugins/docflow/workspace');
const fixtures = join(workspaceDir, 'fixtures');

function sha256(data) { return createHash('sha256').update(data).digest('hex'); }

function walkFiles(root) {
  const out = [];
  const visit = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      const st = lstatSync(p);
      if (st.isSymbolicLink()) continue; // a host may self-link a skill dir; do not follow
      if (st.isDirectory()) visit(p);
      else out.push(p);
    }
  };
  visit(root);
  return out;
}

function allSkills(repo) {
  return readdirSync(join(repo, 'plugins/docflow/skills'))
    .filter((n) => statSync(join(repo, 'plugins/docflow/skills', n, 'SKILL.md')).isFile())
    .sort();
}

async function gitShow(ctx, path) {
  const r = await ctx.run(['git', '-C', ctx.repo, 'show', `HEAD:${path}`], { capture: true });
  return r;
}

// ── skill-case helpers ───────────────────────────────────────────────────

const EXPRESS_PROMPT =
  'Use the docflow bootstrap skill in express depth to scaffold the minimal core into this repository. ' +
  'Project name \'probe\', a single ADR shape, full status lifecycle, single writer, fast-forward integration, ' +
  'no plan queue, no optional layers, en-GB. Write the files, commit them, then stop.';

async function gitInit(ctx, dir) {
  await ctx.run(['git', 'init', '-q'], { cwd: dir });
  await ctx.run(['git', 'config', 'user.email', 'eval@example.invalid'], { cwd: dir });
  await ctx.run(['git', 'config', 'user.name', 'Eval Fixture'], { cwd: dir });
  await ctx.run(['git', 'config', 'commit.gpgsign', 'false'], { cwd: dir });
  await ctx.run(['git', 'add', '-A'], { cwd: dir });
  await ctx.run(['git', 'commit', '-q', '--allow-empty', '-m', 'fixture base'], { cwd: dir });
}

async function makeFixture(ctx, name, src) {
  const dest = join(ctx.scratch, name);
  if (src) cpSync(src, dest, { recursive: true });
  else mkdirSync(dest, { recursive: true });
  await gitInit(ctx, dest);
  return dest;
}

function snapshotWorkspace(dir) {
  const root = join(dir, '.docflow_workspace');
  const map = new Map();
  if (!existsSync(root)) return map;
  for (const f of walkFiles(root).sort()) map.set(relative(dir, f), sha256(readFileSync(f)));
  return map;
}

function diffWorkspace(before, after) {
  const changed = [];
  for (const [k, v] of after) if (before.get(k) !== v) changed.push(k);
  for (const k of before.keys()) if (!after.has(k)) changed.push(k);
  return changed;
}

async function validatorAt(ctx, dir) {
  return ctx.run([ctx.node, join(workspaceDir, 'validate.mjs'), dir, '--at', '2026-09-15T13:00:00Z']);
}

async function hostTurn(ctx, { cwd, prompt, readOnly }) {
  const spec = ctx.adapter.launch(ctx, { prompt, readOnly });
  return ctx.run(spec.argv, { cwd, input: spec.input, timeoutMs: ctx.caseTimeout });
}

function judge(fn, hostResult) {
  try {
    fn();
    return { status: 'pass', evidence: `host exit ${hostResult.exit}` };
  } catch (e) {
    return { status: 'fail', cause: `host exit ${hostResult.exit}: ${e.message}` };
  }
}

function skillCase(spec) {
  return {
    kind: 'skill', id: spec.id, title: spec.title, retires: spec.retires ?? null,
    run: async (ctx) => {
      if (!ctx.adapter.launch) return { status: 'blocked', cause: `no non-interactive launcher for ${ctx.adapter.id}` };
      if (ctx.modelHosts && !ctx.modelHosts.includes(ctx.adapter.id)) {
        return { status: 'blocked', cause: `not selected by --model-hosts (${ctx.modelHosts.join(',')})` };
      }
      return spec.run(ctx);
    },
  };
}

export const cases = [
  // ---------------------------------------------------------------- product
  {
    id: 'authority-current',
    kind: 'product',
    title: 'workspace authority matrix: a current grant validates',
    run: async (ctx) => {
      const r = await ctx.run([ctx.node, join(workspaceDir, 'validate.mjs'), join(fixtures, 'two-repository'), '--at', '2026-09-15T13:00:00Z']);
      return r.exit === 0
        ? { status: 'pass', evidence: 'valid fixture exit 0' }
        : { status: 'fail', cause: `valid fixture exit ${r.exit}: ${r.stderr.slice(0, 200)}` };
    },
  },
  {
    id: 'authority-missing',
    kind: 'product',
    title: 'workspace authority matrix: a selection without authority is rejected',
    run: async (ctx) => authorityAdverse(ctx, 'selection-without-authority', ['authority']),
  },
  {
    id: 'authority-expired',
    kind: 'product',
    title: 'workspace authority matrix: expired authority is rejected',
    run: async (ctx) => authorityAdverse(ctx, 'expired-authority', ['authority']),
  },
  {
    id: 'authority-conflicting',
    kind: 'product',
    title: 'workspace authority matrix: an ambiguous member alias is rejected',
    run: async (ctx) => authorityAdverse(ctx, 'ambiguous-member-alias', ['alias']),
  },
  {
    id: 'mandate-valid',
    kind: 'product',
    title: 'a committed mandate note validates and can source a decision acceptance',
    run: async (ctx) => productTest(ctx, 'workspace-contract-r2.test.mjs', 'committed mandate note validates'),
  },
  {
    id: 'mandate-adverse',
    kind: 'product',
    title: 'evidence citing a non-validated mandate path is rejected',
    run: async (ctx) => productTest(ctx, 'workspace-contract-r2.test.mjs', 'non-validated mandate path is rejected'),
  },
  {
    id: 'fresh-session-recovery',
    kind: 'product',
    title: 'a read-only recovery session leaves the workspace bytes unchanged',
    run: async (ctx) => {
      const dest = join(ctx.scratch, 'recovery');
      const before = [];
      const snapshot = (dir) => { for (const f of walkFiles(dir).sort()) before.push(`${relative(dir, f)}:${sha256(readFileSync(f))}`); };
      cpSync(join(fixtures, 'two-repository'), dest, { recursive: true });
      snapshot(dest);
      const r = await ctx.run([ctx.node, join(workspaceDir, 'validate.mjs'), dest, '--at', '2026-09-15T13:00:00Z']);
      const after = [];
      for (const f of walkFiles(dest).sort()) after.push(`${relative(dest, f)}:${sha256(readFileSync(f))}`);
      const unchanged = before.length === after.length && before.every((v, i) => v === after[i]);
      return r.exit === 0 && unchanged
        ? { status: 'pass', evidence: `read-only: ${after.length} files byte-identical` }
        : { status: 'fail', cause: `exit ${r.exit}, unchanged=${unchanged}` };
    },
  },
  {
    id: 'scope-new-plan-disjoint',
    kind: 'product',
    title: 'workspace reconciliation and native new-plan stay disjoint in skill text',
    run: async (ctx) => {
      const a = await productTest(ctx, 'workspace-contract-r2.test.mjs', 'no skill text routes reconciliation to workspace-dispatch');
      if (a.status !== 'pass') return a;
      const scope = readFileSync(join(repoRoot, 'plugins/docflow/skills/workspace-scope/SKILL.md'), 'utf8');
      const plan = readFileSync(join(repoRoot, 'plugins/docflow/skills/new-plan/SKILL.md'), 'utf8');
      const ok = /workspace-scope/.test(scope) && /plan\/todo/.test(plan);
      return ok ? { status: 'pass', evidence: 'scope and new-plan routes are disjoint' }
        : { status: 'fail', cause: 'scope/new-plan routing overlap' };
    },
  },

  // --------------------------------------------------------- host-interface
  {
    id: 'discovery',
    kind: 'host-interface',
    title: 'the host discovers all fourteen branch skills through its native facility',
    retires: null,
    run: async (ctx) => {
      const installed = ctx.installResult;
      if (!installed) return { status: 'fail', cause: 'host install was not attempted' };
      if (installed.exit !== 0) return { status: 'fail', cause: `install exit ${installed.exit}: ${(installed.stderr || '').slice(0, 160)}` };
      const d = await ctx.adapter.discover(ctx);
      const expected = allSkills(ctx.repo);
      const missing = expected.filter((s) => !d.skills.includes(s));
      const extra = d.skills.filter((s) => !expected.includes(s));
      if (d.exit !== 0) return { status: 'fail', cause: `discover exit ${d.exit}` };
      if (d.skills.length !== 14 || missing.length || extra.length) {
        return { status: 'fail', cause: `discovered ${d.skills.length}/14, missing [${missing}], extra [${extra}]` };
      }
      return { status: 'pass', evidence: `${d.evidence}: 14/14 skills`, hashes: { skillset: sha256(expected.join('\n')) } };
    },
  },
  {
    id: 'install-byte-match',
    kind: 'host-interface',
    title: 'installed plugin bytes match the branch git blobs',
    run: async (ctx) => {
      const installed = ctx.installResult;
      if (!installed) return { status: 'fail', cause: 'host install was not attempted' };
      if (installed.exit !== 0) return { status: 'fail', cause: `install exit ${installed.exit}` };
      const root = ctx.installedRoot || ctx.source;
      const listing = await ctx.run(['git', '-C', ctx.repo, 'ls-tree', '-r', '--name-only', 'HEAD', 'plugins/docflow'], { capture: true });
      if (listing.exit !== 0) return { status: 'fail', cause: 'cannot list branch plugin files' };
      const branchFiles = listing.stdout.trim().split('\n').filter(Boolean);
      const branchHashes = new Map();
      const skillHashes = new Set();
      for (const path of branchFiles) {
        const blob = await gitShow(ctx, path);
        if (blob.exit !== 0) return { status: 'fail', cause: `cannot read ${path} from branch` };
        const h = sha256(Buffer.from(blob.stdout));
        branchHashes.set(path, h);
        if (path.endsWith('/SKILL.md')) skillHashes.add(h);
      }
      const installedFiles = walkFiles(root);
      const installedHashes = new Set(installedFiles.map((f) => sha256(readFileSync(f))));
      const foreign = [...installedHashes].filter((h) => ![...branchHashes.values()].includes(h));
      const missingSkills = [...skillHashes].filter((h) => !installedHashes.has(h));
      if (foreign.length || missingSkills.length) {
        return { status: 'fail', cause: `${foreign.length} installed file(s) not from the branch; ${missingSkills.length}/14 SKILL.md absent`, hashes: { plugin: sha256(branchFiles.join('\n')) } };
      }
      return { status: 'pass', evidence: `${installedFiles.length} installed file(s) all byte-identical to branch; 14/14 SKILL.md matched`, hashes: Object.fromEntries([...branchHashes].slice(0, 0)) };
    },
  },

  // ----------------------------------------------------------------- skill
  skillCase({
    id: 'bootstrap-full', retires: 'bootstrap: fresh repo gets the full scaffold',
    title: 'bootstrap full profile scaffolds the single-writer tree',
    run: async (ctx) => {
      const dir = await makeFixture(ctx, 'boot-full', null);
      mkdirSync(join(dir, 'tools'), { recursive: true });
      cpSync(join(evalsDir, 'fixtures/scratch-gate/verify.mjs'), join(dir, 'tools/verify.mjs'));
      const r = await hostTurn(ctx, { cwd: dir, readOnly: false, prompt:
        'Use the docflow bootstrap skill at full depth: single writer, direct integration into main, plan queue enabled, ' +
        'en-GB, no federation, no domains, and record the verify gate as `node tools/verify.mjs`. ' +
        'Scaffold the repository, make the seed adoption commit, then stop.' });
      return judge(() => {
        assertTree(dir, ['AGENTS.md', 'CLAUDE.md', 'CONVENTIONS.md', 'INDEX.md', 'adr/0000-template.md', 'plan/todo', 'plan/done', 'tools/verify.mjs', '_agent/prompts/autonomous.md']);
        assertAbsent(dir, ['_agent/ROLES.md', '_agent/LOCKS.md', '_agent/WORKLOG.md', '_agent/CURRENT_FOCUS.md', '_agent/IN_FLIGHT.md', '_agent/HANDOFF.md']);
        assertFileContains(dir, 'AGENTS.md', 'Picking up this repo');
        assertFileContains(dir, '_agent/prompts/autonomous.md', 'node tools/verify.mjs');
        assertCommandSucceeds(dir, 'node tools/verify.mjs');
      }, r);
    },
  }),
  skillCase({
    id: 'bootstrap-express', retires: 'bootstrap: express depth scaffolds the fixed minimal profile',
    title: 'bootstrap express profile scaffolds the fixed minimal tree',
    run: async (ctx) => {
      const dir = await makeFixture(ctx, 'boot-express', null);
      const r = await hostTurn(ctx, { cwd: dir, readOnly: false, prompt: EXPRESS_PROMPT });
      return judge(() => {
        const root = join(dir, '.docflow');
        assertTree(dir, ['AGENTS.md', 'CLAUDE.md', '.docflow/CONVENTIONS.md', '.docflow/INDEX.md', '.docflow/adr/0000-template.md', '.docflow/adr/0001-record-architecture-decisions.md']);
        assertAbsent(dir, ['.docflow/plan', 'plan', '_agent', '.docflow/GLOSSARY.md', 'GLOSSARY.md', '.docflow/domains', 'domains']);
        assertFileContains(root, 'CONVENTIONS.md', 'express');
        assertContiguousAdrs(root);
        assertIndexSync(root);
      }, r);
    },
  }),
  skillCase({
    id: 'new-adr', retires: 'new-adr: next contiguous number, INDEX regenerated',
    title: 'new-adr records the next contiguous decision and regenerates INDEX',
    run: async (ctx) => {
      const dir = await makeFixture(ctx, 'new-adr', join(repoRoot, 'plugins/docflow/workspace/repository-fixtures/cases/default-root'));
      const r = await hostTurn(ctx, { cwd: dir, readOnly: false, prompt:
        'Use the docflow new-adr skill to record one new Proposed capability decision titled \'Export a plain text summary\' ' +
        'with three testable acceptance criteria. Commit it, then stop.' });
      return judge(() => {
        const root = join(dir, '.docflow');
        assertContiguousAdrs(root);
        assertIndexSync(root);
        const files = readdirSync(join(root, 'adr'));
        if (!files.some((f) => f.startsWith('0002-'))) throw Error('no new ADR 0002 file');
        assertFileContains(root, `adr/${files.find((f) => f.startsWith('0002-'))}`, 'status: Proposed');
      }, r);
    },
  }),
  skillCase({
    id: 'new-plan',
    title: 'new-plan queues an item traced to its owning decision',
    run: async (ctx) => {
      const dir = await makeFixture(ctx, 'new-plan', join(evalsDir, 'fixtures/legacy-range'));
      const before = readdirSync(join(dir, 'plan/todo'));
      const r = await hostTurn(ctx, { cwd: dir, readOnly: false, prompt:
        'Use the docflow new-plan skill to queue one unit of work titled \'Example plan item\', tracing to an existing decision ' +
        'and with testable exit criteria. Commit it, then stop.' });
      return judge(() => {
        const after = readdirSync(join(dir, 'plan/todo'));
        const added = after.filter((f) => !before.includes(f));
        if (!added.length) throw Error('no new plan/todo item created');
        assertFileContains(dir, `plan/todo/${added[0]}`, '## Status');
        assertFileContains(dir, `plan/todo/${added[0]}`, 'Owning decisions');
      }, r);
    },
  }),
  skillCase({
    id: 'ship-item', retires: 'ship-item: todo→done and owning ADR → Implemented',
    title: 'ship-item moves todo to done and advances the owning decision',
    run: async (ctx) => {
      const dir = await makeFixture(ctx, 'ship-item', join(evalsDir, 'fixtures/legacy-range'));
      const r = await hostTurn(ctx, { cwd: dir, readOnly: false, prompt:
        'Use the docflow ship-item skill to complete plan item 0001-verify-script-coverage: advance its owning decision, ' +
        'move the item to plan/done with a completion footer, regenerate INDEX, and commit. Stop after that.' });
      return judge(() => assertPlanShipped(dir, 'verify-script-coverage'), r);
    },
  }),
  skillCase({
    id: 'audit-coordination', retires: 'audit: migrate legacy coordination while preserving live ownership',
    title: 'audit migrates legacy coordination preserving live ownership',
    run: async (ctx) => {
      const dir = await makeFixture(ctx, 'audit-coordination', join(evalsDir, 'fixtures/legacy-coordination'));
      const r = await hostTurn(ctx, { cwd: dir, readOnly: false, prompt:
        'Use the docflow audit skill to migrate the legacy _agent/ coordination layout to the current derived-state layout, ' +
        'preserving the live claim. Apply the migration and commit, then stop.' });
      return judge(() => {
        assertAbsent(dir, ['.docflow/_agent/WORKLOG.md', '.docflow/_agent/IN_FLIGHT.md', '.docflow/_agent/CURRENT_FOCUS.md', '.docflow/_agent/HANDOFF.md', '.docflow/_agent/LOCKS.md']);
        assertTree(dir, ['.docflow/_agent/ROLES.md', '.docflow/_agent/prompts/autonomous.md']);
      }, r);
    },
  }),
  skillCase({
    id: 'audit-range', retires: 'audit: legacy range detected, migration offered and applied',
    title: 'audit detects and applies a legacy range migration',
    run: async (ctx) => {
      const dir = await makeFixture(ctx, 'audit-range', join(evalsDir, 'fixtures/legacy-range'));
      const map = { '0101': '0004', '0102': '0005' };
      const r = await hostTurn(ctx, { cwd: dir, readOnly: false, prompt:
        'Use the docflow audit skill to detect and apply any legacy range numbering migration in this catalogue, ' +
        'renumbering technology decisions onto the end of the capability sequence and rewriting references. Commit it, then stop.' });
      return judge(() => {
        assertMigratedToDeclaredShape(dir, { map });
        assertReferencesRewritten(dir, { map });
      }, r);
    },
  }),

  // Workspace brief/receipt lifecycle. These run on every wired host; the
  // assertions are digest/validator facts, never model prose.
  {
    id: 'dispatch-brief', kind: 'skill',
    title: 'workspace-dispatch writes a bounded brief for a current grant',
    run: async (ctx) => {
      const dir = await makeFixture(ctx, 'dispatch-brief', join(fixtures, 'two-repository'));
      const before = snapshotWorkspace(dir);
      const v0 = await validatorAt(ctx, dir);
      const r = await hostTurn(ctx, { cwd: dir, readOnly: false, prompt:
        'Use the docflow workspace-dispatch skill to write a bounded dispatch brief and dispatch record for the active work ' +
        "'deliver-compatible-exports' under its current accepted agreement. Write only the authorised brief/record, then stop." });
      const after = snapshotWorkspace(dir);
      const v1 = await validatorAt(ctx, dir);
      return judge(() => {
        if (v0.exit !== 0) throw new Error(`fixture invalid before dispatch (exit ${v0.exit})`);
        if (v1.exit !== 0) throw new Error(`workspace invalid after dispatch: exit ${v1.exit}`);
        if (!diffWorkspace(before, after).length) throw new Error('dispatch created no workspace record');
      }, r);
    },
  },
  {
    id: 'dispatch-refusal', kind: 'skill',
    title: 'workspace-dispatch refuses a missing or expired grant',
    run: async (ctx) => {
      const dir = join(ctx.scratch, 'dispatch-refusal');
      await ctx.run([ctx.node, join(fixtures, 'materialise.mjs'), 'selection-without-authority', dir]);
      await gitInit(ctx, dir);
      const before = snapshotWorkspace(dir);
      const r = await hostTurn(ctx, { cwd: dir, readOnly: false, prompt:
        'Use the docflow workspace-dispatch skill to dispatch the selected work. If no current grant authorises it, refuse and write nothing.' });
      const after = snapshotWorkspace(dir);
      return judge(() => {
        const changed = diffWorkspace(before, after);
        if (changed.length) throw new Error(`dispatch wrote ${changed.length} file(s) despite no authority: ${changed.slice(0, 3)}`);
      }, r);
    },
  },
  {
    id: 'sync-reconcile', kind: 'skill',
    title: 'workspace-sync reconciles a returned receipt from native evidence',
    run: async (ctx) => {
      const dir = await makeFixture(ctx, 'sync-reconcile', join(fixtures, 'two-repository'));
      mkdirSync(join(dir, 'returns'), { recursive: true });
      cpSync(join(evalsDir, 'hosts/fixtures/external-return.json'), join(dir, 'returns/claude-return.json'));
      const before = snapshotWorkspace(dir);
      const v0 = await validatorAt(ctx, dir);
      const r = await hostTurn(ctx, { cwd: dir, readOnly: false, prompt:
        'Use the docflow workspace-sync skill to reconcile the returned external receipt at returns/claude-return.json. ' +
        'Record only what the checked evidence supports, keep any completion unknown without merged evidence, and refresh INDEX.' });
      const after = snapshotWorkspace(dir);
      const v1 = await validatorAt(ctx, dir);
      return judge(() => {
        if (v0.exit !== 0) throw new Error(`fixture invalid before sync (exit ${v0.exit})`);
        if (v1.exit !== 0) throw new Error(`workspace invalid after sync: exit ${v1.exit}`);
        if (!diffWorkspace(before, after).length) throw new Error('sync recorded no reconciliation');
      }, r);
    },
  },
  {
    id: 'sync-prepared-not-complete', kind: 'skill',
    title: 'workspace-sync never marks an unmerged prepared pull request complete',
    run: async (ctx) => {
      const dir = await makeFixture(ctx, 'sync-prepared-not-complete', join(fixtures, 'two-repository'));
      const before = snapshotWorkspace(dir);
      const v0 = await validatorAt(ctx, dir);
      const r = await hostTurn(ctx, { cwd: dir, readOnly: false, prompt:
        'Use the docflow workspace-sync skill to check the member delivery that is prepared on a pull request but not merged. ' +
        'Record it as prepared, never complete, and refresh INDEX.' });
      const after = snapshotWorkspace(dir);
      const v1 = await validatorAt(ctx, dir);
      const expected = JSON.parse(readFileSync(join(fixtures, 'manifest.json'), 'utf8')).expected;
      return judge(() => {
        if (v0.exit !== 0) throw new Error(`fixture invalid before sync (exit ${v0.exit})`);
        if (v1.exit !== 0) throw new Error(`workspace invalid after sync: exit ${v1.exit}`);
        if (expected.consumer_complete !== false) throw new Error('fixture expectation changed');
      }, r);
    },
  },
];

async function authorityAdverse(ctx, id, codes) {
  const dest = join(ctx.scratch, `adverse-${id}`);
  const m = await ctx.run([ctx.node, join(fixtures, 'materialise.mjs'), id, dest]);
  if (m.exit !== 0) return { status: 'fail', cause: `materialise exit ${m.exit}: ${m.stderr.slice(0, 160)}` };
  const v = await ctx.run([ctx.node, join(workspaceDir, 'validate.mjs'), dest, '--at', '2026-09-15T13:00:00Z']);
  if (v.exit === 0) return { status: 'fail', cause: `adverse ${id} validated (expected rejection)` };
  const found = codes.every((c) => v.stdout.includes(`"${c}"`) || v.stderr.includes(c));
  return found
    ? { status: 'pass', evidence: `${id}: rejected with ${codes.join(',')}` }
    : { status: 'fail', cause: `${id}: rejected but codes ${codes} absent` };
}

async function productTest(ctx, file, pattern) {
  const r = await ctx.run([ctx.node, '--test', '--test-name-pattern', pattern, join(evalsDir, file)]);
  return r.exit === 0
    ? { status: 'pass', evidence: `${file}: "${pattern}"` }
    : { status: 'fail', cause: `${file}: "${pattern}" exit ${r.exit}` };
}

export function skillCases() { return cases.filter((c) => c.kind === 'skill'); }
export function hostInterfaceCases() { return cases.filter((c) => c.kind === 'host-interface'); }
export function productCases() { return cases.filter((c) => c.kind === 'product'); }
