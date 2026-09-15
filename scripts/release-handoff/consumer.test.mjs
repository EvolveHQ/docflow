// Real consumer/CLI with disposable bytes. GitHub network is replaced by an
// in-memory HTTP transport at fetch; these tests are NOT publication evidence.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';
import { lstatSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assetName, checksumBytes, checksumName, CONFIGURATIONS, jsonBytes, manifestName, PRODUCT, sha256 } from './contract.mjs';
import { approvalComment, prepare, releaseBody } from './consumer.mjs';
import { publicFixture } from './public-fixtures.mjs';
import { main } from './cli.mjs';
import { GitHub } from './github.mjs';
import { selectRelease } from './lookup.mjs';
import { stage } from './stage.mjs';

const target = 'a'.repeat(40);
const cli = fileURLToPath(new URL('./cli.mjs', import.meta.url));
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'docflow-public-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const dir = join(root, 'candidate'); const doc = publicFixture(dir);
  return { root, dir, doc, approval: join(root, 'approval.json') };
}
function seal(f) {
  const metadata = jsonBytes(f.doc);
  writeFileSync(join(f.dir, manifestName(f.doc.version)), metadata);
  writeFileSync(join(f.dir, checksumName(f.doc.version)), checksumBytes(f.doc, metadata));
}
function update(f, asset, bytes) {
  asset.size = bytes.length; asset.sha256 = sha256(bytes); writeFileSync(join(f.dir, asset.name), bytes); seal(f);
}
function approve(f) {
  const candidate = prepare(f.dir, f.doc.version, '0.9.4', target);
  writeFileSync(f.approval, jsonBytes({ plan: candidate.plan, authorisation: 'approve-publication-after-private-producer-and-native-trust-review' }));
  return candidate;
}
const argv = (f, command = 'publish') => [command, '--directory', f.dir, '--version', f.doc.version,
  '--counterpart', '0.9.4', '--target', target, ...(command === 'plan' ? [] : ['--approval', f.approval])];

class HttpFixture {
  constructor(candidate, existing = false) {
    this.requests = []; this.writes = []; this.bytes = new Map(); this.assets = [];
    this.releases = []; this.tag = null; this.fail = null; this.nextId = 1;
    this.candidate = candidate;
    if (existing) {
      this.releases = [{ id: 7, tag_name: candidate.plan.tag, name: `Clarity ${candidate.plan.version}`,
        body: releaseBody(candidate.plan), draft: false, prerelease: true }]; this.tag = target;
      for (const [name, bytes] of candidate.files) this.addAsset(name, bytes);
    }
  }
  addAsset(name, bytes) { const id = this.nextId++; this.assets.push({ id, name, size: bytes.length, state: 'uploaded' }); this.bytes.set(id, Buffer.from(bytes)); }
  apiFactory = ({ token }) => new GitHub({ token, fetchImpl: this.fetch });
  fetch = async (url, init) => {
    const u = new URL(url); const path = decodeURIComponent(u.pathname.replace('/repos/EvolveHQ/docflow', ''));
    const method = init.method ?? 'GET'; const request = { url, path, method, headers: init.headers, body: init.body };
    this.requests.push(request); if (method !== 'GET') this.writes.push(request);
    if (this.fail) { const response = this.fail(request); if (response) return response; }
    const json = value => new Response(JSON.stringify(value), { status: 200 });
    if (method === 'GET' && path === '') return json({ full_name: 'EvolveHQ/docflow', private: false });
    if (method === 'GET' && path === `/commits/${target}`) return json({ sha: target });
    if (method === 'GET' && path === '/releases') return json(this.releases);
    if (method === 'GET' && path.startsWith('/git/ref/tags/')) return this.tag ? json({ object: { type: 'commit', sha: this.tag } }) : new Response('', { status: 404 });
    if (method === 'GET' && /^\/releases\/\d+\/assets$/.test(path)) return json(this.assets);
    if (method === 'GET' && path.startsWith('/releases/assets/')) return new Response(this.bytes.get(Number(path.split('/').pop())));
    if (method === 'POST' && path === '/releases') {
      const release = { ...JSON.parse(init.body), id: 7 }; this.releases.push(release); return json(release);
    }
    if (method === 'POST' && path === '/releases/7/assets') { this.addAsset(u.searchParams.get('name'), init.body); return json(this.assets.at(-1)); }
    if (method === 'PATCH' && path === '/releases/7') { Object.assign(this.releases[0], JSON.parse(init.body)); this.tag = target; return json(this.releases[0]); }
    throw new Error(`Unexpected fixture request ${method} ${path}`);
  };
  run(f, command = 'publish') { return main(argv(f, command), { apiFactory: this.apiFactory, env: { GH_TOKEN: 'test-credential' }, output() {} }); }
}

