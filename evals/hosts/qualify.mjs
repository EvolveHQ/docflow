#!/usr/bin/env node
// Automated host qualification runner (ADR 0062).
//
// A qualification round is a run of this harness. It drives each installed
// host through its native facility for every case the adapter supports, then
// judges the result with an external observable check. It writes
// machine-readable results and emits the plan-item receipt from those results
// — nobody writes the receipt by hand.
//
// Usage:
//   node evals/hosts/qualify.mjs [--hosts claude,pi,...] [--cases discovery,...]
//        [--scratch DIR] [--out FILE] [--summary-only]
//
// The static `verify` gate stays fast and hostless; this runs as an opt-in
// tier (`node evals/run.mjs --qualify`).

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { adapters, provisionCredentials } from './host-adapters.mjs';
import { cases, hostInterfaceCases, productCases, skillCases } from './qualification-cases.mjs';
import { renderReceipt, summarise } from './qualification-receipt.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..', '..');
const DEFAULT_TIMEOUT_MS = 900_000;

function parseArgs(argv) {
  const out = { hosts: null, cases: null, scratch: null, out: null, summaryOnly: false, modelHosts: null, caseTimeoutMs: 900_000 };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--hosts') out.hosts = argv[++i].split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--cases') out.cases = argv[++i].split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--model-hosts') out.modelHosts = argv[++i].split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--case-timeout-ms') out.caseTimeoutMs = Number(argv[++i]);
    else if (a === '--scratch') out.scratch = argv[++i];
    else if (a === '--out') out.out = argv[++i];
    else if (a === '--summary-only') out.summaryOnly = true;
    else if (a === '--help') { console.log(readFileSync(import.meta.url.replace('file://', ''), 'utf8').split('\n').slice(0, 20).join('\n')); process.exit(0); }
    else throw Error(`unknown argument: ${a}`);
  }
  return out;
}

function git(args) {
  return spawnSync('git', ['-C', repo, ...args], { encoding: 'utf8' });
}

// Fingerprint of an operator checkout. A host must never be able to write
// here — the whole run is staged from a copy under the scratch root. HEAD
// catches a commit, status catches edits and new/deleted files, and the reflog
// catches a commit that was later reset away. Git already omits gitignored
// paths from status. Compared before and after every case; a mismatch aborts
// the run and fails the offending cell.
const workspaceRoot = resolve(repo, '..', '..');
const clarityRoot = join(workspaceRoot, 'repos', 'clarity.docflowhq.com');

