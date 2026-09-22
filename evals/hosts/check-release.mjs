// Independent target-state assertions for the explicitly mapped release cases.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import { assertAdrStatus, assertPlanShipped } from '../assertions.mjs';
import { releaseAssertions } from './release-assertions.mjs';

const [key, path, sourcePath] = process.argv.slice(2);
const repo = resolve(path);
const source = resolve(sourcePath || join(import.meta.dirname, '../..'));
const read = (p) => readFileSync(join(repo, p), 'utf8');
const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8' }).trim();
try {
  if (Object.hasOwn(releaseAssertions, key)) releaseAssertions[key](repo);
  else assert(['legacy-range-detect', 'ship-item'].includes(key), 'unknown release case');
  if (key === 'bootstrap-express') {
    assert(!existsSync(join(repo, '.docflow/_agent')), 'express created coordination');
    assert(!existsSync(join(repo, '.docflow/plan')), 'express created queue');
    assert(!git('status', '--porcelain'), 'express target is dirty');
    assert(git('rev-list', '--count', 'HEAD') !== '0', 'express has no target commit');
  }
  if (key === 'new-adr') {
    const adrs = readdirSync(join(repo, 'adr')).filter((f) => /^\d{4}-/.test(f) && !f.startsWith('0000-'));
    assert.equal(adrs.length, 2, 'new-adr must add exactly one decision after seed');
    assertAdrStatus(repo, 1, 'Implemented');
    assertAdrStatus(repo, 2, 'Proposed');
  }
  if (key === 'legacy-range-detect') {
    const files = [];
    const walk = (rel = '') => {
      for (const item of readdirSync(join(repo, rel), { withFileTypes: true })) {
        if (item.name === '.git') continue;
        const child = rel ? `${rel}/${item.name}` : item.name;
        if (item.isDirectory()) walk(child); else files.push(child);
      }
    };
    walk();
    const digest = createHash('sha256');
    for (const rel of files.sort()) digest.update(rel).update('\0').update(readFileSync(join(repo, rel))).update('\0');
    const before = JSON.parse(readFileSync(join(repo, '../before.json')));
    assert.equal(digest.digest('hex'), before.digest, 'dry run changed fixture bytes');
    assert.equal(git('rev-parse', 'HEAD'), before.head, 'dry run changed history');
    assert.equal(git('status', '--porcelain'), '', 'dry run changed tracked state');
  }
  if (key === 'legacy-range') {
    const original = join(source, 'evals/fixtures/legacy-range/plan/done');
    for (const file of readdirSync(original)) assert.deepEqual(readFileSync(join(repo, 'plan/done', file)), readFileSync(join(original, file)), `history changed: ${file}`);
  }
  if (key === 'ship-item') {
    const before = JSON.parse(readFileSync(join(repo, '../fixture.json')));
    assertPlanShipped(repo, 'alpha'); assertAdrStatus(repo, 1, 'Implemented');
    assertAdrStatus(repo, 2, 'Accepted'); assertAdrStatus(repo, 3, 'Accepted');
    const index = read('INDEX.md').split('\n');
    for (const item of before.items) {
      const file = `adr/${String(item.adr).padStart(4, '0')}-${item.slug}.md`;
      const status = item.slug === 'alpha' ? 'Implemented' : 'Accepted';
      assert(index.some((row) => row.includes(file) && row.includes(`| ${status} |`)), `INDEX status missing: ${item.slug} ${status}`);
      if (item.slug !== 'alpha') {
        const plan = `plan/todo/${item.key}.md`;
        assert.equal(read(plan).trim(), git('show', `${before.base}:${plan}`), `unselected plan changed: ${item.key}`);
        assert.equal(read(file).trim(), git('show', `${before.base}:${file}`), `unselected decision changed: ${item.slug}`);
      }
    }
    const done = readdirSync(join(repo, 'plan/done')).filter((f) => f.endsWith('alpha.md'));
    assert.equal(done.length, 1);
    const body = read(`plan/done/${done[0]}`);
    assert(!body.includes('## Status'));
    const footer = body.split('Shipped').at(-1);
    assert(footer.includes('claim/0007-alpha'));
    const sha = footer.match(/\b[0-9a-f]{7,40}\b/)?.[0];
    assert(sha, 'no verified-work footer'); git('merge-base', '--is-ancestor', sha, 'origin/main');
    assert.equal(git('ls-remote', 'origin', 'refs/heads/claim/0009-held').split(/\s/)[0], before.held);
    assert.equal(git('ls-remote', 'origin', 'refs/heads/claim/0007-alpha'), '', 'completed claim remains');
    assert(!existsSync(join(repo, 'outputs/beta.txt')), 'unselected beta was implemented');
    assert.equal(read('outputs/alpha.txt'), 'alpha\n');
    assert.equal(git('status', '--porcelain'), '');
    assert.equal(git('rev-parse', 'HEAD'), git('ls-remote', 'origin', 'refs/heads/main').split(/\s/)[0]);
    assert.equal(read('tools/verify.mjs').trim(), git('show', `${before.base}:tools/verify.mjs`));
    execFileSync('node', ['tools/verify.mjs'], { cwd: repo });
    if (before.signed) assert(git('log', '--all', '--format=%G?').split('\n').every((s) => s === 'G'));
  }
  console.log(JSON.stringify({ case: key, passed: true, target: repo }));
} catch (error) {
  console.log(JSON.stringify({ case: key, passed: false, target: repo, error: error.message }));
  process.exitCode = 1;
}
