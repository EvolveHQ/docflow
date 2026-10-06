import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, cpSync, readFileSync, writeFileSync, rmSync, readdirSync, realpathSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { validateWorkspace, parseRecord, parseMetadata, checkShape } from '../plugins/docflow/workspace/validate.mjs';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(repo, 'plugins/docflow/workspace');
const fixture = join(assets, 'fixtures/two-repository');
const manifest = JSON.parse(readFileSync(join(assets, 'fixtures/manifest.json'), 'utf8'));
const at = manifest.evaluated_at, paths = manifest.records;
const read = (root, name) => parseRecord(readFileSync(join(root, paths[name] || name), 'utf8'));
const write = (root, name, data) => writeFileSync(join(root, paths[name] || name), `---\n${JSON.stringify(data, null, 2)}\n---\n\n# Synthetic fixture\n`);
const edit = (root, name, fn) => { const data = read(root, name); fn(data); write(root, name, data); };
const registry = (root, fn) => { const p = join(root, '.docflow_workspace/workspace.yaml'); const data = JSON.parse(readFileSync(p, 'utf8')); fn(data); writeFileSync(p, JSON.stringify(data)); };
const sources = (root, fn) => { const p = join(root, '.docflow_workspace/integrations/sources.yaml'); const data = JSON.parse(readFileSync(p, 'utf8')); fn(data); writeFileSync(p, JSON.stringify(data)); };
const result = (root, options = {}) => validateWorkspace(root, { at, ...options });
const valid = root => { const r = result(root); assert.equal(r.valid, true, JSON.stringify(r.diagnostics)); return r; };
const rejects = (root, code, options = {}) => { const r = result(root, options); assert.equal(r.valid, false); assert.ok(r.diagnostics.some(d => d.code === code), JSON.stringify(r.diagnostics)); return r; };
const reject_strict = (root, code) => rejects(root, code);
function scratch(fn, copy = true) {
  const parent = mkdtempSync(join(tmpdir(), 'docflow-contract-r2-'));
  const root = join(parent, 'workspace');
  try { if (copy) cpSync(fixture, root, { recursive: true }); return fn(root, parent); }
  finally {
    const target = realpathSync(parent), temp = realpathSync(tmpdir());
    assert.equal(dirname(target).toLowerCase(), temp.toLowerCase());
    assert.ok(basename(target).startsWith('docflow-contract-r2-'));
    rmSync(target, { recursive: true, force: true });
  }
}
const external = extra => ({ locator: 'https://spec.example.invalid/api', digest: 'sha256:' + 'a'.repeat(64), observer: 'human:owner', observed_at: '2026-09-15T08:05:00Z', outcome: 'passed', summary: 'External specification observed by digest.', ...extra });

// 1. Content-addressed external knowledge source.
test('content-addressed external knowledge source validates without a local Git root', () => scratch(root => {
  edit(root, 'legacy-client-observation', d => { d.sources.push(external()); });
  valid(root);
}));
test('adverse: malformed external source digest is rejected', () => scratch(root => {
  edit(root, 'legacy-client-observation', d => { d.sources.push(external({ digest: 'sha256:short' })); });
  rejects(root, 'schema');
}));
test('adverse: external source without an observer is rejected', () => scratch(root => {
  edit(root, 'legacy-client-observation', d => { const s = external(); delete s.observer; d.sources.push(s); });
  rejects(root, 'schema');
}));

// 2. Remote-only reference member.
test('remote-only reference member validates and its native refs are identity-only', () => scratch(root => {
  registry(root, d => { d.repositories.push({ id: 'example/specs', aliases: [], remote: 'https://git.example.invalid/specs.git', role: 'reference' }); });
  edit(root, 'legacy-client-observation', d => { d.sources.push({ repository: 'example/specs', path: 'SPEC.md', revision: 'a'.repeat(40), observed_at: '2026-09-15T08:06:00Z', outcome: 'passed', summary: 'Remote-only identity reference.' }); });
  valid(root);
}));
test('adverse: remote-only member with delivery role is rejected', () => scratch(root => {
  registry(root, d => { d.repositories.push({ id: 'example/specs', aliases: [], remote: 'https://git.example.invalid/specs.git', role: 'delivery' }); });
  rejects(root, 'schema');
}));
test('adverse: remote-only member without a scheme is rejected', () => scratch(root => {
  registry(root, d => { d.repositories.push({ id: 'example/specs', aliases: [], remote: 'not-a-url', role: 'reference' }); });
  rejects(root, 'member-remote');
}));
test('adverse: mutating action against a remote-only reference member is rejected', () => scratch(root => {
  registry(root, d => { const m = d.repositories[1]; delete m.path; delete m.instructions; m.remote = 'https://git.example.invalid/mobile.git'; m.role = 'reference'; });
  rejects(root, 'reference-only');
}));