test('five portable files retain pinned raw hashes and lengths', () => {
  const pin = JSON.parse(readFileSync(new URL('./public-contract-hashes.json', import.meta.url)));
  assert.equal(Object.keys(pin.files).length, 5);
  for (const [name, expected] of Object.entries(pin.files)) {
    const bytes = readFileSync(new URL(name, import.meta.url));
    assert.equal(sha256(bytes), expected.sha256, name); assert.equal(bytes.length, expected.bytes, name);
  }
});
test('offline command selects exact repository, tag, names and digest without API calls', async t => {
  const f = fixture(t); let calls = 0;
  const result = await main(argv(f, 'plan'), { apiFactory() { calls++; throw Error(); }, output() {} });
  assert.equal(calls, 0); assert.equal(result.repository, 'EvolveHQ/docflow'); assert.equal(result.tag, `clarity-v${f.doc.version}`);
  assert.deepEqual(result.assets.map(a => a.name), readdirSync(f.dir).sort());
  assert.equal(result.payloadSha256, sha256(jsonBytes(result.assets)));
  const process = spawnSync('node', argv(f, 'plan').toSpliced(0, 0, cli), { encoding: 'utf8' });
  assert.equal(process.status, 0, process.stderr); assert.deepEqual(JSON.parse(process.stdout), result);
});

