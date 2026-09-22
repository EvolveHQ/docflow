// Hostless regression fixtures: every write stays in disposable scratch.
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { GUARD_ROOTS, fingerprintRoots } from './qualify.mjs';

export function scratchFixture(t) {
  const base = '/tmp/hq-qa';
  mkdirSync(base, { recursive: true });
  const scratch = mkdtempSync(join(base, 'docflow-r2-'));
  const home = join(scratch, 'home');
  mkdirSync(home);
  const before = fingerprintRoots(GUARD_ROOTS);
  t.after(() => {
    assert.equal(fingerprintRoots(GUARD_ROOTS), before, 'ISOLATION BREACH: guarded checkout changed');
    assert(resolve(scratch).startsWith(base + sep), 'isolation: scratch escaped /tmp/hq-qa');
    rmSync(scratch, { recursive: true, force: true });
  });
  return { scratch, home, env: { ...process.env, HOME: home, XDG_CONFIG_HOME: join(home, '.config'),
    GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null' } };
}
