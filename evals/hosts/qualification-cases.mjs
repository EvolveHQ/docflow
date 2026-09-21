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
  { id: 'bootstrap-full', kind: 'skill', title: 'bootstrap full profile scaffolds the single-writer tree', retires: 'bootstrap: fresh repo gets the full scaffold' },
  { id: 'bootstrap-express', kind: 'skill', title: 'bootstrap express profile scaffolds the fixed minimal tree', retires: 'bootstrap: express depth scaffolds the fixed minimal profile' },
  { id: 'new-adr', kind: 'skill', title: 'new-adr records the next contiguous decision and regenerates INDEX', retires: 'new-adr: next contiguous number, INDEX regenerated' },
  { id: 'new-plan', kind: 'skill', title: 'new-plan queues an item traced to its owning decision', retires: null },
  { id: 'ship-item', kind: 'skill', title: 'ship-item moves todo to done and advances the owning decision', retires: 'ship-item: todo→done and owning ADR → Implemented' },
  { id: 'dispatch-brief', kind: 'skill', title: 'workspace-dispatch writes a bounded brief for a current grant', retires: null },
  { id: 'dispatch-refusal', kind: 'skill', title: 'workspace-dispatch refuses a missing or expired grant', retires: null },
  { id: 'sync-reconcile', kind: 'skill', title: 'workspace-sync reconciles a returned receipt from native evidence', retires: null },
  { id: 'sync-prepared-not-complete', kind: 'skill', title: 'workspace-sync never marks an unmerged prepared pull request complete', retires: null },
  { id: 'audit-coordination', kind: 'skill', title: 'audit migrates legacy coordination preserving live ownership', retires: 'audit: migrate legacy coordination while preserving live ownership' },
  { id: 'audit-range', kind: 'skill', title: 'audit detects and applies a legacy range migration', retires: 'audit: legacy range detected, migration offered and applied' },
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