const mutations = {
  'wrong product': f => { f.doc.product = 'docflow'; seal(f); },
  'wrong tag': f => { f.doc.tag = `v${f.doc.version}`; seal(f); },
  'wrong tag suffix': f => { f.doc.tag = 'clarity-v2.0.0'; seal(f); },
  'wrong version': f => { f.doc.version = '2.0.0'; },
  'invalid profile': f => { f.doc.assets[0].buildConfiguration = 'arbitrary'; seal(f); },
  'missing platform': f => { f.doc.assets = f.doc.assets.filter(a => a.os !== 'linux'); seal(f); },
  'missing configuration': f => {
    const additions = f.doc.assets.filter(a => a.os === 'windows').map(a => {
      const next = { ...a, buildConfiguration: 'minimal' }; next.name = assetName(f.doc.version, next);
      writeFileSync(join(f.dir, next.name), readFileSync(join(f.dir, a.name))); return next;
    }); f.doc.assets.push(...additions); seal(f);
  },
  'extra source archive': f => writeFileSync(join(f.dir, 'source.zip'), 'private'),
  'private field': f => { f.doc.provenance = 'private'; seal(f); },
  'path escape': f => { f.doc.assets[0].name = '../secret'; seal(f); },
  'invalid installer content': f => update(f, f.doc.assets[0], Buffer.alloc(1024)),
  'incorrect size': f => { f.doc.assets[0].size++; seal(f); },
  'incorrect hash': f => { f.doc.assets[0].sha256 = 'b'.repeat(64); seal(f); },
  'changed notice bytes': f => writeFileSync(join(f.dir, f.doc.assets.find(a => a.role === 'notices').name), 'changed notice\n'),
  'private notice': f => update(f, f.doc.assets.find(a => a.role === 'notices'), Buffer.from('C:\\private\\build\n')),
  'counterpart mismatch': f => { f.doc.compatibleDocflowVersion = '0.9.3'; seal(f); },
};
for (const [name, mutate] of Object.entries(mutations)) test(`${name} fails at real command boundary before any API access`, async t => {
  const f = fixture(t); const candidate = approve(f); mutate(f); const http = new HttpFixture(candidate);
  await assert.rejects(http.run(f)); assert.equal(http.requests.length, 0); assert.equal(http.writes.length, 0);
});
test('all finite profiles accept complete platform sets', t => {
  const f = fixture(t); const originals = [...f.doc.assets];
  for (const config of CONFIGURATIONS.filter(c => c !== 'full')) for (const a of originals) {
    const next = { ...a, buildConfiguration: config }; next.name = assetName(f.doc.version, next);
    writeFileSync(join(f.dir, next.name), readFileSync(join(f.dir, a.name))); f.doc.assets.push(next);
  }
  seal(f); assert.equal(approve(f).plan.assets.length, 12 * 12 + 2);
});
test('symbolic directory and ancestor links fail before API access', async t => {
  const f = fixture(t); const candidate = approve(f); const http = new HttpFixture(candidate);
  const linked = join(f.root, 'linked'); symlinkSync(f.dir, linked, process.platform === 'win32' ? 'junction' : 'dir');
  f.dir = linked; await assert.rejects(http.run(f), /linked/); assert.equal(http.requests.length, 0);
  const parent = join(f.root, 'parent'); symlinkSync(f.root, parent, process.platform === 'win32' ? 'junction' : 'dir');
  f.dir = join(parent, 'candidate'); await assert.rejects(http.run(f), /linked/); assert.equal(http.requests.length, 0);
});
test('linked candidate file is rejected without writes', async t => {
  const f = fixture(t); const candidate = approve(f); const http = new HttpFixture(candidate);
  const path = join(f.dir, f.doc.assets[0].name); const original = join(f.root, 'original');
  writeFileSync(original, readFileSync(path)); rmSync(path);
  // Hard links work without Windows symlink privileges and are also forbidden.
  const { linkSync } = await import('node:fs'); linkSync(original, path);
  await assert.rejects(http.run(f)); assert.equal(http.requests.length, 0); assert.equal(lstatSync(original).nlink, 2);
});
test('changed valid notice/approval, identity and target require renewed approval', async t => {
  const f = fixture(t); const candidate = approve(f); const http = new HttpFixture(candidate);
  update(f, f.doc.assets.find(a => a.role === 'notices'), Buffer.from('A different valid public notice.\n'));
  await assert.rejects(http.run(f), /approval/); assert.equal(http.requests.length, 0);
  for (const key of ['product', 'repository', 'version', 'tag', 'compatibleDocflowVersion', 'targetCommit', 'payloadSha256']) {
    approve(f); const approval = JSON.parse(readFileSync(f.approval)); approval.plan[key] = 'changed'; writeFileSync(f.approval, jsonBytes(approval));
    await assert.rejects(http.run(f), /approval/); assert.equal(http.requests.length, 0);
  }
});
test('API creation uploads exact bytes then verifies before publishing, never marks latest', async t => {
  const f = fixture(t); const candidate = approve(f); const http = new HttpFixture(candidate);
  const result = await http.run(f); assert.equal(result.status, 'published-authenticated-bytes-verified');
  assert.equal(http.writes.length, candidate.files.size + 2);
  const create = JSON.parse(http.writes[0].body);
  assert.equal(create.draft, true); assert.equal(create.target_commitish, target); assert.equal(create.make_latest, 'false'); assert.equal(create.generate_release_notes, false);
  assert.deepEqual(JSON.parse(http.writes.at(-1).body), { draft: false, make_latest: 'false' });
  const downloads = http.requests.filter(r => r.path.startsWith('/releases/assets/'));
  assert.equal(downloads.length, candidate.files.size * 2);
  for (const asset of http.assets) assert.deepEqual(http.bytes.get(asset.id), candidate.files.get(asset.name));
  assert.equal(http.requests.filter(r => r.method === 'DELETE').length, 0);
});
test('identical published retry reads all assets and makes zero writes', async t => {
  const f = fixture(t); const candidate = approve(f); const http = new HttpFixture(candidate, true);
  assert.equal((await http.run(f)).status, 'identical-no-op'); assert.equal(http.writes.length, 0);
  assert.equal(http.requests.filter(r => r.path.startsWith('/releases/assets/')).length, candidate.files.size);
});
for (const kind of ['differing bytes', 'missing asset', 'extra asset', 'duplicate asset', 'starter asset', 'complete draft', 'changed metadata', 'changed target']) test(`existing ${kind} is fully downloaded and preserved`, async t => {
  const f = fixture(t); const candidate = approve(f); const http = new HttpFixture(candidate, true);
  if (kind === 'differing bytes') http.bytes.get(1)[500] ^= 1;
  if (kind === 'missing asset') http.assets.pop();
  if (kind === 'extra asset') http.addAsset('../private.txt', Buffer.from('untrusted'));
  if (kind === 'duplicate asset') http.addAsset(http.assets[0].name, Buffer.from('duplicate'));
  if (kind === 'starter asset') http.assets[0].state = 'starter';
  if (kind === 'complete draft') http.releases[0].draft = true;
  if (kind === 'changed metadata') http.releases[0].body = 'changed';
  if (kind === 'changed target') http.tag = 'c'.repeat(40);
  await assert.rejects(http.run(f)); assert.equal(http.writes.length, 0);
  assert.equal(http.requests.filter(r => r.path.startsWith('/releases/assets/')).length, http.assets.length);
});
test('partial upload failure retains draft; retry makes no writes', async t => {
  const f = fixture(t); const candidate = approve(f); const http = new HttpFixture(candidate);
  http.fail = req => req.method === 'POST' && req.path.endsWith('/assets') && http.assets.length === 2 ? new Response('', { status: 502 }) : null;
  await assert.rejects(http.run(f), /release ID 7.*preserve/);
  assert.equal(http.releases[0].draft, true); assert.equal(http.assets.length, 2); assert.equal(http.tag, null);
  http.fail = null; http.writes = []; await assert.rejects(http.run(f), /incomplete/); assert.equal(http.writes.length, 0);
});
test('unknown create outcome stops without retries', async t => {
  const f = fixture(t); const candidate = approve(f); const http = new HttpFixture(candidate);
  http.fail = req => { if (req.method === 'POST') throw Error('lost connection'); };
  await assert.rejects(http.run(f), /creation outcome unknown/); assert.equal(http.writes.length, 1);
});
test('remote metadata drift during upload prevents publication and is preserved', async t => {
  const f = fixture(t); const candidate = approve(f); const http = new HttpFixture(candidate);
  http.fail = req => { if (req.method === 'POST' && req.path.endsWith('/assets')) http.releases[0].body = 'changed remotely'; };
  await assert.rejects(http.run(f), /uploaded byte verification/);
  assert.equal(http.releases[0].draft, true); assert.equal(http.releases[0].body, 'changed remotely');
  assert(http.writes.every(r => r.method !== 'PATCH'));
});
for (const failure of [401, 403, 404, 500, 'network']) test(`preflight ${failure} failure makes no writes`, async t => {
  const f = fixture(t); const candidate = approve(f); const http = new HttpFixture(candidate);
  http.fail = () => { if (failure === 'network') throw Error('offline'); return new Response('', { status: failure }); };
  await assert.rejects(http.run(f)); assert.equal(http.writes.length, 0);
});
test('download failure attempts every existing asset and preserves remote state', async t => {
  const f = fixture(t); const candidate = approve(f); const http = new HttpFixture(candidate, true);
  http.fail = req => req.path === '/releases/assets/1' ? new Response('', { status: 403 }) : null;
  await assert.rejects(http.run(f), /download failed/); assert.equal(http.writes.length, 0);
  assert.equal(http.requests.filter(r => r.path.startsWith('/releases/assets/')).length, candidate.files.size);
});
test('orphan tag fails before creation', async t => {
  const f = fixture(t); const candidate = approve(f); const http = new HttpFixture(candidate); http.tag = target;
  await assert.rejects(http.run(f), /tag exists/); assert.equal(http.writes.length, 0);
});
test('public verification ignores ambient credentials and downloads complete set', async t => {
  const f = fixture(t); const candidate = approve(f); const http = new HttpFixture(candidate, true);
  assert.equal((await http.run(f, 'verify-public')).status, 'unauthenticated-download-bytes-verified');
  assert(http.requests.every(r => !r.headers.Authorization)); assert.equal(http.writes.length, 0);
});
test('HTTP pagination visits all pages', async () => {
  const requests = []; const api = new GitHub({ fetchImpl: async url => { requests.push(url); return new Response(JSON.stringify(url.endsWith('page=1') ? Array.from({ length: 100 }, (_, id) => ({ id })) : [{ id: 100 }])); } });
  assert.equal((await api.listAssets(7)).length, 101); assert.equal(requests.length, 2);
});
test('binary download redirect strips credentials and preserves bytes', async () => {
  const requests = []; const bytes = Buffer.from([0, 255, 13, 10, 128]);
  const api = new GitHub({ token: 'test-credential', fetchImpl: async (url, init) => {
    requests.push({ url, init }); return requests.length === 1 ? new Response(null, { status: 302, headers: { location: 'https://release-assets.githubusercontent.com/asset' } }) : new Response(bytes);
  } });
  assert.deepEqual(await api.downloadAsset(1), bytes); assert(!requests[1].init.headers.Authorization);
});
test('unsafe download redirect is rejected without following it', async () => {
  let calls = 0; const api = new GitHub({ fetchImpl: async () => { calls++; return new Response(null, { status: 302, headers: { location: 'http://localhost/private' } }); } });
  await assert.rejects(api.downloadAsset(1)); assert.equal(calls, 1);
});
test('lookup isolates independent product releases and semantic ordering', () => {
  const releases = ['clarity-v99.0.0', 'v0.9.4', 'v0.10.0', 'clarity-v1.0.0', 'v02.0.0', 'v4.0.0-rc.1']
    .map(tag_name => ({ tag_name, draft: false, prerelease: tag_name.includes('-rc.') }));
  assert.equal(selectRelease(releases, 'docflow').tag, 'v0.10.0');
  assert.equal(selectRelease(releases, PRODUCT).tag, 'clarity-v99.0.0');
  assert.equal(selectRelease(releases, 'docflow', '4.0.0-rc.1').tag, 'v4.0.0-rc.1');
  assert.throws(() => selectRelease(releases, PRODUCT, '0.10.0'));
  assert.throws(() => selectRelease([...releases, { tag_name: 'v0.10.0+other', draft: false, prerelease: false }], 'docflow'), /ambiguous/);
});
test('environment protection guard rejects missing reviewers or self-review', async () => {
  for (const protection_rules of [[], [{ type: 'required_reviewers', reviewers: [{}], prevent_self_review: false }]]) {
    const api = new GitHub({ fetchImpl: async () => new Response(JSON.stringify({ protection_rules })) });
    await assert.rejects(api.checkApprovalEnvironment(), /independent/);
  }
});
test('environment review must authenticate the exact payload approval and cannot use bypass/self-review', async t => {
  const f = fixture(t); const { plan } = approve(f); const comment = approvalComment(plan);
  const environment = { id: 3, protection_rules: [{ type: 'required_reviewers', reviewers: [{}], prevent_self_review: true }] };
  let history = [{ state: 'approved', comment, environments: [{ id: 3, name: 'clarity-publication' }], user: { type: 'User', login: 'reviewer' } }];
  const api = new GitHub({ fetchImpl: async url => new Response(JSON.stringify(url.endsWith('/approvals') ? history : environment)) });
  const context = { runId: '1', actors: ['initiator'], comment };
  await api.checkApprovalEnvironment(context);
  for (const mutate of [() => { history[0].comment = 'approve something else'; }, () => { history[0].user.login = 'initiator'; }, () => { history[0].state = 'rejected'; }, () => { history = []; }]) {
    history = [{ state: 'approved', comment, environments: [{ id: 3, name: 'clarity-publication' }], user: { type: 'User', login: 'reviewer' } }]; mutate();
    await assert.rejects(api.checkApprovalEnvironment(context), /independent approval/);
  }
});
test('workflow staging rejects wrong run, archive bytes and artifact identity before file writes', async t => {
  const f = fixture(t); const zip = Buffer.from('synthetic ZIP transport'); const output = join(f.root, 'candidate.zip');
  const run = { head_sha: target, status: 'completed', conclusion: 'success' };
  const artifact = { workflow_run: { id: 1, head_sha: target }, expired: false, name: 'clarity-public-handoff', digest: `sha256:${sha256(zip)}` };
  const api = { async checkRepository() {}, async request(path) { return path.endsWith('/zip') ? zip : path.includes('/runs/') ? run : artifact; } };
  for (const mutate of [() => { run.head_sha = 'b'.repeat(40); }, () => { artifact.digest = `sha256:${'c'.repeat(64)}`; }, () => { artifact.name = 'private-build'; }]) {
    run.head_sha = target; artifact.digest = `sha256:${sha256(zip)}`; artifact.name = 'clarity-public-handoff'; mutate();
    await assert.rejects(stage({ artifactId: '2', runId: '1', target, output }, api));
    assert(!readdirSync(f.root).includes('candidate.zip'));
  }
});
