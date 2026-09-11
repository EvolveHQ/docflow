// Real git transport checks for the documented acquisition protocol (ADR 0038).
// A successful push alone is insufficient: only porcelain '*' acquires a ref.
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync, spawn } from 'node:child_process';

export async function assertClaimAcquisition() {
  const scratch = mkdtempSync(join(tmpdir(), 'docflow-claims-'));
  const remote = join(scratch, 'remote.git');
  const repo = join(scratch, 'executor');
  const git = (args, cwd = scratch) => spawnSync('git', args, { cwd, encoding: 'utf8' });
  const ok = (args, cwd) => {
    const result = git(args, cwd);
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  const ref = 'refs/heads/claim/0001-example';
  const args = tip => ['push', '--porcelain', `--force-with-lease=${ref}:`, 'origin', `${tip}:${ref}`];
  const acquired = result => result.status === 0 && result.stdout.split('\n').some(line => {
    const [flag, mapping] = line.split('\t');
    return flag === '*' && mapping?.endsWith(`:${ref}`);
  });
  try {
    ok(['init', '--bare', remote]);
    ok(['init', '-b', 'main', repo]);
    ok(['config', 'user.name', 'docflow eval'], repo);
    ok(['config', 'user.email', 'eval@example.invalid'], repo);
    ok(['config', 'commit.gpgsign', 'false'], repo);
    ok(['config', 'core.hooksPath', join(scratch, 'no-hooks')], repo);
    writeFileSync(join(repo, 'item.md'), 'Claimed by: executor A\n');
    ok(['add', '.'], repo);
    ok(['commit', '-m', 'chore: claim fixture item', '-m', 'Reserved identifiers: none; owned artefacts: item.md'], repo);
    const first = ok(['rev-parse', 'HEAD'], repo);
    ok(['remote', 'add', 'origin', remote], repo);
    assert.equal(acquired(git(args('HEAD'), repo)), true, 'absent ref must be acquired');

    const sameTip = git(args('HEAD'), repo);
    assert.equal(sameTip.status, 0, 'same-tip push demonstrates why exit zero is insufficient');
    assert.equal(acquired(sameTip), false, 'up-to-date is not acquisition');

    writeFileSync(join(repo, 'item.md'), 'Claimed by: executor B\n');
    ok(['commit', '-am', 'chore: competing claimant'], repo);
    assert.equal(acquired(git(args('HEAD'), repo)), false, 'existing ref cannot be acquired by its descendant');
    assert.equal(ok(['rev-parse', ref], remote), first, 'failed acquisition must leave the owner unchanged');
    const ordinary = git(['push', '--porcelain', 'origin', `HEAD:${ref}`], repo);
    assert.equal(ordinary.status, 0, 'ordinary fast-forward push is not exclusive');
    assert.equal(acquired(ordinary), false);

    ok(['push', 'origin', '--delete', ref], repo);
    const race = tip => new Promise((resolve, reject) => {
      const child = spawn('git', args(tip), { cwd: repo });
      let stdout = ''; let stderr = '';
      child.stdout.on('data', chunk => stdout += chunk);
      child.stderr.on('data', chunk => stderr += chunk);
      child.on('error', reject);
      child.on('close', status => resolve({ status, stdout, stderr }));
    });
    const racers = await Promise.all([race(first), race('HEAD')]);
    assert.equal(racers.filter(acquired).length, 1, 'exactly one concurrent claimant wins');
    const owner = ok(['rev-parse', ref], remote);
    assert.ok([first, ok(['rev-parse', 'HEAD'], repo)].includes(owner));
    assert.equal(acquired({ status: null, stdout: '' }), false, 'unknown transport outcome grants no ownership');
  } finally {
    // mkdtemp owns this exact directory; no user checkout or computed parent is removed.
    rmSync(scratch, { recursive: true, force: true });
  }
}
