import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, cpSync, readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, realpathSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { validateWorkspace, parseRecord, parseMetadata, checkShape, lookupShort, proposeFilename } from '../plugins/docflow/workspace/validate.mjs';
import { adverse, materialise } from '../plugins/docflow/workspace/fixtures/materialise.mjs';
import { resolveAssets } from '../plugins/docflow/workspace/resolve-assets.mjs';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(repo, 'plugins/docflow/workspace');
const fixture = join(assets, 'fixtures/two-repository');
const manifest = JSON.parse(readFileSync(join(assets, 'fixtures/manifest.json'), 'utf8'));
const at = manifest.evaluated_at, paths = manifest.records;
const read = (root, name) => parseRecord(readFileSync(join(root, paths[name] || name), 'utf8'));
const write = (root, name, data) => writeFileSync(join(root, paths[name] || name), `---\n${JSON.stringify(data, null, 2)}\n---\n\n# Synthetic fixture\n`);
const edit = (root, name, fn) => { const data = read(root, name); fn(data); write(root, name, data); };
const registry = (root, fn) => { const p = join(root, '.docflow_workspace/workspace.yaml'); const data = JSON.parse(readFileSync(p, 'utf8')); fn(data); writeFileSync(p, JSON.stringify(data)); };
const result = (root, options = {}) => validateWorkspace(root, { at, ...options });
const valid = root => { const r = result(root); assert.equal(r.valid, true, JSON.stringify(r.diagnostics)); return r; };
const rejects = (root, code, options = {}) => { const r = result(root, options); assert.equal(r.valid, false); assert.ok(r.diagnostics.some(d => d.code === code), JSON.stringify(r.diagnostics)); return r; };
function scratch(fn, copy = true) {
  const parent = mkdtempSync(join(tmpdir(), 'docflow-workspace-test-'));
  const root = join(parent, 'workspace');
  try { if (copy) cpSync(fixture, root, { recursive: true }); return fn(root, parent); }
  finally {
    const target = realpathSync(parent), temp = realpathSync(tmpdir());
    assert.equal(dirname(target).toLowerCase(), temp.toLowerCase());
    assert.ok(basename(target).startsWith('docflow-workspace-test-'));
    rmSync(target, { recursive: true, force: true });
  }
}

test('producer fixture exposes partial delivery and distinct native methods', () => {
  const r = valid(fixture);
  assert.equal(r.records.length, 7);
  assert.equal(r.records.find(x => x.kind === 'decisions').state, 'accepted');
  assert.deepEqual(r.overview[0].deliveries.map(x => x.complete), [true, false]);
  assert.match(readFileSync(join(fixture, 'repos/api/AGENTS.md'), 'utf8'), /0012 is Implemented/);
  assert.match(readFileSync(join(fixture, 'repos/mobile/README.md'), 'utf8'), /MOBILE-12/);
});

for (const scenario of adverse) test(`adverse fixture: ${scenario.id}`, () => scratch(root => {
  materialise(scenario.id, root);
  for (const code of scenario.expected_codes) rejects(root, code);
}, false));

test('strict subset rejects duplicate decoded keys, non-JSON YAML and invalid dates', () => {
  for (const text of ['{"id":1,"id":2}', '{"id":1,"\\u0069d":2}', '{"a":[{"x":1,"x":2}]}', 'schema: 1', '{"schema":1,}', '---\n{}\n---']) assert.throws(() => parseMetadata(text));
  assert.deepEqual(parseMetadata('{"a":{"x":1},"b":{"x":2}}'), { a: { x: 1 }, b: { x: 2 } });
  assert.ok(checkShape({ ...read(fixture, 'reliable-exports'), created_at: '2026-02-30T08:00:00Z' }, 'ideas').length);
  assert.deepEqual(parseRecord('---\r\n{"title":"test"}\r\n---\r\n# Heading\r\n'), { title: 'test' });
  scratch(root => { const p = join(root, '.docflow_workspace/workspace.yaml'); writeFileSync(p, '{"schema":1,"schema":1}'); rejects(root, 'registry'); });
});