// 3. Revision existence in a local Git member.
function gitMember(member, args, input) { const r = spawnSync('git', ['-C', member, ...args], { encoding: 'utf8', input }); assert.equal(r.status, 0, r.stderr); return r.stdout.trim(); }
function gitTree(member, files) {
  const entries = files.map(f => `100644 blob ${gitMember(member, ['hash-object', '-w', '--stdin'], readFileSync(join(member, f), 'utf8'))}\t${f}`);
  return gitMember(member, ['mktree'], entries.join('\n') + '\n');
}
const pinAll = (tree, node) => { if (!node || typeof node !== 'object') return; for (const [k, v] of Object.entries(node)) { if (typeof v === 'string' && /^[0-9a-f]{40}$/.test(v)) node[k] = tree; else pinAll(tree, v); } };
test('a cited revision must contain the file in a local Git member', () => scratch(root => {
  const member = join(root, 'repos/api');
  gitMember(member, ['init', '--quiet']);
  const tree = gitTree(member, ['AGENTS.md', 'evidence.txt', 'work.md']);
  for (const name of Object.keys(paths)) edit(root, name, d => pinAll(tree, d));
  valid(root);
  const withoutWork = gitTree(member, ['AGENTS.md', 'evidence.txt']);
  edit(root, 'api-interrupted', d => { d.brief.native_work.revision = withoutWork; });
  rejects(root, 'native-revision');
}));

// 4. Derived documentation registration.
test('sources.yaml derived-documentation registration validates', () => scratch(root => {
  sources(root, d => { d.documents = [{ id: 'api-spec', locator: 'https://spec.example.invalid/api.md', digest: 'sha256:' + 'b'.repeat(64), observer: 'human:owner', observed_at: '2026-09-15T08:07:00Z' }]; });
  valid(root);
}));
test('adverse: a vendored derived-document locator is rejected', () => scratch(root => {
  sources(root, d => { d.documents = [{ id: 'api-spec', locator: '.docflow_workspace/workspace.yaml', digest: 'sha256:' + 'b'.repeat(64), observer: 'human:owner', observed_at: '2026-09-15T08:07:00Z' }]; });
  rejects(root, 'vendored-document');
}));

// 5. Imported execution-history evidence.
function importedRun(home) {
  return {
    schema: 1, id: '99999999-9999-4999-8999-999999999999', home, kind: 'runs', title: 'Imported history',
    owner: 'human:owner', created_at: '2026-09-15T09:30:00Z', links: [],
    state: 'succeeded',
    history: [{ state: 'running', at: '2026-09-15T09:30:00Z', actor: 'human:owner', reason: 'Imported historic attempt' }, { state: 'succeeded', at: '2026-09-15T10:00:00Z', actor: 'human:owner', reason: 'Imported native result' }],
    started_at: '2026-09-15T09:30:00Z', ended_at: '2026-09-15T10:00:00Z', brief: null,
    actions: [], receipt: null, reconciliation: null, predecessors: [], successors: [],
    import: { imported_at: '2026-09-15T10:05:00Z', observer: 'human:owner', evidence: [{ repository: 'example/api', path: 'evidence.txt', revision: '1'.repeat(40), observed_at: '2026-09-15T10:00:00Z', outcome: 'passed', summary: 'Imported historical evidence.' }] },
  };
}
test('imported-execution run validates without a workspace brief or grant', () => scratch(root => {
  write(root, '.docflow_workspace/runs/imported-history--999999999999.md', importedRun('example/platform'));
  valid(root);
}));
test('adverse: imported evidence cannot also carry a dispatch brief', () => scratch(root => {
  const run = importedRun('example/platform');
  run.brief = read(root, 'api-interrupted').brief;
  write(root, '.docflow_workspace/runs/imported-history--999999999999.md', run);
  rejects(root, 'import-brief');
}));
test('adverse: imported history never satisfies an active work-state check', () => scratch(root => {
  for (const f of readdirSync(join(root, '.docflow_workspace/runs'))) rmSync(join(root, '.docflow_workspace/runs', f));
  write(root, '.docflow_workspace/runs/imported-history--999999999999.md', importedRun('example/platform'));
  rejects(root, 'work-state');
}));

test('distributed templates cover the revision-2 forms', () => {
  const templates = join(repo, 'plugins/docflow/skills/bootstrap/templates');
  assert.deepEqual(checkShape(parseRecord(readFileSync(join(templates, 'workspace-knowledge.md'), 'utf8')), 'knowledge'), []);
  assert.deepEqual(checkShape(parseMetadata(readFileSync(join(templates, 'workspace-sources.yaml'), 'utf8')), 'sources'), []);
  const imported = parseRecord(readFileSync(join(templates, 'workspace-run-import.md'), 'utf8'));
  assert.deepEqual(checkShape(imported, 'runs'), []);
  assert.equal(imported.brief, null);
  assert.ok(imported.import && imported.import.evidence.length === 1);
});

