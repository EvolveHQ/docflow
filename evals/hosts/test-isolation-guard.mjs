// Deterministic test for the isolation guard in qualify.mjs (ADR 0062).
//
// The guard must notice any change to the real checkout that a host could
// cause: an edit, a new file, a commit, or a commit later reset away. This
// test exercises the guard against a throwaway git repository, never the
// operator's working tree.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkoutFingerprint, fingerprintRoots } from './qualify.mjs';

function git(root, args) {
  const r = spawnSync('git', ['-C', root, ...args], { encoding: 'utf8' });
  assert.equal(r.status, 0, `git ${args.join(' ')} failed: ${r.stderr}`);
  return r.stdout;
}

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'docflow-guard-test-'));
  git(root, ['init', '-q']);
  git(root, ['config', 'user.email', 'guard@example.invalid']);
  git(root, ['config', 'user.name', 'Guard Test']);
  git(root, ['config', 'commit.gpgsign', 'false']);
  writeFileSync(join(root, 'file.txt'), 'one\n');
  writeFileSync(join(root, '.gitignore'), 'ignored.txt\n');
  git(root, ['add', '-A']);
  git(root, ['commit', '-q', '-m', 'base']);
  return root;
}

test('the guard is stable when nothing changes', () => {
  const root = fixture();
  try {
    assert.equal(checkoutFingerprint(root), checkoutFingerprint(root));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('the guard notices an edit to a tracked file', () => {
  const root = fixture();
  try {
    const before = checkoutFingerprint(root);
    writeFileSync(join(root, 'file.txt'), 'two\n');
    assert.notEqual(checkoutFingerprint(root), before);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('the guard notices an untracked file', () => {
  const root = fixture();
  try {
    const before = checkoutFingerprint(root);
    writeFileSync(join(root, 'new.txt'), 'x\n');
    assert.notEqual(checkoutFingerprint(root), before);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('the guard notices a commit', () => {
  const root = fixture();
  try {
    const before = checkoutFingerprint(root);
    writeFileSync(join(root, 'file.txt'), 'two\n');
    git(root, ['add', '-A']);
    git(root, ['commit', '-q', '-m', 'change']);
    assert.notEqual(checkoutFingerprint(root), before);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('the guard notices a commit that was reset away', () => {
  const root = fixture();
  try {
    const base = git(root, ['rev-parse', 'HEAD']).trim();
    const before = checkoutFingerprint(root);
    writeFileSync(join(root, 'file.txt'), 'two\n');
    git(root, ['add', '-A']);
    git(root, ['commit', '-q', '-m', 'change']);
    git(root, ['reset', '--hard', base]);
    assert.equal(git(root, ['rev-parse', 'HEAD']).trim(), base);
    assert.notEqual(checkoutFingerprint(root), before);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('the guard ignores gitignored paths', () => {
  const root = fixture();
  try {
    const before = checkoutFingerprint(root);
    writeFileSync(join(root, 'ignored.txt'), 'not tracked\n');
    assert.equal(checkoutFingerprint(root), before);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('the multi-root guard is stable when nothing changes', () => {
  const a = fixture();
  const b = fixture();
  try {
    const roots = [{ label: 'a', root: a }, { label: 'b', root: b }];
    assert.equal(fingerprintRoots(roots), fingerprintRoots(roots));
  } finally {
    rmSync(a, { recursive: true, force: true });
    rmSync(b, { recursive: true, force: true });
  }
});

test('the multi-root guard notices a change in a second root', () => {
  const a = fixture();
  const b = fixture();
  try {
    const roots = [{ label: 'a', root: a }, { label: 'b', root: b }];
    const before = fingerprintRoots(roots);
    writeFileSync(join(b, 'file.txt'), 'changed\n');
    assert.notEqual(fingerprintRoots(roots), before);
  } finally {
    rmSync(a, { recursive: true, force: true });
    rmSync(b, { recursive: true, force: true });
  }
});

test('the multi-root guard ignores a gitignored change in a second root', () => {
  const a = fixture();
  const b = fixture();
  try {
    const roots = [{ label: 'a', root: a }, { label: 'b', root: b }];
    const before = fingerprintRoots(roots);
    writeFileSync(join(b, 'ignored.txt'), 'not tracked\n');
    assert.equal(fingerprintRoots(roots), before);
  } finally {
    rmSync(a, { recursive: true, force: true });
    rmSync(b, { recursive: true, force: true });
  }
});
