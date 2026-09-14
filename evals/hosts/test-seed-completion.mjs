import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname, basename } from 'node:path';
import { execFileSync } from 'node:child_process';
import { checkSeedCompletion } from './check-seed-completion.mjs';

function fixture(run, root = '.') {
  const repo = mkdtempSync(join(tmpdir(), 'docflow-seed-check-'));
  const git = (...args) => execFileSync('git', ['-c', 'commit.gpgsign=false', '-c', 'user.name=docflow-test',
    '-c', 'user.email=test@example.invalid', ...args], { cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const path = (name) => root === '.' ? name : `${root}/${name}`;
  const done = path('plan/done/2026-09-14-adopt-adr-method.md');
  const write = (name, body) => { mkdirSync(join(repo, name, '..'), { recursive: true }); writeFileSync(join(repo, name), body); };
  const commit = (message) => { git('add', '.'); git('commit', '-qm', message); return git('rev-parse', 'HEAD'); };
  const body = (footer) => `# Adopt method\n\nOwning ADR: adr/0001-method.md\n\n## Shipped\n\n${footer}\n`;
  const precise = `Shipped by bootstrap introduction: \`${done}\`.\nResolve: \`git log --follow --diff-filter=A --format=%H -- "${done}"\``;
  const scaffold = (footer = precise, status = 'Implemented') => {
    for (const name of ['AGENTS.md', 'CLAUDE.md', path('CONVENTIONS.md'), path('adr/0000-template.md'), path('plan/README.md')]) write(name, '# Scaffold\n');
    write(path('INDEX.md'), '[0001](adr/0001-method.md) | Implemented\n');
    write(path('adr/0001-method.md'), `---\nadr: 0001\ntitle: Adopt method\nstatus: ${status}\n---\n# Adopt method\n`);
    write(done, body(footer));
  };
  try {
    git('init', '-q', '-b', 'main');
    run({ repo, root, git, path, done, write, commit, body, precise, scaffold,
      check: (options = {}) => checkSeedCompletion(repo, { root, ...options }) });
  } finally {
    // Only this uniquely created test directory is removed.
    assert.equal(dirname(resolve(repo)), resolve(tmpdir()));
    assert(basename(repo).startsWith('docflow-seed-check-'));
    rmSync(repo, { recursive: true, force: true });
  }
}

test('precise seed reference resolves the introduction after later work', () => fixture((f) => {
  f.scaffold(); const first = f.commit('test: scaffold');
  f.write('later.txt', 'later\n'); f.commit('test: later work');
  assert.equal(f.check().reference, first);
}));
test('reference resolves under an artefact root containing a space', () => fixture((f) => {
  f.scaffold(); f.commit('test: nested scaffold'); assert.equal(f.check().done, f.done);
}, 'project docs'));
test('generic hashless bootstrap label is rejected', () => fixture((f) => {
  f.scaffold('Shipped by the bootstrap scaffolding commit; see git log.'); f.commit('test: vague footer');
  assert.throws(() => f.check(), /lacks a verified-work SHA/);
}));
test('another path cannot stand in for the seed record', () => fixture((f) => {
  f.scaffold(f.precise.replaceAll(f.done, 'plan/done/another.md')); f.commit('test: wrong reference');
  assert.throws(() => f.check(), /names another path/);
}));
test('a deleted and reintroduced record is ambiguous', () => fixture((f) => {
  f.scaffold(); f.commit('test: first introduction');
  f.git('rm', f.done); f.commit('test: remove record');
  f.write(f.done, f.body(f.precise)); f.commit('test: second introduction');
  assert.throws(() => f.check(), /no unique introducing commit/);
}));
test('a reachable probe-only SHA is not scaffold evidence', () => fixture((f) => {
  f.write('marker.txt', 'probe\n'); const probe = f.commit('test: probe');
  f.scaffold(`Shipped at HEAD ${probe}`); f.commit('test: scaffold');
  assert.throws(() => f.check(), /AGENTS.md/);
}));
test('a signed profile rejects an unsigned introduction', () => fixture((f) => {
  f.scaffold(); f.commit('test: unsigned scaffold');
  assert.throws(() => f.check({ signed: true }), /signature is not verified/);
}));
test('later seed status repair cannot legitimise the introduction', () => fixture((f) => {
  f.scaffold(f.precise, 'Accepted'); f.commit('test: incomplete introduction');
  f.write(f.path('adr/0001-method.md'), '---\nadr: 0001\nstatus: Implemented\n---\n# Adopt method\n'); f.commit('test: later status');
  assert.throws(() => f.check(), /Implemented seed/);
}));
test('an ordinary verified scaffold ancestor remains valid', () => fixture((f) => {
  f.scaffold('Provisional historical record.'); const scaffold = f.commit('test: scaffold');
  f.write(f.done, f.body(`Shipped at HEAD ${scaffold}`)); f.commit('test: record verified work');
  assert.equal(f.check().reference, scaffold);
}));
test('an unresolved SHA is rejected', () => fixture((f) => {
  f.scaffold(`Shipped at HEAD ${'f'.repeat(40)}`); f.commit('test: fabricated reference');
  assert.throws(() => f.check());
}));
test('the seed-only form cannot document another decision', () => fixture((f) => {
  f.scaffold(); f.write(f.done, f.body(f.precise).replace('0001-method.md', '0002-feature.md')); f.commit('test: wrong owner');
  assert.throws(() => f.check(), /does not own the seed/);
}));
test('a seed-labelled link to another path is rejected', () => fixture((f) => {
  f.scaffold(); f.write(f.done, f.body(f.precise).replace('Owning ADR: adr/0001-method.md', 'Owning ADR: [adr/0001-method.md](../../other/0001-method.md)'));
  f.commit('test: misleading ownership label'); assert.throws(() => f.check(), /does not own the seed/);
}));
test('a verified-work footer does not need a particular heading', () => fixture((f) => {
  f.scaffold('Historical adoption.'); const scaffold = f.commit('test: scaffold');
  f.write(f.done, f.body(`Shipped at HEAD ${scaffold}`).replace('## Shipped\n\n', '---\n\n')); f.commit('test: record verified work');
  assert.equal(f.check().reference, scaffold);
}));
test('a later gate repair cannot legitimise the introduction', () => fixture((f) => {
  f.scaffold(); f.write('tools/verify.mjs', 'throw Error("broken gate");\n'); f.commit('test: broken scaffold');
  f.write('tools/verify.mjs', 'console.log("verified gate");\n'); f.commit('test: repair gate');
  assert.throws(() => f.check(), /predates the verified scaffold content/);
}));