test('duplicate identities and ambiguous display references cannot overwrite records', () => scratch(root => {
  const original = read(root, 'legacy-client-observation');
  const duplicate = '.docflow_workspace/knowledge/duplicate--456789014444.md';
  write(root, duplicate, original); rejects(root, 'duplicate');
  rmSync(join(root, duplicate));
  const id = '45678901-4444-4555-8444-444444444444';
  const name = proposeFilename(result(root).records, original.home, id, 'another-observation');
  assert.equal(name, 'another-observation--4567890144444555.md');
  write(root, `.docflow_workspace/knowledge/${name}`, { ...original, id });
  const r = valid(root);
  assert.throws(() => lookupShort(r.records, original.home, '456789014444'), /ambiguous/);
  assert.equal(lookupShort(r.records, original.home, '4567890144444555').id, id);
  assert.throws(() => proposeFilename(r.records, original.home, id, 'duplicate'), /duplicate/);
  assert.equal(r.records.find(x => x.id === original.id).path, paths['legacy-client-observation']);
}));

test('published short suffix collisions require reconciliation even with different slugs', () => scratch(root => {
  const data = read(root, 'legacy-client-observation'); data.id = '45678901-4444-4555-8444-444444444444';
  write(root, '.docflow_workspace/knowledge/another--456789014444.md', data);
  rejects(root, 'short-collision');
}));

test('title changes preserve identity, path and append-only grant/history', () => scratch(root => {
  edit(root, 'reliable-exports', d => { d.title = 'A new readable title'; });
  assert.equal(result(root, { previous: fixture }).valid, true);
  edit(root, 'deliver-compatible-exports', d => { d.grants[0].revisions[0].reason = 'Rewrite historical mandate'; });
  rejects(root, 'history-rewrite', { previous: fixture });
}));

test('previous snapshot rejects path changes and unchanged scope revisions', () => scratch(root => {
  const data = read(root, 'legacy-client-observation');
  write(root, '.docflow_workspace/knowledge/renamed--456789014444.md', data);
  rmSync(join(root, paths['legacy-client-observation']));
  rejects(root, 'immutable', { previous: fixture });
  cpSync(fixture, root, { recursive: true }); rmSync(join(root, '.docflow_workspace/knowledge/renamed--456789014444.md'));
  edit(root, 'deliver-compatible-exports', d => { d.deliveries[0].scope = 'New delivery scope'; });
  rejects(root, 'scope-revision', { previous: fixture });
}));

test('planned work is valid with no grants, no attempts and unknown observations', () => scratch(root => {
  for (const f of readdirSync(join(root, '.docflow_workspace/runs'))) rmSync(join(root, '.docflow_workspace/runs', f));
  edit(root, 'deliver-compatible-exports', d => { d.state = 'planned'; d.history = d.history.slice(0, 1); d.grants = []; d.deliveries.forEach(x => { x.observation = { state: 'unknown', complete: false, observed_at: null, source_revision: null, evidence: [] }; }); });
  const r = valid(root); assert.equal(r.overview[0].state, 'planned'); assert.ok(r.overview[0].deliveries.every(x => !x.complete));
}));

test('manual empty skeleton is valid without invented memory or authority', () => scratch(root => {
  for (const kind of ['ideas', 'decisions', 'work', 'knowledge', 'runs']) for (const f of readdirSync(join(root, '.docflow_workspace', kind))) rmSync(join(root, '.docflow_workspace', kind, f));
  registry(root, d => { d.repositories = []; d.resources = []; });
  assert.equal(valid(root).records.length, 0);
}));

test('running attempt reuses current authority and detects expiry at explicit evaluation time', () => scratch(root => {
  edit(root, 'deliver-compatible-exports', d => { d.grants[2].revisions.pop(); });
  edit(root, 'mobile-revoked', d => { d.state = 'running'; d.history.pop(); d.ended_at = null; d.receipt = null; d.reconciliation = null; });
  valid(root);
  rejects(root, 'authority', { at: '2026-09-15T21:00:00Z' });
  edit(root, 'deliver-compatible-exports', d => { d.deliveries[1].scope_revision = 2; });
  rejects(root, 'authority');
}));

