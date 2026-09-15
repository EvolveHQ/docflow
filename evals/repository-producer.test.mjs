import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync, realpathSync, mkdtempSync, cpSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { resolve, join, relative, dirname, basename, isAbsolute } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { renderRepositoryFixtures, sha256 } from '../scripts/produce-repository-fixtures.mjs';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const collection = join(repo, 'plugins/docflow/workspace/repository-fixtures');
const read = p => readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const manifest = JSON.parse(read(join(collection, 'manifest.json')));
const sources = Object.fromEntries(Object.keys(manifest.sources).map(p => [p, read(join(collection, 'sources', p))]));
function scratch(fn) {
  const temp = mkdtempSync(join(tmpdir(), 'docflow-producer-test-'));
  try { return fn(temp); } finally {
    const actual = realpathSync(temp);
    assert.equal(dirname(actual).toLowerCase(), realpathSync(tmpdir()).toLowerCase());
    assert.ok(basename(actual).startsWith('docflow-producer-test-'));
    rmSync(actual, { recursive: true, force: true });
  }
}

// An independent, bounded assertion reader. This is not a shipped consumer.
function inspect(root) {
  const diagnostics = [], marker = join(root, '.docflow');
  let home;
  if (existsSync(marker)) {
    if (statSync(marker).isDirectory()) home = marker;
    else {
      const match = read(marker).match(/^root: ([^\n]+)\n?$/);
      const value = match?.[1];
      if (!value || isAbsolute(value) || /[\\:]/.test(value) || value.split('/').includes('..')) return { diagnostics: ['invalid-pointer'] };
      home = resolve(root, value);
      if (!existsSync(join(home, 'CONVENTIONS.md'))) return { diagnostics: ['invalid-pointer'] };
    }
  } else home = ['docs', '.'].map(p => join(root,p)).find(p => existsSync(join(p,'CONVENTIONS.md')));
  if (!home) return { diagnostics:['unknown-root'] };
  const conventional = read(join(home,'CONVENTIONS.md'));
  const declared = conventional.match(/Artefact root: `([^`]+)`/)?.[1];
  if (declared && resolve(root,declared) !== resolve(home)) diagnostics.push('root-disagreement');
  const list = readdirSync(join(home,'adr')).filter(p => /^\d+-.*\.md$/.test(p));
  const legacy = list.includes('0100-template.md');
  if (legacy) diagnostics.push('migration-available');
  const records = [], numbers = new Set();
  for (const path of list.filter(p => !/^0000-|template/.test(p))) {
    const text = read(join(home,'adr',path)), fm = text.split('---')[1];
    const metadata = Object.fromEntries([...fm.matchAll(/^([\w-]+):\s*([^\n]*)$/gm)].map(m => [m[1],m[2]]));
    const number = Number(metadata.adr);
    if (numbers.has(number)) diagnostics.push('duplicate-number'); numbers.add(number);
    if (!['Proposed','Accepted','Implemented','Superseded','Deprecated'].includes(metadata.status)) diagnostics.push('unknown-status');
    const shape = metadata.shape || (legacy && (number >= 100 || /## Decision\n/.test(text)) ? 'technology' : 'capability');
    if (!['capability','technology'].includes(shape)) diagnostics.push('unknown-shape');
    records.push({ number, shape, state:metadata.status, path });
  }
  return { root:relative(root,home).replaceAll('\\','/') || '.', records, diagnostics };
}

test('every file reproduces from exact producing sources and declared hashes', () => {
  assert.match(manifest.producer_revision, /^[0-9a-f]{40}$/);
  for (const [path,meta] of Object.entries(manifest.sources)) {
    assert.equal(sha256(sources[path]),meta.sha256,path);
    assert.equal(sha256(read(join(repo,path))),meta.sha256,'current producing source drift: '+path);
  }
  const rendered = renderRepositoryFixtures(sources,manifest.producer_revision);
  assert.deepEqual(rendered.manifest,manifest);
  for (const [path,file] of Object.entries(rendered.files)) {
    assert.equal(read(join(collection,path)),file.content,path);
    assert.equal(sha256(file.content),manifest.files[path].sha256,path);
    assert.ok(file.origins.length);
  }
});

for (const c of manifest.cases) test('native producer semantics: '+c.id, () => {
  const root = join(collection,'cases',c.id), result = inspect(root);
  assert.deepEqual([...new Set(result.diagnostics)].sort(),c.expected_diagnostics.sort());
  if (!c.expected_diagnostics.includes('invalid-pointer')) assert.equal(result.root,c.root);
  if (c.encoding === 'explicit-two-shape') assert.deepEqual(result.records.map(r=>r.shape).sort(),['capability','technology']);
  if (c.id === 'default-root') assert.equal(existsSync(join(root,'.docflow/plan')),false);
  if (c.id === 'optional-layers') {
    for (const path of ['plan/README.md','_agent/prompts/autonomous.md','GLOSSARY.md','domains/platform/README.md']) assert.ok(existsSync(join(root,'.docflow',path)));
  }
  if (c.status) {
    const item = read(join(root,'plan/todo/0001-example.md'));
    assert.match(item,/Claimed by: fixture-executor/);
    assert.match(item,/work\/0001-example/);
    assert.equal(/Blockers: Required/.test(item),c.blockers);
    assert.equal(/Stopped: 2026/.test(item),c.status === 'stopped');
    if (c.blockers) assert.match(item,/next step restore dependency and rerun/);
  }
});

test('legacy history and identifiers remain exact after nested placement', () => {
  const c = manifest.cases.find(c=>c.id === 'legacy-two-range');
  for (const path of c.preserved_history) assert.equal(
    read(join(collection,'cases/legacy-two-range/docs',path.replace('evals/fixtures/legacy-range/',''))),sources[path]);
  const numbers = inspect(join(collection,'cases/legacy-two-range')).records.map(r=>r.number);
  assert.deepEqual(numbers,[1,2,3,101,102]);
});

test('explicit current shape takes precedence over a historical range', () => scratch(temp => {
  cpSync(join(collection,'cases/legacy-two-range'),temp,{recursive:true});
  const path = join(temp,'docs/adr/0101-markdown-files-in-git.md');
  writeFileSync(path,read(path).replace('status:','shape: capability\nstatus:'));
  assert.equal(inspect(temp).records.find(r=>r.number===101).shape,'capability');
}));

test('federation preserves two homes with duplicate local numbers and diagnoses absent members', () => {
  const home = join(collection,'cases/federation-home'), member = join(collection,'cases/federation-member');
  assert.equal(inspect(home).records[0].number,inspect(member).records[0].number);
  const index = read(join(home,'federation-index.md'));
  assert.match(index,/\| member \| Federation member \| member \| \.\.\/federation-member \|/);
  assert.match(read(join(member,'docs/federation.md')), /\*\*Home:\*\* \.\.\/federation-home/);
  const pointers = [...index.matchAll(/^\| (home|member) \|[^\n]+\| ([^|]+) \|$/gm)].map(m=>m[2].trim());
  for (const pointer of pointers) assert.ok(existsSync(resolve(home,pointer==='this repo'?'.':pointer)));
  assert.equal(existsSync(resolve(home,'../missing-member')),false);
});

test('real local Git history separates prepared completion from merge and preserves the move', () => scratch(temp => {
  const root = join(temp,'repo'); cpSync(join(collection,'cases/status-resumed'),root,{recursive:true});
  const env = Object.fromEntries(Object.entries(process.env).filter(([k])=>!/^GIT_/i.test(k)));
  const git = args => {
    const r = spawnSync('git',['-C',root,'-c','user.name=Synthetic fixture','-c','user.email=fixture@example.invalid',
      '-c','commit.gpgsign=false','-c','core.hooksPath='+join(temp,'no-hooks'),...args],{env,encoding:'utf8'});
    assert.equal(r.status,0,r.stderr); return r.stdout.trim();
  };
  git(['init','--quiet','--initial-branch=main']); git(['add','.']); git(['commit','--quiet','-m','Synthetic initial state']);
  const initial = git(['rev-parse','HEAD']);
  git(['switch','--quiet','-c','work/0001-example']);
  mkdirSync(join(root,'plan/done'),{recursive:true});
  git(['mv','plan/todo/0001-example.md','plan/done/2026-09-15-synthetic-implementation.md']);
  cpSync(join(collection,'cases/completion-prepared'),root,{recursive:true});
  git(['add','.']); git(['commit','--quiet','-m','Synthetic prepared completion']);
  const prepared = git(['rev-parse','HEAD']);
  assert.equal(git(['rev-parse','main']),initial);
  assert.equal(git(['branch','--contains',prepared]).includes('main'),false);
  git(['switch','--quiet','main']); git(['merge','--quiet','--no-ff','work/0001-example','-m','Synthetic checked integration']);
  assert.equal(git(['rev-list','--parents','-n','1','HEAD']).split(' ').length,3);
  assert.equal(git(['branch','--contains',prepared]).includes('main'),true);
  assert.equal(existsSync(join(root,'plan/todo/0001-example.md')),false);
  assert.match(git(['show',initial+':plan/todo/0001-example.md']),/fixture-executor/);
  assert.match(read(join(root,'adr/0001-synthetic-capability.md')),/status: Implemented/);
}));