function gitIn(root, args) {
  return spawnSync('git', ['-C', root, ...args], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
}

// Working-tree status for one root, or null when the root is not a usable git
// checkout. For the docflow checkout the harness's own generated results are
// excluded so writing the receipt never trips the guard.
export function checkoutStatus(root, ignoreResults = false) {
  const r = gitIn(root, ['status', '--porcelain=v1', '--untracked-files=all']);
  if (r.status !== 0) return null;
  return r.stdout.split('\n')
    .filter((line) => line && !(ignoreResults && /^.. evals\/hosts\/results\//.test(line)))
    .join('\n');
}

export function checkoutFingerprint(root = repo, { ignoreResults = false } = {}) {
  const capture = (args) => {
    const r = gitIn(root, args);
    return r.status === 0 ? r.stdout : `ERR:${r.status}:${r.stderr}`;
  };
  return createHash('sha256').update([
    capture(['rev-parse', 'HEAD']),
    checkoutStatus(root, ignoreResults) ?? 'ERR',
    capture(['reflog', '--format=%H %gs', '-n', '5']),
    capture(['stash', 'list']),
  ].join('\u0000')).digest('hex');
}

// The guard covers the workspace root and the Clarity checkout as well as the
// docflow checkout: a host must not write into operator state outside its
// scratch root.
export const GUARD_ROOTS = [
  { label: 'docflow', root: repo, ignoreResults: true },
  { label: 'workspace', root: workspaceRoot, ignoreResults: false },
  { label: 'clarity', root: clarityRoot, ignoreResults: false },
];

export function fingerprintRoots(roots) {
  return roots.map(({ label, root, ignoreResults }) => `${label}:${checkoutFingerprint(root, { ignoreResults })}`).join('\n');
}

function guardFingerprint() {
  return fingerprintRoots(GUARD_ROOTS);
}

// A receipt may only be emitted for the revision it names, from a clean tree.
function assertReceiptBound(revision) {
  const head = git(['rev-parse', 'HEAD']).stdout.trim();
  if (head !== revision) {
    throw new Error(`receipt refuses to emit: source revision ${revision} is not HEAD ${head}`);
  }
  const dirty = GUARD_ROOTS
    .map(({ label, root, ignoreResults }) => ({ label, status: checkoutStatus(root, ignoreResults) }))
    .filter(({ status }) => status && status.length > 0)
    .map(({ label }) => label);
  if (dirty.length) {
    throw new Error(`receipt refuses to emit: uncommitted changes in ${dirty.join(', ')}`);
  }
}

function assertUnder(root, target, what) {
  const r = resolve(root);
  const t = resolve(target);
  if (t !== r && !t.startsWith(r + sep)) throw Error(`isolation: ${what} ${t} escapes scratch root ${r}`);
  return t;
}

function makeRun(home, scratch) {
  const baseEnv = { ...process.env };
  // Never inherit a host's real state.
  for (const k of Object.keys(baseEnv)) {
    if (/^(CLAUDE|CODEX|GROK|OMP|COPILOT|CURSOR|OPENCODE|PI)_/.test(k) && !/^PATH$/.test(k)) delete baseEnv[k];
  }
  const run = (argv, opts = {}) => {
    const cwd = opts.cwd ? assertUnder(scratch, opts.cwd, 'cwd') : scratch;
    // Node's spawnSync does not rewrite PWD, so a child would otherwise see the
    // harness's own working directory. Hosts (opencode, for one) resolve their
    // project from PWD and would escape the scratch root. Pin it to the real
    // child cwd.
    const env = { ...baseEnv, ...(opts.env || {}), HOME: home, PWD: cwd, OLDPWD: cwd };
    const r = spawnSync(argv[0], argv.slice(1), {
      cwd, env, encoding: 'utf8', timeout: opts.timeoutMs || DEFAULT_TIMEOUT_MS,
      input: opts.input, maxBuffer: 64 * 1024 * 1024, windowsHide: true,
    });
    return {
      exit: r.error ? (r.error.code === 'ETIMEDOUT' ? 124 : 1) : r.status,
      stdout: r.stdout || '', stderr: r.stderr || '', timedOut: r.error?.code === 'ETIMEDOUT',
    };
  };
  const runSync = (argv, opts = {}) => run(argv, opts);
  return { run, runSync, baseEnv };
}

function buildCtx({ host, adapter, scratch, home, source, node, stage, modelHosts, caseTimeout }) {
  const { run, runSync } = makeRun(home, scratch);
  const env = adapter?.env ? adapter.env(home) : {};
  const mergeEnv = (extra) => ({ ...env, ...extra });
  return {
    host, adapter, case: null, scratch, home, source, repo, node,
    python: process.env.PYTHON || 'python3',
    stage: stage || repo,
    plugin: join(stage || repo, 'plugins/docflow'),
    binary: adapter?.binary,
    modelHosts: modelHosts || adapters.filter((a) => a.launch).map((a) => a.id),
    caseTimeout: caseTimeout || 900_000,
    installedRoot: null,
    installResult: null,
    get run() { return (argv, opts = {}) => run(argv, { ...opts, env: mergeEnv(opts.env) }); },
    get runSync() { return (argv, opts = {}) => runSync(argv, { ...opts, env: mergeEnv(opts.env) }); },
  };
}

async function runOne({ ctx, testCase }) {
  const started = Date.now();
  const result = {
    host: ctx.host || 'product', case: testCase.id, kind: testCase.kind,
    status: 'fail', cause: null, exit_code: null, duration_ms: 0, hashes: null, source_revision: null,
  };
  try {
    if (!testCase.run) {
      // Skill case with no launcher wired: record unrun honestly.
      result.status = 'unrun';
      result.cause = 'no non-interactive skill launcher configured for this adapter in this round';
      return result;
    }
    ctx.case = testCase;
    const out = await testCase.run(ctx);
    result.status = out.status;
    result.cause = out.cause || null;
    result.evidence = out.evidence || null;
    result.hashes = out.hashes || null;
  } catch (e) {
    result.status = 'fail';
    result.cause = e.message;
  } finally {
    result.duration_ms = Date.now() - started;
    const rev = git(['rev-parse', 'HEAD']);
    result.source_revision = rev.status === 0 ? rev.stdout.trim() : null;
  }
  return result;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const source = join(repo, 'plugins/docflow');
  const scratchRoot = resolve(args.scratch || mkdtempSync(join(tmpdir(), 'docflow-qualify-')));
  mkdirSync(scratchRoot, { recursive: true });
  const hosts = args.hosts || adapters.map((a) => a.id);
  const selected = args.cases ? new Set(args.cases) : null;
  const wanted = (c) => (args.cases ? selected.has(c.id) : true);
  const results = [];

  // Stage one read-only copy of the branch for every native install. The
  // operator's working tree is never touched. Each host gets its own stage:
  // a host's install must not mutate another host's staged source.
  const stage = join(scratchRoot, 'stage');
  const stageFor = (host) => join(scratchRoot, `stage-${host}`);
  const copyRepo = (dest) => cpSync(repo, dest, {
    recursive: true,
    filter: (src) => !/[\\/]\.git([\\/]|$)/.test(src) && !/[\\/]node_modules([\\/]|$)/.test(src),
  });
  copyRepo(stage);

  const revision = git(['rev-parse', 'HEAD']).stdout.trim();
  const date = new Date().toISOString().slice(0, 10);
  const outPath = args.out || join(here, 'results', `qualify-${date}.json`);
  mkdirSync(dirname(outPath), { recursive: true });
  const receiptPath = outPath.replace(/\.json$/, '.md');
  let payload = null;
  const persist = () => {
    assertReceiptBound(revision);
    payload = { schema: 1, harness: 'docflow-qualify', generated_at: new Date().toISOString(), source_revision: revision, source, scratch: scratchRoot, results };
    writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n');
    writeFileSync(receiptPath, renderReceipt(payload));
    return payload;
  };
  const guardBaseline = guardFingerprint();
  const record = (entry) => {
    const now = guardFingerprint();
    if (now !== guardBaseline) {
      entry.status = 'fail';
      entry.cause = `ISOLATION BREACH: a guarded checkout changed during ` +
        `${entry.host || 'product'}:${entry.case} (guard ${guardBaseline.slice(0, 12)} -> ${now.slice(0, 12)}); run aborted`;
      results.push(entry);
      persist();
      throw new Error(entry.cause);
    }
    results.push(entry);
    persist();
  };

  // Product cases run once against the branch assets.
  for (const testCase of productCases().filter(wanted)) {
    const home = join(scratchRoot, '_product-home');
    mkdirSync(home, { recursive: true });
    const ctx = buildCtx({ host: null, adapter: null, scratch: scratchRoot, home, source, node: process.execPath, stage, modelHosts: args.modelHosts, caseTimeout: args.caseTimeoutMs });
    record(await runOne({ ctx, testCase }));
  }

  for (const host of hosts) {
    const adapter = adapters.find((a) => a.id === host);
    if (!adapter) throw Error(`unknown host: ${host}`);
    const home = join(scratchRoot, `host-${host}`);
    mkdirSync(home, { recursive: true });
    const hostStage = stageFor(host);
    copyRepo(hostStage);
    const ctx = buildCtx({ host, adapter, scratch: scratchRoot, home, source, node: process.execPath, stage: hostStage, modelHosts: args.modelHosts, caseTimeout: args.caseTimeoutMs });
    provisionCredentials(host, ctx);
    if (adapter.install) {
      try { ctx.installResult = await adapter.install(ctx); }
      catch (e) { ctx.installResult = { exit: 1, stderr: e.message, stdout: '' }; }
    } else {
      ctx.installResult = { exit: 0, stdout: '', stderr: '' };
    }
    for (const testCase of hostInterfaceCases().filter(wanted)) {
      if (adapter.blocked?.[testCase.id]) {
        record({ host, case: testCase.id, kind: testCase.kind, status: 'blocked', cause: adapter.blocked[testCase.id], exit_code: null, duration_ms: 0, hashes: null, source_revision: revision });
        continue;
      }
      record(await runOne({ ctx, testCase }));
    }
    for (const testCase of skillCases().filter(wanted)) {
      if (adapter.blocked?.[testCase.id]) {
        record({ host, case: testCase.id, kind: testCase.kind, status: 'blocked', cause: adapter.blocked[testCase.id], exit_code: null, duration_ms: 0, hashes: null, source_revision: revision });
        continue;
      }
      record(await runOne({ ctx, testCase }));
    }
  }

  persist();
  const s = summarise(payload);
  console.log(`docflow host qualification — source ${revision.slice(0, 12)}`);
  for (const host of ['product', ...hosts]) {
    const rows = results.filter((r) => (r.host || 'product') === host);
    if (!rows.length) continue;
    const by = (st) => rows.filter((r) => r.status === st).length;
    console.log(`  ${host.padEnd(9)} pass=${by('pass')} fail=${by('fail')} blocked=${by('blocked')} unrun=${by('unrun')}`);
  }
  console.log(`\nresults: ${outPath}`);
  console.log(`receipt: ${receiptPath}`);
  console.log(`totals: ${s.pass} pass, ${s.fail} fail, ${s.blocked} blocked, ${s.unrun} unrun`);
  process.exit(s.fail ? 1 : 0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error(e.stack || e.message); process.exit(1); });
}