test('completed outcome leaves the current workspace agreement accepted', () => scratch(root => {
  edit(root, 'deliver-compatible-exports', d => {
    d.state = 'done'; d.history.push({ state: 'review', at: '2026-09-15T12:30:00Z', actor: 'human:owner', reason: 'Review all evidence' }, { state: 'done', at, actor: 'human:owner', reason: 'All declared criteria evidenced' });
    d.blockers = []; d.criteria[0].evidence = d.deliveries[0].observation.evidence;
    d.deliveries[1].observation = structuredClone(d.deliveries[0].observation);
    d.deliveries[1].observation.evidence[0].repository = 'example/mobile';
  });
  const r = valid(root); assert.equal(r.overview[0].state, 'done'); assert.equal(r.records.find(x => x.kind === 'decisions').state, 'accepted');
}));

test('explicit sibling and absolute member roots resolve while contained native paths stay bounded', () => scratch((root, parent) => {
  const sibling = join(parent, 'external-api'); cpSync(join(root, 'repos/api'), sibling, { recursive: true });
  registry(root, d => { d.repositories[0].path = '../external-api'; }); valid(root);
  registry(root, d => { d.repositories[0].path = sibling; }); valid(root);
  edit(root, 'api-reassigned', d => { d.brief.native_work.path = '../workspace/README.md'; }); rejects(root, 'native-path');
}));

test('native references cannot follow a symlink outside their declared member root', () => scratch((root, parent) => {
  const outside = join(parent, 'outside'); mkdirSync(outside); writeFileSync(join(outside, 'evidence.txt'), 'Outside declared member scope');
  symlinkSync(outside, join(root, 'repos/api/escape'), process.platform === 'win32' ? 'junction' : 'dir');
  edit(root, 'api-reassigned', d => { d.receipt.evidence[0].path = 'escape/evidence.txt'; });
  rejects(root, 'native-path');
}));

test('a second workspace resolves the same native member and detects overlapping assignment', () => scratch((root, parent) => {
  const other = join(parent, 'other'); cpSync(fixture, other, { recursive: true });
  const home = 'example/second';
  for (const kind of ['ideas', 'decisions', 'work', 'knowledge', 'runs']) for (const f of readdirSync(join(other, '.docflow_workspace', kind))) {
    const p = join(other, '.docflow_workspace', kind, f); writeFileSync(p, readFileSync(p, 'utf8').replaceAll('example/platform', home));
  }
  registry(other, d => { d.home = home; d.repositories[0].path = '../workspace/repos/api'; d.repositories[1].path = '../workspace/repos/mobile'; });
  registry(root, d => { d.external_homes.push({ home, path: '../other' }); });
  rejects(root, 'claim-overlap');
}));

test('shared resource conflicts are rejected across distinct repositories', () => scratch(root => {
  const first = read(root, 'api-interrupted'), last = read(root, 'mobile-revoked');
  for (const run of [first, last]) run.brief.resources = [{ resource: 'example/shared-staging', owner: run.brief.actor, start: '2026-09-15T09:00:00Z', end: '2026-09-15T13:00:00Z', source: run.brief.claim.source }];
  write(root, 'api-interrupted', first); write(root, 'mobile-revoked', last);
  rejects(root, 'resource-overlap');
}));

test('reference-only member can supply an authorised read/report attempt', () => scratch(root => {
  registry(root, d => { d.repositories[1].role = 'reference'; });
  edit(root, 'deliver-compatible-exports', d => { d.grants[2].revisions.forEach(g => { g.actions = ['read', 'report']; }); });
  edit(root, 'mobile-revoked', d => { d.actions[1].action = 'report'; });
  valid(root);
}));

