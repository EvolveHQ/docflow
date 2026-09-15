import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { inspectHistoricalFile } from '../plugins/docflow/workspace/validate.mjs';

function scratch(fn) {
  const temp = mkdtempSync(join(tmpdir(), 'docflow-history-test-'));
  try { return fn(temp); } finally {
    const actual = realpathSync(temp);
    assert.equal(dirname(actual).toLowerCase(), realpathSync(tmpdir()).toLowerCase());
    assert.ok(basename(actual).startsWith('docflow-history-test-'));
    rmSync(actual, { recursive: true, force: true });
  }
}
const cleanEnv = () => ({ ...Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^GIT_/i.test(k))),
  GIT_AUTHOR_NAME: 'Synthetic fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
  GIT_COMMITTER_NAME: 'Synthetic fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid' });
function git(root, args, input, checked = true) {
  const result = spawnSync('git', ['-C', root, ...args], { env: cleanEnv(), encoding: 'utf8', input });
  if (checked) assert.equal(result.status, 0, result.stderr);
  return checked ? result.stdout.trim() : result;
}
function seed(root) {
  mkdirSync(root);
  git(root, ['init', '--quiet']);
  const blob = git(root, ['hash-object', '-w', '--stdin'], 'Synthetic historical file\n');
  const tree = git(root, ['mktree'], '100644 blob ' + blob + '\twork.md\n');
  const commit = git(root, ['-c', 'commit.gpgsign=false', 'commit-tree', tree], 'Synthetic fixture object\n');
  git(root, ['update-ref', 'refs/heads/main', commit]);
  git(root, ['config', 'uploadpack.allowFilter', 'true']);
  return { blob, tree, commit };
}

test('historical entry requires exact regular path, revision and object type', () => scratch(temp => {
  const root = join(temp, 'repo'), objects = seed(root);
  assert.equal(inspectHistoricalFile(root, { revision: objects.commit, path: 'work.md' }), true);
  for (const ref of [
    { revision: objects.blob, path: 'work.md' },
    { revision: objects.commit, path: 'Work.md' },
    { revision: objects.commit, path: '../work.md' },
    { revision: 'HEAD', path: 'work.md' },
    { revision: objects.commit, path: 'work.md\nother' },
  ]) assert.equal(inspectHistoricalFile(root, ref), false);
  const symlink = git(root, ['mktree'], '120000 blob ' + objects.blob + '\twork.md\n');
  assert.equal(inspectHistoricalFile(root, { revision: symlink, path: 'work.md' }), false);
}));

test('inherited repository, object, config and replacement redirects cannot change history', () => scratch(temp => {
  const root = join(temp, 'repo'), objects = seed(root);
  const other = join(temp, 'other'); seed(other);
  const replacementBlob = git(root, ['hash-object', '-w', '--stdin'], 'Replacement\n');
  const replacement = git(root, ['mktree'], '100644 blob ' + replacementBlob + '\tother.md\n');
  git(root, ['replace', objects.tree, replacement]);
  const saved = { ...process.env };
  try {
    Object.assign(process.env, {
      GIT_DIR: join(other, '.git'), GIT_WORK_TREE: other,
      GIT_OBJECT_DIRECTORY: join(other, '.git/objects'), GIT_COMMON_DIR: join(other, '.git'),
      GIT_CONFIG_COUNT: '1', GIT_CONFIG_KEY_0: 'core.worktree', GIT_CONFIG_VALUE_0: other,
      GIT_CONFIG_PARAMETERS: "'core.worktree=" + other + "'",
      GIT_CONFIG_GLOBAL: join(temp, 'missing-config'),
      GIT_ALTERNATE_OBJECT_DIRECTORIES: join(other, '.git/objects'),
    });
    assert.equal(inspectHistoricalFile(root, { revision: objects.tree, path: 'work.md' }), true);
  } finally {
    for (const key of Object.keys(process.env)) if (!(key in saved)) delete process.env[key];
    Object.assign(process.env, saved);
  }
}));

for (const filter of ['tree:0', 'blob:none']) {
  test('actual promisor clone never retrieves missing ' + filter + ' objects', () => scratch(temp => {
    const source = join(temp, 'source'), objects = seed(source);
    const clone = join(temp, 'clone');
    git(temp, ['clone', '--quiet', '--no-checkout', '--branch', 'main', '--filter=' + filter,
      pathToFileURL(source).href, clone]);
    const absent = filter === 'tree:0' ? objects.tree : objects.blob;
    assert.equal(git(clone, ['config', '--get', 'remote.origin.promisor']), 'true');
    assert.notEqual(git(clone, ['--no-lazy-fetch', 'cat-file', '-e', absent], undefined, false).status, 0);
    assert.equal(inspectHistoricalFile(clone, { revision: objects.commit, path: 'work.md' }), false);
    assert.notEqual(git(clone, ['--no-lazy-fetch', 'cat-file', '-e', absent], undefined, false).status, 0);
  }));
}

test('case-distinct directories do not share a canonical repository root', () => scratch(temp => {
  const root = join(temp, 'CaseRepo'), objects = seed(root);
  mkdirSync(join(root, 'sub'));
  assert.equal(inspectHistoricalFile(join(root, 'sub'), { revision: objects.commit, path: 'work.md' }), false);
  if (process.platform !== 'win32') {
    const other = join(temp, 'caserepo'); seed(other);
    git(root, ['config', 'core.worktree', other]);
    assert.equal(inspectHistoricalFile(root, { revision: objects.commit, path: 'work.md' }), false);
  }
}));