// 7. Committed operator mandate note.
function mandateRecord() {
  return { schema: 1, id: 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee', home: 'example/platform', kind: 'mandate',
    title: 'Operator mandate: probe', owner: 'human:owner', created_at: '2026-09-15T07:00:00Z', links: [],
    scope: 'Authorise only the named scoped work.', authorised: ['Record the acceptance.'],
    accepted: ['The scoped probe.'], predecessors: [], successors: [] };
}
const mandatePath = '.docflow_workspace/mandates/2026-09-15-probe.md';
const citeMandate = { repository: 'example/platform', path: mandatePath, revision: '1'.repeat(40), observed_at: '2026-09-15T08:00:00Z', outcome: 'passed', summary: 'Committed operator mandate note.' };
test('a committed mandate note validates and can source a decision acceptance', () => scratch(root => {
  mkdirSync(join(root, '.docflow_workspace/mandates'), { recursive: true });
  write(root, mandatePath, mandateRecord());
  edit(root, 'preserve-legacy-response', d => { d.acceptance.mandate = citeMandate; });
  valid(root);
}));
test('adverse: evidence citing a non-validated mandate path is rejected', () => scratch(root => {
  mkdirSync(join(root, '.docflow_workspace/mandates'), { recursive: true });
  write(root, mandatePath, { ...mandateRecord(), kind: 'ideas' });
  edit(root, 'preserve-legacy-response', d => { d.acceptance.mandate = citeMandate; });
  rejects(root, 'mandate-source');
}));
test('adverse: a chat message alone is not a mandate source', () => scratch(root => {
  edit(root, 'preserve-legacy-response', d => { d.acceptance.mandate = { observed_at: '2026-09-15T08:00:00Z', outcome: 'passed', summary: 'Operator said so in chat.' }; });
  rejects(root, 'schema');
}));
test('distributed mandate template matches the schema', () => {
  const t = parseRecord(readFileSync(join(repo, 'plugins/docflow/skills/bootstrap/templates/workspace-mandate.md'), 'utf8'));
  assert.deepEqual(checkShape(t, 'mandate'), []);
});

// 8. Mandate loader robustness, home+path keying and dispatch routing.
test('a malformed mandate file does not abort loading valid ones', () => scratch(root => {
  mkdirSync(join(root, '.docflow_workspace/mandates'), { recursive: true });
  write(root, mandatePath, mandateRecord());
  writeFileSync(join(root, '.docflow_workspace/mandates/2026-09-15-bad.md'), 'not-front-matter');
  edit(root, 'preserve-legacy-response', d => { d.acceptance.mandate = citeMandate; });
  const r = result(root);
  assert.ok(r.diagnostics.some(d => d.code === 'mandate'), JSON.stringify(r.diagnostics));
  assert.ok(!r.diagnostics.some(d => d.code === 'mandate-source'), JSON.stringify(r.diagnostics));
}));
test('a missing mandates directory is valid, but a non-file entry is a diagnostic', () => scratch(root => {
  valid(root);
  mkdirSync(join(root, '.docflow_workspace/mandates/not-a-note'), { recursive: true });
  reject_strict(root, 'mandate-file');
}));
test('a mandate citation is keyed by home and path, never by path alone', () => scratch((root, parent) => {
  mkdirSync(join(root, '.docflow_workspace/mandates'), { recursive: true });
  write(root, mandatePath, mandateRecord());
  const other = join(parent, 'other-home');
  cpSync(fixture, other, { recursive: true });
  const home = 'example/other';
  for (const kind of ['ideas', 'decisions', 'work', 'knowledge', 'runs']) for (const f of readdirSync(join(other, '.docflow_workspace', kind))) {
    const p = join(other, '.docflow_workspace', kind, f);
    writeFileSync(p, readFileSync(p, 'utf8').replaceAll('example/platform', home));
  }
  registry(other, d => { d.home = home; d.repositories = []; d.resources = []; });
  edit(other, 'preserve-legacy-response', d => { d.acceptance.mandate = { ...citeMandate, repository: home }; });
  registry(root, d => { d.external_homes.push({ home, path: '../other-home' }); });
  // home B has no mandate note at that path; home A does. The keying must not let A's note satisfy B.
  rejects(root, 'mandate-source');
}));
test('no skill text routes reconciliation to workspace-dispatch', () => {
  const dispatch = readFileSync(join(repo, 'plugins/docflow/skills/workspace-dispatch/SKILL.md'), 'utf8');
  assert.ok(!/reconciled terminal receipt/.test(dispatch), 'dispatch still owns a reconciled stopping point');
  assert.ok(!/\*\*Effects:\*\*[^\n]*reconcil/i.test(dispatch), 'dispatch still claims reconcile effects');
  assert.ok(!/reconciliation identity/.test(dispatch), 'dispatch still claims reconciliation identity');
});

test('a mandates path that is not a readable directory yields a diagnostic, not a crash', () => scratch(root => {
  rmSync(join(root, '.docflow_workspace/mandates'), { recursive: true, force: true });
  writeFileSync(join(root, '.docflow_workspace/mandates'), 'not a directory');
  rejects(root, 'mandate-path');
  const command = spawnSync(process.execPath, [join(assets, 'validate.mjs'), root, '--at', at], { encoding: 'utf8' });
  assert.equal(command.status, 1, command.stderr);
  const out = JSON.parse(command.stdout);
  assert.equal(out.valid, false);
  assert.ok(out.diagnostics.some(d => d.code === 'mandate-path'), JSON.stringify(out.diagnostics));
}));