test('supersession is reciprocal, acyclic and separate from work completion', () => scratch(root => {
  const original = read(root, 'preserve-legacy-response');
  const id = '89012345-8888-4888-8888-888888888888', path = '.docflow_workspace/decisions/replacement--890123458888.md';
  const next = structuredClone(original); next.id = id; next.title = 'Replacement agreement'; next.predecessors = [{ home: original.home, id: original.id, path: paths['preserve-legacy-response'] }];
  original.state = 'superseded'; original.history.push({ state: 'superseded', at, actor: 'human:owner', reason: 'A later agreement replaces this one' }); original.successors = [{ home: original.home, id, path }];
  write(root, 'preserve-legacy-response', original); write(root, path, next); valid(root);
  next.state = 'superseded'; next.history.push({ state: 'superseded', at, actor: 'human:owner', reason: 'Invalid cyclic replacement' }); next.successors = next.predecessors; original.predecessors = original.successors;
  write(root, 'preserve-legacy-response', original); write(root, path, next); rejects(root, 'cycle');
}));

test('duplicate native role aliases and missing pinned assets fail', () => scratch(root => {
  const role = read(root, '.docflow_workspace/agents/reviewer.md'); role.id = 'example/platform:other-reviewer';
  write(root, '.docflow_workspace/agents/other.md', role); rejects(root, 'native-alias');
}));

test('CLI emits readable incomplete records and non-zero status without writes', () => scratch(root => {
  registry(root, d => { d.repositories[0].path = 'missing'; });
  const before = readFileSync(join(root, paths['reliable-exports']));
  const command = spawnSync(process.execPath, [join(assets, 'validate.mjs'), root, '--at', at], { encoding: 'utf8' });
  assert.equal(command.status, 1, command.stderr); const output = JSON.parse(command.stdout);
  assert.ok(output.records.length > 0); assert.ok(output.diagnostics.length > 0); assert.equal(output.valid, false);
  assert.deepEqual(readFileSync(join(root, paths['reliable-exports'])), before);
}));

test('all five record and supporting templates match distributed schema definitions', () => {
  const templates = join(repo, 'plugins/docflow/skills/bootstrap/templates');
  for (const kind of ['ideas', 'decisions', 'work', 'knowledge', 'runs', 'role', 'profile']) assert.deepEqual(checkShape(parseRecord(readFileSync(join(templates, `workspace-${kind}.md`), 'utf8')), kind), []);
  for (const [file, def] of [['registry.yaml', 'registry'], ['sources.yaml', 'sources'], ['grant.json', 'grant'], ['brief.json', 'brief'], ['receipt.json', 'receipt'], ['recommendation.json', 'recommendation']]) assert.deepEqual(checkShape(parseMetadata(readFileSync(join(templates, `workspace-${file}`), 'utf8')), def), []);
});

test('every historical action requires an unexpired native claim', () => scratch(root => {
  edit(root, 'api-reassigned', d => { d.brief.claim.expires_at = '2026-09-15T10:05:01Z'; });
  rejects(root, 'claim');
}));

test('unregistered record home with resources returns diagnostics without throwing', () => scratch(root => {
  edit(root, 'api-reassigned', d => { d.home = 'unregistered-home'; d.brief.resources = [{ resource: 'example/shared-staging', owner: d.brief.actor, start: d.started_at, end: at, source: d.brief.claim.source }]; });
  rejects(root, 'home');
}));

test('unregistered work home never crashes a linked run diagnostic', () => scratch(root => {
  edit(root, 'deliver-compatible-exports', d => { d.home = 'unregistered-home'; });
  edit(root, 'api-reassigned', d => { d.brief.work.home = 'unregistered-home'; d.brief.grant.work.home = 'unregistered-home'; });
  rejects(root, 'home');
}));

test('JSON object key order has no effect on references or historical comparison', () => scratch(root => {
  edit(root, 'api-reassigned', d => { d.brief.native_work = Object.fromEntries(Object.entries(d.brief.native_work).reverse()); });
  valid(root); assert.equal(result(root, { previous: fixture }).valid, true);
}));

test('a native path move keeps the immutable brief resolvable at its Git tree revision', () => scratch(root => {
  const member = join(root, 'repos/api');
  function git(args, input) { const r = spawnSync('git', ['-C', member, ...args], { encoding: 'utf8', input }); assert.equal(r.status, 0, r.stderr); return r.stdout.trim(); }
  git(['init', '--quiet']);
  const blob = git(['hash-object', '-w', '--stdin'], readFileSync(join(member, 'work.md'), 'utf8'));
  const tree = git(['mktree'], `100644 blob ${blob}\twork.md\n`);
  for (const name of ['api-interrupted', 'api-reassigned']) edit(root, name, d => { d.brief.native_work.revision = tree; });
  edit(root, 'preserve-legacy-response', d => { d.adoption[0].revision = tree; });
  writeFileSync(join(member, 'done.md'), readFileSync(join(member, 'work.md'))); rmSync(join(member, 'work.md'));
  edit(root, 'deliver-compatible-exports', d => { d.deliveries[0].native_work.path = 'done.md'; });
  valid(root);
  edit(root, 'api-reassigned', d => { d.brief.native_work.revision = 'f'.repeat(40); });
  rejects(root, 'native-path');
}));

test('packaged plugin, npm, symlink and detached Codex/OpenCode skill copies resolve assets offline', () => scratch((root, parent) => {
  const bootstrap = join(repo, 'plugins/docflow/skills/bootstrap');
  for (const host of ['claude-code', 'cowork', 'pi-npm', 'codex-plugin', 'opencode-plugin']) {
    const plugin = join(parent, host); mkdirSync(join(plugin, 'skills'), { recursive: true });
    cpSync(bootstrap, join(plugin, 'skills/bootstrap'), { recursive: true }); cpSync(assets, join(plugin, 'workspace'), { recursive: true });
    assert.equal(resolveAssets(join(plugin, 'skills/bootstrap')), realpathSync(join(plugin, 'workspace')));
    const cli = spawnSync(process.execPath, [join(plugin, 'workspace/validate.mjs'), join(plugin, 'workspace/fixtures/two-repository'), '--at', at], { encoding: 'utf8' });
    assert.equal(cli.status, 0, cli.stderr || cli.stdout);
  }
  for (const host of ['.agents', '.config/opencode', '.claude']) {
    const install = join(parent, 'detached', host); mkdirSync(join(install, 'skills'), { recursive: true });
    cpSync(bootstrap, join(install, 'skills/bootstrap'), { recursive: true });
    assert.throws(() => resolveAssets(join(install, 'skills/bootstrap')), /assets unavailable/);
    cpSync(assets, join(install, 'docflow-workspace'), { recursive: true });
    assert.equal(resolveAssets(join(install, 'skills/bootstrap')), realpathSync(join(install, 'docflow-workspace')));
  }
  const link = join(parent, 'linked-bootstrap'); symlinkSync(bootstrap, link, process.platform === 'win32' ? 'junction' : 'dir');
  assert.equal(resolveAssets(link), realpathSync(assets));
  const pkg = JSON.parse(readFileSync(join(repo, 'package.json'), 'utf8'));
  assert.ok(pkg.files.includes('plugins/docflow/workspace/'));
}, false));

test('npm file allowlist includes real producer member files and validator assets', () => {
  // npm applies nested .gitignore unless a .npmignore overrides it. Check the
  // actual pack list, not only package.json or an ordinary filesystem copy.
  const options = { cwd: repo, encoding: 'utf8', windowsHide: true, timeout: 30000 };
  const r = process.platform === 'win32'
    ? spawnSync('npm pack --dry-run --json --ignore-scripts', { ...options, shell: true })
    : spawnSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], options);
  assert.equal(r.status, 0, r.stderr);
  const files = new Set(JSON.parse(r.stdout)[0].files.map(f => f.path));
  for (const p of ['validate.mjs', 'schema.json', 'CONTRACT.md', 'fixtures/materialise.mjs', 'fixtures/adverse.json', 'fixtures/two-repository/repos/api/AGENTS.md', 'fixtures/two-repository/repos/mobile/README.md', 'fixtures/two-repository/repos/api/work.md', 'fixtures/two-repository/repos/mobile/evidence.txt']) assert.ok(files.has(`plugins/docflow/workspace/${p}`), `missing packed ${p}`);
});
